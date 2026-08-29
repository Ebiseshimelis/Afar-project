import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import {
  getEvent,
  getEvents,
  type EventItem,
} from "@/services/eventService";

export const Route = createFileRoute(
  "/_portal/events/$id",
)({
  loader: async ({ params }) => {
    const item = await getEvent(params.id);

    if (!item) {
      throw notFound();
    }

    const allEvents = await getEvents();

    return {
      item,
      events: allEvents,
    };
  },

  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.item.title?.en ?? "Event"} — Afar UDCB`
          : "Event — Afar UDCB",
      },
      {
        name: "description",
        content:
          loaderData?.item.content?.en ||
          "Event from Afar UDCB.",
      },
    ],
  }),

  component: EventDetailPage,

  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />

      <h1 className="mt-4 font-display text-2xl font-semibold">
        Event not found
      </h1>

      <Link
        to="/events"
        className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>
    </div>
  ),
});

function EventDetailPage() {
  const { item, events } = Route.useLoaderData();

  const startDate = new Date(item.start_at);
  const endDate = new Date(item.end_at);

  const otherEvents = events.filter(
    (event) => event.id !== item.id,
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <Link
        to="/events"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      {/* Main event */}
      <article className="overflow-hidden rounded-xl border bg-card shadow-soft">

        {/* Event header */}
        <div className="gradient-primary p-6 text-primary-foreground md:p-10">

          <div className="flex flex-wrap gap-3">

            <div className="inline-flex items-center gap-2 rounded-md bg-primary-foreground/10 px-3 py-2 text-sm font-semibold">
              <Calendar className="h-4 w-4" />
              {startDate.toLocaleDateString()}
            </div>

            {item.status && (
              <div className="inline-flex items-center rounded-md bg-primary-foreground/10 px-3 py-2 text-sm font-semibold capitalize">
                {item.status}
              </div>
            )}

          </div>

          <h1 className="mt-5 max-w-4xl font-display text-3xl font-bold md:text-4xl">
            {item.title?.en || "Untitled Event"}
          </h1>

          {item.title?.am && (
            <p className="mt-3 text-lg text-primary-foreground/80">
              {item.title.am}
            </p>
          )}

        </div>

        {/* Event information */}
        <div className="grid gap-4 border-b p-6 md:grid-cols-3 md:p-8">

          <div className="flex gap-3">
            <Calendar className="mt-1 h-5 w-5 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-semibold">
                Start Date
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {startDate.toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-semibold">
                Time
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {startDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" — "}
                {endDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-semibold">
                Location
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {item.location || "Location not specified"}
              </p>
            </div>
          </div>

        </div>

        {/* Event content */}
        <div className="p-6 md:p-10">

          <h2 className="font-display text-2xl font-bold">
            About This Event
          </h2>

          {item.content?.en ? (
            <div className="mt-5 whitespace-pre-wrap text-base leading-7 text-foreground/80">
              {item.content.en}
            </div>
          ) : (
            <p className="mt-5 text-muted-foreground">
              No additional event information is available.
            </p>
          )}

          {item.content?.am && (
            <div className="mt-8 border-t pt-8">
              <h2 className="font-display text-xl font-bold">
                ስለዚህ ዝግጅት
              </h2>

              <div className="mt-4 whitespace-pre-wrap leading-7 text-foreground/80">
                {item.content.am}
              </div>
            </div>
          )}

        </div>

      </article>

      {/* More events */}
      {otherEvents.length > 0 && (
        <section className="mt-12">

          <h2 className="font-display text-2xl font-bold">
            More Events
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {otherEvents.map((event: EventItem) => (
              <Link
                key={event.id}
                to="/events/$id"
                params={{
                  id: String(event.id),
                }}
                className="group overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="gradient-primary p-5 text-primary-foreground">

                  <div className="inline-flex items-center gap-2 rounded-md bg-primary-foreground/10 px-2 py-1 text-xs font-semibold">
                    <Calendar className="h-3 w-3" />

                    {new Date(
                      event.start_at,
                    ).toLocaleDateString()}
                  </div>

                  <h3 className="mt-3 font-display text-lg font-semibold group-hover:text-gold">
                    {event.title?.en || "Untitled Event"}
                  </h3>

                </div>

                <div className="p-5">

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.location || "Location not specified"}
                  </div>

                  <p className="mt-2 line-clamp-3 text-sm text-foreground/80">
                    {event.content?.en || ""}
                  </p>

                </div>

              </Link>
            ))}

          </div>

        </section>
      )}

    </div>
  );
}
