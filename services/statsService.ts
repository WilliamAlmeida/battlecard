// Stats Service - Sistema de estatísticas e leaderboard local
import { PlayerStats, StatusEffect, GameMode, ElementType } from '../types';

const STATS_KEY = 'pokecard_stats';

const defaultStats: PlayerStats = {
  totalWins: 0,
  totalLosses: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalDamageDealt: 0,
  totalDamageReceived: 0,
  cardsDestroyed: 0,
  cardsLost: 0,
  perfectWins: 0,
  survivalBestWave: 0,
  bossesDefeated: [],
  spellsUsed: 0,
  trapsActivated: 0,
  abilitiesTriggered: 0,
  statusInflicted: {
    [StatusEffect.NONE]: 0,
    [StatusEffect.BURN]: 0,
    [StatusEffect.FREEZE]: 0,
    [StatusEffect.PARALYZE]: 0,
    [StatusEffect.POISON]: 0,
    [StatusEffect.SLEEP]: 0,
    [StatusEffect.CONFUSE]: 0
  },
  gamesPlayedByMode: {
    [GameMode.QUICK_BATTLE]: 0,
    [GameMode.CAMPAIGN]: 0,
    [GameMode.SURVIVAL]: 0,
    [GameMode.BOSS_RUSH]: 0,
    [GameMode.DRAFT]: 0
  },
  favoriteType: undefined
};

class StatsService {
  private stats: PlayerStats = { ...defaultStats };

  constructor() {
    this.loadStats();
  }

  private loadStats() {
    try {
      const saved = localStorage.getItem(STATS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.stats = { ...defaultStats, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load stats');
    }
  }

  private saveStats() {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(this.stats));
    } catch (e) {
      console.warn('Failed to save stats');
    }
  }

  getStats(): PlayerStats {
    return { ...this.stats };
  }

  recordWin(mode: GameMode, isPerfect: boolean = false) {
    this.stats.totalWins++;
    this.stats.currentStreak++;
    if (this.stats.currentStreak > this.stats.bestStreak) {
      this.stats.bestStreak = this.stats.currentStreak;
    }
    if (isPerfect) {
      this.stats.perfectWins++;
    }
    this.stats.gamesPlayedByMode[mode]++;
    this.saveStats();
  }

  recordLoss(mode: GameMode) {
    this.stats.totalLosses++;
    this.stats.currentStreak = 0;
    this.stats.gamesPlayedByMode[mode]++;
    this.saveStats();
  }

  // Convenience method to record a full game result
  recordGame(data: {
    won: boolean;
    damageDealt: number;
    cardsDestroyed: number;
    turns: number;
    mode: GameMode;
    perfect: boolean;
  }) {
    if (data.won) {
      this.recordWin(data.mode, data.perfect);
    } else {
      this.recordLoss(data.mode);
    }
    this.stats.totalDamageDealt += data.damageDealt;
    this.stats.cardsDestroyed += data.cardsDestroyed;
    this.saveStats();
  }

  recordDamageDealt(amount: number) {
    this.stats.totalDamageDealt += amount;
    this.saveStats();
  }

  recordDamageReceived(amount: number) {
    this.stats.totalDamageReceived += amount;
    this.saveStats();
  }

  recordCardDestroyed() {
    this.stats.cardsDestroyed++;
    this.saveStats();
  }

  recordCardLost() {
    this.stats.cardsLost++;
    this.saveStats();
  }

  recordSpellUsed() {
    this.stats.spellsUsed++;
    this.saveStats();
  }

  recordTrapActivated() {
    this.stats.trapsActivated++;
    this.saveStats();
  }

  recordAbilityTriggered() {
    this.stats.abilitiesTriggered++;
    this.saveStats();
  }

  recordStatusInflicted(status: StatusEffect) {
    if (status !== StatusEffect.NONE) {
      this.stats.statusInflicted[status]++;
      this.saveStats();
    }
  }

  recordBossDefeated(bossId: string) {
    if (!this.stats.bossesDefeated.includes(bossId)) {
      this.stats.bossesDefeated.push(bossId);
      this.saveStats();
    }
  }

  recordSurvivalWave(wave: number) {
    if (wave > this.stats.survivalBestWave) {
      this.stats.survivalBestWave = wave;
      this.saveStats();
    }
  }

  setFavoriteType(type: ElementType) {
    this.stats.favoriteType = type;
    this.saveStats();
  }

  getWinRate(): number {
    const total = this.stats.totalWins + this.stats.totalLosses;
    if (total === 0) return 0;
    return Math.round((this.stats.totalWins / total) * 100);
  }

  resetStats() {
    this.stats = { ...defaultStats };
    this.saveStats();
  }
}

export const statsService = new StatsService();
