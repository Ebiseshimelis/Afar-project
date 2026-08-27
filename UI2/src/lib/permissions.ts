export type StaffRole = "super_admin" | "admin";

export const PERMISSION_ACTIONS = ["view", "create", "update", "delete"] as const;
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export type PermissionModule = {
  key: string;
  label: string;
  group: string;
  /** Only Super Admin may ever hold these. */
  superAdminOnly?: boolean;
};

export const PERMISSION_MODULES: PermissionModule[] = [
  // Content
  { key: "news", label: "News", group: "Content" },
  { key: "events", label: "Events", group: "Content" },
  { key: "tenders", label: "Tenders", group: "Content" },
  { key: "vacancies", label: "Vacancies", group: "Content" },
  { key: "publications", label: "Publications", group: "Content" },
  { key: "portfolios", label: "Portfolio", group: "Content" },
  { key: "multimedia", label: "Multimedia", group: "Content" },

  // Directory
  { key: "directorates", label: "Directorates", group: "Directory" },
  { key: "city_admins", label: "City Administrations", group: "Directory" },

  // Communication
  { key: "messages", label: "Contact Messages", group: "Communication" },
  { key: "notifications", label: "Notifications", group: "Communication" },

  // System
  { key: "media", label: "Media Library", group: "System", superAdminOnly: true },
  { key: "backgrounds", label: "Background Images", group: "System" },

  // Super Admin only
  {
    key: "admin_accounts",
    label: "Admin Accounts",
    group: "Super Admin",
    superAdminOnly: true,
  },
  {
    key: "settings",
    label: "System Settings",
    group: "Super Admin",
    superAdminOnly: true,
  },
];

/**
 * Modules that a normal Admin can be granted
 * through the Admin Accounts permission UI.
 *
 * Excluded automatically:
 * - Admin Accounts
 * - Media Library
 * - System Settings
 * - Announcements
 * - Feedback
 * - Activity
 */
/**
 * Modules that can be assigned to normal Admin accounts.
 *
 * These modules are intentionally excluded from the permission
 * assignment UI:
 *
 * - admin_accounts
 * - media
 * - announcement
 * - feedback
 * - activity
 *
 * "multimedia" is NOT excluded here because it is a separate
 * content module and must remain available where applicable.
 */
const HIDDEN_FROM_ADMIN_PERMISSION_UI = new Set([
  "admin_accounts",
  "media",
  "announcement",
  "feedback",
  "activity",
]);

export const ASSIGNABLE_MODULES = PERMISSION_MODULES.filter(
  (module) =>
    !module.superAdminOnly &&
    !HIDDEN_FROM_ADMIN_PERMISSION_UI.has(module.key),
);

export const PERMISSION_KEYS: string[] = PERMISSION_MODULES.flatMap((module) =>
  PERMISSION_ACTIONS.map((action) => `${module.key}.${action}`),
);

export function permissionLabel(key: string): string {
  const [mod, action] = key.split(".");
  const module = PERMISSION_MODULES.find((item) => item.key === mod);

  return `${action?.charAt(0).toUpperCase()}${action?.slice(1)} ${
    module?.label ?? mod
  }`;
}

