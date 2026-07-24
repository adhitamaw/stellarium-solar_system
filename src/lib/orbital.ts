import {
  type CelestialBody,
  VISUAL,
  bodyById,
  planets,
  moons,
  probes,
  satellites,
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

/** True if body is bound to a parent (moons, ISS, …) */
function isParentBound(body: CelestialBody): boolean {
  return (
    body.type === "moon" ||
    (body.type === "spacecraft" && !!body.parentId)
  );
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

  if (body.type === "spacecraft") {
    // Physical craft are meters-scale — slightly exaggerated for readability
    // ISS must stay small vs Earth so LEO orbit doesn't clip the surface
    r = body.parentId
      ? 0.048 // ISS (truss span ~109 m; visual marker only)
      : 0.16; // Voyager dish + boom silhouette
  } else if (body.type === "moon") {
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
  if (isParentBound(body)) {
    const parent = body.parentId ? bodyById[body.parentId] : undefined;
    const parentR = parent ? visualRadius(parent, scaleMode) : 1;
    const parentKm = parent?.radiusKm ?? 6_371;
    // Relative to parent radius (Phobos ~2.8 R_mars, Deimos ~6.9 R_mars)
    const realRatio = body.orbitRadius / parentKm;
    // Soft log spacing so close moons stay near parent but siblings separate
    // LEO craft (ISS ~420 km ≈ 1.066 R⊕): real altitude is tiny vs planet size.
    // Visually we keep it near Earth but outside the mesh + atmosphere (~1.02 R)
    // and outside the exaggerated craft half-span so solar arrays never clip.
    if (body.type === "spacecraft" && realRatio < 2.5) {
      const craftR = visualRadius(body, scaleMode);
      // modelScale ≈ craftR * 1.15, local half-span ≈ 1 → world half-span ≈ craftR
      const halfSpan = craftR * 1.2;
      // Atmosphere shell ~1.02–1.04 parentR; leave clear air above that + craft
      const minOrbit = parentR * 1.08 + halfSpan * 2.8;
      return Math.max(minOrbit, parentR + 0.22);
    }
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
  // Deep-space probes: steeper inclination tilt so paths leave the ecliptic plane
  const inclAmp = body.type === "spacecraft" && !body.parentId ? 0.35 : 0.15;

  const x = Math.cos(angle) * r;
  const z = Math.sin(angle) * r;
  const y = Math.sin(angle) * Math.sin(incl) * r * inclAmp;

  if (isParentBound(body) && parent) {
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

  for (const s of satellites) {
    const parent = s.parentId ? bodyPositions.get(s.parentId) : undefined;
    const pos = scratch(s.id);
    writeBodyPosition(s, days, scale, pos, parent);
    bodyPositions.set(s.id, pos);
  }

  for (const p of probes) {
    const pos = scratch(p.id);
    writeBodyPosition(p, days, scale, pos);
    bodyPositions.set(p.id, pos);
  }
}
