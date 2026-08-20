import { authFetch } from "@/services/authService";

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