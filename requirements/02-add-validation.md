# Product Requirement

## Title
Validate `add` command input

## Summary
Reject empty task titles and normalize invalid priority values when running `tasks add`.

## Problem
`tasks add` currently accepts empty titles and arbitrary priority strings, which creates low-quality task data and unclear list output.

## Target user
CLI user managing tasks locally.

## Goal
Guarantee minimum task data quality at creation time.

## Scope
### Included
- Reject empty/whitespace-only title with exit code 1
- Normalize invalid priority to `medium`
- Keep valid priorities (`low`, `medium`, `high`) case-insensitive
- Add unit + CLI integration tests

### Not included
- Editing existing tasks
- Validation for `done` and `remove`
- New priority levels

## Acceptance criteria
1. Given `tasks add ""`, then command fails with exit code 1 and does not create task.
2. Given `tasks add "   "`, then command fails with exit code 1 and does not create task.
3. Given `tasks add "Task" --priority INVALID`, then created task priority is `medium`.
4. Given `tasks add "Task" --priority HIGH`, then created task priority is `high`.

## Final recommendation
Ready for spec
