import { authFetch } from "@/services/authService";

export type BackendPermission = {
  key: string;
  module: string;
  action: string;
  super_admin_only: boolean;
};

export async function listPermissions(): Promise<BackendPermission[]> {
  const res = await authFetch("/admin/permissions");
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      body?.message ?? "Unable to load permissions."
    );
  }

  return (body?.data ?? []) as BackendPermission[];
}
