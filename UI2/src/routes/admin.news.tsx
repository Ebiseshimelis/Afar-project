import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { news } from "@/lib/mock-data";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/news")({
  head: () => ({ meta: [{ title: "News Management" }, { name: "robots", content: "noindex" }] }),
  component: NewsAdmin,
});

function NewsAdmin() {
  const [q, setQ] = useState("");
  const filtered = news.filter((n) => !q || n.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <AdminLayout>
      <AdminPageHeader
        title="News Management"
        description="Create, edit, and publish news articles."
        action={<button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" /> New article</button>}
      />
      <div className="rounded-xl border bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b p-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Author</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => (
                <tr key={n.id} className="border-t">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={n.image} alt="" className="h-9 w-9 rounded object-cover" />
                      <span className="line-clamp-1 font-medium">{n.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-foreground">{n.category}</span></td>
                  <td className="px-5 py-3 text-muted-foreground">{n.author}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(n.date).toLocaleDateString()}</td>
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
