import { CampaignBoss, AIDifficulty, SacrificeStrategy, ElementType } from '@/types';

export const SECRET_CHALLENGES: CampaignBoss[] = [
  {
    id: 'mewtwo_boss',
    name: 'Mewtwo',
    category: 'secret_challenges',
    avatar: '🧬',
    description: 'O Pokémon mais poderoso criado pela ciência. BOSS SECRETO!',
    deck: ['150', '150', '065', '094', '151', '149', '144', '145', '146', '137', '133', '139', '131', '130', '143', '138', '151', '150', '149', '114', '007', '114'],
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
  },
  {
    id: 'safari_guardian',
    name: 'Safari Guardian',
    category: 'secret_challenges',
    avatar: '🦌',
    description: 'Guardião do Safari Zone — usa muitos Pokémon comuns e versáteis.',
    deck: ['052','053','016','017','018','032','033','034','083','084','085','108','113','115','128','129','133','137','060','061'],
    hp: 12000,
    reward: { coins: 1000, packs: 2 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.NORMAL,
    sacrificeStrategy: SacrificeStrategy.HAND_FIRST,
    specialRules: [
      { id: 'safari_swarm', name: 'Multidão', description: 'Tem muitas cartas comuns — maior probabilidade de baixar campo rapidamente', effect: 'FIELD_SIZE', value: 0 }
    ]
  },
  {
    id: 'rocket_admin',
    name: 'Team Rocket Admin',
    category: 'secret_challenges',
    avatar: '🎩',
    description: 'Chefe da equipe Rocket — trap/poison/ground focus e táticas sujas.',
    deck: ['023','024','041','042','050','051','074','075','076','095','111','112','031','034','129','130','083','052','015','049'],
    hp: 14000,
    reward: { coins: 1500, packs: 3 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.HARD,
    sacrificeStrategy: SacrificeStrategy.SMART_HYBRID,
    specialRules: [
      { id: 'rocket_tricks', name: 'Truques da Rocket', description: 'Usa armadilhas e descartes para atrapalhar o jogador', effect: 'FIELD_SIZE', value: 0 }
    ]
  },
  {
    id: 'fossil_hunter',
    name: 'Fossil Hunter',
    category: 'secret_challenges',
    avatar: '🗿',
    description: 'Caçador de fósseis — muita presença de Rock/Bug/Water e cartas resistentes.',
    deck: ['140','141','132','133','127','128','074','075','076','050','051','072','073','138','139','130','142','137','131','143'],
    hp: 13000,
    reward: { coins: 1200, packs: 2 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.NORMAL,
    sacrificeStrategy: SacrificeStrategy.FIELD_FIRST,
    specialRules: [
      { id: 'fossil_resilience', name: 'Resiliência', description: 'Pokémon Rock têm bônus de defesa', effect: 'TYPE_BOOST', value: 200, elementType: ElementType.GROUND }
    ]
  },
  {
    id: 'dragon_master',
    name: 'Dragon Master',
    category: 'secret_challenges',
    avatar: '🐲',
    description: 'Mestre dos dragões — decks cheios de ameaças grandes e raras.',
    deck: ['147', '148', '149', '149', '130', '142', '150', '149', '149', '131', '143', '137', '126', '125', '144', '145', '146', '129', '133', '151', '114', '007', '108'],
    hp: 16000,
    reward: { coins: 2000, packs: 4, cards: ['149'] },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.EXPERT,
    sacrificeStrategy: SacrificeStrategy.SCORE_BASED,
    specialRules: [
      { id: 'dragon_fury', name: 'Fúria Dracônica', description: 'Dragões têm grande bônus de ataque', effect: 'TYPE_BOOST', value: 600, elementType: ElementType.DRAGON }
    ]
  }
];

export default SECRET_CHALLENGES;
