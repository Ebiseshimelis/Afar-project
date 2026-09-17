import { l as getToken, t as API_BASE } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tenderService-FaLrKaDE.js
var API_BASE_URL = API_BASE;
function getAuthHeaders() {
	const token = getToken();
	return {
		Accept: "application/json",
		...token ? { Authorization: `Bearer ${token}` } : {}
	};
}
async function parseResponse(response) {
	const text = await response.text();
	console.log("========== TENDER API RESPONSE ==========");
	console.log("Status:", response.status);
	console.log("Status Text:", response.statusText);
	console.log("Response:", text);
	console.log("==========================================");
	let data = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = null;
	}
	if (!response.ok) {
		let message = data?.message || data?.error || text || `API request failed: ${response.status}`;
		if (data?.errors) {
			const errors = Object.values(data.errors).flat().join(" ");
			if (errors) message = errors;
		}
		throw new Error(`${message} (HTTP ${response.status})`);
	}
	return data;
}
function normalizeTender(tender) {
	return {
		id: Number(tender.id),
		category_id: tender.category_id === null || tender.category_id === void 0 || tender.category_id === "" ? null : Number(tender.category_id),
		created_by: tender.created_by === null || tender.created_by === void 0 || tender.created_by === "" ? null : Number(tender.created_by),
		title: typeof tender.title === "object" && tender.title !== null ? {
			en: tender.title.en ?? "",
			am: tender.title.am ?? ""
		} : {
			en: tender.title_en ?? "",
			am: tender.title_am ?? ""
		},
		content: typeof tender.content === "object" && tender.content !== null ? {
			en: tender.content.en ?? "",
			am: tender.content.am ?? ""
		} : {
			en: tender.content_en ?? "",
			am: tender.content_am ?? ""
		},
		file_path: tender.file_path === null || tender.file_path === void 0 || tender.file_path === "" ? null : String(tender.file_path),
		opens_at: tender.opens_at ?? null,
		closes_at: tender.closes_at ?? null,
		status: String(tender.status ?? ""),
		published_at: tender.published_at ?? null,
		created_at: tender.created_at ?? "",
		updated_at: tender.updated_at ?? ""
	};
}
async function getTenders() {
	const data = await parseResponse(await fetch(`${API_BASE_URL}/tenders`, {
		method: "GET",
		headers: { Accept: "application/json" },
		cache: "no-store"
	}));
	return (Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []).map(normalizeTender);
}
async function getTender(id) {
	const data = await parseResponse(await fetch(`${API_BASE_URL}/tenders/${id}`, {
		method: "GET",
		headers: { Accept: "application/json" },
		cache: "no-store"
	}));
	if (!data?.data) throw new Error("Invalid tender response.");
	return normalizeTender(data.data);
}
function buildTenderFormData(data) {
	const formData = new FormData();
	if (data.category_id !== void 0) formData.append("category_id", data.category_id === null ? "" : String(data.category_id));
	if (data.title !== void 0) {
		if (data.title.en !== void 0) formData.append("title[en]", data.title.en);
		if (data.title.am !== void 0) formData.append("title[am]", data.title.am);
	}
	if (data.content !== void 0) {
		if (data.content.en !== void 0) formData.append("content[en]", data.content.en);
		if (data.content.am !== void 0) formData.append("content[am]", data.content.am);
	}
	if (data.opens_at !== void 0) formData.append("opens_at", data.opens_at ?? "");
	if (data.closes_at !== void 0) formData.append("closes_at", data.closes_at ?? "");
	if (data.status !== void 0) formData.append("status", data.status);
	if (data.published_at !== void 0) formData.append("published_at", data.published_at ?? "");
	if (data.file !== void 0 && data.file instanceof File) formData.append("file", data.file);
	return formData;
}
async function createTender(data) {
	const formData = buildTenderFormData(data);
	const result = await parseResponse(await fetch(`${API_BASE_URL}/tenders`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: formData
	}));
	if (!result?.data) throw new Error("Invalid create tender response.");
	return normalizeTender(result.data);
}
async function updateTender(id, data) {
	const formData = buildTenderFormData(data);
	formData.append("_method", "PUT");
	const result = await parseResponse(await fetch(`${API_BASE_URL}/tenders/${id}`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: formData
	}));
	if (!result?.data) throw new Error("Invalid update tender response.");
	return normalizeTender(result.data);
}
async function deleteTender(id) {
	await parseResponse(await fetch(`${API_BASE_URL}/tenders/${id}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	}));
	return true;
}
/**
* This is deliberately based on the calendar.
*
* Future closing date  -> Open
* Past closing date    -> Closed
* No closing date      -> Open
*/
function getTenderStatus(tender) {
	if (!tender.closes_at) return "Open";
	const closeDate = new Date(tender.closes_at).getTime();
	if (Number.isNaN(closeDate)) return "Open";
	return closeDate >= Date.now() ? "Open" : "Closed";
}
//#endregion
export { getTenders as a, getTenderStatus as i, deleteTender as n, updateTender as o, getTender as r, createTender as t };
