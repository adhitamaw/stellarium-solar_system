"use client";

import { guidedTour } from "@/data/tours";
import { bodyById } from "@/data/celestialBodies";
import {
  DEFAULT_SPEED,
  SPEED_PRESETS,
  useSimulationStore,
} from "@/store/useSimulationStore";
import { simClock } from "@/lib/simClock";
import { useEffect } from "react";

const SPEEDS = SPEED_PRESETS.filter((p) =>
  [1, 5_000, 10_000, 100_000, 1_000_000].includes(p.value),
);

/**
 * Single bottom dock for mobile portrait:
 * 1) Planet nav (prev / name / next / auto)
 * 2) Play + speed chips
 * Keeps the rest of the screen clean for 3D.
 */
export function MobileDock() {
  const tourStepIndex = useSimulationStore((s) => s.tourStepIndex);
  const tourAuto = useSimulationStore((s) => s.tourAuto);
  const setTourAuto = useSimulationStore((s) => s.setTourAuto);
  const nextTourStep = useSimulationStore((s) => s.nextTourStep);
  const prevTourStep = useSimulationStore((s) => s.prevTourStep);
  const isPlaying = useSimulationStore((s) => s.isPlaying);
  const togglePlay = useSimulationStore((s) => s.togglePlay);
  const speed = useSimulationStore((s) => s.speed);
  const setSpeed = useSimulationStore((s) => s.setSpeed);
  const simDays = useSimulationStore((s) => s.simDaysUi);
  const setSimDays = useSimulationStore((s) => s.setSimDays);
  const selectedId = useSimulationStore((s) => s.selectedId);
  const showInfoPanel = useSimulationStore((s) => s.showInfoPanel);
  const setShowInfoPanel = useSimulationStore((s) => s.setShowInfoPanel);

  useEffect(() => {
    const current = useSimulationStore.getState().speed;
    if (!SPEED_PRESETS.some((p) => p.value === current)) {
      setSpeed(DEFAULT_SPEED);
    } else {
      simClock.speed = current;
    }
  }, [setSpeed]);

  const step = guidedTour[tourStepIndex] ?? guidedTour[0];
  const body = step ? bodyById[step.targetId] : null;
  const name = body?.name ?? "—";
  const total = guidedTour.length;
  const atStart = tourStepIndex <= 0;
  const atEnd = tourStepIndex >= total - 1;

  const date = formatSimDate(simDays);
  const selectedBody = selectedId ? bodyById[selectedId] : null;

  return (
    <div
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-2 mb-2 space-y-1.5">
        {/* Selected body quick info toggle */}
        {selectedBody && (
          <button
            type="button"
            onClick={() => setShowInfoPanel(!showInfoPanel)}
            className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/90 px-3 py-2 text-left shadow-lg backdrop-blur-xl"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: selectedBody.color }}
            />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
              {selectedBody.name}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-sky-300/80">
              {showInfoPanel ? "Tutup info" : "Info"}
            </span>
          </button>
        )}

        {/* Unified glass dock */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/92 p-2 shadow-2xl backdrop-blur-xl">
          {/* Nav */}
          <div className="flex items-center gap-1.5">
            <DockIconBtn
              label="Sebelumnya"
              disabled={atStart}
              onClick={prevTourStep}
            >
              <Chevron dir="left" />
            </DockIconBtn>

            <div className="min-w-0 flex-1 rounded-xl bg-white/5 px-2 py-1.5 text-center">
              <p className="truncate text-[13px] font-semibold text-white">
                {name}
              </p>
              <p className="font-mono text-[10px] tabular-nums text-white/40">
                {tourStepIndex + 1}/{total}
              </p>
            </div>

            <DockIconBtn
              label="Berikutnya"
              disabled={atEnd && !tourAuto}
              onClick={nextTourStep}
            >
              <Chevron dir="right" />
            </DockIconBtn>

            <button
              type="button"
              role="switch"
              aria-checked={tourAuto}
              onClick={() => setTourAuto(!tourAuto)}
              className={`flex h-10 shrink-0 items-center gap-1 rounded-xl px-2.5 text-[11px] font-semibold ${
                tourAuto
                  ? "bg-violet-500/35 text-violet-50 ring-1 ring-violet-400/40"
                  : "bg-white/5 text-white/50"
              }`}
            >
              Auto
            </button>
          </div>

          {/* Time / speed */}
          <div className="mt-1.5 flex items-center gap-1.5 border-t border-white/8 pt-1.5">
            <DockIconBtn
              label={isPlaying ? "Jeda" : "Putar"}
              onClick={togglePlay}
              primary
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </DockIconBtn>

            <p className="min-w-0 shrink truncate font-mono text-[10px] text-sky-100/90 tabular-nums">
              {date}
            </p>

            <div className="chip-scroll flex min-w-0 flex-1 items-center gap-1">
              {SPEEDS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setSpeed(p.value)}
                  className={`shrink-0 rounded-md px-1.5 py-1 text-[10px] font-medium ${
                    speed === p.value
                      ? "bg-sky-500/35 text-sky-50 ring-1 ring-sky-400/45"
                      : "text-white/45"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DockIconBtn({
  children,
  onClick,
  label,
  disabled,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition active:scale-95 disabled:opacity-30 ${
        primary
          ? "bg-sky-500/30 text-sky-50 ring-1 ring-sky-400/35"
          : "border border-white/10 text-white/85"
      }`}
    >
      {children}
    </button>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className={dir === "left" ? "rotate-180" : ""}
    >
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  );
}

function formatSimDate(simDays: number): string {
  const epoch = new Date(Date.UTC(2000, 0, 1, 12));
  const d = new Date(epoch.getTime() + simDays * 86_400_000);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
