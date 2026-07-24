"use client";

import { useEffect } from "react";
import { enableAudio, stopAudio } from "@/lib/audio";
import { useSimulationStore } from "@/store/useSimulationStore";

export function KeyboardHandler() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const s = useSimulationStore.getState();

      if (e.key === "Escape") {
        if (s.uiHidden) {
          s.setUiHidden(false);
          return;
        }
        if (s.compareMode) s.setCompareMode(false);
        else if (s.showShortcuts) s.setShowShortcuts(false);
        else if (s.showInfoPanel) s.setShowInfoPanel(false);
        return;
      }

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        s.setShowShortcuts(!s.showShortcuts);
        return;
      }

      // H = hide / show all menus (cinema mode)
      if (e.key.toLowerCase() === "h" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        s.toggleUiHidden();
        return;
      }

      if (e.key.toLowerCase() === "m" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (!s.audioEnabled) {
          void enableAudio(s.audioVolume || 0.85).then((ok) => {
            if (ok) s.setAudioEnabled(true);
          });
        } else {
          stopAudio();
          s.setAudioEnabled(false);
        }
        return;
      }
      if (e.key.toLowerCase() === "b" && !e.ctrlKey && !e.metaKey) {
        s.toggleCompareMode();
        return;
      }
      if (e.key.toLowerCase() === "c" && !e.ctrlKey && !e.metaKey) {
        s.requestCapture();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
