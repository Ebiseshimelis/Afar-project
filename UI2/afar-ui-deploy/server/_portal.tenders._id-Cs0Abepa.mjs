import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { mt as ArrowLeft } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.tenders._id-Cs0Abepa.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
	className: "mx-auto max-w-7xl px-4 py-16 text-center md:px-6",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-bold",
			children: "Tender not found"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: "The requested tender could not be found."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/tenders",
			className: "mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Tenders"]
		})
	]
});
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
