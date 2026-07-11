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
    <div className="absolute inset-0 z-[90] flex items-center justify-center bg-[#02040a] p-6 text-center">
      <div className="max-w-md">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-300/70">
          {t("onboardingKicker")}
        </p>
        <h1 className="mt-2 text-xl font-semibold text-white">
          {t("webglTitle")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          {t("webglBody")}
        </p>
        {error && (
          <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 font-mono text-[11px] text-red-200/80">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950"
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
