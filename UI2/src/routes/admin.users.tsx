import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import {
  deleteUser,
  listUsers,
  setUserRole,
  setUserStatus,
  type AdminUser,
} from "@/services/adminUserService";
import { Loader2, Trash2, ShieldCheck, UserCheck, UserX } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "User Management" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UsersAdmin,
});

function UsersAdmin() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setLoading(true);
      setUsers(await listUsers());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function changeRole(user: AdminUser) {
    const role = user.role === "admin" ? "super_admin" : "admin";

    if (!window.confirm(`Change ${user.name}'s role to ${role === "admin" ? "Admin" : "Super Admin"}?`)) {
      return;
    }

    try {
      await setUserRole(user.id, role);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to change role.");
    }
  }

  async function toggleStatus(user: AdminUser) {
    try {
      await setUserStatus(user.id, !user.is_active);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to change account status.");
    }
  }

  async function removeUser(user: AdminUser) {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteUser(user.id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete user.");
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="User Management"
        description="Manage staff accounts, roles, and account status."
      />

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Permissions</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-5 py-3 font-medium">{user.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {user.role === "super_admin" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {user.is_active ? "Active" : "Disabled"}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {user.role === "super_admin"
                        ? "All"
                        : user.permissions.length}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => void changeRole(user)}
                          className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                          title="Change role"
                        >
                          <ShieldCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => void toggleStatus(user)}
                          className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                          title={user.is_active ? "Disable" : "Enable"}
                        >
                          {user.is_active ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => void removeUser(user)}
                          className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10"
                          title="Delete"
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
        )}
      </div>
    </AdminLayout>
  );
}
