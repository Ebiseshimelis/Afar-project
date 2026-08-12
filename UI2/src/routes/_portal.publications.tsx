import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PortalLayout";
import { publications } from "@/lib/mock-data";
import { FileText, Download } from "lucide-react";

export const Route = createFileRoute("/_portal/publications")({
  head: () => ({ meta: [
    { title: "Publications — Afar UDCB" },
    { name: "description", content: "Strategies, reports, manuals, and policy documents." },
  ]}),
  component: PublicationsPage,
});

function PublicationsPage() {
  return (
    <>
      <PageHeader eyebrow="Documents" title="Publications" description="Strategies, reports, manuals, and policy documents." />
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3 hidden md:table-cell">Year</th>
                <th className="px-5 py-3 hidden md:table-cell">Size</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {publications.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground"><FileText className="h-4 w-4" /></div>
                      <span className="font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{p.type}</td>
                  <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{p.year}</td>
                  <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{p.size}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-secondary">
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
