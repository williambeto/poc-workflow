# POC Workflow — Task Tracker CLI

Repositório POC para provar que o workflow do `codex-repo-starter` funciona end-to-end.

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
./dist/cli.js add "Implementar feature X" --priority high
./dist/cli.js list
./dist/cli.js done 1
./dist/cli.js remove 2
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
| Requirement | `.workflow/codex-repo-starter/POC-requirement.md` |
| POC Report | `poc-report.md` |

## CI

Validations run on push via `.github/workflows/validate.yml`.

## Prova de execução

- Documento formal: `PROVA.md`
- Relatório detalhado da POC: `poc-report.md`
