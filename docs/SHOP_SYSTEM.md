# 🛒 Sistema de Loja - Guia de Configuração

## Visão Geral
A loja do PokéCard Battle permite que os jogadores comprem cartas específicas usando coins. As ofertas são organizadas em categorias e podem ter promoções com descontos e datas de expiração.

## Estrutura de Ofertas

### ShopOffer Interface
```typescript
interface ShopOffer {
  id: string;                    // ID único da oferta
  cardId: string;                // ID da carta (ex: 'charizard', '006')
  category: string;              // Categoria da oferta
  price: number;                 // Preço atual
  originalPrice?: number;        // Preço original (se tiver desconto)
  discount?: number;             // Porcentagem de desconto (0-100)
  startDate?: string;            // Data de início (ISO string)
  endDate?: string;              // Data de término (ISO string)
  stock?: number;                // Estoque disponível (undefined = ilimitado)
  maxPurchasesPerPlayer?: number; // Limite por jogador
}
```

## Categorias Disponíveis

### 1. **Destaques** (featured)
- Ofertas especiais selecionadas
- Geralmente com bons descontos
- Rotação quinzenal recomendada
- Cor: Amarelo/Âmbar

### 2. **Oferta Semanal** (weekly)
- Promoções que mudam toda semana
- Descontos agressivos (30-50%)
- Rotação semanal
- Cor: Vermelho/Laranja

### 3. **Raros** (rare)
- Cartas raras e poderosas
- Preços premium
- Sempre disponíveis
- Cor: Roxo/Rosa

### 4. **Iniciantes** (starter)
- Cartas acessíveis para começar
- Preços baixos
- Sempre disponíveis
- Cor: Verde/Esmeralda

### 5. **Lendários** (legendary)
- Cartas mais caras e poderosas
- Preços muito altos
- Sempre disponíveis ou limitados
- Cor: Azul/Ciano

## Exemplos de Configuração

### Oferta com Desconto e Data de Expiração
```typescript
{
  id: 'featured_charizard_2025',
  cardId: 'charizard',           // ou '006'
  category: 'featured',
  price: 800,
  originalPrice: 1200,
  discount: 33,                   // 33% off
  startDate: '2025-12-25',
  endDate: '2026-01-08'
}
```

### Oferta Permanente Sem Desconto
```typescript
{
  id: 'rare_lapras',
  cardId: 'lapras',
  category: 'rare',
  price: 850
  // Sem datas = sempre disponível
}
```

### Oferta com Limite de Compras
```typescript
{
  id: 'legendary_mew_limited',
  cardId: 'mew',
  category: 'legendary',
  price: 2500,
  maxPurchasesPerPlayer: 1        // Cada jogador pode comprar apenas 1
}
```

### Oferta com Estoque Limitado
```typescript
{
  id: 'special_promo',
  cardId: 'mewtwo',
  category: 'weekly',
  price: 1500,
  originalPrice: 2000,
  discount: 25,
  stock: 50,                      // Apenas 50 unidades disponíveis
  startDate: '2025-12-30',
  endDate: '2026-01-06'
}
```

## Como Adicionar Novas Ofertas

1. Abra o arquivo `services/shopService.ts`
2. Localize o array `SHOP_OFFERS`
3. Adicione um novo objeto seguindo a estrutura:

```typescript
const SHOP_OFFERS: ShopOffer[] = [
  // ... ofertas existentes ...
  
  // Sua nova oferta
  {
    id: 'seu_id_unico',
    cardId: 'id_da_carta',  // Deve existir em gen1.ts
    category: 'featured',   // ou weekly, rare, starter, legendary
    price: 500,
    originalPrice: 750,     // opcional
    discount: 33,           // opcional
    startDate: '2026-01-01', // opcional
    endDate: '2026-01-15',   // opcional
  }
];
```

## Dicas de Precificação

### Baseado em Raridade
- **COMMON**: 100-200 coins
- **UNCOMMON**: 200-400 coins
- **RARE**: 400-800 coins
- **EPIC**: 800-1500 coins
- **LEGENDARY**: 1500-2500 coins

### Baseado em Stats
- **Level 1** (< 1500 ATK): 150-300 coins
- **Level 2** (1500-2400 ATK): 400-800 coins
- **Level 3** (> 2400 ATK): 800-1500 coins
- **Lendários**: 1500+ coins

### Descontos Recomendados
- **Featured**: 20-35% off
- **Weekly**: 30-50% off
- **Flash Sales**: 50-70% off
- **Sem desconto**: Cartas sempre disponíveis

## Sistema de Rotação

### Semanal (Segundas-feiras)
```typescript
startDate: '2025-12-30',  // Segunda
endDate: '2026-01-06',     // Próxima segunda
```

### Quinzenal
```typescript
startDate: '2025-12-25',
endDate: '2026-01-08',     // 14 dias depois
```

### Eventos Especiais
```typescript
// Natal, Ano Novo, etc.
startDate: '2025-12-24',
endDate: '2025-12-26',
discount: 50,              // Super desconto
```

## Gerenciamento

### Verificar Ofertas Ativas
```typescript
const activeOffers = shopService.getAllOffers();
const weeklyOffers = shopService.getOffersByCategory('weekly');
```

### Limpar Histórico de Compras (Debug)
```typescript
shopService.clearPurchaseHistory();
```

### Verificar Próxima Rotação
```typescript
const nextRotation = shopService.getNextRotation('weekly');
console.log('Próxima rotação:', nextRotation);
```

## IDs de Cartas Populares

Algumas cartas populares para usar nas ofertas:

**Iniciantes:**
- pikachu, charmander, bulbasaur, squirtle, eevee

**Evoluções Populares:**
- charizard, blastoise, venusaur, raichu, alakazam, gengar, machamp

**Raros:**
- lapras, snorlax, gyarados, dragonite, aerodactyl

**Lendários:**
- mewtwo, mew, articuno, zapdos, moltres

## Exemplo de Setup Completo

```typescript
// ROTAÇÃO SEMANAL (30/12 - 06/01)
{
  id: 'weekly_gengar_w1',
  cardId: 'gengar',
  category: 'weekly',
  price: 450,
  originalPrice: 750,
  discount: 40,
  startDate: '2025-12-30',
  endDate: '2026-01-06'
},

// DESTAQUE QUINZENAL (25/12 - 08/01)
{
  id: 'featured_charizard_hny',
  cardId: 'charizard',
  category: 'featured',
  price: 800,
  originalPrice: 1200,
  discount: 33,
  startDate: '2025-12-25',
  endDate: '2026-01-08'
},

// SEMPRE DISPONÍVEL
{
  id: 'starter_pikachu',
  cardId: 'pikachu',
  category: 'starter',
  price: 200
}
```

## Notas Importantes

1. **IDs únicos**: Cada oferta deve ter um ID único
2. **Card IDs válidos**: O cardId deve existir no arquivo `pokemons/gen1.ts`
3. **Datas ISO**: Use formato 'YYYY-MM-DD'
4. **Coins no jogo**: Jogadores ganham coins vencendo batalhas e completando conquistas
5. **Testes**: Sempre teste as ofertas antes de colocar em produção

## Manutenção

### Atualização Semanal
1. Verificar ofertas expiradas
2. Criar novas ofertas semanais
3. Ajustar preços se necessário
4. Atualizar datas

### Atualização Mensal
1. Analisar cartas mais/menos vendidas
2. Ajustar estratégia de precificação
3. Adicionar novas cartas raras/legendárias
4. Criar eventos especiais

---

**Última atualização**: 31/12/2025 | v1.7.3
