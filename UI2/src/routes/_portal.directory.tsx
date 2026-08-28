import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_portal/directory")({
  component: DirectoryLayout,
});

function DirectoryLayout() {
  return <Outlet />;
}
