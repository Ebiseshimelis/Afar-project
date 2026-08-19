import { authFetch } from "@/services/authService";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  is_active: boolean;
  permissions: string[];
  last_login: string | null;
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await authFetch(path, init);
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      body?.message ?? "The request could not be completed."
    );
  }

  return (body?.data ?? body) as T;
}

export async function listUsers(): Promise<AdminUser[]> {
  return request<AdminUser[]>("/admin/users");
}

export async function setUserRole(
  id: string,
  role: "admin" | "super_admin",
): Promise<AdminUser> {
  return request<AdminUser>(`/admin/users/${id}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}

export async function setUserStatus(
  id: string,
  is_active: boolean,
): Promise<AdminUser> {
  return request<AdminUser>(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ is_active }),
  });
}

export async function deleteUser(id: string): Promise<void> {
  await request(`/admin/users/${id}`, {
    method: "DELETE",
  });
}
