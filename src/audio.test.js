// A pretend sound card, to check the music and the pop without any speakers.
const made = { osc: 0, gains: [] };
class FakeParam {
  constructor() { this.value = 1; }
  setValueAtTime() {} exponentialRampToValueAtTime() {} linearRampToValueAtTime() {}
  cancelScheduledValues() {} setTargetAtTime(v) { this.value = v; }
}
class FakeNode { connect() {} start() {} stop() {} }
class FakeContext {
  constructor() { this.state = 'running'; this.currentTime = 0; this.sampleRate = 8000; this.destination = {}; }
  resume() { return Promise.resolve(); }
  suspend() { return Promise.resolve(); }
  createGain() { const n = new FakeNode(); n.gain = new FakeParam(); made.gains.push(n); return n; }
  createOscillator() { made.osc += 1; const n = new FakeNode(); n.frequency = new FakeParam(); n.detune = new FakeParam(); return n; }
  createConvolver() { return new FakeNode(); }
  createBiquadFilter() { const n = new FakeNode(); n.frequency = new FakeParam(); return n; }
  createBufferSource() { return new FakeNode(); }
  createBuffer(c, len) { const d = new Float32Array(len); return { getChannelData: () => d }; }
}

test('music waits for the first tap, then starts; mute and unmute work; pop makes a sound', () => {
  window.AudioContext = FakeContext;
  jest.isolateModules(() => {
    const audio = require('./v2026/audio');
    audio.startMusic(); // asked at midnight, but no tap yet
    expect(audio.isPlaying()).toBe(false);
    expect(made.osc).toBe(0);

    audio.armAudio(); // her first tap
    expect(audio.isPlaying()).toBe(true);
    expect(made.osc).toBeGreaterThan(10);

    const before = made.osc;
    audio.playPop(3);
    expect(made.osc).toBe(before + 2);

    audio.setMuted(true);
    expect(audio.isMuted()).toBe(true);
    const muteBefore = made.osc;
    audio.playPop(4); // no pop while muted
    expect(made.osc).toBe(muteBefore);
    audio.setMuted(false);
    expect(audio.isMuted()).toBe(false);
    audio.stopAudio();
  });
  delete window.AudioContext;
});
