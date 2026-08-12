export interface About {
  id: number;
  mission: string;
  vision: string;
  values: string;
  description: string;
  services: string[];
  image: string | null;
  created_at: string;
  updated_at: string;
}

const API_URL = "http://127.0.0.1:8000/api/v1";

export async function getAbout(): Promise<About> {
  const response = await fetch(`${API_URL}/about`);

  if (!response.ok) {
    throw new Error("Failed to fetch About information");
  }

  return response.json();
}