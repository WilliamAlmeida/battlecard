
import { Player, Card, Phase, AIAction, AIActionType, AIDifficulty, CardType } from '../types';
import { GameRules } from '../utils/gameRules';

export class AIController {
  private static difficulty: AIDifficulty = AIDifficulty.NORMAL;

  static setDifficulty(diff: AIDifficulty) {
    this.difficulty = diff;
  }

  static getDifficulty(): AIDifficulty {
    return this.difficulty;
  }

  // Chance de cometer erro baseado na dificuldade
  private static shouldMakeMistake(): boolean {
    const mistakeChance = {
      [AIDifficulty.EASY]: 0.4,    // 40% chance de erro
      [AIDifficulty.NORMAL]: 0.15, // 15% chance de erro
      [AIDifficulty.HARD]: 0.05,   // 5% chance de erro
      [AIDifficulty.EXPERT]: 0     // Nunca erra
    };
    return Math.random() < mistakeChance[this.difficulty];
  }

  // Calcular vantagem de tipo
  private static getTypeAdvantage(attacker: Card, defender: Card): number {
    return GameRules.TYPE_TABLE[attacker.type]?.[defender.type] ?? 1;
  }

  // Avaliar força de uma carta considerando tipo contra o campo inimigo
  private static evaluateCardStrength(card: Card, enemyField: Card[]): number {
    let score = card.attack;
    
    // Bonus por habilidade
    if (card.ability) score += 200;
    
    // Avaliar vantagem de tipo contra inimigos
    enemyField.forEach(enemy => {
      const advantage = this.getTypeAdvantage(card, enemy);
      if (advantage === 2) score += 400;
      else if (advantage === 0.5) score -= 300;
      else if (advantage === 0) score -= 500;
    });
    
    return score;
  }

  static decideNextMove(npc: Player, opponent: Player, phase: Phase, diff?: AIDifficulty): AIAction {
    // Se dificuldade foi passada, usar ela; senão usar a configurada
    const currentDiff = diff !== undefined ? diff : this.difficulty;
    
    // IA fácil pode pular ações aleatoriamente
    if (currentDiff === AIDifficulty.EASY && Math.random() < 0.2) {
      if (phase === Phase.MAIN) return { type: 'GO_TO_BATTLE' };
      return { type: 'END_TURN' };
    }

    if (phase === Phase.MAIN) {
      // Tentar usar spell primeiro (dificuldade normal+)
      if (currentDiff !== AIDifficulty.EASY) {
        const spellAction = this.tryUseSpell(npc, opponent);
        if (spellAction) return spellAction;
      }

      // Tentar setar trap
      const trapAction = this.trySetTrap(npc);
      if (trapAction) return trapAction;

      return this.handleMainPhase(npc, opponent);
    } 
    
    if (phase === Phase.BATTLE) {
      return this.handleBattlePhase(npc, opponent);
    }

    return { type: 'END_TURN' };
  }

  private static tryUseSpell(npc: Player, opponent: Player): AIAction | null {
    const spells = npc.hand.filter(c => c.cardType === CardType.SPELL);
    
    for (const spell of spells) {
      // Usar poções se HP baixo
      if (spell.spellEffect?.type === 'HEAL' && npc.hp < 4000) {
        return { type: 'USE_SPELL', cardId: spell.uniqueId };
      }
      
      // Usar dano se tem alvo
      if (spell.spellEffect?.type === 'DAMAGE' && opponent.field.length > 0) {
        const target = opponent.field[0];
        return { type: 'USE_SPELL', cardId: spell.uniqueId, targetId: target.uniqueId };
      }
      
      // Usar buff se tem Pokémon no campo
      if (spell.spellEffect?.type === 'BUFF' && npc.field.length > 0) {
        // Buff no mais forte
        const strongest = [...npc.field].sort((a, b) => b.attack - a.attack)[0];
        return { type: 'USE_SPELL', cardId: spell.uniqueId, targetId: strongest.uniqueId };
      }
    }
    
    return null;
  }

  private static trySetTrap(npc: Player): AIAction | null {
    if (npc.trapZone.length >= 2) return null;
    
    const traps = npc.hand.filter(c => c.cardType === CardType.TRAP && !c.isSet);
    if (traps.length > 0) {
      return { type: 'SET_TRAP', cardId: traps[0].uniqueId };
    }
    
    return null;
  }

  private static handleMainPhase(npc: Player, opponent: Player): AIAction {
    const playableHand = npc.hand.filter(c => 
      c.cardType === CardType.POKEMON && GameRules.canSummon(npc, c)
    );
    
    if (npc.field.length >= GameRules.MAX_FIELD_SIZE || playableHand.length === 0) {
      return { type: 'GO_TO_BATTLE' };
    }

    // Ordenar por força considerando o campo inimigo
    if (this.difficulty !== AIDifficulty.EASY) {
      playableHand.sort((a, b) => 
        this.evaluateCardStrength(b, opponent.field) - this.evaluateCardStrength(a, opponent.field)
      );
    } else {
      // IA fácil ordena aleatoriamente às vezes
      if (this.shouldMakeMistake()) {
        playableHand.sort(() => Math.random() - 0.5);
      } else {
        playableHand.sort((a, b) => b.attack - a.attack);
      }
    }

    const toSummon = playableHand[0];

    let sacrifices: string[] = [];
    if (toSummon.sacrificeRequired > 0) {
      const candidates = [...npc.hand.filter(c => c.uniqueId !== toSummon.uniqueId && c.cardType === CardType.POKEMON), ...npc.field];
      candidates.sort((a, b) => a.attack - b.attack);
      
      if (candidates.length >= toSummon.sacrificeRequired) {
        sacrifices = candidates.slice(0, toSummon.sacrificeRequired).map(c => c.uniqueId);
      } else {
        return { type: 'GO_TO_BATTLE' };
      }
    }

    return {
      type: 'SUMMON',
      cardId: toSummon.uniqueId,
      sacrifices
    };
  }

  private static handleBattlePhase(npc: Player, opponent: Player): AIAction {
    const validAttackers = npc.field.filter(c => !c.hasAttacked);

    if (validAttackers.length === 0) {
      return { type: 'END_TURN' };
    }

    // Ordenar atacantes por força
    validAttackers.sort((a, b) => b.attack - a.attack);
    const attacker = validAttackers[0];

    // Se oponente não tem campo, ataque direto
    if (opponent.field.length === 0) {
      return {
        type: 'ATTACK',
        cardId: attacker.uniqueId,
        targetId: undefined
      };
    }

    // Encontrar melhor alvo considerando vantagem de tipo
    let bestTarget: Card | undefined;
    let bestScore = -Infinity;

    for (const defender of opponent.field) {
      const typeAdvantage = this.getTypeAdvantage(attacker, defender);
      const effectiveAtk = Math.round(attacker.attack * typeAdvantage);
      const effectiveDef = Math.round(defender.attack * (GameRules.TYPE_TABLE[defender.type]?.[attacker.type] ?? 1));
      
      let score = 0;
      
      // Pode matar?
      if (effectiveAtk > effectiveDef) {
        score = 1000 + defender.attack; // Priorizar matar os mais fortes
        // Bonus se não morrer no processo
        if (effectiveAtk > defender.attack) score += 500;
      } else if (effectiveAtk === effectiveDef) {
        // Empate - só vale se o inimigo for forte
        score = defender.attack >= 1500 ? 100 : -100;
      } else {
        // Perde o combate
        score = -500;
      }
      
      // IA difícil considera dano ao jogador
      if (this.difficulty === AIDifficulty.HARD || this.difficulty === AIDifficulty.EXPERT) {
        if (effectiveAtk > effectiveDef) {
          const damageToPlayer = Math.max(0, effectiveAtk - defender.defense);
          score += damageToPlayer / 10;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestTarget = defender;
      }
    }

    // IA pode cometer erro na escolha de alvo
    if (this.shouldMakeMistake() && opponent.field.length > 1) {
      bestTarget = opponent.field[Math.floor(Math.random() * opponent.field.length)];
    }

    if (bestTarget && bestScore > -200) {
      return {
        type: 'ATTACK',
        cardId: attacker.uniqueId,
        targetId: bestTarget.uniqueId
      };
    }

    // Se não vale a pena atacar, encerrar turno
    // Mas IA fácil pode atacar mesmo assim
    if (this.difficulty === AIDifficulty.EASY && Math.random() < 0.5 && opponent.field.length > 0) {
      return {
        type: 'ATTACK',
        cardId: attacker.uniqueId,
        targetId: opponent.field[0].uniqueId
      };
    }

    return { type: 'END_TURN' };
  }
}
