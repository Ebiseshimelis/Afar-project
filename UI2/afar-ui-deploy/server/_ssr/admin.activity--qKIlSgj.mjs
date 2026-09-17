import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { ht as Activity } from "../_libs/lucide-react.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.activity--qKIlSgj.js
var import_jsx_runtime = require_jsx_runtime();
var activity = [
	{
		id: "1",
		user: "Ahmed Hassan",
		action: "Published news",
		target: "Semera Housing Program Phase II",
		date: "2026-07-20 09:41"
	},
	{
		id: "2",
		user: "Fatuma Ali",
		action: "Edited tender",
		target: "AFUDCB/T/2026/014",
		date: "2026-07-20 08:12"
	},
	{
		id: "3",
		user: "Ibrahim Yusuf",
		action: "Deleted vacancy",
		target: "Junior Planner",
		date: "2026-07-19 17:03"
	},
	{
		id: "4",
		user: "Ahmed Hassan",
		action: "Created role",
		target: "Communications Editor",
		date: "2026-07-19 14:20"
	},
	{
		id: "5",
		user: "Fatuma Ali",
		action: "Uploaded document",
		target: "Annual Report 2025.pdf",
		date: "2026-07-19 11:45"
	}
];
function ActivityAdmin() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
		title: "User Activity",
		description: "Recent actions performed by admin users."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border bg-card shadow-soft",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y",
			children: activity.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-4 px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: a.user
							}),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: a.action.toLowerCase()
							}),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: a.target
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: a.date
					})]
				})]
			}, a.id))
		})
	})] });
}
//#endregion
export { ActivityAdmin as component };
