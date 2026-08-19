/**
 * Ambient Celestial Sound Engine using Web Audio API
 * Generates peaceful, cinematic midnight ambient chords, rain/nature synthesis, and gentle interactive soundscapes.
 * 100% self-contained, no external audio files required.
 */

export type SoundscapeMode = 'birthday' | 'celestial' | 'rain' | 'zen';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volumeLevel = 0.35;
  private currentMode: SoundscapeMode = 'birthday';
  private masterGain: GainNode | null = null;
  private ambientTimer: number | null = null;
  private rainNode: AudioNode | null = null;
  private rainGain: GainNode | null = null;
  private chordIndex = 0;
  private birthdayNoteTimeouts: number[] = [];
  private listeners: Set<(isPlaying: boolean) => void> = new Set();

  private notifyListeners() {
    this.listeners.forEach((fn) => fn(this.isPlaying));
  }

  public subscribe(listener: (isPlaying: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // D minor / F major peaceful celestial chords: Dm9, Bbmaj7, Fmaj9, Cadd9, Asus4
  private chords = [
    [146.83, 220.0, 261.63, 329.63, 440.0],   // D3, A3, C4, E4, A4
    [116.54, 174.61, 233.08, 293.66, 349.23], // Bb2, F3, Bb3, D4, F4
    [174.61, 261.63, 329.63, 392.0, 523.25],  // F3, C4, E4, G4, C5
    [130.81, 196.0, 246.94, 293.66, 392.0],   // C3, G3, B3, D4, G4
    [110.0, 164.81, 220.0, 293.66, 329.63],   // A2, E3, A3, D4, E4
  ];

  // Zen Meditative Mode Pentatonic Chords (C# Minor / E Major Mystical)
  private zenChords = [
    [138.59, 207.65, 277.18, 329.63, 415.30], // C#m7
    [164.81, 246.94, 329.63, 392.00, 493.88], // Em9
    [110.00, 164.81, 220.00, 277.18, 329.63], // Amaj7
    [123.47, 185.00, 246.94, 311.13, 369.99], // Bsus4
  ];

  private pentatonicNotes = [
    220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volumeLevel, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMusic(callback?: (playing: boolean) => void): boolean {
    this.initContext();
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.startAmbient();
    } else {
      this.isPlaying = false;
      this.stopAmbient();
    }
    this.notifyListeners();
    if (callback) callback(this.isPlaying);
    return this.isPlaying;
  }

  public startMusic(callback?: (playing: boolean) => void): boolean {
    this.initContext();
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.startAmbient();
      this.notifyListeners();
    }
    if (callback) callback(this.isPlaying);
    return this.isPlaying;
  }

  public stopMusic(callback?: (playing: boolean) => void): boolean {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.stopAmbient();
      this.notifyListeners();
    }
    if (callback) callback(this.isPlaying);
    return this.isPlaying;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getMode(): SoundscapeMode {
    return this.currentMode;
  }

  public setMode(mode: SoundscapeMode) {
    this.currentMode = mode;
    if (this.isPlaying) {
      this.stopAmbient();
      this.startAmbient();
    }
  }

  public setVolume(vol: number) {
    this.volumeLevel = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volumeLevel, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volumeLevel;
  }

  public toggleMute(): boolean {
    if (!this.masterGain || !this.ctx) return this.isMuted;
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    } else {
      this.masterGain.gain.setTargetAtTime(this.volumeLevel, this.ctx.currentTime, 0.1);
    }
    return this.isMuted;
  }

  public startAmbient() {
    if (!this.ctx || !this.masterGain) return;

    if (this.currentMode === 'rain') {
      this.startRainAtmosphere();
    }

    if (this.currentMode === 'birthday') {
      this.playBirthdayCycle();
    } else {
      this.playNextChord();
    }
  }

  public stopAmbient() {
    if (this.ambientTimer) {
      window.clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
    this.birthdayNoteTimeouts.forEach((t) => window.clearTimeout(t));
    this.birthdayNoteTimeouts = [];
    this.stopRainAtmosphere();
  }

  private playBirthdayCycle() {
    if (!this.isPlaying || !this.ctx || !this.masterGain || this.currentMode !== 'birthday') return;

    const beat = 0.70; // 85 BPM relaxed, comforting lullaby tempo
    const now = this.ctx.currentTime;

    // Melody: [beatOffset, frequency, durationBeats, velocity]
    const melodyEvents: [number, number, number, number][] = [
      // Phrase 1: "Happy Birthday to You"
      [0.0, 261.63, 0.75, 0.22],   // C4
      [0.75, 261.63, 0.25, 0.18],  // C4
      [1.0, 293.66, 1.0, 0.24],    // D4
      [2.0, 261.63, 1.0, 0.22],    // C4
      [3.0, 349.23, 1.0, 0.25],    // F4
      [4.0, 329.63, 2.0, 0.26],    // E4

      // Phrase 2: "Happy Birthday to You"
      [6.5, 261.63, 0.75, 0.22],   // C4
      [7.25, 261.63, 0.25, 0.18],  // C4
      [7.5, 293.66, 1.0, 0.24],    // D4
      [8.5, 261.63, 1.0, 0.22],    // C4
      [9.5, 392.00, 1.0, 0.26],    // G4
      [10.5, 349.23, 2.0, 0.25],   // F4

      // Phrase 3: "Happy Birthday Dear Adnan"
      [13.0, 261.63, 0.75, 0.22],  // C4
      [13.75, 261.63, 0.25, 0.18], // C4
      [14.0, 523.25, 1.0, 0.28],   // C5
      [15.0, 440.00, 1.0, 0.26],   // A4
      [16.0, 349.23, 1.0, 0.25],   // F4
      [17.0, 329.63, 1.0, 0.24],   // E4
      [18.0, 293.66, 2.0, 0.25],   // D4

      // Phrase 4: "Happy Birthday to You"
      [20.5, 466.16, 0.75, 0.25],  // Bb4
      [21.25, 466.16, 0.25, 0.20], // Bb4
      [21.5, 440.00, 1.0, 0.26],   // A4
      [22.5, 349.23, 1.0, 0.25],   // F4
      [23.5, 392.00, 1.0, 0.25],   // G4
      [24.5, 349.23, 2.5, 0.28],   // F4

      // Gentle magical celestial sparkles
      [26.5, 880.00, 1.0, 0.12],   // A5
      [27.0, 1046.50, 1.0, 0.10],  // C6
      [27.5, 1396.91, 1.5, 0.08],  // F6
    ];

    // Background harmonic pad chords: [beatOffset, frequencies, durationBeats]
    const padChords: [number, number[], number][] = [
      [0.0, [174.61, 220.00, 261.63, 329.63], 4.0], // Fmaj7
      [4.0, [130.81, 196.00, 261.63, 329.63], 2.5], // Cmaj
      [6.5, [130.81, 196.00, 261.63, 329.63], 3.0], // Cmaj
      [9.5, [130.81, 196.00, 233.08, 349.23], 3.5], // C7 / F
      [13.0, [174.61, 261.63, 349.23, 440.00], 3.0], // Fmaj
      [16.0, [116.54, 174.61, 233.08, 293.66], 4.5], // Bbmaj
      [20.5, [116.54, 174.61, 233.08, 293.66], 2.0], // Bbmaj
      [21.5, [174.61, 220.00, 261.63, 349.23], 2.0], // Fmaj
      [23.5, [130.81, 196.00, 261.63, 329.63], 1.5], // Cmaj
      [24.5, [87.31, 174.61, 220.00, 261.63, 349.23], 4.5], // Fmaj resolution
    ];

    // Play melody notes
    melodyEvents.forEach(([beatOffset, freq, durBeats, velocity]) => {
      const delayMs = beatOffset * beat * 1000;
      const tid = window.setTimeout(() => {
        if (this.isPlaying && this.currentMode === 'birthday') {
          this.playMusicBoxNote(freq, durBeats * beat, velocity);
        }
      }, delayMs);
      this.birthdayNoteTimeouts.push(tid);
    });

    // Play pad chords
    padChords.forEach(([beatOffset, freqs, durBeats]) => {
      const delayMs = beatOffset * beat * 1000;
      const tid = window.setTimeout(() => {
        if (this.isPlaying && this.currentMode === 'birthday') {
          this.playWarmPadChord(freqs, durBeats * beat);
        }
      }, delayMs);
      this.birthdayNoteTimeouts.push(tid);
    });

    // Cycle repeat timer (approx 29 beats * 0.70s = 20.3s + 2.2s peaceful pause)
    const totalCycleMs = 29 * beat * 1000 + 2200;
    this.ambientTimer = window.setTimeout(() => {
      if (this.isPlaying && this.currentMode === 'birthday') {
        this.playBirthdayCycle();
      }
    }, totalCycleMs);
  }

  private playMusicBoxNote(frequency: number, duration: number, velocity = 0.2) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Filter for soft, sparkling music box warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2800, now);
    filter.connect(this.masterGain);

    // Primary fundamental tone
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, now);

    // Subtle 2nd harmonic for music-box celesta bell timbre
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2, now);

    // Envelope
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(velocity, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(duration, 1.4));

    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.linearRampToValueAtTime(velocity * 0.25, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(duration * 0.6, 0.8));

    osc1.connect(gain1);
    gain1.connect(filter);

    osc2.connect(gain2);
    gain2.connect(filter);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + Math.max(duration, 1.5));
    osc2.stop(now + Math.max(duration * 0.6, 0.9));
  }

  private playWarmPadChord(frequencies: number[], duration: number) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(900, now + duration * 0.5);
    filter.frequency.exponentialRampToValueAtTime(400, now + duration);
    filter.connect(this.masterGain);

    frequencies.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 6, now);

      const amp = idx === 0 ? 0.12 : 0.05 / (idx + 1);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(amp, now + 1.2 + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.8);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(now);
      osc.stop(now + duration + 1.0);
    });
  }

  private startRainAtmosphere() {
    if (!this.ctx || !this.masterGain) return;
    try {
      // Procedural pink noise generator for rain
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(800, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      whiteNoise.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      this.rainGain.connect(this.masterGain);

      whiteNoise.start(0);
      this.rainNode = whiteNoise;
    } catch {
      // Audio fallback safely
    }
  }

  private stopRainAtmosphere() {
    if (this.rainNode) {
      try {
        (this.rainNode as AudioBufferSourceNode).stop();
        this.rainNode.disconnect();
      } catch {
        // Safe catch
      }
      this.rainNode = null;
    }
    if (this.rainGain) {
      this.rainGain.disconnect();
      this.rainGain = null;
    }
  }

  private playNextChord() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const chordList = this.currentMode === 'zen' ? this.zenChords : this.chords;
    const chord = chordList[this.chordIndex % chordList.length];
    this.chordIndex++;

    const now = this.ctx.currentTime;
    const duration = this.currentMode === 'zen' ? 7.5 : 6.2; // slow, breathing ambient duration

    // Create soft warm low-pass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(this.currentMode === 'zen' ? 450 : 600, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + duration * 0.4);
    filter.frequency.exponentialRampToValueAtTime(500, now + duration);
    filter.connect(this.masterGain);

    chord.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Gentle detuning for lush stereo-like celestial feel
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

      // Volume envelope
      const baseAmp = idx === 0 ? 0.20 : 0.07 / (idx + 1);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(baseAmp, now + 1.8 + idx * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 1.0);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(now + idx * 0.15);
      osc.stop(now + duration + 1.2);
    });

    // Schedule subtle random chime in the chord
    const chimeCount = this.currentMode === 'zen' ? 1 : 2;
    for (let i = 0; i < chimeCount; i++) {
      const delay = 1.2 + Math.random() * (duration - 2.5);
      window.setTimeout(() => {
        if (this.isPlaying) {
          const note = this.pentatonicNotes[Math.floor(Math.random() * this.pentatonicNotes.length)];
          this.playBellChime(note, 0.06);
        }
      }, delay * 1000);
    }

    // Schedule next chord
    this.ambientTimer = window.setTimeout(() => {
      this.playNextChord();
    }, (duration - 1.2) * 1000);
  }

  public playBellChime(frequency = 587.33, volume = 0.12) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 2.3);
  }

  public playCandleBlowOut() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 1.2);
    filter.Q.setValueAtTime(2.0, now);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 1.2);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.3);

    // Follow with pleasant high bell flourish
    setTimeout(() => {
      this.playBellChime(659.25, 0.15);
      setTimeout(() => this.playBellChime(880.0, 0.18), 220);
      setTimeout(() => this.playBellChime(1318.51, 0.12), 440);
    }, 400);
  }

  public playStarClickSound() {
    this.playStarChime();
  }

  /**
   * Subtle, high-pitched crystalline star chime triggered on star discovery
   */
  public playStarChime(starIndex = 0) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // High-pitched crystalline celestial scale (C6 to D7: 1046Hz to 2349Hz)
    const starPitches = [1046.50, 1174.66, 1318.51, 1567.98, 1760.00, 1975.53, 2349.32];
    const baseFreq = starPitches[starIndex % starPitches.length] || 1567.98;

    // Primary crystalline sine tone
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, now);

    // Harmonic sparkle overtone
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now);

    // Filter to keep it silky, airy and non-harsh
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(5200, now);

    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.exponentialRampToValueAtTime(0.14, now + 0.012);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(filter);
    gain2.connect(filter);
    filter.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.5);
    osc2.stop(now + 1.0);
  }

  /**
   * Deep, resonant synth chord triggered when the full 'ADNAN' constellation completes
   */
  public playConstellationCompleteChord() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const duration = 5.0;

    // Deep, resonant D-celestial chord (D2, A2, D3, F#3, A3, C#4, E4)
    const chordFreqs = [73.42, 110.00, 146.83, 185.00, 220.00, 277.18, 329.63];

    // Resonant warm low-pass filter with gentle opening and closing
    const resonantFilter = this.ctx.createBiquadFilter();
    resonantFilter.type = 'lowpass';
    resonantFilter.Q.setValueAtTime(3.8, now);
    resonantFilter.frequency.setValueAtTime(220, now);
    resonantFilter.frequency.exponentialRampToValueAtTime(1400, now + 1.3);
    resonantFilter.frequency.exponentialRampToValueAtTime(320, now + duration);
    resonantFilter.connect(this.masterGain);

    chordFreqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Deep rich waveform mix
      osc.type = idx < 2 ? 'triangle' : idx === 2 ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Stereo spread detuning
      osc.detune.setValueAtTime((idx % 2 === 0 ? 1 : -1) * (4 + idx * 2.5), now);

      const amp = idx === 0 ? 0.24 : idx < 3 ? 0.16 : 0.09 / (idx - 1);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(amp, now + 0.35 + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(resonantFilter);

      osc.start(now);
      osc.stop(now + duration + 0.2);
    });

    // Layer a high shimmering star cascade 350ms after the deep synth hits
    setTimeout(() => {
      if (!this.ctx || !this.masterGain || this.isMuted) return;
      const chimeNotes = [880, 1046.5, 1318.51, 1567.98, 2093.0, 2349.32];
      chimeNotes.forEach((f, i) => {
        setTimeout(() => {
          this.playBellChime(f, 0.09);
        }, i * 90);
      });
    }, 350);
  }

  public playSuccessSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBellChime(freq, 0.14);
      }, idx * 120);
    });
  }

  public playUnwrapSound() {
    this.initContext();
    const notes = [329.63, 392.0, 493.88, 587.33, 783.99];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBellChime(freq, 0.12);
      }, idx * 80);
    });
  }

  public playSecretSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBellChime(freq, 0.18);
      }, idx * 90);
    });
  }

  public playWaxSealSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const notes = [392.0, 523.25, 783.99];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBellChime(freq, 0.15);
      }, idx * 110);
    });
  }

  /**
   * Subtle tactile acoustic 'pop' and wax snap sound for the wax seal break
   */
  public playWaxSealBreak() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // 1. Subtle acoustic tactile 'pop' (fast frequency drop transient)
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(320, now);
    popOsc.frequency.exponentialRampToValueAtTime(45, now + 0.06);

    popGain.gain.setValueAtTime(0.22, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    popOsc.connect(popGain);
    popGain.connect(this.masterGain);
    popOsc.start(now);
    popOsc.stop(now + 0.08);

    // 2. Crisp ceramic/wax snap click (filtered noise click)
    const snapOsc = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    const snapFilter = this.ctx.createBiquadFilter();

    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(1400, now);
    snapOsc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    snapFilter.type = 'bandpass';
    snapFilter.frequency.setValueAtTime(1800, now);
    snapFilter.Q.setValueAtTime(3.0, now);

    snapGain.gain.setValueAtTime(0.16, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    snapOsc.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(this.masterGain);
    snapOsc.start(now);
    snapOsc.stop(now + 0.06);

    // 3. Gentle celestial unwrap chime after 120ms
    setTimeout(() => {
      this.playBellChime(1174.66, 0.08);
      setTimeout(() => this.playBellChime(1567.98, 0.06), 80);
    }, 120);
  }
}

export const soundEngine = new SoundEngine();
