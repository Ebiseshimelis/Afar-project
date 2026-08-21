import { authFetch } from "@/services/authService";
import {
  ASSIGNABLE_MODULES,
  PERMISSION_ACTIONS,
} from "@/lib/permissions";

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: "admin";
  is_active: boolean;
  account_status: "pending" | "approved" | "rejected";
  permissions: string[];
};

export type AdminAccountInput = {
  name: string;
  email: string;
  password?: string;
  is_active: boolean;
  account_status: "pending" | "approved" | "rejected";
  permissions: string[];
};

const DEMO_KEY = "afar_admin_accounts_demo";

const DEMO_ACCOUNTS: AdminAccount[] = [
  {
    id: "2",
    name: "Fatuma Ali",
    email: "admin@afarudcb.gov.et",
    role: "admin",
    is_active: true,
    account_status: "approved",
    permissions: [
      "news.view",
      "news.create",
      "news.update",
      "events.view",
      "events.create",
      "events.update",
      "tenders.view",
    ],
  },
  {
    id: "3",
    account_status: "approved",
    name: "Hassan Osman",
    email: "disabled@afarudcb.gov.et",
    role: "admin",
    is_active: false,
    permissions: ["news.view"],
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

function normalizeAccount(raw: any): AdminAccount {
  return {
    id: String(raw?.id ?? ""),
    name: String(raw?.name ?? ""),
    email: String(raw?.email ?? ""),
    role: "admin",
    is_active: raw?.is_active !== false,
    account_status:
      raw?.account_status === "approved"
        ? "approved"
        : raw?.account_status === "rejected"
          ? "rejected"
          : "pending",
    permissions: Array.isArray(raw?.permissions)
      ? raw.permissions.map(String)
      : [],
  };
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  fallback: () => T,
): Promise<T> {
  let response: Response;

  try {
    response = await authFetch(path, init);
  } catch {
    return fallback();
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "You do not have permission to perform this action.",
      );
    }

    if (response.status === 404) {
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
 * List all admin accounts.
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
 * Backwards-compatible alias.
 *
 * admin.accounts.tsx currently calls listAdmins().
 * Keep this alias so existing UI code continues to work.
 */
export async function listAdmins(): Promise<AdminAccount[]> {
  return listAdminAccounts();
}

/**
 * Create an admin account.
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
      body: JSON.stringify({
        ...input,
        role: "admin",
      }),
    },
    () => {
      const accounts = readDemoAccounts();

      const created: AdminAccount = {
        id: String(Date.now()),
        name: input.name,
        email: input.email,
        role: "admin",
        is_active: input.is_active,
        account_status: input.account_status,
        permissions: input.permissions,
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
 * Update an admin account.
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
      body: JSON.stringify({
        ...input,
        role: "admin",
      }),
    },
    () => {
      const accounts = readDemoAccounts();

      const updated = accounts.map((account) =>
        account.id === id
          ? {
              ...account,
              ...input,
              role: "admin" as const,
            }
          : account,
      );

      writeDemoAccounts(updated);

      const account = updated.find(
        (item) => item.id === id,
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
 * Enable or disable an admin account.
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
 * Replace permissions assigned to an admin.
 */
export async function setAdminPermissions(
  id: string,
  permissions: string[],
): Promise<AdminAccount> {
  const data = await request<any>(
    `/admin/accounts/${id}/permissions`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        permissions,
      }),
    },
    () => {
      const accounts = readDemoAccounts();

      const updated = accounts.map((account) =>
        account.id === id
          ? {
              ...account,
              permissions,
            }
          : account,
      );

      writeDemoAccounts(updated);

      const account = updated.find(
        (item) => item.id === id,
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
 * Delete an admin account.
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
          (account) => account.id !== id,
        ),
      );

      return undefined;
    },
  );
}

/**
 * All permissions that can be assigned to normal admins.
 */
export const ALL_ADMIN_PERMISSIONS =
  ASSIGNABLE_MODULES.flatMap(
    (module) =>
      PERMISSION_ACTIONS.map(
        (action) => `${module.key}.${action}`,
      ),
  );






