"use client";

import { useMemo } from "react";
import { makeIssMaterials, makePick } from "./materials";

/**
 * Higher-fidelity procedural ISS (silhouette of real station):
 * - Integrated Truss Structure (ITS) with lattice
 * - Pressurized stack: Zvezda–Zarya–Unity–Destiny + side labs
 * - 4× dual Solar Array Wings (8 blankets)
 * - Thermal radiators, Cupola, Canadarm-style boom
 *
 * No scene lights (point/spot) — would illuminate Earth. Self-glow = emissive only.
 * Local units: overall span ≈ 2.
 */
export function IssModel({
  scale = 1,
  selected = false,
  bodyId,
  onSelect,
}: {
  scale?: number;
  selected?: boolean;
  bodyId: string;
  onSelect: (id: string) => void;
}) {
  const mats = useMemo(() => makeIssMaterials(selected), [selected]);
  const pick = useMemo(() => makePick(bodyId, onSelect), [bodyId, onSelect]);

  // Real ISS: P6, P4, S4, S6 solar array positions along truss
  const arrayStations = [-0.82, -0.42, 0.42, 0.82];

  return (
    <group scale={scale}>
      {/* ═══════════ INTEGRATED TRUSS (long backbone) ═══════════ */}
      <mesh material={mats.truss} {...pick}>
        <boxGeometry args={[2.05, 0.048, 0.062]} />
      </mesh>
      {/* Top/bottom truss rails */}
      <mesh position={[0, 0.032, 0]} material={mats.truss} {...pick}>
        <boxGeometry args={[2.05, 0.012, 0.04]} />
      </mesh>
      <mesh position={[0, -0.032, 0]} material={mats.truss} {...pick}>
        <boxGeometry args={[2.05, 0.012, 0.04]} />
      </mesh>
      {/* Lattice X-braces along truss */}
      {Array.from({ length: 14 }, (_, i) => {
        const x = -0.95 + i * 0.145;
        return (
          <group key={`brace-${i}`} position={[x, 0, 0]}>
            <mesh rotation={[0, 0, 0.55]} material={mats.dark} {...pick}>
              <boxGeometry args={[0.008, 0.07, 0.008]} />
            </mesh>
            <mesh rotation={[0, 0, -0.55]} material={mats.dark} {...pick}>
              <boxGeometry args={[0.008, 0.07, 0.008]} />
            </mesh>
          </group>
        );
      })}
      {/* Segment joints (S0 / P1 / S1 style blocks) */}
      {[-0.9, -0.45, 0, 0.45, 0.9].map((x) => (
        <mesh key={`seg-${x}`} position={[x, 0, 0]} material={mats.dark} {...pick}>
          <boxGeometry args={[0.055, 0.085, 0.095]} />
        </mesh>
      ))}

      {/* ═══════════ CORE MODULE STACK (along +Z / −Z) ═══════════ */}
      {/* Unity Node 1 (center) */}
      <mesh position={[0, -0.05, 0.08]} material={mats.moduleWhite} {...pick}>
        <cylinderGeometry args={[0.078, 0.078, 0.12, 16]} />
      </mesh>
      {/* Destiny lab (+Z) */}
      <mesh
        position={[0, -0.05, 0.26]}
        rotation={[Math.PI / 2, 0, 0]}
        material={mats.module}
        {...pick}
      >
        <cylinderGeometry args={[0.068, 0.068, 0.26, 16]} />
      </mesh>
      {/* Destiny endcone / PMA */}
      <mesh
        position={[0, -0.05, 0.42]}
        rotation={[Math.PI / 2, 0, 0]}
        material={mats.moduleWhite}
        {...pick}
      >
        <cylinderGeometry args={[0.05, 0.065, 0.08, 12]} />
      </mesh>
      {/* Columbus (+Y side from Destiny) */}
      <mesh
        position={[0.16, -0.05, 0.26]}
        rotation={[0, 0, Math.PI / 2]}
        material={mats.module}
        {...pick}
      >
        <cylinderGeometry args={[0.055, 0.055, 0.2, 14]} />
      </mesh>
      {/* Kibo PM (−Y) */}
      <mesh
        position={[-0.18, -0.05, 0.28]}
        rotation={[0, 0, Math.PI / 2]}
        material={mats.moduleWhite}
        {...pick}
      >
        <cylinderGeometry args={[0.058, 0.058, 0.22, 14]} />
      </mesh>
      {/* Kibo EF (exposed facility) */}
      <mesh position={[-0.32, -0.05, 0.28]} material={mats.dark} {...pick}>
        <boxGeometry args={[0.08, 0.07, 0.1]} />
      </mesh>

      {/* Zarya (FGB) −Z */}
      <mesh
        position={[0, -0.05, -0.1]}
        rotation={[Math.PI / 2, 0, 0]}
        material={mats.module}
        {...pick}
      >
        <cylinderGeometry args={[0.062, 0.062, 0.2, 14]} />
      </mesh>
      {/* Zvezda service module */}
      <mesh
        position={[0, -0.05, -0.3]}
        rotation={[Math.PI / 2, 0, 0]}
        material={mats.module}
        {...pick}
      >
        <cylinderGeometry args={[0.058, 0.055, 0.22, 14]} />
      </mesh>
      {/* Zvezda aft / propulsion */}
      <mesh position={[0, -0.05, -0.45]} material={mats.dark} {...pick}>
        <sphereGeometry args={[0.048, 12, 10]} />
      </mesh>
      {/* Solar on Zvezda (small Russian arrays) */}
      {([-1, 1] as const).map((s) => (
        <mesh
          key={`zv-sol-${s}`}
          position={[s * 0.14, -0.05, -0.3]}
          rotation={[0, 0, s * 0.15]}
          material={mats.solar}
          {...pick}
        >
          <boxGeometry args={[0.14, 0.006, 0.1]} />
        </mesh>
      ))}

      {/* Tranquility Node 3 + Cupola (under Unity) */}
      <mesh
        position={[0, -0.14, 0.08]}
        rotation={[Math.PI / 2, 0, 0]}
        material={mats.moduleWhite}
        {...pick}
      >
        <cylinderGeometry args={[0.05, 0.05, 0.1, 12]} />
      </mesh>
      {/* Cupola dome */}
      <mesh position={[0, -0.2, 0.08]} material={mats.cupolaGlass} {...pick}>
        <sphereGeometry args={[0.042, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
      </mesh>
      <mesh position={[0, -0.175, 0.08]} material={mats.dark} {...pick}>
        <torusGeometry args={[0.04, 0.006, 6, 16]} />
      </mesh>

      {/* Quest airlock (+Y of Unity) */}
      <mesh
        position={[0.14, -0.05, 0.05]}
        rotation={[0, 0, Math.PI / 2]}
        material={mats.moduleWhite}
        {...pick}
      >
        <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
      </mesh>

      {/* ═══════════ RADIATORS (PVR / EATCS white panels) ═══════════ */}
      {[
        { x: -0.22, z: 0.18, ry: 0.2 },
        { x: 0.22, z: 0.18, ry: -0.2 },
        { x: -0.55, z: -0.02, ry: 0.05 },
        { x: 0.55, z: -0.02, ry: -0.05 },
      ].map((r, i) => (
        <mesh
          key={`rad-${i}`}
          position={[r.x, 0.06, r.z]}
          rotation={[0.35, r.ry, 0]}
          material={mats.radiator}
          {...pick}
        >
          <boxGeometry args={[0.28, 0.006, 0.32]} />
        </mesh>
      ))}

      {/* ═══════════ SOLAR ARRAY WINGS (4 stations × dual blankets) ═══════════ */}
      {arrayStations.map((x) => (
        <group key={`saw-${x}`} position={[x, 0, 0]}>
          {/* Beta gimbal */}
          <mesh material={mats.gold} {...pick}>
            <cylinderGeometry args={[0.032, 0.032, 0.05, 12]} />
          </mesh>
          <mesh material={mats.dark} {...pick}>
            <boxGeometry args={[0.06, 0.06, 0.06]} />
          </mesh>

          {([-1, 1] as const).map((side) => (
            <group key={`side-${side}`} position={[0, side * 0.08, 0]}>
              {/* Mast */}
              <mesh
                position={[0, side * 0.38, 0]}
                material={mats.solarFrame}
                {...pick}
              >
                <boxGeometry args={[0.018, 0.72, 0.014]} />
              </mesh>
              {/* Two blankets per wing (inboard / outboard) */}
              {[0.22, 0.55].map((dy, bi) => (
                <group key={`b-${bi}`} position={[0, side * dy, 0]}>
                  <mesh material={mats.solar} {...pick}>
                    <boxGeometry args={[0.34, 0.3, 0.005]} />
                  </mesh>
                  {/* Frame border */}
                  <mesh position={[0, 0, 0.004]} material={mats.solarFrame} {...pick}>
                    <boxGeometry args={[0.35, 0.01, 0.003]} />
                  </mesh>
                  <mesh position={[0, 0.145, 0.004]} material={mats.solarFrame} {...pick}>
                    <boxGeometry args={[0.35, 0.008, 0.003]} />
                  </mesh>
                  <mesh position={[0, -0.145, 0.004]} material={mats.solarFrame} {...pick}>
                    <boxGeometry args={[0.35, 0.008, 0.003]} />
                  </mesh>
                  {/* Cell grid lines */}
                  {[-0.1, 0, 0.1].map((gx) => (
                    <mesh
                      key={`g-${gx}`}
                      position={[gx, 0, 0.0035]}
                      material={mats.solarFrame}
                      {...pick}
                    >
                      <boxGeometry args={[0.003, 0.28, 0.001]} />
                    </mesh>
                  ))}
                  {[-0.08, 0.08].map((gy) => (
                    <mesh
                      key={`h-${gy}`}
                      position={[0, gy, 0.0035]}
                      material={mats.solarFrame}
                      {...pick}
                    >
                      <boxGeometry args={[0.32, 0.003, 0.001]} />
                    </mesh>
                  ))}
                </group>
              ))}
            </group>
          ))}
        </group>
      ))}

      {/* ═══════════ CANADARM2 (SSRMS) ═══════════ */}
      <group position={[0.08, 0.02, 0.15]} rotation={[0.2, 0.4, -0.3]}>
        <mesh material={mats.moduleWhite} {...pick}>
          <boxGeometry args={[0.04, 0.04, 0.04]} />
        </mesh>
        <mesh
          position={[0.12, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={mats.moduleWhite}
          {...pick}
        >
          <cylinderGeometry args={[0.012, 0.012, 0.24, 8]} />
        </mesh>
        <mesh position={[0.24, 0.02, 0]} material={mats.dark} {...pick}>
          <boxGeometry args={[0.03, 0.03, 0.03]} />
        </mesh>
        <mesh
          position={[0.32, 0.08, 0]}
          rotation={[0, 0, 0.6]}
          material={mats.moduleWhite}
          {...pick}
        >
          <cylinderGeometry args={[0.01, 0.01, 0.18, 8]} />
        </mesh>
        <mesh position={[0.38, 0.15, 0]} material={mats.gold} {...pick}>
          <boxGeometry args={[0.035, 0.025, 0.025]} />
        </mesh>
      </group>

      {/* Docking target / PMA ring accents */}
      <mesh
        position={[0, -0.05, 0.48]}
        rotation={[Math.PI / 2, 0, 0]}
        material={mats.gold}
        {...pick}
      >
        <torusGeometry args={[0.04, 0.006, 6, 16]} />
      </mesh>
    </group>
  );
}
