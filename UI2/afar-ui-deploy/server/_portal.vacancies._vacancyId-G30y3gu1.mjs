import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { n as API_ORIGIN } from "./_ssr/authService-tLH6lGQn.mjs";
import { _ as Link, l as useLocation, p as Outlet } from "./_libs/@tanstack/react-router+[...].mjs";
import { K as FileText, L as LoaderCircle, it as Calendar, mt as ArrowLeft, pt as ArrowRight, q as Eye, st as Briefcase } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/PortalLayout-qV5-TMvO.mjs";
import { i as getVacancy } from "./_ssr/vacancyService-Da2NxTO3.mjs";
import { t as Route } from "./_portal.vacancies._vacancyId-BDxl3Rfy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.vacancies._vacancyId-G30y3gu1.js
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
function getFileUrl(filePath) {
	if (!filePath) return "";
	if (filePath.startsWith("http://") || filePath.startsWith("https://")) return filePath;
	return `${API_ORIGIN}/storage/${filePath.replace(/^\/+/, "")}`;
}
function getFileName(filePath) {
	if (!filePath) return "Official Vacancy Document";
	const parts = filePath.split("?")[0].split("/");
	return parts[parts.length - 1] || "Official Vacancy Document";
}
function VacancyDetailPage() {
	const { vacancyId } = Route.useParams();
	if (useLocation().pathname.endsWith("/apply")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	const [vacancy, setVacancy] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function loadVacancy() {
			try {
				setLoading(true);
				setError(null);
				const data = await getVacancy(vacancyId);
				if (!cancelled) setVacancy(data);
			} catch (err) {
				console.error("Failed to load vacancy:", err);
				if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load vacancy details.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		loadVacancy();
		return () => {
			cancelled = true;
		};
	}, [vacancyId]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Careers",
		title: "Vacancy Details",
		description: "Loading vacancy information..."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-6 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-56 items-center justify-center rounded-3xl border bg-card shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }), "Loading vacancy..."]
			})
		})
	})] });
	if (error || !vacancy) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Careers",
		title: "Vacancy Not Found",
		description: "The requested vacancy could not be found."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-5xl px-6 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border bg-card p-10 text-center shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "mx-auto h-12 w-12 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-5 font-display text-xl font-bold",
					children: "Vacancy unavailable"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: error || "This vacancy does not exist or is no longer available."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/vacancies",
					className: "mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Vacancies"]
				})
			]
		})
	})] });
	const englishTitle = vacancy.title?.en || "Untitled vacancy";
	const amharicTitle = vacancy.title?.am || "";
	const englishContent = vacancy.content?.en || "";
	const amharicContent = vacancy.content?.am || "";
	const fileUrl = vacancy.file_path ? getFileUrl(vacancy.file_path) : "";
	const fileName = vacancy.file_path ? getFileName(vacancy.file_path) : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Careers",
		title: "Vacancy Details",
		description: "Review the position, requirements, deadline, and application information."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-6 py-8 sm:py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/vacancies",
			className: "mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Vacancies"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "overflow-hidden rounded-3xl border bg-card shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "max-w-4xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4" }), "Employment Opportunity"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "mt-4 font-display text-lg font-bold tracking-tight sm:text-xl lg:text-2xl",
										children: englishTitle
									}),
									amharicTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 text-base leading-7 text-muted-foreground",
										children: amharicTitle
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex w-fit shrink-0 items-center rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm",
								children: vacancy.status === "published" ? "Open" : vacancy.status
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-2xl border bg-background/80 p-5 backdrop-blur-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-5 w-5 text-primary" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold uppercase tracking-wide text-muted-foreground",
										children: "Published"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-semibold",
										children: formatDate(vacancy.published_at)
									})] })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-2xl border bg-background/80 p-5 backdrop-blur-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-5 w-5 text-primary" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold uppercase tracking-wide text-muted-foreground",
										children: "Application Deadline"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-semibold",
										children: formatDate(vacancy.deadline)
									})] })]
								})
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 sm:p-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-4xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-1 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-bold",
									children: "Job Description"
								})]
							}),
							englishContent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 whitespace-pre-wrap text-[15px] leading-8 text-muted-foreground",
								children: englishContent
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-sm text-muted-foreground",
								children: "No English description has been provided."
							}),
							amharicContent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-10 border-t pt-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-1 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg font-bold",
										children: "የሥራ መግለጫ"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-5 whitespace-pre-wrap text-[15px] leading-8 text-muted-foreground",
									children: amharicContent
								})]
							})
						]
					})
				}),
				fileUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t bg-muted/20 px-6 py-8 sm:px-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold uppercase tracking-widest text-primary",
							children: "Official Document"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-lg font-bold",
							children: "Vacancy Attachment"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-6 w-6 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold",
										children: "Official Vacancy Document"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 truncate text-sm text-muted-foreground",
										title: fileName,
										children: fileName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "Open the document or save a copy for later."
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex shrink-0 flex-wrap gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: fileUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }), "View"]
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t bg-primary/[0.04] px-6 py-5 sm:px-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Ready to apply?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Review the vacancy details before submitting your application."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/vacancies/$vacancyId/apply",
							params: { vacancyId: String(vacancy.id) },
							className: "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90",
							children: ["Apply Now", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})]
					})
				})
			]
		})]
	})] });
}
//#endregion
export { VacancyDetailPage as component };
