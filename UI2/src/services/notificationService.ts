import { getToken } from "@/services/authService";

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

const API_BASE_URL =
  "http://127.0.0.1:8000/api/v1";

/**
 * Authentication headers.
 *
 * IMPORTANT:
 * The new staff authentication system stores
 * the Laravel token as "afar_admin_token".
 */
function getAuthHeaders(): HeadersInit {
  const token = getToken();

  return {
    Accept: "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

/**
 * Convert Laravel/API errors into messages that are
 * understandable to administrators.
 */
function getFriendlyErrorMessage(
  status: number,
  data: any,
): string {
  if (status === 401) {
    return "Your staff session has expired. Please sign in again.";
  }

  if (status === 403) {
    return "You don't have permission to access notifications. Please contact the Super Admin if you need access.";
  }

  if (status === 404) {
    return "The notification service could not find the requested item.";
  }

  if (status === 419) {
    return "Your session is no longer valid. Please sign in again.";
  }

  if (status === 422) {
    if (data?.errors) {
      const errors = Object.values(data.errors)
        .flat()
        .filter(Boolean)
        .join(" ");

      if (errors) {
        return String(errors);
      }
    }

    return (
      data?.message ||
      "Some notification information is invalid."
    );
  }

  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }

  if (status >= 500) {
    return "The notification service is temporarily unavailable. Please try again shortly.";
  }

  if (data?.message) {
    return String(data.message);
  }

  if (data?.error) {
    return String(data.error);
  }

  return "Something went wrong while processing the notification request.";
}

async function parseResponse(
  response: Response,
) {
  const text = await response.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      getFriendlyErrorMessage(
        response.status,
        data,
      ),
    );
  }

  return data;
}

/* =========================================================
   GET NOTIFICATIONS
========================================================= */

export async function getNotifications(): Promise<
  NotificationItem[]
> {
  const response = await fetch(
    `${API_BASE_URL}/notifications`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  const result: NotificationsResponse =
    await parseResponse(response);

  return Array.isArray(result?.data)
    ? result.data
    : [];
}

/* =========================================================
   GET ONE NOTIFICATION
========================================================= */

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
    throw new Error(
      "The notification could not be loaded.",
    );
  }

  return result.data;
}

/* =========================================================
   MARK ONE AS READ
========================================================= */

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
    throw new Error(
      "The notification could not be marked as read.",
    );
  }

  return result.data;
}

/* =========================================================
   MARK ALL AS READ
========================================================= */

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

/* =========================================================
   DELETE NOTIFICATION
========================================================= */

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