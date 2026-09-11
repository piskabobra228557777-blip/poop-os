/**
 * Web Audio API Sound Synthesizer & Music Engine for poopOS
 */

export type MusicTrackId = 'lofi' | 'cyber' | 'horror' | 'victory' | 'off';

export interface MusicTrackInfo {
  id: MusicTrackId;
  title: string;
  artist: string;
  genre: string;
  duration: string;
}

export const MUSIC_PLAYLIST: MusicTrackInfo[] = [
  { id: 'lofi', title: 'Liquid Glass Dreams', artist: 'poopOS Audio Lab', genre: 'Lofi Desktop Ambient', duration: '3:20' },
  { id: 'cyber', title: 'Cyber City 1984', artist: 'Neon Drift', genre: 'Synthwave / Chiptune', duration: '2:45' },
  { id: 'horror', title: 'Deep Midnight Focus', artist: 'Atmospheric Beats', genre: 'Ambient Meditation', duration: '4:10' },
  { id: 'victory', title: 'Pixel Level Complete', artist: 'Chiptune Lab', genre: 'Retro Arcade Fanfare', duration: '1:50' },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // BGM playback state
  private currentTrack: MusicTrackId = 'off';
  private bgmTimer: number | null = null;
  private bgmStep: number = 0;
  private bgmTempo: number = 110;
  private isPlayingBgm: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;

        this.bgmGain.connect(this.analyser);
        this.analyser.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public init() {
    this.getContext();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.85, this.ctx.currentTime);
    }
  }

  public setBgmVolume(volume: number) {
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public getAnalyserData(): Uint8Array {
    const defaultData = new Uint8Array(32);
    if (!this.analyser) return defaultData;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  // --- BACKGROUND MUSIC SYNTHESIZER ---

  public playBgm(trackId: MusicTrackId) {
    const ctx = this.getContext();
    if (!ctx) return;
    this.stopBgm();

    if (trackId === 'off') {
      this.currentTrack = 'off';
      this.isPlayingBgm = false;
      return;
    }

    this.currentTrack = trackId;
    this.isPlayingBgm = true;
    this.bgmStep = 0;

    if (trackId === 'lofi') {
      this.startLofiEngine();
    } else if (trackId === 'cyber') {
      this.startCyberEngine();
    } else if (trackId === 'horror') {
      this.startHorrorEngine();
    } else if (trackId === 'victory') {
      this.startVictoryEngine();
    }
  }

  public stopBgm() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.isPlayingBgm = false;
    this.currentTrack = 'off';
  }

  public getCurrentTrack(): MusicTrackId {
    return this.currentTrack;
  }

  public getIsPlayingBgm(): boolean {
    return this.isPlayingBgm;
  }

  // Track 1: Lofi Desktop Ambient Chords
  private startLofiEngine() {
    const ctx = this.getContext();
    if (!ctx || !this.bgmGain) return;

    // Chord progressions: Ebmaj7 -> Gm7 -> Abmaj7 -> Bb7
    const chords = [
      [311.13, 392.00, 466.16, 587.33], // Ebmaj7
      [392.00, 466.16, 587.33, 698.46], // Gm7
      [415.30, 519.30, 622.25, 783.99], // Abmaj7
      [466.16, 587.33, 698.46, 880.00], // Bb7
    ];
    const bass = [155.56, 196.00, 207.65, 233.08];

    const stepMs = 380; // Slow chill tempo
    this.bgmTimer = window.setInterval(() => {
      if (this.isMuted || !this.isPlayingBgm || !this.ctx || !this.bgmGain) return;
      const chordIndex = Math.floor((this.bgmStep % 16) / 4);
      const chord = chords[chordIndex];
      const now = this.ctx.currentTime;

      // Soft electric piano arpeggio note
      const noteFreq = chord[this.bgmStep % chord.length];
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, now);

      noteGain.gain.setValueAtTime(0.08, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(noteGain);
      noteGain.connect(this.bgmGain);
      osc.start(now);
      osc.stop(now + 0.65);

      // Bass note on first beat of bar
      if (this.bgmStep % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bass[chordIndex], now);
        bassGain.gain.setValueAtTime(0.18, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGain);
        bassOsc.start(now);
        bassOsc.stop(now + 1.25);
      }

      // Soft vinyl click
      if (this.bgmStep % 2 === 0) {
        this.playSoftNoiseHihat(0.02, 0.03);
      }

      this.bgmStep++;
    }, stepMs);
  }

  // Track 2: Cyber Synthwave / Chiptune Attack (Onion Theme)
  private startCyberEngine() {
    const ctx = this.getContext();
    if (!ctx || !this.bgmGain) return;

    const bassline = [110, 110, 130.81, 146.83, 110, 110, 164.81, 146.83];
    const melody = [440, 523.25, 659.25, 587.33, 440, 392, 523.25, 659.25];
    const stepMs = 150; // High energy 160 BPM

    this.bgmTimer = window.setInterval(() => {
      if (this.isMuted || !this.isPlayingBgm || !this.ctx || !this.bgmGain) return;
      const now = this.ctx.currentTime;
      const step = this.bgmStep % 8;

      // Punchy Sawtooth Synth Bass
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sawtooth';
      bassOsc.frequency.setValueAtTime(bassline[step], now);
      bassGain.gain.setValueAtTime(0.16, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      bassOsc.connect(bassGain);
      bassGain.connect(this.bgmGain);
      bassOsc.start(now);
      bassOsc.stop(now + 0.15);

      // Lead Melody note every other beat
      if (this.bgmStep % 2 === 0) {
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(melody[(this.bgmStep / 2) % melody.length], now);
        leadGain.gain.setValueAtTime(0.09, now);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        leadOsc.connect(leadGain);
        leadGain.connect(this.bgmGain);
        leadOsc.start(now);
        leadOsc.stop(now + 0.28);
      }

      // Cyber Kick/Snare
      if (step === 0 || step === 4) {
        this.playSynthKick();
      } else if (step === 2 || step === 6) {
        this.playSynthSnare();
      }

      this.bgmStep++;
    }, stepMs);
  }

  // Track 3: Cinematic Horror Ambient Drone
  private startHorrorEngine() {
    const ctx = this.getContext();
    if (!ctx || !this.bgmGain) return;

    const stepMs = 600;
    const horrorNotes = [55, 58.27, 61.74, 55, 73.42, 58.27];

    this.bgmTimer = window.setInterval(() => {
      if (this.isMuted || !this.isPlayingBgm || !this.ctx || !this.bgmGain) return;
      const now = this.ctx.currentTime;

      // Heavy low dissonant drone
      const droneOsc = this.ctx.createOscillator();
      const droneGain = this.ctx.createGain();
      const note = horrorNotes[this.bgmStep % horrorNotes.length];
      droneOsc.type = 'sawtooth';
      droneOsc.frequency.setValueAtTime(note, now);

      droneGain.gain.setValueAtTime(0.08, now);
      droneGain.gain.linearRampToValueAtTime(0.18, now + 0.4);
      droneGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      droneOsc.connect(droneGain);
      droneGain.connect(this.bgmGain);
      droneOsc.start(now);
      droneOsc.stop(now + 1.25);

      // Heartbeat pulse every 2 steps
      if (this.bgmStep % 2 === 0) {
        this.playHeartbeat();
      }

      this.bgmStep++;
    }, stepMs);
  }

  // Track 4: Arcade Victory Fanfare
  private startVictoryEngine() {
    const ctx = this.getContext();
    if (!ctx || !this.bgmGain) return;

    const victoryMelody = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51];
    const stepMs = 200;

    this.bgmTimer = window.setInterval(() => {
      if (this.isMuted || !this.isPlayingBgm || !this.ctx || !this.bgmGain) return;
      const now = this.ctx.currentTime;
      const note = victoryMelody[this.bgmStep % victoryMelody.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(now);
      osc.stop(now + 0.36);

      this.bgmStep++;
      if (this.bgmStep >= 28) {
        this.stopBgm();
      }
    }, stepMs);
  }

  // Synth drums helpers
  private playSynthKick() {
    const ctx = this.getContext();
    if (!ctx || !this.bgmGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.bgmGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.11);
  }

  private playSynthSnare() {
    this.playSoftNoiseHihat(0.12, 0.08);
  }

  private playHeartbeat() {
    const ctx = this.getContext();
    if (!ctx || !this.bgmGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(gain);
    gain.connect(this.bgmGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.19);
  }

  private playSoftNoiseHihat(gainLevel: number, duration: number) {
    const ctx = this.getContext();
    if (!ctx || !this.bgmGain) return;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gainLevel, ctx.currentTime);
    noise.connect(g);
    g.connect(this.bgmGain);
    noise.start();
  }

  // --- SOUND EFFECTS ---

  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  public playCalcButton() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(650, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  }

  public playCalcResult() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.04 + 0.15);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(ctx.currentTime + idx * 0.04);
      osc.stop(ctx.currentTime + idx * 0.04 + 0.16);
    });
  }

  public playWindowSwoosh() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(250, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  public playCameraClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }

  public playPaintStroke() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350 + Math.random() * 100, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.025);
  }

  public playError() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  public playShakeBoom() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }

  public playTypingKey() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freq = 600 + Math.random() * 400;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }

  public playBlackout() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.2);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  }

  public playGlitchZap() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    noise.connect(gain);
    gain.connect(this.sfxGain);
    noise.start();
  }

  public playPopAd() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  public playBouncePing() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const notes = [440, 554, 659, 880];
    const freq = notes[Math.floor(Math.random() * notes.length)];
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  public playFoundBitcoin() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.45);
    });
  }

  public playUsbPlugChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const chimeNotes = [440, 660, 880];
    chimeNotes.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.07);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(ctx.currentTime + i * 0.07);
      osc.stop(ctx.currentTime + i * 0.07 + 0.32);
    });
  }

  public startHorrorDrone() {
    this.playBgm('cyber');
  }

  public stopHorrorDrone() {
    this.stopBgm();
  }

  public playMonsterReveal() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(70, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(35, ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 1.25);
  }

  public playJumpscare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.sfxGain) return;
    // Layer 1: Harsh noise burst
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.2));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.9, ctx.currentTime);
    noise.connect(nGain);
    nGain.connect(this.sfxGain);
    noise.start();

    // Layer 2: Shrieking discordant oscillators
    [240, 360, 480, 850].forEach((freq) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.7);
      g.gain.setValueAtTime(0.4, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.72);
    });
  }

  public playGlassShatter() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted || !this.sfxGain) return;

    // Glass impact noise burst
    const bufferSize = ctx.sampleRate * 0.45;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Highpass filter for brittle glass crack sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3200, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.9, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start();

    // High resonant chimes of breaking shards
    [1800, 2400, 3100, 4200, 5600].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + 0.3 + idx * 0.05);

      g.gain.setValueAtTime(0.25, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35 + idx * 0.04);

      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(ctx.currentTime + idx * 0.02);
      osc.stop(ctx.currentTime + 0.45);
    });
  }

  public playEvilLaugh() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted || !this.sfxGain) return;

    // Deep sinister repetitive laugh steps
    const notes = [130, 115, 100, 85, 75];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';

      const startTime = ctx.currentTime + idx * 0.22;
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.linearRampToValueAtTime(freq - 15, startTime + 0.18);

      g.gain.setValueAtTime(0.4, startTime);
      g.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(startTime);
      osc.stop(startTime + 0.21);
    });
  }

  public playRecordScratch() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted || !this.sfxGain) return;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.25);

    g.gain.setValueAtTime(0.5, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  public playFunnyCartoonLaugh() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted || !this.sfxGain) return;

    // Cheerful bouncy laugh: "ha-ha-ha-ha-ha!" in high cheerful notes
    const pitches = [523.25, 659.25, 783.99, 659.25, 880, 1046.5];
    pitches.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';

      const st = ctx.currentTime + i * 0.12;
      osc.frequency.setValueAtTime(freq, st);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.08, st + 0.08);

      g.gain.setValueAtTime(0.35, st);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.11);

      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(st);
      osc.stop(st + 0.12);
    });

    // Add cartoon boing / slide sound at the end
    setTimeout(() => {
      this.playBouncePing();
    }, 700);
  }

  public playWhooshClose() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted || !this.sfxGain) return;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.35);

    g.gain.setValueAtTime(0.4, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  }

  public playJumpscareScreech() {
    this.playJumpscare();
  }

  public playSplitGlitch() {
    this.playGlitchZap();
  }

  public playVictoryFanfare() {
    this.playBgm('victory');
  }

  public playBlockedAction() {
    this.playError();
    this.playShakeBoom();
  }
}

export const sound = new SoundEngine();
