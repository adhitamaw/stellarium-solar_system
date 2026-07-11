"use client";

import { enableAudio } from "@/lib/audio";
import { useSimulationStore } from "@/store/useSimulationStore";

const tips = [
  {
    title: "Kontrol & zoom",
    body: "Seret mengorbit, scroll zoom dekat (super-zoom Bumi), klik kanan pan. Mode Terbang: WASD + Q/E.",
  },
  {
    title: "Banding ukuran & info",
    body: "Tombol Banding (B) membandingkan radius ilmiah dua objek. Klik planet untuk data & fly-to.",
  },
  {
    title: "Suara, share & mobile",
    body: "Toggle Suara (M). Share menyalin link fokus. Di HP: 1 jari putar, 2 jari cubit zoom.",
  },
];

export function Onboarding() {
  const show = useSimulationStore((s) => s.showOnboarding);
  const setShow = useSimulationStore((s) => s.setShowOnboarding);
  const setTourAuto = useSimulationStore((s) => s.setTourAuto);
  const goToTourStep = useSimulationStore((s) => s.goToTourStep);
  const setAudioEnabled = useSimulationStore((s) => s.setAudioEnabled);

  if (!show) return null;

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
      style={{
        paddingTop: "max(0.75rem, env(safe-area-inset-top))",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="max-h-[min(90dvh,640px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-4 shadow-2xl sm:rounded-3xl sm:p-8">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-300/80">
          Stellarium Cinematic
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-white sm:text-3xl">
          Siap dieksplorasi
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          Simulator tata surya sinematik — tekstur 8K, efek close-up, banding
          skala, audio ambient, dan screenshot shareable.
        </p>

        <ul className="mt-6 space-y-3">
          {tips.map((t) => (
            <li
              key={t.title}
              className="rounded-xl border border-white/8 bg-white/5 px-4 py-3"
            >
              <p className="text-sm font-medium text-white">{t.title}</p>
              <p className="mt-0.5 text-sm text-white/55">{t.body}</p>
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
            Auto + suara
          </button>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Eksplorasi bebas
          </button>
        </div>
      </div>
    </div>
  );
}
