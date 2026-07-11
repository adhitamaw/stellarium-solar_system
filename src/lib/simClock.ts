/**
 * High-frequency simulation clock.
 * Mutated every rAF frame WITHOUT going through React/Zustand,
 * so the UI can stay at ~15–30 Hz while the scene runs at display refresh (incl. 240 Hz).
 */

export type ScaleMode = "visible" | "realistic";

interface SimClock {
  /** Days since display epoch (J2000-ish) */
  days: number;
  /** Multiplier of real-time (1 = real-time) */
  speed: number;
  playing: boolean;
  scaleMode: ScaleMode;
}

/** Keep in sync with DEFAULT_SPEED in useSimulationStore (5k×) */
export const simClock: SimClock = {
  days: 0,
  speed: 5_000,
  playing: true,
  scaleMode: "visible",
};

/** Reusable world positions — written every frame, read by meshes/camera */
export const bodyPositions = new Map<string, { x: number; y: number; z: number }>();

export function getBodyPos(
  id: string,
  out: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
) {
  const p = bodyPositions.get(id);
  if (p) {
    out.x = p.x;
    out.y = p.y;
    out.z = p.z;
  }
  return out;
}

/** Throttled UI sync listeners (not every frame) */
type UiListener = (days: number) => void;
const uiListeners = new Set<UiListener>();

export function subscribeSimUi(fn: UiListener) {
  uiListeners.add(fn);
  return () => {
    uiListeners.delete(fn);
  };
}

export function notifySimUi(days: number) {
  for (const fn of uiListeners) fn(days);
}
