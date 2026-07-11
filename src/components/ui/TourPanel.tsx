"use client";

import { guidedTour } from "@/data/tours";
import { bodyById } from "@/data/celestialBodies";
import { useSimulationStore } from "@/store/useSimulationStore";

/**
 * Compact planet navigator:
 * - Prev / Next to jump bodies in sequence
 * - Auto toggle for timed advance (no big narration card)
 */
export function TourPanel() {
  const tourStepIndex = useSimulationStore((s) => s.tourStepIndex);
  const tourAuto = useSimulationStore((s) => s.tourAuto);
  const setTourAuto = useSimulationStore((s) => s.setTourAuto);
  const nextTourStep = useSimulationStore((s) => s.nextTourStep);
  const prevTourStep = useSimulationStore((s) => s.prevTourStep);

  const step = guidedTour[tourStepIndex] ?? guidedTour[0];
  const body = step ? bodyById[step.targetId] : null;
  const name = body?.name ?? step?.title ?? "—";
  const total = guidedTour.length;
  const atStart = tourStepIndex <= 0;
  const atEnd = tourStepIndex >= total - 1;

  return (
    <div className="pointer-events-auto w-full max-w-[280px] rounded-xl border border-white/10 bg-slate-950/80 p-2 shadow-xl backdrop-blur-xl sm:max-w-[320px] sm:rounded-2xl sm:p-2.5">
      <div className="mb-2 flex items-center justify-between gap-2 px-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
          Navigasi
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={tourAuto}
          onClick={() => setTourAuto(!tourAuto)}
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
            tourAuto
              ? "bg-violet-500/30 text-violet-100 ring-1 ring-violet-400/40"
              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
          }`}
          title={
            tourAuto
              ? "Auto ON — pindah otomatis. Klik lagi untuk mati."
              : "Auto OFF — pakai Prev/Next manual"
          }
        >
          <span
            className={`relative h-3.5 w-6 rounded-full transition ${
              tourAuto ? "bg-violet-400" : "bg-white/20"
            }`}
          >
            <span
              className={`absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white shadow transition ${
                tourAuto ? "left-3" : "left-0.5"
              }`}
            />
          </span>
          Auto
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={prevTourStep}
          disabled={atStart}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white/80 transition hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 sm:h-9 sm:w-9"
          aria-label="Planet sebelumnya"
          title="Sebelumnya"
        >
          <Chevron dir="left" />
        </button>

        <div className="min-w-0 flex-1 rounded-xl bg-white/5 px-2.5 py-1.5 text-center">
          <p className="truncate text-sm font-medium text-white">{name}</p>
          <p className="font-mono text-[10px] tabular-nums text-white/40">
            {tourStepIndex + 1} / {total}
          </p>
        </div>

        <button
          type="button"
          onClick={nextTourStep}
          disabled={atEnd && !tourAuto}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white/80 transition hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 sm:h-9 sm:w-9"
          aria-label="Planet berikutnya"
          title="Berikutnya"
        >
          <Chevron dir="right" />
        </button>
      </div>

    </div>
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
      strokeLinecap="round"
      strokeLinejoin="round"
      className={dir === "left" ? "rotate-180" : ""}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
