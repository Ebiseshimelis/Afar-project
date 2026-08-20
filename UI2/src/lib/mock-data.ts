// Mock data for the Afar Regional Government Portal
export const portfolioImages: { url: string; caption: string }[] = [
  { url: "/portfolio1.png", caption: "Urban development project" },
  { url: "/portfolio2.png", caption: "Construction milestone" },
  { url: "/portfolio3.png", caption: "City infrastructure" },
  { url: "/portfolio4.png", caption: "Housing delivery" },
];

// FIX: Using images from Unsplash CDN
export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  date: string;
  image: string;
  author: string;

  /** Backend/admin fields */
  status?: string;
  published_at?: string | null;
  created_at?: string | null;

  /** Optional localized backend title fields */
  title_en?: string;
  title_am?: string;

  /** Populated by the backend; used for the "Most read" ranking. */
  views?: number;
};

export type Tender = {
  id: string;
  title: string;
  reference: string;
  category: string;
  publishedDate: string;
  deadline: string;
  status: "Open" | "Closed" | "Awarded";
  summary: string;
};

export type Vacancy = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  deadline: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  summary: string;
};

export type Publication = {
  id: string;
  title: string;
  type: string;
  year: string;
  size: string;
};

import official1 from "@/assets/officials/official-1.jpg";
import official2 from "@/assets/officials/official-2.jpg";
import official3 from "@/assets/officials/official-3.jpg";
import official4 from "@/assets/officials/official-4.jpg";
import official5 from "@/assets/officials/official-5.jpg";
import official6 from "@/assets/officials/official-6.jpg";

const officialPhotos = [official1, official2, official3, official4, official5, official6];

export type Directorate = {
  id: string;
  name: string;
  nameAm?: string;
  category: string;
  head: string;
  phone: string;
  email: string;
  photo: string;
};


export const news: NewsItem[] = [
  {
    id: "1",
    title: "Regional Urban Development Strategy 2026 launched in Semera",
    excerpt: "The Bureau unveils a five-year strategy focused on affordable housing, sustainable infrastructure, and inclusive city services.",
    body: "The Afar Regional State Urban Development and Construction Bureau formally launched the Regional Urban Development Strategy 2026 in a ceremony held in Semera. The strategy outlines targeted investments in affordable housing, water and sanitation, transport corridors, and municipal capacity building over the next five years.",
    category: "Policy",
    date: "2026-07-14",
    image: "/News1.jpg",
    author: "Communications Office",
    views: 1482,
  },
  {
    id: "2",
    title: "New professional licensing platform now serving contractors region-wide",
    excerpt: "Contractors can now apply, renew, and track professional licenses through a modernized digital service.",
    body: "The digital licensing platform streamlines application, review, and issuance of professional construction licenses. Contractors across all zones of the region can access the service from any device.",
    category: "Services",
    date: "2026-07-08",
    image: "/News2.jpg",
    author: "IT Directorate",
    views: 1196,
  },
  {
    id: "3",
    title: "Semera city administration hands over 240 condominium units",
    excerpt: "A milestone in the region's affordable housing program with residents receiving keys to new homes.",
    body: "In a ceremony attended by regional leadership, 240 condominium units were handed over to beneficiaries in Semera as part of the ongoing affordable housing initiative.",
    category: "Housing",
    date: "2026-06-29",
    image: "/News3.jpg",
    author: "Housing Directorate",
    views: 2140,
  },
  {
    id: "4",
    title: "Cultural heritage program strengthens community engagement",
    excerpt: "Community-led programs celebrate Afar heritage while promoting sustainable tourism and local livelihoods.",
    body: "A series of cultural heritage programs across the region are strengthening community engagement and creating economic opportunity through sustainable tourism.",
    category: "Community",
    date: "2026-06-18",
    image: "/News4.jpg",
    author: "Culture Office",
    views: 734,
  },
  {
    id: "5",
    title: "Infrastructure investment reaches record levels this fiscal year",
    excerpt: "Roads, water systems, and municipal facilities see unprecedented investment across the region.",
    body: "Regional infrastructure spending has reached record levels this fiscal year, with new roads, water systems, and municipal facilities under construction across all zones.",
    category: "Infrastructure",
    date: "2026-06-05",
    image: "/News5.jpg",
    author: "Infrastructure Directorate",
    views: 1655,
  },
  {
    id: "6",
    title: "Training program equips 500 municipal officers with modern tools",
    excerpt: "Municipal officers across the region complete a comprehensive training program on digital governance.",
    body: "Five hundred municipal officers from every city administration in the region have completed a training program covering digital governance, procurement, and urban planning.",
    category: "Capacity Building",
    date: "2026-05-22",
    image: "/News6.jpg",
    author: "HR Directorate",
    views: 911,
  },
];

export const tenders: Tender[] = [
  {
    id: "1",
    title: "Construction of Semera–Logia arterial road (Phase II)",
    reference: "AFUDCB/T/2026/014",
    category: "Roads & Infrastructure",
    publishedDate: "2026-07-10",
    deadline: "2026-08-15",
    status: "Open",
    summary: "The Bureau invites sealed bids from eligible contractors for the construction of Phase II of the Semera–Logia arterial road, including drainage and street lighting.",
  },
  {
    id: "2",
    title: "Supply and installation of GIS servers and licenses",
    reference: "AFUDCB/T/2026/013",
    category: "ICT",
    publishedDate: "2026-07-05",
    deadline: "2026-07-30",
    status: "Open",
    summary: "Supply, installation, and configuration of enterprise GIS servers, licenses, and training for the regional cadastre program.",
  },
  {
    id: "3",
    title: "Design and build — Awash city administration office complex",
    reference: "AFUDCB/T/2026/012",
    category: "Buildings",
    publishedDate: "2026-06-22",
    deadline: "2026-07-25",
    status: "Open",
    summary: "Design–build services for the new Awash city administration office complex with a total gross floor area of approximately 6,200 m².",
  },
  {
    id: "4",
    title: "Consultancy — Urban land information system audit",
    reference: "AFUDCB/T/2026/011",
    category: "Consultancy",
    publishedDate: "2026-05-30",
    deadline: "2026-06-25",
    status: "Closed",
    summary: "Consultancy services for a comprehensive audit of the urban land information system across seven city administrations.",
  },
  {
    id: "5",
    title: "Supply of construction materials — cement (Framework)",
    reference: "AFUDCB/T/2026/010",
    category: "Materials",
    publishedDate: "2026-05-12",
    deadline: "2026-06-10",
    status: "Awarded",
    summary: "Two-year framework agreement for the supply of Portland cement to regional construction projects.",
  },
];

export const vacancies: Vacancy[] = [
  { id: "1", title: "Senior Urban Planner", department: "Urban Planning Directorate", location: "Semera", type: "Full-time", deadline: "2026-08-05" },
  { id: "2", title: "GIS Analyst", department: "Cadastre & Land Information", location: "Semera", type: "Full-time", deadline: "2026-08-01" },
  { id: "3", title: "Municipal Finance Officer", department: "Municipal Support", location: "Logia", type: "Full-time", deadline: "2026-07-28" },
  { id: "4", title: "Communications Specialist", department: "Communications Office", location: "Semera", type: "Contract", deadline: "2026-07-30" },
];

export const events: Event[] = [
  { id: "1", title: "Regional Urban Forum 2026", date: "2026-09-12", location: "Semera Convention Center", summary: "A three-day forum on sustainable urbanization, housing, and municipal finance." },
  { id: "2", title: "Contractor Registration Workshop", date: "2026-08-08", location: "Bureau HQ, Semera", summary: "Guidance on the new digital contractor registration and licensing platform." },
  { id: "3", title: "Public consultation — Awash city master plan", date: "2026-08-20", location: "Awash City Hall", summary: "Public review and consultation on the revised Awash city master plan." },
];

export const publications: Publication[] = [
  { id: "1", title: "Regional Urban Development Strategy 2026", type: "Strategy", year: "2026", size: "3.4 MB" },
  { id: "2", title: "Annual Performance Report 2025", type: "Report", year: "2025", size: "5.1 MB" },
  { id: "3", title: "Construction Procurement Manual (Rev. 3)", type: "Manual", year: "2025", size: "2.2 MB" },
  { id: "4", title: "Housing Policy Framework", type: "Policy", year: "2024", size: "1.8 MB" },
  { id: "5", title: "Urban Land Management Guidelines", type: "Guideline", year: "2024", size: "1.1 MB" },
];

export const directory: Directorate[] = [
  { id: "1", name: "Urban Land Development and Property Administration", nameAm: "የከተማ መሬት ልማት እና ንብረት አስተዳደር", category: "Directorates", head: "Ato Mohammed Ahmed", phone: "033-666-0577", email: "land@afarudcb.gov.et", photo: "/land.jpg"},
  { id: "2", name: "Procurement, Finance, and Property Administration", nameAm: "ግዥ፣ ፋይናንስ እና ንብረት አስተዳደር", category: "Directorates", head: "W/ro Fatuma Ali", phone: "033-666-0578", email: "finance@afarudcb.gov.et", photo: "/finance.jpg" },
  { id: "3", name: "Human Resource Administration", nameAm: "የሰው ሀብት አስተዳደር", category: "Directorates", head: "Ato Ibrahim Yusuf", phone: "033-666-0579", email: "hr@afarudcb.gov.et", photo: "/Hrd.jpg" },
  { id: "4", name: "Construction, Planning, and Budget Preparation", nameAm: "ግንባታ፣ እቅድ እና በጀት ዝግጅት", category: "Directorates", head: "Ato Hassan Osman", phone: "033-666-0580", email: "construction@afarudcb.gov.et", photo: "/construction.jpg" },
  { id: "5", name: "Urban Sanitation Beautification and Greenery Development", nameAm: "የከተማ ንፅህና ውበት እና አረንጓዴ ልማት", category: "Directorates", head: "W/ro Amina Yusuf", phone: "033-666-0581", email: "sanitation@afarudcb.gov.et", photo: "/sanitation.jpg" },
  { id: "6", name: "Urban Good Governance and Capacity Building", nameAm: "የከተማ መልካም አስተዳደር እና አቅም ግንባታ", category: "Directorates", head: "Ato Yusuf Mohammed", phone: "033-666-0582", email: "governance@afarudcb.gov.et", photo: "/governance.jpg"},
  { id: "7", name: "Plan and Budget Preparation", nameAm: "እቅድ እና በጀት ዝግጅት", category: "Directorates", head: "Ato Kedir Ibrahim", phone: "033-666-0583", email: "plan@afarudcb.gov.et", photo: "/planning.jpg"},
  { id: "8", name: "Internal Audit", nameAm: "የውስጥ ኦዲት", category: "Directorates", head: "W/ro Zeineba Ali", phone: "033-666-0584", email: "audit@afarudcb.gov.et", photo: "/audit.jpg"},
  { id: "9", name: "Communication Affairs", nameAm: "የኮሙኒኬሽን ጉዳዮች", category: "Directorates", head: "Ato Abdu Mohammed", phone: "033-666-0585", email: "communication@afarudcb.gov.et", photo: "/communication.jpg" },
  { id: "10", name: "ICT", nameAm: "የመረጃ ቴክኖሎጂ", category: "Directorates", head: "Ato Nuru Hassan", phone: "033-666-0586", email: "ict@afarudcb.gov.et", photo: "/ict.jpg"},
  { id: "11", name: "Semera City Administration", nameAm: "የሰመራ ከተማ አስተዳደር", category: "City Admins", head: "Mayor Ahmed Hassan", phone: "033-666-1001", email: "semera@afarudcb.gov.et", photo: "/samara.jpg " },
  { id: "12", name: "Ab'ala City Administration", nameAm: "የአብ አላ ከተማ አስተዳደር", category: "City Admins", head: "Mayor Ali Mohammed", phone: "033-666-1002", email: "Ab'ala@afarudcb.gov.et", photo: "/ab'ala.jpg" },
  { id: "13", name: "Awash City Administration", nameAm: "የአዋሽ ከተማ አስተዳደር", category: "City Admins", head: "Mayor Kedir Ibrahim", phone: "033-666-1003", email: "awash@afarudcb.gov.et", photo: "/awash.jpg"},
  { id: "14", name: "Dubti City Administration", nameAm: "የዱብቲ ከተማ አስተዳደር", category: "City Admins", head: "Mayor Amina Yusuf", phone: "033-666-1004", email: "dubti@afarudcb.gov.et", photo: "/dubti.jpg"},
  { id: "15", name: "Asayita City Administration", nameAm: "የአሳይታ ከተማ አስተዳደር", category: "City Admins", head: "Mayor Ibrahim Yusuf", phone: "033-666-1005", email: "asayita@afarudcb.gov.et", photo: "/Asayita.jpg" },
];


export const stats = {
  totalNews: news.length,
  totalTenders: tenders.length,
  totalUsers: 24,
  totalMessages: 137,
};

export const adminUsers = [
  { id: "1", name: "Ahmed Hassan", email: "ahmed@afarudcb.gov.et", role: "Super Admin", status: "Active", lastLogin: "2026-07-19" },
  { id: "2", name: "Fatuma Ali", email: "fatuma@afarudcb.gov.et", role: "Editor", status: "Active", lastLogin: "2026-07-18" },
  { id: "3", name: "Ibrahim Yusuf", email: "ibrahim@afarudcb.gov.et", role: "Editor", status: "Active", lastLogin: "2026-07-15" },
  { id: "4", name: "Hassan Osman", email: "hassan@afarudcb.gov.et", role: "Editor", status: "Inactive", lastLogin: "2026-06-30" },
];

export const roles = [
  { id: "1", name: "Super Admin", description: "Full access to all portal functions.", users: 1, permissions: ["all"] },
  { id: "2", name: "Editor", description: "Manage news and tenders content.", users: 3, permissions: ["news.manage", "tenders.manage"] },
];

export const messages = [
  { id: "1", name: "Dawit Alemu", email: "dawit@example.com", subject: "Question about tender AFUDCB/T/2026/014", date: "2026-07-19", read: false },
  { id: "2", name: "Selam Bekele", email: "selam@example.com", subject: "Request for publication", date: "2026-07-18", read: false },
  { id: "3", name: "Mulu Tesfaye", email: "mulu@example.com", subject: "Feedback on new portal", date: "2026-07-17", read: true },
  { id: "4", name: "Robel Girma", email: "robel@example.com", subject: "Media inquiry", date: "2026-07-15", read: true },
];

export const feedback = [
  { id: "1", name: "Amina Yusuf", topic: "Portal usability", rating: 5, date: "2026-07-19", comment: "The new portal is significantly easier to navigate." },
  { id: "2", name: "Getachew M.", topic: "Tender access", rating: 4, date: "2026-07-17", comment: "Would love mobile push notifications for new tenders." },
  { id: "3", name: "Sara T.", topic: "Language support", rating: 5, date: "2026-07-15", comment: "Great to see Amharic navigation." },
];

export const notifications = [
  { id: "1", title: "New tender submitted", body: "AFUDCB/T/2026/019 pending review", time: "2m ago", read: false, type: "tender" as const },
  { id: "2", title: "3 new contact messages", body: "From citizens via the portal", time: "1h ago", read: false, type: "message" as const },
  { id: "3", title: "News article published", body: "Semera Housing Program update is live", time: "3h ago", read: true, type: "news" as const },
  { id: "4", title: "User account created", body: "Fatuma Ali added as Editor", time: "Yesterday", read: true, type: "user" as const },
];

export const activity = [
  { id: "1", user: "Ahmed Hassan", action: "Published news", target: "Semera Housing Program Phase II", date: "2026-07-20 09:41" },
  { id: "2", user: "Fatuma Ali", action: "Edited tender", target: "AFUDCB/T/2026/014", date: "2026-07-20 08:12" },
  { id: "3", user: "Ibrahim Yusuf", action: "Deleted vacancy", target: "Junior Planner", date: "2026-07-19 17:03" },
  { id: "4", user: "Ahmed Hassan", action: "Created role", target: "Communications Editor", date: "2026-07-19 14:20" },
  { id: "5", user: "Fatuma Ali", action: "Uploaded document", target: "Annual Report 2025.pdf", date: "2026-07-19 11:45" },
];

export const permissions = [
  { key: "news.manage", label: "Manage news", group: "Content" },
  { key: "events.manage", label: "Manage events", group: "Content" },
  { key: "tenders.manage", label: "Manage tenders", group: "Content" },
  { key: "vacancies.manage", label: "Manage vacancies", group: "Content" },
  { key: "publications.manage", label: "Manage publications", group: "Content" },
  { key: "directory.manage", label: "Manage directory", group: "Directory" },
  { key: "users.manage", label: "Manage users", group: "Access" },
  { key: "roles.manage", label: "Manage roles", group: "Access" },
  { key: "messages.read", label: "Read contact messages", group: "Communication" },
  { key: "media.manage", label: "Manage media library", group: "Media" },
  { key: "settings.manage", label: "Portal settings", group: "System" },
];

export const mediaItems = [
  { id: "1", name: "semera-housing.jpg", type: "image", size: "1.4 MB", date: "2026-07-18", url: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=60" },
  { id: "2", name: "annual-report-2025.pdf", type: "document", size: "5.1 MB", date: "2026-07-15", url: "#" },
  { id: "3", name: "urban-forum-banner.jpg", type: "image", size: "2.2 MB", date: "2026-07-10", url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=60" },
  { id: "4", name: "master-plan-awash.pdf", type: "document", size: "8.7 MB", date: "2026-07-04", url: "#" },
  { id: "5", name: "bureau-hq.jpg", type: "image", size: "1.9 MB", date: "2026-06-29", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=60" },
  { id: "6", name: "procurement-manual.pdf", type: "document", size: "2.2 MB", date: "2026-06-20", url: "#" },
];
