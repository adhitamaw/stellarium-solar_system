"use client";

import {
  bodyById,
  formatDistance,
  formatRadius,
  type CelestialBody,
} from "@/data/celestialBodies";

const typeLabel: Record<string, string> = {
  star: "Bintang",
  planet: "Planet",
  moon: "Bulan",
  asteroid: "Asteroid",
};

export { typeLabel };

export function InfoBody({
  body,
  compact,
}: {
  body: CelestialBody;
  compact?: boolean;
}) {
  const parent = body.parentId ? bodyById[body.parentId] : null;

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
      <dl
        className={`text-xs sm:text-sm ${compact ? "space-y-1.5" : "space-y-2"}`}
      >
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
      <div
        className={`rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 ${
          compact ? "mt-2" : "mt-4"
        }`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/80">
          Fakta singkat
        </p>
        <p
          className={`mt-1 text-amber-50/90 ${compact ? "text-xs" : "text-sm"}`}
        >
          {body.funFact}
        </p>
      </div>
      {parent && (
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
