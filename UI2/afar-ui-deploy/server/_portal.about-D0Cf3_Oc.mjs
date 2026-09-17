import { t as API_BASE } from "./_ssr/authService-tLH6lGQn.mjs";
import { h as createFileRoute, m as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.about-D0Cf3_Oc.js
async function getAbout() {
	const response = await fetch(`${API_BASE}/about`);
	if (!response.ok) throw new Error("Failed to fetch About information");
	return response.json();
}
var $$splitComponentImporter = () => import("./_portal.about-DvFPmr-v.mjs");
var Route = createFileRoute("/_portal/about")({
	head: () => ({ meta: [{ title: "About - Afar UDCB" }, {
		name: "description",
		content: "About the Afar Regional State Urban Development and Construction Bureau."
	}] }),
	loader: async () => {
		return await getAbout();
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
