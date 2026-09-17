import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { H as Image, L as LoaderCircle, l as Upload, m as SquarePen, n as Video, t as X, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as getMultimedia, n as deleteMultimedia, o as updateMultimedia, r as getMediaUrl, t as createMultimedia } from "./multimediaService-KsWseGkg.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.multimedia-fP-UZrfO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var initialForm = {
	title: "",
	description: "",
	type: "image",
	mediaUrl: "",
	videoUrl: "",
	status: "published",
	file: null
};
function AdminMultimediaPage() {
	const { can } = useAuth();
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editingItem, setEditingItem] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({ ...initialForm });
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		loadMultimedia();
	}, []);
	async function loadMultimedia() {
		try {
			setLoading(true);
			const data = await getMultimedia();
			console.log("Multimedia loaded:", data);
			setItems(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error("Failed to load multimedia:", error);
			toast.error(error instanceof Error ? error.message : "Failed to load multimedia.");
		} finally {
			setLoading(false);
		}
	}
	function openCreateForm() {
		if (!can("multimedia.create")) return;
		setEditingItem(null);
		setForm({ ...initialForm });
		setShowForm(true);
	}
	function openEditForm(item) {
		if (!can("multimedia.update")) return;
		try {
			console.log("Opening multimedia for edit:", item);
			const normalizedType = String(item.type ?? "").toLowerCase() === "video" ? "video" : "image";
			const normalizedStatus = String(item.status ?? "").toLowerCase() === "draft" ? "draft" : "published";
			const filePath = typeof item.filePath === "string" ? item.filePath : "";
			const existingVideoUrl = typeof item.videoUrl === "string" ? item.videoUrl : "";
			let existingMediaUrl = "";
			if (normalizedType === "image" && filePath && /^https?:\/\//i.test(filePath)) existingMediaUrl = filePath;
			const nextForm = {
				title: typeof item.title === "string" ? item.title : "",
				description: typeof item.description === "string" ? item.description : "",
				type: normalizedType,
				mediaUrl: normalizedType === "image" ? existingMediaUrl : "",
				videoUrl: normalizedType === "video" ? existingVideoUrl : "",
				status: normalizedStatus,
				file: null
			};
			console.log("Edit form state:", nextForm);
			setEditingItem(item);
			setForm(nextForm);
			setShowForm(true);
		} catch (error) {
			console.error("Error opening multimedia edit form:", error);
			toast.error("Unable to open this multimedia item for editing.");
		}
	}
	function closeForm() {
		if (saving) return;
		setShowForm(false);
		setEditingItem(null);
		setForm({ ...initialForm });
	}
	function handleFileChange(event) {
		const file = event.target.files?.[0] ?? null;
		setForm((current) => ({
			...current,
			file,
			mediaUrl: "",
			videoUrl: ""
		}));
	}
	function handleTypeChange(type) {
		setForm((current) => ({
			...current,
			type,
			file: null,
			mediaUrl: "",
			videoUrl: ""
		}));
	}
	async function handleSubmit(event) {
		event.preventDefault();
		if (!form.title.trim()) {
			toast.error("Title is required.");
			return;
		}
		if (!editingItem) {
			if (form.type === "image" && !form.file && !form.mediaUrl.trim()) {
				toast.error("Please upload an image or enter an image URL.");
				return;
			}
			if (form.type === "video" && !form.file && !form.videoUrl.trim()) {
				toast.error("Please upload a video or enter a video URL.");
				return;
			}
		}
		try {
			setSaving(true);
			if (editingItem) {
				const updated = await updateMultimedia(editingItem.id, {
					title: form.title.trim(),
					description: form.description.trim(),
					type: form.type,
					status: form.status,
					file: form.file,
					mediaUrl: form.type === "image" ? form.mediaUrl.trim() || void 0 : void 0,
					videoUrl: form.type === "video" ? form.videoUrl.trim() || void 0 : void 0
				});
				setItems((current) => current.map((item) => item.id === updated.id ? updated : item));
				toast.success("Multimedia updated successfully.");
			} else {
				const created = await createMultimedia({
					title: form.title.trim(),
					description: form.description.trim(),
					type: form.type,
					mediaUrl: form.type === "image" ? form.mediaUrl.trim() : void 0,
					videoUrl: form.type === "video" ? form.videoUrl.trim() : void 0,
					status: form.status,
					file: form.file
				});
				setItems((current) => [created, ...current]);
				toast.success("Multimedia created successfully.");
			}
			setShowForm(false);
			setEditingItem(null);
			setForm({ ...initialForm });
			await loadMultimedia();
		} catch (error) {
			console.error("Failed to save multimedia:", error);
			toast.error(error instanceof Error ? error.message : "Failed to save multimedia.");
		} finally {
			setSaving(false);
		}
	}
	async function handleDelete(item) {
		if (!can("multimedia.delete")) return;
		if (!window.confirm(`Are you sure you want to delete "${item.title}"?`)) return;
		try {
			setDeletingId(item.id);
			await deleteMultimedia(item.id);
			setItems((current) => current.filter((existing) => existing.id !== item.id));
			toast.success("Multimedia deleted successfully.");
		} catch (error) {
			console.error("Failed to delete multimedia:", error);
			toast.error(error instanceof Error ? error.message : "Failed to delete multimedia.");
		} finally {
			setDeletingId(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Multimedia",
			description: "Manage images and videos displayed on the public portal.",
			action: can("multimedia.create") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: openCreateForm,
				className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Add Multimedia"]
			}) : void 0
		}),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 rounded-xl border bg-card p-6 shadow-soft",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: editingItem ? "Edit Multimedia" : "Add Multimedia"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: editingItem ? "Update the multimedia information. Leave the file or URL empty to keep the existing media." : "Add an image or video from your computer or by URL."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: closeForm,
					disabled: saving,
					className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "title",
						className: "mb-2 block text-sm font-medium",
						children: "Title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "title",
						type: "text",
						value: form.title,
						onChange: (event) => setForm((current) => ({
							...current,
							title: event.target.value
						})),
						className: "w-full rounded-lg border bg-background px-3 py-2 text-sm",
						placeholder: "Enter title"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "description",
						className: "mb-2 block text-sm font-medium",
						children: "Description"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "description",
						rows: 3,
						value: form.description,
						onChange: (event) => setForm((current) => ({
							...current,
							description: event.target.value
						})),
						className: "w-full rounded-lg border bg-background px-3 py-2 text-sm",
						placeholder: "Enter description"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "mb-2 block text-sm font-medium",
						children: "Type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleTypeChange("image"),
							className: form.type === "image" ? "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground" : "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4" }), "Image"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleTypeChange("video"),
							className: form.type === "video" ? "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground" : "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-4 w-4" }), "Video"]
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "file",
						className: "mb-2 block text-sm font-medium",
						children: form.type === "image" ? "Upload Image" : "Upload Video"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-dashed p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: form.file ? form.file.name : editingItem ? "Choose a new file (optional)" : "Choose a file from your computer"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "file",
							type: "file",
							accept: form.type === "image" ? "image/*" : "video/*",
							onChange: handleFileChange,
							className: "w-full text-sm"
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center text-sm text-muted-foreground",
						children: "— OR —"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "mediaUrl",
							className: "mb-2 block text-sm font-medium",
							children: form.type === "image" ? "Image URL" : "Video URL"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "mediaUrl",
							type: "url",
							value: form.type === "image" ? form.mediaUrl : form.videoUrl,
							onChange: (event) => {
								const value = event.target.value;
								setForm((current) => ({
									...current,
									...current.type === "image" ? {
										mediaUrl: value,
										videoUrl: ""
									} : {
										videoUrl: value,
										mediaUrl: ""
									},
									file: null
								}));
							},
							className: "w-full rounded-lg border bg-background px-3 py-2 text-sm",
							placeholder: form.type === "image" ? "https://example.com/image.jpg" : "https://example.com/video.mp4"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: editingItem ? "Leave empty to keep the current media." : "You can either upload a file from your computer or provide a public URL."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "status",
						className: "mb-2 block text-sm font-medium",
						children: "Status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						id: "status",
						value: form.status,
						onChange: (event) => setForm((current) => ({
							...current,
							status: event.target.value === "draft" ? "draft" : "published"
						})),
						className: "w-full rounded-lg border bg-background px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "published",
							children: "Published"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "draft",
							children: "Draft"
						})]
					})] }),
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
							children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), editingItem ? "Update" : "Create"]
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: "Multimedia Library"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					items.length,
					" item",
					items.length === 1 ? "" : "s"
				]
			})]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card p-10 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-6 w-6 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Loading multimedia..."
			})]
		}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card p-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-4 text-lg font-semibold",
					children: "No multimedia yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Create your first image or video."
				}),
				can("multimedia.create") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: openCreateForm,
					className: "mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Add Multimedia"]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MultimediaCard, {
				item,
				onEdit: () => openEditForm(item),
				onDelete: () => handleDelete(item),
				canEdit: can("multimedia.update"),
				canDelete: can("multimedia.delete"),
				deleting: deletingId === item.id
			}, item.id))
		})
	] });
}
function MultimediaCard({ item, onEdit, onDelete, canEdit, canDelete, deleting }) {
	const normalizedType = String(item.type ?? "").toLowerCase() === "video" ? "video" : "image";
	const imageUrl = typeof item.fileUrl === "string" && item.fileUrl ? item.fileUrl : typeof item.filePath === "string" && item.filePath ? getMediaUrl(item.filePath) : "";
	const videoUrl = typeof item.videoUrl === "string" && item.videoUrl ? item.videoUrl : typeof item.fileUrl === "string" && item.fileUrl ? item.fileUrl : typeof item.filePath === "string" && item.filePath ? getMediaUrl(item.filePath) : "";
	const status = String(item.status ?? "").toLowerCase() === "draft" ? "draft" : "published";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-xl border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-video bg-secondary",
			children: [
				normalizedType === "image" && imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: imageUrl,
					alt: item.title || "Multimedia image",
					className: "h-full w-full object-cover"
				}) : normalizedType === "video" && videoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("video", {
					controls: true,
					className: "h-full w-full object-cover",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", { src: videoUrl }), "Your browser does not support video playback."]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-full place-items-center",
					children: normalizedType === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-12 w-12 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-12 w-12 text-muted-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold",
					children: normalizedType
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold",
					children: status
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold",
					children: item.title || "Untitled"
				}),
				item.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 line-clamp-2 text-sm text-muted-foreground",
					children: item.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex justify-end gap-2 border-t pt-3",
					children: [canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onEdit,
						className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs hover:bg-secondary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-3.5 w-3.5" }), "Edit"]
					}), canDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onDelete,
						disabled: deleting,
						className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-destructive disabled:opacity-50",
						children: [deleting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), "Delete"]
					})]
				})
			]
		})]
	});
}
//#endregion
export { AdminMultimediaPage as component };
