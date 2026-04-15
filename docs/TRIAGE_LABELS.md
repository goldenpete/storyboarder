# Triage Labels

These labels are the repo-side contract for issues and PRs. Create matching GitHub labels in whatever maintained fork/org takes over distribution.

## Priority

- `P0-data-loss`: save corruption, disappearing boards, destructive regressions.
- `P1-blocking`: launch/export/build failures that block normal use.
- `P2-high`: serious but non-destructive regressions.
- `P3-normal`: important but non-urgent work.

## Area

- `area-reliability`
- `area-compatibility`
- `area-build-release`
- `area-feature-review`
- `area-docs`

## Workflow

- `needs-repro`: report is not actionable yet.
- `needs-logs`: maintainer needs logs, screenshots, or a sample project.
- `needs-tests`: fix exists or is proposed, but regression coverage is missing.
- `needs-rebase`: PR no longer merges cleanly.
- `blocked-external`: requires GitHub admin, signing, notarization, infra, or org setup.
- `safe-to-merge`: low-risk change, scoped, tested, and review-complete.
- `compat-risk`: touches platform-specific behavior, paths, packaging, or electron runtime.

## Status

- `status-triaged`
- `status-in-progress`
- `status-needs-review`
- `status-waiting-on-author`
- `status-closed-as-duplicate`
