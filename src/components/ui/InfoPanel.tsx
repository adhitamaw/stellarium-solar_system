"use client";

import { bodyById } from "@/data/celestialBodies";
import { InfoBody, typeLabel } from "./InfoContent";
import { useSimulationStore } from "@/store/useSimulationStore";

/**
 * Desktop side card only.
 * Mobile info lives inside MobileDock (so it scrolls correctly above the dock).
 */
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
      className="pointer-events-auto absolute right-4 top-36 z-20 hidden max-h-[calc(100dvh-12rem)] w-[min(100%-2rem,320px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/50 backdrop-blur-xl md:flex"
      role="dialog"
      aria-label={`Info ${body.name}`}
    >
      <div className="flex shrink-0 items-start justify-between gap-2 p-4 pb-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300/80">
            {typeLabel[body.type] ?? body.type}
            {parent ? ` · ${parent.name}` : ""}
          </p>
          <h2 className="mt-0.5 text-xl font-semibold tracking-tight text-white">
            {body.name}
          </h2>
        </div>
        <div className="flex shrink-0 gap-0.5">
          <IconBtn
            label="Sembunyikan"
            onClick={() => setShowInfoPanel(false)}
          >
            <HideIcon />
          </IconBtn>
          <IconBtn
            label="Tutup"
            onClick={() => {
              setShowInfoPanel(false);
              selectBody(null);
            }}
          >
            <CloseIcon />
          </IconBtn>
        </div>
      </div>
      {/* min-h-0 is required for flex child scroll */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
        <InfoBody body={body} />
      </div>
    </aside>
  );
}

function IconBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}

function HideIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 4l16 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
