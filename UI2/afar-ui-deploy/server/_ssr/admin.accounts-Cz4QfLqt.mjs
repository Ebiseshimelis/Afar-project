import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { o as authFetch } from "./authService-tLH6lGQn.mjs";
import { D as Pencil, h as ShieldCheck, t as X, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.accounts-Cz4QfLqt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEMO_KEY = "afar_admin_accounts_demo";
var DEMO_ROLES = [{
	id: "7",
	name: "Admin",
	slug: "admin",
	description: "Normal administrative staff",
	permissions: [
		"news.view",
		"news.create",
		"news.update",
		"events.view",
		"events.create",
		"events.update",
		"tenders.view"
	],
	permissions_count: 7
}];
var DEMO_ACCOUNTS = [{
	id: "2",
	name: "Fatuma Ali",
	email: "admin@afarudcb.gov.et",
	role: "admin",
	role_id: "7",
	role_name: "Admin",
	is_active: true,
	account_status: "approved",
	permissions: DEMO_ROLES[0].permissions,
	permissions_count: 7
}, {
	id: "3",
	name: "Hassan Osman",
	email: "disabled@afarudcb.gov.et",
	role: "admin",
	role_id: "7",
	role_name: "Admin",
	is_active: false,
	account_status: "approved",
	permissions: ["news.view"],
	permissions_count: 1
}];
function readDemoAccounts() {
	if (typeof window === "undefined") return DEMO_ACCOUNTS;
	const raw = window.localStorage.getItem(DEMO_KEY);
	if (!raw) return DEMO_ACCOUNTS;
	try {
		return JSON.parse(raw);
	} catch {
		return DEMO_ACCOUNTS;
	}
}
function writeDemoAccounts(accounts) {
	if (typeof window !== "undefined") window.localStorage.setItem(DEMO_KEY, JSON.stringify(accounts));
}
function normalizeRole(raw) {
	const permissions = Array.isArray(raw?.permissions) ? raw.permissions.map(String) : [];
	return {
		id: String(raw?.id ?? ""),
		name: String(raw?.name ?? raw?.role_name ?? ""),
		slug: raw?.slug ? String(raw.slug) : null,
		description: raw?.description ? String(raw.description) : null,
		permissions,
		permissions_count: raw?.permissions_count ?? permissions.length
	};
}
function normalizeAccount(raw) {
	const permissions = Array.isArray(raw?.permissions) ? raw.permissions.map(String) : [];
	const roleId = raw?.role_id !== null && raw?.role_id !== void 0 && raw?.role_id !== "" ? String(raw.role_id) : null;
	return {
		id: String(raw?.id ?? ""),
		name: String(raw?.name ?? ""),
		email: String(raw?.email ?? ""),
		role: "admin",
		role_id: roleId,
		role_name: raw?.role_name ?? raw?.role?.name ?? null,
		is_active: raw?.is_active !== false,
		account_status: raw?.account_status === "approved" ? "approved" : raw?.account_status === "rejected" ? "rejected" : "pending",
		permissions,
		permissions_count: raw?.permissions_count ?? permissions.length
	};
}
async function request(path, init = {}, fallback) {
	let response;
	try {
		response = await authFetch(path, init);
	} catch {
		if (fallback) return fallback();
		throw new Error("Unable to connect to the server.");
	}
	if (!response.ok) {
		if (response.status === 401 || response.status === 403) throw new Error("You do not have permission to perform this action.");
		if (response.status === 404 && fallback) return fallback();
		const body = await response.json().catch(() => null);
		throw new Error(body?.message ? String(body.message) : "The request could not be completed.");
	}
	const body = await response.json().catch(() => null);
	return body?.data ?? body;
}
/**
* List admin accounts.
*/
async function listAdminAccounts() {
	const data = await request("/admin/accounts", { method: "GET" }, () => readDemoAccounts());
	if (Array.isArray(data)) return data.map(normalizeAccount);
	if (Array.isArray(data?.data)) return data.data.map(normalizeAccount);
	return readDemoAccounts();
}
/**
* Backwards-compatible alias used by Admin Accounts page.
*/
async function listAdmins() {
	return listAdminAccounts();
}
/**
* List roles available for assigning to Admin accounts.
*/
async function listRoles() {
	const data = await request("/admin/roles", { method: "GET" }, () => DEMO_ROLES);
	if (Array.isArray(data)) return data.map(normalizeRole);
	if (Array.isArray(data?.data)) return data.data.map(normalizeRole);
	return DEMO_ROLES;
}
/**
* Create an Admin account.
*/
async function createAdmin(input) {
	return normalizeAccount(await request("/admin/accounts", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input)
	}, () => {
		const accounts = readDemoAccounts();
		const role = DEMO_ROLES.find((item) => item.id === input.role_id);
		const created = {
			id: String(Date.now()),
			name: input.name,
			email: input.email,
			role: "admin",
			role_id: input.role_id,
			role_name: role?.name ?? null,
			is_active: input.is_active,
			account_status: input.account_status,
			permissions: role?.permissions ?? [],
			permissions_count: role?.permissions.length ?? 0
		};
		writeDemoAccounts([...accounts, created]);
		return created;
	}));
}
/**
* Update an Admin account.
*/
async function updateAdmin(id, input) {
	return normalizeAccount(await request(`/admin/accounts/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input)
	}, () => {
		const updated = readDemoAccounts().map((account) => {
			if (account.id !== id) return account;
			const role = input.role_id !== void 0 ? DEMO_ROLES.find((item) => item.id === input.role_id) : void 0;
			return {
				...account,
				...input,
				role: "admin",
				role_id: input.role_id !== void 0 ? input.role_id : account.role_id,
				role_name: role !== void 0 ? role?.name ?? null : account.role_name,
				permissions: role !== void 0 ? role?.permissions ?? [] : account.permissions,
				permissions_count: role !== void 0 ? role?.permissions.length ?? 0 : account.permissions_count
			};
		});
		writeDemoAccounts(updated);
		const account = updated.find((item) => item.id === id);
		if (!account) throw new Error("Admin account not found.");
		return account;
	}));
}
/**
* Enable or disable an Admin account.
*/
async function setAdminActive(id, is_active) {
	return updateAdmin(id, { is_active });
}
/**
* Delete an Admin account.
*/
async function deleteAdmin(id) {
	await request(`/admin/accounts/${id}`, { method: "DELETE" }, () => {
		writeDemoAccounts(readDemoAccounts().filter((account) => account.id !== id));
	});
}
var emptyForm = {
	name: "",
	email: "",
	password: "",
	role_id: null,
	is_active: true,
	account_status: "pending"
};
function AdminAccountsPage() {
	const [list, setList] = (0, import_react.useState)([]);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const load = async () => {
		setLoading(true);
		try {
			const [admins, availableRoles] = await Promise.all([listAdmins(), listRoles()]);
			setList(admins);
			setRoles(availableRoles);
		} catch (e) {
			toast.error(e?.message ?? "Could not load admin accounts.");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const toggleActive = async (a) => {
		try {
			await setAdminActive(a.id, !a.is_active);
			toast.success(a.is_active ? "Account disabled" : "Account enabled");
			load();
		} catch (e) {
			toast.error(e?.message ?? "Update failed.");
		}
	};
	const setApprovalStatus = async (a, status) => {
		try {
			await updateAdmin(a.id, { account_status: status });
			toast.success(`Account ${status}.`);
			load();
		} catch (e) {
			toast.error(e?.message ?? "Approval update failed.");
		}
	};
	const remove = async (a) => {
		if (!window.confirm(`Delete ${a.name}? This cannot be undone.`)) return;
		try {
			await deleteAdmin(a.id);
			toast.success("Account deleted");
			load();
		} catch (e) {
			toast.error(e?.message ?? "Delete failed.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, {
		permission: "admin_accounts.view",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
				title: "Admin Accounts",
				description: "Super Admin only — create Admin accounts and assign database roles.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setCreating(true),
					className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New admin"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl border bg-card shadow-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Email"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Role"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Active"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Approval"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Permissions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
							loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "px-5 py-10 text-center text-muted-foreground",
								children: "Loading accounts..."
							}) }),
							!loading && list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "px-5 py-10 text-center text-muted-foreground",
								children: "No admin accounts yet."
							}) }),
							list.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary",
												children: a.name.charAt(0).toUpperCase()
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: a.name
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-muted-foreground",
										children: a.email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary",
											children: a.role_name ?? "Unassigned"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => toggleActive(a),
											className: "rounded-full px-2.5 py-1 text-xs font-semibold " + (a.is_active ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"),
											children: a.is_active ? "Active" : "Disabled"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setApprovalStatus(a, a.account_status === "approved" ? "pending" : "approved"),
											className: "rounded-full px-2.5 py-1 text-xs font-semibold " + (a.account_status === "approved" ? "bg-success/15 text-success" : a.account_status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-warning/15 text-warning"),
											children: a.account_status.charAt(0).toUpperCase() + a.account_status.slice(1)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "rounded-md bg-secondary px-2 py-1 text-xs font-medium",
											children: [a.permissions_count ?? a.permissions.length, " granted"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setEditing(a),
												"aria-label": "Edit",
												className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => remove(a),
												"aria-label": "Delete",
												className: "grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
											})]
										})
									})
								]
							}, a.id))
						] })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), "Admin permissions come from the assigned database role. The backend re-checks authorization on every request."]
			}),
			(creating || editing) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountDialog, {
				account: editing,
				roles,
				onClose: () => {
					setCreating(false);
					setEditing(null);
				},
				onSaved: () => {
					setCreating(false);
					setEditing(null);
					load();
				}
			})
		]
	});
}
function AccountDialog({ account, roles, onClose, onSaved }) {
	const [form, setForm] = (0, import_react.useState)(account ? {
		name: account.name,
		email: account.email,
		password: "",
		role_id: account.role_id,
		is_active: account.is_active,
		account_status: account.account_status
	} : emptyForm);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const selectedRole = roles.find((role) => role.id === form.role_id);
	const submit = async (e) => {
		e.preventDefault();
		setSaving(true);
		try {
			if (account) {
				const payload = {
					name: form.name,
					email: form.email,
					role_id: form.role_id,
					is_active: form.is_active,
					account_status: form.account_status
				};
				if (form.password) payload.password = form.password;
				await updateAdmin(account.id, payload);
				toast.success("Account updated");
			} else {
				await createAdmin(form);
				toast.success("Admin account created");
			}
			onSaved();
		} catch (err) {
			toast.error(err?.message ?? "Save failed.");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "w-full max-w-2xl rounded-xl border bg-card shadow-elegant",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: account ? "Edit admin" : "New admin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Role is always Admin. Permissions come from the selected role."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Close",
						className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 px-5 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: "Full name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: form.name,
									onChange: (e) => setForm({
										...form,
										name: e.target.value
									}),
									className: "mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "email",
									value: form.email,
									onChange: (e) => setForm({
										...form,
										email: e.target.value
									}),
									className: "mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium",
									children: [
										"Password",
										" ",
										account && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "(leave blank to keep)"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: !account,
									type: "password",
									value: form.password ?? "",
									onChange: (e) => setForm({
										...form,
										password: e.target.value
									}),
									className: "mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: "Role"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									required: true,
									value: form.role_id ?? "",
									onChange: (e) => setForm({
										...form,
										role_id: e.target.value || null
									}),
									className: "mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select a role"
									}), roles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: role.id,
										children: role.name
									}, role.id))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form.is_active,
									onChange: (e) => setForm({
										...form,
										is_active: e.target.checked
									}),
									className: "rounded border"
								}), "Account active"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: "Account status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: form.account_status,
									onChange: (e) => setForm({
										...form,
										account_status: e.target.value
									}),
									className: "mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "pending",
											children: "Pending"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "approved",
											children: "Approved"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "rejected",
											children: "Rejected"
										})
									]
								})]
							})
						]
					}), selectedRole && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b bg-secondary/50 px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: selectedRole.name
							}), selectedRole.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: selectedRole.description
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Permissions granted by this role"
							}), selectedRole.permissions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "This role has no permissions."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: selectedRole.permissions.map((permission) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md bg-secondary px-2 py-1 text-xs font-medium",
									children: permission
								}, permission))
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2 border-t px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-lg border px-4 py-2 text-sm font-medium hover:bg-secondary",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: saving || !form.role_id,
						className: "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60",
						children: saving ? "Saving..." : account ? "Save changes" : "Create admin"
					})]
				})
			]
		})
	});
}
//#endregion
export { AdminAccountsPage as component };
