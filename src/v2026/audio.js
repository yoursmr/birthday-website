// All the sound in the 2026 gift is made by the browser itself (Web Audio).
// There are no music files, so nothing to download, nothing to pay for, and no copyright worries.
//
//   startMusic()  -> a soft music box lullaby starts and plays on a gentle loop
//   setMuted(x)   -> mute or unmute everything (her choice is remembered on her phone)
//   playPop(n)    -> the little "pop" when she catches a star (n = how many she has caught)
//   playBurst()   -> a soft firework sound
//
// Browsers do not allow sound until the person has tapped or clicked the page once.
// armAudio() is called on her first tap. If the music was asked for earlier (for example at
// midnight), it begins the moment the sound is allowed.

const MUTE_KEY = 'v26-muted';

let ctx = null;
let master = null;
let musicBus = null;
let started = false;
let wantMusic = false;
let muted = false;
let timer = 0;
let nextTime = 0;
let step = 0;
const listeners = new Set();

try {
  muted = window.localStorage.getItem(MUTE_KEY) === '1';
} catch (error) {
  muted = false;
}

const notify = () => listeners.forEach((fn) => fn());

export const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const isMuted = () => muted;
export const isPlaying = () => started && Boolean(ctx) && ctx.state === 'running';
export const audioSupported = () =>
  typeof window !== 'undefined' && Boolean(window.AudioContext || window.webkitAudioContext);

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

// A short echo room, made from decaying noise, so the notes sound like they ring in a hall.
function makeReverb(context) {
  const seconds = 2.6;
  const length = Math.floor(context.sampleRate * seconds);
  const buffer = context.createBuffer(2, length, context.sampleRate);
  for (let c = 0; c < 2; c += 1) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.4);
    }
  }
  const convolver = context.createConvolver();
  convolver.buffer = buffer;
  return convolver;
}

function ensureContext() {
  if (ctx) return ctx;
  if (!audioSupported()) return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  try {
    ctx = new Ctor();
  } catch (error) {
    ctx = null;
    return null;
  }
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 1;
  master.connect(ctx.destination);

  musicBus = ctx.createGain();
  musicBus.gain.value = 0.5;
  const dry = ctx.createGain();
  dry.gain.value = 0.7;
  const wet = ctx.createGain();
  wet.gain.value = 0.55;
  const reverb = makeReverb(ctx);
  musicBus.connect(dry);
  musicBus.connect(reverb);
  reverb.connect(wet);
  dry.connect(master);
  wet.connect(master);
  return ctx;
}

// One music box note: a bright bell tone that fades away.
function bell(when, midiNote, volume, length) {
  const f = midi(midiNote);
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, when);
  out.gain.exponentialRampToValueAtTime(volume, when + 0.012);
  out.gain.exponentialRampToValueAtTime(0.0001, when + length);
  out.connect(musicBus);
  [[1, 1], [2.01, 0.28], [3.98, 0.1]].forEach(([ratio, level]) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = f * ratio;
    g.gain.value = level;
    osc.connect(g);
    g.connect(out);
    osc.start(when);
    osc.stop(when + length + 0.05);
  });
}

// A slow, warm background note under the melody.
function pad(when, midiNote, length) {
  const out = ctx.createGain();
  out.gain.setValueAtTime(0.0001, when);
  out.gain.linearRampToValueAtTime(0.05, when + 1.2);
  out.gain.linearRampToValueAtTime(0.0001, when + length);
  out.connect(musicBus);
  [-4, 4].forEach((cents) => {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = midi(midiNote);
    osc.detune.value = cents;
    osc.connect(out);
    osc.start(when);
    osc.stop(when + length + 0.05);
  });
}

// Four chords, each lasting one bar of eight soft notes: C, Am, F, G (C major, gentle and happy).
const BARS = [
  { bass: 48, notes: [60, 64, 67, 71, 72, 71, 67, 64] },
  { bass: 45, notes: [57, 60, 64, 67, 69, 67, 64, 60] },
  { bass: 41, notes: [57, 60, 65, 69, 72, 69, 65, 60] },
  { bass: 43, notes: [59, 62, 67, 71, 74, 71, 67, 62] }
];
// A tiny tune that floats above the arpeggio, one note at the start of each bar pair.
const TUNE = [79, 76, 77, 74, 76, 72, 74, 71];
const EIGHTH = 0.42; // seconds per note, about 72 beats a minute

function schedule() {
  if (!ctx || !started) return;
  while (nextTime < ctx.currentTime + 2) {
    const bar = BARS[Math.floor(step / 8) % BARS.length];
    const inBar = step % 8;
    bell(nextTime, bar.notes[inBar], 0.16, 2.2);
    if (inBar === 0) {
      pad(nextTime, bar.bass, EIGHTH * 8 + 0.6);
      bell(nextTime, bar.bass + 12, 0.1, 2.8);
      const tune = TUNE[Math.floor(step / 8) % TUNE.length];
      bell(nextTime + EIGHTH * 0.02, tune, 0.12, 2.6);
    }
    if (inBar === 4) {
      const tune = TUNE[(Math.floor(step / 8) + 3) % TUNE.length];
      bell(nextTime, tune + 0, 0.09, 2.2);
    }
    nextTime += EIGHTH;
    step += 1;
  }
}

function begin() {
  if (started || !ctx) return;
  started = true;
  nextTime = ctx.currentTime + 0.2;
  schedule();
  timer = window.setInterval(schedule, 400);
  notify();
}

// Called on her first tap. Allows sound, and starts the music if it was asked for already.
export function armAudio() {
  const context = ensureContext();
  if (!context) return;
  if (context.state === 'suspended') {
    const resumed = context.resume();
    if (resumed && resumed.catch) resumed.catch(() => {});
  }
  if (wantMusic) begin();
  notify();
}

export function startMusic() {
  wantMusic = true;
  if (ctx) begin();
  // If the browser has not yet allowed sound, armAudio() will start it on her next tap.
}

export function setMuted(value) {
  muted = Boolean(value);
  try {
    window.localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch (error) {
    // Not remembering her choice is fine.
  }
  if (master && ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.08);
  }
  notify();
}

export function playPop(caught = 0) {
  if (!ctx || muted || ctx.state !== 'running') return;
  const now = ctx.currentTime;
  // The pop gets a little higher with every star, like a tiny scale.
  const pitch = 520 * Math.pow(2, (Math.min(caught, 22) % 12) / 12);

  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(pitch * 1.9, now);
  osc.frequency.exponentialRampToValueAtTime(pitch * 0.55, now + 0.13);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.32, now + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  osc.connect(g);
  g.connect(master);
  osc.start(now);
  osc.stop(now + 0.2);

  // A tiny click on top gives it the "pop" feel.
  const length = Math.floor(ctx.sampleRate * 0.03);
  const noise = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const src = ctx.createBufferSource();
  const ng = ctx.createGain();
  ng.gain.value = 0.18;
  src.buffer = noise;
  src.connect(ng);
  ng.connect(master);
  src.start(now);

  // And a soft sparkle ring
  bellOnMaster(now + 0.02, pitch * 3, 0.05);
}

function bellOnMaster(when, freq, volume) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(volume, when + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, when + 0.5);
  osc.connect(g);
  g.connect(master);
  osc.start(when);
  osc.stop(when + 0.55);
}

export function playBurst() {
  if (!ctx || muted || ctx.state !== 'running') return;
  const now = ctx.currentTime;
  const length = Math.floor(ctx.sampleRate * 0.5);
  const noise = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const g = ctx.createGain();
  filter.type = 'bandpass';
  filter.frequency.value = 2400;
  g.gain.value = 0.12;
  src.buffer = noise;
  src.connect(filter);
  filter.connect(g);
  g.connect(master);
  src.start(now);
  [0, 0.07, 0.14].forEach((delay, i) => bellOnMaster(now + delay, 1568 * Math.pow(1.25, i), 0.04));
}

// Stop the sound while the page is hidden, so it never plays in a closed tab.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) {
      ctx.suspend().catch(() => {});
    } else if (started || wantMusic) {
      ctx.resume().catch(() => {});
    }
  });
}

// For tests and for leaving the page.
export function stopAudio() {
  window.clearInterval(timer);
  started = false;
  wantMusic = false;
}
