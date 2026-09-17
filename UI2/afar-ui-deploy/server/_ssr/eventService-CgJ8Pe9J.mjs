import { l as getToken, t as API_BASE } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/eventService-CgJ8Pe9J.js
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
async function getEvents() {
	const result = await parseResponse(await fetch(`${API_BASE_URL}/events`, {
		method: "GET",
		headers: { Accept: "application/json" }
	}));
	return Array.isArray(result?.data) ? result.data : [];
}
async function getEvent(id) {
	const result = await parseResponse(await fetch(`${API_BASE_URL}/events/${id}`, {
		method: "GET",
		headers: { Accept: "application/json" }
	}));
	if (!result?.data) throw new Error("Invalid event response.");
	return result.data;
}
function buildEventFormData(data) {
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
	if (data.location !== void 0) formData.append("location", data.location ?? "");
	if (data.start_at !== void 0) formData.append("start_at", data.start_at);
	if (data.end_at !== void 0) formData.append("end_at", data.end_at);
	if (data.status !== void 0) formData.append("status", data.status);
	if (data.image !== void 0 && data.image instanceof File) formData.append("image", data.image);
	return formData;
}
async function createEvent(data) {
	const formData = buildEventFormData(data);
	const result = await parseResponse(await fetch(`${API_BASE_URL}/events`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: formData
	}));
	if (!result?.data) throw new Error("Invalid create event response.");
	return result.data;
}
async function updateEvent(id, data) {
	const formData = buildEventFormData(data);
	formData.append("_method", "PUT");
	const result = await parseResponse(await fetch(`${API_BASE_URL}/events/${id}`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: formData
	}));
	if (!result?.data) throw new Error("Invalid update event response.");
	return result.data;
}
async function deleteEvent(id) {
	await parseResponse(await fetch(`${API_BASE_URL}/events/${id}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	}));
	return true;
}
//#endregion
export { updateEvent as a, getEvents as i, deleteEvent as n, getEvent as r, createEvent as t };
