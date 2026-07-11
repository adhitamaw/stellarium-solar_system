import {
  type CelestialBody,
  VISUAL,
  bodyById,
  planets,
  moons,
  sun,
} from "@/data/celestialBodies";
import { bodyPositions, simClock, type ScaleMode } from "@/lib/simClock";

/** Convert simulation days since epoch to orbital angle (radians) */
export function meanAnomaly(body: CelestialBody, simDays: number): number {
  if (body.orbitalPeriodDays === 0) return 0;
  // Negative period = retrograde (e.g. Triton)
  const period = body.orbitalPeriodDays;
  const fraction = ((simDays / period) + body.phaseOffset) % 1;
  const f = fraction < 0 ? fraction + 1 : fraction;
  return f * Math.PI * 2;
}

/** Visual radius of a body in scene units */
export function visualRadius(
  body: CelestialBody,
  scaleMode: ScaleMode,
): number {
  if (body.type === "star") return VISUAL.sunRadius;

  const earthRef = 0.55;
  const earthKm = 6_371;
  let r = (body.radiusKm / earthKm) * earthRef;

  if (body.type === "moon") {
    // Tiny moons (Phobos/Deimos) stay visible without looking planet-sized
    if (body.radiusKm < 50) {
      r = Math.max(r * 2.8, 0.055);
    } else if (body.radiusKm < 400) {
      r = Math.max(r * 1.1, 0.07);
    } else {
      r = Math.max(r * 0.9, 0.09);
    }
  } else if (body.type === "planet") {
    if (body.radiusKm > 20_000) {
      r = Math.pow(body.radiusKm / earthKm, 0.55) * earthRef * 1.15;
    }
    r = Math.max(r, 0.2);
  }

  const mult =
    scaleMode === "visible"
      ? VISUAL.bodyScaleVisible
      : VISUAL.bodyScaleRealistic;
  return r * mult * (scaleMode === "realistic" ? 0.65 : 1.2);
}

/** Orbital radius in scene units for planets (AU-based) */
export function visualOrbitRadius(
  body: CelestialBody,
  scaleMode: ScaleMode,
): number {
  if (body.type === "star") return 0;
  if (body.type === "moon") {
    const parent = body.parentId ? bodyById[body.parentId] : undefined;
    const parentR = parent ? visualRadius(parent, scaleMode) : 1;
    const parentKm = parent?.radiusKm ?? 6_371;
    // Relative to parent radius (Phobos ~2.8 R_mars, Deimos ~6.9 R_mars)
    const realRatio = body.orbitRadius / parentKm;
    // Soft log spacing so close moons stay near parent but siblings separate
    const spaced =
      parentR *
      (1.25 + Math.pow(Math.max(realRatio, 0.5) / 8, 0.48) * 2.4);
    return Math.max(spaced, parentR * 1.4);
  }

  const au = body.orbitRadius;
  if (scaleMode === "visible") {
    return Math.pow(au, 0.62) * VISUAL.auScale * 0.85;
  }
  return Math.pow(au, 0.85) * VISUAL.auScale * 0.55;
}

/** Write cartesian coords into a plain object (zero GC pressure) */
export function writeBodyPosition(
  body: CelestialBody,
  simDays: number,
  scaleMode: ScaleMode,
  out: { x: number; y: number; z: number },
  parent?: { x: number; y: number; z: number },
) {
  if (body.type === "star") {
    out.x = 0;
    out.y = 0;
    out.z = 0;
    return out;
  }

  const angle = meanAnomaly(body, simDays);
  const r = visualOrbitRadius(body, scaleMode);
  const incl = (body.inclinationDeg * Math.PI) / 180;

  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  const y = Math.sin(angle) * Math.sin(incl) * r * 0.15;

  if (body.type === "moon" && parent) {
    out.x = parent.x + x;
    out.y = parent.y + y;
    out.z = parent.z + z;
  } else {
    out.x = x;
    out.y = y;
    out.z = z;
  }
  return out;
}

export function rotationAngle(body: CelestialBody, simDays: number): number {
  if (body.rotationPeriodHours === 0) return 0;
  const hours = simDays * 24;
  return (hours / body.rotationPeriodHours) * Math.PI * 2;
}

const _scratch = new Map<string, { x: number; y: number; z: number }>();

function scratch(id: string) {
  let s = _scratch.get(id);
  if (!s) {
    s = { x: 0, y: 0, z: 0 };
    _scratch.set(id, s);
  }
  return s;
}

/** Update global bodyPositions for all bodies — call once per frame */
export function updateAllBodyPositions() {
  const days = simClock.days;
  const scale = simClock.scaleMode;

  const sunPos = scratch(sun.id);
  writeBodyPosition(sun, days, scale, sunPos);
  bodyPositions.set(sun.id, sunPos);

  for (const p of planets) {
    const pos = scratch(p.id);
    writeBodyPosition(p, days, scale, pos);
    bodyPositions.set(p.id, pos);
  }

  for (const m of moons) {
    const parent = m.parentId ? bodyPositions.get(m.parentId) : undefined;
    const pos = scratch(m.id);
    writeBodyPosition(m, days, scale, pos, parent);
    bodyPositions.set(m.id, pos);
  }
}
