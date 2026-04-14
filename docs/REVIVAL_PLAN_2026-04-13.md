# Storyboarder Revival Plan (2026-04-13)

## 1) Project Reality Check (as of 2026-04-13)

### Upstream (`wonderunit/storyboarder`)
- Last upstream commit on `master`: **June 30, 2022** (`8b81a25`, "show audio duration in msecs on audio control").
- Open PRs: **25**.
- Closed PRs: **495**.
- Open issues shown in UI as: **1k+**.
- Oldest still-open issues date back to **March-April 2017** (for example #138 opened Mar 31, 2017, #160 opened Apr 19, 2017).
- New issues are still being filed in **2026** (for example #2656 opened Apr 7, 2026; #2655 opened Mar 23, 2026).

### Repair fork (`qian2501/storyboarder`)
- Fork has **8,085 commits** total.
- Commit history shows a fork-specific patch series in **Aug 2021**, then merge sync with upstream on **Sep 18, 2024** (`49ec5fb`).
- Public fork metadata currently shows: **1 open issue**, **0 open PRs**, **8 stars**, **1 fork**.
- Local compare against upstream: `qian2501/master` is **29 commits ahead** of `wonderunit/master`.

## 2) What the Research PDF Adds

The PDF is directionally correct and still useful. The strongest recommendations that align with current issue traffic are:
- Fix FFmpeg export pathing first.
- Fix Shot Generator persistence issues.
- Fix autosave/data-loss risk using atomic writes.
- Add CI and make the project contributor-friendly again.
- Treat modernization (Electron/Node upgrades) as staged work, not day-1 work.

Important delta vs live data:
- The paper cites **24 open PRs**. Current live state is **25 open PRs**.

## 3) Unresolved Problem Clusters (Live)

### A) Export pipeline regressions (highest user pain)
Representative open issues:
- #1316, #2532, #2575, #2584, #2606, #2607, #2626, #2636, #2637, #2642, #2653
Common signal:
- FFmpeg path/packaging failures (`ENOENT`, spawn failures, type errors in export path).

### B) Data integrity / trust failures
Representative open issues:
- #2652 Autosave failure
- #2645 Shots erased after playing
- #2594 Previously saved canvas appears blank
Common signal:
- Users report permanent data loss or disappearing boards.

### C) Shot Generator persistence and platform-specific breakage
Representative open issues:
- #2644 Models disappearing after reopen
- #2394 Morph model disappears
- #2593 unsupported `darwin-arm64`
- #2550 save-to-board visibility failures
Common signal:
- Scene object persistence/rendering failures and architecture support gaps.

### D) Script/path sanitization and cross-platform filesystem edge cases
Representative open issues:
- #2602 hashtag scene-heading navigation break
- #2623 trailing-dot folder path issue on Windows
Common signal:
- Unsafe or inconsistent filename normalization between Fountain metadata and filesystem folders.

### E) Linux runtime stability
Representative open issues:
- #2463, #2615 AppImage launch/compositor failures

## 4) Assessment of `qian2501` Changes

### Likely useful to cherry-pick/re-implement
- Duration type handling and timeline math fixes (commits referencing issue #2275).
- Print/PDF workflow improvements (`pdf table dev` series, print window cleanup).
- Some locale/i18n and font fixes (if license/compliance is clean).

### Needs careful review before adoption
- Build identity and packaging changes in `package.json` (`appId`, repository/author fields, signing/notarization behavior).
- Keymap defaults changed in ways that may be breaking for existing users.
- UI removals/simplifications (line mileage, Shot Generator panel changes) may conflict with user expectations.
- Removal of `build/license_en.txt` introduces legal/distribution questions.

### Not addressed by the fork diff
- The dominant export `ENOENT` issue family is not clearly fixed.
- Autosave/data-loss hardening is not clearly addressed.
- Shot Generator persistence failures remain active in upstream issue reports.

## 5) Execution Plan (90 days)

## Phase 0 (Week 0-1): Foundation and governance
- Create a maintained community fork namespace/org and declare maintainers.
- Publish CONTRIBUTING + issue triage labels + support policy.
- Clarify licensing posture for redistribution and contributor terms.
- Add project board with 4 buckets: Reliability, Compatibility, Build/Release, Feature PR Review.

## Phase 1 (Week 1-2): Build confidence with CI and reproducibility
- Add GitHub Actions matrix (Windows, macOS, Linux) for install/build/smoke test.
- Add smoke tests for: app launch, open sample project, export pipeline invocation, save/reload round-trip.
- Freeze toolchain baseline (Node/Electron-compatible versions) in docs and CI.

## Phase 2 (Week 2-4): Reliability sprint (P0 bugs)
- P0-1: Export pathing fix for FFmpeg lookup across packed/unpacked resources.
- P0-2: Atomic save writes (`tmp` + rename) and autosave lock/queue.
- P0-3: Filename sanitization for scene folders and script imports.
- P0-4: Guard rails for Shot Generator save-to-board persistence.

Definition of done for Phase 2:
- Repro steps from #2642 and #2652 pass on CI runners and local Windows/macOS.
- Add regression tests covering failing cases.

## Phase 3 (Week 4-8): Platform compatibility
- Apple Silicon compatibility pass (native where feasible, fallback behavior documented).
- Linux AppImage launch diagnostics and flags; reduce crash-on-launch reports.
- Validate Windows 10/11 input path reliability (tablet + mouse).

## Phase 4 (Week 8-12): PR debt reduction and modernization prep
- Triage all open PRs by risk/value and merge low-risk items first:
  - Translations (#2521, #2586)
  - Documentation/typo/build hygiene where safe
- Selectively port vetted `qian2501` fixes via small PRs with tests.
- Publish Electron upgrade RFC (impact map, deprecated API inventory, migration order).

## 6) First 10 Tickets to Open Immediately

1. Export `ENOENT` root-cause harness (fixture + failing integration test).
2. Cross-platform FFmpeg path resolver utility with packed/unpacked support.
3. Atomic `.storyboarder` writer + crash-safe autosave queue.
4. Scene/slug sanitization library for filesystem-safe paths.
5. Repro harness for "models disappear after reopen" Shot Generator bug.
6. Regression test for board content disappearing after playback.
7. CI workflow: build + smoke test + artifact upload.
8. PR triage rubric and bot labels (`needs-rebase`, `needs-tests`, `safe-to-merge`).
9. Cherry-pick candidate review: qian duration/timeline series.
10. Cherry-pick candidate review: qian print/PDF enhancements.

## 7) Suggested Merge Strategy for Existing Open PRs

- Wave 1 (low risk): translations and docs.
- Wave 2 (medium risk): build cleanup with CI green requirement.
- Wave 3 (high risk): major feature PRs (aspect ratio change, grid view, keyframes) only after reliability baseline is stable.

## 8) Practical Recommendation

Treat this as a reliability-first rescue, not a feature sprint. The fastest way to rebuild trust is:
1) restore export, 2) prevent data loss, 3) stabilize Shot Generator persistence, 4) make CI visible and green.

---

## Sources
- https://github.com/wonderunit/storyboarder
- https://github.com/wonderunit/storyboarder/issues?q=is%3Aissue+state%3Aopen+sort%3Acreated-desc
- https://github.com/wonderunit/storyboarder/issues?q=is%3Aissue+state%3Aopen+sort%3Acreated-asc
- https://github.com/wonderunit/storyboarder/pulls?q=is%3Aopen+sort%3Acreated-asc
- https://github.com/wonderunit/storyboarder/commits/master
- https://github.com/qian2501/storyboarder
- https://github.com/qian2501/storyboarder/commits/master
- Storyboarder by Wonder Unit - A Research Paper.pdf
