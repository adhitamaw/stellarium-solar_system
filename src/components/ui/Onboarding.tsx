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
      className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-4"
      style={{
        paddingTop: "max(0.75rem, env(safe-area-inset-top))",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="x-panel panel-scroll max-h-[min(90dvh,640px)] w-full max-w-lg overflow-y-auto p-4 sm:p-7">
        <div className="mb-3 flex items-start justify-between gap-2">
          <p className="x-label">{t("onboardingKicker")}</p>
          <LanguageToggle />
        </div>
        <h1 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
          {t("onboardingTitle")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          {t("onboardingBody")}
        </p>

        <ul className="mt-6 space-y-2">
          {tips.map((tip) => (
            <li
              key={tip.title}
              className="border border-white/[0.08] bg-black/40 px-3.5 py-3"
            >
              <p className="text-[13px] font-medium text-white">{tip.title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-white/45">
                {tip.body}
              </p>
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
            className="x-btn x-btn-primary h-11 flex-1 text-[12px] uppercase tracking-[0.12em]"
          >
            {t("startAutoAudio")}
          </button>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="x-btn h-11 flex-1 text-[12px] uppercase tracking-[0.12em]"
          >
            {t("exploreFree")}
          </button>
        </div>
      </div>
    </div>
  );
}
