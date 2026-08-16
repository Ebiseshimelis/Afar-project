export type Feedback = {
  id: number;
  name: string;
  email: string | null;
  topic: string;
  rating: number;
  comment: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateFeedbackData = {
  name: string;
  email?: string;
  topic: string;
  rating: number;
  comment: string;
};

type FeedbackResponse = {
  data: Feedback[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("admin_token");

  return {
    Accept: "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

async function parseResponse(response: Response) {
  const text = await response.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    let message =
      data?.message ||
      data?.error ||
      text ||
      `API request failed: ${response.status}`;

    if (data?.errors) {
      const errors = Object.values(data.errors)
        .flat()
        .join(" ");

      if (errors) {
        message = errors;
      }
    }

    throw new Error(`${message} (HTTP ${response.status})`);
  }

  return data;
}

/* =========================
   GET ALL FEEDBACK
========================= */

export async function getFeedback(): Promise<Feedback[]> {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result: FeedbackResponse = await parseResponse(response);

  return Array.isArray(result?.data) ? result.data : [];
}

/* =========================
   GET ONE FEEDBACK
========================= */

export async function getFeedbackItem(
  id: string | number,
): Promise<Feedback> {
  const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result = await parseResponse(response);

  if (!result?.data) {
    throw new Error("Invalid feedback response.");
  }

  return result.data;
}

/* =========================
   CREATE FEEDBACK
========================= */

export async function createFeedback(
  data: CreateFeedbackData,
): Promise<Feedback> {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await parseResponse(response);

  if (!result?.data) {
    throw new Error("Invalid feedback response.");
  }

  return result.data;
}

/* =========================
   DELETE FEEDBACK
========================= */

export async function deleteFeedback(
  id: string | number,
): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  await parseResponse(response);

  return true;
}
