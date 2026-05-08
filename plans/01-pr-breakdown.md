# PR Breakdown — Sort Tasks by Priority

## Overview

Una única PR que implementa ordenação de tarefas por prioridade no comando `tasks list`.

**Razón para 1 PR:** O scope é pequeño (~110 líneas, 4 arquivos), sem refactoring necessária, e todas as mudanças são fortemente acopladas (a ordenação afeta a exibição).

## PR única

### Título

`feat: sort tasks by priority in list command`

### Descripción

```
- Add sortTasks() function in store.ts (sort by priority > status > id)
- Pass sort direction from CLI to listTasks()
- Add --sort flag (asc/desc) to list command
- Add unit tests for sortTasks()
- Add integration tests for CLI list command
```

### Scope

| Archivo | Cambio |
| ------- | ------ |
| `src/core/store.ts` | Nueva función `sortTasks()`, modificar `listTasks()` |
| `src/cli/index.ts` | Agregar `--sort` option al comando `list` |
| `src/core/store.test.ts` | Tests unitarios de ordenação |
| `src/core/cli.test.ts` | Tests de integração CLI |

### Acceptance criteria validadas na PR

| # | Criterio | Como se valida |
| -- | -------- | ------------- |
| AC-01 | Empty state | Test de integração |
| AC-02 | Ordenação por prioridade padrão | Test unitário |
| AC-03 | Pendentes antes de concluídas | Test unitário |
| AC-04 | Ordenação estável por id | Test unitário |
| AC-05 | Flag --sort asc | Test unitário + integração |
| AC-06 | Saída formatada | Test de integração |
| AC-07 | Marcador [✓] para done | Test de integração |
| AC-08 | --sort desc = padrão | Test de integração |
| AC-09 | Performance < 1s para 100 tasks | Manual |
| AC-10 | Valor inválido --sort fallback | Test unitário + integração |
| AC-11 | Case-insensitive --sort | Test de integração |

### Validation commands

```bash
npm run build   # debe compilar sin errores
npm run lint    # debe pasar sin errores
npm run test    # debe pasar 100% de tests
./dist/cli.js list                           # tareas ordenadas high→low
./dist/cli.js list --sort asc                 # tareas low→high
./dist/cli.js list --sort INVALID             # fallback a desc
echo $?                                       # exit code 0
```

### Validation evidence checklist

Antes de solicitar review:

- [ ] `npm run build` pasa sin errores
- [ ] `npm run lint` pasa sin errores
- [ ] `npm run test` pasa — todos os tests verde
- [ ] `./dist/cli.js list` exibe tarefas ordenadas
- [ ] `./dist/cli.js list --sort asc` exibe ordem reversa
- [ ] `./dist/cli.js list --sort INVALID` não exibe erro
- [ ] `./dist/cli.js list` con store vacío exibe "No tasks found."
- [ ] `git diff --stat` muestra ≤ 4 arquivos modificados

### Handoff para implementação

Quando estiver pronto para implementar, o agente deve:

1. Ler `specifications/01-task-priority-sort.md`
2. Ler `plans/01-task-priority-sort.md`
3. Implementar mudanças archivo por archivo
4. Executar validation commands após cada archivo
5. Escrever tests antes de completar cada mudança (TDD)
6. Criar branch `feat/task-sort` desde `main`
7. Commits pequenos e atômicos
8. PR description seguindo este template

### PR description template

```md
## Summary

Implementa ordenação de tarefas por prioridade no comando `tasks list`.

## Changes

- `src/core/store.ts`: lógica de ordenação
- `src/cli/index.ts`: flag `--sort`
- `src/core/store.test.ts`: unit tests
- `src/core/cli.test.ts`: integration tests

## Validation

- `npm run lint` ✅
- `npm run test` ✅
- `./dist/cli.js list` ✅ (high → low)
- `./dist/cli.js list --sort asc` ✅ (low → high)
- `./dist/cli.js list --sort INVALID` ✅ (fallback to desc)

## Related

- Requirement: requirements/01-task-priority-sort.md
- Specification: specifications/01-task-priority-sort.md
- Plan: plans/01-task-priority-sort.md
```
