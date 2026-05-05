# patternfly6-migration-bench

A benchmark suite for evaluating PatternFly 5-to-6 migration tools.

## Overview

This repo contains **85 minimal React components**, each exercising one specific PF5 API that breaks in PF6. These come from the official [PatternFly 6 Release Notes](https://www.patternfly.org/get-started/upgrade/release-notes/) breaking changes table.

The purpose is to measure how well a migration tool handles each individual breaking change, and compare its output against [pf-codemods](https://github.com/patternfly/pf-codemods) — the official PatternFly migration tool.

## Quick Start

### Prerequisites

- Node.js 18+
- [Claude Code](https://claude.ai/claude-code) (for the evaluator)

### Setup

```bash
git clone <this-repo>
cd patternfly6-migration-bench
npm install
npm run build  # Verify: should build cleanly against PF5
```

### Evaluate a Migration Tool

1. **Run your migration tool** against this repo's source code (on the `main` branch)

2. **Push the result as a branch:**
   ```bash
   git checkout -b run/my-tool-2026-05-04
   git add -A
   git commit -m "Migration output from my-tool"
   ```

3. **Score it** (requires Claude Code):
   ```bash
   claude
   # Then in the Claude Code session:
   /evaluate-migration run/my-tool-2026-05-04
   ```

4. **Review results** in `results/<date>/scorecard.json` and `results/<date>/report.md`

## What's in the Box

### Test Cases (`src/test-cases/`)

85 `.tsx` files, one per PF6 breaking change. Each is a minimal React component that uses the PF5 API pattern that needs migration. Examples:

| Test Case | What It Tests |
|-----------|--------------|
| TC001 | `isHidden` prop removed from AccordionContent |
| TC007 | Button icons must move to `icon` prop |
| TC027 | EmptyState header/icon now rendered internally |
| TC048 | Modal deprecated, moved to deprecated package |
| TC057 | Page `header` prop renamed to `masthead` |
| TC077 | Text/TextContent replaced with Content |

### Catalog (`breaking-changes.json`)

JSON file with all 85 breaking changes. Each entry has a plain-English `expectedOutcome` describing what correct migration looks like. The evaluator uses this as ground truth.

- **66 of 85** are marked `fixedWithCodemods: true` (pf-codemods handles them)
- **19 of 85** are markup-only or behavioral changes that no automated tool fixes

### Branches

| Branch | What It Represents |
|--------|-------------------|
| `main` | PF5 source code (the "before" state) |
| `pf-codemods-baseline` | What the official pf-codemods tool auto-fixes |
| `run/*` | Your migration tool outputs (convention) |

### Evaluator (`.claude/commands/evaluate-migration.md`)

A Claude Code slash command that:
1. Reads each test case from `main`, your tool's branch, and the pf-codemods baseline
2. Scores correctness (0-3) using the `expectedOutcome` descriptions
3. Compares against pf-codemods (worse / equal / better)
4. Produces a JSON scorecard and markdown report
5. Tracks trends across runs
6. Automatically runs rule analysis (see below) if semver data is present

### Rule Analyzer (`.claude/commands/analyze-rules.md`)

A Claude Code slash command that performs root cause analysis on **why** a migration tool succeeded or failed on each test case. It cross-references the evaluation scorecard with the semver rules and fix-guidance that drove the migration, classifying each result into a root cause category.

This is essential for diagnosing whether failures stem from wrong rules, missing rules, incomplete correlations between rules, or tool behavior issues.

See [Rule Analysis](#rule-analysis) below for full usage details.

## PF5 Versions

Dependencies are pinned to exact PF5 5.3.x versions (matching quipucords-ui 2.1.0). Do not upgrade — later 5.4.x versions already removed many of the APIs under test.

| Package | Version |
|---------|---------|
| @patternfly/react-core | 5.3.4 |
| @patternfly/react-table | 5.3.4 |
| @patternfly/react-icons | 5.3.2 |
| @patternfly/react-tokens | 5.3.1 |
| @patternfly/react-component-groups | 5.4.0 |
| @patternfly/react-styles | 5.3.1 |

## Scoring

Each test case gets two scores:

**Correctness (0-3)**
- 0 = Wrong/harmful change
- 1 = Partially correct
- 2 = Correct but non-idiomatic
- 3 = Fully correct

**vs pf-codemods**
- `worse` — pf-codemods does better
- `equal` — equivalent result
- `better` — your tool does better
- `n/a` — pf-codemods doesn't fix this

## Baseline Result: pf-codemods

The pf-codemods baseline was established by running the evaluator against the `pf-codemods-baseline` branch — essentially scoring pf-codemods against itself. This tells us what the official tool actually achieves on this benchmark.

```
Overall: 66/85 fully correct (77.6%)

┌─────────────────────────┬───────┬───────┐
│          Score          │ Count │   %   │
├─────────────────────────┼───────┼───────┤
│ Fully correct (3)       │    66 │ 77.6% │
│ Partially correct (1-2) │    10 │ 11.8% │
│ Wrong/missing (0)       │     9 │ 10.6% │
└─────────────────────────┴───────┴───────┘
```

### How to interpret this

- **66/85 is the bar to match.** A migration tool that scores 66+ on this benchmark is at parity with the official PatternFly migration tool.
- **The 10 partial scores (1-2)** are cases where pf-codemods does part of the job but not all of it — e.g., removing a deprecated prop but not adding its replacement, or leaving `data-codemods` marker attributes behind.
- **The 9 zeros** fall into three categories:
  - **CSS variable migrations** (TC072, TC078, TC081) — pf-codemods doesn't touch `--pf-v5-*` CSS variables at all. A tool that handles these has immediate unique value.
  - **Test case design issues** (TC025, TC063) — these test cases can't properly exercise their breaking changes due to TypeScript compilation constraints. They should be redesigned.
  - **Baseline generation artifacts** (TC017, TC036, TC070) — deprecated components were manually stubbed during baseline creation. These scores reflect our workarounds, not pf-codemods behavior.
- **Anything above 66 means your tool beats pf-codemods.** The scorecard's `vsCodemods` field shows exactly which test cases your tool handles better.

### Where a tool can exceed pf-codemods

The biggest opportunities for unique value:
1. **CSS token/variable migration** — pf-codemods has no CSS migration logic at all (3 test cases)
2. **"Next" API promotions** — pf-codemods incorrectly moves next-generation APIs to `/deprecated` instead of promoting them (TC024, TC049)
3. **Deprecated component replacement** — migrating old Dropdown/Select to modern MenuToggle/Menu patterns (TC017, TC036)
4. **Complete prop transforms** — cases where pf-codemods removes a prop but doesn't add its replacement (TC009, TC053, TC066)

## Rule Analysis

After running `/evaluate-migration`, you can analyze the semver rules and fix-guidance that drove the migration to understand **why** the tool succeeded or failed on each test case. This requires copying the semver data from your migration tool run into the results directory.

### What You Need

The rule analyzer expects semver data in a `semver/` subdirectory within the evaluation results:

```
results/<date>-<branch>/
├── scorecard.json              # ← produced by /evaluate-migration
├── report.md                   # ← produced by /evaluate-migration
└── semver/                     # ← you copy this in
    ├── semver_report.json      # Optional — Kantra analysis report
    ├── semver_rules/
    │   ├── ruleset.yaml        # Ruleset metadata
    │   ├── breaking-changes-api.yaml
    │   ├── breaking-changes-composition.yaml
    │   ├── breaking-changes-css.yaml
    │   └── breaking-changes-deps.yaml
    └── fix-guidance/
        ├── fix-guidance.yaml   # Per-rule fix descriptions
        └── fix-strategies.json # Strategy type + before/after per rule
```

### Where the Semver Data Comes From

The semver data is produced by the [semver-analyzer](https://github.com/shawn-hurley/semver-analyzer) and the fix-engine pipeline:

- **semver_rules/** — Kantra-style YAML rules generated by analyzing the API diff between PF5 and PF6. Each rule has a `ruleID`, pattern-matching conditions (`when.frontend.referenced`), and a description of the breaking change.
- **fix-guidance/fix-guidance.yaml** — Detailed fix descriptions per rule, with strategy, confidence, and before/after code snippets.
- **fix-guidance/fix-strategies.json** — Machine-readable strategy entries keyed by ruleID. Each entry specifies a strategy type (Rename, RemoveProp, PropValueChange, FamilyMigration, ChildToProp, CssVariablePrefix, LlmAssisted, etc.) with the relevant from/to values.

### Copying the Data

After running your migration tool, copy its semver artifacts into the results directory:

```bash
# After /evaluate-migration has created the results directory:
RESULTS_DIR=results/2026-05-05-my-tool-branch

# Copy from wherever your pipeline stores them:
cp -r /path/to/your/semver-output/semver_rules $RESULTS_DIR/semver/semver_rules
cp -r /path/to/your/semver-output/fix-guidance $RESULTS_DIR/semver/fix-guidance

# Optional: copy the Kantra report
cp /path/to/your/semver-output/semver_report.json $RESULTS_DIR/semver/
```

### Running the Analysis

The analyzer can be invoked in two ways:

**Automatically** — `/evaluate-migration` runs it as Step 9 if it detects a `semver/` directory in the results.

**Independently** — useful for re-analyzing after the evaluation is done:
```
/analyze-rules results/2026-05-05-my-tool-branch
```

If no argument is given, it uses the most recent results directory.

### What It Produces

The analyzer writes `rule-analysis.md` to the results directory with:

1. **Summary by root cause** — how many test cases fall into each category
2. **Wrong guidance** — rules that actively cause incorrect output (highest priority)
3. **Missing rules** — breaking changes with no rule coverage
4. **Incomplete correlations** — related rules that aren't connected (e.g., RemoveProp for old + PropTypeChange for new, but no link between them)
5. **Strategy gaps** — changes the strategy vocabulary can't express
6. **Rule quality issues** — rules too vague for the LLM to act on
7. **Tool behavior issues** — correct rules the tool didn't follow
8. **Validated rules** — confirmation of what's working
9. **Actionable summary** — prioritized list of specific ruleIDs to fix

### Root Cause Categories

| Category | Meaning |
|----------|---------|
| `correct` | Rule and tool both work |
| `missing_rule` | No rule or fix-strategy exists for this change |
| `wrong_guidance` | Rule maps to an incorrect fix (wrong target prop, wrong value) |
| `incomplete_correlation` | Related rules exist but aren't connected |
| `strategy_gap` | Strategy type can't express the needed fix |
| `rule_quality` | Rule is too vague/generic for the LLM to act on |
| `tool_behavior` | Rule is correct but tool didn't follow it |

### Example Output

From a real analysis run:

```
Root cause distribution:
  correct:                51 (60%)
  incomplete_correlation: 13 (15%)
  wrong_guidance:          6 (7%)
  missing_rule:            5 (6%)
  tool_behavior:           3 (4%)
  strategy_gap:            3 (4%)
  rule_quality:            2 (2%)

Top priority: Fix 4 wrong fix-strategies.json entries (affects 8 test cases)
  - PageSection variant light→secondary should be light→default
  - Label isOverflowLabel→isClickable should be →variant='overflow'
  - Toolbar usePageInsets→hasNoPadding should be RemoveProp
  - Toolbar spacer→gap should be RemoveProp
```

## License

See [LICENSE](LICENSE).
