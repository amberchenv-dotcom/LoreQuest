// Web Audio API Sound Synthesizer for instant, zero-latency SFX

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Resume context if suspended by browser autoplay policies
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a high-fidelity positive chime chord representing a correct answer.
 * Perfect for kid's cartoon interface with bright, cheerful frequencies.
 */
export function playCorrectSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Note 1: base sweet C5 tone
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(523.25, now); // C5
  osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
  
  gain1.gain.setValueAtTime(0.18, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
  
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.32);

  // Note 2: harmonizing bright E5 -> C6 slide
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
  osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.24); // C6
  
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.setValueAtTime(0.15, now + 0.08);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
  
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.08);
  osc2.stop(now + 0.42);
  
  // Note 3: sparkling high bell ping
  const osc3 = ctx.createOscillator();
  const gain3 = ctx.createGain();
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(1318.51, now + 0.16); // E6
  
  gain3.gain.setValueAtTime(0, now);
  gain3.gain.setValueAtTime(0.10, now + 0.16);
  gain3.gain.exponentialRampToValueAtTime(0.005, now + 0.45);
  
  osc3.connect(gain3);
  gain3.connect(ctx.destination);
  osc3.start(now + 0.16);
  osc3.stop(now + 0.46);
}

/**
 * Play a comic-style disappointed wah-wah downward frequency slide for wrong answers.
 * Uses biquad filter for smooth cartoon style to prevent sounding harsh to kids.
 */
export function playWrongSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Deep comical downward sliding buzz
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(220, now); // A3
  osc1.frequency.linearRampToValueAtTime(120, now + 0.4); // ~B2

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(600, now);
  filter.frequency.exponentialRampToValueAtTime(180, now + 0.4);

  gain1.gain.setValueAtTime(0.15, now);
  gain1.gain.linearRampToValueAtTime(0.01, now + 0.45);

  osc1.connect(filter);
  filter.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.46);

  // Comical low secondary sub-tone
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(147.14, now + 0.06); // D3
  osc2.frequency.linearRampToValueAtTime(92.50, now + 0.42); // F#2
  
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.setValueAtTime(0.14, now + 0.06);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.06);
  osc2.stop(now + 0.46);
}

/**
 * Play a swift high-frequency sweep when selecting or interacting with cards.
 */
export function playCardSelectSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(329.63, now); // E4
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.07); // A5

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}
