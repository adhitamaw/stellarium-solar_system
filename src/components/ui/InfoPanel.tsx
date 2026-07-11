"use client";

import { bodyById } from "@/data/celestialBodies";
import { InfoBody, typeLabel } from "./InfoContent";
import { useSimulationStore } from "@/store/useSimulationStore";

/** Desktop telemetry card — SpaceX / xAI monochrome */
export function InfoPanel() {
  const selectedId = useSimulationStore((s) => s.selectedId);
  const showInfoPanel = useSimulationStore((s) => s.showInfoPanel);
  const setShowInfoPanel = useSimulationStore((s) => s.setShowInfoPanel);
  const selectBody = useSimulationStore((s) => s.selectBody);

  if (!selectedId || !showInfoPanel) return null;
  const body = bodyById[selectedId];
  if (!body) return null;

  const parent = body.parentId ? bodyById[body.parentId] : null;

  return (
    <aside
      className="x-panel pointer-events-auto absolute right-4 top-36 z-20 hidden max-h-[calc(100dvh-12rem)] w-[min(100%-2rem,300px)] flex-col overflow-hidden md:flex"
      role="dialog"
      aria-label={`Info ${body.name}`}
    >
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.08] px-4 py-3">
        <div className="min-w-0">
          <p className="x-label">
            {typeLabel[body.type] ?? body.type}
            {parent ? ` / ${parent.name}` : ""}
          </p>
          <h2 className="mt-1 truncate text-[17px] font-medium tracking-tight text-white">
            {body.name}
          </h2>
        </div>
        <div className="flex shrink-0 gap-0.5">
          <button
            type="button"
            onClick={() => setShowInfoPanel(false)}
            className="x-btn x-btn-ghost h-8 w-8"
            aria-label="Sembunyikan"
            title="Hide"
          >
            <HideIcon />
          </button>
          <button
            type="button"
            onClick={() => {
              setShowInfoPanel(false);
              selectBody(null);
            }}
            className="x-btn x-btn-ghost h-8 w-8"
            aria-label="Tutup"
            title="Close"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
      <div className="panel-scroll min-h-0 flex-1 px-4 py-3">
        <InfoBody body={body} />
      </div>
    </aside>
  );
}

function HideIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12h16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
