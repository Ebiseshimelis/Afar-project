import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { l as getToken, t as API_BASE } from "./authService-tLH6lGQn.mjs";
import { _ as Link, u as useRouterState, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Menu, H as Image, K as FileText, L as LoaderCircle, N as LogOut, O as Newspaper, V as Inbox, Z as CircleQuestionMark, b as Search, dt as BellRing, et as ChevronRight, g as ShieldAlert, h as ShieldCheck, i as User, it as Calendar, k as MessageSquare, lt as BookOpen, nt as Check, ot as Building2, r as Users, st as Briefcase, t as X, tt as ChevronDown, ut as Bell, v as Settings, z as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminLayout-C1K9j-HA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var API_BASE_URL = API_BASE;
/**
* Authentication headers.
*
* IMPORTANT:
* The new staff authentication system stores
* the Laravel token as "afar_admin_token".
*/
function getAuthHeaders() {
	const token = getToken();
	return {
		Accept: "application/json",
		...token ? { Authorization: `Bearer ${token}` } : {}
	};
}
/**
* Convert Laravel/API errors into messages that are
* understandable to administrators.
*/
function getFriendlyErrorMessage(status, data) {
	if (status === 401) return "Your staff session has expired. Please sign in again.";
	if (status === 403) return "You don't have permission to access notifications. Please contact the Super Admin if you need access.";
	if (status === 404) return "The notification service could not find the requested item.";
	if (status === 419) return "Your session is no longer valid. Please sign in again.";
	if (status === 422) {
		if (data?.errors) {
			const errors = Object.values(data.errors).flat().filter(Boolean).join(" ");
			if (errors) return String(errors);
		}
		return data?.message || "Some notification information is invalid.";
	}
	if (status === 429) return "Too many requests. Please wait a moment and try again.";
	if (status >= 500) return "The notification service is temporarily unavailable. Please try again shortly.";
	if (data?.message) return String(data.message);
	if (data?.error) return String(data.error);
	return "Something went wrong while processing the notification request.";
}
async function parseResponse(response) {
	const text = await response.text();
	let data = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = null;
	}
	if (!response.ok) throw new Error(getFriendlyErrorMessage(response.status, data));
	return data;
}
async function getNotifications() {
	const result = await parseResponse(await fetch(`${API_BASE_URL}/notifications`, {
		method: "GET",
		headers: getAuthHeaders()
	}));
	return Array.isArray(result?.data) ? result.data : [];
}
async function markNotificationAsRead(id) {
	const result = await parseResponse(await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
		method: "PATCH",
		headers: getAuthHeaders()
	}));
	if (!result?.data) throw new Error("The notification could not be marked as read.");
	return result.data;
}
async function markAllNotificationsAsRead() {
	await parseResponse(await fetch(`${API_BASE_URL}/notifications/read-all`, {
		method: "PATCH",
		headers: getAuthHeaders()
	}));
}
async function deleteNotification(id) {
	await parseResponse(await fetch(`${API_BASE_URL}/notifications/${id}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	}));
	return true;
}
var NAV_GROUPS = [
	{
		label: "Overview",
		items: [{
			to: "/admin",
			label: "Dashboard",
			icon: LayoutDashboard,
			exact: true,
			permission: "dashboard.view"
		}]
	},
	{
		label: "Content",
		items: [
			{
				to: "/admin/news",
				label: "News",
				icon: Newspaper,
				permission: "news.view",
				alwaysVisible: true
			},
			{
				to: "/admin/events",
				label: "Events",
				icon: Calendar,
				permission: "events.view",
				alwaysVisible: true
			},
			{
				to: "/admin/tenders",
				label: "Tenders",
				icon: FileText,
				permission: "tenders.view",
				alwaysVisible: true
			},
			{
				to: "/admin/vacancies",
				label: "Vacancies",
				icon: Briefcase,
				permission: "vacancies.view",
				alwaysVisible: true
			},
			{
				to: "/admin/job-applications",
				label: "Job Applications",
				icon: FileText,
				permission: "job_applications.view",
				alwaysVisible: true
			},
			{
				to: "/admin/publications",
				label: "Publications",
				icon: BookOpen,
				permission: "publications.view",
				alwaysVisible: true
			},
			{
				to: "/admin/city-admins",
				label: "City Administrations",
				icon: Building2,
				permission: "city_admins.view",
				alwaysVisible: true
			},
			{
				to: "/admin/directory",
				label: "Directorates",
				icon: Building2,
				permission: "directory.view",
				alwaysVisible: true
			}
		]
	},
	{
		label: "Administration",
		items: [
			{
				to: "/admin/users",
				label: "Users",
				icon: Users,
				permission: "users.view",
				superAdminOnly: true
			},
			{
				to: "/admin/accounts",
				label: "Admin Accounts",
				icon: ShieldCheck,
				superAdminOnly: true
			},
			{
				to: "/admin/roles",
				label: "Roles",
				icon: ShieldCheck,
				permission: "roles.view",
				superAdminOnly: true
			}
		]
	},
	{
		label: "Communication",
		items: [{
			to: "/admin/messages",
			label: "Messages",
			icon: MessageSquare,
			permission: "messages.view"
		}, {
			to: "/admin/notifications",
			label: "Notifications",
			icon: BellRing,
			permission: "notifications.view",
			alwaysVisible: true
		}]
	},
	{
		label: "System",
		items: [{
			to: "/admin/multimedia",
			label: "Multimedia Library",
			icon: Image,
			permission: "multimedia.view",
			alwaysVisible: true
		}, {
			to: "/admin/settings",
			label: "Settings",
			icon: Settings,
			permission: "settings.view",
			superAdminOnly: true
		}]
	},
	{
		label: "Background Image & Portfolio",
		items: [{
			to: "/admin/backgrounds",
			label: "Background Image",
			icon: Image,
			permission: "backgrounds.view",
			alwaysVisible: true
		}, {
			to: "/admin/portfolio",
			label: "Portfolio",
			icon: Image,
			permission: "portfolios.view",
			alwaysVisible: true
		}]
	}
];
function getDisplayName(user) {
	return user?.name || user?.full_name || user?.fullName || user?.username || user?.email || "Administrator";
}
function getDisplayEmail(user) {
	return user?.email || "";
}
function getDisplayRole(user, isSuperAdmin) {
	if (isSuperAdmin) return "Super Admin";
	const role = user?.role?.name || user?.role_name || user?.roleName || user?.role || "Admin";
	if (typeof role === "string") return role.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
	return "Admin";
}
function AdminLayout({ children, permission }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const { user, can, isSuperAdmin, signOut } = useAuth();
	const [openMobile, setOpenMobile] = (0, import_react.useState)(false);
	const [profileOpen, setProfileOpen] = (0, import_react.useState)(false);
	const [notifOpen, setNotifOpen] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setOpenMobile(false);
	}, [pathname]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setSearchOpen(true);
			}
			if (e.key === "Escape") {
				setSearchOpen(false);
				setNotifOpen(false);
				setProfileOpen(false);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
		};
	}, []);
	const hasPermission = !permission || isSuperAdmin || can(permission);
	const visibleGroups = (0, import_react.useMemo)(() => {
		return NAV_GROUPS.map((group) => ({
			...group,
			items: group.items.filter((item) => {
				if (isSuperAdmin) return true;
				if (item.superAdminOnly) return false;
				if (item.alwaysVisible) return true;
				if (item.to === "/admin/messages") return can("messages.view") || can("messages.create") || can("messages.update") || can("messages.delete");
				if (!item.permission) return true;
				return can(item.permission);
			})
		})).filter((group) => group.items.length > 0);
	}, [can, isSuperAdmin]);
	const allVisibleItems = (0, import_react.useMemo)(() => visibleGroups.flatMap((group) => group.items), [visibleGroups]);
	const displayName = getDisplayName(user);
	const displayEmail = getDisplayEmail(user);
	const displayRole = getDisplayRole(user, isSuperAdmin);
	const handleSignOut = async () => {
		if (signingOut) return;
		try {
			setSigningOut(true);
			await signOut();
			await navigate({ to: "/admin/login" });
		} catch (error) {
			console.error("Sign out failed:", error);
			setSigningOut(false);
		}
	};
	if (!hasPermission) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-secondary/40 px-4 py-8 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-[calc(100vh-4rem)] items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-elegant",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-gradient-to-br from-primary/10 via-background to-secondary/60 px-6 py-10 text-center sm:px-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-8 w-8" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
								children: "Restricted Area"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 font-display text-2xl font-bold tracking-tight",
								children: "This area is not available to you"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground",
								children: "Your account does not have the required permission to access this section of the Afar UDCB Administration Portal."
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t bg-card px-6 py-6 sm:px-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border bg-secondary/40 p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5 text-muted-foreground" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "Permission required"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-5 text-muted-foreground",
								children: "If you believe you should have access, please contact your Super Administrator to update your account permissions."
							})] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin",
							className: "inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90",
							children: "Return to Dashboard"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => navigate({ to: "/admin/login" }),
							className: "inline-flex items-center justify-center rounded-lg border bg-background px-5 py-2.5 text-sm font-medium transition hover:bg-secondary",
							children: "Switch Account"
						})]
					})]
				})]
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-secondary/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarNav, {
					pathname,
					openMobile,
					onClose: () => setOpenMobile(false),
					groups: visibleGroups,
					onSignOut: handleSignOut,
					signingOut
				}),
				openMobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-30 bg-black/40 lg:hidden",
					onClick: () => setOpenMobile(false)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-20 border-b bg-card/95 backdrop-blur",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 px-4 py-3 md:px-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "grid h-9 w-9 place-items-center rounded-md border lg:hidden",
									onClick: () => setOpenMobile((v) => !v),
									"aria-label": "Toggle sidebar",
									children: openMobile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSearchOpen(true),
									className: "group relative flex h-9 max-w-md flex-1 items-center rounded-lg border bg-background pl-9 pr-2 text-left text-sm text-muted-foreground hover:border-primary/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: "Search modules and pages…"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
											className: "ml-auto hidden rounded border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-foreground/60 sm:inline-block",
											children: "Ctrl+K"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationBell, {
									open: notifOpen,
									onOpenChange: setNotifOpen
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileMenu, {
									open: profileOpen,
									onOpenChange: setProfileOpen,
									displayName,
									displayEmail,
									displayRole,
									isSuperAdmin,
									onSignOut: handleSignOut,
									signingOut
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, {
							pathname,
							items: allVisibleItems
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-6 md:px-8 md:py-8",
						children
					})]
				})
			]
		}), searchOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalSearch, {
			onClose: () => setSearchOpen(false),
			items: allVisibleItems
		})]
	});
}
function SidebarNav({ pathname, openMobile, onClose, groups, onSignOut, signingOut }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-screen " + (openMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-sidebar-border px-5 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-lg bg-sidebar-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-base font-bold text-gold",
							children: "A"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate font-display text-sm font-semibold",
							children: "Afar UDCB"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-xs text-sidebar-foreground/70",
							children: "Admin Portal"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ml-auto grid h-8 w-8 place-items-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden",
						onClick: onClose,
						"aria-label": "Close menu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 overflow-y-auto px-3 py-4",
				children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroup, {
					group,
					pathname
				}, group.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-sidebar-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: signingOut,
					onClick: onSignOut,
					className: "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent disabled:cursor-not-allowed disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), signingOut ? "Signing out…" : "Sign out"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-1 block rounded-lg px-3 py-2 text-xs text-sidebar-foreground/60 hover:text-gold",
					children: "← Back to public portal"
				})]
			})
		]
	});
}
function SidebarGroup({ group, pathname }) {
	const hasActive = group.items.some((item) => item.exact ? pathname === item.to : pathname.startsWith(item.to));
	const [open, setOpen] = (0, import_react.useState)(hasActive || group.label === "Overview");
	(0, import_react.useEffect)(() => {
		if (hasActive) setOpen(true);
	}, [hasActive]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			className: "flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-gold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: group.label }), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-1 space-y-0.5",
			children: group.items.map((item) => {
				const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
				const Icon = item.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: item.to,
					className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors " + (active ? "bg-sidebar-accent text-gold" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: item.label
					})]
				}) }, item.to);
			})
		})]
	});
}
function useOutsideClick(onOutside) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const onDoc = (e) => {
			if (ref.current && !ref.current.contains(e.target)) onOutside();
		};
		document.addEventListener("mousedown", onDoc);
		return () => {
			document.removeEventListener("mousedown", onDoc);
		};
	}, [onOutside]);
	return ref;
}
function NotificationBell({ open, onOpenChange }) {
	const ref = useOutsideClick(() => onOpenChange(false));
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [markingId, setMarkingId] = (0, import_react.useState)(null);
	const [markingAll, setMarkingAll] = (0, import_react.useState)(false);
	const [loadError, setLoadError] = (0, import_react.useState)("");
	const unread = notifications.filter((notification) => !notification.is_read).length;
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function loadNotifications(showLoading = false) {
			try {
				if (showLoading) setLoading(true);
				setLoadError("");
				const data = await getNotifications();
				if (!cancelled) setNotifications(data);
			} catch (error) {
				if (!cancelled) setLoadError(error instanceof Error ? error.message : "Unable to load notifications.");
			} finally {
				if (!cancelled && showLoading) setLoading(false);
			}
		}
		loadNotifications(true);
		const interval = window.setInterval(() => {
			loadNotifications(false);
		}, 15e3);
		return () => {
			cancelled = true;
			window.clearInterval(interval);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		let cancelled = false;
		async function refreshNotifications() {
			try {
				const data = await getNotifications();
				if (!cancelled) setNotifications(data);
			} catch (error) {
				console.error("Failed to refresh notifications:", error);
			}
		}
		refreshNotifications();
		return () => {
			cancelled = true;
		};
	}, [open]);
	async function handleMarkAsRead(notification) {
		if (notification.is_read || markingId !== null || markingAll) return;
		try {
			setMarkingId(notification.id);
			const updated = await markNotificationAsRead(notification.id);
			setNotifications((current) => current.map((item) => item.id === notification.id ? updated : item));
		} catch (error) {
			console.error("Failed to mark notification as read:", error);
		} finally {
			setMarkingId(null);
		}
	}
	async function handleMarkAllAsRead() {
		if (unread === 0 || markingAll || markingId !== null) return;
		try {
			setMarkingAll(true);
			await markAllNotificationsAsRead();
			setNotifications((current) => current.map((notification) => ({
				...notification,
				is_read: true
			})));
		} catch (error) {
			console.error("Failed to mark all notifications as read:", error);
		} finally {
			setMarkingAll(false);
		}
	}
	const recentNotifications = notifications.slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		ref,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => onOpenChange(!open),
			className: "relative grid h-9 w-9 place-items-center rounded-md border bg-background transition hover:bg-secondary",
			"aria-label": "Notifications",
			"aria-expanded": open,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground shadow-sm",
				children: unread > 99 ? "99+" : unread
			})]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 top-11 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border bg-card shadow-elegant",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold",
					children: "Notifications"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-0.5 text-xs text-muted-foreground",
					children: unread > 0 ? `${unread} unread notification${unread === 1 ? "" : "s"}` : "You're all caught up"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: handleMarkAllAsRead,
						disabled: markingAll || markingId !== null,
						className: "rounded-md px-2 py-1 text-xs font-medium text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
						children: markingAll ? "Marking…" : "Mark all as read"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/notifications",
						onClick: () => onOpenChange(false),
						className: "rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10",
						children: "View all"
					})]
				})]
			}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center px-5 py-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 place-items-center rounded-full bg-primary/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-medium",
						children: "Checking notifications…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Getting the latest alerts."
					})
				]
			}) : loadError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid h-10 w-10 place-items-center rounded-full bg-destructive/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-5 w-5 text-destructive" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-medium",
						children: "Notifications unavailable"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-5 text-muted-foreground",
						children: "We couldn't retrieve your notifications right now."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onOpenChange(false),
						className: "mt-4 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-secondary",
						children: "Close"
					})
				]
			}) : recentNotifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 py-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-6 w-6 text-muted-foreground" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-semibold",
						children: "No notifications yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-5 text-muted-foreground",
						children: "New system alerts and activity notices will appear here."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "max-h-[22rem] divide-y overflow-y-auto",
				children: recentNotifications.map((notification) => {
					const isMarking = markingId === notification.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => handleMarkAsRead(notification),
						disabled: notification.is_read || markingId !== null || markingAll,
						className: "flex w-full gap-3 px-4 py-3 text-left transition hover:bg-secondary/70 " + (!notification.is_read ? "bg-primary/5" : ""),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full " + (notification.is_read ? "bg-secondary text-muted-foreground" : "bg-primary/10 text-primary"),
							children: isMarking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : notification.is_read ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "min-w-0 flex-1 truncate text-sm font-medium " + (!notification.is_read ? "text-foreground" : "text-foreground/80"),
										children: notification.title
									}), !notification.is_read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground",
									children: notification.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-[10px] text-muted-foreground",
									children: formatNotificationTime(notification.created_at)
								})
							]
						})]
					}) }, notification.id);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t bg-secondary/20 px-4 py-2.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/notifications",
					onClick: () => onOpenChange(false),
					className: "flex items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10",
					children: "Open notification center"
				})
			})] })]
		})]
	});
}
function formatNotificationTime(value) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleString();
}
function ProfileMenu({ open, onOpenChange, displayName, displayEmail, displayRole, isSuperAdmin, onSignOut, signingOut }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		ref: useOutsideClick(() => onOpenChange(false)),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => onOpenChange(!open),
			className: "flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 hover:bg-secondary",
			"aria-expanded": open,
			"aria-label": "Open account menu",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground",
					children: displayName.charAt(0).toUpperCase()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden text-left text-xs leading-tight sm:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-w-32 truncate font-medium",
						children: displayName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-muted-foreground",
						children: displayRole
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "hidden h-3 w-3 text-muted-foreground sm:block" })
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border bg-card shadow-elegant",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-semibold",
							children: displayName
						}),
						displayEmail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-xs text-muted-foreground",
							children: displayEmail
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs font-medium text-primary",
							children: displayRole
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "py-1 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/profile",
							onClick: () => onOpenChange(false),
							className: "flex items-center gap-2 px-4 py-2 hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), "My profile"]
						}) }),
						isSuperAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/settings",
							onClick: () => onOpenChange(false),
							className: "flex items-center gap-2 px-4 py-2 hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" }), "Settings"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#",
							className: "flex items-center gap-2 px-4 py-2 hover:bg-secondary",
							onClick: (event) => event.preventDefault(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-4 w-4" }), "Help"]
						}) })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t p-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: signingOut,
						onClick: onSignOut,
						className: "flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), signingOut ? "Signing out…" : "Sign out"]
					})
				})
			]
		})]
	});
}
function GlobalSearch({ onClose, items }) {
	const [q, setQ] = (0, import_react.useState)("");
	const results = (0, import_react.useMemo)(() => {
		if (!q.trim()) return items;
		return items.filter((item) => item.label.toLowerCase().includes(q.toLowerCase()));
	}, [q, items]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-24",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg overflow-hidden rounded-xl border bg-card shadow-elegant",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search modules and pages…",
						className: "h-12 flex-1 bg-transparent text-sm outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
						className: "rounded border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground",
						children: "Esc"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "max-h-80 overflow-y-auto py-2",
				children: [results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "px-4 py-6 text-center text-sm text-muted-foreground",
					children: "No matches"
				}), results.map((result) => {
					const Icon = result.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: result.to,
						onClick: onClose,
						className: "flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: result.label }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-auto font-mono text-[10px] text-muted-foreground",
								children: result.to
							})
						]
					}) }, result.to);
				})]
			})]
		})
	});
}
function Breadcrumbs({ pathname, items }) {
	const crumbs = (0, import_react.useMemo)(() => {
		const parts = pathname.split("/").filter(Boolean);
		const acc = [];
		let cur = "";
		for (const part of parts) {
			cur += "/" + part;
			const label = items.find((item) => item.to === cur)?.label ?? part.charAt(0).toUpperCase() + part.slice(1);
			acc.push({
				href: cur,
				label
			});
		}
		return acc;
	}, [pathname, items]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hidden border-t px-4 py-2 md:block md:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "flex items-center gap-1.5 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin",
				className: "hover:text-primary",
				children: "Admin"
			}), crumbs.slice(1).map((crumb, index, array) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }), index === array.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-foreground",
					children: crumb.label
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: crumb.label })]
			}, crumb.href))]
		})
	});
}
function AdminPageHeader({ title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-bold tracking-tight",
				children: title
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: description
			})]
		}), action]
	});
}
//#endregion
export { markAllNotificationsAsRead as a, getNotifications as i, AdminPageHeader as n, markNotificationAsRead as o, deleteNotification as r, AdminLayout as t };
