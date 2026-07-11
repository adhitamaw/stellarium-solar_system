"use client";

import { useSimulationStore } from "@/store/useSimulationStore";

const rows = [
  ["Ctrl / ⌘ K", "Cari objek"],
  ["M", "Toggle suara ambient"],
  ["B", "Mode banding ukuran"],
  ["C", "Screenshot PNG"],
  ["← / →", "Prev / Next navigasi (panel kiri)"],
  ["?", "Tampilkan / tutup bantuan"],
  ["Esc", "Tutup banding / panel"],
  ["Scroll", "Zoom kamera"],
  ["WASD + Q/E", "Mode terbang"],
];

export function ShortcutsModal() {
  const show = useSimulationStore((s) => s.showShortcuts);
  const setShow = useSimulationStore((s) => s.setShowShortcuts);

  if (!show) return null;

  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950/95 p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Keyboard shortcuts</h2>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="text-xs text-white/45 hover:text-white"
          >
            Tutup
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
