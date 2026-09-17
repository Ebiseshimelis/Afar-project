import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as API_ORIGIN } from "./authService-tLH6lGQn.mjs";
import { D as Pencil, K as FileText, Y as Download, b as Search, q as Eye, t as X, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as updatePublication, n as deletePublication, r as getPublications, t as createPublication } from "./publicationService-CDzKJ0s7.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
import { t as getCategories } from "./categoryService-B-NfZuzo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.publications-CNJX6ZNB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyForm = {
	category_id: "",
	titleEn: "",
	titleAm: "",
	descriptionEn: "",
	descriptionAm: "",
	status: "draft",
	published_at: "",
	file: null
};
function getLocalizedText(value) {
	return value?.en || value?.am || "";
}
function formatDate(value) {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
}
function formatFileSize(bytes) {
	if (!bytes) return "—";
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function getFileUrl(path) {
	if (!path) return null;
	if (path.startsWith("http")) return path;
	return `${API_ORIGIN}/storage/${path}`;
}
function PublicationsAdmin() {
	const { can } = useAuth();
	const [publications, setPublications] = (0, import_react.useState)([]);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [viewOpen, setViewOpen] = (0, import_react.useState)(false);
	const [selectedPublication, setSelectedPublication] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	async function loadData() {
		try {
			setLoading(true);
			const [publicationData, categoryData] = await Promise.all([getPublications(), getCategories()]);
			setPublications(publicationData);
			setCategories(categoryData);
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "Failed to load publications.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const filtered = publications.filter((publication) => {
		const title = getLocalizedText(publication.title);
		return !q || title.toLowerCase().includes(q.toLowerCase());
	});
	function openCreate() {
		setEditingId(null);
		setForm(emptyForm);
		setFormOpen(true);
	}
	function openEdit(publication) {
		setEditingId(publication.id);
		setForm({
			category_id: publication.category_id ? String(publication.category_id) : "",
			titleEn: publication.title?.en || "",
			titleAm: publication.title?.am || "",
			descriptionEn: publication.description?.en || "",
			descriptionAm: publication.description?.am || "",
			status: publication.status,
			published_at: publication.published_at ? publication.published_at.slice(0, 16) : "",
			file: null
		});
		setFormOpen(true);
	}
	async function handleSubmit(event) {
		event.preventDefault();
		if (!form.category_id) {
			toast.error("Please select a category.");
			return;
		}
		if (!form.titleEn.trim() && !form.titleAm.trim()) {
			toast.error("Please enter a publication title.");
			return;
		}
		try {
			setSaving(true);
			const data = {
				category_id: Number(form.category_id),
				title: {
					en: form.titleEn,
					am: form.titleAm
				},
				description: {
					en: form.descriptionEn,
					am: form.descriptionAm
				},
				status: form.status,
				published_at: form.published_at || null,
				file: form.file
			};
			if (editingId !== null) {
				await updatePublication(editingId, data);
				toast.success("Publication updated successfully.");
			} else {
				await createPublication(data);
				toast.success("Publication created successfully.");
			}
			setFormOpen(false);
			setForm(emptyForm);
			setEditingId(null);
			await loadData();
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "Failed to save publication.");
		} finally {
			setSaving(false);
		}
	}
	async function handleDelete(publication) {
		const title = getLocalizedText(publication.title) || "this publication";
		if (!window.confirm(`Delete "${title}"?\n\nThis action cannot be undone.`)) return;
		try {
			await deletePublication(publication.id);
			toast.success("Publication deleted successfully.");
			await loadData();
		} catch (error) {
			console.error(error);
			toast.error(error instanceof Error ? error.message : "Failed to delete publication.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Publication Management",
			description: "Upload reports, policies, manuals, and other publications.",
			action: can("publications.create") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: openCreate,
				className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New publication"]
			}) : void 0
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3 border-b p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative max-w-sm flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search publications...",
							className: "h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Title"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Size"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "px-5 py-10 text-center text-muted-foreground",
							children: "Loading publications..."
						}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "px-5 py-10 text-center text-muted-foreground",
							children: q ? "No publications match your search." : "No publications available."
						}) }) : filtered.map((publication) => {
							const category = categories.find((item) => item.id === publication.category_id);
							const fileUrl = getFileUrl(publication.file_path);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-9 w-9 place-items-center rounded-md bg-secondary text-muted-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: getLocalizedText(publication.title) || "Untitled publication"
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-muted-foreground",
										children: category ? getLocalizedText(category.name) : publication.category_id ? `Category ${publication.category_id}` : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-foreground",
											children: publication.file_type || "file"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase " + (publication.status === "published" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"),
											children: publication.status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-muted-foreground",
										children: formatFileSize(publication.file_size)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center gap-1",
											children: [
												can("publications.view") && fileUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: fileUrl,
													target: "_blank",
													rel: "noreferrer",
													"aria-label": "Download",
													title: "Open publication",
													className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
												}),
												can("publications.view") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "View",
													title: "View publication",
													onClick: () => {
														if (fileUrl) window.location.href = fileUrl;
													},
													className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
												}),
												can("publications.update") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "Edit",
													title: "Edit publication",
													onClick: () => openEdit(publication),
													className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
												}),
												can("publications.delete") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "Delete",
													title: "Delete publication",
													onClick: () => handleDelete(publication),
													className: "grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
												})
											]
										})
									})
								]
							}, publication.id);
						}) })]
					})
				}),
				!loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t px-5 py-3 text-xs text-muted-foreground",
					children: [
						"Showing ",
						filtered.length,
						" of",
						" ",
						publications.length,
						" publication",
						publications.length === 1 ? "" : "s"
					]
				})
			]
		}),
		formOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border bg-card shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: editingId !== null ? "Edit Publication" : "Create Publication"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: editingId !== null ? "Update the publication information." : "Upload a new publication."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFormOpen(false),
						disabled: saving,
						className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-5 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-sm font-medium",
								children: "Title (English)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.titleEn,
								onChange: (e) => setForm({
									...form,
									titleEn: e.target.value
								}),
								className: "h-10 w-full rounded-lg border bg-background px-3 text-sm",
								required: true
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-sm font-medium",
								children: "Title (Amharic)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.titleAm,
								onChange: (e) => setForm({
									...form,
									titleAm: e.target.value
								}),
								className: "h-10 w-full rounded-lg border bg-background px-3 text-sm"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-sm font-medium",
								children: "Description (English)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.descriptionEn,
								onChange: (e) => setForm({
									...form,
									descriptionEn: e.target.value
								}),
								rows: 5,
								className: "w-full rounded-lg border bg-background px-3 py-2 text-sm"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-sm font-medium",
								children: "Description (Amharic)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.descriptionAm,
								onChange: (e) => setForm({
									...form,
									descriptionAm: e.target.value
								}),
								rows: 5,
								className: "w-full rounded-lg border bg-background px-3 py-2 text-sm"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-sm font-medium",
								children: "Category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.category_id,
								onChange: (e) => setForm({
									...form,
									category_id: e.target.value
								}),
								className: "h-10 w-full rounded-lg border bg-background px-3 text-sm",
								required: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select category"
								}), categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: category.id,
									children: getLocalizedText(category.name)
								}, category.id))]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-sm font-medium",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.status,
								onChange: (e) => setForm({
									...form,
									status: e.target.value
								}),
								className: "h-10 w-full rounded-lg border bg-background px-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "draft",
									children: "Draft"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "published",
									children: "Published"
								})]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-sm font-medium",
							children: "Published At"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							value: form.published_at,
							onChange: (e) => setForm({
								...form,
								published_at: e.target.value
							}),
							className: "h-10 w-full rounded-lg border bg-background px-3 text-sm"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-sm font-medium",
								children: "Publication File"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp",
								onChange: (e) => setForm({
									...form,
									file: e.target.files?.[0] || null
								}),
								className: "block w-full rounded-lg border bg-background px-3 py-2 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Maximum file size: 2 MB."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-3 border-t pt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setFormOpen(false),
								disabled: saving,
								className: "rounded-lg border px-4 py-2 text-sm hover:bg-secondary disabled:opacity-50",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: saving,
								className: "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50",
								children: saving ? "Saving..." : editingId !== null ? "Update Publication" : "Create Publication"
							})]
						})
					]
				})]
			})
		}),
		viewOpen && selectedPublication && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-card shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Publication Details"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: ["Publication #", selectedPublication.id]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setViewOpen(false),
						className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase text-muted-foreground",
							children: "English Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium",
							children: selectedPublication.title?.en || "—"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase text-muted-foreground",
							children: "Amharic Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium",
							children: selectedPublication.title?.am || "—"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase text-muted-foreground",
								children: "English Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 whitespace-pre-wrap text-sm",
								children: selectedPublication.description?.en || "—"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase text-muted-foreground",
								children: "Amharic Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 whitespace-pre-wrap text-sm",
								children: selectedPublication.description?.am || "—"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 capitalize",
									children: selectedPublication.status
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "File Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 uppercase",
									children: selectedPublication.file_type || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "File Size"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1",
									children: formatFileSize(selectedPublication.file_size)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "Published"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1",
									children: formatDate(selectedPublication.published_at)
								})] })
							]
						}),
						getFileUrl(selectedPublication.file_path) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end border-t pt-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: getFileUrl(selectedPublication.file_path),
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), "Open File"]
							})
						})
					]
				})]
			})
		})
	] });
}
//#endregion
export { PublicationsAdmin as component };
