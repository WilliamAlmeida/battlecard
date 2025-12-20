// Sound Service - Sistema de áudio para o jogo

export interface SoundConfig {
  enabled: boolean;
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
}

class SoundService {
  private audioContext: AudioContext | null = null;
  private config: SoundConfig = {
    enabled: true,
    masterVolume: 0.7,
    sfxVolume: 0.8,
    musicVolume: 0.5
  };
  private bgMusic: HTMLAudioElement | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    try {
      const saved = localStorage.getItem('pokecard_sound_config');
      if (saved) {
        this.config = { ...this.config, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load sound config');
    }
  }

  saveConfig() {
    try {
      localStorage.setItem('pokecard_sound_config', JSON.stringify(this.config));
    } catch (e) {
      console.warn('Failed to save sound config');
    }
  }

  setEnabled(enabled: boolean) {
    this.config.enabled = enabled;
    if (!enabled && this.bgMusic) {
      this.bgMusic.pause();
    }
    this.saveConfig();
  }

  setMasterVolume(volume: number) {
    this.config.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.bgMusic) {
      this.bgMusic.volume = this.config.masterVolume * this.config.musicVolume;
    }
    this.saveConfig();
  }

  setSfxVolume(volume: number) {
    this.config.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveConfig();
  }

  setMusicVolume(volume: number) {
    this.config.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.bgMusic) {
      this.bgMusic.volume = this.config.masterVolume * this.config.musicVolume;
    }
    this.saveConfig();
  }

  getConfig(): SoundConfig {
    return { ...this.config };
  }

  // Sintetiza sons simples usando Web Audio API
  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Som de ataque
  playAttack() {
    if (!this.config.enabled) return;
    this.playSynthSound('attack', [
      { freq: 200, duration: 0.05, type: 'sawtooth' },
      { freq: 400, duration: 0.1, type: 'square' },
      { freq: 150, duration: 0.15, type: 'sawtooth' }
    ]);
  }

  // Som de dano
  playDamage() {
    if (!this.config.enabled) return;
    this.playSynthSound('damage', [
      { freq: 100, duration: 0.1, type: 'square' },
      { freq: 80, duration: 0.15, type: 'sawtooth' }
    ]);
  }

  // Som de invocação
  playSummon() {
    if (!this.config.enabled) return;
    this.playSynthSound('summon', [
      { freq: 300, duration: 0.1, type: 'sine' },
      { freq: 400, duration: 0.1, type: 'sine' },
      { freq: 500, duration: 0.1, type: 'sine' },
      { freq: 600, duration: 0.2, type: 'sine' }
    ]);
  }

  // Som de vitória
  playVictory() {
    if (!this.config.enabled) return;
    this.playSynthSound('victory', [
      { freq: 523, duration: 0.15, type: 'sine' },
      { freq: 659, duration: 0.15, type: 'sine' },
      { freq: 784, duration: 0.15, type: 'sine' },
      { freq: 1047, duration: 0.3, type: 'sine' }
    ]);
  }

  // Som de derrota
  playDefeat() {
    if (!this.config.enabled) return;
    this.playSynthSound('defeat', [
      { freq: 400, duration: 0.2, type: 'sawtooth' },
      { freq: 300, duration: 0.2, type: 'sawtooth' },
      { freq: 200, duration: 0.3, type: 'sawtooth' },
      { freq: 100, duration: 0.4, type: 'sawtooth' }
    ]);
  }

  // Som de comprar carta
  playDraw() {
    if (!this.config.enabled) return;
    this.playSynthSound('draw', [
      { freq: 800, duration: 0.05, type: 'sine' },
      { freq: 1000, duration: 0.05, type: 'sine' }
    ]);
  }

  // Som de usar magia
  playSpell() {
    if (!this.config.enabled) return;
    this.playSynthSound('spell', [
      { freq: 600, duration: 0.1, type: 'sine' },
      { freq: 900, duration: 0.1, type: 'triangle' },
      { freq: 1200, duration: 0.15, type: 'sine' }
    ]);
  }

  // Som de ativar armadilha
  playTrap() {
    if (!this.config.enabled) return;
    this.playSynthSound('trap', [
      { freq: 150, duration: 0.1, type: 'square' },
      { freq: 200, duration: 0.1, type: 'square' },
      { freq: 300, duration: 0.2, type: 'sawtooth' }
    ]);
  }

  // Som de buff
  playBuff() {
    if (!this.config.enabled) return;
    this.playSynthSound('buff', [
      { freq: 400, duration: 0.1, type: 'triangle' },
      { freq: 500, duration: 0.1, type: 'triangle' },
      { freq: 600, duration: 0.15, type: 'triangle' }
    ]);
  }

  // Som de debuff/status
  playDebuff() {
    if (!this.config.enabled) return;
    this.playSynthSound('debuff', [
      { freq: 300, duration: 0.1, type: 'sawtooth' },
      { freq: 200, duration: 0.15, type: 'sawtooth' }
    ]);
  }

  // Som de clique/UI
  playClick() {
    if (!this.config.enabled) return;
    this.playSynthSound('click', [
      { freq: 1000, duration: 0.03, type: 'sine' }
    ]);
  }

  // Som de erro
  playError() {
    if (!this.config.enabled) return;
    this.playSynthSound('error', [
      { freq: 200, duration: 0.1, type: 'square' },
      { freq: 150, duration: 0.15, type: 'square' }
    ]);
  }

  // Som de achievement
  playAchievement() {
    if (!this.config.enabled) return;
    this.playSynthSound('achievement', [
      { freq: 523, duration: 0.1, type: 'sine' },
      { freq: 659, duration: 0.1, type: 'sine' },
      { freq: 784, duration: 0.1, type: 'sine' },
      { freq: 1047, duration: 0.2, type: 'sine' },
      { freq: 1318, duration: 0.3, type: 'sine' }
    ]);
  }

  // Som de cura
  playHeal() {
    if (!this.config.enabled) return;
    this.playSynthSound('heal', [
      { freq: 400, duration: 0.1, type: 'sine' },
      { freq: 600, duration: 0.1, type: 'sine' },
      { freq: 800, duration: 0.15, type: 'sine' }
    ]);
  }

  // Som de destruição
  playDestroy() {
    if (!this.config.enabled) return;
    this.playSynthSound('destroy', [
      { freq: 150, duration: 0.1, type: 'sawtooth' },
      { freq: 100, duration: 0.2, type: 'sawtooth' },
      { freq: 50, duration: 0.3, type: 'sawtooth' }
    ]);
  }

  private playSynthSound(
    name: string,
    notes: { freq: number; duration: number; type: OscillatorType }[]
  ) {
    try {
      const ctx = this.initAudioContext();
      const volume = this.config.masterVolume * this.config.sfxVolume;
      
      let startTime = ctx.currentTime;
      
      notes.forEach(note => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = note.type;
        oscillator.frequency.setValueAtTime(note.freq, startTime);
        
        gainNode.gain.setValueAtTime(volume * 0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + note.duration);
        
        startTime += note.duration * 0.8;
      });
    } catch (e) {
      console.warn('Failed to play sound:', name);
    }
  }
}

export const soundService = new SoundService();
