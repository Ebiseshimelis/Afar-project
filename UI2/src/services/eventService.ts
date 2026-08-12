export type EventItem = {
  id: number;
  title: {
    en: string;
    am: string;
  };
  content: {
    en: string;
    am: string;
  };
  location: string | null;
  image_path: string | null;
  start_at: string;
  end_at: string;
  status: string;
  published_at: string | null;
};

type EventsResponse = {
  data: EventItem[];
};

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export async function getEvents(): Promise<EventItem[]> {
  const response = await fetch(`${API_BASE_URL}/events`);

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status}`);
  }

  const result: EventsResponse = await response.json();

  return result.data;
}