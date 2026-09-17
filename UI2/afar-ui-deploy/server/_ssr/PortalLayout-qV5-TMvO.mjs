import { r as __toESM } from "../_runtime.mjs";
import { t as logo_default } from "./logo-tEwjuJxT.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useLanguage } from "./language-DS3yJdlp.mjs";
import { i as getDirectorates } from "./directorateService-DPp5QHcB.mjs";
import { s as useSectionBackground } from "./site-images-D2zsZpZv.mjs";
import { t as getPublicSystemSettings } from "./systemSettingService-CP-8MRQw.mjs";
import { _ as Link, p as Outlet, u as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Menu, E as Phone, M as Mail, t as X, tt as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as FaFacebookF, r as FaTelegramPlane, t as FaXTwitter } from "../_libs/react-icons.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PortalLayout-qV5-TMvO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function isActivePath(pathname, to) {
	if (to === "/") return pathname === "/";
	const base = "/" + to.split("/").filter(Boolean)[0];
	return pathname === base || pathname.startsWith(base + "/");
}
function directorateLabel(directorate, lang) {
	if (lang === "am") return directorate.nameAm || directorate.name;
	return directorate.name || directorate.nameAm;
}
var SOCIAL_LINKS = {
	facebook: "",
	telegram: "",
	x: ""
};
function PortalLayout() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [openSub, setOpenSub] = (0, import_react.useState)(null);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { lang, setLang, t } = useLanguage();
	const [directorates, setDirectorates] = (0, import_react.useState)([]);
	const [publicSettings, setPublicSettings] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		getPublicSystemSettings().then(setPublicSettings).catch((error) => {
			console.error("Failed to load public system settings:", error);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function loadDirectorates() {
			try {
				const data = await getDirectorates();
				if (!cancelled) setDirectorates(data);
			} catch (error) {
				console.error("Failed to load directorates for navigation:", error);
			}
		}
		loadDirectorates();
		return () => {
			cancelled = true;
		};
	}, [pathname]);
	const MAIN_NAV = (0, import_react.useMemo)(() => {
		return [
			{
				to: "/",
				label: t("home")
			},
			{
				to: "/about",
				label: t("about")
			},
			{
				to: "/news",
				label: t("news"),
				children: [{
					to: "/news",
					label: t("latestNews")
				}, {
					to: "/events",
					label: t("upcomingEvents")
				}]
			},
			{
				to: "/tenders",
				label: t("tenders")
			},
			{
				to: "/multimedia/images",
				label: t("multimedia"),
				children: [{
					to: "/multimedia/images",
					label: t("imageGallery")
				}, {
					to: "/multimedia/videos",
					label: t("videoGallery")
				}]
			},
			{
				to: "/directory",
				label: t("directorate"),
				children: directorates.map((d) => ({
					to: `/directory/${d.id}`,
					label: directorateLabel(d, lang)
				}))
			},
			{
				to: "/city-admins",
				label: t("cityAdmins")
			},
			{
				to: "/vacancies",
				label: t("vacancies")
			},
			{
				to: "/publications",
				label: t("publications")
			},
			{
				to: "/contact",
				label: t("contact")
			}
		];
	}, [
		t,
		lang,
		directorates
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden bg-primary text-primary-foreground md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }), publicSettings.phone || "033-666-0577"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }), publicSettings.contact_email || "info@afarudcb.gov.et"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 text-primary-foreground/80",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: publicSettings.facebook_url || SOCIAL_LINKS.facebook || void 0,
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-label": "Facebook",
								className: "hover:text-gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaFacebookF, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: publicSettings.twitter_url || SOCIAL_LINKS.x || void 0,
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-label": "X",
								className: "hover:text-gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaXTwitter, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: SOCIAL_LINKS.telegram || void 0,
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-label": "Telegram",
								className: "hover:text-gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaTelegramPlane, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-2 h-3 w-px bg-primary-foreground/20" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setLang("en"),
								className: "transition-colors " + (lang === "en" ? "text-gold" : "hover:text-gold"),
								"aria-pressed": lang === "en",
								children: "EN"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setLang("am"),
								className: "transition-colors " + (lang === "am" ? "text-gold" : "hover:text-gold"),
								"aria-pressed": lang === "am",
								children: "አማ"
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 md:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/5 ring-1 ring-primary/10 shadow-soft",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: logo_default,
									alt: "Afar UDCB logo",
									className: "h-full w-full object-cover"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-display text-sm font-bold leading-tight text-foreground sm:text-base",
									children: publicSettings.organization_name || (lang === "am" ? "የአፋር ክልል መንግስት" : "Afar Regional Government")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-xs text-muted-foreground",
									children: publicSettings.portal_tagline || (lang === "am" ? "የከተማ ልማት እና ግንባታ ቢሮ" : "Urban Development & Construction Bureau")
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": open ? "Close menu" : "Open menu",
							className: "grid h-10 w-10 place-items-center rounded-none border border-border lg:hidden",
							onClick: () => setOpen((v) => !v),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "col-span-2 hidden lg:col-span-1 lg:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "flex items-center gap-1",
								children: MAIN_NAV.map((item) => {
									const active = isActivePath(pathname, item.to);
									const hasChildren = !!item.children?.length;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: hasChildren ? "group relative" : void 0,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: item.to,
											className: "relative inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors " + (active ? "text-primary" : "text-foreground/70 hover:text-primary"),
											children: [
												item.label,
												hasChildren && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 opacity-70 transition-transform group-hover:rotate-180" }),
												active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gold" })
											]
										}), hasChildren && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pointer-events-none absolute left-0 top-full z-50 pt-2 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "min-w-[320px] overflow-hidden rounded-none border bg-card py-1 shadow-elegant ring-1 ring-border",
												children: item.children.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: c.to,
													search: c.search,
													className: "block px-4 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary",
													children: c.label
												}) }, c.label))
											})
										})]
									}, item.label);
								})
							})
						})
					]
				}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "border-t bg-card lg:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mx-auto max-w-7xl px-4 py-2",
						children: [MAIN_NAV.map((item) => {
							const active = isActivePath(pathname, item.to);
							const hasChildren = !!item.children?.length;
							const isSubOpen = openSub === item.label;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [hasChildren ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setOpenSub(isSubOpen ? null : item.label),
								className: "flex w-full items-center justify-between rounded-full px-3 py-2.5 text-sm font-medium " + (active ? "bg-secondary text-primary" : "text-foreground/80"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 transition-transform " + (isSubOpen ? "rotate-180" : "") })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								onClick: () => setOpen(false),
								className: "block rounded-full px-3 py-2.5 text-sm font-medium " + (active ? "bg-secondary text-primary" : "text-foreground/80"),
								children: item.label
							}), hasChildren && isSubOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "ml-3 border-l pl-3",
								children: item.children.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: c.to,
									search: c.search,
									onClick: () => {
										setOpen(false);
										setOpenSub(null);
									},
									className: "block rounded-full px-3 py-2 text-sm text-foreground/70 hover:text-primary",
									children: c.label
								}) }, c.label))
							})] }, item.label);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "mt-2 flex items-center gap-2 border-t px-3 pt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "Language:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setLang("en"),
									className: "rounded-full border px-2 py-1 text-xs " + (lang === "en" ? "border-primary bg-primary text-primary-foreground" : ""),
									children: "EN"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setLang("am"),
									className: "rounded-full border px-2 py-1 text-xs " + (lang === "am" ? "border-primary bg-primary text-primary-foreground" : ""),
									children: "አማ"
								})
							]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, { publicSettings })
		]
	});
}
function SiteFooter({ publicSettings }) {
	const { t } = useLanguage();
	const quickLinks = [
		{
			to: "/",
			label: t("home")
		},
		{
			to: "/about",
			label: t("about")
		},
		{
			to: "/directory",
			label: t("directorate")
		},
		{
			to: "/news",
			label: t("news")
		},
		{
			to: "/contact",
			label: t("contact")
		},
		{
			to: "/admin/login",
			label: t("staffLogin")
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-16 bg-sidebar text-sidebar-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-sidebar-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: logo_default,
							alt: "Afar UDCB logo",
							className: "h-10 w-10 object-contain"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-sm font-semibold",
						children: publicSettings.organization_name || "Afar Regional Government"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-sidebar-foreground/70",
						children: publicSettings.portal_tagline || "UDCB"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-sidebar-foreground/70",
					children: publicSettings.about_summary || "Modernizing urban development and construction services across the Afar Regional State."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "font-display text-sm font-semibold text-gold",
					children: t("quickLinks")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2 text-sm text-sidebar-foreground/80",
					children: quickLinks.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: n.to,
						className: "hover:text-gold",
						children: n.label
					}) }, n.to))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "font-display text-sm font-semibold text-gold",
					children: t("contact")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2 text-sm text-sidebar-foreground/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" }), publicSettings.phone || "033-666-0577"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" }), "033-666-0576"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" }), publicSettings.contact_email || "info@afarudcb.gov.et"]
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "font-display text-sm font-semibold text-gold",
					children: t("follow")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: publicSettings.facebook_url || SOCIAL_LINKS.facebook || void 0,
							target: "_blank",
							rel: "noopener noreferrer",
							"aria-label": "Facebook",
							className: "grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent hover:bg-gold hover:text-gold-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaFacebookF, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: publicSettings.twitter_url || SOCIAL_LINKS.x || void 0,
							target: "_blank",
							rel: "noopener noreferrer",
							"aria-label": "X",
							className: "grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent hover:bg-gold hover:text-gold-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaXTwitter, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: SOCIAL_LINKS.telegram || void 0,
							target: "_blank",
							rel: "noopener noreferrer",
							"aria-label": "Telegram",
							className: "grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent hover:bg-gold hover:text-gold-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaTelegramPlane, { className: "h-4 w-4" })
						})
					]
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-sidebar-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-sidebar-foreground/60 md:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Afar UDCB. All rights reserved."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Designed and Developed by Skylink Technologies" })]
			})
		})]
	});
}
function PageHeader({ eyebrow, title, description, section = "default", backgroundImage }) {
	const managed = useSectionBackground(section);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden border-b",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-cover bg-center",
				style: { backgroundImage: `url(${backgroundImage || managed})` },
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-gradient-to-r from-primary/45 via-primary/25 to-primary/10",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto max-w-7xl px-4 py-12 text-primary-foreground sm:px-6 md:py-20",
				children: [
					eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium tracking-wide text-gold ring-1 ring-primary-foreground/25 backdrop-blur",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 rotate-[-90deg]" }), eyebrow]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-2xl font-bold tracking-tight drop-shadow-md sm:text-3xl md:text-5xl",
						children: title
					}),
					description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-2xl text-primary-foreground/95 drop-shadow sm:text-base md:text-lg",
						children: description
					})
				]
			})
		]
	});
}
//#endregion
export { PortalLayout as n, PageHeader as t };
