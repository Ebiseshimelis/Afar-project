import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { C as RefreshCw, L as LoaderCircle, M as Mail, t as X, u as Trash2 } from "../_libs/lucide-react.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
import { n as getMessage, r as getMessages, t as deleteMessage } from "./messageService-Dxng2t9O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.messages-mZG7xSPV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MessagesAdmin() {
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [selectedMessage, setSelectedMessage] = (0, import_react.useState)(null);
	const [loadingMessage, setLoadingMessage] = (0, import_react.useState)(false);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	async function loadMessages(showRefresh = false) {
		try {
			setError(null);
			if (showRefresh) setRefreshing(true);
			else setLoading(true);
			const data = await getMessages();
			setMessages(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load messages.");
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadMessages();
	}, []);
	async function handleOpenMessage(id) {
		try {
			setLoadingMessage(true);
			const message = await getMessage(id);
			setSelectedMessage(message);
			setMessages((current) => current.map((item) => item.id === message.id ? {
				...item,
				...message,
				is_read: true
			} : item));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load the message.");
		} finally {
			setLoadingMessage(false);
		}
	}
	async function handleDeleteMessage(id) {
		if (!window.confirm("Are you sure you want to delete this message?")) return;
		try {
			setDeletingId(id);
			setError(null);
			await deleteMessage(id);
			setMessages((current) => current.filter((message) => message.id !== id));
			if (selectedMessage?.id === id) setSelectedMessage(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete the message.");
		} finally {
			setDeletingId(null);
		}
	}
	const unreadCount = messages.filter((message) => !message.is_read || message.is_read === 0).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Contact Messages",
			description: "Messages submitted through the public contact form."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-sm text-muted-foreground",
				children: [
					unreadCount,
					" unread message",
					unreadCount === 1 ? "" : "s"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => loadMessages(true),
				disabled: refreshing || loading,
				className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-secondary disabled:opacity-50",
				children: [refreshing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }), "Refresh"]
			})]
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
			children: error
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border bg-card shadow-soft",
			children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-2 px-5 py-12 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }), "Loading messages..."]
			}) : messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center px-5 py-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mb-3 h-8 w-8 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "No messages"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Messages submitted through the contact form will appear here."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y",
				children: messages.map((message) => {
					const isUnread = !message.is_read || message.is_read === 0;
					const initials = message.full_name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-4 px-5 py-4 transition-colors " + (isUnread ? "bg-primary/5" : ""),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleOpenMessage(message.id),
							className: "flex min-w-0 flex-1 items-center gap-4 text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground",
									children: initials
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: message.full_name
											}), isUnread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase text-primary-foreground",
												children: "New"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: message.email
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 line-clamp-1 text-sm",
											children: message.subject
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "hidden text-xs text-muted-foreground sm:block",
									children: new Date(message.created_at).toLocaleDateString()
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Open message",
								onClick: () => handleOpenMessage(message.id),
								disabled: loadingMessage,
								className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary disabled:opacity-50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Delete message",
								onClick: () => handleDeleteMessage(message.id),
								disabled: deletingId === message.id,
								className: "grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10 disabled:opacity-50",
								children: deletingId === message.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})]
					}, message.id);
				})
			})
		}),
		selectedMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-2xl overflow-hidden rounded-xl border bg-card shadow-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between border-b px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: selectedMessage.subject
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: ["From ", selectedMessage.full_name]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSelectedMessage(null),
							className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
							"aria-label": "Close message",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 px-5 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 text-sm sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Name:"
									}),
									" ",
									selectedMessage.full_name
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Email:"
									}),
									" ",
									selectedMessage.email
								] }),
								selectedMessage.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Phone:"
									}),
									" ",
									selectedMessage.phone
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Date:"
									}),
									" ",
									new Date(selectedMessage.created_at).toLocaleString()
								] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border bg-secondary/30 p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "whitespace-pre-wrap text-sm leading-6",
								children: selectedMessage.message
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 border-t px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleDeleteMessage(selectedMessage.id),
							disabled: deletingId === selectedMessage.id,
							className: "inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm text-destructive hover:bg-destructive/10",
							children: [deletingId === selectedMessage.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), "Delete"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSelectedMessage(null),
							className: "rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90",
							children: "Close"
						})]
					})
				]
			})
		})
	] });
}
//#endregion
export { MessagesAdmin as component };
