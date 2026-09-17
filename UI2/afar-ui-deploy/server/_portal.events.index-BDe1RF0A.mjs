import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { it as Calendar, j as MapPin } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/PortalLayout-qV5-TMvO.mjs";
import { i as getEvents } from "./_ssr/eventService-CgJ8Pe9J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.events.index-BDe1RF0A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EventsPage() {
	const [events, setEvents] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		getEvents().then(setEvents).catch(() => setError("Unable to load events.")).finally(() => setLoading(false));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		section: "newsEvents",
		eyebrow: "Calendar",
		title: "Events & Consultations",
		description: "Forums, workshops, and public consultations across the region."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-6 py-10",
		children: [
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-10 text-center text-sm text-muted-foreground",
				children: "Loading events..."
			}),
			!loading && error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center text-sm text-destructive",
				children: error
			}),
			!loading && !error && events.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border bg-card p-10 text-center text-sm text-muted-foreground",
				children: "No events available at the moment."
			}),
			!loading && !error && events.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
				children: events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/events/$id",
					params: { id: String(e.id) },
					className: "group block overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "gradient-primary p-5 text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-md bg-primary-foreground/10 px-2 py-1 text-xs font-semibold text-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }), new Date(e.start_at).toLocaleDateString()]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 font-display text-lg font-semibold group-hover:text-gold",
							children: e.title?.en ?? ""
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }), e.location || "Location not specified"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 line-clamp-3 text-sm text-foreground/80",
								children: e.content?.en ?? ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 text-sm font-semibold text-primary",
								children: "View event →"
							})
						]
					})]
				}, e.id))
			})
		]
	})] });
}
//#endregion
export { EventsPage as component };
