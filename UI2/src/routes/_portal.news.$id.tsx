import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getNews, getNewsById } from "@/services/newsService";
import {
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  Share2,
  Eye,
  Tag,
} from "lucide-react";

type MostReadItem = {
  id: string;
  title: string;
  date: string;
  image: string;
  views: number;
};

export const Route = createFileRoute("/_portal/news/$id")({
  loader: async ({ params }) => {
    // Get the selected news article directly from the backend API.
    const item = await getNewsById(params.id);

    if (!item) {
      throw notFound();
    }

    // Get the full news list from the backend API.
    // This is used for Previous / Next / Most Read.
    const allNews = await getNews();

    const index = allNews.findIndex((n) => n.id === params.id);

    const prev = index > 0 ? allNews[index - 1] : null;

    const next =
      index >= 0 && index < allNews.length - 1
        ? allNews[index + 1]
        : null;

    const mostRead: MostReadItem[] = allNews
      .filter((n) => n.id !== item.id)
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .slice(0, 5)
      .map((n) => ({
        id: n.id,
        title: n.title,
        date: n.date,
        image: n.image,
        views: n.views ?? 0,
      }));

    return {
      item,
      mostRead,

      prev: prev
        ? {
            id: prev.id,
            title: prev.title,
          }
        : null,

      next: next
        ? {
            id: next.id,
            title: next.title,
          }
        : null,
    };
  },

  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.item.title} — Afar UDCB`
          : "News — Afar UDCB",
      },
      {
        name: "description",
        content:
          loaderData?.item.excerpt ?? "Afar UDCB news article.",
      },
      {
        property: "og:title",
        content: loaderData?.item.title ?? "News — Afar UDCB",
      },
      {
        property: "og:description",
        content:
          loaderData?.item.excerpt ?? "Afar UDCB news article.",
      },
      {
        property: "og:type",
        content: "article",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),

  component: NewsDetailPage,

  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <div className="font-display text-2xl font-semibold">
        Article not found
      </div>

      <Link
        to="/news"
        className="mt-4 inline-flex text-primary hover:underline"
      >
        ← Back to news
      </Link>
    </div>
  ),
});

function formatViews(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);
}

function NewsDetailPage() {
  const { item, mostRead, prev, next } = Route.useLoaderData();

  return (
    <article className="animate-fade-in-up">
      {/* Body + sidebar */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-10">
        <Link
          to="/news"
          className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to news
        </Link>

        <div className="mt-5 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0">
            {/* Featured image */}
            <div className="overflow-hidden rounded-xl border shadow-soft">
              <img
                src={item.image}
                alt={item.title}
                className="h-56 w-full object-cover sm:h-72 md:h-[26rem]"
              />
            </div>

            {/* Category */}
            <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-foreground">
              <Tag className="h-3 w-3" />
              {item.category}
            </span>

            {/* Title */}
            <h1 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              {item.title}
            </h1>

            {/* Metadata */}
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-b pb-4 text-xs text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {new Date(item.date).toLocaleDateString()}
              </span>

              {item.author && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  {item.author}
                </span>
              )}

              {typeof item.views === "number" && (
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  {formatViews(item.views)} views
                </span>
              )}

              <button
                type="button"
                className="ml-auto inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-secondary"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
            </div>

            {/* Excerpt */}
            <p className="mt-6 border-l-4 border-gold pl-4 font-display text-lg leading-relaxed text-foreground/90 sm:text-xl">
              {item.excerpt}
            </p>

            {/* Article body */}
            <div className="prose prose-neutral mt-6 max-w-none space-y-4 text-base leading-relaxed text-foreground/80">
              <p>{item.body}</p>
            </div>

            {/* Previous / Next */}
            <nav
              aria-label="Article navigation"
              className="mt-10 grid gap-3 border-t pt-6 sm:grid-cols-2"
            >
              {prev ? (
                <Link
                  to="/news/$id"
                  params={{ id: prev.id }}
                  className="group rounded-xl border bg-card p-4 shadow-soft transition hover:shadow-elegant"
                >
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <ArrowLeft className="h-3 w-3" />
                    Previous
                  </div>

                  <div className="mt-1 line-clamp-2 text-sm font-medium group-hover:text-primary">
                    {prev.title}
                  </div>
                </Link>
              ) : (
                <span />
              )}

              {next && (
                <Link
                  to="/news/$id"
                  params={{ id: next.id }}
                  className="group rounded-xl border bg-card p-4 text-right shadow-soft transition hover:shadow-elegant sm:col-start-2"
                >
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Next
                    <ArrowRight className="h-3 w-3" />
                  </div>

                  <div className="mt-1 line-clamp-2 text-sm font-medium group-hover:text-primary">
                    {next.title}
                  </div>
                </Link>
              )}
            </nav>
          </div>

          {/* Most read */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-display text-lg font-bold">
              Most read
              <span className="mt-2 block h-0.5 w-12 rounded-full bg-gold" />
            </h2>

            <ul className="mt-5 flex flex-col gap-4">
              {mostRead.map((n: MostReadItem, i: number) => (
                <li key={n.id}>
                  <Link
                    to="/news/$id"
                    params={{ id: n.id }}
                    className="group flex items-start gap-3 rounded-xl border bg-card p-3 shadow-soft transition hover:shadow-elegant"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={n.image}
                        alt={n.title}
                        loading="lazy"
                        width={72}
                        height={56}
                        className="h-14 w-[72px] rounded-lg object-cover"
                      />

                      <span className="absolute -left-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary">
                        {n.title}
                      </h3>

                      <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(n.date).toLocaleDateString()}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatViews(n.views)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </article>
  );
}