import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/password-reset._token-aXgRBUzv.js
var $$splitComponentImporter = () => import("./password-reset._token-BUhJAtqE.mjs");
var Route = createFileRoute("/password-reset/$token")({
	validateSearch: (search) => ({ email: String(search.email ?? "") }),
	head: () => ({ meta: [{ title: "Reset Password — Afar UDCB" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
