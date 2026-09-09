import { createFileRoute } from "@tanstack/react-router";
import {
  AdminLayout,
  AdminPageHeader,
} from "@/components/admin/AdminLayout";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getTenders,
  getTender,
  createTender,
  updateTender,
  deleteTender,
  type Tender,
  type CreateTenderData,
} from "@/services/tenderService";

export const Route = createFileRoute("/admin/tenders")({
  head: () => ({
    meta: [
      { title: "Tender Management" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TendersAdmin,
});

function getLocalizedText(
  value:
    | Tender["title"]
    | Tender["content"]
    | string
    | null
    | undefined
): string {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return value.en || value.am || "";
}

function formatDate(value?: string | null): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString();
}

function toDateTimeLocal(value?: string | null): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

type FormState = {
  titleEn: string;
  titleAm: string;
  contentEn: string;
  contentAm: string;
  categoryId: string;
  status: "draft" | "published";
  opensAt: string;
  closesAt: string;
  publishedAt: string;
};

const emptyForm: FormState = {
  titleEn: "",
  titleAm: "",
  contentEn: "",
  contentAm: "",
  categoryId: "",
  status: "draft",
  opensAt: "",
  closesAt: "",
  publishedAt: "",
};

function TendersAdmin() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedTender, setSelectedTender] =
    useState<Tender | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);

  async function loadTenders() {
    try {
      setLoading(true);
      setError("");

      const data = await getTenders();

      setTenders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load tenders:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load tenders from the backend."
      );

      setTenders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTenders();
  }, []);

  const filtered = useMemo(() => {
    const search = q.trim().toLowerCase();

    if (!search) {
      return tenders;
    }

    return tenders.filter((tender) => {
      const title = getLocalizedText(tender.title).toLowerCase();
      const category = String(tender.category_id ?? "").toLowerCase();
      const status = (tender.status || "").toLowerCase();

      return (
        title.includes(search) ||
        category.includes(search) ||
        status.includes(search) ||
        String(tender.id).includes(search)
      );
    });
  }, [tenders, q]);

  function openCreate() {
    setMessage("");
    setError("");
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  async function openView(id: number) {
    try {
      setMessage("");
      setError("");

      const tender = await getTender(id);

      setSelectedTender(tender);
      setViewOpen(true);
    } catch (err) {
      console.error("Failed to load tender:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load tender details."
      );
    }
  }

  async function openEdit(id: number) {
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
        categoryId:
          tender.category_id != null
            ? String(tender.category_id)
            : "",
        status: (tender.status === "published" ? "published" : "draft"),
        opensAt: toDateTimeLocal(tender.opens_at),
        closesAt: toDateTimeLocal(tender.closes_at),
        publishedAt: toDateTimeLocal(tender.published_at),
      });

      setFormOpen(true);
    } catch (err) {
      console.error("Failed to load tender for editing:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load tender for editing."
      );
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.titleEn.trim() && !form.titleAm.trim()) {
      setError("Please enter a tender title.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload: CreateTenderData = {
        category_id: form.categoryId
          ? Number(form.categoryId)
          : null,

        title: {
          en: form.titleEn.trim(),
          am: form.titleAm.trim(),
        },

        content: {
          en: form.contentEn.trim(),
          am: form.contentAm.trim(),
        },

        opens_at: form.opensAt
          ? form.opensAt
          : null,

        closes_at: form.closesAt
          ? form.closesAt
          : null,

        status: form.status,

        published_at:
          form.publishedAt
            ? form.publishedAt
            : null,
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

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save tender."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const tender = tenders.find(
      (item) => Number(item.id) === id
    );

    const title = tender
      ? getLocalizedText(tender.title)
      : `Tender #${id}`;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteTender(id);

      setMessage("Tender deleted successfully.");

      await loadTenders();
    } catch (err) {
      console.error("Failed to delete tender:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete tender."
      );
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Tender Management"
        description="Publish and track procurement opportunities."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New tender
          </button>
        }
      />

      {message && (
        <div className="mb-4 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b p-4">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tenders..."
              className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>

          <button
            type="button"
            onClick={loadTenders}
            disabled={loading}
            className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm hover:bg-secondary disabled:opacity-50"
            title="Refresh tenders"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Published</th>
                <th className="px-5 py-3">Deadline</th>
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
                    Loading tenders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-muted-foreground"
                  >
                    {q
                      ? "No tenders match your search."
                      : "No tenders available."}
                  </td>
                </tr>
              ) : (
                filtered.map((tender) => {
                  const status =
                    tender.status || "draft";

                  return (
                    <tr
                      key={tender.id}
                      className="border-t"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                        {tender.id}
                      </td>

                      <td className="px-5 py-3 font-medium">
                        {getLocalizedText(
                          tender.title
                        ) || "Untitled tender"}
                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        {tender.category_id
                          ? `Category ${tender.category_id}`
                          : "—"}
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase " +
                            (status === "published"
                              ? "bg-success/15 text-success"
                              : "bg-muted text-muted-foreground")
                          }
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        {formatDate(
                          tender.published_at
                        )}
                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        {formatDate(
                          tender.closes_at
                        )}
                      </td>

                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            aria-label="View"
                            title="View tender"
                            onClick={() =>
                              openView(
                                Number(tender.id)
                              )
                            }
                            className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            aria-label="Edit"
                            title="Edit tender"
                            onClick={() =>
                              openEdit(
                                Number(tender.id)
                              )
                            }
                            className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            aria-label="Delete"
                            title="Delete tender"
                            onClick={() =>
                              handleDelete(
                                Number(tender.id)
                              )
                            }
                            className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10"
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
            {tenders.length} tender
            {tenders.length === 1 ? "" : "s"}
          </div>
        )}
      </div>

      {/* Create / Edit dialog */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingId !== null
                    ? "Edit Tender"
                    : "Create Tender"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {editingId !== null
                    ? "Update the tender information."
                    : "Add a new procurement opportunity."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                disabled={saving}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Title (English)
                  </label>

                  <input
                    value={form.titleEn}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        titleEn: e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                    placeholder="Tender title"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Title (Amharic)
                  </label>

                  <input
                    value={form.titleAm}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        titleAm: e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                    placeholder="የጨረታ ርዕስ"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Content (English)
                  </label>

                  <textarea
                    value={form.contentEn}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        contentEn: e.target.value,
                      })
                    }
                    rows={5}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                    placeholder="Tender description"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Content (Amharic)
                  </label>

                  <textarea
                    value={form.contentAm}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        contentAm: e.target.value,
                      })
                    }
                    rows={5}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                    placeholder="የጨረታ መግለጫ"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Category ID
                  </label>

                  <input
                    type="number"
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        categoryId: e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                    placeholder="Category ID"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as "draft" | "published",
                      })
                    }
                    className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
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

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Opens At
                  </label>

                  <input
                    type="datetime-local"
                    value={form.opensAt}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        opensAt: e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Closes At
                  </label>

                  <input
                    type="datetime-local"
                    value={form.closesAt}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        closesAt: e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Published At
                  </label>

                  <input
                    type="datetime-local"
                    value={form.publishedAt}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        publishedAt: e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setFormOpen(false)
                  }
                  disabled={saving}
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-secondary disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                    ? "Update Tender"
                    : "Create Tender"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View dialog */}
      {viewOpen && selectedTender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-semibold">
                  Tender Details
                </h2>

                <p className="text-sm text-muted-foreground">
                  Tender #{selectedTender.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setViewOpen(false)
                }
                className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  English Title
                </p>

                <p className="mt-1 font-medium">
                  {selectedTender.title?.en ||
                    "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Amharic Title
                </p>

                <p className="mt-1 font-medium">
                  {selectedTender.title?.am ||
                    "—"}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    English Content
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm">
                    {selectedTender.content?.en ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Amharic Content
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm">
                    {selectedTender.content?.am ||
                      "—"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Category
                  </p>

                  <p className="mt-1">
                    {selectedTender.category_id ??
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Status
                  </p>

                  <p className="mt-1 capitalize">
                    {selectedTender.status ||
                      "draft"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Opens
                  </p>

                  <p className="mt-1">
                    {formatDate(
                      selectedTender.opens_at
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Deadline
                  </p>

                  <p className="mt-1">
                    {formatDate(
                      selectedTender.closes_at
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Published
                  </p>

                  <p className="mt-1">
                    {formatDate(
                      selectedTender.published_at
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
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-secondary"
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





