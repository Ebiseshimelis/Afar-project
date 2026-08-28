import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getDirectorate,
  type Directorate,
} from "@/services/directorateService";

export const Route = createFileRoute("/_portal/directory/$directorateId")({
  component: DirectorateDetailPage,
});

function DirectorateDetailPage() {
  const { directorateId } = Route.useParams();

  const [directorate, setDirectorate] = useState<Directorate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDirectorate() {
      try {
        setLoading(true);
        setError(null);

        const id = Number(directorateId);

        if (!Number.isInteger(id) || id <= 0) {
          throw new Error("Invalid directorate.");
        }

        const data = await getDirectorate(id);

        if (!cancelled) {
          setDirectorate(data);
        }
      } catch (err) {
        console.error("Failed to load directorate:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load directorate."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDirectorate();

    return () => {
      cancelled = true;
    };
  }, [directorateId]);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-sm text-muted-foreground">
          Loading directorate...
        </div>
      </section>
    );
  }

  if (error || !directorate) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Link
          to="/directory"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directorates
        </Link>

        <div className="rounded-xl border bg-card p-6 text-sm text-destructive">
          {error || "Directorate not found."}
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Directorate hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={directorate.background}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative mx-auto flex min-h-[420px] max-w-7xl items-end px-6 py-16">
          <div className="max-w-4xl text-white">
            <Link
              to="/directory"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-sm backdrop-blur-sm transition hover:bg-black/30"
            >
              <ArrowLeft className="h-4 w-4" />
              Directorates
            </Link>

            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              Directorate
            </div>

            <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {directorate.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Directorate information */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* Main content */}
          <article className="rounded-xl border bg-card p-6 shadow-soft">
            <div className="mb-5 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />

              <h2 className="font-display text-xl font-semibold">
                About the Directorate
              </h2>
            </div>

            <div className="prose prose-sm max-w-none text-muted-foreground">
              {directorate.description ? (
                <p className="whitespace-pre-line leading-7">
                  {directorate.description}
                </p>
              ) : (
                <p>No description is available for this directorate.</p>
              )}
            </div>
          </article>

          {/* Smaller director card */}
          <aside>
            <div className="rounded-xl border bg-card p-3 shadow-soft">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Director
              </div>

              <div className="flex items-center gap-3">
                {directorate.photo ? (
                  <img
                    src={directorate.photo}
                    alt={directorate.headName || directorate.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-primary/10"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="font-display text-sm font-semibold leading-tight">
                    {directorate.headName || "—"}
                  </h2>

                  <p className="mt-0.5 text-xs text-primary">
                    {directorate.headTitle || "Director"}
                  </p>
                </div>
              </div>

              {(directorate.phone || directorate.email) && (
                <div className="mt-3 space-y-1.5 border-t pt-2.5 text-xs">
                  {directorate.phone && (
                    <a
                      href={`tel:${directorate.phone}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {directorate.phone}
                      </span>
                    </a>
                  )}

                  {directorate.email && (
                    <a
                      href={`mailto:${directorate.email}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {directorate.email}
                      </span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
