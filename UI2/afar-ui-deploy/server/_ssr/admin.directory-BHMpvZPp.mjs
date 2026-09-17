import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as updateDirectorate, i as getDirectorates, n as deleteDirectorate, t as createDirectorate } from "./directorateService-DPp5QHcB.mjs";
import { D as Pencil, E as Phone, M as Mail, b as Search, l as Upload, t as X, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.directory-BHMpvZPp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyForm = {
	name: "",
	nameAm: "",
	description: "",
	descriptionAm: "",
	headName: "",
	headNameAm: "",
	headTitle: "",
	headTitleAm: "",
	email: "",
	phone: "",
	sortOrder: 0,
	photo: null,
	background: null
};
function DirectoryAdmin() {
	const { can } = useAuth();
	const [directorates, setDirectorates] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [editingDirectorate, setEditingDirectorate] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	async function loadDirectorates() {
		try {
			setLoading(true);
			setError("");
			const data = await getDirectorates();
			setDirectorates(data);
		} catch (err) {
			console.error(err);
			setError(err instanceof Error ? err.message : "Failed to load directorates.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadDirectorates();
	}, []);
	function openCreateModal() {
		setEditingDirectorate(null);
		setForm({
			...emptyForm,
			sortOrder: directorates.length + 1
		});
		setModalOpen(true);
	}
	function openEditModal(directorate) {
		setEditingDirectorate(directorate);
		setForm({
			name: directorate.name,
			nameAm: directorate.nameAm,
			description: directorate.description,
			descriptionAm: directorate.descriptionAm,
			headName: directorate.headName,
			headNameAm: directorate.headNameAm,
			headTitle: directorate.headTitle,
			headTitleAm: directorate.headTitleAm,
			email: directorate.email,
			phone: directorate.phone,
			sortOrder: directorate.sortOrder,
			photo: null,
			background: null
		});
		setModalOpen(true);
	}
	function closeModal() {
		if (saving) return;
		setModalOpen(false);
		setEditingDirectorate(null);
		setForm(emptyForm);
	}
	function updateField(field, value) {
		setForm((current) => ({
			...current,
			[field]: value
		}));
	}
	async function handleSubmit(event) {
		event.preventDefault();
		if (!form.name.trim()) {
			toast.error("English directorate name is required.");
			return;
		}
		try {
			setSaving(true);
			if (editingDirectorate) {
				await updateDirectorate(editingDirectorate.id, form);
				toast.success("Directorate updated successfully.");
			} else {
				await createDirectorate(form);
				toast.success("Directorate created successfully.");
			}
			closeModal();
			await loadDirectorates();
		} catch (err) {
			console.error(err);
			toast.error(err instanceof Error ? err.message : "Failed to save directorate.");
		} finally {
			setSaving(false);
		}
	}
	async function handleDelete(directorate) {
		if (!window.confirm(`Are you sure you want to delete "${directorate.name}"?`)) return;
		try {
			setDeletingId(directorate.id);
			await deleteDirectorate(directorate.id);
			toast.success("Directorate deleted successfully.");
			await loadDirectorates();
		} catch (err) {
			console.error(err);
			toast.error(err instanceof Error ? err.message : "Failed to delete directorate.");
		} finally {
			setDeletingId(null);
		}
	}
	const filtered = directorates.filter((directorate) => {
		const search = q.toLowerCase().trim();
		if (!search) return true;
		return directorate.name.toLowerCase().includes(search) || directorate.nameAm.toLowerCase().includes(search) || directorate.headName.toLowerCase().includes(search) || directorate.headNameAm.toLowerCase().includes(search);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Directorate Management",
			description: "Manage the bureau's directorates, directors, contact information, and organizational details.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: openCreateModal,
				className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New Directorate"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3 border-b p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search directorates...",
							className: "h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground",
						children: loading ? "Loading..." : `${filtered.length} directorate${filtered.length === 1 ? "" : "s"}`
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "m-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "Unable to load directorates"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: loadDirectorates,
							className: "mt-3 rounded-md border px-3 py-1.5 text-xs",
							children: "Try Again"
						})
					]
				}),
				loading && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "Loading directorates..."
				}),
				!loading && !error && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "No directorates found"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Try changing your search or create a new directorate."
					})]
				}),
				!loading && !error && filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
									children: "Director"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Contact"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Order"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((directorate) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "max-w-md",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: directorate.name
										}), directorate.nameAm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-xs text-muted-foreground",
											children: directorate.nameAm
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: directorate.photo,
											alt: directorate.headName,
											loading: "lazy",
											className: "h-9 w-9 rounded-full object-cover ring-1 ring-border",
											onError: (e) => {
												e.currentTarget.src = "/land.jpg";
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: directorate.headName || "—"
											}),
											directorate.headNameAm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: directorate.headNameAm
											}),
											directorate.headTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: directorate.headTitle
											})
										] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-5 py-4 text-xs text-muted-foreground",
									children: [
										directorate.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5" }), directorate.phone]
										}),
										directorate.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }), directorate.email]
										}),
										!directorate.phone && !directorate.email && "—"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground",
										children: directorate.sortOrder
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-4 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1",
										children: [can("directorates.update") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": `Edit ${directorate.name}`,
											title: "Edit Directorate",
											onClick: () => openEditModal(directorate),
											className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
										}), can("directorates.delete") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": `Delete ${directorate.name}`,
											title: "Delete Directorate",
											disabled: deletingId === directorate.id,
											onClick: () => handleDelete(directorate),
											className: "grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10 disabled:opacity-50",
											children: deletingId === directorate.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs",
												children: "..."
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									})
								})
							]
						}, directorate.id)) })]
					})
				})
			]
		}),
		modalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border bg-card shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky top-0 z-10 flex items-center justify-between border-b bg-card px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: editingDirectorate ? "Edit Directorate" : "New Directorate"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: editingDirectorate ? "Update the directorate information." : "Add a new directorate to the bureau."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: closeModal,
						disabled: saving,
						className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-6 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 font-medium",
							children: "Directorate Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								label: "Name (English)",
								required: true,
								value: form.name,
								onChange: (value) => updateField("name", value)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								label: "Name (Amharic)",
								value: form.nameAm,
								onChange: (value) => updateField("nameAm", value)
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 font-medium",
							children: "Description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormTextarea, {
								label: "Description (English)",
								value: form.description,
								onChange: (value) => updateField("description", value)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormTextarea, {
								label: "Description (Amharic)",
								value: form.descriptionAm,
								onChange: (value) => updateField("descriptionAm", value)
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 font-medium",
							children: "Director Information"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Director Name (English)",
									value: form.headName,
									onChange: (value) => updateField("headName", value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Director Name (Amharic)",
									value: form.headNameAm,
									onChange: (value) => updateField("headNameAm", value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Director Title (English)",
									value: form.headTitle,
									onChange: (value) => updateField("headTitle", value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Director Title (Amharic)",
									value: form.headTitleAm,
									onChange: (value) => updateField("headTitleAm", value)
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 font-medium",
							children: "Contact Information"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Email",
									type: "email",
									value: form.email,
									onChange: (value) => updateField("email", value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Phone",
									value: form.phone,
									onChange: (value) => updateField("phone", value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Sort Order",
									type: "number",
									value: String(form.sortOrder),
									onChange: (value) => updateField("sortOrder", Number(value))
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 font-medium",
								children: "Director Photo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4 hover:bg-secondary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: "Choose photo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "JPG, PNG or WebP. Maximum 2 MB."
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: (event) => {
											updateField("photo", event.target.files?.[0] || null);
										}
									})
								]
							}),
							form.photo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: ["Selected: ", form.photo.name]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-3 font-medium",
								children: "Directorate Background Image"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4 hover:bg-secondary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: "Choose background image"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "JPG, PNG or WebP. Maximum 5 MB."
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: (event) => {
											updateField("background", event.target.files?.[0] || null);
										}
									})
								]
							}),
							form.background && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: ["Selected: ", form.background.name]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-3 border-t pt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: closeModal,
								disabled: saving,
								className: "rounded-lg border px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-50",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: saving,
								className: "rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50",
								children: saving ? "Saving..." : editingDirectorate ? "Update Directorate" : "Create Directorate"
							})]
						})
					]
				})]
			})
		})
	] });
}
function FormField({ label, value, onChange, required = false, type = "text" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1.5 block text-sm font-medium",
			children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-1 text-destructive",
				children: "*"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type,
			required,
			value,
			onChange: (e) => onChange(e.target.value),
			className: "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
		})]
	});
}
function FormTextarea({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1.5 block text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			value,
			onChange: (e) => onChange(e.target.value),
			rows: 4,
			className: "w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
		})]
	});
}
//#endregion
export { DirectoryAdmin as component };
