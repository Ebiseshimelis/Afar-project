import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { L as LoaderCircle, U as ImagePlus, m as SquarePen, ot as Building2, t as X, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { i as updateCityAdmin, n as deleteCityAdmin, r as getCityAdmins, t as createCityAdmin } from "./cityAdminService-Ca61c8rE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.city-admins-C2LS8lO3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyForm = {
	name: "",
	nameAm: "",
	description: "",
	descriptionAm: "",
	mayor_name: "",
	location: "",
	email: "",
	phone: "",
	image: null
};
function AdminCityAdminsPage() {
	const { can } = useAuth();
	const [cities, setCities] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const [preview, setPreview] = (0, import_react.useState)("");
	const fileInputRef = (0, import_react.useRef)(null);
	async function loadCities() {
		try {
			setLoading(true);
			const data = await getCityAdmins();
			setCities(data);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "Failed to load city administrations.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadCities();
	}, []);
	function resetForm() {
		setForm({ ...emptyForm });
		setEditingId(null);
		setPreview("");
		setShowForm(false);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}
	function openCreateForm() {
		if (!can("city_admins.create")) return;
		setForm({ ...emptyForm });
		setEditingId(null);
		setPreview("");
		setShowForm(true);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}
	function openEditForm(city) {
		if (!can("city_admins.update")) return;
		setEditingId(city.id);
		setForm({
			name: city.name,
			nameAm: city.nameAm || "",
			description: city.description,
			descriptionAm: city.descriptionAm || "",
			mayor_name: city.mayor_name,
			location: city.location,
			email: city.email,
			phone: city.phone,
			image: null
		});
		setPreview(city.photo || "");
		setShowForm(true);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}
	function handleChange(field, value) {
		setForm((current) => ({
			...current,
			[field]: value
		}));
	}
	function handleImageChange(event) {
		const file = event.target.files?.[0];
		if (!file) return;
		if (file.size > 2 * 1024 * 1024) {
			toast.error("Image must be smaller than 2 MB.");
			event.target.value = "";
			return;
		}
		setForm((current) => ({
			...current,
			image: file
		}));
		const objectUrl = URL.createObjectURL(file);
		setPreview(objectUrl);
	}
	async function handleSubmit(event) {
		event.preventDefault();
		if (!form.name.trim()) {
			toast.error("English city administration name is required.");
			return;
		}
		if (!form.nameAm.trim()) {
			toast.error("Amharic city administration name is required.");
			return;
		}
		try {
			setSaving(true);
			if (editingId) {
				const updated = await updateCityAdmin(editingId, form);
				setCities((current) => current.map((city) => city.id === editingId ? updated : city));
				toast.success("City administration updated successfully.");
			} else {
				const created = await createCityAdmin(form);
				setCities((current) => [...current, created]);
				toast.success("City administration created successfully.");
			}
			resetForm();
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "Failed to save city administration.");
		} finally {
			setSaving(false);
		}
	}
	async function handleDelete(city) {
		if (!can("city_admins.delete")) return;
		if (!window.confirm(`Are you sure you want to delete "${city.name}"?`)) return;
		try {
			await deleteCityAdmin(city.id);
			setCities((current) => current.filter((item) => item.id !== city.id));
			toast.success("City administration deleted successfully.");
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "Failed to delete city administration.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "City Administrations",
			description: "Manage city administrations, mayors, contact details, descriptions, and photos.",
			action: can("city_admins.create") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: openCreateForm,
				className: "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Add City Administration"]
			}) : void 0
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-6 rounded-xl border bg-card p-6 shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: editingId ? "Edit City Administration" : "Add City Administration"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Enter the city administration information below."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: resetForm,
					disabled: saving,
					className: "rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-2 block text-sm font-medium",
							children: "Name — English *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.name,
							onChange: (e) => handleChange("name", e.target.value),
							placeholder: "Semera City Administration",
							className: "h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring",
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-2 block text-sm font-medium",
							children: "Name — Amharic"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.nameAm,
							onChange: (e) => handleChange("nameAm", e.target.value),
							placeholder: "የሰመራ ከተማ አስተዳደር",
							className: "h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring",
							required: true
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-2 block text-sm font-medium",
							children: "Description — English"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: form.description,
							onChange: (e) => handleChange("description", e.target.value),
							rows: 4,
							placeholder: "Describe the city administration...",
							className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-2 block text-sm font-medium",
							children: "Description — Amharic"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: form.descriptionAm,
							onChange: (e) => handleChange("descriptionAm", e.target.value),
							rows: 4,
							placeholder: "የከተማ አስተዳደሩን መግለጫ ያስገቡ...",
							className: "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-2 block text-sm font-medium",
							children: "Mayor Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.mayor_name,
							onChange: (e) => handleChange("mayor_name", e.target.value),
							placeholder: "Mayor name",
							className: "h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-2 block text-sm font-medium",
							children: "Location"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.location,
							onChange: (e) => handleChange("location", e.target.value),
							placeholder: "Semera, Afar",
							className: "h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-2 block text-sm font-medium",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: form.email,
							onChange: (e) => handleChange("email", e.target.value),
							placeholder: "info@example.gov.et",
							className: "h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-2 block text-sm font-medium",
							children: "Phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: form.phone,
							onChange: (e) => handleChange("phone", e.target.value),
							placeholder: "033-666-0577",
							className: "h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-2 block text-sm font-medium",
						children: "City Administration Photo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 sm:flex-row sm:items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted",
							children: preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: preview,
								alt: "Preview",
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-10 w-10 text-muted-foreground" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileInputRef,
								type: "file",
								accept: "image/*",
								onChange: handleImageChange,
								className: "hidden"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => fileInputRef.current?.click(),
								className: "inline-flex h-10 items-center gap-2 rounded-md border bg-background px-4 text-sm font-medium hover:bg-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-4 w-4" }), "Choose Photo"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "Maximum file size: 2 MB."
							})
						] })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-3 border-t pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: resetForm,
							disabled: saving,
							className: "h-10 rounded-md border px-4 text-sm font-medium hover:bg-muted disabled:opacity-50",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: saving,
							className: "inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60",
							children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), saving ? "Saving..." : editingId ? "Update City Administration" : "Create City Administration"]
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "overflow-hidden rounded-xl border bg-card shadow-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b px-6 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "City Administration Entries"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						cities.length,
						" administration",
						cities.length === 1 ? "" : "s"
					]
				})]
			}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }), "Loading city administrations..."]
			}) : cities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-3 font-semibold",
						children: "No city administrations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Add the first city administration to get started."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[900px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/50",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-left font-medium",
									children: "City Administration"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-left font-medium",
									children: "Mayor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-left font-medium",
									children: "Location"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-left font-medium",
									children: "Contact"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-right font-medium",
									children: "Actions"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: cities.map((city) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b last:border-0 hover:bg-muted/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [city.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: city.photo,
										alt: city.name,
										className: "h-12 w-12 shrink-0 rounded-lg object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5 text-primary" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: city.name
										}), city.nameAm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-0.5 text-xs text-muted-foreground",
											children: city.nameAm
										})]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4",
								children: city.mayor_name || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4",
								children: city.location || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-5 py-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: city.email || "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: city.phone || "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2",
									children: [can("city_admins.update") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => openEditForm(city),
										className: "inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium hover:bg-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-3.5 w-3.5" }), "Edit"]
									}), can("city_admins.delete") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => handleDelete(city),
										className: "inline-flex h-9 items-center gap-1.5 rounded-md border border-destructive/30 px-3 text-xs font-medium text-destructive hover:bg-destructive/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), "Delete"]
									})]
								})
							})
						]
					}, city.id)) })]
				})
			})]
		})
	] });
}
//#endregion
export { AdminCityAdminsPage as component };
