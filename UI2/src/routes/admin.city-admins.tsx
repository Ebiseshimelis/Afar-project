import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useEffect, useRef, useState } from "react";
import {
  Building2,
  Edit,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  AdminLayout,
  AdminPageHeader,
} from "@/components/admin/AdminLayout";

import {
  createCityAdmin,
  deleteCityAdmin,
  getCityAdmins,
  updateCityAdmin,
  type CityAdmin,
  type CityAdminFormData,
} from "@/services/cityAdminService";

export const Route = createFileRoute("/admin/city-admins")({
  component: AdminCityAdminsPage,
});

const emptyForm: CityAdminFormData = {
  name: "",
  nameAm: "",
  description: "",
  descriptionAm: "",
  mayor_name: "",
  location: "",
  email: "",
  phone: "",
  image: null,
};

function AdminCityAdminsPage() {
  const { can } = useAuth();
  const [cities, setCities] = useState<CityAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] =
    useState<CityAdminFormData>(emptyForm);

  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadCities() {
    try {
      setLoading(true);

      const data = await getCityAdmins();
      setCities(data);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load city administrations.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCities();
  }, []);

  function resetForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setPreview("");
    setShowForm(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function openCreateForm() {
    if (!can("city_admins.create")) return;
    setForm({ ...emptyForm });
    setEditingId(null);
    setPreview("");
    setShowForm(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function openEditForm(city: CityAdmin) {
    if (!can("city_admins.update")) return;
    setEditingId(city.id);

    setForm({
      name: city.name,
      nameAm: city.nameAm || "",
      description: city.description,
      descriptionAm: city.descriptionAm || "",
      mayor_name: city.mayor_name,
      location: city.location,
      email: city.email,
      phone: city.phone,
      image: null,
    });

    setPreview(city.photo || "");
    setShowForm(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleChange(
    field: keyof CityAdminFormData,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2 MB.");

      event.target.value = "";

      return;
    }

    setForm((current) => ({
      ...current,
      image: file,
    }));

    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error(
        "English city administration name is required.",
      );
      return;
    }

    if (!form.nameAm.trim()) {
      toast.error(
        "Amharic city administration name is required.",
      );
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        const updated = await updateCityAdmin(
          editingId,
          form,
        );

        setCities((current) =>
          current.map((city) =>
            city.id === editingId
              ? updated
              : city,
          ),
        );

        toast.success(
          "City administration updated successfully.",
        );
      } else {
        const created = await createCityAdmin(form);

        setCities((current) => [
          ...current,
          created,
        ]);

        toast.success(
          "City administration created successfully.",
        );
      }

      resetForm();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save city administration.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(city: CityAdmin) {
    if (!can("city_admins.delete")) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete "${city.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCityAdmin(city.id);

      setCities((current) =>
        current.filter(
          (item) => item.id !== city.id,
        ),
      );

      toast.success(
        "City administration deleted successfully.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete city administration.",
      );
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="City Administrations"
        description="Manage city administrations, mayors, contact details, descriptions, and photos."
        action={
          can("city_admins.create") ? (
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add City Administration
            </button>
          ) : undefined
        }
      />

      {/* Form */}
      {showForm && (
        <section className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {editingId
                  ? "Edit City Administration"
                  : "Add City Administration"}
              </h2>

              <p className="text-sm text-muted-foreground">
                Enter the city administration information below.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
              className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Names */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Name â€” English *
                </label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    handleChange(
                      "name",
                      e.target.value,
                    )
                  }
                  placeholder="Semera City Administration"
                  className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Name â€” Amharic *
                </label>

                <input
                  value={form.nameAm}
                  onChange={(e) =>
                    handleChange(
                      "nameAm",
                      e.target.value,
                    )
                  }
                  placeholder="á‹¨áˆ°áˆ˜áˆ« áŠ¨á‰°áˆ› áŠ áˆµá‰°á‹³á‹°áˆ­"
                  className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description â€” English
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    handleChange(
                      "description",
                      e.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Describe the city administration..."
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description â€” Amharic
                </label>

                <textarea
                  value={form.descriptionAm}
                  onChange={(e) =>
                    handleChange(
                      "descriptionAm",
                      e.target.value,
                    )
                  }
                  rows={4}
                  placeholder="á‹¨áŠ¨á‰°áˆ› áŠ áˆµá‰°á‹³á‹°áˆ©áŠ• áˆ˜áŒáˆˆáŒ«..."
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Mayor / Location */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Mayor Name
                </label>

                <input
                  value={form.mayor_name}
                  onChange={(e) =>
                    handleChange(
                      "mayor_name",
                      e.target.value,
                    )
                  }
                  placeholder="Mayor name"
                  className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Location
                </label>

                <input
                  value={form.location}
                  onChange={(e) =>
                    handleChange(
                      "location",
                      e.target.value,
                    )
                  }
                  placeholder="Semera, Afar"
                  className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    handleChange(
                      "email",
                      e.target.value,
                    )
                  }
                  placeholder="info@example.gov.et"
                  className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone
                </label>

                <input
                  value={form.phone}
                  onChange={(e) =>
                    handleChange(
                      "phone",
                      e.target.value,
                    )
                  }
                  placeholder="033-666-0577"
                  className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                City Administration Photo
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-md border bg-background px-4 text-sm font-medium hover:bg-muted"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Choose Photo
                  </button>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Maximum file size: 2 MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t pt-5">
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="h-10 rounded-md border px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update City Administration"
                    : "Create City Administration"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Table */}
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">
            City Administration Entries
          </h2>

          <p className="text-sm text-muted-foreground">
            {cities.length} administration
            {cities.length === 1 ? "" : "s"}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading city administrations...
          </div>
        ) : cities.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="mx-auto h-10 w-10 text-muted-foreground" />

            <h3 className="mt-3 font-semibold">
              No city administrations
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Add the first city administration to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="px-5 py-3 text-left font-medium">
                    City Administration
                  </th>

                  <th className="px-5 py-3 text-left font-medium">
                    Mayor
                  </th>

                  <th className="px-5 py-3 text-left font-medium">
                    Location
                  </th>

                  <th className="px-5 py-3 text-left font-medium">
                    Contact
                  </th>

                  <th className="px-5 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {cities.map((city) => (
                  <tr
                    key={city.id}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {city.photo ? (
                          <img
                            src={city.photo}
                            alt={city.name}
                            className="h-12 w-12 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="font-medium">
                            {city.name}
                          </div>

                          {city.nameAm && (
                            <div className="mt-0.5 text-xs text-muted-foreground">
                              {city.nameAm}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {city.mayor_name || "â€”"}
                    </td>

                    <td className="px-5 py-4">
                      {city.location || "â€”"}
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        {city.email || "â€”"}
                      </div>

                      <div className="mt-1 text-xs text-muted-foreground">
                        {city.phone || "â€”"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {can("city_admins.update") && (
                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(city)
                            }
                            className="inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium hover:bg-muted"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </button>
                        )}

                        {can("city_admins.delete") && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(city)
                            }
                            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-destructive/30 px-3 text-xs font-medium text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
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
      </section>
    </AdminLayout>
  );
}
