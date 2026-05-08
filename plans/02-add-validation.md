# Technical Plan

## Files to change
- `src/core/store.ts`: validate title + normalize priority in `addTask`
- `src/cli/index.ts`: map addTask validation failure to exit code 1 message
- `src/core/store.test.ts`: add unit tests for add validation
- `src/cli/cli.test.ts`: add integration tests for add validation

## Approach
- In `addTask`, trim title and throw `Error('INVALID_TITLE')` when empty.
- Normalize priority via helper `normalizePriority(priority)`.
- In CLI `add` action, catch `INVALID_TITLE`, print message, exit(1).

## Validation
- `npm run build`
- `npm run lint`
- `npm run test`

## Risks
- Regression in existing add behavior -> mitigated by current and new tests.
