"use client";

import { useEffect, useMemo, useState } from "react";
import { Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { bodyById, celestialBodies, formatRadius } from "@/data/celestialBodies";
import { bodyTextures } from "@/data/textures";
import { loadTexture } from "@/lib/textures";
import { useSimulationStore } from "@/store/useSimulationStore";

function CompareBody({
  id,
  position,
  displayRadius,
}: {
  id: string;
  position: [number, number, number];
  displayRadius: number;
}) {
  const body = bodyById[id];
  const texSet = bodyTextures[id];
  const [map, setMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const t = await loadTexture(texSet?.mapPreview ?? texSet?.map, {
        srgb: true,
      });
      if (alive && t) setMap(t);
    })();
    return () => {
      alive = false;
    };
  }, [id, texSet]);

  if (!body) return null;

  const segs = 96;
  const isStar = body.type === "star";

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[displayRadius, segs, segs]} />
        {isStar ? (
          <meshBasicMaterial
            map={map ?? undefined}
            color={map ? "#ffffff" : body.color}
            toneMapped={false}
          />
        ) : (
          <meshStandardMaterial
            map={map ?? undefined}
            color={map ? "#ffffff" : body.color}
            roughness={0.75}
            metalness={0.05}
          />
        )}
      </mesh>
      {body.hasRings && (
        <mesh rotation={[Math.PI / 2.15, 0, 0]}>
          <ringGeometry args={[displayRadius * 1.4, displayRadius * 2.3, 96]} />
          <meshStandardMaterial
            color="#d4c4a0"
            transparent
            opacity={0.75}
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>
      )}
      {texSet?.atmosphere && (
        <mesh scale={1.015}>
          <sphereGeometry args={[displayRadius, 48, 48]} />
          <meshBasicMaterial
            color={texSet.atmosphere}
            transparent
            opacity={0.05}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}
      <Html position={[0, displayRadius * 1.35 + 0.4, 0]} center>
        <div className="pointer-events-none whitespace-nowrap rounded-xl border border-white/15 bg-black/70 px-3 py-1.5 text-center backdrop-blur-md">
          <p className="text-sm font-semibold text-white">{body.name}</p>
          <p className="text-[11px] text-white/55">
            Ø ≈ {formatRadius(body.radiusKm * 2)}
          </p>
          <p className="text-[10px] text-sky-300/80">
            radius {body.radiusKm.toLocaleString("id-ID")} km
          </p>
        </div>
      </Html>
    </group>
  );
}

/** Side-by-side true radius ratio comparison (F3) */
export function CompareScene() {
  const compareA = useSimulationStore((s) => s.compareA);
  const compareB = useSimulationStore((s) => s.compareB);

  const layout = useMemo(() => {
    const a = bodyById[compareA];
    const b = bodyById[compareB];
    if (!a || !b) return null;

    // Normalize so larger body is ~2.8 units radius
    const maxKm = Math.max(a.radiusKm, b.radiusKm);
    const scale = 2.8 / maxKm;
    let rA = a.radiusKm * scale;
    let rB = b.radiusKm * scale;
    // Sun is huge — cap so comparison stays readable
    const CAP = 3.2;
    if (rA > CAP || rB > CAP) {
      const m = Math.max(rA, rB);
      rA = (rA / m) * CAP;
      rB = (rB / m) * CAP;
    }
    // Minimum visible size for tiny bodies next to giants
    const MIN = 0.08;
    rA = Math.max(rA, MIN);
    rB = Math.max(rB, MIN);

    const gap = Math.max(rA, rB) * 0.55 + 0.8;
    const xA = -(rA + gap * 0.5);
    const xB = rB + gap * 0.5;
    const ratio = a.radiusKm / b.radiusKm;

    return { rA, rB, xA, xB, ratio, a, b };
  }, [compareA, compareB]);

  if (!layout) return null;

  // Soft key light for comparison stage
  return (
    <group>
      <PerspectiveCamera makeDefault position={[0, 1.2, 9]} fov={42} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={2}
        maxDistance={40}
        target={[0, 0, 0]}
      />
      <ambientLight intensity={0.15} />
      <directionalLight position={[6, 4, 8]} intensity={2.2} color="#fff5e0" />
      <directionalLight position={[-4, -1, -2]} intensity={0.25} color="#88aaff" />
      <hemisphereLight args={["#1a2030", "#050508", 0.3]} />

      <CompareBody
        id={compareA}
        position={[layout.xA, 0, 0]}
        displayRadius={layout.rA}
      />
      <CompareBody
        id={compareB}
        position={[layout.xB, 0, 0]}
        displayRadius={layout.rB}
      />

      <Html position={[0, -Math.max(layout.rA, layout.rB) - 1.1, 0]} center>
        <div className="pointer-events-none rounded-full border border-white/10 bg-black/60 px-4 py-1.5 text-center text-[11px] text-white/70 backdrop-blur-md">
          Rasio radius{" "}
          <span className="font-mono text-sky-200">
            {layout.ratio >= 1
              ? `${layout.ratio.toFixed(2)} : 1`
              : `1 : ${(1 / layout.ratio).toFixed(2)}`}
          </span>{" "}
          · skala ilmiah (bukan orbit visual)
        </div>
      </Html>

      {/* floor reference grid subtle */}
      <gridHelper args={[20, 20, "#1a2744", "#0d1424"]} position={[0, -3.5, 0]} />
    </group>
  );
}

/** Planets + all moons (searchable in compare dropdowns) */
export const compareBodyOptions = celestialBodies.filter(
  (b) => b.type === "planet" || b.type === "star" || b.type === "moon",
);
