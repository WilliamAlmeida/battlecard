
import { Player, Card, Phase, AIAction, AIActionType, AIDifficulty, CardType, SacrificeStrategy } from '../types';
import { GameRules } from '../utils/gameRules';

export class AIController {
  private static difficulty: AIDifficulty = AIDifficulty.NORMAL;
  private static sacrificeStrategy: SacrificeStrategy = SacrificeStrategy.AUTO;
  private static summonsThisTurn: number = 0;

  static setDifficulty(diff: AIDifficulty) {
    this.difficulty = diff;
  }

  static resetTurnCounters() {
    this.summonsThisTurn = 0;
  }

  static getDifficulty(): AIDifficulty {
    return this.difficulty;
  }

  static setSacrificeStrategy(strategy: SacrificeStrategy) {
    this.sacrificeStrategy = strategy;
  }

  static getSacrificeStrategy(): SacrificeStrategy {
    return this.sacrificeStrategy;
  }

  // Chance de cometer erro baseado na dificuldade
  private static shouldMakeMistake(): boolean {
    const mistakeChance = {
      [AIDifficulty.EASY]: 0.2,    // 20% chance de erro
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
    // Base: ATK + DEF (peso dominante 100%)
    let score = card.attack + (card.defense || 0);
    
    // Habilidade tem valor moderado (não deve superar diferença de 600+ em stats)
    if (card.ability) score += 300;
    
    // Avaliar vantagem de tipo contra inimigos (bônus moderado, não dominante)
    if (enemyField.length > 0) {
      let typeBonus = 0;
      let bestAdvantage = 1;
      
      // Pegar apenas a MELHOR vantagem de tipo, não acumular
      enemyField.forEach(enemy => {
        const advantage = this.getTypeAdvantage(card, enemy);
        if (advantage > bestAdvantage) bestAdvantage = advantage;
      });
      
      // Bônus/penalidade baseado na melhor vantagem
      if (bestAdvantage === 2) typeBonus = 500; // Super efetivo
      else if (bestAdvantage === 1.5) typeBonus = 300; // Efetivo
      else if (bestAdvantage === 0.5) typeBonus = -200; // Pouco efetivo
      else if (bestAdvantage === 0) typeBonus = -400; // Imune
      
      score += typeBonus;
    }
    
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

    if (playableHand.length === 0) {
      return { type: 'GO_TO_BATTLE' };
    }

    // Após o primeiro summon, 50% de chance de parar e ir para Battle
    if (this.summonsThisTurn > 0 && Math.random() < 0.5) {
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
      sacrifices = this.selectSacrifices(npc, toSummon, opponent);
      if (sacrifices.length < toSummon.sacrificeRequired) {
        return { type: 'GO_TO_BATTLE' };
      }
    }

    this.summonsThisTurn++;

    return {
      type: 'SUMMON',
      cardId: toSummon.uniqueId,
      sacrifices
    };
  }

  // ============================================
  // ESTRATÉGIAS DE SACRIFÍCIO
  // ============================================

  private static selectSacrifices(npc: Player, toSummon: Card, opponent?: Player): string[] {
    const required = toSummon.sacrificeRequired;
    const fieldCandidates = [...npc.field].filter(c => c.uniqueId !== toSummon.uniqueId);
    const handCandidates = npc.hand.filter(c => c.uniqueId !== toSummon.uniqueId && c.cardType === CardType.POKEMON);

    let strategy = this.sacrificeStrategy;
    
    // AUTO: selecionar estratégia baseada na dificuldade
    if (strategy === SacrificeStrategy.AUTO) {
      strategy = this.getAutoStrategy();
    }

    switch (strategy) {
      case SacrificeStrategy.RANDOM:
        return this.sacrificeRandom(fieldCandidates, handCandidates, required);
      case SacrificeStrategy.FIELD_FIRST:
        return this.sacrificeFieldFirst(fieldCandidates, handCandidates, required);
      case SacrificeStrategy.HAND_FIRST:
        return this.sacrificeHandFirst(fieldCandidates, handCandidates, required);
      case SacrificeStrategy.SMART_HYBRID:
        return this.sacrificeSmartHybrid(npc, fieldCandidates, handCandidates, required);
      case SacrificeStrategy.SCORE_BASED:
        return this.sacrificeScoreBased(fieldCandidates, handCandidates, required, opponent?.field);
      default:
        return this.sacrificeSmartHybrid(npc, fieldCandidates, handCandidates, required);
    }
  }

  private static getAutoStrategy(): SacrificeStrategy {
    switch (this.difficulty) {
      case AIDifficulty.EASY:
        return SacrificeStrategy.RANDOM;
      case AIDifficulty.NORMAL:
        return SacrificeStrategy.SMART_HYBRID;
      case AIDifficulty.HARD:
      case AIDifficulty.EXPERT:
        return SacrificeStrategy.SCORE_BASED;
      default:
        return SacrificeStrategy.SMART_HYBRID;
    }
  }

  // Estratégia 1: RANDOM (para IA fácil)
  private static sacrificeRandom(field: Card[], hand: Card[], required: number): string[] {
    const all = [...field, ...hand];
    const shuffled = all.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, required).map(c => c.uniqueId);
  }

  // Estratégia 2: FIELD_FIRST (prioriza campo, mais fracos primeiro)
  private static sacrificeFieldFirst(field: Card[], hand: Card[], required: number): string[] {
    // Ordena por força total (ATK + DEF), mais fracos primeiro
    field.sort((a, b) => (a.attack + (a.defense || 0)) - (b.attack + (b.defense || 0)));
    hand.sort((a, b) => (a.attack + (a.defense || 0)) - (b.attack + (b.defense || 0)));
    const candidates = [...field, ...hand];
    return candidates.slice(0, required).map(c => c.uniqueId);
  }

  // Estratégia 3: HAND_FIRST (prioriza mão, mais fracos primeiro)
  private static sacrificeHandFirst(field: Card[], hand: Card[], required: number): string[] {
    // Ordena por força total (ATK + DEF), mais fracos primeiro
    field.sort((a, b) => (a.attack + (a.defense || 0)) - (b.attack + (b.defense || 0)));
    hand.sort((a, b) => (a.attack + (a.defense || 0)) - (b.attack + (b.defense || 0)));
    const candidates = [...hand, ...field];
    return candidates.slice(0, required).map(c => c.uniqueId);
  }

  // Estratégia 4: SMART_HYBRID (mantém campo quando possível)
  private static sacrificeSmartHybrid(npc: Player, field: Card[], hand: Card[], required: number): string[] {
    // Ordena por força total (ATK + DEF), mais fracos primeiro
    hand.sort((a, b) => (a.attack + (a.defense || 0)) - (b.attack + (b.defense || 0)));
    field.sort((a, b) => (a.attack + (a.defense || 0)) - (b.attack + (b.defense || 0)));

    // Se campo não está cheio, tentar pegar todos da mão
    if (npc.field.length < GameRules.MAX_FIELD_SIZE) {
      if (hand.length >= required) {
        // Pode sacrificar só da mão (os mais fracos)
        return hand.slice(0, required).map(c => c.uniqueId);
      } else {
        // Pega o que tem na mão + complementa com campo (os mais fracos)
        const fromHand = hand.map(c => c.uniqueId);
        const needFromField = required - hand.length;
        const fromField = field.slice(0, needFromField).map(c => c.uniqueId);
        return [...fromHand, ...fromField];
      }
    } else {
      // Campo cheio: DEVE sacrificar do campo primeiro (os mais fracos)
      const candidates = [...field, ...hand];
      return candidates.slice(0, required).map(c => c.uniqueId);
    }
  }

  // Estratégia 5: SCORE_BASED (híbrido com pontuação)
  private static sacrificeScoreBased(field: Card[], hand: Card[], required: number, enemyField?: Card[]): string[] {
    const scoreCard = (card: Card, isOnField: boolean): number => {
      // Base: ATK + DEF é o fator mais importante (peso 100%)
      let score = card.attack + (card.defense || 0);
      
      // Habilidades NÃO afetam decisão de sacrifício (peso 0 conforme solicitado)
      // if (card.ability) score += 0;
      
      // Pokémon no campo tem valor por pressão/posição (5% extra)
      if (isOnField) score += 200;
      
      // Se já atacou, vale um pouco menos, mas não muito (redução de apenas 3%)
      if (isOnField && card.hasAttacked) score -= 100;
      
      // Considerar vantagem de tipo contra o campo inimigo
      if (enemyField && enemyField.length > 0) {
        let typeBonus = 0;
        let advantageCount = 0;
        let disadvantageCount = 0;
        
        enemyField.forEach(enemy => {
          const advantage = this.getTypeAdvantage(card, enemy);
          if (advantage === 2) {
            advantageCount++;
            typeBonus += 400; // Super efetivo = muito valioso
          } else if (advantage === 1.5) {
            advantageCount++;
            typeBonus += 300; // Vantagem = valioso
          } else if (advantage === 0.5) {
            disadvantageCount++;
            typeBonus -= 200; // Desvantagem = menos valioso
          } else if (advantage === 0) {
            disadvantageCount++;
            typeBonus -= 300; // Imune ao inimigo = menos valioso
          }
        });
        
        // Bônus extra se tem vantagem contra múltiplos inimigos
        if (advantageCount > 1) typeBonus += 200 * (advantageCount - 1);
        
        score += typeBonus;
      }
      
      return score;
    };

    const allCandidates = [
      ...field.map(c => ({ card: c, score: scoreCard(c, true) })),
      ...hand.map(c => ({ card: c, score: scoreCard(c, false) }))
    ];

    allCandidates.sort((a, b) => a.score - b.score); // Menor score = sacrificar primeiro
    return allCandidates.slice(0, required).map(c => c.card.uniqueId);
  }

  // ============================================
  // FIM DAS ESTRATÉGIAS DE SACRIFÍCIO
  // ============================================

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
