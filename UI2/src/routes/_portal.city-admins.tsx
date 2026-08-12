import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PortalLayout";
import { directory } from "@/lib/mock-data";
import { useLanguage } from "@/lib/language";
import { Phone, Mail, MapPin, Building2 } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_portal/city-admins")({
  head: () => ({
    meta: [
      { title: "City Administration — Afar UDCB" },
      { name: "description", content: "Mayors and city administration offices across the Afar Regional State." },
      { property: "og:title", content: "City Administration — Afar UDCB" },
      { property: "og:description", content: "Mayors and city administration offices across the Afar Regional State." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CityAdminsPage,
});

function CityAdminsPage() {
  const { lang } = useLanguage();
  const cities = useMemo(() => directory.filter((d) => d.category === "City Admins"), []);
  const [selected, setSelected] = useState<string>("all");

  const label = (d: typeof directory[number]) => (lang === "am" && d.nameAm ? d.nameAm : d.name);
  const active = selected === "all" ? null : cities.find((c) => c.id === selected) ?? null;

  return (
    <>
      {active ? (
        /* Profile hero — featured image of the city administration / mayor */
        <section className="relative border-b overflow-hidden">
          <img
            src={active.photo.trim()}
            alt={active.head}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-primary/10" aria-hidden />
          <div className="relative mx-auto flex max-w-7xl flex-col justify-end px-4 pb-6 pt-24 text-primary-foreground sm:px-6 md:pb-10 md:pt-56">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium tracking-wide text-gold ring-1 ring-primary-foreground/25 backdrop-blur">
              <Building2 className="h-3 w-3" /> {lang === "am" ? "የከተማ አስተዳደር" : "City Administration"}
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold tracking-tight drop-shadow-md sm:text-3xl md:text-5xl">
              {active.head}
            </h1>
            <p className="mt-2 max-w-2xl text-primary-foreground/95 drop-shadow sm:text-base md:text-lg">
              {label(active)}
            </p>
          </div>
        </section>
      ) : (
        <PageHeader
          section="cityAdmins"
          eyebrow="Organization"
          title={lang === "am" ? "የከተማ አስተዳደር" : "City Administration"}
          description={
            lang === "am"
              ? "በአፋር ክልል የሚገኙ የከተማ አስተዳደሮች እና ከንቲባዎች።"
              : "Mayors and city administration offices across the Afar Regional State."
          }
        />
      )}

      {/* Horizontal navigation bar — same visual language as the main site nav */}
      <nav aria-label="City administrations" className="border-b bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <ul className="flex items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <li>
              <button
                onClick={() => setSelected("all")}
                aria-current={selected === "all" ? "true" : undefined}
                className={
                  "relative inline-flex shrink-0 items-center rounded-full px-3 py-2 text-sm font-medium transition-colors " +
                  (selected === "all" ? "text-primary" : "text-foreground/70 hover:text-primary")
                }
              >
                {lang === "am" ? "ሁሉም" : "All Cities"}
                {selected === "all" && <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gold" />}
              </button>
            </li>
            {cities.map((c) => {
              const isActive = selected === c.id;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setSelected(c.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={
                      "relative inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors " +
                      (isActive ? "text-primary" : "text-foreground/70 hover:text-primary")
                    }
                  >
                    {label(c).replace(/ City Administration$/, "")}
                    {isActive && <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gold" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {active ? (
        /* Profile body */
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0">
              <h2 className="font-display text-xl font-bold">
                {lang === "am" ? "ስለ አስተዳደሩ" : "About the administration"}
                <span className="mt-2 block h-0.5 w-12 rounded-full bg-gold" />
              </h2>
              <p className="mt-5 border-l-4 border-gold pl-4 text-base leading-relaxed text-foreground/85">
                {lang === "am"
                  ? `${label(active)} በአፋር ክልል የከተማ ልማት እና ግንባታ ቢሮ ስር የሚተዳደር የከተማ አስተዳደር ነው።`
                  : `${label(active)} delivers municipal services, urban planning, and infrastructure programs in coordination with the Afar Urban Development and Construction Bureau.`}
              </p>
              <p className="mt-4 text-base leading-relaxed text-foreground/75">
                {lang === "am"
                  ? "የአስተዳደሩ መረጃ እና የአገልግሎት ዝርዝሮች ከአስተዳደር ሲስተሙ ይጫናሉ።"
                  : "The office is led by the mayor and works with the Bureau on housing delivery, land administration, sanitation, and municipal capacity building."}
              </p>
            </div>

            {/* Contact card — no portrait; the photo is used as the page background */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border bg-card p-5 shadow-soft">
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {lang === "am" ? "ከንቲባ" : "Mayor"}
                  </div>
                  <div className="mt-0.5 font-display text-base font-semibold text-primary">{active.head}</div>
                  <h3 className="mt-1 text-sm text-muted-foreground">{label(active)}</h3>
                </div>
                <div className="mt-4 space-y-1.5 border-t pt-3 text-sm">
                  <a href={`tel:${active.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <Phone className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{active.phone}</span>
                  </a>
                  <a href={`mailto:${active.email.trim()}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <Mail className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{active.email.trim()}</span>
                  </a>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{label(active).replace(/ City Administration$/, "")}, Afar</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((d) => (
              <article
                key={d.id}
                className="rounded-xl border bg-card p-5 shadow-soft transition hover:shadow-elegant"
              >
                <button onClick={() => setSelected(d.id)} className="w-full text-left">
                  <div className="flex items-start gap-4">
                    <img
                      src={d.photo.trim()}
                      alt={d.head}
                      loading="lazy"
                      width={64}
                      height={64}
                      className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-primary/10"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {lang === "am" ? "የከተማ አስተዳደር" : "City Administration"}
                      </div>
                      <h2 className="mt-0.5 line-clamp-2 font-display text-sm font-semibold leading-tight sm:text-base">
                        {label(d)}
                      </h2>
                      <div className="mt-1 truncate text-sm font-medium text-primary">{d.head}</div>
                    </div>
                  </div>
                </button>
                <div className="mt-4 space-y-1.5 border-t pt-3 text-sm">
                  <a href={`tel:${d.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <Phone className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{d.phone}</span>
                  </a>
                  <a href={`mailto:${d.email.trim()}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                    <Mail className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{d.email.trim()}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
