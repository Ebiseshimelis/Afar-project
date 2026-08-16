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

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotificationsAdmin,
});

function NotificationsAdmin() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load notifications.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleMarkAsRead(id: number) {
    try {
      const updated = await markNotificationAsRead(id);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? updated
            : notification,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      setMarkingAll(true);

      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteNotification(id);

      setNotifications((current) =>
        current.filter(
          (notification) => notification.id !== id,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Notifications"
        description="System-generated alerts and activity notices."
        action={
          <button
            onClick={handleMarkAllAsRead}
            disabled={
              markingAll ||
              !notifications.some(
                (notification) => !notification.is_read,
              )
            }
            className="rounded-lg border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {markingAll
              ? "Marking..."
              : "Mark all as read"}
          </button>
        }
      />

      <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading notifications...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-sm text-destructive">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No notifications yet.
          </div>
        ) : (
          <ul className="divide-y">
            {notifications.map((notification) => {
              const Icon =
                iconMap[
                  notification.type as keyof typeof iconMap
                ] ?? BellRing;

              return (
                <li
                  key={notification.id}
                  className={
                    "flex items-start gap-4 px-5 py-4 " +
                    (!notification.is_read
                      ? "bg-primary/5"
                      : "")
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
                          handleMarkAsRead(notification.id)
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

                    <div className="text-sm text-muted-foreground">
                      {notification.body}
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      {new Date(
                        notification.created_at,
                      ).toLocaleString()}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(notification.id)
                    }
                    aria-label="Delete notification"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
}
