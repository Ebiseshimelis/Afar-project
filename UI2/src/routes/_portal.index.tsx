import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  Briefcase,
  FileText,
  Newspaper,
  Phone,
  Mail,
  MapPin,
  Building2,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getNews, type NewsItem } from "@/services/newsService";
import {
  getTenders,
  type Tender,
} from "@/services/tenderService";
import {
  getVacancies,
  type VacancyItem,
} from "@/services/vacancyService";
import {
  getEvents,
  type EventItem,
} from "@/services/eventService";
import { getDirectorates } from "@/services/directorateService";
import { getCityAdmins } from "@/services/cityAdminService";
import { getPortfolios, type PortfolioItem } from "@/services/portfolioService";
import { useSectionBackground } from "@/lib/site-images";
import afarHero from "@/assets/background.png";

export const Route = createFileRoute("/_portal/")({
  head: () => ({
    meta: [
      {
        title: "Home — Afar Regional Government Portal",
      },
      {
        name: "description",
        content:
          "Official portal of the Afar Regional State Urban Development and Construction Bureau — latest news, tenders, and services.",
      },
    ],
  }),
  component: HomePage,
});

type LocalizedValue =
  | string
  | {
      en?: string;
      am?: string;
    }
  | null
  | undefined;

function getLocalizedText(
  value: LocalizedValue,
): string {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return value.en || value.am || "";
}

/*
 * Tender status on the home page is determined
 * from the closing calendar date.
 *
 * Future/no closing date = Open
 * Past closing date = Closed
 *
 * The database "status" field is NOT used to hide
 * a tender from the home page.
 */
function isTenderOpen(
  tender: Tender,
): boolean {
  if (!tender.closes_at) {
    return true;
  }

  const closeDate =
    new Date(
      tender.closes_at,
    ).getTime();

  if (Number.isNaN(closeDate)) {
    return true;
  }

  return closeDate >= Date.now();
}

function HomePage() {
  const homeBackground = useSectionBackground("home");
  const [latestNews, setLatestNews] =
    useState<NewsItem[]>([]);

  const [latestTenders, setLatestTenders] =
    useState<Tender[]>([]);

  const [latestVacancies, setLatestVacancies] =
    useState<VacancyItem[]>([]);

  const [upcomingEvents, setUpcomingEvents] =
    useState<EventItem[]>([]);

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);

  const [directorateCount, setDirectorateCount] =
    useState(0);

  const [cityAdminCount, setCityAdminCount] =
    useState(0);

  const [newsLoading, setNewsLoading] =
    useState(true);

  const [tendersLoading, setTendersLoading] =
    useState(true);

  const [vacanciesLoading, setVacanciesLoading] =
    useState(true);

  const [eventsLoading, setEventsLoading] =
    useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await getNews();

        const sorted = [...data]
          .sort(
            (a, b) =>
              new Date(b.date).getTime() -
              new Date(a.date).getTime(),
          )
          .slice(0, 4);

        setLatestNews(sorted);
      } catch (error) {
        console.error(
          "Failed to load home page news:",
          error,
        );

        setLatestNews([]);
      } finally {
        setNewsLoading(false);
      }
    }

    loadNews();
  }, []);

  useEffect(() => {
    async function loadTenders() {
      try {
        setTendersLoading(true);

        /*
         * This is the SAME API used by the public
         * tender page and admin tender page.
         *
         * No mock tender data is used here.
         */
        const data = await getTenders();

        console.log(
          "HOME TENDERS FROM DATABASE:",
          data,
        );

        /*
         * Home page displays the latest OPEN tenders.
         *
         * Open/Closed is determined only by closes_at.
         */
        const openTenders = data
          .filter(isTenderOpen)
          .sort((a, b) => {
            const aDate =
              a.published_at
                ? new Date(
                    a.published_at,
                  ).getTime()
                : new Date(
                    a.created_at,
                  ).getTime();

            const bDate =
              b.published_at
                ? new Date(
                    b.published_at,
                  ).getTime()
                : new Date(
                    b.created_at,
                  ).getTime();

            return bDate - aDate;
          })
          .slice(0, 3);

        setLatestTenders(
          openTenders,
        );
      } catch (error) {
        console.error(
          "Failed to load home page tenders:",
          error,
        );

        setLatestTenders([]);
      } finally {
        setTendersLoading(false);
      }
    }

    loadTenders();
  }, []);

  useEffect(() => {
    async function loadVacancies() {
      try {
        const data = await getVacancies();

        const now = Date.now();

        const activeVacancies = data
          .filter((vacancy) => {
            if (
              vacancy.status
                ?.toLowerCase() !==
              "published"
            ) {
              return false;
            }

            if (!vacancy.deadline) {
              return true;
            }

            const deadline =
              new Date(
                vacancy.deadline,
              ).getTime();

            return (
              !Number.isNaN(
                deadline,
              ) &&
              deadline >= now
            );
          })
          .sort((a, b) => {
            const aDate =
              a.published_at
                ? new Date(
                    a.published_at,
                  ).getTime()
                : 0;

            const bDate =
              b.published_at
                ? new Date(
                    b.published_at,
                  ).getTime()
                : 0;

            return bDate - aDate;
          })
          .slice(0, 3);

        setLatestVacancies(
          activeVacancies,
        );
      } catch (error) {
        console.error(
          "Failed to load home page vacancies:",
          error,
        );

        setLatestVacancies([]);
      } finally {
        setVacanciesLoading(false);
      }
    }

    loadVacancies();
  }, []);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();

        const now = new Date();

        const upcoming = data
          .filter((event) => {
            const eventEndDate =
              new Date(
                event.end_at,
              );

            return (
              !Number.isNaN(
                eventEndDate.getTime(),
              ) &&
              eventEndDate >= now
            );
          })
          .sort(
            (a, b) =>
              new Date(
                a.start_at,
              ).getTime() -
              new Date(
                b.start_at,
              ).getTime(),
          )
          .slice(0, 3);

        setUpcomingEvents(
          upcoming,
        );
      } catch (error) {
        console.error(
          "Failed to load home page events:",
          error,
        );

        setUpcomingEvents([]);
      } finally {
        setEventsLoading(false);
      }
    }

    loadEvents();
  }, []);

  useEffect(() => {
    async function loadCounts() {
      try {
        const [
          directorates,
          cityAdmins,
        ] = await Promise.all([
          getDirectorates(),
          getCityAdmins(),
        ]);

        setDirectorateCount(
          directorates.length,
        );

        setCityAdminCount(
          cityAdmins.length,
        );
      } catch (error) {
        console.error(
          "Failed to load directorate/city admin counts:",
          error,
        );
      }
    }

    loadCounts();
  }, []);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        setPortfolioLoading(true);
        setPortfolioError(null);
        setPortfolioItems(await getPortfolios());
      } catch (error) {
        console.error("Failed to load home page portfolio:", error);
        setPortfolioItems([]);
        setPortfolioError("Unable to load portfolio items.");
      } finally {
        setPortfolioLoading(false);
      }
    }

    void loadPortfolio();
  }, []);

  return (
    <div className="animate-fade-in-up">
      <section className="relative overflow-hidden gradient-hero">
        <img
          src={homeBackground || afarHero}
          alt="Afar regional landscape at golden hour with government building"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          width={1920}
          height={1088}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/45 to-primary/60" />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, oklch(0.9 0.15 75) 0, transparent 40%), radial-gradient(circle at 80% 80%, oklch(0.5 0.1 258) 0, transparent 40%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="text-primary-foreground">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-gold ring-1 ring-primary-foreground/20">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Official Government Portal
              </div>

              <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                Building a modern,{" "}
                <span className="text-gold">
                  connected
                </span>{" "}
                Afar
              </h1>

              <p className="mt-4 max-w-xl text-lg text-primary-foreground/80">
                The Afar Regional State Urban
                Development and Construction Bureau
                delivers services, information, and
                opportunities to citizens,
                contractors, and partners.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/directory"
                  className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-gold-foreground transition hover:brightness-110"
                >
                  Explore Directorate
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/tenders"
                  className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/5 px-5 py-3 text-sm font-semibold text-primary-foreground backdrop-blur hover:bg-primary-foreground/10"
                >
                  View Tenders
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-primary-foreground/10 pt-6">
                <Stat
                  label="Directorates"
                  value={String(
                    directorateCount,
                  )}
                />

                <Stat
                  label="City Admins"
                  value={String(
                    cityAdminCount,
                  )}
                />

                <Stat
                  label="Active Tenders"
                  value={String(
                    latestTenders.length,
                  )}
                />
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <QuickTile
                  icon={
                    <Newspaper className="h-5 w-5" />
                  }
                  label="News"
                  to="/news"
                />

                <QuickTile
                  icon={
                    <FileText className="h-5 w-5" />
                  }
                  label="Tenders"
                  to="/tenders"
                />

                <QuickTile
                  icon={
                    <Briefcase className="h-5 w-5" />
                  }
                  label="Vacancies"
                  to="/vacancies"
                />

                <QuickTile
                  icon={
                    <Building2 className="h-5 w-5" />
                  }
                  label="Directory"
                  to="/directory"
                />

                <QuickTile
                  icon={
                    <Calendar className="h-5 w-5" />
                  }
                  label="Events"
                  to="/events"
                />

                <QuickTile
                  icon={
                    <FileText className="h-5 w-5" />
                  }
                  label="Publications"
                  to="/publications"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-card lg:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-2 px-4 py-4">
          {[
            {
              icon: Newspaper,
              label: "News",
              to: "/news" as const,
            },
            {
              icon: FileText,
              label: "Tenders",
              to: "/tenders" as const,
            },
            {
              icon: Briefcase,
              label: "Vacancies",
              to: "/vacancies" as const,
            },
            {
              icon: Building2,
              label: "Directory",
              to: "/directory" as const,
            },
            {
              icon: Calendar,
              label: "Events",
              to: "/events" as const,
            },
            {
              icon: Phone,
              label: "Contact",
              to: "/contact" as const,
            },
          ].map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="flex flex-col items-center gap-1 rounded-lg border bg-background px-2 py-3 text-xs font-medium text-foreground/80"
            >
              <q.icon className="h-4 w-4 text-primary" />
              {q.label}
            </Link>
          ))}
        </div>
      </section>

      <SectionHeading
        eyebrow="Newsroom"
        title="Latest News"
        href="/news"
      />

      <section className="mx-auto max-w-7xl px-6 pb-14">
        {newsLoading ? (
          <EmptyMessage message="Loading latest news..." />
        ) : latestNews.length === 0 ? (
          <EmptyMessage message="No news available." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {latestNews.map((n) => {
              const title =
                getLocalizedText(
                  n.title,
                );

              const excerpt =
                getLocalizedText(
                  n.excerpt,
                );

              const category =
                getLocalizedText(
                  n.category,
                );

              return (
                <Link
                  key={n.id}
                  to="/news/$id"
                  params={{
                    id: String(n.id),
                  }}
                  className="group overflow-hidden rounded-xl border bg-card shadow-soft transition hover:shadow-elegant"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-secondary">
                    <img
                      src={n.image}
                      alt={
                        title || "News"
                      }
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src =
                          "/News1.jpg";
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                        {category ||
                          "News"}
                      </span>

                      <span>·</span>

                      <time>
                        {formatDate(
                          n.date,
                        )}
                      </time>
                    </div>

                    <h3 className="mt-2 line-clamp-2 font-display text-base font-semibold leading-snug text-foreground group-hover:text-primary">
                      {title ||
                        "Untitled News"}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {excerpt}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="border-y bg-secondary/40 py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Procurement"
              title="Open Tenders"
              href="/tenders"
              inline
            />

            <div className="mt-5 space-y-3">
              {tendersLoading ? (
                <EmptyMessage message="Loading tenders..." />
              ) : latestTenders.length ===
                0 ? (
                <EmptyMessage message="There are currently no open tenders." />
              ) : (
                latestTenders.map(
                  (tender) => (
                    <Link
                      key={
                        tender.id
                      }
                      to="/tenders/$id"
                      params={{
                        id: String(
                          tender.id,
                        ),
                      }}
                      className="block rounded-xl border bg-card p-4 transition hover:shadow-soft"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-xs font-mono text-muted-foreground">
                            #
                            {
                              tender.id
                            }
                          </div>

                          <div className="mt-1 line-clamp-2 font-medium text-foreground">
                            {getTenderTitle(
                              tender,
                            )}
                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <FileText className="h-3 w-3" />

                              {tender.category_id !==
                              null
                                ? `Category ${tender.category_id}`
                                : "Procurement"}
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3 w-3" />

                              Closes{" "}
                              {formatDate(
                                tender.closes_at,
                              )}
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </div>
                    </Link>
                  ),
                )
              )}
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Careers"
              title="Vacancies"
              href="/vacancies"
              inline
            />

            <div className="mt-5 space-y-3">
              {vacanciesLoading ? (
                <EmptyMessage message="Loading vacancies..." />
              ) : latestVacancies.length ===
                0 ? (
                <EmptyMessage message="There are currently no vacancies." />
              ) : (
                latestVacancies.map(
                  (vacancy) => {
                    const title =
                      getLocalizedText(
                        vacancy.title,
                      );

                    return (
                      <Link
                        key={
                          vacancy.id
                        }
                        to="/vacancies"
                        className="block rounded-xl border bg-card p-4 transition hover:shadow-soft"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-medium text-foreground">
                              {title ||
                                "Untitled vacancy"}
                            </div>

                            <div className="mt-1 text-xs text-muted-foreground">
                              {vacancy.status?.toLowerCase() ===
                              "published"
                                ? "Published"
                                : "Draft"}
                            </div>

                            <div className="mt-2 text-xs text-muted-foreground">
                              Deadline:{" "}
                              {vacancy.deadline
                                ? formatDate(
                                    vacancy.deadline,
                                  )
                                : "No deadline"}
                            </div>
                          </div>

                          <span className="shrink-0 rounded-full bg-accent px-2 py-1 text-[10px] font-semibold uppercase text-accent-foreground">
                            {vacancy.status ||
                              "unknown"}
                          </span>
                        </div>
                      </Link>
                    );
                  },
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <SectionHeading
        eyebrow="Portfolio"
        title="Projects & Milestones"
        href="/news"
      />

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3">
          {portfolioLoading ? (
            <div className="col-span-full py-8 text-center text-sm text-muted-foreground">Loading portfolio...</div>
          ) : portfolioError ? (
            <div className="col-span-full py-8 text-center text-sm text-destructive">{portfolioError}</div>
          ) : portfolioItems.length === 0 ? (
            <div className="col-span-full py-8 text-center text-sm text-muted-foreground">There are currently no portfolio items.</div>
          ) : portfolioItems.map(
            (p, i) => (
              <div
                key={i}
                className={
                  "group relative overflow-hidden rounded-xl border bg-secondary shadow-soft " +
                  (i === 0
                    ? "col-span-2 row-span-2 aspect-square md:aspect-[4/3]"
                    : "aspect-[4/3]")
                }
              >
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-3">
                  <div className="text-xs font-medium text-primary-foreground">
                    {p.title}
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-[11px] text-primary-foreground/85">
                    {p.content}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      <SectionHeading
        eyebrow="Calendar"
        title="Upcoming Events"
        href="/events"
      />

      <section className="mx-auto max-w-7xl px-6 pb-14">
        {eventsLoading ? (
          <EmptyMessage message="Loading upcoming events..." />
        ) : upcomingEvents.length ===
          0 ? (
          <EmptyMessage message="There are currently no upcoming events." />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingEvents.map(
              (event) => (
                <div
                  key={event.id}
                  className="overflow-hidden rounded-xl border bg-card shadow-soft"
                >
                  {event.image_path && (
                    <div className="aspect-[16/9] overflow-hidden bg-secondary">
                      <img
                        src={getEventImage(
                          event.image_path,
                        )}
                        alt={getEventTitle(
                          event,
                        )}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(
                          imageEvent,
                        ) => {
                          imageEvent.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="inline-flex items-center gap-2 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
                      <Calendar className="h-3 w-3" />

                      {formatDate(
                        event.start_at,
                      )}
                    </div>

                    <h3 className="mt-3 font-display text-base font-semibold">
                      {getEventTitle(
                        event,
                      )}
                    </h3>

                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />

                      {getLocalizedText(
                        event.location,
                      ) ||
                        "Afar Regional State"}
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {getEventContent(
                        event,
                      )}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="overflow-hidden rounded-2xl gradient-primary text-primary-foreground shadow-elegant">
          <div className="grid gap-6 p-8 md:grid-cols-3 md:p-12">
            <div className="md:col-span-2">
              <div className="text-xs font-semibold uppercase tracking-widest text-gold">
                Get in touch
              </div>

              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                We're here to serve citizens,
                contractors, and partners.
              </h2>

              <p className="mt-2 max-w-xl text-primary-foreground/80">
                Reach any directorate or city
                administration through the contact
                channels below, or send us a message.
              </p>

              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-gold-foreground hover:brightness-110"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-gold" />
                033-666-0577
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-gold" />
                info@afarudcb.gov.et
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-gold" />
                Semera, Afar Regional State,
                Ethiopia
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="font-display text-2xl font-bold text-gold md:text-3xl">
        {value}
      </div>

      <div className="text-xs uppercase tracking-wider text-primary-foreground/70">
        {label}
      </div>
    </div>
  );
}

function QuickTile({
  icon,
  label,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  to:
    | "/news"
    | "/tenders"
    | "/vacancies"
    | "/directory"
    | "/events"
    | "/publications";
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-4 backdrop-blur transition hover:bg-primary-foreground/10"
    >
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-gold text-gold-foreground">
        {icon}
      </div>

      <div>
        <div className="font-medium text-primary-foreground">
          {label}
        </div>

        <div className="text-xs text-primary-foreground/60">
          Open →
        </div>
      </div>
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  href,
  inline,
}: {
  eyebrow: string;
  title: string;
  href:
    | "/news"
    | "/tenders"
    | "/vacancies"
    | "/events"
    | "/publications"
    | "/directory";
  inline?: boolean;
}) {
  return (
    <div
      className={
        inline
          ? ""
          : "mx-auto max-w-7xl px-6 pt-14 pb-6"
      }
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-gold">
            {eyebrow}
          </div>

          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h2>
        </div>

        <Link
          to={href}
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function EmptyMessage({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

function getTenderTitle(
  tender: Tender,
): string {
  return (
    getLocalizedText(
      tender.title,
    ) || "Untitled Tender"
  );
}

function getEventTitle(
  event: EventItem,
): string {
  return (
    getLocalizedText(
      event.title,
    ) || "Untitled Event"
  );
}

function getEventContent(
  event: EventItem,
): string {
  return getLocalizedText(
    event.content,
  );
}

function getEventImage(
  imagePath: string,
): string {
  return `/${String(imagePath).replace(
    /^\/+/,
    "",
  )}`;
}

function formatDate(
  date:
    | string
    | null
    | undefined,
): string {
  if (!date) {
    return "—";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
    return "—";
  }

  return parsed.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );
}
