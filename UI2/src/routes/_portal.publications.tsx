import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PortalLayout";
import { getPublications, type PublicationItem } from "@/services/publicationService";
import { FileText, Download } from "lucide-react";
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

function PublicationsPage() {
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 hidden md:table-cell">
                    Published
                  </th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {publications.map((publication) => (
                  <tr key={publication.id} className="border-t">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                          <FileText className="h-4 w-4" />
                        </div>

                        <div>
                          <span className="font-medium">
                            {publication.title}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {publication.status}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">
                      {publication.publishedAt
                        ? new Date(
                            publication.publishedAt
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-right">
                      {publication.filePath ? (
                        <a
                          href={publication.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No file
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}