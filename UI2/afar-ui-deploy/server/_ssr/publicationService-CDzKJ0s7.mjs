import { l as getToken, t as API_BASE } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/publicationService-CDzKJ0s7.js
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
	console.log("========== PUBLICATION API RESPONSE ==========");
	console.log("Status:", response.status);
	console.log("Response:", text);
	console.log("===============================================");
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
async function getPublications() {
	const result = await parseResponse(await fetch(`${API_BASE_URL}/publications`, {
		method: "GET",
		headers: { Accept: "application/json" }
	}));
	return Array.isArray(result?.data) ? result.data : [];
}
function buildPublicationFormData(data) {
	const formData = new FormData();
	if (data.category_id !== void 0) formData.append("category_id", String(data.category_id));
	if (data.title !== void 0) {
		if (data.title.en !== void 0) formData.append("title[en]", data.title.en);
		if (data.title.am !== void 0) formData.append("title[am]", data.title.am);
	}
	if (data.description !== void 0) {
		if (data.description?.en !== void 0) formData.append("description[en]", data.description.en);
		if (data.description?.am !== void 0) formData.append("description[am]", data.description.am);
	}
	if (data.status !== void 0) formData.append("status", data.status);
	if (data.published_at !== void 0) formData.append("published_at", data.published_at ?? "");
	if (data.file !== void 0 && data.file instanceof File) formData.append("file", data.file);
	return formData;
}
async function createPublication(data) {
	const formData = buildPublicationFormData(data);
	const result = await parseResponse(await fetch(`${API_BASE_URL}/publications`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: formData
	}));
	if (!result?.data) throw new Error("Invalid create publication response.");
	return result.data;
}
async function updatePublication(id, data) {
	const formData = buildPublicationFormData(data);
	formData.append("_method", "PUT");
	const result = await parseResponse(await fetch(`${API_BASE_URL}/publications/${id}`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: formData
	}));
	if (!result?.data) throw new Error("Invalid update publication response.");
	return result.data;
}
async function deletePublication(id) {
	await parseResponse(await fetch(`${API_BASE_URL}/publications/${id}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	}));
	return true;
}
//#endregion
export { updatePublication as i, deletePublication as n, getPublications as r, createPublication as t };
