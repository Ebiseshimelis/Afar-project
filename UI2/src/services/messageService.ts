export type ContactMessage = {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean | number;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

type MessagesResponse = {
  data: ContactMessage[];
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
   GET ALL MESSAGES
========================= */

export async function getMessages(
  perPage = 50,
): Promise<ContactMessage[]> {
  const response = await fetch(
    `${API_BASE_URL}/contact-messages?per_page=${perPage}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  const result = await parseResponse(response);

  return Array.isArray(result?.data) ? result.data : [];
}

/* =========================
   GET ONE MESSAGE
========================= */

export async function getMessage(
  id: string | number,
): Promise<ContactMessage> {
  const response = await fetch(
    `${API_BASE_URL}/contact-messages/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  const result = await parseResponse(response);

  if (!result?.data) {
    throw new Error("Invalid message response.");
  }

  return result.data;
}

/* =========================
   DELETE MESSAGE
========================= */

export async function deleteMessage(
  id: string | number,
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/contact-messages/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  await parseResponse(response);

  return true;
}
