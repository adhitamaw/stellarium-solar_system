"use client";

import { simClock } from "@/lib/simClock";
import {
  DEFAULT_SPEED,
  SPEED_PRESETS,
  useSimulationStore,
} from "@/store/useSimulationStore";
import { useEffect } from "react";

function formatSimDate(simDays: number): string {
  const epoch = new Date(Date.UTC(2000, 0, 1, 12));
  const ms = epoch.getTime() + simDays * 86_400_000;
  const d = new Date(ms);
  return d.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
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

  // Sync simClock with store; fall back to 5k× if speed is not a known preset
  useEffect(() => {
    const current = useSimulationStore.getState().speed;
    const known = SPEED_PRESETS.some((p) => p.value === current);
    if (!known) {
      setSpeed(DEFAULT_SPEED);
    } else {
      simClock.speed = current;
    }
  }, [setSpeed]);

  const jump = (days: number) => {
    setSimDays(simClock.days + days);
  };

  return (
    <div className="pointer-events-auto flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2.5 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:gap-3">
      <div className="flex items-center gap-1.5">
        <IconButton label="Mundur 30 hari" onClick={() => jump(-30)}>
          <SkipIcon dir="back" />
        </IconButton>
        <IconButton
          label={isPlaying ? "Jeda" : "Putar"}
          onClick={togglePlay}
          primary
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
        <IconButton label="Maju 30 hari" onClick={() => jump(30)}>
          <SkipIcon dir="fwd" />
        </IconButton>
        <IconButton label="Reset ke epoch" onClick={() => setSimDays(0)}>
          <ResetIcon />
        </IconButton>
      </div>

      <div className="hidden h-6 w-px bg-white/10 sm:block" />

      <div className="min-w-[7.5rem]">
        <p className="text-[9px] font-medium uppercase tracking-wider text-white/40">
          Waktu simulasi
        </p>
        <p className="font-mono text-sm text-sky-100 tabular-nums">
          {formatSimDate(simDays)}
        </p>
      </div>

      <div className="hidden h-6 w-px bg-white/10 sm:block" />

      <div className="flex flex-wrap items-center gap-1">
        <span className="mr-1 text-[9px] font-medium uppercase tracking-wider text-white/40">
          Kecepatan
        </span>
        {SPEED_PRESETS.map((p) => {
          const active = speed === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => setSpeed(p.value)}
              aria-pressed={active}
              className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium transition ${
                active
                  ? "bg-sky-500/35 text-sky-50 ring-1 ring-sky-400/50"
                  : "text-white/50 hover:bg-white/10 hover:text-white/80"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 sm:min-w-[140px]">
        <input
          type="range"
          min={0}
          max={365.25 * 50}
          step={1}
          value={((simDays % (365.25 * 50)) + 365.25 * 50) % (365.25 * 50)}
          onChange={(e) => setSimDays(Number(e.target.value))}
          className="h-1 w-full cursor-pointer accent-sky-400"
          aria-label="Scrub waktu simulasi"
        />
      </div>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  label,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
        primary
          ? "bg-sky-500/25 text-sky-100 ring-1 ring-sky-400/30 hover:bg-sky-500/40"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
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
function SkipIcon({ dir }: { dir: "back" | "fwd" }) {
  return (
    <svg
      width="14"
      height="14"
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
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" />
      <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
