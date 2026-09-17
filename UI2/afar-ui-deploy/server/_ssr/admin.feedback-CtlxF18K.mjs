import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as API_BASE } from "./authService-tLH6lGQn.mjs";
import { L as LoaderCircle, M as Mail, i as User, p as Star, u as Trash2 } from "../_libs/lucide-react.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.feedback-CtlxF18K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var API_BASE_URL = API_BASE;
function getAuthHeaders() {
	const token = localStorage.getItem("admin_token");
	return {
		Accept: "application/json",
		...token ? { Authorization: `Bearer ${token}` } : {}
	};
}
async function parseResponse(response) {
	const text = await response.text();
	let data = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = null;
	}
	if (!response.ok) {
		let message = data?.message || data?.error || text || `API request failed: ${response.status}`;
		if (data?.errors) {
			const errors = Object.values(data.errors).flat().join(" ");
			if (errors) message = errors;
		}
		throw new Error(`${message} (HTTP ${response.status})`);
	}
	return data;
}
async function getFeedback() {
	const result = await parseResponse(await fetch(`${API_BASE_URL}/feedback`, {
		method: "GET",
		headers: getAuthHeaders()
	}));
	return Array.isArray(result?.data) ? result.data : [];
}
async function deleteFeedback(id) {
	await parseResponse(await fetch(`${API_BASE_URL}/feedback/${id}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	}));
	return true;
}
function FeedbackAdmin() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	async function loadFeedback() {
		try {
			setLoading(true);
			setError("");
			const data = await getFeedback();
			setItems(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load feedback.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadFeedback();
	}, []);
	async function handleDelete(id) {
		if (!window.confirm("Are you sure you want to delete this feedback?")) return;
		try {
			setDeletingId(id);
			await deleteFeedback(id);
			setItems((current) => current.filter((item) => item.id !== id));
		} catch (err) {
			window.alert(err instanceof Error ? err.message : "Failed to delete feedback.");
		} finally {
			setDeletingId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Feedback",
			description: "Citizen feedback about the portal."
		}),
		loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center rounded-xl border bg-card py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }), "Loading feedback..."]
			})
		}),
		!loading && error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive",
			children: error
		}),
		!loading && !error && items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card py-16 text-center shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5 text-muted-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-4 font-display font-semibold",
					children: "No feedback yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Citizen feedback will appear here when submitted."
				})
			]
		}),
		!loading && !error && items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-5 shadow-soft " + (!item.is_read ? "border-primary/30 bg-primary/[0.03]" : ""),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-accent-foreground" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate font-display font-semibold",
										children: item.name
									}), item.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: item.email
										})]
									})]
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex shrink-0 items-center gap-0.5",
							children: Array.from({ length: 5 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 " + (index < item.rating ? "fill-current text-gold" : "text-muted-foreground/30") }, index))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-secondary px-2.5 py-1 text-xs font-medium",
							children: item.topic
						}), !item.is_read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-primary px-2 py-1 text-[10px] font-semibold uppercase text-primary-foreground",
							children: "New"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-6 text-foreground/80",
						children: item.comment
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between border-t pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: new Date(item.created_at).toLocaleDateString()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => handleDelete(item.id),
							disabled: deletingId === item.id,
							"aria-label": "Delete feedback",
							className: "grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10 disabled:opacity-50",
							children: deletingId === item.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})]
					})
				]
			}, item.id))
		})
	] });
}
//#endregion
export { FeedbackAdmin as component };
