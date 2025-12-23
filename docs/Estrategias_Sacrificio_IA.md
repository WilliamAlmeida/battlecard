# Estratégias de Sacrifício da IA — Documentação

**Visão Geral**
- **Propósito**: Documentar o sistema de escolha de sacrifícios da IA para que você entenda, configure e estenda facilmente.
- **Arquivos principais**: lógica em [classes/AIController.ts](classes/AIController.ts), tipos em [types.ts](types.ts), padrões de campanha em [services/campaignService.ts](services/campaignService.ts), aplicação da estratégia no início do jogo em [hooks/useGameLogic.ts](hooks/useGameLogic.ts).

## Estratégias Disponíveis
- **RANDOM**: escolhe sacrifícios aleatoriamente. Use para IA imprevisível/fácil.
- **FIELD_FIRST**: prioriza sacrificar cartas do campo (as mais fracas primeiro), depois da mão.
- **HAND_FIRST**: prioriza sacrificar cartas da mão (as mais fracas primeiro), depois do campo.
- **SMART_HYBRID**: sacrifica da mão quando possível; só usa o campo se necessário (mantém presença no board). Ideal para Normal.
- **SCORE_BASED**: calcula um score por carta (ataque + defesa + peso de habilidade + contexto) e sacrifica as de menor score. Ideal para Hard/Expert.
- **AUTO**: mapeia a dificuldade para uma estratégia automaticamente (veja o próximo tópico).

## Mapeamento (AUTO)
- EASY → RANDOM
- NORMAL → SMART_HYBRID
- HARD / EXPERT → SCORE_BASED

Este mapeamento está em `AIController.getAutoStrategy()`.

## Interação com shouldMakeMistake()
- `shouldMakeMistake()` ainda adiciona ruído/aleatoriedade em algumas decisões da IA (ex: ordem de invocação). Se a estratégia for AUTO, EASY já resulta em comportamento RANDOM. Se você definir manualmente uma estratégia via `AIController.setSacrificeStrategy(...)`, mudar a dificuldade só afeta `shouldMakeMistake()` (não a estratégia fixa).
- Você pode adicionar ruído às estratégias determinísticas usando `shouldMakeMistake()` para embaralhar parte dos sacrifícios escolhidos.

## Como configurar em tempo de execução
- Para definir uma estratégia manualmente:

```ts
import { AIController } from './classes/AIController';
import { SacrificeStrategy } from './types';

// Estratégia fixa
AIController.setSacrificeStrategy(SacrificeStrategy.SCORE_BASED);

// Voltar para AUTO (segue a dificuldade)
AIController.setSacrificeStrategy(SacrificeStrategy.AUTO);
```

- Para bosses de campanha: a maioria já possui `sacrificeStrategy` em [services/campaignService.ts](services/campaignService.ts). Ao iniciar a campanha, o valor é passado para `startGame()` e aplicado em [hooks/useGameLogic.ts](hooks/useGameLogic.ts).

## Como alterar o mapeamento padrão ou adicionar nova estratégia
- Edite `AIController.getAutoStrategy()` em [classes/AIController.ts](classes/AIController.ts).
- Para adicionar uma nova estratégia:
  - Adicione o valor no enum em [types.ts](types.ts) (SacrificeStrategy)
  - Implemente o método `private static sacrificeMinhaNovaEstrategia(...)` em [classes/AIController.ts](classes/AIController.ts) retornando um array de uniqueIds.
  - Registre no switch de `selectSacrifices(...)`.

## Exemplos e recomendações
- Testes rápidos:
  - EASY vs Brock (RANDOM) — sacrifícios variados e pouco otimizados.
  - NORMAL vs Lt. Surge (SMART_HYBRID) — IA sacrifica da mão quando possível.
  - HARD vs Giovanni (SCORE_BASED) — IA usa heurística de score.

## Onde olhar no código
- Implementação das estratégias: [classes/AIController.ts](classes/AIController.ts)
- Tipos e enum: [types.ts](types.ts)
- Definição padrão dos bosses: [services/campaignService.ts](services/campaignService.ts)
- Aplicação da estratégia no início do jogo: [hooks/useGameLogic.ts](hooks/useGameLogic.ts)
- Onde a UI define dificuldade: [components/MainMenu.tsx](components/MainMenu.tsx)

## Testando localmente
- Inicie o servidor de desenvolvimento:

```powershell
npm install
npm run dev
```

- Teste sugerido: coloque 3 monstros no campo e tente invocar um que exige 2 sacrifícios — observe as escolhas da IA em diferentes bosses.

## Avançado: adicionar aleatoriedade controlada às estratégias
- Para deixar SMART_HYBRID ou SCORE_BASED mais "humanas", após calcular os sacrifícios, faça:

```ts
if (AIController.shouldMakeMistake()) {
  // troque um dos escolhidos por outro candidato aleatório (10-30% das vezes)
}
```

Assim a IA mantém inteligência, mas comete erros proporcionais à dificuldade.

## Boas práticas
- Use SMART_HYBRID para testes gerais; SCORE_BASED para oponentes desafiadores.
- Marque cartas importantes usando `ability` ou metadados futuros (ex: tags de combo) para que SCORE_BASED penalize sacrificar cartas-chave.
- Ao criar novos bosses, defina `sacrificeStrategy` para dar personalidade única a cada luta.

---
Gerado em 23/12/2025 — arquivo: docs/Estrategias_Sacrificio_IA.md
