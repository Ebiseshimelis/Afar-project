import { API_BASE, getToken } from "@/services/authService";

export type SavedBackgrounds = Record<string, string>;

async function parseResponse(response: Response) {
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.message || "Background image request failed.");
  return body;
}

export async function getBackgrounds(): Promise<SavedBackgrounds> {
  const response = await fetch(`${API_BASE}/backgrounds`, {
    headers: { Accept: "application/json" },
  });
  return (await parseResponse(response))?.data ?? {};
}

export async function saveBackground(section: string, image?: File | null, imageUrl?: string): Promise<SavedBackgrounds> {
  const formData = new FormData();
  if (image instanceof File) formData.append("image", image);
  if (imageUrl?.trim()) formData.append("image_url", imageUrl.trim());
  const token = getToken();
  const response = await fetch(`${API_BASE}/backgrounds/${section}`, {
    method: "POST",
    headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  });
  return (await parseResponse(response))?.data ?? {};
}

export async function resetBackground(section: string): Promise<SavedBackgrounds> {
  const token = getToken();
  const response = await fetch(`${API_BASE}/backgrounds/${section}`, {
    method: "DELETE",
    headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  return (await parseResponse(response))?.data ?? {};
}
