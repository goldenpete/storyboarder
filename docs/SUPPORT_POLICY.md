# Support Policy

## Scope

Storyboarder is currently in a reliability-first revival phase. Support is best-effort and prioritizes:

1. Data loss, save/load corruption, or disappearing boards/models.
2. Export failures that block normal use.
3. Launch/build regressions on supported platforms.
4. Regressions introduced by recently merged fixes.

## Supported baseline

- Toolchain: see [docs/DEVELOPMENT_BASELINE.md](./DEVELOPMENT_BASELINE.md).
- Runtime focus: Windows 10/11, current macOS, and current mainstream Linux desktop distributions.
- CI baseline: install, smoke test, build, and artifact capture.

## What maintainers need in a bug report

- App version or commit/branch.
- OS version and architecture.
- Project type: `.storyboarder`, Fountain, or Final Draft.
- Exact repro steps starting from a known file.
- Whether the issue is deterministic or intermittent.
- If running from source, attach `npm run diagnostics:platform`.
- Logs, screenshots, or sample files if they can be safely shared.

See [docs/PLATFORM_COMPATIBILITY.md](./PLATFORM_COMPATIBILITY.md) for the current platform baseline and supporting checklists.

## Out of scope for immediate support

- New feature requests without a concrete user problem.
- Large modernization work that skips the reliability baseline.
- Custom packaging/signing support for downstream redistributors.

## Triage targets

- P0: same day acknowledgement where possible.
- P1: triage within 3 days.
- P2/P3: triage within 7 days.

Use [docs/TRIAGE_LABELS.md](./TRIAGE_LABELS.md) with this policy.
