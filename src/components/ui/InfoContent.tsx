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

/** Spec-sheet style body facts — monochrome, technical */
export function InfoBody({
  body,
  compact,
}: {
  body: CelestialBody;
  compact?: boolean;
}) {
  const parent = body.parentId ? bodyById[body.parentId] : null;

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <p
        className={`leading-relaxed text-white/55 ${
          compact ? "text-[12px]" : "text-[13px]"
        }`}
      >
        {body.description}
      </p>

      <div className="border-t border-white/[0.08]">
        <SpecRow label="Radius" value={formatRadius(body.radiusKm)} />
        <SpecRow
          label="Jarak orbit"
          value={
            body.type === "moon"
              ? `${(body.orbitRadius / 1000).toFixed(0)} rb km`
              : formatDistance(body.distanceAu)
          }
        />
        {body.orbitalPeriodDays !== 0 && (
          <SpecRow
            label="Periode orbit"
            value={
              Math.abs(body.orbitalPeriodDays) < 400
                ? `${Math.abs(body.orbitalPeriodDays).toFixed(1)} hari${
                    body.orbitalPeriodDays < 0 ? " · R" : ""
                  }`
                : `${(Math.abs(body.orbitalPeriodDays) / 365.25).toFixed(1)} thn${
                    body.orbitalPeriodDays < 0 ? " · R" : ""
                  }`
            }
          />
        )}
        <SpecRow
          label="Rotasi"
          value={`${Math.abs(body.rotationPeriodHours).toFixed(1)} jam${
            body.rotationPeriodHours < 0 ? " · R" : ""
          }`}
        />
        <SpecRow label="Kemiringan" value={`${body.axialTiltDeg}°`} />
        <SpecRow label="Komposisi" value={body.composition} last />
      </div>

      <div className="border border-white/[0.1] bg-white/[0.03] px-3 py-2.5">
        <p className="x-label mb-1.5">Fakta</p>
        <p
          className={`leading-relaxed text-white/70 ${
            compact ? "text-[12px]" : "text-[13px]"
          }`}
        >
          {body.funFact}
        </p>
      </div>

      {parent && (
        <p className="font-mono text-[10px] tracking-wide text-white/25">
          PARENT · {parent.name.toUpperCase()}
        </p>
      )}
    </div>
  );
}

function SpecRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 py-2 ${
        last ? "" : "border-b border-white/[0.06]"
      }`}
    >
      <dt className="shrink-0 text-[11px] uppercase tracking-[0.08em] text-white/30">
        {label}
      </dt>
      <dd className="text-right font-mono text-[12px] tabular-nums tracking-tight text-white/90">
        {value}
      </dd>
    </div>
  );
}
