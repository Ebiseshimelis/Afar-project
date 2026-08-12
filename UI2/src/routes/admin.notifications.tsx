import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { notifications } from "@/lib/mock-data";
import { BellRing, FileText, MessageSquare, Newspaper, Users } from "lucide-react";

const iconMap = { tender: FileText, message: MessageSquare, news: Newspaper, user: Users } as const;

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({ meta: [{ title: "Notifications" }, { name: "robots", content: "noindex" }] }),
  component: NotificationsAdmin,
});

function NotificationsAdmin() {
  return (
    <AdminLayout>
      <AdminPageHeader
        title="Notifications"
        description="System-generated alerts and activity notices."
        action={<button className="rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary">Mark all as read</button>}
      />
      <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
        <ul className="divide-y">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] ?? BellRing;
            return (
              <li key={n.id} className={"flex items-start gap-4 px-5 py-4 " + (n.read ? "" : "bg-primary/5")}>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{n.title}</span>
                    {!n.read && <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase text-primary-foreground">New</span>}
                  </div>
                  <div className="text-sm text-muted-foreground">{n.body}</div>
                </div>
                <div className="text-xs text-muted-foreground">{n.time}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </AdminLayout>
  );
}
