import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { it as Calendar, mt as ArrowLeft } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.events._id-CfngHHEw.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "mx-auto max-w-3xl px-6 py-24 text-center",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mx-auto h-12 w-12 text-muted-foreground" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-4 font-display text-2xl font-semibold",
			children: "Event not found"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/events",
			className: "mt-4 inline-flex items-center gap-2 text-primary hover:underline",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Events"]
		})
	]
});
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
