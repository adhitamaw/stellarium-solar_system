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
      else {
        console.warn(
          "Audio gagal start — coba klik lagi atau izinkan suara di browser",
        );
      }
    } else {
      stopAudio();
      setAudioEnabled(false);
    }
  };

  const onShare = async () => {
    const id = selectedId ?? "earth";
    const ok = await copyFocusLink(id);
    setShareMsg(ok ? "Link disalin!" : "Gagal salin link");
    window.setTimeout(() => setShareMsg(null), 1800);
  };

  return (
    <div className="pointer-events-auto flex flex-col items-end gap-1">
      <div className="flex flex-wrap items-center justify-end gap-1.5 rounded-2xl border border-white/10 bg-slate-950/75 p-1.5 shadow-xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => void onToggleAudio()}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition ${
            audioEnabled
              ? "bg-emerald-500/25 text-emerald-100 ring-1 ring-emerald-400/40"
              : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
          title="Toggle suara ambient (M)"
        >
          {audioEnabled ? "🔊 ON" : "🔇 Suara"}
        </button>

        <button
          type="button"
          onClick={() => void onShare()}
          className="rounded-xl px-2.5 py-1.5 text-xs font-medium text-white/55 transition hover:bg-white/10 hover:text-white"
          title="Salin / bagikan link fokus objek"
        >
          🔗 Share
        </button>

        <button
          type="button"
          onClick={toggleCompareMode}
          className={`rounded-xl px-2.5 py-1.5 text-xs font-medium transition ${
            compareMode
              ? "bg-amber-500/25 text-amber-100 ring-1 ring-amber-400/35"
              : "text-white/55 hover:bg-white/10 hover:text-white"
          }`}
          title="Banding ukuran (B)"
        >
          ⚖ Banding
        </button>

        <button
          type="button"
          onClick={requestCapture}
          className="rounded-xl px-2.5 py-1.5 text-xs font-medium text-white/55 transition hover:bg-white/10 hover:text-white"
          title="Screenshot (C)"
        >
          📷 Capture
        </button>

        <button
          type="button"
          onClick={() => setAutoQuality(!autoQuality)}
          className={`rounded-xl px-2.5 py-1.5 text-xs font-medium transition ${
            autoQuality
              ? "bg-sky-500/20 text-sky-100 ring-1 ring-sky-400/30"
              : "text-white/45 hover:bg-white/10"
          }`}
          title="Auto quality berdasarkan FPS"
        >
          {autoQuality ? "AUTO" : "Manual"}
        </button>

        <button
          type="button"
          onClick={() => setShowShortcuts(!showShortcuts)}
          className="rounded-xl px-2 py-1.5 text-xs text-white/40 transition hover:bg-white/10 hover:text-white/80"
          title="Shortcuts (?)"
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
