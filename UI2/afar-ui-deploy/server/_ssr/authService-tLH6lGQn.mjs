//#region node_modules/.nitro/vite/services/ssr/assets/authService-tLH6lGQn.js
var PERMISSION_ACTIONS = [
	"view",
	"create",
	"update",
	"delete"
];
var PERMISSION_MODULES = [
	{
		key: "news",
		label: "News",
		group: "Content"
	},
	{
		key: "events",
		label: "Events",
		group: "Content"
	},
	{
		key: "tenders",
		label: "Tenders",
		group: "Content"
	},
	{
		key: "vacancies",
		label: "Vacancies",
		group: "Content"
	},
	{
		key: "job_applications",
		label: "Job Applications",
		group: "Recruitment"
	},
	{
		key: "publications",
		label: "Publications",
		group: "Content"
	},
	{
		key: "portfolios",
		label: "Portfolio",
		group: "Content"
	},
	{
		key: "multimedia",
		label: "Multimedia",
		group: "Content"
	},
	{
		key: "directorates",
		label: "Directorates",
		group: "Directory"
	},
	{
		key: "city_admins",
		label: "City Administrations",
		group: "Directory"
	},
	{
		key: "messages",
		label: "Contact Messages",
		group: "Communication"
	},
	{
		key: "notifications",
		label: "Notifications",
		group: "Communication"
	},
	{
		key: "media",
		label: "Media Library",
		group: "System",
		superAdminOnly: true
	},
	{
		key: "backgrounds",
		label: "Background Images",
		group: "System"
	},
	{
		key: "admin_accounts",
		label: "Admin Accounts",
		group: "Super Admin",
		superAdminOnly: true
	},
	{
		key: "settings",
		label: "System Settings",
		group: "Super Admin",
		superAdminOnly: true
	}
];
/**
* Modules that a normal Admin can be granted
* through the Admin Accounts permission UI.
*
* Excluded automatically:
* - Admin Accounts
* - Media Library
* - System Settings
* - Announcements
* - Feedback
* - Activity
*/
/**
* Modules that can be assigned to normal Admin accounts.
*
* These modules are intentionally excluded from the permission
* assignment UI:
*
* - admin_accounts
* - media
* - announcement
* - feedback
* - activity
*
* "multimedia" is NOT excluded here because it is a separate
* content module and must remain available where applicable.
*/
var HIDDEN_FROM_ADMIN_PERMISSION_UI = /* @__PURE__ */ new Set([
	"admin_accounts",
	"media",
	"announcement",
	"feedback",
	"activity"
]);
var ASSIGNABLE_MODULES = PERMISSION_MODULES.filter((module) => !module.superAdminOnly && !HIDDEN_FROM_ADMIN_PERMISSION_UI.has(module.key));
PERMISSION_MODULES.flatMap((module) => PERMISSION_ACTIONS.map((action) => `${module.key}.${action}`));
var API_BASE = "http://127.0.0.1:8001/api/v1";
var API_ORIGIN = "http://127.0.0.1:8001/api/v1".replace(/\/api\/v1\/?$/, "") || (typeof window !== "undefined" ? window.location.origin : "");
var TOKEN_KEY = "admin_token";
var LEGACY_TOKEN_KEY = "afar_admin_token";
var DEMO_KEY = "afar_admin_demo_session";
var AuthError = class extends Error {
	status;
	constructor(message, status = 400) {
		super(message);
		this.name = "AuthError";
		this.status = status;
	}
};
/**
* Compatibility helper for older services.
*/
function getAdminToken() {
	return getToken();
}
/**
* Get the current Laravel Sanctum token.
*
* Primary storage:
*   localStorage["admin_token"]
*
* Legacy compatibility:
*   sessionStorage["afar_admin_token"]
*   localStorage["afar_admin_token"]
*/
function getToken() {
	if (typeof window === "undefined") return null;
	const localToken = window.localStorage.getItem(TOKEN_KEY);
	if (localToken && localToken.trim() !== "") return localToken.trim();
	const legacySessionToken = window.sessionStorage.getItem(LEGACY_TOKEN_KEY);
	if (legacySessionToken && legacySessionToken.trim() !== "") return legacySessionToken.trim();
	const legacyLocalToken = window.localStorage.getItem(LEGACY_TOKEN_KEY);
	if (legacyLocalToken && legacyLocalToken.trim() !== "") return legacyLocalToken.trim();
	return null;
}
/**
* Store/remove the Laravel Sanctum token.
*
* The main application token is stored in localStorage under
* "admin_token" because the existing application already uses
* this key.
*/
function setToken(token) {
	if (typeof window === "undefined") return;
	if (token && token.trim() !== "") {
		const cleanToken = token.trim();
		window.localStorage.setItem(TOKEN_KEY, cleanToken);
		window.sessionStorage.removeItem(LEGACY_TOKEN_KEY);
		window.localStorage.removeItem(LEGACY_TOKEN_KEY);
	} else {
		window.localStorage.removeItem(TOKEN_KEY);
		window.sessionStorage.removeItem(LEGACY_TOKEN_KEY);
		window.localStorage.removeItem(LEGACY_TOKEN_KEY);
	}
}
/**
* Extract a token regardless of Laravel response shape.
*/
function extractToken(body) {
	const token = body?.token ?? body?.access_token ?? body?.data?.token ?? body?.data?.access_token ?? null;
	if (typeof token !== "string" || token.trim() === "") return null;
	return token.trim();
}
async function authFetch(path, init = {}) {
	const token = getToken();
	const headers = new Headers(init.headers);
	headers.set("Accept", "application/json");
	if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
	if (token) headers.set("Authorization", `Bearer ${token}`);
	else headers.delete("Authorization");
	return fetch(`${API_BASE}${path}`, {
		...init,
		headers
	});
}
function messageForStatus(status, body) {
	if (body?.message && status !== 500) return String(body.message);
	if (status === 401 || status === 422) return "Invalid email or password.";
	if (status === 403) return "This account is not authorized for this login type.";
	if (status === 423) return "Your account has been disabled. Please contact the Super Admin.";
	return "Sign in failed. Please try again.";
}
async function login(email, password, loginType = "admin") {
	let res;
	try {
		res = await fetch(`${API_BASE}/auth/login`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email,
				password,
				login_type: loginType
			})
		});
	} catch {
		throw new AuthError("Unable to connect to the server. Please make sure the Laravel API is running.", 0);
	}
	const body = await res.json().catch(() => null);
	if (!res.ok) throw new AuthError(messageForStatus(res.status, body), res.status);
	const user = normalizeUser(body?.user ?? body?.data?.user ?? body?.data ?? null);
	const token = extractToken(body);
	if (!token) {
		console.error("Laravel login response did not contain a token:", body);
		throw new AuthError("Login succeeded, but the server did not return an authentication token.", 500);
	}
	setToken(token);
	if (typeof window !== "undefined") window.localStorage.removeItem(DEMO_KEY);
	return user;
}
async function me() {
	if (!getToken()) return null;
	let res;
	try {
		res = await authFetch("/auth/me");
	} catch {
		return null;
	}
	if (res.status === 401 || res.status === 403 || res.status === 423) {
		setToken(null);
		return null;
	}
	if (!res.ok) return null;
	const body = await res.json().catch(() => null);
	return normalizeUser(body?.user ?? body?.data?.user ?? body?.data ?? body);
}
async function logout() {
	try {
		if (getToken()) await authFetch("/auth/logout", { method: "POST" });
	} catch {}
	setToken(null);
	if (typeof window !== "undefined") window.localStorage.removeItem(DEMO_KEY);
}
async function forgotPassword(email) {
	let res;
	try {
		res = await fetch(`${API_BASE.replace(/\/api\/v1$/, "")}/api/forgot-password`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ email })
		});
	} catch {
		throw new AuthError("Unable to connect to the server.", 0);
	}
	const body = await res.json().catch(() => null);
	if (!res.ok) throw new AuthError(body?.message ? String(body.message) : "Unable to send password reset instructions.", res.status);
}
async function resetPassword(token, email, password, passwordConfirmation) {
	let res;
	try {
		res = await fetch(`${API_BASE.replace(/\/api\/v1$/, "")}/api/reset-password`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				token,
				email,
				password,
				password_confirmation: passwordConfirmation
			})
		});
	} catch {
		throw new AuthError("Unable to connect to the server.", 0);
	}
	const body = await res.json().catch(() => null);
	if (!res.ok) throw new AuthError(body?.message ? String(body.message) : "Unable to reset password.", res.status);
}
function normalizeUser(raw) {
	if (!raw) throw new AuthError("Sign in failed. Please try again.", 500);
	return {
		id: String(raw.id),
		name: raw.name ?? "",
		email: raw.email ?? "",
		role: raw.role === "super_admin" ? "super_admin" : "admin",
		role_name: raw.role_name ?? null,
		is_active: raw.is_active !== false,
		account_status: raw.account_status ?? null,
		permissions: Array.isArray(raw.permissions) ? raw.permissions.map(String) : []
	};
}
var allFor = (mods) => mods.flatMap((m) => PERMISSION_ACTIONS.map((a) => `${m}.${a}`));
allFor(["news", "events"]).concat("tenders.view");
ASSIGNABLE_MODULES.map((m) => m.key);
//#endregion
export { PERMISSION_ACTIONS as a, getAdminToken as c, logout as d, me as f, AuthError as i, getToken as l, API_ORIGIN as n, authFetch as o, resetPassword as p, ASSIGNABLE_MODULES as r, forgotPassword as s, API_BASE as t, login as u };
