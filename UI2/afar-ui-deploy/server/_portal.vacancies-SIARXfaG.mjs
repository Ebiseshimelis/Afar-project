import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link, l as useLocation, p as Outlet } from "./_libs/@tanstack/react-router+[...].mjs";
import { it as Calendar, pt as ArrowRight, st as Briefcase } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/PortalLayout-qV5-TMvO.mjs";
import { r as getVacancies } from "./_ssr/vacancyService-Da2NxTO3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.vacancies-SIARXfaG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatDate(value) {
	if (!value) return "Not specified";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "Not specified";
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
function VacanciesPage() {
	const location = useLocation();
	const [vacancies, setVacancies] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const isVacancyDetail = location.pathname !== "/vacancies";
	(0, import_react.useEffect)(() => {
		if (isVacancyDetail) return;
		async function loadVacancies() {
			try {
				setLoading(true);
				setError(null);
				const data = await getVacancies();
				setVacancies(data);
			} catch (err) {
				console.error("Failed to load vacancies:", err);
				setError(err instanceof Error ? err.message : "Unable to load vacancies.");
			} finally {
				setLoading(false);
			}
		}
		loadVacancies();
	}, [isVacancyDetail]);
	if (isVacancyDetail) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Careers",
		title: "Vacancies",
		description: "Explore current employment opportunities at Afar UDCB."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-5xl px-6 py-10",
		children: [
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border bg-card p-8 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Loading vacancies..."
				})
			}),
			!loading && error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border bg-card p-8 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-destructive",
					children: error
				})
			}),
			!loading && !error && vacancies.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-8 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "mx-auto h-8 w-8 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "There are currently no published vacancies."
				})]
			}),
			!loading && !error && vacancies.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-5",
				children: vacancies.map((v) => {
					const title = v.title?.en || v.title?.am || "Untitled vacancy";
					const content = v.content?.en || v.content?.am || "No vacancy description has been provided.";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "relative rounded-2xl border bg-card p-6 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pr-36",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-bold",
									children: title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm leading-7 text-muted-foreground",
									children: content
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4" }),
											"Published:",
											" ",
											formatDate(v.published_at)
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4" }),
											"Closing:",
											" ",
											formatDate(v.deadline)
										]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/vacancies/$vacancyId",
							params: { vacancyId: String(v.id) },
							className: "absolute right-6 top-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90",
							children: ["View Details", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})]
					}, v.id);
				})
			})
		]
	})] });
}
//#endregion
export { VacanciesPage as component };
