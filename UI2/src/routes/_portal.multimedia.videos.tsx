import { createFileRoute } from "@tanstack/react-router";

// ❌ WRONG (will throw a compare error):
// export const Route = createFileRoute("/_portal.multimedia.videos")({ ... })
// export const Route = createFileRoute("multimedia/videos")({ ... })

// ✅ CORRECT:
export const Route = createFileRoute("/_portal/multimedia/videos")({
  component: VideoGalleryPage,
});

function VideoGalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-2xl font-bold">Video Gallery</h1>
    </div>
  );
}