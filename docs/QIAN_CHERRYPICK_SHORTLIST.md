# Qian Cherry-pick Shortlist

This is a review queue, not a blanket approval.

## Candidate group 1: duration and timeline fixes

Why it is interesting:

- aligns with prior issue traffic around timing math
- likely low UI churn if split into focused patches

Review gates:

- isolate math fixes from unrelated UI changes
- confirm no regression in export timing
- add local tests before merge

## Candidate group 2: print and PDF improvements

Why it is interesting:

- print/export remains a visible workflow
- scoped changes can be validated with existing print/export paths

Review gates:

- separate template/layout work from packaging or identity changes
- verify output against current PDF/export smoke and manual checks
- avoid mixing in unrelated panel/UI removals

## Do not cherry-pick blindly

- packaging identity changes
- keymap default changes
- legal/distribution asset removals
- broad UI removals bundled with bug fixes
