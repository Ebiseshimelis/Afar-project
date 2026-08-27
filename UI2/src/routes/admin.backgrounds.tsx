import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout, AdminPageHeader } from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { Loader2, Upload, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { getBackgrounds, resetBackground, saveBackground } from "@/services/backgroundService";
import {
  DEFAULT_SECTION_BACKGROUNDS,
  SECTION_LABELS,
  resolveSectionBackground,
  type SectionBackgrounds,
  type SectionKey,
} from "@/lib/site-images";

export const Route = createFileRoute("/admin/backgrounds")({
  head: () => ({ meta: [{ title: "Background Images" }, { name: "robots", content: "noindex" }] }),
  component: BackgroundsAdmin,
});

const SECTIONS = Object.keys(DEFAULT_SECTION_BACKGROUNDS) as SectionKey[];

function BackgroundsAdmin() {
  const [overrides, setOverrides] = useState<SectionBackgrounds>({});

  const [savingKey, setSavingKey] = useState<SectionKey | null>(null);

  useEffect(() => {
    void getBackgrounds()
      .then((data) => setOverrides(data as SectionBackgrounds))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load backgrounds."));
  }, []);

  const onFile = async (key: SectionKey, file: File) => {
    try {
      setSavingKey(key);
      setOverrides(await saveBackground(key, file) as SectionBackgrounds);
      toast.success("Background image saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save background image.");
    } finally {
      setSavingKey(null);
    }
  };

  const saveUrl = async (key: SectionKey, value: string) => {
    if (!value.trim()) return;
    try {
      setSavingKey(key);
      setOverrides(await saveBackground(key, null, value) as SectionBackgrounds);
      toast.success("Background image saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save background image.");
    } finally {
      setSavingKey(null);
    }
  };

  const reset = async (key: SectionKey) => {
    try {
      setSavingKey(key);
      setOverrides(await resetBackground(key) as SectionBackgrounds);
      toast.success("Background reset to default.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reset background image.");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Background Images"
        description="Manage the hero/section background images used across the public portal."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((key) => {
          const current = resolveSectionBackground(key, overrides);
          const isCustom = Boolean(overrides[key]);
          return (
            <div key={key} className="overflow-hidden rounded-xl border bg-card shadow-soft">
              <div className="aspect-[16/9] bg-secondary">
                <img src={current} alt={`${SECTION_LABELS[key]} background`} className="size-full object-cover" />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-semibold">{SECTION_LABELS[key]}</div>
                  <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {isCustom ? "Custom" : "Default"}
                  </span>
                </div>

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-2 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-primary">
                  {savingKey === key ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />} Upload image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={savingKey === key}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void onFile(key, f);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>

                <input
                  defaultValue=""
                  placeholder="…or paste an image URL"
                  onBlur={(e) => void saveUrl(key, e.target.value)}
                  className="h-9 w-full rounded-lg border bg-background px-3 text-xs outline-none ring-ring focus:ring-2"
                />

                <button
                  onClick={() => void reset(key)}
                  disabled={!isCustom || savingKey === key}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary disabled:opacity-40"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset to default
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
