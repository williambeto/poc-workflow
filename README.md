# POC Workflow — Task Tracker CLI

Repositório POC para provar que o workflow do `codex-repo-starter` funciona end-to-end.

## Projeto escolhido para a POC

O projeto escolhido foi um **Task Tracker CLI** chamado `poc-workflow`.

### Por que esse projeto?

- **Escopo pequeno e controlado**: ideal para validar workflow sem complexidade desnecessária.
- **Fácil de testar**: comportamento verificável por comandos CLI e testes automatizados.
- **Sem infraestrutura externa**: usa apenas arquivo JSON local (`data/tasks.json`).
- **Permite evolução incremental**: cada feature vira uma PR pequena e revisável.

### O que foi implementado na prova

- **PR #1**: ordenação por prioridade no comando `list`.
- **PR #2**: validação de entrada no comando `add` (título vazio e prioridade inválida).

Repositório: `https://github.com/williambeto/poc-workflow`

## Stack

- **Runtime:** Node.js 20+
- **Language:** TypeScript
- **CLI:** commander
- **Tests:** Jest + ts-jest
- **Persistence:** JSON file (`data/tasks.json`)

## Commands

```bash
npm install
npm run build
npm run test

# CLI usage
./dist/cli/index.js add "Implementar feature X" --priority high
./dist/cli/index.js list
./dist/cli/index.js done 1
./dist/cli/index.js remove 2
```

## Workflow

Este projeto usa `codex-repo-starter` como submodule em `.workflow/codex-repo-starter`.

O workflow seguido:
```
Requirement → Spec → Tech Plan → PR Breakdown → Implementation → Validation
```

## Documentation

| Fase | Documento |
| ---- | --------- |
| Requirement (POC macro) | `POC-requirement.md` |
| Requirement (PR #1) | `requirements/01-task-priority-sort.md` |
| Requirement (PR #2) | `requirements/02-add-validation.md` |
| POC Report | `poc-report.md` |

## CI

Validations run on push via `.github/workflows/validate.yml`.

## Prova de execução

- Documento formal: `PROVA.md`
- Relatório detalhado da POC: `poc-report.md`
