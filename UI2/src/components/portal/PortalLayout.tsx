import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import { FaFacebookF, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { directory } from "@/lib/mock-data";
import { useLanguage } from "@/lib/language";
import logo from "@/assets/logo.png";
import { useSectionBackground, type SectionKey } from "@/lib/site-images";

type NavChild = {
  to: string;
  label: string;
  search?: Record<string, string>;
};

type NavItem = {
  to: string;
  label: string;
  children?: NavChild[];
};

function isActivePath(pathname: string, to: string) {
  if (to === "/") return pathname === "/";

  const base = "/" + to.split("/").filter(Boolean)[0];

  return pathname === base || pathname.startsWith(base + "/");
}

/*
|--------------------------------------------------------------------------
| AUDCB SOCIAL MEDIA LINKS
|--------------------------------------------------------------------------
|
| The official Facebook, Telegram and X accounts have not yet been
| verified, so DO NOT use guessed URLs.
|
| When the official accounts are confirmed, replace the empty strings
| below with the real URLs.
|
| Example:
|
| facebook: "https://www.facebook.com/official-page",
| telegram: "https://t.me/official-channel",
| x: "https://x.com/official-account",
|
|--------------------------------------------------------------------------
*/

const SOCIAL_LINKS = {
  facebook: "",
  telegram: "",
  x: "",
};

export function PortalLayout() {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);

  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const { lang, setLang, t } = useLanguage();

  const MAIN_NAV: NavItem[] = useMemo(() => {
    const directorates = directory.filter(
      (d) => d.category === "Directorates"
    );

    const label = (d: typeof directory[number]) =>
      lang === "am" && d.nameAm ? d.nameAm : d.name;

    return [
      { to: "/", label: t("home") },

      { to: "/about", label: t("about") },

      {
        to: "/news",
        label: t("news"),
        children: [
          { to: "/news", label: t("latestNews") },
          { to: "/events", label: t("upcomingEvents") },
        ],
      },

      { to: "/tenders", label: t("tenders") },

      {
        to: "/multimedia/images",
        label: t("multimedia"),
        children: [
          { to: "/multimedia/images", label: t("imageGallery") },
          { to: "/multimedia/videos", label: t("videoGallery") },
        ],
      },

      {
        to: "/directory",
        label: t("directorate"),
        children: directorates.map((d) => ({
          to: "/directory",
          label: label(d),
          search: {
            type: "directorates",
            name: d.name,
          },
        })),
      },

      { to: "/city-admins", label: t("cityAdmins") },

      { to: "/vacancies", label: t("vacancies") },

      { to: "/publications", label: t("publications") },

      { to: "/contact", label: t("contact") },
    ];
  }, [t, lang]);

  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* Top utility bar */}
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">

          <div className="flex items-center gap-5">

            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3 w-3" />
              033-666-0577
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3 w-3" />
              info@afarudcb.gov.et
            </span>

          </div>

          {/* Social media */}
          <div className="flex items-center gap-3 text-primary-foreground/80">

            {/* Facebook */}
            <a
              href={SOCIAL_LINKS.facebook || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-gold"
            >
              <FaFacebookF className="h-3.5 w-3.5" />
            </a>

            {/* X */}
            <a
              href={SOCIAL_LINKS.x || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="hover:text-gold"
            >
              <FaXTwitter className="h-3.5 w-3.5" />
            </a>

            {/* Telegram */}
            <a
              href={SOCIAL_LINKS.telegram || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="hover:text-gold"
            >
              <FaTelegramPlane className="h-3.5 w-3.5" />
            </a>

            <span className="mx-2 h-3 w-px bg-primary-foreground/20" />

            {/* Language */}
            <button
              onClick={() => setLang("en")}
              className={
                "transition-colors " +
                (lang === "en"
                  ? "text-gold"
                  : "hover:text-gold")
              }
              aria-pressed={lang === "en"}
            >
              EN
            </button>

            <button
              onClick={() => setLang("am")}
              className={
                "transition-colors " +
                (lang === "am"
                  ? "text-gold"
                  : "hover:text-gold")
              }
              aria-pressed={lang === "am"}
            >
              አማ
            </button>

          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">

        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 md:px-6">

          <Link
            to="/"
            className="flex min-w-0 items-center gap-3"
          >

            <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/5 ring-1 ring-primary/10 shadow-soft">

              <img
                src={logo}
                alt="Afar UDCB logo"
                className="h-full w-full object-cover"
              />

            </div>

            <div className="min-w-0">

              <div className="truncate font-display text-sm font-bold leading-tight text-foreground sm:text-base">
                {lang === "am"
                  ? "የአፋር ክልል መንግስት"
                  : "Afar Regional Government"}
              </div>

              <div className="truncate text-xs text-muted-foreground">
                {lang === "am"
                  ? "የከተማ ልማት እና ግንባታ ቢሮ"
                  : "Urban Development & Construction Bureau"}
              </div>

            </div>

          </Link>

          {/* Mobile menu button */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-none border border-border lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Desktop navigation */}
          <nav className="col-span-2 hidden lg:col-span-1 lg:block">

            <ul className="flex items-center gap-1">

              {MAIN_NAV.map((item) => {

                const active = isActivePath(pathname, item.to);
                const hasChildren = !!item.children?.length;

                return (
                  <li
                    key={item.label}
                    className={
                      hasChildren
                        ? "group relative"
                        : undefined
                    }
                  >

                    <Link
                      to={item.to}
                      className={
                        "relative inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors " +
                        (active
                          ? "text-primary"
                          : "text-foreground/70 hover:text-primary")
                      }
                    >

                      {item.label}

                      {hasChildren && (
                        <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:rotate-180" />
                      )}

                      {active && (
                        <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gold" />
                      )}

                    </Link>

                    {hasChildren && (
                      <div className="pointer-events-none absolute left-0 top-full z-50 pt-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">

                        <ul className="min-w-[320px] overflow-hidden rounded-none border bg-card py-1 shadow-elegant ring-1 ring-border">

                          {item.children!.map((c) => (
                            <li key={c.label}>

                              <Link
                                to={c.to}
                                search={c.search as never}
                                className="block px-4 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary"
                              >
                                {c.label}
                              </Link>

                            </li>
                          ))}

                        </ul>

                      </div>
                    )}

                  </li>
                );
              })}

            </ul>

          </nav>

        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="border-t bg-card lg:hidden">

            <ul className="mx-auto max-w-7xl px-4 py-2">

              {MAIN_NAV.map((item) => {

                const active = isActivePath(pathname, item.to);
                const hasChildren = !!item.children?.length;
                const isSubOpen = openSub === item.label;

                return (
                  <li key={item.label}>

                    {hasChildren ? (

                      <button
                        onClick={() =>
                          setOpenSub(
                            isSubOpen
                              ? null
                              : item.label
                          )
                        }
                        className={
                          "flex w-full items-center justify-between rounded-full px-3 py-2.5 text-sm font-medium " +
                          (active
                            ? "bg-secondary text-primary"
                            : "text-foreground/80")
                        }
                      >

                        <span>{item.label}</span>

                        <ChevronDown
                          className={
                            "h-4 w-4 transition-transform " +
                            (isSubOpen
                              ? "rotate-180"
                              : "")
                          }
                        />

                      </button>

                    ) : (

                      <Link
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={
                          "block rounded-full px-3 py-2.5 text-sm font-medium " +
                          (active
                            ? "bg-secondary text-primary"
                            : "text-foreground/80")
                        }
                      >
                        {item.label}
                      </Link>

                    )}

                    {hasChildren && isSubOpen && (

                      <ul className="ml-3 border-l pl-3">

                        {item.children!.map((c) => (

                          <li key={c.label}>

                            <Link
                              to={c.to}
                              search={c.search as never}
                              onClick={() => {
                                setOpen(false);
                                setOpenSub(null);
                              }}
                              className="block rounded-full px-3 py-2 text-sm text-foreground/70 hover:text-primary"
                            >
                              {c.label}
                            </Link>

                          </li>

                        ))}

                      </ul>

                    )}

                  </li>
                );
              })}

              {/* Mobile language */}
              <li className="mt-2 flex items-center gap-2 border-t px-3 pt-3">

                <span className="text-xs text-muted-foreground">
                  Language:
                </span>

                <button
                  onClick={() => setLang("en")}
                  className={
                    "rounded-full border px-2 py-1 text-xs " +
                    (lang === "en"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "")
                  }
                >
                  EN
                </button>

                <button
                  onClick={() => setLang("am")}
                  className={
                    "rounded-full border px-2 py-1 text-xs " +
                    (lang === "am"
                      ? "border-primary bg-primary text-primary-foreground"
                      : "")
                  }
                >
                  አማ
                </button>

              </li>

            </ul>

          </nav>
        )}

      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />

    </div>
  );
}

function SiteFooter() {

  const { t } = useLanguage();

  const quickLinks: {
    to: string;
    label: string;
  }[] = [
    { to: "/", label: t("home") },
    { to: "/about", label: t("about") },
    { to: "/directory", label: t("directorate") },
    { to: "/news", label: t("news") },
    { to: "/contact", label: t("contact") },
    { to: "/admin/login", label: t("staffLogin") },
  ];

  return (

    <footer className="mt-16 bg-sidebar text-sidebar-foreground">

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">

        {/* Footer brand */}

        <div>

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-sidebar-accent">

              <img
                src={logo}
                alt="Afar UDCB logo"
                className="h-10 w-10 object-contain"
              />

            </div>

            <div>

              <div className="font-display text-sm font-semibold">
                Afar Regional Government
              </div>

              <div className="text-xs text-sidebar-foreground/70">
                UDCB
              </div>

            </div>

          </div>

          <p className="mt-4 text-sm text-sidebar-foreground/70">
            Modernizing urban development and construction
            services across the Afar Regional State.
          </p>

        </div>

        {/* Quick links */}

        <div>

          <h4 className="font-display text-sm font-semibold text-gold">
            {t("quickLinks")}
          </h4>

          <ul className="mt-3 space-y-2 text-sm text-sidebar-foreground/80">

            {quickLinks.map((n) => (

              <li key={n.to}>

                <Link
                  to={n.to}
                  className="hover:text-gold"
                >
                  {n.label}
                </Link>

              </li>

            ))}

          </ul>

        </div>

        {/* Contact */}

        <div>

          <h4 className="font-display text-sm font-semibold text-gold">
            {t("contact")}
          </h4>

          <ul className="mt-3 space-y-2 text-sm text-sidebar-foreground/80">

            <li className="flex items-start gap-2">

              <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />

              033-666-0577

            </li>

            <li className="flex items-start gap-2">

              <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />

              033-666-0576

            </li>

            <li className="flex items-start gap-2">

              <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />

              info@afarudcb.gov.et

            </li>

          </ul>

        </div>

        {/* Social media */}

        <div>

          <h4 className="font-display text-sm font-semibold text-gold">
            {t("follow")}
          </h4>

          <div className="mt-3 flex gap-2">

            {/* Facebook */}
            <a
              href={SOCIAL_LINKS.facebook || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent hover:bg-gold hover:text-gold-foreground"
            >
              <FaFacebookF className="h-4 w-4" />
            </a>

            {/* X */}
            <a
              href={SOCIAL_LINKS.x || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent hover:bg-gold hover:text-gold-foreground"
            >
              <FaXTwitter className="h-4 w-4" />
            </a>

            {/* Telegram */}
            <a
              href={SOCIAL_LINKS.telegram || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent hover:bg-gold hover:text-gold-foreground"
            >
              <FaTelegramPlane className="h-4 w-4" />
            </a>

          </div>

        </div>

      </div>

      {/* Copyright */}

      <div className="border-t border-sidebar-border">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-sidebar-foreground/60 md:flex-row">

          <div>
            © {new Date().getFullYear()} Afar UDCB. All rights reserved.
          </div>

          <div>
            Designed and Developed by Skylink Technologies
          </div>

        </div>

      </div>

    </footer>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  section = "default",
  backgroundImage,
}: {
  eyebrow?: string;
  title: string;
  description?: string;

  /** Which managed background to use (admin-configurable). */
  section?: SectionKey;

  /** Explicit override, e.g. an image URL coming from the API. */
  backgroundImage?: string;
}) {

  const managed = useSectionBackground(section);

  const bg = backgroundImage || managed;

  return (

    <section className="relative overflow-hidden border-b">

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bg})`,
        }}
        aria-hidden
      />

      <div
        className="absolute inset-0 bg-gradient-to-r from-primary/45 via-primary/25 to-primary/10"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 text-primary-foreground sm:px-6 md:py-20">

        {eyebrow && (

          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium tracking-wide text-gold ring-1 ring-primary-foreground/25 backdrop-blur">

            <ChevronDown className="h-3 w-3 rotate-[-90deg]" />

            {eyebrow}

          </div>

        )}

        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight drop-shadow-md sm:text-3xl md:text-5xl">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-2xl text-primary-foreground/95 drop-shadow sm:text-base md:text-lg">
            {description}
          </p>
        )}

      </div>

    </section>
  );
}