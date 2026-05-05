---
name: analyze-rules
description: Analyze semver rules and fix-guidance against evaluation scorecard to diagnose root causes of migration failures. Takes a results directory path as argument. Produces rule-analysis.md with actionable recommendations.
---

# Analyze Rules

You are performing root cause analysis on a PatternFly migration evaluation. You have:
1. A **scorecard.json** with per-test-case scores from a prior `/evaluate-migration` run
2. **semver rules** (Kantra-style YAML) that Kantra uses for static analysis to detect breaking changes
3. **fix-guidance** (YAML + JSON) that tells the fix engine how to resolve each detected change

Your job is to cross-reference these to determine **why** the tool succeeded or failed on each test case, and produce actionable recommendations for improving the rules and fix-guidance.

## Arguments

The user passes a results directory: `/analyze-rules results/<date>-<branch>`

If no argument is given, use the most recent directory under `results/`.

## Data Locations

All data lives under the results directory:

```
results/<date>-<branch>/
├── scorecard.json                     # From evaluate-migration
├── report.md                          # From evaluate-migration
└── semver/
    ├── semver_report.json             # Optional — Kantra analysis report
    ├── semver_rules/
    │   ├── ruleset.yaml               # Ruleset metadata
    │   ├── breaking-changes-api.yaml  # API-level breaking changes
    │   ├── breaking-changes-composition.yaml  # Component composition changes
    │   ├── breaking-changes-css.yaml  # CSS variable/class changes
    │   └── breaking-changes-deps.yaml # Dependency changes
    └── fix-guidance/
        ├── fix-guidance.yaml          # Detailed fix descriptions per rule
        └── fix-strategies.json        # Strategy type + before/after per rule
```

If `semver/` doesn't exist in the results directory, tell the user and stop.

## Data Formats

### semver_rules (breaking-changes-*.yaml)

Each rule has:
- `ruleID`: Unique identifier matching keys in fix-strategies.json
- `labels`: Tags including `change-type`, `kind`, `package`, `family`
- `description`/`message`: Human-readable breaking change description
- `when`: Pattern matching conditions (`frontend.referenced` with `pattern`, `location`, `from`)

### fix-strategies.json

Keyed by ruleID or family key. Each entry has:
- `strategy`: One of: CssVariablePrefix, LlmAssisted, PropTypeChange, PropValueChange, CompositionChange, FamilyMigration, Manual, ImportPathChange, EnsureDependency, RemoveProp, Rename, PropToChild, ConstantGroup, RemoveAttribute, DeprecatedMigration, PropToChildren, ChildToProp
- `component`: The PF component name
- `prop`: The affected prop name
- `from`/`to`: Before/after values
- `mappings`: Array of related changes (for grouped rules)
- Additional fields vary by strategy type

### fix-guidance.yaml

Each entry maps a ruleID to:
- `strategy`: rename, find_alternative, etc.
- `confidence`: exact, high, low
- `fix_description`: Detailed human-readable fix instructions
- `before`/`after`: Code snippets
- `search_pattern`/`replacement`: Regex patterns for mechanical fixes

## Root Cause Categories

Classify each test case into exactly one of these categories:

1. **correct** — Rule and guidance are correct; tool produced the right output
2. **missing_rule** — No rule or fix-strategy exists for this breaking change
3. **wrong_guidance** — Rule exists but maps to an incorrect fix (wrong target prop, wrong value)
4. **incomplete_correlation** — Related rules exist (e.g., RemoveProp for old + PropTypeChange for new) but they aren't connected, so the tool removes without replacing
5. **strategy_gap** — The strategy type can't express the needed fix (e.g., needs ChildToProp but none exists)
6. **rule_quality** — Rule is technically correct but too vague/generic for the LLM to act on (e.g., "find alternative" with no specifics, or "check the library's migration guide")
7. **tool_behavior** — Rule and guidance are correct, but the tool didn't follow them properly

## Process

### Step 1: Load the scorecard

Read `scorecard.json` from the results directory. This has all 85 test case scores with issues and notes.

### Step 2: Verify semver data exists

Check that `semver/semver_rules/` and `semver/fix-guidance/` directories exist with the expected files.

### Step 3: Load breaking-changes.json

Read `breaking-changes.json` from the repo root for the expected outcomes.

### Step 4: Analyze all test cases

Use parallel subagents, batching ~10-15 test cases per agent. For each test case:

1. **Get the scorecard entry** — score, issues, notes
2. **Search fix-strategies.json** for entries matching the component and prop names:
   ```bash
   grep -i '<component>' <fix-strategies.json> | head -20
   grep -i '<prop>' <fix-strategies.json> | head -20
   ```
3. **Search the relevant breaking-changes YAML** for matching rules:
   ```bash
   grep -i '<component>' <breaking-changes-api.yaml> | head -20
   ```
4. **Read the matching entries in full** to understand what guidance was provided
5. **Classify the root cause** into one of the 7 categories above
6. **Write a specific diagnosis**: What rule/guidance exists, what's missing or wrong, and what would fix it

The subagent prompt should include:
- The scorecard entry for each test case
- The expected outcome from breaking-changes.json
- The results directory path so it can grep the files
- The root cause category definitions

Each subagent returns a JSON array:
```json
[{
  "id": "TC001",
  "component": "Accordion content",
  "score": 1,
  "rootCause": "incomplete_correlation",
  "relevantRules": ["semver-...-accordiontoggle-isexpanded-removed"],
  "relevantStrategies": ["RemoveProp: AccordionToggle.isExpanded", "FamilyMigration: Accordion"],
  "diagnosis": "RemoveProp correctly identifies isExpanded on AccordionToggle but doesn't link to FamilyMigration showing isExpanded belongs on AccordionItem. The tool removes without relocating.",
  "recommendation": "Add a PropRelocation strategy linking the RemoveProp to the FamilyMigration target, or create a dedicated MovesProp entry: { from: 'AccordionToggle.isExpanded', to: 'AccordionItem.isExpanded' }"
}]
```

### Step 5: Aggregate and write rule-analysis.md

Write `results/<date>-<branch>/rule-analysis.md` with these sections:

#### 1. Summary by Root Cause

Table showing count per category:

| Root Cause | Count | % | Description |
|------------|-------|---|-------------|
| correct | N | X% | Rules and tool both work |
| wrong_guidance | N | X% | Fix guidance maps to incorrect target |
| ... | | | |

#### 2. Priority Fixes — Wrong Guidance

These are the highest-priority fixes because the rules actively cause incorrect output. List each case with the specific rule that's wrong and what it should say instead.

#### 3. Priority Fixes — Missing Rules

Rules that need to be created. Group by strategy type needed.

#### 4. Priority Fixes — Incomplete Correlations

Cases where related rules exist but aren't connected. Show the existing rules and what connection is needed.

#### 5. Priority Fixes — Strategy Gaps

Cases where the strategy vocabulary can't express the needed fix. Recommend new strategy types or extensions.

#### 6. Rule Quality Issues

Rules that are too vague for the LLM to act on. Show the current guidance and what specific information would help.

#### 7. Tool Behavior Issues

Cases where rules are correct but the tool didn't follow them. These are tool bugs, not rule issues.

#### 8. Validated Rules

Cases where both rules and tool output are correct. Brief confirmation that these rules work.

#### 9. Actionable Summary

Prioritized list of concrete changes:
1. Fix N wrong guidance entries (list the specific ruleIDs and corrections)
2. Add N missing rules (list the components and strategy types needed)
3. Connect N incomplete correlations (list the rule pairs)
4. Address N rule quality issues (list what specifics to add)

### Step 6: Update evaluate-migration integration

If this skill was invoked as part of `/evaluate-migration`, the results are already in the right directory. Print a summary to the conversation.

### Step 7: Print summary

Print a concise summary to the conversation:
- Root cause distribution (counts per category)
- Top 3 highest-impact fixes (wrong guidance or missing rules that affect the most test cases)
- Link to full analysis: `results/<date>-<branch>/rule-analysis.md`
