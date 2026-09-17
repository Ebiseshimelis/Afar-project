import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { H as Image, L as LoaderCircle, l as Upload, m as SquarePen, t as X, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as updatePortfolio, n as deletePortfolio, r as getPortfolios, t as createPortfolio } from "./portfolioService-BEMgj0ue.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.portfolio-CjTfOfM8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyForm = {
	title: "",
	order: "0",
	content: "",
	image: null
};
function AdminPortfolio() {
	const { can } = useAuth();
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	async function load() {
		try {
			setLoading(true);
			setItems(await getPortfolios());
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to load portfolio items.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	function openCreate() {
		setEditing(null);
		setForm(emptyForm);
		setShowForm(true);
	}
	function openEdit(item) {
		setEditing(item);
		setForm({
			title: item.title,
			order: String(item.order),
			content: item.content,
			image: null
		});
		setShowForm(true);
	}
	function closeForm() {
		if (!saving) {
			setEditing(null);
			setForm(emptyForm);
			setShowForm(false);
		}
	}
	async function submit(event) {
		event.preventDefault();
		if (editing && !can("portfolios.update")) return;
		if (!editing && !can("portfolios.create")) return;
		if (!editing && !form.image) {
			toast.error("Please choose an image.");
			return;
		}
		const order = Number(form.order);
		if (!Number.isInteger(order) || order < 0) {
			toast.error("Order must be a whole number of zero or more.");
			return;
		}
		try {
			setSaving(true);
			const payload = {
				title: form.title,
				order,
				content: form.content,
				image: form.image
			};
			if (editing) await updatePortfolio(editing.id, payload);
			else await createPortfolio(payload);
			toast.success(editing ? "Portfolio item updated." : "Portfolio item created.");
			closeForm();
			await load();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to save portfolio item.");
		} finally {
			setSaving(false);
		}
	}
	async function remove(item) {
		if (!window.confirm(`Delete ΓÇ£${item.title}ΓÇ¥?`)) return;
		try {
			setDeletingId(item.id);
			await deletePortfolio(item.id);
			setItems((current) => current.filter((entry) => entry.id !== item.id));
			toast.success("Portfolio item deleted.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to delete portfolio item.");
		} finally {
			setDeletingId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Portfolio",
			description: "Manage the project and milestone items shown on the public home page.",
			action: can("portfolios.create") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: openCreate,
				className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Portfolio"]
			}) : void 0
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 rounded-xl border bg-card p-6 shadow-soft",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: editing ? "Edit Portfolio" : "Add Portfolio"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Set the title, order, image, and content."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: closeForm,
					disabled: saving,
					className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (event) => void submit(event),
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 md:grid-cols-[1fr_180px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Title",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								value: form.title,
								onChange: (event) => setForm({
									...form,
									title: event.target.value
								}),
								className: "w-full rounded-lg border bg-background px-3 py-2 text-sm"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Order",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								min: "0",
								step: "1",
								type: "number",
								value: form.order,
								onChange: (event) => setForm({
									...form,
									order: event.target.value
								}),
								className: "w-full rounded-lg border bg-background px-3 py-2 text-sm"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Content",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							required: true,
							rows: 5,
							value: form.content,
							onChange: (event) => setForm({
								...form,
								content: event.target.value
							}),
							className: "w-full rounded-lg border bg-background px-3 py-2 text-sm"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: editing ? "Replace Image (optional)" : "Image",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-dashed p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-center gap-2 text-sm font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
									" ",
									form.image?.name || "Choose image",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										required: !editing,
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: (event) => setForm({
											...form,
											image: event.target.files?.[0] ?? null
										})
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-3 border-t pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: closeForm,
							disabled: saving,
							className: "rounded-lg border px-4 py-2 text-sm",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: saving,
							className: "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm text-primary-foreground disabled:opacity-50",
							children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), editing ? "Update" : "Create"]
						})]
					})
				]
			})]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card p-10 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-6 w-6 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Loading portfolio..."
			})]
		}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-4 text-lg font-semibold",
					children: "No portfolio items yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Add the first portfolio item to show it on the home page."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "overflow-hidden rounded-xl border bg-card shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[4/3] bg-secondary",
					children: item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.imageUrl,
						alt: item.title,
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-10 w-10 text-muted-foreground" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-medium text-muted-foreground",
							children: ["Order ", item.order]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-semibold",
							children: item.title
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [can("portfolios.update") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => openEdit(item),
								className: "rounded p-2 hover:bg-secondary",
								"aria-label": `Edit ${item.title}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-4 w-4" })
							}), can("portfolios.delete") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void remove(item),
								disabled: deletingId === item.id,
								className: "rounded p-2 text-destructive hover:bg-destructive/10",
								"aria-label": `Delete ${item.title}`,
								children: deletingId === item.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 line-clamp-3 text-sm text-muted-foreground",
						children: item.content
					})]
				})]
			}, item.id))
		})
	] });
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-2 block text-sm font-medium",
			children: label
		}), children]
	});
}
//#endregion
export { AdminPortfolio as component };
