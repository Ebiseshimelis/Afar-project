import { createFileRoute } from "@tanstack/react-router";
import {
  AdminLayout,
  AdminPageHeader,
} from "@/components/admin/AdminLayout";
import {
  ChevronDown,
  ChevronUp,
  Globe,
  LayoutTemplate,
  Loader2,
  Navigation as NavIcon,
  Palette,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import {
  getSystemSettings,
  updateSystemSettings,
  type NavigationItem,
  type SystemSettings,
} from "@/services/systemSettingService";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "System Settings" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsAdmin,
});

const TABS = [
  { key: "general", label: "General", icon: SettingsIcon },
  { key: "portal", label: "Portal", icon: Globe },
  { key: "navigation", label: "Navigation", icon: NavIcon },
  { key: "homepage", label: "Homepage", icon: LayoutTemplate },
  { key: "appearance", label: "Appearance", icon: Palette },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const EMPTY_SETTINGS: SystemSettings = {
  organization_name: "",
  contact_email: "",
  phone: "",
  timezone: "",
  default_language: "",
  fiscal_year_start: "",

  portal_tagline: "",
  about_summary: "",
  facebook_url: "",
  twitter_url: "",

  hero_headline: "",
  hero_subheadline: "",
  show_news: false,
  show_tenders: false,
  show_events: false,

  allow_admin_registration: true,

  navigation_items: [],

  primary_color: "Navy",
  corner_radius: "Rounded (default)",
  density: "Comfortable",
};

function SettingsAdmin() {
  const [tab, setTab] = useState<TabKey>("general");
  const [settings, setSettings] =
    useState<SystemSettings>(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        setLoading(true);

        const data = await getSystemSettings();

        if (mounted) {
          setSettings({
            ...EMPTY_SETTINGS,
            ...data,
            navigation_items: Array.isArray(data.navigation_items)
              ? [...data.navigation_items].sort(
                  (a, b) => a.order - b.order,
                )
              : [],
          });
        }
      } catch (error) {
        console.error("Failed to load system settings:", error);

        if (mounted) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load system settings.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  function updateSetting<K extends keyof SystemSettings>(
    key: K,
    value: SystemSettings[K],
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);

      const normalizedNavigation = settings.navigation_items.map(
        (item, index) => ({
          ...item,
          order: index + 1,
        }),
      );

      const payload: SystemSettings = {
        ...settings,
        navigation_items: normalizedNavigation,
      };

      setSettings(payload);

      await updateSystemSettings(payload);

      toast.success("Settings saved successfully.");
    } catch (error) {
      console.error("Failed to save system settings:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save system settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <AdminPageHeader
          title="System Settings"
          description="Portal configuration and appearance."
        />

        <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading settings...
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="System Settings"
        description="Portal configuration and appearance."
        action={
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save changes"}
          </button>
        }
      />

      <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="rounded-xl border bg-card p-2 shadow-soft">
          <ul className="space-y-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;

              return (
                <li key={t.key}>
                  <button
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium " +
                      (active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/70 hover:bg-secondary")
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="rounded-xl border bg-card p-6 shadow-soft">
          {tab === "general" && (
            <GeneralSettings
              settings={settings}
              updateSetting={updateSetting}
            />
          )}

          {tab === "portal" && (
            <PortalSettings
              settings={settings}
              updateSetting={updateSetting}
            />
          )}

          {tab === "navigation" && (
            <NavigationSettings
              settings={settings}
              updateSetting={updateSetting}
            />
          )}

          {tab === "homepage" && (
            <HomepageSettings
              settings={settings}
              updateSetting={updateSetting}
            />
          )}

          {tab === "appearance" && (
            <AppearanceSettings
              settings={settings}
              updateSetting={updateSetting}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>

      <div className="mt-1">{children}</div>

      {hint && (
        <p className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
}

const input =
  "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2";

type SettingsProps = {
  settings: SystemSettings;
  updateSetting: <K extends keyof SystemSettings>(
    key: K,
    value: SystemSettings[K],
  ) => void;
};

function GeneralSettings({
  settings,
  updateSetting,
}: SettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold">
          General Settings
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Basic organization and administration settings.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Organization name">
          <input
            value={settings.organization_name}
            onChange={(e) =>
              updateSetting("organization_name", e.target.value)
            }
            className={input}
          />
        </Field>

        <Field label="Contact email">
          <input
            type="email"
            value={settings.contact_email}
            onChange={(e) =>
              updateSetting("contact_email", e.target.value)
            }
            className={input}
          />
        </Field>

        <Field label="Phone">
          <input
            value={settings.phone}
            onChange={(e) =>
              updateSetting("phone", e.target.value)
            }
            className={input}
          />
        </Field>

        <Field label="Time zone">
          <input
            value={settings.timezone}
            onChange={(e) =>
              updateSetting("timezone", e.target.value)
            }
            className={input}
          />
        </Field>

        <Field label="Default language">
          <select
            value={settings.default_language}
            onChange={(e) =>
              updateSetting("default_language", e.target.value)
            }
            className={input}
          >
            <option>English</option>
            <option>Amharic</option>
            <option>Afar</option>
          </select>
        </Field>

        <Field label="Fiscal year start">
          <input
            value={settings.fiscal_year_start}
            onChange={(e) =>
              updateSetting("fiscal_year_start", e.target.value)
            }
            className={input}
          />
        </Field>
      </div>

      <div className="rounded-xl border p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium">
              Allow Admin Registration
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Allow new users to submit requests for Admin
              accounts. Submitted accounts still require Super
              Admin approval before they can access the Admin
              panel.
            </p>
          </div>

          <label className="relative inline-flex shrink-0 cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={settings.allow_admin_registration}
              onChange={(e) =>
                updateSetting(
                  "allow_admin_registration",
                  e.target.checked,
                )
              }
            />

            <span className="h-6 w-11 rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring peer-focus:ring-offset-2">
              <span className="block h-5 w-5 translate-x-0.5 translate-y-0.5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </span>
          </label>
        </div>

        <div className="mt-3 text-xs">
          {settings.allow_admin_registration ? (
            <span className="font-medium text-green-600">
              Admin registration is enabled.
            </span>
          ) : (
            <span className="font-medium text-destructive">
              Admin registration is disabled.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function PortalSettings({
  settings,
  updateSetting,
}: SettingsProps) {
  return (
    <div className="space-y-5">
      <Field label="Portal tagline">
        <input
          value={settings.portal_tagline}
          onChange={(e) =>
            updateSetting("portal_tagline", e.target.value)
          }
          className={input}
        />
      </Field>

      <Field
        label="About summary"
        hint="Shown on the public homepage."
      >
        <textarea
          rows={4}
          value={settings.about_summary}
          onChange={(e) =>
            updateSetting("about_summary", e.target.value)
          }
          className={input + " h-auto py-2"}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Facebook URL">
          <input
            value={settings.facebook_url}
            onChange={(e) =>
              updateSetting("facebook_url", e.target.value)
            }
            className={input}
          />
        </Field>

        <Field label="Twitter URL">
          <input
            value={settings.twitter_url}
            onChange={(e) =>
              updateSetting("twitter_url", e.target.value)
            }
            className={input}
          />
        </Field>
      </div>
    </div>
  );
}

function NavigationSettings({
  settings,
  updateSetting,
}: SettingsProps) {
  const items = [...settings.navigation_items].sort(
    (a, b) => a.order - b.order,
  );

  function updateItems(nextItems: NavigationItem[]) {
    updateSetting(
      "navigation_items",
      nextItems.map((item, index) => ({
        ...item,
        order: index + 1,
      })),
    );
  }

  function toggleVisibility(index: number) {
    const next = [...items];

    next[index] = {
      ...next[index],
      visible: !next[index].visible,
    };

    updateItems(next);
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;

    if (target < 0 || target >= items.length) {
      return;
    }

    const next = [...items];

    [next[index], next[target]] = [
      next[target],
      next[index],
    ];

    updateItems(next);
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Order determines menu placement on the public portal.
      </p>

      <ul className="mt-4 divide-y rounded-lg border">
        {items.map((item, index) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-secondary text-xs font-semibold">
                {index + 1}
              </span>

              <span className="truncate text-sm font-medium">
                {item.label}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveItem(index, -1)}
                  className="rounded-md p-1 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={`Move ${item.label} up`}
                >
                  <ChevronUp className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => moveItem(index, 1)}
                  className="rounded-md p-1 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label={`Move ${item.label} down`}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={item.visible}
                  onChange={() => toggleVisibility(index)}
                  className="rounded border"
                />
                Visible
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HomepageSettings({
  settings,
  updateSetting,
}: SettingsProps) {
  return (
    <div className="space-y-5">
      <Field label="Hero headline">
        <input
          value={settings.hero_headline}
          onChange={(e) =>
            updateSetting("hero_headline", e.target.value)
          }
          className={input}
        />
      </Field>

      <Field label="Hero subheadline">
        <textarea
          rows={3}
          value={settings.hero_subheadline}
          onChange={(e) =>
            updateSetting("hero_subheadline", e.target.value)
          }
          className={input + " h-auto py-2"}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={settings.show_news}
            onChange={(e) =>
              updateSetting("show_news", e.target.checked)
            }
            className="rounded border"
          />
          Show News
        </label>

        <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={settings.show_tenders}
            onChange={(e) =>
              updateSetting("show_tenders", e.target.checked)
            }
            className="rounded border"
          />
          Show Tenders
        </label>

        <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={settings.show_events}
            onChange={(e) =>
              updateSetting("show_events", e.target.checked)
            }
            className="rounded border"
          />
          Show Events
        </label>
      </div>
    </div>
  );
}

function AppearanceSettings({
  settings,
  updateSetting,
}: SettingsProps) {
  const swatches = [
    {
      name: "Navy",
      color: "oklch(0.28 0.06 260)",
    },
    {
      name: "Gold",
      color: "oklch(0.78 0.14 80)",
    },
    {
      name: "Emerald",
      color: "oklch(0.65 0.15 160)",
    },
    {
      name: "Ruby",
      color: "oklch(0.58 0.18 25)",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium">
          Primary color
        </div>

        <div className="mt-3 flex gap-3">
          {swatches.map((s) => {
            const active =
              settings.primary_color === s.name;

            return (
              <button
                key={s.name}
                type="button"
                onClick={() =>
                  updateSetting("primary_color", s.name)
                }
                className={
                  "grid h-12 w-12 place-items-center rounded-xl border-2 " +
                  (active
                    ? "border-primary"
                    : "border-transparent hover:border-primary")
                }
                style={{ background: s.color }}
                aria-label={s.name}
                aria-pressed={active}
              >
                {active && (
                  <span className="h-2 w-2 rounded-full bg-white shadow" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Corner radius">
        <select
          value={settings.corner_radius}
          onChange={(e) =>
            updateSetting("corner_radius", e.target.value)
          }
          className={input}
        >
          <option>Rounded (default)</option>
          <option>Sharp</option>
          <option>Pill</option>
        </select>
      </Field>

      <Field label="Density">
        <select
          value={settings.density}
          onChange={(e) =>
            updateSetting("density", e.target.value)
          }
          className={input}
        >
          <option>Comfortable</option>
          <option>Compact</option>
        </select>
      </Field>
    </div>
  );
}