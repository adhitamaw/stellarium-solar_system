"use client";

import { enableAudio, stopAudio } from "@/lib/audio";
import { copyFocusLink } from "@/lib/shareUrl";
import {
  type QualityPreset,
  useSimulationStore,
} from "@/store/useSimulationStore";
import { useT } from "@/store/useLocaleStore";
import { LanguageToggle } from "./LanguageToggle";

export function MoreMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const cameraMode = useSimulationStore((s) => s.cameraMode);
  const setCameraMode = useSimulationStore((s) => s.setCameraMode);
  const showOrbits = useSimulationStore((s) => s.showOrbits);
  const toggleOrbits = useSimulationStore((s) => s.toggleOrbits);
  const showLabels = useSimulationStore((s) => s.showLabels);
  const toggleLabels = useSimulationStore((s) => s.toggleLabels);
  const scaleMode = useSimulationStore((s) => s.scaleMode);
  const setScaleMode = useSimulationStore((s) => s.setScaleMode);
  const quality = useSimulationStore((s) => s.quality);
  const setQuality = useSimulationStore((s) => s.setQuality);
  const audioEnabled = useSimulationStore((s) => s.audioEnabled);
  const audioVolume = useSimulationStore((s) => s.audioVolume);
  const setAudioEnabled = useSimulationStore((s) => s.setAudioEnabled);
  const toggleCompareMode = useSimulationStore((s) => s.toggleCompareMode);
  const requestCapture = useSimulationStore((s) => s.requestCapture);
  const selectedId = useSimulationStore((s) => s.selectedId);
  const fps = useSimulationStore((s) => s.fps);
  const t = useT();

  if (!open) return null;

  const onAudio = async () => {
    if (!audioEnabled) {
      const ok = await enableAudio(audioVolume || 0.85);
      if (ok) setAudioEnabled(true);
    } else {
      stopAudio();
      setAudioEnabled(false);
    }
  };

  return (
    <div className="pointer-events-auto absolute inset-0 z-40 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label={t("close")}
        onClick={onClose}
      />
      <div
        className="absolute inset-x-0 bottom-0 max-h-[min(78dvh,560px)] overflow-y-auto border-t border-white/12 bg-black px-4 pb-6 pt-3"
        style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto mb-4 h-px w-10 bg-white/25" />
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[13px] font-medium tracking-wide text-white">
            {t("systems")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="x-btn h-8 px-3 text-[10px] uppercase tracking-[0.12em]"
          >
            {t("close")}
          </button>
        </div>

        <Section title={t("lang")}>
          <LanguageToggle />
        </Section>

        <Section title={t("camera")}>
          <Seg
            items={[
              { id: "orbit", label: t("orbit") },
              { id: "fly", label: t("fly") },
            ]}
            value={cameraMode}
            onChange={(v) => setCameraMode(v as "orbit" | "fly")}
          />
        </Section>

        <Section title={t("display")}>
          <Seg
            items={[
              { id: "visible", label: t("clearScale") },
              { id: "realistic", label: t("realScale") },
            ]}
            value={scaleMode}
            onChange={(v) => setScaleMode(v as "visible" | "realistic")}
          />
          <div className="mt-2 flex gap-2">
            <Toggle active={showOrbits} onClick={toggleOrbits}>
              {t("orbits")}
            </Toggle>
            <Toggle active={showLabels} onClick={toggleLabels}>
              {t("labels")}
            </Toggle>
          </div>
        </Section>

        <Section title={t("quality")}>
          <Seg
            items={[
              { id: "performance", label: t("lite") },
              { id: "balanced", label: t("balanced") },
              { id: "ultra", label: t("ultra") },
            ]}
            value={quality}
            onChange={(v) => setQuality(v as QualityPreset)}
          />
          <p className="mt-2 font-mono text-[11px] tabular-nums text-white/30">
            {fps > 0 ? `${fps} FPS` : "— FPS"}
          </p>
        </Section>

        <Section title={t("actions")}>
          <div className="grid grid-cols-2 gap-2">
            <Action onClick={() => void onAudio()}>
              {audioEnabled ? t("audioOn") : t("audioOff")}
            </Action>
            <Action
              onClick={async () => {
                await copyFocusLink(selectedId ?? "earth");
                onClose();
              }}
            >
              {t("shareLink")}
            </Action>
            <Action
              onClick={() => {
                toggleCompareMode();
                onClose();
              }}
            >
              {t("compare")}
            </Action>
            <Action
              onClick={() => {
                requestCapture();
                onClose();
              }}
            >
              {t("capture")}
            </Action>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <p className="x-label mb-2.5">{title}</p>
      {children}
    </div>
  );
}

function Seg({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`x-btn h-9 px-3 text-[11px] ${
            value === o.id ? "x-btn-primary" : ""
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`x-btn h-9 px-3 text-[11px] ${active ? "x-btn-primary" : ""}`}
    >
      {children}
    </button>
  );
}

function Action({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="x-btn h-11 justify-start px-3 text-left text-[12px] tracking-wide"
    >
      {children}
    </button>
  );
}
