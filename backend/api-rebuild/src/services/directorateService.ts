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
  photo: string;
  sortOrder: number;
};

type ApiDirectorate = {
  id: number;
  name: {
    en?: string;
    am?: string;
  } | null;
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
  sort_order: number;
};

type ApiResponse = {
  data: ApiDirectorate[];
};

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

function makePhotoUrl(path: string | null): string {
  if (!path) {
    return "/land.jpg";
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

    photo: makePhotoUrl(d.photo_path),

    sortOrder: d.sort_order ?? 0,
  };
}

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

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Failed to fetch directorates: ${response.status}`
    );
  }

  return (data?.data || [])
    .map(mapDirectorate)
    .sort(
      (a: Directorate, b: Directorate) =>
        a.sortOrder - b.sortOrder
    );
}

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
  photo?: File | null;
};

function buildFormData(
  data: DirectorateFormData
): FormData {
  const formData = new FormData();

  /*
   * Laravel receives these as nested arrays:
   *
   * name[en]
   * name[am]
   *
   * description[en]
   * description[am]
   *
   * etc.
   */

  formData.append("name[en]", data.name.trim());
  formData.append("name[am]", data.nameAm.trim());

  formData.append(
    "description[en]",
    data.description.trim()
  );

  formData.append(
    "description[am]",
    data.descriptionAm.trim()
  );

  formData.append(
    "head_name[en]",
    data.headName.trim()
  );

  formData.append(
    "head_name[am]",
    data.headNameAm.trim()
  );

  formData.append(
    "head_title[en]",
    data.headTitle.trim()
  );

  formData.append(
    "head_title[am]",
    data.headTitleAm.trim()
  );

  if (data.email.trim()) {
    formData.append("email", data.email.trim());
  }

  if (data.phone.trim()) {
    formData.append("phone", data.phone.trim());
  }

  formData.append(
    "sort_order",
    String(data.sortOrder || 0)
  );

  if (data.photo instanceof File) {
    formData.append("photo", data.photo);
  }

  return formData;
}

async function parseResponse(
  response: Response
) {
  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    console.error(
      "Directorate API error:",
      response.status,
      data
    );

    if (data?.errors) {
      const validationMessages = Object.entries(
        data.errors
      )
        .flatMap(([field, messages]) => {
          if (Array.isArray(messages)) {
            return messages.map(
              (message) => `${field}: ${message}`
            );
          }

          return [`${field}: ${messages}`];
        })
        .join(" ");

      throw new Error(
        validationMessages ||
          data?.message ||
          `Request failed with status ${response.status}.`
      );
    }

    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}.`
    );
  }

  return data;
}

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

  return mapDirectorate(json.data);
}

export async function updateDirectorate(
  id: number,
  data: DirectorateFormData
): Promise<Directorate> {
  const formData = buildFormData(data);

  /*
   * Laravel method spoofing.
   * This allows us to upload a photo while
   * still executing the PUT controller method.
   */
  formData.append("_method", "PUT");

  const response = await fetch(
    `${API_BASE}/directorates/${id}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    }
  );

  const json = await parseResponse(response);

  return mapDirectorate(json.data);
}

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