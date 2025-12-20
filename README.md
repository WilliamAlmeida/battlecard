<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1rSWKB5I4icoXVyrWD8GD90hEOEqANep1

## Run Locally

**Prerequisites:**  Node.js
# Battlecard — PokéCard Battle (gen1)

Jogo de cartas inspirado em batalhas estilo PokéCard, implementado em React + TypeScript com Vite.

## Visão geral
- Jogo de batalha de cartas com status, habilidades, magias/armadilhas, AI e construtor de decks.
- Deck Builder separado da coleção; tamanhos de deck configuráveis via constantes (`MIN_DECK_SIZE = 15`, `MAX_DECK_SIZE = 40`).

## Tecnologias
- React 19 + TypeScript
- Vite (dev/build)
- Services locais (localStorage) para coleção, estatísticas e conquistas

## Requisitos
- Node.js (v18+ recomendado)

## Instalação e execução
1. Instale dependências:

```bash
npm install
```

2. Variáveis de ambiente (opcional):
- Se você quiser usar recursos de AI (serviço `geminiService.ts`), crie um arquivo `.env.local` na raiz e adicione:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Executar em desenvolvimento:

```bash
npm run dev
```

4. Build para produção:

```bash
npm run build
npm run preview
```

## Estrutura principal do projeto

- `src/` (ou raiz do projeto neste repositório)
  - `App.tsx` — roteamento de views (menu, jogo, coleção, deckbuilder, conquistas, estatísticas)
  - `index.tsx` / `index.html` — entrada do app
  - `components/` — componentes React (DeckBuilder, CardComponent, GameBoard, etc.)
  - `hooks/useGameLogic.ts` — lógica do jogo
  - `services/` — `collectionService`, `statsService`, `achievementsService`, `soundService`, `geminiService`
  - `utils/gameRules.ts`, `constants.ts`, `types.ts`

## Deck Builder
- O construtor de decks está disponível como view separada e respeita os limites definidos em `constants.ts`.
- Limites atuais: `MIN_DECK_SIZE = 15`, `MAX_DECK_SIZE = 40`.

## Desenvolvimento e testes
- Não há suíte de testes automatizados incluída por padrão. Para testar manualmente, execute `npm run dev` e abra o app no navegador.

## Contribuição
- Abra issues para bugs ou sugestões.
- Pull requests são bem-vindos; mantenha mudanças pequenas e focadas.

## Observações
- Dados de coleção, estatísticas e conquistas são persistidos em `localStorage` por padrão.
- Se você estiver usando recursos relacionados a AI, configure `GEMINI_API_KEY` conforme descrito acima.

## Licença
- Repositório sem licença explícita (adicione uma `LICENSE` se desejar compartilhar publicamente).

---

Se quiser, eu posso adicionar badges, screenshots, ou instruções de deploy específicas (Netlify, Vercel, etc.).
