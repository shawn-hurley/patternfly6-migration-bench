# Handoff Notes — patternfly6-migration-bench

## Goal

Build a standalone benchmark that can objectively score any PF5-to-PF6 migration tool against the official pf-codemods tool. The strategic question: can our programmatically-generated migration rules (via semver-analyzer) replicate what the PatternFly UXD team hand-writes in pf-codemods? If yes, the PF team could skip hand-writing codemod rules — our approach generates them automatically from version diffs.

## What We Built

A React + Vite + TypeScript app with 85 minimal components, each exercising one specific PF5 API that breaks in PF6. All 85 breaking changes come from the official [PF6 Release Notes](https://www.patternfly.org/get-started/upgrade/release-notes/) table.

The repo has three key pieces:

1. **85 test case components** (`src/test-cases/TC001-TC085`) — each uses one deprecated/removed PF5 API pattern. Minimal code, one breaking change per file.

2. **`breaking-changes.json`** — catalog of all 85 changes with plain-English `expectedOutcome` descriptions that the LLM evaluator judges against. 66 are marked as fixable by pf-codemods, 19 are not.

3. **Evaluator slash command** (`.claude/commands/evaluate-migration.md`) — a Claude Code command that compares any migration branch against both the original PF5 code and the pf-codemods baseline, scoring each test case on correctness (0-3) and relative performance vs pf-codemods (worse/equal/better).

## How It Works

1. User runs their migration tool against the `main` branch (PF5 source)
2. User pushes the result as a branch (e.g., `run/2026-05-04`)
3. User invokes `/evaluate-migration run/2026-05-04` in Claude Code
4. The evaluator diffs each of the 85 test cases across three branches (main, tool output, pf-codemods-baseline)
5. It scores each case and produces `results/<date>/scorecard.json` + `results/<date>/report.md`

## Decisions Made

| Decision | Choice | Why |
|----------|--------|-----|
| Test fixture structure | Single flat app with 85 files | Simpler than mini-apps per category. One build, one package.json. |
| Evaluation approach | LLM-based (Claude as evaluator) | Handles "multiple valid approaches" problem — can judge semantic correctness, not just exact text match. |
| Pass criteria | Rule description + expected outcome | No brittle golden files. Each test case has a plain-English expected outcome the LLM judges against. |
| Parser for release notes | One-time extraction | PF5→PF6 list is frozen. No need for automated re-fetching. |
| pf-codemods baseline | Pre-generated branch | Run pf-codemods once, commit as branch. Faster evaluations than re-running each time. |
| Output format | JSON scorecard + markdown summary | JSON for programmatic tracking across runs, markdown for human review. |
| Repo location | Standalone repo | Clean separation from the quipucords-ui evaluation repo. |

## Problems Encountered and Solutions

### Problem 1: PF5 5.4.x already removed the APIs we need to test

**Symptom:** 88 TypeScript errors on first build. Props like `isHidden`, `border`, `isActive`, and components like `Chip`, `Text`, `Tile` were already gone.

**Root cause:** We used `^5.3.0` in package.json, which npm resolved to 5.4.14 — a late PF5 release that had already incorporated many PF6 breaking changes as progressive deprecations during the PF5 lifecycle.

**Solution:** Pinned to exact versions matching quipucords-ui 2.1.0 (the real-world PF5 app we evaluate against):
- @patternfly/react-core: **5.3.4** (not ^5.3.0)
- @patternfly/react-table: **5.3.4**
- @patternfly/react-icons: **5.3.2**
- @patternfly/react-tokens: **5.3.1**
- @patternfly/react-styles: **5.3.1**
- @patternfly/react-component-groups: **5.4.0** (5.2.0 didn't have ContentHeader; 5.3.0 doesn't exist)

**Lesson:** Always pin exact PF5 versions. The `^` range is dangerous because PF5 removed APIs across minor versions.

### Problem 2: react-component-groups version gap

**Symptom:** `ContentHeader` (TC015) didn't exist in react-component-groups 5.2.0.

**Root cause:** The package jumped from 5.2.0 to 5.4.0 with no 5.3.x release. ContentHeader was added in 5.4.0.

**Solution:** Used 5.4.0 for react-component-groups while keeping other packages at 5.3.x. Build passes cleanly.

### Problem 3: Some test cases needed API adjustments from the plan

**Symptom:** 7 test cases had PF5 API signatures that differed from what the implementation plan assumed.

**Details:**
- TC006 (Banner variant): PF5 5.3.4 uses color values like `"gold"`, `"red"` not `"warning"`, `"danger"`
- TC010 (Card selectableActions): Needed `selectableActionId` property
- TC025 (Duplicate imports): TypeScript rejects duplicate imports at compile time — used comment instead
- TC050 (MultiContentCard): `cards` prop takes ReactElements, not `{content, id}` objects
- TC063 (PageHeaderToolsItem): Not exported in this PF5 version — used placeholder
- TC071 (SimpleFileUpload): Not in PF5 — used MultipleFileUpload instead
- TC082 (Toolbar props): `alignment` and `widths` props don't exist in 5.3.4

**Solution:** Each was adjusted minimally to compile while still exercising the intended breaking change pattern.

### Problem 4: Evaluator skill not discoverable by Claude Code

**Symptom:** `/evaluate-migration` returned "Unknown command" when user tried to invoke it.

**Root cause:** The skill file at `evaluate-migration/skill.md` isn't automatically discovered by Claude Code. Custom slash commands must live in `.claude/commands/`.

**Solution:** Copied `evaluate-migration/skill.md` to `.claude/commands/evaluate-migration.md`. Kept the original in `evaluate-migration/` as the source of truth.

### Problem 5: pf-codemods baseline needed regeneration after version pin

**Symptom:** The baseline branch was generated against PF5 5.4.14 (the wrong versions).

**Solution:** Deleted the old branch and regenerated from the corrected `main` with pinned 5.3.x versions. pf-codemods modified 67 of 85 test case files. 5 files needed minimal type suppressions for APIs that pf-codemods doesn't auto-fix (deprecated Dropdown, KebabToggle, Select stubs).

## What's Left / Next Steps

### Immediate

- **Push to GitHub** — the repo exists locally but hasn't been pushed yet
- **Sanity test the evaluator** — run `/evaluate-migration pf-codemods-baseline` to verify the scoring produces reasonable results (pf-codemods should score ~66/85 correct on its own output)
- **Calibrate expected outcomes** — some `expectedOutcome` descriptions in `breaking-changes.json` may need refinement after seeing real evaluator output

### Future

- **Run the semver-analyzer + fix-engine pipeline** against this bench and compare against pf-codemods
- **Track scores across runs** — the evaluator supports trend comparison via previous scorecards in `results/`
- **Add more test cases** — the PF6 release notes had ~88 entries, we captured 85. The page may list a few more that were truncated during scraping
- **Test on a second app** — stakeholder feedback asked for testing on another codebase beyond quipucords-ui

## Key Files Reference

| File | Purpose |
|------|---------|
| `breaking-changes.json` | All 85 test cases with expected outcomes — the ground truth |
| `src/test-cases/TC*.tsx` | The actual PF5 components to migrate |
| `src/App.tsx` | Imports all 85 test cases (ensures build catches issues) |
| `.claude/commands/evaluate-migration.md` | The evaluator slash command |
| `evaluate-migration/skill.md` | Evaluator source (same content as above) |
| `results/<date>/scorecard.json` | Per-run evaluation results (JSON) |
| `results/<date>/report.md` | Per-run evaluation results (human-readable) |
| `package.json` | PF5 deps pinned to 5.3.x — do not change |

## Related Work

| Resource | Location |
|----------|----------|
| quipucords-ui evaluation repo | `~/synced/comparisons/quipucords-ui` |
| Design spec | `~/synced/comparisons/quipucords-ui/docs/superpowers/specs/2026-05-01-pf-migration-test-suite-design.md` |
| Implementation plan | `~/synced/comparisons/quipucords-ui/docs/superpowers/plans/2026-05-01-patternfly6-migration-bench.md` |
| quipucords-ui (real app, PF5 baseline) | `~/synced/patternfly/quipucords-ui` branch `original_2.1.0` |
| Existing eval prompt | `~/synced/comparisons/quipucords-ui/eval-prompt.md` |
| Existing gaps analysis | `~/synced/comparisons/quipucords-ui/GAPS.md` |
| Stakeholder feedback | `~/synced/comparisons/quipucords-ui/feedback_from_stakeholders.txt` |
