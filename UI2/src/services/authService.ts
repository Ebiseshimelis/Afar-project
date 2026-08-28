import type { StaffRole } from "@/lib/permissions";
import { ASSIGNABLE_MODULES, PERMISSION_ACTIONS } from "@/lib/permissions";

/**
 * Staff authentication service.
 *
 * Laravel API:
 *   POST /auth/login
 *   GET  /auth/me
 *   POST /auth/logout
 *
 * The backend is the source of truth.
 */

/* ------------------------------------------------------------------ */
/* API / Storage                                                       */
/* ------------------------------------------------------------------ */

export const API_BASE = "http://127.0.0.1:8000/api/v1";

/*
 * The existing application uses "admin_token" in localStorage.
 *
 * "afar_admin_token" was used by the newer authentication code,
 * so getToken() supports both during the transition.
 */
const TOKEN_KEY = "admin_token";
const LEGACY_TOKEN_KEY = "afar_admin_token";
const DEMO_KEY = "afar_admin_demo_session";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  role_name?: string | null;
  is_active: boolean;
  account_status?: string | null;
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

/* ------------------------------------------------------------------ */
/* Token handling                                                      */
/* ------------------------------------------------------------------ */

/**
 * Compatibility helper for older services.
 */
export function getAdminToken(): string | null {
  return getToken();
}

/**
 * Get the current Laravel Sanctum token.
 *
 * Primary storage:
 *   localStorage["admin_token"]
 *
 * Legacy compatibility:
 *   sessionStorage["afar_admin_token"]
 *   localStorage["afar_admin_token"]
 */
export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const localToken = window.localStorage.getItem(TOKEN_KEY);

  if (localToken && localToken.trim() !== "") {
    return localToken.trim();
  }

  const legacySessionToken =
    window.sessionStorage.getItem(LEGACY_TOKEN_KEY);

  if (legacySessionToken && legacySessionToken.trim() !== "") {
    return legacySessionToken.trim();
  }

  const legacyLocalToken =
    window.localStorage.getItem(LEGACY_TOKEN_KEY);

  if (legacyLocalToken && legacyLocalToken.trim() !== "") {
    return legacyLocalToken.trim();
  }

  return null;
}

/**
 * Store/remove the Laravel Sanctum token.
 *
 * The main application token is stored in localStorage under
 * "admin_token" because the existing application already uses
 * this key.
 */
function setToken(token: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (token && token.trim() !== "") {
    const cleanToken = token.trim();

    window.localStorage.setItem(TOKEN_KEY, cleanToken);

    /*
     * Remove stale versions so the application has one
     * authoritative authentication token.
     */
    window.sessionStorage.removeItem(LEGACY_TOKEN_KEY);
    window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.removeItem(LEGACY_TOKEN_KEY);
    window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  }
}

/**
 * Extract a token regardless of Laravel response shape.
 */
function extractToken(body: any): string | null {
  const token =
    body?.token ??
    body?.access_token ??
    body?.data?.token ??
    body?.data?.access_token ??
    null;

  if (typeof token !== "string" || token.trim() === "") {
    return null;
  }

  return token.trim();
}

/* ------------------------------------------------------------------ */
/* Authenticated fetch                                                 */
/* ------------------------------------------------------------------ */

export async function authFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getToken();

  const headers = new Headers(init.headers);

  headers.set("Accept", "application/json");

  /*
   * Do not set Content-Type manually for FormData.
   *
   * The browser must generate the multipart boundary.
   */
  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.delete("Authorization");
  }

  return fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });
}

/* ------------------------------------------------------------------ */
/* Error handling                                                      */
/* ------------------------------------------------------------------ */

function messageForStatus(status: number, body: any): string {
  if (body?.message && status !== 500) {
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

  return "Sign in failed. Please try again.";
}

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */

export async function login(
  email: string,
  password: string,
  loginType: StaffRole = "admin",
): Promise<AuthUser> {
  let res: Response;

  try {
    res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        login_type: loginType,
      }),
    });
  } catch {
    return demoLogin(email, password, loginType);
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new AuthError(
      messageForStatus(res.status, body),
      res.status,
    );
  }

  const user = normalizeUser(
    body?.user ??
      body?.data?.user ??
      body?.data ??
      null,
  );

  const token = extractToken(body);

  /*
   * A successful real API login MUST return a token.
   */
  if (!token) {
    console.error(
      "Laravel login response did not contain a token:",
      body,
    );

    throw new AuthError(
      "Login succeeded, but the server did not return an authentication token.",
      500,
    );
  }

  setToken(token);

  /*
   * Real API authentication takes priority over demo authentication.
   */
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(DEMO_KEY);
  }

  return user;
}

/* ------------------------------------------------------------------ */
/* Current authenticated user                                          */
/* ------------------------------------------------------------------ */

export async function me(): Promise<AuthUser | null> {
  const token = getToken();

  /*
   * No Laravel token means there is no real API session.
   * Check demo session only as a fallback.
   */
  if (!token) {
    return demoSession();
  }

  let res: Response;

  try {
    res = await authFetch("/auth/me");
  } catch {
    return demoSession();
  }

  if (
    res.status === 401 ||
    res.status === 403 ||
    res.status === 423
  ) {
    setToken(null);
    return null;
  }

  if (!res.ok) {
    return null;
  }

  const body = await res.json().catch(() => null);

  return normalizeUser(
    body?.user ??
      body?.data?.user ??
      body?.data ??
      body,
  );
}

/* ------------------------------------------------------------------ */
/* Logout                                                              */
/* ------------------------------------------------------------------ */

export async function logout(): Promise<void> {
  try {
    if (getToken()) {
      await authFetch("/auth/logout", {
        method: "POST",
      });
    }
  } catch {
    // Clear local authentication even if the API is unavailable.
  }

  setToken(null);

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(DEMO_KEY);
  }
}

/* ------------------------------------------------------------------ */
/* Password reset                                                      */
/* ------------------------------------------------------------------ */

export async function forgotPassword(email: string): Promise<void> {
  let res: Response;

  try {
    res = await fetch(
      "http://127.0.0.1:8000/api/forgot-password",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );
  } catch {
    throw new AuthError(
      "Unable to connect to the server.",
      0,
    );
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new AuthError(
      body?.message
        ? String(body.message)
        : "Unable to send password reset instructions.",
      res.status,
    );
  }
}

export async function resetPassword(
  token: string,
  email: string,
  password: string,
  passwordConfirmation: string,
): Promise<void> {
  let res: Response;

  try {
    res = await fetch(
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

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new AuthError(
      body?.message
        ? String(body.message)
        : "Unable to reset password.",
      res.status,
    );
  }
}

/* ------------------------------------------------------------------ */
/* User normalization                                                  */
/* ------------------------------------------------------------------ */

function normalizeUser(raw: any): AuthUser {
  if (!raw) {
    throw new AuthError(
      "Sign in failed. Please try again.",
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
    account_status: raw.account_status ?? null,
    permissions: Array.isArray(raw.permissions)
      ? raw.permissions.map(String)
      : [],
  };
}

/* ------------------------------------------------------------------ */
/* Demo adapter                                                        */
/* ------------------------------------------------------------------ */

const allFor = (mods: string[]) =>
  mods.flatMap((m) =>
    PERMISSION_ACTIONS.map(
      (a) => `${m}.${a}`,
    ),
  );

const DEMO_ACCOUNTS: (AuthUser & {
  password: string;
})[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    email: "superadmin@afarudcb.gov.et",
    password: "demo1234",
    role: "super_admin",
    is_active: true,
    permissions: ["*"],
  },
  {
    id: "2",
    name: "Fatuma Ali",
    email: "admin@afarudcb.gov.et",
    password: "demo1234",
    role: "admin",
    is_active: true,
    permissions: allFor([
      "news",
      "events",
    ]).concat("tenders.view"),
  },
  {
    id: "3",
    name: "Hassan Osman",
    email: "disabled@afarudcb.gov.et",
    password: "demo1234",
    role: "admin",
    is_active: false,
    permissions: ["news.view"],
  },
];

function demoLogin(
  email: string,
  password: string,
  loginType: StaffRole,
): AuthUser {
  const acct = DEMO_ACCOUNTS.find(
    (a) =>
      a.email.toLowerCase() ===
      email.trim().toLowerCase(),
  );

  if (!acct || acct.password !== password) {
    throw new AuthError(
      "Invalid email or password.",
      401,
    );
  }

  if (!acct.is_active) {
    throw new AuthError(
      "Your account has been disabled. Please contact the Super Admin.",
      423,
    );
  }

  if (acct.role !== loginType) {
    throw new AuthError(
      "This account is not authorized for this login type.",
      403,
    );
  }

  const {
    password: _password,
    ...user
  } = acct;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      DEMO_KEY,
      JSON.stringify(user),
    );
  }

  return user;
}

function demoSession(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw =
    window.localStorage.getItem(DEMO_KEY);

  if (!raw) {
    return null;
  }

  try {
    return normalizeUser(JSON.parse(raw));
  } catch {
    window.localStorage.removeItem(DEMO_KEY);
    return null;
  }
}

export const DEMO_MODULE_HINT =
  ASSIGNABLE_MODULES.map(
    (m) => m.key,
  );
