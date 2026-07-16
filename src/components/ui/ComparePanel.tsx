"use client";

import { bodyById } from "@/data/celestialBodies";
import { compareBodyOptions } from "@/components/canvas/CompareScene";
import { useSimulationStore } from "@/store/useSimulationStore";
import { useLocaleStore, useT } from "@/store/useLocaleStore";
import { localizeBody } from "@/i18n/localize";
import { formatNumber } from "@/i18n/format";

const PRESETS: [string, string][] = [
  ["earth", "jupiter"],
  ["earth", "sun"],
  ["moon", "earth"],
  ["mars", "earth"],
  ["earth", "neptune"],
  ["mercury", "jupiter"],
];

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

  const larger = aRaw && bRaw
    ? aRaw.radiusKm >= bRaw.radiusKm
      ? { name: a?.name ?? "", ratio: aRaw.radiusKm / bRaw.radiusKm }
      : { name: b?.name ?? "", ratio: bRaw.radiusKm / aRaw.radiusKm }
    : null;

  const swap = () => {
    setCompareA(compareB);
    setCompareB(compareA);
  };

  const options = compareBodyOptions.map((o) => {
    const loc = localizeBody(bodyById[o.id] ?? o, locale);
    return { id: o.id, name: loc.name };
  });

  return (
    <>
      {/* ─── MOBILE: bottom sheet ─── */}
      <div
        className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 md:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="x-panel mx-2 mb-2 overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] px-3 py-2.5">
            <div className="min-w-0">
              <p className="x-label">{t("compareMode")}</p>
              <p className="mt-0.5 truncate text-[11px] text-white/40">
                {t("compareHint")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCompareMode(false)}
              className="x-btn h-8 shrink-0 px-3 text-[10px] uppercase tracking-[0.12em]"
            >
              {t("close")}
            </button>
          </div>

          <div className="px-3 py-3">
            <div className="flex items-end gap-2">
              <BodySelect
                label={t("objectA")}
                value={compareA}
                options={options}
                onChange={setCompareA}
              />
              <button
                type="button"
                onClick={swap}
                className="x-btn mb-0.5 h-10 w-10 shrink-0"
                aria-label="Swap"
                title="A ↔ B"
              >
                <SwapIcon />
              </button>
              <BodySelect
                label={t("objectB")}
                value={compareB}
                options={options}
                onChange={setCompareB}
              />
            </div>

            {larger && a && b && (
              <div className="mt-3 border border-white/[0.08] bg-black/40 px-3 py-2 text-center">
                <p className="font-mono text-[12px] tracking-tight text-white">
                  {a.name}{" "}
                  <span className="text-white/30">{t("vs")}</span> {b.name}
                </p>
                <p className="mt-1 text-[11px] text-white/45">
                  {larger.name} {t("largerApprox")}{" "}
                  <span className="font-mono text-white">
                    {formatNumber(larger.ratio, locale, 1)}×
                  </span>{" "}
                  {t("radiusUnit")}
                </p>
              </div>
            )}

            <PresetRow
              locale={locale}
              compareA={compareA}
              compareB={compareB}
              onPick={(x, y) => {
                setCompareA(x);
                setCompareB(y);
              }}
            />
          </div>
        </div>
      </div>

      {/* ─── DESKTOP: top control strip ─── */}
      <div className="pointer-events-auto absolute left-1/2 top-20 z-30 hidden w-[min(100%-2rem,440px)] -translate-x-1/2 md:block">
        <div className="x-panel overflow-hidden">
          <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] px-4 py-3">
            <div className="min-w-0">
              <p className="x-label">{t("compareMode")}</p>
              <p className="mt-1 text-[12px] leading-snug text-white/40">
                {t("compareHint")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCompareMode(false)}
              className="x-btn x-btn-ghost h-8 w-8 shrink-0"
              aria-label={t("close")}
              title={t("close")}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="px-4 py-3">
            <div className="flex items-end gap-2">
              <BodySelect
                label={t("objectA")}
                value={compareA}
                options={options}
                onChange={setCompareA}
              />
              <button
                type="button"
                onClick={swap}
                className="x-btn mb-0.5 h-10 w-10 shrink-0"
                aria-label="Swap"
                title="A ↔ B"
              >
                <SwapIcon />
              </button>
              <BodySelect
                label={t("objectB")}
                value={compareB}
                options={options}
                onChange={setCompareB}
              />
            </div>

            {larger && a && b && (
              <div className="mt-3 flex items-center justify-between gap-3 border border-white/[0.08] bg-black/40 px-3 py-2">
                <p className="min-w-0 truncate font-mono text-[12px] text-white/90">
                  {a.name}{" "}
                  <span className="text-white/30">{t("vs")}</span> {b.name}
                </p>
                <p className="shrink-0 font-mono text-[12px] tabular-nums text-white">
                  {formatNumber(larger.ratio, locale, 1)}×
                  <span className="ml-1 text-[10px] uppercase tracking-wider text-white/35">
                    {t("radiusUnit")}
                  </span>
                </p>
              </div>
            )}

            <PresetRow
              locale={locale}
              compareA={compareA}
              compareB={compareB}
              onPick={(x, y) => {
                setCompareA(x);
                setCompareB(y);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function BodySelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { id: string; name: string }[];
  onChange: (id: string) => void;
}) {
  return (
    <label className="block min-w-0 flex-1">
      <span className="x-label">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-10 w-full appearance-none border border-white/[0.12] bg-black px-2.5 text-[13px] text-white outline-none focus:border-white/30"
        style={{ borderRadius: "var(--x-radius)" }}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id} className="bg-black text-white">
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function PresetRow({
  locale,
  compareA,
  compareB,
  onPick,
}: {
  locale: "id" | "en";
  compareA: string;
  compareB: string;
  onPick: (a: string, b: string) => void;
}) {
  return (
    <div className="chip-scroll mt-3 flex gap-1.5 pb-0.5">
      {PRESETS.map(([x, y]) => {
        const nx = bodyById[x] ? localizeBody(bodyById[x], locale).name : x;
        const ny = bodyById[y] ? localizeBody(bodyById[y], locale).name : y;
        const active =
          (compareA === x && compareB === y) ||
          (compareA === y && compareB === x);
        return (
          <button
            key={`${x}-${y}`}
            type="button"
            onClick={() => onPick(x, y)}
            className={`x-chip shrink-0 whitespace-nowrap px-2.5 py-1.5 text-[10px] uppercase tracking-[0.06em] ${
              active ? "is-active" : ""
            }`}
          >
            {nx} / {ny}
          </button>
        );
      })}
    </div>
  );
}

function SwapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 7h11M18 7l-3-3M18 7l-3 3M17 17H6M6 17l3-3M6 17l3 3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
