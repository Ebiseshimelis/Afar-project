import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";

import { permissions, roles } from "@/lib/mock-data";
import { Check, Minus } from "lucide-react";

export const Route = createFileRoute("/admin/permissions")({
  head: () => ({ meta: [{ title: "Permissions" }, { name: "robots", content: "noindex" }] }),
  component: PermissionsAdmin,
});

function PermissionsAdmin() {
  const groups = Array.from(new Set(permissions.map((p) => p.group)));
  return (
    <AdminLayout>
      <AdminPageHeader title="Permissions" description="Fine-grained permissions assigned to each role." />
      <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Permission</th>
                {roles.map((r) => (
                  <th key={r.id} className="px-5 py-3 text-center">{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <Fragment key={g}>
                  <tr className="bg-secondary/40">
                    <td colSpan={1 + roles.length} className="px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{g}</td>
                  </tr>
                  {permissions.filter((p) => p.group === g).map((p) => (
                    <tr key={p.key} className="border-t">
                      <td className="px-5 py-3">
                        <div className="font-medium">{p.label}</div>
                        <div className="font-mono text-[10px] text-muted-foreground">{p.key}</div>
                      </td>
                      {roles.map((r) => {
                        const has = r.permissions.includes("all") || r.permissions.includes(p.key);
                        return (
                          <td key={r.id} className="px-5 py-3 text-center">
                            {has ? (
                              <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-success/15 text-success"><Check className="h-3.5 w-3.5" /></span>
                            ) : (
                              <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-muted text-muted-foreground"><Minus className="h-3.5 w-3.5" /></span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </Fragment>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
