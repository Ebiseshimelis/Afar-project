import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as getSystemSettings, r as updateSystemSettings } from "./systemSettingService-CP-8MRQw.mjs";
import { G as Globe, L as LoaderCircle, R as LayoutTemplate, v as Settings, x as Save } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-DFEV3L-8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		key: "general",
		label: "General",
		icon: Settings
	},
	{
		key: "portal",
		label: "Portal",
		icon: Globe
	},
	{
		key: "homepage",
		label: "Homepage",
		icon: LayoutTemplate
	}
];
var EMPTY_SETTINGS = {
	organization_name: "",
	contact_email: "",
	phone: "",
	timezone: "",
	default_language: "",
	fiscal_year_start: "",
	portal_tagline: "",
	about_summary: "",
	facebook_url: "",
	twitter_url: "",
	hero_headline: "",
	hero_subheadline: "",
	show_news: false,
	show_tenders: false,
	show_events: false,
	allow_admin_registration: true,
	navigation_items: [],
	primary_color: "",
	corner_radius: "",
	density: ""
};
function SettingsAdmin() {
	const [tab, setTab] = (0, import_react.useState)("general");
	const [settings, setSettings] = (0, import_react.useState)(EMPTY_SETTINGS);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		async function loadSettings() {
			try {
				setLoading(true);
				const data = await getSystemSettings();
				if (mounted) setSettings({
					...EMPTY_SETTINGS,
					...data,
					navigation_items: Array.isArray(data.navigation_items) ? [...data.navigation_items].sort((a, b) => a.order - b.order) : []
				});
			} catch (error) {
				console.error("Failed to load system settings:", error);
				if (mounted) toast.error(error instanceof Error ? error.message : "Failed to load system settings.");
			} finally {
				if (mounted) setLoading(false);
			}
		}
		loadSettings();
		return () => {
			mounted = false;
		};
	}, []);
	function updateSetting(key, value) {
		setSettings((current) => ({
			...current,
			[key]: value
		}));
	}
	async function handleSave() {
		try {
			setSaving(true);
			const normalizedNavigation = settings.navigation_items.map((item, index) => ({
				...item,
				order: index + 1
			}));
			const payload = {
				...settings,
				navigation_items: normalizedNavigation
			};
			setSettings(payload);
			await updateSystemSettings(payload);
			toast.success("Settings saved successfully.");
		} catch (error) {
			console.error("Failed to save system settings:", error);
			toast.error(error instanceof Error ? error.message : "Failed to save system settings.");
		} finally {
			setSaving(false);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
		title: "System Settings",
		description: "Portal configuration and appearance."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[300px] items-center justify-center rounded-xl border bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Loading settings..."]
		})
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
		title: "System Settings",
		description: "Portal configuration and appearance.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: handleSave,
			disabled: saving,
			className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
			children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), saving ? "Saving..." : "Save changes"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "rounded-xl border bg-card p-2 shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1",
				children: TABS.map((t) => {
					const Icon = t.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTab(t.key),
						className: "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium " + (tab === t.key ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-secondary"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), t.label]
					}) }, t.key);
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card p-6 shadow-soft",
			children: [
				tab === "general" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeneralSettings, {
					settings,
					updateSetting
				}),
				tab === "portal" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalSettings, {
					settings,
					updateSetting
				}),
				tab === "homepage" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomepageSettings, {
					settings,
					updateSetting
				})
			]
		})]
	})] });
}
function Field({ label, children, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "block text-sm font-medium",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1",
			children
		}),
		hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted-foreground",
			children: hint
		})
	] });
}
var input = "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2";
function GeneralSettings({ settings, updateSetting }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-semibold",
				children: "General Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Basic organization and administration settings."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Organization name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: settings.organization_name,
							onChange: (e) => updateSetting("organization_name", e.target.value),
							className: input
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Contact email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: settings.contact_email,
							onChange: (e) => updateSetting("contact_email", e.target.value),
							className: input
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Phone",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: settings.phone,
							onChange: (e) => updateSetting("phone", e.target.value),
							className: input
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Time zone",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: settings.timezone,
							onChange: (e) => updateSetting("timezone", e.target.value),
							className: input
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Default language",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: settings.default_language,
							onChange: (e) => updateSetting("default_language", e.target.value),
							className: input,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "English" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Amharic" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Afar" })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Fiscal year start",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: settings.fiscal_year_start,
							onChange: (e) => updateSetting("fiscal_year_start", e.target.value),
							className: input
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: "Allow Admin Registration"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Allow new users to submit requests for Admin accounts. Submitted accounts still require Super Admin approval before they can access the Admin panel."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative inline-flex shrink-0 cursor-pointer items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							className: "peer sr-only",
							checked: settings.allow_admin_registration,
							onChange: (e) => updateSetting("allow_admin_registration", e.target.checked)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-6 w-11 rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-5 w-5 translate-x-0.5 translate-y-0.5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" })
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 text-xs",
					children: settings.allow_admin_registration ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-green-600",
						children: "Admin registration is enabled."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-destructive",
						children: "Admin registration is disabled."
					})
				})]
			})
		]
	});
}
function PortalSettings({ settings, updateSetting }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Portal tagline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: settings.portal_tagline,
					onChange: (e) => updateSetting("portal_tagline", e.target.value),
					className: input
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "About summary",
				hint: "Shown on the public homepage.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					rows: 4,
					value: settings.about_summary,
					onChange: (e) => updateSetting("about_summary", e.target.value),
					className: "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2 h-auto py-2"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Facebook URL",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: settings.facebook_url,
						onChange: (e) => updateSetting("facebook_url", e.target.value),
						className: input
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Twitter URL",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: settings.twitter_url,
						onChange: (e) => updateSetting("twitter_url", e.target.value),
						className: input
					})
				})]
			})
		]
	});
}
function HomepageSettings({ settings, updateSetting }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Hero headline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: settings.hero_headline,
					onChange: (e) => updateSetting("hero_headline", e.target.value),
					className: input
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Hero subheadline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					rows: 3,
					value: settings.hero_subheadline,
					onChange: (e) => updateSetting("hero_subheadline", e.target.value),
					className: "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2 h-auto py-2"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: settings.show_news,
							onChange: (e) => updateSetting("show_news", e.target.checked),
							className: "rounded border"
						}), "Show News"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: settings.show_tenders,
							onChange: (e) => updateSetting("show_tenders", e.target.checked),
							className: "rounded border"
						}), "Show Tenders"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: settings.show_events,
							onChange: (e) => updateSetting("show_events", e.target.checked),
							className: "rounded border"
						}), "Show Events"]
					})
				]
			})
		]
	});
}
//#endregion
export { SettingsAdmin as component };
