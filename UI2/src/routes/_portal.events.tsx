import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_portal/events")({
  component: EventsLayout,
});

function EventsLayout() {
  return <Outlet />;
}
