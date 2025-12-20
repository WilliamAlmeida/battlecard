
import { Card, Player } from '../types';

export const GameRules = {
  MAX_FIELD_SIZE: 3,
  INITIAL_HAND_SIZE: 4,
  MAX_HP: 4000,

  canSummon: (player: Player, card: Card): boolean => {
    if (player.field.length >= GameRules.MAX_FIELD_SIZE) return false;
    const availableSacrifices = (player.hand.length - 1) + player.field.length; // -1 pois a carta em si não conta
    return availableSacrifices >= card.sacrificeRequired;
  },

  resolveCombat: (attacker: Card, defender: Card) => {
    let attackerSurvived = true;
    let defenderSurvived = true;
    let damageToDefenderOwner = 0;
    let damageToAttackerOwner = 0;

    if (attacker.attack > defender.attack) {
      defenderSurvived = false;
      damageToDefenderOwner = attacker.attack - defender.attack;
    } else if (attacker.attack < defender.attack) {
      attackerSurvived = false;
      damageToAttackerOwner = defender.attack - attacker.attack;
    } else {
      // Empate
      attackerSurvived = false;
      defenderSurvived = false;
    }

    return {
      attackerSurvived,
      defenderSurvived,
      damageToDefenderOwner,
      damageToAttackerOwner
    };
  }
};
