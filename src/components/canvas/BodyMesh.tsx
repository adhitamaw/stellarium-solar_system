"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { CelestialBody } from "@/data/celestialBodies";
import { bodyTextures } from "@/data/textures";
import { rotationAngle, visualRadius } from "@/lib/orbital";
import { bodyPositions, simClock } from "@/lib/simClock";
import { lightDirFromSunTo } from "@/lib/sunDirection";
import {
  createPlanetGeometry,
  fixRingUVs,
  loadMapProgressive,
  resolveTextureUrl,
  loadTexture,
} from "@/lib/textures";
import {
  createAtmosphereMaterial,
  createInnerAtmosphereMaterial,
  createSunCoronaMaterial,
} from "@/shaders/atmosphere";
import {
  createPlanetMaterial,
  createRingMaterial,
  createSunMaterial,
} from "@/shaders/planet";
import { useSimulationStore } from "@/store/useSimulationStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useLocaleStore, t as translate } from "@/store/useLocaleStore";
import { localizeBody } from "@/i18n/localize";

interface BodyMeshProps {
  body: CelestialBody;
}

const _light = new THREE.Vector3();
const TEXTURE_ANISO_SAFE = 16;

const noRaycast = () => {
  /* decorative meshes must not steal picks */
};

export function BodyMesh({ body }: BodyMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  const { gl, camera } = useThree();
  const selectedId = useSimulationStore((s) => s.selectedId);
  const showLabels = useSimulationStore((s) => s.showLabels);
  const scaleMode = useSimulationStore((s) => s.scaleMode);
  const quality = useSimulationStore((s) => s.quality);
  const focusBody = useSimulationStore((s) => s.focusBody);
  const locale = useLocaleStore((s) => s.locale);
  const displayName = localizeBody(body, locale).name;

  const selected = selectedId === body.id;
  const radius = visualRadius(body, scaleMode);
  const tilt = (body.axialTiltDeg * Math.PI) / 180;
  const texSet = bodyTextures[body.id] ?? { color: body.color };
  const isStar = body.type === "star";

  const segs = useMemo(() => {
    const base =
      quality === "performance"
        ? isStar
          ? 48
          : body.type === "planet"
            ? 80
            : 40
        : quality === "balanced"
          ? isStar
            ? 80
            : body.type === "planet"
              ? 112
              : 56
          : isStar
            ? 112
            : body.type === "planet"
              ? 144
              : 72;
    // More mesh detail when focused (close-up)
    if (selected) return Math.min(base + 40, 180);
    return base;
  }, [quality, selected, body.type, isStar]);

  const geometry = useMemo(() => {
    const g = createPlanetGeometry(radius, segs);
    return g;
  }, [radius, segs]);

  const cloudGeometry = useMemo(
    () => new THREE.SphereGeometry(radius * 1.008, segs, segs),
    [radius, segs],
  );

  const atmosGeometry = useMemo(
    () =>
      new THREE.SphereGeometry(
        radius,
        Math.max(32, Math.floor(segs / 2)),
        Math.max(32, Math.floor(segs / 2)),
      ),
    [radius, segs],
  );

  const planetMat = useMemo(() => {
    if (isStar) return null;
    const mat = createPlanetMaterial();
    mat.uniforms.uTint.value = new THREE.Color(texSet.color ?? "#ffffff");
    mat.uniforms.uSpecularStrength.value = texSet.specularStrength ?? 0;
    mat.uniforms.uCloudOpacity.value = texSet.cloudOpacity ?? 0.55;
    mat.uniforms.uNightBoost.value = texSet.nightBoost ?? 1.6;
    mat.uniforms.uRoughness.value = texSet.roughness ?? 0.7;
    mat.uniforms.uDetailStrength.value = texSet.detailStrength ?? 0.35;
    if (texSet.gasGiant) {
      mat.uniforms.uRoughness.value = Math.max(
        mat.uniforms.uRoughness.value as number,
        0.7,
      );
      mat.uniforms.uSunIntensity.value = 1.4;
      mat.uniforms.uDetailStrength.value = texSet.detailStrength ?? 0.2;
    }
    if (body.id === "saturn") {
      mat.uniforms.uRingShadow.value = 1;
      mat.uniforms.uRingInner.value = 1.35;
      mat.uniforms.uRingOuter.value = 2.35;
    }
    return mat;
  }, [isStar, texSet, body.id]);

  const meshScale = texSet.irregularScale ?? ([1, 1, 1] as [number, number, number]);

  const sunMat = useMemo(
    () => (isStar ? createSunMaterial(null) : null),
    [isStar],
  );

  const atmosMat = useMemo(() => {
    if (!texSet.atmosphere) return null;
    // Earth gets slightly richer limb; gas giants stay whisper-thin
    const isEarth = body.id === "earth";
    const isGiant = !!texSet.gasGiant;
    return createAtmosphereMaterial({
      color: texSet.atmosphere,
      intensity: texSet.atmosphereIntensity ?? 0.25,
      rimPower: isEarth ? 5.4 : isGiant ? 6.2 : 5.0,
      scatter: isEarth ? 0.28 : isGiant ? 0.12 : 0.18,
    });
  }, [texSet.atmosphere, texSet.atmosphereIntensity, texSet.gasGiant, body.id]);

  const atmosInnerMat = useMemo(() => {
    // Only Earth/Venus/Titan need a faint front haze when very close
    if (!texSet.atmosphere) return null;
    if (!["earth", "venus", "titan"].includes(body.id)) return null;
    return createInnerAtmosphereMaterial({
      color: texSet.atmosphere,
      intensity: (texSet.atmosphereIntensity ?? 0.25) * 0.22,
    });
  }, [texSet.atmosphere, texSet.atmosphereIntensity, body.id]);

  const ringMat = useMemo(
    () => (body.hasRings ? createRingMaterial(null) : null),
    [body.hasRings],
  );

  // Soft solar chromosphere + outer corona (scientific envelope, subtle)
  const sunChromoMat = useMemo(
    () => (isStar ? createSunCoronaMaterial({ layer: 0 }) : null),
    [isStar],
  );
  const sunCoronaMat = useMemo(
    () => (isStar ? createSunCoronaMaterial({ layer: 1 }) : null),
    [isStar],
  );

  const [cloudMap, setCloudMap] = useState<THREE.Texture | null>(null);
  const [texturesReady, setTexturesReady] = useState(0);

  useEffect(() => {
    return () => {
      geometry.dispose();
      cloudGeometry.dispose();
      atmosGeometry.dispose();
    };
  }, [geometry, cloudGeometry, atmosGeometry]);

  useEffect(() => {
    let alive = true;
    const lowResOnly = quality === "performance";
    const maxAniso = lowResOnly
      ? 1
      : Math.min(TEXTURE_ANISO_SAFE, gl.capabilities.getMaxAnisotropy());
    const aniso = (tex: THREE.Texture) => {
      tex.anisotropy = maxAniso;
      return tex;
    };

    (async () => {
      const bumpLoad = () => {
        const w =
          body.type === "star" || body.type === "planet" ? 3.2 : 0.6;
        const name = localizeBody(body, useLocaleStore.getState().locale).name;
        const label = translate("loadingBody").replace("{name}", name);
        useLoadingStore.getState().bump(w, label);
      };

      if (isStar && sunMat) {
        await loadMapProgressive(
          texSet.map,
          texSet.mapPreview,
          (tex) => {
            if (!alive) return;
            aniso(tex);
            sunMat.uniforms.uMap.value = tex;
            sunMat.uniforms.uHasMap.value = 1;
            setTexturesReady((n) => n + 1);
          },
          { lowResOnly },
        );
        if (alive) bumpLoad();
        return;
      }

      if (!planetMat) return;

      await loadMapProgressive(
        texSet.map,
        texSet.mapPreview,
        (tex) => {
          if (!alive) return;
          aniso(tex);
          planetMat.uniforms.uDayMap.value = tex;
          planetMat.uniforms.uHasDay.value = 1;
          setTexturesReady((n) => n + 1);
        },
        { lowResOnly },
      );
      if (alive) bumpLoad();

      if (texSet.night) {
        const nightUrl = resolveTextureUrl(texSet.night, lowResOnly);
        let night = await loadTexture(nightUrl);
        if (!night && texSet.night !== nightUrl) {
          night = await loadTexture(texSet.night);
        }
        if (alive && night) {
          aniso(night);
          planetMat.uniforms.uNightMap.value = night;
          planetMat.uniforms.uHasNight.value = 1;
          setTexturesReady((n) => n + 1);
        }
      }

      if (texSet.clouds) {
        const cloudUrl = resolveTextureUrl(texSet.clouds, lowResOnly);
        let clouds = await loadTexture(cloudUrl);
        if (!clouds && texSet.clouds !== cloudUrl) {
          clouds = await loadTexture(texSet.clouds);
        }
        if (alive && clouds) {
          aniso(clouds);
          if (
            body.id === "earth" ||
            body.id === "venus" ||
            body.id === "titan"
          ) {
            planetMat.uniforms.uCloudMap.value = clouds;
            planetMat.uniforms.uHasClouds.value = 1;
            planetMat.uniforms.uCloudOpacity.value =
              body.id === "earth" ? 0.28 : 0.45;
            setCloudMap(clouds);
          } else {
            planetMat.uniforms.uCloudMap.value = clouds;
            planetMat.uniforms.uHasClouds.value = 1;
          }
          setTexturesReady((n) => n + 1);
        }
      }

      // Specular + normal: skip on performance (mobile default)
      if (texSet.specular && !lowResOnly) {
        const spec = await loadTexture(texSet.specular, { srgb: false });
        if (alive && spec) {
          aniso(spec);
          planetMat.uniforms.uSpecularMap.value = spec;
          planetMat.uniforms.uHasSpecular.value = 1;
          planetMat.uniforms.uSpecularStrength.value =
            texSet.specularStrength ?? 1;
          setTexturesReady((n) => n + 1);
        }
      }

      if (texSet.normal && !lowResOnly) {
        const nrmUrl = resolveTextureUrl(texSet.normal, false);
        let nrm = await loadTexture(nrmUrl, { normal: true });
        if (!nrm) {
          nrm = await loadTexture("/textures/2k_earth_normal_map.png", {
            normal: true,
          });
        }
        if (alive && nrm) {
          aniso(nrm);
          planetMat.uniforms.uNormalMap.value = nrm;
          planetMat.uniforms.uHasNormal.value = 1;
          setTexturesReady((n) => n + 1);
        }
      }

      if (texSet.rings && ringMat) {
        const rings = await loadTexture(texSet.rings);
        if (alive && rings) {
          aniso(rings);
          ringMat.uniforms.uMap.value = rings;
          ringMat.uniforms.uHasMap.value = 1;
          setTexturesReady((n) => n + 1);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [
    body,
    isStar,
    gl,
    quality,
    planetMat,
    sunMat,
    ringMat,
    texSet,
  ]);

  const ringInner = radius * 1.35;
  const ringOuter = radius * 2.4;
  const ringGeo = useMemo(() => {
    if (!body.hasRings) return null;
    const g = new THREE.RingGeometry(
      ringInner,
      ringOuter,
      quality === "performance" ? 96 : 192,
    );
    fixRingUVs(g, ringInner, ringOuter);
    return g;
  }, [body.hasRings, ringInner, ringOuter, quality]);

  // Thin shell only (~1–2% larger than body) — not a big onion layer
  const atmosScale = texSet.atmosphereScale ?? 1.014;

  useFrame((_, delta) => {
    const pos = bodyPositions.get(body.id);
    if (groupRef.current && pos) {
      groupRef.current.position.set(pos.x, pos.y, pos.z);
    }

    const days = simClock.days;
    if (meshRef.current) {
      meshRef.current.rotation.y = rotationAngle(body, days);
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y =
        rotationAngle(body, days) * 1.12 + days * 0.008;
    }

    lightDirFromSunTo(body.id, _light);

    if (planetMat && groupRef.current) {
      planetMat.uniforms.uLightDir.value.copy(_light);
      planetMat.uniforms.uTime.value += delta;
      planetMat.uniforms.uAmbient.value = selected ? 0.055 : 0.028;
      // Super-zoom factor: 0 far → 1 very close (F1 finishing)
      const dist = camera.position.distanceTo(groupRef.current.position);
      const close = THREE.MathUtils.clamp(1 - dist / (radius * 28), 0, 1);
      const near = THREE.MathUtils.clamp(1 - dist / (radius * 12), 0, 1);
      planetMat.uniforms.uCloseFactor.value = close;
      planetMat.uniforms.uNormalStrength.value = 1.1 + near * 1.6;

      // Light in body tilt frame for ring-plane shadow (Saturn)
      if (body.id === "saturn") {
        const cos = Math.cos(tilt);
        const sin = Math.sin(tilt);
        // inverse Rz(tilt)
        planetMat.uniforms.uLightLocal.value.set(
          _light.x * cos + _light.y * sin,
          -_light.x * sin + _light.y * cos,
          _light.z,
        );
      }
    }
    if (sunMat) sunMat.uniforms.uTime.value += delta;
    if (sunChromoMat) sunChromoMat.uniforms.uTime.value += delta;
    if (sunCoronaMat) sunCoronaMat.uniforms.uTime.value += delta;
    if (ringMat) ringMat.uniforms.uLightDir.value.copy(_light);
    if (atmosMat && groupRef.current) {
      atmosMat.uniforms.uLightDir.value.copy(_light);
      const dist = camera.position.distanceTo(groupRef.current.position);
      // Soft close-up only — no dramatic "ring bloom"
      const close = THREE.MathUtils.clamp(1 - dist / (radius * 18), 0, 1);
      const base = texSet.atmosphereIntensity ?? 0.25;
      atmosMat.uniforms.uIntensity.value = base * (0.9 + close * 0.25);
      atmosMat.uniforms.uCloseFactor.value = close;
    }
    if (atmosInnerMat && groupRef.current) {
      atmosInnerMat.uniforms.uLightDir.value.copy(_light);
      const dist = camera.position.distanceTo(groupRef.current.position);
      const close = THREE.MathUtils.clamp(1 - dist / (radius * 14), 0, 1);
      atmosInnerMat.uniforms.uCloseFactor.value = close;
    }

    // touch texturesReady so TS doesn't complain about unused in render path
    void texturesReady;
  });

  return (
    <group ref={groupRef}>
      <group rotation={[0, 0, tilt]}>
        <mesh
          ref={meshRef}
          geometry={geometry}
          scale={meshScale}
          userData={{ bodyId: body.id }}
          onClick={(e) => {
            e.stopPropagation();
            // Drag (orbit camera) must not count as a new selection
            if (e.delta > 5) return;
            // Only the nearest body along the ray — stay on the one you clicked
            const nearest = e.intersections.find(
              (hit) => hit.object.userData?.bodyId,
            );
            if (!nearest || nearest.object.userData.bodyId !== body.id) return;
            // Manual pick: lock view here and stop guided/auto tour
            focusBody(body.id, "user");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            const nearest = e.intersections.find(
              (hit) => hit.object.userData?.bodyId,
            );
            if (nearest && nearest.object.userData.bodyId !== body.id) return;
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          {isStar && sunMat ? (
            <primitive object={sunMat} attach="material" />
          ) : planetMat ? (
            <primitive object={planetMat} attach="material" />
          ) : (
            <meshStandardMaterial color={body.color} roughness={0.8} />
          )}
        </mesh>

        {cloudMap && (
          <mesh ref={cloudRef} geometry={cloudGeometry} raycast={noRaycast}>
            <meshStandardMaterial
              map={cloudMap}
              transparent
              opacity={body.id === "earth" ? 0.38 : 0.62}
              depthWrite={false}
              roughness={1}
              metalness={0}
              alphaTest={0.03}
              side={THREE.FrontSide}
            />
          </mesh>
        )}

        {atmosMat && (
          <mesh
            geometry={atmosGeometry}
            material={atmosMat}
            scale={atmosScale}
            raycast={noRaycast}
          />
        )}

        {atmosInnerMat && (
          <mesh
            geometry={atmosGeometry}
            material={atmosInnerMat}
            scale={1.002}
            raycast={noRaycast}
          />
        )}

        {body.hasRings && ringGeo && ringMat && (
          <mesh
            rotation={[Math.PI / 2.12, 0, 0]}
            geometry={ringGeo}
            material={ringMat}
            raycast={noRaycast}
          />
        )}
      </group>

      {/* Soft chromosphere + corona (real solar envelope), not thick onion rings */}
      {isStar && (
        <>
          {sunChromoMat && (
            <mesh
              scale={1.018}
              material={sunChromoMat}
              raycast={noRaycast}
            >
              <sphereGeometry
                args={[radius, Math.max(32, Math.floor(segs / 2)), Math.max(32, Math.floor(segs / 2))]}
              />
            </mesh>
          )}
          {sunCoronaMat && (
            <mesh
              scale={1.06}
              material={sunCoronaMat}
              raycast={noRaycast}
            >
              <sphereGeometry
                args={[radius, Math.max(24, Math.floor(segs / 3)), Math.max(24, Math.floor(segs / 3))]}
              />
            </mesh>
          )}
          <pointLight
            color="#fff6e0"
            intensity={quality === "performance" ? 4 : 7}
            distance={0}
            decay={0}
          />
          <pointLight color="#ffcc88" intensity={2.2} distance={90} decay={1.1} />
        </>
      )}

      {showLabels &&
        (body.type !== "moon" ||
          selected ||
          selectedId === body.parentId) && (
        <Html
          position={[0, radius * 1.7 + 0.35, 0]}
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
