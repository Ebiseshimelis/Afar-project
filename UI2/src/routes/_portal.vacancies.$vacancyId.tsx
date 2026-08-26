import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/portal/PortalLayout";
import {
  getVacancy,
  type VacancyItem,
} from "@/services/vacancyService";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/_portal/vacancies/$vacancyId")({
  head: () => ({
    meta: [
      { title: "Vacancy Details — Afar UDCB" },
      {
        name: "description",
        content:
          "Vacancy details and application information at Afar UDCB.",
      },
    ],
  }),
  component: VacancyDetailPage,
});

function VacancyDetailPage() {
  const { vacancyId } = Route.useParams();

  const [vacancy, setVacancy] = useState<VacancyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVacancy() {
      try {
        setLoading(true);
        setError(null);

        const data = await getVacancy(vacancyId);
        setVacancy(data);
      } catch (err) {
        console.error("Failed to load vacancy:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load vacancy details.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadVacancy();
  }, [vacancyId]);

  if (loading) {
    return (
      <>
        <PageHeader
          eyebrow="Careers"
          title="Vacancy Details"
          description="Loading vacancy information..."
        />

        <div className="mx-auto flex max-w-5xl items-center justify-center px-6 py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (error || !vacancy) {
    return (
      <>
        <PageHeader
          eyebrow="Careers"
          title="Vacancy Not Found"
          description="The requested vacancy could not be loaded."
        />

        <section className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-xl border bg-card p-8 text-center">
            <p className="text-sm text-destructive">
              {error || "This vacancy does not exist."}
            </p>

            <Link
              to="/vacancies"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Vacancies
            </Link>
          </div>
        </section>
      </>
    );
  }

  const title =
    vacancy.title?.en ||
    vacancy.title?.am ||
    "Untitled vacancy";

  const amharicTitle =
    vacancy.title?.am && vacancy.title?.en
      ? vacancy.title.am
      : null;

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title={title}
        description="Review the vacancy information and application requirements."
      />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <Link
          to="/vacancies"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Vacancies
        </Link>

        <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
          <div className="border-b p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold">
                  {title}
                </h1>

                {amharicTitle && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {amharicTitle}
                  </p>
                )}
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                <Briefcase className="h-3.5 w-3.5" />
                Published
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />

                {vacancy.deadline
                  ? `Application deadline: ${new Date(
                      vacancy.deadline,
                    ).toLocaleDateString()}`
                  : "No application deadline specified"}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h2 className="font-display text-lg font-semibold">
              Job Description
            </h2>

            <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
              {vacancy.content?.en ||
                vacancy.content?.am ||
                "No description has been provided for this vacancy."}
            </div>
          </div>

          {vacancy.file_path && (
            <div className="border-t p-6">
              <h2 className="font-display text-lg font-semibold">
                Vacancy Document
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Additional information is available in the official vacancy
                document.
              </p>

              <a
                href={vacancy.file_path}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <FileText className="h-4 w-4" />
                View Vacancy Document
              </a>
            </div>
          )}

          <div className="border-t bg-muted/20 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">
                  Interested in this position?
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Submit your application through the official application form.
                </p>
              </div>

              <a
  href={`/vacancies/${String(vacancy.id)}/apply`}
  className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90"
>
  Apply Now
</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
