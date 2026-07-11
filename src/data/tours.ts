export interface TourStep {
  id: string;
  order: number;
  targetId: string;
  title: string;
  narration: string;
  durationSec: number;
}

/** Sequence for Prev/Next navigasi + Auto tour */
export const guidedTour: TourStep[] = [
  {
    id: "tour-sun",
    order: 0,
    targetId: "sun",
    title: "Matahari — Pusat Segalanya",
    narration:
      "Selamat datang di tata surya. Di pusatnya berdiam Matahari — bola plasma raksasa yang memberi energi bagi semua planet.",
    durationSec: 12,
  },
  {
    id: "tour-mercury",
    order: 1,
    targetId: "mercury",
    title: "Merkurius — Dunia Ekstrem",
    narration:
      "Merkurius mengorbit paling dekat. Siang hari mencapai ratusan derajat, malam hari membeku.",
    durationSec: 10,
  },
  {
    id: "tour-venus",
    order: 2,
    targetId: "venus",
    title: "Venus — Saudara Terbakar",
    narration:
      "Venus mirip Bumi dalam ukuran, namun atmosfer CO₂ tebal membuatnya lebih panas dari Merkurius.",
    durationSec: 10,
  },
  {
    id: "tour-earth",
    order: 3,
    targetId: "earth",
    title: "Bumi — Oasis Biru",
    narration:
      "Planet kita: air cair, atmosfer yang layak huni, dan satu bulan besar yang menstabilkan iklim.",
    durationSec: 12,
  },
  {
    id: "tour-moon",
    order: 4,
    targetId: "moon",
    title: "Bulan — Pendamping Setia",
    narration:
      "Bulan mengendalikan pasang surut dan pernah menjadi target pertama langkah manusia di luar Bumi.",
    durationSec: 10,
  },
  {
    id: "tour-mars",
    order: 5,
    targetId: "mars",
    title: "Mars — Cakrawala Berikutnya",
    narration:
      "Planet merah menyimpan gunung tertinggi dan ngarai terdalam, plus dua satelit kecil Phobos dan Deimos.",
    durationSec: 10,
  },
  {
    id: "tour-jupiter",
    order: 6,
    targetId: "jupiter",
    title: "Jupiter — Raja Planet",
    narration:
      "Raksasa gas terbesar, dengan badai abadi dan sistem bulan Galilean yang kaya.",
    durationSec: 11,
  },
  {
    id: "tour-saturn",
    order: 7,
    targetId: "saturn",
    title: "Saturnus — Mahkota Cincin",
    narration:
      "Cincin es Saturnus adalah salah satu pemandangan paling indah di tata surya.",
    durationSec: 11,
  },
  {
    id: "tour-uranus",
    order: 8,
    targetId: "uranus",
    title: "Uranus — Raksasa Es Miring",
    narration:
      "Uranus berotasi hampir miring 98° — seolah berguling di orbitnya. Raksasa es dengan bulan-bulan Shakespeare.",
    durationSec: 11,
  },
  {
    id: "tour-neptune",
    order: 9,
    targetId: "neptune",
    title: "Neptunus — Ujung Tata Surya",
    narration:
      "Planet terjauh. Angin superkencang dan bulan Triton yang mengorbit mundur menandai tepi sistem kita.",
    durationSec: 12,
  },
];
