import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { activity } from "@/lib/mock-data";
import { Activity as ActivityIcon } from "lucide-react";

export const Route = createFileRoute("/admin/activity")({
  head: () => ({ meta: [{ title: "User Activity" }, { name: "robots", content: "noindex" }] }),
  component: ActivityAdmin,
});

function ActivityAdmin() {
  return (
    <AdminLayout>
      <AdminPageHeader title="User Activity" description="Recent actions performed by admin users." />
      <div className="rounded-xl border bg-card shadow-soft">
        <ul className="divide-y">
          {activity.map((a) => (
            <li key={a.id} className="flex items-start gap-4 px-5 py-4">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground">
                <ActivityIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm">
                  <span className="font-medium">{a.user}</span>{" "}
                  <span className="text-muted-foreground">{a.action.toLowerCase()}</span>{" "}
                  <span className="font-medium">{a.target}</span>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{a.date}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}
