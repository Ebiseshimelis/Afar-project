import type { NewsItem } from "@/lib/mock-data";
import { API_BASE, getAdminToken } from "@/services/authService";

export type { NewsItem };

const NEWS_API_URL = `${API_BASE}/news`;

/*
|--------------------------------------------------------------------------
| News image URL helper
|--------------------------------------------------------------------------
|
| News images can come from two places:
|
| 1. Static frontend images:
|      News1.jpg
|      News2.jpg
|      News3.jpg
|
|    These are served by the frontend from "/".
|
| 2. Laravel uploaded images:
|      news/example.jpg
|      storage/news/example.jpg
|
|    These are served by Laravel from "/storage/".
|
*/

function getNewsImageUrl(
  path: string | null | undefined,
): string {
  if (path === null || path === undefined) {
    return "/News1.jpg";
  }

  const value = String(path).trim();

  if (!value) {
    return "/News1.jpg";
  }

  /*
   * Already a complete URL or browser-generated URL.
   */
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  const cleanPath = value.replace(/^\/+/, "");

  /*
   * Static frontend News images.
   *
   * Examples:
   *   News1.jpg
   *   News2.jpg
   *   News3.jpg
   *   News6.jpg
   */
  if (
    /^News\d+\.(jpg|jpeg|png|webp)$/i.test(cleanPath)
  ) {
    return `/${cleanPath}`;
  }

  /*
   * Laravel storage News images.
   *
   * Examples:
   *   news/example.jpg
   *   storage/news/example.jpg
   */
  const storagePath = cleanPath.replace(
    /^storage\/+/i,
    "",
  );

  const apiOrigin = API_BASE.replace(
    /\/api\/v1\/?$/i,
    "",
  );

  return `${apiOrigin}/storage/${storagePath}`;
}

const DEFAULT_NEWS_IMAGE = "/News1.jpg";

export type AdminNewsData = {
  id: string;
  titleEn: string;
  titleAm: string;
  contentEn: string;
  contentAm: string;
  categoryId: string;
  status: string;
  publishedAt: string;
  imagePath: string;
};

function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      }
    : {
        Accept: "application/json",
      };
}

/*
|--------------------------------------------------------------------------
| Public news mapper
|--------------------------------------------------------------------------
*/

function mapNewsItem(item: any): NewsItem {
  return {
    id: String(item.id),

    title:
      item.title_en ||
      item.title?.en ||
      "",

    excerpt:
      item.content_en?.substring(0, 120) ||
      item.content?.en?.substring(0, 120) ||
      "",

    body:
      item.content_en ||
      item.content?.en ||
      "",

    category:
      item.category?.name_en ||
      item.category?.name?.en ||
      item.category?.name ||
      "",

    date: item.published_at || "",

    image: getNewsImageUrl(
      item.image_path,
    ) || DEFAULT_NEWS_IMAGE,

    author:
      item.author?.name ||
      "",

    views:
      item.views || 0,
  };
}

/*
|--------------------------------------------------------------------------
| Get public news
|--------------------------------------------------------------------------
*/

export async function getNews(): Promise<NewsItem[]> {
  const response = await fetch(NEWS_API_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch news: ${response.status}`,
    );
  }

  const result = await response.json();

  if (!result || !Array.isArray(result.data)) {
    throw new Error("Invalid news API response");
  }

  return result.data.map(mapNewsItem);
}

/*
|--------------------------------------------------------------------------
| Get single public news
|--------------------------------------------------------------------------
*/

export async function getNewsById(
  id: string,
): Promise<NewsItem | null> {
  const response = await fetch(
    `${NEWS_API_URL}/${id}`,
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error(
      `Failed to fetch news: ${response.status}`,
    );
  }

  const result = await response.json();

  if (!result?.data) {
    return null;
  }

  return mapNewsItem(result.data);
}

/*
|--------------------------------------------------------------------------
| Admin mapper
|--------------------------------------------------------------------------
*/

function mapAdminNewsItem(
  item: any,
): AdminNewsData {
  return {
    id: String(item.id),

    titleEn:
      item.title_en ||
      item.title?.en ||
      "",

    titleAm:
      item.title_am ||
      item.title?.am ||
      "",

    contentEn:
      item.content_en ||
      item.content?.en ||
      "",

    contentAm:
      item.content_am ||
      item.content?.am ||
      "",

    categoryId:
      item.category_id != null
        ? String(item.category_id)
        : "",

    status:
      item.status ||
      "published",

    publishedAt:
      item.published_at ||
      "",

    imagePath:
      item.image_path ||
      "",
  };
}

/*
|--------------------------------------------------------------------------
| Get admin news
|--------------------------------------------------------------------------
*/

export async function getAdminNewsById(
  id: string,
): Promise<AdminNewsData> {
  const response = await fetch(
    `${NEWS_API_URL}/${id}`,
    {
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    let message =
      `Failed to fetch news: ${response.status}`;

    try {
      const result = await response.json();

      if (result?.message) {
        message = result.message;
      }
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  const result = await response.json();

  if (!result?.data) {
    throw new Error(
      "Invalid news response",
    );
  }

  return mapAdminNewsItem(
    result.data,
  );
}

/*
|--------------------------------------------------------------------------
| Build News FormData
|--------------------------------------------------------------------------
|
| Laravel receives:
|
| title[en]
| title[am]
| content[en]
| content[am]
| category_id
| status
| published_at
| image
|
*/

function buildNewsFormData(data: {
  titleEn: string;
  titleAm: string;
  contentEn: string;
  contentAm: string;
  categoryId: string;
  status: string;
  publishedAt: string;
  image?: File | null;
}) {
  const formData = new FormData();

  formData.append(
    "title[en]",
    data.titleEn,
  );

  formData.append(
    "title[am]",
    data.titleAm,
  );

  formData.append(
    "content[en]",
    data.contentEn,
  );

  formData.append(
    "content[am]",
    data.contentAm,
  );

  formData.append(
    "category_id",
    data.categoryId,
  );

  formData.append(
    "status",
    data.status,
  );

  /*
  |--------------------------------------------------------------------------
  | Published date
  |--------------------------------------------------------------------------
  */

  if (data.publishedAt) {
    formData.append(
      "published_at",
      data.publishedAt,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Image
  |--------------------------------------------------------------------------
  */

  if (data.image instanceof File) {
    formData.append(
      "image",
      data.image,
    );
  }

  return formData;
}

/*
|--------------------------------------------------------------------------
| Create News
|--------------------------------------------------------------------------
*/

export async function createNews(data: {
  titleEn: string;
  titleAm: string;
  contentEn: string;
  contentAm: string;
  categoryId: string;
  status: string;
  publishedAt: string;
  image?: File | null;
}) {
  const formData =
    buildNewsFormData(data);

  const response = await fetch(
    NEWS_API_URL,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    },
  );

  if (!response.ok) {
    let message =
      `Failed to create news: ${response.status}`;

    try {
      const result =
        await response.json();

      if (result?.message) {
        message = result.message;
      }

      if (result?.errors) {
        const errors = Object.values(
          result.errors,
        )
          .flat()
          .join(" ");

        if (errors) {
          message = errors;
        }
      }
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  const result =
    await response.json();

  if (!result?.data) {
    throw new Error(
      "Invalid create news response",
    );
  }

  return result.data;
}

/*
|--------------------------------------------------------------------------
| Update News
|--------------------------------------------------------------------------
*/

export async function updateNews(data: {
  id: string;
  titleEn: string;
  titleAm: string;
  contentEn: string;
  contentAm: string;
  categoryId: string;
  status: string;
  publishedAt: string;
  image?: File | null;
}) {
  const formData =
    buildNewsFormData(data);

  /*
   * Laravel method spoofing.
   *
   * We send POST + _method=PUT because
   * multipart/form-data with PUT can be
   * problematic in PHP/Laravel.
   */

  formData.append(
    "_method",
    "PUT",
  );

  const response = await fetch(
    `${NEWS_API_URL}/${data.id}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    },
  );

  if (!response.ok) {
    let message =
      `Failed to update news: ${response.status}`;

    try {
      const result =
        await response.json();

      if (result?.message) {
        message = result.message;
      }

      if (result?.errors) {
        const errors = Object.values(
          result.errors,
        )
          .flat()
          .join(" ");

        if (errors) {
          message = errors;
        }
      }
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  const result =
    await response.json();

  if (!result?.data) {
    throw new Error(
      "Invalid update news response",
    );
  }

  return result.data;
}

/*
|--------------------------------------------------------------------------
| Delete News
|--------------------------------------------------------------------------
*/

export async function deleteNews(
  id: string,
) {
  const response = await fetch(
    `${NEWS_API_URL}/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    let message =
      `Failed to delete news: ${response.status}`;

    try {
      const result =
        await response.json();

      if (result?.message) {
        message = result.message;
      }
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return true;
}
