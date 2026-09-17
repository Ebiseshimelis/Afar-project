import { l as getToken, t as API_BASE } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vacancyService-Da2NxTO3.js
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
	console.log("========== VACANCY API RESPONSE ==========");
	console.log("Status:", response.status);
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
async function getVacancies(admin = false) {
	const url = admin ? `${API_BASE_URL}/vacancies?admin=1` : `${API_BASE_URL}/vacancies`;
	const result = await parseResponse(await fetch(url, {
		method: "GET",
		headers: getAuthHeaders()
	}));
	return Array.isArray(result?.data) ? result.data : [];
}
async function getVacancy(id) {
	const result = await parseResponse(await fetch(`${API_BASE_URL}/vacancies/${id}`, {
		method: "GET",
		headers: { Accept: "application/json" }
	}));
	if (!result?.data) throw new Error("Invalid vacancy response.");
	return result.data;
}
function buildVacancyFormData(data) {
	const formData = new FormData();
	if (data.category_id !== void 0) formData.append("category_id", String(data.category_id));
	if (data.title !== void 0) {
		if (data.title.en !== void 0) formData.append("title[en]", data.title.en);
		if (data.title.am !== void 0) formData.append("title[am]", data.title.am);
	}
	if (data.content !== void 0) {
		if (data.content.en !== void 0) formData.append("content[en]", data.content.en);
		if (data.content.am !== void 0) formData.append("content[am]", data.content.am);
	}
	if (data.deadline !== void 0) formData.append("deadline", data.deadline ?? "");
	if (data.status !== void 0) formData.append("status", data.status);
	if (data.published_at !== void 0) formData.append("published_at", data.published_at ?? "");
	if (data.file !== void 0 && data.file instanceof File) formData.append("file", data.file);
	return formData;
}
async function createVacancy(data) {
	const formData = buildVacancyFormData(data);
	const result = await parseResponse(await fetch(`${API_BASE_URL}/vacancies`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: formData
	}));
	if (!result?.data) throw new Error("Invalid create vacancy response.");
	return result.data;
}
async function updateVacancy(id, data) {
	const formData = buildVacancyFormData(data);
	formData.append("_method", "PUT");
	const result = await parseResponse(await fetch(`${API_BASE_URL}/vacancies/${id}`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: formData
	}));
	if (!result?.data) throw new Error("Invalid update vacancy response.");
	return result.data;
}
async function deleteVacancy(id) {
	await parseResponse(await fetch(`${API_BASE_URL}/vacancies/${id}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	}));
	return true;
}
//#endregion
export { updateVacancy as a, getVacancy as i, deleteVacancy as n, getVacancies as r, createVacancy as t };
