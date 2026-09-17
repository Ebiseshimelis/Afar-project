import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as PERMISSION_ACTIONS, r as ASSIGNABLE_MODULES } from "./authService-tLH6lGQn.mjs";
import { D as Pencil, L as LoaderCircle, h as ShieldCheck, t as X, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
import { a as updateRole, i as listRoles, n as createRole, r as deleteRole } from "./adminRoleService-CRHTVb2C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.roles-BcQAtNbP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY_FORM = {
	name: "",
	description: "",
	permissions: []
};
function RolesAdmin() {
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [editingRole, setEditingRole] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(EMPTY_FORM);
	const groupedModules = (0, import_react.useMemo)(() => {
		return ASSIGNABLE_MODULES.reduce((groups, module) => {
			if (!groups[module.group]) groups[module.group] = [];
			groups[module.group].push(module);
			return groups;
		}, {});
	}, []);
	async function loadRoles() {
		try {
			setError("");
			setLoading(true);
			setRoles(await listRoles());
		} catch (e) {
			setError(e instanceof Error ? e.message : "Unable to load roles.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadRoles();
	}, []);
	function openCreateModal() {
		setEditingRole(null);
		setForm(EMPTY_FORM);
		setError("");
		setModalOpen(true);
	}
	function openEditModal(role) {
		if (!role.editable || role.id === "super_admin") return;
		setEditingRole(role);
		setForm({
			name: role.name,
			description: role.description ?? "",
			permissions: [...role.permissions]
		});
		setError("");
		setModalOpen(true);
	}
	function closeModal() {
		if (saving) return;
		setModalOpen(false);
		setEditingRole(null);
		setForm(EMPTY_FORM);
	}
	function togglePermission(permission) {
		setForm((current) => {
			const exists = current.permissions.includes(permission);
			return {
				...current,
				permissions: exists ? current.permissions.filter((item) => item !== permission) : [...current.permissions, permission]
			};
		});
	}
	function toggleModule(moduleKey) {
		const modulePermissions = PERMISSION_ACTIONS.map((action) => `${moduleKey}.${action}`);
		setForm((current) => {
			const allSelected = modulePermissions.every((permission) => current.permissions.includes(permission));
			return {
				...current,
				permissions: allSelected ? current.permissions.filter((permission) => !modulePermissions.includes(permission)) : Array.from(/* @__PURE__ */ new Set([...current.permissions, ...modulePermissions]))
			};
		});
	}
	async function saveRole(event) {
		event.preventDefault();
		const name = form.name.trim();
		if (!name) {
			setError("Role name is required.");
			return;
		}
		try {
			setSaving(true);
			setError("");
			const payload = {
				name,
				description: form.description.trim(),
				permissions: form.permissions
			};
			if (editingRole) await updateRole(editingRole.id, payload);
			else await createRole(payload);
			setModalOpen(false);
			setEditingRole(null);
			setForm(EMPTY_FORM);
			await loadRoles();
		} catch (e) {
			setError(e instanceof Error ? e.message : editingRole ? "Unable to update role." : "Unable to create role.");
		} finally {
			setSaving(false);
		}
	}
	async function handleDelete(role) {
		if (!role.deletable || role.id === "super_admin") return;
		const message = role.users > 0 ? `Delete "${role.name}"? ${role.users} staff account(s) currently use this role. They will lose this role and its permissions. This cannot be undone.` : `Delete "${role.name}"? This cannot be undone.`;
		if (!window.confirm(message)) return;
		try {
			setDeletingId(role.id);
			setError("");
			await deleteRole(role.id);
			await loadRoles();
		} catch (e) {
			setError(e instanceof Error ? e.message : "Unable to delete role.");
		} finally {
			setDeletingId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Role Management",
			description: "Create roles and control exactly which administrative permissions each role receives."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5 flex justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: openCreateModal,
				className: "inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Create Role"]
			})
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive",
			children: error
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-center gap-2 p-10 text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "Loading roles..."]
		}) : roles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground",
			children: "No roles found."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: roles.map((role) => {
				const isSuperAdmin = role.id === "super_admin";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-5 shadow-soft",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold",
									children: role.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										role.users,
										" user",
										role.users === 1 ? "" : "s"
									]
								})] })]
							}), !isSuperAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => openEditModal(role),
									disabled: !role.editable,
									className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50",
									title: "Edit role",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void handleDelete(role),
									disabled: !role.deletable || deletingId === role.id,
									className: "grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50",
									title: "Delete role",
									children: deletingId === role.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: role.description || "No description provided."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 border-t pt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Access"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-sm",
									children: isSuperAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Unrestricted"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										role.permissions.length,
										" permission",
										role.permissions.length === 1 ? "" : "s",
										" assigned"
									] })
								}),
								!isSuperAdmin && role.permissions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-1.5",
									children: [role.permissions.slice(0, 8).map((permission) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-secondary px-2 py-1 text-xs",
										children: permission
									}, permission)), role.permissions.length > 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-full bg-secondary px-2 py-1 text-xs",
										children: [
											"+",
											role.permissions.length - 8,
											" more"
										]
									})]
								})
							]
						})
					]
				}, role.id);
			})
		}),
		modalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl border bg-card shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: editingRole ? "Edit Role" : "Create Role"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Select the permissions this role should have."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: closeModal,
						disabled: saving,
						className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary disabled:opacity-50",
						title: "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: saveRole,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-[calc(90vh-150px)] overflow-y-auto p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Role Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: form.name,
									onChange: (event) => setForm((current) => ({
										...current,
										name: event.target.value
									})),
									placeholder: "e.g. Content Manager",
									className: "mt-1.5 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary",
									disabled: saving
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: form.description,
									onChange: (event) => setForm((current) => ({
										...current,
										description: event.target.value
									})),
									placeholder: "Describe what this role is responsible for.",
									rows: 3,
									className: "mt-1.5 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary",
									disabled: saving
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: "Permissions"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "Each module supports View, Create, Update, and Delete."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-4",
									children: Object.entries(groupedModules).map(([group, modules]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
											children: group
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-3",
											children: modules.map((module) => {
												const allSelected = PERMISSION_ACTIONS.map((action) => `${module.key}.${action}`).every((permission) => form.permissions.includes(permission));
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-lg bg-secondary/40 p-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap items-center justify-between gap-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => toggleModule(module.key),
															className: "text-sm font-medium hover:underline",
															disabled: saving,
															children: module.label
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "flex flex-wrap gap-4",
															children: PERMISSION_ACTIONS.map((action) => {
																const permission = `${module.key}.${action}`;
																return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																	className: "inline-flex cursor-pointer items-center gap-1.5 text-xs",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																		type: "checkbox",
																		checked: form.permissions.includes(permission),
																		onChange: () => togglePermission(permission),
																		disabled: saving
																	}), action.charAt(0).toUpperCase() + action.slice(1)]
																}, permission);
															})
														})]
													}), allSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-2 text-xs text-primary",
														children: "All permissions selected"
													})]
												}, module.key);
											})
										})]
									}, group))
								})] })
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 border-t px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: closeModal,
							disabled: saving,
							className: "h-9 rounded-lg border px-4 text-sm font-medium hover:bg-secondary disabled:opacity-50",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: saving,
							className: "inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50",
							children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), editingRole ? "Save Changes" : "Create Role"]
						})]
					})]
				})]
			})
		})
	] });
}
//#endregion
export { RolesAdmin as component };
