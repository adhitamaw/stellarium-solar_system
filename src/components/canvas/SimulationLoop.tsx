"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { guidedTour } from "@/data/tours";
import { updateAllBodyPositions } from "@/lib/orbital";
import { daysSinceJ2000, simClock } from "@/lib/simClock";
import { useSimulationStore } from "@/store/useSimulationStore";

const UI_INTERVAL = 1 / 20;
const FPS_INTERVAL = 0.5;

export function SimulationLoop() {
  const uiAccum = useRef(0);
  const fpsAccum = useRef(0);
  const frames = useRef(0);
  const tourTimer = useRef(0);
  const lastTourStep = useRef(-1);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (simClock.realtime) {
      // Lock epoch to wall clock so orbits/rotation match "now"
      if (simClock.playing) {
        simClock.days = daysSinceJ2000();
      }
    } else if (simClock.playing) {
      simClock.days += (simClock.speed / 86_400) * dt;
    }

    updateAllBodyPositions();

    uiAccum.current += dt;
    if (uiAccum.current >= UI_INTERVAL) {
      uiAccum.current = 0;
      useSimulationStore.getState().setSimDaysUi(simClock.days);
    }

    frames.current += 1;
    fpsAccum.current += dt;
    if (fpsAccum.current >= FPS_INTERVAL) {
      const fps = Math.round(frames.current / fpsAccum.current);
      frames.current = 0;
      fpsAccum.current = 0;
      const store = useSimulationStore.getState();
      store.setFps(fps);
      store.applyAutoQuality(fps);
    }

    const { tourAuto, tourStepIndex, nextTourStep, compareMode } =
      useSimulationStore.getState();
    if (compareMode) return;

    // Auto advance only when Auto toggle is ON
    if (tourAuto) {
      if (lastTourStep.current !== tourStepIndex) {
        lastTourStep.current = tourStepIndex;
        tourTimer.current = 0;
      }
      const step = guidedTour[tourStepIndex];
      if (step) {
        tourTimer.current += dt;
        if (tourTimer.current >= step.durationSec) {
          tourTimer.current = 0;
          nextTourStep();
        }
      }
    } else {
      tourTimer.current = 0;
      lastTourStep.current = -1;
    }
  });

  return null;
}
