import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMultimedia, type MultimediaItem } from "@/services/multimediaService";
import { Video } from "lucide-react";

export const Route = createFileRoute("/_portal/multimedia/videos")({
  head: () => ({
    meta: [{ title: "Video Gallery — Afar UDCB" }],
  }),
  component: VideoGalleryPage,
});

function VideoGalleryPage() {
  const [videos, setVideos] = useState<MultimediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideos() {
      try {
        setLoading(true);
        setError(null);

        const data = await getMultimedia();

        setVideos(data.filter((item) => item.type === "video"));
      } catch (err) {
        console.error("Failed to load videos:", err);
        setError("Unable to load videos.");
      } finally {
        setLoading(false);
      }
    }

    loadVideos();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-2xl font-bold">Video Gallery</h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Watch videos and multimedia content from Afar UDCB.
      </p>

      {loading && (
        <div className="py-10 text-center text-muted-foreground">
          Loading videos...
        </div>
      )}

      {error && (
        <div className="py-10 text-center text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="mt-8 rounded-xl border bg-card p-10 text-center shadow-soft">
          <Video className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

          <h2 className="text-lg font-semibold">
            No videos available
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            There are currently no videos available.
          </p>
        </div>
      )}

      {!loading && !error && videos.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video.id}
              className="overflow-hidden rounded-xl border bg-card shadow-soft"
            >
              {video.videoUrl ? (
                <video
                  controls
                  poster={video.thumbnail || undefined}
                  className="h-56 w-full object-cover"
                >
                  <source src={video.videoUrl} />
                </video>
              ) : video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="grid h-56 place-items-center bg-secondary">
                  <Video className="h-10 w-10 text-muted-foreground" />
                </div>
              )}

              <div className="p-4">
                <h3 className="font-semibold">{video.title}</h3>

                {video.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {video.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}