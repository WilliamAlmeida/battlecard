// Campaign Data - Sistema de campanha com bosses temáticos
import { CampaignBoss, AIDifficulty, SpecialRule, ElementType, SacrificeStrategy } from '../types';
import { CAMPAIGN_CATEGORIES, CAMPAIGN_BOSSES } from '@/campaigns';

export interface CampaignCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

// Serviço de Campanha
const CAMPAIGN_KEY = 'pokecard_campaign';

class CampaignService {
  private bosses: CampaignBoss[] = [];

  constructor() {
    this.loadCampaign();
  }

  private loadCampaign() {
    try {
      const saved = localStorage.getItem(CAMPAIGN_KEY);
      if (saved) {
        const savedState: Record<string, { unlocked: boolean; defeated: boolean }> = JSON.parse(saved);
        this.bosses = CAMPAIGN_BOSSES.map(boss => ({
          ...boss,
          unlocked: savedState[boss.id]?.unlocked ?? boss.unlocked,
          defeated: savedState[boss.id]?.defeated ?? boss.defeated
        }));
      } else {
        this.bosses = [...CAMPAIGN_BOSSES];
      }
    } catch (e) {
      console.warn('Failed to load campaign');
      this.bosses = [...CAMPAIGN_BOSSES];
    }
  }

  private saveCampaign() {
    try {
      const toSave: Record<string, { unlocked: boolean; defeated: boolean }> = {};
      this.bosses.forEach(boss => {
        toSave[boss.id] = { unlocked: boss.unlocked, defeated: boss.defeated };
      });
      localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Failed to save campaign');
    }
  }

  getBosses(): CampaignBoss[] {
    return [...this.bosses];
  }

  getBossesByCategory(categoryId: string): CampaignBoss[] {
    return this.bosses.filter(b => b.category === categoryId);
  }

  getCategories(): CampaignCategory[] {
    return CAMPAIGN_CATEGORIES.map(cat => {
      const categoryBosses = this.getBossesByCategory(cat.id);
      const allDefeated = categoryBosses.length > 0 && categoryBosses.every(b => b.defeated);
      const anyUnlocked = categoryBosses.some(b => b.unlocked);
      
      return {
        ...cat,
        unlocked: cat.unlocked || anyUnlocked
      };
    });
  }

  getCategoryProgress(categoryId: string): { defeated: number; total: number; unlocked: number } {
    const bosses = this.getBossesByCategory(categoryId);
    return {
      defeated: bosses.filter(b => b.defeated).length,
      total: bosses.length,
      unlocked: bosses.filter(b => b.unlocked).length
    };
  }

  getBoss(id: string): CampaignBoss | undefined {
    return this.bosses.find(b => b.id === id);
  }

  getNextBoss(): CampaignBoss | undefined {
    return this.bosses.find(b => b.unlocked && !b.defeated);
  }

  defeatBoss(id: string) {
    const bossIndex = this.bosses.findIndex(b => b.id === id);
    if (bossIndex >= 0) {
      this.bosses[bossIndex].defeated = true;
      
      // Desbloquear próximo boss da mesma categoria
      const currentBoss = this.bosses[bossIndex];
      const categoryBosses = this.bosses.filter(b => b.category === currentBoss.category);
      const currentBossInCategory = categoryBosses.findIndex(b => b.id === id);
      
      if (currentBossInCategory >= 0 && currentBossInCategory + 1 < categoryBosses.length) {
        const nextBoss = categoryBosses[currentBossInCategory + 1];
        const nextBossIndex = this.bosses.findIndex(b => b.id === nextBoss.id);
        if (nextBossIndex >= 0) {
          this.bosses[nextBossIndex].unlocked = true;
        }
      }
      
      // Verificar se completou a categoria e desbloquear próxima
      const progress = this.getCategoryProgress(currentBoss.category);
      if (progress.defeated === progress.total) {
        this.unlockNextCategory(currentBoss.category);
      }
      
      this.saveCampaign();
    }
  }

  private unlockNextCategory(currentCategoryId: string) {
    const categoryOrder = ['gym_leaders', 'elite_four', 'champion', 'secret_challenges'];
    const currentIndex = categoryOrder.indexOf(currentCategoryId);
    
    if (currentIndex >= 0 && currentIndex + 1 < categoryOrder.length) {
      const nextCategoryId = categoryOrder[currentIndex + 1];
      const nextCategoryBosses = this.bosses.filter(b => b.category === nextCategoryId);
      
      if (nextCategoryBosses.length > 0) {
        const firstBossIndex = this.bosses.findIndex(b => b.id === nextCategoryBosses[0].id);
        if (firstBossIndex >= 0) {
          this.bosses[firstBossIndex].unlocked = true;
        }
      }
    }
  }

  getProgress(): { defeated: number; total: number } {
    return {
      defeated: this.bosses.filter(b => b.defeated).length,
      total: this.bosses.length
    };
  }

  resetCampaign() {
    this.bosses = CAMPAIGN_BOSSES.map(boss => ({
      ...boss,
      unlocked: boss.id === 'brock',
      defeated: false
    }));
    this.saveCampaign();
  }
}

export const campaignService = new CampaignService();
