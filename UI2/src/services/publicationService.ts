export type Publication = {
  id: number;
  category_id: number | null;
  created_by: number | null;

  title: {
    en?: string;
    am?: string;
  };

  description: {
    en?: string;
    am?: string;
  } | null;

  file_path: string | null;
  file_type: string | null;
  file_size: number;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreatePublicationData = {
  category_id: number;

  title: {
    en: string;
    am: string;
  };

  description: {
    en: string;
    am: string;
  };

  status: "draft" | "published";

  published_at: string | null;

  file?: File | null;
};

export type UpdatePublicationData =
  Partial<CreatePublicationData>;

const API_BASE_URL =
  "http://127.0.0.1:8000/api/v1";

function getAuthHeaders(): HeadersInit {
  const token =
    localStorage.getItem("admin_token");

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
    "========== PUBLICATION API RESPONSE =========="
  );
  console.log("Status:", response.status);
  console.log("Response:", text);
  console.log(
    "==============================================="
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

export async function getPublications(): Promise<Publication[]> {
  const response = await fetch(
    `${API_BASE_URL}/publications`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const result =
    await parseResponse(response);

  return Array.isArray(result?.data)
    ? result.data
    : [];
}

export async function getPublication(
  id: string | number
): Promise<Publication> {
  const response = await fetch(
    `${API_BASE_URL}/publications/${id}`,
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
      "Invalid publication response."
    );
  }

  return result.data;
}

function buildPublicationFormData(
  data:
    | CreatePublicationData
    | UpdatePublicationData
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

  if (data.description !== undefined) {
    if (data.description?.en !== undefined) {
      formData.append(
        "description[en]",
        data.description.en
      );
    }

    if (data.description?.am !== undefined) {
      formData.append(
        "description[am]",
        data.description.am
      );
    }
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

export async function createPublication(
  data: CreatePublicationData
): Promise<Publication> {
  const formData =
    buildPublicationFormData(data);

  const response = await fetch(
    `${API_BASE_URL}/publications`,
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
      "Invalid create publication response."
    );
  }

  return result.data;
}

export async function updatePublication(
  id: string | number,
  data: UpdatePublicationData
): Promise<Publication> {
  const formData =
    buildPublicationFormData(data);

  formData.append(
    "_method",
    "PUT"
  );

  const response = await fetch(
    `${API_BASE_URL}/publications/${id}`,
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
      "Invalid update publication response."
    );
  }

  return result.data;
}

export async function deletePublication(
  id: string | number
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/publications/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  await parseResponse(response);

  return true;
}
