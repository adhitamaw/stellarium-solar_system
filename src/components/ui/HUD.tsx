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

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 overflow-hidden transition-opacity duration-500 ${
        sceneReady ? "opacity-100" : "opacity-0"
      }`}
      style={{
        paddingTop: "var(--safe-top)",
        paddingBottom: "var(--safe-bottom)",
        paddingLeft: "var(--safe-left)",
        paddingRight: "var(--safe-right)",
      }}
    >
      <KeyboardHandler />
      <MobileHints />

      {/* Top bar — compact on portrait */}
      <header className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex items-start justify-between gap-2 px-2 pt-2 sm:gap-3 sm:p-4">
        <div className="pointer-events-none min-w-0 max-w-[42%] sm:max-w-none">
          <p className="truncate text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-300/70 sm:text-[10px] sm:tracking-[0.28em]">
            Stellarium
          </p>
          <p className="hidden text-xs text-white/40 sm:block">
            {compareMode
              ? "Mode banding ukuran"
              : "Simulator Tata Surya Interaktif"}
          </p>
        </div>
        <div className="pointer-events-auto flex min-w-0 max-w-[58%] flex-col items-end gap-1.5 sm:max-w-none sm:gap-2">
          <SearchBar compact />
          <FinishingBar />
        </div>
      </header>

      {/* Left tools — stack under header on mobile, avoid full width clash */}
      {!compareMode && (
        <div className="absolute left-2 top-14 z-20 flex w-[min(100%-1rem,300px)] max-w-[calc(100vw-1rem)] flex-col gap-2 sm:left-4 sm:top-20 sm:max-w-[min(100%-2rem,420px)] sm:gap-3">
          <Toolbar />
          <div className="hidden sm:block">
            <DistanceChip />
          </div>
          <TourPanel />
          {cameraMode === "fly" && (
            <div className="pointer-events-none hidden rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-[11px] text-white/50 backdrop-blur-md sm:block">
              <span className="font-medium text-white/70">Mode terbang:</span>{" "}
              WASD · Q/E · Shift
            </div>
          )}
        </div>
      )}

      {!compareMode && <InfoPanel />}

      <ComparePanel />
      <ShortcutsModal />

      {/* Bottom time — safe area + leave room for home indicator */}
      {!compareMode && (
        <div className="absolute bottom-2 left-1/2 z-20 w-[min(100%-0.75rem,820px)] -translate-x-1/2 sm:bottom-4 sm:w-[min(100%-2rem,820px)]">
          <TimeControls />
        </div>
      )}

      <Onboarding />
    </div>
  );
}
