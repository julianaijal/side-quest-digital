@AGENTS.md

## Hard rules

- **Atomic commits always.** One logical change per commit, no exceptions. Never bundle unrelated fixes into a single commit, even during a review fix pass. Each fix gets its own commit. Split by layer when a feature touches multiple files: data/config first, then copy, then styles, then component, then scripts. Each commit should be one file when that file is a self-contained change.
- **Build, then commit.** Get everything working and passing (typecheck, lint, tests) before making any commits. Never commit broken intermediate states.
