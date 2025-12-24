import { Card, StatusEffect } from '../../types';
import { StatusProcessResult } from './types';

/**
 * Retorna o nome em português de um efeito de status
 */
export const getStatusName = (status: StatusEffect): string => {
  const names: Record<StatusEffect, string> = {
    [StatusEffect.NONE]: '',
    [StatusEffect.BURN]: 'queimadura',
    [StatusEffect.FREEZE]: 'congelamento',
    [StatusEffect.PARALYZE]: 'paralisia',
    [StatusEffect.POISON]: 'envenenamento',
    [StatusEffect.SLEEP]: 'sono',
    [StatusEffect.CONFUSE]: 'confusão'
  };
  return names[status];
};

/**
 * Processa os efeitos de status de uma carta no início do turno
 */
export const processStatusEffects = (card: Card): StatusProcessResult => {
  const logs: string[] = [];
  let damage = 0;
  let canAct = true;

  if (!card.statusEffects || card.statusEffects.length === 0) {
    return { card, damage, canAct, logs };
  }

  const newCard = { ...card };
  const activeStatuses = newCard.statusEffects?.filter(s => s !== StatusEffect.NONE) || [];
  const newDurations = [...(newCard.statusDuration || [])];
  const statusesToRemove: StatusEffect[] = [];

  activeStatuses.forEach((status, index) => {
    switch (status) {
      case StatusEffect.BURN:
        damage += Math.floor(newCard.attack * 0.1);
        logs.push(`${newCard.name} sofre queimadura! (-${Math.floor(newCard.attack * 0.1)} HP)`);
        break;
      case StatusEffect.POISON:
        damage += 100;
        logs.push(`${newCard.name} sofre envenenamento! (-100 HP)`);
        break;
      case StatusEffect.PARALYZE:
        if (Math.random() < 0.25) {
          canAct = false;
          logs.push(`${newCard.name} está paralisado e não pode agir!`);
        }
        break;
      case StatusEffect.FREEZE:
        canAct = false;
        logs.push(`${newCard.name} está congelado!`);
        if (Math.random() < 0.2) {
          statusesToRemove.push(StatusEffect.FREEZE);
          logs.push(`${newCard.name} descongelou!`);
        }
        break;
      case StatusEffect.SLEEP:
        canAct = false;
        logs.push(`${newCard.name} está dormindo!`);
        if (Math.random() < 0.33) {
          statusesToRemove.push(StatusEffect.SLEEP);
          logs.push(`${newCard.name} acordou!`);
        }
        break;
      case StatusEffect.CONFUSE:
        if (Math.random() < 0.33) {
          damage += Math.floor(newCard.attack * 0.25);
          logs.push(`${newCard.name} se machucou na confusão!`);
        }
        break;
    }

    // Decrease duration
    if (newDurations[index] !== undefined) {
      newDurations[index]--;
      if (newDurations[index] <= 0) {
        statusesToRemove.push(status);
        logs.push(`${newCard.name} se recuperou de ${getStatusName(status)}!`);
      }
    }
  });

  // Remove expired statuses
  newCard.statusEffects = activeStatuses.filter(s => !statusesToRemove.includes(s));
  newCard.statusDuration = newDurations.filter((_, i) => !statusesToRemove.includes(activeStatuses[i]));

  return { card: newCard, damage, canAct, logs };
};

/**
 * Aplica um efeito de status a uma carta
 */
export const applyStatusEffect = (card: Card, status: StatusEffect, duration: number = 3): Card => {
  const newCard = { ...card };
  if (!newCard.statusEffects) newCard.statusEffects = [];
  if (!newCard.statusDuration) newCard.statusDuration = [];

  // Don't stack same status
  if (!newCard.statusEffects.includes(status)) {
    newCard.statusEffects.push(status);
    newCard.statusDuration.push(duration);
  }

  return newCard;
};
