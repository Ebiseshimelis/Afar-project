import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BellRing,
  FileText,
  MessageSquare,
  Newspaper,
  Users,
  Trash2,
  Loader2,
  CheckCheck,
  RefreshCw,
} from "lucide-react";

import {
  AdminLayout,
  AdminPageHeader,
} from "@/components/admin/AdminLayout";

import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationItem,
} from "@/services/notificationService";

const iconMap = {
  tender: FileText,
  message: MessageSquare,
  news: Newspaper,
  user: Users,
} as const;

export const Route = createFileRoute(
  "/admin/notifications",
)({
  head: () => ({
    meta: [
      { title: "Notifications" },
      {
        name: "robots",
        content: "noindex",
      },
    ],
  }),
  component: NotificationsAdmin,
});

function NotificationsAdmin() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [markingAll, setMarkingAll] =
    useState(false);

  async function loadNotifications(
    showRefreshing = false,
  ) {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getNotifications();

      setNotifications(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't load your notifications. Please try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadNotifications();
  }, []);

  async function handleMarkAsRead(
    id: number,
  ) {
    try {
      const updated =
        await markNotificationAsRead(id);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? updated
            : notification,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't update this notification.",
      );
    }
  }

  async function handleMarkAllAsRead() {
    try {
      setMarkingAll(true);
      setError("");

      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        })),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't mark all notifications as read.",
      );
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleDelete(
    id: number,
  ) {
    try {
      setError("");

      await deleteNotification(id);

      setNotifications((current) =>
        current.filter(
          (notification) =>
            notification.id !== id,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't delete this notification.",
      );
    }
  }

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.is_read,
    ).length;

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Notifications"
        description="Stay informed about important activity and system updates."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                void loadNotifications(true)
              }
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={
                  "h-4 w-4" +
                  (refreshing
                    ? " animate-spin"
                    : "")
                }
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={
                handleMarkAllAsRead
              }
              disabled={
                markingAll ||
                unreadCount === 0
              }
              className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck className="h-4 w-4" />

              {markingAll
                ? "Marking..."
                : "Mark all as read"}
            </button>
          </div>
        }
      />

      {unreadCount > 0 && (
        <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
              <BellRing className="h-4 w-4 text-primary" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                You have{" "}
                {unreadCount} unread{" "}
                {unreadCount === 1
                  ? "notification"
                  : "notifications"}
              </p>

              <p className="text-xs text-muted-foreground">
                Review them below to keep your
                administration activity up to date.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
          <p className="text-sm font-medium text-destructive">
            {error}
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-secondary">
              <BellRing className="h-6 w-6 text-muted-foreground" />
            </div>

            <h3 className="text-base font-semibold">
              You're all caught up
            </h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              There are no notifications to review right now.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {notifications.map(
              (notification) => {
                const Icon =
                  iconMap[
                    notification.type as keyof typeof iconMap
                  ] ?? BellRing;

                return (
                  <li
                    key={notification.id}
                    className={
                      "flex items-start gap-4 px-5 py-4 transition-colors " +
                      (!notification.is_read
                        ? "bg-primary/5"
                        : "hover:bg-secondary/40")
                    }
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            !notification.is_read &&
                            void handleMarkAsRead(
                              notification.id,
                            )
                          }
                          className="text-left font-medium hover:underline"
                        >
                          {notification.title}
                        </button>

                        {!notification.is_read && (
                          <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase text-primary-foreground">
                            New
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {notification.body}
                      </p>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(
                          notification.created_at,
                        ).toLocaleString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void handleDelete(
                          notification.id,
                        )
                      }
                      aria-label="Delete notification"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              },
            )}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
}