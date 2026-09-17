import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { X as Clock, it as Calendar, j as MapPin, mt as ArrowLeft } from "./_libs/lucide-react.mjs";
import { t as Route } from "./_portal.events._id-bDjp4iBo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.events._id-DnrN3L_G.js
var import_jsx_runtime = require_jsx_runtime();
function EventDetailPage() {
	const { item, events } = Route.useLoaderData();
	const startDate = new Date(item.start_at);
	const endDate = new Date(item.end_at);
	const otherEvents = events.filter((event) => event.id !== item.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/events",
				className: "mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Events"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "overflow-hidden rounded-xl border bg-card shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "gradient-primary p-6 text-primary-foreground md:p-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 rounded-md bg-primary-foreground/10 px-3 py-2 text-sm font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4" }), startDate.toLocaleDateString()]
								}), item.status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "inline-flex items-center rounded-md bg-primary-foreground/10 px-3 py-2 text-sm font-semibold capitalize",
									children: item.status
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-5 max-w-4xl font-display text-3xl font-bold md:text-4xl",
								children: item.title?.en || "Untitled Event"
							}),
							item.title?.am && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-lg text-primary-foreground/80",
								children: item.title.am
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 border-b p-6 md:grid-cols-3 md:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mt-1 h-5 w-5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: "Start Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: startDate.toLocaleDateString()
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mt-1 h-5 w-5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: "Time"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: [
										startDate.toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit"
										}),
										" — ",
										endDate.toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit"
										})
									]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-1 h-5 w-5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: "Location"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: item.location || "Location not specified"
								})] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 md:p-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-bold",
								children: "About This Event"
							}),
							item.content?.en ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 whitespace-pre-wrap text-base leading-7 text-foreground/80",
								children: item.content.en
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-muted-foreground",
								children: "No additional event information is available."
							}),
							item.content?.am && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 border-t pt-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-bold",
									children: "ስለዚህ ዝግጅት"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 whitespace-pre-wrap leading-7 text-foreground/80",
									children: item.content.am
								})]
							})
						]
					})
				]
			}),
			otherEvents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-bold",
					children: "More Events"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3",
					children: otherEvents.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/events/$id",
						params: { id: String(event.id) },
						className: "group overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "gradient-primary p-5 text-primary-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 rounded-md bg-primary-foreground/10 px-2 py-1 text-xs font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }), new Date(event.start_at).toLocaleDateString()]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 font-display text-lg font-semibold group-hover:text-gold",
								children: event.title?.en || "Untitled Event"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }), event.location || "Location not specified"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 line-clamp-3 text-sm text-foreground/80",
								children: event.content?.en || ""
							})]
						})]
					}, event.id))
				})]
			})
		]
	});
}
//#endregion
export { EventDetailPage as component };
