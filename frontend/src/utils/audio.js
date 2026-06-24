// Shared unlocked AudioContext for real-time alarm playback
let _sharedAudioCtx = null;
let _audioUnlocked = false;

function getAudioCtx() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!_sharedAudioCtx || _sharedAudioCtx.state === 'closed') {
    _sharedAudioCtx = new AudioContextClass();
  }
  return _sharedAudioCtx;
}

// Unlock AudioContext on first user interaction (required by browsers)
function unlockAudio() {
  if (_audioUnlocked) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    ctx.resume().then(() => {
      _audioUnlocked = true;
    }).catch(() => {});
  } else {
    _audioUnlocked = true;
  }
}

// Attach unlock to any user interaction events
['click', 'touchstart', 'keydown', 'pointerdown'].forEach(evt => {
  window.addEventListener(evt, unlockAudio, { once: false, passive: true });
});

export const playAlarmSound = () => {
  try {
    const audioCtx = getAudioCtx();
    if (!audioCtx) return;

    // Resume context if it was suspended (autoplay policy fix)
    const playBuzzer = () => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      // Square wave for harsh alarm buzzer
      osc.type = 'square';

      // Alternate between 880Hz and 660Hz every 100ms (siren-style)
      const duration = 2.0;
      const steps = Math.floor(duration / 0.1);
      const startTime = audioCtx.currentTime;
      for (let step = 0; step < steps; step++) {
        const freq = step % 2 === 0 ? 880 : 660;
        osc.frequency.setValueAtTime(freq, startTime + step * 0.1);
      }

      // Clean amplitude envelope — fade in, sustain, fade out
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.28, startTime + 0.05);
      gain.gain.setValueAtTime(0.28, startTime + duration - 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration);

      // Clean up oscillator after it's done playing
      osc.onended = () => {
        try { osc.disconnect(); } catch (_) {}
        try { gain.disconnect(); } catch (_) {}
      };
    };

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().then(playBuzzer).catch(() => {
        console.warn('AudioContext could not resume — user interaction required');
      });
    } else {
      playBuzzer();
    }
  } catch (error) {
    console.error('Alarm buzzer playback error:', error);
  }
};

