"use client";

import { useEffect } from "react";
import { guidedTour } from "@/data/tours";
import { bodyById } from "@/data/celestialBodies";
import {
  DEFAULT_SPEED,
  SPEED_PRESETS,
  useSimulationStore,
} from "@/store/useSimulationStore";
import { simClock } from "@/lib/simClock";
import { InfoBody } from "./InfoContent";
import { useLocaleStore, useT } from "@/store/useLocaleStore";
import { localizeBody, bodyTypeLabel } from "@/i18n/localize";

const SPEEDS = SPEED_PRESETS.filter((p) =>
  [1, 5_000, 10_000, 100_000, 1_000_000].includes(p.value),
);

/** Mobile dock — SpaceX / xAI black control surface */
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
  const selectedId = useSimulationStore((s) => s.selectedId);
  const showInfoPanel = useSimulationStore((s) => s.showInfoPanel);
  const setShowInfoPanel = useSimulationStore((s) => s.setShowInfoPanel);
  const selectBody = useSimulationStore((s) => s.selectBody);
  const locale = useLocaleStore((s) => s.locale);
  const t = useT();

  useEffect(() => {
    const current = useSimulationStore.getState().speed;
    if (!SPEED_PRESETS.some((p) => p.value === current)) {
      setSpeed(DEFAULT_SPEED);
    } else {
      simClock.speed = current;
    }
  }, [setSpeed]);

  const step = guidedTour[tourStepIndex] ?? guidedTour[0];
  const navBodyRaw = step ? bodyById[step.targetId] : null;
  const navBody = navBodyRaw ? localizeBody(navBodyRaw, locale) : null;
  const name = navBody?.name ?? "—";
  const total = guidedTour.length;
  const atStart = tourStepIndex <= 0;
  const atEnd = tourStepIndex >= total - 1;
  const date = formatSimDate(simDays);
  const selectedRaw = selectedId ? bodyById[selectedId] : null;
  const selectedBody = selectedRaw
    ? localizeBody(selectedRaw, locale)
    : null;
  const parentRaw =
    selectedRaw?.parentId ? bodyById[selectedRaw.parentId] : null;
  const parent = parentRaw ? localizeBody(parentRaw, locale) : null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex max-h-[100dvh] flex-col justify-end md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="pointer-events-auto mx-2 mb-2 flex min-h-0 max-h-[min(92dvh,100%)] flex-col gap-1.5">
        {selectedBody && selectedRaw && showInfoPanel && (
          <aside
            className="x-panel flex min-h-0 max-h-[min(52dvh,420px)] flex-col overflow-hidden"
            role="dialog"
            aria-label={`${t("info")} ${selectedBody.name}`}
          >
            <div className="flex shrink-0 items-start justify-between gap-2 border-b border-white/[0.08] px-3 py-2.5">
              <div className="min-w-0">
                <p className="x-label">
                  {bodyTypeLabel(selectedRaw.type, locale)}
                  {parent ? ` / ${parent.name}` : ""}
                </p>
                <h2 className="mt-0.5 truncate text-[15px] font-medium tracking-tight text-white">
                  {selectedBody.name}
                </h2>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => setShowInfoPanel(false)}
                  className="x-btn h-8 px-2.5 text-[10px] uppercase tracking-[0.1em]"
                >
                  {t("hide")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowInfoPanel(false);
                    selectBody(null);
                  }}
                  className="x-btn x-btn-ghost h-8 w-8"
                  aria-label={t("close")}
                >
                  ✕
                </button>
              </div>
            </div>

            <div
              className="panel-scroll min-h-0 flex-1 px-3 py-2.5"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <InfoBody body={selectedRaw} compact />
              <div className="h-2" />
            </div>
          </aside>
        )}

        {selectedBody && !showInfoPanel && (
          <button
            type="button"
            onClick={() => setShowInfoPanel(true)}
            className="x-panel flex w-full items-center gap-3 px-3 py-2.5 text-left"
          >
            <span className="h-px w-4 shrink-0 bg-white/40" />
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium tracking-tight text-white">
              {selectedBody.name}
            </span>
            <span className="x-label">{t("info")}</span>
          </button>
        )}

        <div className="x-panel shrink-0 p-1.5">
          <div className="flex items-center gap-1.5">
            <DockBtn
              label={t("previous")}
              disabled={atStart}
              onClick={prevTourStep}
            >
              <Chevron dir="left" />
            </DockBtn>

            <div className="min-w-0 flex-1 border border-white/[0.08] bg-black/50 px-2 py-1.5 text-center">
              <p className="truncate text-[13px] font-medium tracking-tight text-white">
                {name}
              </p>
              <p className="mt-0.5 font-mono text-[10px] tabular-nums tracking-wider text-white/28">
                {String(tourStepIndex + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </p>
            </div>

            <DockBtn
              label={t("next")}
              disabled={atEnd && !tourAuto}
              onClick={nextTourStep}
            >
              <Chevron dir="right" />
            </DockBtn>

            <button
              type="button"
              role="switch"
              aria-checked={tourAuto}
              onClick={() => setTourAuto(!tourAuto)}
              className={`x-btn h-10 shrink-0 px-2.5 text-[10px] uppercase tracking-[0.12em] ${
                tourAuto ? "x-btn-primary" : ""
              }`}
            >
              {t("auto")}
            </button>
          </div>

          <div className="mt-1.5 flex items-center gap-1.5 border-t border-white/[0.06] pt-1.5">
            <DockBtn
              label={isPlaying ? t("pause") : t("play")}
              onClick={togglePlay}
              primary
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </DockBtn>

            <p className="min-w-0 shrink truncate font-mono text-[10px] tracking-wide text-white/40 tabular-nums">
              {date}
            </p>

            <div className="chip-scroll flex min-w-0 flex-1 items-center gap-0.5">
              {SPEEDS.map((p) => (
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
        </div>
      </div>
    </div>
  );
}

function DockBtn({
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
      className={`x-btn h-10 w-10 shrink-0 active:scale-[0.97] ${
        primary ? "x-btn-primary" : ""
      }`}
    >
      {children}
    </button>
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
