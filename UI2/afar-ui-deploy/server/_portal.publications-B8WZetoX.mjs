import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { n as API_ORIGIN } from "./_ssr/authService-tLH6lGQn.mjs";
import { K as FileText, q as Eye, t as X } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/PortalLayout-qV5-TMvO.mjs";
import { r as getPublications } from "./_ssr/publicationService-CDzKJ0s7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.publications-B8WZetoX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getFileUrl(filePath) {
	if (filePath.startsWith("http://") || filePath.startsWith("https://")) return filePath;
	if (filePath.startsWith("/")) return `${API_ORIGIN}${filePath}`;
	return `${API_ORIGIN}/storage/${filePath}`;
}
function getFileExtension(filePath) {
	const parts = filePath.split("?")[0].split("#")[0].split(".");
	return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}
function isImageFile(filePath) {
	return [
		"jpg",
		"jpeg",
		"png",
		"gif",
		"webp",
		"svg"
	].includes(getFileExtension(filePath));
}
function isPdfFile(filePath) {
	return getFileExtension(filePath) === "pdf";
}
function PublicationViewer({ publication, onClose }) {
	if (!publication.file_path) return null;
	const fileUrl = getFileUrl(publication.file_path);
	const title = publication.title?.en || publication.title?.am || "Publication";
	const isImage = isImageFile(publication.file_path);
	const isPdf = isPdfFile(publication.file_path);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `View ${title}`,
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-background shadow-2xl",
			onClick: (event) => event.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "truncate font-semibold",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Publication document"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "ml-4 grid h-9 w-9 shrink-0 place-items-center rounded-lg hover:bg-secondary",
					"aria-label": "Close viewer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-auto bg-muted/30",
				children: isPdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					src: fileUrl,
					title,
					className: "h-full min-h-[600px] w-full border-0"
				}) : isImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-full items-center justify-center p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: fileUrl,
						alt: title,
						className: "max-h-full max-w-full rounded-lg object-contain shadow-lg"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-full items-center justify-center p-8 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mx-auto mb-4 h-12 w-12 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-semibold",
								children: "This document cannot be previewed in the browser"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "The publication is attached, but this file type does not support direct browser viewing."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: [
									"File type:",
									" ",
									getFileExtension(publication.file_path).toUpperCase() || "Unknown"
								]
							})
						]
					})
				})
			})]
		})
	});
}
function PublicationsPage() {
	const [publications, setPublications] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [selectedPublication, setSelectedPublication] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		async function loadPublications() {
			try {
				const data = await getPublications();
				setPublications(data);
			} catch (err) {
				console.error("Failed to load publications:", err);
				setError("Unable to load publications.");
			} finally {
				setLoading(false);
			}
		}
		loadPublications();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Documents",
			title: "Publications",
			description: "Strategies, reports, manuals, and policy documents."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-5xl px-6 py-10",
			children: [
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-12 text-center text-muted-foreground",
					children: "Loading publications..."
				}),
				!loading && error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-12 text-center text-destructive",
					children: error
				}),
				!loading && !error && publications.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card px-6 py-12 text-center shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mx-auto mb-4 h-10 w-10 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: "No publications available"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "There are currently no publications available."
						})
					]
				}),
				!loading && !error && publications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-xl border bg-card shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Title"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "hidden px-5 py-3 md:table-cell",
									children: "Published"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-right",
									children: "Action"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: publications.map((publication) => {
							const title = publication.title?.en || publication.title?.am || "Untitled Publication";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: title
											}) })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4 text-muted-foreground",
										children: publication.status
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "hidden px-5 py-4 text-muted-foreground md:table-cell",
										children: publication.published_at ? new Date(publication.published_at).toLocaleDateString() : ""
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4 text-right",
										children: publication.file_path ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: getFileUrl(publication.file_path),
											target: "_blank",
											rel: "noopener noreferrer",
											className: "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-secondary",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), "View"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "No file"
										})
									})
								]
							}, publication.id);
						}) })]
					})
				})
			]
		}),
		selectedPublication && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicationViewer, {
			publication: selectedPublication,
			onClose: () => setSelectedPublication(null)
		})
	] });
}
//#endregion
export { PublicationsPage as component };
