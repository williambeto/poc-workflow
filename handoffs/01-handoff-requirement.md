# Handoff — Requirement Phase Complete

## Source Agent

Product Manager (planner role)

## Target Agent

Product Manager → Spec Writer

## Objective

Criar a functional specification para a feature de ordenação de tarefas por prioridade no comando `list`.

## Context

| Item | Detalle |
| ---- | ------- |
| Proyecto | `poc-workflow` — Task Tracker CLI |
| Repositorio | https://github.com/williambeto/poc-workflow |
| Fase actual | Requirement ✅ → Spec → Tech Plan → PR Breakdown → Implementation |
| Commits | 4 commits en `main` |
| CI | Passando (lint + test) |
| Submodule | `codex-repo-starter` v1.1.2 en `.workflow/codex-repo-starter` |

### Requisito creado

`requirements/01-task-priority-sort.md` — "Ordenar tarefas por prioridade no comando `list`"

**Resumen:**
Quando o usuário executa `tasks list`, as tarefas devem ser exibidas ordenadas por prioridade (high → medium → low), com as tarefas pendentes antes das concluídas dentro de cada grupo de prioridade.

**Tester review:** Approved with notes — 1 medium finding (cenários 6-7 removidos por scope creep), resuelto.

## Decisiones ya tomadas

- Flag `--sort` aceita valores `asc` (low→high) e `desc` (high→low)
- Ordenação estável — tarefas com mesma chave mantêm ordem original
- Prioridade padrão: `medium`
- Prioridades válidas: `high`, `medium`, `low` (case-insensitive)
- Rejeitar título vazio no `add` — **removido deste requirement**, pertenece a requirement separado
- Validação de prioridade inválida no `add` — **removido deste requirement**, pertenece a requirement separado

## Archivos en scope

- `src/core/store.ts` — lógica de ordenação no `listTasks()`
- `src/cli/index.ts` — обработка flag `--sort` no comando `list`
- `src/core/store.test.ts` — testes de ordenação
- `requirements/01-task-priority-sort.md` — requirement (lectura)

## Archivos fuera de scope

- `src/types/task.ts` — tipos já existem
- Comandos `add`, `done`, `remove` — não modification necessária para a ordenação
- Funcionalidade de filtragem, agrupamento, ou colores
- Persistência de preferencia de ordenação

## Restricciones

- Preservar comportamento existente a menos que seja explicitamente cambiado.
- Manter el cambio pequeño y revisável — 1 PR, ≤ 5 arquivos, ≤ 200 líneas.
- No implementar PRs futuros.
- No introducir dependencias o herramientas no relacionadas.
- Usar `spawnSync` para tests de integração do CLI (como no bootstrap).

## Validación requerida

1. `npm run lint` → sin errores
2. `npm run test` → 100% tests passando
3. `./dist/cli.js list` → tarefas ordenadas (high→medium→low, pendentes antes de done)
4. `./dist/cli.js list --sort asc` → ordem reversa
5. `./dist/cli.js list` con store vacío → "No tasks found."
6. `git diff --stat` da PR → ≤ 5 arquivos modificados

## Riesgos conocidos

| Riesgo | Impacto | Mitigación |
| ------- | ------ | ---------- |
| Tasks com `createdAt` inválido causa sort impredecible | Low | Implementar fallback para ID durante ordenação |
| Flag `--sort` conflita com flags futuras do commander | Low | Documentar no help; usar `--sort` não `--order` |
| Ordenação muda experiência do usuário existente | Low | Comportamento esperado da feature; acceptable para POC |

## Stop conditions

- Si el código rompe `npm run test` → parar e corregir
- Si el diff excede 5 arquivos ou 200 líneas → dividir em PRs menores
- Si se descubre nueva funcionalidad necessária → detener e criar requirement separado

## Expected output

- Functional spec em `specifications/01-task-priority-sort.md`
- Decisiones de diseño documentadas
- Validación pasar antes de avanzar a tech plan
- Tester review: Approved
