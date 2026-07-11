"use client";

import { guidedTour } from "@/data/tours";
import { bodyById } from "@/data/celestialBodies";
import { useSimulationStore } from "@/store/useSimulationStore";
import { useLocaleStore, useT } from "@/store/useLocaleStore";
import { localizeBody, localizeTourStep } from "@/i18n/localize";

/** Desktop navigator — monochrome control strip */
export function TourPanel() {
  const tourStepIndex = useSimulationStore((s) => s.tourStepIndex);
  const tourAuto = useSimulationStore((s) => s.tourAuto);
  const setTourAuto = useSimulationStore((s) => s.setTourAuto);
  const nextTourStep = useSimulationStore((s) => s.nextTourStep);
  const prevTourStep = useSimulationStore((s) => s.prevTourStep);
  const locale = useLocaleStore((s) => s.locale);
  const t = useT();

  const rawStep = guidedTour[tourStepIndex] ?? guidedTour[0];
  const step = rawStep ? localizeTourStep(rawStep, locale) : null;
  const bodyRaw = step ? bodyById[step.targetId] : null;
  const body = bodyRaw ? localizeBody(bodyRaw, locale) : null;
  const name = body?.name ?? step?.title ?? "—";
  const total = guidedTour.length;
  const atStart = tourStepIndex <= 0;
  const atEnd = tourStepIndex >= total - 1;

  return (
    <div className="x-panel pointer-events-auto w-full max-w-[300px] p-2">
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="x-label">{t("navigate")}</p>
        <button
          type="button"
          role="switch"
          aria-checked={tourAuto}
          onClick={() => setTourAuto(!tourAuto)}
          className={`x-btn h-7 px-2.5 text-[10px] uppercase tracking-[0.12em] ${
            tourAuto ? "x-btn-primary" : ""
          }`}
        >
          {tourAuto ? t("autoOn") : t("autoOff")}
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={prevTourStep}
          disabled={atStart}
          className="x-btn h-9 w-9 shrink-0"
          aria-label={t("previous")}
        >
          <Chevron dir="left" />
        </button>

        <div className="min-w-0 flex-1 border border-white/[0.08] bg-black/40 px-2.5 py-1.5 text-center">
          <p className="truncate text-[13px] font-medium tracking-tight text-white">
            {name}
          </p>
          <p className="mt-0.5 font-mono text-[10px] tabular-nums tracking-wider text-white/30">
            {String(tourStepIndex + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </p>
        </div>

        <button
          type="button"
          onClick={nextTourStep}
          disabled={atEnd && !tourAuto}
          className="x-btn h-9 w-9 shrink-0"
          aria-label={t("next")}
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
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={dir === "left" ? "rotate-180" : ""}
    >
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
