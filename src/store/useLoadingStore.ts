"use client";

import { create } from "zustand";

interface LoadingState {
  /** 0–100 */
  progress: number;
  ready: boolean;
  label: string;
  setProgress: (n: number, label?: string) => void;
  markReady: () => void;
  /** Call when a major asset batch finishes */
  bump: (amount: number, label?: string) => void;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  progress: 0,
  ready: false,
  label: "Menyiapkan mesin 3D…",

  setProgress: (n, label) =>
    set({
      progress: Math.min(100, Math.max(0, n)),
      ...(label ? { label } : {}),
    }),

  bump: (amount, label) => {
    const next = Math.min(100, get().progress + amount);
    set({
      progress: next,
      ...(label ? { label } : {}),
    });
  },

  markReady: () => set({ progress: 100, ready: true, label: "Siap" }),
}));
