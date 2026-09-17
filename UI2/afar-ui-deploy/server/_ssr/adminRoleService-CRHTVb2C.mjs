import { o as authFetch } from "./authService-tLH6lGQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/adminRoleService-CRHTVb2C.js
async function listRoles() {
	const res = await authFetch("/admin/roles");
	const body = await res.json().catch(() => null);
	if (!res.ok) throw new Error(body?.message ?? "Unable to load roles.");
	return body?.data ?? [];
}
async function createRole(payload) {
	const res = await authFetch("/admin/roles", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	});
	const body = await res.json().catch(() => null);
	if (!res.ok) throw new Error(body?.message ?? "Unable to create role.");
	return body.data;
}
async function updateRole(roleId, payload) {
	const res = await authFetch(`/admin/roles/${roleId}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	});
	const body = await res.json().catch(() => null);
	if (!res.ok) throw new Error(body?.message ?? "Unable to update role.");
	return body.data;
}
async function deleteRole(roleId) {
	const res = await authFetch(`/admin/roles/${roleId}`, { method: "DELETE" });
	const body = await res.json().catch(() => null);
	if (!res.ok) throw new Error(body?.message ?? "Unable to delete role.");
}
async function assignAdminRole(userId, roleId) {
	const res = await authFetch(`/admin/users/${userId}/role`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ role_id: Number(roleId) })
	});
	const body = await res.json().catch(() => null);
	if (!res.ok) throw new Error(body?.message ?? "Unable to assign role.");
}
//#endregion
export { updateRole as a, listRoles as i, createRole as n, deleteRole as r, assignAdminRole as t };
