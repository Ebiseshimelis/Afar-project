import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { Save, Globe, Palette, LayoutTemplate, Navigation as NavIcon, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "System Settings" }, { name: "robots", content: "noindex" }] }),
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

function SettingsAdmin() {
  const [tab, setTab] = useState<TabKey>("general");
  return (
    <AdminLayout>
      <AdminPageHeader
        title="System Settings"
        description="Portal configuration and appearance."
        action={
          <button
            onClick={() => toast.success("Settings saved")}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Save className="h-4 w-4" /> Save changes
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
                    onClick={() => setTab(t.key)}
                    className={
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium " +
                      (active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-secondary")
                    }
                  >
                    <Icon className="h-4 w-4" /> {t.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="rounded-xl border bg-card p-6 shadow-soft">
          {tab === "general" && <GeneralSettings />}
          {tab === "portal" && <PortalSettings />}
          {tab === "navigation" && <NavigationSettings />}
          {tab === "homepage" && <HomepageSettings />}
          {tab === "appearance" && <AppearanceSettings />}
        </div>
      </div>
    </AdminLayout>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <div className="mt-1">{children}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const input = "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-ring focus:ring-2";

function GeneralSettings() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Organization name"><input defaultValue="Afar UDCB" className={input} /></Field>
      <Field label="Contact email"><input type="email" defaultValue="info@afarudcb.gov.et" className={input} /></Field>
      <Field label="Phone"><input defaultValue="033-666-0577" className={input} /></Field>
      <Field label="Time zone"><input defaultValue="Africa/Addis_Ababa" className={input} /></Field>
      <Field label="Default language"><select className={input}><option>English</option><option>Amharic</option></select></Field>
      <Field label="Fiscal year start"><input defaultValue="July 8" className={input} /></Field>
    </div>
  );
}

function PortalSettings() {
  return (
    <div className="space-y-5">
      <Field label="Portal tagline"><input defaultValue="Urban Development & Construction Bureau" className={input} /></Field>
      <Field label="About summary" hint="Shown on the public homepage.">
        <textarea rows={4} className={input + " h-auto py-2"} defaultValue="Modernizing urban development and construction services across the Afar Regional State." />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Facebook URL"><input defaultValue="https://facebook.com/afarudcb" className={input} /></Field>
        <Field label="Twitter URL"><input defaultValue="https://twitter.com/afarudcb" className={input} /></Field>
      </div>
    </div>
  );
}

function NavigationSettings() {
  const items = ["Home", "About", "Directorate", "City Admins", "News", "Events", "Tenders", "Vacancies", "Publications", "Contact"];
  return (
    <div>
      <p className="text-sm text-muted-foreground">Order determines menu placement on the public portal.</p>
      <ul className="mt-4 divide-y rounded-lg border">
        {items.map((label, i) => (
          <li key={label} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid h-6 w-6 place-items-center rounded bg-secondary text-xs font-semibold">{i + 1}</span>
              <span className="text-sm font-medium">{label}</span>
            </div>
            <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" defaultChecked className="rounded border" /> Visible
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HomepageSettings() {
  return (
    <div className="space-y-5">
      <Field label="Hero headline"><input defaultValue="Modernizing urban development for the Afar Region" className={input} /></Field>
      <Field label="Hero subheadline">
        <textarea rows={3} className={input + " h-auto py-2"} defaultValue="Serving cities, contractors, and citizens with transparent digital services." />
      </Field>
      <div className="grid gap-3 sm:grid-cols-3">
        {["Show News", "Show Tenders", "Show Events"].map((s) => (
          <label key={s} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
            <input type="checkbox" defaultChecked className="rounded border" /> {s}
          </label>
        ))}
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const swatches = [
    { name: "Navy", color: "oklch(0.28 0.06 260)" },
    { name: "Gold", color: "oklch(0.78 0.14 80)" },
    { name: "Emerald", color: "oklch(0.65 0.15 160)" },
    { name: "Ruby", color: "oklch(0.58 0.18 25)" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium">Primary color</div>
        <div className="mt-3 flex gap-3">
          {swatches.map((s) => (
            <button key={s.name} className="grid h-12 w-12 place-items-center rounded-xl border-2 border-transparent hover:border-primary" style={{ background: s.color }} aria-label={s.name} />
          ))}
        </div>
      </div>
      <Field label="Corner radius">
        <select className={input}><option>Rounded (default)</option><option>Sharp</option><option>Pill</option></select>
      </Field>
      <Field label="Density">
        <select className={input}><option>Comfortable</option><option>Compact</option></select>
      </Field>
    </div>
  );
}
