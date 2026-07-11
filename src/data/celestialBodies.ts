export type BodyType = "star" | "planet" | "moon" | "asteroid";

export interface CelestialBody {
  id: string;
  name: string;
  type: BodyType;
  /** Mean radius in km */
  radiusKm: number;
  /** Semi-major axis in AU (for planets) or km (for moons relative to parent) */
  orbitRadius: number;
  /** Orbital period in Earth days */
  orbitalPeriodDays: number;
  /** Rotation period in Earth hours (negative = retrograde) */
  rotationPeriodHours: number;
  /** Axial tilt in degrees */
  axialTiltDeg: number;
  /** Orbit inclination degrees */
  inclinationDeg: number;
  /** Starting mean anomaly offset 0–1 */
  phaseOffset: number;
  /** Parent body id for moons */
  parentId?: string;
  /** Hex base color for procedural material */
  color: string;
  /** Emissive intensity (stars/hot bodies) */
  emissive?: number;
  /** Has ring system */
  hasRings?: boolean;
  /** Atmosphere color (hex) */
  atmosphereColor?: string;
  description: string;
  composition: string;
  /** Average distance from Sun (AU) for display; moons use parent */
  distanceAu?: number;
  funFact: string;
}

/** Visual scene units — distances & sizes tuned for cinematic clarity */
export const VISUAL = {
  auScale: 48,
  sunRadius: 4.2,
  /** Multiplier applied to planet radii in visible scale mode */
  bodyScaleVisible: 1,
  bodyScaleRealistic: 0.35,
  moonOrbitScale: 0.018,
} as const;

export const celestialBodies: CelestialBody[] = [
  {
    id: "sun",
    name: "Matahari",
    type: "star",
    radiusKm: 696_340,
    orbitRadius: 0,
    orbitalPeriodDays: 0,
    rotationPeriodHours: 609.12,
    axialTiltDeg: 7.25,
    inclinationDeg: 0,
    phaseOffset: 0,
    color: "#ffcc33",
    emissive: 1.5,
    description:
      "Bintang deret utama tipe G2V di pusat tata surya. Menyumbang ~99,86% massa seluruh sistem.",
    composition: "Hidrogen (~73%), Helium (~25%), elemen berat",
    distanceAu: 0,
    funFact: "Cahaya Matahari butuh sekitar 8 menit 20 detik untuk sampai ke Bumi.",
  },
  {
    id: "mercury",
    name: "Merkurius",
    type: "planet",
    radiusKm: 2_439.7,
    orbitRadius: 0.387,
    orbitalPeriodDays: 87.97,
    rotationPeriodHours: 1_407.6,
    axialTiltDeg: 0.034,
    inclinationDeg: 7.0,
    phaseOffset: 0.12,
    color: "#9e9e9e",
    description:
      "Planet terkecil dan terdekat dengan Matahari. Permukaan penuh kawah mirip Bulan. Tidak memiliki satelit alami.",
    composition: "Inti besi besar, mantel silikat",
    distanceAu: 0.387,
    funFact: "Satu hari Merkurius lebih lama dari satu tahun Merkurius.",
  },
  {
    id: "venus",
    name: "Venus",
    type: "planet",
    radiusKm: 6_051.8,
    orbitRadius: 0.723,
    orbitalPeriodDays: 224.7,
    rotationPeriodHours: -5_832.5,
    axialTiltDeg: 177.4,
    inclinationDeg: 3.4,
    phaseOffset: 0.41,
    color: "#e8cda0",
    atmosphereColor: "#f0d080",
    description:
      "Planet terpanas di tata surya akibat efek rumah kaca ekstrem dari atmosfer CO₂ tebal. Tidak memiliki satelit alami.",
    composition: "Atmosfer CO₂, permukaan vulkanik",
    distanceAu: 0.723,
    funFact: "Venus berotasi mundur — Matahari terbit di barat.",
  },
  {
    id: "earth",
    name: "Bumi",
    type: "planet",
    radiusKm: 6_371,
    orbitRadius: 1.0,
    orbitalPeriodDays: 365.256,
    rotationPeriodHours: 23.934,
    axialTiltDeg: 23.44,
    inclinationDeg: 0,
    phaseOffset: 0.0,
    color: "#3a7bd5",
    atmosphereColor: "#6eb5ff",
    description:
      "Satu-satunya planet yang diketahui mendukung kehidupan. ~71% permukaan tertutup air.",
    composition: "Nitrogen, oksigen, air, silikat, inti besi-nikel",
    distanceAu: 1.0,
    funFact: "Bumi adalah planet terpadat di tata surya.",
  },
  {
    id: "mars",
    name: "Mars",
    type: "planet",
    radiusKm: 3_389.5,
    orbitRadius: 1.524,
    orbitalPeriodDays: 686.98,
    rotationPeriodHours: 24.623,
    axialTiltDeg: 25.19,
    inclinationDeg: 1.85,
    phaseOffset: 0.28,
    color: "#c1440e",
    atmosphereColor: "#e07a4a",
    description:
      "Planet merah — permukaan kaya oksida besi. Target utama eksplorasi manusia berikutnya.",
    composition: "Karbon dioksida tipis, basalt, es kutub",
    distanceAu: 1.524,
    funFact: "Olympus Mons di Mars adalah gunung berapi tertinggi di tata surya (~22 km).",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "planet",
    radiusKm: 69_911,
    orbitRadius: 5.203,
    orbitalPeriodDays: 4_332.59,
    rotationPeriodHours: 9.925,
    axialTiltDeg: 3.13,
    inclinationDeg: 1.3,
    phaseOffset: 0.55,
    color: "#d4a574",
    atmosphereColor: "#c4956a",
    description:
      "Raksasa gas terbesar. Medan gravitasi dan magnetnya membentuk dinamika tata surya luar.",
    composition: "Hidrogen, helium, jejak amonia dan metana",
    distanceAu: 5.203,
    funFact: "Bintik Merah Besar adalah badai yang sudah berlangsung ratusan tahun.",
  },
  {
    id: "saturn",
    name: "Saturnus",
    type: "planet",
    radiusKm: 58_232,
    orbitRadius: 9.537,
    orbitalPeriodDays: 10_759.22,
    rotationPeriodHours: 10.656,
    axialTiltDeg: 26.73,
    inclinationDeg: 2.49,
    phaseOffset: 0.72,
    color: "#f4d59e",
    hasRings: true,
    atmosphereColor: "#e8c98a",
    description:
      "Dikenal lewat sistem cincin es dan batuan yang menakjubkan. Kepadatan rata-rata lebih rendah dari air.",
    composition: "Hidrogen, helium, cincin es-air",
    distanceAu: 9.537,
    funFact: "Saturnus akan mengapung di air raksasa karena kepadatannya ~0,69 g/cm³.",
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "planet",
    radiusKm: 25_362,
    orbitRadius: 19.191,
    orbitalPeriodDays: 30_688.5,
    rotationPeriodHours: -17.24,
    axialTiltDeg: 97.77,
    inclinationDeg: 0.77,
    phaseOffset: 0.18,
    color: "#7ec8e3",
    atmosphereColor: "#a8dff0",
    description:
      "Raksasa es yang berotasi miring hampir 98° — seolah berguling di orbitnya.",
    composition: "Air, amonia, metana, hidrogen, helium",
    distanceAu: 19.191,
    funFact: "Sumbu rotasi Uranus hampir sejajar dengan bidang orbitnya.",
  },
  {
    id: "neptune",
    name: "Neptunus",
    type: "planet",
    radiusKm: 24_622,
    orbitRadius: 30.069,
    orbitalPeriodDays: 60_182,
    rotationPeriodHours: 16.11,
    axialTiltDeg: 28.32,
    inclinationDeg: 1.77,
    phaseOffset: 0.63,
    color: "#4169e1",
    atmosphereColor: "#5b7fd4",
    description:
      "Planet terjauh. Angin superkencang hingga 2.100 km/jam — tercepat di tata surya.",
    composition: "Air, amonia, metana, hidrogen, helium",
    distanceAu: 30.069,
    funFact: "Neptunus ditemukan lewat prediksi matematis sebelum diamati langsung (1846).",
  },
  // --- Moons ---
  // Merkurius & Venus: tidak punya satelit alami (sengaja kosong).

  // Earth
  {
    id: "moon",
    name: "Bulan",
    type: "moon",
    parentId: "earth",
    radiusKm: 1_737.4,
    orbitRadius: 384_400,
    orbitalPeriodDays: 27.322,
    rotationPeriodHours: 655.7,
    axialTiltDeg: 6.68,
    inclinationDeg: 5.15,
    phaseOffset: 0.35,
    color: "#c0c0c0",
    description:
      "Satelit alami Bumi. Stabilisasi sumbu rotasi Bumi dan penggerak pasang surut.",
    composition: "Batuan silikat, regolith, inti besi kecil",
    funFact: "Bulan menjauh dari Bumi sekitar 3,8 cm per tahun.",
  },

  // Mars
  {
    id: "phobos",
    name: "Phobos",
    type: "moon",
    parentId: "mars",
    radiusKm: 11.27,
    orbitRadius: 9_376,
    orbitalPeriodDays: 0.3189,
    rotationPeriodHours: 7.66,
    axialTiltDeg: 0,
    inclinationDeg: 1.09,
    phaseOffset: 0.15,
    color: "#8a7060",
    description:
      "Satelit Mars yang lebih besar dan lebih dekat. Bentuknya tidak bulat sempurna, mirip asteroid yang tertangkap.",
    composition: "Batuan karbonaceous, regolith lepas, porus",
    funFact:
      "Phobos mengorbit lebih cepat dari rotasi Mars — terbit di barat, terbenam di timur.",
  },
  {
    id: "deimos",
    name: "Deimos",
    type: "moon",
    parentId: "mars",
    radiusKm: 6.2,
    orbitRadius: 23_463,
    orbitalPeriodDays: 1.263,
    rotationPeriodHours: 30.3,
    axialTiltDeg: 0,
    inclinationDeg: 0.93,
    phaseOffset: 0.62,
    color: "#9a8878",
    description:
      "Satelit Mars yang lebih kecil dan lebih jauh. Permukaan lebih halus karena regolith menutupi kawah.",
    composition: "Batuan tipe-C, regolith",
    funFact:
      "Dari permukaan Mars, Deimos tampak seperti bintang redup yang bergerak lambat di langit.",
  },

  // Jupiter — Galilean + sample inner/outer
  {
    id: "amalthea",
    name: "Amalthea",
    type: "moon",
    parentId: "jupiter",
    radiusKm: 83.5,
    orbitRadius: 181_400,
    orbitalPeriodDays: 0.498,
    rotationPeriodHours: 11.95,
    axialTiltDeg: 0,
    inclinationDeg: 0.37,
    phaseOffset: 0.08,
    color: "#c45c3a",
    description:
      "Bulan dalam Jupiter yang memerah, kemungkinan diwarnai belerang dari Io.",
    composition: "Es air berpori, batuan, belerang di permukaan",
    funFact: "Amalthea adalah salah satu bulan paling merah di tata surya.",
  },
  {
    id: "io",
    name: "Io",
    type: "moon",
    parentId: "jupiter",
    radiusKm: 1_821.6,
    orbitRadius: 421_700,
    orbitalPeriodDays: 1.769,
    rotationPeriodHours: 42.5,
    axialTiltDeg: 0,
    inclinationDeg: 0.05,
    phaseOffset: 0.1,
    color: "#e8d44d",
    description: "Bulan paling vulkanik di tata surya akibat gaya pasang Jupiter.",
    composition: "Silikat, belerang, lava",
    funFact: "Io memiliki ratusan gunung berapi aktif.",
  },
  {
    id: "europa",
    name: "Europa",
    type: "moon",
    parentId: "jupiter",
    radiusKm: 1_560.8,
    orbitRadius: 671_034,
    orbitalPeriodDays: 3.551,
    rotationPeriodHours: 85.2,
    axialTiltDeg: 0.1,
    inclinationDeg: 0.47,
    phaseOffset: 0.4,
    color: "#b8d4e8",
    description:
      "Permukaan es halus dengan samudra bawah permukaan — kandidat kuat untuk kehidupan.",
    composition: "Kerak es air, samudra asin, mantel silikat",
    funFact: "Samudra Europa mungkin berisi dua kali volume air di Bumi.",
  },
  {
    id: "ganymede",
    name: "Ganymede",
    type: "moon",
    parentId: "jupiter",
    radiusKm: 2_634.1,
    orbitRadius: 1_070_400,
    orbitalPeriodDays: 7.155,
    rotationPeriodHours: 171.7,
    axialTiltDeg: 0.2,
    inclinationDeg: 0.2,
    phaseOffset: 0.6,
    color: "#8a7a6a",
    description: "Bulan terbesar di tata surya — lebih besar dari Merkurius.",
    composition: "Es air, silikat, inti besi, medan magnet sendiri",
    funFact: "Ganymede adalah satu-satunya bulan dengan medan magnet intrinsik.",
  },
  {
    id: "callisto",
    name: "Callisto",
    type: "moon",
    parentId: "jupiter",
    radiusKm: 2_410.3,
    orbitRadius: 1_882_700,
    orbitalPeriodDays: 16.69,
    rotationPeriodHours: 400.5,
    axialTiltDeg: 0,
    inclinationDeg: 0.19,
    phaseOffset: 0.85,
    color: "#6b5c4c",
    description: "Permukaan paling berkawah di tata surya. Relatif tenang secara geologis.",
    composition: "Es air dan batuan",
    funFact: "Callisto tidak berada di resonansi orbit seperti tiga bulan Galilean lainnya.",
  },
  {
    id: "himalia",
    name: "Himalia",
    type: "moon",
    parentId: "jupiter",
    radiusKm: 85,
    orbitRadius: 11_461_000,
    orbitalPeriodDays: 250.6,
    rotationPeriodHours: 7.78,
    axialTiltDeg: 0,
    inclinationDeg: 27.5,
    phaseOffset: 0.55,
    color: "#9a8a70",
    description:
      "Bulan luar Jupiter yang besar (kelompok Himalia). Orbit miring, kemungkinan asteroid yang tertangkap.",
    composition: "Batuan tipe-C",
    funFact: "Himalia adalah bulan non-Galilean terbesar Jupiter.",
  },

  // Saturn — major icy moons
  {
    id: "mimas",
    name: "Mimas",
    type: "moon",
    parentId: "saturn",
    radiusKm: 198.2,
    orbitRadius: 185_540,
    orbitalPeriodDays: 0.942,
    rotationPeriodHours: 22.6,
    axialTiltDeg: 0,
    inclinationDeg: 1.57,
    phaseOffset: 0.12,
    color: "#d8d4cc",
    description:
      "Bulan kecil Saturnus dengan kawah Herschel raksasa — sering dijuluki mirip Death Star.",
    composition: "Es air hampir murni",
    funFact: "Kawah Herschel selebar sepertiga diameter Mimas.",
  },
  {
    id: "enceladus",
    name: "Enceladus",
    type: "moon",
    parentId: "saturn",
    radiusKm: 252.1,
    orbitRadius: 237_948,
    orbitalPeriodDays: 1.37,
    rotationPeriodHours: 32.9,
    axialTiltDeg: 0,
    inclinationDeg: 0.02,
    phaseOffset: 0.5,
    color: "#f0f4f8",
    description:
      "Bulan es kecil yang menyemburkan geysers air ke luar angkasa dari samudra bawah.",
    composition: "Es air, samudra asin, silikat",
    funFact: "Plume Enceladus menyuplai material ke cincin E Saturnus.",
  },
  {
    id: "tethys",
    name: "Tethys",
    type: "moon",
    parentId: "saturn",
    radiusKm: 531.1,
    orbitRadius: 294_660,
    orbitalPeriodDays: 1.888,
    rotationPeriodHours: 45.3,
    axialTiltDeg: 0,
    inclinationDeg: 1.12,
    phaseOffset: 0.28,
    color: "#e8e8e4",
    description:
      "Bulan es cerah Saturnus dengan ngarai Ithaca Chasma yang memanjang hampir sekeliling.",
    composition: "Es air",
    funFact: "Kepadatan Tethys mendekati es murni — hampir tanpa batuan.",
  },
  {
    id: "dione",
    name: "Dione",
    type: "moon",
    parentId: "saturn",
    radiusKm: 561.4,
    orbitRadius: 377_400,
    orbitalPeriodDays: 2.737,
    rotationPeriodHours: 65.7,
    axialTiltDeg: 0,
    inclinationDeg: 0.02,
    phaseOffset: 0.41,
    color: "#d0d0cc",
    description:
      "Bulan es-batuan dengan tebing es terang di belahan belakang (wispy terrain).",
    composition: "Es air dan batuan",
    funFact: "Cassini menemukan atmosfer oksigen sangat tipis di Dione.",
  },
  {
    id: "rhea",
    name: "Rhea",
    type: "moon",
    parentId: "saturn",
    radiusKm: 763.8,
    orbitRadius: 527_108,
    orbitalPeriodDays: 4.518,
    rotationPeriodHours: 108.4,
    axialTiltDeg: 0,
    inclinationDeg: 0.35,
    phaseOffset: 0.33,
    color: "#d8d4cc",
    description:
      "Bulan es-batuan terbesar kedua Saturnus. Permukaan tua penuh kawah.",
    composition: "Es air dan batuan",
    funFact: "Rhea mungkin punya cincin tipis sendiri — masih diperdebatkan.",
  },
  {
    id: "titan",
    name: "Titan",
    type: "moon",
    parentId: "saturn",
    radiusKm: 2_574.7,
    orbitRadius: 1_221_870,
    orbitalPeriodDays: 15.945,
    rotationPeriodHours: 382.7,
    axialTiltDeg: 0,
    inclinationDeg: 0.35,
    phaseOffset: 0.22,
    color: "#d4a060",
    atmosphereColor: "#e8b870",
    description:
      "Bulan terbesar Saturnus dengan atmosfer tebal dan danau metana cair di permukaan.",
    composition: "Es air, batuan, atmosfer nitrogen-metana",
    funFact: "Titan adalah satu-satunya bulan dengan atmosfer tebal yang signifikan.",
  },
  {
    id: "iapetus",
    name: "Iapetus",
    type: "moon",
    parentId: "saturn",
    radiusKm: 734.5,
    orbitRadius: 3_560_820,
    orbitalPeriodDays: 79.32,
    rotationPeriodHours: 1_903.7,
    axialTiltDeg: 0,
    inclinationDeg: 15.47,
    phaseOffset: 0.7,
    color: "#6a5a4a",
    description:
      "Bulan dua wajah: satu sisi sangat gelap, sisi lain cerah. Punggung pegunungan ekuator unik.",
    composition: "Es air dan material gelap organik",
    funFact: "Kontras gelap-terang Iapetus sudah membingungkan Cassini sejak abad ke-17.",
  },

  // Uranus — 5 major
  {
    id: "miranda",
    name: "Miranda",
    type: "moon",
    parentId: "uranus",
    radiusKm: 235.8,
    orbitRadius: 129_900,
    orbitalPeriodDays: 1.413,
    rotationPeriodHours: 33.9,
    axialTiltDeg: 0,
    inclinationDeg: 4.34,
    phaseOffset: 0.18,
    color: "#c8c4b8",
    description:
      "Bulan Uranus dengan permukaan paling ekstrem — tebing Verona Rupes setinggi puluhan km.",
    composition: "Es air dan batuan",
    funFact: "Miranda seolah “dibongkar-pasang” oleh gaya pasang di masa lalu.",
  },
  {
    id: "ariel",
    name: "Ariel",
    type: "moon",
    parentId: "uranus",
    radiusKm: 578.9,
    orbitRadius: 190_900,
    orbitalPeriodDays: 2.52,
    rotationPeriodHours: 60.5,
    axialTiltDeg: 0,
    inclinationDeg: 0.04,
    phaseOffset: 0.31,
    color: "#d0ccc0",
    description:
      "Bulan cerah Uranus dengan lembah dan aliran es yang menunjukkan aktivitas geologis.",
    composition: "Es air, amonia, batuan",
    funFact: "Ariel adalah bulan paling cerah di sistem Uranus.",
  },
  {
    id: "umbriel",
    name: "Umbriel",
    type: "moon",
    parentId: "uranus",
    radiusKm: 584.7,
    orbitRadius: 266_000,
    orbitalPeriodDays: 4.144,
    rotationPeriodHours: 99.5,
    axialTiltDeg: 0,
    inclinationDeg: 0.13,
    phaseOffset: 0.48,
    color: "#6a6860",
    description:
      "Bulan Uranus yang paling gelap di antara lima besar, penuh kawah tua.",
    composition: "Es air dan batuan gelap",
    funFact: "Kawah Wunda di Umbriel punya lantai cerah yang mencolok.",
  },
  {
    id: "titania",
    name: "Titania",
    type: "moon",
    parentId: "uranus",
    radiusKm: 788.4,
    orbitRadius: 435_910,
    orbitalPeriodDays: 8.706,
    rotationPeriodHours: 208.9,
    axialTiltDeg: 0,
    inclinationDeg: 0.34,
    phaseOffset: 0.44,
    color: "#c8c0b8",
    description:
      "Bulan terbesar Uranus. Patahan dan ngarai besar menandakan sejarah geologis aktif.",
    composition: "Es air dan batuan",
    funFact: "Titania dinamai dari ratu peri dalam karya Shakespeare.",
  },
  {
    id: "oberon",
    name: "Oberon",
    type: "moon",
    parentId: "uranus",
    radiusKm: 761.4,
    orbitRadius: 583_520,
    orbitalPeriodDays: 13.46,
    rotationPeriodHours: 323.1,
    axialTiltDeg: 0,
    inclinationDeg: 0.06,
    phaseOffset: 0.66,
    color: "#a8a090",
    description:
      "Bulan Uranus terjauh di antara lima besar. Permukaan tua, kawah dengan puncak sentral.",
    composition: "Es air dan batuan",
    funFact: "Oberon dinamai dari raja peri — pasangan Titania di Shakespeare.",
  },

  // Neptune
  {
    id: "proteus",
    name: "Proteus",
    type: "moon",
    parentId: "neptune",
    radiusKm: 210,
    orbitRadius: 117_647,
    orbitalPeriodDays: 1.122,
    rotationPeriodHours: 26.9,
    axialTiltDeg: 0,
    inclinationDeg: 0.04,
    phaseOffset: 0.2,
    color: "#5a5850",
    description:
      "Bulan dalam Neptunus yang gelap dan tidak bulat sempurna — salah satu bentuk irregular terbesar.",
    composition: "Es air dan batuan gelap",
    funFact: "Proteus baru ditemukan dari foto Voyager 2 (1989).",
  },
  {
    id: "triton",
    name: "Triton",
    type: "moon",
    parentId: "neptune",
    radiusKm: 1_353.4,
    orbitRadius: 354_759,
    orbitalPeriodDays: -5.877,
    rotationPeriodHours: 141.0,
    axialTiltDeg: 0,
    inclinationDeg: 156.9,
    phaseOffset: 0.27,
    color: "#d0c8c0",
    atmosphereColor: "#a8c8e0",
    description:
      "Bulan terbesar Neptunus dengan orbit retrogade — kemungkinan objek Sabuk Kuiper yang tertangkap. Memiliki geyser nitrogen.",
    composition: "Es nitrogen, air, batuan; atmosfer tipis N₂",
    funFact:
      "Orbit retrogade Triton unik di antara bulan-bulan besar; ia perlahan spiral menuju Neptunus.",
  },
  {
    id: "nereid",
    name: "Nereid",
    type: "moon",
    parentId: "neptune",
    radiusKm: 170,
    orbitRadius: 5_513_400,
    orbitalPeriodDays: 360.1,
    rotationPeriodHours: 11.5,
    axialTiltDeg: 0,
    inclinationDeg: 7.23,
    phaseOffset: 0.8,
    color: "#b0a898",
    description:
      "Bulan luar Neptunus dengan orbit sangat elips — salah satu yang paling eksentrik di tata surya.",
    composition: "Es air dan batuan",
    funFact: "Jarak Nereid ke Neptunus bisa berubah lebih dari 8× antara periapsis dan apoapsis.",
  },
];

export const bodyById = Object.fromEntries(
  celestialBodies.map((b) => [b.id, b]),
) as Record<string, CelestialBody>;

export const planets = celestialBodies.filter((b) => b.type === "planet");
export const moons = celestialBodies.filter((b) => b.type === "moon");
export const sun = bodyById.sun;

export function getChildren(parentId: string): CelestialBody[] {
  return celestialBodies.filter((b) => b.parentId === parentId);
}

export function formatDistance(au: number | undefined): string {
  if (au === undefined || au === 0) return "—";
  if (au < 0.01) return `${(au * 149_597_870.7).toFixed(0)} km`;
  return `${au.toFixed(3)} AU`;
}

export function formatRadius(km: number): string {
  if (km >= 1_000) return `${(km / 1_000).toFixed(1)} ribu km`;
  return `${km.toFixed(1)} km`;
}
