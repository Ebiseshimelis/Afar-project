import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { i as getDirectorates } from "./_ssr/directorateService-DPp5QHcB.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { E as Phone, M as Mail, b as Search, ot as Building2, t as X } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/PortalLayout-qV5-TMvO.mjs";
import { t as Route } from "./_portal.directory.index-Qs2Y56AP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.directory.index-n3JDes5Q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TYPE_TO_CATEGORY = {
	directorates: "Directorates",
	"city-admins": "City Admins"
};
function DirectoryPage() {
	const { type, name } = Route.useSearch();
	const navigate = Route.useNavigate();
	const initialCat = type && TYPE_TO_CATEGORY[type] || "All";
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)(initialCat);
	const [directorates, setDirectorates] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setCat(type && TYPE_TO_CATEGORY[type] || "All");
	}, [type]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function loadDirectorates() {
			try {
				setLoading(true);
				setError(null);
				const data = await getDirectorates();
				if (!cancelled) setDirectorates(data);
			} catch (err) {
				console.error("Failed to load directorates:", err);
				if (!cancelled) setError("Failed to load directorates.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		loadDirectorates();
		return () => {
			cancelled = true;
		};
	}, []);
	const categories = ["All", "Directorates"];
	const filtered = (0, import_react.useMemo)(() => {
		return directorates.filter((d) => {
			if (name && d.name !== name) return false;
			const search = q.trim().toLowerCase();
			if (!search) return true;
			return d.name.toLowerCase().includes(search) || (d.headName || "").toLowerCase().includes(search);
		});
	}, [
		directorates,
		q,
		name
	]);
	const clearName = () => {
		navigate({ search: (prev) => ({
			...prev,
			name: void 0
		}) });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		section: "directorates",
		eyebrow: "Organization",
		title: "Directorates",
		description: "Directorates and offices across the Afar Regional State."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-6 py-10",
		children: [
			name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1.5 text-xs font-medium",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Filtered:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: name }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: clearName,
						"aria-label": "Clear filter",
						className: "ml-1 rounded-full p-0.5 hover:bg-background",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search directorates or heads...",
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
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 text-sm text-muted-foreground",
				children: "Loading directorates..."
			}),
			error && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 text-sm text-destructive",
				children: error
			}),
			!loading && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: filtered.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/directory/$directorateId",
					params: { directorateId: String(d.id) },
					className: "block rounded-xl border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [d.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: d.photo,
							alt: d.headName || d.name,
							loading: "lazy",
							width: 64,
							height: 64,
							className: "h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-primary/10"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-6 w-6 text-primary" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Directorate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-0.5 line-clamp-2 font-display text-sm font-semibold leading-tight sm:text-base",
									children: d.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 truncate text-sm font-medium text-primary",
									children: d.headName || "—"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-1.5 border-t pt-3 text-sm",
						children: [d.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							onClick: (e) => {
								e.preventDefault();
								e.stopPropagation();
							},
							className: "flex items-center gap-2 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: d.phone
							})]
						}), d.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							onClick: (e) => {
								e.preventDefault();
								e.stopPropagation();
							},
							className: "flex items-center gap-2 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: d.email
							})]
						})]
					})]
				}, d.id))
			}),
			!loading && !error && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 text-center text-sm text-muted-foreground",
				children: "No directorates found."
			})
		]
	})] });
}
//#endregion
export { DirectoryPage as component };
