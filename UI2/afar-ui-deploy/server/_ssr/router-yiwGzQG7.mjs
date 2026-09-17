import { r as __toESM } from "../_runtime.mjs";
import { t as logo_default } from "./logo-tEwjuJxT.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as LanguageProvider } from "./language-DS3yJdlp.mjs";
import { _ as Link, b as useRouter, c as HeadContent, f as createRouter, g as createRootRouteWithContext, h as createFileRoute, m as lazyRouteComponent, p as Outlet, s as Scripts, u as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$40 } from "../_portal.about-D0Cf3_Oc.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$41 } from "../_portal.directory._directorateId-CUXzM35u.mjs";
import { t as Route$42 } from "../_portal.directory.index-Qs2Y56AP.mjs";
import { t as Route$43 } from "../_portal.events._id-bDjp4iBo.mjs";
import { t as Route$44 } from "../_portal.multimedia.images._id-CNfCio4C.mjs";
import { t as Route$45 } from "../_portal.multimedia.videos._id-CaKzRriu.mjs";
import { t as Route$46 } from "../_portal.news._id-BeC4CbCT.mjs";
import { t as Route$47 } from "../_portal.tenders._id-CaTwtGYX.mjs";
import { t as Route$48 } from "../_portal.vacancies._vacancyId-BDxl3Rfy.mjs";
import { t as Route$49 } from "../_portal.vacancies._vacancyId.apply-Bhwk4shf.mjs";
import { t as AuthProvider } from "./auth-BBdKdqLv.mjs";
import { t as Route$50 } from "./password-reset._token-aXgRBUzv.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-yiwGzQG7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var styles_default = "/assets/styles-BGrFEZAD.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
function Preloader() {
	const [hide, setHide] = (0, import_react.useState)(false);
	const [gone, setGone] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const t1 = setTimeout(() => setHide(true), 900);
		const t2 = setTimeout(() => setGone(true), 1500);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, []);
	if (gone) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-hidden": true,
		className: "fixed inset-0 z-[100] flex items-center justify-center gradient-hero transition-opacity duration-500",
		style: {
			opacity: hide ? 0 : 1,
			pointerEvents: hide ? "none" : "auto"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-6 text-primary-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid h-28 w-28 place-items-center rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/25 backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full border-2 border-gold/60 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logo_default,
						alt: "Afar UDCB",
						className: "h-20 w-20 object-contain"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg font-semibold",
						children: "Afar Regional Government"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-primary-foreground/70",
						children: "Urban Development & Construction Bureau"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1 w-40 overflow-hidden rounded-full bg-primary-foreground/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-1/2 animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-gold to-transparent" })
				})
			]
		})
	});
}
function RouteProgress() {
	const isLoading = useRouterState({ select: (s) => s.isLoading || s.isTransitioning });
	const [showSpinner, setShowSpinner] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!isLoading) {
			setShowSpinner(false);
			return;
		}
		const t = window.setTimeout(() => setShowSpinner(true), 250);
		return () => window.clearTimeout(t);
	}, [isLoading]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": !isLoading,
			className: "pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px] overflow-hidden",
			style: {
				opacity: isLoading ? 1 : 0,
				transition: "opacity 200ms"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-1/3 animate-[shimmer_1s_infinite] bg-gradient-to-r from-transparent via-gold to-transparent" })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "status",
			"aria-live": "polite",
			"aria-label": "Loading page",
			"aria-hidden": !showSpinner,
			className: "pointer-events-none fixed inset-0 z-[79] grid place-items-center",
			style: {
				opacity: showSpinner ? 1 : 0,
				transform: showSpinner ? "scale(1)" : "scale(0.96)",
				transition: "opacity 220ms ease, transform 220ms ease",
				background: showSpinner ? "color-mix(in oklab, var(--background) 55%, transparent)" : "transparent",
				backdropFilter: showSpinner ? "blur(6px)" : "none",
				WebkitBackdropFilter: showSpinner ? "blur(6px)" : "none"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-16 w-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 rounded-full",
							style: {
								background: "radial-gradient(closest-side, color-mix(in oklab, var(--gold) 35%, transparent), transparent 70%)",
								animation: "portal-pulse 1.8s ease-in-out infinite"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full border-[3px] border-primary/10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 rounded-full border-[3px]",
							style: {
								borderColor: "transparent",
								borderTopColor: "var(--gold)",
								borderRightColor: "color-mix(in oklab, var(--gold) 45%, transparent)",
								animation: "portal-spin 1.1s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-[6px] rounded-full border-[2px]",
							style: {
								borderColor: "transparent",
								borderBottomColor: "var(--primary)",
								borderLeftColor: "color-mix(in oklab, var(--primary) 40%, transparent)",
								animation: "portal-spin-reverse 1.6s ease-in-out infinite"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-[13px] rounded-full bg-background shadow-soft ring-1 ring-border grid place-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-bold tracking-[0.08em] text-primary",
								children: "AR"
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[13px] font-semibold tracking-wide text-foreground",
						children: ["Loading", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex ml-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "animate-[portal-dot_1.4s_infinite]",
									style: { animationDelay: "0ms" },
									children: "."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "animate-[portal-dot_1.4s_infinite]",
									style: { animationDelay: "200ms" },
									children: "."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "animate-[portal-dot_1.4s_infinite]",
									style: { animationDelay: "400ms" },
									children: "."
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-muted-foreground",
						children: "Please wait a moment"
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes portal-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes portal-spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes portal-pulse {
          0%, 100% { transform: scale(0.9); opacity: 0.45; }
          50% { transform: scale(1.08); opacity: 0.75; }
        }
        @keyframes portal-dot {
          0%, 20% { opacity: 0.2; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
          80%, 100% { opacity: 0.2; transform: translateY(0); }
        }
      ` })
	] });
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-7xl font-bold text-primary",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-xl font-semibold tracking-tight",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong. You can try again or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$39 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Afar Regional Government — Urban Development & Construction Bureau" },
			{
				name: "description",
				content: "Official portal of the Afar Regional State Urban Development and Construction Bureau — news, tenders, services, and public information."
			},
			{
				name: "author",
				content: "Afar UDCB"
			},
			{
				property: "og:title",
				content: "Afar Regional Government Portal"
			},
			{
				property: "og:description",
				content: "Official portal of the Afar Regional State Urban Development and Construction Bureau."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$39.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preloader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteProgress, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		] }) })
	});
}
var $$splitComponentImporter$38 = () => import("../_portal-CxVCtHSI.mjs");
var Route$38 = createFileRoute("/_portal")({ component: lazyRouteComponent($$splitComponentImporter$38, "component") });
var $$splitComponentImporter$37 = () => import("../_portal.index-BMkz6Yq6.mjs");
var Route$37 = createFileRoute("/_portal/")({
	head: () => ({ meta: [{ title: "Home — Afar Regional Government Portal" }, {
		name: "description",
		content: "Official portal of the Afar Regional State Urban Development and Construction Bureau — latest news, tenders, and services."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var $$splitComponentImporter$36 = () => import("../_portal.city-admins-DT17SmIE.mjs");
var Route$36 = createFileRoute("/_portal/city-admins")({
	head: () => ({ meta: [
		{ title: "City Administration — Afar UDCB" },
		{
			name: "description",
			content: "Mayors and city administration offices across the Afar Regional State."
		},
		{
			property: "og:title",
			content: "City Administration — Afar UDCB"
		},
		{
			property: "og:description",
			content: "Mayors and city administration offices across the Afar Regional State."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$36, "component")
});
var $$splitComponentImporter$35 = () => import("../_portal.contact-BCzNPpFu.mjs");
var Route$35 = createFileRoute("/_portal/contact")({
	head: () => ({ meta: [{ title: "Contact — Afar UDCB" }, {
		name: "description",
		content: "Get in touch with the Afar Regional State Urban Development and Construction Bureau."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("../_portal.directory-ComHlspf.mjs");
var Route$34 = createFileRoute("/_portal/directory")({ component: lazyRouteComponent($$splitComponentImporter$34, "component") });
var $$splitComponentImporter$33 = () => import("../_portal.events-CvReX14s.mjs");
var Route$33 = createFileRoute("/_portal/events")({ component: lazyRouteComponent($$splitComponentImporter$33, "component") });
var $$splitComponentImporter$32 = () => import("../_portal.publications-B8WZetoX.mjs");
var Route$32 = createFileRoute("/_portal/publications")({
	head: () => ({ meta: [{ title: "Publications - Afar UDCB" }, {
		name: "description",
		content: "Strategies, reports, manuals, and policy documents."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("../_portal.vacancies-SIARXfaG.mjs");
var Route$31 = createFileRoute("/_portal/vacancies")({
	head: () => ({ meta: [{ title: "Vacancies - Afar UDCB" }, {
		name: "description",
		content: "Current employment opportunities at Afar UDCB."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./admin.index-CssWQEuw.mjs");
var Route$30 = createFileRoute("/admin/")({
	head: () => ({ meta: [{ title: "Dashboard — Admin" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./admin.accounts-Cz4QfLqt.mjs");
var Route$29 = createFileRoute("/admin/accounts")({
	head: () => ({ meta: [{ title: "Admin Accounts" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./admin.activity--qKIlSgj.mjs");
var Route$28 = createFileRoute("/admin/activity")({
	head: () => ({ meta: [{ title: "User Activity" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./admin.backgrounds-DFfyMi7n.mjs");
var Route$27 = createFileRoute("/admin/backgrounds")({
	head: () => ({ meta: [{ title: "Background Images" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./admin.city-admins-C2LS8lO3.mjs");
var Route$26 = createFileRoute("/admin/city-admins")({ component: lazyRouteComponent($$splitComponentImporter$26, "component") });
var $$splitComponentImporter$25 = () => import("./admin.directory-BHMpvZPp.mjs");
var Route$25 = createFileRoute("/admin/directory")({
	head: () => ({ meta: [{ title: "Directorate Management" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./admin.events-Dv__2RoB.mjs");
var Route$24 = createFileRoute("/admin/events")({
	head: () => ({ meta: [{ title: "Event Management" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./admin.feedback-CtlxF18K.mjs");
var Route$23 = createFileRoute("/admin/feedback")({
	head: () => ({ meta: [{ title: "Feedback" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./admin.forgot-password-DElaCS04.mjs");
var Route$22 = createFileRoute("/admin/forgot-password")({
	head: () => ({ meta: [{ title: "Forgot Password — Afar UDCB" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./admin.job-applications-DNPv5Z-2.mjs");
var Route$21 = createFileRoute("/admin/job-applications")({
	head: () => ({ meta: [{ title: "Job Applications" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./admin.login-BDsyb35P.mjs");
var Route$20 = createFileRoute("/admin/login")({
	head: () => ({ meta: [{ title: "Staff Login - Afar UDCB" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./admin.messages-mZG7xSPV.mjs");
var Route$19 = createFileRoute("/admin/messages")({
	head: () => ({ meta: [{ title: "Contact Messages" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./admin.multimedia-fP-UZrfO.mjs");
var Route$18 = createFileRoute("/admin/multimedia")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./admin.news-cudGbecu.mjs");
var Route$17 = createFileRoute("/admin/news")({
	head: () => ({ meta: [{ title: "News Management" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./admin.notifications-4do2w_qq.mjs");
var Route$16 = createFileRoute("/admin/notifications")({
	head: () => ({ meta: [{ title: "Notifications" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./admin.portfolio-CjTfOfM8.mjs");
var Route$15 = createFileRoute("/admin/portfolio")({
	head: () => ({ meta: [{ title: "Portfolio" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./admin.profile-B2w9pvpQ.mjs");
var Route$14 = createFileRoute("/admin/profile")({
	head: () => ({ meta: [{ title: "My Profile" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./admin.publications-CNJX6ZNB.mjs");
var Route$13 = createFileRoute("/admin/publications")({
	head: () => ({ meta: [{ title: "Publication Management" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./admin.register-B6qzZ_ju.mjs");
var Route$12 = createFileRoute("/admin/register")({
	component: lazyRouteComponent($$splitComponentImporter$12, "component"),
	head: () => ({ meta: [{ title: "Create Admin Account — Afar UDCB" }] })
});
var $$splitComponentImporter$11 = () => import("./admin.roles-BcQAtNbP.mjs");
var Route$11 = createFileRoute("/admin/roles")({
	head: () => ({ meta: [{ title: "Role Management" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./admin.settings-DFEV3L-8.mjs");
var Route$10 = createFileRoute("/admin/settings")({
	head: () => ({ meta: [{ title: "System Settings" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin.tenders-d92b-XA5.mjs");
var Route$9 = createFileRoute("/admin/tenders")({
	head: () => ({ meta: [{ title: "Tender Management" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./admin.users-KKOJvQqZ.mjs");
var Route$8 = createFileRoute("/admin/users")({
	head: () => ({ meta: [{ title: "Users & Roles" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin.vacancies-Bq3pABXE.mjs");
var Route$7 = createFileRoute("/admin/vacancies")({
	head: () => ({ meta: [{ title: "Vacancy Management" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("../_portal.events.index-BDe1RF0A.mjs");
var Route$6 = createFileRoute("/_portal/events/")({
	head: () => ({ meta: [{ title: "Events — Afar UDCB" }, {
		name: "description",
		content: "Upcoming events, forums, workshops, and consultations."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("../_portal.multimedia.images-KpNFKeOu.mjs");
var Route$5 = createFileRoute("/_portal/multimedia/images")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("../_portal.multimedia.videos-DoRGJKiQ.mjs");
var Route$4 = createFileRoute("/_portal/multimedia/videos")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("../_portal.news.index-Ba7EaFTH.mjs");
var Route$3 = createFileRoute("/_portal/news/")({
	head: () => ({ meta: [{ title: "News — Afar UDCB" }, {
		name: "description",
		content: "Latest news and announcements from the Afar UDCB."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("../_portal.tenders.index-B_1x15zu.mjs");
var Route$2 = createFileRoute("/_portal/tenders/")({
	head: () => ({ meta: [{ title: "Tenders — Afar UDCB" }, {
		name: "description",
		content: "Tenders published by the Afar UDCB."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_portal.multimedia.images.index-CsIYuVnn.mjs");
var Route$1 = createFileRoute("/_portal/multimedia/images/")({
	head: () => ({ meta: [{ title: "Image Gallery - Afar UDCB" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_portal.multimedia.videos.index-u8PRjBhI.mjs");
var Route = createFileRoute("/_portal/multimedia/videos/")({
	head: () => ({ meta: [{ title: "Video Gallery — Afar UDCB" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var PortalRoute = Route$38.update({
	id: "/_portal",
	getParentRoute: () => Route$39
});
var PortalIndexRoute = Route$37.update({
	id: "/",
	path: "/",
	getParentRoute: () => PortalRoute
});
var PortalAboutRoute = Route$40.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => PortalRoute
});
var PortalCityAdminsRoute = Route$36.update({
	id: "/city-admins",
	path: "/city-admins",
	getParentRoute: () => PortalRoute
});
var PortalContactRoute = Route$35.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => PortalRoute
});
var PortalDirectoryRoute = Route$34.update({
	id: "/directory",
	path: "/directory",
	getParentRoute: () => PortalRoute
});
var PortalEventsRoute = Route$33.update({
	id: "/events",
	path: "/events",
	getParentRoute: () => PortalRoute
});
var PortalPublicationsRoute = Route$32.update({
	id: "/publications",
	path: "/publications",
	getParentRoute: () => PortalRoute
});
var PortalVacanciesRoute = Route$31.update({
	id: "/vacancies",
	path: "/vacancies",
	getParentRoute: () => PortalRoute
});
var AdminIndexRoute = Route$30.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$39
});
var AdminAccountsRoute = Route$29.update({
	id: "/admin/accounts",
	path: "/admin/accounts",
	getParentRoute: () => Route$39
});
var AdminActivityRoute = Route$28.update({
	id: "/admin/activity",
	path: "/admin/activity",
	getParentRoute: () => Route$39
});
var AdminBackgroundsRoute = Route$27.update({
	id: "/admin/backgrounds",
	path: "/admin/backgrounds",
	getParentRoute: () => Route$39
});
var AdminCityAdminsRoute = Route$26.update({
	id: "/admin/city-admins",
	path: "/admin/city-admins",
	getParentRoute: () => Route$39
});
var AdminDirectoryRoute = Route$25.update({
	id: "/admin/directory",
	path: "/admin/directory",
	getParentRoute: () => Route$39
});
var AdminEventsRoute = Route$24.update({
	id: "/admin/events",
	path: "/admin/events",
	getParentRoute: () => Route$39
});
var AdminFeedbackRoute = Route$23.update({
	id: "/admin/feedback",
	path: "/admin/feedback",
	getParentRoute: () => Route$39
});
var AdminForgotPasswordRoute = Route$22.update({
	id: "/admin/forgot-password",
	path: "/admin/forgot-password",
	getParentRoute: () => Route$39
});
var AdminJobApplicationsRoute = Route$21.update({
	id: "/admin/job-applications",
	path: "/admin/job-applications",
	getParentRoute: () => Route$39
});
var AdminLoginRoute = Route$20.update({
	id: "/admin/login",
	path: "/admin/login",
	getParentRoute: () => Route$39
});
var AdminMessagesRoute = Route$19.update({
	id: "/admin/messages",
	path: "/admin/messages",
	getParentRoute: () => Route$39
});
var AdminMultimediaRoute = Route$18.update({
	id: "/admin/multimedia",
	path: "/admin/multimedia",
	getParentRoute: () => Route$39
});
var AdminNewsRoute = Route$17.update({
	id: "/admin/news",
	path: "/admin/news",
	getParentRoute: () => Route$39
});
var AdminNotificationsRoute = Route$16.update({
	id: "/admin/notifications",
	path: "/admin/notifications",
	getParentRoute: () => Route$39
});
var AdminPortfolioRoute = Route$15.update({
	id: "/admin/portfolio",
	path: "/admin/portfolio",
	getParentRoute: () => Route$39
});
var AdminProfileRoute = Route$14.update({
	id: "/admin/profile",
	path: "/admin/profile",
	getParentRoute: () => Route$39
});
var AdminPublicationsRoute = Route$13.update({
	id: "/admin/publications",
	path: "/admin/publications",
	getParentRoute: () => Route$39
});
var AdminRegisterRoute = Route$12.update({
	id: "/admin/register",
	path: "/admin/register",
	getParentRoute: () => Route$39
});
var AdminRolesRoute = Route$11.update({
	id: "/admin/roles",
	path: "/admin/roles",
	getParentRoute: () => Route$39
});
var AdminSettingsRoute = Route$10.update({
	id: "/admin/settings",
	path: "/admin/settings",
	getParentRoute: () => Route$39
});
var AdminTendersRoute = Route$9.update({
	id: "/admin/tenders",
	path: "/admin/tenders",
	getParentRoute: () => Route$39
});
var AdminUsersRoute = Route$8.update({
	id: "/admin/users",
	path: "/admin/users",
	getParentRoute: () => Route$39
});
var AdminVacanciesRoute = Route$7.update({
	id: "/admin/vacancies",
	path: "/admin/vacancies",
	getParentRoute: () => Route$39
});
var PasswordResetTokenRoute = Route$50.update({
	id: "/password-reset/$token",
	path: "/password-reset/$token",
	getParentRoute: () => Route$39
});
var PortalDirectoryIndexRoute = Route$42.update({
	id: "/",
	path: "/",
	getParentRoute: () => PortalDirectoryRoute
});
var PortalDirectoryDirectorateIdRoute = Route$41.update({
	id: "/$directorateId",
	path: "/$directorateId",
	getParentRoute: () => PortalDirectoryRoute
});
var PortalEventsIndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => PortalEventsRoute
});
var PortalEventsIdRoute = Route$43.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => PortalEventsRoute
});
var PortalMultimediaImagesRoute = Route$5.update({
	id: "/multimedia/images",
	path: "/multimedia/images",
	getParentRoute: () => PortalRoute
});
var PortalMultimediaVideosRoute = Route$4.update({
	id: "/multimedia/videos",
	path: "/multimedia/videos",
	getParentRoute: () => PortalRoute
});
var PortalNewsIndexRoute = Route$3.update({
	id: "/news/",
	path: "/news/",
	getParentRoute: () => PortalRoute
});
var PortalNewsIdRoute = Route$46.update({
	id: "/news/$id",
	path: "/news/$id",
	getParentRoute: () => PortalRoute
});
var PortalTendersIndexRoute = Route$2.update({
	id: "/tenders/",
	path: "/tenders/",
	getParentRoute: () => PortalRoute
});
var PortalTendersIdRoute = Route$47.update({
	id: "/tenders/$id",
	path: "/tenders/$id",
	getParentRoute: () => PortalRoute
});
var PortalVacanciesVacancyIdRoute = Route$48.update({
	id: "/$vacancyId",
	path: "/$vacancyId",
	getParentRoute: () => PortalVacanciesRoute
});
var PortalMultimediaImagesIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => PortalMultimediaImagesRoute
});
var PortalMultimediaImagesIdRoute = Route$44.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => PortalMultimediaImagesRoute
});
var PortalMultimediaVideosIndexRoute = Route.update({
	id: "/",
	path: "/",
	getParentRoute: () => PortalMultimediaVideosRoute
});
var PortalMultimediaVideosIdRoute = Route$45.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => PortalMultimediaVideosRoute
});
var PortalVacanciesVacancyIdApplyRoute = Route$49.update({
	id: "/apply",
	path: "/apply",
	getParentRoute: () => PortalVacanciesVacancyIdRoute
});
var PortalDirectoryRouteChildren = {
	PortalDirectoryDirectorateIdRoute,
	PortalDirectoryIndexRoute
};
var PortalDirectoryRouteWithChildren = PortalDirectoryRoute._addFileChildren(PortalDirectoryRouteChildren);
var PortalEventsRouteChildren = {
	PortalEventsIdRoute,
	PortalEventsIndexRoute
};
var PortalEventsRouteWithChildren = PortalEventsRoute._addFileChildren(PortalEventsRouteChildren);
var PortalVacanciesVacancyIdRouteChildren = { PortalVacanciesVacancyIdApplyRoute };
var PortalVacanciesRouteChildren = { PortalVacanciesVacancyIdRoute: PortalVacanciesVacancyIdRoute._addFileChildren(PortalVacanciesVacancyIdRouteChildren) };
var PortalVacanciesRouteWithChildren = PortalVacanciesRoute._addFileChildren(PortalVacanciesRouteChildren);
var PortalMultimediaImagesRouteChildren = {
	PortalMultimediaImagesIdRoute,
	PortalMultimediaImagesIndexRoute
};
var PortalMultimediaImagesRouteWithChildren = PortalMultimediaImagesRoute._addFileChildren(PortalMultimediaImagesRouteChildren);
var PortalMultimediaVideosRouteChildren = {
	PortalMultimediaVideosIdRoute,
	PortalMultimediaVideosIndexRoute
};
var PortalRouteChildren = {
	PortalAboutRoute,
	PortalCityAdminsRoute,
	PortalContactRoute,
	PortalDirectoryRoute: PortalDirectoryRouteWithChildren,
	PortalEventsRoute: PortalEventsRouteWithChildren,
	PortalPublicationsRoute,
	PortalVacanciesRoute: PortalVacanciesRouteWithChildren,
	PortalIndexRoute,
	PortalMultimediaImagesRoute: PortalMultimediaImagesRouteWithChildren,
	PortalMultimediaVideosRoute: PortalMultimediaVideosRoute._addFileChildren(PortalMultimediaVideosRouteChildren),
	PortalNewsIdRoute,
	PortalTendersIdRoute,
	PortalNewsIndexRoute,
	PortalTendersIndexRoute
};
var rootRouteChildren = {
	PortalRoute: PortalRoute._addFileChildren(PortalRouteChildren),
	AdminAccountsRoute,
	AdminActivityRoute,
	AdminBackgroundsRoute,
	AdminCityAdminsRoute,
	AdminDirectoryRoute,
	AdminEventsRoute,
	AdminFeedbackRoute,
	AdminForgotPasswordRoute,
	AdminJobApplicationsRoute,
	AdminLoginRoute,
	AdminMessagesRoute,
	AdminMultimediaRoute,
	AdminNewsRoute,
	AdminNotificationsRoute,
	AdminPortfolioRoute,
	AdminProfileRoute,
	AdminPublicationsRoute,
	AdminRegisterRoute,
	AdminRolesRoute,
	AdminSettingsRoute,
	AdminTendersRoute,
	AdminUsersRoute,
	AdminVacanciesRoute,
	PasswordResetTokenRoute,
	AdminIndexRoute
};
var routeTree = Route$39._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
