import { authFetch } from "@/services/authService";

export type AdminRole = {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: string[];
  editable: boolean;
};

export async function listRoles(): Promise<AdminRole[]> {
  const res = await authFetch("/admin/roles");
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      body?.message ?? "Unable to load roles."
    );
  }

  return (body?.data ?? []) as AdminRole[];
}
