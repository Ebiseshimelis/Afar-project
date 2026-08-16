export type EventItem = {
  id: number;
  category_id: number;
  created_by?: number;
  title: {
    en?: string;
    am?: string;
  };
  content: {
    en?: string;
    am?: string;
  };
  location: string | null;
  image_path: string | null;
  start_at: string;
  end_at: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CreateEventData = {
  category_id: number;
  title: {
    en: string;
    am: string;
  };
  content: {
    en: string;
    am: string;
  };
  location: string;
  start_at: string;
  end_at: string;
  status: "draft" | "published";
  image?: File | null;
};

export type UpdateEventData = Partial<CreateEventData>;

type EventsResponse = {
  data: EventItem[];
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
   GET ALL EVENTS
========================= */

export async function getEvents(): Promise<EventItem[]> {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const result = await parseResponse(response);

  return Array.isArray(result?.data) ? result.data : [];
}

/* =========================
   GET ONE EVENT
========================= */

export async function getEvent(
  id: string | number,
): Promise<EventItem> {
  const response = await fetch(
    `${API_BASE_URL}/events/${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const result = await parseResponse(response);

  if (!result?.data) {
    throw new Error("Invalid event response.");
  }

  return result.data;
}

/* =========================
   BUILD FORM DATA
========================= */

function buildEventFormData(
  data: CreateEventData | UpdateEventData,
): FormData {
  const formData = new FormData();

  if (data.category_id !== undefined) {
    formData.append(
      "category_id",
      String(data.category_id),
    );
  }

  if (data.title !== undefined) {
    if (data.title.en !== undefined) {
      formData.append(
        "title[en]",
        data.title.en,
      );
    }

    if (data.title.am !== undefined) {
      formData.append(
        "title[am]",
        data.title.am,
      );
    }
  }

  if (data.content !== undefined) {
    if (data.content.en !== undefined) {
      formData.append(
        "content[en]",
        data.content.en,
      );
    }

    if (data.content.am !== undefined) {
      formData.append(
        "content[am]",
        data.content.am,
      );
    }
  }

  if (data.location !== undefined) {
    formData.append(
      "location",
      data.location ?? "",
    );
  }

  if (data.start_at !== undefined) {
    formData.append(
      "start_at",
      data.start_at,
    );
  }

  if (data.end_at !== undefined) {
    formData.append(
      "end_at",
      data.end_at,
    );
  }

  if (data.status !== undefined) {
    formData.append(
      "status",
      data.status,
    );
  }

  if (
    data.image !== undefined &&
    data.image instanceof File
  ) {
    formData.append("image", data.image);
  }

  return formData;
}

/* =========================
   CREATE EVENT
========================= */

export async function createEvent(
  data: CreateEventData,
): Promise<EventItem> {
  const formData = buildEventFormData(data);

  const response = await fetch(
    `${API_BASE_URL}/events`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    },
  );

  const result = await parseResponse(response);

  if (!result?.data) {
    throw new Error(
      "Invalid create event response.",
    );
  }

  return result.data;
}

/* =========================
   UPDATE EVENT
========================= */

export async function updateEvent(
  id: string | number,
  data: UpdateEventData,
): Promise<EventItem> {
  const formData = buildEventFormData(data);

  formData.append("_method", "PUT");

  const response = await fetch(
    `${API_BASE_URL}/events/${id}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    },
  );

  const result = await parseResponse(response);

  if (!result?.data) {
    throw new Error(
      "Invalid update event response.",
    );
  }

  return result.data;
}

/* =========================
   DELETE EVENT
========================= */

export async function deleteEvent(
  id: string | number,
): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/events/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  await parseResponse(response);

  return true;
}