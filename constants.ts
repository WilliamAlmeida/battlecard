import { Card, ElementType, CardType, Rarity, Ability, AbilityTrigger, StatusEffect, SpellEffect, TrapCondition } from './types';

// Função auxiliar para criar cartas de Pokémon
const createCard = (
  id: string,
  name: string,
  type: ElementType,
  attack: number,
  defense: number,
  level: number,
  rarity: Rarity = Rarity.COMMON,
  ability?: Ability
): Omit<Card, 'uniqueId' | 'hasAttacked' | 'statusEffects' | 'statusDuration'> => ({
  id,
  name,
  type,
  cardType: CardType.POKEMON,
  attack,
  defense,
  level,
  sacrificeRequired: level === 1 ? 0 : level === 2 ? 1 : 2,
  rarity,
  ability,
});

// Função auxiliar para criar cartas de magia
const createSpell = (
  id: string,
  name: string,
  effect: SpellEffect,
  rarity: Rarity = Rarity.COMMON
): Omit<Card, 'uniqueId' | 'hasAttacked' | 'statusEffects' | 'statusDuration'> => ({
  id,
  name,
  type: ElementType.NORMAL,
  cardType: CardType.SPELL,
  attack: 0,
  defense: 0,
  level: 1,
  sacrificeRequired: 0,
  rarity,
  spellEffect: effect,
});

// Função auxiliar para criar cartas de armadilha
const createTrap = (
  id: string,
  name: string,
  condition: TrapCondition,
  effect: SpellEffect,
  rarity: Rarity = Rarity.UNCOMMON
): Omit<Card, 'uniqueId' | 'hasAttacked' | 'statusEffects' | 'statusDuration'> => ({
  id,
  name,
  type: ElementType.NORMAL,
  cardType: CardType.TRAP,
  attack: 0,
  defense: 0,
  level: 1,
  sacrificeRequired: 0,
  rarity,
  trapCondition: condition,
  trapEffect: effect,
});

// Deck size constraints
export const MIN_DECK_SIZE = 15;
export const MAX_DECK_SIZE = 40;

// === HABILIDADES ESPECIAIS ===
export const ABILITIES: Record<string, Ability> = {
  // Fire abilities
  blaze: {
    id: 'blaze',
    name: 'Chama Intensa',
    description: '+500 ATK quando HP do dono < 50%',
    trigger: AbilityTrigger.PASSIVE,
    effect: { type: 'BUFF', value: 500, target: 'SELF' }
  },
  burn_touch: {
    id: 'burn_touch',
    name: 'Toque Ardente',
    description: 'Ao atacar, 30% chance de queimar o alvo',
    trigger: AbilityTrigger.ON_ATTACK,
    effect: { type: 'STATUS', statusEffect: StatusEffect.BURN, target: 'ENEMY' }
  },
  
  // Water abilities
  torrent: {
    id: 'torrent',
    name: 'Torrente',
    description: '+500 ATK quando HP do dono < 50%',
    trigger: AbilityTrigger.PASSIVE,
    effect: { type: 'BUFF', value: 500, target: 'SELF' }
  },
  rain_dish: {
    id: 'rain_dish',
    name: 'Prato de Chuva',
    description: 'Cura 200 HP do dono no fim do turno',
    trigger: AbilityTrigger.ON_TURN_END,
    effect: { type: 'HEAL', value: 200, target: 'OWNER' }
  },
  
  // Grass abilities
  overgrow: {
    id: 'overgrow',
    name: 'Crescimento',
    description: '+500 ATK quando HP do dono < 50%',
    trigger: AbilityTrigger.PASSIVE,
    effect: { type: 'BUFF', value: 500, target: 'SELF' }
  },
  poison_point: {
    id: 'poison_point',
    name: 'Ponto Venenoso',
    description: 'Ao receber dano, 30% chance de envenenar atacante',
    trigger: AbilityTrigger.ON_DAMAGE,
    effect: { type: 'STATUS', statusEffect: StatusEffect.POISON, target: 'ENEMY' }
  },
  
  // Electric abilities
  static: {
    id: 'static',
    name: 'Estática',
    description: 'Ao receber dano, 30% chance de paralisar atacante',
    trigger: AbilityTrigger.ON_DAMAGE,
    effect: { type: 'STATUS', statusEffect: StatusEffect.PARALYZE, target: 'ENEMY' }
  },
  lightning_rod: {
    id: 'lightning_rod',
    name: 'Para-Raios',
    description: 'Imune a ataques elétricos, ganha +300 ATK ao ser alvo',
    trigger: AbilityTrigger.PASSIVE,
    effect: { type: 'BUFF', value: 300, target: 'SELF' }
  },
  
  // Psychic abilities
  synchronize: {
    id: 'synchronize',
    name: 'Sincronizar',
    description: 'Ao receber status, aplica o mesmo no inimigo',
    trigger: AbilityTrigger.ON_DAMAGE,
    effect: { type: 'STATUS', target: 'ENEMY' }
  },
  mind_reader: {
    id: 'mind_reader',
    name: 'Ler Mente',
    description: 'Compra 1 carta ao ser invocado',
    trigger: AbilityTrigger.ON_SUMMON,
    effect: { type: 'DRAW', value: 1, target: 'OWNER' }
  },
  
  // Fighting abilities
  guts: {
    id: 'guts',
    name: 'Garra',
    description: '+50% ATK quando afetado por status',
    trigger: AbilityTrigger.PASSIVE,
    effect: { type: 'BUFF', value: 0.5, target: 'SELF' }
  },
  
  // Poison abilities
  poison_gas: {
    id: 'poison_gas',
    name: 'Gás Venenoso',
    description: 'Ao ser invocado, envenena todos inimigos no campo',
    trigger: AbilityTrigger.ON_SUMMON,
    effect: { type: 'STATUS', statusEffect: StatusEffect.POISON, target: 'ALL_ENEMIES' }
  },
  
  // Ground abilities
  sand_veil: {
    id: 'sand_veil',
    name: 'Véu de Areia',
    description: '20% chance de evadir ataques',
    trigger: AbilityTrigger.PASSIVE,
    effect: { type: 'SPECIAL', target: 'SELF' }
  },
  
  // Bug abilities
  swarm: {
    id: 'swarm',
    name: 'Enxame',
    description: '+300 ATK para cada Bug aliado no campo',
    trigger: AbilityTrigger.PASSIVE,
    effect: { type: 'BUFF', value: 300, target: 'SELF' }
  },
  
  // Normal abilities
  pickup: {
    id: 'pickup',
    name: 'Coleta',
    description: 'Ao destruir inimigo, 50% chance de comprar carta',
    trigger: AbilityTrigger.ON_ATTACK,
    effect: { type: 'DRAW', value: 1, target: 'OWNER' }
  },
  
  // Legendary abilities
  pressure: {
    id: 'pressure',
    name: 'Pressão',
    description: 'Inimigos têm -300 ATK',
    trigger: AbilityTrigger.PASSIVE,
    effect: { type: 'DEBUFF', value: -300, target: 'ALL_ENEMIES' }
  },
  regenerate: {
    id: 'regenerate',
    name: 'Regenerar',
    description: 'Cura 500 HP do dono ao voltar para mão',
    trigger: AbilityTrigger.ON_DESTROY,
    effect: { type: 'HEAL', value: 500, target: 'OWNER' }
  },
  revive: {
    id: 'revive',
    name: 'Renascer',
    description: 'Ao ser destruído, 25% chance de reviver com metade do ATK',
    trigger: AbilityTrigger.ON_DESTROY,
    effect: { type: 'REVIVE', target: 'SELF' }
  }
};

// INITIAL_DECK will be built from GEN1_RAW below

// Helper para definir raridade baseada em level
const getRarityByLevel = (level: number, isLegendary?: boolean): Rarity => {
  if (isLegendary) return Rarity.LEGENDARY;
  if (level === 3) return Rarity.EPIC;
  if (level === 2) return Rarity.RARE;
  return Rarity.COMMON;
};

// To avoid an enormous inline list of createCard calls, define raw entries and export the mapped deck.
interface RawCard {
  id: string;
  name: string;
  type: ElementType;
  attack: number;
  defense: number;
  level: number;
  rarity?: Rarity;
  ability?: Ability;
}

const GEN1_RAW: RawCard[] = [
  { id: '001', name: 'Bulbasaur', type: ElementType.GRASS, attack: 1200, defense: 1000, level: 1 },
  { id: '002', name: 'Ivysaur', type: ElementType.GRASS, attack: 1800, defense: 1600, level: 2, ability: ABILITIES.poison_point },
  { id: '003', name: 'Venusaur', type: ElementType.GRASS, attack: 2600, defense: 2400, level: 3, ability: ABILITIES.overgrow },
  { id: '004', name: 'Charmander', type: ElementType.FIRE, attack: 1400, defense: 800, level: 1 },
  { id: '005', name: 'Charmeleon', type: ElementType.FIRE, attack: 2000, defense: 1400, level: 2, ability: ABILITIES.burn_touch },
  { id: '006', name: 'Charizard', type: ElementType.FIRE, attack: 2800, defense: 2000, level: 3, ability: ABILITIES.blaze },
  { id: '007', name: 'Squirtle', type: ElementType.WATER, attack: 1000, defense: 1500, level: 1 },
  { id: '008', name: 'Wartortle', type: ElementType.WATER, attack: 1600, defense: 2000, level: 2, ability: ABILITIES.rain_dish },
  { id: '009', name: 'Blastoise', type: ElementType.WATER, attack: 2400, defense: 2800, level: 3, ability: ABILITIES.torrent },
  { id: '010', name: 'Caterpie', type: ElementType.BUG, attack: 800, defense: 800, level: 1 },
  { id: '011', name: 'Metapod', type: ElementType.BUG, attack: 700, defense: 1200, level: 1 },
  { id: '012', name: 'Butterfree', type: ElementType.BUG, attack: 1700, defense: 1500, level: 2 },
  { id: '013', name: 'Weedle', type: ElementType.BUG, attack: 800, defense: 700, level: 1 },
  { id: '014', name: 'Kakuna', type: ElementType.BUG, attack: 700, defense: 1200, level: 1 },
  { id: '015', name: 'Beedrill', type: ElementType.POISON, attack: 2200, defense: 1200, level: 2 },
  { id: '016', name: 'Pidgey', type: ElementType.NORMAL, attack: 1000, defense: 900, level: 1 },
  { id: '017', name: 'Pidgeotto', type: ElementType.NORMAL, attack: 1600, defense: 1400, level: 2 },
  { id: '018', name: 'Pidgeot', type: ElementType.NORMAL, attack: 2400, defense: 2200, level: 3 },
  { id: '019', name: 'Rattata', type: ElementType.NORMAL, attack: 1100, defense: 800, level: 1 },
  { id: '020', name: 'Raticate', type: ElementType.NORMAL, attack: 1800, defense: 1500, level: 2 },
  { id: '021', name: 'Spearow', type: ElementType.NORMAL, attack: 1100, defense: 900, level: 1 },
  { id: '022', name: 'Fearow', type: ElementType.NORMAL, attack: 2200, defense: 1600, level: 2 },
  { id: '023', name: 'Ekans', type: ElementType.POISON, attack: 900, defense: 800, level: 1 },
  { id: '024', name: 'Arbok', type: ElementType.POISON, attack: 1900, defense: 1400, level: 2 },
  { id: '025', name: 'Pikachu', type: ElementType.ELECTRIC, attack: 1300, defense: 900, level: 1, ability: ABILITIES.static, rarity: Rarity.UNCOMMON },
  { id: '026', name: 'Raichu', type: ElementType.ELECTRIC, attack: 2400, defense: 1800, level: 2, ability: ABILITIES.lightning_rod },
  { id: '027', name: 'Sandshrew', type: ElementType.GROUND, attack: 1100, defense: 1400, level: 1 },
  { id: '028', name: 'Sandslash', type: ElementType.GROUND, attack: 1900, defense: 2100, level: 2, ability: ABILITIES.sand_veil },
  { id: '029', name: 'Nidoran♀', type: ElementType.POISON, attack: 900, defense: 800, level: 1 },
  { id: '030', name: 'Nidorina', type: ElementType.POISON, attack: 1400, defense: 1200, level: 2 },
  { id: '031', name: 'Nidoqueen', type: ElementType.POISON, attack: 2400, defense: 2000, level: 3, ability: ABILITIES.poison_point },
  { id: '032', name: 'Nidoran♂', type: ElementType.POISON, attack: 900, defense: 800, level: 1 },
  { id: '033', name: 'Nidorino', type: ElementType.POISON, attack: 1500, defense: 1200, level: 2 },
  { id: '034', name: 'Nidoking', type: ElementType.POISON, attack: 2500, defense: 2100, level: 3, ability: ABILITIES.poison_gas },
  { id: '035', name: 'Clefairy', type: ElementType.NORMAL, attack: 1000, defense: 1200, level: 1 },
  { id: '036', name: 'Clefable', type: ElementType.NORMAL, attack: 2200, defense: 2000, level: 2 },
  { id: '037', name: 'Vulpix', type: ElementType.FIRE, attack: 1000, defense: 900, level: 1 },
  { id: '038', name: 'Ninetales', type: ElementType.FIRE, attack: 2300, defense: 1800, level: 2 },
  { id: '039', name: 'Jigglypuff', type: ElementType.NORMAL, attack: 900, defense: 1100, level: 1 },
  { id: '040', name: 'Wigglytuff', type: ElementType.NORMAL, attack: 1800, defense: 2000, level: 2 },
  { id: '041', name: 'Zubat', type: ElementType.POISON, attack: 800, defense: 700, level: 1 },
  { id: '042', name: 'Golbat', type: ElementType.POISON, attack: 1700, defense: 1500, level: 2 },
  { id: '043', name: 'Oddish', type: ElementType.GRASS, attack: 900, defense: 900, level: 1 },
  { id: '044', name: 'Gloom', type: ElementType.GRASS, attack: 1400, defense: 1100, level: 2 },
  { id: '045', name: 'Vileplume', type: ElementType.GRASS, attack: 2200, defense: 1800, level: 3 },
  { id: '046', name: 'Paras', type: ElementType.BUG, attack: 900, defense: 900, level: 1 },
  { id: '047', name: 'Parasect', type: ElementType.BUG, attack: 1800, defense: 1500, level: 2 },
  { id: '048', name: 'Venonat', type: ElementType.BUG, attack: 900, defense: 900, level: 1 },
  { id: '049', name: 'Venomoth', type: ElementType.BUG, attack: 1900, defense: 1600, level: 2 },
  { id: '050', name: 'Diglett', type: ElementType.GROUND, attack: 1000, defense: 800, level: 1 },
  { id: '051', name: 'Dugtrio', type: ElementType.GROUND, attack: 1800, defense: 1200, level: 2 },
  { id: '052', name: 'Meowth', type: ElementType.NORMAL, attack: 900, defense: 800, level: 1 },
  { id: '053', name: 'Persian', type: ElementType.NORMAL, attack: 1700, defense: 1400, level: 2 },
  { id: '054', name: 'Psyduck', type: ElementType.WATER, attack: 1000, defense: 1100, level: 1 },
  { id: '055', name: 'Golduck', type: ElementType.WATER, attack: 2100, defense: 1800, level: 2 },
  { id: '056', name: 'Mankey', type: ElementType.FIGHTING, attack: 1100, defense: 900, level: 1 },
  { id: '057', name: 'Primeape', type: ElementType.FIGHTING, attack: 2200, defense: 1600, level: 2 },
  { id: '058', name: 'Growlithe', type: ElementType.FIRE, attack: 1200, defense: 1000, level: 1 },
  { id: '059', name: 'Arcanine', type: ElementType.FIRE, attack: 2600, defense: 2000, level: 2 },
  { id: '060', name: 'Poliwag', type: ElementType.WATER, attack: 900, defense: 900, level: 1 },
  { id: '061', name: 'Poliwhirl', type: ElementType.WATER, attack: 1500, defense: 1300, level: 2 },
  { id: '062', name: 'Poliwrath', type: ElementType.WATER, attack: 2600, defense: 2100, level: 3 },
  { id: '063', name: 'Abra', type: ElementType.PSYCHIC, attack: 800, defense: 500, level: 1 },
  { id: '064', name: 'Kadabra', type: ElementType.PSYCHIC, attack: 1800, defense: 1000, level: 2, ability: ABILITIES.synchronize },
  { id: '065', name: 'Alakazam', type: ElementType.PSYCHIC, attack: 2700, defense: 1500, level: 3, ability: ABILITIES.mind_reader },
  { id: '066', name: 'Machop', type: ElementType.FIGHTING, attack: 1300, defense: 1000, level: 1 },
  { id: '067', name: 'Machoke', type: ElementType.FIGHTING, attack: 1900, defense: 1600, level: 2 },
  { id: '068', name: 'Machamp', type: ElementType.FIGHTING, attack: 2700, defense: 2300, level: 3, ability: ABILITIES.guts },
  { id: '069', name: 'Bellsprout', type: ElementType.GRASS, attack: 900, defense: 800, level: 1 },
  { id: '070', name: 'Weepinbell', type: ElementType.GRASS, attack: 1500, defense: 1200, level: 2 },
  { id: '071', name: 'Victreebel', type: ElementType.GRASS, attack: 2600, defense: 2000, level: 3 },
  { id: '072', name: 'Tentacool', type: ElementType.WATER, attack: 900, defense: 1400, level: 1 },
  { id: '073', name: 'Tentacruel', type: ElementType.WATER, attack: 2000, defense: 2200, level: 2 },
  { id: '074', name: 'Geodude', type: ElementType.GROUND, attack: 1100, defense: 1200, level: 1 },
  { id: '075', name: 'Graveler', type: ElementType.GROUND, attack: 1600, defense: 1800, level: 2 },
  { id: '076', name: 'Golem', type: ElementType.GROUND, attack: 2500, defense: 2400, level: 3 },
  { id: '077', name: 'Ponyta', type: ElementType.FIRE, attack: 1400, defense: 1200, level: 1 },
  { id: '078', name: 'Rapidash', type: ElementType.FIRE, attack: 2300, defense: 1700, level: 2 },
  { id: '079', name: 'Slowpoke', type: ElementType.WATER, attack: 900, defense: 1200, level: 1 },
  { id: '080', name: 'Slowbro', type: ElementType.WATER, attack: 2200, defense: 2000, level: 2 },
  { id: '081', name: 'Magnemite', type: ElementType.ELECTRIC, attack: 900, defense: 1000, level: 1 },
  { id: '082', name: 'Magneton', type: ElementType.ELECTRIC, attack: 2000, defense: 1700, level: 2 },
  { id: '083', name: 'Farfetchd', type: ElementType.NORMAL, attack: 1400, defense: 1100, level: 1 },
  { id: '084', name: 'Doduo', type: ElementType.NORMAL, attack: 1000, defense: 900, level: 1 },
  { id: '085', name: 'Dodrio', type: ElementType.NORMAL, attack: 2200, defense: 1600, level: 2 },
  { id: '086', name: 'Seel', type: ElementType.WATER, attack: 900, defense: 1200, level: 1 },
  { id: '087', name: 'Dewgong', type: ElementType.WATER, attack: 1900, defense: 2000, level: 2 },
  { id: '088', name: 'Grimer', type: ElementType.POISON, attack: 1000, defense: 1000, level: 1 },
  { id: '089', name: 'Muk', type: ElementType.POISON, attack: 2200, defense: 2000, level: 2 },
  { id: '090', name: 'Shellder', type: ElementType.WATER, attack: 900, defense: 1100, level: 1 },
  { id: '091', name: 'Cloyster', type: ElementType.WATER, attack: 2100, defense: 2400, level: 2 },
  { id: '092', name: 'Gastly', type: ElementType.PSYCHIC, attack: 800, defense: 700, level: 1 },
  { id: '093', name: 'Haunter', type: ElementType.PSYCHIC, attack: 1500, defense: 1200, level: 2 },
  { id: '094', name: 'Gengar', type: ElementType.PSYCHIC, attack: 2400, defense: 1800, level: 3, ability: ABILITIES.revive },
  { id: '095', name: 'Onix', type: ElementType.GROUND, attack: 1800, defense: 2600, level: 2 },
  { id: '096', name: 'Drowzee', type: ElementType.PSYCHIC, attack: 1000, defense: 900, level: 1 },
  { id: '097', name: 'Hypno', type: ElementType.PSYCHIC, attack: 2100, defense: 1700, level: 2 },
  { id: '098', name: 'Krabby', type: ElementType.WATER, attack: 1100, defense: 900, level: 1 },
  { id: '099', name: 'Kingler', type: ElementType.WATER, attack: 2300, defense: 1700, level: 2 },
  { id: '100', name: 'Voltorb', type: ElementType.ELECTRIC, attack: 1000, defense: 1000, level: 1 },
  { id: '101', name: 'Electrode', type: ElementType.ELECTRIC, attack: 1900, defense: 1500, level: 2 },
  { id: '102', name: 'Exeggcute', type: ElementType.GRASS, attack: 900, defense: 1000, level: 1 },
  { id: '103', name: 'Exeggutor', type: ElementType.GRASS, attack: 2400, defense: 2000, level: 2 },
  { id: '104', name: 'Cubone', type: ElementType.GROUND, attack: 1000, defense: 1100, level: 1 },
  { id: '105', name: 'Marowak', type: ElementType.GROUND, attack: 2000, defense: 1800, level: 2 },
  { id: '106', name: 'Hitmonlee', type: ElementType.FIGHTING, attack: 2400, defense: 1800, level: 2 },
  { id: '107', name: 'Hitmonchan', type: ElementType.FIGHTING, attack: 2400, defense: 1800, level: 2 },
  { id: '108', name: 'Lickitung', type: ElementType.NORMAL, attack: 1200, defense: 1500, level: 1 },
  { id: '109', name: 'Koffing', type: ElementType.POISON, attack: 900, defense: 1000, level: 1 },
  { id: '110', name: 'Weezing', type: ElementType.POISON, attack: 2000, defense: 1800, level: 2 },
  { id: '111', name: 'Rhyhorn', type: ElementType.GROUND, attack: 1300, defense: 1200, level: 1 },
  { id: '112', name: 'Rhydon', type: ElementType.GROUND, attack: 2500, defense: 2200, level: 2 },
  { id: '113', name: 'Chansey', type: ElementType.NORMAL, attack: 800, defense: 2200, level: 2 },
  { id: '114', name: 'Tangela', type: ElementType.GRASS, attack: 1400, defense: 1800, level: 1 },
  { id: '115', name: 'Kangaskhan', type: ElementType.NORMAL, attack: 2400, defense: 2000, level: 2 },
  { id: '116', name: 'Horsea', type: ElementType.WATER, attack: 800, defense: 900, level: 1 },
  { id: '117', name: 'Seadra', type: ElementType.WATER, attack: 2000, defense: 1600, level: 2 },
  { id: '118', name: 'Goldeen', type: ElementType.WATER, attack: 1100, defense: 1000, level: 1 },
  { id: '119', name: 'Seaking', type: ElementType.WATER, attack: 2000, defense: 1700, level: 2 },
  { id: '120', name: 'Staryu', type: ElementType.WATER, attack: 900, defense: 1000, level: 1 },
  { id: '121', name: 'Starmie', type: ElementType.WATER, attack: 2300, defense: 2000, level: 2 },
  { id: '122', name: 'Mr. Mime', type: ElementType.PSYCHIC, attack: 1400, defense: 1400, level: 1 },
  { id: '123', name: 'Scyther', type: ElementType.BUG, attack: 2300, defense: 1800, level: 2 },
  { id: '124', name: 'Jynx', type: ElementType.PSYCHIC, attack: 1700, defense: 1400, level: 2 },
  { id: '125', name: 'Electabuzz', type: ElementType.ELECTRIC, attack: 2400, defense: 1800, level: 2 },
  { id: '126', name: 'Magmar', type: ElementType.FIRE, attack: 2400, defense: 1800, level: 2 },
  { id: '127', name: 'Pinsir', type: ElementType.BUG, attack: 2600, defense: 2000, level: 2 },
  { id: '128', name: 'Tauros', type: ElementType.NORMAL, attack: 2400, defense: 1900, level: 2 },
  { id: '129', name: 'Magikarp', type: ElementType.WATER, attack: 300, defense: 300, level: 1 },
  { id: '130', name: 'Gyarados', type: ElementType.WATER, attack: 3000, defense: 2600, level: 3 },
  { id: '131', name: 'Lapras', type: ElementType.WATER, attack: 2600, defense: 2400, level: 3 },
  { id: '132', name: 'Ditto', type: ElementType.NORMAL, attack: 800, defense: 800, level: 1 },
  { id: '133', name: 'Eevee', type: ElementType.NORMAL, attack: 1100, defense: 1000, level: 1 },
  { id: '134', name: 'Vaporeon', type: ElementType.WATER, attack: 2400, defense: 2200, level: 2 },
  { id: '135', name: 'Jolteon', type: ElementType.ELECTRIC, attack: 2400, defense: 2000, level: 2 },
  { id: '136', name: 'Flareon', type: ElementType.FIRE, attack: 2600, defense: 2100, level: 2 },
  { id: '137', name: 'Porygon', type: ElementType.NORMAL, attack: 1500, defense: 1400, level: 1 },
  { id: '138', name: 'Omanyte', type: ElementType.WATER, attack: 900, defense: 1200, level: 1 },
  { id: '139', name: 'Omastar', type: ElementType.WATER, attack: 2200, defense: 2100, level: 2 },
  { id: '140', name: 'Kabuto', type: ElementType.WATER, attack: 900, defense: 1100, level: 1 },
  { id: '141', name: 'Kabutops', type: ElementType.WATER, attack: 2300, defense: 2000, level: 2 },
  { id: '142', name: 'Aerodactyl', type: ElementType.NORMAL, attack: 2600, defense: 2200, level: 2 },
  { id: '143', name: 'Snorlax', type: ElementType.NORMAL, attack: 2500, defense: 2500, level: 3 },
  { id: '144', name: 'Articuno', type: ElementType.WATER, attack: 2800, defense: 2600, level: 3 },
  { id: '145', name: 'Zapdos', type: ElementType.ELECTRIC, attack: 2800, defense: 2600, level: 3, rarity: Rarity.LEGENDARY, ability: ABILITIES.pressure },
  { id: '146', name: 'Moltres', type: ElementType.FIRE, attack: 2800, defense: 2600, level: 3, rarity: Rarity.LEGENDARY, ability: ABILITIES.pressure },
  { id: '147', name: 'Dratini', type: ElementType.PSYCHIC, attack: 900, defense: 800, level: 1 },
  { id: '148', name: 'Dragonair', type: ElementType.PSYCHIC, attack: 1800, defense: 1600, level: 2, rarity: Rarity.RARE },
  { id: '149', name: 'Dragonite', type: ElementType.PSYCHIC, attack: 3000, defense: 2600, level: 3, rarity: Rarity.EPIC, ability: ABILITIES.regenerate },
  { id: '150', name: 'Mewtwo', type: ElementType.PSYCHIC, attack: 3300, defense: 2600, level: 3, rarity: Rarity.LEGENDARY, ability: ABILITIES.pressure },
  { id: '151', name: 'Mew', type: ElementType.PSYCHIC, attack: 2600, defense: 2200, level: 3, rarity: Rarity.LEGENDARY, ability: ABILITIES.synchronize }
];

// Tipo base para cartas (usado internamente)
type CardBase = Omit<Card, 'uniqueId' | 'hasAttacked' | 'statusEffects' | 'statusDuration'>;

// Map raw entries to the shape returned by createCard
export const INITIAL_DECK: CardBase[] = GEN1_RAW.map(c =>
  createCard(c.id, c.name, c.type, c.attack, c.defense, c.level, c.rarity ?? getRarityByLevel(c.level), c.ability)
);

// === CARTAS DE MAGIA ===
export const SPELL_CARDS: CardBase[] = [
  // Cura
  createSpell('spell_potion', 'Poção', { type: 'HEAL', value: 1000, target: 'OWNER' }, Rarity.COMMON),
  createSpell('spell_super_potion', 'Super Poção', { type: 'HEAL', value: 2000, target: 'OWNER' }, Rarity.UNCOMMON),
  createSpell('spell_hyper_potion', 'Hyper Poção', { type: 'HEAL', value: 3500, target: 'OWNER' }, Rarity.RARE),
  createSpell('spell_full_restore', 'Restauração Total', { type: 'HEAL', value: 5000, target: 'OWNER' }, Rarity.EPIC),
  
  // Buff
  createSpell('spell_x_attack', 'X-Attack', { type: 'BUFF', value: 500, target: 'SINGLE_ALLY' }, Rarity.COMMON),
  createSpell('spell_x_defense', 'X-Defense', { type: 'BUFF', value: 500, target: 'SINGLE_ALLY' }, Rarity.COMMON),
  createSpell('spell_rare_candy', 'Rare Candy', { type: 'BUFF', value: 800, target: 'SINGLE_ALLY' }, Rarity.UNCOMMON),
  createSpell('spell_protein', 'Proteína', { type: 'BUFF', value: 1000, target: 'SINGLE_ALLY' }, Rarity.RARE),
  
  // Dano
  createSpell('spell_thunder', 'Trovão', { type: 'DAMAGE', value: 800, target: 'SINGLE_ENEMY' }, Rarity.UNCOMMON),
  createSpell('spell_fire_blast', 'Explosão de Fogo', { type: 'DAMAGE', value: 1200, target: 'SINGLE_ENEMY' }, Rarity.RARE),
  createSpell('spell_blizzard', 'Nevasca', { type: 'DAMAGE', value: 600, target: 'ALL_ENEMIES' }, Rarity.RARE),
  createSpell('spell_earthquake', 'Terremoto', { type: 'DAMAGE', value: 500, target: 'ALL_ENEMIES' }, Rarity.UNCOMMON),
  
  // Destruição
  createSpell('spell_pokeball', 'Pokébola', { type: 'DESTROY', target: 'SINGLE_ENEMY', specialId: 'capture' }, Rarity.UNCOMMON),
  createSpell('spell_great_ball', 'Great Ball', { type: 'DESTROY', target: 'SINGLE_ENEMY', specialId: 'capture_better' }, Rarity.RARE),
  createSpell('spell_master_ball', 'Master Ball', { type: 'DESTROY', target: 'SINGLE_ENEMY', specialId: 'capture_guaranteed' }, Rarity.LEGENDARY),
  
  // Comprar cartas
  createSpell('spell_bill', 'Bill', { type: 'DRAW', value: 2, target: 'OWNER' }, Rarity.COMMON),
  createSpell('spell_professor_oak', 'Professor Oak', { type: 'DRAW', value: 3, target: 'OWNER' }, Rarity.RARE),
  
  // Status
  createSpell('spell_sleep_powder', 'Pó do Sono', { type: 'STATUS', statusEffect: StatusEffect.SLEEP, target: 'SINGLE_ENEMY' }, Rarity.UNCOMMON),
  createSpell('spell_toxic', 'Tóxico', { type: 'STATUS', statusEffect: StatusEffect.POISON, target: 'SINGLE_ENEMY' }, Rarity.UNCOMMON),
  createSpell('spell_will_o_wisp', 'Fogo Fátuo', { type: 'STATUS', statusEffect: StatusEffect.BURN, target: 'SINGLE_ENEMY' }, Rarity.UNCOMMON),
  createSpell('spell_thunder_wave', 'Onda de Choque', { type: 'STATUS', statusEffect: StatusEffect.PARALYZE, target: 'SINGLE_ENEMY' }, Rarity.UNCOMMON),
  createSpell('spell_confuse_ray', 'Raio Confuso', { type: 'STATUS', statusEffect: StatusEffect.CONFUSE, target: 'SINGLE_ENEMY' }, Rarity.RARE),
  
  // Reviver
  createSpell('spell_revive', 'Reviver', { type: 'REVIVE', target: 'GRAVEYARD' }, Rarity.RARE),
  createSpell('spell_max_revive', 'Reviver Máximo', { type: 'REVIVE', value: 1, target: 'GRAVEYARD' }, Rarity.EPIC),
];

// === CARTAS DE ARMADILHA ===
export const TRAP_CARDS: CardBase[] = [
  // Contra-ataque
  createTrap('trap_counter', 'Contra-Ataque', TrapCondition.ON_ATTACK, 
    { type: 'DAMAGE', value: 500, target: 'SINGLE_ENEMY' }, Rarity.COMMON),
  createTrap('trap_mirror_coat', 'Manto Espelho', TrapCondition.ON_ATTACK,
    { type: 'DAMAGE', value: 0, target: 'SINGLE_ENEMY', specialId: 'reflect_damage' }, Rarity.RARE),
  
  // Proteção
  createTrap('trap_protect', 'Proteção', TrapCondition.ON_DIRECT_ATTACK,
    { type: 'SPECIAL', specialId: 'negate_attack' }, Rarity.UNCOMMON),
  createTrap('trap_endure', 'Resistência', TrapCondition.ON_DESTROY,
    { type: 'SPECIAL', specialId: 'survive_1hp' }, Rarity.RARE),
  
  // Status ao atacar
  createTrap('trap_poison_spikes', 'Espinhos Venenosos', TrapCondition.ON_SUMMON,
    { type: 'STATUS', statusEffect: StatusEffect.POISON, target: 'SINGLE_ENEMY' }, Rarity.UNCOMMON),
  createTrap('trap_thunder_trap', 'Armadilha Trovão', TrapCondition.ON_ATTACK,
    { type: 'STATUS', statusEffect: StatusEffect.PARALYZE, target: 'SINGLE_ENEMY' }, Rarity.UNCOMMON),
  createTrap('trap_freeze_trap', 'Armadilha Gelo', TrapCondition.ON_ATTACK,
    { type: 'STATUS', statusEffect: StatusEffect.FREEZE, target: 'SINGLE_ENEMY' }, Rarity.RARE),
  
  // Destruição
  createTrap('trap_destiny_bond', 'Laço do Destino', TrapCondition.ON_DESTROY,
    { type: 'DESTROY', target: 'SINGLE_ENEMY' }, Rarity.EPIC),
  createTrap('trap_explosion', 'Explosão', TrapCondition.ON_ATTACK,
    { type: 'DAMAGE', value: 1500, target: 'ALL_ENEMIES' }, Rarity.RARE),
  
  // Debuff
  createTrap('trap_scary_face', 'Cara Assustadora', TrapCondition.ON_SUMMON,
    { type: 'DEBUFF', value: -400, target: 'ALL_ENEMIES' }, Rarity.UNCOMMON),
  createTrap('trap_intimidate', 'Intimidar', TrapCondition.ON_ATTACK,
    { type: 'DEBUFF', value: -600, target: 'SINGLE_ENEMY' }, Rarity.RARE),
];

// === HELPER FUNCTIONS ===
// Get cards by their IDs (used for building campaign boss decks)
export const getCardsByIds = (ids: string[]): CardBase[] => {
  const allCards = [...INITIAL_DECK, ...SPELL_CARDS, ...TRAP_CARDS];
  const result: CardBase[] = [];
  
  ids.forEach(id => {
    const card = allCards.find(c => c.id === id);
    if (card) {
      result.push({ ...card });
    } else {
      console.warn(`Card with ID ${id} not found in catalog`);
    }
  });
  
  return result;
};