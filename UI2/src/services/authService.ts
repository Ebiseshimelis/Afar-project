export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: AuthUser;
};

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.message ||
      data?.errors?.email?.[0] ||
      "Invalid email or password.";

    throw new Error(message);
  }

  localStorage.setItem("admin_token", data.token);
  localStorage.setItem("admin_user", JSON.stringify(data.user));

  return data;
}

export function getAdminToken(): string | null {
  return localStorage.getItem("admin_token");
}

export function getAdminUser(): AuthUser | null {
  const user = localStorage.getItem("admin_user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
}