import { o as authFetch, t as API_BASE } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/systemSettingService-CP-8MRQw.js
async function getSystemSettings() {
	const response = await authFetch("/admin/settings");
	const body = await response.json().catch(() => null);
	if (!response.ok) throw new Error(body?.message || "Failed to load system settings.");
	return body?.data ?? {};
}
async function getPublicSystemSettings() {
	const response = await fetch(`${API_BASE}/settings`, {
		headers: { Accept: "application/json" },
		cache: "no-store"
	});
	const body = await response.json().catch(() => null);
	if (!response.ok) throw new Error(body?.message || "Failed to load public system settings.");
	return body?.data ?? {};
}
async function updateSystemSettings(settings) {
	const response = await authFetch("/admin/settings", {
		method: "PUT",
		body: JSON.stringify({ settings })
	});
	const body = await response.json().catch(() => null);
	if (!response.ok) throw new Error(body?.message || "Failed to update system settings.");
}
//#endregion
export { getSystemSettings as n, updateSystemSettings as r, getPublicSystemSettings as t };
