import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { n as useLanguage } from "./_ssr/language-DS3yJdlp.mjs";
import { E as Phone, M as Mail, j as MapPin, ot as Building2 } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/PortalLayout-qV5-TMvO.mjs";
import { r as getCityAdmins } from "./_ssr/cityAdminService-Ca61c8rE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.city-admins-DT17SmIE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CityAdminsPage() {
	const { lang } = useLanguage();
	const [cities, setCities] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)("all");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		async function loadCityAdmins() {
			try {
				setLoading(true);
				setError(null);
				const data = await getCityAdmins();
				setCities(data);
			} catch (err) {
				console.error("Failed to load city administrations:", err);
				setError("Failed to load city administrations.");
			} finally {
				setLoading(false);
			}
		}
		loadCityAdmins();
	}, []);
	const label = (city) => lang === "am" && city.nameAm ? city.nameAm : city.name;
	const description = (city) => lang === "am" && city.descriptionAm ? city.descriptionAm : city.description;
	const active = selected === "all" ? null : cities.find((city) => city.id === selected) ?? null;
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		section: "cityAdmins",
		eyebrow: "Organization",
		title: lang === "am" ? "የከተማ አስተዳደር" : "City Administration",
		description: lang === "am" ? "በአፋር ክልል የሚገኙ የከተማ አስተዳደሮች እና ከንቲባዎች።" : "Mayors and city administration offices across the Afar Regional State."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-7xl px-4 py-12 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-center text-muted-foreground",
			children: lang === "am" ? "በመጫን ላይ..." : "Loading city administrations..."
		})
	})] });
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		section: "cityAdmins",
		eyebrow: "Organization",
		title: lang === "am" ? "የከተማ አስተዳደር" : "City Administration",
		description: lang === "am" ? "በአፋር ክልል የሚገኙ የከተማ አስተዳደሮች እና ከንቲባዎች።" : "Mayors and city administration offices across the Afar Regional State."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-7xl px-4 py-12 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-center text-destructive",
			children: error
		})
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative border-b overflow-hidden",
			children: [
				active.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: active.photo.trim(),
					alt: active.mayor_name,
					className: "absolute inset-0 h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-primary/10",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex max-w-7xl flex-col justify-end px-4 pb-6 pt-24 text-primary-foreground sm:px-6 md:pb-10 md:pt-56",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium tracking-wide text-gold ring-1 ring-primary-foreground/25 backdrop-blur",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3 w-3" }), lang === "am" ? "የከተማ አስተዳደር" : "City Administration"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-2xl font-bold tracking-tight drop-shadow-md sm:text-3xl md:text-5xl",
							children: active.mayor_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-primary-foreground/95 drop-shadow sm:text-base md:text-lg",
							children: label(active)
						})
					]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			section: "cityAdmins",
			eyebrow: "Organization",
			title: lang === "am" ? "የከተማ አስተዳደር" : "City Administration",
			description: lang === "am" ? "በአፋር ክልል የሚገኙ የከተማ አስተዳደሮች እና ከንቲባዎች።" : "Mayors and city administration offices across the Afar Regional State."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			"aria-label": "City administrations",
			className: "border-b bg-card/95 backdrop-blur",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-7xl px-4 md:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "flex items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSelected("all"),
						"aria-current": selected === "all" ? "true" : void 0,
						className: "relative inline-flex shrink-0 items-center rounded-full px-3 py-2 text-sm font-medium transition-colors " + (selected === "all" ? "text-primary" : "text-foreground/70 hover:text-primary"),
						children: [lang === "am" ? "ሁሉም" : "All Cities", selected === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gold" })]
					}) }), cities.map((city) => {
						const isActive = selected === city.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSelected(city.id),
							"aria-current": isActive ? "true" : void 0,
							className: "relative inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors " + (isActive ? "text-primary" : "text-foreground/70 hover:text-primary"),
							children: [label(city).replace(/ City Administration$/, ""), isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gold" })]
						}) }, city.id);
					})]
				})
			})
		}),
		active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-xl font-bold",
							children: [lang === "am" ? "ስለ አስተዳደሩ" : "About the administration", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 block h-0.5 w-12 rounded-full bg-gold" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 border-l-4 border-gold pl-4 text-base leading-relaxed text-foreground/85",
							children: description(active)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base leading-relaxed text-foreground/75",
							children: lang === "am" ? "የአስተዳደሩ መረጃ እና የአገልግሎት ዝርዝሮች ከአስተዳደር ሲስተሙ ይጫናሉ።" : "The office is led by the mayor and works with the Bureau on housing delivery, land administration, sanitation, and municipal capacity building."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "lg:sticky lg:top-24 lg:self-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-card p-5 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: lang === "am" ? "ከንቲባ" : "Mayor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 font-display text-base font-semibold text-primary",
									children: active.mayor_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1 text-sm text-muted-foreground",
									children: label(active)
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-1.5 border-t pt-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `tel:${active.phone}`,
									className: "flex items-center gap-2 text-muted-foreground hover:text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: active.phone
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `mailto:${active.email.trim()}`,
									className: "flex items-center gap-2 text-muted-foreground hover:text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: active.email.trim()
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: active.location || `${label(active)}, Afar`
									})]
								})
							]
						})]
					})
				})]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 py-10 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: cities.map((city) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border bg-card p-5 shadow-soft transition hover:shadow-elegant",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSelected(city.id),
						className: "w-full text-left",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [city.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: city.photo.trim(),
								alt: city.mayor_name,
								loading: "lazy",
								width: 64,
								height: 64,
								className: "h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-primary/10"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-6 w-6 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
										children: lang === "am" ? "የከተማ አስተዳደር" : "City Administration"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-0.5 line-clamp-2 font-display text-sm font-semibold leading-tight sm:text-base",
										children: label(city)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 truncate text-sm font-medium text-primary",
										children: city.mayor_name
									})
								]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-1.5 border-t pt-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `tel:${city.phone}`,
							className: "flex items-center gap-2 text-muted-foreground hover:text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: city.phone
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `mailto:${city.email.trim()}`,
							className: "flex items-center gap-2 text-muted-foreground hover:text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: city.email.trim()
							})]
						})]
					})]
				}, city.id))
			})
		})
	] });
}
//#endregion
export { CityAdminsPage as component };
