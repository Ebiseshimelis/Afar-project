import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import {
  deleteFeedback,
  getFeedback,
  type Feedback,
} from "@/services/feedbackService";
import { Star, Trash2, Loader2, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FeedbackAdmin,
});

function FeedbackAdmin() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadFeedback() {
    try {
      setLoading(true);
      setError("");

      const data = await getFeedback();
      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load feedback.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFeedback();
  }, []);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteFeedback(id);

      setItems((current) =>
        current.filter((item) => item.id !== id),
      );
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Failed to delete feedback.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Feedback"
        description="Citizen feedback about the portal."
      />

      {loading && (
        <div className="flex items-center justify-center rounded-xl border bg-card py-16">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading feedback...
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-xl border bg-card py-16 text-center shadow-soft">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary">
            <Star className="h-5 w-5 text-muted-foreground" />
          </div>

          <h3 className="mt-4 font-display font-semibold">
            No feedback yet
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Citizen feedback will appear here when submitted.
          </p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={
                "rounded-xl border bg-card p-5 shadow-soft " +
                (!item.is_read ? "border-primary/30 bg-primary/[0.03]" : "")
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent">
                      <User className="h-4 w-4 text-accent-foreground" />
                    </div>

                    <div className="min-w-0">
                      <div className="truncate font-display font-semibold">
                        {item.name}
                      </div>

                      {item.email && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">
                            {item.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={
                        "h-4 w-4 " +
                        (index < item.rating
                          ? "fill-current text-gold"
                          : "text-muted-foreground/30")
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                  {item.topic}
                </span>

                {!item.is_read && (
                  <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-semibold uppercase text-primary-foreground">
                    New
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm leading-6 text-foreground/80">
                {item.comment}
              </p>

              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <span className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  aria-label="Delete feedback"
                  className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10 disabled:opacity-50"
                >
                  {deletingId === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
