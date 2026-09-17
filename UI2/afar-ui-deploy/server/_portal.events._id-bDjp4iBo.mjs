import { P as notFound, h as createFileRoute, m as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as getEvents, r as getEvent } from "./_ssr/eventService-CgJ8Pe9J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.events._id-bDjp4iBo.js
var $$splitNotFoundComponentImporter = () => import("./_portal.events._id-CfngHHEw.mjs");
var $$splitComponentImporter = () => import("./_portal.events._id-DnrN3L_G.mjs");
var Route = createFileRoute("/_portal/events/$id")({
	loader: async ({ params }) => {
		const item = await getEvent(params.id);
		if (!item) throw notFound();
		return {
			item,
			events: await getEvents()
		};
	},
	head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.item.title?.en ?? "Event"} — Afar UDCB` : "Event — Afar UDCB" }, {
		name: "description",
		content: loaderData?.item.content?.en || "Event from Afar UDCB."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
//#endregion
export { Route as t };
