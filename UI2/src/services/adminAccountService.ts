import { authFetch } from "@/services/authService";

export type AdminRole = {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  permissions: string[];
  permissions_count?: number | null;
};

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: "admin";
  role_id: string | null;
  role_name: string | null;
  is_active: boolean;
  account_status: "pending" | "approved" | "rejected";
  permissions: string[];
  permissions_count?: number | null;
};

export type AdminAccountInput = {
  name: string;
  email: string;
  password?: string;
  role_id: string | null;
  is_active: boolean;
  account_status: "pending" | "approved" | "rejected";
};

const DEMO_KEY = "afar_admin_accounts_demo";

const DEMO_ROLES: AdminRole[] = [
  {
    id: "7",
    name: "Admin",
    slug: "admin",
    description: "Normal administrative staff",
    permissions: [
      "news.view",
      "news.create",
      "news.update",
      "events.view",
      "events.create",
      "events.update",
      "tenders.view",
    ],
    permissions_count: 7,
  },
];

const DEMO_ACCOUNTS: AdminAccount[] = [
  {
    id: "2",
    name: "Fatuma Ali",
    email: "admin@afarudcb.gov.et",
    role: "admin",
    role_id: "7",
    role_name: "Admin",
    is_active: true,
    account_status: "approved",
    permissions: DEMO_ROLES[0].permissions,
    permissions_count: 7,
  },
  {
    id: "3",
    name: "Hassan Osman",
    email: "disabled@afarudcb.gov.et",
    role: "admin",
    role_id: "7",
    role_name: "Admin",
    is_active: false,
    account_status: "approved",
    permissions: ["news.view"],
    permissions_count: 1,
  },
];

function readDemoAccounts(): AdminAccount[] {
  if (typeof window === "undefined") {
    return DEMO_ACCOUNTS;
  }

  const raw = window.localStorage.getItem(DEMO_KEY);

  if (!raw) {
    return DEMO_ACCOUNTS;
  }

  try {
    return JSON.parse(raw) as AdminAccount[];
  } catch {
    return DEMO_ACCOUNTS;
  }
}

function writeDemoAccounts(accounts: AdminAccount[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      DEMO_KEY,
      JSON.stringify(accounts),
    );
  }
}

function normalizeRole(raw: any): AdminRole {
  const permissions = Array.isArray(raw?.permissions)
    ? raw.permissions.map(String)
    : [];

  return {
    id: String(raw?.id ?? ""),
    name: String(raw?.name ?? raw?.role_name ?? ""),
    slug: raw?.slug ? String(raw.slug) : null,
    description: raw?.description
      ? String(raw.description)
      : null,
    permissions,
    permissions_count:
      raw?.permissions_count ?? permissions.length,
  };
}

function normalizeAccount(raw: any): AdminAccount {
  const permissions = Array.isArray(raw?.permissions)
    ? raw.permissions.map(String)
    : [];

  const roleId =
    raw?.role_id !== null &&
    raw?.role_id !== undefined &&
    raw?.role_id !== ""
      ? String(raw.role_id)
      : null;

  return {
    id: String(raw?.id ?? ""),
    name: String(raw?.name ?? ""),
    email: String(raw?.email ?? ""),
    role: "admin",
    role_id: roleId,
    role_name:
      raw?.role_name ??
      raw?.role?.name ??
      null,
    is_active: raw?.is_active !== false,
    account_status:
      raw?.account_status === "approved"
        ? "approved"
        : raw?.account_status === "rejected"
          ? "rejected"
          : "pending",
    permissions,
    permissions_count:
      raw?.permissions_count ?? permissions.length,
  };
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  fallback?: () => T,
): Promise<T> {
  let response: Response;

  try {
    response = await authFetch(path, init);
  } catch {
    if (fallback) {
      return fallback();
    }

    throw new Error("Unable to connect to the server.");
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "You do not have permission to perform this action.",
      );
    }

    if (response.status === 404 && fallback) {
      return fallback();
    }

    const body = await response.json().catch(() => null);

    throw new Error(
      body?.message
        ? String(body.message)
        : "The request could not be completed.",
    );
  }

  const body = await response.json().catch(() => null);

  return body?.data ?? body;
}

/**
 * List admin accounts.
 */
export async function listAdminAccounts(): Promise<AdminAccount[]> {
  const data = await request<any>(
    "/admin/accounts",
    {
      method: "GET",
    },
    () => readDemoAccounts(),
  );

  if (Array.isArray(data)) {
    return data.map(normalizeAccount);
  }

  if (Array.isArray(data?.data)) {
    return data.data.map(normalizeAccount);
  }

  return readDemoAccounts();
}

/**
 * Backwards-compatible alias used by Admin Accounts page.
 */
export async function listAdmins(): Promise<AdminAccount[]> {
  return listAdminAccounts();
}

/**
 * List roles available for assigning to Admin accounts.
 */
export async function listRoles(): Promise<AdminRole[]> {
  const data = await request<any>(
    "/admin/roles",
    {
      method: "GET",
    },
    () => DEMO_ROLES,
  );

  if (Array.isArray(data)) {
    return data.map(normalizeRole);
  }

  if (Array.isArray(data?.data)) {
    return data.data.map(normalizeRole);
  }

  return DEMO_ROLES;
}

/**
 * Create an Admin account.
 */
export async function createAdmin(
  input: AdminAccountInput,
): Promise<AdminAccount> {
  const data = await request<any>(
    "/admin/accounts",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
    () => {
      const accounts = readDemoAccounts();
      const role = DEMO_ROLES.find(
        (item) => item.id === input.role_id,
      );

      const created: AdminAccount = {
        id: String(Date.now()),
        name: input.name,
        email: input.email,
        role: "admin",
        role_id: input.role_id,
        role_name: role?.name ?? null,
        is_active: input.is_active,
        account_status: input.account_status,
        permissions: role?.permissions ?? [],
        permissions_count: role?.permissions.length ?? 0,
      };

      writeDemoAccounts([
        ...accounts,
        created,
      ]);

      return created;
    },
  );

  return normalizeAccount(data);
}

/**
 * Update an Admin account.
 */
export async function updateAdmin(
  id: string,
  input: Partial<AdminAccountInput>,
): Promise<AdminAccount> {
  const data = await request<any>(
    `/admin/accounts/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
    () => {
      const accounts = readDemoAccounts();

      const updated = accounts.map(
        (account: AdminAccount) => {
          if (account.id !== id) {
            return account;
          }

          const role =
            input.role_id !== undefined
              ? DEMO_ROLES.find(
                  (item) => item.id === input.role_id,
                )
              : undefined;

          return {
            ...account,
            ...input,
            role: "admin" as const,
            role_id:
              input.role_id !== undefined
                ? input.role_id
                : account.role_id,
            role_name:
              role !== undefined
                ? role?.name ?? null
                : account.role_name,
            permissions:
              role !== undefined
                ? role?.permissions ?? []
                : account.permissions,
            permissions_count:
              role !== undefined
                ? role?.permissions.length ?? 0
                : account.permissions_count,
          };
        },
      );

      writeDemoAccounts(updated);

      const account = updated.find(
        (item: AdminAccount) => item.id === id,
      );

      if (!account) {
        throw new Error("Admin account not found.");
      }

      return account;
    },
  );

  return normalizeAccount(data);
}

/**
 * Enable or disable an Admin account.
 */
export async function setAdminActive(
  id: string,
  is_active: boolean,
): Promise<AdminAccount> {
  return updateAdmin(id, {
    is_active,
  });
}

/**
 * Replace permissions assigned to an Admin account.
 *
 * Kept for the Permissions page. Role-based Admin Accounts
 * remain the primary account management mechanism.
 */
export async function setAdminPermissions(
  id: string,
  roleId: string,
): Promise<AdminAccount> {
  const data = await request<any>(
    `/admin/accounts/${id}/permissions`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role_id: Number(roleId),
      }),
    },
  );

  return normalizeAccount(data);
}
/**
 * Delete an Admin account.
 */
export async function deleteAdmin(
  id: string,
): Promise<void> {
  await request<void>(
    `/admin/accounts/${id}`,
    {
      method: "DELETE",
    },
    () => {
      const accounts = readDemoAccounts();

      writeDemoAccounts(
        accounts.filter(
          (account: AdminAccount) => account.id !== id,
        ),
      );

      return undefined;
    },
  );
}

