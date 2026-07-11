"use client";

import { useState } from "react";
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
import { MobileDock } from "./MobileDock";
import { MoreMenu } from "./MoreMenu";
import { useSimulationStore } from "@/store/useSimulationStore";
import { useLoadingStore } from "@/store/useLoadingStore";

/**
 * Layout strategy:
 * - Mobile (< md): clean top bar + bottom dock only. Tools in ☰ menu.
 * - Desktop (md+): left tools + right info + bottom time (original).
 */
export function HUD() {
  const cameraMode = useSimulationStore((s) => s.cameraMode);
  const compareMode = useSimulationStore((s) => s.compareMode);
  const hideHud = useSimulationStore((s) => s.hideHud);
  const sceneReady = useLoadingStore((s) => s.ready);
  const [menuOpen, setMenuOpen] = useState(false);

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
        paddingLeft: "var(--safe-left)",
        paddingRight: "var(--safe-right)",
      }}
    >
      <KeyboardHandler />
      <MobileHints />

      {/* ─── MOBILE TOP ─── */}
      <header className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex items-center justify-between gap-2 px-3 pt-2 md:hidden">
        <p className="pointer-events-none text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
          Stellarium
        </p>
        <div className="pointer-events-auto flex items-center gap-1.5">
          <SearchBar compact />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="x-btn h-8 w-8"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      {/* ─── DESKTOP TOP ─── */}
      <header className="pointer-events-none absolute left-0 right-0 top-0 z-30 hidden items-start justify-between gap-3 p-4 md:flex">
        <div className="pointer-events-none">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/45">
            Stellarium
          </p>
          <p className="mt-0.5 text-[12px] text-white/25">
            {compareMode ? "Compare" : "Solar system"}
          </p>
        </div>
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          <SearchBar />
          <FinishingBar />
        </div>
      </header>

      {/* ─── DESKTOP LEFT ─── */}
      {!compareMode && (
        <div className="absolute left-4 top-20 z-20 hidden max-w-[min(100%-2rem,420px)] flex-col gap-3 md:flex">
          <Toolbar />
          <DistanceChip />
          <TourPanel />
          {cameraMode === "fly" && (
            <div className="pointer-events-none rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-[11px] text-white/50 backdrop-blur-md">
              <span className="font-medium text-white/70">Mode terbang:</span>{" "}
              WASD · Q/E · Shift
            </div>
          )}
        </div>
      )}

      {/* Info: mobile sheet + desktop side card */}
      {!compareMode && <InfoPanel />}

      <ComparePanel />
      <ShortcutsModal />
      <MoreMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ─── MOBILE BOTTOM DOCK ─── */}
      {!compareMode && <MobileDock />}

      {/* ─── DESKTOP BOTTOM TIME ─── */}
      {!compareMode && (
        <div className="absolute bottom-4 left-1/2 z-20 hidden w-[min(100%-2rem,820px)] -translate-x-1/2 md:block">
          <TimeControls />
        </div>
      )}

      <Onboarding />
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
