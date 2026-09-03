import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getMultimedia,
  type MultimediaItem,
} from "@/services/multimediaService";
import { Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute(
  "/_portal/multimedia/images/",
)({
  head: () => ({
    meta: [
      {
        title: "Image Gallery - Afar UDCB",
      },
    ],
  }),
  component: ImageGalleryPage,
});

function ImageGalleryPage() {
  const [images, setImages] =
    useState<MultimediaItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadImages() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getMultimedia();

        setImages(
          data.filter(
            (item) =>
              item.type ===
              "image" &&
              item.status ===
                "published",
          ),
        );
      } catch (err) {
        console.error(
          "Failed to load images:",
          err,
        );

        setError(
          "Unable to load images.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-display text-2xl font-bold">
        Image Gallery
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Browse photos and image collections.
      </p>

      {loading && (
        <div className="py-10 text-center text-muted-foreground">
          Loading images...
        </div>
      )}

      {error && (
        <div className="py-10 text-center text-destructive">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        images.length === 0 && (
          <div className="mt-8 rounded-xl border bg-card p-10 text-center shadow-soft">
            <ImageIcon className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-lg font-semibold">
              No images available
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              There are currently no images available in the gallery.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        images.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => {
              const imageUrl =
                image.fileUrl ||
                image.filePath ||
                "";

              return (
                <Link
                  key={image.id}
                  to="/multimedia/images/$id"
                  params={{ id: String(image.id) }}
                  className="block overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="h-56 w-full bg-secondary">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={image.title}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          console.error(
                            "Failed to load image:",
                            imageUrl,
                          );

                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div className="grid h-full place-items-center">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold">
                      {image.title}
                    </h3>

                    {image.description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {image.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
    </div>
  );
}


