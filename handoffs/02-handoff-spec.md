# Handoff — Spec Phase Complete

## Source Agent

Spec Writer (product-manager role)

## Target Agent

Tech Lead → PR Planner

## Objective

Criar o technical plan e PR breakdown para implementar ordenação de tarefas por prioridade.

## Context

| Item | Detalle |
| ---- | ------- |
| Proyecto | `poc-workflow` — Task Tracker CLI |
| Repositorio | https://github.com/williambeto/poc-workflow |
| Fase actual | Requirement ✅ → Spec ✅ → Tech Plan → PR Breakdown → Implementation |
| Commits | 7 commits en `main` |
| CI | Passando (lint + test) |
| Tester review | Approved with notes |

### Specification created

`specifications/01-task-priority-sort.md`

**Resumo:**
Comando `tasks list` com ordenação por prioridade (high > medium > low), pendentes antes de concluídas, com flag `--sort asc` opcional e ordenação estável.

**11 acceptance criteria** cobrindo: empty state, ordenação padrão, pending/done, estável, flag asc, formatação, marcadores, performance, sort inválido (AC-10), case-insensitivity (AC-11).

## Decisiones ya tomadas

- Lógica de ordenação implementada no `store.ts` (função `listTasks` retorna ordenada)
- CLI flag `--sort` implementada no handler `list` usando `commander`
- JSON malformado → `No tasks found.` + exit code 1
- Objetos fora do schema → ignorados silenciosamente
- Valor inválido de `--sort` → fallback para padrão (desc)
- Case-insensitive para `--sort` (ASC, DESC, asc, desc)

## Archivos en scope

- `src/core/store.ts` — lógica de ordenação em `listTasks()`
- `src/cli/index.ts` — обработка flag `--sort` no comando `list`
- `src/core/store.test.ts` — testes unitários de ordenação
- `specifications/01-task-priority-sort.md` — spec (lectura)

## Archivos fuera de scope

- `src/types/task.ts` — tipos já existem
- Comandos `add`, `done`, `remove`
- `package.json`, `tsconfig.json`
- Filtragem, grouping, colores

## Restricciones

- Preservar comportamento existente a menos que seja explicitamente cambiado.
- Manter PR pequeño y revisável.
- No introducir dependencias o herramientas no relacionadas.
- Usar `spawnSync` para tests de integração CLI.

## Validación requerida

1. `npm run lint` → sin errores
2. `npm run test` → 100% tests passando (incluye novos tests)
3. `./dist/cli.js list` → tarefas ordenadas correctamente
4. `./dist/cli.js list --sort asc` → ordem reversa
5. `./dist/cli.js list --sort INVALID` → usa padrão sem erro
6. `./dist/cli.js list` con store vacío → "No tasks found."
7. `git diff --stat` da PR → ≤ 5 arquivos modificados

## Riesgos conocidos

| Riesgo | Impacto | Mitigación |
| ------- | ------ | ---------- |
| `createdAt` inválido quebra ordenação | Low | Fallback para `id` como tiebreaker |
| Flag `--sort` conflita com future flags | Low | Documentar no help |
| Performance com 100+ tarefas | Low | O(n log n) sort é suficiente para 1000+ tarefas |

## Stop conditions

- Si `npm run test` falla → parar e corregir
- Si el diff excede 5 arquivos → dividir em PRs menores
- Si se descubre nueva funcionalidad necessária → detener e criar requirement separado

## Expected output

- Technical plan em `plans/01-task-priority-sort.md`
- PR breakdown em `plans/01-pr-breakdown.md`
- Tester review: Approved
- Handoff document
