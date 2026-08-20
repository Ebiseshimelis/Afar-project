import { getToken } from "@/services/authService";
export type VacancyItem = {
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

  deadline: string | null;

  status: "draft" | "published";

  published_at: string | null;

  created_at: string;
  updated_at: string;
};

export type CreateVacancyData = {
  category_id: number;

  title: {
    en: string;
    am: string;
  };

  content: {
    en: string;
    am: string;
  };

  deadline: string | null;

  status: "draft" | "published";

  published_at: string | null;

  file?: File | null;
};

export type UpdateVacancyData =
  Partial<CreateVacancyData>;

const API_BASE_URL =
  "http://127.0.0.1:8000/api/v1";

function getAuthHeaders(): HeadersInit {
  const token =
    getToken();

  return {
    Accept: "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

async function parseResponse(
  response: Response
) {
  const text = await response.text();

  console.log(
    "========== VACANCY API RESPONSE =========="
  );
  console.log("Status:", response.status);
  console.log("Response:", text);
  console.log(
    "=========================================="
  );

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
      const errors = Object.values(
        data.errors
      )
        .flat()
        .join(" ");

      if (errors) {
        message = errors;
      }
    }

    throw new Error(
      `${message} (HTTP ${response.status})`
    );
  }

  return data;
}

export async function getVacancies(
  admin = false
): Promise<VacancyItem[]> {
  const url = admin
    ? `${API_BASE_URL}/vacancies?admin=1`
    : `${API_BASE_URL}/vacancies`;

  const response = await fetch(url, {
    method: "GET",

    headers: getAuthHeaders(),
  });

  const result =
    await parseResponse(response);

  return Array.isArray(result?.data)
    ? result.data
    : [];
}

export async function getVacancy(
  id: string | number
): Promise<VacancyItem> {
  const response = await fetch(
    `${API_BASE_URL}/vacancies/${id}`,
    {
      method: "GET",

      headers: {
        Accept: "application/json",
      },
    }
  );

  const result =
    await parseResponse(response);

  if (!result?.data) {
    throw new Error(
      "Invalid vacancy response."
    );
  }

  return result.data;
}

function buildVacancyFormData(
  data:
    | CreateVacancyData
    | UpdateVacancyData
): FormData {
  const formData = new FormData();

  if (data.category_id !== undefined) {
    formData.append(
      "category_id",
      String(data.category_id)
    );
  }

  if (data.title !== undefined) {
    if (data.title.en !== undefined) {
      formData.append(
        "title[en]",
        data.title.en
      );
    }

    if (data.title.am !== undefined) {
      formData.append(
        "title[am]",
        data.title.am
      );
    }
  }

  if (data.content !== undefined) {
    if (data.content.en !== undefined) {
      formData.append(
        "content[en]",
        data.content.en
      );
    }

    if (data.content.am !== undefined) {
      formData.append(
        "content[am]",
        data.content.am
      );
    }
  }

  if (data.deadline !== undefined) {
    formData.append(
      "deadline",
      data.deadline ?? ""
    );
  }

  if (data.status !== undefined) {
    formData.append(
      "status",
      data.status
    );
  }

  if (data.published_at !== undefined) {
    formData.append(
      "published_at",
      data.published_at ?? ""
    );
  }

  if (
    data.file !== undefined &&
    data.file instanceof File
  ) {
    formData.append(
      "file",
      data.file
    );
  }

  return formData;
}

export async function createVacancy(
  data: CreateVacancyData
): Promise<VacancyItem> {
  const formData =
    buildVacancyFormData(data);

  const response = await fetch(
    `${API_BASE_URL}/vacancies`,
    {
      method: "POST",

      headers: getAuthHeaders(),

      body: formData,
    }
  );

  const result =
    await parseResponse(response);

  if (!result?.data) {
    throw new Error(
      "Invalid create vacancy response."
    );
  }

  return result.data;
}

export async function updateVacancy(
  id: string | number,
  data: UpdateVacancyData
): Promise<VacancyItem> {
  const formData =
    buildVacancyFormData(data);

  formData.append(
    "_method",
    "PUT"
  );

  const response = await fetch(
    `${API_BASE_URL}/vacancies/${id}`,
    {
      method: "POST",

      headers: getAuthHeaders(),

      body: formData,
    }
  );

  const result =
    await parseResponse(response);

  if (!result?.data) {
    throw new Error(
      "Invalid update vacancy response."
    );
  }

  return result.data;
}

export async function deleteVacancy(
  id: string | number
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/vacancies/${id}`,
    {
      method: "DELETE",

      headers: getAuthHeaders(),
    }
  );

  await parseResponse(response);

  return true;
}