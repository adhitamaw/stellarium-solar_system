"use client";

import { enableAudio } from "@/lib/audio";
import { useSimulationStore } from "@/store/useSimulationStore";
import { useT } from "@/store/useLocaleStore";
import { LanguageToggle } from "./LanguageToggle";

export function Onboarding() {
  const show = useSimulationStore((s) => s.showOnboarding);
  const setShow = useSimulationStore((s) => s.setShowOnboarding);
  const setTourAuto = useSimulationStore((s) => s.setTourAuto);
  const goToTourStep = useSimulationStore((s) => s.goToTourStep);
  const setAudioEnabled = useSimulationStore((s) => s.setAudioEnabled);
  const t = useT();

  if (!show) return null;

  const tips = [
    { title: t("onboardingTip1Title"), body: t("onboardingTip1Body") },
    { title: t("onboardingTip2Title"), body: t("onboardingTip2Body") },
    { title: t("onboardingTip3Title"), body: t("onboardingTip3Body") },
  ];

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
      style={{
        paddingTop: "max(0.75rem, env(safe-area-inset-top))",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="max-h-[min(90dvh,640px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-4 shadow-2xl sm:rounded-3xl sm:p-8">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-300/80">
            {t("onboardingKicker")}
          </div>
          <LanguageToggle />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-white sm:text-3xl">
          {t("onboardingTitle")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          {t("onboardingBody")}
        </p>

        <ul className="mt-6 space-y-3">
          {tips.map((tip) => (
            <li
              key={tip.title}
              className="rounded-xl border border-white/8 bg-white/5 px-4 py-3"
            >
              <p className="text-sm font-medium text-white">{tip.title}</p>
              <p className="mt-0.5 text-sm text-white/55">{tip.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              void enableAudio(0.85).then((ok) => {
                if (ok) setAudioEnabled(true);
              });
              setShow(false);
              goToTourStep(0);
              setTourAuto(true);
            }}
            className="flex-1 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            {t("startAutoAudio")}
          </button>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            {t("exploreFree")}
          </button>
        </div>
      </div>
    </div>
  );
}
