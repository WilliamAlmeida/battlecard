import { Card, Player, TrapCondition, StatusEffect } from '../../types';
import { TrapCheckResult } from './types';

/**
 * Verifica e ativa armadilhas baseadas em uma condição
 */
export const checkAndActivateTraps = (
  trapOwner: Player,
  opponent: Player,
  condition: TrapCondition,
  context: {
    attacker?: Card;
    defender?: Card;
    summoned?: Card;
    destroyed?: Card;
    attackerOwner?: 'player' | 'npc';
  },
  _setPlayer: (value: Player | ((prev: Player) => Player)) => void,
  _setNpc: (value: Player | ((prev: Player) => Player)) => void
): TrapCheckResult => {
  const activatedTraps: Card[] = [];
  let totalDamageToOpponentPlayer = 0;
  const logs: string[] = [];
  const statusEffects: Array<{ target: Card; status: StatusEffect }> = [];
  const destroyTargets: string[] = [];
  const debuffTargets: Array<{ targetId: string; value: number; stat?: 'ATTACK' | 'DEFENSE' }> = [];
  let negateAttack = false;
  let surviveTrap = false;

  const seenTrapIds = new Set<string>();
  
  trapOwner.trapZone.forEach(trap => {
    if (trap.trapCondition === condition && trap.isSet) {
      // Only activate one trap instance per card `id` per event.
      if (seenTrapIds.has(trap.id)) return;
      seenTrapIds.add(trap.id);
      activatedTraps.push(trap);
      logs.push(`⚠️ TRAP ATIVADA: ${trap.name}!`);

      if (trap.trapEffect) {
        const effect = trap.trapEffect;

        if (effect.type === 'DAMAGE') {
          const damage = effect.value !== undefined ? effect.value : 500;

          // Handle special damage effects
          if (effect.specialId === 'reflect_damage' && context.attacker && context.defender) {
            // Mirror Coat: reflect the attacker's attack back
            const reflectedDamage = context.attacker.attack;
            totalDamageToOpponentPlayer += reflectedDamage;
            logs.push(`${trap.name} refletiu ${reflectedDamage} de dano!`);
          } else if (effect.target === 'SINGLE_ENEMY' && context.attacker) {
            totalDamageToOpponentPlayer += damage;
            logs.push(`${trap.name} causa ${damage} de dano em ${context.attacker.name}!`);
          } else if (effect.target === 'ALL_ENEMIES') {
            // Damage all opponent's field monsters
            opponent.field.forEach(card => {
              if (damage >= card.defense) {
                destroyTargets.push(card.uniqueId);
                logs.push(`${trap.name} destruiu ${card.name} com ${damage} de dano!`);
              } else {
                logs.push(`${trap.name} causou ${damage} de dano em ${card.name}!`);
              }
            });
          }
        } else if (effect.type === 'STATUS' && effect.statusEffect) {
          if (effect.target === 'SINGLE_ENEMY' && context.attacker) {
            statusEffects.push({ target: context.attacker, status: effect.statusEffect });
            logs.push(`${trap.name} aplicou ${effect.statusEffect} em ${context.attacker.name}!`);
          } else if (effect.target === 'SINGLE_ENEMY' && context.summoned) {
            statusEffects.push({ target: context.summoned, status: effect.statusEffect });
            logs.push(`${trap.name} aplicou ${effect.statusEffect} em ${context.summoned.name}!`);
          }
        } else if (effect.type === 'DESTROY') {
          if (effect.target === 'SINGLE_ENEMY' && context.attacker) {
            destroyTargets.push(context.attacker.uniqueId);
            logs.push(`${trap.name} destruiu ${context.attacker.name}!`);
          }
        } else if (effect.type === 'DEBUFF' && effect.value) {
          const statToDecrease = effect.stat;
          const statName = statToDecrease ? (statToDecrease === 'DEFENSE' ? 'DEF' : 'ATK') : 'ATK/DEF';

          if (effect.target === 'SINGLE_ENEMY' && context.attacker) {
            debuffTargets.push({ targetId: context.attacker.uniqueId, value: effect.value, stat: statToDecrease });
            logs.push(`${trap.name} reduziu ${Math.abs(effect.value)} ${statName} de ${context.attacker.name}!`);
          } else if (effect.target === 'ALL_ENEMIES') {
            opponent.field.forEach(card => {
              debuffTargets.push({ targetId: card.uniqueId, value: effect.value!, stat: statToDecrease });
            });
            logs.push(`${trap.name} reduziu ${Math.abs(effect.value)} ${statName} de todos os inimigos!`);
          }
        } else if (effect.type === 'SPECIAL') {
          if (effect.specialId === 'negate_attack') {
            negateAttack = true;
            logs.push(`${trap.name} negou o ataque!`);
          } else if (effect.specialId === 'survive_1hp') {
            surviveTrap = true;
            logs.push(`${trap.name} permitiu sobrevivência com 1 HP!`);
          }
        }
      }
    }
  });

  return {
    activatedTraps,
    damageToOpponentPlayer: totalDamageToOpponentPlayer,
    statusEffects,
    destroyTargets,
    logs,
    debuffTargets,
    negateAttack,
    surviveTrap
  };
};
