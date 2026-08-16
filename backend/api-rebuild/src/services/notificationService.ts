export type NotificationType =
  | "tender"
  | "message"
  | "news"
  | "user"
  | string;

export type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

type NotificationsResponse = {
  data: NotificationItem[];
  current_page?: number;
  last_page?: number;
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
   GET NOTIFICATIONS
========================= */

export async function getNotifications(): Promise<NotificationItem[]> {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result: NotificationsResponse = await parseResponse(response);

  return Array.isArray(result?.data) ? result.data : [];
}

/* =========================
   GET ONE NOTIFICATION
========================= */

export async function getNotification(
  id: number | string,
): Promise<NotificationItem> {
  const response = await fetch(
    `${API_BASE_URL}/notifications/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  const result = await parseResponse(response);

  if (!result?.data) {
    throw new Error("Invalid notification response.");
  }

  return result.data;
}

/* =========================
   MARK ONE AS READ
========================= */

export async function markNotificationAsRead(
  id: number | string,
): Promise<NotificationItem> {
  const response = await fetch(
    `${API_BASE_URL}/notifications/${id}/read`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    },
  );

  const result = await parseResponse(response);

  if (!result?.data) {
    throw new Error("Invalid notification response.");
  }

  return result.data;
}

/* =========================
   MARK ALL AS READ
========================= */

export async function markAllNotificationsAsRead(): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/notifications/read-all`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    },
  );

  await parseResponse(response);
}

/* =========================
   DELETE NOTIFICATION
========================= */

export async function deleteNotification(
  id: number | string,
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/notifications/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  await parseResponse(response);

  return true;
}
