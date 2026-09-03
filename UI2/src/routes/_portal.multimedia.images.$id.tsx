import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import {
  getMultimedia,
  getMultimediaItem,
  getMediaUrl,
  type MultimediaItem,
} from "@/services/multimediaService";

export const Route = createFileRoute(
  "/_portal/multimedia/images/$id",
)({
  loader: async ({ params }) => {
    const item = await getMultimediaItem(params.id);

    if (!item || item.type !== "image") {
      throw notFound();
    }

    const allImages = await getMultimedia();

    const images = allImages.filter(
      (image) =>
        image.type === "image" &&
        image.status === "published",
    );

    return {
      item,
      images,
    };
  },

  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.item.title} — Afar UDCB`
          : "Image — Afar UDCB",
      },
      {
        name: "description",
        content:
          loaderData?.item.description ||
          "Image from Afar UDCB.",
      },
      {
        property: "og:title",
        content:
          loaderData?.item.title ||
          "Image — Afar UDCB",
      },
      {
        property: "og:description",
        content:
          loaderData?.item.description ||
          "Image from Afar UDCB.",
      },
      {
        property: "og:type",
        content: "article",
      },
    ],
  }),

  component: ImageDetailPage,

  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />

      <h1 className="mt-4 font-display text-2xl font-semibold">
        Image not found
      </h1>

      <Link
        to="/multimedia/images"
        className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Image Gallery
      </Link>
    </div>
  ),
});

function ImageDetailPage() {
  const { item, images } = Route.useLoaderData();

  const imageUrl =
    item.fileUrl ||
    getMediaUrl(item.filePath) ||
    "";

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <Link
        to="/multimedia/images"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Image Gallery
      </Link>

      {/* Selected image */}
      <article className="overflow-hidden rounded-xl border bg-card shadow-soft">

        <div className="flex min-h-[450px] items-center justify-center bg-secondary p-4 md:min-h-[600px]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.title || "Afar UDCB image"}
              className="max-h-[70vh] w-full object-contain"
            />
          ) : (
            <ImageIcon className="h-20 w-20 text-muted-foreground" />
          )}
        </div>

        <div className="p-6 md:p-8">
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            {item.title || "Untitled Image"}
          </h1>

          {item.description && (
            <p className="mt-4 whitespace-pre-wrap text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>

      </article>

      {/* Other images */}
      {images.length > 1 && (
        <section className="mt-10">

          <h2 className="font-display text-xl font-bold">
            More Images
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images
              .filter((image) => image.id !== item.id)
              .map((image: MultimediaItem) => {
                const thumbnail =
                  image.fileUrl ||
                  getMediaUrl(image.filePath) ||
                  "";

                return (
                  <Link
                    key={image.id}
                    to="/multimedia/images/$id"
                    params={{
                      id: String(image.id),
                    }}
                    className="group overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="h-44 w-full overflow-hidden bg-secondary">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={image.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full place-items-center">
                          <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold">
                        {image.title || "Untitled Image"}
                      </h3>

                      {image.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {image.description}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
          </div>

        </section>
      )}

    </div>
  );
}
