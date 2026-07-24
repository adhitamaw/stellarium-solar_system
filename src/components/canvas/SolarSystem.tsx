"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  celestialBodies,
  moons,
  planets,
  probes,
  satellites,
} from "@/data/celestialBodies";
import { bodyPositions } from "@/lib/simClock";
import { useSimulationStore } from "@/store/useSimulationStore";
import { BodyMesh } from "./BodyMesh";
import { OrbitLine } from "./OrbitLine";

function PlanetOrbits() {
  const showOrbits = useSimulationStore((s) => s.showOrbits);
  const scaleMode = useSimulationStore((s) => s.scaleMode);
  const selectedId = useSimulationStore((s) => s.selectedId);

  if (!showOrbits) return null;

  return (
    <>
      {planets.map((p) => (
        <OrbitLine
          key={`orbit-${p.id}`}
          body={p}
          scaleMode={scaleMode}
          highlighted={selectedId === p.id}
        />
      ))}
      {probes.map((p) => (
        <OrbitLine
          key={`orbit-${p.id}`}
          body={p}
          scaleMode={scaleMode}
          highlighted={selectedId === p.id}
        />
      ))}
    </>
  );
}

function MoonOrbits() {
  const showOrbits = useSimulationStore((s) => s.showOrbits);
  const scaleMode = useSimulationStore((s) => s.scaleMode);
  const selectedId = useSimulationStore((s) => s.selectedId);
  const groups = useRef<Map<string, THREE.Group>>(new Map());

  const bound = useMemo(() => [...moons, ...satellites], []);

  useFrame(() => {
    for (const m of bound) {
      if (!m.parentId) continue;
      const g = groups.current.get(m.id);
      const parent = bodyPositions.get(m.parentId);
      if (g && parent) g.position.set(parent.x, parent.y, parent.z);
    }
  });

  if (!showOrbits) return null;

  // Show moon / satellite orbits when that body or its parent is focused
  const visible = bound.filter(
    (m) => selectedId === m.id || selectedId === m.parentId,
  );

  return (
    <>
      {visible.map((m) => (
        <group
          key={`morbit-${m.id}-${scaleMode}`}
          ref={(g) => {
            if (g) groups.current.set(m.id, g);
            else groups.current.delete(m.id);
          }}
        >
          <OrbitLine
            body={m}
            scaleMode={scaleMode}
            highlighted={selectedId === m.id}
          />
        </group>
      ))}
    </>
  );
}

export function SolarSystem() {
  useMemo(() => {
    for (const b of celestialBodies) {
      if (!bodyPositions.has(b.id)) {
        bodyPositions.set(b.id, { x: 0, y: 0, z: 0 });
      }
    }
  }, []);

  return (
    <group>
      {/* Very low fill — planets are lit almost only by the Sun (realistic) */}
      <ambientLight intensity={0.018} />
      <hemisphereLight args={["#0a1020", "#020208", 0.06]} />

      <PlanetOrbits />
      <MoonOrbits />

      {celestialBodies.map((body) => (
        <BodyMesh key={body.id} body={body} />
      ))}
    </group>
  );
}
