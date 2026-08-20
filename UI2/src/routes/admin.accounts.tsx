import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  KeyRound,
  X,
  Check,
} from "lucide-react";
import {
  AdminLayout,
  AdminPageHeader,
} from "@/components/admin/AdminLayout";
import {
  ASSIGNABLE_MODULES,
  PERMISSION_ACTIONS,
} from "@/lib/permissions";
import * as svc from "@/services/adminAccountService";
import type {
  AdminAccount,
  AdminAccountInput,
} from "@/services/adminAccountService";

export const Route = createFileRoute("/admin/accounts")({
  head: () => ({
    meta: [
      { title: "Admin Accounts" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminAccountsPage,
});

const emptyForm: AdminAccountInput = {
  name: "",
  email: "",
  password: "",
  is_active: true,
  permissions: [],
};

function AdminAccountsPage() {
  const [list, setList] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminAccount | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);

    try {
      setList(await svc.listAdmins());
    } catch (e: any) {
      toast.error(e?.message ?? "Could not load admin accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const toggleActive = async (a: AdminAccount) => {
    try {
      await svc.setAdminActive(a.id, !a.is_active);

      toast.success(
        a.is_active ? "Account disabled" : "Account enabled",
      );

      void load();
    } catch (e: any) {
      toast.error(e?.message ?? "Update failed.");
    }
  };

  const remove = async (a: AdminAccount) => {
    if (!window.confirm(`Delete ${a.name}? This cannot be undone.`)) {
      return;
    }

    try {
      await svc.deleteAdmin(a.id);
      toast.success("Account deleted");
      void load();
    } catch (e: any) {
      toast.error(e?.message ?? "Delete failed.");
    }
  };

  return (
    <AdminLayout permission="admin_accounts.view">
      <AdminPageHeader
        title="Admin Accounts"
        description="Super Admin only — create Admin accounts and grant module permissions."
        action={
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New admin
          </button>
        }
      />

      <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Permissions</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-muted-foreground"
                  >
                    Loading accounts...
                  </td>
                </tr>
              )}

              {!loading && list.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-muted-foreground"
                  >
                    No admin accounts yet.
                  </td>
                </tr>
              )}

              {list.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {a.name.charAt(0).toUpperCase()}
                      </span>

                      <span className="font-medium">
                        {a.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-3 text-muted-foreground">
                    {a.email}
                  </td>

                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(a)}
                      className={
                        "rounded-full px-2.5 py-1 text-xs font-semibold " +
                        (a.is_active
                          ? "bg-success/15 text-success"
                          : "bg-destructive/10 text-destructive")
                      }
                    >
                      {a.is_active ? "Active" : "Disabled"}
                    </button>
                  </td>

                  <td className="px-5 py-3">
                    <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium">
                      {a.permissions.length} granted
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => setEditing(a)}
                        aria-label="Edit"
                        className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => remove(a)}
                        aria-label="Delete"
                        className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Roles are fixed to Super Admin and Admin. The backend re-checks every
        permission on each request.
      </p>

      {(creating || editing) && (
        <AccountDialog
          account={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setCreating(false);
            setEditing(null);
            void load();
          }}
        />
      )}
    </AdminLayout>
  );
}

function AccountDialog({
  account,
  onClose,
  onSaved,
}: {
  account: AdminAccount | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<AdminAccountInput>(
    account
      ? {
          name: account.name,
          email: account.email,
          password: "",
          is_active: account.is_active,
          permissions: account.permissions,
        }
      : emptyForm,
  );

  const [saving, setSaving] = useState(false);

  const groups = useMemo(
    () =>
      Array.from(
        new Set(ASSIGNABLE_MODULES.map((m) => m.group)),
      ),
    [],
  );

  const toggle = (key: string) =>
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(key)
        ? f.permissions.filter((p) => p !== key)
        : [...f.permissions, key],
    }));

  const toggleModule = (mod: string) => {
    const keys = PERMISSION_ACTIONS.map(
      (a) => `${mod}.${a}`,
    );

    const all = keys.every((k) =>
      form.permissions.includes(k),
    );

    setForm((f) => ({
      ...f,
      permissions: all
        ? f.permissions.filter(
            (p) => !keys.includes(p),
          )
        : Array.from(
            new Set([
              ...f.permissions,
              ...keys,
            ]),
          ),
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (account) {
        const payload: Partial<AdminAccountInput> = {
          name: form.name,
          email: form.email,
          is_active: form.is_active,
          permissions: form.permissions,
        };

        if (form.password) {
          payload.password = form.password;
        }

        await svc.updateAdmin(account.id, payload);

        toast.success("Account updated");
      } else {
        await svc.createAdmin(form);
        toast.success("Admin account created");
      }

      onSaved();
    } catch (err: any) {
      toast.error(err?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
      <form
        onSubmit={submit}
        className="w-full max-w-2xl rounded-xl border bg-card shadow-elegant"
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold">
              {account ? "Edit admin" : "New admin"}
            </h2>

            <p className="text-xs text-muted-foreground">
              Role is always Admin.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium">
                Full name
              </span>

              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium">
                Email
              </span>

              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium">
                Password{" "}
                {account && (
                  <span className="text-muted-foreground">
                    (leave blank to keep)
                  </span>
                )}
              </span>

              <input
                required={!account}
                type="password"
                value={form.password ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
              />
            </label>

            <label className="mt-6 inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_active: e.target.checked,
                  })
                }
                className="rounded border"
              />

              Account active
            </label>
          </div>

          <div className="rounded-lg border">
            <div className="flex items-center gap-2 border-b bg-secondary/50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <KeyRound className="h-3.5 w-3.5" />
              Module permissions
            </div>

            <div className="max-h-72 overflow-y-auto p-4">
              {groups.map((g) => (
                <div
                  key={g}
                  className="mb-4 last:mb-0"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {g}
                  </div>

                  <div className="mt-2 space-y-2">
                    {ASSIGNABLE_MODULES.filter(
                      (m) => m.group === g,
                    ).map((m) => {
                      const keys =
                        PERMISSION_ACTIONS.map(
                          (a) => `${m.key}.${a}`,
                        );

                      const all = keys.every((k) =>
                        form.permissions.includes(k),
                      );

                      return (
                        <div
                          key={m.key}
                          className="rounded-lg border px-3 py-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">
                              {m.label}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                toggleModule(m.key)
                              }
                              className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-[11px] font-medium hover:bg-secondary/70"
                            >
                              <Check className="h-3 w-3" />

                              {all
                                ? "Clear all"
                                : "Select all"}
                            </button>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-3">
                            {PERMISSION_ACTIONS.map(
                              (a) => {
                                const key = `${m.key}.${a}`;

                                return (
                                  <label
                                    key={key}
                                    className="inline-flex items-center gap-1.5 text-xs"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={form.permissions.includes(
                                        key,
                                      )}
                                      onChange={() =>
                                        toggle(key)
                                      }
                                      className="rounded border"
                                    />

                                    <span className="capitalize">
                                      {a}
                                    </span>
                                  </label>
                                );
                              },
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-secondary"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : account
                ? "Save changes"
                : "Create admin"}
          </button>
        </div>
      </form>
    </div>
  );
}

