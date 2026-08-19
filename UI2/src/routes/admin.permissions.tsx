import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import {
  listPermissions,
  type BackendPermission,
} from "@/services/permissionService";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/permissions")({
  head: () => ({
    meta: [
      { title: "Permissions" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PermissionsAdmin,
});

function PermissionsAdmin() {
  const [permissions, setPermissions] = useState<BackendPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setPermissions(await listPermissions());
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Unable to load permissions."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const groups = Array.from(
    new Set(permissions.map((permission) => permission.module)),
  );

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Permissions"
        description="Authoritative permissions available to staff accounts."
      />

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading permissions...
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Permission</th>
                  <th className="px-5 py-3">Module</th>
                  <th className="px-5 py-3">Action</th>
                  <th className="px-5 py-3">Scope</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) =>
                  permissions
                    .filter((permission) => permission.module === group)
                    .map((permission) => (
                      <tr key={permission.key} className="border-t">
                        <td className="px-5 py-3 font-mono text-xs">
                          {permission.key}
                        </td>
                        <td className="px-5 py-3 capitalize">
                          {permission.module.replaceAll("_", " ")}
                        </td>
                        <td className="px-5 py-3 capitalize">
                          {permission.action}
                        </td>
                        <td className="px-5 py-3">
                          {permission.super_admin_only
                            ? "Super Admin only"
                            : "Assignable to Admin"}
                        </td>
                      </tr>
                    )),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
