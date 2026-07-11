"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useLoadingStore } from "@/store/useLoadingStore";

/**
 * Loading progress + hard timeout so mobile never stuck on splash forever.
 */
export function SceneBootstrap() {
  const frames = useRef(0);
  const done = useRef(false);
  const { gl } = useThree();

  useEffect(() => {
    useLoadingStore.getState().setProgress(12, "Inisialisasi WebGL…");
    const soft = window.setTimeout(() => {
      useLoadingStore.getState().setProgress(25, "Membangun tata surya…");
    }, 150);

    // Safety: always unlock UI even if WebGL stalls
    const hard = window.setTimeout(() => {
      if (!done.current) {
        done.current = true;
        useLoadingStore.getState().markReady();
      }
    }, 6000);

    return () => {
      clearTimeout(soft);
      clearTimeout(hard);
    };
  }, [gl]);

  useFrame(() => {
    if (done.current) return;
    frames.current += 1;

    if (frames.current === 2) {
      useLoadingStore.getState().setProgress(35, "Menyalakan bintang…");
    }
    if (frames.current === 20) {
      useLoadingStore.getState().setProgress(55, "Memuat tekstur…");
    }
    if (frames.current === 45) {
      useLoadingStore.getState().setProgress(75, "Menyelaraskan orbit…");
    }
    if (frames.current >= 60) {
      const p = useLoadingStore.getState().progress;
      if (p < 90) useLoadingStore.getState().setProgress(90, "Hampir siap…");
    }
    // Faster unlock (~1s @ 60fps) so mobile doesn't wait on 8K
    if (frames.current >= 90) {
      done.current = true;
      useLoadingStore.getState().markReady();
    }
  });

  return null;
}
