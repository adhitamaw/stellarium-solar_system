"use client";

import { useEffect, useMemo, useState } from "react";
import { Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { bodyById, celestialBodies } from "@/data/celestialBodies";
import { bodyTextures } from "@/data/textures";
import { loadTexture } from "@/lib/textures";
import { useSimulationStore } from "@/store/useSimulationStore";
import { useLocaleStore, useT } from "@/store/useLocaleStore";
import { localizeBody } from "@/i18n/localize";
import { formatKmExact, formatNumber, formatRadius } from "@/i18n/format";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return mobile;
}

function CompareBody({
  id,
  position,
  displayRadius,
  compact,
}: {
  id: string;
  position: [number, number, number];
  displayRadius: number;
  compact?: boolean;
}) {
  const body = bodyById[id];
  const locale = useLocaleStore((s) => s.locale);
  const t = useT();
  const displayName = body ? localizeBody(body, locale).name : id;
  const texSet = bodyTextures[id];
  const [map, setMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const tex = await loadTexture(texSet?.mapPreview ?? texSet?.map, {
        srgb: true,
      });
      if (alive && tex) setMap(tex);
    })();
    return () => {
      alive = false;
    };
  }, [id, texSet]);

  if (!body) return null;

  const segs = compact ? 64 : 96;
  const isStar = body.type === "star";
  const labelY = displayRadius * (compact ? 1.28 : 1.35) + (compact ? 0.28 : 0.4);

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
          <ringGeometry args={[displayRadius * 1.4, displayRadius * 2.3, 64]} />
          <meshStandardMaterial
            color="#c8c4bc"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>
      )}
      {texSet?.atmosphere && (
        <mesh scale={1.015}>
          <sphereGeometry args={[displayRadius, 40, 40]} />
          <meshBasicMaterial
            color={texSet.atmosphere}
            transparent
            opacity={0.05}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}
      <Html position={[0, labelY, 0]} center>
        <div
          className="pointer-events-none border border-white/[0.12] bg-black/85 text-center backdrop-blur-md"
          style={{
            borderRadius: "var(--x-radius)",
            padding: compact ? "4px 8px" : "6px 12px",
            minWidth: compact ? 72 : 96,
          }}
        >
          <p
            className={`font-medium tracking-tight text-white ${
              compact ? "text-[11px]" : "text-[13px]"
            }`}
          >
            {displayName}
          </p>
          {!compact && (
            <>
              <p className="mt-0.5 font-mono text-[10px] tabular-nums text-white/45">
                {t("diameterApprox")} {formatRadius(body.radiusKm * 2, locale)}
              </p>
              <p className="mt-0.5 font-mono text-[10px] tabular-nums tracking-wide text-white/30">
                {t("radius")} {formatKmExact(body.radiusKm, locale)}
              </p>
            </>
          )}
          {compact && (
            <p className="mt-0.5 font-mono text-[9px] tabular-nums text-white/40">
              {formatKmExact(body.radiusKm, locale)}
            </p>
          )}
        </div>
      </Html>
    </group>
  );
}

/** Side-by-side true radius ratio comparison (F3) */
export function CompareScene() {
  const compareA = useSimulationStore((s) => s.compareA);
  const compareB = useSimulationStore((s) => s.compareB);
  const locale = useLocaleStore((s) => s.locale);
  const t = useT();
  const mobile = useIsMobile();

  const layout = useMemo(() => {
    const a = bodyById[compareA];
    const b = bodyById[compareB];
    if (!a || !b) return null;

    // Normalize so larger body is ~2.8 units radius (slightly smaller on mobile)
    const target = mobile ? 2.2 : 2.8;
    const maxKm = Math.max(a.radiusKm, b.radiusKm);
    const scale = target / maxKm;
    let rA = a.radiusKm * scale;
    let rB = b.radiusKm * scale;
    const CAP = mobile ? 2.6 : 3.2;
    if (rA > CAP || rB > CAP) {
      const m = Math.max(rA, rB);
      rA = (rA / m) * CAP;
      rB = (rB / m) * CAP;
    }
    const MIN = mobile ? 0.07 : 0.08;
    rA = Math.max(rA, MIN);
    rB = Math.max(rB, MIN);

    const gap = Math.max(rA, rB) * (mobile ? 0.7 : 0.55) + (mobile ? 0.55 : 0.8);
    const xA = -(rA + gap * 0.5);
    const xB = rB + gap * 0.5;
    const ratio = a.radiusKm / b.radiusKm;

    return { rA, rB, xA, xB, ratio, a, b };
  }, [compareA, compareB, mobile]);

  if (!layout) return null;

  const camZ = mobile ? 11 : 9;
  const camY = mobile ? 0.6 : 1.2;
  const ratioText =
    layout.ratio >= 1
      ? `${formatNumber(layout.ratio, locale, 2)} : 1`
      : `1 : ${formatNumber(1 / layout.ratio, locale, 2)}`;

  return (
    <group>
      <PerspectiveCamera
        makeDefault
        position={[0, camY, camZ]}
        fov={mobile ? 48 : 42}
      />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={mobile ? 3 : 2}
        maxDistance={40}
        target={[0, mobile ? -0.3 : 0, 0]}
        // Leave room for bottom sheet on phones
        enablePan={!mobile}
      />
      <ambientLight intensity={0.12} />
      <directionalLight position={[6, 4, 8]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[-4, -1, -2]} intensity={0.2} color="#aaaaaa" />
      <hemisphereLight args={["#1a1a1a", "#050505", 0.25]} />

      <CompareBody
        id={compareA}
        position={[layout.xA, 0, 0]}
        displayRadius={layout.rA}
        compact={mobile}
      />
      <CompareBody
        id={compareB}
        position={[layout.xB, 0, 0]}
        displayRadius={layout.rB}
        compact={mobile}
      />

      {/* Desktop ratio badge in-scene; mobile uses panel telemetry */}
      {!mobile && (
        <Html
          position={[0, -Math.max(layout.rA, layout.rB) - 1.1, 0]}
          center
        >
          <div
            className="pointer-events-none border border-white/[0.12] bg-black/80 px-4 py-1.5 text-center backdrop-blur-md"
            style={{ borderRadius: "var(--x-radius)" }}
          >
            <p className="x-label !text-[9px]">{t("radiusRatio")}</p>
            <p className="mt-0.5 font-mono text-[12px] tabular-nums tracking-wide text-white">
              {ratioText}
            </p>
            <p className="mt-0.5 text-[10px] text-white/35">
              {t("scientificScaleNote")}
            </p>
          </div>
        </Html>
      )}

      <gridHelper
        args={[20, 20, "#1a1a1a", "#0d0d0d"]}
        position={[0, mobile ? -2.8 : -3.5, 0]}
      />
    </group>
  );
}

/** Planets + all moons (searchable in compare dropdowns) */
export const compareBodyOptions = celestialBodies.filter(
  (b) => b.type === "planet" || b.type === "star" || b.type === "moon",
);
