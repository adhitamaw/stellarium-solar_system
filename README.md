# Stellarium Cinematic

Simulator tata surya 3D interaktif dan sinematik berbasis web — implementasi MVP dari [PRD](./prd.md).

## Fitur

### MVP + visual
- **Rendering 3D** — Matahari, 8 planet, bulan utama
- **Tekstur 8K** — Solar System Scope (CC BY 4.0) + normal/specular Bumi
- **Shader planet** — terminator soft, night lights, awan, atmosfer Fresnel, super-zoom polish
- **Kontrol kamera** — Orbit, terbang WASD, fly-to sinematik
- **Time control** — Play/pause, percepat, scrub
- **240 Hz** — sim clock di luar React; UI ~20 Hz

### Finishing (lihat [prd-finishing.md](./prd-finishing.md))
- **Suara ambient** — Web Audio prosedural + SFX fly-to (`M`)
- **Mode banding ukuran** — rasio radius ilmiah side-by-side (`B`)
- **Screenshot PNG** — capture tanpa HUD (`C`)
- **Auto quality** — turun/naik berdasarkan FPS
- **Distance chip** + shortcuts (`?`)

### Polish sprint
- **Share link** — `?focus=saturn` + tombol Share (salin / Web Share API)
- **Loading cinematic** — progress bar masuk ke tata surya
- **Mobile** — pinch zoom, touch orbit, tip gestur
- **Bayangan cincin Saturnus** — shader shadow di badan planet
- **~25 bulan utama** di semua planet

## Tech stack

| Layer | Teknologi |
|---|---|
| 3D | Three.js + React Three Fiber + Drei |
| App | Next.js 16 + TypeScript |
| State | Zustand |
| UI | Tailwind CSS 4 |
| FX | @react-three/postprocessing |

## Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # serve production
```

### Deploy (Vercel)

```bash
npm i -g vercel
vercel
```

Atau hubungkan repo ke [vercel.com](https://vercel.com) — framework Next.js auto-detect. File `vercel.json` sudah ada.

### Deep link / share

```
https://your-app.vercel.app/?focus=earth
https://your-app.vercel.app/?focus=saturn
https://your-app.vercel.app/?focus=neptune
```

Alias: `bumi`, `matahari`, `saturnus`, `neptunus`, dll. Tombol **Share** di UI menyalin link objek yang sedang difokus.

## Struktur

```
src/
  app/                 # Next.js App Router
  components/
    canvas/            # Scene 3D (R3F)
    ui/                # HUD overlay
  data/                # Celestial bodies + tour steps
  lib/                 # Orbital math & visual scale
  store/               # Zustand simulation state
```

## Performa (240 Hz)

Scene di-update setiap `requestAnimationFrame` (60/144/240 Hz sesuai monitor). State React **tidak** di-update tiap frame — hanya mirror waktu UI ~20 Hz. Gerakan orbit/kamera memakai delta-time (frame-rate independent).

| Preset | DPR | Post-FX | Geometri |
|---|---|---|---|
| Perf | 1 | off | rendah |
| Seimbang | ≤1.25 | bloom ringan | sedang |
| Ultra | ≤1.75 | bloom + vignette | tinggi |

```bash
npm run textures   # unduh ulang map 2K ke public/textures
```

## Catatan ilmiah

Data radius, periode orbit/rotasi, dan kemiringan sumbu mengacu nilai publik NASA/JPL (aproksimasi). Skala jarak di-compress secara non-linear agar seluruh tata surya terlihat di viewport — mode **Realistis** mendekati proporsi jarak, mode **Jelas** membesarkan planet untuk keterbacaan.

## Lisensi data referensi

- Parameter orbit/fisik: domain publik (NASA JPL Horizons ringkas)
- Tekstur planet: [Solar System Scope](https://www.solarsystemscope.com/textures/) — **CC BY 4.0**
- Inspirasi visual: dokumenter luar angkasa / NASA Eyes on the Solar System
