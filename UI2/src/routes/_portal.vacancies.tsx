import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/portal/PortalLayout";
import {
  getVacancies,
  type VacancyItem,
} from "@/services/vacancyService";
import {
  Briefcase,
  Calendar,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/_portal/vacancies")({
  head: () => ({
    meta: [
      {
        title: "Vacancies - Afar UDCB",
      },
      {
        name: "description",
        content:
          "Current employment opportunities at Afar UDCB.",
      },
    ],
  }),
  component: VacanciesPage,
});

function formatDate(value: string | null) {
  if (!value) {
    return "Not specified";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not specified";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function VacanciesPage() {
  const location = useLocation();

  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isVacancyDetail =
    location.pathname !== "/vacancies";

  useEffect(() => {
    if (isVacancyDetail) {
      return;
    }

    async function loadVacancies() {
      try {
        setLoading(true);
        setError(null);

        const data = await getVacancies();
        setVacancies(data);
      } catch (err) {
        console.error("Failed to load vacancies:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load vacancies.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadVacancies();
  }, [isVacancyDetail]);

  if (isVacancyDetail) {
    return <Outlet />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Vacancies"
        description="Explore current employment opportunities at Afar UDCB."
      />

      <section className="mx-auto max-w-5xl px-6 py-10">
        {loading && (
          <div className="rounded-xl border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Loading vacancies...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border bg-card p-8 text-center">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && vacancies.length === 0 && (
          <div className="rounded-xl border bg-card p-8 text-center">
            <Briefcase className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-3 text-sm text-muted-foreground">
              There are currently no published vacancies.
            </p>
          </div>
        )}

        {!loading && !error && vacancies.length > 0 && (
          <div className="space-y-5">
            {vacancies.map((v) => {
              const title =
                v.title?.en ||
                v.title?.am ||
                "Untitled vacancy";

              const content =
                v.content?.en ||
                v.content?.am ||
                "No vacancy description has been provided.";

              return (
                <article
                  key={v.id}
                  className="relative rounded-2xl border bg-card p-6 shadow-sm"
                >
                  <div className="pr-36">
                    <h2 className="font-display text-xl font-bold">
                      {title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {content}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Published:{" "}
                        {formatDate(v.published_at)}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Closing:{" "}
                        {formatDate(v.deadline)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/vacancies/$vacancyId"
                    params={{
                      vacancyId: String(v.id),
                    }}
                    className="absolute right-6 top-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}