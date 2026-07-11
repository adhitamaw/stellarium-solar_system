"use client";

import { useState } from "react";
import { enableAudio, stopAudio } from "@/lib/audio";
import { copyFocusLink } from "@/lib/shareUrl";
import { useSimulationStore } from "@/store/useSimulationStore";
import { useT } from "@/store/useLocaleStore";

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
  const t = useT();

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
    setShareMsg(ok ? t("linkCopied") : t("linkFailed"));
    window.setTimeout(() => setShareMsg(null), 1800);
  };

  return (
    <div className="pointer-events-auto flex flex-col items-end gap-1">
      <div className="x-panel flex max-w-[100%] flex-wrap items-center justify-end gap-1 p-1">
        <button
          type="button"
          onClick={() => void onToggleAudio()}
          className={`x-btn h-8 px-2.5 text-[10px] uppercase tracking-[0.1em] ${
            audioEnabled ? "x-btn-primary" : ""
          }`}
          title={t("audio")}
        >
          {audioEnabled ? t("audioOn") : t("audio")}
        </button>

        <button
          type="button"
          onClick={() => void onShare()}
          className="x-btn h-8 px-2.5 text-[10px] uppercase tracking-[0.1em]"
          title={t("share")}
        >
          {t("share")}
        </button>

        <button
          type="button"
          onClick={toggleCompareMode}
          className={`x-btn h-8 px-2.5 text-[10px] uppercase tracking-[0.1em] ${
            compareMode ? "x-btn-primary" : ""
          }`}
          title={t("compare")}
        >
          {t("compare")}
        </button>

        <button
          type="button"
          onClick={requestCapture}
          className="x-btn h-8 px-2.5 text-[10px] uppercase tracking-[0.1em]"
          title={t("capture")}
        >
          {t("capture")}
        </button>

        <button
          type="button"
          onClick={() => setAutoQuality(!autoQuality)}
          className={`x-btn hidden h-8 px-2.5 text-[10px] uppercase tracking-[0.1em] sm:inline-flex ${
            autoQuality ? "x-btn-primary" : ""
          }`}
          title={t("quality")}
        >
          {autoQuality ? t("autoQ") : t("manualQ")}
        </button>

        <button
          type="button"
          onClick={() => setShowShortcuts(!showShortcuts)}
          className="x-btn hidden h-8 w-8 sm:inline-flex"
          title={t("help")}
        >
          ?
        </button>
      </div>
      {shareMsg && (
        <span className="border border-white/15 bg-black px-2 py-0.5 font-mono text-[10px] text-white/70">
          {shareMsg}
        </span>
      )}
    </div>
  );
}
