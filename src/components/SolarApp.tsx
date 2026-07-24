"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
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
import { hydrateLocale } from "@/store/useLocaleStore";

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

  useEffect(() => {
    // Client-only: locale, quality, and live wall-clock epoch
    hydrateLocale();
    const q = preferredQuality();
    useSimulationStore.setState({
      quality: q,
      autoQuality: true,
      qualityLocked: false,
    });
    // Snap realtime date after hydration (never Date.now() during SSR)
    useSimulationStore.getState().enableRealtime();

    // Global safety: never leave loading forever
    const t = window.setTimeout(() => {
      if (!useLoadingStore.getState().ready) {
        useLoadingStore.getState().markReady();
      }
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  if (state === "fail") {
    return <WebGLFallback error={msg} />;
  }

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#02040a]">
      {state === "ok" && <SolarCanvas />}
      <HUD />
      <AudioBridge />
      <DeepLink />
      <LoadingScreen />
    </main>
  );
}
