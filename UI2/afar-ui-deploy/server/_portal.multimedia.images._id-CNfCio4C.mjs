import { P as notFound, h as createFileRoute, m as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as getMultimediaItem, i as getMultimedia } from "./_ssr/multimediaService-KsWseGkg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.multimedia.images._id-CNfCio4C.js
var $$splitNotFoundComponentImporter = () => import("./_portal.multimedia.images._id-VgoSzYxC.mjs");
var $$splitComponentImporter = () => import("./_portal.multimedia.images._id-DDpt-DT3.mjs");
var Route = createFileRoute("/_portal/multimedia/images/$id")({
	loader: async ({ params }) => {
		const item = await getMultimediaItem(params.id);
		if (!item || item.type !== "image") throw notFound();
		return {
			item,
			images: (await getMultimedia()).filter((image) => image.type === "image" && image.status === "published")
		};
	},
	head: ({ loaderData }) => ({ meta: [
		{ title: loaderData ? `${loaderData.item.title} — Afar UDCB` : "Image — Afar UDCB" },
		{
			name: "description",
			content: loaderData?.item.description || "Image from Afar UDCB."
		},
		{
			property: "og:title",
			content: loaderData?.item.title || "Image — Afar UDCB"
		},
		{
			property: "og:description",
			content: loaderData?.item.description || "Image from Afar UDCB."
		},
		{
			property: "og:type",
			content: "article"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
//#endregion
export { Route as t };
