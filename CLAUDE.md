# PatternFly 6 Migration Benchmark

## What This Repo Is

A standalone benchmark for evaluating PF5-to-PF6 migration tools. It contains 85 minimal React components, each exercising one specific PatternFly 5 API that breaks in PatternFly 6. These are derived from the official [PF6 Release Notes](https://www.patternfly.org/get-started/upgrade/release-notes/) breaking changes table.

The benchmark answers: **does a given migration tool match or exceed what pf-codemods provides?**

## Repo Structure

```
patternfly6-migration-bench/
├── breaking-changes.json              # Catalog of all 85 PF6 breaking changes with expected outcomes
├── src/
│   ├── App.tsx                        # Imports and renders all 85 test case components
│   └── test-cases/
│       ├── TC001-accordion-content-isHidden.tsx
│       ├── ...                        # 85 files, one per breaking change
│       └── TC085-toolbar-spacer-removed.tsx
├── evaluate-migration/
│   └── skill.md                       # Evaluator skill source
├── .claude/commands/
│   └── evaluate-migration.md          # Claude Code slash command (copy of skill.md)
├── results/                           # Evaluation output (per-run subdirectories)
├── package.json                       # PF5 5.3.x dependencies (pinned)
├── vite.config.ts
└── tsconfig.json
```

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | PF5 source code. All 85 test cases built against @patternfly/react-core@5.3.4. This is the "before" state. |
| `pf-codemods-baseline` | Result of running `npx @patternfly/pf-codemods@latest ./ --v6 --fix` against `main`, then updating deps to PF6. This is the minimum bar — what the official tool fixes automatically. |
| `run/<date-or-label>` | Convention for per-run branches. Push your migration tool's output here for evaluation. |

## PF5 Dependency Versions

Dependencies are pinned to exact versions matching quipucords-ui 2.1.0 (the last PF5 release of that project):

- @patternfly/react-core: 5.3.4
- @patternfly/react-table: 5.3.4
- @patternfly/react-icons: 5.3.2
- @patternfly/react-tokens: 5.3.1
- @patternfly/react-component-groups: 5.4.0
- @patternfly/react-styles: 5.3.1

Do NOT use `^` ranges or upgrade these — later 5.4.x versions already removed many of the APIs we need to test.

## How to Evaluate a Migration Tool

1. Clone this repo and checkout `main`
2. Run your migration tool against the source code
3. Push the result as a branch: `git checkout -b run/my-tool-2026-05-04 && git add -A && git commit -m "Migration output"`
4. Open a Claude Code session in this repo
5. Run: `/evaluate-migration run/my-tool-2026-05-04`
6. Results are written to `results/<date>/scorecard.json` and `results/<date>/report.md`

## breaking-changes.json Schema

Each of the 85 entries has:

```json
{
  "id": "TC001",
  "component": "Accordion content",
  "repo": "React",
  "description": "The isHidden prop has been removed from AccordionContent...",
  "prLink": "https://github.com/patternfly/patternfly-react/pull/9876",
  "fixedWithCodemods": true,
  "testFile": "src/test-cases/TC001-accordion-content-isHidden.tsx",
  "expectedOutcome": "Remove the isHidden prop from AccordionContent..."
}
```

- **fixedWithCodemods**: Whether pf-codemods auto-fixes this. 66 of 85 are true.
- **expectedOutcome**: Plain-English description of correct PF6 migration. This is what the LLM evaluator judges against.

## Scoring Rubric

**Correctness (0-3):**
- 0 = Wrong/harmful change
- 1 = Partially correct
- 2 = Correct but non-idiomatic (e.g., uses deprecated shim)
- 3 = Fully correct

**vs-codemods:**
- worse = pf-codemods handles it better
- equal = equivalent result
- better = tool output exceeds pf-codemods
- n/a = pf-codemods doesn't fix this (fixedWithCodemods: false)

## Test Case Conventions

- Each file is named `TC<NNN>-<component>-<change>.tsx`
- Each exports a single React component named `TC<NNN>_<PascalName>`
- Components use the PF5 API that will break in PF6
- Minimal code — just enough to exercise the breaking change
- CSS test cases have companion `.css` files (TC072, TC078, TC081)

## Regenerating the pf-codemods Baseline

If test cases change on `main`, regenerate the baseline:

```bash
git checkout -b pf-codemods-baseline main
npx @patternfly/pf-codemods@latest ./ --v6 --fix
# Update package.json: all @patternfly deps to ^6.0.0
npm install
npm run build  # Fix any type errors minimally
git add -A && git commit -m "Regenerate pf-codemods baseline"
git checkout main
```

## Related Projects

- **Evaluation repo**: `~/synced/comparisons/quipucords-ui` — evaluates migration tool runs against real-world quipucords-ui codebase
- **Design spec**: `~/synced/comparisons/quipucords-ui/docs/superpowers/specs/2026-05-01-pf-migration-test-suite-design.md`
- **Implementation plan**: `~/synced/comparisons/quipucords-ui/docs/superpowers/plans/2026-05-01-patternfly6-migration-bench.md`
- **pf-codemods**: https://github.com/patternfly/pf-codemods — the official PF migration tool we benchmark against
- **Migration tooling under evaluation**:
  - https://github.com/shawn-hurley/semver-analyzer — generates migration rules from PF5/PF6 API diffs
  - https://github.com/shawn-hurley/fix-engine — applies fixes using AI agent
