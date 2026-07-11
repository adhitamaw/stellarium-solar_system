"use client";

import { InfoPanel } from "./InfoPanel";
import { TimeControls } from "./TimeControls";
import { SearchBar } from "./SearchBar";
import { TourPanel } from "./TourPanel";
import { Toolbar } from "./Toolbar";
import { Onboarding } from "./Onboarding";
import { FinishingBar } from "./FinishingBar";
import { ComparePanel } from "./ComparePanel";
import { DistanceChip } from "./DistanceChip";
import { ShortcutsModal } from "./ShortcutsModal";
import { KeyboardHandler } from "./KeyboardHandler";
import { MobileHints } from "./MobileHints";
import { useSimulationStore } from "@/store/useSimulationStore";
import { useLoadingStore } from "@/store/useLoadingStore";

export function HUD() {
  const cameraMode = useSimulationStore((s) => s.cameraMode);
  const compareMode = useSimulationStore((s) => s.compareMode);
  const hideHud = useSimulationStore((s) => s.hideHud);
  const sceneReady = useLoadingStore((s) => s.ready);

  if (hideHud) {
    return <KeyboardHandler />;
  }

  // Keep HUD under loading curtain until ready (still mount handlers)
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 overflow-hidden transition-opacity duration-500 ${
        sceneReady ? "opacity-100" : "opacity-0"
      }`}
    >
      <KeyboardHandler />
      <MobileHints />

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex items-start justify-between gap-3 p-4">
        <div className="pointer-events-none">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-300/70">
            Stellarium Cinematic
          </p>
          <p className="text-xs text-white/40">
            {compareMode
              ? "Mode banding ukuran"
              : "Simulator Tata Surya Interaktif"}
          </p>
        </div>
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <SearchBar />
          <FinishingBar />
        </div>
      </header>

      {!compareMode && (
        <div className="absolute left-4 top-20 flex max-w-[min(100%-2rem,420px)] flex-col gap-3">
          <Toolbar />
          <DistanceChip />
          <TourPanel />
          {cameraMode === "fly" && (
            <div className="pointer-events-none rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-[11px] text-white/50 backdrop-blur-md">
              <span className="font-medium text-white/70">Mode terbang:</span>{" "}
              WASD gerak · Q/E naik-turun · Shift cepat · mouse arah
            </div>
          )}
        </div>
      )}

      {!compareMode && <InfoPanel />}
      {/* InfoPanel handles its own hide/minimize when a body is selected */}

      <ComparePanel />
      <ShortcutsModal />

      {!compareMode && (
        <div className="absolute bottom-4 left-1/2 w-[min(100%-2rem,820px)] -translate-x-1/2">
          <TimeControls />
        </div>
      )}

      <div className="absolute bottom-4 right-4 hidden max-w-[12rem] text-right text-[10px] leading-relaxed text-white/30 lg:block">
        M suara · B banding · C capture
        <br />
        ? bantuan · FPS = refresh monitor
      </div>

      <Onboarding />
    </div>
  );
}
