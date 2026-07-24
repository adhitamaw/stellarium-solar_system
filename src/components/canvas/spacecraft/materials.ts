import * as THREE from "three";

/** Shared craft materials — NO scene lights; self-readability via emissive only. */

export function makeIssMaterials(selected: boolean) {
  const fill = selected ? 0.14 : 0.08;
  return {
    truss: new THREE.MeshStandardMaterial({
      color: "#dce2e8",
      metalness: 0.72,
      roughness: 0.32,
      emissive: "#8a9aaa",
      emissiveIntensity: fill * 0.45,
    }),
    module: new THREE.MeshStandardMaterial({
      color: "#b8c2cc",
      metalness: 0.35,
      roughness: 0.48,
      emissive: "#6a7888",
      emissiveIntensity: fill * 0.4,
    }),
    moduleWhite: new THREE.MeshStandardMaterial({
      color: "#eef2f6",
      metalness: 0.28,
      roughness: 0.42,
      emissive: "#9098a0",
      emissiveIntensity: fill * 0.35,
    }),
    gold: new THREE.MeshStandardMaterial({
      color: "#c9a24a",
      metalness: 0.85,
      roughness: 0.22,
      emissive: "#5a4010",
      emissiveIntensity: selected ? 0.22 : 0.08,
    }),
    solar: new THREE.MeshStandardMaterial({
      color: selected ? "#143a8a" : "#0a2460",
      metalness: 0.9,
      roughness: 0.18,
      emissive: selected ? "#0c2858" : "#061530",
      emissiveIntensity: selected ? 0.55 : 0.32,
      side: THREE.DoubleSide,
    }),
    solarFrame: new THREE.MeshStandardMaterial({
      color: "#1e242c",
      metalness: 0.7,
      roughness: 0.4,
      emissive: "#101418",
      emissiveIntensity: fill * 0.3,
    }),
    radiator: new THREE.MeshStandardMaterial({
      color: "#f4f6f8",
      metalness: 0.15,
      roughness: 0.62,
      emissive: "#a0a8b0",
      emissiveIntensity: fill * 0.5,
      side: THREE.DoubleSide,
    }),
    dark: new THREE.MeshStandardMaterial({
      color: "#222830",
      metalness: 0.55,
      roughness: 0.45,
      emissive: "#101418",
      emissiveIntensity: fill * 0.25,
    }),
    cupolaGlass: new THREE.MeshStandardMaterial({
      color: "#88b0d8",
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.55,
      emissive: "#406080",
      emissiveIntensity: selected ? 0.25 : 0.1,
    }),
  };
}

export function makeVoyagerMaterials(
  selected: boolean,
  dishTint: string,
  busTint: string,
) {
  const fill = selected ? 0.12 : 0.07;
  return {
    // Real HGA is a white parabolic reflector (3.66 m) — keep it bright/readable
    dish: new THREE.MeshStandardMaterial({
      color: dishTint,
      metalness: 0.55,
      roughness: 0.32,
      side: THREE.DoubleSide,
      emissive: "#9aa2aa",
      emissiveIntensity: selected ? 0.22 : 0.12,
    }),
    dishBack: new THREE.MeshStandardMaterial({
      color: "#3a424c",
      metalness: 0.55,
      roughness: 0.5,
      emissive: "#1c2228",
      emissiveIntensity: fill * 0.35,
    }),
    bus: new THREE.MeshStandardMaterial({
      color: busTint,
      metalness: 0.45,
      roughness: 0.42,
      emissive: "#505860",
      emissiveIntensity: fill * 0.45,
    }),
    gold: new THREE.MeshStandardMaterial({
      color: "#c8a448",
      metalness: 0.88,
      roughness: 0.2,
      emissive: "#4a3808",
      emissiveIntensity: selected ? 0.28 : 0.1,
    }),
    black: new THREE.MeshStandardMaterial({
      color: "#161a20",
      metalness: 0.4,
      roughness: 0.55,
      emissive: "#0c0e12",
      emissiveIntensity: fill * 0.2,
    }),
    white: new THREE.MeshStandardMaterial({
      color: "#e8ecf0",
      metalness: 0.4,
      roughness: 0.38,
      emissive: "#787e88",
      emissiveIntensity: fill * 0.4,
    }),
    rtg: new THREE.MeshStandardMaterial({
      color: "#8a9098",
      metalness: 0.7,
      roughness: 0.32,
      emissive: "#3a4048",
      emissiveIntensity: fill * 0.3,
    }),
    mli: new THREE.MeshStandardMaterial({
      color: "#b89840",
      metalness: 0.75,
      roughness: 0.35,
      emissive: "#3a2c08",
      emissiveIntensity: fill * 0.35,
    }),
  };
}

export type CraftPickHandlers = {
  userData: { bodyId: string };
  onClick: (e: { stopPropagation: () => void; delta: number }) => void;
  onPointerOver: (e: { stopPropagation: () => void }) => void;
  onPointerOut: () => void;
};

export function makePick(bodyId: string, onSelect: (id: string) => void): CraftPickHandlers {
  return {
    userData: { bodyId },
    onClick: (e) => {
      e.stopPropagation();
      if (e.delta > 5) return;
      onSelect(bodyId);
    },
    onPointerOver: (e) => {
      e.stopPropagation();
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      document.body.style.cursor = "default";
    },
  };
}
