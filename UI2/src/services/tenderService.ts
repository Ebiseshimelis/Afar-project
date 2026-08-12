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

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

async function apiRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function getTenders(): Promise<Tender[]> {
  const response = await apiRequest<{ data: Tender[] }>("/tenders");
  return response.data;
}

export async function getTender(id: string | number): Promise<Tender> {
  const response = await apiRequest<{ data: Tender }>(`/tenders/${id}`);
  return response.data;
}