import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Users,
  MessageSquare,
  LogOut,
  Bell,
  Search,
  Calendar,
  Briefcase,
  BookOpen,
  Building2,
  KeyRound,
  BellRing,
  Image as ImageIcon,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  User,
  HelpCircle,
  ShieldAlert,
  Check,
  Loader2,
  Inbox,
} from "lucide-react";

import { useAuth } from "@/lib/auth";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type NotificationItem,
} from "@/services/notificationService";

type AdminPath =
  | "/admin"
  | "/admin/news"
  | "/admin/events"
  | "/admin/tenders"
  | "/admin/vacancies"
  | "/admin/publications"
  | "/admin/city-admins"
  | "/admin/directory"
  | "/admin/users"
  | "/admin/permissions"
  | "/admin/messages"
  | "/admin/notifications"
  | "/admin/multimedia"
  | "/admin/backgrounds"
  | "/admin/settings";

type Permission =
  | "dashboard.view"
  | "news.view"
  | "events.view"
  | "tenders.view"
  | "vacancies.view"
  | "publications.view"
  | "city_admins.view"
  | "directory.view"
  | "users.view"
  | "permissions.view"
  | "messages.view"
  | "notifications.view"
  | "multimedia.view"
  | "backgrounds.view"
  | "settings.view";

type NavLeaf = {
  to: AdminPath;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  permission?: Permission;
  superAdminOnly?: boolean;

  /**
   * Keeps this item visible in the sidebar even when
   * the current user does not have its permission.
   *
   * IMPORTANT:
   * This does NOT grant access. The page-level permission
   * check still runs when the user opens the route.
   */
  alwaysVisible?: boolean;
};

type NavGroup = {
  label: string;
  items: NavLeaf[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        to: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
        permission: "dashboard.view",
      },
    ],
  },

  {
    label: "Content",
    items: [
      {
        to: "/admin/news",
        label: "News",
        icon: Newspaper,
        permission: "news.view",
      },
      {
        to: "/admin/events",
        label: "Events",
        icon: Calendar,
        permission: "events.view",
      },
      {
        to: "/admin/tenders",
        label: "Tenders",
        icon: FileText,
        permission: "tenders.view",
      },
      {
        to: "/admin/vacancies",
        label: "Vacancies",
        icon: Briefcase,
        permission: "vacancies.view",
      },
      {
        to: "/admin/publications",
        label: "Publications",
        icon: BookOpen,
        permission: "publications.view",
      },
      {
        to: "/admin/city-admins",
        label: "City Administrations",
        icon: Building2,
        permission: "city_admins.view",
      },

      /*
       * Directorates is intentionally ALWAYS visible.
       *
       * The permission is still attached so the actual page
       * can enforce directory.view.
       */
      {
        to: "/admin/directory",
        label: "Directorates",
        icon: Building2,
        permission: "directory.view",
        alwaysVisible: true,
      },
    ],
  },

  {
    label: "Administration",
    items: [
      {
        to: "/admin/users",
        label: "Users & Roles",
        icon: Users,
        permission: "users.view",
        superAdminOnly: true,
      },
      {
        to: "/admin/permissions",
        label: "Permissions",
        icon: KeyRound,
        permission: "permissions.view",
        superAdminOnly: true,
      },
    ],
  },

  {
    label: "Communication",
    items: [
      {
        to: "/admin/messages",
        label: "Messages",
        icon: MessageSquare,
        permission: "messages.view",
      },
      {
        to: "/admin/notifications",
        label: "Notifications",
        icon: BellRing,
        permission: "notifications.view",
      },
    ],
  },

  {
    label: "System",
    items: [
      {
        to: "/admin/multimedia",
        label: "Multimedia Library",
        icon: ImageIcon,
        permission: "multimedia.view",
      },
      {
        to: "/admin/backgrounds",
        label: "Background Images",
        icon: ImageIcon,
        permission: "backgrounds.view",
      },
      {
        to: "/admin/settings",
        label: "Settings",
        icon: Settings,
        permission: "settings.view",
        superAdminOnly: true,
      },
    ],
  },
];

function getDisplayName(user: any): string {
  return (
    user?.name ||
    user?.full_name ||
    user?.fullName ||
    user?.username ||
    user?.email ||
    "Administrator"
  );
}

function getDisplayEmail(user: any): string {
  return user?.email || "";
}

function getDisplayRole(
  user: any,
  isSuperAdmin: boolean,
): string {
  if (isSuperAdmin) return "Super Admin";

  const role =
    user?.role?.name ||
    user?.role_name ||
    user?.roleName ||
    user?.role ||
    "Admin";

  if (typeof role === "string") {
    return role
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return "Admin";
}

export function AdminLayout({
  children,
  permission,
}: {
  children: ReactNode;
  permission?: string;
}) {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const navigate = useNavigate();

  const { user, can, isSuperAdmin, signOut } = useAuth();

  const [openMobile, setOpenMobile] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  /*
   * IMPORTANT:
   * Keep hooks before any conditional return.
   * This avoids violating React's Rules of Hooks.
   */

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }

      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  /*
   * Page-level permission check.
   *
   * Directorates still reaches this check even though its
   * sidebar item is always visible.
   */
  const hasPermission =
    !permission || isSuperAdmin || can(permission as any);

  /*
   * Sidebar filtering.
   *
   * Normal modules:
   *   - hidden when the user lacks permission
   *
   * Directorates:
   *   - always visible because alwaysVisible === true
   *   - page itself still checks directory.view
   */
  const visibleGroups = useMemo(() => {
    return NAV_GROUPS.map((group) => ({
      ...group,

      items: group.items.filter((item) => {
        if (isSuperAdmin) return true;

        if (item.superAdminOnly) return false;

        if (item.alwaysVisible) return true;

        if (!item.permission) return true;

        return can(item.permission);
      }),
    })).filter((group) => group.items.length > 0);
  }, [can, isSuperAdmin]);

  const allVisibleItems = useMemo(
    () =>
      visibleGroups.flatMap((group) => group.items),
    [visibleGroups],
  );

  const displayName = getDisplayName(user);
  const displayEmail = getDisplayEmail(user);
  const displayRole = getDisplayRole(
    user,
    isSuperAdmin,
  );

  const handleSignOut = async () => {
    if (signingOut) return;

    try {
      setSigningOut(true);

      await signOut();

      await navigate({
        to: "/admin/login",
      });
    } catch (error) {
      console.error("Sign out failed:", error);
      setSigningOut(false);
    }
  };

  /*
   * Authorization screen.
   *
   * This is intentionally handled in the frontend as a
   * friendly UX layer.
   *
   * Laravel remains responsible for enforcing the actual
   * API permission.
   */
  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-secondary/40 px-4 py-8 sm:px-6">
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-elegant">
            <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/60 px-6 py-10 text-center sm:px-10">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                <ShieldAlert className="h-8 w-8" />
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Restricted Area
                </p>

                <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
                  This area is not available to you
                </h1>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  Your account does not have the required
                  permission to access this section of the
                  Afar UDCB Administration Portal.
                </p>
              </div>
            </div>

            <div className="border-t bg-card px-6 py-6 sm:px-10">
              <div className="rounded-xl border bg-secondary/40 p-4">
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0">
                    <ShieldAlert className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Permission required
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      If you believe you should have access,
                      please contact your Super Administrator
                      to update your account permissions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Link
                  to="/admin"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
                >
                  Return to Dashboard
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/admin/login",
                    })
                  }
                  className="inline-flex items-center justify-center rounded-lg border bg-background px-5 py-2.5 text-sm font-medium transition hover:bg-secondary"
                >
                  Switch Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="flex">
        <SidebarNav
          pathname={pathname}
          openMobile={openMobile}
          onClose={() => setOpenMobile(false)}
          groups={visibleGroups}
          onSignOut={handleSignOut}
          signingOut={signingOut}
        />

        {openMobile && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setOpenMobile(false)}
          />
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3 md:px-6">
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-md border lg:hidden"
                onClick={() =>
                  setOpenMobile((v) => !v)
                }
                aria-label="Toggle sidebar"
              >
                {openMobile ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="group relative flex h-9 max-w-md flex-1 items-center rounded-lg border bg-background pl-9 pr-2 text-left text-sm text-muted-foreground hover:border-primary/40"
              >
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />

                <span className="truncate">
                  Search modules and pages…
                </span>

                <kbd className="ml-auto hidden rounded border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-foreground/60 sm:inline-block">
                  ⌘K
                </kbd>
              </button>

              <NotificationBell
                open={notifOpen}
                onOpenChange={setNotifOpen}
              />

              <ProfileMenu
                open={profileOpen}
                onOpenChange={setProfileOpen}
                displayName={displayName}
                displayEmail={displayEmail}
                displayRole={displayRole}
                isSuperAdmin={isSuperAdmin}
                onSignOut={handleSignOut}
                signingOut={signingOut}
              />
            </div>

            <Breadcrumbs
              pathname={pathname}
              items={allVisibleItems}
            />
          </header>

          <div className="px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </div>
      </div>

      {searchOpen && (
        <GlobalSearch
          onClose={() => setSearchOpen(false)}
          items={allVisibleItems}
        />
      )}
    </div>
  );
}

function SidebarNav({
  pathname,
  openMobile,
  onClose,
  groups,
  onSignOut,
  signingOut,
}: {
  pathname: string;
  openMobile: boolean;
  onClose: () => void;
  groups: NavGroup[];
  onSignOut: () => Promise<void>;
  signingOut: boolean;
}) {
  return (
    <aside
      className={
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-screen " +
        (openMobile
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0")
      }
    >
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-accent">
          <span className="font-display text-base font-bold text-gold">
            A
          </span>
        </div>

        <div className="min-w-0">
          <div className="truncate font-display text-sm font-semibold">
            Afar UDCB
          </div>

          <div className="truncate text-xs text-sidebar-foreground/70">
            Admin Portal
          </div>
        </div>

        <button
          type="button"
          className="ml-auto grid h-8 w-8 place-items-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <SidebarGroup
            key={group.label}
            group={group}
            pathname={pathname}
          />
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          disabled={signingOut}
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />

          {signingOut
            ? "Signing out…"
            : "Sign out"}
        </button>

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

function SidebarGroup({
  group,
  pathname,
}: {
  group: NavGroup;
  pathname: string;
}) {
  const hasActive = group.items.some((item) =>
    item.exact
      ? pathname === item.to
      : pathname.startsWith(item.to),
  );

  const [open, setOpen] = useState(
    hasActive || group.label === "Overview",
  );

  useEffect(() => {
    if (hasActive) {
      setOpen(true);
    }
  }, [hasActive]);

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-gold"
      >
        <span>{group.label}</span>

        {open ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </button>

      {open && (
        <ul className="mt-1 space-y-0.5">
          {group.items.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname.startsWith(item.to);

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

                  <span className="truncate">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function useOutsideClick<T extends HTMLElement>(
  onOutside: () => void,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        onOutside();
      }
    };

    document.addEventListener("mousedown", onDoc);

    return () => {
      document.removeEventListener(
        "mousedown",
        onDoc,
      );
    };
  }, [onOutside]);

  return ref;
}

function NotificationBell({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const ref = useOutsideClick<HTMLDivElement>(() =>
    onOpenChange(false),
  );

  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [markingId, setMarkingId] = useState<number | null>(
    null,
  );

  const [markingAll, setMarkingAll] = useState(false);

  const [loadError, setLoadError] = useState("");

  const unread = notifications.filter(
    (notification) => !notification.is_read,
  ).length;

  /*
   * Load notifications as soon as the admin layout is mounted.
   *
   * This is intentionally NOT dependent on "open".
   * Therefore the unread badge appears without clicking
   * the notification bell.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadNotifications(
      showLoading = false,
    ) {
      try {
        if (showLoading) {
          setLoading(true);
        }

        setLoadError("");

        const data = await getNotifications();

        if (!cancelled) {
          setNotifications(data);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load notifications.",
          );
        }
      } finally {
        if (!cancelled && showLoading) {
          setLoading(false);
        }
      }
    }

    // Initial load.
    loadNotifications(true);

    /*
     * Automatically check for new notifications every
     * 15 seconds while the admin portal is open.
     */
    const interval = window.setInterval(() => {
      loadNotifications(false);
    }, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  /*
   * When the user opens the notification dropdown,
   * refresh immediately instead of waiting for the
   * 15-second interval.
   */
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function refreshNotifications() {
      try {
        const data = await getNotifications();

        if (!cancelled) {
          setNotifications(data);
        }
      } catch (error) {
        console.error(
          "Failed to refresh notifications:",
          error,
        );
      }
    }

    refreshNotifications();

    return () => {
      cancelled = true;
    };
  }, [open]);

  /*
   * Mark ONE notification as read.
   */
  async function handleMarkAsRead(
    notification: NotificationItem,
  ) {
    if (
      notification.is_read ||
      markingId !== null ||
      markingAll
    ) {
      return;
    }

    try {
      setMarkingId(notification.id);

      const updated = await markNotificationAsRead(
        notification.id,
      );

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? updated : item,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error,
      );
    } finally {
      setMarkingId(null);
    }
  }

  /*
   * Mark ALL notifications as read.
   */
  async function handleMarkAllAsRead() {
    if (
      unread === 0 ||
      markingAll ||
      markingId !== null
    ) {
      return;
    }

    try {
      setMarkingAll(true);

      await markAllNotificationsAsRead();

      /*
       * Immediately update the local UI.
       *
       * This makes the red unread badge disappear
       * immediately after the backend succeeds.
       */
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        })),
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error,
      );
    } finally {
      setMarkingAll(false);
    }
  }

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="relative grid h-9 w-9 place-items-center rounded-md border bg-background transition hover:bg-secondary"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-4 w-4" />

        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground shadow-sm">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border bg-card shadow-elegant">

          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <div className="text-sm font-semibold">
                Notifications
              </div>

              <div className="mt-0.5 text-xs text-muted-foreground">
                {unread > 0
                  ? `${unread} unread notification${
                      unread === 1 ? "" : "s"
                    }`
                  : "You're all caught up"}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  disabled={
                    markingAll ||
                    markingId !== null
                  }
                  className="rounded-md px-2 py-1 text-xs font-medium text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {markingAll
                    ? "Marking…"
                    : "Mark all as read"}
                </button>
              )}

              <Link
                to="/admin/notifications"
                onClick={() => onOpenChange(false)}
                className="rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
              >
                View all
              </Link>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>

              <p className="mt-3 text-sm font-medium">
                Checking notifications…
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Getting the latest alerts.
              </p>
            </div>

          ) : loadError ? (

            /* Error */
            <div className="px-5 py-8 text-center">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-destructive/10">
                <BellRing className="h-5 w-5 text-destructive" />
              </div>

              <p className="mt-3 text-sm font-medium">
                Notifications unavailable
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                We couldn't retrieve your notifications right now.
              </p>

              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="mt-4 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
              >
                Close
              </button>
            </div>

          ) : recentNotifications.length === 0 ? (

            /* Empty */
            <div className="px-5 py-10 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>

              <p className="mt-3 text-sm font-semibold">
                No notifications yet
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                New system alerts and activity notices will appear here.
              </p>
            </div>

          ) : (

            /* Notifications */
            <>
              <ul className="max-h-[22rem] divide-y overflow-y-auto">
                {recentNotifications.map((notification) => {
                  const isMarking =
                    markingId === notification.id;

                  return (
                    <li key={notification.id}>
                      <button
                        type="button"
                        onClick={() =>
                          handleMarkAsRead(notification)
                        }
                        disabled={
                          notification.is_read ||
                          markingId !== null ||
                          markingAll
                        }
                        className={
                          "flex w-full gap-3 px-4 py-3 text-left transition hover:bg-secondary/70 " +
                          (!notification.is_read
                            ? "bg-primary/5"
                            : "")
                        }
                      >
                        <div
                          className={
                            "mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full " +
                            (notification.is_read
                              ? "bg-secondary text-muted-foreground"
                              : "bg-primary/10 text-primary")
                          }
                        >
                          {isMarking ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : notification.is_read ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <BellRing className="h-3.5 w-3.5" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <div
                              className={
                                "min-w-0 flex-1 truncate text-sm font-medium " +
                                (!notification.is_read
                                  ? "text-foreground"
                                  : "text-foreground/80")
                              }
                            >
                              {notification.title}
                            </div>

                            {!notification.is_read && (
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>

                          <div className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                            {notification.body}
                          </div>

                          <div className="mt-1 text-[10px] text-muted-foreground">
                            {formatNotificationTime(
                              notification.created_at,
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t bg-secondary/20 px-4 py-2.5">
                <Link
                  to="/admin/notifications"
                  onClick={() => onOpenChange(false)}
                  className="flex items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
                >
                  Open notification center
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function formatNotificationTime(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function ProfileMenu({
  open,
  onOpenChange,
  displayName,
  displayEmail,
  displayRole,
  isSuperAdmin,
  onSignOut,
  signingOut,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  displayName: string;
  displayEmail: string;
  displayRole: string;
  isSuperAdmin: boolean;
  onSignOut: () => Promise<void>;
  signingOut: boolean;
}) {
  const ref = useOutsideClick<HTMLDivElement>(() =>
    onOpenChange(false),
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() =>
          onOpenChange(!open)
        }
        className="flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 hover:bg-secondary"
        aria-expanded={open}
        aria-label="Open account menu"
      >
        <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <div className="hidden text-left text-xs leading-tight sm:block">
          <div className="max-w-32 truncate font-medium">
            {displayName}
          </div>

          <div className="text-muted-foreground">
            {displayRole}
          </div>
        </div>

        <ChevronDown className="hidden h-3 w-3 text-muted-foreground sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border bg-card shadow-elegant">
          <div className="border-b px-4 py-3">
            <div className="truncate text-sm font-semibold">
              {displayName}
            </div>

            {displayEmail && (
              <div className="truncate text-xs text-muted-foreground">
                {displayEmail}
              </div>
            )}

            <div className="mt-1 text-xs font-medium text-primary">
              {displayRole}
            </div>
          </div>

          <ul className="py-1 text-sm">
            <li>
              <Link
                to="/admin/profile"
                onClick={() =>
                  onOpenChange(false)
                }
                className="flex items-center gap-2 px-4 py-2 hover:bg-secondary"
              >
                <User className="h-4 w-4" />
                My profile
              </Link>
            </li>

            {isSuperAdmin && (
              <li>
                <Link
                  to="/admin/settings"
                  onClick={() =>
                    onOpenChange(false)
                  }
                  className="flex items-center gap-2 px-4 py-2 hover:bg-secondary"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </li>
            )}

            <li>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 hover:bg-secondary"
                onClick={(event) =>
                  event.preventDefault()
                }
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </a>
            </li>
          </ul>

          <div className="border-t p-1">
            <button
              type="button"
              disabled={signingOut}
              onClick={onSignOut}
              className="flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />

              {signingOut
                ? "Signing out…"
                : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function GlobalSearch({
  onClose,
  items,
}: {
  onClose: () => void;
  items: NavLeaf[];
}) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    if (!q.trim()) {
      return items;
    }

    return items.filter((item) =>
      item.label
        .toLowerCase()
        .includes(q.toLowerCase()),
    );
  }, [q, items]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border bg-card shadow-elegant"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="h-4 w-4 text-muted-foreground" />

          <input
            autoFocus
            value={q}
            onChange={(e) =>
              setQ(e.target.value)
            }
            placeholder="Search modules and pages…"
            className="h-12 flex-1 bg-transparent text-sm outline-none"
          />

          <kbd className="rounded border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            Esc
          </kbd>
        </div>

        <ul className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">
              No matches
            </li>
          )}

          {results.map((result) => {
            const Icon = result.icon;

            return (
              <li key={result.to}>
                <Link
                  to={result.to}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />

                  <span>{result.label}</span>

                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                    {result.to}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Breadcrumbs({
  pathname,
  items,
}: {
  pathname: string;
  items: NavLeaf[];
}) {
  const crumbs = useMemo(() => {
    const parts = pathname
      .split("/")
      .filter(Boolean);

    const acc: {
      href: string;
      label: string;
    }[] = [];

    let cur = "";

    for (const part of parts) {
      cur += "/" + part;

      const found = items.find(
        (item) => item.to === cur,
      );

      const label =
        found?.label ??
        part.charAt(0).toUpperCase() +
          part.slice(1);

      acc.push({
        href: cur,
        label,
      });
    }

    return acc;
  }, [pathname, items]);

  return (
    <div className="hidden border-t px-4 py-2 md:block md:px-6">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          to="/admin"
          className="hover:text-primary"
        >
          Admin
        </Link>

        {crumbs
          .slice(1)
          .map((crumb, index, array) => (
            <span
              key={crumb.href}
              className="flex items-center gap-1.5"
            >
              <ChevronRight className="h-3 w-3" />

              {index === array.length - 1 ? (
                <span className="font-medium text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <span>{crumb.label}</span>
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
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
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

      <h3 className="mt-4 font-display text-base font-semibold">
        {title}
      </h3>

      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}







