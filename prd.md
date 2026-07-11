# Product Requirements Document (PRD)
## Cinematic Interactive Universe and Solar System Simulator

| Field | Detail |
|---|---|
| Nama Produk | Stellarium Cinematic (nama kerja) |
| Versi Dokumen | 1.0 |
| Tanggal | 10 Juli 2026 |
| Pemilik Produk | TBD |
| Status | Draft |

---

## 1. Ringkasan Eksekutif

Produk ini adalah simulator tata surya dan alam semesta berbasis web yang interaktif dan sinematik. Pengguna dapat menjelajahi Matahari, planet, bulan, asteroid, dan objek langit lainnya dalam skala 3D yang akurat secara ilmiah, dengan kualitas visual setara film dokumenter luar angkasa. Produk ditujukan untuk edukasi, eksplorasi santai, dan showcase teknologi web 3D.

---

## 2. Latar Belakang dan Masalah

| Masalah | Dampak |
|---|---|
| Simulator tata surya yang ada umumnya statis atau berbasis gambar 2D | Pengguna sulit memahami skala dan pergerakan orbit secara intuitif |
| Aplikasi edukasi astronomi sering terlihat kaku dan kurang menarik secara visual | Rendahnya engagement, terutama untuk pelajar dan penggemar kasual |
| Tools astronomi profesional (Stellarium, Celestia) memiliki kurva belajar tinggi | Tidak ramah untuk pengguna awam |

Produk ini mengisi celah antara akurasi ilmiah dan pengalaman visual yang memikat, dengan antarmuka yang mudah diakses lewat browser tanpa instalasi.

---

## 3. Tujuan Produk

| Tujuan | Metrik Keberhasilan |
|---|---|
| Memberikan pengalaman visual sinematik dari tata surya | Rata-rata waktu sesi lebih dari 5 menit |
| Akurasi data astronomi yang kredibel | Data orbit dan skala tervalidasi terhadap sumber NASA JPL |
| Interaksi yang intuitif tanpa instruksi manual | Tingkat penyelesaian tur onboarding di atas 80 persen |
| Performa lancar di perangkat mainstream | Frame rate stabil di atas 45 fps pada laptop kelas menengah |

---

## 4. Target Pengguna

| Segmen | Kebutuhan Utama |
|---|---|
| Pelajar dan mahasiswa | Visualisasi konsep astronomi untuk belajar |
| Guru dan edukator | Alat bantu mengajar interaktif di kelas |
| Penggemar astronomi kasual | Eksplorasi dan hiburan visual |
| Developer dan desainer | Referensi showcase teknologi WebGL 3D |

---

## 5. Lingkup Produk (Scope)

### 5.1 Termasuk dalam Scope (MVP)

- Simulasi Matahari dan delapan planet dengan orbit dan rotasi yang akurat secara relatif
- Bulan-bulan utama (Bulan Bumi, bulan-bulan besar Jupiter dan Saturnus)
- Kontrol kamera bebas: zoom, pan, orbit, dan mode "terbang"
- Mode waktu: real-time, dipercepat, dan waktu yang bisa diatur manual (time scrubbing)
- Info panel untuk setiap objek langit (ukuran, jarak, komposisi, fakta singkat)
- Efek visual sinematik: pencahayaan Matahari, lens flare, starfield latar belakang, atmosfer planet
- Transisi kamera otomatis antar objek (cinematic camera fly-through)
- Mode responsif untuk desktop dan tablet

### 5.2 Di Luar Scope (Fase Berikutnya)

- Simulasi galaksi di luar tata surya
- Mode multipemain atau kolaboratif
- Simulasi fisika orbit penuh (N-body simulation presisi tinggi)
- Dukungan VR/AR
- Aplikasi native mobile

---

## 6. Fitur Utama dan Prioritas

| Fitur | Deskripsi | Prioritas |
|---|---|---|
| Rendering tata surya 3D | Model planet, orbit, dan Matahari dengan tekstur realistis | Wajib |
| Kontrol kamera interaktif | Orbit control, zoom, free-fly, focus-on-object | Wajib |
| Time control | Play, pause, percepat, mundur, lompat ke tanggal tertentu | Wajib |
| Info panel objek | Data ilmiah singkat per objek saat diklik | Wajib |
| Efek sinematik | Lighting dinamis, bloom, lens flare, depth of field | Wajib |
| Guided tour mode | Tur otomatis bernarasi melalui tata surya | Sebaiknya ada |
| Skala switch | Toggle antara skala realistis dan skala yang diperbesar agar terlihat jelas | Sebaiknya ada |
| Pencarian objek | Search bar untuk lompat langsung ke planet atau bulan tertentu | Sebaiknya ada |
| Mode perbandingan ukuran | Menjajarkan dua objek untuk membandingkan skala | Opsional |
| Audio ambient | Musik latar dan efek suara ambient luar angkasa | Opsional |
| Ekspor screenshot/video | Menyimpan tangkapan layar sinematik | Opsional |

---

## 7. Rekomendasi Tumpukan Teknologi (Tech Stack)

| Layer | Teknologi | Alasan |
|---|---|---|
| Rendering 3D | Three.js dengan React Three Fiber | Ekosistem matang untuk WebGL di web, dukungan komunitas luas |
| Framework aplikasi | Next.js dengan TypeScript | Struktur proyek jelas, performa baik, mudah di-deploy |
| State management | Zustand | Ringan, cocok untuk state kamera dan waktu simulasi |
| Styling UI | Tailwind CSS | Cepat untuk membangun panel info dan kontrol overlay |
| Post-processing efek | postprocessing (pmndrs) untuk bloom, DOF, efek sinematik | Terintegrasi baik dengan React Three Fiber |
| Data astronomi | Data orbit dari NASA JPL Horizons atau dataset open-source ekuivalen | Akurasi dan kredibilitas ilmiah |
| Deployment | Vercel atau setara | Mendukung Next.js secara native |

---

## 8. Alur Pengalaman Pengguna (User Flow Utama)

1. Pengguna membuka aplikasi dan melihat tampilan awal tata surya dari kejauhan dengan animasi masuk sinematik.
2. Onboarding singkat menampilkan cara mengontrol kamera dan waktu.
3. Pengguna dapat mengklik planet mana pun untuk kamera otomatis bergerak mendekat (fly-to animation).
4. Panel info muncul menampilkan data objek yang dipilih.
5. Pengguna dapat mengatur kecepatan waktu untuk melihat pergerakan orbit.
6. Pengguna dapat mengaktifkan guided tour untuk pengalaman terpandu dengan narasi.

---

## 9. Persyaratan Non-Fungsional

| Kategori | Persyaratan |
|---|---|
| Performa | Minimal 45 fps di perangkat kelas menengah, 60 fps di perangkat kelas atas |
| Kompatibilitas browser | Chrome, Edge, Firefox, Safari versi dua tahun terakhir |
| Aksesibilitas | Kontrol dapat dioperasikan dengan keyboard, kontras teks memenuhi WCAG AA |
| Waktu muat awal | Di bawah 5 detik pada koneksi broadband standar |
| Skalabilitas aset | Tekstur planet menggunakan level of detail (LOD) agar hemat memori |
| Responsivitas | Layout menyesuaikan untuk layar desktop dan tablet |

---

## 10. Model Data (Ringkas)

| Entitas | Atribut Utama |
|---|---|
| CelestialBody | id, nama, tipe (planet, bulan, matahari, asteroid), radius, jarakOrbit, periodeOrbit, periodeRotasi, kemiringanSumbu, tekstur, deskripsi |
| CameraState | posisi, target, modeAktif, kecepatanTransisi |
| TimeState | waktuSaatIni, kecepatanSimulasi, statusPlay |
| TourStep | urutan, objekTarget, narasi, durasi |

---

## 11. Milestone dan Fase Pengembangan

| Fase | Cakupan | Estimasi Durasi |
|---|---|---|
| Fase 1: Fondasi | Setup proyek, rendering dasar Matahari dan planet, kontrol kamera dasar | 3 minggu |
| Fase 2: Interaktivitas | Info panel, time control, seleksi objek | 3 minggu |
| Fase 3: Sinematik | Efek pencahayaan, bloom, lens flare, transisi kamera halus | 3 minggu |
| Fase 4: Konten dan Polish | Guided tour, pencarian objek, optimasi performa | 2 minggu |
| Fase 5: QA dan Peluncuran | Pengujian lintas perangkat, perbaikan bug, deployment | 2 minggu |

---

## 12. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Performa rendering menurun di perangkat rendah spek | Pengalaman pengguna buruk | Implementasi LOD dan pengaturan kualitas grafis adaptif |
| Akurasi data astronomi keliru | Menurunkan kredibilitas edukatif | Validasi data terhadap sumber NASA JPL sebelum rilis |
| Ukuran aset tekstur terlalu besar | Waktu muat lambat | Kompresi tekstur dan lazy loading per objek |
| Kompleksitas kontrol kamera membingungkan pengguna awam | Tingkat drop-off tinggi | Uji usability dan sederhanakan kontrol default |

---

## 13. Metrik Keberhasilan Produk

| Metrik | Target |
|---|---|
| Rata-rata durasi sesi | Lebih dari 5 menit |
| Frame rate rata-rata | Di atas 45 fps |
| Tingkat penyelesaian guided tour | Di atas 60 persen |
| Skor kepuasan pengguna (survei) | Di atas 4 dari 5 |

---

## 14. Lampiran

- Referensi data orbit dan fisik planet: NASA JPL Horizons System
- Referensi tekstur planet open-source: Solar System Scope textures (lisensi CC BY 4.0)
- Inspirasi visual: dokumenter luar angkasa dan aplikasi Eyes on the Solar System oleh NASA