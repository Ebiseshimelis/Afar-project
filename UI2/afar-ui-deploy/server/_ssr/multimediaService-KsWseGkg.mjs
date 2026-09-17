import { l as getToken, n as API_ORIGIN, t as API_BASE } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/multimediaService-KsWseGkg.js
var API_BASE_URL = API_BASE;
var BACKEND_BASE_URL = API_ORIGIN;
function getAuthHeaders() {
	const token = getToken();
	return {
		Accept: "application/json",
		...token ? { Authorization: `Bearer ${token}` } : {}
	};
}
/**
* Converts a backend/local storage path into a browser URL.
*
* Examples:
*
* multimedia/photo.jpg
* -> backend storage URL
*
* https://example.com/photo.jpg
* -> unchanged
*/
function getMediaUrl(path) {
	if (!path) return "";
	const value = String(path).trim();
	if (!value) return "";
	if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("blob:") || value.startsWith("data:")) return value;
	return `${BACKEND_BASE_URL}/storage/${value.replace(/^\/+/, "").replace(/^storage\/+/i, "")}`;
}
function normalizeMultimedia(item) {
	return {
		id: Number(item.id),
		title: item.title ?? "",
		description: item.description ?? null,
		type: item.type === "video" ? "video" : "image",
		filePath: item.file_path ?? null,
		fileUrl: item.file_url ?? getMediaUrl(item.file_path),
		videoUrl: item.video_url ?? null,
		thumbnail: item.thumbnail ? getMediaUrl(item.thumbnail) : null,
		status: item.status === "draft" ? "draft" : "published",
		publishedAt: item.published_at ?? null,
		uploadedBy: item.uploaded_by ?? null,
		createdAt: item.created_at ?? "",
		updatedAt: item.updated_at ?? ""
	};
}
async function parseResponse(response) {
	const text = await response.text();
	let data = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		throw new Error(`Server returned an invalid response (${response.status}).`);
	}
	if (!response.ok) {
		let message = data?.message || data?.error || `Request failed with status ${response.status}.`;
		if (data?.errors) {
			const validationErrors = Object.values(data.errors).flat().filter(Boolean).join(" ");
			if (validationErrors) message = validationErrors;
		}
		throw new Error(`${message} (HTTP ${response.status})`);
	}
	return data;
}
function getItems(result) {
	if (Array.isArray(result)) return result;
	if (Array.isArray(result?.data)) return result.data;
	return [];
}
async function getMultimedia() {
	return getItems(await parseResponse(await fetch(`${API_BASE_URL}/multimedia`, {
		method: "GET",
		headers: { Accept: "application/json" }
	}))).map(normalizeMultimedia);
}
async function getMultimediaItem(id) {
	const result = await parseResponse(await fetch(`${API_BASE_URL}/multimedia/${id}`, {
		method: "GET",
		headers: { Accept: "application/json" }
	}));
	return normalizeMultimedia(result?.data ?? result);
}
async function createMultimedia(data) {
	const formData = new FormData();
	formData.append("title", data.title);
	formData.append("description", data.description ?? "");
	formData.append("type", data.type);
	formData.append("status", data.status);
	if (data.mediaUrl?.trim()) formData.append("media_url", data.mediaUrl.trim());
	if (data.videoUrl?.trim()) formData.append("video_url", data.videoUrl.trim());
	if (data.thumbnail?.trim()) formData.append("thumbnail", data.thumbnail.trim());
	if (data.publishedAt) formData.append("published_at", data.publishedAt);
	if (data.file instanceof File) formData.append("file", data.file);
	const result = await parseResponse(await fetch(`${API_BASE_URL}/multimedia`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: formData
	}));
	return normalizeMultimedia(result?.data ?? result);
}
async function updateMultimedia(id, data) {
	const formData = new FormData();
	formData.append("_method", "PUT");
	if (data.title !== void 0) formData.append("title", data.title);
	if (data.description !== void 0) formData.append("description", data.description);
	if (data.type !== void 0) formData.append("type", data.type);
	if (data.status !== void 0) formData.append("status", data.status);
	if (data.mediaUrl !== void 0) formData.append("media_url", data.mediaUrl);
	if (data.videoUrl !== void 0) formData.append("video_url", data.videoUrl);
	if (data.thumbnail !== void 0) formData.append("thumbnail", data.thumbnail);
	if (data.publishedAt !== void 0) formData.append("published_at", data.publishedAt);
	if (data.file instanceof File) formData.append("file", data.file);
	const result = await parseResponse(await fetch(`${API_BASE_URL}/multimedia/${id}`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: formData
	}));
	return normalizeMultimedia(result?.data ?? result);
}
async function deleteMultimedia(id) {
	await parseResponse(await fetch(`${API_BASE_URL}/multimedia/${id}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	}));
}
//#endregion
export { getMultimediaItem as a, getMultimedia as i, deleteMultimedia as n, updateMultimedia as o, getMediaUrl as r, createMultimedia as t };
