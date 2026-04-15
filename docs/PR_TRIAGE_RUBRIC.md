# PR Triage Rubric

Use this rubric before merging any open PR or cherry-pick candidate.

## Fast path

Apply `safe-to-merge` only when all of the following are true:

- Scope is small and behavior is easy to reason about.
- CI is green on the maintained baseline.
- The change includes tests or is obviously docs-only.
- No packaging, updater, licensing, or keymap behavior changes are involved.
- The PR does not silently change file paths, persistence, or export behavior.

## Reliability gate

Escalate for deeper review if the PR touches:

- save/load behavior
- scene/board folder naming
- Shot Generator persistence
- export pipeline code
- Electron main/renderer IPC
- packaging/signing metadata

These must have:

- a concrete repro or failure class
- regression tests where practical
- clear rollback strategy

## Merge waves

- Wave 1: docs, translations, low-risk cleanup.
- Wave 2: build/test hygiene with CI proof.
- Wave 3: reliability fixes with repro coverage.
- Wave 4: feature PRs only after the baseline stays green.

## Cherry-pick review questions

- Is the fix already covered by tests in this repo?
- Does it change packaging identity or distribution behavior?
- Does it alter keymaps or defaults in a user-visible way?
- Can it be split into a smaller patch with a local test?
- Is there a safer re-implementation than a direct cherry-pick?
