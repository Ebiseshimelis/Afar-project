import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { D as Pencil, L as LoaderCircle, b as Search, t as X, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { a as updateVacancy, n as deleteVacancy, r as getVacancies, t as createVacancy } from "./vacancyService-Da2NxTO3.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.vacancies-Bq3pABXE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VacanciesAdmin() {
	const { can } = useAuth();
	const [vacancies, setVacancies] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [titleEn, setTitleEn] = (0, import_react.useState)("");
	const [titleAm, setTitleAm] = (0, import_react.useState)("");
	const [contentEn, setContentEn] = (0, import_react.useState)("");
	const [contentAm, setContentAm] = (0, import_react.useState)("");
	const [categoryId, setCategoryId] = (0, import_react.useState)("1");
	const [deadline, setDeadline] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("published");
	const [publishedAt, setPublishedAt] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	async function loadVacancies() {
		try {
			setLoading(true);
			setError("");
			const data = await getVacancies(true);
			setVacancies(data);
		} catch (err) {
			console.error(err);
			setError(err instanceof Error ? err.message : "Failed to load vacancies.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadVacancies();
	}, []);
	function resetForm() {
		setEditingId(null);
		setTitleEn("");
		setTitleAm("");
		setContentEn("");
		setContentAm("");
		setCategoryId("1");
		setDeadline("");
		setStatus("published");
		setPublishedAt("");
		setFile(null);
	}
	function openCreateForm() {
		if (!can("vacancies.create")) return;
		resetForm();
		setShowForm(true);
		setError("");
	}
	function openEditForm(vacancy) {
		if (!can("vacancies.update")) return;
		setEditingId(vacancy.id);
		setTitleEn(vacancy.title?.en ?? "");
		setTitleAm(vacancy.title?.am ?? "");
		setContentEn(vacancy.content?.en ?? "");
		setContentAm(vacancy.content?.am ?? "");
		setCategoryId(vacancy.category_id ? String(vacancy.category_id) : "1");
		setDeadline(vacancy.deadline ? vacancy.deadline.substring(0, 10) : "");
		setStatus(vacancy.status);
		setPublishedAt(vacancy.published_at ? vacancy.published_at.substring(0, 16) : "");
		setFile(null);
		setShowForm(true);
		setError("");
	}
	function closeForm() {
		if (saving) return;
		setShowForm(false);
		resetForm();
	}
	async function handleSubmit(event) {
		event.preventDefault();
		if (!titleEn.trim()) {
			setError("English title is required.");
			return;
		}
		if (!contentEn.trim()) {
			setError("English content is required.");
			return;
		}
		const parsedCategoryId = Number(categoryId);
		if (!parsedCategoryId) {
			setError("Category ID is required.");
			return;
		}
		try {
			setSaving(true);
			setError("");
			const data = {
				category_id: parsedCategoryId,
				title: {
					en: titleEn.trim(),
					am: titleAm.trim()
				},
				content: {
					en: contentEn.trim(),
					am: contentAm.trim()
				},
				deadline: deadline ? (/* @__PURE__ */ new Date(`${deadline}T23:59:59`)).toISOString() : null,
				status,
				published_at: publishedAt ? new Date(publishedAt).toISOString() : status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null,
				file
			};
			if (editingId !== null) await updateVacancy(editingId, data);
			else await createVacancy(data);
			await loadVacancies();
			setShowForm(false);
			resetForm();
		} catch (err) {
			console.error(err);
			setError(err instanceof Error ? err.message : "Failed to save vacancy.");
		} finally {
			setSaving(false);
		}
	}
	async function handleDelete(id) {
		if (!can("vacancies.delete")) return;
		if (!window.confirm("Are you sure you want to delete this vacancy?")) return;
		try {
			setError("");
			await deleteVacancy(id);
			await loadVacancies();
		} catch (err) {
			console.error(err);
			setError(err instanceof Error ? err.message : "Failed to delete vacancy.");
		}
	}
	const filtered = (0, import_react.useMemo)(() => {
		const search = q.trim().toLowerCase();
		if (!search) return vacancies;
		return vacancies.filter((v) => {
			return (v.title?.en ?? v.title?.am ?? "").toLowerCase().includes(search);
		});
	}, [vacancies, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Vacancy Management",
			description: "Post and manage job openings.",
			action: can("vacancies.create") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: openCreateForm,
				className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New vacancy"]
			}) : void 0
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive",
			children: error
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border bg-card p-6 shadow-soft",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: editingId !== null ? "Edit Vacancy" : "Create Vacancy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: editingId !== null ? "Update the vacancy information." : "Add a new vacancy to the portal."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: closeForm,
					className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-sm font-medium",
							children: "English Title *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: titleEn,
							onChange: (e) => setTitleEn(e.target.value),
							className: "h-10 w-full rounded-lg border bg-background px-3 text-sm",
							placeholder: "Senior Urban Planner",
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-sm font-medium",
							children: "Amharic Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: titleAm,
							onChange: (e) => setTitleAm(e.target.value),
							className: "h-10 w-full rounded-lg border bg-background px-3 text-sm",
							placeholder: "የሥራ መደቡን ርዕስ ያስገቡ"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-sm font-medium",
							children: "English Content *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: contentEn,
							onChange: (e) => setContentEn(e.target.value),
							className: "min-h-32 w-full rounded-lg border bg-background p-3 text-sm",
							placeholder: "Describe the vacancy...",
							required: true
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-sm font-medium",
							children: "Amharic Content"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: contentAm,
							onChange: (e) => setContentAm(e.target.value),
							className: "min-h-32 w-full rounded-lg border bg-background p-3 text-sm",
							placeholder: "የሥራ መደቡን መግለጫ ያስገቡ..."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-sm font-medium",
									children: "Category ID *"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: "1",
									value: categoryId,
									onChange: (e) => setCategoryId(e.target.value),
									className: "h-10 w-full rounded-lg border bg-background px-3 text-sm",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "We will connect this to the category dropdown later."
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-sm font-medium",
								children: "Deadline"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: deadline,
								onChange: (e) => setDeadline(e.target.value),
								className: "h-10 w-full rounded-lg border bg-background px-3 text-sm"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1 block text-sm font-medium",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: status,
								onChange: (e) => setStatus(e.target.value),
								className: "h-10 w-full rounded-lg border bg-background px-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "published",
									children: "Published"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "draft",
									children: "Draft"
								})]
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-sm font-medium",
							children: "Published At"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							value: publishedAt,
							onChange: (e) => setPublishedAt(e.target.value),
							className: "h-10 w-full rounded-lg border bg-background px-3 text-sm"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1 block text-sm font-medium",
							children: "Attachment"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							onChange: (e) => setFile(e.target.files?.[0] ?? null),
							className: "block w-full rounded-lg border bg-background px-3 py-2 text-sm"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-3 border-t pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: closeForm,
							disabled: saving,
							className: "rounded-lg border px-4 py-2 text-sm hover:bg-secondary",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: saving,
							className: "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50",
							children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), editingId !== null ? "Update Vacancy" : "Create Vacancy"]
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card shadow-soft",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-3 border-b p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-sm flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search vacancies...",
						className: "h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2"
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
								children: "Status"
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
						colSpan: 5,
						className: "px-5 py-10 text-center text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto mb-2 h-5 w-5 animate-spin" }), "Loading vacancies..."]
					}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "px-5 py-10 text-center text-muted-foreground",
						children: "No vacancies found."
					}) }) : filtered.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 font-medium",
								children: v.title?.en || v.title?.am || "Untitled vacancy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-muted-foreground",
								children: v.category_id ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-accent px-2 py-1 text-[10px] font-semibold uppercase text-accent-foreground",
									children: v.status
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-muted-foreground",
								children: v.deadline ? new Date(v.deadline).toLocaleDateString() : "No deadline"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-1",
									children: [can("vacancies.update") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Edit",
										onClick: () => openEditForm(v),
										className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
									}), can("vacancies.delete") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Delete",
										onClick: () => handleDelete(v.id),
										className: "grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								})
							})
						]
					}, v.id)) })]
				})
			})]
		})
	] });
}
//#endregion
export { VacanciesAdmin as component };
