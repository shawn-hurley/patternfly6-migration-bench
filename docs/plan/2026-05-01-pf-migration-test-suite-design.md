# PatternFly Migration Test Suite — Design Spec

## Purpose

Build a standalone test suite that evaluates any PF5-to-PF6 migration tool's effectiveness against all 88 breaking changes documented in the [PatternFly 6 Release Notes](https://www.patternfly.org/get-started/upgrade/release-notes/). The suite enables side-by-side comparison of our migration tooling (semver-analyzer + kantra + fix-engine) against pf-codemods, answering: "do we match or exceed the official tool?"

## Architecture

### Repository

A new standalone repo (`patternfly6-migration-bench`) containing:

```
patternfly6-migration-bench/
├── breaking-changes.json              # All 88 breaking changes from PF6 release notes
├── package.json                       # PF5 dependencies (@patternfly/react-core@5.x, etc.)
├── tsconfig.json
├── src/
│   ├── App.tsx                        # Imports and renders all 88 test case components
│   ├── index.tsx
│   └── test-cases/
│       ├── TC001-accordion-content-isHidden.tsx
│       ├── TC002-accordion-item-markup.tsx
│       ├── TC003-accordion-toggle-isExpanded.tsx
│       ├── ...
│       └── TC088-toolbar-spacer-removed.tsx
├── evaluate-migration/                # Claude Code skill for evaluation
│   ├── skill.md                       # Skill definition
│   └── templates/
│       └── eval-prompt.md             # Per-test-case evaluation prompt template
└── results/                           # Timestamped evaluation outputs
    └── <date>/
        ├── scorecard.json
        └── report.md
```

### Branch Strategy

Three key branches in the test suite repo:

| Branch | Purpose |
|--------|---------|
| `main` | PF5 source code — the "before" state. Contains all 88 test cases built against PF5 APIs. |
| `pf-codemods-baseline` | Result of running `npx @patternfly/pf-codemods@latest ./ --v6 --fix` against `main`. Pre-generated, committed as a branch. Represents the official tool's output. |
| `run/<date-or-label>` | Per-run branches pushed by the user after running their migration pipeline externally. |

### Evaluation Flow

1. User runs their migration pipeline externally against the `main` branch of this repo
2. User pushes the migrated code as a branch (e.g., `run/2026-05-02`)
3. User invokes the evaluator skill: `/evaluate-migration run/2026-05-02`
4. The skill iterates through all 88 test cases:
   - Reads original PF5 code from `main`
   - Reads tool output from the specified branch
   - Reads pf-codemods output from `pf-codemods-baseline`
   - Evaluates correctness against the expected outcome in `breaking-changes.json`
5. Dispatches parallel subagents for batch evaluation (speed)
6. Aggregates into `results/<date>/scorecard.json` + `results/<date>/report.md`
7. Compares against previous runs to report trends

## Data Model

### breaking-changes.json

Each entry represents one breaking change from the PF6 release notes:

```json
{
  "id": "TC001",
  "component": "Accordion content",
  "repo": "React",
  "description": "The isHidden prop removed; visibility now automatic based on isExpanded",
  "prLink": "https://github.com/patternfly/patternfly-react/pull/9876",
  "fixedWithCodemods": true,
  "testFile": "src/test-cases/TC001-accordion-content-isHidden.tsx",
  "expectedOutcome": "The isHidden prop should be removed from AccordionContent. No replacement prop is needed — visibility is now controlled automatically by the parent AccordionItem's isExpanded prop."
}
```

Fields:
- **id**: Test case identifier (TC001-TC088)
- **component**: Component or feature name from the release notes
- **repo**: "React" or "React-component-groups"
- **description**: The breaking change description from the release notes
- **prLink**: Link to the PF PR that introduced the change
- **fixedWithCodemods**: Whether pf-codemods can auto-fix this (from the release notes)
- **testFile**: Path to the test case source file
- **expectedOutcome**: Plain-English description of what correct PF6 migration looks like for this specific test case. This is the ground truth the LLM evaluator judges against.

### Test Case Files

Each test case is a minimal, self-contained React component that exercises exactly one PF5 breaking change:

```tsx
// TC001-accordion-content-isHidden.tsx
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
} from "@patternfly/react-core";

export const TC001_AccordionContentIsHidden: React.FC = () => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <Accordion>
      <AccordionItem>
        <AccordionToggle
          onClick={() => setExpanded(!expanded)}
          isExpanded={expanded}
          id="toggle-1"
        >
          Toggle
        </AccordionToggle>
        <AccordionContent isHidden={!expanded}>
          Content here
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
```

Principles:
- Imports only what's needed from PF5
- Uses the deprecated/changed API in a realistic way
- Minimal surrounding code — just enough to be syntactically valid and buildable
- Component is exported and imported by `App.tsx` (ensures build catches type errors)
- Some breaking changes may need multiple uses of the pattern to test edge cases (conditional usage, spread props)

For non-React breaking changes (CSS tokens, design tokens):
- CSS test cases get paired `.css` files with a component that uses the classes
- Token test cases use PF5 token values inline

### Scorecard JSON

```json
{
  "runDate": "2026-05-02",
  "toolBranch": "run/2026-05-02",
  "baselineBranch": "pf-codemods-baseline",
  "summary": {
    "total": 88,
    "correct": 52,
    "partial": 18,
    "wrong": 5,
    "unchanged": 13,
    "betterThanCodemods": 8,
    "equalToCodemods": 45,
    "worseThanCodemods": 12,
    "codemodsFixableTotal": 63,
    "codemodsFixableMatched": 45
  },
  "testCases": [
    {
      "id": "TC001",
      "component": "Accordion content",
      "fixedWithCodemods": true,
      "correctness": 3,
      "vsCodemods": "equal",
      "issues": [],
      "notes": "isHidden prop correctly removed"
    }
  ]
}
```

Correctness scale:
- **0** — Wrong/harmful change (introduces bugs or regressions)
- **1** — Partially correct (addresses part of the change but misses key aspects)
- **2** — Correct but non-idiomatic (works but not the recommended PF6 pattern)
- **3** — Fully correct (matches or exceeds the expected PF6 migration)

vs-codemods comparison:
- **worse** — pf-codemods handles this better
- **equal** — both produce equivalent results
- **better** — our tool produces a better result than pf-codemods
- **n/a** — pf-codemods doesn't fix this (fixedWithCodemods: false)

## Evaluator Skill

### Skill Definition

The `evaluate-migration` skill is a Claude Code skill that:

1. Takes arguments: `<tool-branch>` (required), `--baseline <branch>` (optional, defaults to `pf-codemods-baseline`)
2. Reads `breaking-changes.json` from the repo root
3. For each test case:
   - Uses `git show main:<testFile>` to get original PF5 code
   - Uses `git show <tool-branch>:<testFile>` to get tool output
   - Uses `git show <baseline>:<testFile>` to get pf-codemods output
   - Evaluates correctness against `expectedOutcome`
   - Compares tool output vs pf-codemods output
4. Dispatches parallel subagents in batches of ~10 test cases for speed
5. Aggregates per-case scores into `results/<date>/scorecard.json`
6. Generates `results/<date>/report.md` with:
   - Overall pass rate and score distribution
   - Breakdown by correctness level
   - Cases where tool beats pf-codemods (unique value)
   - Cases where tool falls short of pf-codemods (priority fixes)
   - Trend comparison vs previous run if one exists in `results/`
   - Regressions flagged (any test case that dropped in score)

### Per-Test-Case Evaluation Prompt

The skill feeds each test case to Claude with this context:

```
## Breaking Change
- Component: {{component}}
- Description: {{description}}
- Fixed with codemods: {{fixedWithCodemods}}

## Expected Outcome
{{expectedOutcome}}

## Original PF5 Code
{{originalCode}}

## Tool's Output
{{toolOutput}}

## pf-codemods Output
{{codemodsOutput}}

Evaluate the tool's output against the expected outcome.
Score correctness (0-3) and compare against pf-codemods (worse/equal/better/n/a).
List any issues found. Respond in JSON.
```

## Implementation Phases

### Phase 1: Extract & Structure

Extract all 88 breaking changes from the PF6 release notes into `breaking-changes.json`. This is a one-time extraction with manual updates as needed (the PF5-to-PF6 list is essentially frozen).

Work items:
- Parse the release notes page data (already scraped) into the JSON schema above
- Write the `expectedOutcome` for each entry — plain English describing what correct migration looks like
- Cross-reference against pf-codemods rules in `packages/eslint-plugin-pf-codemods/src/rules/v6/` for accuracy
- Manual review pass for completeness and accuracy

### Phase 2: Build the Test App

Initialize a React + TypeScript app with PF5 dependencies and write all 88 test case files.

Work items:
- `npm create vite` (or similar) with React + TypeScript template
- Install PF5 dependencies: `@patternfly/react-core@5.x`, `@patternfly/react-table@5.x`, `@patternfly/react-icons@5.x`, `@patternfly/react-component-groups@5.x`
- Write 88 test case `.tsx` files, each exercising one breaking change
- Write `App.tsx` importing all test cases
- Verify the app builds cleanly with `npm run build`
- Commit to `main` branch

Grouping for implementation (by component family, ~61 unique components):
- Accordion (3 cases), Avatar (1), Banner (1), Button (2), Card (2)
- Checkbox (1), Chip (2), Color props (1), Content header (1)
- Data list action (1), Deprecated components (1), Drag drop (1)
- Drawer (4), Dual list selector (2), Duplicate imports (1)
- Empty state (2), Error state (1), Form field/group (2)
- Helper text item (2), Invalid object (1), Jump links item (2)
- Kebab toggle (1), Label (1), Log snippet (1), Log viewer (1)
- Login (2), Masthead (3), Menu item action (1), Menu toggle (1)
- Missing page (1), Modal (2), Multi content card (1)
- Nav (3), Not authorized (1), Notification badge (1), Notification drawer header (1)
- Page (8), Pagination (1), Popper (1)
- Simple file upload (1), Slider step (1), Switch (1)
- Tabs (3), Text (1), Th (1), Tile (1), Tokens (2)
- Toolbar (4)

### Phase 3: Generate pf-codemods Baseline

Run the official pf-codemods tool against the test app and capture the output.

Work items:
- Create branch from `main`: `git checkout -b pf-codemods-baseline main`
- Run `npx @patternfly/pf-codemods@latest ./ --v6 --fix`
- Update PF dependencies in `package.json` to v6
- Verify build (may need manual fixes for non-codemod changes)
- Commit result
- Verify actual codemod fixes match the `fixedWithCodemods` flags in `breaking-changes.json`; update JSON if reality differs

### Phase 4: Build the Evaluator Skill

Write the Claude Code skill for evaluation.

Work items:
- Write `evaluate-migration/skill.md` with the skill definition
- Implement the evaluation prompt template
- Implement parallel subagent dispatch for batch evaluation
- Define scorecard JSON schema validation
- Build markdown report generator with trend comparison logic
- Test the skill against `pf-codemods-baseline` branch (sanity check: should score ~60+ correct for codemod-fixable changes)

### Phase 5: First Tool Run & Calibration

Run the migration pipeline against the test app and calibrate the evaluator.

Work items:
- User runs migration pipeline externally against the `main` branch
- User pushes result as `run/<date>` branch
- Run evaluator skill against the branch
- Review scorecard for accuracy — are LLM scores reasonable?
- Adjust `expectedOutcome` descriptions where scoring seems off
- Adjust scoring rubric if needed
- Establish the initial baseline score for the migration tooling

## Success Criteria

1. All 88 test cases build cleanly against PF5 on the `main` branch
2. `breaking-changes.json` has accurate, actionable expected outcomes for all 88 entries
3. The pf-codemods baseline branch exists and correctly reflects what pf-codemods fixes
4. The evaluator skill produces reproducible, reasonable scores
5. Running the evaluator against `pf-codemods-baseline` scores ~60+ of the 63 codemod-fixable cases as correct (3/3)
6. The scorecard clearly shows where our tooling matches, exceeds, or falls short of pf-codemods

## Relationship to Existing Evaluation

This test suite complements but does not replace the existing quipucords-ui evaluation workflow (eval-prompt.md, GAPS.md). The existing evaluation tests against a real-world codebase, while this test suite provides isolated, controlled test cases for each specific breaking change. Together they answer:

- **Test suite**: "Can the tool handle each individual breaking change correctly?"
- **Quipucords eval**: "Does the tool work on a real codebase with realistic code patterns?"

## Open Questions

None — all key decisions resolved during brainstorming.
