"use client";

import { bodyById } from "@/data/celestialBodies";
import { compareBodyOptions } from "@/components/canvas/CompareScene";
import { useSimulationStore } from "@/store/useSimulationStore";

export function ComparePanel() {
  const compareMode = useSimulationStore((s) => s.compareMode);
  const compareA = useSimulationStore((s) => s.compareA);
  const compareB = useSimulationStore((s) => s.compareB);
  const setCompareA = useSimulationStore((s) => s.setCompareA);
  const setCompareB = useSimulationStore((s) => s.setCompareB);
  const setCompareMode = useSimulationStore((s) => s.setCompareMode);

  if (!compareMode) return null;

  const a = bodyById[compareA];
  const b = bodyById[compareB];
  const ratio =
    a && b ? Math.max(a.radiusKm, b.radiusKm) / Math.min(a.radiusKm, b.radiusKm) : 1;

  return (
    <div className="pointer-events-auto absolute left-1/2 top-20 z-30 w-[min(100%-2rem,420px)] -translate-x-1/2 rounded-2xl border border-amber-400/25 bg-slate-950/85 p-4 shadow-2xl backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
            Mode banding ukuran
          </p>
          <p className="text-sm text-white/70">
            Skala ilmiah radius (bukan jarak orbit)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCompareMode(false)}
          className="rounded-lg px-2 py-1 text-xs text-white/50 hover:bg-white/10 hover:text-white"
        >
          Tutup · Esc
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs text-white/50">
          Objek A
          <select
            value={compareA}
            onChange={(e) => setCompareA(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-amber-400/40"
          >
            {compareBodyOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-white/50">
          Objek B
          <select
            value={compareB}
            onChange={(e) => setCompareB(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-amber-400/40"
          >
            {compareBodyOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {a && b && (
        <p className="mt-3 text-center text-xs text-white/55">
          <span className="text-white/90">{a.name}</span> vs{" "}
          <span className="text-white/90">{b.name}</span>
          {" · "}
          lebih besar ≈{" "}
          <span className="font-mono text-amber-200">{ratio.toFixed(1)}×</span>{" "}
          radius
        </p>
      )}

      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {[
          ["earth", "jupiter"],
          ["earth", "sun"],
          ["moon", "earth"],
          ["mars", "earth"],
          ["earth", "neptune"],
        ].map(([x, y]) => (
          <button
            key={`${x}-${y}`}
            type="button"
            onClick={() => {
              setCompareA(x);
              setCompareB(y);
            }}
            className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-white/60 transition hover:border-amber-400/30 hover:text-amber-100"
          >
            {bodyById[x]?.name} / {bodyById[y]?.name}
          </button>
        ))}
      </div>
    </div>
  );
}
