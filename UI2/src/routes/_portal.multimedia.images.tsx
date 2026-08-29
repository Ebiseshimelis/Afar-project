import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_portal/multimedia/images")({
  component: MultimediaImagesLayout,
});

function MultimediaImagesLayout() {
  return <Outlet />;
}
