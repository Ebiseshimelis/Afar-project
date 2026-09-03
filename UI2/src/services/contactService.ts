const API_BASE_URL = "http://127.0.0.1:8001/api/v1";

export interface ContactMessageData {
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(
  data: ContactMessageData
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    const validationMessage =
      result?.message ||
      "Failed to send your message.";

    throw new Error(validationMessage);
  }
}