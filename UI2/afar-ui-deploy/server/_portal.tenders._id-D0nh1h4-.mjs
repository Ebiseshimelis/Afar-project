import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { n as API_ORIGIN } from "./_ssr/authService-tLH6lGQn.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { K as FileText, it as Calendar, mt as ArrowLeft, q as Eye, t as X } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/PortalLayout-qV5-TMvO.mjs";
import { i as getTenderStatus } from "./_ssr/tenderService-FaLrKaDE.mjs";
import { t as Route } from "./_portal.tenders._id-CaTwtGYX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.tenders._id-D0nh1h4-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getTitle(tender) {
	return tender.title?.en || tender.title?.am || "Untitled Tender";
}
function getContent(tender) {
	return tender.content?.en || tender.content?.am || "No description available.";
}
function formatDate(date) {
	if (!date) return "â€”";
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) return "â€”";
	return parsed.toLocaleDateString();
}
function getFileUrl(filePath) {
	if (!filePath) return "";
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
function TenderDocumentViewer({ filePath, title, onClose }) {
	const fileUrl = getFileUrl(filePath);
	const isImage = isImageFile(filePath);
	const isPdf = isPdfFile(filePath);
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
						children: "Tender document"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "ml-4 grid h-9 w-9 shrink-0 place-items-center rounded-lg hover:bg-secondary",
					"aria-label": "Close document viewer",
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
								children: "The tender has an attached file, but this file type does not support direct browser viewing."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: [
									"File type:",
									" ",
									getFileExtension(filePath).toUpperCase() || "Unknown"
								]
							})
						]
					})
				})
			})]
		})
	});
}
function TenderDetailPage() {
	const { item } = Route.useLoaderData();
	const [showDocument, setShowDocument] = (0, import_react.useState)(false);
	const title = getTitle(item);
	const content = getContent(item);
	const status = item.status === "published" ? getTenderStatus(item) : "Closed";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Public Procurement",
			title,
			description: "Tender details and procurement information.",
			section: "default"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-4xl px-4 py-10 md:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/tenders",
				className: "mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Tenders"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl border bg-card p-6 shadow-soft md:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground",
								children: ["#", item.id]
							}),
							item.category_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: ["Category ", item.category_id]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-2xl font-bold text-foreground",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 grid gap-4 border-y py-5 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Published"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: formatDate(item.published_at)
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Opening Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: formatDate(item.opens_at)
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Deadline"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: formatDate(item.closes_at)
								})] })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-semibold",
							children: "Tender Information"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground/80",
							children: content
						})]
					}),
					item.file_path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 border-t pt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								window.location.href = getFileUrl(item.file_path);
							},
							className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }), "View Tender Document"]
						})
					})
				]
			})]
		}),
		showDocument && item.file_path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TenderDocumentViewer, {
			filePath: item.file_path,
			title,
			onClose: () => setShowDocument(false)
		})
	] });
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${{
			Open: "bg-success/15 text-success",
			Closed: "bg-muted text-muted-foreground"
		}[status]}`,
		children: status
	});
}
//#endregion
export { TenderDetailPage as component };
