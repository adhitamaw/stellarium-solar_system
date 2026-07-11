"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { Starfield } from "./Starfield";
import { SolarSystem } from "./SolarSystem";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";
import { SimulationLoop } from "./SimulationLoop";
import { CaptureController } from "./CaptureController";
import { CompareScene } from "./CompareScene";
import { SceneBootstrap } from "./SceneBootstrap";
import { useSimulationStore } from "@/store/useSimulationStore";
import { isMobileDevice, maxDpr } from "@/lib/device";

function RendererTuning() {
  const { gl } = useThree();
  const quality = useSimulationStore((s) => s.quality);

  useEffect(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
    gl.shadowMap.enabled = false;
  }, [gl]);

  useEffect(() => {
    gl.setPixelRatio(maxDpr(quality));
  }, [gl, quality]);

  return null;
}

function SceneContent() {
  const quality = useSimulationStore((s) => s.quality);
  const compareMode = useSimulationStore((s) => s.compareMode);
  const mobile = isMobileDevice();
  const starCount =
    quality === "performance" || mobile
      ? 1800
      : quality === "balanced"
        ? 3500
        : 5500;

  if (compareMode) {
    return (
      <>
        <color attach="background" args={["#03050c"]} />
        <CompareScene />
        <CaptureController />
      </>
    );
  }

  return (
    <>
      <color attach="background" args={["#000005"]} />
      <fog attach="fog" args={["#000005", 400, 1200]} />
      <RendererTuning />
      <SceneBootstrap />
      <Starfield count={starCount} />
      <SolarSystem />
      <CameraRig />
      {quality !== "performance" && <Effects />}
      <SimulationLoop />
      <CaptureController />
    </>
  );
}

export function SolarCanvas() {
  const quality = useSimulationStore((s) => s.quality);

  const dprMax = maxDpr(quality);
  const dpr: [number, number] = [1, dprMax];

  return (
    <div className="absolute inset-0 bg-[#000005]">
      <Canvas
        dpr={dpr}
        frameloop="always"
        flat={false}
        style={{ touchAction: "none", width: "100%", height: "100%" }}
        gl={{
          antialias: quality !== "performance",
          powerPreference: isMobileDevice()
            ? "default"
            : "high-performance",
          alpha: false,
          stencil: false,
          depth: true,
          // false saves mobile GPU memory; capture enables briefly if needed
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000005", 1);
          gl.domElement.style.touchAction = "none";
          gl.domElement.style.display = "block";
          gl.domElement.style.width = "100%";
          gl.domElement.style.height = "100%";
        }}
        onPointerMissed={() => {
          const s = useSimulationStore.getState();
          if (!s.compareMode) s.selectBody(null);
        }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
