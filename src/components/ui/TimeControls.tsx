"use client";

import { useEffect } from "react";
import { simClock } from "@/lib/simClock";
import {
  DEFAULT_SPEED,
  SPEED_PRESETS,
  useSimulationStore,
} from "@/store/useSimulationStore";

function formatSimDate(simDays: number): string {
  const epoch = new Date(Date.UTC(2000, 0, 1, 12));
  const d = new Date(epoch.getTime() + simDays * 86_400_000);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function TimeControls() {
  const simDays = useSimulationStore((s) => s.simDaysUi);
  const speed = useSimulationStore((s) => s.speed);
  const isPlaying = useSimulationStore((s) => s.isPlaying);
  const togglePlay = useSimulationStore((s) => s.togglePlay);
  const setSpeed = useSimulationStore((s) => s.setSpeed);
  const setSimDays = useSimulationStore((s) => s.setSimDays);

  useEffect(() => {
    const current = useSimulationStore.getState().speed;
    const known = SPEED_PRESETS.some((p) => p.value === current);
    if (!known) setSpeed(DEFAULT_SPEED);
    else simClock.speed = current;
  }, [setSpeed]);

  const jump = (days: number) => setSimDays(simClock.days + days);

  return (
    <div className="x-panel pointer-events-auto px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="x-btn h-8 w-8"
            onClick={() => jump(-30)}
            aria-label="Back 30 days"
          >
            <SkipIcon dir="back" />
          </button>
          <button
            type="button"
            className={`x-btn h-8 w-8 ${isPlaying ? "" : "x-btn-primary"}`}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            className="x-btn h-8 w-8"
            onClick={() => jump(30)}
            aria-label="Forward 30 days"
          >
            <SkipIcon dir="fwd" />
          </button>
          <button
            type="button"
            className="x-btn h-8 w-8"
            onClick={() => setSimDays(0)}
            aria-label="Reset"
          >
            <ResetIcon />
          </button>
        </div>

        <div className="min-w-[6.5rem]">
          <p className="x-label">Epoch</p>
          <p className="mt-0.5 font-mono text-[13px] tabular-nums tracking-tight text-white">
            {formatSimDate(simDays)}
          </p>
        </div>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          <span className="x-label mr-1">Speed</span>
          {SPEED_PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setSpeed(p.value)}
              className={`x-chip ${speed === p.value ? "is-active" : ""}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2.5">
        <input
          type="range"
          min={0}
          max={365.25 * 50}
          step={1}
          value={((simDays % (365.25 * 50)) + 365.25 * 50) % (365.25 * 50)}
          onChange={(e) => setSimDays(Number(e.target.value))}
          className="h-1 w-full cursor-pointer accent-white"
          aria-label="Time scrub"
        />
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
    </svg>
  );
}
function SkipIcon({ dir }: { dir: "back" | "fwd" }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={dir === "back" ? "rotate-180" : ""}
    >
      <path d="M6 6v12l8.5-6L6 6zm9 0h2v12h-2z" />
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" />
      <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
