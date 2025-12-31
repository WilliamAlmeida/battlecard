import { CampaignBoss, AIDifficulty, SacrificeStrategy } from '@/types';

export const CHAMPION: CampaignBoss[] = [
  {
    id: 'champion',
    name: 'Blue',
    category: 'champion',
    avatar: '👑',
    description: 'O Campeão da Liga Pokémon! Seu maior rival.',
    deck: ['018', '059', '065', '103', '130', '112', '149', '150', '151', '131', '143', '129', '133', '137', '146', '144', '145', '125', '126', '127', '114', '007', '114'],
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
  }
];

export default CHAMPION;
