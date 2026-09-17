import { P as notFound, h as createFileRoute, m as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as getMultimediaItem, i as getMultimedia } from "./_ssr/multimediaService-KsWseGkg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.multimedia.videos._id-CaKzRriu.js
var $$splitNotFoundComponentImporter = () => import("./_portal2.multimedia.videos._id-B174XvoZ.mjs");
var $$splitComponentImporter = () => import("./_portal.multimedia.videos._id-CwiHwWyz.mjs");
var Route = createFileRoute("/_portal/multimedia/videos/$id")({
	loader: async ({ params }) => {
		const item = await getMultimediaItem(params.id);
		if (!item || item.type !== "video") throw notFound();
		return {
			item,
			videos: (await getMultimedia()).filter((video) => video.type === "video" && video.status === "published")
		};
	},
	head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.item.title} — Afar UDCB` : "Video — Afar UDCB" }, {
		name: "description",
		content: loaderData?.item.description || "Video from Afar UDCB."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
//#endregion
export { Route as t };
