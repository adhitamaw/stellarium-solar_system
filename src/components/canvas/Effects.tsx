"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  SMAA,
} from "@react-three/postprocessing";
import { useSimulationStore } from "@/store/useSimulationStore";

export function Effects() {
  const quality = useSimulationStore((s) => s.quality);

  if (quality === "performance") {
    return null;
  }

  const ultra = quality === "ultra";

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={ultra ? 0.65 : 0.4}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.3}
        mipmapBlur
        radius={ultra ? 0.7 : 0.48}
      />
      <Vignette offset={0.2} darkness={ultra ? 0.4 : 0.28} />
      <SMAA />
    </EffectComposer>
  );
}
