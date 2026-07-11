/**
 * Space ambient + SFX via Web Audio API.
 * Louder, mid-range-heavy mix so it reads on laptop speakers / headphones.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambientGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let compressor: DynamicsCompressorNode | null = null;
let started = false;
let ambientPlaying = false;
const ambientOscs: OscillatorNode[] = [];
const ambientSources: AudioBufferSourceNode[] = [];
const ambientGains: GainNode[] = [];

function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();

    master = ctx.createGain();
    master.gain.value = 0.9;

    compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 18;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.25;

    master.connect(compressor);
    compressor.connect(ctx.destination);

    ambientGain = ctx.createGain();
    ambientGain.gain.value = 1;
    ambientGain.connect(master);

    sfxGain = ctx.createGain();
    sfxGain.gain.value = 1;
    sfxGain.connect(master);
  }
  return ctx;
}

function makeNoiseBuffer(
  c: AudioContext,
  seconds = 3,
  color: "white" | "pink" = "pink",
): AudioBuffer {
  const rate = c.sampleRate;
  const len = Math.floor(rate * seconds);
  const buf = c.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    let b0 = 0,
      b1 = 0,
      b2 = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      if (color === "white") {
        data[i] = white * 0.55;
      } else {
        // Simple pink-ish
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        data[i] = (b0 + b1 + b2 + white * 0.2) * 0.22;
      }
    }
  }
  return buf;
}

function startAmbientGraph() {
  const c = ensureContext();
  if (!c || !ambientGain || ambientPlaying) return;
  ambientPlaying = true;
  started = true;

  const t = c.currentTime;

  // --- Deep bed (felt) ---
  addDrone(c, 48, "sine", 0.22, t);
  addDrone(c, 72, "sine", 0.16, t);

  // --- Audible space pad (laptop speakers hear this) ---
  addDrone(c, 110, "triangle", 0.2, t);
  addDrone(c, 165, "sine", 0.14, t);
  addDrone(c, 220, "triangle", 0.1, t);
  addDrone(c, 329.6, "sine", 0.06, t); // E4 shimmer

  // Detuned stereo-ish fifth
  addDrone(c, 164.8, "sine", 0.08, t);
  addDrone(c, 246.9, "triangle", 0.07, t);

  // --- Pink noise wind / cosmic hiss ---
  const noise = c.createBufferSource();
  noise.buffer = makeNoiseBuffer(c, 4, "pink");
  noise.loop = true;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 900;
  lp.Q.value = 0.4;
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 80;
  const ng = c.createGain();
  ng.gain.value = 0;
  noise.connect(hp);
  hp.connect(lp);
  lp.connect(ng);
  ng.connect(ambientGain);
  noise.start(t);
  // Fade in noise so enable is obvious
  ng.gain.linearRampToValueAtTime(0.28, t + 1.2);
  ambientSources.push(noise);
  ambientGains.push(ng);

  // Slow filter breathe
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoG = c.createGain();
  lfoG.gain.value = 280;
  lfo.connect(lfoG);
  lfoG.connect(lp.frequency);
  lfo.start(t);
  ambientOscs.push(lfo);

  // Second airy layer
  const noise2 = c.createBufferSource();
  noise2.buffer = makeNoiseBuffer(c, 3, "pink");
  noise2.loop = true;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1400;
  bp.Q.value = 0.7;
  const ng2 = c.createGain();
  ng2.gain.value = 0;
  noise2.connect(bp);
  bp.connect(ng2);
  ng2.connect(ambientGain);
  noise2.start(t);
  ng2.gain.linearRampToValueAtTime(0.12, t + 1.5);
  ambientSources.push(noise2);
  ambientGains.push(ng2);
}

function addDrone(
  c: AudioContext,
  freq: number,
  type: OscillatorType,
  peak: number,
  t: number,
) {
  if (!ambientGain) return;
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  // slight detune for richness
  osc.detune.value = (Math.random() - 0.5) * 8;

  const g = c.createGain();
  g.gain.value = 0;
  osc.connect(g);
  g.connect(ambientGain);
  osc.start(t);
  // Fade in
  g.gain.linearRampToValueAtTime(peak, t + 1.4);

  // Slow amplitude LFO so it "breathes"
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.04 + Math.random() * 0.06;
  const lfoG = c.createGain();
  lfoG.gain.value = peak * 0.25;
  lfo.connect(lfoG);
  lfoG.connect(g.gain);
  lfo.start(t);

  ambientOscs.push(osc, lfo);
  ambientGains.push(g);
}

/** Must be called from a user gesture (click/key). */
export async function enableAudio(volume = 0.85): Promise<boolean> {
  const c = ensureContext();
  if (!c || !master || !ambientGain) return false;
  try {
    if (c.state === "suspended") await c.resume();
  } catch {
    return false;
  }

  const v = Math.max(0.05, Math.min(1, volume));
  master.gain.cancelScheduledValues(c.currentTime);
  master.gain.setValueAtTime(master.gain.value, c.currentTime);
  master.gain.linearRampToValueAtTime(v, c.currentTime + 0.15);

  ambientGain.gain.value = 1;
  startAmbientGraph();

  // Immediate confirmation chime so user knows audio works
  playEnableChime();
  return true;
}

export function setAudioMasterVolume(volume: number) {
  const c = ctx;
  if (!master || !c) return;
  const v = Math.max(0, Math.min(1, volume));
  master.gain.cancelScheduledValues(c.currentTime);
  master.gain.setValueAtTime(master.gain.value, c.currentTime);
  master.gain.linearRampToValueAtTime(v, c.currentTime + 0.08);
}

export function setAmbientMuted(muted: boolean) {
  if (!ambientGain || !ctx) return;
  const t = ctx.currentTime;
  ambientGain.gain.cancelScheduledValues(t);
  ambientGain.gain.setValueAtTime(ambientGain.gain.value, t);
  ambientGain.gain.linearRampToValueAtTime(muted ? 0 : 1, t + 0.2);
}

export function stopAudio() {
  setAmbientMuted(true);
}

export async function resumeIfNeeded() {
  const c = ensureContext();
  if (!c) return false;
  if (c.state === "suspended") {
    try {
      await c.resume();
    } catch {
      return false;
    }
  }
  return c.state === "running";
}

function playEnableChime() {
  const c = ensureContext();
  if (!c || !sfxGain || c.state !== "running") return;
  const t = c.currentTime;
  const freqs = [220, 330, 440];
  freqs.forEach((f, i) => {
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const g = c.createGain();
    g.gain.value = 0.0001;
    osc.connect(g);
    g.connect(sfxGain!);
    const start = t + i * 0.07;
    g.gain.exponentialRampToValueAtTime(0.35, start + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
    osc.start(start);
    osc.stop(start + 0.5);
  });
}

/** Cinematic whoosh on fly-to — audible on small speakers */
export function playFlyWhoosh() {
  const c = ensureContext();
  if (!c || !sfxGain) return;
  if (c.state !== "running") {
    void c.resume().then(() => playFlyWhoosh());
    return;
  }

  const t = c.currentTime;
  const noise = c.createBufferSource();
  noise.buffer = makeNoiseBuffer(c, 1.2, "pink");
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 280;
  filter.Q.value = 0.6;
  const g = c.createGain();
  g.gain.value = 0.0001;
  noise.connect(filter);
  filter.connect(g);
  g.connect(sfxGain);

  g.gain.exponentialRampToValueAtTime(0.7, t + 0.1);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.95);
  filter.frequency.exponentialRampToValueAtTime(2200, t + 0.4);
  filter.frequency.exponentialRampToValueAtTime(200, t + 0.95);

  // Layered low swoosh
  const osc = c.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = 90;
  const og = c.createGain();
  og.gain.value = 0.0001;
  const olp = c.createBiquadFilter();
  olp.type = "lowpass";
  olp.frequency.value = 400;
  osc.connect(olp);
  olp.connect(og);
  og.connect(sfxGain);
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.8);
  og.gain.exponentialRampToValueAtTime(0.25, t + 0.08);
  og.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

  noise.start(t);
  noise.stop(t + 1);
  osc.start(t);
  osc.stop(t + 0.9);
}

/** Clear blip when selecting a body */
export function playSelectBlip() {
  const c = ensureContext();
  if (!c || !sfxGain) return;
  if (c.state !== "running") {
    void c.resume().then(() => playSelectBlip());
    return;
  }
  const t = c.currentTime;
  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 520;
  const g = c.createGain();
  g.gain.value = 0.0001;
  osc.connect(g);
  g.connect(sfxGain);
  osc.frequency.exponentialRampToValueAtTime(780, t + 0.07);
  g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
  osc.start(t);
  osc.stop(t + 0.3);
}

export function playCaptureClick() {
  const c = ensureContext();
  if (!c || !sfxGain || c.state !== "running") return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = 980;
  const g = c.createGain();
  g.gain.value = 0.0001;
  osc.connect(g);
  g.connect(sfxGain);
  g.gain.exponentialRampToValueAtTime(0.35, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.start(t);
  osc.stop(t + 0.14);
}

export function isAudioRunning() {
  return !!ctx && ctx.state === "running" && ambientPlaying;
}
