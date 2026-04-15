# Project Board

Use four top-level buckets only. The goal is to keep triage visible and avoid feature work overtaking reliability work.

## Reliability

Use for:

- export failures
- save/load corruption
- Shot Generator persistence
- filesystem/path sanitization

Exit criteria:

- repro exists
- fix lands with coverage when practical
- smoke tests stay green

## Compatibility

Use for:

- Apple Silicon
- Linux runtime/AppImage issues
- Windows input/path/platform bugs

Exit criteria:

- tested on the affected platform or clearly documented
- fallback behavior is defined

## Build/Release

Use for:

- CI workflows
- packaging
- signing/notarization
- release notes and artifact validation

Exit criteria:

- CI green
- artifacts captured
- release blockers called out explicitly

## Feature PR Review

Use for:

- existing open feature PRs
- scoped cherry-pick candidates
- non-reliability enhancements

Exit criteria:

- rubric applied
- risk/benefit recorded
- merge wave assigned
