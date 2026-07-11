"use client";

import { useMemo } from "react";
import { bodyById, formatDistance, formatRadius } from "@/data/celestialBodies";
import { useSimulationStore } from "@/store/useSimulationStore";
import { useLocaleStore, useT } from "@/store/useLocaleStore";
import { localizeBody } from "@/i18n/localize";

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
  } else if (parent && raw.type === "moon") {
    distLabel = `${(raw.orbitRadius / 1000).toFixed(0)} ${t("thousandKm")} ${t("from")} ${parent.name}`;
  } else {
    distLabel = `${formatDistance(raw.distanceAu)} ${t("from")} ${sun?.name ?? "Sun"}`;
  }

  return (
    <div className="pointer-events-none rounded-xl border border-white/10 bg-slate-950/65 px-3 py-2 text-[11px] text-white/70 shadow-lg backdrop-blur-md">
      <span className="font-medium text-white">{b.name}</span>
      <span className="mx-1.5 text-white/25">·</span>
      <span>R {formatRadius(raw.radiusKm)}</span>
      <span className="mx-1.5 text-white/25">·</span>
      <span>{distLabel}</span>
    </div>
  );
}
