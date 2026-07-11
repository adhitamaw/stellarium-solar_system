"use client";

import { useEffect, useRef } from "react";
import {
  playFlyWhoosh,
  playSelectBlip,
  setAmbientMuted,
  setAudioMasterVolume,
  stopAudio,
  resumeIfNeeded,
} from "@/lib/audio";
import { useSimulationStore } from "@/store/useSimulationStore";

/**
 * Keeps volume/mute in sync and plays SFX on focus.
 * Note: actual AudioContext start must happen in a click/key handler
 * (see FinishingBar / KeyboardHandler) — browsers block autoplay.
 */
export function AudioBridge() {
  const audioEnabled = useSimulationStore((s) => s.audioEnabled);
  const audioVolume = useSimulationStore((s) => s.audioVolume);
  const focusRequestId = useSimulationStore((s) => s.focusRequestId);
  const lastFocus = useRef(0);

  useEffect(() => {
    if (audioEnabled) {
      void resumeIfNeeded().then((ok) => {
        if (ok) {
          setAmbientMuted(false);
          setAudioMasterVolume(audioVolume);
        }
      });
    } else {
      stopAudio();
    }
  }, [audioEnabled]);

  useEffect(() => {
    if (audioEnabled) setAudioMasterVolume(audioVolume);
  }, [audioVolume, audioEnabled]);

  useEffect(() => {
    if (focusRequestId === 0 || focusRequestId === lastFocus.current) return;
    lastFocus.current = focusRequestId;
    if (!audioEnabled) return;
    playFlyWhoosh();
    // slight delay so whoosh + blip don't fully mask each other
    window.setTimeout(() => playSelectBlip(), 90);
  }, [focusRequestId, audioEnabled]);

  return null;
}
