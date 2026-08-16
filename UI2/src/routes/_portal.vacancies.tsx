import { createFileRoute } from "@tanstack/react-router";
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
      { title: "Vacancies — Afar UDCB" },
      {
        name: "description",
        content:
          "Job openings and career opportunities at the Afar UDCB.",
      },
    ],
  }),
  component: VacanciesPage,
});

function VacanciesPage() {
  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVacancies() {
      try {
        setLoading(true);
        setError(null);

        const data = await getVacancies();

        setVacancies(data);
      } catch (err) {
        console.error(
          "Failed to load vacancies:",
          err
        );

        setError(
          "Unable to load vacancies."
        );
      } finally {
        setLoading(false);
      }
    }

    loadVacancies();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Vacancies"
        description="Join a team modernizing urban development across the Afar Regional State."
      />

      <section className="mx-auto max-w-5xl px-6 py-10">
        {loading && (
          <div className="py-10 text-center text-muted-foreground">
            Loading vacancies...
          </div>
        )}

        {error && (
          <div className="py-10 text-center text-destructive">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          vacancies.length === 0 && (
            <div className="rounded-xl border bg-card p-10 text-center shadow-soft">
              <Briefcase className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

              <h3 className="text-lg font-semibold">
                No vacancies available
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                There are currently no vacancies available.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          vacancies.length > 0 && (
            <div className="space-y-3">
              {vacancies.map((v) => (
                <div
                  key={v.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border bg-card p-5 shadow-soft"
                >
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-semibold">
                      {v.title?.en ||
                        v.title?.am ||
                        "Untitled vacancy"}
                    </h3>

                    {v.title?.am &&
                      v.title?.en && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          {v.title.am}
                        </div>
                      )}

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {v.status === "published"
                          ? "Published"
                          : "Draft"}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />

                        {v.deadline
                          ? `Closes ${new Date(
                              v.deadline
                            ).toLocaleDateString()}`
                          : "No deadline"}
                      </span>
                    </div>

                    {v.content?.en && (
                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                        {v.content.en}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    Apply
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
      </section>
    </>
  );
}