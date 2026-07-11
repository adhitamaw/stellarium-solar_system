"use client";

import { useEffect, useState } from "react";
import { useLoadingStore } from "@/store/useLoadingStore";

export function LoadingScreen() {
  const progress = useLoadingStore((s) => s.progress);
  const ready = useLoadingStore((s) => s.ready);
  const label = useLoadingStore((s) => s.label);
  const [fadeOut, setFadeOut] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const t1 = window.setTimeout(() => setFadeOut(true), 200);
    const t2 = window.setTimeout(() => setGone(true), 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ready]);

  // Skip button if stuck
  const [showSkip, setShowSkip] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShowSkip(true), 4000);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div
      className={`absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#02040a] transition-opacity duration-500 ${
        fadeOut
          ? "pointer-events-none opacity-0"
          : "pointer-events-auto opacity-100"
      }`}
      aria-busy={!ready}
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
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
        <div className="mb-6 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-amber-200 via-orange-400 to-orange-600 shadow-[0_0_60px_rgba(251,146,60,0.55)]" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-300/80">
          Stellarium Cinematic
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Memasuki tata surya
        </h1>
        <p className="mt-2 text-sm text-white/45">{label}</p>

        <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-amber-300 transition-[width] duration-300 ease-out"
            style={{ width: `${Math.max(4, progress)}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-xs tabular-nums text-white/40">
          {Math.round(progress)}%
        </p>

        {showSkip && !ready && (
          <button
            type="button"
            onClick={() => useLoadingStore.getState().markReady()}
            className="mt-6 rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
          >
            Lewati / buka sekarang
          </button>
        )}
      </div>
    </div>
  );
}
