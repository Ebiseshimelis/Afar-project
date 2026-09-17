import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { d as Target, ft as Award, h as ShieldCheck, ot as Building2, q as Eye, r as Users } from "./_libs/lucide-react.mjs";
import { t as PageHeader } from "./_ssr/PortalLayout-qV5-TMvO.mjs";
import { t as Route } from "./_portal.about-D0Cf3_Oc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_portal.about-DvFPmr-v.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	const about = Route.useLoaderData();
	const cards = [
		{
			icon: Target,
			title: "Our Mission",
			body: about.mission
		},
		{
			icon: Eye,
			title: "Our Vision",
			body: about.vision
		},
		{
			icon: Award,
			title: "Our Values",
			body: about.values
		}
	];
	const serviceIcons = [
		Building2,
		Users,
		ShieldCheck
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		section: "about",
		eyebrow: "About the Bureau",
		title: "Serving Afar's urban future",
		description: about.description
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-6 py-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6 md:grid-cols-3",
			children: cards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card p-6 shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-11 w-11 place-items-center rounded-xl gradient-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(card.icon, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-display text-lg font-semibold",
						children: card.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted-foreground",
						children: card.body
					})
				]
			}, card.title))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-14 grid gap-8 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-bold",
					children: "What we do"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 leading-relaxed text-muted-foreground",
					children: about.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-5 space-y-3 text-sm",
					children: about.services.map((service, index) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 rounded-lg border bg-card p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(serviceIcons[index] ?? Building2, { className: "h-4 w-4 text-primary" }), service]
						}, service);
					})
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl border shadow-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/portfolio2.png",
					alt: "Afar Regional State Urban Development and Construction Bureau",
					className: "h-full min-h-[300px] w-full object-cover"
				})
			})]
		})]
	})] });
}
//#endregion
export { AboutPage as component };
