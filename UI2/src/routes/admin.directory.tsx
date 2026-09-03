import { createFileRoute } from "@tanstack/react-router";
import {
  AdminLayout,
  AdminPageHeader,
} from "@/components/admin/AdminLayout";

import {
  createDirectorate,
  deleteDirectorate,
  getDirectorates,
  updateDirectorate,
  type Directorate,
  type DirectorateFormData,
} from "@/services/directorateService";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Mail,
  Phone,
  X,
  Upload,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/directory")({
  head: () => ({
    meta: [
      { title: "Directorate Management" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DirectoryAdmin,
});

const emptyForm: DirectorateFormData = {
  name: "",
  nameAm: "",
  description: "",
  descriptionAm: "",
  headName: "",
  headNameAm: "",
  headTitle: "",
  headTitleAm: "",
  email: "",
  phone: "",
  sortOrder: 0,
  photo: null,
  background: null,
};

function DirectoryAdmin() {
  const { can } = useAuth();
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDirectorate, setEditingDirectorate] =
    useState<Directorate | null>(null);

  const [form, setForm] =
    useState<DirectorateFormData>(emptyForm);

  async function loadDirectorates() {
    try {
      setLoading(true);
      setError("");

      const data = await getDirectorates();
      setDirectorates(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load directorates."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDirectorates();
  }, []);

  function openCreateModal() {
    setEditingDirectorate(null);

    setForm({
      ...emptyForm,
      sortOrder: directorates.length + 1,
    });

    setModalOpen(true);
  }

  function openEditModal(directorate: Directorate) {
    setEditingDirectorate(directorate);

    setForm({
      name: directorate.name,
      nameAm: directorate.nameAm,
      description: directorate.description,
      descriptionAm: directorate.descriptionAm,
      headName: directorate.headName,
      headNameAm: directorate.headNameAm,
      headTitle: directorate.headTitle,
      headTitleAm: directorate.headTitleAm,
      email: directorate.email,
      phone: directorate.phone,
      sortOrder: directorate.sortOrder,
      photo: null,
      background: null,
    });

    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingDirectorate(null);
    setForm(emptyForm);
  }

  function updateField(
    field: keyof DirectorateFormData,
    value: string | number | File | null
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("English directorate name is required.");
      return;
    }

    try {
      setSaving(true);

      if (editingDirectorate) {
        await updateDirectorate(
          editingDirectorate.id,
          form
        );

        toast.success("Directorate updated successfully.");
      } else {
        await createDirectorate(form);

        toast.success("Directorate created successfully.");
      }

      closeModal();
      await loadDirectorates();
    } catch (err) {
      console.error(err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to save directorate."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(directorate: Directorate) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${directorate.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(directorate.id);

      await deleteDirectorate(directorate.id);

      toast.success("Directorate deleted successfully.");

      await loadDirectorates();
    } catch (err) {
      console.error(err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to delete directorate."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = directorates.filter((directorate) => {
    const search = q.toLowerCase().trim();

    if (!search) return true;

    return (
      directorate.name.toLowerCase().includes(search) ||
      directorate.nameAm.toLowerCase().includes(search) ||
      directorate.headName.toLowerCase().includes(search) ||
      directorate.headNameAm.toLowerCase().includes(search)
    );
  });

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Directorate Management"
        description="Manage the bureau's directorates, directors, contact information, and organizational details."
        action={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Directorate
          </button>
        }
      />

      <div className="rounded-xl border bg-card shadow-soft">
        {/* Search */}
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search directorates..."
              className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            {loading
              ? "Loading..."
              : `${filtered.length} directorate${
                  filtered.length === 1 ? "" : "s"
                }`}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <p className="font-medium">
              Unable to load directorates
            </p>

            <p className="mt-1">{error}</p>

            <button
              type="button"
              onClick={loadDirectorates}
              className="mt-3 rounded-md border px-3 py-1.5 text-xs"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading directorates...
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm font-medium">
              No directorates found
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or create a new directorate.
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Director</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((directorate) => (
                  <tr
                    key={directorate.id}
                    className="border-t"
                  >
                    <td className="px-5 py-4">
                      <div className="max-w-md">
                        <div className="font-medium">
                          {directorate.name}
                        </div>

                        {directorate.nameAm && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {directorate.nameAm}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={directorate.photo}
                          alt={directorate.headName}
                          loading="lazy"
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
                          onError={(e) => {
                            e.currentTarget.src = "/land.jpg";
                          }}
                        />

                        <div>
                          <div className="font-medium">
                            {directorate.headName || "—"}
                          </div>

                          {directorate.headNameAm && (
                            <div className="text-xs text-muted-foreground">
                              {directorate.headNameAm}
                            </div>
                          )}

                          {directorate.headTitle && (
                            <div className="text-xs text-muted-foreground">
                              {directorate.headTitle}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {directorate.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          {directorate.phone}
                        </div>
                      )}

                      {directorate.email && (
                        <div className="mt-1 flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          {directorate.email}
                        </div>
                      )}

                      {!directorate.phone &&
                        !directorate.email &&
                        "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                        {directorate.sortOrder}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {can("directorates.update") && (
                          <button
                            type="button"
                            aria-label={`Edit ${directorate.name}`}
                            title="Edit Directorate"
                            onClick={() =>
                              openEditModal(directorate)
                            }
                            className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}

                        {can("directorates.delete") && (
                          <button
                            type="button"
                            aria-label={`Delete ${directorate.name}`}
                            title="Delete Directorate"
                            disabled={
                              deletingId === directorate.id
                            }
                            onClick={() =>
                              handleDelete(directorate)
                            }
                            className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10 disabled:opacity-50"
                          >
                            {deletingId === directorate.id ? (
                              <span className="text-xs">...</span>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border bg-card shadow-xl">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingDirectorate
                    ? "Edit Directorate"
                    : "New Directorate"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {editingDirectorate
                    ? "Update the directorate information."
                    : "Add a new directorate to the bureau."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-6"
            >
              {/* Names */}
              <section>
                <h3 className="mb-3 font-medium">
                  Directorate Name
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    label="Name (English)"
                    required
                    value={form.name}
                    onChange={(value) =>
                      updateField("name", value)
                    }
                  />

                  <FormField
                    label="Name (Amharic)"
                    value={form.nameAm}
                    onChange={(value) =>
                      updateField("nameAm", value)
                    }
                  />
                </div>
              </section>

              {/* Description */}
              <section>
                <h3 className="mb-3 font-medium">
                  Description
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormTextarea
                    label="Description (English)"
                    value={form.description}
                    onChange={(value) =>
                      updateField("description", value)
                    }
                  />

                  <FormTextarea
                    label="Description (Amharic)"
                    value={form.descriptionAm}
                    onChange={(value) =>
                      updateField("descriptionAm", value)
                    }
                  />
                </div>
              </section>

              {/* Director */}
              <section>
                <h3 className="mb-3 font-medium">
                  Director Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    label="Director Name (English)"
                    value={form.headName}
                    onChange={(value) =>
                      updateField("headName", value)
                    }
                  />

                  <FormField
                    label="Director Name (Amharic)"
                    value={form.headNameAm}
                    onChange={(value) =>
                      updateField("headNameAm", value)
                    }
                  />

                  <FormField
                    label="Director Title (English)"
                    value={form.headTitle}
                    onChange={(value) =>
                      updateField("headTitle", value)
                    }
                  />

                  <FormField
                    label="Director Title (Amharic)"
                    value={form.headTitleAm}
                    onChange={(value) =>
                      updateField("headTitleAm", value)
                    }
                  />
                </div>
              </section>

              {/* Contact */}
              <section>
                <h3 className="mb-3 font-medium">
                  Contact Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(value) =>
                      updateField("email", value)
                    }
                  />

                  <FormField
                    label="Phone"
                    value={form.phone}
                    onChange={(value) =>
                      updateField("phone", value)
                    }
                  />

                  <FormField
                    label="Sort Order"
                    type="number"
                    value={String(form.sortOrder)}
                    onChange={(value) =>
                      updateField(
                        "sortOrder",
                        Number(value)
                      )
                    }
                  />
                </div>
              </section>

              {/* Director Photo */}
              <section>
                <h3 className="mb-3 font-medium">
                  Director Photo
                </h3>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4 hover:bg-secondary">
                  <Upload className="h-5 w-5 text-muted-foreground" />

                  <div>
                    <div className="text-sm font-medium">
                      Choose photo
                    </div>

                    <div className="text-xs text-muted-foreground">
                      JPG, PNG or WebP. Maximum 2 MB.
                    </div>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file =
                        event.target.files?.[0] || null;

                      updateField("photo", file);
                    }}
                  />
                </label>

                {form.photo && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Selected: {form.photo.name}
                  </p>
                )}
              </section>

              {/* Background Image */}
              <section>
                <h3 className="mb-3 font-medium">
                  Directorate Background Image
                </h3>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4 hover:bg-secondary">
                  <Upload className="h-5 w-5 text-muted-foreground" />

                  <div>
                    <div className="text-sm font-medium">
                      Choose background image
                    </div>

                    <div className="text-xs text-muted-foreground">
                      JPG, PNG or WebP. Maximum 5 MB.
                    </div>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file =
                        event.target.files?.[0] || null;

                      updateField("background", file);
                    }}
                  />
                </label>

                {form.background && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Selected: {form.background.name}
                  </p>
                )}
              </section>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingDirectorate
                      ? "Update Directorate"
                      : "Create Directorate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function FormField({
  label,
  value,
  onChange,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}
        {required && (
          <span className="ml-1 text-destructive">*</span>
        )}
      </span>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2"
      />
    </label>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
      />
    </label>
  );
}



