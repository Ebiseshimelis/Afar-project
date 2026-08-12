import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { messages } from "@/lib/mock-data";
import { Mail, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Contact Messages" }, { name: "robots", content: "noindex" }] }),
  component: MessagesAdmin,
});

function MessagesAdmin() {
  return (
    <AdminLayout>
      <AdminPageHeader title="Contact Messages" description="Messages submitted through the public contact form." />
      <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
        <ul className="divide-y">
          {messages.map((m) => (
            <li key={m.id} className={"flex items-center gap-4 px-5 py-4 " + (m.read ? "" : "bg-primary/5")}>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                {m.name.split(" ").map(p => p[0]).join("").slice(0,2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{m.name}</span>
                  {!m.read && <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase text-primary-foreground">New</span>}
                </div>
                <div className="text-xs text-muted-foreground">{m.email}</div>
                <div className="mt-1 line-clamp-1 text-sm">{m.subject}</div>
              </div>
              <div className="hidden text-xs text-muted-foreground sm:block">{new Date(m.date).toLocaleDateString()}</div>
              <div className="flex gap-1">
                <button aria-label="Reply" className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"><Mail className="h-4 w-4" /></button>
                <button aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}
