"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { playCaptureClick } from "@/lib/audio";
import { useSimulationStore } from "@/store/useSimulationStore";

/** Listens for captureRequestId and downloads PNG from WebGL canvas (F4) */
export function CaptureController() {
  const { gl } = useThree();
  const captureRequestId = useSimulationStore((s) => s.captureRequestId);
  const lastId = useRef(0);

  useEffect(() => {
    if (captureRequestId === 0 || captureRequestId === lastId.current) return;
    lastId.current = captureRequestId;

    // Wait one frame so hideHud can paint
    const t = window.setTimeout(() => {
      try {
        const canvas = gl.domElement;
        const data = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
        a.href = data;
        a.download = `stellarium-${stamp}.png`;
        a.click();
        playCaptureClick();
      } catch (e) {
        console.warn("Screenshot failed", e);
      } finally {
        useSimulationStore.getState().setHideHud(false);
      }
    }, 80);

    return () => clearTimeout(t);
  }, [captureRequestId, gl]);

  return null;
}
