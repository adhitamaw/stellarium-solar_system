"use client";

import {
  bodyById,
  formatDistance,
  formatRadius,
} from "@/data/celestialBodies";
import { useSimulationStore } from "@/store/useSimulationStore";

const typeLabel: Record<string, string> = {
  star: "Bintang",
  planet: "Planet",
  moon: "Bulan",
  asteroid: "Asteroid",
};

export function InfoPanel() {
  const selectedId = useSimulationStore((s) => s.selectedId);
  const showInfoPanel = useSimulationStore((s) => s.showInfoPanel);
  const setShowInfoPanel = useSimulationStore((s) => s.setShowInfoPanel);
  const selectBody = useSimulationStore((s) => s.selectBody);

  if (!selectedId) return null;
  const body = bodyById[selectedId];
  if (!body) return null;

  const parent = body.parentId ? bodyById[body.parentId] : null;

  // Hidden chip — top-right on desktop, bottom-right above time on mobile
  if (!showInfoPanel) {
    return (
      <button
        type="button"
        onClick={() => setShowInfoPanel(true)}
        className="pointer-events-auto absolute bottom-[9.5rem] right-2 z-20 flex max-w-[min(70vw,220px)] items-center gap-2 rounded-full border border-white/15 bg-slate-950/85 px-3 py-2 text-sm text-white/90 shadow-xl backdrop-blur-xl sm:bottom-auto sm:right-4 sm:top-36 sm:max-w-[280px]"
        title="Tampilkan info card"
      >
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: body.color }}
        />
        <span className="truncate font-medium">{body.name}</span>
        <span className="text-[10px] uppercase tracking-wider text-sky-300/80">
          Info
        </span>
      </button>
    );
  }

  return (
    <aside
      className="pointer-events-auto absolute bottom-[8.75rem] left-2 right-2 z-20 flex max-h-[min(42dvh,360px)] flex-col overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/90 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl sm:bottom-auto sm:left-auto sm:right-4 sm:top-36 sm:max-h-[calc(100dvh-12rem)] sm:w-[min(100%-2rem,320px)] sm:p-4"
      role="dialog"
      aria-label={`Info ${body.name}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300/80">
            {typeLabel[body.type] ?? body.type}
            {parent ? ` · ${parent.name}` : ""}
          </p>
          <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-white sm:text-xl">
            {body.name}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => setShowInfoPanel(false)}
            className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white sm:p-1.5"
            aria-label="Sembunyikan card"
            title="Sembunyikan"
          >
            <HideIcon />
          </button>
          <button
            type="button"
            onClick={() => {
              setShowInfoPanel(false);
              selectBody(null);
            }}
            className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white sm:p-1.5"
            aria-label="Tutup"
            title="Tutup"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div
        className="mb-2 h-1 w-full rounded-full sm:mb-3"
        style={{
          background: `linear-gradient(90deg, ${body.color}, transparent)`,
        }}
      />

      <p className="mb-3 text-xs leading-relaxed text-white/75 sm:mb-4 sm:text-sm">
        {body.description}
      </p>

      <dl className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
        <Row label="Radius" value={formatRadius(body.radiusKm)} />
        <Row
          label="Jarak orbit"
          value={
            body.type === "moon"
              ? `${(body.orbitRadius / 1000).toFixed(0)} ribu km`
              : formatDistance(body.distanceAu)
          }
        />
        {body.orbitalPeriodDays !== 0 && (
          <Row
            label="Periode orbit"
            value={
              Math.abs(body.orbitalPeriodDays) < 400
                ? `${Math.abs(body.orbitalPeriodDays).toFixed(1)} hari${
                    body.orbitalPeriodDays < 0 ? " (retrogade)" : ""
                  }`
                : `${(Math.abs(body.orbitalPeriodDays) / 365.25).toFixed(1)} tahun${
                    body.orbitalPeriodDays < 0 ? " (retrogade)" : ""
                  }`
            }
          />
        )}
        <Row
          label="Rotasi"
          value={`${Math.abs(body.rotationPeriodHours).toFixed(1)} jam${
            body.rotationPeriodHours < 0 ? " (retrogade)" : ""
          }`}
        />
        <Row label="Kemiringan sumbu" value={`${body.axialTiltDeg}°`} />
        <Row label="Komposisi" value={body.composition} />
      </dl>

      <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 sm:mt-4 sm:py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/80">
          Fakta singkat
        </p>
        <p className="mt-1 text-xs text-amber-50/90 sm:text-sm">{body.funFact}</p>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-1.5 last:border-0 sm:pb-2">
      <dt className="shrink-0 text-white/45">{label}</dt>
      <dd className="text-right text-white/90">{value}</dd>
    </div>
  );
}

function HideIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
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
