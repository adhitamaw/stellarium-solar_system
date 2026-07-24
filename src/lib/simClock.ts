/**
 * High-frequency simulation clock.
 * Mutated every rAF frame WITHOUT going through React/Zustand,
 * so the UI can stay at ~15–30 Hz while the scene runs at display refresh (incl. 240 Hz).
 */

export type ScaleMode = "visible" | "realistic";

/** J2000 epoch used for sim days → calendar (UTC noon, 2000-01-01) */
export const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0);

/** Days since J2000 for a wall-clock timestamp (default: now) */
export function daysSinceJ2000(ms: number = Date.now()): number {
  return (ms - J2000_MS) / 86_400_000;
}

interface SimClock {
  /** Days since display epoch (J2000-ish) */
  days: number;
  /** Multiplier of real-time (1 = wall-clock rate when not in realtime lock) */
  speed: number;
  playing: boolean;
  scaleMode: ScaleMode;
  /**
   * When true, `days` tracks the actual current date/time (wall clock).
   * Orbit & rotation then match "now" instead of an arbitrary scrubbed epoch.
   */
  realtime: boolean;
}

/**
 * Stable SSR defaults — do NOT call Date.now() here (hydration mismatch).
 * Realtime mode snaps to wall clock on the client (SimulationLoop / enableRealtime).
 */
export const simClock: SimClock = {
  days: 0,
  speed: 1,
  playing: true,
  scaleMode: "realistic",
  realtime: true,
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
