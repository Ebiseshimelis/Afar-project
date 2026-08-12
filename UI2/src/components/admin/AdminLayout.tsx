import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Users,
  ShieldCheck,
  MessageSquare,
  LogOut,
  Bell,
  Search,
  Calendar,
  Briefcase,
  BookOpen,
  Building2,
  KeyRound,
  Activity,
  Star,
  BellRing,
  Image as ImageIcon,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  User,
  HelpCircle,
} from "lucide-react";
import { notifications as mockNotifications } from "@/lib/mock-data";

type AdminPath =
  | "/admin"
  | "/admin/news"
  | "/admin/events"
  | "/admin/tenders"
  | "/admin/vacancies"
  | "/admin/publications"
  | "/admin/directory"
  | "/admin/users"
  | "/admin/roles"
  | "/admin/permissions"
  | "/admin/activity"
  | "/admin/messages"
  | "/admin/feedback"
  | "/admin/notifications"
  | "/admin/media"
  | "/admin/backgrounds"
  | "/admin/settings";


type NavLeaf = { to: AdminPath; label: string; icon: typeof LayoutDashboard; exact?: boolean };
type NavGroup = { label: string; items: NavLeaf[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/news", label: "News", icon: Newspaper },
      { to: "/admin/events", label: "Events", icon: Calendar },
      { to: "/admin/tenders", label: "Tenders", icon: FileText },
      { to: "/admin/vacancies", label: "Vacancies", icon: Briefcase },
      { to: "/admin/publications", label: "Publications", icon: BookOpen },
    ],
  },
  {
    label: "Directory",
    items: [{ to: "/admin/directory", label: "Directory", icon: Building2 }],
  },
  {
    label: "Access",
    items: [
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/roles", label: "Roles", icon: ShieldCheck },
      { to: "/admin/permissions", label: "Permissions", icon: KeyRound },
      { to: "/admin/activity", label: "Activity", icon: Activity },
    ],
  },
  {
    label: "Communication",
    items: [
      { to: "/admin/messages", label: "Messages", icon: MessageSquare },
      { to: "/admin/feedback", label: "Feedback", icon: Star },
      { to: "/admin/notifications", label: "Notifications", icon: BellRing },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/media", label: "Media Library", icon: ImageIcon },
      { to: "/admin/backgrounds", label: "Background Images", icon: ImageIcon },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openMobile, setOpenMobile] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => setOpenMobile(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="flex">
        <SidebarNav pathname={pathname} openMobile={openMobile} onClose={() => setOpenMobile(false)} />

        {openMobile && (
          <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpenMobile(false)} />
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3 md:px-6">
              <button
                className="grid h-9 w-9 place-items-center rounded-md border lg:hidden"
                onClick={() => setOpenMobile((v) => !v)}
                aria-label="Toggle sidebar"
              >
                {openMobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="group relative flex h-9 flex-1 max-w-md items-center rounded-lg border bg-background pl-9 pr-2 text-left text-sm text-muted-foreground hover:border-primary/40"
              >
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <span className="truncate">Search modules, records…</span>
                <kbd className="ml-auto hidden rounded border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-foreground/60 sm:inline-block">
                  ⌘K
                </kbd>
              </button>

              <NotificationBell open={notifOpen} onOpenChange={setNotifOpen} />
              <ProfileMenu open={profileOpen} onOpenChange={setProfileOpen} />
            </div>

            <Breadcrumbs pathname={pathname} />
          </header>

          <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
        </div>
      </div>

      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

function SidebarNav({
  pathname,
  openMobile,
  onClose,
}: {
  pathname: string;
  openMobile: boolean;
  onClose: () => void;
}) {
  return (
    <aside
      className={
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-screen " +
        (openMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
      }
    >
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-accent">
          <span className="font-display text-base font-bold text-gold">A</span>
        </div>
        <div className="min-w-0">
          <div className="truncate font-display text-sm font-semibold">Afar UDCB</div>
          <div className="truncate text-xs text-sidebar-foreground/70">Admin Portal</div>
        </div>
        <button
          className="ml-auto grid h-8 w-8 place-items-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label} group={group} pathname={pathname} />
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/admin/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Link>
        <Link
          to="/"
          className="mt-1 block rounded-lg px-3 py-2 text-xs text-sidebar-foreground/60 hover:text-gold"
        >
          ← Back to public portal
        </Link>
      </div>
    </aside>
  );
}

function SidebarGroup({ group, pathname }: { group: NavGroup; pathname: string }) {
  const hasActive = group.items.some((i) => (i.exact ? pathname === i.to : pathname.startsWith(i.to)));
  const [open, setOpen] = useState(hasActive || group.label === "Overview");
  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-gold"
      >
        <span>{group.label}</span>
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>
      {open && (
        <ul className="mt-1 space-y-0.5">
          {group.items.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors " +
                    (active
                      ? "bg-sidebar-accent text-gold"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function useOutsideClick<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onOutside]);
  return ref;
}

function NotificationBell({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const ref = useOutsideClick<HTMLDivElement>(() => onOpenChange(false));
  const unread = mockNotifications.filter((n) => !n.read).length;
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => onOpenChange(!open)}
        className="relative grid h-9 w-9 place-items-center rounded-md border hover:bg-secondary"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-xl border bg-card shadow-elegant">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="text-sm font-semibold">Notifications</div>
            <Link to="/admin/notifications" onClick={() => onOpenChange(false)} className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="max-h-80 divide-y overflow-y-auto">
            {mockNotifications.map((n) => (
              <li key={n.id} className={"flex gap-3 px-4 py-3 " + (n.read ? "" : "bg-primary/5")}>
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{n.title}</div>
                  <div className="line-clamp-1 text-xs text-muted-foreground">{n.body}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">{n.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ProfileMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const ref = useOutsideClick<HTMLDivElement>(() => onOpenChange(false));
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => onOpenChange(!open)}
        className="flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 hover:bg-secondary"
      >
        <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">A</div>
        <div className="hidden text-left text-xs leading-tight sm:block">
          <div className="font-medium">Ahmed Hassan</div>
          <div className="text-muted-foreground">Super Admin</div>
        </div>
        <ChevronDown className="hidden h-3 w-3 text-muted-foreground sm:block" />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border bg-card shadow-elegant">
          <div className="border-b px-4 py-3">
            <div className="text-sm font-semibold">Ahmed Hassan</div>
            <div className="text-xs text-muted-foreground">admin@afarudcb.gov.et</div>
          </div>
          <ul className="py-1 text-sm">
            <li>
              <Link to="/admin/users" onClick={() => onOpenChange(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-secondary">
                <User className="h-4 w-4" /> My profile
              </Link>
            </li>
            <li>
              <Link to="/admin/settings" onClick={() => onOpenChange(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-secondary">
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </li>
            <li>
              <a href="#" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary">
                <HelpCircle className="h-4 w-4" /> Help
              </a>
            </li>
          </ul>
          <div className="border-t p-1">
            <Link to="/admin/login" onClick={() => onOpenChange(false)} className="flex items-center gap-2 rounded-md px-4 py-2 text-sm text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" /> Sign out
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function GlobalSearch({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    if (!q) return ALL_ITEMS;
    return ALL_ITEMS.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  }, [q]);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-24" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border bg-card shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search modules, pages, records…"
            className="h-12 flex-1 bg-transparent text-sm outline-none"
          />
          <kbd className="rounded border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">Esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">No matches</li>
          )}
          {results.map((r) => {
            const Icon = r.icon;
            return (
              <li key={r.to}>
                <Link
                  to={r.to}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{r.label}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">{r.to}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Breadcrumbs({ pathname }: { pathname: string }) {
  const crumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const acc: { href: string; label: string }[] = [];
    let cur = "";
    for (const p of parts) {
      cur += "/" + p;
      const found = ALL_ITEMS.find((i) => i.to === cur);
      const label = found?.label ?? p.charAt(0).toUpperCase() + p.slice(1);
      acc.push({ href: cur, label });
    }
    return acc;
  }, [pathname]);

  return (
    <div className="hidden border-t px-4 py-2 md:block md:px-6">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/admin" className="hover:text-primary">Admin</Link>
        {crumbs.slice(1).map((c, i, arr) => (
          <span key={c.href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3" />
            {i === arr.length - 1 ? (
              <span className="font-medium text-foreground">{c.label}</span>
            ) : (
              <span>{c.label}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  action,
}: {
  icon?: typeof FileText;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed bg-card px-6 py-14 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
