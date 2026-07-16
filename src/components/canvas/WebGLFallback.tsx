"use client";

import { useEffect, useState } from "react";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useT } from "@/store/useLocaleStore";

export function WebGLFallback({ error }: { error?: string }) {
  const t = useT();

  useEffect(() => {
    useLoadingStore.getState().markReady();
  }, []);

  return (
    <div className="absolute inset-0 z-[90] flex items-center justify-center bg-black p-6 text-center">
      <div className="x-panel max-w-md p-6">
        <p className="x-label">{t("onboardingKicker")}</p>
        <h1 className="mt-2 text-xl font-medium tracking-tight text-white">
          {t("webglTitle")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          {t("webglBody")}
        </p>
        {error && (
          <p className="mt-3 border border-white/10 bg-black px-3 py-2 font-mono text-[11px] text-white/45">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="x-btn x-btn-primary mt-6 h-10 px-5 text-[11px] uppercase tracking-[0.12em]"
        >
          {t("reload")}
        </button>
      </div>
    </div>
  );
}

/** Detect missing WebGL before mounting R3F Canvas */
export function useWebGLSupport() {
  const [state, setState] = useState<"unknown" | "ok" | "fail">("unknown");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl =
        c.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
        c.getContext("webgl", { failIfMajorPerformanceCaveat: false }) ||
        c.getContext("experimental-webgl");
      if (!gl) {
        setState("fail");
        setMsg("WebGL context null");
        return;
      }
      setState("ok");
    } catch (e) {
      setState("fail");
      setMsg(e instanceof Error ? e.message : "WebGL error");
    }
  }, []);

  return { state, msg };
}
