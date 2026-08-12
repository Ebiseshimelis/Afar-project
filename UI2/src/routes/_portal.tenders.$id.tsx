import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PortalLayout";
import { getTender, type Tender } from "@/services/tenderService";
import { Calendar, FileText, Download, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_portal/tenders/$id")({
  loader: async ({ params }) => {
    try {
      const item = await getTender(params.id);

      if (!item) {
        throw notFound();
      }

      return { item };
    } catch (error) {
      console.error("Failed to load tender:", error);
      throw notFound();
    }
  },

  head: ({ loaderData }) => {
    const title =
      loaderData?.item.title?.en ||
      loaderData?.item.title?.am ||
      "Tender";

    const description =
      loaderData?.item.content?.en ||
      loaderData?.item.content?.am ||
      "Tender details.";

    return {
      meta: [
        {
          title: `${title} — Tender`,
        },
        {
          name: "description",
          content: description,
        },
      ],
    };
  },

  component: TenderDetailPage,

  notFoundComponent: () => (
    <section className="mx-auto max-w-7xl px-4 py-16 text-center md:px-6">
      <h1 className="font-display text-2xl font-bold">
        Tender not found
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        The requested tender could not be found.
      </p>

      <Link
        to="/tenders"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tenders
      </Link>
    </section>
  ),
});

function getTitle(tender: Tender): string {
  return (
    tender.title?.en ||
    tender.title?.am ||
    "Untitled Tender"
  );
}

function getContent(tender: Tender): string {
  return (
    tender.content?.en ||
    tender.content?.am ||
    "No description available."
  );
}

function formatDate(date: string | null): string {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString();
}

function normalizeStatus(status: string): "Open" | "Closed" | "Awarded" {
  const normalized = status.toLowerCase();

  if (normalized === "open") return "Open";
  if (normalized === "awarded") return "Awarded";

  return "Closed";
}

function TenderDetailPage() {
  const { item } = Route.useLoaderData();

  const title = getTitle(item);
  const content = getContent(item);
  const status = normalizeStatus(item.status);

  return (
    <>
      <PageHeader
        eyebrow="Public Procurement"
        title={title}
        description="Tender details and procurement information."
        section="default"
      />

      <section className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <Link
          to="/tenders"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tenders
        </Link>

        <article className="rounded-xl border bg-card p-6 shadow-soft md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={status} />

            <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              #{item.id}
            </span>

            {item.category_id && (
              <span className="text-xs text-muted-foreground">
                Category {item.category_id}
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            {title}
          </h1>

          <div className="mt-6 grid gap-4 border-y py-5 sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <div>
                <div className="text-xs text-muted-foreground">
                  Published
                </div>

                <div className="text-sm font-medium">
                  {formatDate(item.published_at)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <div>
                <div className="text-xs text-muted-foreground">
                  Opening Date
                </div>

                <div className="text-sm font-medium">
                  {formatDate(item.opens_at)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <div>
                <div className="text-xs text-muted-foreground">
                  Deadline
                </div>

                <div className="text-sm font-medium">
                  {formatDate(item.closes_at)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold">
              Tender Information
            </h2>

            <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground/80">
              {content}
            </div>
          </div>

          {item.file_path && (
            <div className="mt-8 border-t pt-6">
              <a
                href={item.file_path}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                Download Tender Document
              </a>
            </div>
          )}
        </article>
      </section>
    </>
  );
}

function StatusBadge({
  status,
}: {
  status: "Open" | "Closed" | "Awarded";
}) {
  const map = {
    Open: "bg-success/15 text-success",
    Closed: "bg-muted text-muted-foreground",
    Awarded: "bg-warning/15 text-warning",
  } as const;

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${map[status]}`}
    >
      {status}
    </span>
  );
}