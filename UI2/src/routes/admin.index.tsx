import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  FileText,
  Image,
  Loader2,
  Mail,
  Newspaper,
  ShieldCheck,
  Users,
  BriefcaseBusiness,
  Building2,
  BookOpen,
  AlertCircle,
  LockKeyhole,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  AdminLayout,
  AdminPageHeader,
} from "@/components/admin/AdminLayout";

import { useAuth } from "@/lib/auth";

import { getNews, type NewsItem } from "@/services/newsService";
import { getEvents, type EventItem } from "@/services/eventService";
import { getTenders, type Tender } from "@/services/tenderService";
import { getVacancies } from "@/services/vacancyService";
import { getPublications } from "@/services/publicationService";
import { getMultimedia } from "@/services/multimediaService";
import { getDirectorates } from "@/services/directorateService";
import {
  getMessages,
  type ContactMessage,
} from "@/services/messageService";
import { getNotifications } from "@/services/notificationService";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      {
        title: "Dashboard — Admin",
      },
      {
        name: "robots",
        content: "noindex",
      },
    ],
  }),
  component: Dashboard,
});

type DashboardState = {
  news: NewsItem[];
  events: EventItem[];
  tenders: Tender[];
  vacancies: unknown[];
  publications: unknown[];
  multimedia: unknown[];
  directorates: unknown[];
  messages: ContactMessage[];
  notifications: unknown[];
};

const EMPTY_STATE: DashboardState = {
  news: [],
  events: [],
  tenders: [],
  vacancies: [],
  publications: [],
  multimedia: [],
  directorates: [],
  messages: [],
  notifications: [],
};

type SectionError = {
  module: string;
  message: string;
};

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/*
 * NewsItem.title is currently defined as a string in
 * src/lib/mock-data.ts and newsService.ts maps the backend
 * response into that string.
 *
 * Do not access item.title.en / item.title.am here.
 * That was the cause of the final TypeScript errors.
 *
 * This does NOT change the news API, image loader, content,
 * excerpt, or backend data.
 */
function getNewsTitle(item: NewsItem) {
  return item.title || "Untitled news";
}

/*
 * Event and Tender services may expose multilingual titles.
 * These helpers safely support either a string or an object.
 */
function getEventTitle(item: EventItem) {
  const title = item.title;

  if (typeof title === "string") {
    return title || "Untitled event";
  }

  if (title && typeof title === "object") {
    const multilingual = title as {
      en?: string;
      am?: string;
    };

    return (
      multilingual.en ||
      multilingual.am ||
      "Untitled event"
    );
  }

  return "Untitled event";
}

function getTenderTitle(item: Tender) {
  const title = item.title;

  if (typeof title === "string") {
    return title || "Untitled tender";
  }

  if (title && typeof title === "object") {
    const multilingual = title as {
      en?: string;
      am?: string;
    };

    return (
      multilingual.en ||
      multilingual.am ||
      "Untitled tender"
    );
  }

  return "Untitled tender";
}

function getTenderClosingDate(item: Tender) {
  return item.closes_at || null;
}

function Dashboard() {
  const {
    user,
    loading: authLoading,
    isSuperAdmin,
    can,
  } = useAuth();

  const [data, setData] =
    useState<DashboardState>(EMPTY_STATE);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [sectionErrors, setSectionErrors] =
    useState<SectionError[]>([]);

  const permissions = useMemo(
    () => ({
      news: can("news.view"),
      events: can("events.view"),
      tenders: can("tenders.view"),
      vacancies: can("vacancies.view"),
      publications: can("publications.view"),
      multimedia: can("multimedia.view"),
      directorates: can("directorates.view"),
      messages: can("messages.view"),
      notifications: can("notifications.view"),
    }),
    [can],
  );

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError(null);
      setSectionErrors([]);

      const next: DashboardState = {
        ...EMPTY_STATE,
      };

      const errors: SectionError[] = [];

      /*
       * We deliberately request only data the current
       * authenticated user is allowed to view.
       *
       * Feedback is intentionally NOT loaded here.
       */

      const requests: Promise<void>[] = [];

      if (permissions.news) {
        requests.push(
          getNews()
            .then((items) => {
              next.news = Array.isArray(items)
                ? items
                : [];
            })
            .catch(() => {
              errors.push({
                module: "News",
                message:
                  "We couldn't load the latest news right now.",
              });
            }),
        );
      }

      if (permissions.events) {
        requests.push(
          getEvents()
            .then((items) => {
              next.events = Array.isArray(items)
                ? items
                : [];
            })
            .catch(() => {
              errors.push({
                module: "Events",
                message:
                  "We couldn't load the latest events right now.",
              });
            }),
        );
      }

      if (permissions.tenders) {
        requests.push(
          getTenders()
            .then((items) => {
              next.tenders = Array.isArray(items)
                ? items
                : [];
            })
            .catch(() => {
              errors.push({
                module: "Tenders",
                message:
                  "We couldn't load tender information right now.",
              });
            }),
        );
      }

      if (permissions.vacancies) {
        requests.push(
          getVacancies()
            .then((items) => {
              next.vacancies = Array.isArray(items)
                ? items
                : [];
            })
            .catch(() => {
              errors.push({
                module: "Vacancies",
                message:
                  "We couldn't load vacancy information right now.",
              });
            }),
        );
      }

      if (permissions.publications) {
        requests.push(
          getPublications()
            .then((items) => {
              next.publications = Array.isArray(items)
                ? items
                : [];
            })
            .catch(() => {
              errors.push({
                module: "Publications",
                message:
                  "We couldn't load publications right now.",
              });
            }),
        );
      }

      if (permissions.multimedia) {
        requests.push(
          getMultimedia()
            .then((items) => {
              next.multimedia = Array.isArray(items)
                ? items
                : [];
            })
            .catch(() => {
              errors.push({
                module: "Multimedia",
                message:
                  "We couldn't load multimedia information right now.",
              });
            }),
        );
      }

      if (permissions.directorates) {
        requests.push(
          getDirectorates()
            .then((items) => {
              next.directorates = Array.isArray(items)
                ? items
                : [];
            })
            .catch(() => {
              errors.push({
                module: "Directorates",
                message:
                  "We couldn't load directorate information right now.",
              });
            }),
        );
      }

      if (permissions.messages) {
        requests.push(
          getMessages(10)
            .then((items) => {
              next.messages = Array.isArray(items)
                ? items
                : [];
            })
            .catch(() => {
              errors.push({
                module: "Messages",
                message:
                  "We couldn't load contact messages right now.",
              });
            }),
        );
      }

      if (permissions.notifications) {
        requests.push(
          getNotifications()
            .then((items) => {
              next.notifications = Array.isArray(items)
                ? items
                : [];
            })
            .catch(() => {
              errors.push({
                module: "Notifications",
                message:
                  "We couldn't load notifications right now.",
              });
            }),
        );
      }

      try {
        await Promise.all(requests);

        if (cancelled) {
          return;
        }

        setData(next);
        setSectionErrors(errors);

        if (
          errors.length > 0 &&
          errors.length === requests.length
        ) {
          setError(
            "We couldn't retrieve your dashboard information. Please try again in a moment.",
          );
        }
      } catch {
        if (!cancelled) {
          setError(
            "We couldn't retrieve your dashboard information. Please try again in a moment.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    user,
    permissions.news,
    permissions.events,
    permissions.tenders,
    permissions.vacancies,
    permissions.publications,
    permissions.multimedia,
    permissions.directorates,
    permissions.messages,
    permissions.notifications,
  ]);

  if (authLoading || !user) {
    return (
      <AdminLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Preparing your workspace...
          </div>
        </div>
      </AdminLayout>
    );
  }

  const availableModules = [
    permissions.news,
    permissions.events,
    permissions.tenders,
    permissions.vacancies,
    permissions.publications,
    permissions.multimedia,
    permissions.directorates,
    permissions.messages,
    permissions.notifications,
  ].filter(Boolean).length;

  const hasAnyModule =
    availableModules > 0;

  const unreadMessages = data.messages.filter(
    (message) =>
      message.is_read === false ||
      message.is_read === 0,
  ).length;

  const publishedNews = data.news.filter(
    (item) =>
      String(
        (item as NewsItem & { status?: string }).status ?? "",
      ).toLowerCase() === "published",
  ).length;

  const publishedEvents = data.events.filter(
    (item) => item.status === "published",
  ).length;

  const publishedTenders = data.tenders.filter(
    (item) =>
      String(item.status ?? "")
        .toLowerCase() === "published",
  ).length;

  /*
   * NewsItem currently exposes `date` rather than
   * published_at / created_at.
   *
   * Use the mapped public date here so the dashboard
   * remains compatible with newsService.ts.
   */
  const recentNews = [...data.news]
    .sort(
      (a, b) =>
        new Date(b.date || "").getTime() -
        new Date(a.date || "").getTime(),
    )
    .slice(0, 4);

  const upcomingEvents = [...data.events]
    .filter((event) => {
      const start = new Date(
        event.start_at,
      ).getTime();

      return (
        !Number.isNaN(start) &&
        start >= Date.now()
      );
    })
    .sort(
      (a, b) =>
        new Date(a.start_at).getTime() -
        new Date(b.start_at).getTime(),
    )
    .slice(0, 4);

  const activeTenders = [...data.tenders]
    .filter((tender) => {
      if (!tender.closes_at) {
        return true;
      }

      const closing = new Date(
        tender.closes_at,
      ).getTime();

      return (
        !Number.isNaN(closing) &&
        closing >= Date.now()
      );
    })
    .sort(
      (a, b) =>
        new Date(
          a.closes_at || "",
        ).getTime() -
        new Date(
          b.closes_at || "",
        ).getTime(),
    )
    .slice(0, 4);

  const roleLabel = isSuperAdmin
    ? "Super Administrator"
    : "Administrator";

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Dashboard"
        description="A clear overview of the portal areas available to your account."
      />

      {/* Welcome panel */}
      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-soft">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                {roleLabel}
              </div>

              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back, {user.name || "Administrator"}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {isSuperAdmin
                  ? "You have full administrative access to the Afar UDCB portal. Here's a live overview of your portal operations."
                  : "Your workspace is focused on the portal areas assigned to your account. Use the available modules below to manage your responsibilities."}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border bg-background/80 px-4 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <div className="text-xs text-muted-foreground">
                  Signed in as
                </div>
                <div className="text-sm font-semibold">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Friendly authorization message */}
      {!isSuperAdmin && (
        <div className="mt-6 rounded-xl border border-primary/15 bg-primary/5 p-5">
          <div className="flex gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <LockKeyhole className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-display font-semibold">
                Your workspace is personalized
              </h3>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Your account can access {availableModules}{" "}
                {availableModules === 1
                  ? "portal area"
                  : "portal areas"}{" "}
                based on the permissions assigned to you.
                Areas outside your role are intentionally kept
                out of this dashboard.
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Need access to another area? Please contact
                your Super Administrator.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global loading */}
      {loading && (
        <div className="mt-6 rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Loading the latest portal information...
          </div>
        </div>
      )}

      {/* Friendly server error */}
      {!loading && error && (
        <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-5">
          <div className="flex gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-display font-semibold">
                Your dashboard needs a moment
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Your account is still signed in. This
                message concerns the dashboard data only.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Partial data warnings */}
      {!loading &&
        sectionErrors.length > 0 &&
        sectionErrors.length < availableModules && (
          <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

              <div>
                <div className="text-sm font-medium">
                  Some information could not be refreshed
                </div>

                <div className="mt-1 text-xs leading-5 text-muted-foreground">
                  A few dashboard sections are temporarily
                  unavailable. The rest of your workspace is
                  still available.
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Statistics */}
      {!loading && hasAnyModule && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {permissions.news && (
            <StatCard
              label="Total News"
              value={data.news.length}
              secondary={`${publishedNews} published`}
              icon={Newspaper}
              href="/admin/news"
            />
          )}

          {permissions.events && (
            <StatCard
              label="Total Events"
              value={data.events.length}
              secondary={`${publishedEvents} published`}
              icon={CalendarDays}
              href="/admin/events"
            />
          )}

          {permissions.tenders && (
            <StatCard
              label="Total Tenders"
              value={data.tenders.length}
              secondary={`${publishedTenders} published`}
              icon={FileText}
              href="/admin/tenders"
            />
          )}

          {permissions.vacancies && (
            <StatCard
              label="Total Vacancies"
              value={data.vacancies.length}
              secondary="Available in your workspace"
              icon={BriefcaseBusiness}
              href="/admin/vacancies"
            />
          )}

          {permissions.publications && (
            <StatCard
              label="Publications"
              value={data.publications.length}
              secondary="Portal publications"
              icon={BookOpen}
              href="/admin/publications"
            />
          )}

          {permissions.multimedia && (
            <StatCard
              label="Multimedia"
              value={data.multimedia.length}
              secondary="Images and videos"
              icon={Image}
              href="/admin/multimedia"
            />
          )}

          {permissions.directorates && (
            <StatCard
              label="Directorates"
              value={data.directorates.length}
              secondary="Organizational directory"
              icon={Building2}
              href="/admin/directory"
            />
          )}

          {permissions.messages && (
            <StatCard
              label="Messages"
              value={data.messages.length}
              secondary={
                unreadMessages > 0
                  ? `${unreadMessages} unread`
                  : "All messages reviewed"
              }
              icon={Mail}
              href="/admin/messages"
              highlight={unreadMessages > 0}
            />
          )}

          {permissions.notifications && (
            <StatCard
              label="Notifications"
              value={data.notifications.length}
              secondary="Portal notifications"
              icon={Bell}
              href="/admin/notifications"
            />
          )}
        </div>
      )}

      {/* No accessible modules */}
      {!loading && !hasAnyModule && (
        <div className="mt-6 rounded-2xl border bg-card p-8 text-center shadow-soft">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <LockKeyhole className="h-6 w-6" />
          </div>

          <h3 className="mt-4 font-display text-lg font-semibold">
            Your workspace is ready
          </h3>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            Your account is active, but no dashboard modules
            have been assigned yet. Please contact your Super
            Administrator to request access.
          </p>
        </div>
      )}

      {/* Recent News */}
      {!loading &&
        permissions.news && (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <DashboardSection
              title="Recent News"
              description="Latest portal news from the backend."
              href="/admin/news"
              actionLabel="Manage"
            >
              {recentNews.length === 0 ? (
                <EmptySection
                  icon={Newspaper}
                  title="No news yet"
                  description="There is no news content available yet."
                />
              ) : (
                <ul className="divide-y">
                  {recentNews.map((item) => {
                    const newsWithAdminFields =
                      item as NewsItem & {
                        status?: string;
                        published_at?: string;
                        created_at?: string;
                      };

                    return (
                      <li
                        key={item.id}
                        className="flex items-center gap-3 px-5 py-4"
                      >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Newspaper className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="line-clamp-1 text-sm font-medium">
                            {getNewsTitle(item)}
                          </div>

                          <div className="mt-1 text-xs text-muted-foreground">
                            {formatDate(
                              newsWithAdminFields.published_at ||
                                newsWithAdminFields.created_at ||
                                item.date,
                            )}
                          </div>
                        </div>

                        <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-medium capitalize">
                          {newsWithAdminFields.status || "—"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </DashboardSection>

            {/* Messages */}
            {permissions.messages && (
              <DashboardSection
                title="Recent Messages"
                description="Latest contact messages received by the bureau."
                href="/admin/messages"
                actionLabel="View all"
              >
                {data.messages.length === 0 ? (
                  <EmptySection
                    icon={Mail}
                    title="No messages yet"
                    description="There are no contact messages available."
                  />
                ) : (
                  <ul className="divide-y">
                    {data.messages
                      .slice(0, 4)
                      .map((message) => {
                        const unread =
                          message.is_read === false ||
                          message.is_read === 0;

                        return (
                          <li
                            key={message.id}
                            className="flex items-center gap-3 px-5 py-4"
                          >
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                              {message.full_name
                                .split(" ")
                                .map((part) =>
                                  part[0],
                                )
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="line-clamp-1 text-sm font-medium">
                                  {message.full_name}
                                </span>

                                {unread && (
                                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                                )}
                              </div>

                              <div className="line-clamp-1 text-xs text-muted-foreground">
                                {message.subject}
                              </div>
                            </div>

                            <div className="shrink-0 text-xs text-muted-foreground">
                              {formatDate(
                                message.created_at,
                              )}
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </DashboardSection>
            )}
          </div>
        )}

      {/* Upcoming events */}
      {!loading &&
        permissions.events && (
          <div className="mt-6">
            <DashboardSection
              title="Upcoming Events"
              description="Events scheduled in the portal."
              href="/admin/events"
              actionLabel="Manage"
            >
              {upcomingEvents.length === 0 ? (
                <EmptySection
                  icon={CalendarDays}
                  title="No upcoming events"
                  description="There are currently no upcoming events."
                />
              ) : (
                <div className="grid gap-3 p-5 md:grid-cols-2">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-xl border bg-background p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <CalendarDays className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="line-clamp-2 text-sm font-semibold">
                            {getEventTitle(event)}
                          </div>

                          <div className="mt-2 text-xs text-muted-foreground">
                            {formatDate(event.start_at)}
                          </div>

                          {event.location && (
                            <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DashboardSection>
          </div>
        )}

      {/* Active tenders */}
      {!loading &&
        permissions.tenders && (
          <div className="mt-6">
            <DashboardSection
              title="Active Tenders"
              description="Tender opportunities currently available in the portal."
              href="/admin/tenders"
              actionLabel="Manage"
            >
              {activeTenders.length === 0 ? (
                <EmptySection
                  icon={FileText}
                  title="No active tenders"
                  description="There are currently no active tender opportunities."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3">
                          Reference
                        </th>
                        <th className="px-5 py-3">
                          Title
                        </th>
                        <th className="px-5 py-3">
                          Status
                        </th>
                        <th className="px-5 py-3">
                          Closing
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {activeTenders.map((tender) => (
                        <tr
                          key={tender.id}
                          className="border-t"
                        >
                          <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                            #{tender.id}
                          </td>

                          <td className="max-w-md px-5 py-4">
                            <div className="line-clamp-1 font-medium">
                              {getTenderTitle(tender)}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                              <CheckCircle2 className="h-3 w-3" />
                              {tender.status || "Open"}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-muted-foreground">
                            {formatDate(
                              getTenderClosingDate(
                                tender,
                              ),
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </DashboardSection>
          </div>
        )}

      {/* Super Admin administration panel */}
      {isSuperAdmin && (
        <div className="mt-6 rounded-2xl border bg-card shadow-soft">
          <div className="border-b px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-display font-semibold">
                  Administration
                </h3>

                <p className="text-xs text-muted-foreground">
                  System administration tools available to Super
                  Administrators.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <AdminQuickLink
              href="/admin/users"
              label="Users & Roles"
              icon={Users}
            />

            <AdminQuickLink
              href="/admin/accounts"
              label="Admin Accounts"
              icon={ShieldCheck}
            />

            <AdminQuickLink
              href="/admin/permissions"
              label="Permissions"
              icon={LockKeyhole}
            />

            <AdminQuickLink
              href="/admin/activity"
              label="Activity"
              icon={Activity}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function StatCard({
  label,
  value,
  secondary,
  icon: Icon,
  href,
  highlight = false,
}: {
  label: string;
  value: number;
  secondary: string;
  icon: typeof Newspaper;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      to={href}
      className="group rounded-xl border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>

        {highlight && (
          <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
            Attention
          </span>
        )}
      </div>

      <div className="mt-4 font-display text-3xl font-bold">
        {value}
      </div>

      <div className="text-sm font-medium">
        {label}
      </div>

      <div className="mt-1 text-xs text-muted-foreground">
        {secondary}
      </div>
    </Link>
  );
}

function DashboardSection({
  title,
  description,
  href,
  actionLabel,
  children,
}: {
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
      <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
        <div>
          <h3 className="font-display font-semibold">
            {title}
          </h3>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <Link
          to={href}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {actionLabel}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {children}
    </div>
  );
}

function EmptySection({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Newspaper;
  title: string;
  description: string;
}) {
  return (
    <div className="px-5 py-10 text-center">
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>

      <div className="mt-3 text-sm font-medium">
        {title}
      </div>

      <div className="mt-1 text-xs text-muted-foreground">
        {description}
      </div>
    </div>
  );
}

function AdminQuickLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof ShieldCheck;
}) {
  return (
    <Link
      to={href}
      className="group flex items-center gap-3 rounded-xl border p-4 transition hover:border-primary/30 hover:bg-primary/5"
    >
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
        <Icon className="h-4 w-4" />
      </div>

      <span className="text-sm font-medium">
        {label}
      </span>

      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}