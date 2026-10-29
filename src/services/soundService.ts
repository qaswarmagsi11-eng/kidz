/**
 * Child-friendly audio and sound effects synthesizer using Web Audio API and Web Speech API.
 * Completely self-contained: works offline with zero missing network assets.
 */

class SoundService {
  private audioCtx: AudioContext | null = null;
  public soundEnabled = true;
  public musicEnabled = false;
  public narrationEnabled = true;
  private musicOscillators: OscillatorNode[] = [];
  private isPlayingMusic = false;

  private initCtx() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Cheerful short pop when tapping buttons
  playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // High marimba plink for counting objects
  playPlink(pitchMultiplier = 1) {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      const baseFreq = 440 * pitchMultiplier;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.15);
    } catch {
      // Fallback
    }
  }

  // Joyous celebration chord (C-E-G-C)
  playSuccess() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.18, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.35);
      });
    } catch {
      // Fallback
    }
  }

  // Gentle boing when an incorrect answer is picked (encouraging, never harsh)
  playBoing() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Fallback
    }
  }

  // Animal sound synthesizer
  playAnimalSound(animal: string) {
    if (!this.soundEnabled) return;
    const lower = animal.toLowerCase();
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      if (lower.includes('cat') || lower.includes('kitten')) {
        // Meow: rising then falling pitch
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.25);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.6);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (lower.includes('dog') || lower.includes('puppy')) {
        // Bark: two quick woofs
        [0, 0.18].forEach((offset) => {
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(280, now + offset);
          osc.frequency.exponentialRampToValueAtTime(160, now + offset + 0.12);
          gain.gain.setValueAtTime(0.25, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.12);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.12);
        });
      } else if (lower.includes('bird') || lower.includes('sparrow') || lower.includes('parrot')) {
        // Chirp: rapid high flutter
        [0, 0.1, 0.2].forEach((offset) => {
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400, now + offset);
          osc.frequency.exponentialRampToValueAtTime(2200, now + offset + 0.06);
          gain.gain.setValueAtTime(0.15, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.06);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.06);
        });
      } else if (lower.includes('cow')) {
        // Moo: low sustained drone
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.7);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (lower.includes('lion') || lower.includes('tiger') || lower.includes('bear')) {
        // Roar: low vibrato growl
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(85, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.8);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (lower.includes('duck')) {
        // Quack: nasal sound
        [0, 0.16].forEach((offset) => {
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, now + offset);
          osc.frequency.exponentialRampToValueAtTime(220, now + offset + 0.12);
          gain.gain.setValueAtTime(0.2, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.12);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.12);
        });
      } else {
        // Default happy animal chime
        this.playPlink(1.3);
      }
    } catch {
      // Fallback
    }
  }

  // Web Speech API for letter, number, and word pronunciation
  speak(text: string, lang = 'en-US', pitch = 1.2, rate = 0.9) {
    if (!this.narrationEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.pitch = pitch; // Slightly higher pitch for child-friendly tutor feel
      utterance.rate = rate; // Clear, easy pace for kids

      // Select matching voice if available
      const voices = window.speechSynthesis.getVoices();
      if (lang.startsWith('ur')) {
        const urduVoice = voices.find((v) => v.lang.includes('ur') || v.lang.includes('pk'));
        if (urduVoice) utterance.voice = urduVoice;
      } else {
        const friendlyVoice = voices.find((v) => (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Jenny')) && v.lang.startsWith('en'));
        if (friendlyVoice) utterance.voice = friendlyVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis error handling
    }
  }

  stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Toggle background lullaby music
  toggleMusic(force?: boolean) {
    const targetState = force !== undefined ? force : !this.musicEnabled;
    this.musicEnabled = targetState;

    if (!this.musicEnabled) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.musicEnabled;
  }

  private startMusic() {
    if (this.isPlayingMusic) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      this.isPlayingMusic = true;
      // Gentle pastel pentatonic notes: C4, D4, E4, G4, A4, C5
      const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
      let step = 0;

      const playNextNote = () => {
        if (!this.musicEnabled || !this.isPlayingMusic || !this.audioCtx) return;
        const note = notes[step % notes.length];
        step++;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 1.2);

        setTimeout(playNextNote, 1400);
      };

      playNextNote();
    } catch {
      this.isPlayingMusic = false;
    }
  }

  private stopMusic() {
    this.isPlayingMusic = false;
  }
}

export const sound = new SoundService();
