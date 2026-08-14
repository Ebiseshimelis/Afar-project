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
      data?.errors?.email?.[0] ||
      data?.errors?.password?.[0] ||
      data?.message ||
      "Invalid email or password.";

    throw new Error(message);
  }

  localStorage.setItem("admin_token", data.token);
  localStorage.setItem(
    "admin_user",
    JSON.stringify(data.user)
  );

  return data;
}

/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

export async function forgotPassword(
  email: string
): Promise<{ message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.message ||
      data?.errors?.email?.[0] ||
      "Unable to send password reset link.";

    throw new Error(message);
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

export async function resetPassword(
  email: string,
  token: string,
  password: string,
  passwordConfirmation: string
): Promise<{ message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.message ||
      data?.errors?.email?.[0] ||
      data?.errors?.password?.[0] ||
      "Unable to reset password.";

    throw new Error(message);
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Authentication helpers
|--------------------------------------------------------------------------
*/

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