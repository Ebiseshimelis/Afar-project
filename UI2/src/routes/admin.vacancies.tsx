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
  X,
  Loader2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getVacancies,
  createVacancy,
  updateVacancy,
  deleteVacancy,
  type VacancyItem,
} from "@/services/vacancyService";

export const Route = createFileRoute("/admin/vacancies")({
  head: () => ({
    meta: [
      { title: "Vacancy Management" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VacanciesAdmin,
});

function VacanciesAdmin() {
  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [titleEn, setTitleEn] = useState("");
  const [titleAm, setTitleAm] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [contentAm, setContentAm] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] =
    useState<"draft" | "published">("published");
  const [publishedAt, setPublishedAt] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function loadVacancies() {
    try {
      setLoading(true);
      setError("");

      const data = await getVacancies(true);

      setVacancies(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load vacancies."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
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
    resetForm();
    setShowForm(true);
    setError("");
  }

  function openEditForm(vacancy: VacancyItem) {
    setEditingId(vacancy.id);

    setTitleEn(vacancy.title?.en ?? "");
    setTitleAm(vacancy.title?.am ?? "");

    setContentEn(vacancy.content?.en ?? "");
    setContentAm(vacancy.content?.am ?? "");

    setCategoryId(
      vacancy.category_id
        ? String(vacancy.category_id)
        : "1"
    );

    setDeadline(
      vacancy.deadline
        ? vacancy.deadline.substring(0, 10)
        : ""
    );

    setStatus(vacancy.status);

    setPublishedAt(
      vacancy.published_at
        ? vacancy.published_at.substring(0, 16)
        : ""
    );

    setFile(null);
    setShowForm(true);
    setError("");
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    resetForm();
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
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
          am: titleAm.trim(),
        },

        content: {
          en: contentEn.trim(),
          am: contentAm.trim(),
        },

        deadline: deadline
          ? new Date(
              `${deadline}T23:59:59`
            ).toISOString()
          : null,

        status,

        published_at: publishedAt
          ? new Date(
              publishedAt
            ).toISOString()
          : status === "published"
            ? new Date().toISOString()
            : null,

        file,
      };

      if (editingId !== null) {
        await updateVacancy(
          editingId,
          data
        );
      } else {
        await createVacancy(data);
      }

      await loadVacancies();

      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save vacancy."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vacancy?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteVacancy(id);

      await loadVacancies();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete vacancy."
      );
    }
  }

  const filtered = useMemo(() => {
    const search = q.trim().toLowerCase();

    if (!search) return vacancies;

    return vacancies.filter((v) => {
      const title =
        v.title?.en ??
        v.title?.am ??
        "";

      return title
        .toLowerCase()
        .includes(search);
    });
  }, [vacancies, q]);

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Vacancy Management"
        description="Post and manage job openings."
        action={
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New vacancy
          </button>
        }
      />

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 rounded-xl border bg-card p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {editingId !== null
                  ? "Edit Vacancy"
                  : "Create Vacancy"}
              </h2>

              <p className="text-sm text-muted-foreground">
                {editingId !== null
                  ? "Update the vacancy information."
                  : "Add a new vacancy to the portal."}
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  English Title *
                </label>

                <input
                  value={titleEn}
                  onChange={(e) =>
                    setTitleEn(e.target.value)
                  }
                  className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                  placeholder="Senior Urban Planner"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Amharic Title
                </label>

                <input
                  value={titleAm}
                  onChange={(e) =>
                    setTitleAm(e.target.value)
                  }
                  className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                  placeholder="የሲኒየር ከተማ እቅድ አውጪ"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  English Content *
                </label>

                <textarea
                  value={contentEn}
                  onChange={(e) =>
                    setContentEn(e.target.value)
                  }
                  className="min-h-32 w-full rounded-lg border bg-background p-3 text-sm"
                  placeholder="Describe the vacancy..."
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Amharic Content
                </label>

                <textarea
                  value={contentAm}
                  onChange={(e) =>
                    setContentAm(e.target.value)
                  }
                  className="min-h-32 w-full rounded-lg border bg-background p-3 text-sm"
                  placeholder="የስራውን መግለጫ..."
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Category ID *
                </label>

                <input
                  type="number"
                  min="1"
                  value={categoryId}
                  onChange={(e) =>
                    setCategoryId(e.target.value)
                  }
                  className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                  required
                />

                <p className="mt-1 text-xs text-muted-foreground">
                  We will connect this to the category dropdown later.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Deadline
                </label>

                <input
                  type="date"
                  value={deadline}
                  onChange={(e) =>
                    setDeadline(e.target.value)
                  }
                  className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as
                        | "draft"
                        | "published"
                    )
                  }
                  className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                >
                  <option value="published">
                    Published
                  </option>
                  <option value="draft">
                    Draft
                  </option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Published At
                </label>

                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) =>
                    setPublishedAt(e.target.value)
                  }
                  className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Attachment
                </label>

                <input
                  type="file"
                  onChange={(e) =>
                    setFile(
                      e.target.files?.[0] ?? null
                    )
                  }
                  className="block w-full rounded-lg border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-5">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-secondary"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {editingId !== null
                  ? "Update Vacancy"
                  : "Create Vacancy"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl border bg-card shadow-soft">
        <div className="flex items-center gap-3 border-b p-4">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) =>
                setQ(e.target.value)
              }
              placeholder="Search vacancies..."
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
                  Status
                </th>

                <th className="px-5 py-3">
                  Deadline
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
                    colSpan={5}
                    className="px-5 py-10 text-center text-muted-foreground"
                  >
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                    Loading vacancies...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-muted-foreground"
                  >
                    No vacancies found.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr
                    key={v.id}
                    className="border-t"
                  >
                    <td className="px-5 py-3 font-medium">
                      {v.title?.en ||
                        v.title?.am ||
                        "Untitled vacancy"}
                    </td>

                    <td className="px-5 py-3 text-muted-foreground">
                      {v.category_id ?? "—"}
                    </td>

                    <td className="px-5 py-3">
                      <span className="rounded-full bg-accent px-2 py-1 text-[10px] font-semibold uppercase text-accent-foreground">
                        {v.status}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-muted-foreground">
                      {v.deadline
                        ? new Date(
                            v.deadline
                          ).toLocaleDateString()
                        : "No deadline"}
                    </td>

                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Edit"
                          onClick={() =>
                            openEditForm(v)
                          }
                          className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          aria-label="Delete"
                          onClick={() =>
                            handleDelete(v.id)
                          }
                          className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}