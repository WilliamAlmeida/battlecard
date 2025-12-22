import { Ability, AbilityTrigger, StatusEffect } from '@/types';

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