"use client";

import { bodyById, type CelestialBody } from "@/data/celestialBodies";
import { localizeBody, bodyTypeLabel } from "@/i18n/localize";
import {
  formatDistance,
  formatNumber,
  formatRadius,
  formatThousandKm,
} from "@/i18n/format";
import { useLocaleStore, useT } from "@/store/useLocaleStore";

/** Spec-sheet style body facts — monochrome, technical */
export function InfoBody({
  body,
  compact,
}: {
  body: CelestialBody;
  compact?: boolean;
}) {
  const locale = useLocaleStore((s) => s.locale);
  const t = useT();
  const b = localizeBody(body, locale);
  const parentRaw = body.parentId ? bodyById[body.parentId] : null;
  const parent = parentRaw ? localizeBody(parentRaw, locale) : null;
  const ret = ` · ${t("retrograde")}`;

  const orbitValue =
    body.type === "moon"
      ? formatThousandKm(body.orbitRadius, locale)
      : formatDistance(body.distanceAu, locale);

  const periodValue =
    body.orbitalPeriodDays !== 0
      ? Math.abs(body.orbitalPeriodDays) < 400
        ? `${formatNumber(Math.abs(body.orbitalPeriodDays), locale, 1)} ${t("days")}${
            body.orbitalPeriodDays < 0 ? ret : ""
          }`
        : `${formatNumber(Math.abs(body.orbitalPeriodDays) / 365.25, locale, 1)} ${t("years")}${
            body.orbitalPeriodDays < 0 ? ret : ""
          }`
      : null;

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <p
        className={`leading-relaxed text-white/55 ${
          compact ? "text-[12px]" : "text-[13px]"
        }`}
      >
        {b.description}
      </p>

      <div className="border-t border-white/[0.08]">
        <SpecRow
          label={t("radius")}
          value={formatRadius(body.radiusKm, locale)}
        />
        <SpecRow label={t("orbitDistance")} value={orbitValue} />
        {periodValue && (
          <SpecRow label={t("orbitalPeriod")} value={periodValue} />
        )}
        <SpecRow
          label={t("rotation")}
          value={`${formatNumber(Math.abs(body.rotationPeriodHours), locale, 1)} ${t("hours")}${
            body.rotationPeriodHours < 0 ? ret : ""
          }`}
        />
        <SpecRow label={t("axialTilt")} value={`${body.axialTiltDeg}°`} />
        <SpecRow label={t("composition")} value={b.composition} last />
      </div>

      <div className="border border-white/[0.1] bg-white/[0.03] px-3 py-2.5">
        <p className="x-label mb-1.5">{t("fact")}</p>
        <p
          className={`leading-relaxed text-white/70 ${
            compact ? "text-[12px]" : "text-[13px]"
          }`}
        >
          {b.funFact}
        </p>
      </div>

      {parent && (
        <p className="font-mono text-[10px] tracking-wide text-white/25">
          {t("parent").toUpperCase()} · {parent.name.toUpperCase()}
        </p>
      )}
    </div>
  );
}

export function useLocalizedBody(body: CelestialBody | null | undefined) {
  const locale = useLocaleStore((s) => s.locale);
  if (!body) return null;
  return localizeBody(body, locale);
}

export function useBodyTypeLabel(type: CelestialBody["type"]) {
  const locale = useLocaleStore((s) => s.locale);
  return bodyTypeLabel(type, locale);
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
