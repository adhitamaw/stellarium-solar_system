"use client";

import {
  type QualityPreset,
  useSimulationStore,
} from "@/store/useSimulationStore";
import { useT } from "@/store/useLocaleStore";

export function Toolbar() {
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
  const fps = useSimulationStore((s) => s.fps);
  const autoQuality = useSimulationStore((s) => s.autoQuality);
  const t = useT();

  return (
    <div className="pointer-events-auto flex w-full flex-col gap-1.5">
      <div className="x-panel chip-scroll flex max-w-full items-center gap-1 p-1 sm:flex-wrap sm:gap-1.5 sm:p-1.5">
        <ToggleGroup
          label={t("camera")}
          options={[
            { id: "orbit", label: t("orbit") },
            { id: "fly", label: t("fly") },
          ]}
          value={cameraMode}
          onChange={(v) => setCameraMode(v as "orbit" | "fly")}
        />

        <div className="mx-0.5 hidden h-5 w-px shrink-0 bg-white/10 sm:block" />

        <ToggleGroup
          label={t("display")}
          options={[
            { id: "visible", label: t("clearScale") },
            { id: "realistic", label: t("realScale") },
          ]}
          value={scaleMode}
          onChange={(v) => setScaleMode(v as "visible" | "realistic")}
        />

        <div className="mx-0.5 hidden h-5 w-px shrink-0 bg-white/10 sm:block" />

        <Chip active={showOrbits} onClick={toggleOrbits}>
          {t("orbits")}
        </Chip>
        <Chip active={showLabels} onClick={toggleLabels}>
          {t("labels")}
        </Chip>
      </div>

      <div className="x-panel hidden flex-wrap items-center gap-1.5 p-1.5 sm:flex">
        <span className="x-label px-1">{t("quality")}</span>
        <ToggleGroup
          label={t("quality")}
          options={[
            { id: "performance", label: t("lite") },
            { id: "balanced", label: t("balanced") },
            { id: "ultra", label: t("ultra") },
          ]}
          value={quality}
          onChange={(v) => setQuality(v as QualityPreset)}
        />
        <div className="mx-0.5 h-6 w-px bg-white/10" />
        <span className="min-w-[3.5rem] px-1.5 font-mono text-[11px] tabular-nums text-white/70">
          {fps > 0 ? `${fps} FPS` : "— FPS"}
        </span>
        {autoQuality && (
          <span className="x-chip is-active !py-0.5 text-[9px] uppercase tracking-[0.1em]">
            {t("autoQ")}
          </span>
        )}
      </div>
    </div>
  );
}

function ToggleGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-0.5"
      role="group"
      aria-label={label}
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`x-chip ${value === o.id ? "is-active" : ""}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Chip({
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
      className={`x-chip shrink-0 ${active ? "is-active" : ""}`}
    >
      {children}
    </button>
  );
}
