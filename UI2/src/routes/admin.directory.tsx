import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { directory } from "@/lib/mock-data";
import { Plus, Search, Pencil, Trash2, Mail, Phone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/directory")({
  head: () => ({ meta: [{ title: "Directory Management" }, { name: "robots", content: "noindex" }] }),
  component: DirectoryAdmin,
});

function DirectoryAdmin() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "Directorates" | "City Admins">("all");
  const filtered = directory.filter((d) => {
    if (tab !== "all" && d.category !== tab) return false;
    return !q || d.name.toLowerCase().includes(q.toLowerCase());
  });
  return (
    <AdminLayout>
      <AdminPageHeader
        title="Directory Management"
        description="Categories, organizational units, offices, and departments."
        action={<button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" /> New entry</button>}
      />
      <div className="rounded-xl border bg-card shadow-soft">
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search directory…" className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2" />
          </div>
          <div className="flex gap-1 rounded-lg border bg-background p-1">
            {(["all", "Directorates", "City Admins"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={"rounded-md px-3 py-1 text-xs font-medium " + (tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {t === "all" ? "All" : t}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Head</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="px-5 py-3 font-medium">{d.name}</td>
                  <td className="px-5 py-3"><span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-foreground">{d.category}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <img src={d.photo} alt={d.head} loading="lazy" className="h-8 w-8 rounded-full object-cover ring-1 ring-border" />
                      <span className="text-muted-foreground">{d.head}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{d.phone}</div>
                    <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{d.email}</div>
                  </td>
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
      </div>
    </AdminLayout>
  );
}
