import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AdminLayout,
  AdminPageHeader,
} from "@/components/admin/AdminLayout";
import {
  deleteUser,
  listUsers,
  setUserStatus,
  type AdminUser,
} from "@/services/adminUserService";
import { useAuth } from "@/lib/auth";
import { listRoles, assignAdminRole, type AdminRole } from "@/services/adminRoleService";
import {
  Loader2,
  ShieldCheck,
  UserCheck,
  UserX,
  Trash2,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UsersRolesAdmin,
});

function UsersRolesAdmin() {
  const { isSuperAdmin } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setError("");
      setLoading(true);
      const [loadedUsers, loadedRoles] = await Promise.all([
        listUsers(),
        listRoles(),
      ]);

      setUsers(loadedUsers);
      setRoles(loadedRoles);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to load users.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function changeRole(user: AdminUser, roleId: string) {
    if (!isSuperAdmin || user.role === "super_admin") return;

    try {
      setError("");

      await assignAdminRole(user.id, roleId);

      await loadUsers();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to assign role.",
      );
    }
  }
  async function toggleStatus(user: AdminUser) {
    if (!isSuperAdmin) return;

    try {
      await setUserStatus(user.id, !user.is_active);
      await loadUsers();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to change account status.",
      );
    }
  }

  async function removeUser(user: AdminUser) {
    if (!isSuperAdmin) return;

    if (
      !window.confirm(
        `Delete ${user.name}? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteUser(user.id);
      await loadUsers();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to delete user.",
      );
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Users & Roles"
        description="View staff accounts, their roles, account status, and assigned permissions."
      />

      {!isSuperAdmin && (
        <div className="mb-5 rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          You can view staff accounts, but only the Super Admin can change
          roles, account status, or permissions.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading staff accounts...
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>

            <h3 className="mt-4 font-semibold">
              No staff accounts
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              There are currently no staff accounts to display.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Staff Member</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const isSuperAdminUser =
                    user.role === "super_admin";

                  return (
                    <tr
                      key={user.id}
                      className="border-t hover:bg-secondary/30"
                    >
                      <td className="px-5 py-4">
                        <div className="font-medium">
                          {user.name}
                        </div>

                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </td>

                      <td className="px-5 py-4">
  {isSuperAdminUser ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
      <ShieldCheck className="h-3.5 w-3.5" />
      Super Admin
    </span>
  ) : isSuperAdmin ? (
    <select
      value={user.role_id ?? ""}
      onChange={(event) =>
        void changeRole(user, event.target.value)
      }
      className="h-9 min-w-[220px] rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary"
    >
      <option value="">Unassigned</option>

      {roles
        .filter((role) => role.id !== "super_admin")
        .map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
    </select>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
      <ShieldCheck className="h-3.5 w-3.5" />
      {user.role_name ?? "Unassigned"}
    </span>
  )}
</td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            user.is_active
                              ? "inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                              : "inline-flex rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive"
                          }
                        >
                          {user.is_active
                            ? "Active"
                            : "Disabled"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1">

                          {isSuperAdmin && !isSuperAdminUser && (
                            <>
                              <button
                                onClick={() =>
                                  void toggleStatus(user)
                                }
                                className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                                title={
                                  user.is_active
                                    ? "Disable account"
                                    : "Enable account"
                                }
                              >
                                {user.is_active ? (
                                  <UserX className="h-4 w-4" />
                                ) : (
                                  <UserCheck className="h-4 w-4" />
                                )}
                              </button>

                              <button
                                onClick={() =>
                                  void removeUser(user)
                                }
                                className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10"
                                title="Delete account"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}









