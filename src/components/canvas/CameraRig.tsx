"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { bodyById } from "@/data/celestialBodies";
import { visualRadius } from "@/lib/orbital";
import { bodyPositions, simClock } from "@/lib/simClock";
import { useSimulationStore } from "@/store/useSimulationStore";

const _look = new THREE.Vector3();
const _offset = new THREE.Vector3();
const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();
const _pos = new THREE.Vector3();
const _prevTarget = new THREE.Vector3();
const _delta = new THREE.Vector3();

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const selectedId = useSimulationStore((s) => s.selectedId);
  const focusRequestId = useSimulationStore((s) => s.focusRequestId);
  const cameraMode = useSimulationStore((s) => s.cameraMode);

  const flying = useRef(false);
  const flyProgress = useRef(1);
  const startCam = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const endCam = useRef(new THREE.Vector3());
  const endTarget = useRef(new THREE.Vector3());
  const focusId = useRef<string | null>(null);

  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    q: false,
    e: false,
    shift: false,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in keys.current) keys.current[k as keyof typeof keys.current] = true;
      if (e.key === "Shift") keys.current.shift = true;
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in keys.current) keys.current[k as keyof typeof keys.current] = false;
      if (e.key === "Shift") keys.current.shift = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // Cinematic fly-to — reads live bodyPositions (not React-held vectors)
  useEffect(() => {
    if (!selectedId || focusRequestId === 0) return;
    const body = bodyById[selectedId];
    const pos = bodyPositions.get(selectedId);
    if (!body || !pos) return;

    focusId.current = selectedId;
    const r = visualRadius(body, simClock.scaleMode);
    // Closer cinematic framing (Google Earth-like on approach)
    const close =
      body.type === "moon" || body.type === "spacecraft";
    const dist = Math.max(
      r * (body.type === "star" ? 5.5 : close ? 4.5 : 3.8),
      body.type === "star" ? 14 : body.type === "spacecraft" ? 1.4 : 2.2,
    );

    startCam.current.copy(camera.position);
    if (controlsRef.current) {
      startTarget.current.copy(controlsRef.current.target);
    } else {
      startTarget.current.set(0, 0, 0);
    }

    endTarget.current.set(pos.x, pos.y, pos.z);
    _offset.set(dist * 0.65, dist * 0.4, dist * 0.85);
    endCam.current.set(pos.x, pos.y, pos.z).add(_offset);

    flyProgress.current = 0;
    flying.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRequestId]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const controls = controlsRef.current;

    // During fly, track moving body as end target (smooth chase)
    if (flying.current && focusId.current) {
      const pos = bodyPositions.get(focusId.current);
      const body = bodyById[focusId.current!];
      if (pos && body) {
        const r = visualRadius(body, simClock.scaleMode);
        const close =
          body.type === "moon" || body.type === "spacecraft";
        const dist = Math.max(
          r * (body.type === "star" ? 5.5 : close ? 4.5 : 3.8),
          body.type === "star" ? 14 : body.type === "spacecraft" ? 1.4 : 2.2,
        );
        endTarget.current.set(pos.x, pos.y, pos.z);
        _offset.set(dist * 0.55, dist * 0.28, dist * 0.75);
        endCam.current.set(pos.x, pos.y, pos.z).add(_offset);
      }

      // Frame-rate independent progress (~1.2s fly)
      flyProgress.current = Math.min(1, flyProgress.current + dt / 1.15);
      const t = easeInOutCubic(flyProgress.current);

      camera.position.lerpVectors(startCam.current, endCam.current, t);
      _look.lerpVectors(startTarget.current, endTarget.current, t);
      if (controls) {
        controls.target.copy(_look);
        controls.update();
      } else {
        camera.lookAt(_look);
      }

      if (flyProgress.current >= 1) flying.current = false;
      return;
    }

    // Lock view on selected body only (manual pick OR current tour step).
    // Move camera by the same delta as the target so the planet stays framed
    // while it orbits — does NOT hop to neighboring planets.
    if (selectedId && controls && cameraMode === "orbit") {
      const pos = bodyPositions.get(selectedId);
      if (pos) {
        _pos.set(pos.x, pos.y, pos.z);
        _prevTarget.copy(controls.target);
        // Snap firmly once locked (still smooth first frames)
        const alpha = 1 - Math.exp(-dt * 10);
        controls.target.lerp(_pos, alpha);
        _delta.copy(controls.target).sub(_prevTarget);
        camera.position.add(_delta);
        controls.update();
      }
    }

    if (cameraMode === "fly") {
      const speed = (keys.current.shift ? 48 : 16) * dt;
      camera.getWorldDirection(_fwd);
      _right.crossVectors(_fwd, camera.up).normalize();

      if (keys.current.w) camera.position.addScaledVector(_fwd, speed);
      if (keys.current.s) camera.position.addScaledVector(_fwd, -speed);
      if (keys.current.a) camera.position.addScaledVector(_right, -speed);
      if (keys.current.d) camera.position.addScaledVector(_right, speed);
      if (keys.current.q) camera.position.y -= speed;
      if (keys.current.e) camera.position.y += speed;

      if (controls) {
        controls.target.copy(camera.position).addScaledVector(_fwd, 12);
        controls.update();
      }
    }
  });

  // Damping tuned for high refresh: lower factor = smoother at 240Hz
  // three.js damping uses: factor independent-ish when update() each frame
  const damping = 0.05;

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 40, 120]}
        fov={50}
        near={0.05}
        far={3000}
      />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={damping}
        minDistance={0.15}
        maxDistance={600}
        enablePan={cameraMode === "orbit"}
        enableZoom
        zoomSpeed={1.05}
        rotateSpeed={0.85}
        // Mobile: 1 finger rotate, 2 finger pinch zoom + pan
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
        maxPolarAngle={Math.PI * 0.95}
      />
    </>
  );
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
