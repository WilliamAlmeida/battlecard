import { Card, StatusEffect, Player } from '../../types';

export type CardBase = Omit<Card, 'uniqueId' | 'hasAttacked' | 'statusEffects' | 'statusDuration'>;

export type AbilityProcessResult = {
  logs: string[];
  drawCards?: number;
  healOwner?: number;
  statusToApply?: { target: Card; status: StatusEffect }[];
  reviveCard?: Card;
};

export type TrapCheckResult = {
  activatedTraps: Card[];
  damageToOpponentPlayer: number;
  statusEffects: Array<{ target: Card; status: StatusEffect }>;
  destroyTargets: string[];
  logs: string[];
  debuffTargets: Array<{ targetId: string; value: number; stat?: 'ATTACK' | 'DEFENSE' }>;
  negateAttack: boolean;
  surviveTrap: boolean;
};

export type StatusProcessResult = {
  card: Card;
  damage: number;
  canAct: boolean;
  logs: string[];
};

export type PassiveStats = {
  attack: number;
  defense: number;
  evasion?: number;
};

export type GameStateRef = {
  player: Player;
  npc: Player;
  phase: string;
  currentTurnPlayer: 'player' | 'npc';
  gameOver: boolean;
  gameStarted: boolean;
  isAnimating: boolean;
  turnCount: number;
  starter: 'player' | 'npc';
  difficulty: string;
};
