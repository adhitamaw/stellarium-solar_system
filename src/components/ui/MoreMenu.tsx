"use client";

import { enableAudio, stopAudio } from "@/lib/audio";
import { copyFocusLink } from "@/lib/shareUrl";
import {
  type QualityPreset,
  useSimulationStore,
} from "@/store/useSimulationStore";

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
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        aria-label="Tutup menu"
        onClick={onClose}
      />
      <div
        className="absolute inset-x-0 bottom-0 max-h-[min(78dvh,560px)] overflow-y-auto rounded-t-3xl border border-white/10 bg-slate-950/95 px-4 pb-6 pt-3 shadow-2xl"
        style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Menu</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xs text-white/50"
          >
            Tutup
          </button>
        </div>

        <Section title="Kamera">
          <RowBtns
            items={[
              { id: "orbit", label: "Orbit" },
              { id: "fly", label: "Terbang" },
            ]}
            value={cameraMode}
            onChange={(v) => setCameraMode(v as "orbit" | "fly")}
          />
        </Section>

        <Section title="Tampilan">
          <RowBtns
            items={[
              { id: "visible", label: "Skala jelas" },
              { id: "realistic", label: "Skala real" },
            ]}
            value={scaleMode}
            onChange={(v) => setScaleMode(v as "visible" | "realistic")}
          />
          <div className="mt-2 flex gap-2">
            <ToggleChip active={showOrbits} onClick={toggleOrbits}>
              Garis orbit
            </ToggleChip>
            <ToggleChip active={showLabels} onClick={toggleLabels}>
              Label
            </ToggleChip>
          </div>
        </Section>

        <Section title="Kualitas">
          <RowBtns
            items={[
              { id: "performance", label: "Ringan" },
              { id: "balanced", label: "Seimbang" },
              { id: "ultra", label: "Ultra" },
            ]}
            value={quality}
            onChange={(v) => setQuality(v as QualityPreset)}
          />
          <p className="mt-1.5 font-mono text-[11px] text-white/40">
            {fps > 0 ? `${fps} FPS` : "— FPS"}
          </p>
        </Section>

        <Section title="Aksi">
          <div className="grid grid-cols-2 gap-2">
            <ActionBtn onClick={() => void onAudio()}>
              {audioEnabled ? "🔊 Suara ON" : "🔇 Suara OFF"}
            </ActionBtn>
            <ActionBtn
              onClick={async () => {
                await copyFocusLink(selectedId ?? "earth");
                onClose();
              }}
            >
              🔗 Bagikan
            </ActionBtn>
            <ActionBtn
              onClick={() => {
                toggleCompareMode();
                onClose();
              }}
            >
              ⚖ Banding
            </ActionBtn>
            <ActionBtn
              onClick={() => {
                requestCapture();
                onClose();
              }}
            >
              📷 Capture
            </ActionBtn>
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
    <div className="mb-4">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
        {title}
      </p>
      {children}
    </div>
  );
}

function RowBtns({
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
          className={`rounded-xl px-3 py-2 text-xs font-medium ${
            value === o.id
              ? "bg-white/15 text-white"
              : "bg-white/5 text-white/55"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ToggleChip({
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
      className={`rounded-xl px-3 py-2 text-xs font-medium ${
        active
          ? "bg-sky-500/25 text-sky-100 ring-1 ring-sky-400/30"
          : "bg-white/5 text-white/55"
      }`}
    >
      {children}
    </button>
  );
}

function ActionBtn({
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
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-xs font-medium text-white/80 active:bg-white/10"
    >
      {children}
    </button>
  );
}
