"use client";

import {
  type QualityPreset,
  useSimulationStore,
} from "@/store/useSimulationStore";

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

  return (
    <div className="pointer-events-auto flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/10 bg-slate-950/70 p-1.5 shadow-xl backdrop-blur-xl">
        <ToggleGroup
          label="Kamera"
          options={[
            { id: "orbit", label: "Orbit" },
            { id: "fly", label: "Terbang" },
          ]}
          value={cameraMode}
          onChange={(v) => setCameraMode(v as "orbit" | "fly")}
        />

        <div className="mx-0.5 h-6 w-px bg-white/10" />

        <ToggleGroup
          label="Skala"
          options={[
            { id: "visible", label: "Jelas" },
            { id: "realistic", label: "Realistis" },
          ]}
          value={scaleMode}
          onChange={(v) => setScaleMode(v as "visible" | "realistic")}
        />

        <div className="mx-0.5 h-6 w-px bg-white/10" />

        <Chip active={showOrbits} onClick={toggleOrbits}>
          Orbit
        </Chip>
        <Chip active={showLabels} onClick={toggleLabels}>
          Label
        </Chip>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/10 bg-slate-950/70 p-1.5 shadow-xl backdrop-blur-xl">
        <span className="px-1 text-[9px] font-medium uppercase tracking-wider text-white/40">
          Kualitas
        </span>
        <ToggleGroup
          label="Kualitas"
          options={[
            { id: "performance", label: "Perf" },
            { id: "balanced", label: "Seimbang" },
            { id: "ultra", label: "Ultra" },
          ]}
          value={quality}
          onChange={(v) => setQuality(v as QualityPreset)}
        />
        <div className="mx-0.5 h-6 w-px bg-white/10" />
        <span
          className="min-w-[3.5rem] px-1.5 font-mono text-[11px] tabular-nums text-emerald-300/90"
          title="Frame rate (mengikuti refresh monitor, s.d. 240 Hz)"
        >
          {fps > 0 ? `${fps} FPS` : "— FPS"}
        </span>
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
    <div className="flex items-center gap-1" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
            value === o.id
              ? "bg-white/15 text-white"
              : "text-white/45 hover:bg-white/5 hover:text-white/80"
          }`}
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
      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-sky-500/25 text-sky-100 ring-1 ring-sky-400/30"
          : "text-white/45 hover:bg-white/5 hover:text-white/80"
      }`}
    >
      {children}
    </button>
  );
}
