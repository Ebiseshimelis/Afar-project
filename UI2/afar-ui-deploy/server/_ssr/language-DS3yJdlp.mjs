import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/language-DS3yJdlp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var T = {
	home: {
		en: "Home",
		am: "መነሻ"
	},
	about: {
		en: "About",
		am: "ስለ እኛ"
	},
	directorate: {
		en: "Directorate",
		am: "ዳይሬክቶሬት"
	},
	cityAdmins: {
		en: "City Administration",
		am: "የከተማ አስተዳደር"
	},
	news: {
		en: "News & Events",
		am: "ዜና እና ዝግጅቶች"
	},
	latestNews: {
		en: "Latest News",
		am: "የቅርብ ጊዜ ዜናዎች"
	},
	upcomingEvents: {
		en: "Upcoming Events",
		am: "መጪ ዝግጅቶች"
	},
	multimedia: {
		en: "Multimedia",
		am: "መልቲሚዲያ"
	},
	imageGallery: {
		en: "Image Gallery",
		am: "የምስል ጋለሪ"
	},
	videoGallery: {
		en: "Video Gallery",
		am: "የቪዲዮ ጋለሪ"
	},
	tenders: {
		en: "Tenders",
		am: "ጨረታዎች"
	},
	vacancies: {
		en: "Vacancies",
		am: "ክፍት የሥራ ቦታዎች"
	},
	publications: {
		en: "Publications",
		am: "ህትመቶች"
	},
	contact: {
		en: "Contact",
		am: "አግኙን"
	},
	staffLogin: {
		en: "Staff Login",
		am: "የሠራተኛ መግቢያ"
	},
	quickLinks: {
		en: "Quick Links",
		am: "ፈጣን አገናኞች"
	},
	follow: {
		en: "Follow",
		am: "ተከታተሉን"
	}
};
var LanguageContext = (0, import_react.createContext)(null);
function LanguageProvider({ children }) {
	const [lang, setLangState] = (0, import_react.useState)("en");
	(0, import_react.useEffect)(() => {
		const saved = typeof window !== "undefined" ? localStorage.getItem("afar-lang") : null;
		if (saved === "en" || saved === "am") setLangState(saved);
	}, []);
	const setLang = (l) => {
		setLangState(l);
		try {
			localStorage.setItem("afar-lang", l);
		} catch {}
	};
	const t = (key) => T[key]?.[lang] ?? String(key);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageContext.Provider, {
		value: {
			lang,
			setLang,
			t
		},
		children
	});
}
function useLanguage() {
	const ctx = (0, import_react.useContext)(LanguageContext);
	if (!ctx) return {
		lang: "en",
		setLang: () => {},
		t: (k) => T[k]?.en ?? String(k)
	};
	return ctx;
}
//#endregion
export { useLanguage as n, LanguageProvider as t };
