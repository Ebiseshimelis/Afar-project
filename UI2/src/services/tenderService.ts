import { getToken } from "@/services/authService";
export type Tender = {
  id: number;
  category_id: number | null;
  created_by: number | null;

  title: {
    en?: string;
    am?: string;
  };

  content: {
    en?: string;
    am?: string;
  };

  file_path: string | null;
  opens_at: string | null;
  closes_at: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateTenderData = {
  category_id: number | null;

  title: {
    en: string;
    am: string;
  };

  content: {
    en: string;
    am: string;
  };

  opens_at: string | null;
  closes_at: string | null;
  status: "draft" | "published";
  published_at: string | null;

  file?: File | null;
};

export type UpdateTenderData = Partial<CreateTenderData>;

const API_BASE_URL = "http://127.0.0.1:8001/api/v1";

/* -------------------------------------------------------------------------- */
/* Authentication                                                             */
/* -------------------------------------------------------------------------- */

function getAuthHeaders(): HeadersInit {
  const token = getToken();

  return {
    Accept: "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

/* -------------------------------------------------------------------------- */
/* API response parser                                                        */
/* -------------------------------------------------------------------------- */

async function parseResponse(response: Response) {
  const text = await response.text();

  console.log("========== TENDER API RESPONSE ==========");
  console.log("Status:", response.status);
  console.log("Status Text:", response.statusText);
  console.log("Response:", text);
  console.log("==========================================");

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    let message =
      data?.message ||
      data?.error ||
      text ||
      `API request failed: ${response.status}`;

    if (data?.errors) {
      const errors = Object.values(data.errors)
        .flat()
        .join(" ");

      if (errors) {
        message = errors;
      }
    }

    throw new Error(
      `${message} (HTTP ${response.status})`,
    );
  }

  return data;
}

/* -------------------------------------------------------------------------- */
/* Normalize tender                                                           */
/* -------------------------------------------------------------------------- */

function normalizeTender(tender: any): Tender {
  return {
    id: Number(tender.id),

    category_id:
      tender.category_id === null ||
      tender.category_id === undefined ||
      tender.category_id === ""
        ? null
        : Number(tender.category_id),

    created_by:
      tender.created_by === null ||
      tender.created_by === undefined ||
      tender.created_by === ""
        ? null
        : Number(tender.created_by),

    title:
      typeof tender.title === "object" &&
      tender.title !== null
        ? {
            en: tender.title.en ?? "",
            am: tender.title.am ?? "",
          }
        : {
            en: tender.title_en ?? "",
            am: tender.title_am ?? "",
          },

    content:
      typeof tender.content === "object" &&
      tender.content !== null
        ? {
            en: tender.content.en ?? "",
            am: tender.content.am ?? "",
          }
        : {
            en: tender.content_en ?? "",
            am: tender.content_am ?? "",
          },

    file_path:
      tender.file_path === null ||
      tender.file_path === undefined ||
      tender.file_path === ""
        ? null
        : String(tender.file_path),

    opens_at: tender.opens_at ?? null,

    closes_at: tender.closes_at ?? null,

    status: String(tender.status ?? ""),

    published_at:
      tender.published_at ?? null,

    created_at:
      tender.created_at ?? "",

    updated_at:
      tender.updated_at ?? "",
  };
}

/* -------------------------------------------------------------------------- */
/* Get all tenders                                                            */
/* -------------------------------------------------------------------------- */

export async function getTenders(): Promise<Tender[]> {
  const response = await fetch(
    `${API_BASE_URL}/tenders`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  const data = await parseResponse(response);

  const tenders = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  return tenders.map(normalizeTender);
}

/* -------------------------------------------------------------------------- */
/* Get one tender                                                             */
/* -------------------------------------------------------------------------- */

export async function getTender(
  id: string | number,
): Promise<Tender> {
  const response = await fetch(
    `${API_BASE_URL}/tenders/${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  const data = await parseResponse(response);

  if (!data?.data) {
    throw new Error(
      "Invalid tender response.",
    );
  }

  return normalizeTender(data.data);
}

/* -------------------------------------------------------------------------- */
/* Build FormData                                                             */
/* -------------------------------------------------------------------------- */

function buildTenderFormData(
  data: CreateTenderData | UpdateTenderData,
): FormData {
  const formData = new FormData();

  if (data.category_id !== undefined) {
    formData.append(
      "category_id",
      data.category_id === null
        ? ""
        : String(data.category_id),
    );
  }

  if (data.title !== undefined) {
    if (data.title.en !== undefined) {
      formData.append(
        "title[en]",
        data.title.en,
      );
    }

    if (data.title.am !== undefined) {
      formData.append(
        "title[am]",
        data.title.am,
      );
    }
  }

  if (data.content !== undefined) {
    if (data.content.en !== undefined) {
      formData.append(
        "content[en]",
        data.content.en,
      );
    }

    if (data.content.am !== undefined) {
      formData.append(
        "content[am]",
        data.content.am,
      );
    }
  }

  if (data.opens_at !== undefined) {
    formData.append(
      "opens_at",
      data.opens_at ?? "",
    );
  }

  if (data.closes_at !== undefined) {
    formData.append(
      "closes_at",
      data.closes_at ?? "",
    );
  }

  if (data.status !== undefined) {
    formData.append(
      "status",
      data.status,
    );
  }

  if (data.published_at !== undefined) {
    formData.append(
      "published_at",
      data.published_at ?? "",
    );
  }

  if (
    data.file !== undefined &&
    data.file instanceof File
  ) {
    formData.append(
      "file",
      data.file,
    );
  }

  return formData;
}

/* -------------------------------------------------------------------------- */
/* Create tender                                                              */
/* -------------------------------------------------------------------------- */

export async function createTender(
  data: CreateTenderData,
): Promise<Tender> {
  const formData =
    buildTenderFormData(data);

  const response = await fetch(
    `${API_BASE_URL}/tenders`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    },
  );

  const result =
    await parseResponse(response);

  if (!result?.data) {
    throw new Error(
      "Invalid create tender response.",
    );
  }

  return normalizeTender(result.data);
}

/* -------------------------------------------------------------------------- */
/* Update tender                                                              */
/* -------------------------------------------------------------------------- */

export async function updateTender(
  id: string | number,
  data: UpdateTenderData,
): Promise<Tender> {
  const formData =
    buildTenderFormData(data);

  formData.append(
    "_method",
    "PUT",
  );

  const response = await fetch(
    `${API_BASE_URL}/tenders/${id}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    },
  );

  const result =
    await parseResponse(response);

  if (!result?.data) {
    throw new Error(
      "Invalid update tender response.",
    );
  }

  return normalizeTender(result.data);
}

/* -------------------------------------------------------------------------- */
/* Delete tender                                                              */
/* -------------------------------------------------------------------------- */

export async function deleteTender(
  id: string | number,
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/tenders/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  await parseResponse(response);

  return true;
}

/* -------------------------------------------------------------------------- */
/* Calendar-based tender status                                               */
/* -------------------------------------------------------------------------- */

/**
 * This is deliberately based on the calendar.
 *
 * Future closing date  -> Open
 * Past closing date    -> Closed
 * No closing date      -> Open
 */
export function getTenderStatus(
  tender: Tender,
): "Open" | "Closed" {
  if (!tender.closes_at) {
    return "Open";
  }

  const closeDate =
    new Date(tender.closes_at).getTime();

  if (Number.isNaN(closeDate)) {
    return "Open";
  }

  return closeDate >= Date.now()
    ? "Open"
    : "Closed";
}