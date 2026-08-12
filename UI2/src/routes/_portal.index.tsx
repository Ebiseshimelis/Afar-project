import { createFileRoute, Link } from "@tanstack/react-router";
import { news, tenders, vacancies, events, directory, portfolioImages } from "@/lib/mock-data";
import { ArrowRight, Calendar, Briefcase, FileText, Newspaper, Phone, Mail, MapPin, Building2, ChevronRight } from "lucide-react";
import afarHero from "@/assets/background.png";

export const Route = createFileRoute("/_portal/")({
  head: () => ({
    meta: [
      { title: "Home — Afar Regional Government Portal" },
      { name: "description", content: "Official portal of the Afar Regional State Urban Development and Construction Bureau — latest news, tenders, and services." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const latestNews = news.slice(0, 4);
  const latestTenders = tenders.filter((t) => t.status === "Open").slice(0, 3);
  const latestVacancies = vacancies.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="animate-fade-in-up">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <img
          src={afarHero}
          alt="Afar regional landscape at golden hour with government building"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
          width={1920}
          height={1088}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/45 to-primary/60" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.9 0.15 75) 0, transparent 40%), radial-gradient(circle at 80% 80%, oklch(0.5 0.1 258) 0, transparent 40%)" }} />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="text-primary-foreground">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-gold ring-1 ring-primary-foreground/20">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Official Government Portal
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                Building a modern, <span className="text-gold">connected</span> Afar
              </h1>
              <p className="mt-4 max-w-xl text-lg text-primary-foreground/80">
                The Afar Regional State Urban Development and Construction Bureau delivers services, information, and opportunities to citizens, contractors, and partners.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/directory" className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-gold-foreground transition hover:brightness-110">
                  Explore Directorate <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/tenders" className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/5 px-5 py-3 text-sm font-semibold text-primary-foreground backdrop-blur hover:bg-primary-foreground/10">
                  View Tenders
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-primary-foreground/10 pt-6">
                <Stat label="Directorates" value="12+" />
                <Stat label="City Admins" value="7" />
                <Stat label="Active Tenders" value={String(tenders.filter(t => t.status === "Open").length)} />
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <QuickTile icon={<Newspaper className="h-5 w-5" />} label="News" to="/news" />
                <QuickTile icon={<FileText className="h-5 w-5" />} label="Tenders" to="/tenders" />
                <QuickTile icon={<Briefcase className="h-5 w-5" />} label="Vacancies" to="/vacancies" />
                <QuickTile icon={<Building2 className="h-5 w-5" />} label="Directory" to="/directory" />
                <QuickTile icon={<Calendar className="h-5 w-5" />} label="Events" to="/events" />
                <QuickTile icon={<FileText className="h-5 w-5" />} label="Publications" to="/publications" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links strip (mobile) */}
      <section className="border-b bg-card lg:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-2 px-4 py-4">
          {[
            { icon: Newspaper, label: "News", to: "/news" as const },
            { icon: FileText, label: "Tenders", to: "/tenders" as const },
            { icon: Briefcase, label: "Vacancies", to: "/vacancies" as const },
            { icon: Building2, label: "Directory", to: "/directory" as const },
            { icon: Calendar, label: "Events", to: "/events" as const },
            { icon: Phone, label: "Contact", to: "/contact" as const },
          ].map((q) => (
            <Link key={q.to} to={q.to} className="flex flex-col items-center gap-1 rounded-lg border bg-background px-2 py-3 text-xs font-medium text-foreground/80">
              <q.icon className="h-4 w-4 text-primary" />
              {q.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Latest News */}
      <SectionHeading eyebrow="Newsroom" title="Latest News" href="/news" />
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {latestNews.map((n) => (
            <Link key={n.id} to="/news/$id" params={{ id: n.id }} className="group overflow-hidden rounded-xl border bg-card shadow-soft transition hover:shadow-elegant">
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img src={n.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">{n.category}</span>
                  <span>·</span>
                  <time>{formatDate(n.date)}</time>
                </div>
                <h3 className="mt-2 line-clamp-2 font-display text-base font-semibold leading-snug text-foreground group-hover:text-primary">{n.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tenders + Vacancies */}
      <section className="border-y bg-secondary/40 py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Procurement" title="Open Tenders" href="/tenders" inline />
            <div className="mt-5 space-y-3">
              {latestTenders.map((t) => (
                <Link key={t.id} to="/tenders/$id" params={{ id: t.id }} className="block rounded-xl border bg-card p-4 transition hover:shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-muted-foreground">{t.reference}</div>
                      <div className="mt-1 line-clamp-2 font-medium text-foreground">{t.title}</div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3" /> {t.category}</span>
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Closes {formatDate(t.deadline)}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading eyebrow="Careers" title="Vacancies" href="/vacancies" inline />
            <div className="mt-5 space-y-3">
              {latestVacancies.map((v) => (
                <Link key={v.id} to="/vacancies" className="block rounded-xl border bg-card p-4 transition hover:shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-foreground">{v.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{v.department}</div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {v.location}</span>
                        <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> {v.type}</span>
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Closes {formatDate(v.deadline)}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio / Projects gallery */}
      <SectionHeading eyebrow="Portfolio" title="Projects & Milestones" href="/news" />
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3">
          {portfolioImages.map((p, i) => (
            <div
              key={i}
              className={
                "group relative overflow-hidden rounded-xl border bg-secondary shadow-soft " +
                (i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-[4/3]" : "aspect-[4/3]")
              }
            >
              <img
                src={p.url}
                alt={p.caption}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-3">
                <div className="text-xs font-medium text-primary-foreground">{p.caption}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      <SectionHeading eyebrow="Calendar" title="Upcoming Events" href="/events" />
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="grid gap-4 md:grid-cols-3">
          {upcomingEvents.map((e) => (
            <div key={e.id} className="rounded-xl border bg-card p-5 shadow-soft">
              <div className="inline-flex items-center gap-2 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
                <Calendar className="h-3 w-3" /> {formatDate(e.date)}
              </div>
              <h3 className="mt-3 font-display text-base font-semibold">{e.title}</h3>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {e.location}
              </div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{e.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact block */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="overflow-hidden rounded-2xl gradient-primary text-primary-foreground shadow-elegant">
          <div className="grid gap-6 p-8 md:grid-cols-3 md:p-12">
            <div className="md:col-span-2">
              <div className="text-xs font-semibold uppercase tracking-widest text-gold">Get in touch</div>
              <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">We're here to serve citizens, contractors, and partners.</h2>
              <p className="mt-2 max-w-xl text-primary-foreground/80">Reach any directorate or city administration through the contact channels below, or send us a message.</p>
              <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-gold-foreground hover:brightness-110">
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-gold" /> 033-666-0577</div>
              <div className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 text-gold" /> info@afarudcb.gov.et</div>
              <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-gold" /> Semera, Afar Regional State, Ethiopia</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold text-gold md:text-3xl">{value}</div>
      <div className="text-xs uppercase tracking-wider text-primary-foreground/70">{label}</div>
    </div>
  );
}

function QuickTile({ icon, label, to }: { icon: React.ReactNode; label: string; to: "/news" | "/tenders" | "/vacancies" | "/directory" | "/events" | "/publications" }) {
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-4 backdrop-blur transition hover:bg-primary-foreground/10">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-gold text-gold-foreground">{icon}</div>
      <div>
        <div className="font-medium text-primary-foreground">{label}</div>
        <div className="text-xs text-primary-foreground/60">Open →</div>
      </div>
    </Link>
  );
}

function SectionHeading({ eyebrow, title, href, inline }: { eyebrow: string; title: string; href: "/news" | "/tenders" | "/vacancies" | "/events" | "/publications" | "/directory"; inline?: boolean }) {
  return (
    <div className={inline ? "" : "mx-auto max-w-7xl px-6 pt-14 pb-6"}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-gold">{eyebrow}</div>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
        </div>
        <Link to={href} className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
