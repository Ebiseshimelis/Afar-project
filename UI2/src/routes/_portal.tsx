import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/portal/PortalLayout";

export const Route = createFileRoute("/_portal")({
  component: PortalLayout,
});


