import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as API_ORIGIN } from "./authService-tLH6lGQn.mjs";
import { C as RefreshCw, D as Pencil, b as Search, q as Eye, t as X, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as getNews, n as deleteNews, o as updateNews, r as getAdminNewsById, t as createNews } from "./newsService-CiNVHUG4.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
import { t as getCategories } from "./categoryService-B-NfZuzo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.news-cudGbecu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewsAdmin() {
	const { can } = useAuth();
	const [news, setNews] = (0, import_react.useState)([]);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [loadingEdit, setLoadingEdit] = (0, import_react.useState)(false);
	const [showView, setShowView] = (0, import_react.useState)(false);
	const [viewingNews, setViewingNews] = (0, import_react.useState)(null);
	const [loadingView, setLoadingView] = (0, import_react.useState)(false);
	const [titleEn, setTitleEn] = (0, import_react.useState)("");
	const [titleAm, setTitleAm] = (0, import_react.useState)("");
	const [contentEn, setContentEn] = (0, import_react.useState)("");
	const [contentAm, setContentAm] = (0, import_react.useState)("");
	const [categoryId, setCategoryId] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("published");
	const [publishedAt, setPublishedAt] = (0, import_react.useState)("");
	const [image, setImage] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		loadNews();
		loadCategories();
	}, []);
	async function loadNews() {
		try {
			setLoading(true);
			const data = await getNews();
			setNews(data);
		} catch (error) {
			console.error("Failed to load news:", error);
			toast.error(error instanceof Error ? error.message : "Failed to load news.");
		} finally {
			setLoading(false);
		}
	}
	async function loadCategories() {
		try {
			const data = await getCategories();
			setCategories(data);
		} catch (error) {
			console.error("Failed to load categories:", error);
			toast.error(error instanceof Error ? error.message : "Failed to load categories.");
		}
	}
	async function openViewNews(id) {
		if (!can("news.view")) return;
		try {
			setLoadingView(true);
			setShowView(true);
			setViewingNews(null);
			const item = await getAdminNewsById(id);
			setViewingNews(item);
		} catch (error) {
			console.error("Failed to load news details:", error);
			toast.error(error instanceof Error ? error.message : "Failed to load news details.");
			setShowView(false);
			setViewingNews(null);
		} finally {
			setLoadingView(false);
		}
	}
	function closeViewNews() {
		if (loadingView) return;
		setShowView(false);
		setViewingNews(null);
	}
	function resetForm() {
		setTitleEn("");
		setTitleAm("");
		setContentEn("");
		setContentAm("");
		setCategoryId("");
		setStatus("published");
		setPublishedAt("");
		setImage(null);
		setEditingId(null);
	}
	function openCreateForm() {
		if (!can("news.create")) return;
		resetForm();
		setShowForm(true);
	}
	function closeForm() {
		if (saving) return;
		resetForm();
		setShowForm(false);
	}
	async function handleCreate() {
		if (!validateForm()) return;
		try {
			setSaving(true);
			await createNews({
				titleEn,
				titleAm,
				contentEn,
				contentAm,
				categoryId,
				status,
				publishedAt,
				image
			});
			toast.success("News created successfully.");
			resetForm();
			setShowForm(false);
			await loadNews();
		} catch (error) {
			console.error("Create news failed:", error);
			toast.error(error instanceof Error ? error.message : "Failed to create news.");
		} finally {
			setSaving(false);
		}
	}
	async function openEditForm(id) {
		if (!can("news.update")) return;
		try {
			setLoadingEdit(true);
			setShowForm(true);
			setEditingId(id);
			const item = await getAdminNewsById(id);
			setTitleEn(item.titleEn || "");
			setTitleAm(item.titleAm || "");
			setContentEn(item.contentEn || "");
			setContentAm(item.contentAm || "");
			setCategoryId(item.categoryId || "");
			setStatus(item.status || "published");
			if (item.publishedAt) {
				const date = new Date(item.publishedAt);
				if (!Number.isNaN(date.getTime())) {
					const local = (/* @__PURE__ */ new Date(date.getTime() - date.getTimezoneOffset() * 6e4)).toISOString().slice(0, 16);
					setPublishedAt(local);
				} else setPublishedAt(item.publishedAt.slice(0, 16));
			} else setPublishedAt("");
			setImage(null);
		} catch (error) {
			console.error("Failed to load news for editing:", error);
			toast.error(error instanceof Error ? error.message : "Failed to load article.");
			resetForm();
			setShowForm(false);
		} finally {
			setLoadingEdit(false);
		}
	}
	async function handleUpdate() {
		if (!editingId) {
			toast.error("No article selected.");
			return;
		}
		if (!validateForm()) return;
		try {
			setSaving(true);
			await updateNews({
				id: editingId,
				titleEn,
				titleAm,
				contentEn,
				contentAm,
				categoryId,
				status,
				publishedAt,
				image
			});
			toast.success("News updated successfully.");
			resetForm();
			setShowForm(false);
			await loadNews();
		} catch (error) {
			console.error("Update news failed:", error);
			toast.error(error instanceof Error ? error.message : "Failed to update news.");
		} finally {
			setSaving(false);
		}
	}
	async function handleDelete(id) {
		if (!can("news.delete")) return;
		if (!window.confirm("Are you sure you want to delete this news article?")) return;
		try {
			await deleteNews(id);
			toast.success("News deleted successfully.");
			setNews((current) => current.filter((item) => String(item.id) !== String(id)));
		} catch (error) {
			console.error("Delete news failed:", error);
			toast.error(error instanceof Error ? error.message : "Failed to delete news.");
		}
	}
	function validateForm() {
		if (!titleEn.trim()) {
			toast.error("Please enter the English title.");
			return false;
		}
		if (!titleAm.trim()) {
			toast.error("Please enter the Amharic title.");
			return false;
		}
		if (!contentEn.trim()) {
			toast.error("Please enter the English content.");
			return false;
		}
		if (!contentAm.trim()) {
			toast.error("Please enter the Amharic content.");
			return false;
		}
		if (!categoryId) {
			toast.error("Please select a category.");
			return false;
		}
		return true;
	}
	const filtered = (0, import_react.useMemo)(() => {
		const search = q.trim().toLowerCase();
		if (!search) return news;
		return news.filter((n) => String(n.title || "").toLowerCase().includes(search) || String(n.category || "").toLowerCase().includes(search));
	}, [news, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "News Management",
			description: "Create, edit, and publish news articles.",
			action: can("news.create") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: openCreateForm,
				className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New article"]
			}) : void 0
		}),
		showView && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4",
			onMouseDown: (event) => {
				if (event.target === event.currentTarget) closeViewNews();
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-background shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "News Details"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "View the complete news article."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: closeViewNews,
						disabled: loadingView,
						"aria-label": "Close",
						className: "rounded-md p-2 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}), loadingView ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-10 text-center text-sm text-muted-foreground",
					children: "Loading article details..."
				}) : viewingNews ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[calc(90vh-90px)] overflow-y-auto p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							viewingNews.imagePath && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-hidden rounded-xl border bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: String(viewingNews.imagePath).startsWith("news/") ? `${API_ORIGIN}/storage/${String(viewingNews.imagePath)}` : `/${String(viewingNews.imagePath).replace(/^\/+/, "")}`,
									alt: viewingNews.titleEn || "News image",
									className: "max-h-[360px] w-full object-cover"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "English Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-2xl font-bold leading-tight",
								children: viewingNews.titleEn || "Untitled News"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Amharic Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xl font-semibold leading-relaxed",
								children: viewingNews.titleAm || "—"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 rounded-xl border bg-secondary/40 p-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-medium",
										children: categories.find((category) => String(category.id) === String(viewingNews.categoryId))?.name?.en || "Uncategorized"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-medium capitalize",
										children: viewingNews.status || "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Published"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-medium",
										children: viewingNews.publishedAt ? new Date(viewingNews.publishedAt).toLocaleString() : "—"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Article ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-medium",
										children: viewingNews.id || "—"
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "English Content"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border bg-background p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "whitespace-pre-wrap text-sm leading-7",
									children: viewingNews.contentEn || "No English content available."
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Amharic Content"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border bg-background p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "whitespace-pre-wrap text-sm leading-8",
									children: viewingNews.contentAm || "ይዘቱ አልተገኘም"
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end border-t pt-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: closeViewNews,
									className: "rounded-lg border px-4 py-2 text-sm hover:bg-secondary",
									children: "Close"
								})
							})
						]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-10 text-center text-sm text-muted-foreground",
					children: "Unable to load this article."
				})]
			})
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-background shadow-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: editingId ? "Edit News Article" : "Create News Article"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: editingId ? "Update this news article." : "Add a new news article to the portal."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: closeForm,
						disabled: saving,
						className: "rounded-md p-2 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}), loadingEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-10 text-center text-sm text-muted-foreground",
					children: "Loading article..."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-2 block text-sm font-medium",
							children: "Title - English"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: titleEn,
							onChange: (e) => setTitleEn(e.target.value),
							placeholder: "Enter English title",
							disabled: saving,
							className: "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-2 block text-sm font-medium",
							children: "Title - Amharic"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: titleAm,
							onChange: (e) => setTitleAm(e.target.value),
							placeholder: "የዜናውን ርዕስ ያስገቡ",
							disabled: saving,
							className: "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-2 block text-sm font-medium",
							children: "Content - English"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: contentEn,
							onChange: (e) => setContentEn(e.target.value),
							placeholder: "Enter news content",
							rows: 5,
							disabled: saving,
							className: "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-2 block text-sm font-medium",
							children: "Content - Amharic"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: contentAm,
							onChange: (e) => setContentAm(e.target.value),
							placeholder: "ይዘቱን ያስገቡ",
							rows: 5,
							disabled: saving,
							className: "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-medium",
								children: "Category"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: categoryId,
								onChange: (e) => setCategoryId(e.target.value),
								disabled: saving || categories.length === 0,
								className: "w-full cursor-pointer rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select category"
								}), categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: String(category.id),
									children: category.name.en
								}, category.id))]
							}),
							categories.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-destructive",
								children: "No categories loaded."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-5 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-medium",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: status,
								onChange: (e) => setStatus(e.target.value),
								disabled: saving,
								className: "w-full cursor-pointer rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "published",
									children: "Published"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "draft",
									children: "Draft"
								})]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-medium",
								children: "Published Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "datetime-local",
								value: publishedAt,
								onChange: (e) => {
									setPublishedAt(e.target.value);
								},
								disabled: saving,
								className: "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-medium",
								children: "News Image"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								onChange: (e) => setImage(e.target.files?.[0] ?? null),
								disabled: saving,
								className: "w-full rounded-lg border bg-background px-3 py-2 text-sm disabled:opacity-50"
							}),
							image && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [
									"New image selected:",
									" ",
									image.name
								]
							}),
							editingId && !image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "Existing image will be kept unless you select a new image."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-3 border-t pt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: closeForm,
								disabled: saving,
								className: "rounded-lg border px-4 py-2 text-sm hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: editingId ? handleUpdate : handleCreate,
								disabled: saving || loadingEdit || categories.length === 0,
								className: "inline-flex min-w-[130px] items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50",
								children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }), editingId ? "Updating..." : "Creating..."] }) : editingId ? "Update News" : "Create News"
							})]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card shadow-soft",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-sm flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search articles...",
						className: "h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: loadNews,
					disabled: loading,
					className: "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }), "Refresh"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "Loading news..."
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "No news articles found."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
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
								children: "Author"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: n.image,
										alt: "",
										className: "h-9 w-9 rounded object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "line-clamp-1 font-medium",
										children: n.title
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-foreground",
									children: n.category || "Uncategorized"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-muted-foreground",
								children: n.author || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-muted-foreground",
								children: n.date ? new Date(n.date).toLocaleDateString() : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-1",
									children: [
										can("news.view") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "View news",
											title: "View news details",
											onClick: () => openViewNews(String(n.id)),
											className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
										}),
										can("news.update") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Edit",
											title: "Edit news",
											onClick: () => openEditForm(String(n.id)),
											className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
										}),
										can("news.delete") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Delete",
											title: "Delete news",
											onClick: () => handleDelete(String(n.id)),
											className: "grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})
									]
								})
							})
						]
					}, n.id)) })]
				})
			})]
		})
	] });
}
//#endregion
export { NewsAdmin as component };
