import type { NewsItem } from "@/lib/mock-data";

const NEWS_API_URL = "http://127.0.0.1:8000/api/v1/news";

function mapNewsItem(item: any): NewsItem {
  return {
    id: String(item.id),

    title:
      item.title_en ||
      item.title?.en ||
      "",

    excerpt:
      item.content_en?.substring(0, 120) ||
      item.content?.en?.substring(0, 120) ||
      "",

    body:
      item.content_en ||
      item.content?.en ||
      "",

    category:
      item.category?.name_en ||
      item.category?.name?.en ||
      item.category?.name ||
      "",

    date: item.published_at,

    image: item.image_path
      ? `/${String(item.image_path).replace(/^\/+/, "")}`
      : "/News1.jpg",

    author:
      item.author?.name ||
      "",

    views:
      item.views ||
      0,
  };
}

export async function getNews(): Promise<NewsItem[]> {
  const response = await fetch(NEWS_API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch news: ${response.status}`);
  }

  const result = await response.json();

  if (!result || !Array.isArray(result.data)) {
    throw new Error("Invalid news API response");
  }

  return result.data.map(mapNewsItem);
}

export async function getNewsById(
  id: string
): Promise<NewsItem | null> {
  const news = await getNews();

  return news.find((item) => item.id === String(id)) ?? null;
}