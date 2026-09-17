import { P as notFound, h as createFileRoute, m as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as getNewsById, i as getNews } from "./_ssr/newsService-CiNVHUG4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.news._id-BeC4CbCT.js
var $$splitNotFoundComponentImporter = () => import("./_portal.news._id-DYkm-Hlu.mjs");
var $$splitComponentImporter = () => import("./_portal.news._id-B-MPmOY3.mjs");
var Route = createFileRoute("/_portal/news/$id")({
	loader: async ({ params }) => {
		const item = await getNewsById(params.id);
		if (!item) throw notFound();
		const allNews = await getNews();
		const index = allNews.findIndex((n) => n.id === params.id);
		const prev = index > 0 ? allNews[index - 1] : null;
		const next = index >= 0 && index < allNews.length - 1 ? allNews[index + 1] : null;
		return {
			item,
			mostRead: allNews.filter((n) => n.id !== item.id).sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5).map((n) => ({
				id: n.id,
				title: n.title,
				date: n.date,
				image: n.image,
				views: n.views ?? 0
			})),
			prev: prev ? {
				id: prev.id,
				title: prev.title
			} : null,
			next: next ? {
				id: next.id,
				title: next.title
			} : null
		};
	},
	head: ({ loaderData }) => ({ meta: [
		{ title: loaderData ? `${loaderData.item.title} — Afar UDCB` : "News — Afar UDCB" },
		{
			name: "description",
			content: loaderData?.item.excerpt ?? "Afar UDCB news article."
		},
		{
			property: "og:title",
			content: loaderData?.item.title ?? "News — Afar UDCB"
		},
		{
			property: "og:description",
			content: loaderData?.item.excerpt ?? "Afar UDCB news article."
		},
		{
			property: "og:type",
			content: "article"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
//#endregion
export { Route as t };
