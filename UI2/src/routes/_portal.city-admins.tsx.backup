import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PortalLayout";
import { getCityAdmins, type CityAdmin } from "@/services/cityAdminService";
import { useLanguage } from "@/lib/language";
import { Phone, Mail, MapPin, Building2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_portal/city-admins")({
  head: () => ({
    meta: [
      { title: "City Administration — Afar UDCB" },
      {
        name: "description",
        content:
          "Mayors and city administration offices across the Afar Regional State.",
      },
      {
        property: "og:title",
        content: "City Administration — Afar UDCB",
      },
      {
        property: "og:description",
        content:
          "Mayors and city administration offices across the Afar Regional State.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CityAdminsPage,
});

function CityAdminsPage() {
  const { lang } = useLanguage();

  const [cities, setCities] = useState<CityAdmin[]>([]);
  const [selected, setSelected] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCityAdmins() {
      try {
        setLoading(true);
        setError(null);

        const data = await getCityAdmins();
        setCities(data);
      } catch (err) {
        console.error("Failed to load city administrations:", err);
        setError("Failed to load city administrations.");
      } finally {
        setLoading(false);
      }
    }

    loadCityAdmins();
  }, []);

  const label = (city: CityAdmin) =>
    lang === "am" && city.nameAm ? city.nameAm : city.name;

  const description = (city: CityAdmin) =>
    lang === "am" && city.descriptionAm
      ? city.descriptionAm
      : city.description;

  const active =
    selected === "all"
      ? null
      : cities.find((city) => city.id === selected) ?? null;

  if (loading) {
    return (
      <>
        <PageHeader
          section="cityAdmins"
          eyebrow="Organization"
          title={
            lang === "am" ? "የከተማ አስተዳደር" : "City Administration"
          }
          description={
            lang === "am"
              ? "በአፋር ክልል የሚገኙ የከተማ አስተዳደሮች እና ከንቲባዎች።"
              : "Mayors and city administration offices across the Afar Regional State."
          }
        />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-center text-muted-foreground">
            {lang === "am" ? "በመጫን ላይ..." : "Loading city administrations..."}
          </p>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader
          section="cityAdmins"
          eyebrow="Organization"
          title={
            lang === "am" ? "የከተማ አስተዳደር" : "City Administration"
          }
          description={
            lang === "am"
              ? "በአፋር ክልል የሚገኙ የከተማ አስተዳደሮች እና ከንቲባዎች።"
              : "Mayors and city administration offices across the Afar Regional State."
          }
        />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-center text-destructive">{error}</p>
        </section>
      </>
    );
  }

  return (
    <>
      {active ? (
        <section className="relative border-b overflow-hidden">
          {active.photo ? (
            <img
              src={active.photo.trim()}
              alt={active.mayor_name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-primary" />
          )}

          <div
            className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-primary/10"
            aria-hidden
          />

          <div className="relative mx-auto flex max-w-7xl flex-col justify-end px-4 pb-6 pt-24 text-primary-foreground sm:px-6 md:pb-10 md:pt-56">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium tracking-wide text-gold ring-1 ring-primary-foreground/25 backdrop-blur">
              <Building2 className="h-3 w-3" />
              {lang === "am"
                ? "የከተማ አስተዳደር"
                : "City Administration"}
            </div>

            <h1 className="mt-3 font-display text-2xl font-bold tracking-tight drop-shadow-md sm:text-3xl md:text-5xl">
              {active.mayor_name}
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
          title={
            lang === "am" ? "የከተማ አስተዳደር" : "City Administration"
          }
          description={
            lang === "am"
              ? "በአፋር ክልል የሚገኙ የከተማ አስተዳደሮች እና ከንቲባዎች።"
              : "Mayors and city administration offices across the Afar Regional State."
          }
        />
      )}

      {/* City administration navigation */}
      <nav
        aria-label="City administrations"
        className="border-b bg-card/95 backdrop-blur"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <ul className="flex items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <li>
              <button
                onClick={() => setSelected("all")}
                aria-current={selected === "all" ? "true" : undefined}
                className={
                  "relative inline-flex shrink-0 items-center rounded-full px-3 py-2 text-sm font-medium transition-colors " +
                  (selected === "all"
                    ? "text-primary"
                    : "text-foreground/70 hover:text-primary")
                }
              >
                {lang === "am" ? "ሁሉም" : "All Cities"}

                {selected === "all" && (
                  <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gold" />
                )}
              </button>
            </li>

            {cities.map((city) => {
              const isActive = selected === city.id;

              return (
                <li key={city.id}>
                  <button
                    onClick={() => setSelected(city.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={
                      "relative inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors " +
                      (isActive
                        ? "text-primary"
                        : "text-foreground/70 hover:text-primary")
                    }
                  >
                    {label(city).replace(/ City Administration$/, "")}

                    {isActive && (
                      <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gold" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {active ? (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0">
              <h2 className="font-display text-xl font-bold">
                {lang === "am"
                  ? "ስለ አስተዳደሩ"
                  : "About the administration"}

                <span className="mt-2 block h-0.5 w-12 rounded-full bg-gold" />
              </h2>

              <p className="mt-5 border-l-4 border-gold pl-4 text-base leading-relaxed text-foreground/85">
                {description(active)}
              </p>

              <p className="mt-4 text-base leading-relaxed text-foreground/75">
                {lang === "am"
                  ? "የአስተዳደሩ መረጃ እና የአገልግሎት ዝርዝሮች ከአስተዳደር ሲስተሙ ይጫናሉ።"
                  : "The office is led by the mayor and works with the Bureau on housing delivery, land administration, sanitation, and municipal capacity building."}
              </p>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border bg-card p-5 shadow-soft">
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {lang === "am" ? "ከንቲባ" : "Mayor"}
                  </div>

                  <div className="mt-0.5 font-display text-base font-semibold text-primary">
                    {active.mayor_name}
                  </div>

                  <h3 className="mt-1 text-sm text-muted-foreground">
                    {label(active)}
                  </h3>
                </div>

                <div className="mt-4 space-y-1.5 border-t pt-3 text-sm">
                  <a
                    href={`tel:${active.phone}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{active.phone}</span>
                  </a>

                  <a
                    href={`mailto:${active.email.trim()}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{active.email.trim()}</span>
                  </a>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {active.location || `${label(active)}, Afar`}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <article
                key={city.id}
                className="rounded-xl border bg-card p-5 shadow-soft transition hover:shadow-elegant"
              >
                <button
                  onClick={() => setSelected(city.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start gap-4">
                    {city.photo ? (
                      <img
                        src={city.photo.trim()}
                        alt={city.mayor_name}
                        loading="lazy"
                        width={64}
                        height={64}
                        className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-primary/10"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {lang === "am"
                          ? "የከተማ አስተዳደር"
                          : "City Administration"}
                      </div>

                      <h2 className="mt-0.5 line-clamp-2 font-display text-sm font-semibold leading-tight sm:text-base">
                        {label(city)}
                      </h2>

                      <div className="mt-1 truncate text-sm font-medium text-primary">
                        {city.mayor_name}
                      </div>
                    </div>
                  </div>
                </button>

                <div className="mt-4 space-y-1.5 border-t pt-3 text-sm">
                  <a
                    href={`tel:${city.phone}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{city.phone}</span>
                  </a>

                  <a
                    href={`mailto:${city.email.trim()}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{city.email.trim()}</span>
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