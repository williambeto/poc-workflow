# Product Requirement

## Title

Ordenar tarefas por prioridade no comando `list`

## Summary

Quando o usuário executa `tasks list`, as tarefas devem ser exibidas ordenadas por prioridade (high → medium → low), com as tarefas pendentes antes das concluídas dentro de cada grupo de prioridade.

## Problem

Hoje, o comando `tasks list` exibe as tarefas na ordem em que foram adicionadas (ordem de inserção no JSON). Isso significa que o usuário precisa examinar toda a lista para encontrar as tarefas mais urgentes. Não há forma de ver rapidamente quais tarefas têm prioridade alta.

## Target user

Usuário do CLI que gerencia tarefas locais via terminal e precisa identificar rapidamente o que fazer primeiro.

## Goal

Quando o usuário executa `tasks list`, as tarefas devem aparecer ordenadas por prioridade — high primeiro, depois medium, depois low — facilitando a identificação visual das tarefas mais urgentes.

## Scope

### Included

- Ordenar tarefas por prioridade (high > medium > low) dentro de cada grupo de status
- Pendentes aparecem antes de concluídas dentro do mesmo nível de prioridade
- Ordenação estável: tarefas com mesma prioridade e status mantêm ordem de criação
- Flag opcional `--sort` para especificar ordem (asc/desc)
- Testes unitários cobrindo a lógica de ordenação
- Testes de integração do comando `list`

### Not included

- Filtragem por status ( `--done`, `--pending`)
- Agrupamento visual (separadores, headers)
- Persistência da ordem de ordenação entre sessões
- Ordenação por data de criação, data de conclusão, ou título
- Alterações no comando `add`, `done`, ou `remove`

## Priority classification

### Must-have

- Ordenação por prioridade padrão (high → medium → low)
- Tarefas pendentes antes de concluídas dentro de cada prioridade

### Should-have

- Flag `--sort` para inverter ordem (low → medium → high)

### Could-have

- Ordenação por data de criação
- Saída colorida por prioridade

### Won't-have

- Agrupamento visual com headers
- Persistência de preferência de ordenação

## User story

As a CLI user,
I want to run `tasks list` and see high-priority tasks at the top,
so that I can quickly identify what to work on next without scanning the entire list.

## Acceptance criteria

### Scenario 1 — List without tasks

Given no tasks exist in the store,
when the user runs `tasks list`,
then the system displays "No tasks found." without error.

### Scenario 2 — List with mixed priorities

Given tasks with priorities high, medium, and low exist,
when the user runs `tasks list`,
then the tasks are displayed in order: high first, then medium, then low.

### Scenario 3 — Pending before done

Given two tasks with the same priority (high), one pending and one done,
when the user runs `tasks list`,
then the pending task appears before the done task.

### Scenario 4 — Stable order within same group

Given two tasks with the same priority and same status,
when the user runs `tasks list`,
then the task created first appears first (stable sort).

### Scenario 5 — Reverse sort flag

Given tasks with mixed priorities exist,
when the user runs `tasks list --sort asc`,
then the tasks are displayed in reverse order: low first, then medium, then high.

### Scenario 6 — Empty title rejection

Given the user runs `tasks add ""`,
then the system displays an error and does not create the task.

### Scenario 7 — Invalid priority handling

Given the user runs `tasks add "Test" --priority invalid`,
then the system falls back to "medium" priority without error.

## Business rules

- Prioridades válidas: `high`, `medium`, `low` (case-insensitive)
- Prioridade padrão quando não especificada: `medium`
- Ordenação primária: `high` > `medium` > `low`
- Ordenação secundária: `pending` > `done`
- Ordenação terciária: `createdAt` ascendente (mais antigo primeiro)

## Dependencies

- `src/core/store.ts` — funções `addTask`, `listTasks` existentes
- `src/types/task.ts` — tipo `Priority` existente
- `jest` — framework de testes já configurado

## Assumptions

- O CLI será invocado como `./dist/cli.js` ou via npm bin
- O arquivo `data/tasks.json` será criado automaticamente se não existir
- O projeto usa ESM (type: module) — imports com `.js` extension

## Open questions

| # | Pergunta | Decisão |
| -- | -------- | ------- |
| 1 | A flag `--sort` deve aceitar apenas `asc`/`desc` ou valores textuais? | `asc` (low→high) e `desc` (high→low) |
| 2 | A ordenação deve ser estável? | Sim — tarefas com mesma chave mantêm ordem original |
| 3 | Devemos validar título vazio no `add`? | Sim — rejeitar com mensagem de erro |

## Risks

| Risco | Impacto | Mitigação |
| ----- | ------- | --------- |
| Ordenação muda ordem de tarefas existentes para o usuário | Medium | Aceitável — é comportamento esperado da feature |
| Flag `--sort` pode conflitar com flags futuras do commander | Low | Documentar no help do comando |
| Testes de ordenação dependem de timing de criação | Low | Usar IDs incrementais como tiebreaker verificável |

## Success metrics

- `npm run test` passa com 100% dos novos testes cobrindo ordenação
- `./dist/cli.js list` exibe tarefas ordenadas corretamente
- `./dist/cli.js list --sort asc` exibe tarefas em ordem reversa
- Linha de comando `tasks add "X" --priority high` seguida de `tasks add "Y" --priority low` resulta em X antes de Y no list

## Final recommendation

**Ready for spec**

O requirement está claro, pequeno, e produz uma única PR. A feature é bem delimitada: ordenação de tarefas por prioridade no comando `list`. Os 7 cenários de acceptance criteria cobrem o happy path e casos de borda (empty state, prioridade inválida, sort flag). O escopo é controlado — 3 arquivos ou menos, lógica pura de ordenação testável com Jest.
