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

  // Hidden but still selected → small restore chip
  if (!showInfoPanel) {
    return (
      <button
        type="button"
        onClick={() => setShowInfoPanel(true)}
        className="pointer-events-auto absolute right-4 top-[8.5rem] z-20 flex max-w-[min(100%-2rem,280px)] items-center gap-2 rounded-full border border-white/15 bg-slate-950/80 px-3 py-2 text-sm text-white/90 shadow-xl backdrop-blur-xl transition hover:border-sky-400/40 hover:bg-slate-900/90 sm:top-36"
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
      className="pointer-events-auto absolute right-4 top-[8.5rem] z-20 flex max-h-[calc(100dvh-11rem)] w-[min(100%-2rem,320px)] flex-col overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl sm:top-36 sm:max-h-[calc(100dvh-10.5rem)]"
      role="dialog"
      aria-label={`Info ${body.name}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300/80">
            {typeLabel[body.type] ?? body.type}
            {parent ? ` · ${parent.name}` : ""}
          </p>
          <h2 className="mt-0.5 text-xl font-semibold tracking-tight text-white">
            {body.name}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => setShowInfoPanel(false)}
            className="rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label="Sembunyikan card"
            title="Sembunyikan (view tetap di objek)"
          >
            <HideIcon />
          </button>
          <button
            type="button"
            onClick={() => {
              setShowInfoPanel(false);
              selectBody(null);
            }}
            className="rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label="Tutup & lepas fokus"
            title="Tutup"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div
        className="mb-3 h-1 w-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${body.color}, transparent)`,
        }}
      />

      <p className="mb-4 text-sm leading-relaxed text-white/75">
        {body.description}
      </p>

      <dl className="space-y-2 text-sm">
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

      <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/80">
          Fakta singkat
        </p>
        <p className="mt-1 text-sm text-amber-50/90">{body.funFact}</p>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-2 last:border-0">
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
