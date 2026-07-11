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

/** Fewer presets on tiny screens */
const MOBILE_SPEEDS = SPEED_PRESETS.filter((p) =>
  [1, 1_000, 5_000, 10_000, 100_000, 1_000_000].includes(p.value),
);

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

  const jump = (days: number) => {
    setSimDays(simClock.days + days);
  };

  return (
    <div className="pointer-events-auto rounded-xl border border-white/10 bg-slate-950/85 px-2 py-2 shadow-xl backdrop-blur-xl sm:rounded-2xl sm:px-3 sm:py-2.5">
      {/* Row 1: transport + date */}
      <div className="flex items-center gap-2">
        <div className="flex shrink-0 items-center gap-1">
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
          <IconButton label="Reset" onClick={() => setSimDays(0)}>
            <ResetIcon />
          </IconButton>
        </div>

        <div className="min-w-0 flex-1">
          <p className="hidden text-[9px] font-medium uppercase tracking-wider text-white/40 sm:block">
            Waktu simulasi
          </p>
          <p className="truncate font-mono text-xs text-sky-100 tabular-nums sm:text-sm">
            {formatSimDate(simDays)}
          </p>
        </div>
      </div>

      {/* Row 2: speed chips scrollable */}
      <div className="chip-scroll mt-1.5 flex items-center gap-1 sm:mt-2 sm:flex-wrap">
        <span className="shrink-0 text-[9px] font-medium uppercase tracking-wider text-white/40">
          Speed
        </span>
        {/* mobile subset */}
        <div className="flex items-center gap-1 sm:hidden">
          {MOBILE_SPEEDS.map((p) => (
            <SpeedChip
              key={p.value}
              label={p.label}
              active={speed === p.value}
              onClick={() => setSpeed(p.value)}
            />
          ))}
        </div>
        <div className="hidden items-center gap-1 sm:flex sm:flex-wrap">
          {SPEED_PRESETS.map((p) => (
            <SpeedChip
              key={p.value}
              label={p.label}
              active={speed === p.value}
              onClick={() => setSpeed(p.value)}
            />
          ))}
        </div>
      </div>

      {/* Row 3: scrub — full width */}
      <div className="mt-1.5 flex items-center sm:mt-2">
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

function SpeedChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium transition sm:text-[11px] ${
        active
          ? "bg-sky-500/35 text-sky-50 ring-1 ring-sky-400/50"
          : "text-white/50 hover:bg-white/10 hover:text-white/80"
      }`}
    >
      {label}
    </button>
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
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition sm:h-8 sm:w-8 ${
        primary
          ? "bg-sky-500/25 text-sky-100 ring-1 ring-sky-400/30"
          : "text-white/70 hover:bg-white/10"
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
