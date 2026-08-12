import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PortalLayout";
import { vacancies } from "@/lib/mock-data";
import { Briefcase, Calendar, MapPin, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_portal/vacancies")({
  head: () => ({ meta: [
    { title: "Vacancies — Afar UDCB" },
    { name: "description", content: "Job openings and career opportunities at the Afar UDCB." },
  ]}),
  component: VacanciesPage,
});

function VacanciesPage() {
  return (
    <>
      <PageHeader eyebrow="Careers" title="Vacancies" description="Join a team modernizing urban development across the Afar Regional State." />
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="space-y-3">
          {vacancies.map((v) => (
            <div key={v.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border bg-card p-5 shadow-soft">
              <div className="min-w-0">
                <h3 className="font-display text-base font-semibold">{v.title}</h3>
                <div className="text-sm text-muted-foreground">{v.department}</div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {v.location}</span>
                  <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> {v.type}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Closes {new Date(v.deadline).toLocaleDateString()}</span>
                </div>
              </div>
              <button className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                Apply <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
