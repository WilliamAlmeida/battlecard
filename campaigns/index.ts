import GYM_LEADERS from './gym_leaders';
import ELITE_FOUR from './elite_four';
import CHAMPION from './champion';
import SECRET_CHALLENGES from './secret_challenges';

export const CAMPAIGN_BOSSES = [
  ...GYM_LEADERS,
  ...ELITE_FOUR,
  ...CHAMPION,
  ...SECRET_CHALLENGES
];

export const CAMPAIGN_CATEGORIES = [
  {
    id: 'gym_leaders',
    name: 'Liga Pokémon',
    description: 'Derrote os 8 Líderes de Ginásio de Kanto',
    icon: '🏟️',
    color: 'from-blue-600 to-cyan-600',
    unlocked: true
  },
  {
    id: 'elite_four',
    name: 'Elite dos Quatro',
    description: 'Enfrente os 4 melhores treinadores da região',
    icon: '⭐',
    color: 'from-purple-600 to-pink-600',
    unlocked: false
  },
  {
    id: 'champion',
    name: 'O Campeão',
    description: 'Derrote o atual Campeão e se torne uma lenda',
    icon: '👑',
    color: 'from-yellow-500 to-amber-600',
    unlocked: false
  },
  {
    id: 'secret_challenges',
    name: 'Desafios Secretos',
    description: 'Enfrentamentos especiais contra oponentes lendários',
    icon: '🌟',
    color: 'from-red-600 to-orange-600',
    unlocked: false
  }
];

export default CAMPAIGN_BOSSES;
