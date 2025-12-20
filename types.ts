
export enum ElementType {
  GRASS = 'GRASS',
  FIRE = 'FIRE',
  WATER = 'WATER',
  ELECTRIC = 'ELECTRIC',
  NORMAL = 'NORMAL',
  BUG = 'BUG',
  POISON = 'POISON',
  GROUND = 'GROUND',
  FIGHTING = 'FIGHTING',
  PSYCHIC = 'PSYCHIC'
}

export interface Card {
  id: string; // ID do modelo (ex: 'bulbasaur')
  uniqueId: string; // ID único da instância em jogo
  name: string;
  type: ElementType;
  attack: number;
  defense: number;
  sacrificeRequired: number; // 0, 1 ou 2
  level: number; // 1, 2 ou 3
  hasAttacked: boolean;
}

export interface Player {
  id: string;
  hp: number;
  hand: Card[];
  field: Card[];
  deck: Card[];
  graveyard: Card[];
}

export enum Phase {
  DRAW = 'DRAW',
  MAIN = 'MAIN',
  BATTLE = 'BATTLE',
  END = 'END'
}

export interface GameLogEntry {
  id: string;
  message: string;
  type: 'info' | 'combat' | 'effect';
  timestamp: number;
}

// Tipos para Ações da IA
export type AIActionType = 'SUMMON' | 'ATTACK' | 'END_TURN' | 'GO_TO_BATTLE' | 'WAIT';

export interface AIAction {
  type: AIActionType;
  cardId?: string; // Carta usada (da mão ou campo)
  targetId?: string; // Alvo do ataque
  sacrifices?: string[]; // IDs para sacrifício
}
