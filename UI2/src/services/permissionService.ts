import { authFetch } from "@/services/authService";

export type BackendPermission = {
  key: string;
  module: string;
  action: string;
  super_admin_only: boolean;
};

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await authFetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      body?.message ?? "The request could not be completed.",
    );
  }

  return (body?.data ?? body) as T;
}

export async function listPermissions(): Promise<BackendPermission[]> {
  return request<BackendPermission[]>("/admin/permissions");
}

/**
 * Assign the selected permissions to an Admin account.
 *
 * Super Admin accounts are unrestricted and should not normally be
 * edited through this method.
 */
export async function setUserPermissions(
  userId: string,
  permissions: string[],
): Promise<void> {
  await request(`/admin/accounts/${userId}/permissions`, {
    method: "PUT",
    body: JSON.stringify({
      permissions,
    }),
  });
}
