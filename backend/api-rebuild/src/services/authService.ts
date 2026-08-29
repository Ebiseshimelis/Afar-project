import type { StaffRole } from "@/lib/permissions";

/**
 * Real staff authentication service.
 *
 * Laravel API:
 *   POST /auth/login
 *   GET  /auth/me
 *   POST /auth/logout
 *
 * Laravel is the only authentication source.
 * The database is the source of truth for roles,
 * account status, and permissions.
 */

export const API_BASE = "http://127.0.0.1:8000/api/v1";

const TOKEN_KEY = "afar_admin_token";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  role_name?: string | null;
  is_active: boolean;
  permissions: string[];
};

export class AuthError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/**
 * Compatibility helper used by existing admin services.
 */
export function getAdminToken(): string | null {
  return getToken();
}

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(TOKEN_KEY);
}

function setToken(token: string | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    window.sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    window.sessionStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Authenticated API request helper.
 *
 * Content-Type is only added when the caller has not supplied
 * a body that needs its own content type, such as FormData.
 */
export async function authFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getToken();

  const headers = new Headers(init.headers);

  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  /*
   * Do not force application/json on FormData.
   * The browser must generate the multipart boundary itself.
   */
  if (
    init.body &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });
}

function messageForStatus(
  status: number,
  body: any,
): string {
  if (body?.message) {
    return String(body.message);
  }

  if (status === 401 || status === 422) {
    return "Invalid email or password.";
  }

  if (status === 403) {
    return "This account is not authorized for this login type.";
  }

  if (status === 423) {
    return "Your account has been disabled. Please contact the Super Admin.";
  }

  return `Sign in failed. Server returned ${status}.`;
}

/**
 * Staff login.
 *
 * Authentication is performed only by Laravel.
 */
export async function login(
  email: string,
  password: string,
  loginType: StaffRole = "admin",
): Promise<AuthUser> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
        login_type: loginType,
      }),
    });
  } catch {
    throw new AuthError(
      "Unable to connect to the server. Please make sure the Laravel API is running.",
      0,
    );
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new AuthError(
      messageForStatus(response.status, body),
      response.status,
    );
  }

  const token =
    body?.token ??
    body?.access_token ??
    null;

  if (!token) {
    throw new AuthError(
      "Login succeeded but the server did not return an authentication token.",
      500,
    );
  }

  const user = normalizeUser(
    body?.user ??
      body?.data?.user,
  );

  setToken(token);

  return user;
}

/**
 * Get the currently authenticated staff member.
 *
 * This always asks Laravel for the current database state,
 * including the user's current role permissions.
 */
export async function me(): Promise<AuthUser | null> {
  const token = getToken();

  if (!token) {
    return null;
  }

  let response: Response;

  try {
    response = await authFetch("/auth/me");
  } catch {
    return null;
  }

  if (
    response.status === 401 ||
    response.status === 403 ||
    response.status === 423
  ) {
    setToken(null);
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const body = await response.json().catch(() => null);

  return normalizeUser(
    body?.user ??
      body?.data ??
      body,
  );
}

/**
 * Logout.
 */
export async function logout(): Promise<void> {
  try {
    if (getToken()) {
      await authFetch("/auth/logout", {
        method: "POST",
      });
    }
  } catch {
    /*
     * Even if the API is unavailable, remove the local
     * token so the browser is no longer authenticated.
     */
  }

  setToken(null);
}

/**
 * Password reset.
 */
export async function forgotPassword(
  email: string,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(
      "http://127.0.0.1:8000/api/forgot-password",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      },
    );
  } catch {
    throw new AuthError(
      "Unable to connect to the server.",
      0,
    );
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new AuthError(
      body?.message
        ? String(body.message)
        : "Unable to send password reset instructions.",
      response.status,
    );
  }
}

/**
 * Password reset completion.
 */
export async function resetPassword(
  token: string,
  email: string,
  password: string,
  passwordConfirmation: string,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(
      "http://127.0.0.1:8000/api/reset-password",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      },
    );
  } catch {
    throw new AuthError(
      "Unable to connect to the server.",
      0,
    );
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new AuthError(
      body?.message
        ? String(body.message)
        : "Unable to reset password.",
      response.status,
    );
  }
}

function normalizeUser(raw: any): AuthUser {
  if (!raw) {
    throw new AuthError(
      "The server returned an invalid user account.",
      500,
    );
  }

  return {
    id: String(raw.id),
    name: raw.name ?? "",
    email: raw.email ?? "",
    role:
      raw.role === "super_admin"
        ? "super_admin"
        : "admin",
    role_name: raw.role_name ?? null,
    is_active: raw.is_active !== false,
    permissions: Array.isArray(raw.permissions)
      ? raw.permissions.map(String)
      : [],
  };
}
