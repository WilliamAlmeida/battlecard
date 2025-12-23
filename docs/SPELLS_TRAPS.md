# Spells & Traps — Regras, Implementação Atual e Status

Este documento descreve a lógica atual de Spells e Traps no projeto, lista as cartas disponíveis (com breve descrição do efeito) e indica o que está parcialmente ou ainda não implementado. Foi atualizado para refletir mudanças recentes no `hooks/useGameLogic.ts` e em `constants.ts`.

**Resumo rápido**
- Spells: executadas quando o jogador/IA usa uma carta do tipo `SPELL`. A lógica principal fica em `useSpell` (hooks/useGameLogic.ts).
- Traps: cartas setadas no campo do jogador que disparam em condições (ON_ATTACK, ON_SUMMON, ON_DESTROY, ON_DIRECT_ATTACK). A lógica de ativação principal está em `checkAndActivateTraps` (hooks/useGameLogic.ts) e as chamadas foram adicionadas nos pontos relevantes (`executeAttack`, `summonCard`, e ao destruir cartas no combate).

**Terminologia (target semantics)**
- `OWNER` / `SELF`: afeta o jogador dono da carta (HP, mão, etc.).
- `SINGLE_ALLY`: alvo único no campo do dono (por design, monstros não têm HP — em muitos casos curas a um aliado agora aplicam HP ao dono e mencionam qual monstro foi alvo).
- `SINGLE_ENEMY` / `ALL_ENEMIES`: alvos no campo do oponente.
- `GRAVEYARD`: interage com o cemitério do dono.

**Stat semantics**
- Muitos efeitos (`BUFF` / `DEBUFF`) agora podem especificar um campo `stat` com valores `ATTACK` ou `DEFENSE`.
- Se `stat` estiver presente, o efeito altera somente o stat indicado; se `stat` estiver ausente, o efeito é aplicado a ambos (`ATK` e `DEF`).

---

**Lógica atual em `useSpell` (implementada)**
- HEAL
  - `OWNER` / `SELF`: aumenta HP do dono (bounded pela barra máxima de 8000).
  - `SINGLE_ALLY`: monstro não tem HP => implementado para aumentar HP do dono, registrando qual monstro foi alvo no log (conforme ajuste solicitado).

- DAMAGE
  - `SINGLE_ENEMY`: destrói ou causa efeito simples sobre a carta inimiga (comparo `damage >= defense`).
  - `ALL_ENEMIES`: itera sobre `opponent.field` e remove cartas cuja defesa é <= damage.
  - `OWNER`: aplica dano direto ao HP do oponente (dano de spell direto).

  - BUFF
    - `SINGLE_ALLY` / `SELF`: acrescenta ATK à carta (`state.field`) do dono quando o `targetId` pertence ao dono.
    - `ALL_ALLIES`: suportado para buffs em massa (ex.: `spell_mass_protein`).
    - Observação: `BUFF` pode agora especificar `stat: 'ATTACK' | 'DEFENSE'`. Se `stat` não for informado, o buff será aplicado a ambos `ATK` e `DEF`.

- DRAW / REVIVE / DESTROY / STATUS
  - DRAW: puxa cartas do próprio deck.
  - REVIVE: retira do `graveyard` para `field` (com algumas regras de modificação do card revivido).
  - DESTROY: remove carta alvo do oponente e manda para graveyard (algumas cartas de destruição têm `specialId` para comportamentos futuros, ex.: captura).
  - STATUS: aplica `applyStatusEffect` ao monstro alvo no campo do oponente.

---

**Lógica atual em `checkAndActivateTraps` (implementada/estendida)**
- Assinatura estendida: agora recebe `trapOwner`, `opponent`, `condition` e um `context` rico que pode conter `attacker`, `defender`, `summoned`, `destroyed`, `attackerOwner`.
- Retorna: traps ativadas, `damageToOpponentPlayer`, `statusEffects`, `destroyTargets`, `debuffTargets`, `negateAttack`, `surviveTrap` e `logs`.
- Efeitos suportados:
  - DAMAGE: aplica dano ao jogador dono do monstro que ativou a trap (por exemplo spikes/explosion) ou destrói todos (`ALL_ENEMIES`) conforme definição.
  - STATUS: aplica status ao monstro (ex.: envenenar o atacante que entrou em contato).
  - DESTROY: marca para destruir um monstro específico (e é aplicado depois no fluxo que chamou a função).
  - DEBUFF: reduz `ATK` ou `DEF` de alvos (SINGLE_ENEMY ou ALL_ENEMIES). Se `stat` não for especificado, o débuff será aplicado a ambos `ATK` e `DEF`.
  - SPECIAL (`specialId`): suporta `negate_attack` (Proteção), `survive_1hp` (Resistência — agora integrado ao fluxo de dano), e `reflect_damage` (Manto Espelho / Mirror Coat — reflete dano).

- Chamadas adicionadas:
  - `executeAttack`: chama `checkAndActivateTraps` com `ON_ATTACK` ou `ON_DIRECT_ATTACK` dependendo se há alvo; aplica `negateAttack`, dano ao jogador, debuffs, status, e destruições definidas.
  - `summonCard`: chama `checkAndActivateTraps` com `ON_SUMMON` para traps que reagem à invocação.
  - Ao destruir o defensor (no fim da resolução do combate) chamamos `ON_DESTROY` em `checkAndActivateTraps` para que traps do dono do defensor (ex.: Laço do Destino) possam disparar e, se for o caso, destruir o atacante também.

---

**Cartas de Spell (catalogadas em `constants.ts`) — lista e resumo**

- Cura (HEAL / OWNER)
  - `spell_potion` — Poção: HEAL 1000 ao OWNER
  - `spell_super_potion` — Super Poção: HEAL 2000 ao OWNER
  - `spell_hyper_potion` — Hyper Poção: HEAL 3500 ao OWNER
  - `spell_full_restore` — Restauração Total: HEAL 5000 ao OWNER

- Buffs (BUFF / SINGLE_ALLY / ALL_ALLIES)
  - `spell_x_attack` — X-Attack: +500 ATK ao `SINGLE_ALLY` (stat: `ATTACK`)
  - `spell_x_defense` — X-Defense: +500 DEF ao `SINGLE_ALLY` (stat: `DEFENSE`)
  - `spell_rare_candy` — Rare Candy: +800 ATK a `SINGLE_ALLY` (stat: `ATTACK`)
  - `spell_protein` — Proteína: +1000 ATK a `SINGLE_ALLY` (stat: `ATTACK`)
  - `spell_mass_protein` — Proteína em Massa: +500 ATK a `ALL_ALLIES` (stat: `ATTACK`) (nova carta adicionada em `constants.ts`)

- Dano (DAMAGE)
  - `spell_thunder` — Trovão: 800 DAMAGE a `SINGLE_ENEMY`
  - `spell_fire_blast` — Explosão de Fogo: 1200 DAMAGE a `SINGLE_ENEMY`
  - `spell_blizzard` — Nevasca: 600 DAMAGE a `ALL_ENEMIES`
  - `spell_earthquake` — Terremoto: 500 DAMAGE a `ALL_ENEMIES`

- Destruição (DESTROY)
  - `spell_pokeball` — Pokébola: DESTROY `SINGLE_ENEMY` (specialId: `capture`) — captura continua não implementada, atualmente apenas destrói e envia para graveyard
  - `spell_great_ball` — Great Ball: DESTROY `SINGLE_ENEMY` (specialId: `capture_better`)
  - `spell_master_ball` — Master Ball: DESTROY `SINGLE_ENEMY` (specialId: `capture_guaranteed`)

- Comprar cartas
  - `spell_bill` — Bill: DRAW 2 (OWNER)
  - `spell_professor_oak` — Professor Oak: DRAW 3 (OWNER)

- Status
  - `spell_sleep_powder` — Pó do Sono: aplica SLEEP a `SINGLE_ENEMY`
  - `spell_toxic` — Tóxico: aplica POISON a `SINGLE_ENEMY`
  - `spell_will_o_wisp` — Fogo Fátuo: aplica BURN a `SINGLE_ENEMY`
  - `spell_thunder_wave` — Onda de Choque: aplica PARALYZE a `SINGLE_ENEMY`
  - `spell_confuse_ray` — Raio Confuso: aplica CONFUSE a `SINGLE_ENEMY`

- Reviver
  - `spell_revive` — Reviver: REVIVE a partir do `GRAVEYARD`
  - `spell_max_revive` — Reviver Máximo: REVIVE (valor 1) a partir do `GRAVEYARD`

---

**Cartas de Trap (catalogadas em `constants.ts`) — lista e resumo**

- `trap_counter` — Contra-Ataque (ON_ATTACK): DAMAGE 500 a `SINGLE_ENEMY` (aplica dano ao atacante/dono conforme fluxo)
- `trap_mirror_coat` — Manto Espelho (ON_ATTACK): `specialId: reflect_damage` — reflete dano/ATK do atacante quando aplicável (implementado)
- `trap_protect` — Proteção (ON_DIRECT_ATTACK): `specialId: negate_attack` — implementado; nega o ataque direto e consome a armadilha
- `trap_endure` — Resistência (ON_DESTROY): `specialId: survive_1hp` — agora integrado: quando acionada, previne a destruição deixando o dono com 1 HP conforme resolução de dano
- `trap_poison_spikes` — Espinhos Venenosos (ON_SUMMON): STATUS POISON a `SINGLE_ENEMY` (reage a summon)
- `trap_thunder_trap` — Armadilha Trovão (ON_ATTACK): STATUS PARALYZE a `SINGLE_ENEMY`
- `trap_freeze_trap` — Armadilha Gelo (ON_ATTACK): STATUS FREEZE a `SINGLE_ENEMY`
- `trap_destiny_bond` — Laço do Destino (ON_DESTROY): DESTROY `SINGLE_ENEMY` — se o defensor morre, pode destruir o atacante
- `trap_explosion` — Explosão (ON_ATTACK): DAMAGE 1500 `ALL_ENEMIES` — implementado para iterar e destruir/afetar múltiplos alvos
- `trap_scary_face` — Cara Assustadora (ON_SUMMON): DEBUFF -400 ATK a `ALL_ENEMIES`
- `trap_intimidate` — Intimidar (ON_ATTACK): DEBUFF -600 ATK a `SINGLE_ENEMY`
  - Observação: as traps acima possuem `stat: 'ATTACK'` por padrão — traps/debuffs também podem usar `stat: 'DEFENSE'` ou omitir `stat` para atingir ambos.

---

**O que está parcialmente implementado / faltando**

- Captura via Pokéball / Great Ball / Master Ball: `specialId: capture*` existe nos dados mas a lógica de captura (mover carta para o jogador invocador, chance baseada em specialId) ainda não está implementada; atualmente a carta é apenas destruída e enviada ao graveyard.
- Testes automatizados: não foram adicionados; recomenda-se criar cenários unitários e E2E para cada trap/spell.

---

**Sugestões de testes a executar**
1. Ataque direto com `trap_protect` setada no oponente (ON_DIRECT_ATTACK) — confirmar que ataque é negado e trap é consumida.
2. Ataque a monstro com `trap_counter` e `trap_thunder_trap` no oponente — confirmar aplicação de DAMAGE e STATUS ao atacante.
3. Invocar monstro no campo com `trap_poison_spikes` setada no oponente — confirmar que o monstro invocado recebe POISON (no log e em `statusEffects`).
4. Destruir defensor e confirmar `trap_destiny_bond` (ON_DESTROY) destrói o atacante se aplicável.
5. Disparar `trap_explosion` (ALL_ENEMIES) e confirmar destruição múltipla quando defense <= damage.
6. Verificar `trap_endure` (`survive_1hp`) em cenários de dano letal — confirmar que o jogador/monstro permanece com 1 HP e a armadilha é consumida.
7. Usar `spell_pokeball`/`spell_master_ball` e validar que captura não está implementada (espera-se apenas destruição atualmente); caso queira, implementar e testar probabilidades.

---

Se quiser, eu aplico também a integração completa para variações de captura (Pokéball / Great Ball / Master Ball) ou ajusto a semântica de buffs em `OWNER`; diga qual prefere em seguida.

Arquivo gerado a partir dos fontes: `hooks/useGameLogic.ts` e `constants.ts`.
