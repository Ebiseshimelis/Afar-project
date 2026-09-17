import { c as getAdminToken, n as API_ORIGIN, t as API_BASE } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/newsService-CiNVHUG4.js
var NEWS_API_URL = `${API_BASE}/news`;
function getAuthHeaders() {
	const token = getAdminToken();
	return token ? {
		Authorization: `Bearer ${token}`,
		Accept: "application/json"
	} : { Accept: "application/json" };
}
function mapNewsItem(item) {
	return {
		id: String(item.id),
		title: item.title_en || item.title?.en || "",
		excerpt: item.content_en?.substring(0, 120) || item.content?.en?.substring(0, 120) || "",
		body: item.content_en || item.content?.en || "",
		category: item.category?.name_en || item.category?.name?.en || item.category?.name || "",
		date: item.published_at || "",
		image: item.image_path ? String(item.image_path).startsWith("news/") ? `${API_ORIGIN}/storage/${String(item.image_path)}` : `/${String(item.image_path).replace(/^\/+/, "")}` : "/News1.jpg",
		author: item.author?.name || "",
		views: item.views || 0
	};
}
async function getNews() {
	const response = await fetch(NEWS_API_URL);
	if (!response.ok) throw new Error(`Failed to fetch news: ${response.status}`);
	const result = await response.json();
	if (!result || !Array.isArray(result.data)) throw new Error("Invalid news API response");
	return result.data.map(mapNewsItem);
}
async function getNewsById(id) {
	const response = await fetch(`${NEWS_API_URL}/${id}`);
	if (!response.ok) {
		if (response.status === 404) return null;
		throw new Error(`Failed to fetch news: ${response.status}`);
	}
	const result = await response.json();
	if (!result?.data) return null;
	return mapNewsItem(result.data);
}
function mapAdminNewsItem(item) {
	return {
		id: String(item.id),
		titleEn: item.title_en || item.title?.en || "",
		titleAm: item.title_am || item.title?.am || "",
		contentEn: item.content_en || item.content?.en || "",
		contentAm: item.content_am || item.content?.am || "",
		categoryId: item.category_id != null ? String(item.category_id) : "",
		status: item.status || "published",
		publishedAt: item.published_at || "",
		imagePath: item.image_path || ""
	};
}
async function getAdminNewsById(id) {
	const response = await fetch(`${NEWS_API_URL}/${id}`, { headers: getAuthHeaders() });
	if (!response.ok) {
		let message = `Failed to fetch news: ${response.status}`;
		try {
			const result = await response.json();
			if (result?.message) message = result.message;
		} catch {}
		throw new Error(message);
	}
	const result = await response.json();
	if (!result?.data) throw new Error("Invalid news response");
	return mapAdminNewsItem(result.data);
}
function buildNewsFormData(data) {
	const formData = new FormData();
	formData.append("title[en]", data.titleEn);
	formData.append("title[am]", data.titleAm);
	formData.append("content[en]", data.contentEn);
	formData.append("content[am]", data.contentAm);
	formData.append("category_id", data.categoryId);
	formData.append("status", data.status);
	if (data.publishedAt) formData.append("published_at", data.publishedAt);
	if (data.image instanceof File) formData.append("image", data.image);
	return formData;
}
async function createNews(data) {
	const formData = buildNewsFormData(data);
	const response = await fetch(NEWS_API_URL, {
		method: "POST",
		headers: getAuthHeaders(),
		body: formData
	});
	if (!response.ok) {
		let message = `Failed to create news: ${response.status}`;
		try {
			const result = await response.json();
			if (result?.message) message = result.message;
			if (result?.errors) {
				const errors = Object.values(result.errors).flat().join(" ");
				if (errors) message = errors;
			}
		} catch {}
		throw new Error(message);
	}
	const result = await response.json();
	if (!result?.data) throw new Error("Invalid create news response");
	return result.data;
}
async function updateNews(data) {
	const formData = buildNewsFormData(data);
	formData.append("_method", "PUT");
	const response = await fetch(`${NEWS_API_URL}/${data.id}`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: formData
	});
	if (!response.ok) {
		let message = `Failed to update news: ${response.status}`;
		try {
			const result = await response.json();
			if (result?.message) message = result.message;
			if (result?.errors) {
				const errors = Object.values(result.errors).flat().join(" ");
				if (errors) message = errors;
			}
		} catch {}
		throw new Error(message);
	}
	const result = await response.json();
	if (!result?.data) throw new Error("Invalid update news response");
	return result.data;
}
async function deleteNews(id) {
	const response = await fetch(`${NEWS_API_URL}/${id}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	});
	if (!response.ok) {
		let message = `Failed to delete news: ${response.status}`;
		try {
			const result = await response.json();
			if (result?.message) message = result.message;
		} catch {}
		throw new Error(message);
	}
	return true;
}
//#endregion
export { getNewsById as a, getNews as i, deleteNews as n, updateNews as o, getAdminNewsById as r, createNews as t };
