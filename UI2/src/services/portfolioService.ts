import { API_BASE, getToken } from "@/services/authService";
import { getMediaUrl } from "@/services/multimediaService";

export type PortfolioItem = {
  id: number;
  title: string;
  order: number;
  content: string;
  imagePath: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type PortfolioPayload = {
  title: string;
  order: number;
  content: string;
  image?: File | null;
};

function normalize(item: any): PortfolioItem {
  return {
    id: Number(item.id), title: item.title ?? "", order: Number(item.order ?? 0), content: item.content ?? "",
    imagePath: item.image ?? "", imageUrl: item.image_url ?? getMediaUrl(item.image),
    createdAt: item.created_at ?? "", updatedAt: item.updated_at ?? "",
  };
}

async function parseResponse(response: Response) {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const errors = body?.errors ? Object.values(body.errors).flat().join(" ") : "";
    throw new Error(errors || body?.message || "Portfolio request failed.");
  }
  return body;
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export async function getPortfolios(): Promise<PortfolioItem[]> {
  const response = await fetch(`${API_BASE}/portfolios`, { headers: { Accept: "application/json" } });
  const body = await parseResponse(response);
  return (Array.isArray(body) ? body : body?.data ?? []).map(normalize);
}

export async function getPortfolio(id: number): Promise<PortfolioItem> {
  const response = await fetch(`${API_BASE}/portfolios/${id}`, { headers: authHeaders() });
  const body = await parseResponse(response);
  return normalize(body?.data ?? body);
}

function toFormData(data: PortfolioPayload, method?: "PUT") {
  const formData = new FormData();
  if (method) formData.append("_method", method);
  formData.append("title", data.title);
  formData.append("order", String(data.order));
  formData.append("content", data.content);
  if (data.image instanceof File) formData.append("image", data.image);
  return formData;
}

export async function createPortfolio(data: PortfolioPayload): Promise<PortfolioItem> {
  const response = await fetch(`${API_BASE}/portfolios`, { method: "POST", headers: authHeaders(), body: toFormData(data) });
  const body = await parseResponse(response);
  return normalize(body?.data ?? body);
}

export async function updatePortfolio(id: number, data: PortfolioPayload): Promise<PortfolioItem> {
  const response = await fetch(`${API_BASE}/portfolios/${id}`, { method: "POST", headers: authHeaders(), body: toFormData(data, "PUT") });
  const body = await parseResponse(response);
  return normalize(body?.data ?? body);
}

export async function deletePortfolio(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/portfolios/${id}`, { method: "DELETE", headers: authHeaders() });
  await parseResponse(response);
}
