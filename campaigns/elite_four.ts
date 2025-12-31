import { CampaignBoss, AIDifficulty, SacrificeStrategy, ElementType } from '@/types';

export const ELITE_FOUR: CampaignBoss[] = [
  {
    id: 'lorelei',
    name: 'Lorelei',
    category: 'elite_four',
    avatar: '🧊',
    description: 'Membro da Elite Four. Mestre do Gelo.',
    deck: ['087', '091', '131', '124', '144', '007', '008', '009', '072', '073', '090', '060', '061', '062', '116', '117', '134', '138', '139', '130'],
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
    category: 'elite_four',
    avatar: '🥊',
    description: 'Membro da Elite Four. Mestre das Lutas.',
    deck: ['066', '067', '068', '095', '056', '057', '106', '107', '115', '128', '127', '016', '021', '018', '019', '020', '083', '132', '133', '137'],
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
    category: 'elite_four',
    avatar: '👻',
    description: 'Membro da Elite Four. Mestre dos Fantasmas.',
    deck: ['092', '093', '094', '042', '024', '110', '041', '023', '029', '030', '088', '089', '109', '049', '048', '015', '094', '094', '094', '150'],
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
    category: 'elite_four',
    avatar: '🐉',
    description: 'Membro da Elite Four. Mestre dos Dragões.',
    deck: ['147', '148', '149', '149', '130', '142', '006', '150', '149', '131', '133', '137', '143', '144', '145', '146', '129', '128', '127', '130', '147', '147'],
    hp: 12000,
    reward: { coins: 800, packs: 3 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.EXPERT,
    sacrificeStrategy: SacrificeStrategy.SCORE_BASED,
    specialRules: [
      { id: 'dragon_boost', name: 'Fúria Dracônica', description: 'Todos Pokémon de Lance têm +600 ATK', effect: 'TYPE_BOOST', value: 600, elementType: ElementType.PSYCHIC }
    ]
  }
];

export default ELITE_FOUR;
