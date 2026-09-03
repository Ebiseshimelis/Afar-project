import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import {
  AdminLayout,
  AdminPageHeader,
} from "@/components/admin/AdminLayout";
import {
  createMultimedia,
  deleteMultimedia,
  getMediaUrl,
  getMultimedia,
  updateMultimedia,
  type MultimediaItem,
} from "@/services/multimediaService";
import {
  Edit,
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/admin/multimedia",
)({
  component: AdminMultimediaPage,
});

type FormState = {
  title: string;
  description: string;
  type: "image" | "video";
  mediaUrl: string;
  videoUrl: string;
  status: "draft" | "published";
  file: File | null;
};

const initialForm: FormState = {
  title: "",
  description: "",
  type: "image",
  mediaUrl: "",
  videoUrl: "",
  status: "published",
  file: null,
};

function AdminMultimediaPage() {
  const { can } = useAuth();
  const [items, setItems] = useState<
    MultimediaItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState<MultimediaItem | null>(null);

  const [form, setForm] =
    useState<FormState>({
      ...initialForm,
    });

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  useEffect(() => {
    void loadMultimedia();
  }, []);

  async function loadMultimedia() {
    try {
      setLoading(true);

      const data =
        await getMultimedia();

      console.log(
        "Multimedia loaded:",
        data,
      );

      setItems(
        Array.isArray(data)
          ? data
          : [],
      );
    } catch (error) {
      console.error(
        "Failed to load multimedia:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load multimedia.",
      );
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    if (!can("multimedia.create")) return;

    setEditingItem(null);

    setForm({
      ...initialForm,
    });

    setShowForm(true);
  }

  function openEditForm(
    item: MultimediaItem,
  ) {
    if (!can("multimedia.update")) return;
    try {
      console.log(
        "Opening multimedia for edit:",
        item,
      );

      /*
       * Normalize the type.
       *
       * This protects the edit form if an older
       * database record contains "Image", "Video",
       * uppercase values, or an unexpected value.
       */
      const normalizedType =
        String(item.type ?? "")
          .toLowerCase() === "video"
          ? "video"
          : "image";

      /*
       * Normalize the status in the same way.
       */
      const normalizedStatus =
        String(item.status ?? "")
          .toLowerCase() === "draft"
          ? "draft"
          : "published";

      /*
       * Safely read the existing file path.
       */
      const filePath =
        typeof item.filePath ===
        "string"
          ? item.filePath
          : "";

      /*
       * Safely read the existing video URL.
       */
      const existingVideoUrl =
        typeof item.videoUrl ===
        "string"
          ? item.videoUrl
          : "";

      /*
       * For externally hosted images, preserve
       * the original URL.
       *
       * Do not use fileUrl here because fileUrl
       * may already contain /storage/.
       */
      let existingMediaUrl = "";

      if (
        normalizedType === "image" &&
        filePath &&
        /^https?:\/\//i.test(
          filePath,
        )
      ) {
        existingMediaUrl = filePath;
      }

      const nextForm: FormState = {
        title:
          typeof item.title ===
          "string"
            ? item.title
            : "",

        description:
          typeof item.description ===
          "string"
            ? item.description
            : "",

        type: normalizedType,

        mediaUrl:
          normalizedType === "image"
            ? existingMediaUrl
            : "",

        videoUrl:
          normalizedType === "video"
            ? existingVideoUrl
            : "",

        status:
          normalizedStatus,

        file: null,
      };

      console.log(
        "Edit form state:",
        nextForm,
      );

      /*
       * Set the item first, then the form,
       * then display the form.
       */
      setEditingItem(item);
      setForm(nextForm);
      setShowForm(true);
    } catch (error) {
      console.error(
        "Error opening multimedia edit form:",
        error,
      );

      toast.error(
        "Unable to open this multimedia item for editing.",
      );
    }
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingItem(null);

    setForm({
      ...initialForm,
    });
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0] ??
      null;

    setForm((current) => ({
      ...current,
      file,

      /*
       * Selecting a new file means we no longer
       * want to use an external URL.
       */
      mediaUrl: "",
      videoUrl: "",
    }));
  }

  function handleTypeChange(
    type: "image" | "video",
  ) {
    setForm((current) => ({
      ...current,

      type,

      /*
       * Changing the type resets the media
       * source because an image URL should not
       * be used as a video URL and vice versa.
       */
      file: null,
      mediaUrl: "",
      videoUrl: "",
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error(
        "Title is required.",
      );
      return;
    }

    /*
     * CREATE validation.
     *
     * During editing, an existing media source
     * is allowed to remain unchanged.
     */
    if (!editingItem) {
      if (
        form.type === "image" &&
        !form.file &&
        !form.mediaUrl.trim()
      ) {
        toast.error(
          "Please upload an image or enter an image URL.",
        );
        return;
      }

      if (
        form.type === "video" &&
        !form.file &&
        !form.videoUrl.trim()
      ) {
        toast.error(
          "Please upload a video or enter a video URL.",
        );
        return;
      }
    }

    try {
      setSaving(true);

      if (editingItem) {
        const updated =
          await updateMultimedia(
            editingItem.id,
            {
              title:
                form.title.trim(),

              description:
                form.description.trim(),

              type:
                form.type,

              status:
                form.status,

              file:
                form.file,

              /*
               * Only send an image URL when the
               * admin actually entered one.
               *
               * undefined means:
               * keep the existing backend value.
               */
              mediaUrl:
                form.type === "image"
                  ? form.mediaUrl.trim() ||
                    undefined
                  : undefined,

              /*
               * Only send a video URL when the
               * admin actually entered one.
               */
              videoUrl:
                form.type === "video"
                  ? form.videoUrl.trim() ||
                    undefined
                  : undefined,
            },
          );

        setItems((current) =>
          current.map((item) =>
            item.id === updated.id
              ? updated
              : item,
          ),
        );

        toast.success(
          "Multimedia updated successfully.",
        );
      } else {
        const created =
          await createMultimedia({
            title:
              form.title.trim(),

            description:
              form.description.trim(),

            type:
              form.type,

            mediaUrl:
              form.type === "image"
                ? form.mediaUrl.trim()
                : undefined,

            videoUrl:
              form.type === "video"
                ? form.videoUrl.trim()
                : undefined,

            status:
              form.status,

            file:
              form.file,
          });

        setItems((current) => [
          created,
          ...current,
        ]);

        toast.success(
          "Multimedia created successfully.",
        );
      }

      setShowForm(false);
      setEditingItem(null);

      setForm({
        ...initialForm,
      });

      /*
       * Reload from backend so the page always
       * reflects the actual database.
       */
      await loadMultimedia();
    } catch (error) {
      console.error(
        "Failed to save multimedia:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save multimedia.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    item: MultimediaItem,
  ) {
    if (!can("multimedia.delete")) return;
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${item.title}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item.id);

      await deleteMultimedia(
        item.id,
      );

      setItems((current) =>
        current.filter(
          (existing) =>
            existing.id !== item.id,
        ),
      );

      toast.success(
        "Multimedia deleted successfully.",
      );
    } catch (error) {
      console.error(
        "Failed to delete multimedia:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete multimedia.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Multimedia"
        description="Manage images and videos displayed on the public portal."
        action={
          can("multimedia.create") ? (
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Multimedia
            </button>
          ) : undefined
        }
      />

      {showForm && (
        <div className="mb-8 rounded-xl border bg-card p-6 shadow-soft">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {editingItem
                  ? "Edit Multimedia"
                  : "Add Multimedia"}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {editingItem
                  ? "Update the multimedia information. Leave the file or URL empty to keep the existing media."
                  : "Add an image or video from your computer or by URL."}
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium"
              >
                Title
              </label>

              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title:
                      event.target.value,
                  }))
                }
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                placeholder="Enter title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description:
                      event.target.value,
                  }))
                }
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                placeholder="Enter description"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Type
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    handleTypeChange(
                      "image",
                    )
                  }
                  className={
                    form.type === "image"
                      ? "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
                      : "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
                  }
                >
                  <ImageIcon className="h-4 w-4" />
                  Image
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleTypeChange(
                      "video",
                    )
                  }
                  className={
                    form.type === "video"
                      ? "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
                      : "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
                  }
                >
                  <Video className="h-4 w-4" />
                  Video
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="file"
                className="mb-2 block text-sm font-medium"
              >
                {form.type === "image"
                  ? "Upload Image"
                  : "Upload Video"}
              </label>

              <div className="rounded-lg border border-dashed p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Upload className="h-5 w-5" />

                  <span className="text-sm">
                    {form.file
                      ? form.file.name
                      : editingItem
                        ? "Choose a new file (optional)"
                        : "Choose a file from your computer"}
                  </span>
                </div>

                <input
                  id="file"
                  type="file"
                  accept={
                    form.type === "image"
                      ? "image/*"
                      : "video/*"
                  }
                  onChange={
                    handleFileChange
                  }
                  className="w-full text-sm"
                />
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              — OR —
            </div>

            <div>
              <label
                htmlFor="mediaUrl"
                className="mb-2 block text-sm font-medium"
              >
                {form.type === "image"
                  ? "Image URL"
                  : "Video URL"}
              </label>

              <input
                id="mediaUrl"
                type="url"
                value={
                  form.type === "image"
                    ? form.mediaUrl
                    : form.videoUrl
                }
                onChange={(event) => {
                  const value =
                    event.target.value;

                  setForm((current) => ({
                    ...current,

                    ...(current.type ===
                    "image"
                      ? {
                          mediaUrl:
                            value,
                          videoUrl:
                            "",
                        }
                      : {
                          videoUrl:
                            value,
                          mediaUrl:
                            "",
                        }),

                    file: null,
                  }));
                }}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                placeholder={
                  form.type === "image"
                    ? "https://example.com/image.jpg"
                    : "https://example.com/video.mp4"
                }
              />

              <p className="mt-1 text-xs text-muted-foreground">
                {editingItem
                  ? "Leave empty to keep the current media."
                  : "You can either upload a file from your computer or provide a public URL."}
              </p>
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium"
              >
                Status
              </label>

              <select
                id="status"
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status:
                      event.target
                        .value === "draft"
                        ? "draft"
                        : "published",
                  }))
                }
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
              >
                <option value="published">
                  Published
                </option>

                <option value="draft">
                  Draft
                </option>
              </select>
            </div>

            <div className="flex justify-end gap-3 border-t pt-5">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm text-primary-foreground disabled:opacity-50"
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {editingItem
                  ? "Update"
                  : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Multimedia Library
        </h2>

        <p className="text-sm text-muted-foreground">
          {items.length} item
          {items.length === 1
            ? ""
            : "s"}
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-card p-10 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />

          <p className="mt-3 text-sm text-muted-foreground">
            Loading multimedia...
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />

          <h3 className="mt-4 text-lg font-semibold">
            No multimedia yet
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your first image or video.
          </p>

          {can("multimedia.create") && (
            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              Add Multimedia
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MultimediaCard
              key={item.id}
              item={item}
              onEdit={() =>
                openEditForm(item)
              }
              onDelete={() =>
                handleDelete(item)
              }
              canEdit={can("multimedia.update")}
              canDelete={can("multimedia.delete")}
              deleting={
                deletingId ===
                item.id
              }
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

function MultimediaCard({
  item,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  deleting,
}: {
  item: MultimediaItem;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
  deleting: boolean;
}) {
  const normalizedType =
    String(item.type ?? "")
      .toLowerCase() === "video"
      ? "video"
      : "image";

  const imageUrl =
    typeof item.fileUrl ===
      "string" && item.fileUrl
      ? item.fileUrl
      : typeof item.filePath ===
            "string" &&
          item.filePath
        ? getMediaUrl(
            item.filePath,
          )
        : "";

  const videoUrl =
    typeof item.videoUrl ===
        "string" &&
      item.videoUrl
      ? item.videoUrl
      : typeof item.fileUrl ===
            "string" &&
          item.fileUrl
        ? item.fileUrl
        : typeof item.filePath ===
              "string" &&
            item.filePath
          ? getMediaUrl(
              item.filePath,
            )
          : "";

  const status =
    String(item.status ?? "")
      .toLowerCase() === "draft"
      ? "draft"
      : "published";

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="relative aspect-video bg-secondary">
        {normalizedType ===
          "image" &&
        imageUrl ? (
          <img
            src={imageUrl}
            alt={
              item.title ||
              "Multimedia image"
            }
            className="h-full w-full object-cover"
          />
        ) : normalizedType ===
            "video" &&
          videoUrl ? (
          <video
            controls
            className="h-full w-full object-cover"
          >
            <source
              src={videoUrl}
            />
            Your browser does not
            support video playback.
          </video>
        ) : (
          <div className="grid h-full place-items-center">
            {normalizedType ===
            "video" ? (
              <Video className="h-12 w-12 text-muted-foreground" />
            ) : (
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
        )}

        <div className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
          {normalizedType}
        </div>

        <div className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
          {status}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold">
          {item.title ||
            "Untitled"}
        </h3>

        {item.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        )}

        <div className="mt-4 flex justify-end gap-2 border-t pt-3">
          {canEdit && (<button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs hover:bg-secondary"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </button>
          )}

          {canDelete && (<button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-destructive disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}

            Delete
          </button>

          )}
        </div>
      </div>
    </div>
  );
}

