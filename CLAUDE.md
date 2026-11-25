@AGENTS.md

## Hard rules

- **Atomic commits always.** One logical change per commit, no exceptions. Never bundle unrelated fixes into a single commit, even during a review fix pass. Each fix gets its own commit. Split by layer when a feature touches multiple files: data/config first, then copy, then styles, then component, then scripts. Each commit should be one file when that file is a self-contained change.
- **Build, then commit.** Get everything working and passing (typecheck, lint, tests) before making any commits. Never commit broken intermediate states.
- **Use design tokens for every value that has one.** Font sizes, spacing, colors, radii, weights and line heights all have tokens in `styles/_tokens.scss`. Never hardcode a value when a matching `$theme-*`, `$fs-*`, `$fw-*`, `$lh-*`, `$ls-*`, `$radius-*` or `space()` token exists. When a value genuinely falls between tokens (optical correction), leave it as a raw value with no comment needed, but prefer the nearest token when the difference is negligible.
- **PR for behavior changes, direct commit for hygiene.** Any change that touches behavior, adds features, or spans multiple files goes through a pull request. Only trivial one-liners (typos, gitignore, dotfile tweaks) go straight to `main`.
- **Breakpoint `$bp-sm` lives in `_layout.scss`.** All other breakpoints are in `_tokens.scss`. This is intentional: `_layout.scss` owns the mobile layout threshold because it also owns `container` and the type mixins that use it.
