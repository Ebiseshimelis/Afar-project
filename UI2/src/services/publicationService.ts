export type PublicationItem = {
  id: string;
  title: string;
  content: string;
  filePath: string | null;
  status: string;
  publishedAt: string | null;
};

export async function getPublications(): Promise<PublicationItem[]> {
  const response = await fetch(
    "http://127.0.0.1:8000/api/v1/publications"
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch publications: ${response.status}`);
  }

  const result = await response.json();

  return (result.data ?? []).map((item: any) => ({
    id: String(item.id),
    title: item.title?.en || "",
    content: item.content?.en || "",
    filePath: item.file_path || null,
    status: item.status || "",
    publishedAt: item.published_at || null,
  }));
}