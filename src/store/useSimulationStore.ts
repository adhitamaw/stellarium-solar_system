"use client";

import { create } from "zustand";
import { guidedTour } from "@/data/tours";
import { isMobileDevice } from "@/lib/device";
import { simClock, type ScaleMode as ClockScale } from "@/lib/simClock";

export type CameraMode = "orbit" | "fly";
export type ScaleMode = ClockScale;
export type QualityPreset = "performance" | "balanced" | "ultra";

interface SimulationState {
  simDaysUi: number;
  speed: number;
  isPlaying: boolean;

  selectedId: string | null;
  focusRequestId: number;
  cameraMode: CameraMode;
  showOrbits: boolean;
  showLabels: boolean;
  scaleMode: ScaleMode;
  quality: QualityPreset;
  fps: number;

  // Finishing: audio
  audioEnabled: boolean;
  audioVolume: number;

  // Finishing: size compare
  compareMode: boolean;
  compareA: string;
  compareB: string;

  // Finishing: quality auto + capture
  autoQuality: boolean;
  qualityLocked: boolean;
  captureRequestId: number;
  hideHud: boolean;

  showOnboarding: boolean;
  showInfoPanel: boolean;
  searchQuery: string;
  showShortcuts: boolean;

  /** Index in guidedTour sequence for Prev/Next */
  tourStepIndex: number;
  /** When true, camera auto-advances through tour steps on a timer */
  tourAuto: boolean;

  setSimDaysUi: (days: number) => void;
  setSimDays: (days: number) => void;
  setSpeed: (speed: number) => void;
  togglePlay: () => void;
  setPlaying: (v: boolean) => void;
  selectBody: (id: string | null) => void;
  /**
   * Focus camera on a body.
   * - source "user" | "search": locks view, turns off Auto tour
   * - source "tour": used by Prev/Next/Auto navigation
   */
  focusBody: (id: string, source?: "user" | "tour" | "search") => void;
  setCameraMode: (mode: CameraMode) => void;
  toggleOrbits: () => void;
  toggleLabels: () => void;
  setScaleMode: (mode: ScaleMode) => void;
  setQuality: (q: QualityPreset, locked?: boolean) => void;
  setFps: (fps: number) => void;
  setAutoQuality: (v: boolean) => void;
  applyAutoQuality: (fps: number) => void;

  setAudioEnabled: (v: boolean) => void;
  toggleAudio: () => void;
  setAudioVolume: (v: number) => void;

  setCompareMode: (v: boolean) => void;
  toggleCompareMode: () => void;
  setCompareA: (id: string) => void;
  setCompareB: (id: string) => void;

  requestCapture: () => void;
  setHideHud: (v: boolean) => void;

  setShowOnboarding: (v: boolean) => void;
  setShowInfoPanel: (v: boolean) => void;
  setSearchQuery: (q: string) => void;
  setShowShortcuts: (v: boolean) => void;

  setTourAuto: (v: boolean) => void;
  toggleTourAuto: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  goToTourStep: (index: number) => void;
}

export const SPEED_PRESETS = [
  { label: "1×", value: 1 },
  { label: "100×", value: 100 },
  { label: "1k×", value: 1_000 },
  { label: "5k×", value: 5_000 },
  { label: "10k×", value: 10_000 },
  { label: "100k×", value: 100_000 },
  { label: "1M×", value: 1_000_000 },
] as const;

/** Default simulation rate — also the highlighted preset on load */
export const DEFAULT_SPEED = 5_000;

const QUALITY_ORDER: QualityPreset[] = [
  "performance",
  "balanced",
  "ultra",
];

let lowFpsAccum = 0;
let highFpsAccum = 0;

export const useSimulationStore = create<SimulationState>((set, get) => ({
  simDaysUi: 0,
  speed: DEFAULT_SPEED,
  isPlaying: true,

  selectedId: null,
  focusRequestId: 0,
  cameraMode: "orbit",
  showOrbits: true,
  showLabels: false,
  scaleMode: "visible",
  // Desktop default balanced; SolarApp overrides to performance on mobile
  quality: "balanced",
  fps: 0,

  audioEnabled: false,
  audioVolume: 0.85,

  compareMode: false,
  compareA: "earth",
  compareB: "jupiter",

  autoQuality: true,
  qualityLocked: false,
  captureRequestId: 0,
  hideHud: false,

  showOnboarding: true,
  showInfoPanel: true,
  searchQuery: "",
  showShortcuts: false,

  tourStepIndex: 0,
  tourAuto: false,

  setSimDaysUi: (days) => set({ simDaysUi: days }),

  setSimDays: (days) => {
    simClock.days = days;
    set({ simDaysUi: days });
  },

  setSpeed: (speed) => {
    simClock.speed = speed;
    set({ speed });
  },

  togglePlay: () => {
    const next = !get().isPlaying;
    simClock.playing = next;
    set({ isPlaying: next });
  },

  setPlaying: (v) => {
    simClock.playing = v;
    set({ isPlaying: v });
  },

  selectBody: (id) =>
    set({
      selectedId: id,
      showInfoPanel: id !== null,
      ...(id === null ? { tourAuto: false } : {}),
    }),

  focusBody: (id, source = "user") => {
    const idx = guidedTour.findIndex((s) => s.targetId === id);
    set((s) => ({
      selectedId: id,
      // Keep hide preference when Prev/Next/Auto navigates.
      // Only open panel on explicit pick (click / search / deep link).
      showInfoPanel:
        source === "tour" ? s.showInfoPanel : true,
      focusRequestId: s.focusRequestId + 1,
      // Manual pick locks view — stop Auto only
      tourAuto: source === "tour" ? s.tourAuto : false,
      // Keep nav index in sync when body is part of the sequence
      tourStepIndex: idx >= 0 ? idx : s.tourStepIndex,
    }));
  },

  setCameraMode: (mode) => set({ cameraMode: mode }),
  toggleOrbits: () => set((s) => ({ showOrbits: !s.showOrbits })),
  toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),

  setScaleMode: (mode) => {
    simClock.scaleMode = mode;
    set({ scaleMode: mode });
  },

  setQuality: (q, locked = true) =>
    set({
      quality: q,
      qualityLocked: locked,
      autoQuality: locked ? false : get().autoQuality,
    }),

  setFps: (fps) => set({ fps }),

  setAutoQuality: (v) => {
    lowFpsAccum = 0;
    highFpsAccum = 0;
    set({ autoQuality: v, qualityLocked: !v });
  },

  applyAutoQuality: (fps) => {
    const { autoQuality, qualityLocked, quality } = get();
    if (!autoQuality || qualityLocked) return;

    // Mobile: never auto-upgrade past balanced (8K textures thrash memory)
    const maxIdx = isMobileDevice() ? 1 : QUALITY_ORDER.length - 1;

    if (fps > 0 && fps < 40) {
      lowFpsAccum += 0.5;
      highFpsAccum = 0;
      if (lowFpsAccum >= 2) {
        lowFpsAccum = 0;
        const idx = QUALITY_ORDER.indexOf(quality);
        if (idx > 0) {
          set({ quality: QUALITY_ORDER[idx - 1] });
        }
      }
    } else if (fps > 110) {
      highFpsAccum += 0.5;
      lowFpsAccum = 0;
      if (highFpsAccum >= 4) {
        highFpsAccum = 0;
        const idx = QUALITY_ORDER.indexOf(quality);
        if (idx >= 0 && idx < maxIdx) {
          set({ quality: QUALITY_ORDER[idx + 1] });
        }
      }
    } else {
      lowFpsAccum = Math.max(0, lowFpsAccum - 0.25);
      highFpsAccum = Math.max(0, highFpsAccum - 0.25);
    }
  },

  setAudioEnabled: (v) => set({ audioEnabled: v }),
  toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
  setAudioVolume: (v) => set({ audioVolume: Math.min(1, Math.max(0, v)) }),

  setCompareMode: (v) => set({ compareMode: v }),
  toggleCompareMode: () => set((s) => ({ compareMode: !s.compareMode })),
  setCompareA: (id) => set({ compareA: id }),
  setCompareB: (id) => set({ compareB: id }),

  requestCapture: () =>
    set((s) => ({
      captureRequestId: s.captureRequestId + 1,
      hideHud: true,
    })),
  setHideHud: (v) => set({ hideHud: v }),

  setShowOnboarding: (v) => set({ showOnboarding: v }),
  setShowInfoPanel: (v) => set({ showInfoPanel: v }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setShowShortcuts: (v) => set({ showShortcuts: v }),

  setTourAuto: (v) => {
    set({ tourAuto: v, compareMode: false });
    if (v) {
      // Keep user's speed (default 5k×) — do not jump to unlisted 50k×
      simClock.playing = true;
      set({ isPlaying: true });
      const step = guidedTour[get().tourStepIndex] ?? guidedTour[0];
      if (step) {
        set({ tourStepIndex: guidedTour.indexOf(step) });
        get().focusBody(step.targetId, "tour");
      }
    }
  },

  toggleTourAuto: () => {
    get().setTourAuto(!get().tourAuto);
  },

  nextTourStep: () => {
    const { tourStepIndex, tourAuto } = get();
    const next = tourStepIndex + 1;
    if (next >= guidedTour.length) {
      if (tourAuto) {
        // Loop for auto mode
        set({ tourStepIndex: 0 });
        get().focusBody(guidedTour[0].targetId, "tour");
      }
      // Manual at end: stay put
      return;
    }
    const step = guidedTour[next];
    set({ tourStepIndex: next });
    get().focusBody(step.targetId, "tour");
  },

  prevTourStep: () => {
    const { tourStepIndex } = get();
    const prev = Math.max(0, tourStepIndex - 1);
    const step = guidedTour[prev];
    if (!step) return;
    // Keep Auto state — only manual planet click turns Auto off
    set({ tourStepIndex: prev });
    get().focusBody(step.targetId, "tour");
  },

  goToTourStep: (index) => {
    const step = guidedTour[index];
    if (!step) return;
    set({ tourStepIndex: index, compareMode: false });
    get().focusBody(step.targetId, "tour");
  },
}));
