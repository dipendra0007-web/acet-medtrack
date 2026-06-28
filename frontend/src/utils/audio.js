/**
 * Synthesizes audible alarm buzzers and notification chimes in real-time
 * using the HTML5 Web Audio API, avoiding static file dependencies.
 */
export const playBuzzer = (type = 'default') => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    
    if (type === 'alarm') {
      // Alarm: High-pitched double beep to capture attention (incoming orders/requests)
      const playBeep = (delay, freq, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + duration);
        
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
      };
      
      playBeep(0, 880, 0.15); // A5
      playBeep(0.2, 880, 0.15);
      playBeep(0.4, 880, 0.15);
    } else if (type === 'success') {
      // Success: Sweet ascending arpeggio C-E-G-C (Order Delivered/Shipped)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.3); // C6
      
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'ready') {
      // Ready: Gentle dual chord (Order preparing)
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(329.63, audioCtx.currentTime); // E4
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(392.00, audioCtx.currentTime); // G4
      
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
      
      osc1.start(audioCtx.currentTime);
      osc2.start(audioCtx.currentTime);
      
      osc1.stop(audioCtx.currentTime + 0.45);
      osc2.stop(audioCtx.currentTime + 0.45);
    } else if (type === 'reached') {
      // Reached Location: Flashing, bright alarm (Driver at your door!)
      const playPing = (delay) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + delay); // C6
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + delay + 0.12);
        
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + 0.12);
      };
      
      playPing(0);
      playPing(0.1);
      playPing(0.2);
    } else {
      // Default: Simple alert tick
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.12);
    }
  } catch (err) {
    console.error('Audio synthesizer error:', err);
  }
};

export const playAlarmSound = () => {
  playBuzzer('alarm');
};
