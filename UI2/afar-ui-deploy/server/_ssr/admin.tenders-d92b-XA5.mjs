import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { C as RefreshCw, D as Pencil, b as Search, q as Eye, t as X, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { a as getTenders, i as getTenderStatus, n as deleteTender, o as updateTender, r as getTender, t as createTender } from "./tenderService-FaLrKaDE.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.tenders-d92b-XA5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getLocalizedText(value) {
	if (!value) return "";
	if (typeof value === "string") return value;
	return value.en || value.am || "";
}
function formatDate(value) {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleDateString();
}
function toDateTimeLocal(value) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
var emptyForm = {
	titleEn: "",
	titleAm: "",
	contentEn: "",
	contentAm: "",
	categoryId: "",
	status: "draft",
	opensAt: "",
	closesAt: "",
	publishedAt: "",
	file: null
};
function TendersAdmin() {
	const { can } = useAuth();
	const [tenders, setTenders] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const [viewOpen, setViewOpen] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [selectedTender, setSelectedTender] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	async function loadTenders() {
		try {
			setLoading(true);
			setError("");
			const data = await getTenders();
			setTenders(Array.isArray(data) ? data : []);
		} catch (err) {
			console.error("Failed to load tenders:", err);
			setError(err instanceof Error ? err.message : "Unable to load tenders from the backend.");
			setTenders([]);
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadTenders();
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		const search = q.trim().toLowerCase();
		if (!search) return tenders;
		return tenders.filter((tender) => {
			const title = getLocalizedText(tender.title).toLowerCase();
			const category = String(tender.category_id ?? "").toLowerCase();
			const status = (tender.status || "").toLowerCase();
			return title.includes(search) || category.includes(search) || status.includes(search) || String(tender.id).includes(search);
		});
	}, [tenders, q]);
	function openCreate() {
		if (!can("tenders.create")) return;
		setMessage("");
		setError("");
		setEditingId(null);
		setForm(emptyForm);
		setFormOpen(true);
	}
	async function openView(id) {
		if (!can("tenders.view")) return;
		try {
			setMessage("");
			setError("");
			const tender = await getTender(id);
			setSelectedTender(tender);
			setViewOpen(true);
		} catch (err) {
			console.error("Failed to load tender:", err);
			setError(err instanceof Error ? err.message : "Unable to load tender details.");
		}
	}
	async function openEdit(id) {
		if (!can("tenders.update")) return;
		try {
			setMessage("");
			setError("");
			const tender = await getTender(id);
			setEditingId(Number(tender.id));
			setForm({
				titleEn: tender.title?.en || "",
				titleAm: tender.title?.am || "",
				contentEn: tender.content?.en || "",
				contentAm: tender.content?.am || "",
				categoryId: tender.category_id != null ? String(tender.category_id) : "",
				status: tender.status === "published" ? "published" : "draft",
				opensAt: toDateTimeLocal(tender.opens_at),
				closesAt: toDateTimeLocal(tender.closes_at),
				publishedAt: toDateTimeLocal(tender.published_at),
				file: null
			});
			setFormOpen(true);
		} catch (err) {
			console.error("Failed to load tender for editing:", err);
			setError(err instanceof Error ? err.message : "Unable to load tender for editing.");
		}
	}
	async function handleSubmit(event) {
		event.preventDefault();
		if (!form.titleEn.trim() && !form.titleAm.trim()) {
			setError("Please enter a tender title.");
			return;
		}
		try {
			setSaving(true);
			setError("");
			setMessage("");
			const payload = {
				category_id: form.categoryId ? Number(form.categoryId) : null,
				title: {
					en: form.titleEn.trim(),
					am: form.titleAm.trim()
				},
				content: {
					en: form.contentEn.trim(),
					am: form.contentAm.trim()
				},
				opens_at: form.opensAt ? form.opensAt : null,
				closes_at: form.closesAt ? form.closesAt : null,
				status: form.status,
				published_at: form.publishedAt ? form.publishedAt : null,
				file: form.file
			};
			if (editingId !== null) {
				await updateTender(editingId, payload);
				setMessage("Tender updated successfully.");
			} else {
				await createTender(payload);
				setMessage("Tender created successfully.");
			}
			setFormOpen(false);
			setEditingId(null);
			setForm(emptyForm);
			await loadTenders();
		} catch (err) {
			console.error("Failed to save tender:", err);
			setError(err instanceof Error ? err.message : "Unable to save tender.");
		} finally {
			setSaving(false);
		}
	}
	async function handleDelete(id) {
		if (!can("tenders.delete")) return;
		const tender = tenders.find((item) => Number(item.id) === id);
		const title = tender ? getLocalizedText(tender.title) : `Tender #${id}`;
		if (!window.confirm(`Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`)) return;
		try {
			setError("");
			setMessage("");
			await deleteTender(id);
			setMessage("Tender deleted successfully.");
			await loadTenders();
		} catch (err) {
			console.error("Failed to delete tender:", err);
			setError(err instanceof Error ? err.message : "Unable to delete tender.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Tender Management",
			description: "Publish and track procurement opportunities.",
			action: can("tenders.create") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: openCreate,
				className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New tender"]
			}) : void 0
		}),
		message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success",
			children: message
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
			children: error
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 border-b p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative max-w-sm flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search tenders...",
							className: "h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: loadTenders,
						disabled: loading,
						className: "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm hover:bg-secondary disabled:opacity-50",
						title: "Refresh tenders",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }), "Refresh"]
					})]
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
									children: "ID"
								}),
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
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Published"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Deadline"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "px-5 py-10 text-center text-muted-foreground",
							children: "Loading tenders..."
						}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "px-5 py-10 text-center text-muted-foreground",
							children: q ? "No tenders match your search." : "No tenders available."
						}) }) : filtered.map((tender) => {
							const status = getTenderStatus(tender);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 font-mono text-xs text-muted-foreground",
										children: tender.id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 font-medium",
										children: getLocalizedText(tender.title) || "Untitled tender"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-muted-foreground",
										children: tender.category_id ? `Category ${tender.category_id}` : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase " + (status === "Open" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"),
											children: status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-muted-foreground",
										children: formatDate(tender.published_at)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-muted-foreground",
										children: formatDate(tender.closes_at)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center gap-1",
											children: [
												can("tenders.view") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "View",
													title: "View tender",
													onClick: () => openView(Number(tender.id)),
													className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
												}),
												can("tenders.update") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "Edit",
													title: "Edit tender",
													onClick: () => openEdit(Number(tender.id)),
													className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
												}),
												can("tenders.delete") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "Delete",
													title: "Delete tender",
													onClick: () => handleDelete(Number(tender.id)),
													className: "grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
												})
											]
										})
									})
								]
							}, tender.id);
						}) })]
					})
				}),
				!loading && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t px-5 py-3 text-xs text-muted-foreground",
					children: [
						"Showing ",
						filtered.length,
						" of",
						" ",
						tenders.length,
						" tender",
						tenders.length === 1 ? "" : "s"
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
						children: editingId !== null ? "Edit Tender" : "Create Tender"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: editingId !== null ? "Update the tender information." : "Add a new procurement opportunity."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFormOpen(false),
						className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
						disabled: saving,
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
								placeholder: "Tender title"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-sm font-medium",
								children: "Title (Amharic)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.titleAm,
								onChange: (e) => setForm({
									...form,
									titleAm: e.target.value
								}),
								className: "h-10 w-full rounded-lg border bg-background px-3 text-sm",
								placeholder: "የጨረታ ርዕስ ያስገቡ"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-sm font-medium",
								children: "Content (English)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.contentEn,
								onChange: (e) => setForm({
									...form,
									contentEn: e.target.value
								}),
								rows: 5,
								className: "w-full rounded-lg border bg-background px-3 py-2 text-sm",
								placeholder: "Tender description"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-sm font-medium",
								children: "Content (Amharic)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.contentAm,
								onChange: (e) => setForm({
									...form,
									contentAm: e.target.value
								}),
								rows: 5,
								className: "w-full rounded-lg border bg-background px-3 py-2 text-sm",
								placeholder: "የጨረታ መግለጫ ያስገቡ"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-dashed p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-sm font-medium",
									children: "Tender Document / Attachment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp",
									onChange: (e) => setForm({
										...form,
										file: e.target.files?.[0] ?? null
									}),
									className: "block w-full text-sm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: "Optional. Accepted: PDF, DOC, DOCX, JPG, JPEG, PNG, WEBP. Maximum 2 MB."
								}),
								form.file && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm",
									children: ["Selected file: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: form.file.name
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-sm font-medium",
								children: "Category ID"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: form.categoryId,
								onChange: (e) => setForm({
									...form,
									categoryId: e.target.value
								}),
								className: "h-10 w-full rounded-lg border bg-background px-3 text-sm",
								placeholder: "Category ID"
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-sm font-medium",
									children: "Opens At"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "datetime-local",
									value: form.opensAt,
									onChange: (e) => setForm({
										...form,
										opensAt: e.target.value
									}),
									className: "h-10 w-full rounded-lg border bg-background px-3 text-sm"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-sm font-medium",
									children: "Closes At"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "datetime-local",
									value: form.closesAt,
									onChange: (e) => setForm({
										...form,
										closesAt: e.target.value
									}),
									className: "h-10 w-full rounded-lg border bg-background px-3 text-sm"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-sm font-medium",
									children: "Published At"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "datetime-local",
									value: form.publishedAt,
									onChange: (e) => setForm({
										...form,
										publishedAt: e.target.value
									}),
									className: "h-10 w-full rounded-lg border bg-background px-3 text-sm"
								})] })
							]
						}),
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
								children: saving ? "Saving..." : editingId !== null ? "Update Tender" : "Create Tender"
							})]
						})
					]
				})]
			})
		}),
		viewOpen && selectedTender && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-card shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Tender Details"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: ["Tender #", selectedTender.id]
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
							children: selectedTender.title?.en || "—"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase text-muted-foreground",
							children: "Amharic Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium",
							children: selectedTender.title?.am || "—"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase text-muted-foreground",
								children: "English Content"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 whitespace-pre-wrap text-sm",
								children: selectedTender.content?.en || "—"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase text-muted-foreground",
								children: "Amharic Content"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 whitespace-pre-wrap text-sm",
								children: selectedTender.content?.am || "—"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1",
									children: selectedTender.category_id ?? "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 capitalize",
									children: getTenderStatus(selectedTender)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "Opens"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1",
									children: formatDate(selectedTender.opens_at)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "Deadline"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1",
									children: formatDate(selectedTender.closes_at)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "Published"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1",
									children: formatDate(selectedTender.published_at)
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end border-t pt-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setViewOpen(false),
								className: "rounded-lg border px-4 py-2 text-sm hover:bg-secondary",
								children: "Close"
							})
						})
					]
				})]
			})
		})
	] });
}
//#endregion
export { TendersAdmin as component };
