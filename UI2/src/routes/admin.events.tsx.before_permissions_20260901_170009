import { createFileRoute } from "@tanstack/react-router";
import {
  AdminLayout,
  AdminPageHeader,
} from "@/components/admin/AdminLayout";
import {
  Calendar,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  updateEvent,
  type EventItem,
} from "@/services/eventService";

export const Route = createFileRoute("/admin/events")({
  head: () => ({
    meta: [
      {
        title: "Event Management",
      },
      {
        name: "robots",
        content: "noindex",
      },
    ],
  }),
  component: EventsAdmin,
});

/* =========================================================
   FORM TYPE
========================================================= */

type EventForm = {
  titleEn: string;
  titleAm: string;
  contentEn: string;
  contentAm: string;
  categoryId: string;
  status: "draft" | "published";
  location: string;
  startAt: string;
  endAt: string;
  image: File | null;
};

const emptyForm: EventForm = {
  titleEn: "",
  titleAm: "",
  contentEn: "",
  contentAm: "",
  categoryId: "",
  status: "draft",
  location: "",
  startAt: "",
  endAt: "",
  image: null,
};

/* =========================================================
   ADMIN EVENTS
========================================================= */

function EventsAdmin() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [selectedEvent, setSelectedEvent] =
    useState<EventItem | null>(null);

  const [form, setForm] =
    useState<EventForm>({
      ...emptyForm,
    });

  /* =======================================================
     LOAD EVENTS
  ======================================================= */

  async function loadEvents() {
    try {
      setLoading(true);
      setError("");

      const data = await getEvents();

      setEvents(data);
    } catch (err) {
      console.error(
        "Failed to load events:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load events."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filtered = useMemo(() => {
    const search = q.trim().toLowerCase();

    if (!search) {
      return events;
    }

    return events.filter((event) => {
      const titleEn =
        event.title?.en ?? "";

      const titleAm =
        event.title?.am ?? "";

      const location =
        event.location ?? "";

      return (
        titleEn
          .toLowerCase()
          .includes(search) ||
        titleAm
          .toLowerCase()
          .includes(search) ||
        location
          .toLowerCase()
          .includes(search)
      );
    });
  }, [events, q]);

  /* =======================================================
     CREATE
  ======================================================= */

  function openCreate() {
    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setFormOpen(true);
  }

  /* =======================================================
     EDIT
  ======================================================= */

  async function openEdit(id: number) {
    try {
      setSaving(true);

      const event = await getEvent(id);

      setEditingId(event.id);

      setForm({
        titleEn:
          event.title?.en ?? "",

        titleAm:
          event.title?.am ?? "",

        contentEn:
          event.content?.en ?? "",

        contentAm:
          event.content?.am ?? "",

        categoryId:
          event.category_id
            ? String(event.category_id)
            : "",

        status:
          event.status ?? "draft",

        location:
          event.location ?? "",

        startAt:
          toDateTimeLocal(
            event.start_at
          ),

        endAt:
          toDateTimeLocal(
            event.end_at
          ),

        image: null,
      });

      setFormOpen(true);
    } catch (err) {
      console.error(
        "Failed to load event:",
        err
      );

      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to load event."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     VIEW
  ======================================================= */

  async function openView(id: number) {
    try {
      const event = await getEvent(id);

      setSelectedEvent(event);

      setViewOpen(true);
    } catch (err) {
      console.error(
        "Failed to load event:",
        err
      );

      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to load event."
      );
    }
  }

  /* =======================================================
     DELETE
  ======================================================= */

  async function handleDelete(id: number) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this event?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      await deleteEvent(id);

      toast.success(
        "Event deleted successfully."
      );

      await loadEvents();
    } catch (err) {
      console.error(
        "Failed to delete event:",
        err
      );

      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to delete event."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     SUBMIT
  ======================================================= */

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!form.titleEn.trim()) {
      toast.error(
        "Please enter the English title."
      );
      return;
    }

    if (!form.contentEn.trim()) {
      toast.error(
        "Please enter the English content."
      );
      return;
    }

    if (!form.categoryId) {
      toast.error(
        "Please enter the category ID."
      );
      return;
    }

    if (!form.startAt) {
      toast.error(
        "Please select the start date."
      );
      return;
    }

    if (!form.endAt) {
      toast.error(
        "Please select the end date."
      );
      return;
    }

    const categoryId =
      Number(form.categoryId);

    if (
      Number.isNaN(categoryId) ||
      categoryId <= 0
    ) {
      toast.error(
        "Category ID must be a valid number."
      );
      return;
    }

    if (
      new Date(form.endAt) <=
      new Date(form.startAt)
    ) {
      toast.error(
        "End date must be after start date."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        category_id: categoryId,

        title: {
          en: form.titleEn,
          am: form.titleAm,
        },

        content: {
          en: form.contentEn,
          am: form.contentAm,
        },

        location: form.location,

        start_at: form.startAt,

        end_at: form.endAt,

        status: form.status,

        image: form.image,
      };

      if (editingId !== null) {
        await updateEvent(
          editingId,
          payload
        );

        toast.success(
          "Event updated successfully."
        );
      } else {
        await createEvent(payload);

        toast.success(
          "Event created successfully."
        );
      }

      setFormOpen(false);

      setEditingId(null);

      setForm({
        ...emptyForm,
      });

      await loadEvents();
    } catch (err) {
      console.error(
        "Failed to save event:",
        err
      );

      toast.error(
        err instanceof Error
          ? err.message
          : "Unable to save event."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Event Management"
        description="Publish forums, workshops, and public consultations."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New event
          </button>
        }
      />

      {/* ===================================================
          SEARCH + TABLE
      =================================================== */}

      <div className="rounded-xl border bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b p-4">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) =>
                setQ(e.target.value)
              }
              placeholder="Search events..."
              className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">
                  ID
                </th>

                <th className="px-5 py-3">
                  Title
                </th>

                <th className="px-5 py-3">
                  Category
                </th>

                <th className="px-5 py-3">
                  Status
                </th>

                <th className="px-5 py-3">
                  Start
                </th>

                <th className="px-5 py-3">
                  Location
                </th>

                <th className="px-5 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-muted-foreground"
                  >
                    Loading events...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-destructive"
                  >
                    {error}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-muted-foreground"
                  >
                    {q
                      ? "No events match your search."
                      : "No events available."}
                  </td>
                </tr>
              ) : (
                filtered.map((event) => {
                  const status =
                    event.status ||
                    "draft";

                  return (
                    <tr
                      key={event.id}
                      className="border-t"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                        {event.id}
                      </td>

                      <td className="px-5 py-3 font-medium">
                        {event.title?.en ||
                          event.title?.am ||
                          "Untitled event"}
                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        {event.category_id ??
                          "—"}
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase " +
                            (status ===
                            "published"
                              ? "bg-success/15 text-success"
                              : "bg-muted text-muted-foreground")
                          }
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />

                          {formatDate(
                            event.start_at
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />

                          {event.location ||
                            "—"}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            aria-label="View"
                            title="View event"
                            onClick={() =>
                              openView(
                                event.id
                              )
                            }
                            className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            aria-label="Edit"
                            title="Edit event"
                            disabled={saving}
                            onClick={() =>
                              openEdit(
                                event.id
                              )
                            }
                            className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary disabled:opacity-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            aria-label="Delete"
                            title="Delete event"
                            disabled={saving}
                            onClick={() =>
                              handleDelete(
                                event.id
                              )
                            }
                            className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && (
          <div className="border-t px-5 py-3 text-xs text-muted-foreground">
            Showing {filtered.length} of{" "}
            {events.length} event
            {events.length === 1
              ? ""
              : "s"}
          </div>
        )}
      </div>

      {/* ===================================================
          CREATE / EDIT MODAL
      =================================================== */}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl border bg-card shadow-2xl">
            {/* HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-7 py-5">
              <div>
                <h2 className="text-xl font-semibold">
                  {editingId !== null
                    ? "Edit Event"
                    : "Create Event"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {editingId !== null
                    ? "Update the event information."
                    : "Add a new event to the calendar."}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFormOpen(false)
                }
                disabled={saving}
                className="grid h-9 w-9 place-items-center rounded-lg hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-7 p-7"
            >
              {/* =========================================
                  TITLES
              ========================================= */}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Title - English
                  </label>

                  <input
                    value={form.titleEn}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        titleEn:
                          e.target.value,
                      })
                    }
                    className="h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter English title"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Title - Amharic
                  </label>

                  <input
                    value={form.titleAm}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        titleAm:
                          e.target.value,
                      })
                    }
                    className="h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="የክስተት ርዕስ"
                  />
                </div>
              </div>

              {/* =========================================
                  CONTENT
              ========================================= */}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Content - English
                  </label>

                  <textarea
                    value={form.contentEn}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        contentEn:
                          e.target.value,
                      })
                    }
                    rows={8}
                    className="min-h-[220px] w-full resize-y rounded-xl border bg-background px-4 py-3 text-base leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter event content"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Content - Amharic
                  </label>

                  <textarea
                    value={form.contentAm}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        contentAm:
                          e.target.value,
                      })
                    }
                    rows={8}
                    className="min-h-[220px] w-full resize-y rounded-xl border bg-background px-4 py-3 text-base leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="የክስተቱ መግለጫ"
                  />
                </div>
              </div>

              {/* =========================================
                  CATEGORY + STATUS
              ========================================= */}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category
                  </label>

                  <input
                    type="number"
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        categoryId:
                          e.target.value,
                      })
                    }
                    className="h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter category ID"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status:
                          e.target.value as
                            | "draft"
                            | "published",
                      })
                    }
                    className="h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>
                  </select>
                </div>
              </div>

              {/* =========================================
                  LOCATION
              ========================================= */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Location
                </label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={form.location}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        location:
                          e.target.value,
                      })
                    }
                    className="h-12 w-full rounded-xl border bg-background pl-11 pr-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Semera, Afar Regional State"
                  />
                </div>
              </div>

              {/* =========================================
                  DATES
              ========================================= */}

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Starts At
                  </label>

                  <input
                    type="datetime-local"
                    value={form.startAt}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        startAt:
                          e.target.value,
                      })
                    }
                    className="h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Ends At
                  </label>

                  <input
                    type="datetime-local"
                    value={form.endAt}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        endAt:
                          e.target.value,
                      })
                    }
                    className="h-12 w-full rounded-xl border bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* =========================================
                  IMAGE
              ========================================= */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Event Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image:
                        e.target.files?.[0] ??
                        null,
                    })
                  }
                  className="block w-full rounded-xl border bg-background px-4 py-3 text-sm"
                />

                <p className="mt-2 text-xs text-muted-foreground">
                  Optional. You can select a new
                  image when creating or editing
                  an event.
                </p>
              </div>

              {/* =========================================
                  BUTTONS
              ========================================= */}

              <div className="flex justify-end gap-3 border-t pt-6">
                <button
                  type="button"
                  onClick={() =>
                    setFormOpen(false)
                  }
                  disabled={saving}
                  className="rounded-xl border px-6 py-3 text-sm font-medium hover:bg-secondary disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                    ? "Update Event"
                    : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================
          VIEW MODAL
      =================================================== */}

      {viewOpen &&
        selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border bg-card shadow-2xl">
              <div className="flex items-center justify-between border-b p-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    Event Details
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Event #{selectedEvent.id}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setViewOpen(false)
                  }
                  className="grid h-9 w-9 place-items-center rounded-lg hover:bg-secondary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 p-6">
                {/* TITLES */}

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      English Title
                    </p>

                    <p className="mt-2 font-medium">
                      {selectedEvent.title
                        ?.en || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Amharic Title
                    </p>

                    <p className="mt-2 font-medium">
                      {selectedEvent.title
                        ?.am || "—"}
                    </p>
                  </div>
                </div>

                {/* CONTENT */}

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      English Content
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                      {selectedEvent.content
                        ?.en || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Amharic Content
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                      {selectedEvent.content
                        ?.am || "—"}
                    </p>
                  </div>
                </div>

                {/* DETAILS */}

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Category
                    </p>

                    <p className="mt-2">
                      {selectedEvent.category_id ??
                        "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Status
                    </p>

                    <p className="mt-2 capitalize">
                      {selectedEvent.status ||
                        "draft"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Location
                    </p>

                    <p className="mt-2">
                      {selectedEvent.location ||
                        "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Starts
                    </p>

                    <p className="mt-2">
                      {formatDate(
                        selectedEvent.start_at
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Ends
                    </p>

                    <p className="mt-2">
                      {formatDate(
                        selectedEvent.end_at
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Published
                    </p>

                    <p className="mt-2">
                      {formatDate(
                        selectedEvent.published_at
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end border-t pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      setViewOpen(false)
                    }
                    className="rounded-xl border px-6 py-3 text-sm font-medium hover:bg-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </AdminLayout>
  );
}

/* =========================================================
   DATE HELPERS
========================================================= */

function formatDate(
  value:
    | string
    | null
    | undefined
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

function toDateTimeLocal(
  value:
    | string
    | null
    | undefined
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const hours = String(
    date.getHours()
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes()
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}