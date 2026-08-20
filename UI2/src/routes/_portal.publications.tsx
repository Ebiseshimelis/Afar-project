import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PortalLayout";
import {
  getPublications,
  type Publication,
} from "@/services/publicationService";
import { FileText, Eye, X } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_portal/publications")({
  head: () => ({
    meta: [
      { title: "Publications — Afar UDCB" },
      {
        name: "description",
        content: "Strategies, reports, manuals, and policy documents.",
      },
    ],
  }),
  component: PublicationsPage,
});

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

function PublicationViewer({
  publication,
  onClose,
}: {
  publication: Publication;
  onClose: () => void;
}) {
  if (!publication.file_path) {
    return null;
  }

  const fileUrl = getFileUrl(publication.file_path);
  const title =
    publication.title?.en ||
    publication.title?.am ||
    "Publication";

  const isImage = isImageFile(publication.file_path);
  const isPdf = isPdfFile(publication.file_path);

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
              Publication document
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 grid h-9 w-9 shrink-0 place-items-center rounded-lg hover:bg-secondary"
            aria-label="Close viewer"
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
                  The publication is attached, but this file type does not
                  support direct browser viewing.
                </p>

                <p className="mt-3 text-xs text-muted-foreground">
                  File type:{" "}
                  {getFileExtension(publication.file_path).toUpperCase() ||
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

function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPublication, setSelectedPublication] =
    useState<Publication | null>(null);

  useEffect(() => {
    async function loadPublications() {
      try {
        const data = await getPublications();
        setPublications(data);
      } catch (err) {
        console.error("Failed to load publications:", err);
        setError("Unable to load publications.");
      } finally {
        setLoading(false);
      }
    }

    loadPublications();
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Documents"
        title="Publications"
        description="Strategies, reports, manuals, and policy documents."
      />

      <section className="mx-auto max-w-5xl px-6 py-10">
        {loading && (
          <div className="py-12 text-center text-muted-foreground">
            Loading publications...
          </div>
        )}

        {!loading && error && (
          <div className="py-12 text-center text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && publications.length === 0 && (
          <div className="rounded-xl border bg-card px-6 py-12 text-center shadow-soft">
            <FileText className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-lg font-semibold">
              No publications available
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              There are currently no publications available.
            </p>
          </div>
        )}

        {!loading && !error && publications.length > 0 && (
          <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Title</th>

                  <th className="px-5 py-3">
                    Status
                  </th>

                  <th className="hidden px-5 py-3 md:table-cell">
                    Published
                  </th>

                  <th className="px-5 py-3 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {publications.map((publication) => {
                  const title =
                    publication.title?.en ||
                    publication.title?.am ||
                    "Untitled Publication";

                  return (
                    <tr
                      key={publication.id}
                      className="border-t"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                            <FileText className="h-4 w-4" />
                          </div>

                          <div>
                            <span className="font-medium">
                              {title}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {publication.status}
                      </td>

                      <td className="hidden px-5 py-4 text-muted-foreground md:table-cell">
                        {publication.published_at
                          ? new Date(
                              publication.published_at,
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {publication.file_path ? (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPublication(publication)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No file
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedPublication && (
        <PublicationViewer
          publication={selectedPublication}
          onClose={() => setSelectedPublication(null)}
        />
      )}
    </>
  );
}
