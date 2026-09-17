import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { K as FileText, b as Search, et as ChevronRight, it as Calendar } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/PortalLayout-qV5-TMvO.mjs";
import { a as getTenders, i as getTenderStatus } from "./_ssr/tenderService-FaLrKaDE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.tenders.index-B_1x15zu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"All",
	"Open",
	"Closed"
];
function getTitle(tender, lang = "en") {
	return tender.title?.[lang] || tender.title?.en || tender.title?.am || "Untitled Tender";
}
function getContent(tender, lang = "en") {
	return tender.content?.[lang] || tender.content?.en || tender.content?.am || "";
}
function formatDate(date) {
	if (!date) return "—";
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) return "—";
	return parsed.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
function TendersListPage() {
	const [tenders, setTenders] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("All");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function loadTenders() {
			try {
				setLoading(true);
				setError("");
				const data = await getTenders();
				console.log("PUBLIC TENDERS FROM DATABASE:", data);
				if (!cancelled) setTenders(data);
			} catch (err) {
				console.error("Failed to load tenders:", err);
				if (!cancelled) setError("Unable to load tenders.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		loadTenders();
		return () => {
			cancelled = true;
		};
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		const search = q.trim().toLowerCase();
		return tenders.filter((tender) => {
			const tenderStatus = getTenderStatus(tender);
			if (status !== "All" && tenderStatus !== status) return false;
			if (!search) return true;
			const title = getTitle(tender).toLowerCase();
			const titleAm = getTitle(tender, "am").toLowerCase();
			const content = getContent(tender).toLowerCase();
			return title.includes(search) || titleAm.includes(search) || content.includes(search) || String(tender.id).includes(search);
		});
	}, [
		tenders,
		q,
		status
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Public Procurement",
		title: "Tenders",
		description: "View all tenders from the Afar UDCB database.",
		section: "default"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 py-10 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-4 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (event) => setQ(event.target.value),
						placeholder: "Search tender...",
						className: "h-11 w-full rounded-lg border bg-card pl-10 pr-3 text-sm outline-none ring-ring focus:ring-2"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: STATUSES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setStatus(item),
						className: "rounded-full border px-3 py-1.5 text-xs font-medium " + (status === item ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground/70 hover:bg-secondary"),
						children: item
					}, item))
				})]
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground",
				children: "Loading tenders from database..."
			}),
			!loading && error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 rounded-xl border border-destructive/30 bg-card p-8 text-center text-sm text-destructive",
				children: error
			}),
			!loading && !error && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-xl border bg-card p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 font-display text-base font-semibold",
						children: "No tenders found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "There are currently no tenders matching your search."
					})
				]
			}),
			!loading && !error && filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-3",
				children: filtered.map((tender) => {
					const tenderStatus = getTenderStatus(tender);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/tenders/$id",
						params: { id: String(tender.id) },
						className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl border bg-card p-5 shadow-soft transition hover:shadow-elegant",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground",
											children: ["#", tender.id]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: tenderStatus }),
										tender.category_id !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [
												"Category",
												" ",
												tender.category_id
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-2 font-display text-base font-semibold text-foreground",
									children: getTitle(tender)
								}),
								getTitle(tender, "am") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: getTitle(tender, "am")
								}),
								getContent(tender) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 line-clamp-2 text-sm text-muted-foreground",
									children: getContent(tender)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3 w-3" }),
												"Published",
												" ",
												formatDate(tender.published_at)
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }),
												"Deadline",
												" ",
												formatDate(tender.closes_at)
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Created",
											" ",
											formatDate(tender.created_at)
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Updated",
											" ",
											formatDate(tender.updated_at)
										] })
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 shrink-0 text-muted-foreground" })]
					}, tender.id);
				})
			})
		]
	})] });
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${status === "Open" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`,
		children: status
	});
}
//#endregion
export { StatusBadge, TendersListPage as component };
