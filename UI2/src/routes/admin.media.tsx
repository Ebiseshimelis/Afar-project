import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { mediaItems } from "@/lib/mock-data";
import { Upload, FileText, Image as ImageIcon, Trash2, Download } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/media")({
  head: () => ({ meta: [{ title: "Media Library" }, { name: "robots", content: "noindex" }] }),
  component: MediaAdmin,
});

function MediaAdmin() {
  const [tab, setTab] = useState<"all" | "image" | "document">("all");
  const items = mediaItems.filter((m) => tab === "all" || m.type === tab);
  return (
    <AdminLayout>
      <AdminPageHeader
        title="Media Library"
        description="Images, documents, and upload center."
        action={<button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"><Upload className="h-4 w-4" /> Upload</button>}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border bg-card p-1">
          {(["all", "image", "document"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={"rounded-md px-3 py-1.5 text-xs font-medium capitalize " + (tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              {t === "all" ? "All" : t + "s"}
            </button>
          ))}
        </div>
        <div className="text-xs text-muted-foreground">{items.length} files</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((m) => (
          <div key={m.id} className="overflow-hidden rounded-xl border bg-card shadow-soft">
            <div className="aspect-video bg-secondary">
              {m.type === "image" ? (
                <img src={m.url} alt={m.name} className="size-full object-cover" />
              ) : (
                <div className="grid size-full place-items-center text-muted-foreground">
                  <FileText className="h-10 w-10" />
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2">
                {m.type === "image" ? <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" /> : <FileText className="h-3.5 w-3.5 text-muted-foreground" />}
                <div className="truncate text-sm font-medium">{m.name}</div>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{m.size}</span>
                <span>{new Date(m.date).toLocaleDateString()}</span>
              </div>
              <div className="mt-3 flex justify-end gap-1">
                <button aria-label="Download" className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary"><Download className="h-4 w-4" /></button>
                <button aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
