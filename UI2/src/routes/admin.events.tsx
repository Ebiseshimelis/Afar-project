import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { events } from "@/lib/mock-data";
import { Plus, Search, Pencil, Trash2, Calendar, MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/events")({
  head: () => ({ meta: [{ title: "Event Management" }, { name: "robots", content: "noindex" }] }),
  component: EventsAdmin,
});

function EventsAdmin() {
  const [q, setQ] = useState("");
  const filtered = events.filter((e) => !q || e.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <AdminLayout>
      <AdminPageHeader
        title="Event Management"
        description="Publish forums, workshops, and public consultations."
        action={<button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" /> New event</button>}
      />
      <div className="rounded-xl border bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b p-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events…" className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="px-5 py-3 font-medium">{e.title}</td>
                  <td className="px-5 py-3 text-muted-foreground"><span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(e.date).toLocaleDateString()}</span></td>
                  <td className="px-5 py-3 text-muted-foreground"><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{e.location}</span></td>
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
