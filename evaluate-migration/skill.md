---
name: evaluate-migration
description: Evaluate a PF5-to-PF6 migration tool's output against pf-codemods baseline. Takes a tool branch name as argument. Produces JSON scorecard and markdown report.
---

# Evaluate Migration

You are evaluating a PatternFly 5-to-6 migration tool's output. You have two branches to compare against: the original PF5 code on `main` and the pf-codemods baseline on `pf-codemods-baseline`.

## Arguments

The user passes a branch name as the argument: `/evaluate-migration <tool-branch>`

An optional `--baseline <branch>` flag overrides the pf-codemods baseline branch (default: `pf-codemods-baseline`).

## Process

### Step 1: Read the test case catalog

Read `breaking-changes.json` from the repo root. This contains all 85 test cases with their expected outcomes.

### Step 2: Verify branches exist

```bash
git branch --list <tool-branch>
git branch --list pf-codemods-baseline
```

If either branch is missing, tell the user and stop.

### Step 3: Evaluate each test case

For each entry in `breaking-changes.json`:

1. Get the original PF5 code: `git show main:<testFile>`
2. Get the tool's output: `git show <tool-branch>:<testFile>`
3. Get the pf-codemods output: `git show pf-codemods-baseline:<testFile>`

If a file doesn't exist on a branch (the tool didn't modify it), that's data — it means the tool left it unchanged.

### Step 4: Score each test case

Use parallel subagents in batches of ~10 test cases for speed. For each test case, evaluate:

**Correctness (0-3):**
- **0** — Wrong/harmful: the change introduces bugs, removes functionality, or uses an incorrect PF6 API
- **1** — Partially correct: addresses part of the breaking change but misses key aspects
- **2** — Correct but non-idiomatic: works but uses a deprecated shim or non-recommended pattern
- **3** — Fully correct: matches or exceeds the expected PF6 migration

**If the file is unchanged on the tool branch:**
- If `fixedWithCodemods` is true: score 0 (tool missed something codemods catches)
- If `fixedWithCodemods` is false and expectedOutcome says "no code changes needed": score 3
- If `fixedWithCodemods` is false and code changes ARE needed: score 0

**vs-codemods comparison:**
- **worse** — pf-codemods output is better
- **equal** — both produce equivalent results
- **better** — tool output is better than pf-codemods
- **n/a** — pf-codemods doesn't fix this (`fixedWithCodemods: false`)

### Step 5: Aggregate results

Create the results directory: `mkdir -p results/$(date +%Y-%m-%d)`

Write `results/<date>/scorecard.json`:
```json
{
  "runDate": "<date>",
  "toolBranch": "<tool-branch>",
  "baselineBranch": "pf-codemods-baseline",
  "summary": {
    "total": 85,
    "correct": "<count of score 3>",
    "partial": "<count of score 1-2>",
    "wrong": "<count of score 0>",
    "unchanged": "<count where tool did not modify file>",
    "betterThanCodemods": "<count>",
    "equalToCodemods": "<count>",
    "worseThanCodemods": "<count>",
    "codemodsFixableTotal": "<count where fixedWithCodemods is true>",
    "codemodsFixableMatched": "<count where fixedWithCodemods is true AND score >= 3>"
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

### Step 6: Generate markdown report

Write `results/<date>/report.md` with:

1. **Summary table** — overall scores
2. **Where tool beats pf-codemods** — unique value (vsCodemods == "better")
3. **Where tool matches pf-codemods** — parity achieved
4. **Where tool falls short** — priority improvements (vsCodemods == "worse")
5. **Unchanged files** — test cases the tool didn't touch
6. **Wrong fixes** — test cases scored 0

### Step 7: Trend comparison

If previous scorecards exist in `results/`, compare against the most recent one:
- Improvements (score went up)
- Regressions (score went down)
- New test cases covered

### Step 8: Print summary

Print a concise summary to the conversation:
- Overall score: X/85 correct
- vs pf-codemods: X better, Y equal, Z worse
- Top 3 priority fixes
- Link to full report
