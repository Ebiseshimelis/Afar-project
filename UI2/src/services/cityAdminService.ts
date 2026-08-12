export type CityAdmin = {
  id: string;
  name: string;
  nameAm?: string;
  description: string;
  mayor_name: string;
  location: string;
  email: string;
  phone: string;
  photo: string;
};

export async function getCityAdmins(): Promise<CityAdmin[]> {
  const response = await fetch(
    "http://127.0.0.1:8000/api/v1/city-admins"
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch city administrations: ${response.status}`);
  }

  const result = await response.json();

  return result.data.map((item: any) => ({
    id: String(item.id),
    name: item.name?.en || item.name_en || "",
    nameAm: item.name?.am || item.name_am || "",
    description: item.description?.en || "",
    mayor: item.mayor_name || "",
    location: item.location || "",
    email: item.email || "",
    phone: item.phone || "",

    // Images are stored directly in UI2/public/
    photo: item.image_path
      ? String(item.image_path).startsWith("/")
        ? String(item.image_path)
        : `/${String(item.image_path)}`
      : "",
  }));
}
