import { c as getAdminToken, n as API_ORIGIN, t as API_BASE } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/directorateService-DPp5QHcB.js
/**
* Convert a Laravel public-storage path into
* a browser URL.
*/
function makeStorageUrl(path, fallback) {
	if (!path) return fallback;
	if (path.startsWith("http://") || path.startsWith("https://")) return path;
	return `${API_ORIGIN}/storage/${path.replace(/^\/+/, "")}`;
}
/**
* Convert the Laravel directorate object into
* the format used by React.
*/
function mapDirectorate(d) {
	return {
		id: d.id,
		name: d.name?.en || "",
		nameAm: d.name?.am || "",
		description: d.description?.en || "",
		descriptionAm: d.description?.am || "",
		headName: d.head_name?.en || "",
		headNameAm: d.head_name?.am || "",
		headTitle: d.head_title?.en || "",
		headTitleAm: d.head_title?.am || "",
		email: d.email || "",
		phone: d.phone || "",
		photo: makeStorageUrl(d.photo_path, "/land.jpg"),
		background: makeStorageUrl(d.background_image, "/land.jpg"),
		sortOrder: d.sort_order ?? 0
	};
}
/**
* Authentication headers for admin operations.
*/
function getAuthHeaders() {
	const token = getAdminToken();
	if (!token) throw new Error("You are not logged in as an administrator.");
	return {
		Accept: "application/json",
		Authorization: `Bearer ${token}`
	};
}
/**
* GET all directorates.
*/
async function getDirectorates() {
	const response = await fetch(`${API_BASE}/directorates`, {
		method: "GET",
		headers: { Accept: "application/json" }
	});
	const json = await response.json().catch(() => null);
	if (!response.ok) throw new Error(json?.message || `Failed to fetch directorates: ${response.status}`);
	return (json?.data || []).map(mapDirectorate).sort((a, b) => a.sortOrder - b.sortOrder);
}
/**
* GET one directorate by ID.
*/
async function getDirectorate(id) {
	const response = await fetch(`${API_BASE}/directorates/${id}`, {
		method: "GET",
		headers: { Accept: "application/json" }
	});
	const json = await response.json().catch(() => null);
	if (!response.ok) throw new Error(json?.message || `Failed to fetch directorate: ${response.status}`);
	if (!json?.data) throw new Error("Directorate not found.");
	return mapDirectorate(json.data);
}
/**
* Build Laravel-compatible multipart form data.
*
* IMPORTANT:
* Do not manually set Content-Type.
* The browser creates the multipart boundary.
*/
function buildFormData(data) {
	const formData = new FormData();
	formData.append("name[en]", data.name.trim());
	formData.append("name[am]", data.nameAm.trim());
	formData.append("description[en]", data.description.trim());
	formData.append("description[am]", data.descriptionAm.trim());
	formData.append("head_name[en]", data.headName.trim());
	formData.append("head_name[am]", data.headNameAm.trim());
	formData.append("head_title[en]", data.headTitle.trim());
	formData.append("head_title[am]", data.headTitleAm.trim());
	if (data.email.trim()) formData.append("email", data.email.trim());
	if (data.phone.trim()) formData.append("phone", data.phone.trim());
	formData.append("sort_order", String(data.sortOrder));
	if (data.photo instanceof File) formData.append("photo", data.photo, data.photo.name);
	if (data.background instanceof File) formData.append("background", data.background, data.background.name);
	return formData;
}
/**
* Parse API response and return useful Laravel
* validation/error messages.
*/
async function parseResponse(response) {
	const text = await response.text();
	console.log("Directorate API raw response:", text);
	let data = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		console.error("Response was not valid JSON:", text);
	}
	console.log("Directorate API response:", {
		status: response.status,
		data
	});
	if (!response.ok) {
		const validationMessage = data?.errors && Object.entries(data.errors).map(([field, messages]) => {
			return `${field}: ${Array.isArray(messages) ? messages.join(", ") : String(messages)}`;
		}).join(" | ");
		throw new Error(validationMessage || data?.message || `Request failed with status ${response.status}.`);
	}
	return data;
}
/**
* CREATE directorate.
*/
async function createDirectorate(data) {
	const json = await parseResponse(await fetch(`${API_BASE}/directorates`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: buildFormData(data)
	}));
	if (!json?.data) throw new Error("Directorate was created but the server returned no data.");
	return mapDirectorate(json.data);
}
/**
* UPDATE directorate.
*
* Laravel receives this as POST + _method=PUT
* because multipart PUT uploads can be problematic.
*/
async function updateDirectorate(id, data) {
	const formData = buildFormData(data);
	formData.append("_method", "PUT");
	const json = await parseResponse(await fetch(`${API_BASE}/directorates/${id}`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: formData
	}));
	if (!json?.data) throw new Error("Directorate was updated but the server returned no data.");
	return mapDirectorate(json.data);
}
/**
* DELETE directorate.
*/
async function deleteDirectorate(id) {
	await parseResponse(await fetch(`${API_BASE}/directorates/${id}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	}));
}
//#endregion
export { updateDirectorate as a, getDirectorates as i, deleteDirectorate as n, getDirectorate as r, createDirectorate as t };
