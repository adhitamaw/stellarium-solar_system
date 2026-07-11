"use client";

import { useSimulationStore } from "@/store/useSimulationStore";
import { useT } from "@/store/useLocaleStore";

export function ShortcutsModal() {
  const show = useSimulationStore((s) => s.showShortcuts);
  const setShow = useSimulationStore((s) => s.setShowShortcuts);
  const t = useT();

  if (!show) return null;

  const rows: [string, string][] = [
    ["Ctrl / ⌘ K", t("scSearch")],
    ["M", t("scAudio")],
    ["B", t("scCompare")],
    ["C", t("scCapture")],
    ["← / →", t("scNav")],
    ["?", t("scHelp")],
    ["Esc", t("scEsc")],
    ["Scroll", t("scScroll")],
    ["WASD + Q/E", t("scFly")],
  ];

  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950/95 p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            {t("shortcutsTitle")}
          </h2>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="text-xs text-white/45 hover:text-white"
          >
            {t("close")}
          </button>
        </div>
        <ul className="space-y-2">
          {rows.map(([k, v]) => (
            <li
              key={k}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <kbd className="rounded border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-sky-200">
                {k}
              </kbd>
              <span className="text-white/60">{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
