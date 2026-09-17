import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { i as getDirectorates } from "./_ssr/directorateService-DPp5QHcB.mjs";
import { s as useSectionBackground } from "./_ssr/site-images-D2zsZpZv.mjs";
import { t as getPublicSystemSettings } from "./_ssr/systemSettingService-CP-8MRQw.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { E as Phone, K as FileText, M as Mail, O as Newspaper, et as ChevronRight, it as Calendar, j as MapPin, ot as Building2, pt as ArrowRight, st as Briefcase } from "./_libs/lucide-react.mjs";
import { r as getCityAdmins } from "./_ssr/cityAdminService-Ca61c8rE.mjs";
import { i as getEvents } from "./_ssr/eventService-CgJ8Pe9J.mjs";
import { i as getNews } from "./_ssr/newsService-CiNVHUG4.mjs";
import { a as getTenders } from "./_ssr/tenderService-FaLrKaDE.mjs";
import { r as getVacancies } from "./_ssr/vacancyService-Da2NxTO3.mjs";
import { r as getPortfolios } from "./_ssr/portfolioService-BEMgj0ue.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.index-BMkz6Yq6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getLocalizedText(value) {
	if (!value) return "";
	if (typeof value === "string") return value;
	return value.en || value.am || "";
}
function isTenderOpen(tender) {
	if (!tender.closes_at) return true;
	const closeDate = new Date(tender.closes_at).getTime();
	if (Number.isNaN(closeDate)) return true;
	return closeDate >= Date.now();
}
function HomePage() {
	const homeBackground = useSectionBackground("home");
	const [publicSettings, setPublicSettings] = (0, import_react.useState)({});
	const [latestNews, setLatestNews] = (0, import_react.useState)([]);
	const [latestTenders, setLatestTenders] = (0, import_react.useState)([]);
	const [latestVacancies, setLatestVacancies] = (0, import_react.useState)([]);
	const [upcomingEvents, setUpcomingEvents] = (0, import_react.useState)([]);
	const [portfolioItems, setPortfolioItems] = (0, import_react.useState)([]);
	const [portfolioLoading, setPortfolioLoading] = (0, import_react.useState)(true);
	const [portfolioError, setPortfolioError] = (0, import_react.useState)(null);
	const [directorateCount, setDirectorateCount] = (0, import_react.useState)(0);
	const [cityAdminCount, setCityAdminCount] = (0, import_react.useState)(0);
	const [newsLoading, setNewsLoading] = (0, import_react.useState)(true);
	const [tendersLoading, setTendersLoading] = (0, import_react.useState)(true);
	const [vacanciesLoading, setVacanciesLoading] = (0, import_react.useState)(true);
	const [eventsLoading, setEventsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		getPublicSystemSettings().then(setPublicSettings).catch((error) => {
			console.error("Failed to load public system settings:", error);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		async function loadNews() {
			try {
				const sorted = [...await getNews()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
				setLatestNews(sorted);
			} catch (error) {
				console.error("Failed to load home page news:", error);
				setLatestNews([]);
			} finally {
				setNewsLoading(false);
			}
		}
		loadNews();
	}, []);
	(0, import_react.useEffect)(() => {
		async function loadTenders() {
			try {
				setTendersLoading(true);
				const data = await getTenders();
				console.log("HOME TENDERS FROM DATABASE:", data);
				const openTenders = data.filter(isTenderOpen).sort((a, b) => {
					const aDate = a.published_at ? new Date(a.published_at).getTime() : new Date(a.created_at).getTime();
					return (b.published_at ? new Date(b.published_at).getTime() : new Date(b.created_at).getTime()) - aDate;
				}).slice(0, 3);
				setLatestTenders(openTenders);
			} catch (error) {
				console.error("Failed to load home page tenders:", error);
				setLatestTenders([]);
			} finally {
				setTendersLoading(false);
			}
		}
		loadTenders();
	}, []);
	(0, import_react.useEffect)(() => {
		async function loadVacancies() {
			try {
				const data = await getVacancies();
				const now = Date.now();
				const activeVacancies = data.filter((vacancy) => {
					if (vacancy.status?.toLowerCase() !== "published") return false;
					if (!vacancy.deadline) return true;
					const deadline = new Date(vacancy.deadline).getTime();
					return !Number.isNaN(deadline) && deadline >= now;
				}).sort((a, b) => {
					const aDate = a.published_at ? new Date(a.published_at).getTime() : 0;
					return (b.published_at ? new Date(b.published_at).getTime() : 0) - aDate;
				}).slice(0, 3);
				setLatestVacancies(activeVacancies);
			} catch (error) {
				console.error("Failed to load home page vacancies:", error);
				setLatestVacancies([]);
			} finally {
				setVacanciesLoading(false);
			}
		}
		loadVacancies();
	}, []);
	(0, import_react.useEffect)(() => {
		async function loadEvents() {
			try {
				const data = await getEvents();
				const now = /* @__PURE__ */ new Date();
				const upcoming = data.filter((event) => {
					const eventEndDate = new Date(event.end_at);
					return !Number.isNaN(eventEndDate.getTime()) && eventEndDate >= now;
				}).sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()).slice(0, 3);
				setUpcomingEvents(upcoming);
			} catch (error) {
				console.error("Failed to load home page events:", error);
				setUpcomingEvents([]);
			} finally {
				setEventsLoading(false);
			}
		}
		loadEvents();
	}, []);
	(0, import_react.useEffect)(() => {
		async function loadCounts() {
			try {
				const [directorates, cityAdmins] = await Promise.all([getDirectorates(), getCityAdmins()]);
				setDirectorateCount(directorates.length);
				setCityAdminCount(cityAdmins.length);
			} catch (error) {
				console.error("Failed to load directorate/city admin counts:", error);
			}
		}
		loadCounts();
	}, []);
	(0, import_react.useEffect)(() => {
		async function loadPortfolio() {
			try {
				setPortfolioLoading(true);
				setPortfolioError(null);
				setPortfolioItems(await getPortfolios());
			} catch (error) {
				console.error("Failed to load home page portfolio:", error);
				setPortfolioItems([]);
				setPortfolioError("Unable to load portfolio items.");
			} finally {
				setPortfolioLoading(false);
			}
		}
		loadPortfolio();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-fade-in-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden gradient-hero",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: homeBackground || "/assets/background-C3IlGoHd.png",
						alt: "Afar regional landscape at golden hour with government building",
						className: "absolute inset-0 h-full w-full object-cover opacity-55",
						width: 1920,
						height: 1088
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/45 to-primary/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 opacity-10",
						style: { backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.9 0.15 75) 0, transparent 40%), radial-gradient(circle at 80% 80%, oklch(0.5 0.1 258) 0, transparent 40%)" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative mx-auto max-w-7xl px-6 py-16 md:py-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-10 lg:grid-cols-2 lg:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-primary-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-gold ring-1 ring-primary-foreground/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-gold" }), publicSettings.portal_tagline || "Official Government Portal"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "mt-4 font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl",
										children: publicSettings.hero_headline || "Building a modern, connected Afar"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 max-w-xl text-lg text-primary-foreground/80",
										children: publicSettings.hero_subheadline || publicSettings.about_summary || "The Afar Regional State Urban Development and Construction Bureau delivers services, information, and opportunities to citizens, contractors, and partners."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-8 flex flex-wrap gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/directory",
											className: "inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-gold-foreground transition hover:brightness-110",
											children: ["Explore Directorate", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/tenders",
											className: "inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/5 px-5 py-3 text-sm font-semibold text-primary-foreground backdrop-blur hover:bg-primary-foreground/10",
											children: "View Tenders"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-10 grid grid-cols-3 gap-4 border-t border-primary-foreground/10 pt-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												label: "Directorates",
												value: String(directorateCount)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												label: "City Admins",
												value: String(cityAdminCount)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												label: "Active Tenders",
												value: String(latestTenders.length)
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative hidden lg:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickTile, {
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, { className: "h-5 w-5" }),
											label: "News",
											to: "/news"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickTile, {
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" }),
											label: "Tenders",
											to: "/tenders"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickTile, {
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-5 w-5" }),
											label: "Vacancies",
											to: "/vacancies"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickTile, {
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5" }),
											label: "Directory",
											to: "/directory"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickTile, {
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-5 w-5" }),
											label: "Events",
											to: "/events"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickTile, {
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" }),
											label: "Publications",
											to: "/publications"
										})
									]
								})
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b bg-card lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-7xl grid-cols-3 gap-2 px-4 py-4",
					children: [
						{
							icon: Newspaper,
							label: "News",
							to: "/news"
						},
						{
							icon: FileText,
							label: "Tenders",
							to: "/tenders"
						},
						{
							icon: Briefcase,
							label: "Vacancies",
							to: "/vacancies"
						},
						{
							icon: Building2,
							label: "Directory",
							to: "/directory"
						},
						{
							icon: Calendar,
							label: "Events",
							to: "/events"
						},
						{
							icon: Phone,
							label: "Contact",
							to: "/contact"
						}
					].map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: q.to,
						className: "flex flex-col items-center gap-1 rounded-lg border bg-background px-2 py-3 text-xs font-medium text-foreground/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(q.icon, { className: "h-4 w-4 text-primary" }), q.label]
					}, q.to))
				})
			}),
			publicSettings.show_news !== false && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Newsroom",
				title: "Latest News",
				href: "/news"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-7xl px-6 pb-14",
				children: newsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMessage, { message: "Loading latest news..." }) : latestNews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMessage, { message: "No news available." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-6 md:grid-cols-2 lg:grid-cols-4",
					children: latestNews.map((n) => {
						const title = getLocalizedText(n.title);
						const excerpt = getLocalizedText(n.excerpt);
						const category = getLocalizedText(n.category);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/news/$id",
							params: { id: String(n.id) },
							className: "group overflow-hidden rounded-xl border bg-card shadow-soft transition hover:shadow-elegant",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "aspect-[4/3] overflow-hidden bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: n.image,
									alt: title || "News",
									className: "h-full w-full object-cover transition duration-500 group-hover:scale-105",
									loading: "lazy",
									onError: (event) => {
										event.currentTarget.src = "/News1.jpg";
									}
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground",
												children: category || "News"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: formatDate(n.date) })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-2 line-clamp-2 font-display text-base font-semibold leading-snug text-foreground group-hover:text-primary",
										children: title || "Untitled News"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 line-clamp-2 text-sm text-muted-foreground",
										children: excerpt
									})
								]
							})]
						}, n.id);
					})
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y bg-secondary/40 py-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2",
					children: [publicSettings.show_tenders !== false && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						eyebrow: "Procurement",
						title: "Open Tenders",
						href: "/tenders",
						inline: true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 space-y-3",
						children: tendersLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMessage, { message: "Loading tenders..." }) : latestTenders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMessage, { message: "There are currently no open tenders." }) : latestTenders.map((tender) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tenders/$id",
							params: { id: String(tender.id) },
							className: "block rounded-xl border bg-card p-4 transition hover:shadow-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs font-mono text-muted-foreground",
											children: ["#", tender.id]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 line-clamp-2 font-medium text-foreground",
											children: getTenderTitle(tender)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3 w-3" }), tender.category_id !== null ? `Category ${tender.category_id}` : "Procurement"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }),
													"Closes",
													" ",
													formatDate(tender.closes_at)
												]
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 shrink-0 text-muted-foreground" })]
							})
						}, tender.id))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						eyebrow: "Careers",
						title: "Vacancies",
						href: "/vacancies",
						inline: true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 space-y-3",
						children: vacanciesLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMessage, { message: "Loading vacancies..." }) : latestVacancies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMessage, { message: "There are currently no vacancies." }) : latestVacancies.map((vacancy) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/vacancies",
								className: "block rounded-xl border bg-card p-4 transition hover:shadow-soft",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium text-foreground",
												children: getLocalizedText(vacancy.title) || "Untitled vacancy"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 text-xs text-muted-foreground",
												children: vacancy.status?.toLowerCase() === "published" ? "Published" : "Draft"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 text-xs text-muted-foreground",
												children: [
													"Deadline:",
													" ",
													vacancy.deadline ? formatDate(vacancy.deadline) : "No deadline"
												]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 rounded-full bg-accent px-2 py-1 text-[10px] font-semibold uppercase text-accent-foreground",
										children: vacancy.status || "unknown"
									})]
								})
							}, vacancy.id);
						})
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Portfolio",
				title: "Projects & Milestones",
				href: "/news"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-7xl px-6 pb-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-3",
					children: portfolioLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-full py-8 text-center text-sm text-muted-foreground",
						children: "Loading portfolio..."
					}) : portfolioError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-full py-8 text-center text-sm text-destructive",
						children: portfolioError
					}) : portfolioItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-full py-8 text-center text-sm text-muted-foreground",
						children: "There are currently no portfolio items."
					}) : portfolioItems.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative overflow-hidden rounded-xl border bg-secondary shadow-soft " + (i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-[4/3]" : "aspect-[4/3]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.imageUrl,
							alt: p.title,
							loading: "lazy",
							className: "h-full w-full object-cover transition duration-500 group-hover:scale-105",
							onError: (event) => {
								event.currentTarget.style.display = "none";
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/80 to-transparent p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-medium text-primary-foreground",
								children: p.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 line-clamp-2 text-[11px] text-primary-foreground/85",
								children: p.content
							})]
						})]
					}, i))
				})
			}),
			publicSettings.show_events !== false && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "Calendar",
				title: "Upcoming Events",
				href: "/events"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-7xl px-6 pb-14",
				children: eventsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMessage, { message: "Loading upcoming events..." }) : upcomingEvents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyMessage, { message: "There are currently no upcoming events." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: upcomingEvents.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-xl border bg-card shadow-soft",
						children: [event.image_path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "aspect-[16/9] overflow-hidden bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: getEventImage(event.image_path),
								alt: getEventTitle(event),
								className: "h-full w-full object-cover",
								loading: "lazy",
								onError: (imageEvent) => {
									imageEvent.currentTarget.style.display = "none";
								}
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }), formatDate(event.start_at)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 font-display text-base font-semibold",
									children: getEventTitle(event)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-center gap-1 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }), getLocalizedText(event.location) || "Afar Regional State"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 line-clamp-2 text-sm text-muted-foreground",
									children: getEventContent(event)
								})
							]
						})]
					}, event.id))
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-7xl px-6 pb-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-2xl gradient-primary text-primary-foreground shadow-elegant",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 p-8 md:grid-cols-3 md:p-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-semibold uppercase tracking-widest text-gold",
									children: "Get in touch"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-2 font-display text-2xl font-bold md:text-3xl",
									children: "We're here to serve citizens, contractors, and partners."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-xl text-primary-foreground/80",
									children: "Reach any directorate or city administration through the contact channels below, or send us a message."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/contact",
									className: "mt-6 inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-gold-foreground hover:brightness-110",
									children: ["Contact Us", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mt-0.5 h-4 w-4 text-gold" }), "033-666-0577"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mt-0.5 h-4 w-4 text-gold" }), "info@afarudcb.gov.et"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 h-4 w-4 text-gold" }), "Semera, Afar Regional State, Ethiopia"]
								})
							]
						})]
					})
				})
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "font-display text-2xl font-bold text-gold md:text-3xl",
		children: value
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs uppercase tracking-wider text-primary-foreground/70",
		children: label
	})] });
}
function QuickTile({ icon, label, to }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "group flex items-center gap-3 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-4 backdrop-blur transition hover:bg-primary-foreground/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-10 w-10 place-items-center rounded-lg bg-gold text-gold-foreground",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-medium text-primary-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-primary-foreground/60",
			children: "Open →"
		})] })]
	});
}
function SectionHeading({ eyebrow, title, href, inline }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: inline ? "" : "mx-auto max-w-7xl px-6 pt-14 pb-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-semibold uppercase tracking-widest text-gold",
				children: eyebrow
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl",
				children: title
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: href,
				className: "hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex",
				children: ["View all", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
			})]
		})
	});
}
function EmptyMessage({ message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground",
		children: message
	});
}
function getTenderTitle(tender) {
	return getLocalizedText(tender.title) || "Untitled Tender";
}
function getEventTitle(event) {
	return getLocalizedText(event.title) || "Untitled Event";
}
function getEventContent(event) {
	return getLocalizedText(event.content);
}
function getEventImage(imagePath) {
	return `/${String(imagePath).replace(/^\/+/, "")}`;
}
function formatDate(date) {
	if (!date) return "—";
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) return "—";
	return parsed.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
//#endregion
export { HomePage as component };
