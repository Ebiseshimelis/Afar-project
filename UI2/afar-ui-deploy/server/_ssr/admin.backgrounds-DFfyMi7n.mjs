import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as resolveSectionBackground, i as resetBackground, n as SECTION_LABELS, o as saveBackground, r as getBackgrounds, t as DEFAULT_SECTION_BACKGROUNDS } from "./site-images-D2zsZpZv.mjs";
import { L as LoaderCircle, S as RotateCcw, l as Upload } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.backgrounds-DFfyMi7n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SECTIONS = Object.keys(DEFAULT_SECTION_BACKGROUNDS).filter((key) => key !== "multimedia");
function BackgroundsAdmin() {
	const { can } = useAuth();
	const [overrides, setOverrides] = (0, import_react.useState)({});
	const [savingKey, setSavingKey] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		getBackgrounds().then((data) => setOverrides(data)).catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load backgrounds."));
	}, []);
	const onFile = async (key, file) => {
		try {
			setSavingKey(key);
			setOverrides(await saveBackground(key, file));
			toast.success("Background image saved.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to save background image.");
		} finally {
			setSavingKey(null);
		}
	};
	const saveUrl = async (key, value) => {
		if (!value.trim()) return;
		try {
			setSavingKey(key);
			setOverrides(await saveBackground(key, null, value));
			toast.success("Background image saved.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to save background image.");
		} finally {
			setSavingKey(null);
		}
	};
	const reset = async (key) => {
		try {
			setSavingKey(key);
			setOverrides(await resetBackground(key));
			toast.success("Background reset to default.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to reset background image.");
		} finally {
			setSavingKey(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
		title: "Background Images",
		description: "Manage the hero/section background images used across the public portal."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
		children: SECTIONS.map((key) => {
			const current = resolveSectionBackground(key, overrides);
			const isCustom = Boolean(overrides[key]);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-xl border bg-card shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[16/9] bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: current,
						alt: `${SECTION_LABELS[key]} background`,
						className: "size-full object-cover"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-semibold",
								children: SECTION_LABELS[key]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground",
								children: isCustom ? "Custom" : "Default"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-2 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-primary",
							children: [
								savingKey === key ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }),
								" Upload image",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									className: "hidden",
									disabled: savingKey === key,
									onChange: (e) => {
										const f = e.target.files?.[0];
										if (f) onFile(key, f);
										e.currentTarget.value = "";
									}
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							defaultValue: "",
							placeholder: "…or paste an image URL",
							onBlur: (e) => void saveUrl(key, e.target.value),
							className: "h-9 w-full rounded-lg border bg-background px-3 text-xs outline-none ring-ring focus:ring-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => void reset(key),
							disabled: !isCustom || savingKey === key,
							className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary disabled:opacity-40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Reset to default"]
						})
					]
				})]
			}, key);
		})
	})] });
}
//#endregion
export { BackgroundsAdmin as component };
