"use client";

import { useState } from "react";
import { enableAudio, stopAudio } from "@/lib/audio";
import { copyFocusLink } from "@/lib/shareUrl";
import { useSimulationStore } from "@/store/useSimulationStore";

export function FinishingBar() {
  const audioEnabled = useSimulationStore((s) => s.audioEnabled);
  const audioVolume = useSimulationStore((s) => s.audioVolume);
  const setAudioEnabled = useSimulationStore((s) => s.setAudioEnabled);
  const compareMode = useSimulationStore((s) => s.compareMode);
  const toggleCompareMode = useSimulationStore((s) => s.toggleCompareMode);
  const requestCapture = useSimulationStore((s) => s.requestCapture);
  const autoQuality = useSimulationStore((s) => s.autoQuality);
  const setAutoQuality = useSimulationStore((s) => s.setAutoQuality);
  const showShortcuts = useSimulationStore((s) => s.showShortcuts);
  const setShowShortcuts = useSimulationStore((s) => s.setShowShortcuts);
  const selectedId = useSimulationStore((s) => s.selectedId);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  const onToggleAudio = async () => {
    if (!audioEnabled) {
      const ok = await enableAudio(audioVolume || 0.85);
      if (ok) setAudioEnabled(true);
    } else {
      stopAudio();
      setAudioEnabled(false);
    }
  };

  const onShare = async () => {
    const id = selectedId ?? "earth";
    const ok = await copyFocusLink(id);
    setShareMsg(ok ? "Link disalin!" : "Gagal salin");
    window.setTimeout(() => setShareMsg(null), 1800);
  };

  const btn =
    "flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-medium transition sm:h-auto sm:rounded-xl sm:px-2.5 sm:py-1.5 sm:text-xs";

  return (
    <div className="pointer-events-auto flex flex-col items-end gap-1">
      <div className="flex max-w-[100%] flex-wrap items-center justify-end gap-1 rounded-xl border border-white/10 bg-slate-950/80 p-1 shadow-xl backdrop-blur-xl sm:gap-1.5 sm:rounded-2xl sm:p-1.5">
        <button
          type="button"
          onClick={() => void onToggleAudio()}
          className={`${btn} ${
            audioEnabled
              ? "bg-emerald-500/25 text-emerald-100 ring-1 ring-emerald-400/40"
              : "bg-white/5 text-white/70"
          }`}
          title="Suara"
          aria-label="Toggle suara"
        >
          <span className="sm:hidden">{audioEnabled ? "🔊" : "🔇"}</span>
          <span className="hidden sm:inline">
            {audioEnabled ? "🔊 ON" : "🔇 Suara"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => void onShare()}
          className={`${btn} text-white/55 hover:bg-white/10 hover:text-white`}
          title="Share"
          aria-label="Share link"
        >
          <span className="sm:hidden">🔗</span>
          <span className="hidden sm:inline">🔗 Share</span>
        </button>

        <button
          type="button"
          onClick={toggleCompareMode}
          className={`${btn} ${
            compareMode
              ? "bg-amber-500/25 text-amber-100 ring-1 ring-amber-400/35"
              : "text-white/55 hover:bg-white/10"
          }`}
          title="Banding"
          aria-label="Banding ukuran"
        >
          <span className="sm:hidden">⚖</span>
          <span className="hidden sm:inline">⚖ Banding</span>
        </button>

        <button
          type="button"
          onClick={requestCapture}
          className={`${btn} text-white/55 hover:bg-white/10 hover:text-white`}
          title="Capture"
          aria-label="Screenshot"
        >
          <span className="sm:hidden">📷</span>
          <span className="hidden sm:inline">📷 Capture</span>
        </button>

        <button
          type="button"
          onClick={() => setAutoQuality(!autoQuality)}
          className={`${btn} hidden sm:inline-flex ${
            autoQuality
              ? "bg-sky-500/20 text-sky-100 ring-1 ring-sky-400/30"
              : "text-white/45 hover:bg-white/10"
          }`}
          title="Auto quality"
        >
          {autoQuality ? "AUTO" : "Manual"}
        </button>

        <button
          type="button"
          onClick={() => setShowShortcuts(!showShortcuts)}
          className={`${btn} hidden text-white/40 hover:bg-white/10 sm:inline-flex`}
          title="Shortcuts"
        >
          ?
        </button>
      </div>
      {shareMsg && (
        <span className="rounded-lg bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-100 ring-1 ring-emerald-400/30">
          {shareMsg}
        </span>
      )}
    </div>
  );
}
