"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { CelestialBody } from "@/data/celestialBodies";
import { visualOrbitRadius } from "@/lib/orbital";
import type { ScaleMode } from "@/store/useSimulationStore";

interface OrbitLineProps {
  body: CelestialBody;
  scaleMode: ScaleMode;
  /** When set, orbit is drawn in parent-local space (group follows parent) */
  highlighted?: boolean;
}

export function OrbitLine({ body, scaleMode, highlighted }: OrbitLineProps) {
  const points = useMemo(() => {
    const r = visualOrbitRadius(body, scaleMode);
    const segments =
      body.type === "moon" ||
      (body.type === "spacecraft" && body.parentId)
        ? 64
        : 128;
    const incl = THREE.MathUtils.degToRad(body.inclinationDeg);
    const pts: [number, number, number][] = [];

    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      const y = Math.sin(a) * Math.sin(incl) * r * 0.15;
      pts.push([x, y, z]);
    }
    return pts;
  }, [body, scaleMode]);

  return (
    <Line
      points={points}
      color={highlighted ? "#7dd3fc" : "#ffffff"}
      transparent
      opacity={
        highlighted
          ? 0.55
          : body.type === "moon" || body.type === "spacecraft"
            ? 0.14
            : 0.18
      }
      lineWidth={1}
      depthWrite={false}
      raycast={() => null}
    />
  );
}
