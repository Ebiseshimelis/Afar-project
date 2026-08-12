import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { tenders } from "@/lib/mock-data";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/tenders")({
  head: () => ({ meta: [{ title: "Tender Management" }, { name: "robots", content: "noindex" }] }),
  component: TendersAdmin,
});

function TendersAdmin() {
  const [q, setQ] = useState("");
  const filtered = tenders.filter((t) => !q || t.title.toLowerCase().includes(q.toLowerCase()) || t.reference.toLowerCase().includes(q.toLowerCase()));
  return (
    <AdminLayout>
      <AdminPageHeader
        title="Tender Management"
        description="Publish and track procurement opportunities."
        action={<button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" /> New tender</button>}
      />
      <div className="rounded-xl border bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b p-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tenders…" className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Deadline</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{t.reference}</td>
                  <td className="px-5 py-3 font-medium">{t.title}</td>
                  <td className="px-5 py-3 text-muted-foreground">{t.category}</td>
                  <td className="px-5 py-3">
                    <span className={"rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase " + (t.status === "Open" ? "bg-success/15 text-success" : t.status === "Awarded" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground")}>{t.status}</span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(t.deadline).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button aria-label="View" className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"><Eye className="h-4 w-4" /></button>
                      <button aria-label="Edit" className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
                      <button aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
