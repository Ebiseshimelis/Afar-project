import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PortalLayout";
import {
  getTender,
  getTenderStatus,
  type Tender,
} from "@/services/tenderService";
import {
  Calendar,
  Eye,
  ArrowLeft,
  X,
  FileText,
} from "lucide-react";
import { useState } from "react";

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

function getFileUrl(filePath: string): string {
  if (
    filePath.startsWith("http://") ||
    filePath.startsWith("https://")
  ) {
    return filePath;
  }

  if (filePath.startsWith("/")) {
    return `http://127.0.0.1:8000${filePath}`;
  }

  return `http://127.0.0.1:8000/storage/${filePath}`;
}

function getFileExtension(filePath: string): string {
  const cleanPath = filePath.split("?")[0].split("#")[0];
  const parts = cleanPath.split(".");

  return parts.length > 1
    ? parts[parts.length - 1].toLowerCase()
    : "";
}

function isImageFile(filePath: string): boolean {
  return [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg",
  ].includes(getFileExtension(filePath));
}

function isPdfFile(filePath: string): boolean {
  return getFileExtension(filePath) === "pdf";
}

function TenderDocumentViewer({
  filePath,
  title,
  onClose,
}: {
  filePath: string;
  title: string;
  onClose: () => void;
}) {
  const fileUrl = getFileUrl(filePath);
  const isImage = isImageFile(filePath);
  const isPdf = isPdfFile(filePath);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`View ${title}`}
      onClick={onClose}
    >
      <div
        className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="min-w-0">
            <h2 className="truncate font-semibold">
              {title}
            </h2>

            <p className="text-xs text-muted-foreground">
              Tender document
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 grid h-9 w-9 shrink-0 place-items-center rounded-lg hover:bg-secondary"
            aria-label="Close document viewer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-muted/30">
          {isPdf ? (
            <iframe
              src={fileUrl}
              title={title}
              className="h-full min-h-[600px] w-full border-0"
            />
          ) : isImage ? (
            <div className="flex min-h-full items-center justify-center p-6">
              <img
                src={fileUrl}
                alt={title}
                className="max-h-full max-w-full rounded-lg object-contain shadow-lg"
              />
            </div>
          ) : (
            <div className="flex min-h-full items-center justify-center p-8 text-center">
              <div className="max-w-md">
                <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

                <h3 className="text-lg font-semibold">
                  This document cannot be previewed in the browser
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  The tender has an attached file, but this file type does
                  not support direct browser viewing.
                </p>

                <p className="mt-3 text-xs text-muted-foreground">
                  File type:{" "}
                  {getFileExtension(filePath).toUpperCase() ||
                    "Unknown"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TenderDetailPage() {
  const { item } = Route.useLoaderData();

  const [showDocument, setShowDocument] =
    useState(false);

  const title = getTitle(item);
  const content = getContent(item);

  const status =
    item.status === "published"
      ? getTenderStatus(item)
      : "Closed";

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
              <button
                type="button"
                onClick={() => setShowDocument(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Eye className="h-4 w-4" />
                View Tender Document
              </button>
            </div>
          )}
        </article>
      </section>

      {showDocument && item.file_path && (
        <TenderDocumentViewer
          filePath={item.file_path}
          title={title}
          onClose={() => setShowDocument(false)}
        />
      )}
    </>
  );
}

function StatusBadge({
  status,
}: {
  status: "Open" | "Closed";
}) {
  const map = {
    Open: "bg-success/15 text-success",
    Closed: "bg-muted text-muted-foreground",
  } as const;

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${map[status]}`}
    >
      {status}
    </span>
  );
}
