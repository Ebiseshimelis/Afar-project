/**
 * Central registry for section background images.
 *
 * Backgrounds are no longer hardcoded inside components. Each page asks for its
 * background by section key, and this module resolves it in this order:
 *   1. a value provided by the Laravel backend
 *   2. the bundled default image (current design, used as placeholder)
 *
 * Saved values are shared by every browser and persist independently of local storage.
 */
import { useEffect, useState } from "react";
import defaultBackground from "@/assets/background.png";
import { getBackgrounds } from "@/services/backgroundService";

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
    let active = true;
    void getBackgrounds()
      .then((backgrounds) => { if (active) setOverrides(backgrounds as SectionBackgrounds); })
      .catch(() => { /* Retain bundled defaults when the API is unavailable. */ });
    return () => { active = false; };
  }, []);

  return resolveSectionBackground(key, overrides);
}
