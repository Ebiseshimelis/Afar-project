import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/city-admins")({
  component: AdminCityAdminsPage,
});

function AdminCityAdminsPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Manage City Administrations</h1>
      <p className="text-sm text-muted-foreground">
        Create, update, or remove city administration entries.
      </p>
      {/* Admin table / CRUD form for City Admins */}
    </div>
  );
}