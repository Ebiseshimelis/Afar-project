import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { feedback } from "@/lib/mock-data";
import { Star } from "lucide-react";

export const Route = createFileRoute("/admin/feedback")({
  head: () => ({ meta: [{ title: "Feedback" }, { name: "robots", content: "noindex" }] }),
  component: FeedbackAdmin,
});

function FeedbackAdmin() {
  return (
    <AdminLayout>
      <AdminPageHeader title="Feedback" description="Citizen feedback about the portal." />
      <div className="grid gap-4 md:grid-cols-2">
        {feedback.map((f) => (
          <div key={f.id} className="rounded-xl border bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display font-semibold">{f.name}</div>
                <div className="text-xs text-muted-foreground">{f.topic} · {new Date(f.date).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={"h-4 w-4 " + (i < f.rating ? "fill-current" : "opacity-30")} />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground/80">{f.comment}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
