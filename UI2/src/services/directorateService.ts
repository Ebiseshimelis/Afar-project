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
  sort_order: number;
};

type ApiResponse = {
  data: ApiDirectorate[];
};

const API_BASE =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

function makePhotoUrl(path: string | null): string {
  if (!path) {
    return "/land.jpg";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleanPath = path.replace(/^\/+/, "");

  return `http://127.0.0.1:8000/storage/${cleanPath.replace(
    /^directorates\//,
    "directorates/"
  )}`;
}

function mapDirectorate(d: ApiDirectorate): Directorate {
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

export async function getDirectorates(): Promise<Directorate[]> {
  const response = await fetch(`${API_BASE}/directorates`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch directorates: ${response.status}`
    );
  }

  const json: ApiResponse = await response.json();

  return (json.data || [])
    .map(mapDirectorate)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}