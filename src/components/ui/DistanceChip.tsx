"use client";

import { useMemo } from "react";
import { bodyById, formatDistance, formatRadius } from "@/data/celestialBodies";
import { useSimulationStore } from "@/store/useSimulationStore";

/** Live chip for selected body (F7) */
export function DistanceChip() {
  const selectedId = useSimulationStore((s) => s.selectedId);
  const compareMode = useSimulationStore((s) => s.compareMode);

  const info = useMemo(() => {
    if (!selectedId) return null;
    const b = bodyById[selectedId];
    if (!b) return null;
    const parent = b.parentId ? bodyById[b.parentId] : null;
    return { b, parent };
  }, [selectedId]);

  if (!info || compareMode) return null;

  const { b, parent } = info;

  let distLabel = "";
  if (b.type === "star") {
    distLabel = "Pusat sistem";
  } else if (parent && b.type === "moon") {
    distLabel = `${(b.orbitRadius / 1000).toFixed(0)} rb km dari ${parent.name}`;
  } else {
    distLabel = `${formatDistance(b.distanceAu)} dari Matahari`;
  }

  return (
    <div className="pointer-events-none rounded-xl border border-white/10 bg-slate-950/65 px-3 py-2 text-[11px] text-white/70 shadow-lg backdrop-blur-md">
      <span className="font-medium text-white">{b.name}</span>
      <span className="mx-1.5 text-white/25">·</span>
      <span>R {formatRadius(b.radiusKm)}</span>
      <span className="mx-1.5 text-white/25">·</span>
      <span>{distLabel}</span>
    </div>
  );
}
