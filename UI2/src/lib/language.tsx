import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "am";

type Dict = Record<string, { en: string; am: string }>;

export const T: Dict = {
  home: { en: "Home", am: "መነሻ" },
  about: { en: "About", am: "ስለ እኛ" },
  directorate: { en: "Directorate", am: "ዳይሬክቶሬት" },
  cityAdmins: { en: "City Administration", am: "የከተማ አስተዳደር" },
  news: { en: "News & Events", am: "ዜና እና ዝግጅቶች" },
  latestNews: { en: "Latest News", am: "የቅርብ ጊዜ ዜናዎች" },
  upcomingEvents: { en: "Upcoming Events", am: "መጪ ዝግጅቶች" },
  multimedia: { en: "Multimedia", am: "መልቲሚዲያ" },
  imageGallery: { en: "Image Gallery", am: "የምስል ጋለሪ" },
  videoGallery: { en: "Video Gallery", am: "የቪዲዮ ጋለሪ" },
  tenders: { en: "Tenders", am: "ጨረታዎች" },
  vacancies: { en: "Vacancies", am: "ክፍት የሥራ ቦታዎች" },
  publications: { en: "Publications", am: "ህትመቶች" },
  contact: { en: "Contact", am: "አግኙን" },
  staffLogin: { en: "Staff Login", am: "የሠራተኛ መግቢያ" },
  quickLinks: { en: "Quick Links", am: "ፈጣን አገናኞች" },
  follow: { en: "Follow", am: "ተከታተሉን" },
};


type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: keyof typeof T) => string };
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("afar-lang") as Lang | null) : null;
    if (saved === "en" || saved === "am") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("afar-lang", l); } catch {}
  };

  const t = (key: keyof typeof T) => T[key]?.[lang] ?? String(key);
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) return { lang: "en" as Lang, setLang: () => {}, t: (k: keyof typeof T) => T[k]?.en ?? String(k) };
  return ctx;
}
