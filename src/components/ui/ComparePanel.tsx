"use client";

import { bodyById } from "@/data/celestialBodies";
import { compareBodyOptions } from "@/components/canvas/CompareScene";
import { useSimulationStore } from "@/store/useSimulationStore";
import { useLocaleStore, useT } from "@/store/useLocaleStore";
import { localizeBody } from "@/i18n/localize";

export function ComparePanel() {
  const compareMode = useSimulationStore((s) => s.compareMode);
  const compareA = useSimulationStore((s) => s.compareA);
  const compareB = useSimulationStore((s) => s.compareB);
  const setCompareA = useSimulationStore((s) => s.setCompareA);
  const setCompareB = useSimulationStore((s) => s.setCompareB);
  const setCompareMode = useSimulationStore((s) => s.setCompareMode);
  const locale = useLocaleStore((s) => s.locale);
  const t = useT();

  if (!compareMode) return null;

  const aRaw = bodyById[compareA];
  const bRaw = bodyById[compareB];
  const a = aRaw ? localizeBody(aRaw, locale) : null;
  const b = bRaw ? localizeBody(bRaw, locale) : null;
  const ratio =
    aRaw && bRaw
      ? Math.max(aRaw.radiusKm, bRaw.radiusKm) /
        Math.min(aRaw.radiusKm, bRaw.radiusKm)
      : 1;

  return (
    <div className="pointer-events-auto absolute left-1/2 top-14 z-30 w-[min(100%-1rem,420px)] -translate-x-1/2 rounded-2xl border border-amber-400/25 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-xl sm:top-20 sm:w-[min(100%-2rem,420px)] sm:p-4">
      <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
            {t("compareMode")}
          </p>
          <p className="text-xs text-white/70 sm:text-sm">{t("compareHint")}</p>
        </div>
        <button
          type="button"
          onClick={() => setCompareMode(false)}
          className="shrink-0 rounded-lg px-2 py-1 text-xs text-white/50 hover:bg-white/10 hover:text-white"
        >
          {t("close")}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs text-white/50">
          {t("objectA")}
          <select
            value={compareA}
            onChange={(e) => setCompareA(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-amber-400/40"
          >
            {compareBodyOptions.map((o) => {
              const loc = localizeBody(bodyById[o.id] ?? o, locale);
              return (
                <option key={o.id} value={o.id}>
                  {loc.name}
                </option>
              );
            })}
          </select>
        </label>
        <label className="block text-xs text-white/50">
          {t("objectB")}
          <select
            value={compareB}
            onChange={(e) => setCompareB(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-2 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-amber-400/40"
          >
            {compareBodyOptions.map((o) => {
              const loc = localizeBody(bodyById[o.id] ?? o, locale);
              return (
                <option key={o.id} value={o.id}>
                  {loc.name}
                </option>
              );
            })}
          </select>
        </label>
      </div>

      {a && b && (
        <p className="mt-3 text-center text-xs text-white/55">
          <span className="text-white/90">{a.name}</span> vs{" "}
          <span className="text-white/90">{b.name}</span>
          {" · "}
          {t("largerApprox")}{" "}
          <span className="font-mono text-amber-200">{ratio.toFixed(1)}×</span>{" "}
          {t("radiusUnit")}
        </p>
      )}

      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {[
          ["earth", "jupiter"],
          ["earth", "sun"],
          ["moon", "earth"],
          ["mars", "earth"],
          ["earth", "neptune"],
        ].map(([x, y]) => {
          const nx = bodyById[x]
            ? localizeBody(bodyById[x], locale).name
            : x;
          const ny = bodyById[y]
            ? localizeBody(bodyById[y], locale).name
            : y;
          return (
            <button
              key={`${x}-${y}`}
              type="button"
              onClick={() => {
                setCompareA(x);
                setCompareB(y);
              }}
              className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-white/60 transition hover:border-amber-400/30 hover:text-amber-100"
            >
              {nx} / {ny}
            </button>
          );
        })}
      </div>
    </div>
  );
}
