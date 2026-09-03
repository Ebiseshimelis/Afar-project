import { getToken } from "@/services/authService";
export type CityAdmin = {
  id: string;
  name: string;
  nameAm?: string;
  description: string;
  descriptionAm?: string;
  mayor_name: string;
  location: string;
  email: string;
  phone: string;
  photo: string;
};

export type CityAdminFormData = {
  name: string;
  nameAm: string;
  description: string;
  descriptionAm: string;
  mayor_name: string;
  location: string;
  email: string;
  phone: string;
  image?: File | null;
};

const API_BASE_URL = "http://127.0.0.1:8001/api/v1";

function mapCityAdmin(item: any): CityAdmin {
  return {
    id: String(item.id),

    name: item.name?.en || item.name_en || "",
    nameAm: item.name?.am || item.name_am || "",

    description: item.description?.en || "",
    descriptionAm: item.description?.am || "",

    mayor_name: item.mayor_name || "",
    location: item.location || "",
    email: item.email || "",
    phone: item.phone || "",

    photo: item.image_path
      ? String(item.image_path).startsWith("http")
        ? String(item.image_path)
        : String(item.image_path).startsWith("/storage/")
          ? `http://127.0.0.1:8001${String(item.image_path)}`
          : String(item.image_path).startsWith("storage/")
            ? `http://127.0.0.1:8001/${String(item.image_path)}`
            : String(item.image_path).includes("city-admins/")
              ? `http://127.0.0.1:8001/storage/${String(
                item.image_path
              ).replace(/^\/+/, "")}`
           : String(item.image_path)
    : "",
  };
}

/*
|--------------------------------------------------------------------------
| READ
|--------------------------------------------------------------------------
*/

export async function getCityAdmins(): Promise<CityAdmin[]> {
  const response = await fetch(`${API_BASE_URL}/city-admins`, {
    headers: {
      Accept: "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Failed to fetch city administrations."
    );
  }

  return (result.data || []).map(mapCityAdmin);
}

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export async function createCityAdmin(
  form: CityAdminFormData
): Promise<CityAdmin> {
  const body = new FormData();

  body.append("name[en]", form.name);
  body.append("name[am]", form.nameAm);

  body.append("description[en]", form.description);
  body.append("description[am]", form.descriptionAm);

  body.append("mayor_name", form.mayor_name);
  body.append("location", form.location);
  body.append("email", form.email);
  body.append("phone", form.phone);

  if (form.image) {
    body.append("image", form.image);
  }

  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/city-admins`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    body,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Failed to create city administration."
    );
  }

  return mapCityAdmin(result.data);
}

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export async function updateCityAdmin(
  id: string,
  form: CityAdminFormData
): Promise<CityAdmin> {
  const body = new FormData();

  body.append("name[en]", form.name);
  body.append("name[am]", form.nameAm);

  body.append("description[en]", form.description);
  body.append("description[am]", form.descriptionAm);

  body.append("mayor_name", form.mayor_name);
  body.append("location", form.location);
  body.append("email", form.email);
  body.append("phone", form.phone);

  if (form.image) {
    body.append("image", form.image);
  }

  /*
   * Laravel receives multipart PUT/PATCH reliably
   * through POST + _method.
   */
  body.append("_method", "PUT");

  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/city-admins/${id}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
      body,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Failed to update city administration."
    );
  }

  return mapCityAdmin(result.data);
}

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export async function deleteCityAdmin(
  id: string
): Promise<void> {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}/city-admins/${id}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Failed to delete city administration."
    );
  }
}