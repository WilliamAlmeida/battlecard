import { CardBase } from './types';
import { shuffle } from './helpers';
import { AIDifficulty, Rarity } from '../../types';
import { NPC_DECK_DISTRIBUTION } from '../../constants';

// Build NPC deck of fixed size (defaults to 40) respecting rarity distribution
export const buildNpcDeck = (cards: CardBase[], size = 40, difficulty?: AIDifficulty) => {
  if (!cards || cards.length === 0) return [] as CardBase[];
  const poolOne: CardBase[] = []; // COMMON
  const poolTwo: CardBase[] = []; // UNCOMMON
  const poolThree: CardBase[] = []; // RARE+EPIC+LEGENDARY

  cards.forEach(c => {
    if (c.rarity === Rarity.COMMON) poolOne.push(c);
    else if (c.rarity === Rarity.UNCOMMON) poolTwo.push(c);
    else poolThree.push(c);
  });

  // Choose distribution based on difficulty (from constants)
  const dist = NPC_DECK_DISTRIBUTION[difficulty || AIDifficulty.NORMAL] || NPC_DECK_DISTRIBUTION[AIDifficulty.NORMAL];
  const targetOne = Math.max(0, Math.min(size, dist.common));
  const targetTwo = Math.max(0, Math.min(size - targetOne, dist.uncommon));
  const targetThree = Math.max(0, size - targetOne - targetTwo);

  const pickFrom = (pool: CardBase[], n: number) => shuffle(pool).slice(0, Math.min(n, pool.length));

  let selected: CardBase[] = [];
  selected = selected.concat(pickFrom(poolOne, targetOne));
  selected = selected.concat(pickFrom(poolTwo, targetTwo));
  selected = selected.concat(pickFrom(poolThree, targetThree));

  const remainingNeeded = size - selected.length;
  if (remainingNeeded > 0) {
    const remainingPool = shuffle(cards.filter(c => !selected.includes(c)));
    selected = selected.concat(remainingPool.slice(0, remainingNeeded));
  }

  if (selected.length > size) selected = selected.slice(0, size);

  return shuffle(selected);
};
