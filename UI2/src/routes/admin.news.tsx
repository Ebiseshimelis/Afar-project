import { createFileRoute } from "@tanstack/react-router";

import {
  AdminLayout,
  AdminPageHeader,
} from "@/components/admin/AdminLayout";

import {
  getNews,
  getAdminNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "@/services/newsService";

import {
  getCategories,
  type Category,
} from "@/services/categoryService";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  X,
  RefreshCw,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { toast } from "sonner";

export const Route =
  createFileRoute("/admin/news")({
    head: () => ({
      meta: [
        {
          title: "News Management",
        },
        {
          name: "robots",
          content: "noindex",
        },
      ],
    }),

    component: NewsAdmin,
  });

function NewsAdmin() {
  const [news, setNews] =
    useState<any[]>([]);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [q, setQ] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loadingEdit, setLoadingEdit] =
    useState(false);

  const [titleEn, setTitleEn] =
    useState("");

  const [titleAm, setTitleAm] =
    useState("");

  const [contentEn, setContentEn] =
    useState("");

  const [contentAm, setContentAm] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [status, setStatus] =
    useState("published");

  const [publishedAt, setPublishedAt] =
    useState("");

  const [image, setImage] =
    useState<File | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Initial loading
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadNews();
    loadCategories();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load News
  |--------------------------------------------------------------------------
  */

  async function loadNews() {
    try {
      setLoading(true);

      const data =
        await getNews();

      setNews(data);
    } catch (error) {
      console.error(
        "Failed to load news:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load news."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Load Categories
  |--------------------------------------------------------------------------
  */

  async function loadCategories() {
    try {
      const data =
        await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load categories."
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Reset
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Create Form
  |--------------------------------------------------------------------------
  */

  function openCreateForm() {
    resetForm();
    setShowForm(true);
  }

  /*
  |--------------------------------------------------------------------------
  | Close Form
  |--------------------------------------------------------------------------
  */

  function closeForm() {
    if (saving) {
      return;
    }

    resetForm();
    setShowForm(false);
  }

  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */

  async function handleCreate() {
    if (!validateForm()) {
      return;
    }

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
        image,
      });

      toast.success(
        "News created successfully."
      );

      resetForm();
      setShowForm(false);

      await loadNews();
    } catch (error) {
      console.error(
        "Create news failed:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create news."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Open Edit
  |--------------------------------------------------------------------------
  */

  async function openEditForm(
    id: string
  ) {
    try {
      setLoadingEdit(true);
      setShowForm(true);
      setEditingId(id);

      const item =
        await getAdminNewsById(id);

      setTitleEn(
        item.titleEn || ""
      );

      setTitleAm(
        item.titleAm || ""
      );

      setContentEn(
        item.contentEn || ""
      );

      setContentAm(
        item.contentAm || ""
      );

      setCategoryId(
        item.categoryId || ""
      );

      setStatus(
        item.status || "published"
      );

      /*
      |--------------------------------------------------------------------------
      | Date
      |--------------------------------------------------------------------------
      |
      | Convert Laravel:
      |
      | 2026-08-14T09:00:00.000000Z
      |
      | into:
      |
      | 2026-08-14T12:00
      |
      | for datetime-local.
      |
      */

      if (item.publishedAt) {
        const date =
          new Date(
            item.publishedAt
          );

        if (
          !Number.isNaN(
            date.getTime()
          )
        ) {
          const local =
            new Date(
              date.getTime() -
                date.getTimezoneOffset() *
                  60000
            )
              .toISOString()
              .slice(0, 16);

          setPublishedAt(local);
        } else {
          setPublishedAt(
            item.publishedAt.slice(
              0,
              16
            )
          );
        }
      } else {
        setPublishedAt("");
      }

      /*
      |--------------------------------------------------------------------------
      | Existing image
      |--------------------------------------------------------------------------
      |
      | We intentionally do NOT place the
      | existing image into the File input.
      |
      */

      setImage(null);
    } catch (error) {
      console.error(
        "Failed to load news for editing:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load article."
      );

      resetForm();
      setShowForm(false);
    } finally {
      setLoadingEdit(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */

  async function handleUpdate() {
    if (!editingId) {
      toast.error(
        "No article selected."
      );

      return;
    }

    if (!validateForm()) {
      return;
    }

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
        image,
      });

      toast.success(
        "News updated successfully."
      );

      resetForm();
      setShowForm(false);

      await loadNews();
    } catch (error) {
      console.error(
        "Update news failed:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update news."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  async function handleDelete(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this news article?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteNews(id);

      toast.success(
        "News deleted successfully."
      );

      setNews((current) =>
        current.filter(
          (item) =>
            String(item.id) !==
            String(id)
        )
      );
    } catch (error) {
      console.error(
        "Delete news failed:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete news."
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  function validateForm(): boolean {
    if (!titleEn.trim()) {
      toast.error(
        "Please enter the English title."
      );

      return false;
    }

    if (!titleAm.trim()) {
      toast.error(
        "Please enter the Amharic title."
      );

      return false;
    }

    if (!contentEn.trim()) {
      toast.error(
        "Please enter the English content."
      );

      return false;
    }

    if (!contentAm.trim()) {
      toast.error(
        "Please enter the Amharic content."
      );

      return false;
    }

    if (!categoryId) {
      toast.error(
        "Please select a category."
      );

      return false;
    }

    return true;
  }

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const filtered =
    useMemo(() => {
      const search =
        q.trim().toLowerCase();

      if (!search) {
        return news;
      }

      return news.filter(
        (n) =>
          String(
            n.title || ""
          )
            .toLowerCase()
            .includes(search) ||
          String(
            n.category || ""
          )
            .toLowerCase()
            .includes(search)
      );
    }, [news, q]);

  return (
    <AdminLayout>
      <AdminPageHeader
        title="News Management"
        description="Create, edit, and publish news articles."
        action={
          <button
            type="button"
            onClick={
              openCreateForm
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New article
          </button>
        }
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-background shadow-xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingId
                    ? "Edit News Article"
                    : "Create News Article"}
                </h2>

                <p className="text-sm text-muted-foreground">
                  {editingId
                    ? "Update this news article."
                    : "Add a new news article to the portal."}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                disabled={saving}
                className="rounded-md p-2 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingEdit ? (
              <div className="p-10 text-center text-sm text-muted-foreground">
                Loading article...
              </div>
            ) : (
              <div className="space-y-5 p-5">

                {/* English title */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Title - English
                  </label>

                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) =>
                      setTitleEn(
                        e.target.value
                      )
                    }
                    placeholder="Enter English title"
                    disabled={saving}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
                  />
                </div>

                {/* Amharic title */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Title - Amharic
                  </label>

                  <input
                    type="text"
                    value={titleAm}
                    onChange={(e) =>
                      setTitleAm(
                        e.target.value
                      )
                    }
                    placeholder="የዜና ርዕስ"
                    disabled={saving}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
                  />
                </div>

                {/* English content */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Content - English
                  </label>

                  <textarea
                    value={contentEn}
                    onChange={(e) =>
                      setContentEn(
                        e.target.value
                      )
                    }
                    placeholder="Enter news content"
                    rows={5}
                    disabled={saving}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
                  />
                </div>

                {/* Amharic content */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Content - Amharic
                  </label>

                  <textarea
                    value={contentAm}
                    onChange={(e) =>
                      setContentAm(
                        e.target.value
                      )
                    }
                    placeholder="የዜና ይዘት"
                    rows={5}
                    disabled={saving}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
                  />
                </div>

                {/* Category */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category
                  </label>

                  <select
                    value={categoryId}
                    onChange={(e) =>
                      setCategoryId(
                        e.target.value
                      )
                    }
                    disabled={
                      saving ||
                      categories.length ===
                        0
                    }
                    className="w-full cursor-pointer rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={
                            category.id
                          }
                          value={String(
                            category.id
                          )}
                        >
                          {category.name.en}
                        </option>
                      )
                    )}
                  </select>

                  {categories.length ===
                    0 && (
                    <p className="mt-2 text-xs text-destructive">
                      No categories loaded.
                    </p>
                  )}
                </div>

                {/* Status + Date */}

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(
                          e.target.value
                        )
                      }
                      disabled={saving}
                      className="w-full cursor-pointer rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
                    >
                      <option value="published">
                        Published
                      </option>

                      <option value="draft">
                        Draft
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Published Date
                    </label>

                    <input
                      type="datetime-local"
                      value={
                        publishedAt
                      }
                      onChange={(e) => {
                        setPublishedAt(
                          e.target.value
                        );
                      }}
                      disabled={saving}
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 disabled:opacity-50"
                    />
                  </div>

                </div>

                {/* Image */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    News Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImage(
                        e.target.files?.[0] ??
                          null
                      )
                    }
                    disabled={saving}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm disabled:opacity-50"
                  />

                  {image && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      New image selected:{" "}
                      {image.name}
                    </p>
                  )}

                  {editingId &&
                    !image && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Existing image will be kept unless you select a new image.
                      </p>
                    )}
                </div>

                {/* Buttons */}

                <div className="flex justify-end gap-3 border-t pt-5">

                  <button
                    type="button"
                    onClick={
                      closeForm
                    }
                    disabled={saving}
                    className="rounded-lg border px-4 py-2 text-sm hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      editingId
                        ? handleUpdate
                        : handleCreate
                    }
                    disabled={
                      saving ||
                      loadingEdit ||
                      categories.length ===
                        0
                    }
                    className="inline-flex min-w-[130px] items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />

                        {editingId
                          ? "Updating..."
                          : "Creating..."}
                      </>
                    ) : editingId ? (
                      "Update News"
                    ) : (
                      "Create News"
                    )}
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* News table */}

      <div className="rounded-xl border bg-card shadow-soft">

        <div className="flex items-center gap-3 border-b p-4">

          <div className="relative max-w-sm flex-1">

            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) =>
                setQ(
                  e.target.value
                )
              }
              placeholder="Search articles..."
              className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2"
            />

          </div>

          <button
            type="button"
            onClick={
              loadNews
            }
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </button>

        </div>

        <div className="overflow-x-auto">

          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading news...
            </div>
          ) : filtered.length ===
            0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No news articles found.
            </div>
          ) : (
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
                    Author
                  </th>

                  <th className="px-5 py-3">
                    Date
                  </th>

                  <th className="px-5 py-3 text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filtered.map(
                  (n) => (
                    <tr
                      key={n.id}
                      className="border-t"
                    >

                      <td className="px-5 py-3">

                        <div className="flex items-center gap-3">

                          {/* IMAGE LOADER UNCHANGED */}

                          <img
                            src={n.image}
                            alt=""
                            className="h-9 w-9 rounded object-cover"
                          />

                          <span className="line-clamp-1 font-medium">
                            {n.title}
                          </span>

                        </div>

                      </td>

                      <td className="px-5 py-3">

                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-foreground">
                          {n.category ||
                            "Uncategorized"}
                        </span>

                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        {n.author ||
                          "—"}
                      </td>

                      <td className="px-5 py-3 text-muted-foreground">
                        {n.date
                          ? new Date(
                              n.date
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-5 py-3 text-right">

                        <div className="inline-flex items-center gap-1">

                          <button
                            type="button"
                            aria-label="View"
                            onClick={() =>
                              toast.info(
                                `News #${n.id}`
                              )
                            }
                            className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            aria-label="Edit"
                            onClick={() =>
                              openEditForm(
                                String(
                                  n.id
                                )
                              )
                            }
                            className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            aria-label="Delete"
                            onClick={() =>
                              handleDelete(
                                String(
                                  n.id
                                )
                              )
                            }
                            className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>
          )}

        </div>

      </div>
    </AdminLayout>
  );
}