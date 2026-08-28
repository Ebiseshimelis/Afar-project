import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import {
  createRole,
  deleteRole,
  listRoles,
  updateRole,
  type AdminRole,
} from "@/services/adminRoleService";
import {
  ASSIGNABLE_MODULES,
  PERMISSION_ACTIONS,
} from "@/lib/permissions";
import {
  Loader2,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

export const Route = createFileRoute("/admin/roles")({
  head: () => ({
    meta: [
      { title: "Role Management" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RolesAdmin,
});

type RoleForm = {
  name: string;
  description: string;
  permissions: string[];
};

const EMPTY_FORM: RoleForm = {
  name: "",
  description: "",
  permissions: [],
};

function RolesAdmin() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [form, setForm] = useState<RoleForm>(EMPTY_FORM);

  const groupedModules = useMemo(() => {
    return ASSIGNABLE_MODULES.reduce<Record<string, typeof ASSIGNABLE_MODULES>>(
      (groups, module) => {
        if (!groups[module.group]) {
          groups[module.group] = [];
        }

        groups[module.group].push(module);
        return groups;
      },
      {},
    );
  }, []);

  async function loadRoles() {
    try {
      setError("");
      setLoading(true);
      setRoles(await listRoles());
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to load roles.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRoles();
  }, []);

  function openCreateModal() {
    setEditingRole(null);
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(role: AdminRole) {
    if (!role.editable || role.id === "super_admin") {
      return;
    }

    setEditingRole(role);
    setForm({
      name: role.name,
      description: role.description ?? "",
      permissions: [...role.permissions],
    });
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingRole(null);
    setForm(EMPTY_FORM);
  }

  function togglePermission(permission: string) {
    setForm((current) => {
      const exists = current.permissions.includes(permission);

      return {
        ...current,
        permissions: exists
          ? current.permissions.filter((item) => item !== permission)
          : [...current.permissions, permission],
      };
    });
  }

  function toggleModule(moduleKey: string) {
    const modulePermissions = PERMISSION_ACTIONS.map(
      (action) => `${moduleKey}.${action}`,
    );

    setForm((current) => {
      const allSelected = modulePermissions.every((permission) =>
        current.permissions.includes(permission),
      );

      return {
        ...current,
        permissions: allSelected
          ? current.permissions.filter(
              (permission) => !modulePermissions.includes(permission),
            )
          : Array.from(
              new Set([...current.permissions, ...modulePermissions]),
            ),
      };
    });
  }

  async function saveRole(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      setError("Role name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name,
        description: form.description.trim(),
        permissions: form.permissions,
      };

      if (editingRole) {
        await updateRole(editingRole.id, payload);
      } else {
        await createRole(payload);
      }

      setModalOpen(false);
      setEditingRole(null);
      setForm(EMPTY_FORM);

      await loadRoles();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : editingRole
            ? "Unable to update role."
            : "Unable to create role.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(role: AdminRole) {
    if (!role.deletable || role.id === "super_admin") {
      return;
    }

    const message =
      role.users > 0
        ? `Delete "${role.name}"? ${role.users} staff account(s) currently use this role. They will lose this role and its permissions. This cannot be undone.`
        : `Delete "${role.name}"? This cannot be undone.`;

    if (!window.confirm(message)) {
      return;
    }

    try {
      setDeletingId(role.id);
      setError("");

      await deleteRole(role.id);
      await loadRoles();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to delete role.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Role Management"
        description="Create roles and control exactly which administrative permissions each role receives."
      />

      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create Role
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading roles...
        </div>
      ) : roles.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
          No roles found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role) => {
            const isSuperAdmin = role.id === "super_admin";

            return (
              <div
                key={role.id}
                className="rounded-xl border bg-card p-5 shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
                      <ShieldCheck className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="font-semibold">{role.name}</div>

                      <div className="text-xs text-muted-foreground">
                        {role.users} user{role.users === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>

                  {!isSuperAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(role)}
                        disabled={!role.editable}
                        className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                        title="Edit role"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(role)}
                        disabled={
                          !role.deletable || deletingId === role.id
                        }
                        className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete role"
                      >
                        {deletingId === role.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-3 text-sm text-muted-foreground">
                  {role.description || "No description provided."}
                </p>

                <div className="mt-4 border-t pt-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Access
                  </div>

                  <div className="mt-2 text-sm">
                    {isSuperAdmin ? (
                      <span className="font-medium">
                        Unrestricted
                      </span>
                    ) : (
                      <span>
                        {role.permissions.length} permission
                        {role.permissions.length === 1 ? "" : "s"}
                        {" assigned"}
                      </span>
                    )}
                  </div>

                  {!isSuperAdmin && role.permissions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {role.permissions.slice(0, 8).map((permission) => (
                        <span
                          key={permission}
                          className="rounded-full bg-secondary px-2 py-1 text-xs"
                        >
                          {permission}
                        </span>
                      ))}

                      {role.permissions.length > 8 && (
                        <span className="rounded-full bg-secondary px-2 py-1 text-xs">
                          +{role.permissions.length - 8} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="font-semibold">
                  {editingRole ? "Edit Role" : "Create Role"}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Select the permissions this role should have.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary disabled:opacity-50"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={saveRole}>
              <div className="max-h-[calc(90vh-150px)] overflow-y-auto p-5">
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Role Name
                    </label>

                    <input
                      value={form.name}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="e.g. Content Manager"
                      className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Description
                    </label>

                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      placeholder="Describe what this role is responsible for."
                      rows={3}
                      className="mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <div className="mb-3">
                      <div className="text-sm font-medium">
                        Permissions
                      </div>

                      <div className="mt-1 text-xs text-muted-foreground">
                        Each module supports View, Create, Update, and Delete.
                      </div>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(groupedModules).map(
                        ([group, modules]) => (
                          <div
                            key={group}
                            className="rounded-lg border p-4"
                          >
                            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              {group}
                            </div>

                            <div className="space-y-3">
                              {modules.map((module) => {
                                const modulePermissions =
                                  PERMISSION_ACTIONS.map(
                                    (action) =>
                                      `${module.key}.${action}`,
                                  );

                                const allSelected =
                                  modulePermissions.every(
                                    (permission) =>
                                      form.permissions.includes(
                                        permission,
                                      ),
                                  );

                                return (
                                  <div
                                    key={module.key}
                                    className="rounded-lg bg-secondary/40 p-3"
                                  >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleModule(module.key)
                                        }
                                        className="text-sm font-medium hover:underline"
                                        disabled={saving}
                                      >
                                        {module.label}
                                      </button>

                                      <div className="flex flex-wrap gap-4">
                                        {PERMISSION_ACTIONS.map(
                                          (action) => {
                                            const permission = `${module.key}.${action}`;

                                            return (
                                              <label
                                                key={permission}
                                                className="inline-flex cursor-pointer items-center gap-1.5 text-xs"
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={form.permissions.includes(
                                                    permission,
                                                  )}
                                                  onChange={() =>
                                                    togglePermission(
                                                      permission,
                                                    )
                                                  }
                                                  disabled={saving}
                                                />
                                                {action
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  action.slice(1)}
                                              </label>
                                            );
                                          },
                                        )}
                                      </div>
                                    </div>

                                    {allSelected && (
                                      <div className="mt-2 text-xs text-primary">
                                        All permissions selected
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t px-5 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="h-9 rounded-lg border px-4 text-sm font-medium hover:bg-secondary disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {saving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {editingRole ? "Save Changes" : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
