import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { D as Pencil, b as Search, it as Calendar, j as MapPin, q as Eye, t as X, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as updateEvent, i as getEvents, n as deleteEvent, r as getEvent, t as createEvent } from "./eventService-CgJ8Pe9J.mjs";
import { n as useAuth } from "./auth-BBdKdqLv.mjs";
import { n as AdminPageHeader, t as AdminLayout } from "./AdminLayout-C1K9j-HA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.events-Dv__2RoB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyForm = {
	titleEn: "",
	titleAm: "",
	contentEn: "",
	contentAm: "",
	categoryId: "",
	status: "draft",
	location: "",
	startAt: "",
	endAt: "",
	image: null
};
function EventsAdmin() {
	const { can } = useAuth();
	const [events, setEvents] = (0, import_react.useState)([]);
	const [q, setQ] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const [viewOpen, setViewOpen] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [selectedEvent, setSelectedEvent] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({ ...emptyForm });
	async function loadEvents() {
		try {
			setLoading(true);
			setError("");
			const data = await getEvents();
			setEvents(data);
		} catch (err) {
			console.error("Failed to load events:", err);
			setError(err instanceof Error ? err.message : "Unable to load events.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		loadEvents();
	}, []);
	const filtered = (0, import_react.useMemo)(() => {
		const search = q.trim().toLowerCase();
		if (!search) return events;
		return events.filter((event) => {
			const titleEn = event.title?.en ?? "";
			const titleAm = event.title?.am ?? "";
			const location = event.location ?? "";
			return titleEn.toLowerCase().includes(search) || titleAm.toLowerCase().includes(search) || location.toLowerCase().includes(search);
		});
	}, [events, q]);
	function openCreate() {
		if (!can("events.create")) return;
		setEditingId(null);
		setForm({ ...emptyForm });
		setFormOpen(true);
	}
	async function openEdit(id) {
		if (!can("events.update")) return;
		try {
			setSaving(true);
			const event = await getEvent(id);
			setEditingId(event.id);
			setForm({
				titleEn: event.title?.en ?? "",
				titleAm: event.title?.am ?? "",
				contentEn: event.content?.en ?? "",
				contentAm: event.content?.am ?? "",
				categoryId: event.category_id ? String(event.category_id) : "",
				status: event.status ?? "draft",
				location: event.location ?? "",
				startAt: toDateTimeLocal(event.start_at),
				endAt: toDateTimeLocal(event.end_at),
				image: null
			});
			setFormOpen(true);
		} catch (err) {
			console.error("Failed to load event:", err);
			toast.error(err instanceof Error ? err.message : "Unable to load event.");
		} finally {
			setSaving(false);
		}
	}
	async function openView(id) {
		if (!can("events.view")) return;
		try {
			const event = await getEvent(id);
			setSelectedEvent(event);
			setViewOpen(true);
		} catch (err) {
			console.error("Failed to load event:", err);
			toast.error(err instanceof Error ? err.message : "Unable to load event.");
		}
	}
	async function handleDelete(id) {
		if (!can("events.delete")) return;
		if (!window.confirm("Are you sure you want to delete this event?")) return;
		try {
			setSaving(true);
			await deleteEvent(id);
			toast.success("Event deleted successfully.");
			await loadEvents();
		} catch (err) {
			console.error("Failed to delete event:", err);
			toast.error(err instanceof Error ? err.message : "Unable to delete event.");
		} finally {
			setSaving(false);
		}
	}
	async function handleSubmit(e) {
		e.preventDefault();
		if (!form.titleEn.trim()) {
			toast.error("Please enter the English title.");
			return;
		}
		if (!form.contentEn.trim()) {
			toast.error("Please enter the English content.");
			return;
		}
		if (!form.categoryId) {
			toast.error("Please enter the category ID.");
			return;
		}
		if (!form.startAt) {
			toast.error("Please select the start date.");
			return;
		}
		if (!form.endAt) {
			toast.error("Please select the end date.");
			return;
		}
		const categoryId = Number(form.categoryId);
		if (Number.isNaN(categoryId) || categoryId <= 0) {
			toast.error("Category ID must be a valid number.");
			return;
		}
		if (new Date(form.endAt) <= new Date(form.startAt)) {
			toast.error("End date must be after start date.");
			return;
		}
		try {
			setSaving(true);
			const payload = {
				category_id: categoryId,
				title: {
					en: form.titleEn,
					am: form.titleAm
				},
				content: {
					en: form.contentEn,
					am: form.contentAm
				},
				location: form.location,
				start_at: form.startAt,
				end_at: form.endAt,
				status: form.status,
				image: form.image
			};
			if (editingId !== null) {
				await updateEvent(editingId, payload);
				toast.success("Event updated successfully.");
			} else {
				await createEvent(payload);
				toast.success("Event created successfully.");
			}
			setFormOpen(false);
			setEditingId(null);
			setForm({ ...emptyForm });
			await loadEvents();
		} catch (err) {
			console.error("Failed to save event:", err);
			toast.error(err instanceof Error ? err.message : "Unable to save event.");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPageHeader, {
			title: "Event Management",
			description: "Publish forums, workshops, and public consultations.",
			action: can("events.create") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: openCreate,
				className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New event"]
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
							placeholder: "Search events...",
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
									children: "Start"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3",
									children: "Location"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-3 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "px-5 py-10 text-center text-muted-foreground",
							children: "Loading events..."
						}) }) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "px-5 py-10 text-center text-destructive",
							children: error
						}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "px-5 py-10 text-center text-muted-foreground",
							children: q ? "No events match your search." : "No events available."
						}) }) : filtered.map((event) => {
							const status = event.status || "draft";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 font-mono text-xs text-muted-foreground",
										children: event.id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 font-medium",
										children: event.title?.en || event.title?.am || "Untitled event"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-muted-foreground",
										children: event.category_id ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase " + (status === "published" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"),
											children: status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }), formatDate(event.start_at)]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }), event.location || "—"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "inline-flex items-center gap-1",
											children: [
												can("events.view") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "View",
													title: "View event",
													onClick: () => openView(event.id),
													className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
												}),
												can("events.update") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "Edit",
													title: "Edit event",
													disabled: saving,
													onClick: () => openEdit(event.id),
													className: "grid h-8 w-8 place-items-center rounded-md hover:bg-secondary disabled:opacity-50",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
												}),
												can("events.delete") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													"aria-label": "Delete",
													title: "Delete event",
													disabled: saving,
													onClick: () => handleDelete(event.id),
													className: "grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10 disabled:opacity-50",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
												})
											]
										})
									})
								]
							}, event.id);
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
						events.length,
						" event",
						events.length === 1 ? "" : "s"
					]
				})
			]
		}),
		formOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl border bg-card shadow-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky top-0 z-10 flex items-center justify-between border-b bg-card px-7 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold",
						children: editingId !== null ? "Edit Event" : "Create Event"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: editingId !== null ? "Update the event information." : "Add a new event to the calendar."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFormOpen(false),
						disabled: saving,
						className: "grid h-9 w-9 place-items-center rounded-lg hover:bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-7 p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-medium",
								children: "Title - English"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.titleEn,
								onChange: (e) => setForm({
									...form,
									titleEn: e.target.value
								}),
								className: "h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",
								placeholder: "Enter English title"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-medium",
								children: "Title - Amharic"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.titleAm,
								onChange: (e) => setForm({
									...form,
									titleAm: e.target.value
								}),
								className: "h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",
								placeholder: "የክስተቱ ርዕስ"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-medium",
								children: "Content - English"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.contentEn,
								onChange: (e) => setForm({
									...form,
									contentEn: e.target.value
								}),
								rows: 8,
								className: "min-h-[220px] w-full resize-y rounded-xl border bg-background px-4 py-3 text-base leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",
								placeholder: "Enter event content"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-medium",
								children: "Content - Amharic"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: form.contentAm,
								onChange: (e) => setForm({
									...form,
									contentAm: e.target.value
								}),
								rows: 8,
								className: "min-h-[220px] w-full resize-y rounded-xl border bg-background px-4 py-3 text-base leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",
								placeholder: "የክስተቱን መግለጫ ያስገቡ"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-medium",
								children: "Category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: form.categoryId,
								onChange: (e) => setForm({
									...form,
									categoryId: e.target.value
								}),
								className: "h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",
								placeholder: "Enter category ID"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-medium",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: form.status,
								onChange: (e) => setForm({
									...form,
									status: e.target.value
								}),
								className: "h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",
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
							className: "mb-2 block text-sm font-medium",
							children: "Location"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: form.location,
								onChange: (e) => setForm({
									...form,
									location: e.target.value
								}),
								className: "h-12 w-full rounded-xl border bg-background pl-11 pr-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20",
								placeholder: "Semera, Afar Regional State"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-medium",
								children: "Starts At"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "datetime-local",
								value: form.startAt,
								onChange: (e) => setForm({
									...form,
									startAt: e.target.value
								}),
								className: "h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-medium",
								children: "Ends At"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "datetime-local",
								value: form.endAt,
								onChange: (e) => setForm({
									...form,
									endAt: e.target.value
								}),
								className: "h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-medium",
								children: "Event Image"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								onChange: (e) => setForm({
									...form,
									image: e.target.files?.[0] ?? null
								}),
								className: "block w-full rounded-xl border bg-background px-4 py-3 text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "Optional. You can select a new image when creating or editing an event."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-3 border-t pt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setFormOpen(false),
								disabled: saving,
								className: "rounded-xl border px-6 py-3 text-sm font-medium hover:bg-secondary disabled:opacity-50",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: saving,
								className: "rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50",
								children: saving ? "Saving..." : editingId !== null ? "Update Event" : "Create Event"
							})]
						})
					]
				})]
			})
		}),
		viewOpen && selectedEvent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border bg-card shadow-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold",
						children: "Event Details"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: ["Event #", selectedEvent.id]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setViewOpen(false),
						className: "grid h-9 w-9 place-items-center rounded-lg hover:bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase text-muted-foreground",
								children: "English Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-medium",
								children: selectedEvent.title?.en || "—"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase text-muted-foreground",
								children: "Amharic Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-medium",
								children: selectedEvent.title?.am || "—"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase text-muted-foreground",
								children: "English Content"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 whitespace-pre-wrap text-sm leading-6",
								children: selectedEvent.content?.en || "—"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase text-muted-foreground",
								children: "Amharic Content"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 whitespace-pre-wrap text-sm leading-6",
								children: selectedEvent.content?.am || "—"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2",
									children: selectedEvent.category_id ?? "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 capitalize",
									children: selectedEvent.status || "draft"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "Location"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2",
									children: selectedEvent.location || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "Starts"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2",
									children: formatDate(selectedEvent.start_at)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "Ends"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2",
									children: formatDate(selectedEvent.end_at)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase text-muted-foreground",
									children: "Published"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2",
									children: formatDate(selectedEvent.published_at)
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end border-t pt-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setViewOpen(false),
								className: "rounded-xl border px-6 py-3 text-sm font-medium hover:bg-secondary",
								children: "Close"
							})
						})
					]
				})]
			})
		})
	] });
}
function formatDate(value) {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
function toDateTimeLocal(value) {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
//#endregion
export { EventsAdmin as component };
