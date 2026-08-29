import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_portal/multimedia/videos")({
  component: MultimediaVideosLayout,
});

function MultimediaVideosLayout() {
  return <Outlet />;
}
