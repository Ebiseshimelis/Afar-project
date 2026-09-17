import { l as getToken, t as API_BASE } from "./authService-tLH6lGQn.mjs";
import { r as getMediaUrl } from "./multimediaService-KsWseGkg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portfolioService-BEMgj0ue.js
function normalize(item) {
	return {
		id: Number(item.id),
		title: item.title ?? "",
		order: Number(item.order ?? 0),
		content: item.content ?? "",
		imagePath: item.image ?? "",
		imageUrl: getMediaUrl(item.image),
		createdAt: item.created_at ?? "",
		updatedAt: item.updated_at ?? ""
	};
}
async function parseResponse(response) {
	const body = await response.json().catch(() => null);
	if (!response.ok) {
		const errors = body?.errors ? Object.values(body.errors).flat().join(" ") : "";
		throw new Error(errors || body?.message || "Portfolio request failed.");
	}
	return body;
}
function authHeaders() {
	const token = getToken();
	return {
		Accept: "application/json",
		...token ? { Authorization: `Bearer ${token}` } : {}
	};
}
async function getPortfolios() {
	const body = await parseResponse(await fetch(`${API_BASE}/portfolios`, { headers: { Accept: "application/json" } }));
	return (Array.isArray(body) ? body : body?.data ?? []).map(normalize);
}
function toFormData(data, method) {
	const formData = new FormData();
	if (method) formData.append("_method", method);
	formData.append("title", data.title);
	formData.append("order", String(data.order));
	formData.append("content", data.content);
	if (data.image instanceof File) formData.append("image", data.image);
	return formData;
}
async function createPortfolio(data) {
	const body = await parseResponse(await fetch(`${API_BASE}/portfolios`, {
		method: "POST",
		headers: authHeaders(),
		body: toFormData(data)
	}));
	return normalize(body?.data ?? body);
}
async function updatePortfolio(id, data) {
	const body = await parseResponse(await fetch(`${API_BASE}/portfolios/${id}`, {
		method: "POST",
		headers: authHeaders(),
		body: toFormData(data, "PUT")
	}));
	return normalize(body?.data ?? body);
}
async function deletePortfolio(id) {
	await parseResponse(await fetch(`${API_BASE}/portfolios/${id}`, {
		method: "DELETE",
		headers: authHeaders()
	}));
}
//#endregion
export { updatePortfolio as i, deletePortfolio as n, getPortfolios as r, createPortfolio as t };
