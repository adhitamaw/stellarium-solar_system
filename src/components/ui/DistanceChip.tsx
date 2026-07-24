"use client";

import { useMemo } from "react";
import { bodyById } from "@/data/celestialBodies";
import { useSimulationStore } from "@/store/useSimulationStore";
import { useLocaleStore, useT } from "@/store/useLocaleStore";
import { localizeBody } from "@/i18n/localize";
import {
  formatDistance,
  formatRadius,
  formatThousandKm,
} from "@/i18n/format";

/** Live chip for selected body (F7) */
export function DistanceChip() {
  const selectedId = useSimulationStore((s) => s.selectedId);
  const compareMode = useSimulationStore((s) => s.compareMode);
  const locale = useLocaleStore((s) => s.locale);
  const t = useT();

  const info = useMemo(() => {
    if (!selectedId) return null;
    const raw = bodyById[selectedId];
    if (!raw) return null;
    const b = localizeBody(raw, locale);
    const parentRaw = raw.parentId ? bodyById[raw.parentId] : null;
    const parent = parentRaw ? localizeBody(parentRaw, locale) : null;
    const sun = bodyById.sun ? localizeBody(bodyById.sun, locale) : null;
    return { raw, b, parent, sun };
  }, [selectedId, locale]);

  if (!info || compareMode) return null;

  const { raw, b, parent, sun } = info;

  let distLabel = "";
  if (raw.type === "star") {
    distLabel = t("systemCenter");
  } else if (parent && (raw.type === "moon" || raw.type === "spacecraft")) {
    distLabel = `${formatThousandKm(raw.orbitRadius, locale)} ${t("from")} ${parent.name}`;
  } else {
    const sunName = sun?.name ?? (locale === "id" ? "Matahari" : "Sun");
    distLabel = `${formatDistance(raw.distanceAu ?? raw.orbitRadius, locale)} ${t("from")} ${sunName}`;
  }

  return (
    <div className="x-panel pointer-events-none px-3 py-2 text-[11px] text-white/60">
      <span className="font-medium text-white">{b.name}</span>
      <span className="mx-1.5 text-white/20">·</span>
      <span className="font-mono tabular-nums">
        {t("radiusAbbrev")} {formatRadius(raw.radiusKm, locale)}
      </span>
      <span className="mx-1.5 text-white/20">·</span>
      <span className="font-mono tabular-nums text-white/50">{distLabel}</span>
    </div>
  );
}
