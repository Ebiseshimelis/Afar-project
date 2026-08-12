import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { stats, news, tenders, messages } from "@/lib/mock-data";
import { Newspaper, FileText, Users, MessageSquare, TrendingUp, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — Admin" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const cards = [
    { label: "Total News", value: stats.totalNews, icon: Newspaper, trend: "+12%" },
    { label: "Total Tenders", value: stats.totalTenders, icon: FileText, trend: "+4%" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, trend: "+1" },
    { label: "Total Messages", value: stats.totalMessages, icon: MessageSquare, trend: "+27" },
  ];

  return (
    <AdminLayout>
      <AdminPageHeader title="Dashboard" description="Overview of portal activity." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-lg gradient-primary text-primary-foreground">
                <c.icon className="h-5 w-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                <TrendingUp className="h-3 w-3" /> {c.trend}
              </span>
            </div>
            <div className="mt-4 font-display text-3xl font-bold">{c.value}</div>
            <div className="text-sm text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h3 className="font-display font-semibold">Recent News</h3>
            <Link to="/admin/news" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Manage <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <ul className="divide-y">
            {news.slice(0, 4).map((n) => (
              <li key={n.id} className="flex items-center gap-3 px-5 py-3">
                <img src={n.image} alt="" className="h-10 w-10 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.category} · {new Date(n.date).toLocaleDateString()}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h3 className="font-display font-semibold">Recent Messages</h3>
            <Link to="/admin/messages" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <ul className="divide-y">
            {messages.slice(0, 4).map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-5 py-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {m.name.split(" ").map(p => p[0]).join("").slice(0,2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{m.name}</span>
                    {!m.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </div>
                  <div className="line-clamp-1 text-xs text-muted-foreground">{m.subject}</div>
                </div>
                <div className="text-xs text-muted-foreground">{new Date(m.date).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="font-display font-semibold">Active Tenders</h3>
          <Link to="/admin/tenders" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Manage <ArrowRight className="h-3 w-3" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-5 py-3">Reference</th><th className="px-5 py-3">Title</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Deadline</th></tr>
            </thead>
            <tbody>
              {tenders.slice(0, 4).map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{t.reference}</td>
                  <td className="px-5 py-3">{t.title}</td>
                  <td className="px-5 py-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">{t.status}</span></td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(t.deadline).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
