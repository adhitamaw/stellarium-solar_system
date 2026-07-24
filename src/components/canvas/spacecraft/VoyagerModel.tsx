"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { makeVoyagerMaterials, makePick } from "./materials";

/**
 * Procedural Voyager 1/2 — proportions from NASA/JPL spacecraft description:
 * - 3.66–3.7 m white parabolic high-gain antenna on the +Z (Earth) axis
 * - Decagonal (10-bay) bus under the dish
 * - 3× MHW-RTG in tandem on a deployable boom (radial cooling fins)
 * - Long magnetometer boom opposite-ish the science boom
 * - Scan platform with camera / instrument boxes
 * - PRA/PWS “V” antennas + Golden Record plaque
 *
 * Local units: dish diameter ≈ 1.6, overall boom span ≈ 2.
 * No scene lights — materials use emissive only.
 *
 * Refs: science.nasa.gov/mission/voyager/spacecraft/, NSSDC 1977-084A
 */
export function VoyagerModel({
  scale = 1,
  selected = false,
  bodyId,
  variant = 1,
  onSelect,
}: {
  scale?: number;
  selected?: boolean;
  bodyId: string;
  variant?: 1 | 2;
  onSelect: (id: string) => void;
}) {
  // Slight material variance so V1 / V2 are distinguishable when both visible
  const dishTint = variant === 1 ? "#e8ecf0" : "#d8dee6";
  const busTint = variant === 1 ? "#9aa3ad" : "#8e97a1";

  const mats = useMemo(
    () => makeVoyagerMaterials(selected, dishTint, busTint),
    [selected, dishTint, busTint],
  );
  const pick = useMemo(() => makePick(bodyId, onSelect), [bodyId, onSelect]);

  /** Shallow Cassegrain-style parabola (real f ≈ 1.24 m, D = 3.66 m) */
  const dishGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const R = 0.8; // dish radius → diameter 1.6
    const depth = 0.16;
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      const r = t * R;
      // y from rim (0) to vertex (depth) — opens toward +Y after rotate
      const y = depth * (r / R) * (r / R);
      pts.push(new THREE.Vector2(r, y));
    }
    const g = new THREE.LatheGeometry(pts, 56);
    // Face +Y (HGA “forward / Earth”)
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);

  const dishBackGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const R = 0.78;
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      const r = t * R;
      const y = 0.05 * (r / R) * (r / R);
      pts.push(new THREE.Vector2(r, y));
    }
    const g = new THREE.LatheGeometry(pts, 40);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);

  // Small yaw offset so V1/V2 don’t stack identically in the sky
  const yaw = variant === 1 ? 0.18 : -0.22;

  return (
    <group scale={scale} rotation={[0.05, yaw, 0]}>
      {/* ═══════ HIGH-GAIN ANTENNA (dominant white dish) ═══════ */}
      <group position={[0, 0.42, 0]}>
        <mesh geometry={dishGeo} material={mats.dish} {...pick} />
        <mesh
          geometry={dishBackGeo}
          position={[0, -0.01, 0]}
          material={mats.dishBack}
          {...pick}
        />
        {/* Rim ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={mats.white} {...pick}>
          <torusGeometry args={[0.8, 0.012, 8, 56]} />
        </mesh>
        {/* Sparse radial ribs (structural, not clutter) */}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={`rib-${i}`}
              position={[Math.cos(a) * 0.4, -0.02, Math.sin(a) * 0.4]}
              rotation={[0.2, a, 0]}
              material={mats.white}
              {...pick}
            >
              <boxGeometry args={[0.005, 0.008, 0.78]} />
            </mesh>
          );
        })}
        {/* Feed / subreflector on tripod (Cassegrain) */}
        <mesh position={[0, 0.22, 0]} material={mats.white} {...pick}>
          <cylinderGeometry args={[0.035, 0.048, 0.06, 12]} />
        </mesh>
        <mesh position={[0, 0.28, 0]} material={mats.gold} {...pick}>
          <sphereGeometry args={[0.028, 12, 10]} />
        </mesh>
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((a) => (
          <mesh
            key={`strut-${a}`}
            position={[Math.cos(a) * 0.28, 0.08, Math.sin(a) * 0.28]}
            rotation={[0.55, a, 0]}
            material={mats.white}
            {...pick}
          >
            <cylinderGeometry args={[0.006, 0.006, 0.42, 6]} />
          </mesh>
        ))}
        {/* Mast dish → bus */}
        <mesh position={[0, -0.1, 0]} material={mats.black} {...pick}>
          <cylinderGeometry args={[0.045, 0.055, 0.16, 12]} />
        </mesh>
      </group>

      {/* ═══════ DECagonal BUS (10 electronics bays) ═══════ */}
      <group position={[0, 0.05, 0]}>
        <mesh material={mats.bus} {...pick}>
          <cylinderGeometry args={[0.22, 0.22, 0.28, 10]} />
        </mesh>
        {/* Bay face panels — alternate MLI gold / grey (iconic look) */}
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2 + Math.PI / 10;
          const gold = i % 2 === 0;
          return (
            <mesh
              key={`bay-${i}`}
              position={[Math.cos(a) * 0.225, 0, Math.sin(a) * 0.225]}
              rotation={[0, -a, 0]}
              material={gold ? mats.gold : mats.mli}
              {...pick}
            >
              <boxGeometry args={[0.125, 0.24, 0.014]} />
            </mesh>
          );
        })}
        {/* Bottom thruster / equipment skirt */}
        <mesh position={[0, -0.18, 0]} material={mats.black} {...pick}>
          <cylinderGeometry args={[0.2, 0.16, 0.08, 10]} />
        </mesh>
        {/* Bay equipment lumps */}
        {[0.4, 1.5, 2.8, 4.2].map((a, i) => (
          <mesh
            key={`lump-${i}`}
            position={[Math.cos(a) * 0.235, 0.04, Math.sin(a) * 0.235]}
            rotation={[0, -a, 0]}
            material={mats.black}
            {...pick}
          >
            <boxGeometry args={[0.07, 0.09, 0.035]} />
          </mesh>
        ))}
      </group>

      {/* ═══════ RTG BOOM — 3 generators tandem (real layout) ═══════ */}
      <group position={[-0.16, 0.02, 0.06]} rotation={[0, 0.35, -0.08]}>
        {/* Boom tube */}
        <mesh
          position={[-0.55, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={mats.white}
          {...pick}
        >
          <cylinderGeometry args={[0.01, 0.01, 1.05, 8]} />
        </mesh>
        {[0.22, 0.48, 0.74].map((d) => (
          <mesh key={`rt-j-${d}`} position={[-d, 0, 0]} material={mats.black} {...pick}>
            <boxGeometry args={[0.028, 0.028, 0.028]} />
          </mesh>
        ))}
        {/* 3 RTGs end-to-end along boom */}
        {[0.42, 0.68, 0.94].map((d, i) => (
          <group key={`rtg-${i}`} position={[-d, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh material={mats.rtg} {...pick}>
              <cylinderGeometry args={[0.05, 0.05, 0.12, 14]} />
            </mesh>
            {/* MHW-RTG style: ~6 large radial fin panels */}
            {Array.from({ length: 6 }, (_, f) => {
              const a = (f / 6) * Math.PI * 2;
              return (
                <mesh
                  key={f}
                  position={[Math.cos(a) * 0.062, 0, Math.sin(a) * 0.062]}
                  rotation={[0, -a, 0]}
                  material={mats.black}
                  {...pick}
                >
                  <boxGeometry args={[0.055, 0.1, 0.004]} />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>

      {/* ═══════ MAGNETOMETER BOOM (long thin, iconic silhouette) ═══════ */}
      <group position={[0.14, 0.08, -0.04]} rotation={[0, -0.15, 0.05]}>
        <mesh
          position={[0.85, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={mats.white}
          {...pick}
        >
          <cylinderGeometry args={[0.006, 0.006, 1.65, 6]} />
        </mesh>
        {[0.45, 0.95, 1.4].map((d) => (
          <mesh key={`mg-${d}`} position={[d, 0, 0]} material={mats.black} {...pick}>
            <boxGeometry args={[0.018, 0.018, 0.018]} />
          </mesh>
        ))}
        {/* MAG sensors */}
        <mesh position={[1.55, 0, 0]} material={mats.gold} {...pick}>
          <boxGeometry args={[0.04, 0.04, 0.04]} />
        </mesh>
        <mesh position={[1.15, 0, 0]} material={mats.black} {...pick}>
          <boxGeometry args={[0.03, 0.03, 0.03]} />
        </mesh>
      </group>

      {/* ═══════ SCIENCE / SCAN PLATFORM BOOM ═══════ */}
      <group position={[0.05, -0.02, -0.18]} rotation={[0.25, 0.1, 0]}>
        <mesh
          position={[0, 0, -0.32]}
          rotation={[Math.PI / 2, 0, 0]}
          material={mats.white}
          {...pick}
        >
          <cylinderGeometry args={[0.009, 0.009, 0.55, 6]} />
        </mesh>
        {/* Scan platform body */}
        <mesh position={[0, 0.02, -0.58]} material={mats.black} {...pick}>
          <boxGeometry args={[0.16, 0.12, 0.1]} />
        </mesh>
        {/* Narrow-angle camera tube */}
        <mesh
          position={[-0.04, 0.03, -0.68]}
          rotation={[Math.PI / 2, 0, 0]}
          material={mats.black}
          {...pick}
        >
          <cylinderGeometry args={[0.018, 0.022, 0.08, 10]} />
        </mesh>
        {/* Wide-angle / instruments */}
        <mesh position={[0.05, 0.05, -0.62]} material={mats.gold} {...pick}>
          <boxGeometry args={[0.05, 0.05, 0.05]} />
        </mesh>
        <mesh position={[0.02, -0.03, -0.64]} material={mats.white} {...pick}>
          <cylinderGeometry args={[0.02, 0.02, 0.06, 10]} />
        </mesh>
        <mesh position={[-0.05, -0.02, -0.6]} material={mats.mli} {...pick}>
          <boxGeometry args={[0.055, 0.04, 0.04]} />
        </mesh>
      </group>

      {/* ═══════ PRA / PWS V-ANTENNAS (long “rabbit ears”) ═══════ */}
      <group position={[0, 0.12, 0.12]}>
        <mesh
          position={[0.22, 0.35, 0.15]}
          rotation={[0.55, 0.35, 0.2]}
          material={mats.white}
          {...pick}
        >
          <cylinderGeometry args={[0.004, 0.004, 0.85, 5]} />
        </mesh>
        <mesh
          position={[-0.22, 0.35, 0.15]}
          rotation={[0.55, -0.35, -0.2]}
          material={mats.white}
          {...pick}
        >
          <cylinderGeometry args={[0.004, 0.004, 0.85, 5]} />
        </mesh>
      </group>

      {/* Low-gain antenna stub */}
      <mesh
        position={[0.12, 0.22, 0.08]}
        rotation={[0.4, 0.15, 0]}
        material={mats.white}
        {...pick}
      >
        <cylinderGeometry args={[0.005, 0.005, 0.28, 5]} />
      </mesh>

      {/* ═══════ GOLDEN RECORD (side of bus) ═══════ */}
      <mesh
        position={[0.18, 0.06, 0.16]}
        rotation={[0.15, -0.85, 0.1]}
        material={mats.gold}
        {...pick}
      >
        <cylinderGeometry args={[0.055, 0.055, 0.006, 28]} />
      </mesh>
      <mesh
        position={[0.185, 0.06, 0.165]}
        rotation={[0.15, -0.85, 0.1]}
        material={mats.mli}
        {...pick}
      >
        <cylinderGeometry args={[0.038, 0.038, 0.004, 20]} />
      </mesh>

      {/* Optical calibration target plate (flat rectangle under instrument boom) */}
      <mesh
        position={[0.08, -0.12, -0.28]}
        rotation={[0.3, 0.2, 0]}
        material={mats.white}
        {...pick}
      >
        <boxGeometry args={[0.1, 0.08, 0.006]} />
      </mesh>
    </group>
  );
}
