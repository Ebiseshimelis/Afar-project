import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { publications } from "@/lib/mock-data";
import { Plus, Search, Pencil, Trash2, FileText, Download } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/publications")({
  head: () => ({ meta: [{ title: "Publication Management" }, { name: "robots", content: "noindex" }] }),
  component: PublicationsAdmin,
});

function PublicationsAdmin() {
  const [q, setQ] = useState("");
  const filtered = publications.filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <AdminLayout>
      <AdminPageHeader
        title="Publication Management"
        description="Upload reports, policies, and manuals."
        action={<button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" /> New publication</button>}
      />
      <div className="rounded-xl border bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b p-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search publications…" className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Year</th>
                <th className="px-5 py-3">Size</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-muted-foreground"><FileText className="h-4 w-4" /></div>
                      <span className="font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-foreground">{p.type}</span></td>
                  <td className="px-5 py-3 text-muted-foreground">{p.year}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.size}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button aria-label="Download" className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"><Download className="h-4 w-4" /></button>
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
