"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { CelestialBody } from "@/data/celestialBodies";
import { visualRadius } from "@/lib/orbital";
import { bodyPositions, simClock } from "@/lib/simClock";
import { useSimulationStore } from "@/store/useSimulationStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useLocaleStore } from "@/store/useLocaleStore";
import { localizeBody } from "@/i18n/localize";
import { IssModel } from "./IssModel";
import { VoyagerModel } from "./VoyagerModel";

interface SpacecraftBodyProps {
  body: CelestialBody;
}

/**
 * Dedicated renderer for craft: procedural models scaled to visualRadius.
 * Keeps planet sphere pipeline out of ISS / Voyager.
 */
export function SpacecraftBody({ body }: SpacecraftBodyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const selectedId = useSimulationStore((s) => s.selectedId);
  const showLabels = useSimulationStore((s) => s.showLabels);
  const scaleMode = useSimulationStore((s) => s.scaleMode);
  const focusBody = useSimulationStore((s) => s.focusBody);
  const locale = useLocaleStore((s) => s.locale);
  const displayName = localizeBody(body, locale).name;

  const selected = selectedId === body.id;
  const radius = visualRadius(body, scaleMode);
  // Model local span ≈ 2 → scale so half-span ≈ radius (camera framing still works)
  const modelScale = radius * (body.id === "iss" ? 1.0 : 1.15);

  useEffect(() => {
    useLoadingStore
      .getState()
      .bump(0.2, `Model ${displayName}`);
  }, [displayName]);

  useFrame(() => {
    const pos = bodyPositions.get(body.id);
    if (groupRef.current && pos) {
      groupRef.current.position.set(pos.x, pos.y, pos.z);
    }
    // Slow attitude motion so arrays / dish catch light (not planet spin rate)
    if (groupRef.current) {
      const t = simClock.days * 0.35;
      if (body.id === "iss") {
        // Keep truss mostly tangent to orbit; avoid pitching arrays into Earth
        groupRef.current.rotation.y = t * 0.35;
        groupRef.current.rotation.x = 0.04;
        groupRef.current.rotation.z = 0.08;
      } else {
        // HGA roughly "up"; gentle yaw (Earth-pointing is cinematic, not exact)
        groupRef.current.rotation.y = t * 0.12;
        groupRef.current.rotation.x = 0.15;
      }
    }
  });

  const onSelect = (id: string) => focusBody(id, "user");

  const labelY = radius * 2.1 + 0.15;

  return (
    <group ref={groupRef}>
      {body.id === "iss" && (
        <IssModel
          scale={modelScale}
          selected={selected}
          bodyId={body.id}
          onSelect={onSelect}
        />
      )}
      {(body.id === "voyager1" || body.id === "voyager2") && (
        <VoyagerModel
          scale={modelScale}
          selected={selected}
          bodyId={body.id}
          variant={body.id === "voyager1" ? 1 : 2}
          onSelect={onSelect}
        />
      )}

      {/* Fallback for future craft without a dedicated model */}
      {body.id !== "iss" &&
        body.id !== "voyager1" &&
        body.id !== "voyager2" && (
          <mesh
            userData={{ bodyId: body.id }}
            onClick={(e) => {
              e.stopPropagation();
              if (e.delta > 5) return;
              onSelect(body.id);
            }}
          >
            <boxGeometry args={[radius * 1.2, radius * 0.4, radius * 0.6]} />
            <meshStandardMaterial
              color={body.color}
              metalness={0.6}
              roughness={0.35}
            />
          </mesh>
        )}

      {/* Invisible pick sphere — easier click target from far away */}
      <mesh
        userData={{ bodyId: body.id }}
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta > 5) return;
          const nearest = e.intersections.find(
            (hit) => hit.object.userData?.bodyId,
          );
          if (!nearest || nearest.object.userData.bodyId !== body.id) return;
          onSelect(body.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[radius * 1.6, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {showLabels &&
        (!body.parentId || selected || selectedId === body.parentId) && (
          <Html
            position={[0, labelY, 0]}
            center
            distanceFactor={26}
            style={{ pointerEvents: "none", userSelect: "none" }}
            zIndexRange={[0, 0]}
          >
            <div
              className={`whitespace-nowrap border px-2 py-0.5 text-[10px] font-medium tracking-wide backdrop-blur-sm ${
                selected
                  ? "border-white/40 bg-white text-black"
                  : "border-white/15 bg-black/70 text-white/75"
              }`}
            >
              {displayName}
            </div>
          </Html>
        )}
    </group>
  );
}
