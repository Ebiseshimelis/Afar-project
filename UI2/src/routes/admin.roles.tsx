import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { roles } from "@/lib/mock-data";
import { Plus, ShieldCheck, Users, Pencil } from "lucide-react";

export const Route = createFileRoute("/admin/roles")({
  head: () => ({ meta: [{ title: "Role Management" }, { name: "robots", content: "noindex" }] }),
  component: RolesAdmin,
});

function RolesAdmin() {
  return (
    <AdminLayout>
      <AdminPageHeader
        title="Role Management"
        description="Define roles and permissions."
        action={<button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" /> New role</button>}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((r) => (
          <div key={r.id} className="rounded-xl border bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg gradient-primary text-primary-foreground"><ShieldCheck className="h-5 w-5" /></div>
                <div>
                  <div className="font-display font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.users} user{r.users === 1 ? "" : "s"}</div>
                </div>
              </div>
              <button aria-label="Edit" className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{r.description}</p>
            <div className="mt-4 border-t pt-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Permissions</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {r.permissions.map((p) => (
                  <span key={p} className="rounded-md bg-secondary px-2 py-1 text-xs font-medium">{p}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
