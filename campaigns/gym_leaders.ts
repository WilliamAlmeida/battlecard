import { CampaignBoss, AIDifficulty, SacrificeStrategy, ElementType } from '@/types';

export const GYM_LEADERS: CampaignBoss[] = [
  {
    id: 'brock',
    name: 'Brock',
    category: 'gym_leaders',
    avatar: '🪨',
    description: 'Líder do Ginásio de Pewter City. Especialista em Pokémon de Pedra.',
    deck: ['027', '050', '074', '104', '111', '028', '051', '075', '095', '112', '105', '076', '084', '076', '095', '075', '111', '074', '074', '050'],
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
    category: 'gym_leaders',
    avatar: '🌊',
    description: 'Líder do Ginásio de Cerulean City. Especialista em Pokémon de Água.',
    deck: ['120', '121', '054', '055', '116', '117', '007', '008', '009', '131', '072', '073', '090', '091', '098', '099', '118', '119', '134', '138'],
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
    category: 'gym_leaders',
    avatar: '⚡',
    description: 'Líder do Ginásio de Vermilion City. Especialista em Pokémon Elétricos.',
    deck: ['025', '026', '100', '101', '081', '082', '125', '135', '133', '100', '101', '115', '053', '137', '103', '103', '025', '026', '125', '082'],
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
    category: 'gym_leaders',
    avatar: '🌸',
    description: 'Líder do Ginásio de Celadon City. Especialista em Pokémon de Planta.',
    deck: ['001', '043', '069', '102', '114', '002', '044', '070', '103', '003', '045', '114', '114', '103', '002', '070', '044', '003', '071', '045'],
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
    category: 'gym_leaders',
    avatar: '☠️',
    description: 'Líder do Ginásio de Fuchsia City. Mestre Ninja e especialista em Veneno.',
    deck: ['088', '023', '029', '032', '109', '041', '015', '089', '110', '042', '033', '030', '034', '031', '034', '031', '015', '089', '110', '088'],
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
    category: 'gym_leaders',
    avatar: '🔮',
    description: 'Líder do Ginásio de Saffron City. Mestre dos poderes psíquicos.',
    deck: ['096', '063', '096', '063', '124', '122', '122', '124', '097', '064', '097', '064', '065', '065', '065', '151', '092', '093', '094', '093'],
    hp: 10000,
    reward: { coins: 400, packs: 2 },
    unlocked: false,
    defeated: false,
    difficulty: AIDifficulty.HARD,
    sacrificeStrategy: SacrificeStrategy.SMART_HYBRID,
    specialRules: [
      { id: 'psychic_boost', name: 'Telepatia', description: 'Pokémon PSYCHIC têm +400 ATK', effect: 'TYPE_BOOST', value: 400, elementType: ElementType.PSYCHIC }
    ]
  },
  {
    id: 'blaine',
    name: 'Blaine',
    category: 'gym_leaders',
    avatar: '🔥',
    description: 'Líder do Ginásio de Cinnabar Island. Cientista e mestre do fogo.',
    deck: ['004', '037', '058', '077', '005', '038', '059', '078', '126', '136', '006', '004', '077', '059', '136', '126', '006', '038', '077', '004'],
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
    category: 'gym_leaders',
    avatar: '🏴',
    description: 'Líder do Ginásio de Viridian City e chefe da Team Rocket.',
    deck: ['111', '111', '053', '053', '029', '032', '029', '032', '030', '033', '030', '033', '031', '034', '031', '034', '112', '112', '051', '052'],
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
  }
];

export default GYM_LEADERS;
