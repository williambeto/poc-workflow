# Handoff — Tech Plan + PR Breakdown Complete

## Source Agent

Tech Lead / PR Planner

## Target Agent

Implementer → Reviewer → Validator

## Objective

Implementar ordenação de tarefas por prioridade em uma única PR.

## Context

| Item | Detalle |
| ---- | ------- |
| Proyecto | `poc-workflow` — Task Tracker CLI |
| Repositorio | https://github.com/williambeto/poc-workflow |
| Fase actual | Requirement ✅ → Spec ✅ → Tech Plan ✅ → PR Breakdown ✅ → Implementation |
| Commits | 9 commits en `main` |
| CI | Passando |

## Decisiones ya tomadas

- 1 única PR (scope pequeno: ~110 linhas, 4 arquivos)
- `sortTasks()` exportada para testing direto
- Validação de `--sort` no CLI (case-insensitive, fallback para desc)
- `createdAt` como tiebreaker terciário; `id` como fallback se ausente
- Tests: unit (store.ts) + integration (CLI via spawnSync)

## Archivos listos para implementación

| Archivo | Rol |
| ------- | --- |
| `requirements/01-task-priority-sort.md` | Entrada — requirement aprovado |
| `specifications/01-task-priority-sort.md` | Entrada — 11 ACs, flujos, estados |
| `plans/01-task-priority-sort.md` | Guía técnica — código, data flow, validación |
| `plans/01-pr-breakdown.md` | Guía de PR — scope, validación, template |

## Archivos a modificar

| Archivo | Cambio |
| ------- | ------ |
| `src/core/store.ts` | +sortTasks(), modificar listTasks() |
| `src/cli/index.ts` | Agregar --sort option |
| `src/core/store.test.ts` | Unit tests de ordenação |
| `src/core/cli.test.ts` | Integration tests CLI |

## Validación requerida

```bash
npm run build
npm run lint
npm run test

./dist/cli.js list                         # high→low
./dist/cli.js list --sort asc              # low→high
./dist/cli.js list --sort INVALID          # fallback desc
./dist/cli.js list                         # empty → "No tasks found."
```

## PR validation evidence checklist

Antes de PR:

- [ ] `npm run build` ✅
- [ ] `npm run lint` ✅
- [ ] `npm run test` ✅
- [ ] `./dist/cli.js list` ✅
- [ ] `./dist/cli.js list --sort asc` ✅
- [ ] `./dist/cli.js list --sort INVALID` ✅
- [ ] `git diff --stat` ≤ 4 arquivos

## Stop conditions

- `npm run test` falha → parar e corregir
- Diff excede 4 arquivos → requiere justificación
- Nueva funcionalidad descubierta → detener, requirement separado

## Branch strategy

```bash
git checkout -b feat/task-sort
# implementar
git push -u origin feat/task-sort
# crear PR via gh
```

## Final recommendation

**Ready for implementation**

Todo el workflow hasta PR breakdown está documentado y validado. Una única PR de ~110 líneas que implementa los 11 ACs. La validación es clara y ejecutable.

Siguiente paso: implementar la PR siguiendo `plans/01-pr-breakdown.md`.
