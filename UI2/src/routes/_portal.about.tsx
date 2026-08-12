import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PortalLayout";
import { Target, Eye, Award, Building2, Users, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_portal/about")({
  head: () => ({ meta: [
    { title: "About — Afar UDCB" },
    { name: "description", content: "About the Afar Regional State Urban Development and Construction Bureau." },
  ]}),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About the Bureau" title="Serving Afar's urban future" description="The Urban Development and Construction Bureau leads sustainable urbanization, housing, and construction services across the Afar Regional State." />
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: "Our Mission", body: "Deliver inclusive, efficient, and sustainable urban development services that improve quality of life across every city and town in the Afar Regional State." },
            { icon: Eye, title: "Our Vision", body: "A region of modern, well-planned cities where every citizen has access to safe housing, quality infrastructure, and reliable municipal services." },
            { icon: Award, title: "Our Values", body: "Integrity, service excellence, transparency, accountability, and respect for the cultural heritage of the Afar people." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border bg-card p-6 shadow-soft">
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-primary-foreground">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold">What we do</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The Bureau oversees urban planning, housing development, land management, municipal support, and construction industry regulation across the Afar Regional State. We work with seven city administrations and dozens of towns to plan, build, and maintain the region's urban systems.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { icon: Building2, text: "Urban planning & land information systems" },
                { icon: Users, text: "Municipal capacity building & public services" },
                { icon: ShieldCheck, text: "Construction industry regulation & licensing" },
              ].map((f) => (
                <li key={f.text} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                  <f.icon className="h-4 w-4 text-primary" /> {f.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border shadow-soft">
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80" alt="City view" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}
