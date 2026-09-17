import { l as getToken, t as API_BASE } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messageService-Dxng2t9O.js
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
async function getMessages(perPage = 50) {
	const result = await parseResponse(await fetch(`${API_BASE_URL}/contact-messages?per_page=${perPage}`, {
		method: "GET",
		headers: getAuthHeaders()
	}));
	return Array.isArray(result?.data) ? result.data : [];
}
async function getMessage(id) {
	const result = await parseResponse(await fetch(`${API_BASE_URL}/contact-messages/${id}`, {
		method: "GET",
		headers: getAuthHeaders()
	}));
	if (!result?.data) throw new Error("Invalid message response.");
	return result.data;
}
async function deleteMessage(id) {
	await parseResponse(await fetch(`${API_BASE_URL}/contact-messages/${id}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	}));
	return true;
}
//#endregion
export { getMessage as n, getMessages as r, deleteMessage as t };
