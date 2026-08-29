import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Video, Play } from "lucide-react";
import {
  getMultimedia,
  getMultimediaItem,
  getMediaUrl,
  type MultimediaItem,
} from "@/services/multimediaService";

export const Route = createFileRoute(
  "/_portal/multimedia/videos/$id",
)({
  loader: async ({ params }) => {
    const item = await getMultimediaItem(params.id);

    if (!item || item.type !== "video") {
      throw notFound();
    }

    const allVideos = await getMultimedia();

    const videos = allVideos.filter(
      (video) =>
        video.type === "video" &&
        video.status === "published",
    );

    return {
      item,
      videos,
    };
  },

  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.item.title} — Afar UDCB`
          : "Video — Afar UDCB",
      },
      {
        name: "description",
        content:
          loaderData?.item.description ||
          "Video from Afar UDCB.",
      },
    ],
  }),

  component: VideoDetailPage,

  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <Video className="mx-auto h-12 w-12 text-muted-foreground" />

      <h1 className="mt-4 font-display text-2xl font-semibold">
        Video not found
      </h1>

      <Link
        to="/multimedia/videos"
        className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Video Gallery
      </Link>
    </div>
  ),
});

function VideoDetailPage() {
  const { item, videos } = Route.useLoaderData();

  const videoUrl =
    item.videoUrl ||
    item.fileUrl ||
    getMediaUrl(item.filePath) ||
    "";

  const poster = item.thumbnail || undefined;

  const otherVideos = videos.filter(
    (video) => video.id !== item.id,
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <Link
        to="/multimedia/videos"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Video Gallery
      </Link>

      {/* Selected video */}
      <article className="overflow-hidden rounded-xl border bg-card shadow-soft">

        <div className="flex min-h-[450px] items-center justify-center bg-black p-4 md:min-h-[600px]">

          {videoUrl ? (
            <video
              key={videoUrl}
              src={videoUrl}
              controls
              autoPlay
              playsInline
              preload="metadata"
              poster={poster}
              className="block max-h-[70vh] w-full object-contain"
              onError={(event) => {
                console.error(
                  "Failed to load video:",
                  videoUrl,
                  event.currentTarget.error,
                );
              }}
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-white">
              <Video className="h-20 w-20 opacity-50" />

              <p className="mt-4 text-lg">
                Video is currently unavailable.
              </p>
            </div>
          )}

        </div>

        <div className="p-6 md:p-8">

          <h1 className="font-display text-2xl font-bold md:text-3xl">
            {item.title || "Untitled Video"}
          </h1>

          {item.description && (
            <p className="mt-4 whitespace-pre-wrap text-muted-foreground">
              {item.description}
            </p>
          )}

        </div>

      </article>

      {/* Other videos */}
      {otherVideos.length > 0 && (
        <section className="mt-10">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">
              More Videos
            </h2>

            <Link
              to="/multimedia/videos"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {otherVideos.map(
              (video: MultimediaItem) => {

                const source =
                  video.videoUrl ||
                  video.fileUrl ||
                  getMediaUrl(video.filePath) ||
                  "";

                const poster =
                  video.thumbnail || undefined;

                return (
                  <Link
                    key={video.id}
                    to="/multimedia/videos/$id"
                    params={{
                      id: String(video.id),
                    }}
                    className="group overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-md"
                  >

                    <div className="relative h-44 w-full overflow-hidden bg-secondary">

                      {source ? (
                        <video
                          src={source}
                          poster={poster}
                          muted
                          preload="metadata"
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center">
                          <Video className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}

                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 shadow-lg">
                          <Play className="ml-1 h-5 w-5 fill-current" />
                        </div>

                      </div>

                    </div>

                    <div className="p-4">

                      <h3 className="font-semibold">
                        {video.title || "Untitled Video"}
                      </h3>

                      {video.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {video.description}
                        </p>
                      )}

                    </div>

                  </Link>
                );
              },
            )}

          </div>

        </section>
      )}

    </div>
  );
}
