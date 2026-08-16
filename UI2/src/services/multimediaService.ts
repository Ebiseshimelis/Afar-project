export type MultimediaItem = {
  id: number;
  title: string;
  description: string | null;
  type: "image" | "video";
  filePath: string | null;
  fileUrl: string | null;
  videoUrl: string | null;
  thumbnail: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
  uploadedBy: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateMultimediaData = {
  title: string;
  description?: string;
  type: "image" | "video";
  file?: File | null;
  mediaUrl?: string;
  videoUrl?: string;
  thumbnail?: string;
  status: "draft" | "published";
  publishedAt?: string;
};

export type UpdateMultimediaData = {
  title?: string;
  description?: string;
  type?: "image" | "video";
  file?: File | null;
  mediaUrl?: string;
  videoUrl?: string;
  thumbnail?: string;
  status?: "draft" | "published";
  publishedAt?: string;
};

export const API_BASE_URL =
  "http://127.0.0.1:8000/api/v1";

export const BACKEND_BASE_URL =
  "http://127.0.0.1:8000";

export const MAX_VIDEO_SIZE = 200 * 1024 * 1024;

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("admin_token");

  return {
    Accept: "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

/**
 * Converts a backend/local storage path into a browser URL.
 *
 * Examples:
 *
 * multimedia/photo.jpg
 * -> http://127.0.0.1:8000/storage/multimedia/photo.jpg
 *
 * https://example.com/photo.jpg
 * -> unchanged
 */
export function getMediaUrl(
  path: string | null | undefined,
): string {
  if (!path) {
    return "";
  }

  const value = String(path).trim();

  if (!value) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  const cleanPath = value
    .replace(/^\/+/, "")
    .replace(/^storage\/+/i, "");

  return `${BACKEND_BASE_URL}/storage/${cleanPath}`;
}

function normalizeMultimedia(item: any): MultimediaItem {
  return {
    id: Number(item.id),
    title: item.title ?? "",
    description: item.description ?? null,
    type: item.type === "video" ? "video" : "image",

    filePath: item.file_path ?? null,

    /*
     * IMPORTANT:
     * The backend already creates this browser-ready URL.
     */
    fileUrl:
      item.file_url ??
      getMediaUrl(item.file_path),

    videoUrl: item.video_url ?? null,

    thumbnail: item.thumbnail
      ? getMediaUrl(item.thumbnail)
      : null,

    status:
      item.status === "draft"
        ? "draft"
        : "published",

    publishedAt:
      item.published_at ?? null,

    uploadedBy:
      item.uploaded_by ?? null,

    createdAt:
      item.created_at ?? "",

    updatedAt:
      item.updated_at ?? "",
  };
}

async function parseResponse(
  response: Response,
) {
  const text = await response.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      `Server returned an invalid response (${response.status}).`,
    );
  }

  if (!response.ok) {
    let message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}.`;

    if (data?.errors) {
      const validationErrors = Object.values(
        data.errors,
      )
        .flat()
        .filter(Boolean)
        .join(" ");

      if (validationErrors) {
        message = validationErrors;
      }
    }

    throw new Error(
      `${message} (HTTP ${response.status})`,
    );
  }

  return data;
}

function getItems(result: any): any[] {
  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  return [];
}

export async function getMultimedia(): Promise<
  MultimediaItem[]
> {
  const response = await fetch(
    `${API_BASE_URL}/multimedia`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const result = await parseResponse(response);

  return getItems(result).map(normalizeMultimedia);
}

export async function getMultimediaItem(
  id: string | number,
): Promise<MultimediaItem> {
  const response = await fetch(
    `${API_BASE_URL}/multimedia/${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const result = await parseResponse(response);

  return normalizeMultimedia(
    result?.data ?? result,
  );
}

export async function createMultimedia(
  data: CreateMultimediaData,
): Promise<MultimediaItem> {
  const formData = new FormData();

  formData.append(
    "title",
    data.title,
  );

  formData.append(
    "description",
    data.description ?? "",
  );

  formData.append(
    "type",
    data.type,
  );

  formData.append(
    "status",
    data.status,
  );

  /*
   * External media URL.
   *
   * This works for BOTH:
   * - images
   * - videos
   */
  if (data.mediaUrl?.trim()) {
    formData.append(
      "media_url",
      data.mediaUrl.trim(),
    );
  }

  /*
   * Video URL is kept separately because
   * the backend uses video_url for videos.
   */
  if (data.videoUrl?.trim()) {
    formData.append(
      "video_url",
      data.videoUrl.trim(),
    );
  }

  if (data.thumbnail?.trim()) {
    formData.append(
      "thumbnail",
      data.thumbnail.trim(),
    );
  }

  if (data.publishedAt) {
    formData.append(
      "published_at",
      data.publishedAt,
    );
  }

  /*
   * Local PC file.
   */
  if (data.file instanceof File) {
    formData.append(
      "file",
      data.file,
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/multimedia`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    },
  );

  const result = await parseResponse(response);

  return normalizeMultimedia(
    result?.data ?? result,
  );
}

export async function updateMultimedia(
  id: number,
  data: UpdateMultimediaData,
): Promise<MultimediaItem> {
  const formData = new FormData();

  formData.append(
    "_method",
    "PUT",
  );

  if (data.title !== undefined) {
    formData.append(
      "title",
      data.title,
    );
  }

  if (data.description !== undefined) {
    formData.append(
      "description",
      data.description,
    );
  }

  if (data.type !== undefined) {
    formData.append(
      "type",
      data.type,
    );
  }

  if (data.status !== undefined) {
    formData.append(
      "status",
      data.status,
    );
  }

  /*
   * External image/video URL.
   */
  if (data.mediaUrl !== undefined) {
    formData.append(
      "media_url",
      data.mediaUrl,
    );
  }

  if (data.videoUrl !== undefined) {
    formData.append(
      "video_url",
      data.videoUrl,
    );
  }

  if (data.thumbnail !== undefined) {
    formData.append(
      "thumbnail",
      data.thumbnail,
    );
  }

  if (data.publishedAt !== undefined) {
    formData.append(
      "published_at",
      data.publishedAt,
    );
  }

  /*
   * Local PC file.
   */
  if (data.file instanceof File) {
    formData.append(
      "file",
      data.file,
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/multimedia/${id}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    },
  );

  const result = await parseResponse(response);

  return normalizeMultimedia(
    result?.data ?? result,
  );
}

export async function deleteMultimedia(
  id: number,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/multimedia/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  await parseResponse(response);
}
