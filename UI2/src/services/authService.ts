import type { StaffRole } from "@/lib/permissions";
import { ASSIGNABLE_MODULES, PERMISSION_ACTIONS } from "@/lib/permissions";

/**
 * Staff authentication service (Super Admin / Admin).
 *
 * Laravel API:
 *   POST /auth/login
 *   GET  /auth/me
 *   POST /auth/logout
 *
 * The backend remains the source of truth when it is reachable.
 * A local demo adapter is used only when the API cannot be reached.
 */

export const API_BASE = "http://127.0.0.1:8000/api/v1";

const TOKEN_KEY = "afar_admin_token";
const DEMO_KEY = "afar_admin_demo_session";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
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
 * Compatibility helper for older services.
 *
 * Existing News and Directorate services use getAdminToken()
 * when making authenticated admin API requests.
 */
export function getAdminToken(): string | null {
  return getToken();
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string | null) {
  if (typeof window === "undefined") return;

  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Authenticated fetch helper.
 */
export async function authFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getToken();

  return fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
}

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

/**
 * Staff login.
 */
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

  const user = normalizeUser(body?.user ?? body?.data?.user);

  setToken(body?.token ?? body?.access_token ?? null);

  return user;
}

/**
 * Get currently authenticated staff member.
 */
export async function me(): Promise<AuthUser | null> {
  if (!getToken()) {
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

  return normalizeUser(body?.user ?? body?.data ?? body);
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
    // Clear local authentication even if API is unavailable.
  }

  setToken(null);

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(DEMO_KEY);
  }
}

/**
 * Password reset compatibility functions.
 *
 * These keep the existing password-reset pages compiling.
 * They use the Laravel API when those endpoints exist.
 */
export async function forgotPassword(email: string): Promise<void> {
  let res: Response;

  try {
    res = await fetch("http://127.0.0.1:8000/api/forgot-password", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
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
    res = await fetch("http://127.0.0.1:8000/api/reset-password", {
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
    });
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
    is_active: raw.is_active !== false,
    permissions: Array.isArray(raw.permissions)
      ? raw.permissions.map(String)
      : [],
  };
}

/* ------------------------------------------------------------------ */
/* Demo adapter                                                       */
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
    return null;
  }
}

export const DEMO_MODULE_HINT =
  ASSIGNABLE_MODULES.map(
    (m) => m.key,
  );

