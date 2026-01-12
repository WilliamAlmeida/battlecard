/**
 * Ability Message Formatter
 * Centralizes ability effect message formatting with i18n support
 */

import { ABILITIES } from '../pokemons/abilities';
import { t } from './i18n';

export interface AbilityMessageData {
  abilityId?: string;
  cardName?: string;
  value?: number;
  targetName?: string;
  ownerHpPercent?: number;
  bugAlliesCount?: number;
}

export interface FormattedAbilityMessage {
  text: string;
  color: string;
  animation: 'up' | 'down' | 'none';
  stat?: 'ATK' | 'DEF' | 'HP' | 'BOTH' | 'STATUS';
}

/**
 * Format ability activation message based on ability ID and context
 */
export function formatAbilityMessage(data: AbilityMessageData): FormattedAbilityMessage {
  const { abilityId, cardName, value, targetName } = data;

  if (!abilityId) {
    // Fallback for unknown abilities
    return {
      text: cardName 
        ? t('abilities.activated', { cardName, abilityName: '?' }) 
        : t('abilities.activated', { cardName: '?', abilityName: '?' }),
      color: '#fbbf24',
      animation: 'up'
    };
  }

  const ability = ABILITIES[abilityId];
  const abilityName = ability?.name || abilityId;

  // Format based on ability type using i18n
  switch (abilityId) {
    // Passive ATK boost abilities
    case 'blaze':
    case 'torrent':
    case 'overgrow':
      return {
        text: t('abilities.boost', { value: value || 500, stat: 'ATK' }),
        color: '#ef4444',
        animation: 'up',
        stat: 'ATK'
      };

    case 'guts':
    case 'swarm':
      return {
        text: t('abilities.boost', { value: value || 0, stat: 'ATK' }),
        color: '#ef4444',
        animation: 'up',
        stat: 'ATK'
      };

    case 'lightning_rod':
      return {
        text: t('abilities.boost', { value: 300, stat: 'ATK' }),
        color: '#ef4444',
        animation: 'up',
        stat: 'ATK'
      };

    case 'pressure':
      return {
        text: t('abilities.debuff', { value: 300, stat: 'ATK' }),
        color: '#ef4444',
        animation: 'down',
        stat: 'ATK'
      };

    case 'sand_veil':
      return {
        text: t('abilities.evasion', { cardName: cardName || '', percent: 20 }),
        color: '#a78bfa',
        animation: 'none',
        stat: 'STATUS'
      };

    // ON_TURN_END abilities
    case 'rain_dish':
      return {
        text: t('abilities.healHp', { value: value || 200 }),
        color: '#10b981',
        animation: 'up',
        stat: 'HP'
      };

    // ON_SUMMON abilities
    case 'mind_reader':
      return {
        text: t('abilities.drewCards', { cardName: cardName || '', count: 1 }),
        color: '#3b82f6',
        animation: 'up'
      };

    case 'poison_gas':
      return {
        text: t('abilities.massPoison'),
        color: '#9333ea',
        animation: 'none',
        stat: 'STATUS'
      };

    // ON_ATTACK abilities
    case 'burn_touch':
      return {
        text: t('abilities.burned', { target: targetName || '' }),
        color: '#ef4444',
        animation: 'down',
        stat: 'STATUS'
      };

    case 'pickup':
      return {
        text: t('abilities.drewCards', { cardName: cardName || '', count: 1 }),
        color: '#3b82f6',
        animation: 'up'
      };

    // ON_DAMAGE abilities
    case 'poison_point':
      return {
        text: t('abilities.poisoned', { target: targetName || '' }),
        color: '#9333ea',
        animation: 'down',
        stat: 'STATUS'
      };

    case 'static':
      return {
        text: t('abilities.paralyzed', { target: targetName || '' }),
        color: '#fbbf24',
        animation: 'down',
        stat: 'STATUS'
      };

    case 'synchronize':
      return {
        text: t('abilities.statusCopied'),
        color: '#ec4899',
        animation: 'none',
        stat: 'STATUS'
      };

    // ON_DESTROY abilities
    case 'regenerate':
      return {
        text: t('abilities.healHp', { value: value || 500 }),
        color: '#10b981',
        animation: 'up',
        stat: 'HP'
      };

    case 'revive':
      return {
        text: t('abilities.revived', { cardName: cardName || '' }),
        color: '#fbbf24',
        animation: 'up'
      };

    default:
      // Generic fallback - show ability name with sparkle
      return {
        text: `💫 ${abilityName}`,
        color: '#fbbf24',
        animation: 'up'
      };
  }
}
