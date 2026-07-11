"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { HUD } from "@/components/ui/HUD";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { AudioBridge } from "@/components/canvas/AudioBridge";
import { DeepLink } from "@/components/DeepLink";
import {
  WebGLFallback,
  useWebGLSupport,
} from "@/components/canvas/WebGLFallback";
import { preferredQuality } from "@/lib/device";
import { useSimulationStore } from "@/store/useSimulationStore";
import { useLoadingStore } from "@/store/useLoadingStore";

const SolarCanvas = dynamic(
  () =>
    import("@/components/canvas/SolarCanvas").then((m) => m.SolarCanvas),
  {
    ssr: false,
    loading: () => null,
  },
);

export function SolarApp() {
  const { state, msg } = useWebGLSupport();
  const setQuality = useSimulationStore((s) => s.setQuality);
  const [bootstrapped, setBootstrapped] = useState(false);

  // Mobile/low-end: default to performance (2K textures, low DPR)
  useEffect(() => {
    const q = preferredQuality();
    setQuality(q, false);
    // Keep auto quality on mobile so it can drop further if needed
    useSimulationStore.setState({
      quality: q,
      autoQuality: true,
      qualityLocked: false,
    });
    setBootstrapped(true);

    // Global safety: never leave loading forever
    const t = window.setTimeout(() => {
      if (!useLoadingStore.getState().ready) {
        useLoadingStore.getState().markReady();
      }
    }, 8000);
    return () => clearTimeout(t);
  }, [setQuality]);

  if (state === "fail") {
    return <WebGLFallback error={msg} />;
  }

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#02040a]">
      {bootstrapped && state === "ok" && <SolarCanvas />}
      <HUD />
      <AudioBridge />
      <DeepLink />
      <LoadingScreen />
    </main>
  );
}
