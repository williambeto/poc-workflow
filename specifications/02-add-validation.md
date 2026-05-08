# Functional Specification

## Summary
Specify behavior for input validation in `tasks add`.

## Source requirement
`requirements/02-add-validation.md`

## Main flow
1. User runs `tasks add <title> [--priority <level>]`
2. System trims title
3. If title is empty after trim, print error and exit 1
4. System normalizes priority to lowercase
5. If priority not in {low, medium, high}, fallback to medium
6. Task is saved and success message printed

## Validation rules
- `title`: required, non-empty after trim
- `priority`: enum low|medium|high; invalid -> medium

## Acceptance criteria
- AC-1 empty title rejected (exit 1)
- AC-2 whitespace title rejected (exit 1)
- AC-3 invalid priority fallback to medium
- AC-4 case-insensitive valid priority accepted

## Final recommendation
Ready for technical plan
