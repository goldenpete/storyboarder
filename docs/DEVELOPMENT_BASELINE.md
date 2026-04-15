# Development Baseline

This repository is currently being stabilized with a reliability-first scope.

## Toolchain

- Node.js: `16.x`
- Electron runtime: `18.0.2`
- Package manager: `npm`

## Local setup

```bash
npm ci
```

## Verification commands

```bash
npm run diagnostics:platform
npm run test:smoke
npm run test:full
npm run build
```

## Current priorities

- Reliability: export, save, autosave, project integrity
- Compatibility: Windows/macOS/Linux regressions
- Build/Release: reproducible installs, CI, documented toolchain
- Feature PR review: only after reliability work is green

## Pull request expectations

- Reproduce the bug or document the affected workflow.
- Add or update a regression test when the code path is testable.
- Note which platform(s) you verified locally if the change is platform-specific.
- Keep fixes narrowly scoped unless a refactor is required to make the bug testable.
