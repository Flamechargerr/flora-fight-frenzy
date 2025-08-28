/**
 * Sound Manager for Flora Fight Frenzy
 * Handles all audio effects and background music
 */

class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isMuted: boolean = false;
  private masterVolume: number = 0.7;

  private constructor() {
    this.initializeAudioContext();
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  // Create sound effects programmatically using Web Audio API
  private createSoundEffect(type: string, frequency: number, duration: number, volume: number = 0.3): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (type) {
        case 'shoot':
          // Quick laser-like sound
          sample = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 10) * volume;
          break;
        case 'plant':
          // Gentle planting sound
          sample = Math.sin(2 * Math.PI * (frequency - t * 100) * t) * Math.exp(-t * 5) * volume;
          break;
        case 'collect':
          // Happy collection sound
          sample = Math.sin(2 * Math.PI * (frequency + t * 200) * t) * Math.exp(-t * 8) * volume;
          break;
        case 'zombie_hit':
          // Impact sound
          sample = (Math.random() * 2 - 1) * Math.exp(-t * 15) * volume * 0.5;
          break;
        case 'wave_start':
          // Dramatic wave announcement
          sample = Math.sin(2 * Math.PI * frequency * t) * (1 - Math.exp(-t * 3)) * Math.exp(-t * 2) * volume;
          break;
        case 'victory':
          // Victory fanfare
          sample = Math.sin(2 * Math.PI * (frequency + Math.sin(t * 8) * 100) * t) * Math.exp(-t * 1) * volume;
          break;
        case 'game_over':
          // Dramatic game over sound
          sample = Math.sin(2 * Math.PI * (frequency - t * 300) * t) * Math.exp(-t * 2) * volume;
          break;
        default:
          sample = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 5) * volume;
      }

      data[i] = sample;
    }

    return buffer;
  }

  // Initialize all sound effects
  initSounds() {
    const soundEffects = [
      { name: 'shoot', frequency: 800, duration: 0.2 },
      { name: 'plant', frequency: 400, duration: 0.3 },
      { name: 'collect', frequency: 600, duration: 0.4 },
      { name: 'zombie_hit', frequency: 200, duration: 0.2 },
      { name: 'wave_start', frequency: 300, duration: 1.5 },
      { name: 'victory', frequency: 500, duration: 2.0 },
      { name: 'game_over', frequency: 250, duration: 2.0 },
    ];

    soundEffects.forEach(({ name, frequency, duration }) => {
      const buffer = this.createSoundEffect(name, frequency, duration);
      if (buffer) {
        this.sounds.set(name, buffer);
      }
    });
  }

  playSound(soundName: string, volume: number = 1.0) {
    if (this.isMuted || !this.audioContext) return;

    const buffer = this.sounds.get(soundName);
    if (!buffer) return;

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = buffer;
      gainNode.gain.value = volume * this.masterVolume;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start();
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  // Play contextual sounds based on game events
  playPlantSound() {
    this.playSound('plant', 0.6);
  }

  playShootSound() {
    this.playSound('shoot', 0.4);
  }

  playCollectSound() {
    this.playSound('collect', 0.8);
  }

  playZombieHitSound() {
    this.playSound('zombie_hit', 0.5);
  }

  playWaveStartSound() {
    this.playSound('wave_start', 0.9);
  }

  playVictorySound() {
    this.playSound('victory', 1.0);
  }

  playGameOverSound() {
    this.playSound('game_over', 0.8);
  }
}

export default SoundManager;