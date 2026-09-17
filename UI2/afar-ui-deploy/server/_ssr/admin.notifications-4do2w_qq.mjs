import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { C as RefreshCw, K as FileText, L as LoaderCircle, O as Newspaper, dt as BellRing, k as MessageSquare, r as Users, rt as CheckCheck, u as Trash2 } from "../_libs/lucide-react.mjs";
import { a as markAllNotificationsAsRead, i as getNotifications, n as AdminPageHeader, o as markNotificationAsRead, r as deleteNotification, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.notifications-4do2w_qq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var iconMap = {
	tender: FileText,
	message: MessageSquare,
	news: Newspaper,
	user: Users
};
function NotificationsAdmin() {
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [markingAll, setMarkingAll] = (0, import_react.useState)(false);
	async function loadNotifications(showRefreshing = false) {
		try {
			if (showRefreshing) setRefreshing(true);
			else setLoading(true);
			setError("");
			const data = await getNotifications();
			setNotifications(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "We couldn't load your notifications. Please try again.");
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadNotifications();
	}, []);
	async function handleMarkAsRead(id) {
		try {
			const updated = await markNotificationAsRead(id);
			setNotifications((current) => current.map((notification) => notification.id === id ? updated : notification));
		} catch (err) {
			setError(err instanceof Error ? err.message : "We couldn't update this notification.");
		}
	}
	async function handleMarkAllAsRead() {
		try {
			setMarkingAll(true);
			setError("");
			await markAllNotificationsAsRead();
			setNotifications((current) => current.map((notification) => ({
				...notification,
				is_read: true
			})));
		} catch (err) {
			setError(err instanceof Error ? err.message : "We couldn't mark all notifications as read.");
		} finally {
			setMarkingAll(false);
		}
	}
	async function handleDelete(id) {
		try {
			setError("");
			await deleteNotification(id);
			setNotifications((current) => current.filter((notification) => notification.id !== id));
		} catch (err) {
			setError(err instanceof Error ? err.message : "We couldn't delete this notification.");
		}
	}
	const unreadCount = notifications.filter((notification) => !notification.is_read).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Notifications",
			description: "Stay informed about important activity and system updates.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void loadNotifications(true),
					disabled: refreshing,
					className: "inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" + (refreshing ? " animate-spin" : "") }), "Refresh"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleMarkAllAsRead,
					disabled: markingAll || unreadCount === 0,
					className: "inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-4 w-4" }), markingAll ? "Marking..." : "Mark all as read"]
				})]
			})
		}),
		unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-9 w-9 place-items-center rounded-full bg-primary/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-4 w-4 text-primary" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-semibold",
					children: [
						"You have",
						" ",
						unreadCount,
						" unread",
						" ",
						unreadCount === 1 ? "notification" : "notifications"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Review them below to keep your administration activity up to date."
				})] })]
			})
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-destructive",
				children: error
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border bg-card shadow-soft",
			children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Loading notifications..."]
			}) : notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 grid h-14 w-14 place-items-center rounded-full bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-6 w-6 text-muted-foreground" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: "You're all caught up"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-sm text-sm text-muted-foreground",
						children: "There are no notifications to review right now."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y",
				children: notifications.map((notification) => {
					const Icon = iconMap[notification.type] ?? BellRing;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-4 px-5 py-4 transition-colors " + (!notification.is_read ? "bg-primary/5" : "hover:bg-secondary/40"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => !notification.is_read && void handleMarkAsRead(notification.id),
											className: "text-left font-medium hover:underline",
											children: notification.title
										}), !notification.is_read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase text-primary-foreground",
											children: "New"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: notification.body
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: new Date(notification.created_at).toLocaleString()
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void handleDelete(notification.id),
								"aria-label": "Delete notification",
								className: "grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})
						]
					}, notification.id);
				})
			})
		})
	] });
}
//#endregion
export { NotificationsAdmin as component };
