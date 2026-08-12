export interface ContactMessage {
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const API_URL = "http://127.0.0.1:8000/api/v1";

export async function sendContactMessage(
  data: ContactMessage
): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to send contact message."
    );
  }

  return result;
}
