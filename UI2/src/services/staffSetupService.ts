import { API_BASE, AuthError } from "./authService";

export type StaffSetupStatus = {
  setup_required: boolean;
};

export type StaffSetupUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  is_active: boolean;
  account_status: "pending" | "approved" | "rejected";
  permissions?: string[];
};

export type StaffSetupResponse = {
  message: string;
  setup_required?: boolean;
  registration_status?: "pending";
  user: StaffSetupUser;
};

async function parseResponse(response: Response): Promise<any> {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      body?.message ||
      body?.errors?.email?.[0] ||
      body?.errors?.password?.[0] ||
      body?.errors?.name?.[0] ||
      "Unable to complete staff account setup.";

    throw new AuthError(String(message), response.status);
  }

  return body;
}

export async function getSetupStatus(): Promise<StaffSetupStatus> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/staff-setup/status`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    throw new AuthError(
      "Unable to connect to the server. Please make sure the Laravel API is running.",
      0,
    );
  }

  return parseResponse(response);
}

export async function createFirstSuperAdmin(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
): Promise<StaffSetupResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/staff-setup/super-admin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });
  } catch {
    throw new AuthError(
      "Unable to connect to the server. Please make sure the Laravel API is running.",
      0,
    );
  }

  return parseResponse(response);
}

export async function registerAdmin(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
): Promise<StaffSetupResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/staff-setup/admin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });
  } catch {
    throw new AuthError(
      "Unable to connect to the server. Please make sure the Laravel API is running.",
      0,
    );
  }

  return parseResponse(response);
}
