import { r as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { l as getToken } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-images-D2zsZpZv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var background_default = "/assets/background-C3IlGoHd.png";
async function parseResponse(response) {
	const body = await response.json().catch(() => null);
	if (!response.ok) throw new Error(body?.message || "Background image request failed.");
	return body;
}
async function getBackgrounds() {
	return (await parseResponse(await fetch(`http://127.0.0.1:8001/api/v1/backgrounds`, { headers: { Accept: "application/json" } })))?.data ?? {};
}
async function saveBackground(section, image, imageUrl) {
	const formData = new FormData();
	if (image instanceof File) formData.append("image", image);
	if (imageUrl?.trim()) formData.append("image_url", imageUrl.trim());
	const token = getToken();
	return (await parseResponse(await fetch(`http://127.0.0.1:8001/api/v1/backgrounds/${section}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			...token ? { Authorization: `Bearer ${token}` } : {}
		},
		body: formData
	})))?.data ?? {};
}
async function resetBackground(section) {
	const token = getToken();
	return (await parseResponse(await fetch(`http://127.0.0.1:8001/api/v1/backgrounds/${section}`, {
		method: "DELETE",
		headers: {
			Accept: "application/json",
			...token ? { Authorization: `Bearer ${token}` } : {}
		}
	})))?.data ?? {};
}
/**
* Central registry for section background images.
*
* Backgrounds are no longer hardcoded inside components. Each page asks for its
* background by section key, and this module resolves it in this order:
*   1. a value provided by the Laravel backend
*   2. the bundled default image (current design, used as placeholder)
*
* Saved values are shared by every browser and persist independently of local storage.
*/
/** Current images kept as defaults/placeholders. */
var DEFAULT_SECTION_BACKGROUNDS = {
	default: background_default,
	home: background_default,
	about: background_default,
	directorates: background_default,
	newsEvents: background_default,
	cityAdmins: background_default,
	tenders: background_default
};
var SECTION_LABELS = {
	default: "Default / Fallback",
	home: "Home",
	about: "About",
	directorates: "Directorates",
	newsEvents: "News & Events",
	cityAdmins: "City Administration",
	tenders: "Tenders"
};
function resolveSectionBackground(key, overrides) {
	return overrides[key] || overrides.default || DEFAULT_SECTION_BACKGROUNDS[key] || DEFAULT_SECTION_BACKGROUNDS.default;
}
/**
* Returns the background URL for a section. Renders the bundled default on the
* server / first paint, then swaps in the managed image once available.
*/
function useSectionBackground(key = "default") {
	const [overrides, setOverrides] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		let active = true;
		getBackgrounds().then((backgrounds) => {
			if (active) setOverrides(backgrounds);
		}).catch(() => {});
		return () => {
			active = false;
		};
	}, []);
	return resolveSectionBackground(key, overrides);
}
//#endregion
export { resolveSectionBackground as a, resetBackground as i, SECTION_LABELS as n, saveBackground as o, getBackgrounds as r, useSectionBackground as s, DEFAULT_SECTION_BACKGROUNDS as t };
