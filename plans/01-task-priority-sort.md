# Technical Plan — Sort Tasks by Priority

## Source

- Requirement: `requirements/01-task-priority-sort.md`
- Specification: `specifications/01-task-priority-sort.md`

## Current state

O comando `tasks list` em `src/core/store.ts` retorna tarefas na ordem de inserção:

```ts
export function listTasks(): Task[] {
  const store = loadStore();
  return store.tasks; // sem ordenação
}
```

O CLI em `src/cli/index.ts` simplesmente exibe cada tarefa com um marcador.

## Proposed approach

### Change 1 — Lógica de ordenação em `store.ts`

Adicionar uma função `sortTasks(tasks, direction?)` que ordena por:

1. `priority` (high=3, medium=2, low=1)
2. `status` (pending=1, done=0)
3. `id` (ascending — tiebreaker)

Modificar `listTasks()` para chamar `sortTasks()` antes de retornar.

```ts
const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };
const STATUS_WEIGHT = { pending: 1, done: 0 };

export function sortTasks(tasks: Task[], direction: 'asc' | 'desc' = 'desc'): Task[] {
  const mult = direction === 'asc' ? 1 : -1;
  return [...tasks].sort((a, b) => {
    const pa = PRIORITY_WEIGHT[a.priority] ?? 2;
    const pb = PRIORITY_WEIGHT[b.priority] ?? 2;
    if (pa !== pb) return (pa - pb) * mult;
    const sa = STATUS_WEIGHT[a.status] ?? 1;
    const sb = STATUS_WEIGHT[b.status] ?? 1;
    if (sa !== sb) return (sa - sb) * mult;
    return (a.id - b.id) * mult;
  });
}

export function listTasks(): Task[] {
  return sortTasks(loadStore().tasks);
}
```

**Decisión:** `sortTasks` é exportada para facilitar testing direto da lógica de ordenação sem CLI.

### Change 2 — Flag `--sort` no CLI

No `src/cli/index.ts`, a action do comando `list` recebe `options` com `{ sort }`:

```ts
program
  .command('list')
  .description('List all tasks')
  .option('-s, --sort <direction>', 'Sort order: asc or desc', 'desc')
  .action((options) => {
    const direction = ['asc', 'desc'].includes(options.sort.toLowerCase())
      ? options.sort.toLowerCase()
      : 'desc';
    const tasks = listTasks(direction); // passing direction
    // ... display
  });
```

**Decisión:** Validar case-insensitivity no CLI e fazer fallback para `'desc'` em valor inválido.

### Change 3 — Testes unitários

Em `src/core/store.test.ts`, adicionar группа de testes `describe('sortTasks')`:

- Ordenação por prioridade padrão (high > medium > low)
- Pendentes antes de concluídas
- Ordenação estável com IDs
- Flag asc inverte ordem
- Valor inválido faz fallback

### Change 4 — Testes de integração CLI

Adicionar testes de integração que usam `spawnSync` para invocar `./dist/cli.js`:

- `list` vazio → "No tasks found."
- `list` com tarefas ordenadas
- `list --sort ASC` → ordem reversa
- `list --sort invalid` → usa padrão

## Data flow

```
CLI: ./dist/cli.js list --sort asc
  → commander parseia --sort
  → listTasks('asc')
    → loadStore() → Task[]
    → sortTasks(tasks, 'asc') → Task[] ordenado
  → formatOutput(tasks)
  → stdout / exit code
```

## Files likely to change

| Archivo | Cambio | Líneas aprox. |
| ------- | ------ | ------------- |
| `src/core/store.ts` | +sortTasks, modificar listTasks | +35 linhas |
| `src/cli/index.ts` | +option --sort, pasar direction | +5 linhas |
| `src/core/store.test.ts` | +sort tests (unit) | +40 linhas |
| `src/core/cli.test.ts` | +integration tests (spawn) | +30 líneas |

**Total estimado:** ~110 linhas, 4 arquivos.

## What should NOT change

- `src/types/task.ts` — tipos não mudam
- Comandos `add`, `done`, `remove` — lógica de criação/edição não muda
- `package.json`, `tsconfig.json`, `jest.config.js`
- Formato do `data/tasks.json`

## Validation strategy

| Comando | Esperado |
| ------- | -------- |
| `npm run lint` | sin errores |
| `npm run test` | todos os tests passando |
| `./dist/cli.js list` | tarefas ordenadas high→low |
| `./dist/cli.js list --sort ASC` | tarefas ordenadas low→high |
| `./dist/cli.js list --sort foo` | usa padrão (high→low) |
| `./dist/cli.js list` (vazio) | "No tasks found." |
| `git diff --stat` | ≤ 4 archivos modificados |

## Risks and mitigations

| Riesgo | Impacto | Mitigación |
| ------- | ------ | ---------- |
| Ordenação muda ordem de tarefas existentes | Medium | Comportamento esperado da feature; acceptable |
| `createdAt` undefined causa sort imprevisível | Low | Usar `id` como tiebreaker primário; tests cobrem |
| Validação de `--sort` no CLI duplica lógica do store | Low | Validar no CLI (fallback rápido) e no store (defensive) |
| Incompatibilidade com Node.js mais antigo | Low | CI usa Node.js 20; projeto especifica 20+ |

## Open questions resolved

| Pergunta | Decisão |
| -------- | ------- |
| Onde implementar a ordenação? | `store.ts` (dados) + `cli/index.ts` (flag) |
| Testes unitários ou de integração? | Ambos: unit tests para lógica, integração para CLI |
| Como testar sem arquivo de dados real? | Criar `data/tasks.json` temporário nos tests de integração |
| PRs necessários? | 1 única PR (≤ 110 líneas, 4 archivos) |

## Recommendation

**Ready for implementation**

O plano é pequeño, seguro, y verificável. Una única PR covering toda la feature. La validación es clara y ejecutable.
