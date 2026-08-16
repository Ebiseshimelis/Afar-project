import { getAdminToken } from "./authService";

export type Directorate = {
  id: number;

  name: string;
  nameAm: string;

  description: string;
  descriptionAm: string;

  headName: string;
  headNameAm: string;

  headTitle: string;
  headTitleAm: string;

  email: string;
  phone: string;

  // Director's profile photo
  photo: string;

  // Large hero/background image for the directorate
  background: string;

  sortOrder: number;
};

type ApiDirectorate = {
  id: number;

  name: {
    en?: string;
    am?: string;
  };

  description: {
    en?: string;
    am?: string;
  } | null;

  head_name: {
    en?: string;
    am?: string;
  } | null;

  head_title: {
    en?: string;
    am?: string;
  } | null;

  email: string | null;
  phone: string | null;

  photo_path: string | null;

  background_image: string | null;

  sort_order: number;
};

type ApiResponse = {
  data: ApiDirectorate[];
};

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

/**
 * Convert a Laravel public-storage path into
 * a browser URL.
 */
function makeStorageUrl(
  path: string | null,
  fallback: string
): string {
  if (!path) {
    return fallback;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  const cleanPath = path.replace(/^\/+/, "");

  return `http://127.0.0.1:8000/storage/${cleanPath}`;
}

/**
 * Convert the Laravel directorate object into
 * the format used by React.
 */
function mapDirectorate(
  d: ApiDirectorate
): Directorate {
  return {
    id: d.id,

    name: d.name?.en || "",
    nameAm: d.name?.am || "",

    description: d.description?.en || "",
    descriptionAm: d.description?.am || "",

    headName: d.head_name?.en || "",
    headNameAm: d.head_name?.am || "",

    headTitle: d.head_title?.en || "",
    headTitleAm: d.head_title?.am || "",

    email: d.email || "",
    phone: d.phone || "",

    // Director photo
    photo: makeStorageUrl(
      d.photo_path,
      "/land.jpg"
    ),

    // Directorate hero/background
    background: makeStorageUrl(
      d.background_image,
      "/land.jpg"
    ),

    sortOrder: d.sort_order ?? 0,
  };
}

/**
 * Authentication headers for admin operations.
 */
function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();

  if (!token) {
    throw new Error(
      "You are not logged in as an administrator."
    );
  }

  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * GET all directorates.
 */
export async function getDirectorates(): Promise<
  Directorate[]
> {
  const response = await fetch(
    `${API_BASE}/directorates`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      json?.message ||
        `Failed to fetch directorates: ${response.status}`
    );
  }

  return ((json?.data || []) as ApiDirectorate[])
    .map(mapDirectorate)
    .sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
}

/**
 * Data used by the create/edit form.
 */
export type DirectorateFormData = {
  name: string;
  nameAm: string;

  description: string;
  descriptionAm: string;

  headName: string;
  headNameAm: string;

  headTitle: string;
  headTitleAm: string;

  email: string;
  phone: string;

  sortOrder: number;

  // Director photo
  photo?: File | null;

  // Directorate hero/background
  background?: File | null;
};

/**
 * Build Laravel-compatible multipart form data.
 *
 * IMPORTANT:
 * Do not manually set Content-Type.
 * The browser creates the multipart boundary.
 */
function buildFormData(
  data: DirectorateFormData
): FormData {
  const formData = new FormData();

  // Directorate name
  formData.append(
    "name[en]",
    data.name.trim()
  );

  formData.append(
    "name[am]",
    data.nameAm.trim()
  );

  // Description
  formData.append(
    "description[en]",
    data.description.trim()
  );

  formData.append(
    "description[am]",
    data.descriptionAm.trim()
  );

  // Director name
  formData.append(
    "head_name[en]",
    data.headName.trim()
  );

  formData.append(
    "head_name[am]",
    data.headNameAm.trim()
  );

  // Director title
  formData.append(
    "head_title[en]",
    data.headTitle.trim()
  );

  formData.append(
    "head_title[am]",
    data.headTitleAm.trim()
  );

  // Contact
  if (data.email.trim()) {
    formData.append(
      "email",
      data.email.trim()
    );
  }

  if (data.phone.trim()) {
    formData.append(
      "phone",
      data.phone.trim()
    );
  }

  // Sort order
  formData.append(
    "sort_order",
    String(data.sortOrder)
  );

  // Director photo
  if (data.photo instanceof File) {
    formData.append(
      "photo",
      data.photo,
      data.photo.name
    );
  }

  // Directorate hero/background
  if (data.background instanceof File) {
    formData.append(
      "background",
      data.background,
      data.background.name
    );
  }

  return formData;
}

/**
 * Parse API response and return useful Laravel
 * validation/error messages.
 */
async function parseResponse(
  response: Response
) {
  const text = await response.text();

  console.log(
    "Directorate API raw response:",
    text
  );

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    console.error(
      "Response was not valid JSON:",
      text
    );
  }

  console.log(
    "Directorate API response:",
    {
      status: response.status,
      data,
    }
  );

  if (!response.ok) {
    const validationMessage =
      data?.errors &&
      Object.entries(data.errors)
        .map(([field, messages]) => {
          const messageList =
            Array.isArray(messages)
              ? messages.join(", ")
              : String(messages);

          return `${field}: ${messageList}`;
        })
        .join(" | ");

    throw new Error(
      validationMessage ||
        data?.message ||
        `Request failed with status ${response.status}.`
    );
  }

  return data;
}

/**
 * CREATE directorate.
 */
export async function createDirectorate(
  data: DirectorateFormData
): Promise<Directorate> {
  const response = await fetch(
    `${API_BASE}/directorates`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: buildFormData(data),
    }
  );

  const json = await parseResponse(response);

  if (!json?.data) {
    throw new Error(
      "Directorate was created but the server returned no data."
    );
  }

  return mapDirectorate(json.data);
}

/**
 * UPDATE directorate.
 *
 * Laravel receives this as POST + _method=PUT
 * because multipart PUT uploads can be problematic.
 */
export async function updateDirectorate(
  id: number,
  data: DirectorateFormData
): Promise<Directorate> {
  const formData = buildFormData(data);

  formData.append(
    "_method",
    "PUT"
  );

  const response = await fetch(
    `${API_BASE}/directorates/${id}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    }
  );

  const json = await parseResponse(response);

  if (!json?.data) {
    throw new Error(
      "Directorate was updated but the server returned no data."
    );
  }

  return mapDirectorate(json.data);
}

/**
 * DELETE directorate.
 */
export async function deleteDirectorate(
  id: number
): Promise<void> {
  const response = await fetch(
    `${API_BASE}/directorates/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  await parseResponse(response);
}
