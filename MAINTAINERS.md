# Maintainers

This file is the in-repo source of truth for who can make merge, release, and triage decisions while the project is being revived.

## Roles

Fill these in before enabling write access or publishing releases from a community fork/org.

| Role | Responsibility | Primary | Backup |
| --- | --- | --- | --- |
| Reliability lead | P0/P1 bugs, data-loss risk, export regressions | TBD | TBD |
| Compatibility lead | Windows/macOS/Linux regressions, packaging, platform support | TBD | TBD |
| Build/release lead | CI, artifacts, release notes, notarization/signing coordination | TBD | TBD |
| Community/triage lead | issue routing, PR triage, contributor follow-up | TBD | TBD |

## Operating rules

- No single maintainer should merge their own high-risk PR without a second review.
- Reliability and data-integrity fixes take precedence over feature work.
- Release branches should only take changes that are already green in CI and linked to tracked issues.
- Packaging identity, licensing files, signing, and updater behavior require explicit maintainer review.

## Response targets

- New bug triage: within 7 days.
- New PR triage: within 7 days.
- Re-review after author updates: within 7 days.
- Security or data-loss reports: same day acknowledgement when possible.
