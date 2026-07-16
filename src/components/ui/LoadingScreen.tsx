"use client";

import { useEffect, useState } from "react";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useT } from "@/store/useLocaleStore";

export function LoadingScreen() {
  const progress = useLoadingStore((s) => s.progress);
  const ready = useLoadingStore((s) => s.ready);
  const label = useLoadingStore((s) => s.label);
  const [fadeOut, setFadeOut] = useState(false);
  const [gone, setGone] = useState(false);
  const t = useT();

  useEffect(() => {
    if (!ready) return;
    const t1 = window.setTimeout(() => setFadeOut(true), 200);
    const t2 = window.setTimeout(() => setGone(true), 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ready]);

  const [showSkip, setShowSkip] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setShowSkip(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (gone) return null;

  return (
    <div
      className={`absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-500 ${
        fadeOut
          ? "pointer-events-none opacity-0"
          : "pointer-events-auto opacity-100"
      }`}
      aria-busy={!ready}
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-35">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-white"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              opacity: 0.2 + (i % 5) * 0.15,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex w-[min(90vw,360px)] flex-col items-center px-6 text-center">
        <div className="mb-6 h-14 w-14 border border-white/20 bg-white/[0.04]">
          <div className="h-full w-full animate-pulse bg-white/10" />
        </div>
        <p className="x-label">{t("onboardingKicker")}</p>
        <h1 className="mt-2 text-xl font-medium tracking-tight text-white sm:text-2xl">
          {t("entering")}
        </h1>
        <p className="mt-2 text-sm text-white/40">{label || t("loadingLabel")}</p>

        <div className="mt-8 h-px w-full overflow-hidden bg-white/10">
          <div
            className="h-full bg-white transition-[width] duration-300 ease-out"
            style={{ width: `${Math.max(4, progress)}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-xs tabular-nums tracking-wider text-white/35">
          {Math.round(progress)}%
        </p>

        {showSkip && !ready && (
          <button
            type="button"
            onClick={() => useLoadingStore.getState().markReady()}
            className="x-btn mt-6 h-9 px-4 text-[11px] uppercase tracking-[0.12em]"
          >
            {t("skipOpen")}
          </button>
        )}
      </div>
    </div>
  );
}
