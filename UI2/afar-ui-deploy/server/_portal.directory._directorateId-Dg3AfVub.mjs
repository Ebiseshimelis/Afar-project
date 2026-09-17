import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { r as getDirectorate } from "./_ssr/directorateService-DPp5QHcB.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { E as Phone, M as Mail, mt as ArrowLeft, ot as Building2 } from "./_libs/lucide-react.mjs";
import { t as Route } from "./_portal.directory._directorateId-CUXzM35u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.directory._directorateId-Dg3AfVub.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DirectorateDetailPage() {
	const { directorateId } = Route.useParams();
	const [directorate, setDirectorate] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function loadDirectorate() {
			try {
				setLoading(true);
				setError(null);
				const id = Number(directorateId);
				if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid directorate.");
				const data = await getDirectorate(id);
				if (!cancelled) setDirectorate(data);
			} catch (err) {
				console.error("Failed to load directorate:", err);
				if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load directorate.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		loadDirectorate();
		return () => {
			cancelled = true;
		};
	}, [directorateId]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-7xl px-6 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground",
			children: "Loading directorate..."
		})
	});
	if (error || !directorate) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-6 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/directory",
			className: "mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Directorates"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border bg-card p-6 text-sm text-destructive",
			children: error || "Directorate not found."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative isolate overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: directorate.background,
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-black/55" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative mx-auto flex min-h-[420px] max-w-7xl items-end px-6 py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-4xl text-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/directory",
							className: "mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-sm backdrop-blur-sm transition hover:bg-black/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Directorates"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold uppercase tracking-[0.2em] text-white/75",
							children: "Directorate"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl",
							children: directorate.name
						})
					]
				})
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-7xl px-6 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl border bg-card p-6 shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "About the Directorate"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "prose prose-sm max-w-none text-muted-foreground",
					children: directorate.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-line leading-7",
						children: directorate.description
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No description is available for this directorate." })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-3 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Director"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [directorate.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: directorate.photo,
							alt: directorate.headName || directorate.name,
							width: 64,
							height: 64,
							className: "h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-primary/10"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-6 w-6 text-primary" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-sm font-semibold leading-tight",
								children: directorate.headName || "—"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-primary",
								children: directorate.headTitle || "Director"
							})]
						})]
					}),
					(directorate.phone || directorate.email) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-1.5 border-t pt-2.5 text-xs",
						children: [directorate.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `tel:${directorate.phone}`,
							className: "flex items-center gap-2 text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: directorate.phone
							})]
						}), directorate.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `mailto:${directorate.email}`,
							className: "flex items-center gap-2 text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: directorate.email
							})]
						})]
					})
				]
			}) })]
		})
	})] });
}
//#endregion
export { DirectorateDetailPage as component };
