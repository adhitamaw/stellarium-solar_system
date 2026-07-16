/**
 * Texture paths — Solar System Scope CC BY 4.0
 * https://www.solarsystemscope.com/textures/
 */

export interface BodyTextureSet {
  map?: string;
  mapPreview?: string;
  clouds?: string;
  night?: string;
  rings?: string;
  normal?: string;
  specular?: string;
  color?: string;
  gasGiant?: boolean;
  atmosphere?: string;
  atmosphereIntensity?: number;
  atmosphereScale?: number;
  specularStrength?: number;
  cloudOpacity?: number;
  nightBoost?: number;
  roughness?: number;
  /** Slight non-sphere scale for potato moons (Phobos-like) */
  irregularScale?: [number, number, number];
  /** Extra procedural crater/detail strength in shader */
  detailStrength?: number;
}

const T = "/textures";

export const bodyTextures: Record<string, BodyTextureSet> = {
  sun: {
    map: `${T}/8k_sun.jpg`,
    mapPreview: `${T}/2k_sun.jpg`,
    color: "#ffcc33",
  },
  mercury: {
    map: `${T}/8k_mercury.jpg`,
    mapPreview: `${T}/2k_mercury.jpg`,
    color: "#ffffff",
    roughness: 0.96,
    detailStrength: 0.55,
  },
  venus: {
    map: `${T}/8k_venus_surface.jpg`,
    mapPreview: `${T}/2k_venus_surface.jpg`,
    clouds: `${T}/2k_venus_atmosphere.jpg`,
    color: "#ffffff",
    atmosphere: "#e8c9a0",
    atmosphereIntensity: 0.22,
    atmosphereScale: 1.018,
    cloudOpacity: 0.72,
    roughness: 0.82,
    detailStrength: 0.2,
  },
  earth: {
    map: `${T}/8k_earth_daymap.jpg`,
    mapPreview: `${T}/2k_earth_daymap.jpg`,
    clouds: `${T}/8k_earth_clouds.jpg`,
    /** Prefer 2K clouds on performance via replace; file exists */
    night: `${T}/8k_earth_nightmap.jpg`,
    normal: `${T}/2k_earth_normal_map.png`,
    specular: `${T}/2k_earth_specular_map.png`,
    color: "#ffffff",
    // Real Earth limb: thin pale blue, not neon ring
    atmosphere: "#8ec8ff",
    atmosphereIntensity: 0.32,
    atmosphereScale: 1.014,
    specularStrength: 1.15,
    cloudOpacity: 0.5,
    nightBoost: 2.2,
    roughness: 0.42,
    detailStrength: 0.15,
  },
  mars: {
    map: `${T}/8k_mars.jpg`,
    mapPreview: `${T}/2k_mars.jpg`,
    color: "#ffffff",
    atmosphere: "#d4a080",
    atmosphereIntensity: 0.12,
    atmosphereScale: 1.01,
    roughness: 0.92,
    detailStrength: 0.65,
  },
  jupiter: {
    map: `${T}/8k_jupiter.jpg`,
    mapPreview: `${T}/2k_jupiter.jpg`,
    color: "#ffffff",
    gasGiant: true,
    atmosphere: "#d4b08a",
    atmosphereIntensity: 0.14,
    atmosphereScale: 1.012,
    roughness: 0.72,
    detailStrength: 0.25,
  },
  saturn: {
    map: `${T}/8k_saturn.jpg`,
    mapPreview: `${T}/2k_saturn.jpg`,
    rings: `${T}/2k_saturn_ring_alpha.png`,
    color: "#ffffff",
    gasGiant: true,
    atmosphere: "#e8d4a8",
    atmosphereIntensity: 0.12,
    atmosphereScale: 1.01,
    roughness: 0.78,
    detailStrength: 0.2,
  },
  uranus: {
    map: `${T}/2k_uranus.jpg`,
    color: "#ffffff",
    gasGiant: true,
    atmosphere: "#b0e0f0",
    atmosphereIntensity: 0.16,
    atmosphereScale: 1.014,
    roughness: 0.68,
    detailStrength: 0.15,
  },
  neptune: {
    map: `${T}/2k_neptune.jpg`,
    color: "#ffffff",
    gasGiant: true,
    atmosphere: "#6a8fd4",
    atmosphereIntensity: 0.18,
    atmosphereScale: 1.014,
    roughness: 0.68,
    detailStrength: 0.2,
  },
  // --- Moons (proxy maps + tint for distinct look) ---
  moon: {
    map: `${T}/8k_moon.jpg`,
    mapPreview: `${T}/2k_moon.jpg`,
    color: "#ffffff",
    roughness: 0.98,
    detailStrength: 0.85,
  },
  phobos: {
    map: `${T}/2k_ceres_fictional.jpg`,
    color: "#b09080",
    roughness: 0.99,
    detailStrength: 0.9,
    irregularScale: [1, 0.78, 0.88],
  },
  deimos: {
    map: `${T}/2k_haumea_fictional.jpg`,
    color: "#c0a898",
    roughness: 0.98,
    detailStrength: 0.75,
    irregularScale: [1, 0.82, 0.9],
  },
  amalthea: {
    map: `${T}/2k_ceres_fictional.jpg`,
    color: "#e07040",
    roughness: 0.95,
    detailStrength: 0.7,
    irregularScale: [1, 0.7, 0.75],
  },
  io: {
    map: `${T}/2k_makemake_fictional.jpg`,
    color: "#f5e070",
    roughness: 0.88,
    detailStrength: 0.5,
  },
  europa: {
    map: `${T}/8k_moon.jpg`,
    mapPreview: `${T}/2k_moon.jpg`,
    color: "#c8e8ff",
    roughness: 0.48,
    specularStrength: 0.4,
    detailStrength: 0.35,
  },
  ganymede: {
    map: `${T}/8k_moon.jpg`,
    mapPreview: `${T}/2k_moon.jpg`,
    color: "#b8a898",
    roughness: 0.9,
    detailStrength: 0.55,
  },
  callisto: {
    map: `${T}/8k_mercury.jpg`,
    mapPreview: `${T}/2k_mercury.jpg`,
    color: "#9a8a7a",
    roughness: 0.95,
    detailStrength: 0.7,
  },
  himalia: {
    map: `${T}/2k_ceres_fictional.jpg`,
    color: "#a09070",
    roughness: 0.96,
    detailStrength: 0.65,
    irregularScale: [1, 0.88, 0.92],
  },
  mimas: {
    map: `${T}/8k_moon.jpg`,
    mapPreview: `${T}/2k_moon.jpg`,
    color: "#e8e4dc",
    roughness: 0.92,
    detailStrength: 0.8,
  },
  enceladus: {
    map: `${T}/8k_moon.jpg`,
    mapPreview: `${T}/2k_moon.jpg`,
    color: "#f6faff",
    roughness: 0.35,
    specularStrength: 0.55,
    detailStrength: 0.3,
  },
  tethys: {
    map: `${T}/8k_moon.jpg`,
    mapPreview: `${T}/2k_moon.jpg`,
    color: "#f0f0ec",
    roughness: 0.55,
    specularStrength: 0.25,
    detailStrength: 0.45,
  },
  dione: {
    map: `${T}/8k_moon.jpg`,
    mapPreview: `${T}/2k_moon.jpg`,
    color: "#d8d8d4",
    roughness: 0.85,
    detailStrength: 0.55,
  },
  rhea: {
    map: `${T}/8k_moon.jpg`,
    mapPreview: `${T}/2k_moon.jpg`,
    color: "#e0dcd4",
    roughness: 0.94,
    detailStrength: 0.6,
  },
  titan: {
    map: `${T}/2k_venus_atmosphere.jpg`,
    color: "#e8b878",
    atmosphere: "#e0b070",
    atmosphereIntensity: 0.28,
    atmosphereScale: 1.02,
    cloudOpacity: 0.85,
    roughness: 0.75,
    detailStrength: 0.2,
  },
  iapetus: {
    map: `${T}/8k_mercury.jpg`,
    mapPreview: `${T}/2k_mercury.jpg`,
    color: "#8a7060",
    roughness: 0.97,
    detailStrength: 0.7,
  },
  miranda: {
    map: `${T}/8k_moon.jpg`,
    mapPreview: `${T}/2k_moon.jpg`,
    color: "#d0ccc0",
    roughness: 0.9,
    detailStrength: 0.75,
  },
  ariel: {
    map: `${T}/8k_moon.jpg`,
    mapPreview: `${T}/2k_moon.jpg`,
    color: "#e4e0d8",
    roughness: 0.7,
    detailStrength: 0.5,
  },
  umbriel: {
    map: `${T}/8k_mercury.jpg`,
    mapPreview: `${T}/2k_mercury.jpg`,
    color: "#7a7870",
    roughness: 0.96,
    detailStrength: 0.65,
  },
  titania: {
    map: `${T}/8k_moon.jpg`,
    mapPreview: `${T}/2k_moon.jpg`,
    color: "#d4ccc4",
    roughness: 0.93,
    detailStrength: 0.55,
  },
  oberon: {
    map: `${T}/8k_moon.jpg`,
    mapPreview: `${T}/2k_moon.jpg`,
    color: "#b8b0a0",
    roughness: 0.94,
    detailStrength: 0.6,
  },
  proteus: {
    map: `${T}/2k_ceres_fictional.jpg`,
    color: "#6a6860",
    roughness: 0.98,
    detailStrength: 0.8,
    irregularScale: [1, 0.85, 0.9],
  },
  triton: {
    map: `${T}/2k_eris_fictional.jpg`,
    color: "#e8e0d8",
    atmosphere: "#a8c8e0",
    atmosphereIntensity: 0.1,
    atmosphereScale: 1.008,
    roughness: 0.7,
    detailStrength: 0.45,
  },
  nereid: {
    map: `${T}/2k_haumea_fictional.jpg`,
    color: "#c0b8a8",
    roughness: 0.95,
    detailStrength: 0.55,
    irregularScale: [1, 0.9, 0.95],
  },
};

export const TEXTURE_ANISOTROPY = 16;
