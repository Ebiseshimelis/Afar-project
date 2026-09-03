import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/portal/PortalLayout";
import {
  getVacancy,
  type VacancyItem,
} from "@/services/vacancyService";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  Download,
  FileText,
  Loader2,
  Eye,
} from "lucide-react";

export const Route = createFileRoute("/_portal/vacancies/$vacancyId")({
  head: () => ({
    meta: [
      {
        title: "Vacancy Details - Afar UDCB",
      },
      {
        name: "description",
        content:
          "Vacancy details and application information at Afar UDCB.",
      },
    ],
  }),
  component: VacancyDetailPage,
});

function formatDate(value: string | null) {
  if (!value) return "Not specified";

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

function getFileUrl(filePath: string) {
  if (!filePath) return "";

  if (
    filePath.startsWith("http://") ||
    filePath.startsWith("https://")
  ) {
    return filePath;
  }

  const cleanPath = filePath.replace(/^\/+/, "");

  return `http://127.0.0.1:8001/storage/${cleanPath}`;
}

function getFileName(filePath: string) {
  if (!filePath) return "Official Vacancy Document";

  const cleanPath = filePath.split("?")[0];
  const parts = cleanPath.split("/");

  return parts[parts.length - 1] || "Official Vacancy Document";
}

function VacancyDetailPage() {
  const { vacancyId } = Route.useParams();
  const location = useLocation();

  const isApplyPage = location.pathname.endsWith("/apply");

  if (isApplyPage) {
    return <Outlet />;
  }

  const [vacancy, setVacancy] = useState<VacancyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVacancy() {
      try {
        setLoading(true);
        setError(null);

        const data = await getVacancy(vacancyId);

        if (!cancelled) {
          setVacancy(data);
        }
      } catch (err) {
        console.error("Failed to load vacancy:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load vacancy details.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadVacancy();

    return () => {
      cancelled = true;
    };
  }, [vacancyId]);

  if (loading) {
    return (
      <>
        <PageHeader
          eyebrow="Careers"
          title="Vacancy Details"
          description="Loading vacancy information..."
        />

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex min-h-56 items-center justify-center rounded-3xl border bg-card shadow-sm">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading vacancy...
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error || !vacancy) {
    return (
      <>
        <PageHeader
          eyebrow="Careers"
          title="Vacancy Not Found"
          description="The requested vacancy could not be found."
        />

        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-3xl border bg-card p-10 text-center shadow-sm">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />

            <h2 className="mt-5 font-display text-xl font-bold">
              Vacancy unavailable
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {error ||
                "This vacancy does not exist or is no longer available."}
            </p>

            <Link
              to="/vacancies"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Vacancies
            </Link>
          </div>
        </section>
      </>
    );
  }

  const englishTitle =
    vacancy.title?.en || "Untitled vacancy";

  const amharicTitle =
    vacancy.title?.am || "";

  const englishContent =
    vacancy.content?.en || "";

  const amharicContent =
    vacancy.content?.am || "";

  const fileUrl = vacancy.file_path
    ? getFileUrl(vacancy.file_path)
    : "";

  const fileName = vacancy.file_path
    ? getFileName(vacancy.file_path)
    : "";

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Vacancy Details"
        description="Review the position, requirements, deadline, and application information."
      />

      <section className="mx-auto max-w-6xl px-6 py-8 sm:py-10">
        <Link
          to="/vacancies"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Vacancies
        </Link>

        <article className="overflow-hidden rounded-3xl border bg-card shadow-sm">

          {/* Vacancy header */}
          <div className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-10">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                    <Briefcase className="h-4 w-4" />
                    Employment Opportunity
                  </div>

                  <h1 className="mt-4 font-display text-lg font-bold tracking-tight sm:text-xl lg:text-2xl">
                    {englishTitle}
                  </h1>

                  {amharicTitle && (
                    <p className="mt-4 text-base leading-7 text-muted-foreground">
                      {amharicTitle}
                    </p>
                  )}
                </div>

                <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm">
                  {vacancy.status === "published"
                    ? "Open"
                    : vacancy.status}
                </span>
              </div>

              {/* Important information */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border bg-background/80 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Published
                      </p>

                      <p className="mt-1 font-semibold">
                        {formatDate(vacancy.published_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-background/80 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Application Deadline
                      </p>

                      <p className="mt-1 font-semibold">
                        {formatDate(vacancy.deadline)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 sm:p-10">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-primary" />

                <h2 className="font-display text-xl font-bold">
                  Job Description
                </h2>
              </div>

              {englishContent ? (
                <div className="mt-6 whitespace-pre-wrap text-[15px] leading-8 text-muted-foreground">
                  {englishContent}
                </div>
              ) : (
                <p className="mt-6 text-sm text-muted-foreground">
                  No English description has been provided.
                </p>
              )}

              {amharicContent && (
                <div className="mt-10 border-t pt-8">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1 rounded-full bg-primary" />

                    <h3 className="font-display text-lg font-bold">
  ??? ????
</h3>
                  </div>

                  <div className="mt-5 whitespace-pre-wrap text-[15px] leading-8 text-muted-foreground">
                    {amharicContent}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Official document */}
          {fileUrl && (
            <div className="border-t bg-muted/20 px-6 py-8 sm:px-10">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Official Document
                </p>

                <h2 className="mt-1 font-display text-lg font-bold">
                  Vacancy Attachment
                </h2>
              </div>

              <div className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold">
                      Official Vacancy Document
                    </h3>

                    <p
                      className="mt-1 truncate text-sm text-muted-foreground"
                      title={fileName}
                    >
                      {fileName}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Open the document or save a copy for later.
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-3">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:bg-muted"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Compact Application CTA */}
          <div className="border-t bg-primary/[0.04] px-6 py-5 sm:px-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">
                  Ready to apply?
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Review the vacancy details before submitting your application.
                </p>
              </div>

              <Link
                to="/vacancies/$vacancyId/apply"
                params={{
                  vacancyId: String(vacancy.id),
                }}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}








