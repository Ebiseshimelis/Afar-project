export type MultimediaItem = {
  id: number;
  title: string;
  description: string | null;
  type: "image" | "video";
  filePath: string | null;
  videoUrl: string | null;
  thumbnail: string | null;
  status: "draft" | "published";
  uploadedBy: number | null;
  createdAt: string;
  updatedAt: string;
};

const API_URL = "http://127.0.0.1:8000/api/v1";

export async function getMultimedia(): Promise<MultimediaItem[]> {
  const response = await fetch(`${API_URL}/multimedia`);

  if (!response.ok) {
    throw new Error(`Failed to fetch multimedia: ${response.status}`);
  }

  const result = await response.json();

  return (Array.isArray(result) ? result : result.data ?? []).map(
    (item: any) => ({
      id: Number(item.id),
      title: item.title ?? "",
      description: item.description ?? null,
      type: item.type,
      filePath: item.file_path ?? null,
      videoUrl: item.video_url ?? null,
      thumbnail: item.thumbnail ?? null,
      status: item.status ?? "published",
      uploadedBy: item.uploaded_by ?? null,
      createdAt: item.created_at ?? "",
      updatedAt: item.updated_at ?? "",
    })
  );
}