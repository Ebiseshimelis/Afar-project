import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function RouteProgress() {
  const isLoading = useRouterState({ select: (s) => s.isLoading || s.isTransitioning });
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowSpinner(false);
      return;
    }
    const t = window.setTimeout(() => setShowSpinner(true), 250);
    return () => window.clearTimeout(t);
  }, [isLoading]);

  return (
    <>
      {/* Top shimmer bar — instant feedback on every navigation */}
      <div
        aria-hidden={!isLoading}
        className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px] overflow-hidden"
        style={{ opacity: isLoading ? 1 : 0, transition: "opacity 200ms" }}
      >
        <div className="h-full w-1/3 animate-[shimmer_1s_infinite] bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>

      {/* Centered dual-ring monogram spinner — appears on slow loads */}
      <div
        role="status"
        aria-live="polite"
        aria-label="Loading page"
        aria-hidden={!showSpinner}
        className="pointer-events-none fixed inset-0 z-[79] grid place-items-center"
        style={{
          opacity: showSpinner ? 1 : 0,
          transform: showSpinner ? "scale(1)" : "scale(0.96)",
          transition: "opacity 220ms ease, transform 220ms ease",
          background: showSpinner
            ? "color-mix(in oklab, var(--background) 55%, transparent)"
            : "transparent",
          backdropFilter: showSpinner ? "blur(6px)" : "none",
          WebkitBackdropFilter: showSpinner ? "blur(6px)" : "none",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="relative h-16 w-16">
            {/* Soft outer halo */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--gold) 35%, transparent), transparent 70%)",
                animation: "portal-pulse 1.8s ease-in-out infinite",
              }}
            />
            {/* Track ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-primary/10" />
            {/* Gold arc — spins clockwise */}
            <div
              className="absolute inset-0 rounded-full border-[3px]"
              style={{
                borderColor: "transparent",
                borderTopColor: "var(--gold)",
                borderRightColor: "color-mix(in oklab, var(--gold) 45%, transparent)",
                animation: "portal-spin 1.1s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite",
              }}
            />
            {/* Primary arc — spins counter-clockwise, inset */}
            <div
              className="absolute inset-[6px] rounded-full border-[2px]"
              style={{
                borderColor: "transparent",
                borderBottomColor: "var(--primary)",
                borderLeftColor: "color-mix(in oklab, var(--primary) 40%, transparent)",
                animation: "portal-spin-reverse 1.6s ease-in-out infinite",
              }}
            />
            {/* Monogram center */}
            <div className="absolute inset-[13px] rounded-full bg-background shadow-soft ring-1 ring-border grid place-items-center">
              <span className="text-[11px] font-bold tracking-[0.08em] text-primary">
                AR
              </span>
            </div>
          </div>

          {/* Label */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[13px] font-semibold tracking-wide text-foreground">
              Loading
              <span className="inline-flex ml-0.5">
                <span className="animate-[portal-dot_1.4s_infinite]" style={{ animationDelay: "0ms" }}>.</span>
                <span className="animate-[portal-dot_1.4s_infinite]" style={{ animationDelay: "200ms" }}>.</span>
                <span className="animate-[portal-dot_1.4s_infinite]" style={{ animationDelay: "400ms" }}>.</span>
              </span>
            </span>
            <span className="text-[11px] text-muted-foreground">Please wait a moment</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes portal-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes portal-spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes portal-pulse {
          0%, 100% { transform: scale(0.9); opacity: 0.45; }
          50% { transform: scale(1.08); opacity: 0.75; }
        }
        @keyframes portal-dot {
          0%, 20% { opacity: 0.2; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
          80%, 100% { opacity: 0.2; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
