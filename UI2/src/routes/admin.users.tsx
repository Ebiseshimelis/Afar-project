import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { adminUsers } from "@/lib/mock-data";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "User Management" }, { name: "robots", content: "noindex" }] }),
  component: UsersAdmin,
});

function UsersAdmin() {
  return (
    <AdminLayout>
      <AdminPageHeader
        title="User Management"
        description="Manage admin users and access."
        action={<button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" /> Add user</button>}
      />
      <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Last login</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">{u.name.split(" ").map(p => p[0]).join("").slice(0,2)}</div>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={"rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase " + (u.role === "Super Admin" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground")}>{u.role}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={"inline-flex items-center gap-1.5 text-xs " + (u.status === "Active" ? "text-success" : "text-muted-foreground")}>
                    <span className={"h-1.5 w-1.5 rounded-full " + (u.status === "Active" ? "bg-success" : "bg-muted-foreground")} />
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{new Date(u.lastLogin).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button aria-label="Edit" className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
                    <button aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
