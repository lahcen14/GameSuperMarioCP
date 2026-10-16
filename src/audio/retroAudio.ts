/**
 * Web Audio API Retro 8-Bit Chiptune Synthesizer
 * Generates authentic retro music and sound effects programmatically without external files.
 */

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.4;
  private sfxVolume: number = 0.6;
  private currentStageTheme: string | null = null;
  private musicIntervalId: number | null = null;
  private isInitialized: boolean = false;

  constructor() {
    // Ensure sound starts enabled by default
    this.isMuted = false;
    try {
      const savedMusicVol = localStorage.getItem('cwa_music_vol');
      if (savedMusicVol !== null) this.musicVolume = parseFloat(savedMusicVol);
      const savedSfxVol = localStorage.getItem('cwa_sfx_vol');
      if (savedSfxVol !== null) this.sfxVolume = parseFloat(savedSfxVol);
    } catch {
      // Ignore storage errors
    }
  }

  public init() {
    if (this.isInitialized && this.ctx) {
      this.resumeContextIfNeeded();
      return;
    }

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      this.ctx = new AudioContextClass();

      this.musicGainNode = this.ctx.createGain();
      this.musicGainNode.gain.setValueAtTime(
        this.isMuted ? 0 : this.musicVolume,
        this.ctx.currentTime
      );
      this.musicGainNode.connect(this.ctx.destination);

      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.setValueAtTime(
        this.isMuted ? 0 : this.sfxVolume,
        this.ctx.currentTime
      );
      this.sfxGainNode.connect(this.ctx.destination);

      this.isInitialized = true;
      this.resumeContextIfNeeded();
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  public resumeContextIfNeeded() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('cwa_muted', String(muted));
    } catch {
      // ignore
    }
    if (this.ctx) {
      const now = this.ctx.currentTime;
      if (this.musicGainNode) {
        try {
          this.musicGainNode.gain.cancelScheduledValues(now);
          this.musicGainNode.gain.setValueAtTime(muted ? 0 : this.musicVolume, now);
        } catch {
          // ignore
        }
      }
      if (this.sfxGainNode) {
        try {
          this.sfxGainNode.gain.cancelScheduledValues(now);
          this.sfxGainNode.gain.setValueAtTime(muted ? 0 : this.sfxVolume, now);
        } catch {
          // ignore
        }
      }
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('cwa_music_vol', String(this.musicVolume));
    } catch {
      // ignore
    }
    if (this.musicGainNode && this.ctx && !this.isMuted) {
      try {
        this.musicGainNode.gain.cancelScheduledValues(this.ctx.currentTime);
        this.musicGainNode.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      } catch {
        // ignore
      }
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('cwa_sfx_vol', String(this.sfxVolume));
    } catch {
      // ignore
    }
    if (this.sfxGainNode && this.ctx && !this.isMuted) {
      try {
        this.sfxGainNode.gain.cancelScheduledValues(this.ctx.currentTime);
        this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      } catch {
        // ignore
      }
    }
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  // ==========================================
  // Sound Effects (8-Bit Synthesized FX)
  // ==========================================

  public playJump() {
    this.init();
    this.resumeContextIfNeeded();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      const t = this.ctx.currentTime;
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.12);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t);
      osc.stop(t + 0.13);
    } catch {
      // Safe fallback
    }
  }

  public playCoin() {
    this.init();
    this.resumeContextIfNeeded();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, t); // B5
      osc.frequency.setValueAtTime(1318.51, t + 0.08); // E6

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t);
      osc.stop(t + 0.25);
    } catch {
      // Safe fallback
    }
  }

  public playGem() {
    this.init();
    this.resumeContextIfNeeded();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGainNode) return;
        const t = this.ctx.currentTime + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.09);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);

        osc.start(t);
        osc.stop(t + 0.1);
      });
    } catch {
      // Safe fallback
    }
  }

  public playTerminalOpen() {
    this.init();
    this.resumeContextIfNeeded();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.18);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t);
      osc.stop(t + 0.19);
    } catch {
      // Safe fallback
    }
  }

  public playDoorOpen() {
    this.init();
    this.resumeContextIfNeeded();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    try {
      const chords = [440, 554.37, 659.25, 880];
      chords.forEach((freq, i) => {
        if (!this.ctx || !this.sfxGainNode) return;
        const t = this.ctx.currentTime + i * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);

        osc.start(t);
        osc.stop(t + 0.16);
      });
    } catch {
      // Safe fallback
    }
  }

  public playCorrectAnswer() {
    this.init();
    this.resumeContextIfNeeded();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    try {
      const melody = [
        { f: 523.25, d: 0.1 },  // C5
        { f: 659.25, d: 0.1 },  // E5
        { f: 783.99, d: 0.12 }, // G5
        { f: 1046.5, d: 0.28 }, // C6
      ];

      let delay = 0;
      melody.forEach((note) => {
        if (!this.ctx || !this.sfxGainNode) return;
        const t = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + note.d);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);

        osc.start(t);
        osc.stop(t + note.d + 0.02);

        delay += note.d * 0.8;
      });
    } catch {
      // Safe fallback
    }
  }

  public playWrongAnswer() {
    this.init();
    this.resumeContextIfNeeded();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    try {
      const notes = [220, 196, 174.61]; // A3, G3, F3
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGainNode) return;
        const t = this.ctx.currentTime + idx * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGainNode);

        osc.start(t);
        osc.stop(t + 0.13);
      });
    } catch {
      // Safe fallback
    }
  }

  public playDamage() {
    this.init();
    this.resumeContextIfNeeded();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t);
      osc.stop(t + 0.16);
    } catch {
      // Safe fallback
    }
  }

  public playHurt() {
    this.playDamage();
  }

  public playSpring() {
    this.init();
    this.resumeContextIfNeeded();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const t = this.ctx.currentTime;
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(750, t + 0.18);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t);
      osc.stop(t + 0.19);
    } catch {
      // Safe fallback
    }
  }

  public playDefeatEnemy() {
    this.init();
    this.resumeContextIfNeeded();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.12);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t);
      osc.stop(t + 0.13);
    } catch {
      // Safe fallback
    }
  }

  public playBossHit() {
    this.init();
    this.resumeContextIfNeeded();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.25);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t);
      osc.stop(t + 0.26);
    } catch {
      // Safe fallback
    }
  }

  public playStageClear() {
    this.init();
    this.resumeContextIfNeeded();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    try {
      const notes = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.12 }, // G5
        { f: 1046.5, d: 0.2 },  // C6
        { f: 880.0,  d: 0.15 }, // A5
        { f: 1046.5, d: 0.45 }, // C6
      ];

      let offset = 0;
      notes.forEach((n) => {
        if (!this.ctx || !this.sfxGainNode) return;
        const t = this.ctx.currentTime + offset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(n.f, t);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + n.d);
        osc.connect(gain);
        gain.connect(this.sfxGainNode);
        osc.start(t);
        osc.stop(t + n.d + 0.02);
        offset += n.d;
      });
    } catch {
      // Safe fallback
    }
  }

  // ==========================================
  // Background Music Synthesis Loops
  // ==========================================

  public stopMusic() {
    if (this.musicIntervalId !== null) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    this.currentStageTheme = null;
  }

  public playMusicForTheme(
    theme:
      | 'menu'
      | 'forest'
      | 'cpu_castle'
      | 'storage_caves'
      | 'hardware_lab'
      | 'digital_citadel'
      | 'boss'
  ) {
    this.init();
    this.resumeContextIfNeeded();
    if (!this.ctx || !this.musicGainNode) return;

    // If already actively playing this theme loop, do not interrupt
    if (this.currentStageTheme === theme && this.musicIntervalId !== null) {
      return;
    }

    this.stopMusic();
    this.currentStageTheme = theme;

    let beatIndex = 0;
    const tempoMap: Record<string, number> = {
      menu: 180,
      forest: 170,
      cpu_castle: 195,
      storage_caves: 160,
      hardware_lab: 200,
      digital_citadel: 210,
      boss: 220,
    };

    const intervalMs = 60000 / (tempoMap[theme] || 180) / 2; // eighth notes

    const playNote = (freq: number, type: OscillatorType, dur: number, vol = 0.15) => {
      if (!this.ctx || !this.musicGainNode || this.isMuted) return;
      try {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        const t = this.ctx.currentTime;
        const safeDur = Math.max(dur, 0.05);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + safeDur);

        osc.connect(gain);
        gain.connect(this.musicGainNode);

        osc.start(t);
        osc.stop(t + safeDur + 0.02);
      } catch {
        // Safe against browser audio glitches
      }
    };

    // Stage Melodic Sequences
    const melodyBank: Record<string, { lead: (number | null)[]; bass: (number | null)[] }> = {
      menu: {
        lead: [392, 440, 523.25, null, 659.25, 523.25, 440, null, 392, 523.25, 587.33, null, 659.25, null, 783.99, null],
        bass: [130.81, null, 130.81, null, 174.61, null, 174.61, null, 196.0, null, 196.0, null, 130.81, null, 130.81, null],
      },
      forest: {
        lead: [523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, null, 440, 523.25, 659.25, 523.25, 587.33, null, 392, null],
        bass: [130.81, null, 164.81, null, 196.0, null, 164.81, null, 146.83, null, 174.61, null, 196.0, null, 130.81, null],
      },
      cpu_castle: {
        lead: [440, 493.88, 523.25, 587.33, 659.25, 587.33, 523.25, 493.88, 440, 587.33, 659.25, 783.99, 880, null, 783.99, null],
        bass: [110, 110, 130.81, 130.81, 164.81, 164.81, 130.81, 130.81, 110, 110, 146.83, 146.83, 164.81, null, 110, null],
      },
      storage_caves: {
        lead: [329.63, null, 392, 440, 493.88, null, 440, 392, 329.63, null, 293.66, 329.63, 392, null, 329.63, null],
        bass: [82.41, null, 82.41, 98.0, 110.0, null, 98.0, 82.41, 73.42, null, 73.42, 82.41, 98.0, null, 82.41, null],
      },
      hardware_lab: {
        lead: [587.33, 659.25, 783.99, 880, 783.99, 659.25, 587.33, null, 659.25, 783.99, 880, 987.77, 880, 783.99, 659.25, null],
        bass: [146.83, null, 146.83, null, 174.61, null, 196.0, null, 164.81, null, 164.81, null, 196.0, null, 146.83, null],
      },
      digital_citadel: {
        lead: [659.25, 783.99, 880, 1046.5, 987.77, 880, 783.99, 659.25, 587.33, 659.25, 783.99, 880, 659.25, null, 880, null],
        bass: [164.81, 164.81, 196.0, 196.0, 220.0, 220.0, 196.0, 164.81, 146.83, 146.83, 164.81, 164.81, 196.0, null, 164.81, null],
      },
      boss: {
        lead: [440, 466.16, 440, 415.3, 440, 523.25, 493.88, 440, 466.16, 523.25, 587.33, 523.25, 466.16, 440, 415.3, 440],
        bass: [55, 55, 65.41, 65.41, 73.42, 73.42, 65.41, 55, 55, 65.41, 73.42, 82.41, 73.42, 65.41, 55, 55],
      },
    };

    const currentTrack = melodyBank[theme] || melodyBank.menu;

    this.musicIntervalId = window.setInterval(() => {
      try {
        const step = beatIndex % 16;

        const leadNote = currentTrack.lead[step];
        if (leadNote !== null) {
          playNote(leadNote, theme === 'boss' ? 'sawtooth' : 'square', 0.14, 0.12);
        }

        const bassNote = currentTrack.bass[step];
        if (bassNote !== null) {
          playNote(bassNote, 'triangle', 0.18, 0.22);
        }

        // Add a subtle 8-bit percussion tick on 0, 4, 8, 12
        if (step % 4 === 0 && this.ctx && this.musicGainNode && !this.isMuted) {
          try {
            const t = this.ctx.currentTime;
            const kickOsc = this.ctx.createOscillator();
            const kickGain = this.ctx.createGain();
            kickOsc.type = 'sine';
            kickOsc.frequency.setValueAtTime(120, t);
            kickOsc.frequency.exponentialRampToValueAtTime(30, t + 0.08);
            kickGain.gain.setValueAtTime(0.2, t);
            kickGain.gain.exponentialRampToValueAtTime(0.005, t + 0.08);
            kickOsc.connect(kickGain);
            kickGain.connect(this.musicGainNode);
            kickOsc.start(t);
            kickOsc.stop(t + 0.09);
          } catch {
            // Safe fallback
          }
        }

        beatIndex++;
      } catch {
        // Safe against loop errors
      }
    }, intervalMs);
  }
}

export const retroAudio = new RetroAudioEngine();
