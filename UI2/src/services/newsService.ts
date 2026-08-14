import type { NewsItem } from "@/lib/mock-data";
import { getAdminToken } from "@/services/authService";

const NEWS_API_URL = "http://127.0.0.1:8000/api/v1/news";

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
|
| DO NOT CHANGE THE EXISTING IMAGE LOADER LOGIC.
|
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

    // Existing image loader — KEEP THIS.
    image:
      item.image_path
        ? String(item.image_path).startsWith("news/")
          ? `http://127.0.0.1:8000/storage/${String(item.image_path)}`
          : `/${String(item.image_path).replace(/^\/+/, "")}`
        : "/News1.jpg",

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
      `Failed to fetch news: ${response.status}`
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
  id: string
): Promise<NewsItem | null> {
  const response = await fetch(
    `${NEWS_API_URL}/${id}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error(
      `Failed to fetch news: ${response.status}`
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
  item: any
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
  id: string
): Promise<AdminNewsData> {
  const response = await fetch(
    `${NEWS_API_URL}/${id}`,
    {
      headers: getAuthHeaders(),
    }
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
      "Invalid news response"
    );
  }

  return mapAdminNewsItem(
    result.data
  );
}

/*
|--------------------------------------------------------------------------
| Build News FormData
|--------------------------------------------------------------------------
|
| This is important.
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
    data.titleEn
  );

  formData.append(
    "title[am]",
    data.titleAm
  );

  formData.append(
    "content[en]",
    data.contentEn
  );

  formData.append(
    "content[am]",
    data.contentAm
  );

  formData.append(
    "category_id",
    data.categoryId
  );

  formData.append(
    "status",
    data.status
  );

  /*
  |--------------------------------------------------------------------------
  | Published date
  |--------------------------------------------------------------------------
  |
  | datetime-local gives:
  |
  | 2026-08-14T15:30
  |
  | Laravel accepts this as a date.
  |
  */

  if (data.publishedAt) {
    formData.append(
      "published_at",
      data.publishedAt
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
      data.image
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
    }
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
          result.errors
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
      "Invalid create news response"
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
    "PUT"
  );

  const response = await fetch(
    `${NEWS_API_URL}/${data.id}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    }
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
          result.errors
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
      "Invalid update news response"
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
  id: string
) {
  const response = await fetch(
    `${NEWS_API_URL}/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
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