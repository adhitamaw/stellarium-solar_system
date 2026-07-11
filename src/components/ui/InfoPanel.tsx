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

/**
 * Desktop: right side card
 * Mobile: bottom sheet ABOVE the dock (only when open; chip lives in MobileDock)
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
    <>
      {/* Mobile bottom sheet */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-[25] md:hidden">
        {/* dim scene slightly when sheet open */}
        <button
          type="button"
          className="absolute inset-x-0 bottom-[9.5rem] top-0 bg-black/25"
          aria-label="Tutup info"
          onClick={() => setShowInfoPanel(false)}
        />
        <aside
          className="absolute inset-x-2 bottom-[9.25rem] flex max-h-[min(48dvh,380px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl"
          role="dialog"
          aria-label={`Info ${body.name}`}
        >
          <div className="flex items-center justify-center pt-2">
            <span className="h-1 w-9 rounded-full bg-white/20" />
          </div>
          <div className="flex items-start justify-between gap-2 px-3 pb-2 pt-1">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
                {typeLabel[body.type] ?? body.type}
                {parent ? ` · ${parent.name}` : ""}
              </p>
              <h2 className="truncate text-lg font-semibold text-white">
                {body.name}
              </h2>
            </div>
            <div className="flex shrink-0 gap-1">
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
          <div className="overflow-y-auto px-3 pb-3">
            <BodyContent body={body} parent={parent} compact />
          </div>
        </aside>
      </div>

      {/* Desktop side card */}
      <aside
        className="pointer-events-auto absolute right-4 top-36 z-20 hidden max-h-[calc(100dvh-12rem)] w-[min(100%-2rem,320px)] flex-col overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl md:flex"
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
        <BodyContent body={body} parent={parent} />
      </aside>
    </>
  );
}

function BodyContent({
  body,
  parent,
  compact,
}: {
  body: (typeof bodyById)[string];
  parent: (typeof bodyById)[string] | null | undefined;
  compact?: boolean;
}) {
  return (
    <>
      <div
        className={`h-1 w-full rounded-full ${compact ? "mb-2" : "mb-3"}`}
        style={{
          background: `linear-gradient(90deg, ${body.color}, transparent)`,
        }}
      />
      <p
        className={`leading-relaxed text-white/75 ${
          compact ? "mb-2 text-xs" : "mb-4 text-sm"
        }`}
      >
        {body.description}
      </p>
      <dl className={`text-xs sm:text-sm ${compact ? "space-y-1.5" : "space-y-2"}`}>
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
        {!compact && (
          <>
            <Row label="Kemiringan sumbu" value={`${body.axialTiltDeg}°`} />
            <Row label="Komposisi" value={body.composition} />
          </>
        )}
      </dl>
      <div
        className={`rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 ${
          compact ? "mt-2" : "mt-4"
        }`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/80">
          Fakta singkat
        </p>
        <p className={`mt-1 text-amber-50/90 ${compact ? "text-xs" : "text-sm"}`}>
          {body.funFact}
        </p>
      </div>
      {parent && compact && (
        <p className="mt-2 text-[10px] text-white/35">Orbit: {parent.name}</p>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-1.5 last:border-0">
      <dt className="shrink-0 text-white/45">{label}</dt>
      <dd className="text-right text-white/90">{value}</dd>
    </div>
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
      <path d="M4 4l16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
