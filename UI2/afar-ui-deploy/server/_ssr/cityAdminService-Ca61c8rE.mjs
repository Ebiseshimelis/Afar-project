import { l as getToken, n as API_ORIGIN, t as API_BASE } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cityAdminService-Ca61c8rE.js
function mapCityAdmin(item) {
	return {
		id: String(item.id),
		name: item.name?.en || item.name_en || "",
		nameAm: item.name?.am || item.name_am || "",
		description: item.description?.en || "",
		descriptionAm: item.description?.am || "",
		mayor_name: item.mayor_name || "",
		location: item.location || "",
		email: item.email || "",
		phone: item.phone || "",
		photo: item.image_path ? String(item.image_path).startsWith("http") ? String(item.image_path) : String(item.image_path).startsWith("/storage/") ? `${API_ORIGIN}${String(item.image_path)}` : String(item.image_path).startsWith("storage/") ? `${API_ORIGIN}/${String(item.image_path)}` : String(item.image_path).includes("city-admins/") ? `${API_ORIGIN}/storage/${String(item.image_path).replace(/^\/+/, "")}` : String(item.image_path) : ""
	};
}
async function getCityAdmins() {
	const response = await fetch(`${API_BASE}/city-admins`, { headers: { Accept: "application/json" } });
	const result = await response.json();
	if (!response.ok) throw new Error(result?.message || "Failed to fetch city administrations.");
	return (result.data || []).map(mapCityAdmin);
}
async function createCityAdmin(form) {
	const body = new FormData();
	body.append("name[en]", form.name);
	body.append("name[am]", form.nameAm);
	body.append("description[en]", form.description);
	body.append("description[am]", form.descriptionAm);
	body.append("mayor_name", form.mayor_name);
	body.append("location", form.location);
	body.append("email", form.email);
	body.append("phone", form.phone);
	if (form.image) body.append("image", form.image);
	const token = getToken();
	const response = await fetch(`${API_BASE_URL}/city-admins`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			...token ? { Authorization: `Bearer ${token}` } : {}
		},
		body
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result?.message || "Failed to create city administration.");
	return mapCityAdmin(result.data);
}
async function updateCityAdmin(id, form) {
	const body = new FormData();
	body.append("name[en]", form.name);
	body.append("name[am]", form.nameAm);
	body.append("description[en]", form.description);
	body.append("description[am]", form.descriptionAm);
	body.append("mayor_name", form.mayor_name);
	body.append("location", form.location);
	body.append("email", form.email);
	body.append("phone", form.phone);
	if (form.image) body.append("image", form.image);
	body.append("_method", "PUT");
	const token = getToken();
	const response = await fetch(`${API_BASE_URL}/city-admins/${id}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			...token ? { Authorization: `Bearer ${token}` } : {}
		},
		body
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result?.message || "Failed to update city administration.");
	return mapCityAdmin(result.data);
}
async function deleteCityAdmin(id) {
	const token = getToken();
	const response = await fetch(`${API_BASE_URL}/city-admins/${id}`, {
		method: "DELETE",
		headers: {
			Accept: "application/json",
			...token ? { Authorization: `Bearer ${token}` } : {}
		}
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result?.message || "Failed to delete city administration.");
}
//#endregion
export { updateCityAdmin as i, deleteCityAdmin as n, getCityAdmins as r, createCityAdmin as t };
