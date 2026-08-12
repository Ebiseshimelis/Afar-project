import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/multimedia")({
  component: AdminMultimediaPage,
});

function AdminMultimediaPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Manage Multimedia</h1>
      <p className="text-sm text-muted-foreground">
        Upload and manage photos and video links.
      </p>
      {/* Admin media table/upload forms */}
    </div>
  );
}