import { Card, ElementType } from './types';

// Função auxiliar para criar cartas
const createCard = (
  id: string,
  name: string,
  type: ElementType,
  attack: number,
  defense: number,
  level: number
): Omit<Card, 'uniqueId' | 'hasAttacked'> => ({
  id,
  name,
  type,
  attack,
  defense,
  level,
  sacrificeRequired: level === 1 ? 0 : level === 2 ? 1 : 2,
});

export const INITIAL_DECK: Omit<Card, 'uniqueId' | 'hasAttacked'>[] = [
  // Grass (Bulbasaur Line)
  createCard('001', 'Bulbasaur', ElementType.GRASS, 1200, 1000, 1),
  createCard('002', 'Ivysaur', ElementType.GRASS, 1800, 1600, 2),
  createCard('003', 'Venusaur', ElementType.GRASS, 2600, 2400, 3),
  
  // Fire (Charmander Line)
  createCard('004', 'Charmander', ElementType.FIRE, 1400, 800, 1),
  createCard('005', 'Charmeleon', ElementType.FIRE, 2000, 1400, 2),
  createCard('006', 'Charizard', ElementType.FIRE, 2800, 2000, 3),

  // Water (Squirtle Line)
  createCard('007', 'Squirtle', ElementType.WATER, 1000, 1500, 1),
  createCard('008', 'Wartortle', ElementType.WATER, 1600, 2000, 2),
  createCard('009', 'Blastoise', ElementType.WATER, 2400, 2800, 3),

  // Bug (Caterpie/Weedle Lines - Mix)
  createCard('010', 'Caterpie', ElementType.BUG, 800, 800, 1),
  createCard('012', 'Butterfree', ElementType.BUG, 1700, 1500, 2),
  createCard('015', 'Beedrill', ElementType.POISON, 2200, 1200, 2), // Buffed for gameplay balance as stage 2 equivalent stats but stage 1 cost maybe? No, let's stick to standard rules.
  createCard('049', 'Venomoth', ElementType.BUG, 1900, 1600, 2),
  createCard('123', 'Scyther', ElementType.BUG, 2300, 1800, 2), // Strong basic/stage 1
  
  // Normal types
  createCard('016', 'Pidgey', ElementType.NORMAL, 1000, 900, 1),
  createCard('017', 'Pidgeotto', ElementType.NORMAL, 1600, 1400, 2),
  createCard('018', 'Pidgeot', ElementType.NORMAL, 2400, 2200, 3),
  createCard('019', 'Rattata', ElementType.NORMAL, 1100, 800, 1),
  createCard('020', 'Raticate', ElementType.NORMAL, 1800, 1500, 2),
  createCard('143', 'Snorlax', ElementType.NORMAL, 2500, 2500, 3), // Tanky beast
  
  // Electric
  createCard('025', 'Pikachu', ElementType.ELECTRIC, 1300, 900, 1),
  createCard('026', 'Raichu', ElementType.ELECTRIC, 2400, 1800, 2), // Stronger evolution
  createCard('100', 'Voltorb', ElementType.ELECTRIC, 1000, 1000, 1),
  createCard('101', 'Electrode', ElementType.ELECTRIC, 1900, 1500, 2),
  
  // Ground
  createCard('027', 'Sandshrew', ElementType.GROUND, 1100, 1400, 1),
  createCard('028', 'Sandslash', ElementType.GROUND, 1900, 2100, 2),
  createCard('050', 'Diglett', ElementType.GROUND, 1000, 800, 1),
  createCard('051', 'Dugtrio', ElementType.GROUND, 1800, 1200, 2),

  // Psychic
  createCard('063', 'Abra', ElementType.PSYCHIC, 800, 500, 1),
  createCard('064', 'Kadabra', ElementType.PSYCHIC, 1800, 1000, 2),
  createCard('065', 'Alakazam', ElementType.PSYCHIC, 2700, 1500, 3),
  
  // Fighting
  createCard('066', 'Machop', ElementType.FIGHTING, 1300, 1000, 1),
  createCard('067', 'Machoke', ElementType.FIGHTING, 1900, 1600, 2),
  createCard('068', 'Machamp', ElementType.FIGHTING, 2700, 2300, 3),
];