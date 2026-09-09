import { API_BASE } from "@/services/authService";

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

export async function getAbout(): Promise<About> {
  const response = await fetch(`${API_BASE}/about`);

  if (!response.ok) {
    throw new Error("Failed to fetch About information");
  }

  return response.json();
}