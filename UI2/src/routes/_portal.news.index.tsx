import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/portal/PortalLayout";
import { getNews, type NewsItem } from "@/services/newsService";
import { Search, Calendar } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
//import { news } from "@/lib/mock-data";


export const Route = createFileRoute("/_portal/news/")({
  head: () => ({ meta: [
    { title: "News — Afar UDCB" },
    { name: "description", content: "Latest news and announcements from the Afar UDCB." },
  ]}),
  component: NewsListPage,

});
function NewsListPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    getNews()
      .then(setNews)
      .catch((error) => {
        console.error("Failed to load news:", error);
      });
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(news.map((n) => n.category))),
  ];

  const filtered = useMemo(
    () =>
      news.filter(
        (n) =>
          (cat === "All" || n.category === cat) &&
          (!q || n.title.toLowerCase().includes(q.toLowerCase()))
      ),
    [news, q, cat]
  );

  
  return (
    <>
      <PageHeader section="newsEvents" eyebrow="Newsroom" title="News & Announcements" description="Updates from directorates, city administrations, and regional programs." />
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search news…" className="h-11 w-full rounded-lg border bg-card pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={"rounded-full border px-3 py-1.5 text-xs font-medium " + (cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground/70 hover:bg-secondary")}>{c}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((n) => (
            <Link key={n.id} to="/news/$id" params={{ id: n.id }} className="group overflow-hidden rounded-xl border bg-card shadow-soft transition hover:shadow-elegant">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={n.image} alt={n.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">{n.category}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(n.date).toLocaleDateString()}</span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug group-hover:text-primary">{n.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{n.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
