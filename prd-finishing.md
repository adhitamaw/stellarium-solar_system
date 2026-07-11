# Product Requirements Document — Finishing
## Stellarium Cinematic (Release Candidate)

| Field | Detail |
|---|---|
| Nama Produk | Stellarium Cinematic |
| Versi Dokumen | Finishing 1.0 |
| Tanggal | 10 Juli 2026 |
| Status | Ready for execution |
| Basis | [prd.md](./prd.md) MVP v1.0 — fondasi sudah live |
| Tujuan fase | Menutup celah MVP → produk yang terasa “selesai”, shareable, dan memukau |

---

## 1. Ringkasan

Fase Finishing menambahkan fitur high-impact yang belum ada di MVP, merapikan pengalaman close-up, dan memastikan rilis stabil untuk demo/edukasi. Fokus: **visual close-up**, **imersi audio**, **nilai edukasi (banding ukuran)**, **share (screenshot)**, dan **performa adaptif**.

**Bukan** bagian finishing: galaksi luar, multiplayer, VR, N-body penuh, app native.

---

## 2. Masalah yang Diselesaikan

| Masalah pasca-MVP | Dampak | Solusi finishing |
|---|---|---|
| Close-up planet masih “bola bertekstur” | Kurang wow saat demo zoom Bumi | Super-zoom polish: normal lebih kuat, laut berkilau, atmosfer adaptif jarak |
| Sunyi total | Immersi lemah | Ambient space + SFX fly-to / select (bisa di-mute) |
| Sulit membandingkan skala antar planet | Nilai edukasi kurang | Mode banding ukuran side-by-side |
| Tidak ada cara simpan momen | Sulit share | Export screenshot PNG sinematik |
| Ultra bisa berat di device lemah | FPS drop | Auto quality berbasis FPS |
| UI belum menonjolkan fitur baru | Fitur tersembunyi | Toolbar + panel finishing terintegrasi |

---

## 3. Scope Finishing

### 3.1 Wajib (harus ship)

| ID | Fitur | Deskripsi singkat | Acceptance criteria |
|---|---|---|---|
| F1 | Super-zoom polish | Shader planet: normal strength dinamis, specular laut bergelombang (waktu), atmosfer intensitas vs jarak kamera, zoom lebih dekat | Saat zoom ke Bumi, limb atmosfer + kilau laut terlihat jelas; terminator soft tetap ada |
| F2 | Audio ambient + SFX | Drone ambient luar angkasa (Web Audio, tanpa aset besar), whoosh saat fly-to, klik select lembut; toggle mute + volume | Default muted atau soft; user bisa aktifkan; tidak error di browser tanpa autoplay |
| F3 | Mode banding ukuran | Pilih 2 objek; tampilkan side-by-side dengan **rasio radius ilmiah** (bukan skala orbit visual) + label diameter | Bumi vs Jupiter jelas beda skala; bisa ganti pasangan; exit kembali ke sim normal |
| F4 | Screenshot | Tombol capture → unduh PNG dari canvas WebGL (resolusi canvas saat ini) | File `stellarium-*.png` terunduh; HUD opsional disembunyikan sejenak |
| F5 | Auto quality | Monitor FPS; jika stabil di bawah threshold, turunkan quality; jika tinggi, boleh naik (opsional sekali naik) | Tidak osilasi tiap detik; user override manual tetap menang sampai diubah lagi |
| F6 | HUD finishing | Kontrol: Audio, Banding, Screenshot, Auto quality indicator | Desktop + tablet usable; keyboard shortcut masuk akal |

### 3.2 Sebaiknya ada (polish)

| ID | Fitur | Deskripsi |
|---|---|---|
| F7 | Live distance chip | Saat objek dipilih: jarak ke Matahari / ke parent (AU atau km) di HUD |
| F8 | Keyboard shortcuts sheet | `?` atau hint: K cari, M mute, C capture, B banding |
| F9 | Onboarding update | Sebut audio, banding, screenshot |

### 3.3 Di luar finishing

- Export video / path recording
- Voiceover guided tour
- Tile streaming 16K multi-level Google Earth style
- Deploy pipeline CI (manual `vercel` ok)
- Asteroid belt / komet

---

## 4. Detail Fitur

### F1 — Super-zoom polish

- **Normal map strength** naik saat kamera dekat (`uNormalStrength` vs distance).
- **Ocean specular**: animasi UV/time ringan pada specular highlight (bukan sim air penuh).
- **Atmosphere**: sudah ada Fresnel; finishing = curve intensitas lebih agresif saat `distance < radius * 25`.
- **minDistance** kamera tetap rendah; fly-to framing close untuk planet ber-atmosfer.

### F2 — Audio

- Implementasi: **Web Audio API** prosedural (oscillator + noise buffer) — zero binary asset, load cepat.
- Channel: `ambient` (loop), `sfx` (one-shot).
- State: `audioEnabled`, `audioVolume` (0–1), `sfxVolume`.
- Autoplay policy: mulai ambient hanya setelah gesture user (klik “Aktifkan suara” / toggle).

### F3 — Size comparison

- State: `compareMode`, `compareA`, `compareB` (default earth + jupiter).
- Scene mode: saat aktif, scene utama diganti/ditambah layer comparison:
  - Latar hitam + soft light
  - Dua sphere dengan radius ∝ `radiusKm` (dinormalisasi ke max tampilan)
  - Label nama + diameter km
- UI panel pilih A/B dari daftar planet (+ matahari opsional, di-scale down jika perlu).
- Exit: tombol tutup / Esc.

### F4 — Screenshot

- `preserveDrawingBuffer: true` pada renderer (atau enable sesaat sebelum capture).
- Capture: `gl.domElement.toDataURL('image/png')` → download link.
- Opsi: hide HTML HUD 1 frame (CSS) agar shot bersih — **default hide HUD**.

### F5 — Auto quality

- Sample FPS (sudah ada).
- Jika `autoQuality` on:
  - FPS < 40 selama ~2s → `ultra`→`balanced`→`performance`
  - FPS > 100 selama ~4s dan bukan performance-forced → naik satu tingkat (opsional, max ke preference user `qualityCap`)
- Manual quality set menonaktifkan auto naik sementara atau set `qualityCap`.

### F6 — Integrasi UI

- Tombol di header/toolbar: 🔊 Audio · ⚖ Banding · 📷 Capture
- Chip FPS sudah ada; tambah badge `AUTO` jika auto quality on.

---

## 5. Model State tambahan

| Field | Tipe | Keterangan |
|---|---|---|
| audioEnabled | boolean | Master audio |
| audioVolume | number | 0–1 ambient |
| compareMode | boolean | |
| compareA / compareB | string | body ids |
| autoQuality | boolean | default true |
| qualityLocked | boolean | user override |
| hideHudForCapture | boolean | transient |

---

## 6. Non-fungsional (finishing)

| Kategori | Target |
|---|---|
| Performa | Fitur baru tidak merusak 240 Hz path (audio di main thread ringan; compare mode = scene sederhana) |
| Aksesibilitas | Mute jelas; banding keyboard-accessible; kontras label AA |
| Kompatibilitas | Chrome/Edge/Firefox/Safari modern; audio graceful jika AudioContext gagal |
| Muat | Tidak menambah unduhan tekstur wajib di atas yang sudah ada |
| Stabilitas | Build production TypeScript clean |

---

## 7. User flow finishing

1. User buka app → onboarding menyebut fitur baru → tutup.
2. Explore normal → aktifkan audio → dengar ambient.
3. Klik Bumi → fly-to + SFX → super-zoom polish terlihat.
4. Buka Banding → Earth vs Jupiter → paham skala → tutup.
5. Atur framing bagus → Capture → PNG tersimpan.
6. Di laptop lemah, auto quality turun tanpa crash.

---

## 8. Milestone eksekusi

| Urutan | Deliverable | Estimasi |
|---|---|---|
| 1 | PRD finishing (dokumen ini) | — |
| 2 | F1 Super-zoom shader + camera | 0.5 hari |
| 3 | F2 Audio engine + UI | 0.5 hari |
| 4 | F3 Size comparison mode | 1 hari |
| 5 | F4 Screenshot + F5 Auto quality | 0.5 hari |
| 6 | F6–F9 HUD/onboarding polish + QA build | 0.5 hari |

---

## 9. Metrik sukses finishing

| Metrik | Target |
|---|---|
| Build production | Pass |
| Fitur F1–F6 | Semua usable tanpa error console kritis |
| Screenshot | File PNG valid |
| Compare Earth/Jupiter | Rasio visual mendekati rasio radius (~1 : 11) |
| Audio | Mute/unmute bekerja; no autoplay violation crash |

---

## 10. Definition of Done

- [x] `prd-finishing.md` committed
- [x] F1–F6 diimplementasi
- [x] F7–F9 minimal viable
- [x] `npm run build` sukses
- [x] README diperbarui (fitur finishing + kontrol)

---

## 11. Referensi

- PRD inti: `prd.md`
- Tekstur: Solar System Scope CC BY 4.0
- Inspirasi banding skala: NASA Eyes / classic “If the Moon were…” demos
