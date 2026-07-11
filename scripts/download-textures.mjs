/**
 * Download Solar System Scope 2K textures (CC BY 4.0) into public/textures.
 * Attribution: https://www.solarsystemscope.com/textures/
 */
import { createWriteStream, existsSync, mkdirSync, statSync } from "fs";
import { pipeline } from "stream/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "textures");

const BASE = "https://www.solarsystemscope.com/textures/download";

const FILES = [
  "2k_sun.jpg",
  "2k_mercury.jpg",
  "2k_venus_surface.jpg",
  "2k_venus_atmosphere.jpg",
  "2k_earth_daymap.jpg",
  "2k_earth_clouds.jpg",
  "2k_earth_nightmap.jpg",
  "2k_mars.jpg",
  "2k_jupiter.jpg",
  "2k_saturn.jpg",
  "2k_saturn_ring_alpha.png",
  "2k_uranus.jpg",
  "2k_neptune.jpg",
  "2k_moon.jpg",
  "2k_makemake_fictional.jpg",
];

// Fallback mirrors (three.js examples / known public CDNs) if primary fails
const FALLBACKS = {
  "2k_earth_daymap.jpg":
    "https://raw.githubusercontent.com/mrdoob/three.js/r170/examples/textures/planets/earth_atmos_2048.jpg",
  "2k_earth_clouds.jpg":
    "https://raw.githubusercontent.com/mrdoob/three.js/r170/examples/textures/planets/earth_clouds_1024.png",
  "2k_moon.jpg":
    "https://raw.githubusercontent.com/mrdoob/three.js/r170/examples/textures/planets/moon_1024.jpg",
};

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "User-Agent": "stellarium-cinematic-texture-fetch/1.0" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  await pipeline(res.body, createWriteStream(dest));
}

async function ensure(file) {
  const dest = join(OUT, file);
  if (existsSync(dest) && statSync(dest).size > 10_000) {
    console.log(`skip  ${file}`);
    return;
  }

  const primary = `${BASE}/${file}`;
  try {
    console.log(`get   ${file}`);
    await download(primary, dest);
    console.log(`ok    ${file} (${statSync(dest).size} bytes)`);
    return;
  } catch (e) {
    console.warn(`fail  primary ${file}: ${e.message}`);
  }

  const fb = FALLBACKS[file];
  if (fb) {
    try {
      console.log(`fb    ${file}`);
      await download(fb, dest);
      console.log(`ok    ${file} via fallback`);
      return;
    } catch (e) {
      console.warn(`fail  fallback ${file}: ${e.message}`);
    }
  }

  // Placeholder: tiny valid JPEG so app still loads
  console.warn(`miss  ${file} — app will use procedural color`);
}

mkdirSync(OUT, { recursive: true });

for (const f of FILES) {
  await ensure(f);
}

console.log("done →", OUT);
