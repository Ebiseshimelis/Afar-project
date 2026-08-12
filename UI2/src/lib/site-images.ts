/**
 * Central registry for section background images.
 *
 * Backgrounds are no longer hardcoded inside components. Each page asks for its
 * background by section key, and this module resolves it in this order:
 *   1. a value provided by the backend / admin dashboard (see `loadSectionBackgrounds`)
 *   2. the bundled default image (current design, used as placeholder)
 *
 * When the Laravel API is ready, replace the body of `loadSectionBackgrounds`
 * with a fetch to e.g. `GET /api/settings/backgrounds` — no component changes needed.
 */
import { useEffect, useState } from "react";
import defaultBackground from "@/assets/background.png";

export type SectionKey =
  | "default"
  | "home"
  | "about"
  | "directorates"
  | "newsEvents"
  | "cityAdmins"
  | "tenders"
  | "multimedia";

/** Current images kept as defaults/placeholders. */
export const DEFAULT_SECTION_BACKGROUNDS: Record<SectionKey, string> = {
  default: defaultBackground,
  home: defaultBackground,
  about: defaultBackground,
  directorates: defaultBackground,
  newsEvents: defaultBackground,
  cityAdmins: defaultBackground,
  tenders: defaultBackground,
  multimedia: defaultBackground,
};

export const SECTION_LABELS: Record<SectionKey, string> = {
  default: "Default / Fallback",
  home: "Home",
  about: "About",
  directorates: "Directorates",
  newsEvents: "News & Events",
  cityAdmins: "City Administration",
  tenders: "Tenders",
  multimedia: "Multimedia",
};

export type SectionBackgrounds = Partial<Record<SectionKey, string>>;

const STORAGE_KEY = "afar-section-backgrounds";

/** Reads admin-managed overrides. Swap for an API call when the backend is live. */
export function loadSectionBackgrounds(): SectionBackgrounds {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SectionBackgrounds) : {};
  } catch {
    return {};
  }
}

/** Persists admin-managed overrides. Swap for an API call when the backend is live. */
export function saveSectionBackgrounds(next: SectionBackgrounds) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota errors */
  }
  window.dispatchEvent(new Event("afar-backgrounds-changed"));
}

export function resolveSectionBackground(
  key: SectionKey,
  overrides: SectionBackgrounds,
): string {
  return overrides[key] || DEFAULT_SECTION_BACKGROUNDS[key] || DEFAULT_SECTION_BACKGROUNDS.default;
}

/**
 * Returns the background URL for a section. Renders the bundled default on the
 * server / first paint, then swaps in the managed image once available.
 */
export function useSectionBackground(key: SectionKey = "default"): string {
  const [overrides, setOverrides] = useState<SectionBackgrounds>({});

  useEffect(() => {
    const sync = () => setOverrides(loadSectionBackgrounds());
    sync();
    window.addEventListener("afar-backgrounds-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("afar-backgrounds-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return resolveSectionBackground(key, overrides);
}
