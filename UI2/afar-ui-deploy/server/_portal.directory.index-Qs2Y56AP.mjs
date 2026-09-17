import { h as createFileRoute, m as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.directory.index-Qs2Y56AP.js
var $$splitComponentImporter = () => import("./_portal.directory.index-n3JDes5Q.mjs");
var Route = createFileRoute("/_portal/directory/")({
	validateSearch: (s) => {
		const out = {};
		if (s.type === "directorates" || s.type === "city-admins") out.type = s.type;
		if (typeof s.name === "string" && s.name.length) out.name = s.name;
		return out;
	},
	head: () => ({ meta: [{ title: "Directorates — Afar UDCB" }, {
		name: "description",
		content: "Browse directorates across the Afar Regional State."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
