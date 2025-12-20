import { useState, useEffect, useRef, useCallback } from 'react';
import { Player, Card, Phase, GameLogEntry, ElementType, StatusEffect, AIDifficulty, GameMode, AbilityTrigger, CardType } from '../types';
import { INITIAL_DECK, SPELL_CARDS, TRAP_CARDS, ABILITIES } from '../constants';
import { GameRules } from '../utils/gameRules';
import { AIController } from '../classes/AIController';
import { soundService } from '../services/soundService';
import { statsService } from '../services/statsService';
import { achievementsService } from '../services/achievementsService';

type CardBase = Omit<Card, 'uniqueId' | 'hasAttacked' | 'statusEffects' | 'statusDuration'>;

const generateUniqueId = () => Math.random().toString(36).substr(2, 9);
const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Status effect handlers
const processStatusEffects = (card: Card): { card: Card, damage: number, canAct: boolean, logs: string[] } => {
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

const getStatusName = (status: StatusEffect): string => {
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

const applyStatusEffect = (card: Card, status: StatusEffect, duration: number = 3): Card => {
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

export const useGameLogic = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [starter, setStarter] = useState<'player' | 'npc'>('player');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'npc' | null>(null);
  const [logs, setLogs] = useState<GameLogEntry[]>([]);
  
  const [player, setPlayer] = useState<Player>({ id: 'player', hp: 8000, hand: [], field: [], deck: [], graveyard: [], trapZone: [] });
  const [npc, setNpc] = useState<Player>({ id: 'npc', hp: 8000, hand: [], field: [], deck: [], graveyard: [], trapZone: [] });
  
  const [turnCount, setTurnCount] = useState(1);
  const [currentTurnPlayer, setCurrentTurnPlayer] = useState<'player' | 'npc'>('player');
  const [phase, setPhase] = useState<Phase>(Phase.DRAW);
  
  const [attackingCardId, setAttackingCardId] = useState<string | null>(null);
  const [damagedCardId, setDamagedCardId] = useState<string | null>(null);
  const [floatingDamage, setFloatingDamage] = useState<{id: string, value: number, targetId: string} | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Game settings
  const [difficulty, setDifficulty] = useState<AIDifficulty>(AIDifficulty.NORMAL);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.QUICK_BATTLE);

  // Stats tracking
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);
  const [cardsDestroyed, setCardsDestroyed] = useState(0);
  const [statusInflicted, setStatusInflicted] = useState<Record<string, number>>({});

  const gameStateRef = useRef({ player, npc, phase, currentTurnPlayer, gameOver, gameStarted, isAnimating, turnCount, starter, difficulty });

  useEffect(() => {
    gameStateRef.current = { player, npc, phase, currentTurnPlayer, gameOver, gameStarted, isAnimating, turnCount, starter, difficulty };
  }, [player, npc, phase, currentTurnPlayer, gameOver, gameStarted, isAnimating, turnCount, starter, difficulty]);

  const addLog = useCallback((message: string, type: 'info' | 'combat' | 'effect' = 'info') => {
    const id = generateUniqueId();
    setLogs(prev => [{ id, message, type, timestamp: Date.now() }, ...prev].slice(0, 50));
    
    // Play sound effects based on log type
    if (type === 'combat') {
      soundService.playAttack();
    } else if (type === 'effect') {
      soundService.playBuff();
    }
  }, []);

  // Process status effects at start of turn
  const processFieldStatusEffects = useCallback(() => {
    const isPlayer = gameStateRef.current.currentTurnPlayer === 'player';
    const current = isPlayer ? gameStateRef.current.player : gameStateRef.current.npc;
    
    let totalStatusDamage = 0;
    const processedField: Card[] = [];
    
    current.field.forEach(card => {
      const result = processStatusEffects(card);
      result.logs.forEach(log => addLog(log, 'effect'));
      totalStatusDamage += result.damage;
      
      if (result.damage > 0) {
        soundService.playDamage();
      }
      
      processedField.push({
        ...result.card,
        hasAttacked: card.hasAttacked || !result.canAct
      });
    });

    if (totalStatusDamage > 0) {
      const fn = isPlayer ? setPlayer : setNpc;
      fn(p => ({
        ...p,
        field: processedField,
        hp: Math.max(0, p.hp - totalStatusDamage)
      }));
      
      if (current.hp - totalStatusDamage <= 0) {
        setWinner(isPlayer ? 'npc' : 'player');
        setGameOver(true);
      }
    } else {
      const fn = isPlayer ? setPlayer : setNpc;
      fn(p => ({ ...p, field: processedField }));
    }
  }, [addLog]);

  const handleDrawPhase = useCallback(() => {
    const isPlayer = gameStateRef.current.currentTurnPlayer === 'player';
    const cur = isPlayer ? gameStateRef.current.player : gameStateRef.current.npc;
    
    // Process status effects at start of turn
    processFieldStatusEffects();
    
    if (cur.deck.length === 0) { 
      setWinner(isPlayer ? 'npc' : 'player'); 
      setGameOver(true); 
      return; 
    }
    
    const newDeck = [...cur.deck];
    const card = newDeck.shift()!;
    const fn = isPlayer ? setPlayer : setNpc;
    
    fn(p => ({ ...p, deck: newDeck, hand: [...p.hand, card] }));
    soundService.playDraw();
    setPhase(Phase.MAIN);
    addLog(`${isPlayer ? 'Você' : 'Oponente'} comprou uma carta.`);
  }, [addLog, processFieldStatusEffects]);

  const startGame = (options?: { difficulty?: AIDifficulty, mode?: GameMode, customDeck?: CardBase[], npcDeck?: CardBase[], npcHp?: number }) => {
    const diff = options?.difficulty || AIDifficulty.NORMAL;
    const mode = options?.mode || GameMode.QUICK_BATTLE;
    
    setDifficulty(diff);
    setGameMode(mode);
    
    const fullDeck = options?.customDeck || INITIAL_DECK.map(c => ({ ...c }));
    const npDeck = options?.npcDeck || INITIAL_DECK.map(c => ({ ...c }));
    
    const playerDeck = shuffle(fullDeck).map(c => ({ ...c, uniqueId: generateUniqueId(), hasAttacked: false }));
    const npcDeckShuffled = shuffle(npDeck).map(c => ({ ...c, uniqueId: generateUniqueId(), hasAttacked: false }));

    const npcHp = options?.npcHp || 8000;

    setPlayer({ id: 'player', hp: 8000, hand: playerDeck.splice(0, 5), deck: playerDeck, field: [], graveyard: [], trapZone: [] });
    setNpc({ id: 'npc', hp: npcHp, hand: npcDeckShuffled.splice(0, 5), deck: npcDeckShuffled, field: [], graveyard: [], trapZone: [] });
    setTurnCount(1);
    setCurrentTurnPlayer('player');
    setStarter('player');
    setPhase(Phase.MAIN);
    setLogs([]);
    setGameStarted(true);
    setGameOver(false);
    setWinner(null);
    addLog("Batalha iniciada! Seu turno.");
  };

  useEffect(() => {
    // Se entrarmos em BATTLE no primeiro turno, quem iniciou não pode atacar — passar a vez imediatamente
    if (phase === Phase.BATTLE && gameStarted && !gameOver && gameStateRef.current.turnCount === 1) {
      const current = gameStateRef.current.currentTurnPlayer;
      const whoStarted = gameStateRef.current.starter;
      if (current === whoStarted) {
        addLog('Quem iniciou não pode atacar no primeiro turno. Passando a vez...');
        setPhase(Phase.DRAW);
        setCurrentTurnPlayer(current === 'player' ? 'npc' : 'player');
        setTurnCount(c => c + 1);
        setPlayer(p => ({ ...p, field: p.field.map(c => ({ ...c, hasAttacked: false })) }));
        setNpc(p => ({ ...p, field: p.field.map(c => ({ ...c, hasAttacked: false })) }));
        return;
      }
    }
  }, [phase, gameStarted, gameOver]);

  const executeAttack = useCallback(async (attackerId: string, targetId: string | null, ownerId: 'player' | 'npc') => {
    if (gameStateRef.current.isAnimating) return;

    // Não permitir atacar no primeiro turno quem iniciou o jogo
    if (gameStateRef.current.turnCount === 1 && gameStateRef.current.currentTurnPlayer === ownerId) {
      addLog('Quem começou o jogo não pode atacar no primeiro turno.');
      return;
    }

    setIsAnimating(true);
    setAttackingCardId(attackerId);

    const isPlayer = ownerId === 'player';
    const attackerState = isPlayer ? gameStateRef.current.player : gameStateRef.current.npc;
    const defenderState = isPlayer ? gameStateRef.current.npc : gameStateRef.current.player;
    const attacker = attackerState.field.find(c => c.uniqueId === attackerId);

    if (!attacker) {
      setIsAnimating(false);
      setAttackingCardId(null);
      return;
    }

    // Marcar ataque realizado
    if (isPlayer) {
      setPlayer(p => ({ ...p, field: p.field.map(c => c.uniqueId === attackerId ? { ...c, hasAttacked: true } : c) }));
    } else {
      setNpc(p => ({ ...p, field: p.field.map(c => c.uniqueId === attackerId ? { ...c, hasAttacked: true } : c) }));
    }

    await new Promise(r => setTimeout(r, 600));

    if (!targetId) {
      const damage = attacker.attack;
      addLog(`ATAQUE DIRETO! ${attacker.name} causou ${damage} de dano!`, 'combat');
      setFloatingDamage({ id: generateUniqueId(), value: damage, targetId: isPlayer ? 'npc-hp' : 'player-hp' });
      
      const fn = isPlayer ? setNpc : setPlayer;
      fn(prev => {
        const newHp = Math.max(0, prev.hp - damage);
        if (newHp <= 0) { setWinner(isPlayer ? 'player' : 'npc'); setGameOver(true); }
        return { ...prev, hp: newHp };
      });
    } else {
      const defender = defenderState.field.find(c => c.uniqueId === targetId);
      if (defender) {
        setDamagedCardId(targetId);
        const result = GameRules.resolveCombat(attacker, defender);
        addLog(`${attacker.name} efetivo ${result.attackerEffective} (x${result.multiplier}) vs ${defender.name} efetivo ${result.defenderEffective}`, 'combat');
        
        if (result.damageToDefenderOwner > 0) {
          setFloatingDamage({ id: generateUniqueId(), value: result.damageToDefenderOwner, targetId: isPlayer ? 'npc-hp' : 'player-hp' });
          const fn = isPlayer ? setNpc : setPlayer;
          fn(p => ({ ...p, hp: Math.max(0, p.hp - result.damageToDefenderOwner) }));
          if (defenderState.hp - result.damageToDefenderOwner <= 0) { setWinner(isPlayer ? 'player' : 'npc'); setGameOver(true); }
          addLog(`Dono de ${defender.name} sofreu ${result.damageToDefenderOwner} de dano (DEF ${defender.defense} reduzido).`, 'combat');
        }

        if (result.damageToAttackerOwner > 0) {
          setFloatingDamage({ id: generateUniqueId(), value: result.damageToAttackerOwner, targetId: isPlayer ? 'player-hp' : 'npc-hp' });
          const fn = isPlayer ? setPlayer : setNpc;
          fn(p => ({ ...p, hp: Math.max(0, p.hp - result.damageToAttackerOwner) }));
          if (attackerState.hp - result.damageToAttackerOwner <= 0) { setWinner(isPlayer ? 'npc' : 'player'); setGameOver(true); }
          addLog(`Dono de ${attacker.name} sofreu ${result.damageToAttackerOwner} de dano (DEF ${attacker.defense} reduzido).`, 'combat');
        }

        addLog(`${attacker.name} (ATK ${attacker.attack}) desafiou ${defender.name} (ATK ${defender.attack} / DEF ${defender.defense})!`, 'combat');

        // Track stats for player
        if (isPlayer) {
          setTotalDamageDealt(prev => prev + (result.damageToDefenderOwner || 0));
        }

        setTimeout(() => {
          if (!result.defenderSurvived) {
            const fn = isPlayer ? setNpc : setPlayer;
            fn(p => ({ ...p, field: p.field.filter(c => c.uniqueId !== targetId), graveyard: [...p.graveyard, defender] }));
            addLog(`${defender.name} foi nocauteado!`, 'info');
            soundService.playDestroy();
            
            // Track destruction for player
            if (isPlayer) {
              setCardsDestroyed(prev => prev + 1);
            }
          }
          if (!result.attackerSurvived) {
            const fn = isPlayer ? setPlayer : setNpc;
            fn(p => ({ ...p, field: p.field.filter(c => c.uniqueId !== attackerId), graveyard: [...p.graveyard, attacker] }));
            addLog(`${attacker.name} foi nocauteado no contra-ataque!`, 'info');
            soundService.playDestroy();
          }
        }, 200);
      }
    }

    setTimeout(() => {
      setAttackingCardId(null);
      setDamagedCardId(null);
      setFloatingDamage(null);
      setIsAnimating(false);
    }, 600);
  }, [addLog]);

  // Handle game end - update stats and achievements
  useEffect(() => {
    if (gameOver && winner) {
      const playerWon = winner === 'player';
      
      // Play sound
      if (playerWon) {
        soundService.playVictory();
      } else {
        soundService.playDefeat();
      }
      
      // Update stats
      statsService.recordGame({
        won: playerWon,
        damageDealt: totalDamageDealt,
        cardsDestroyed: cardsDestroyed,
        turns: turnCount,
        mode: gameMode,
        perfect: playerWon && player.hp === 8000
      });
      
      // Check achievements
      achievementsService.checkAchievements();
    }
  }, [gameOver, winner, totalDamageDealt, cardsDestroyed, turnCount, gameMode, player.hp]);

  useEffect(() => {
    if (currentTurnPlayer === 'npc' && !gameOver && gameStarted && !isAnimating) {
      const timer = setTimeout(async () => {
        if (phase === Phase.DRAW) {
          handleDrawPhase();
        } else {
          const action = AIController.decideNextMove(npc, player, phase, gameStateRef.current.difficulty);
          if (action.type === 'SUMMON' && action.cardId) {
            const card = npc.hand.find(c => c.uniqueId === action.cardId);
            if (card) {
               setNpc(p => {
                 const newHand = p.hand.filter(c => c.uniqueId !== action.cardId && !(action.sacrifices || []).includes(c.uniqueId));
                 const newField = p.field.filter(c => !(action.sacrifices || []).includes(c.uniqueId));
                 return { ...p, hand: newHand, field: [...newField, { ...card, hasAttacked: false }], graveyard: [...p.graveyard] };
               });
               addLog(`CPU invocou ${card.name}!`);
               soundService.playSummon();
               setPhase(Phase.BATTLE);
            }
          } else if (action.type === 'ATTACK' && action.cardId) {
            executeAttack(action.cardId, action.targetId || null, 'npc');
          } else if (action.type === 'GO_TO_BATTLE') {
            setPhase(Phase.BATTLE);
          } else {
            setPhase(Phase.DRAW);
            setCurrentTurnPlayer('player');
            setTurnCount(c => c + 1);
            setPlayer(p => ({ ...p, field: p.field.map(c => ({ ...c, hasAttacked: false })) }));
            setNpc(p => ({ ...p, field: p.field.map(c => ({ ...c, hasAttacked: false })) }));
            addLog("Seu Turno! Compre uma carta.");
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    // Auto draw phase para o player
    if (currentTurnPlayer === 'player' && phase === Phase.DRAW && !gameOver && gameStarted && !isAnimating) {
      const timer = setTimeout(() => {
        handleDrawPhase();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentTurnPlayer, phase, gameOver, gameStarted, isAnimating, npc, player, handleDrawPhase, executeAttack, addLog]);

  // Summon with ability trigger
  const summonCard = useCallback((owner: 'player' | 'npc', cardId: string, sacrifices: string[]) => {
    const setFn = owner === 'player' ? setPlayer : setNpc;
    const state = owner === 'player' ? gameStateRef.current.player : gameStateRef.current.npc;
    const card = state.hand.find(c => c.uniqueId === cardId);
    
    if (!card) return;
    
    setFn(p => ({
      ...p,
      hand: p.hand.filter(c => c.uniqueId !== cardId && !sacrifices.includes(c.uniqueId)),
      field: [...p.field.filter(c => !sacrifices.includes(c.uniqueId)), { ...card, hasAttacked: false }],
      graveyard: [...p.graveyard, ...p.field.filter(c => sacrifices.includes(c.uniqueId))]
    }));
    
    soundService.playSummon();
    addLog(`${owner === 'player' ? 'Você' : 'CPU'} invocou ${card.name}!`);
    
    // Trigger ON_SUMMON ability
    if (card.ability?.trigger === AbilityTrigger.ON_SUMMON) {
      addLog(`${card.name} ativou ${card.ability.name}!`, 'effect');
      soundService.playBuff();
    }
  }, [addLog]);

  return {
    gameStarted, gameOver, winner, player, npc, turnCount, currentTurnPlayer, phase, logs,
    isAIProcessing: isAnimating,
    attackingCardId, damagedCardId, floatingDamage,
    difficulty, gameMode,
    startGame, 
    setPhase, 
    summonCard,
    executeAttack,
    endTurn: () => {
      setPhase(Phase.DRAW);
      setCurrentTurnPlayer('npc');
      setPlayer(p => ({ ...p, field: p.field.map(c => ({ ...c, hasAttacked: false })) }));
      setNpc(p => ({ ...p, field: p.field.map(c => ({ ...c, hasAttacked: false })) }));
      addLog("Encerrando turno. CPU está pensando...");
    },
    addLog,
    // Reset game
    resetGame: () => {
      setGameStarted(false);
      setGameOver(false);
      setWinner(null);
      setTotalDamageDealt(0);
      setCardsDestroyed(0);
    }
  };
};