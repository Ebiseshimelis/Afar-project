import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import {
  deleteMessage,
  getMessage,
  getMessages,
  type ContactMessage,
} from "@/services/messageService";
import { Mail, Trash2, X, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({
    meta: [
      { title: "Contact Messages" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MessagesAdmin,
});

function MessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessage | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadMessages(showRefresh = false) {
    try {
      setError(null);

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load messages.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function handleOpenMessage(id: number) {
    try {
      setLoadingMessage(true);

      const message = await getMessage(id);
      setSelectedMessage(message);

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? { ...item, ...message, is_read: true }
            : item,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load the message.",
      );
    } finally {
      setLoadingMessage(false);
    }
  }

  async function handleDeleteMessage(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError(null);

      await deleteMessage(id);

      setMessages((current) =>
        current.filter((message) => message.id !== id),
      );

      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete the message.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const unreadCount = messages.filter(
    (message) =>
      !message.is_read ||
      message.is_read === 0,
  ).length;

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Contact Messages"
        description="Messages submitted through the public contact form."
      />

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {unreadCount} unread message{unreadCount === 1 ? "" : "s"}
        </div>

        <button
          type="button"
          onClick={() => loadMessages(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-secondary disabled:opacity-50"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
        {loading ? (
          <div className="flex items-center justify-center gap-2 px-5 py-12 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <Mail className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No messages</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Messages submitted through the contact form will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y">
            {messages.map((message) => {
              const isUnread =
                !message.is_read ||
                message.is_read === 0;

              const initials = message.full_name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <li
                  key={message.id}
                  className={
                    "flex items-center gap-4 px-5 py-4 transition-colors " +
                    (isUnread ? "bg-primary/5" : "")
                  }
                >
                  <button
                    type="button"
                    onClick={() => handleOpenMessage(message.id)}
                    className="flex min-w-0 flex-1 items-center gap-4 text-left"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {message.full_name}
                        </span>

                        {isUnread && (
                          <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase text-primary-foreground">
                            New
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {message.email}
                      </div>

                      <div className="mt-1 line-clamp-1 text-sm">
                        {message.subject}
                      </div>
                    </div>

                    <div className="hidden text-xs text-muted-foreground sm:block">
                      {new Date(
                        message.created_at,
                      ).toLocaleDateString()}
                    </div>
                  </button>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      aria-label="Open message"
                      onClick={() =>
                        handleOpenMessage(message.id)
                      }
                      disabled={loadingMessage}
                      className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary disabled:opacity-50"
                    >
                      <Mail className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      aria-label="Delete message"
                      onClick={() =>
                        handleDeleteMessage(message.id)
                      }
                      disabled={deletingId === message.id}
                      className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10 disabled:opacity-50"
                    >
                      {deletingId === message.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl border bg-card shadow-xl">
            <div className="flex items-start justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedMessage.subject}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  From {selectedMessage.full_name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"
                aria-label="Close message"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <span className="font-medium">Name:</span>{" "}
                  {selectedMessage.full_name}
                </div>

                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedMessage.email}
                </div>

                {selectedMessage.phone && (
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedMessage.phone}
                  </div>
                )}

                <div>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(
                    selectedMessage.created_at,
                  ).toLocaleString()}
                </div>
              </div>

              <div className="rounded-lg border bg-secondary/30 p-4">
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t px-5 py-4">
              <button
                type="button"
                onClick={() =>
                  handleDeleteMessage(selectedMessage.id)
                }
                disabled={
                  deletingId === selectedMessage.id
                }
                className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                {deletingId === selectedMessage.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
