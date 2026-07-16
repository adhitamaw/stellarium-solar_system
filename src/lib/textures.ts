import * as THREE from "three";
import { TEXTURE_ANISOTROPY } from "@/data/textures";

const cache = new Map<string, THREE.Texture>();
const loader = new THREE.TextureLoader();

function configure(
  tex: THREE.Texture,
  opts: { srgb?: boolean; normal?: boolean } = {},
) {
  if (opts.normal) {
    tex.colorSpace = THREE.NoColorSpace;
  } else {
    tex.colorSpace = opts.srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  }
  tex.anisotropy = TEXTURE_ANISOTROPY;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

/** Prefer 2K asset when quality is low or 8K path would OOM on mobile */
export function resolveTextureUrl(
  url: string | undefined,
  lowResOnly: boolean,
): string | undefined {
  if (!url) return undefined;
  if (!lowResOnly) return url;
  if (url.includes("8k_")) return url.replace("8k_", "2k_");
  if (url.includes("4k_")) return url.replace("4k_", "2k_");
  return url;
}

/** Load texture with cache; resolves null if missing/failed */
export function loadTexture(
  url: string | undefined,
  opts: { srgb?: boolean; normal?: boolean } = {},
): Promise<THREE.Texture | null> {
  if (!url) return Promise.resolve(null);
  const key = `${url}|${opts.normal ? "n" : "c"}`;
  const hit = cache.get(key);
  if (hit) return Promise.resolve(hit);

  return new Promise((resolve) => {
    loader.load(
      url,
      (tex) => {
        configure(tex, opts);
        cache.set(key, tex);
        resolve(tex);
      },
      undefined,
      () => {
        // try without leading path issues
        resolve(null);
      },
    );
  });
}

/**
 * Progressive load: show preview ASAP, upgrade to hi-res when ready.
 * On mobile/performance, skip 8K upgrade (OOM / black screen on Vercel mobile).
 */
export async function loadMapProgressive(
  hiRes: string | undefined,
  preview: string | undefined,
  onUpdate: (tex: THREE.Texture) => void,
  opts: {
    srgb?: boolean;
    normal?: boolean;
    /** When true, only load preview / 2K */
    lowResOnly?: boolean;
  } = {},
) {
  const previewTex = await loadTexture(preview ?? hiRes, opts);
  if (previewTex) onUpdate(previewTex);
  if (opts.lowResOnly) return;
  if (hiRes && hiRes !== preview) {
    const hi = await loadTexture(hiRes, opts);
    if (hi) onUpdate(hi);
  }
}

/** Fix RingGeometry UVs so a strip ring texture maps radially */
export function fixRingUVs(
  geometry: THREE.RingGeometry,
  inner: number,
  outer: number,
) {
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const len = Math.sqrt(v.x * v.x + v.y * v.y);
    const u = (len - inner) / (outer - inner);
    uv.setXY(i, u, 0.5);
  }
  uv.needsUpdate = true;
}

/** Sphere with tangents for normal mapping */
export function createPlanetGeometry(radius: number, segs: number) {
  const geo = new THREE.SphereGeometry(radius, segs, segs);
  try {
    geo.computeTangents();
  } catch {
    // older three builds may lack computeTangents on non-indexed paths
  }
  return geo;
}
