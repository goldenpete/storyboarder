# Electron Upgrade RFC

## Purpose

This is the staging document for future Electron/Node modernization. It is intentionally separate from the reliability sprint so upgrade work does not get mixed into urgent bug fixing.

## Current baseline

- Electron: `18.0.2`
- Node runtime in CI/tooling: `16.x`

## Non-goals

- No dependency-wide upgrade sweep without a reproducible baseline.
- No packaging identity changes bundled into runtime upgrades.
- No feature work mixed into upgrade PRs.

## Required inventory before upgrading

- Electron main-process IPC touch points.
- Renderer APIs that still assume legacy Electron defaults.
- `@electron/remote` usage.
- Native/packaged binary access (`ffmpeg`, external assets, server bundle).
- Window creation defaults and preload/security assumptions.

## Proposed order

1. Freeze green baseline on current Electron.
2. Remove or isolate deprecated APIs behind small wrappers.
3. Upgrade build/test tooling needed for the Electron jump.
4. Land Electron upgrade in a dedicated branch with smoke coverage.
5. Validate packaging, updater, and export flows before release.

## Upgrade gates

- `npm run test:smoke` passes on CI runners.
- `npm run build` passes.
- app launch/open/save smoke stays green.
- no new pathing regressions in export or Shot Generator persistence.

## Open questions

- How much `@electron/remote` usage can be removed before the version jump?
- Which preload/context-isolation changes can be staged ahead of time?
- Which downstream signing/notarization steps are currently unowned?
