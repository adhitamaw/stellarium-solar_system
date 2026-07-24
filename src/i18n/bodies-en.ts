/** English overlays for celestial body text fields */
export type BodyText = {
  name: string;
  description: string;
  composition: string;
  funFact: string;
};

export const bodiesEn: Record<string, BodyText> = {
  sun: {
    name: "Sun",
    description:
      "A G2V main-sequence star at the center of the solar system. It holds ~99.86% of the system’s mass.",
    composition: "Hydrogen (~73%), Helium (~25%), heavier elements",
    funFact: "Sunlight takes about 8 minutes 20 seconds to reach Earth.",
  },
  mercury: {
    name: "Mercury",
    description:
      "The smallest planet and closest to the Sun. A cratered, Moon-like surface with no natural moons.",
    composition: "Large iron core, silicate mantle",
    funFact: "A day on Mercury lasts longer than a year on Mercury.",
  },
  venus: {
    name: "Venus",
    description:
      "The hottest planet due to a runaway CO₂ greenhouse. No natural moons.",
    composition: "CO₂ atmosphere, volcanic surface",
    funFact: "Venus rotates backward — the Sun rises in the west.",
  },
  earth: {
    name: "Earth",
    description:
      "The only known planet that supports life. ~71% of the surface is water.",
    composition: "Nitrogen, oxygen, water, silicates, iron-nickel core",
    funFact: "Earth is the densest planet in the solar system.",
  },
  mars: {
    name: "Mars",
    description:
      "The red planet — iron-oxide rich surface. A prime target for human exploration.",
    composition: "Thin carbon dioxide, basalt, polar ice",
    funFact: "Olympus Mons is the tallest volcano in the solar system (~22 km).",
  },
  jupiter: {
    name: "Jupiter",
    description:
      "The largest gas giant. Its gravity and magnetic field shape the outer solar system.",
    composition: "Hydrogen, helium, traces of ammonia and methane",
    funFact: "The Great Red Spot is a storm lasting hundreds of years.",
  },
  saturn: {
    name: "Saturn",
    description:
      "Famous for its ice-and-rock ring system. Average density is lower than water.",
    composition: "Hydrogen, helium, ice-water rings",
    funFact: "Saturn would float in a giant bathtub — density ~0.69 g/cm³.",
  },
  uranus: {
    name: "Uranus",
    description:
      "An ice giant tilted nearly 98° — it rolls on its side around the Sun.",
    composition: "Water, ammonia, methane, hydrogen, helium",
    funFact: "Uranus’s spin axis is almost parallel to its orbital plane.",
  },
  neptune: {
    name: "Neptune",
    description:
      "The farthest planet. Supersonic winds up to ~2,100 km/h — the fastest in the system.",
    composition: "Water, ammonia, methane, hydrogen, helium",
    funFact: "Neptune was predicted mathematically before it was observed (1846).",
  },
  moon: {
    name: "Moon",
    description:
      "Earth’s natural satellite. It stabilizes Earth’s tilt and drives the tides.",
    composition: "Silicate rock, regolith, small iron core",
    funFact: "The Moon drifts away from Earth by about 3.8 cm per year.",
  },
  phobos: {
    name: "Phobos",
    description:
      "Mars’s larger, closer moon. Irregular and potato-shaped — likely a captured asteroid.",
    composition: "Carbonaceous rock, loose regolith, porous",
    funFact: "Phobos rises in the west and sets in the east on Mars.",
  },
  deimos: {
    name: "Deimos",
    description:
      "Mars’s smaller, farther moon. A smoother surface blanketed in regolith.",
    composition: "C-type rock, regolith",
    funFact: "From Mars, Deimos looks like a faint, slow-moving star.",
  },
  amalthea: {
    name: "Amalthea",
    description:
      "An inner Jovian moon, reddish — likely stained by sulfur from Io.",
    composition: "Porous water ice, rock, surface sulfur",
    funFact: "Amalthea is one of the reddest moons in the solar system.",
  },
  io: {
    name: "Io",
    description: "The most volcanic body in the solar system, driven by Jupiter’s tides.",
    composition: "Silicates, sulfur, lava",
    funFact: "Io has hundreds of active volcanoes.",
  },
  europa: {
    name: "Europa",
    description:
      "A smooth icy crust over a subsurface ocean — a top candidate for life.",
    composition: "Water-ice crust, salty ocean, silicate mantle",
    funFact: "Europa’s ocean may hold twice Earth’s surface water.",
  },
  ganymede: {
    name: "Ganymede",
    description: "The largest moon in the solar system — bigger than Mercury.",
    composition: "Water ice, silicates, iron core, own magnetic field",
    funFact: "Ganymede is the only moon with an intrinsic magnetic field.",
  },
  callisto: {
    name: "Callisto",
    description: "The most heavily cratered surface in the solar system.",
    composition: "Water ice and rock",
    funFact: "Callisto is not in the orbital resonance of the other Galileans.",
  },
  himalia: {
    name: "Himalia",
    description:
      "A large outer Jovian moon (Himalia group). Inclined orbit — likely captured.",
    composition: "C-type rock",
    funFact: "Himalia is Jupiter’s largest non-Galilean moon.",
  },
  mimas: {
    name: "Mimas",
    description:
      "A small Saturnian moon with giant Herschel crater — often compared to the Death Star.",
    composition: "Nearly pure water ice",
    funFact: "Herschel crater spans about one-third of Mimas’s diameter.",
  },
  enceladus: {
    name: "Enceladus",
    description:
      "A bright icy moon venting water plumes from a subsurface ocean.",
    composition: "Water ice, salty ocean, silicates",
    funFact: "Enceladus’s plumes feed Saturn’s E ring.",
  },
  tethys: {
    name: "Tethys",
    description:
      "A bright icy moon with Ithaca Chasma, a canyon nearly circling the globe.",
    composition: "Water ice",
    funFact: "Tethys’s density is near pure ice — almost no rock.",
  },
  dione: {
    name: "Dione",
    description:
      "An ice-rock moon with bright wispy cliffs on its trailing hemisphere.",
    composition: "Water ice and rock",
    funFact: "Cassini found a trace oxygen atmosphere on Dione.",
  },
  rhea: {
    name: "Rhea",
    description: "Saturn’s second-largest moon. An old, cratered ice-rock world.",
    composition: "Water ice and rock",
    funFact: "Rhea may have its own faint rings — still debated.",
  },
  titan: {
    name: "Titan",
    description:
      "Saturn’s largest moon — thick atmosphere and lakes of liquid methane.",
    composition: "Water ice, rock, nitrogen-methane atmosphere",
    funFact: "Titan is the only moon with a substantial atmosphere.",
  },
  iapetus: {
    name: "Iapetus",
    description:
      "A two-faced moon: one side dark, one bright, with a unique equatorial ridge.",
    composition: "Water ice and dark organic material",
    funFact: "Iapetus’s dark-bright contrast puzzled Cassini in the 1600s.",
  },
  miranda: {
    name: "Miranda",
    description:
      "Uranus’s most extreme surface — Verona Rupes cliffs tens of km high.",
    composition: "Water ice and rock",
    funFact: "Miranda looks as if it was torn apart and reassembled.",
  },
  ariel: {
    name: "Ariel",
    description:
      "A bright Uranian moon with valleys and icy flows suggesting past activity.",
    composition: "Water ice, ammonia, rock",
    funFact: "Ariel is the brightest of Uranus’s major moons.",
  },
  umbriel: {
    name: "Umbriel",
    description: "The darkest of Uranus’s five major moons, covered in old craters.",
    composition: "Water ice and dark rock",
    funFact: "Crater Wunda has a strikingly bright floor.",
  },
  titania: {
    name: "Titania",
    description:
      "Uranus’s largest moon. Huge canyons record a geologically active past.",
    composition: "Water ice and rock",
    funFact: "Named after the fairy queen in Shakespeare’s A Midsummer Night’s Dream.",
  },
  oberon: {
    name: "Oberon",
    description:
      "The outermost of Uranus’s five major moons. Ancient, cratered terrain.",
    composition: "Water ice and rock",
    funFact: "Named after the fairy king — Titania’s counterpart in Shakespeare.",
  },
  proteus: {
    name: "Proteus",
    description:
      "A dark, irregular inner Neptunian moon — one of the largest non-spherical bodies.",
    composition: "Water ice and dark rock",
    funFact: "Proteus was discovered in Voyager 2 images (1989).",
  },
  triton: {
    name: "Triton",
    description:
      "Neptune’s largest moon on a retrograde orbit — likely a captured Kuiper Belt object. Nitrogen geysers.",
    composition: "Nitrogen ice, water, rock; thin N₂ atmosphere",
    funFact: "Triton is slowly spiraling inward toward Neptune.",
  },
  nereid: {
    name: "Nereid",
    description:
      "An outer Neptunian moon with one of the most eccentric orbits known.",
    composition: "Water ice and rock",
    funFact: "Nereid’s distance from Neptune can vary by more than 8×.",
  },
  iss: {
    name: "ISS",
    description:
      "The International Space Station — a crewed orbital laboratory in low Earth orbit (~420 km). Built by NASA, Roscosmos, ESA, JAXA, and CSA.",
    composition: "Pressurized modules, truss, solar arrays, radiators",
    funFact:
      "The ISS orbits Earth about 16 times a day — one lap ~92 minutes at ~28,000 km/h.",
  },
  voyager1: {
    name: "Voyager 1",
    description:
      "NASA interplanetary probe (1977). After Jupiter and Saturn flybys, it is now in interstellar space — the farthest human-made object from Earth.",
    composition: "Aluminum bus, plutonium-238 RTG, 3.7 m high-gain antenna",
    funFact:
      "A one-way radio signal from Voyager 1 takes more than 22 hours to reach Earth.",
  },
  voyager2: {
    name: "Voyager 2",
    description:
      "Twin of Voyager 1 (1977). The only probe to visit Uranus and Neptune; now also in interstellar space.",
    composition: "Aluminum bus, plutonium-238 RTG, 3.7 m high-gain antenna",
    funFact:
      "Voyager 2 is the only spacecraft to complete a Grand Tour of all four giant planets.",
  },
};
