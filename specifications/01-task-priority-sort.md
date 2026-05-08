# Functional Specification

## Summary

Define o comportamento esperado do comando `tasks list` com ordenação por prioridade. Quando o usuário executa `tasks list`, as tarefas são exibidas ordenadas por prioridade (high → medium → low), com tarefas pendentes antes de concluídas dentro de cada grupo de prioridade. Opcionalmente, a flag `--sort asc` inverte a ordem.

## Source requirement

`requirements/01-task-priority-sort.md` — "Ordenar tarefas por prioridade no comando `list`"

## Actors

- **CLI user** — pessoa que executa comandos do task tracker via terminal

## Scope

### Included

- Ordenação por prioridade no comando `tasks list`
- Flag `--sort` com valores `asc` e `desc`
- Ordenação estável (tarefas com mesma chave mantêm ordem de criação)
- Output formatado com marcadores visuais

### Not included

- Filtragem por status, prioridade, ou data
- Agrupamento visual com headers ou separadores
- Cores na saída
- Persistência de preferência de ordenação
- Alterações nos comandos `add`, `done`, `remove`

## Main flow

1. O usuário executa `./dist/cli.js list`
2. O sistema carrega `data/tasks.json`
3. O sistema ordena as tarefas:
   - Chave primária: `priority` (high > medium > low)
   - Chave secundária: `status` (pending > done)
   - Chave terciária: `id` (ascending — tiebreaker)
4. O sistema itera sobre as tarefas ordenadas
5. Para cada tarefa, o sistema exibe uma linha formatada: `[ ] #id [priority] title` (pending) ou `[✓] #id [priority] title` (done)
6. Se não houver tarefas, exibe `No tasks found.`
7. O sistema termina com código de saída 0

## Alternative flows

### Flow 1 — List with reverse sort

1. O usuário executa `./dist/cli.js list --sort asc`
2. O sistema carrega e ordena tarefas com ordem invertida: low > medium > high, done > pending
3. Display formatado igual ao fluxo principal

### Flow 2 — List with empty store

1. O usuário executa `./dist/cli.js list`
2. O sistema tenta carregar `data/tasks.json`
3. Se o arquivo não existir ou estiver vazio, exibe `No tasks found.`
4. O sistema termina com código de saída 0

### Flow 3 — List with malformed JSON

1. O usuário executa `./dist/cli.js list`
2. O sistema tenta carregar `data/tasks.json`
3. Se o JSON estiver malformado, o sistema exibe `No tasks found.` e termina com código de saída 1

## System states

### Success (com tarefas)

```
[ ] #3 [high] Tarefa urgente
[ ] #1 [high] Alta prioridade
[ ] #5 [medium] Tarefa normal
[ ] #2 [medium] another normal
[ ] #4 [low] Baixa prioridade
[✓] #6 [high] completed high
[✓] #7 [medium] completed medium
```

### Empty

```
No tasks found.
```

### Error (malformed JSON)

```
No tasks found.
```
_(com exit code 1)_

## Business rules

| Regra | Descrição |
| ----- | --------- |
| BR-01 | Prioridades válidas: `high`, `medium`, `low` |
| BR-02 | Valor padrão de prioridade: `medium` |
| BR-03 | Ordenação padrão (sem flag): high > medium > low |
| BR-04 | Dentro de cada prioridade: pending > done |
| BR-05 | Tiebreaker: `id` ascendente |
| BR-06 | `--sort asc` inverte: low < medium < high |
| BR-07 | Dentro de cada prioridade com `asc`: done > pending |
| BR-08 | Exit code 0 em sucesso ou empty; exit code 1 em erro de parsing |

## Validation rules

| Campo | Regra |
| ----- | ----- |
| `id` | number, required, > 0 |
| `title` | string, required, non-empty |
| `priority` | enum: high, medium, low |
| `status` | enum: pending, done |
| `createdAt` | ISO 8601 string, required |

## Data requirements

- **Persistent:** `data/tasks.json` — array de tarefas ordenadas por inserção
- **Lido em cada execução:** O `list` sempre lê do arquivo mais recente
- **Criado automaticamente:** `data/tasks.json` é criado pelo `add` se não existir
- **Formato:** JSON com campos definidos em `src/types/task.ts`

## Edge cases

| Caso | Comportamento esperado |
| ----- | --------------------- |
| Tarefas com mesma priority, status e id | Ordenação estável — ordem de inserção preservada |
| Tarefas sem campo `createdAt` | Usar `id` como tiebreaker primário |
| `createdAt` com valor inválido | Tratar como se `createdAt` fosse 0 |
| Arquivo `data/` existe mas `tasks.json` não | Criar store vazio, exibir `No tasks found.` |
| Tarefa com prioridade não reconhecida | Tratar como `medium` silenciosamente |
| 100+ tarefas | Performance < 1 segundo |

## Non-functional expectations

| Aspecto | Expectativa |
| ------- | ----------- |
| **Performance** | Saída aparece em < 1s para até 1000 tarefas |
| **Compatibilidade** | Funciona em Node.js 20+ em Linux, macOS, Windows |
| **Acessibilidade** | N/A — CLI via terminal |
| **Segurança** | N/A — arquivo JSON local, sem input de usuário no list |

## Acceptance criteria

### AC-01 — List vazio

Given `data/tasks.json` does not exist or contains an empty array,
when the user runs `tasks list`,
then the output is `No tasks found.` and the exit code is 0.

### AC-02 — Ordenação por prioridade padrão

Given 3 tasks exist with priorities high, medium, and low (all pending),
when the user runs `tasks list`,
then the output order is: high first, then medium, then low.

### AC-03 — Pendentes antes de concluídas

Given 2 tasks exist with the same priority (high), one pending and one done,
when the user runs `tasks list`,
then the pending task appears on line 1 and the done task appears after all pending high tasks.

### AC-04 — Ordenação estável

Given 2 tasks exist with the same priority and status,
when the user runs `tasks list`,
then the task with the lower id appears first.

### AC-05 — Flag sort asc

Given 3 tasks exist with priorities high, medium, and low (all pending),
when the user runs `tasks list --sort asc`,
then the output order is: low first, then medium, then high.

### AC-06 — Saída formatada

Given a pending task with id=3, priority=high, and title="Tarefa urgente",
when the user runs `tasks list`,
then the line contains `[ ]`, `#3`, `[high]`, and `Tarefa urgente`.

### AC-07 — Tarefa concluída com marcador

Given a done task with id=5 and title="Done task",
when the user runs `tasks list`,
then the line contains `[✓]`, `#5`, and `Done task`.

### AC-08 — Flag sort desc é igual a padrão

Given tasks with mixed priorities exist,
when the user runs `tasks list --sort desc`,
then the output is identical to `tasks list` without flags.

### AC-09 — Performance com muitas tarefas

Given 100 tasks with mixed priorities exist,
when the user runs `tasks list`,
then the output appears within 1 second.

## Assumptions

- O CLI é executado como `./dist/cli.js` ou via npm bin após `npm run build`
- O arquivo `data/tasks.json` segue o schema definido em `src/types/task.ts`
- O projeto usa ESM — imports terminam em `.js`
- O `commander` propaga automaticamente a flag `--sort` para o handler da action

## Open questions

| # | Pergunta | Estado |
| -- | -------- | ------ |
| 1 | O que acontece com `--sort` valor inválido? | **Aberto** — Ignorar e usar padrão (desc), ou falhar com erro? |
| 2 | A flag `--sort` deve ser case-insensitive? | **Decidido** — Sim, aceitar `ASC`, `DESC`, `asc`, `desc` |
| 3 | JSON malformado (erro de sintaxe) | **Decidido** — Exibir `No tasks found.` e exit code 1 |
| 4 | Objetos fora do schema (ex: falta `priority`) | **Decidido** — O `add` garante schema válido; o `list` ignora objetos inválidos silenciosamente |

## Additional acceptance criteria

### AC-10 — Invalid sort value

Given the user runs `tasks list --sort foo`,
then the system falls back to the default sort (desc: high → low, pending → done) without displaying an error.

### AC-11 — Case-insensitive sort flag

Given tasks with mixed priorities exist,
when the user runs `tasks list --sort ASC`,
then the output is identical to `tasks list --sort asc`.

## Final recommendation

**Ready for technical plan**

A especificação está completa, pequena, e cobrindo todos os fluxos relevantes. Cada acceptance criterion é testável diretamente com Jest (testes unitários da lógica de ordenação) ou com `spawnSync` (testes de integração do CLI). O scope é controlado — 3 arquivos no máximo.
