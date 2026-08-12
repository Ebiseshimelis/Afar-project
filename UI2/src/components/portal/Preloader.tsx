import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";

export function Preloader() {
  const [hide, setHide] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHide(true), 900);
    const t2 = setTimeout(() => setGone(true), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] flex items-center justify-center gradient-hero transition-opacity duration-500"
      style={{ opacity: hide ? 0 : 1, pointerEvents: hide ? "none" : "auto" }}
    >
      <div className="flex flex-col items-center gap-6 text-primary-foreground">
        <div className="relative grid h-28 w-28 place-items-center rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/25 backdrop-blur">
          <div className="absolute inset-0 rounded-full border-2 border-gold/60 animate-ping" />
          <img src={logo} alt="Afar UDCB" className="h-20 w-20 object-contain" />
        </div>
        <div className="text-center">
          <div className="font-display text-lg font-semibold">Afar Regional Government</div>
          <div className="text-sm text-primary-foreground/70">Urban Development & Construction Bureau</div>
        </div>
        <div className="h-1 w-40 overflow-hidden rounded-full bg-primary-foreground/20">
          <div className="h-full w-1/2 animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>
      </div>
    </div>
  );
}
