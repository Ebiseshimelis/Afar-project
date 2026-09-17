import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { b as Search, it as Calendar } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/PortalLayout-qV5-TMvO.mjs";
import { i as getNews } from "./_ssr/newsService-CiNVHUG4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.news.index-Ba7EaFTH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewsListPage() {
	const [news, setNews] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("All");
	(0, import_react.useEffect)(() => {
		getNews().then(setNews).catch((error) => {
			console.error("Failed to load news:", error);
		});
	}, []);
	const categories = ["All", ...Array.from(new Set(news.map((n) => n.category)))];
	const filtered = (0, import_react.useMemo)(() => news.filter((n) => (cat === "All" || n.category === cat) && (!q || n.title.toLowerCase().includes(q.toLowerCase()))), [
		news,
		q,
		cat
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		section: "newsEvents",
		eyebrow: "Newsroom",
		title: "News & Announcements",
		description: "Updates from directorates, city administrations, and regional programs."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-6 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search news…",
					className: "h-11 w-full rounded-lg border bg-card pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setCat(c),
					className: "rounded-full border px-3 py-1.5 text-xs font-medium " + (cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground/70 hover:bg-secondary"),
					children: c
				}, c))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3",
			children: filtered.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/news/$id",
				params: { id: n.id },
				className: "group overflow-hidden rounded-xl border bg-card shadow-soft transition hover:shadow-elegant",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[16/10] overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: n.image,
						alt: n.title,
						className: "h-full w-full object-cover transition duration-500 group-hover:scale-105",
						loading: "lazy"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground",
								children: n.category
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }),
									" ",
									new Date(n.date).toLocaleDateString()
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 font-display text-lg font-semibold leading-snug group-hover:text-primary",
							children: n.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 line-clamp-3 text-sm text-muted-foreground",
							children: n.excerpt
						})
					]
				})]
			}, n.id))
		})]
	})] });
}
//#endregion
export { NewsListPage as component };
