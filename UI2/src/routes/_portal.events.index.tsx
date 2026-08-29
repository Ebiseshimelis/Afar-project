import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PortalLayout";
import {
  getEvents,
  type EventItem,
} from "@/services/eventService";
import { Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_portal/events/")({
  head: () => ({
    meta: [
      {
        title: "Events — Afar UDCB",
      },
      {
        name: "description",
        content:
          "Upcoming events, forums, workshops, and consultations.",
      },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const [events, setEvents] =
    useState<EventItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(() =>
        setError("Unable to load events."),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        section="newsEvents"
        eyebrow="Calendar"
        title="Events & Consultations"
        description="Forums, workshops, and public consultations across the region."
      />

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Loading state */}
        {loading && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Loading events...
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading &&
          !error &&
          events.length === 0 && (
            <div className="rounded-lg border bg-card p-10 text-center text-sm text-muted-foreground">
              No events available at the moment.
            </div>
          )}

        {/* Events */}
        {!loading &&
          !error &&
          events.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {events.map((e) => (
                <Link
                  key={e.id}
                  to="/events/$id"
                  params={{
                    id: String(e.id),
                  }}
                  className="group block overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="gradient-primary p-5 text-primary-foreground">

                    <div className="inline-flex items-center gap-2 rounded-md bg-primary-foreground/10 px-2 py-1 text-xs font-semibold text-gold">
                      <Calendar className="h-3 w-3" />

                      {new Date(
                        e.start_at,
                      ).toLocaleDateString()}
                    </div>

                    <h3 className="mt-3 font-display text-lg font-semibold group-hover:text-gold">
                      {e.title?.en ?? ""}
                    </h3>

                  </div>

                  <div className="p-5">

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {e.location ||
                        "Location not specified"}
                    </div>

                    <p className="mt-2 line-clamp-3 text-sm text-foreground/80">
                      {e.content?.en ?? ""}
                    </p>

                    <div className="mt-4 text-sm font-semibold text-primary">
                      View event →
                    </div>

                  </div>

                </Link>
              ))}

            </div>
          )}

      </section>
    </>
  );
}
