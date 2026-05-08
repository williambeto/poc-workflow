# PR Breakdown

## PR-2
Title: `feat: validate add command input`

Scope:
- Reject empty titles
- Normalize invalid priority to medium
- Add unit/integration tests

Validation:
- build/lint/test all pass
- CLI checks:
  - `node dist/cli/index.js add ""` => exit 1
  - `node dist/cli/index.js add "x" --priority INVALID` => stored as medium
