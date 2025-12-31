# 🎉 Exemplos de Ofertas Sazonais e Especiais

## Ano Novo 2026 (31/12/2025 - 02/01/2026)

```typescript
// Super promoção de Ano Novo
{
  id: 'newyear_mewtwo_2026',
  cardId: 'mewtwo',
  category: 'featured',
  price: 1500,
  originalPrice: 2000,
  discount: 25,
  startDate: '2025-12-31',
  endDate: '2026-01-02'
},
{
  id: 'newyear_mew_2026',
  cardId: 'mew',
  category: 'featured',
  price: 1875,
  originalPrice: 2500,
  discount: 25,
  startDate: '2025-12-31',
  endDate: '2026-01-02'
},
```

## Flash Sale - Fim de Semana (Sexta a Domingo)

```typescript
// Flash Sale de Fim de Semana
{
  id: 'flash_charizard_weekend',
  cardId: 'charizard',
  category: 'weekly',
  price: 600,
  originalPrice: 1200,
  discount: 50,
  startDate: '2026-01-03',  // Sexta
  endDate: '2026-01-05',     // Domingo
  maxPurchasesPerPlayer: 1
},
{
  id: 'flash_dragonite_weekend',
  cardId: 'dragonite',
  category: 'weekly',
  price: 650,
  originalPrice: 1300,
  discount: 50,
  startDate: '2026-01-03',
  endDate: '2026-01-05',
  maxPurchasesPerPlayer: 1
},
```

## Mega Pack - Iniciantes

```typescript
// Bundle para novos jogadores
{
  id: 'starter_pikachu',
  cardId: 'pikachu',
  category: 'starter',
  price: 150,
  originalPrice: 200,
  discount: 25
},
{
  id: 'starter_charmander',
  cardId: 'charmander',
  category: 'starter',
  price: 112,
  originalPrice: 150,
  discount: 25
},
{
  id: 'starter_bulbasaur',
  cardId: 'bulbasaur',
  category: 'starter',
  price: 112,
  originalPrice: 150,
  discount: 25
},
{
  id: 'starter_squirtle',
  cardId: 'squirtle',
  category: 'starter',
  price: 112,
  originalPrice: 150,
  discount: 25
},
```

## Evento Lendário Mensal

```typescript
// Um lendário diferente em destaque cada mês
{
  id: 'legendary_january_articuno',
  cardId: 'articuno',
  category: 'legendary',
  price: 960,
  originalPrice: 1200,
  discount: 20,
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  maxPurchasesPerPlayer: 2
},
```

## Black Friday / Cyber Monday

```typescript
// Mega descontos em tudo
{
  id: 'blackfriday_mewtwo',
  cardId: 'mewtwo',
  category: 'featured',
  price: 1000,
  originalPrice: 2000,
  discount: 50,
  startDate: '2026-11-27',
  endDate: '2026-11-30'
},
{
  id: 'blackfriday_charizard',
  cardId: 'charizard',
  category: 'featured',
  price: 600,
  originalPrice: 1200,
  discount: 50,
  startDate: '2026-11-27',
  endDate: '2026-11-30'
},
{
  id: 'blackfriday_dragonite',
  cardId: 'dragonite',
  category: 'featured',
  price: 650,
  originalPrice: 1300,
  discount: 50,
  startDate: '2026-11-27',
  endDate: '2026-11-30'
},
```

## Halloween (Cartas Dark/Ghost)

```typescript
// Tema Halloween
{
  id: 'halloween_gengar',
  cardId: 'gengar',
  category: 'featured',
  price: 525,
  originalPrice: 750,
  discount: 30,
  startDate: '2026-10-25',
  endDate: '2026-11-01'
},
{
  id: 'halloween_haunter',
  cardId: 'haunter',
  category: 'weekly',
  price: 280,
  originalPrice: 400,
  discount: 30,
  startDate: '2026-10-25',
  endDate: '2026-11-01'
},
{
  id: 'halloween_gastly',
  cardId: 'gastly',
  category: 'weekly',
  price: 140,
  originalPrice: 200,
  discount: 30,
  startDate: '2026-10-25',
  endDate: '2026-11-01'
},
```

## Natal (Cartas Ice/Water)

```typescript
// Tema Natal
{
  id: 'christmas_articuno',
  cardId: 'articuno',
  category: 'featured',
  price: 960,
  originalPrice: 1200,
  discount: 20,
  startDate: '2026-12-20',
  endDate: '2026-12-26'
},
{
  id: 'christmas_lapras',
  cardId: 'lapras',
  category: 'weekly',
  price: 595,
  originalPrice: 850,
  discount: 30,
  startDate: '2026-12-20',
  endDate: '2026-12-26'
},
{
  id: 'christmas_dewgong',
  cardId: 'dewgong',
  category: 'weekly',
  price: 350,
  originalPrice: 500,
  discount: 30,
  startDate: '2026-12-20',
  endDate: '2026-12-26'
},
```

## Aniversário do Jogo

```typescript
// Celebração de aniversário
{
  id: 'anniversary_mega_bundle',
  cardId: 'mewtwo',
  category: 'featured',
  price: 1,  // Quase de graça!
  originalPrice: 2000,
  discount: 99,
  startDate: '2026-06-01',
  endDate: '2026-06-02',
  maxPurchasesPerPlayer: 1  // Apenas 1 por jogador
},
```

## Rotação Semanal Automática - Modelo

```typescript
// Semana 1 (30/12 - 06/01) - Tipo Psychic
{
  id: 'weekly_w1_alakazam',
  cardId: 'alakazam',
  category: 'weekly',
  price: 480,
  originalPrice: 800,
  discount: 40,
  startDate: '2025-12-30',
  endDate: '2026-01-06'
},

// Semana 2 (06/01 - 13/01) - Tipo Fighting
{
  id: 'weekly_w2_machamp',
  cardId: 'machamp',
  category: 'weekly',
  price: 420,
  originalPrice: 700,
  discount: 40,
  startDate: '2026-01-06',
  endDate: '2026-01-13'
},

// Semana 3 (13/01 - 20/01) - Tipo Water
{
  id: 'weekly_w3_gyarados',
  cardId: 'gyarados',
  category: 'weekly',
  price: 450,
  originalPrice: 750,
  discount: 40,
  startDate: '2026-01-13',
  endDate: '2026-01-20'
},

// Semana 4 (20/01 - 27/01) - Tipo Electric
{
  id: 'weekly_w4_raichu',
  cardId: 'raichu',
  category: 'weekly',
  price: 360,
  originalPrice: 600,
  discount: 40,
  startDate: '2026-01-20',
  endDate: '2026-01-27'
},
```

## Bundle Especial - Eevee Evolutions

```typescript
{
  id: 'bundle_eevee',
  cardId: 'eevee',
  category: 'featured',
  price: 187,
  originalPrice: 250,
  discount: 25,
  startDate: '2026-02-01',
  endDate: '2026-02-14'
},
{
  id: 'bundle_vaporeon',
  cardId: 'vaporeon',
  category: 'featured',
  price: 480,
  originalPrice: 640,
  discount: 25,
  startDate: '2026-02-01',
  endDate: '2026-02-14'
},
{
  id: 'bundle_jolteon',
  cardId: 'jolteon',
  category: 'featured',
  price: 480,
  originalPrice: 640,
  discount: 25,
  startDate: '2026-02-01',
  endDate: '2026-02-14'
},
{
  id: 'bundle_flareon',
  cardId: 'flareon',
  category: 'featured',
  price: 480,
  originalPrice: 640,
  discount: 25,
  startDate: '2026-02-01',
  endDate: '2026-02-14'
},
```

## Tips para Criar Eventos

### 1. **Tema Coerente**
- Escolha cartas que fazem sentido juntas
- Use tipos similares ou que se complementam

### 2. **Descontos Atrativos**
- 20-30% para eventos comuns
- 40-50% para flash sales
- 70-99% para eventos especiais únicos

### 3. **Limites Estratégicos**
- Use `maxPurchasesPerPlayer` para cartas muito fortes
- Use `stock` para criar senso de urgência

### 4. **Timing**
- Fim de semana: sexta 00:00 → domingo 23:59
- Semanal: segunda 00:00 → próxima segunda 23:59
- Mensal: dia 1 00:00 → último dia 23:59

### 5. **Comunicação**
- Anuncie eventos com antecedência
- Use as dicas no footer da loja
- Considere adicionar notificações no menu principal

---

**Última atualização**: 31/12/2025 | v1.7.3
