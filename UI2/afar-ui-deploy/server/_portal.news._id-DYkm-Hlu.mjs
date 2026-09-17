import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.news._id-DYkm-Hlu.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "mx-auto max-w-3xl px-6 py-24 text-center",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "font-display text-2xl font-semibold",
		children: "Article not found"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/news",
		className: "mt-4 inline-flex text-primary hover:underline",
		children: "← Back to news"
	})]
});
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
