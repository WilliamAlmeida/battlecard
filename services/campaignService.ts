// Campaign Data - Sistema de campanha com bosses temáticos
import { CampaignBoss, AIDifficulty, SpecialRule, ElementType, SacrificeStrategy } from '../types';

export const CAMPAIGN_BOSSES: CampaignBoss[] = [
  // Liga Pokémon - 8 Líderes de Ginásio
  {
    id: 'brock',
    name: 'Brock',
    avatar: '🪨',
    description: 'Líder do Ginásio de Pewter City. Especialista em Pokémon de Pedra.',
    deck: ['074', '095', '076', '075', '074', '111', '112', '027', '028', '104', '105'],
    hp: 8000,
    reward: { coins: 200, packs: 1 },
    unlocked: true,
    defeated: false,
    difficulty: AIDifficulty.EASY,
    sacrificeStrategy: SacrificeStrategy.FIELD_FIRST,
    specialRules: [
      { id: 'rock_boost', name: 'Força da Pedra', description: 'Pokémon GROUND têm +200 ATK', effect: 'TYPE_BOOST', value: 200, elementType: ElementType.GROUND }
    ]
  },
  {
    id: 'misty',
    name: 'Misty',
    avatar: '🌊',
    description: 'Líder do Ginásio de Cerulean City. Especialista em Pokémon de Água.',
    deck: ['120', '121', '054', '055', '116', '117', '007', '008', '009', '131'],
    hp: 8500,
    reward: { coins: 250, packs: 1 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.EASY,
    sacrificeStrategy: SacrificeStrategy.HAND_FIRST,
    specialRules: [
      { id: 'water_boost', name: 'Torrente', description: 'Pokémon WATER têm +200 ATK', effect: 'TYPE_BOOST', value: 200, elementType: ElementType.WATER }
    ]
  },
  {
    id: 'lt_surge',
    name: 'Lt. Surge',
    avatar: '⚡',
    description: 'Líder do Ginásio de Vermilion City. Especialista em Pokémon Elétricos.',
    deck: ['025', '026', '100', '101', '081', '082', '125', '135', '145'],
    hp: 9000,
    reward: { coins: 300, packs: 1 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.NORMAL,
    sacrificeStrategy: SacrificeStrategy.SMART_HYBRID,
    specialRules: [
      { id: 'electric_boost', name: 'Descarga', description: 'Pokémon ELECTRIC têm +300 ATK', effect: 'TYPE_BOOST', value: 300, elementType: ElementType.ELECTRIC }
    ]
  },
  {
    id: 'erika',
    name: 'Erika',
    avatar: '🌸',
    description: 'Líder do Ginásio de Celadon City. Especialista em Pokémon de Planta.',
    deck: ['001', '002', '003', '043', '044', '045', '069', '070', '071', '114'],
    hp: 9000,
    reward: { coins: 300, packs: 1 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.NORMAL,
    sacrificeStrategy: SacrificeStrategy.HAND_FIRST,
    specialRules: [
      { id: 'grass_boost', name: 'Fotossíntese', description: 'Pokémon GRASS têm +200 ATK e curam 100 HP/turno', effect: 'TYPE_BOOST', value: 200, elementType: ElementType.GRASS }
    ]
  },
  {
    id: 'koga',
    name: 'Koga',
    avatar: '☠️',
    description: 'Líder do Ginásio de Fuchsia City. Mestre Ninja e especialista em Veneno.',
    deck: ['023', '024', '041', '042', '088', '089', '109', '110', '015', '049'],
    hp: 9500,
    reward: { coins: 350, packs: 1 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.NORMAL,
    sacrificeStrategy: SacrificeStrategy.SMART_HYBRID,
    specialRules: [
      { id: 'poison_boost', name: 'Veneno Mortal', description: 'Pokémon POISON causam envenenamento ao atacar', effect: 'TYPE_BOOST', value: 0, elementType: ElementType.POISON }
    ]
  },
  {
    id: 'sabrina',
    name: 'Sabrina',
    avatar: '🔮',
    description: 'Líder do Ginásio de Saffron City. Mestre dos poderes psíquicos.',
    deck: ['063', '064', '065', '096', '097', '122', '124', '150'],
    hp: 10000,
    reward: { coins: 400, packs: 2 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.HARD,
    sacrificeStrategy: SacrificeStrategy.SCORE_BASED,
    specialRules: [
      { id: 'psychic_boost', name: 'Telepatia', description: 'Pokémon PSYCHIC têm +400 ATK', effect: 'TYPE_BOOST', value: 400, elementType: ElementType.PSYCHIC }
    ]
  },
  {
    id: 'blaine',
    name: 'Blaine',
    avatar: '🔥',
    description: 'Líder do Ginásio de Cinnabar Island. Cientista e mestre do fogo.',
    deck: ['004', '005', '006', '037', '038', '058', '059', '077', '078', '126', '146'],
    hp: 10000,
    reward: { coins: 400, packs: 2 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.HARD,
    sacrificeStrategy: SacrificeStrategy.SCORE_BASED,
    specialRules: [
      { id: 'fire_boost', name: 'Inferno', description: 'Pokémon FIRE têm +400 ATK e queimam ao atacar', effect: 'TYPE_BOOST', value: 400, elementType: ElementType.FIRE }
    ]
  },
  {
    id: 'giovanni',
    name: 'Giovanni',
    avatar: '🏴',
    description: 'Líder do Ginásio de Viridian City e chefe da Team Rocket.',
    deck: ['050', '051', '074', '075', '076', '111', '112', '095', '031', '034'],
    hp: 10500,
    reward: { coins: 500, packs: 2, cards: ['150'] },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.HARD,
    sacrificeStrategy: SacrificeStrategy.SCORE_BASED,
    specialRules: [
      { id: 'ground_boost', name: 'Terremoto', description: 'Pokémon GROUND têm +500 ATK', effect: 'TYPE_BOOST', value: 500, elementType: ElementType.GROUND },
      { id: 'extra_hp', name: 'Líder Supremo', description: 'Giovanni começa com +1000 HP', effect: 'HP_MODIFIER', value: 1000 }
    ]
  },
  
  // Elite Four
  {
    id: 'lorelei',
    name: 'Lorelei',
    avatar: '🧊',
    description: 'Membro da Elite Four. Mestre do Gelo.',
    deck: ['087', '091', '131', '124', '144', '007', '008', '009'],
    hp: 11000,
    reward: { coins: 600, packs: 2 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.HARD,
    sacrificeStrategy: SacrificeStrategy.SCORE_BASED,
    specialRules: [
      { id: 'ice_boost', name: 'Era Glacial', description: 'Inimigos têm 20% chance de congelar ao atacar', effect: 'TYPE_BOOST', value: 0, elementType: ElementType.WATER }
    ]
  },
  {
    id: 'bruno',
    name: 'Bruno',
    avatar: '🥊',
    description: 'Membro da Elite Four. Mestre das Lutas.',
    deck: ['066', '067', '068', '095', '056', '057', '106', '107'],
    hp: 11500,
    reward: { coins: 650, packs: 2 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.HARD,
    sacrificeStrategy: SacrificeStrategy.SCORE_BASED,
    specialRules: [
      { id: 'fighting_boost', name: 'Poder Bruto', description: 'Pokémon FIGHTING têm +500 ATK', effect: 'TYPE_BOOST', value: 500, elementType: ElementType.FIGHTING }
    ]
  },
  {
    id: 'agatha',
    name: 'Agatha',
    avatar: '👻',
    description: 'Membro da Elite Four. Mestre dos Fantasmas.',
    deck: ['092', '093', '094', '042', '024', '110', '094', '094'],
    hp: 12000,
    reward: { coins: 700, packs: 3 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.EXPERT,
    sacrificeStrategy: SacrificeStrategy.SCORE_BASED,
    specialRules: [
      { id: 'ghost_boost', name: 'Maldição', description: 'Pokémon PSYCHIC têm 25% de reviver ao morrer', effect: 'TYPE_BOOST', value: 0, elementType: ElementType.PSYCHIC }
    ]
  },
  {
    id: 'lance',
    name: 'Lance',
    avatar: '🐉',
    description: 'Membro da Elite Four. Mestre dos Dragões.',
    deck: ['147', '148', '149', '149', '130', '142', '006'],
    hp: 12000,
    reward: { coins: 800, packs: 3 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.EXPERT,
    sacrificeStrategy: SacrificeStrategy.SCORE_BASED,
    specialRules: [
      { id: 'dragon_boost', name: 'Fúria Dracônica', description: 'Todos Pokémon de Lance têm +600 ATK', effect: 'TYPE_BOOST', value: 600, elementType: ElementType.PSYCHIC }
    ]
  },
  
  // Champion
  {
    id: 'champion',
    name: 'Blue',
    avatar: '👑',
    description: 'O Campeão da Liga Pokémon! Seu maior rival.',
    deck: ['018', '059', '065', '103', '130', '112'],
    hp: 14000,
    reward: { coins: 1500, packs: 5, cards: ['151'] },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.EXPERT,
    sacrificeStrategy: SacrificeStrategy.SCORE_BASED,
    specialRules: [
      { id: 'champion_boost', name: 'Campeão', description: 'Todos Pokémon do Campeão têm +800 ATK', effect: 'TYPE_BOOST', value: 800 },
      { id: 'champion_field', name: 'Campo Expandido', description: 'Campeão pode ter 4 Pokémon no campo', effect: 'FIELD_SIZE', value: 4 },
      { id: 'champion_cards', name: 'Mão Cheia', description: 'Campeão começa com 6 cartas', effect: 'STARTING_CARDS', value: 6 }
    ]
  },
  
  // Bonus Bosses
  {
    id: 'mewtwo_boss',
    name: 'Mewtwo',
    avatar: '🧬',
    description: 'O Pokémon mais poderoso criado pela ciência. BOSS SECRETO!',
    deck: ['150', '150', '065', '094', '151', '149'],
    hp: 17000,
    reward: { coins: 3000, packs: 10, cards: ['150', '151'] },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.EXPERT,
    sacrificeStrategy: SacrificeStrategy.SCORE_BASED,
    specialRules: [
      { id: 'mewtwo_power', name: 'Poder Absoluto', description: 'Mewtwo tem +1000 ATK em todos Pokémon', effect: 'TYPE_BOOST', value: 1000 },
      { id: 'mewtwo_psychic', name: 'Mente Superior', description: 'Pokémon PSYCHIC são imunes a status', effect: 'TYPE_BOOST', value: 0, elementType: ElementType.PSYCHIC }
    ]
  }
];

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
      // Desbloquear próximo boss
      if (bossIndex + 1 < this.bosses.length) {
        this.bosses[bossIndex + 1].unlocked = true;
      }
      this.saveCampaign();
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
