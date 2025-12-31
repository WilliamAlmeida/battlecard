import { Card, Player, AbilityTrigger, ElementType, StatusEffect } from '../../types';
import { AbilityProcessResult, PassiveStats } from './types';

/**
 * Processa uma habilidade de carta baseada no gatilho
 */
export const processAbility = (
  card: Card,
  trigger: AbilityTrigger,
  context: {
    owner: Player;
    opponent: Player;
    attacker?: Card;
    defender?: Card;
    destroyed?: boolean;
  }
): AbilityProcessResult | null => {
  if (!card.ability || card.ability.trigger !== trigger) return null;

  const result: AbilityProcessResult = { logs: [] };
  const ability = card.ability;
  const effect = ability.effect;

  result.logs.push(`💫 ${card.name} ativou ${ability.name}!`);

  // ON_SUMMON effects
  if (trigger === AbilityTrigger.ON_SUMMON) {
    if (effect.type === 'DRAW') {
      result.drawCards = effect.value || 1;
      result.logs.push(`Comprou ${result.drawCards} carta(s)!`);
    } else if (effect.type === 'STATUS' && effect.statusEffect && effect.target === 'ALL_ENEMIES') {
      const targets = context.opponent.field.map(c => ({ target: c, status: effect.statusEffect! }));
      result.statusToApply = targets;
      targets.forEach(t => result.logs.push(`${t.target.name} foi afetado por ${effect.statusEffect}!`));
    }
  }

  // ON_ATTACK effects
  if (trigger === AbilityTrigger.ON_ATTACK && context.defender) {
    if (effect.type === 'STATUS' && effect.statusEffect) {
      if (Math.random() < 0.3) {
        result.statusToApply = [{ target: context.defender, status: effect.statusEffect }];
        result.logs.push(`${context.defender.name} foi afetado por ${effect.statusEffect}!`);
      }
    } else if (effect.type === 'DRAW' && context.destroyed) {
      // pickup ability: draw card when destroying enemy
      if (Math.random() < 0.5) {
        result.drawCards = 1;
        result.logs.push(`Comprou 1 carta ao destruir o inimigo!`);
      }
    }
  }

  // ON_DAMAGE effects (quando a carta recebe dano)
  if (trigger === AbilityTrigger.ON_DAMAGE && context.attacker) {
    if (effect.type === 'STATUS' && effect.statusEffect) {
      if (Math.random() < 0.3) {
        result.statusToApply = [{ target: context.attacker, status: effect.statusEffect }];
        result.logs.push(`${context.attacker.name} foi afetado por ${effect.statusEffect} ao atacar ${card.name}!`);
      }
    } else if (effect.type === 'STATUS' && !effect.statusEffect) {
      // synchronize: copy status to attacker
      if (card.statusEffects && card.statusEffects.length > 0) {
        const statusToCopy = card.statusEffects[0];
        result.statusToApply = [{ target: context.attacker, status: statusToCopy }];
        result.logs.push(`${context.attacker.name} foi afetado por ${statusToCopy} (Sincronizar)!`);
      }
    }
  }

  // ON_DESTROY effects
  if (trigger === AbilityTrigger.ON_DESTROY) {
    if (effect.type === 'HEAL') {
      result.healOwner = effect.value || 500;
      result.logs.push(`Dono recuperou ${result.healOwner} HP!`);
    } else if (effect.type === 'REVIVE') {
      if (Math.random() < 0.25) {
        result.reviveCard = {
          ...card,
          attack: Math.floor(card.attack / 2),
          defense: Math.floor(card.defense / 2),
          hasAttacked: true,
          statusEffects: [],
          statusDuration: []
        };
        result.logs.push(`${card.name} renasceu com metade do ATK/DEF!`);
      }
    }
  }

  // ON_TURN_END effects
  if (trigger === AbilityTrigger.ON_TURN_END) {
    if (effect.type === 'HEAL') {
      result.healOwner = effect.value || 200;
      result.logs.push(`Dono recuperou ${result.healOwner} HP!`);
    }
  }

  return result;
};

/**
 * Calcula bônus de stats de habilidades passivas
 */
export const calculatePassiveStats = (
  card: Card,
  owner: Player,
  _opponent: Player
): PassiveStats => {
  let attackBonus = 0;
  let defenseBonus = 0;
  let evasion = 0;

  if (!card.ability || card.ability.trigger !== AbilityTrigger.PASSIVE) {
    return { attack: attackBonus, defense: defenseBonus };
  }

  const ability = card.ability;

  // blaze, torrent, overgrow: +500 ATK when HP < 50%
  if ((ability.id === 'blaze' || ability.id === 'torrent' || ability.id === 'overgrow') && owner.hp < 4000) {
    attackBonus += 500;
  }

  // guts: +50% ATK when affected by status
  if (ability.id === 'guts' && card.statusEffects && card.statusEffects.length > 0) {
    attackBonus += Math.floor(card.attack * 0.5);
  }

  // swarm: +300 ATK for each Bug ally on field
  if (ability.id === 'swarm') {
    const bugAllies = owner.field.filter(c => c.type === ElementType.BUG && c.uniqueId !== card.uniqueId).length;
    attackBonus += bugAllies * 300;
  }

  // lightning_rod: +300 ATK (simplified, originally when targeted by electric)
  if (ability.id === 'lightning_rod') {
    attackBonus += 300;
  }

  // sand_veil: 20% evasion
  if (ability.id === 'sand_veil') {
    evasion = 0.2;
  }

  return { attack: attackBonus, defense: defenseBonus, evasion };
};

/**
 * Calcula debuffs de habilidades passivas do oponente
 */
export const calculateOpponentPassiveDebuffs = (
  _targetCard: Card,
  opponent: Player
): { attack: number; defense: number } => {
  let attackDebuff = 0;
  let defenseDebuff = 0;

  // Check all opponent cards for pressure ability
  opponent.field.forEach(opponentCard => {
    if (opponentCard.ability?.id === 'pressure' && opponentCard.ability.trigger === AbilityTrigger.PASSIVE) {
      attackDebuff -= 300;
    }
  });

  return { attack: attackDebuff, defense: defenseDebuff };
};
