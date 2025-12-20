
import { Player, Card, Phase, AIAction, AIActionType } from '../types';
import { GameRules } from '../utils/gameRules';

export class AIController {
  static decideNextMove(npc: Player, opponent: Player, phase: Phase): AIAction {
    if (phase === Phase.MAIN) {
      return this.handleMainPhase(npc);
    } 
    
    if (phase === Phase.BATTLE) {
      return this.handleBattlePhase(npc, opponent);
    }

    return { type: 'END_TURN' };
  }

  private static handleMainPhase(npc: Player): AIAction {
    // 1. Verificar se pode invocar algo forte
    const playableHand = npc.hand.filter(c => GameRules.canSummon(npc, c));
    
    // Se campo cheio, não invoca
    if (npc.field.length >= GameRules.MAX_FIELD_SIZE || playableHand.length === 0) {
      return { type: 'GO_TO_BATTLE' };
    }

    // Ordenar por força (os mais fortes primeiro)
    playableHand.sort((a, b) => b.attack - a.attack);
    const toSummon = playableHand[0];

    // Lógica simples de sacrifício: sacrificar os mais fracos
    let sacrifices: string[] = [];
    if (toSummon.sacrificeRequired > 0) {
      const candidates = [...npc.hand.filter(c => c.uniqueId !== toSummon.uniqueId), ...npc.field];
      // Ordenar candidatos por ataque crescente (sacrificar os fracos)
      candidates.sort((a, b) => a.attack - b.attack);
      
      if (candidates.length >= toSummon.sacrificeRequired) {
        sacrifices = candidates.slice(0, toSummon.sacrificeRequired).map(c => c.uniqueId);
      } else {
        // Se algo deu errado na validação, aborta summon
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
    // Pegar atacantes válidos (não atacaram e não têm enjoo de invocação se for regra, mas aqui assumimos que só atacam se hasAttacked for false)
    // No seu código original, monstros invocados no turno ganhavam hasAttacked=true (enjoo).
    // Então filtramos por !hasAttacked.
    const validAttackers = npc.field.filter(c => !c.hasAttacked);

    if (validAttackers.length === 0) {
      return { type: 'END_TURN' };
    }

    const attacker = validAttackers[0]; // Pega o primeiro disponível

    // Se oponente não tem campo, ataque direto
    if (opponent.field.length === 0) {
      return {
        type: 'ATTACK',
        cardId: attacker.uniqueId,
        targetId: undefined // Direct attack
      };
    }

    // Escolher alvo
    // Tenta matar o mais forte que consegue
    const killable = opponent.field.filter(def => attacker.attack > def.attack);
    const suicidable = opponent.field.filter(def => attacker.attack === def.attack);

    let target: Card | undefined;

    if (killable.length > 0) {
      killable.sort((a, b) => b.attack - a.attack); // Prioriza matar a maior ameaça
      target = killable[0];
    } else if (suicidable.length > 0) {
      // Se não mata ninguém, vê se vale a pena suicidar contra algo forte
      suicidable.sort((a, b) => b.attack - a.attack);
      if (suicidable[0].attack >= 1500) { // Só suicida se o inimigo for relevante
        target = suicidable[0];
      }
    }

    if (target) {
      return {
        type: 'ATTACK',
        cardId: attacker.uniqueId,
        targetId: target.uniqueId
      };
    }

    // Se não vale a pena atacar com este, marca como "já atacou" para a IA pular ele na próxima iteração
    // Na verdade, retornaremos WAIT ou END se nenhum ataque for bom, 
    // mas para simplificar o loop da engine, vamos fazer ele pular o ataque.
    // Como a engine executa uma ação por vez, vamos pular este atacante internamente na engine ou forçar fim.
    
    // Melhor estratégia simples: Se não consegue atacar bem, passa a vez.
    return { type: 'END_TURN' };
  }
}
