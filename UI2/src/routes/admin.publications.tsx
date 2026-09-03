import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import {
  AdminLayout,
  AdminPageHeader,
} from "@/components/admin/AdminLayout";
import {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
  type Publication,
} from "@/services/publicationService";
import { getCategories } from "@/services/categoryService";
import type { Category } from "@/services/categoryService";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  FileText,
  Download,
  X,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/publications")({
  head: () => ({
    meta: [
      { title: "Publication Management" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PublicationsAdmin,
});

type FormState = {
  category_id: string;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  status: "draft" | "published";
  published_at: string;
  file: File | null;
};

const emptyForm: FormState = {
  category_id: "",
  titleEn: "",
  titleAm: "",
  descriptionEn: "",
  descriptionAm: "",
  status: "draft",
  published_at: "",
  file: null,
};

function getLocalizedText(
  value: { en?: string; am?: string } | null | undefined
) {
  return value?.en || value?.am || "";
}

function formatDate(value: string | null) {
  if (!value) return "�";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
}

function formatFileSize(bytes: number) {
  if (!bytes) return "�";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileUrl(path: string | null) {
  if (!path) return null;

  if (path.startsWith("http")) {
    return path;
  }

  return `http://127.0.0.1:8001/storage/${path}`;
}

function PublicationsAdmin() {
  const { can } = useAuth();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [q, setQ] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] =
    useState<Publication | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);

  async function loadData() {
    try {
      setLoading(true);

      const [publicationData, categoryData] =
        await Promise.all([
          getPublications(),
          getCategories(),
        ]);

      setPublications(publicationData);
      setCategories(categoryData);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load publications."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = publications.filter((publication) => {
    const title = getLocalizedText(publication.title);

    return (
      !q ||
      title.toLowerCase().includes(q.toLowerCase())
    );
  });

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(publication: Publication) {
    setEditingId(publication.id);

    setForm({
      category_id: publication.category_id
        ? String(publication.category_id)
        : "",

      titleEn: publication.title?.en || "",
      titleAm: publication.title?.am || "",

      descriptionEn:
        publication.description?.en || "",

      descriptionAm:
        publication.description?.am || "",

      status: publication.status,

      published_at: publication.published_at
        ? publication.published_at.slice(0, 16)
        : "",

      file: null,
    });

    setFormOpen(true);
  }

  function openView(publication: Publication) {
    setSelectedPublication(publication);
    setViewOpen(true);
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
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
          am: form.titleAm,
        },

        description: {
          en: form.descriptionEn,
          am: form.descriptionAm,
        },

        status: form.status,

        published_at:
          form.published_at || null,

        file: form.file,
      };

      if (editingId !== null) {
        await updatePublication(
          editingId,
          data
        );

        toast.success(
          "Publication updated successfully."
        );
      } else {
        await createPublication(data);

        toast.success(
          "Publication created successfully."
        );
      }

      setFormOpen(false);
      setForm(emptyForm);
      setEditingId(null);

      await loadData();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save publication."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    publication: Publication
  ) {
    const title =
      getLocalizedText(publication.title) ||
      "this publication";

    const confirmed = window.confirm(
      `Delete "${title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePublication(publication.id);

      toast.success(
        "Publication deleted successfully."
      );

      await loadData();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete publication."
      );
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Publication Management"
        description="Upload reports, policies, manuals, and other publications."
        action={
          can("publications.create") ? (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              New publication
            </button>
          ) : undefined
        }
      />

      <div className="rounded-xl border bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b p-4">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) =>
                setQ(e.target.value)
              }
              placeholder="Search publications..."
              className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">
                  Title
                </th>

                <th className="px-5 py-3">
                  Category
                </th>

                <th className="px-5 py-3">
                  Type
                </th>

                <th className="px-5 py-3">
                  Status
                </th>

                <th className="px-5 py-3">
                  Size
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
                    colSpan={6}
                    className="px-5 py-10 text-center text-muted-foreground"
                  >
                    Loading publications...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-muted-foreground"
                  >
                    {q
                      ? "No publications match your search."
                      : "No publications available."}
                  </td>
                </tr>
              ) : (
                filtered.map((publication) => {
                  const category =
                    categories.find(
                      (item) =>
                        item.id ===
                        publication.category_id
                    );

                  const fileUrl =
                    getFileUrl(
                      publication.file_path
                    );

                  return (
                    <tr
                      key={publication.id}
                      className="border-t"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-muted-foreground">
                            <FileText className="h-4 w-4" />
                          </div>

                          <span className="font-medium">
                            {getLocalizedText(
                              publication.title
                            ) ||
                              "Untitled publication"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        {category
                          ? getLocalizedText(
                              category.name
                            )
                          : publication.category_id
                            ? `Category ${publication.category_id}`
                            : "�"}
                      </td>

                      <td className="px-5 py-3">
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-foreground">
                          {publication.file_type ||
                            "file"}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase " +
                            (publication.status ===
                            "published"
                              ? "bg-success/15 text-success"
                              : "bg-muted text-muted-foreground")
                          }
                        >
                          {publication.status}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        {formatFileSize(
                          publication.file_size
                        )}
                      </td>

                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          {can("publications.view") && fileUrl && (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              aria-label="Download"
                              title="Open publication"
                              className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          )}

                          {can("publications.view") && (
                            <button
                              type="button"
                              aria-label="View"
                              title="View publication"
                              onClick={() =>
                                openView(
                                  publication
                                )
                              }
                              className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}

                          {can("publications.update") && (
                            <button
                              type="button"
                              aria-label="Edit"
                              title="Edit publication"
                              onClick={() =>
                                openEdit(
                                  publication
                                )
                              }
                              className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          )}

                          {can("publications.delete") && (
                            <button
                              type="button"
                              aria-label="Delete"
                              title="Delete publication"
                              onClick={() =>
                                handleDelete(
                                  publication
                                )
                              }
                              className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && (
          <div className="border-t px-5 py-3 text-xs text-muted-foreground">
            Showing {filtered.length} of{" "}
            {publications.length} publication
            {publications.length === 1
              ? ""
              : "s"}
          </div>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingId !== null
                    ? "Edit Publication"
                    : "Create Publication"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {editingId !== null
                    ? "Update the publication information."
                    : "Upload a new publication."}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFormOpen(false)
                }
                disabled={saving}
                className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
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
                        titleEn:
                          e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                    required
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
                        titleAm:
                          e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Description (English)
                  </label>

                  <textarea
                    value={form.descriptionEn}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        descriptionEn:
                          e.target.value,
                      })
                    }
                    rows={5}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Description (Amharic)
                  </label>

                  <textarea
                    value={form.descriptionAm}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        descriptionAm:
                          e.target.value,
                      })
                    }
                    rows={5}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Category
                  </label>

                  <select
                    value={form.category_id}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category_id:
                          e.target.value,
                      })
                    }
                    className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {getLocalizedText(
                            category.name
                          )}
                        </option>
                      )
                    )}
                  </select>
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
                        status: e.target.value as
                          | "draft"
                          | "published",
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

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Published At
                </label>

                <input
                  type="datetime-local"
                  value={form.published_at}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      published_at:
                        e.target.value,
                    })
                  }
                  className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Publication File
                </label>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      file:
                        e.target.files?.[0] ||
                        null,
                    })
                  }
                  className="block w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />

                <p className="mt-1 text-xs text-muted-foreground">
                  Maximum file size: 2 MB.
                </p>
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
                      ? "Update Publication"
                      : "Create Publication"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewOpen &&
        selectedPublication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-card shadow-xl">
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <h2 className="text-lg font-semibold">
                    Publication Details
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Publication #
                    {selectedPublication.id}
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
                    {selectedPublication.title
                      ?.en || "�"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Amharic Title
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedPublication.title
                      ?.am || "�"}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      English Description
                    </p>

                    <p className="mt-1 whitespace-pre-wrap text-sm">
                      {selectedPublication
                        .description?.en ||
                        "�"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Amharic Description
                    </p>

                    <p className="mt-1 whitespace-pre-wrap text-sm">
                      {selectedPublication
                        .description?.am ||
                        "�"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Status
                    </p>

                    <p className="mt-1 capitalize">
                      {selectedPublication.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      File Type
                    </p>

                    <p className="mt-1 uppercase">
                      {selectedPublication.file_type ||
                        "�"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      File Size
                    </p>

                    <p className="mt-1">
                      {formatFileSize(
                        selectedPublication.file_size
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Published
                    </p>

                    <p className="mt-1">
                      {formatDate(
                        selectedPublication.published_at
                      )}
                    </p>
                  </div>
                </div>

                {getFileUrl(
                  selectedPublication.file_path
                ) && (
                  <div className="flex justify-end border-t pt-5">
                    <a
                      href={getFileUrl(
                        selectedPublication.file_path
                      )!}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                      <Download className="h-4 w-4" />
                      Open File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
    </AdminLayout>
  );
}

