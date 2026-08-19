import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { listRoles, type AdminRole } from "@/services/adminRoleService";
import { Loader2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/roles")({
  head: () => ({
    meta: [
      { title: "Role Management" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RolesAdmin,
});

function RolesAdmin() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setRoles(await listRoles());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unable to load roles.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Role Management"
        description="View the supported staff roles and their access model."
      />

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
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role) => (
            <div key={role.id} className="rounded-xl border bg-card p-5 shadow-soft">
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

              <p className="mt-3 text-sm text-muted-foreground">
                {role.description}
              </p>

              <div className="mt-4 border-t pt-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Access
                </div>
                <div className="mt-2 text-sm">
                  {role.id === "super_admin"
                    ? "Unrestricted"
                    : "Controlled by individual permissions"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
