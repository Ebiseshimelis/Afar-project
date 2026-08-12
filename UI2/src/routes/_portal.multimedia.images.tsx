import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_portal/multimedia/images")({
  head: () => ({
    meta: [{ title: "Image Gallery — Afar UDCB" }],
  }),
  component: ImageGalleryPage,
});

function ImageGalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-2xl font-bold">Image Gallery</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Browse photos and image collections.
      </p>
      {/* Photo gallery grid goes here */}
    </div>
  );
}