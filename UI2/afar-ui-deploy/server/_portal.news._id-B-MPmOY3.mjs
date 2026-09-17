import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { _ as Share2, f as Tag, i as User, it as Calendar, mt as ArrowLeft, pt as ArrowRight, q as Eye } from "./_libs/lucide-react.mjs";
import { t as Route } from "./_portal.news._id-BeC4CbCT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.news._id-B-MPmOY3.js
var import_jsx_runtime = require_jsx_runtime();
function formatViews(v) {
	return v >= 1e3 ? `${(v / 1e3).toFixed(1)}k` : String(v);
}
function NewsDetailPage() {
	const { item, mostRead, prev, next } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "animate-fade-in-up",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/news",
				className: "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground transition hover:text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), "Back to news"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-xl border shadow-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.image,
								alt: item.title,
								className: "h-56 w-full object-cover sm:h-72 md:h-[26rem]"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-3 w-3" }), item.category]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-b pb-4 text-xs text-muted-foreground sm:text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-primary" }), new Date(item.date).toLocaleDateString()]
								}),
								item.author && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-primary" }), item.author]
								}),
								typeof item.views === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5 text-primary" }),
										formatViews(item.views),
										" views"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "ml-auto inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-secondary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-3.5 w-3.5" }), "Share"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 border-l-4 border-gold pl-4 font-display text-lg leading-relaxed text-foreground/90 sm:text-xl",
							children: item.excerpt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "prose prose-neutral mt-6 max-w-none space-y-4 text-base leading-relaxed text-foreground/80",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.body })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							"aria-label": "Article navigation",
							className: "mt-10 grid gap-3 border-t pt-6 sm:grid-cols-2",
							children: [prev ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/news/$id",
								params: { id: prev.id },
								className: "group rounded-xl border bg-card p-4 shadow-soft transition hover:shadow-elegant",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), "Previous"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 line-clamp-2 text-sm font-medium group-hover:text-primary",
									children: prev.title
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), next && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/news/$id",
								params: { id: next.id },
								className: "group rounded-xl border bg-card p-4 text-right shadow-soft transition hover:shadow-elegant sm:col-start-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: ["Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 line-clamp-2 text-sm font-medium group-hover:text-primary",
									children: next.title
								})]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "lg:sticky lg:top-24 lg:self-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-lg font-bold",
						children: ["Most read", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 block h-0.5 w-12 rounded-full bg-gold" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-5 flex flex-col gap-4",
						children: mostRead.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/news/$id",
							params: { id: n.id },
							className: "group flex items-start gap-3 rounded-xl border bg-card p-3 shadow-soft transition hover:shadow-elegant",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: n.image,
									alt: n.title,
									loading: "lazy",
									width: 72,
									height: 56,
									className: "h-14 w-[72px] rounded-lg object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -left-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground",
									children: i + 1
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary",
									children: n.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center gap-3 text-[11px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }), new Date(n.date).toLocaleDateString()]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }), formatViews(n.views)]
									})]
								})]
							})]
						}) }, n.id))
					})]
				})]
			})]
		})
	});
}
//#endregion
export { NewsDetailPage as component };
