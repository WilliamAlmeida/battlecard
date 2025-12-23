// Achievements Service - Sistema de conquistas
import { Achievement, AchievementCondition, ElementType, StatusEffect } from '../types';
import { statsService } from './statsService';

const ACHIEVEMENTS_KEY = 'pokecard_achievements';

export const ACHIEVEMENTS_LIST: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  // Vitórias
  {
    id: 'first_win',
    name: 'Primeira Vitória',
    description: 'Vença sua primeira batalha',
    icon: '🏆',
    condition: { type: 'WINS', value: 1 },
    reward: { type: 'COINS', value: 100 },
    maxProgress: 1
  },
  {
    id: 'veteran',
    name: 'Veterano',
    description: 'Vença 10 batalhas',
    icon: '⭐',
    condition: { type: 'WINS', value: 10 },
    reward: { type: 'PACK', value: 1 },
    maxProgress: 10
  },
  {
    id: 'champion',
    name: 'Campeão',
    description: 'Vença 50 batalhas',
    icon: '👑',
    condition: { type: 'WINS', value: 50 },
    reward: { type: 'PACK', value: 3 },
    maxProgress: 50
  },
  {
    id: 'legend',
    name: 'Lenda',
    description: 'Vença 100 batalhas',
    icon: '🌟',
    condition: { type: 'WINS', value: 100 },
    reward: { type: 'CARD', value: 'mewtwo' },
    maxProgress: 100
  },
  
  // Streaks
  {
    id: 'hot_streak',
    name: 'Em Chamas',
    description: 'Vença 3 batalhas seguidas',
    icon: '🔥',
    condition: { type: 'WINS_STREAK', value: 3 },
    maxProgress: 3
  },
  {
    id: 'unstoppable',
    name: 'Imparável',
    description: 'Vença 5 batalhas seguidas',
    icon: '💪',
    condition: { type: 'WINS_STREAK', value: 5 },
    reward: { type: 'COINS', value: 500 },
    maxProgress: 5
  },
  {
    id: 'godlike',
    name: 'Divino',
    description: 'Vença 10 batalhas seguidas',
    icon: '👼',
    condition: { type: 'WINS_STREAK', value: 10 },
    reward: { type: 'PACK', value: 5 },
    maxProgress: 10
  },
  
  // Perfeitos
  {
    id: 'perfect',
    name: 'Perfeito',
    description: 'Vença sem perder HP',
    icon: '💎',
    condition: { type: 'PERFECT_WIN', value: 1 },
    maxProgress: 1
  },
  {
    id: 'flawless',
    name: 'Impecável',
    description: 'Vença 5 batalhas sem perder HP',
    icon: '✨',
    condition: { type: 'PERFECT_WIN', value: 5 },
    reward: { type: 'COINS', value: 1000 },
    maxProgress: 5
  },
  
  // Dano
  {
    id: 'destroyer',
    name: 'Destruidor',
    description: 'Cause 50.000 de dano total',
    icon: '💥',
    condition: { type: 'DAMAGE_DEALT', value: 50000 },
    maxProgress: 50000
  },
  {
    id: 'annihilator',
    name: 'Aniquilador',
    description: 'Cause 200.000 de dano total',
    icon: '☄️',
    condition: { type: 'DAMAGE_DEALT', value: 200000 },
    reward: { type: 'PACK', value: 3 },
    maxProgress: 200000
  },
  
  // Cartas destruídas
  {
    id: 'hunter',
    name: 'Caçador',
    description: 'Destrua 50 Pokémon inimigos',
    icon: '🎯',
    condition: { type: 'CARDS_DESTROYED', value: 50 },
    maxProgress: 50
  },
  {
    id: 'exterminator',
    name: 'Exterminador',
    description: 'Destrua 200 Pokémon inimigos',
    icon: '💀',
    condition: { type: 'CARDS_DESTROYED', value: 200 },
    reward: { type: 'COINS', value: 2000 },
    maxProgress: 200
  },
  
  // Tipos
  {
    id: 'fire_master',
    name: 'Mestre do Fogo',
    description: 'Vença 10 batalhas usando apenas Pokémon de Fogo',
    icon: '🔥',
    condition: { type: 'TYPE_WIN', value: 10, elementType: ElementType.FIRE },
    maxProgress: 10
  },
  {
    id: 'water_master',
    name: 'Mestre da Água',
    description: 'Vença 10 batalhas usando apenas Pokémon de Água',
    icon: '💧',
    condition: { type: 'TYPE_WIN', value: 10, elementType: ElementType.WATER },
    maxProgress: 10
  },
  {
    id: 'grass_master',
    name: 'Mestre de Planta',
    description: 'Vença 10 batalhas usando apenas Pokémon de Planta',
    icon: '🌿',
    condition: { type: 'TYPE_WIN', value: 10, elementType: ElementType.GRASS },
    maxProgress: 10
  },
  {
    id: 'electric_master',
    name: 'Mestre Elétrico',
    description: 'Vença 10 batalhas usando apenas Pokémon Elétricos',
    icon: '⚡',
    condition: { type: 'TYPE_WIN', value: 10, elementType: ElementType.ELECTRIC },
    maxProgress: 10
  },
  {
    id: 'psychic_master',
    name: 'Mestre Psíquico',
    description: 'Vença 10 batalhas usando apenas Pokémon Psíquicos',
    icon: '🔮',
    condition: { type: 'TYPE_WIN', value: 10, elementType: ElementType.PSYCHIC },
    maxProgress: 10
  },
  
  // Survival
  {
    id: 'survivor',
    name: 'Sobrevivente',
    description: 'Chegue à onda 5 no Modo Survival',
    icon: '🛡️',
    condition: { type: 'SURVIVAL_WAVES', value: 5 },
    maxProgress: 5
  },
  {
    id: 'endurance',
    name: 'Resistência',
    description: 'Chegue à onda 10 no Modo Survival',
    icon: '🏅',
    condition: { type: 'SURVIVAL_WAVES', value: 10 },
    reward: { type: 'PACK', value: 2 },
    maxProgress: 10
  },
  {
    id: 'immortal',
    name: 'Imortal',
    description: 'Chegue à onda 20 no Modo Survival',
    icon: '♾️',
    condition: { type: 'SURVIVAL_WAVES', value: 20 },
    reward: { type: 'CARD', value: 'mew' },
    maxProgress: 20
  },
  
  // Spells e Traps
  {
    id: 'spellcaster',
    name: 'Feiticeiro',
    description: 'Use 20 cartas de magia',
    icon: '🪄',
    condition: { type: 'SPELLS_USED', value: 20 },
    maxProgress: 20
  },
  {
    id: 'trap_master',
    name: 'Mestre das Armadilhas',
    description: 'Ative 20 armadilhas',
    icon: '🪤',
    condition: { type: 'TRAPS_ACTIVATED', value: 20 },
    maxProgress: 20
  },
  
  // Status
  {
    id: 'burner',
    name: 'Incendiário',
    description: 'Queime 30 Pokémon inimigos',
    icon: '🔥',
    condition: { type: 'STATUS_INFLICTED', value: 30 },
    maxProgress: 30
  },
  {
    id: 'freezer',
    name: 'Congelador',
    description: 'Congele 30 Pokémon inimigos',
    icon: '🧊',
    condition: { type: 'STATUS_INFLICTED', value: 30 },
    maxProgress: 30
  },
  
  // Legendary
  {
    id: 'legendary_caller',
    name: 'Invocador Lendário',
    description: 'Invoque um Pokémon Lendário',
    icon: '🌈',
    condition: { type: 'LEGENDARY_SUMMON', value: 1 },
    maxProgress: 1
  },
  
  // Abilities
  {
    id: 'ability_user',
    name: 'Estrategista',
    description: 'Ative 50 habilidades de Pokémon',
    icon: '🧠',
    condition: { type: 'ABILITIES_TRIGGERED', value: 50 },
    maxProgress: 50
  },
  
  // Collection
  {
    id: 'collector',
    name: 'Colecionador',
    description: 'Colete 50 cartas diferentes',
    icon: '📚',
    condition: { type: 'CARDS_COLLECTED', value: 50 },
    maxProgress: 50
  },
  {
    id: 'complete_collection',
    name: 'Pokédex Completa',
    description: 'Colete todas as 187 cartas',
    icon: '📖',
    condition: { type: 'CARDS_COLLECTED', value: 187 },
    reward: { type: 'TITLE', value: 'Mestre Pokémon' },
    maxProgress: 187
  }
];

class AchievementsService {
  private achievements: Achievement[] = [];
  private listeners: ((achievement: Achievement) => void)[] = [];
  private onUnlockCallback: ((achievement: Achievement) => void) | null = null;

  constructor() {
    this.loadAchievements();
  }

  setOnUnlockCallback(callback: (achievement: Achievement) => void) {
    this.onUnlockCallback = callback;
  }

  private loadAchievements() {
    try {
      const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
      const savedMap: Record<string, { unlocked: boolean; unlockedAt?: number; progress?: number }> = 
        saved ? JSON.parse(saved) : {};
      
      this.achievements = ACHIEVEMENTS_LIST.map(a => ({
        ...a,
        unlocked: savedMap[a.id]?.unlocked ?? false,
        unlockedAt: savedMap[a.id]?.unlockedAt,
        progress: savedMap[a.id]?.progress ?? 0
      }));
    } catch (e) {
      console.warn('Failed to load achievements');
      this.achievements = ACHIEVEMENTS_LIST.map(a => ({
        ...a,
        unlocked: false,
        progress: 0
      }));
    }
  }

  private saveAchievements() {
    try {
      const toSave: Record<string, { unlocked: boolean; unlockedAt?: number; progress?: number }> = {};
      this.achievements.forEach(a => {
        toSave[a.id] = {
          unlocked: a.unlocked,
          unlockedAt: a.unlockedAt,
          progress: a.progress
        };
      });
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save achievements');
    }
  }

  getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  getUnlockedCount(): number {
    return this.achievements.filter(a => a.unlocked).length;
  }

  getTotalCount(): number {
    return this.achievements.length;
  }

  onUnlock(callback: (achievement: Achievement) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private unlock(achievement: Achievement) {
    if (!achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = Date.now();
      this.saveAchievements();
      this.listeners.forEach(l => l(achievement));
      
      // Also call the single callback if set
      if (this.onUnlockCallback) {
        this.onUnlockCallback(achievement);
      }
    }
  }

  updateProgress(type: AchievementCondition['type'], value: number, extra?: { elementType?: ElementType; bossId?: string }) {
    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return;
      if (achievement.condition.type !== type) return;
      
      // Check extra conditions
      if (achievement.condition.elementType && achievement.condition.elementType !== extra?.elementType) return;
      if (achievement.condition.bossId && achievement.condition.bossId !== extra?.bossId) return;
      
      achievement.progress = Math.min(value, achievement.maxProgress ?? value);
      
      if (achievement.progress >= achievement.condition.value) {
        this.unlock(achievement);
      }
    });
    
    this.saveAchievements();
  }

  checkAchievements() {
    const stats = statsService.getStats();
    
    // Update progress based on current stats
    this.updateProgress('WINS', stats.totalWins);
    this.updateProgress('WINS_STREAK', stats.bestStreak);
    this.updateProgress('PERFECT_WIN', stats.perfectWins);
    this.updateProgress('DAMAGE_DEALT', stats.totalDamageDealt);
    this.updateProgress('CARDS_DESTROYED', stats.cardsDestroyed);
    this.updateProgress('SURVIVAL_WAVES', stats.survivalBestWave);
    this.updateProgress('SPELLS_USED', stats.spellsUsed);
    this.updateProgress('TRAPS_ACTIVATED', stats.trapsActivated);
    this.updateProgress('ABILITIES_TRIGGERED', stats.abilitiesTriggered);
  }

  resetAchievements() {
    this.achievements = ACHIEVEMENTS_LIST.map(a => ({
      ...a,
      unlocked: false,
      progress: 0
    }));
    this.saveAchievements();
  }
}

export const achievementsService = new AchievementsService();
