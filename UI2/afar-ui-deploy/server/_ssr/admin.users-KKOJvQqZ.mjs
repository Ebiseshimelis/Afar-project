import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { o as authFetch } from "./authService-tLH6lGQn.mjs";
import { L as LoaderCircle, a as UserX, c as UserCheck, h as ShieldCheck, r as Users, u as Trash2 } from "../_libs/lucide-react.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
import { i as listRoles, t as assignAdminRole } from "./adminRoleService-CRHTVb2C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.users-KKOJvQqZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function request(path, init = {}) {
	const res = await authFetch(path, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...init.headers ?? {}
		}
	});
	const body = await res.json().catch(() => null);
	if (!res.ok) throw new Error(body?.message ?? "The request could not be completed.");
	return body?.data ?? body;
}
async function listUsers() {
	return request("/admin/users");
}
async function setUserStatus(id, is_active) {
	return request(`/admin/users/${id}/status`, {
		method: "PATCH",
		body: JSON.stringify({ is_active })
	});
}
async function deleteUser(id) {
	await request(`/admin/users/${id}`, { method: "DELETE" });
}
function UsersRolesAdmin() {
	const { isSuperAdmin } = useAuth();
	const [users, setUsers] = (0, import_react.useState)([]);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	async function loadUsers() {
		try {
			setError("");
			setLoading(true);
			const [loadedUsers, loadedRoles] = await Promise.all([listUsers(), listRoles()]);
			setUsers(loadedUsers);
			setRoles(loadedRoles);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Unable to load users.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadUsers();
	}, []);
	async function changeRole(user, roleId) {
		if (!isSuperAdmin || user.role === "super_admin") return;
		try {
			setError("");
			await assignAdminRole(user.id, roleId);
			await loadUsers();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Unable to assign role.");
		}
	}
	async function toggleStatus(user) {
		if (!isSuperAdmin) return;
		try {
			await setUserStatus(user.id, !user.is_active);
			await loadUsers();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Unable to change account status.");
		}
	}
	async function removeUser(user) {
		if (!isSuperAdmin) return;
		if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
		try {
			await deleteUser(user.id);
			await loadUsers();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Unable to delete user.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Users & Roles",
			description: "View staff accounts, their roles, account status, and assigned permissions."
		}),
		!isSuperAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5 rounded-xl border bg-card p-4 text-sm text-muted-foreground",
			children: "You can view staff accounts, but only the Super Admin can change roles, account status, or permissions."
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive",
			children: error
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border bg-card shadow-soft",
			children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-2 p-10 text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Loading staff accounts..."]
			}) : users.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-12 w-12 place-items-center rounded-full bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-6 w-6 text-muted-foreground" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-semibold",
						children: "No staff accounts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "There are currently no staff accounts to display."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Staff Member"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Role"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: users.map((user) => {
						const isSuperAdminUser = user.role === "super_admin";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t hover:bg-secondary/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: user.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: user.email
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: isSuperAdminUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), "Super Admin"]
									}) : isSuperAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: user.role_id ?? "",
										onChange: (event) => void changeRole(user, event.target.value),
										className: "h-9 min-w-[220px] rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Unassigned"
										}), roles.filter((role) => role.id !== "super_admin").map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: role.id,
											children: role.name
										}, role.id))]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), user.role_name ?? "Unassigned"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: user.is_active ? "inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary" : "inline-flex rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive",
										children: user.is_active ? "Active" : "Disabled"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "inline-flex items-center gap-1",
										children: isSuperAdmin && !isSuperAdminUser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => void toggleStatus(user),
											className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
											title: user.is_active ? "Disable account" : "Enable account",
											children: user.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => void removeUser(user),
											className: "grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10",
											title: "Delete account",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})] })
									})
								})
							]
						}, user.id);
					}) })]
				})
			})
		})
	] });
}
//#endregion
export { UsersRolesAdmin as component };
