import { authFetch } from "@/services/authService";

export type AdminRole = {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: string[];
  editable: boolean;
  deletable?: boolean;
  permissions_count?: number | null;
};

export type CreateRolePayload = {
  name: string;
  description?: string;
  permissions: string[];
};

export type UpdateRolePayload = {
  name: string;
  description?: string;
  permissions: string[];
};

export async function listRoles(): Promise<AdminRole[]> {
  const res = await authFetch("/admin/roles");
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(body?.message ?? "Unable to load roles.");
  }

  return (body?.data ?? []) as AdminRole[];
}

export async function createRole(
  payload: CreateRolePayload,
): Promise<AdminRole> {
  const res = await authFetch("/admin/roles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(body?.message ?? "Unable to create role.");
  }

  return body.data as AdminRole;
}

export async function updateRole(
  roleId: string,
  payload: UpdateRolePayload,
): Promise<AdminRole> {
  const res = await authFetch(`/admin/roles/${roleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(body?.message ?? "Unable to update role.");
  }

  return body.data as AdminRole;
}

export async function deleteRole(roleId: string): Promise<void> {
  const res = await authFetch(`/admin/roles/${roleId}`, {
    method: "DELETE",
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(body?.message ?? "Unable to delete role.");
  }
}

export async function assignAdminRole(
  userId: string,
  roleId: string,
): Promise<void> {
  const res = await authFetch(`/admin/users/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role_id: Number(roleId),
    }),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(body?.message ?? "Unable to assign role.");
  }
}
