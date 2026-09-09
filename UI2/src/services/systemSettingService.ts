import { API_BASE, authFetch } from "@/services/authService";

export type NavigationItem = {
  label: string;
  visible: boolean;
  order: number;
};

export type SystemSettings = {
  organization_name: string;
  contact_email: string;
  phone: string;
  timezone: string;
  default_language: string;
  fiscal_year_start: string;

  portal_tagline: string;
  about_summary: string;
  facebook_url: string;
  twitter_url: string;

  hero_headline: string;
  hero_subheadline: string;
  show_news: boolean;
  show_tenders: boolean;
  show_events: boolean;

  allow_admin_registration: boolean;

  navigation_items: NavigationItem[];

  primary_color: string;
  corner_radius: string;
  density: string;
};

export type PublicSystemSettings = Pick<
  SystemSettings,
  | "organization_name"
  | "contact_email"
  | "phone"
  | "portal_tagline"
  | "about_summary"
  | "facebook_url"
  | "twitter_url"
  | "hero_headline"
  | "hero_subheadline"
  | "show_news"
  | "show_tenders"
  | "show_events"
>;

export async function getSystemSettings(): Promise<SystemSettings> {
  const response = await authFetch("/admin/settings");

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.message || "Failed to load system settings.",
    );
  }

  return body?.data ?? {};
}

export async function getPublicSystemSettings(): Promise<PublicSystemSettings> {
  const response = await fetch(`${API_BASE}/settings`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.message || "Failed to load public system settings.",
    );
  }

  return body?.data ?? {};
}

export async function updateSystemSettings(
  settings: Partial<SystemSettings>,
): Promise<void> {
  const response = await authFetch("/admin/settings", {
    method: "PUT",
    body: JSON.stringify({ settings }),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.message || "Failed to update system settings.",
    );
  }
}