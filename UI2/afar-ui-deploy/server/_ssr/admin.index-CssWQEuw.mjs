import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as getDirectorates } from "./directorateService-DPp5QHcB.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as CircleAlert, H as Image, I as LockKeyhole, K as FileText, L as LoaderCircle, M as Mail, O as Newspaper, Q as CircleCheck, at as CalendarDays, ct as BriefcaseBusiness, h as ShieldCheck, lt as BookOpen, ot as Building2, pt as ArrowRight, r as Users, ut as Bell } from "../_libs/lucide-react.mjs";
import { i as getEvents } from "./eventService-CgJ8Pe9J.mjs";
import { i as getNews } from "./newsService-CiNVHUG4.mjs";
import { a as getTenders, i as getTenderStatus } from "./tenderService-FaLrKaDE.mjs";
import { r as getVacancies } from "./vacancyService-Da2NxTO3.mjs";
import { i as getMultimedia } from "./multimediaService-KsWseGkg.mjs";
import { r as getPublications } from "./publicationService-CDzKJ0s7.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
import { i as getNotifications, n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
import { r as getMessages } from "./messageService-Dxng2t9O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-CssWQEuw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY_STATE = {
	news: [],
	events: [],
	tenders: [],
	vacancies: [],
	publications: [],
	multimedia: [],
	directorates: [],
	messages: [],
	notifications: []
};
function formatDate(value) {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleDateString(void 0, {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
function getNewsTitle(item) {
	return item.title || "Untitled news";
}
function getEventTitle(item) {
	const title = item.title;
	if (typeof title === "string") return title || "Untitled event";
	if (title && typeof title === "object") {
		const multilingual = title;
		return multilingual.en || multilingual.am || "Untitled event";
	}
	return "Untitled event";
}
function getTenderTitle(item) {
	const title = item.title;
	if (typeof title === "string") return title || "Untitled tender";
	if (title && typeof title === "object") {
		const multilingual = title;
		return multilingual.en || multilingual.am || "Untitled tender";
	}
	return "Untitled tender";
}
function getTenderClosingDate(item) {
	return item.closes_at || null;
}
function Dashboard() {
	const { user, loading: authLoading, isSuperAdmin, can } = useAuth();
	const [data, setData] = (0, import_react.useState)(EMPTY_STATE);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [sectionErrors, setSectionErrors] = (0, import_react.useState)([]);
	const permissions = (0, import_react.useMemo)(() => ({
		news: can("news.view"),
		events: can("events.view"),
		tenders: can("tenders.view"),
		vacancies: can("vacancies.view"),
		publications: can("publications.view"),
		multimedia: can("multimedia.view"),
		directorates: can("directorates.view"),
		messages: can("messages.view"),
		notifications: can("notifications.view")
	}), [can]);
	(0, import_react.useEffect)(() => {
		if (authLoading || !user) return;
		let cancelled = false;
		async function loadDashboard() {
			setLoading(true);
			setError(null);
			setSectionErrors([]);
			const next = { ...EMPTY_STATE };
			const errors = [];
			const requests = [];
			if (permissions.news) requests.push(getNews().then((items) => {
				next.news = Array.isArray(items) ? items : [];
			}).catch(() => {
				errors.push({
					module: "News",
					message: "We couldn't load the latest news right now."
				});
			}));
			if (permissions.events) requests.push(getEvents().then((items) => {
				next.events = Array.isArray(items) ? items : [];
			}).catch(() => {
				errors.push({
					module: "Events",
					message: "We couldn't load the latest events right now."
				});
			}));
			if (permissions.tenders) requests.push(getTenders().then((items) => {
				next.tenders = Array.isArray(items) ? items : [];
			}).catch(() => {
				errors.push({
					module: "Tenders",
					message: "We couldn't load tender information right now."
				});
			}));
			if (permissions.vacancies) requests.push(getVacancies().then((items) => {
				next.vacancies = Array.isArray(items) ? items : [];
			}).catch(() => {
				errors.push({
					module: "Vacancies",
					message: "We couldn't load vacancy information right now."
				});
			}));
			if (permissions.publications) requests.push(getPublications().then((items) => {
				next.publications = Array.isArray(items) ? items : [];
			}).catch(() => {
				errors.push({
					module: "Publications",
					message: "We couldn't load publications right now."
				});
			}));
			if (permissions.multimedia) requests.push(getMultimedia().then((items) => {
				next.multimedia = Array.isArray(items) ? items : [];
			}).catch(() => {
				errors.push({
					module: "Multimedia",
					message: "We couldn't load multimedia information right now."
				});
			}));
			if (permissions.directorates) requests.push(getDirectorates().then((items) => {
				next.directorates = Array.isArray(items) ? items : [];
			}).catch(() => {
				errors.push({
					module: "Directorates",
					message: "We couldn't load directorate information right now."
				});
			}));
			if (permissions.messages) requests.push(getMessages(10).then((items) => {
				next.messages = Array.isArray(items) ? items : [];
			}).catch(() => {
				errors.push({
					module: "Messages",
					message: "We couldn't load contact messages right now."
				});
			}));
			if (permissions.notifications) requests.push(getNotifications().then((items) => {
				next.notifications = Array.isArray(items) ? items : [];
			}).catch(() => {
				errors.push({
					module: "Notifications",
					message: "We couldn't load notifications right now."
				});
			}));
			try {
				await Promise.all(requests);
				if (cancelled) return;
				setData(next);
				setSectionErrors(errors);
				if (errors.length > 0 && errors.length === requests.length) setError("We couldn't retrieve your dashboard information. Please try again in a moment.");
			} catch {
				if (!cancelled) setError("We couldn't retrieve your dashboard information. Please try again in a moment.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		}
		loadDashboard();
		return () => {
			cancelled = true;
		};
	}, [
		authLoading,
		user,
		permissions.news,
		permissions.events,
		permissions.tenders,
		permissions.vacancies,
		permissions.publications,
		permissions.multimedia,
		permissions.directorates,
		permissions.messages,
		permissions.notifications
	]);
	if (authLoading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[50vh] items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }), "Preparing your workspace..."]
		})
	}) });
	const availableModules = [
		permissions.news,
		permissions.events,
		permissions.tenders,
		permissions.vacancies,
		permissions.publications,
		permissions.multimedia,
		permissions.directorates,
		permissions.messages,
		permissions.notifications
	].filter(Boolean).length;
	const hasAnyModule = availableModules > 0;
	const unreadMessages = data.messages.filter((message) => message.is_read === false || message.is_read === 0).length;
	const publishedNews = data.news.filter((item) => String(item.status ?? "").toLowerCase() === "published").length;
	const publishedEvents = data.events.filter((item) => item.status === "published").length;
	const publishedTenders = data.tenders.filter((item) => String(item.status ?? "").toLowerCase() === "published").length;
	const recentNews = [...data.news].sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime()).slice(0, 4);
	const upcomingEvents = [...data.events].filter((event) => {
		const start = new Date(event.start_at).getTime();
		return !Number.isNaN(start) && start >= Date.now();
	}).sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()).slice(0, 4);
	const activeTenders = [...data.tenders].filter((tender) => {
		if (!tender.closes_at) return true;
		const closing = new Date(tender.closes_at).getTime();
		return !Number.isNaN(closing) && closing >= Date.now();
	}).sort((a, b) => new Date(a.closes_at || "").getTime() - new Date(b.closes_at || "").getTime()).slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Dashboard",
			description: "A clear overview of the portal areas available to your account."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-2xl border bg-card shadow-soft",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative p-6 sm:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-primary" }), isSuperAdmin ? "Super Administrator" : "Administrator"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-2xl font-bold tracking-tight sm:text-3xl",
							children: ["Welcome back, ", user.name || "Administrator"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground",
							children: isSuperAdmin ? "You have full administrative access to the Afar UDCB portal. Here's a live overview of your portal operations." : "Your workspace is focused on the portal areas assigned to your account. Use the available modules below to manage your responsibilities."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-3 rounded-xl border bg-background/80 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Signed in as"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold",
							children: user.email
						})] })]
					})]
				})
			})]
		}),
		!isSuperAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 rounded-xl border border-primary/15 bg-primary/5 p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display font-semibold",
						children: "Your workspace is personalized"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm leading-6 text-muted-foreground",
						children: [
							"Your account can access ",
							availableModules,
							" ",
							availableModules === 1 ? "portal area" : "portal areas",
							" ",
							"based on the permissions assigned to you. Areas outside your role are intentionally kept out of this dashboard."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Need access to another area? Please contact your Super Administrator."
					})
				] })]
			})
		}),
		loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 rounded-xl border bg-card p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-primary" }), "Loading the latest portal information..."]
			})
		}),
		!loading && error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display font-semibold",
						children: "Your dashboard needs a moment"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Your account is still signed in. This message concerns the dashboard data only."
					})
				] })]
			})
		}),
		!loading && sectionErrors.length > 0 && sectionErrors.length < availableModules && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium",
					children: "Some information could not be refreshed"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs leading-5 text-muted-foreground",
					children: "A few dashboard sections are temporarily unavailable. The rest of your workspace is still available."
				})] })]
			})
		}),
		!loading && hasAnyModule && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				permissions.news && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total News",
					value: data.news.length,
					secondary: `${publishedNews} published`,
					icon: Newspaper,
					href: "/admin/news"
				}),
				permissions.events && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Events",
					value: data.events.length,
					secondary: `${publishedEvents} published`,
					icon: CalendarDays,
					href: "/admin/events"
				}),
				permissions.tenders && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Tenders",
					value: data.tenders.length,
					secondary: `${publishedTenders} published`,
					icon: FileText,
					href: "/admin/tenders"
				}),
				permissions.vacancies && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Vacancies",
					value: data.vacancies.length,
					secondary: "Available in your workspace",
					icon: BriefcaseBusiness,
					href: "/admin/vacancies"
				}),
				permissions.publications && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Publications",
					value: data.publications.length,
					secondary: "Portal publications",
					icon: BookOpen,
					href: "/admin/publications"
				}),
				permissions.multimedia && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Multimedia",
					value: data.multimedia.length,
					secondary: "Images and videos",
					icon: Image,
					href: "/admin/multimedia"
				}),
				permissions.directorates && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Directorates",
					value: data.directorates.length,
					secondary: "Organizational directory",
					icon: Building2,
					href: "/admin/directory"
				}),
				permissions.messages && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Messages",
					value: data.messages.length,
					secondary: unreadMessages > 0 ? `${unreadMessages} unread` : "All messages reviewed",
					icon: Mail,
					href: "/admin/messages",
					highlight: unreadMessages > 0
				}),
				permissions.notifications && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Notifications",
					value: data.notifications.length,
					secondary: "Portal notifications",
					icon: Bell,
					href: "/admin/notifications"
				})
			]
		}),
		!loading && !hasAnyModule && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-2xl border bg-card p-8 text-center shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "h-6 w-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-4 font-display text-lg font-semibold",
					children: "Your workspace is ready"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground",
					children: "Your account is active, but no dashboard modules have been assigned yet. Please contact your Super Administrator to request access."
				})
			]
		}),
		!loading && permissions.news && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardSection, {
				title: "Recent News",
				description: "Latest portal news from the backend.",
				href: "/admin/news",
				actionLabel: "Manage",
				children: recentNews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, {
					icon: Newspaper,
					title: "No news yet",
					description: "There is no news content available yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: recentNews.map((item) => {
						const newsWithAdminFields = item;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 px-5 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "line-clamp-1 text-sm font-medium",
										children: getNewsTitle(item)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 text-xs text-muted-foreground",
										children: formatDate(newsWithAdminFields.published_at || newsWithAdminFields.created_at || item.date)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-secondary px-2 py-1 text-[10px] font-medium capitalize",
									children: newsWithAdminFields.status || "—"
								})
							]
						}, item.id);
					})
				})
			}), permissions.messages && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardSection, {
				title: "Recent Messages",
				description: "Latest contact messages received by the bureau.",
				href: "/admin/messages",
				actionLabel: "View all",
				children: data.messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, {
					icon: Mail,
					title: "No messages yet",
					description: "There are no contact messages available."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: data.messages.slice(0, 4).map((message) => {
						const unread = message.is_read === false || message.is_read === 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 px-5 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary",
									children: message.full_name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "line-clamp-1 text-sm font-medium",
											children: message.full_name
										}), unread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 shrink-0 rounded-full bg-primary" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "line-clamp-1 text-xs text-muted-foreground",
										children: message.subject
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "shrink-0 text-xs text-muted-foreground",
									children: formatDate(message.created_at)
								})
							]
						}, message.id);
					})
				})
			})]
		}),
		!loading && permissions.events && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardSection, {
				title: "Upcoming Events",
				description: "Events scheduled in the portal.",
				href: "/admin/events",
				actionLabel: "Manage",
				children: upcomingEvents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, {
					icon: CalendarDays,
					title: "No upcoming events",
					description: "There are currently no upcoming events."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 p-5 md:grid-cols-2",
					children: upcomingEvents.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border bg-background p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "line-clamp-2 text-sm font-semibold",
										children: getEventTitle(event)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 text-xs text-muted-foreground",
										children: formatDate(event.start_at)
									}),
									event.location && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 line-clamp-1 text-xs text-muted-foreground",
										children: event.location
									})
								]
							})]
						})
					}, event.id))
				})
			})
		}),
		!loading && permissions.tenders && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardSection, {
				title: "Active Tenders",
				description: "Tender opportunities currently available in the portal.",
				href: "/admin/tenders",
				actionLabel: "Manage",
				children: activeTenders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySection, {
					icon: FileText,
					title: "No active tenders",
					description: "There are currently no active tender opportunities."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Reference"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Title"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Closing"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: activeTenders.map((tender) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-4 font-mono text-xs text-muted-foreground",
									children: ["#", tender.id]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "max-w-md px-5 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "line-clamp-1 font-medium",
										children: getTenderTitle(tender)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), getTenderStatus(tender)]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4 text-muted-foreground",
									children: formatDate(getTenderClosingDate(tender))
								})
							]
						}, tender.id)) })]
					})
				})
			})
		}),
		isSuperAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-2xl border bg-card shadow-soft",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b px-5 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display font-semibold",
						children: "Administration"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "System administration tools available to Super Administrators."
					})] })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminQuickLink, {
						href: "/admin/users",
						label: "Users & Roles",
						icon: Users
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminQuickLink, {
						href: "/admin/accounts",
						label: "Admin Accounts",
						icon: ShieldCheck
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminQuickLink, {
						href: "/admin/permissions",
						label: "Permissions",
						icon: LockKeyhole
					})
				]
			})]
		})
	] });
}
function StatCard({ label, value, secondary, icon: Icon, href, highlight = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: href,
		className: "group rounded-xl border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
				}), highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary",
					children: "Attention"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 font-display text-3xl font-bold",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: secondary
			})
		]
	});
}
function DashboardSection({ title, description, href, actionLabel, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-xl border bg-card shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-4 border-b px-5 py-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display font-semibold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: description
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: href,
				className: "inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline",
				children: [actionLabel, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
			})]
		}), children]
	});
}
function EmptySection({ icon: Icon, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-5 py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid h-11 w-11 place-items-center rounded-full bg-secondary text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-sm font-medium",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: description
			})
		]
	});
}
function AdminQuickLink({ href, label, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: href,
		className: "group flex items-center gap-3 rounded-xl border p-4 transition hover:border-primary/30 hover:bg-primary/5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-9 w-9 place-items-center rounded-lg bg-secondary text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-auto h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" })
		]
	});
}
//#endregion
export { Dashboard as component };
