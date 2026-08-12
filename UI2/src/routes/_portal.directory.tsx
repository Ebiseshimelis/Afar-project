import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PortalLayout";
import { directory } from "@/lib/mock-data";
import { Search, Phone, Mail, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type DirectorySearch = { type?: "directorates" | "city-admins"; name?: string };

const TYPE_TO_CATEGORY: Record<string, string> = {
  directorates: "Directorates",
  "city-admins": "City Admins",
};

export const Route = createFileRoute("/_portal/directory")({
  validateSearch: (s: Record<string, unknown>): DirectorySearch => {
    const out: DirectorySearch = {};
    if (s.type === "directorates" || s.type === "city-admins") out.type = s.type;
    if (typeof s.name === "string" && s.name.length) out.name = s.name;
    return out;
  },
  head: () => ({ meta: [
    { title: "Directory — Afar UDCB" },
    { name: "description", content: "Browse directorates and city administrations across the Afar Regional State." },
  ]}),
  component: DirectoryPage,
});

function DirectoryPage() {
  const { type, name } = Route.useSearch();
  const navigate = Route.useNavigate();
  const initialCat = (type && TYPE_TO_CATEGORY[type]) || "All";
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>(initialCat);

  useEffect(() => {
    setCat((type && TYPE_TO_CATEGORY[type]) || "All");
  }, [type]);

  const categories = ["All","Directorates"];
// ❌ Replace your existing filtered block with this:
const filtered = useMemo(() => {
  return directory.filter((d) => {
    // 1. ALWAYS ignore City Admins (Only allow Directorates)
    if (d.category !== "Directorates") return false;

    // 2. Filter by specific item if selected from URL name
    if (name && d.name !== name) return false;

    // 3. Search bar query filter
    const matchesQ =
      !q ||
      d.name.toLowerCase().includes(q.toLowerCase()) ||
      d.head.toLowerCase().includes(q.toLowerCase());

    return matchesQ;
  });
}, [q, name]);

  const clearName = () => navigate({ search: (prev: DirectorySearch) => ({ ...prev, name: undefined }) });

  return (
    <>
      <PageHeader section="directorates" eyebrow="Organization" title="Directory" description="Directorates, offices, and city administrations." />
      <section className="mx-auto max-w-7xl px-6 py-10">
        {name && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1.5 text-xs font-medium">
            <span className="text-muted-foreground">Filtered:</span>
            <span>{name}</span>
            <button onClick={clearName} aria-label="Clear filter" className="ml-1 rounded-full p-0.5 hover:bg-background">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search directorates or heads…" className="h-11 w-full rounded-lg border bg-card pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={"rounded-full border px-3 py-1.5 text-xs font-medium " + (cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground/70 hover:bg-secondary")}>{c}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <div key={d.id} className="rounded-xl border bg-card p-5 shadow-soft transition hover:shadow-elegant">
              <div className="flex items-start gap-4">
                <img
                  src={d.photo}
                  alt={d.head}
                  loading="lazy"
                  width={64}
                  height={64}
                  className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-primary/10"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{d.category}</div>
                  <h3 className="mt-0.5 line-clamp-2 font-display text-sm font-semibold leading-tight sm:text-base">{d.name}</h3>
                  <div className="mt-1 truncate text-sm font-medium text-primary">{d.head}</div>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 border-t pt-3 text-sm">
                <a href={`tel:${d.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Phone className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{d.phone}</span></a>
                <a href={`mailto:${d.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary"><Mail className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{d.email}</span></a>
              </div>
            </div>
          ))}
        </div>

      </section>
    </>
  );
}
