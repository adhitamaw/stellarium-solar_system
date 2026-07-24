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
    ["H", t("scHideUi")],
    ["Esc", t("scEsc")],
    ["Scroll", t("scScroll")],
    ["WASD + Q/E", t("scFly")],
  ];

  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="x-panel w-full max-w-sm p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-[13px] font-medium tracking-wide text-white">
            {t("shortcutsTitle")}
          </h2>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="x-btn h-8 px-3 text-[10px] uppercase tracking-[0.12em]"
          >
            {t("close")}
          </button>
        </div>
        <ul className="space-y-2">
          {rows.map(([k, v]) => (
            <li
              key={k}
              className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-2 last:border-0"
            >
              <kbd className="border border-white/15 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white/80">
                {k}
              </kbd>
              <span className="text-right text-[12px] text-white/50">{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
