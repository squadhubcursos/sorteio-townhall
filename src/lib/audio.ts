let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function playTick() {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.frequency.value = 1000;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + 0.06);
  } catch {}
}

export function playBoom() {
  try {
    const ac = getCtx();
    const t = ac.currentTime;

    // Sub-bass thud: pitched sine that drops fast
    const subOsc = ac.createOscillator();
    const subGain = ac.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(120, t);
    subOsc.frequency.exponentialRampToValueAtTime(40, t + 0.25);
    subGain.gain.setValueAtTime(6.0, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    subOsc.connect(subGain);
    subGain.connect(ac.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.6);

    // Noise body: low-mid rumble
    const noiseLen = ac.sampleRate * 2.2;
    const noiseBuf = ac.createBuffer(1, noiseLen, ac.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) noiseData[i] = Math.random() * 2 - 1;
    const noiseSource = ac.createBufferSource();
    noiseSource.buffer = noiseBuf;
    const lowpass = ac.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(500, t);
    lowpass.frequency.exponentialRampToValueAtTime(80, t + 2.2);
    const noiseGain = ac.createGain();
    noiseGain.gain.setValueAtTime(4.0, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);
    noiseSource.connect(lowpass);
    lowpass.connect(noiseGain);
    noiseGain.connect(ac.destination);
    noiseSource.start(t);
    noiseSource.stop(t + 2.2);

    // High crack: short noise burst through highpass
    const crackBuf = ac.createBuffer(1, ac.sampleRate * 0.08, ac.sampleRate);
    const crackData = crackBuf.getChannelData(0);
    for (let i = 0; i < crackData.length; i++) crackData[i] = Math.random() * 2 - 1;
    const crackSource = ac.createBufferSource();
    crackSource.buffer = crackBuf;
    const highpass = ac.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 3000;
    const crackGain = ac.createGain();
    crackGain.gain.setValueAtTime(3.0, t);
    crackGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    crackSource.connect(highpass);
    highpass.connect(crackGain);
    crackGain.connect(ac.destination);
    crackSource.start(t);
    crackSource.stop(t + 0.08);
  } catch {}
}
