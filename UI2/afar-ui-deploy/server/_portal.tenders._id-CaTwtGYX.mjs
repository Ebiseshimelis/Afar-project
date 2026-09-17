import { P as notFound, h as createFileRoute, m as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { r as getTender } from "./_ssr/tenderService-FaLrKaDE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.tenders._id-CaTwtGYX.js
var $$splitNotFoundComponentImporter = () => import("./_portal.tenders._id-Cs0Abepa.mjs");
var $$splitComponentImporter = () => import("./_portal.tenders._id-D0nh1h4-.mjs");
var Route = createFileRoute("/_portal/tenders/$id")({
	loader: async ({ params }) => {
		try {
			const item = await getTender(params.id);
			if (!item) throw notFound();
			return { item };
		} catch (error) {
			console.error("Failed to load tender:", error);
			throw notFound();
		}
	},
	head: ({ loaderData }) => {
		const title = loaderData?.item.title?.en || loaderData?.item.title?.am || "Tender";
		const description = loaderData?.item.content?.en || loaderData?.item.content?.am || "Tender details.";
		return { meta: [{ title: `${title} â€” Tender` }, {
			name: "description",
			content: description
		}] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
//#endregion
export { Route as t };
