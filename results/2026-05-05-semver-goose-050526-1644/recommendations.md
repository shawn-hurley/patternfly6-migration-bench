# Recommendations: Improving the semver-analyzer + fix-engine Migration Pipeline

**Date:** 2026-05-05
**Based on:**
- Benchmark evaluation: `scorecard.json` and `report.md` (85 test cases, `semver/goose/050526-1644`)
- Benchmark root cause analysis: `rule-analysis.md`
- Real-world evaluation: `GAPS-details_quipucords-ui.md` (quipucords-ui codebase, `semver/goose/042926-1740`)

---

## Executive Summary

Two independent analyses — one against a controlled 85-case benchmark, one against a production React application — converge on the same root causes. The migration pipeline has good coverage (60% fully correct in the benchmark, many complex migrations succeed) but is undermined by a data quality bug, a handful of wrong rules, and structural gaps in how rules correlate with each other.

The recommended fix order is designed so each step unlocks the next. Fixing the data quality bug (P0) may resolve many downstream issues, so a re-evaluation after that fix is essential before investing in lower-priority rule changes.

---

## P0: Fix the fix-guidance.yaml Alignment Bug

### The Problem

fix-guidance.yaml has a catastrophic alignment bug where 99.7% of its 4,065 entries have mismatched ruleIDs and descriptions. The ruleID sequence and the symbol/description sequence were independently generated correctly, but merged with the wrong partner — a zip/merge ordering bug during generation.

**Benchmark evidence:**
- `sd-prop-value-pagesection-variant-light` → paired with `BuyNLargeIconConfig`
- `sd-child-to-prop-emptystate-emptystateicon-to-icon` → paired with `BoxOpenIconConfig`
- `semver-...-accordiontoggle-isexpanded-removed` → paired with `ChartTooltip`
- `semver-...-label-isoverflowlabel-renamed` → paired with `DualListSelectorPane.onSearchInputChanged`

**quipucords-ui evidence** (from `GAPS-details_quipucords-ui.md`):
- `sd-prop-value-pagesection-variant-light` → paired with `BusAltIconConfig`
- `sd-composition-emptystate-removed-member-emptystateheader` → paired with `Popper.onMount`
- `sd-cf-masthead-brand-in-main` → paired with `ModalHeader`
- `sd-prop-to-children-modal-footer-to-modalfooter` → paired with `BookmarkIconConfig`

The symbol names differ slightly between the two runs (BuyNLargeIconConfig vs BusAltIconConfig for the same ruleID), confirming this is an ordering/merge bug that produces different wrong pairings each time.

### Impact

If Goose reads fix-guidance.yaml alongside fix-strategies.json, it receives contradictory instructions for nearly every rule. This likely explains:
- 3 "tool_behavior" benchmark cases (TC016, TC021, TC045) where fix-strategies.json had correct guidance but the tool produced wrong output
- quipucords-ui Gap 1.2 (Modal actions dropped in 1 of 8 files — LLM got wrong guidance for that file's rule)
- quipucords-ui Gap 2.1 (EmptyState titleText not migrated — rule paired with Popper description)
- quipucords-ui Gap 3.3 (ToolbarGroup variant removed instead of renamed — rule paired with CalendarCheckIconConfig)
- General LLM inconsistency across files — conflicting signals from the two guidance sources

### fix-strategies.json Is Correct

fix-strategies.json (3,077 entries in benchmark, 3,071 in quipucords-ui) is internally consistent with correct, actionable data. Both analyses independently verified this. It is the reliable guidance source.

### Recommended Action

1. **Find and fix the bug in the fix-engine's YAML generation** — the root cause is likely where two independently-ordered sequences are merged without maintaining key alignment
2. **As an immediate workaround**, configure the fix-engine/Goose to ignore fix-guidance.yaml entirely and rely only on fix-strategies.json
3. **After fixing**, re-run both the benchmark and quipucords-ui evaluations — many downstream issues may resolve themselves once the LLM receives correct guidance

### How to Verify the Fix

After regenerating fix-guidance.yaml, validate with:
```python
# Pseudocode: every entry's symbol should relate to its ruleID
for entry in fix_guidance:
    assert entry.symbol not in ICON_CONFIG_NAMES
    assert entry.symbol relates_to entry.ruleID
```

---

## P1: Fix Wrong Guidance in fix-strategies.json (4 rules, 8 test cases)

These rules actively cause incorrect output. Even with fix-guidance.yaml fixed, these will produce wrong results because the strategy data itself is wrong.

### P1.1: PageSection variant='light' → wrong replacement

| Field | Current (wrong) | Correct |
|-------|-----------------|---------|
| Rule | `sd-prop-value-pagesection-variant-light` | (same) |
| Strategy | `PropValueChange: light → secondary` | Remove variant, add `hasBodyWrapper={false}` |

**Benchmark:** TC062 (score 1), TC066 (score 1)
**quipucords-ui:** Gap 1.1 — 3 files affected

Both analyses independently found this same wrong mapping. The semver-analyzer correctly detected that `variant="light"` was removed and `"secondary"` was added as a new value, but incorrectly inferred a rename relationship. The actual PF6 migration intent is: remove `variant="light"` entirely, add `hasBodyWrapper={false}`.

**Note:** The quipucords-ui analysis (`GAPS-details_quipucords-ui.md`, Gap 2.4) also found that `hasBodyWrapper={false}` should be added to ALL PageSections, not just those with `variant="light"`. pf-codemods adds it universally. Consider broadening the rule scope.

### P1.2: Label isOverflowLabel → wrong rename target

| Field | Current (wrong) | Correct |
|-------|-----------------|---------|
| Rule | `semver-...-label-isoverflowlabel-renamed` | (same) |
| Strategy | `Rename: isOverflowLabel → isClickable` | Remove isOverflowLabel, add `variant='overflow'` |

**Benchmark:** TC037 (score 0)

The semver-analyzer detected that `isClickable` was added to Label and assumed `isOverflowLabel` was renamed to it. In reality, `isClickable` enables click behavior (unrelated), and the overflow styling moved to `variant='overflow'`.

### P1.3: Toolbar usePageInsets → wrong rename target

| Field | Current (wrong) | Correct |
|-------|-----------------|---------|
| Rule | `semver-...-toolbar-usepageinsets-renamed` | (same) |
| Strategy | `Rename: usePageInsets → hasNoPadding` | `RemoveProp: usePageInsets` |

**Benchmark:** TC082 (score 1)

`hasNoPadding` has inverse boolean semantics and is not a valid rename target for `usePageInsets`. The prop should be removed entirely.

### P1.4: Toolbar spacer → wrong rename target

| Field | Current (wrong) | Correct |
|-------|-----------------|---------|
| Rule | `semver-...-toolbargroup-spacer-renamed` | (same) |
| Strategy | `ImportPathChange: spacer → gap` (wrong type too) | `RemoveProp: spacer` |

**Benchmark:** TC085 (score 2)

The `gap` prop in PF6 has different value types and semantics. The strategy type is also wrong (`ImportPathChange` instead of a prop-level strategy). The spacer prop should be removed, with guidance to use CSS gap utilities.

### Underlying Pattern

All four P1 issues share the same root cause: **the semver-analyzer's API-diff approach infers rename relationships between removed and added symbols that are actually unrelated.** When a prop is removed and a new one is added to the same component, the analyzer assumes they're related. This is a fundamental limitation of purely structural API diffing.

**Systemic recommendation:** Add a confidence threshold or manual override mechanism for inferred rename relationships. When the analyzer can't determine semantic equivalence (just structural co-occurrence), flag the strategy for human review rather than asserting a rename.

---

## P2: Add Missing Rules (5 new rules, 4+ test cases)

### P2.1: Button icon children → icon prop (ChildToProp)

**Benchmark:** TC007 (score 0)
**quipucords-ui:** Gap 2.3 — 2 files affected

No rule exists for moving icon children to the `icon` prop on Button. This is a **structural composition change** that API-diffing cannot detect — the analyzer sees the `icon` prop was added but can't infer that existing children should move to it.

**Template:** The pattern already exists for EmptyState: `sd-child-to-prop-emptystate-emptystateicon-to-icon` with strategy `ChildToProp`. Create an analogous rule:
```json
{
  "strategy": "ChildToProp",
  "from": "icon child element",
  "to": "icon",
  "component": "Button",
  "prop": "icon"
}
```

pf-codemods has a reference implementation (`button-moveIcons-icon-prop`) that can guide the rule definition.

### P2.2: MenuToggle icon children → icon prop (ChildToProp)

**Benchmark:** TC046 (score 0)

Same pattern as Button. `family:MenuToggle` strategy exists and shows `icon` in target_structure, but no composition rule triggers the migration.

### P2.3: CSS variable suffix renames (--Left → --InsetInlineStart)

**Benchmark:** TC072 (score 1), TC078 (score 1)
**quipucords-ui:** Gap 3.4 — CSS logical property renames

Current CSS rules only handle version prefix changes (pf-v5 → pf-v6). They don't rename variable suffixes (--Left → --InsetInlineStart, --Right → --InsetInlineEnd, --PaddingTop → --PaddingBlockStart, etc.).

fix-strategies.json has the correct mappings for React token imports (754 entries for PaddingTop/PaddingBlockStart patterns), but these don't apply to raw CSS files.

**Two actions needed:**
1. Add CSS variable rename rules that combine prefix AND suffix changes
2. Extend CSS rules to match variables in `.css` files, not just React token imports

### P2.4: TypeScript interface/type renames (TypeRename)

**Benchmark:** TC084 (score 0) — ToolbarChipGroup → ToolbarLabelGroup

No strategy type exists for renaming TypeScript type references in user code. The `PropTypeChange` strategy targets .d.ts definition changes, not usage-site renames.

**New strategy type needed:** `TypeRename` — handles renaming type names in import statements and type annotations.

### P2.5: MastheadToggle component removal

**quipucords-ui:** Gap 2.2 — only CSS class rename exists, no component-level rule

Add a component removal/replacement rule for MastheadToggle → PageToggleButton.

---

## P3: Connect Incomplete Correlations (5 correlation pairs, 8 test cases)

The most common failure pattern in the benchmark: **RemoveProp exists for the old prop, PropTypeChange exists for the new prop, but they aren't linked.** The tool faithfully removes the old prop and stops, leaving the component broken.

### The Pattern

```
Rule A: RemoveProp — Component.oldProp removed
Rule B: PropTypeChange — Component.newProp added
                     ↑ no connection ↑
Result: Tool removes oldProp, doesn't add newProp
```

### Cases

| TC | Remove | Add | Needed Strategy |
|----|--------|-----|----------------|
| TC001-003 | `AccordionToggle.isExpanded` | `AccordionItem.isExpanded` | `PropRelocation` (cross-component) |
| TC005 | `Avatar.border` | `Avatar.isBordered` | `PropRename` with value transform (dark/light → true) |
| TC006 | `Banner.variant` | `Banner.color` + `Banner.status` | `PropSplit` with value mapping |
| TC008 | `Button.isActive` | `Button.isClicked` | Simple `Rename` |
| TC011 | `Checkbox.isLabelBeforeButton` | `Checkbox.labelPosition` | `PropRename` (true → 'start') |

### Recommended Approach

Rather than creating 5 separate correlation entries, consider a **systematic fix**: post-process the semver-analyzer output to detect RemoveProp/PropTypeChange pairs on the same component family and auto-generate correlation metadata. Heuristic: if prop X is removed from component A and prop Y is added to component A (or a parent/sibling in the same family), flag this as a potential rename/relocation for human review.

This would prevent the same class of bug from recurring as new PF versions are analyzed.

---

## P4: Refine FamilyMigration Strategy (3 structural improvements)

### P4.1: Optional children in target_structure

**Benchmark:** TC019 (score 2), TC022 (score 0)
**quipucords-ui:** Gap 1.3 (ToolbarContent wrapper)

The `family:Drawer` target_structure shows `DrawerActions` + `DrawerCloseButton` as always-present children of `DrawerHead`. The LLM interprets this as "add these to every DrawerHead," causing unnecessary component additions.

**Fix:** Add `optional_children` field or use conditional notation in target_structure to distinguish required vs optional children.

### P4.2: Explicit prop value mappings in family strategies

**Benchmark:** TC021 (score 1)

`family:Drawer` lists valid colorVariant values (default, primary, secondary) but doesn't specify which old value maps to which new value. The LLM chose 'default' instead of 'primary' for 'no-background'.

**Fix:** Add `prop_value_mappings` to family strategies: `{ "DrawerContent.colorVariant": { "no-background": "primary", "light-200": "secondary" } }`

### P4.3: Newly-required props

**Benchmark:** TC034 (score 3 — but via LLM reasoning, not rule guidance)

`family:JumpLinks` shows `href` in target_structure but doesn't flag it as newly-required. Tool succeeded via LLM knowledge, which is fragile.

**Fix:** Add `required_props` field to FamilyMigration.

---

## P5: Extend CSS Rule Coverage

**quipucords-ui:** Gap 1.4 (CSS rules commented out), Gap 3.4 (logical properties in .css)

### Current state

- 2,259 CssVariablePrefix strategy entries exist — but target React token imports only
- No rules match raw CSS class selectors (`.pf-v5-c-*`) in `.css` files
- No rules match raw CSS custom properties (`--pf-v5-*`) in `.css` files

### Needed

1. **CSS class prefix rule:** `.pf-v5-` → `.pf-v6-` in all CSS files
2. **CSS custom property prefix rule:** `--pf-v5-` → `--pf-v6-` in all CSS files
3. **CSS logical property rules:** PaddingTop → PaddingBlockStart, MarginLeft → MarginInlineStart, etc. in CSS files
4. **Guardrail:** "Do NOT comment out or remove CSS rules. Update prefixes and property names."

---

## P6: Address Rule Quality Issues

### Token naming ambiguity (benchmark TC080, TC081)

- React tokens: `global_spacer_md` → `t_global_spacer_md` (semantic) vs `t_global_spacer_300` (numeric scale)
- CSS variables: `--pf-v5-*` → `--pf-v6-*` (version prefix) vs `--pf-t-*` (design token prefix)

Clarify which naming convention is canonical and ensure fix-strategies.json uses it consistently.

### Chip → Label prop mapping (benchmark TC013)

Component replacement rules don't include prop mappings. When Chip is replaced with Label, `onClick` should become `onClose` for dismissible behavior. Add `propMappings` metadata to component replacement strategies.

---

## P7: Real-World Gaps Not Covered by Benchmark

The quipucords-ui analysis (`GAPS-details_quipucords-ui.md`) revealed issues that our 85-case benchmark cannot test:

### OUIA attribute migration (Gap 3.2)

`data-ouia-component-id` → `ouiaId` prop. 13 instances in quipucords-ui. No rule exists because this is a usage convention, not an API signature change. Add a manual migration rule.

### innerRef → ref rename (Gap 3.1)

Some PF6 components dropped `innerRef` in favor of standard `ref`. Rules track type signature changes on components that still have `innerRef`, but miss cases where it was removed. Verify which components dropped it and add removal rules.

### Select ARIA role guidance (Gap 3.5)

Tool added `role="menu"` to a multi-select (should be `role="listbox"`). No production-code rule guides correct role assignment. Add fix-guidance distinguishing menu vs listbox patterns.

### LLM consistency across files (Gap 1.2)

Goose fixed Modal actions correctly in 7 of 8 files but dropped them in one. This is inherent LLM variability that no rule change fixes — but fixing the fix-guidance.yaml alignment bug (P0) would give the LLM consistent instructions, reducing this variability.

### Structural refactors beyond API changes (Gaps 4.1, 4.2)

Icon status wrapper patterns and custom-CSS-to-native-component replacements require human judgment. These are out of scope for automated API-diff-based migration.

---

## Recommended Execution Order

| Priority | Action | Expected Impact | Cases Affected |
|----------|--------|----------------|----------------|
| **P0** | Fix fix-guidance.yaml alignment bug | May resolve many downstream issues | All 85 (indirectly) |
| **P0.5** | **Re-evaluate after P0 fix** | Determine true baseline before more changes | — |
| **P1** | Fix 4 wrong fix-strategies.json entries | Corrects actively wrong output | 8 benchmark + 3 quipucords |
| **P2** | Add 5 missing rules | Covers gaps in both analyses | 4 benchmark + 2 quipucords |
| **P3** | Connect 5 incomplete correlations | Fixes remove-without-replace pattern | 8 benchmark |
| **P4** | Refine FamilyMigration strategy | Prevents over-application | 3 benchmark + 1 quipucords |
| **P5** | Extend CSS rule coverage | Covers .css file handling | 2 benchmark + 2 quipucords |
| **P6** | Clarify rule quality issues | Reduces ambiguity | 3 benchmark |
| **P7** | Address real-world-only gaps | OUIA, innerRef, ARIA roles | quipucords only |

**Critical insight:** P0 should be done first and the evaluation re-run before investing in P3-P7. The alignment bug may be masking the true effectiveness of existing rules — many cases we classified as "incomplete correlation" or "tool behavior" might work correctly once the LLM receives correct guidance from fix-guidance.yaml.

---

## Appendix: Data Sources

- **Benchmark scorecard:** `results/2026-05-05-semver-goose-050526-1644/scorecard.json`
- **Benchmark report:** `results/2026-05-05-semver-goose-050526-1644/report.md`
- **Benchmark rule analysis:** `results/2026-05-05-semver-goose-050526-1644/rule-analysis.md`
- **quipucords-ui gap analysis:** `GAPS-details_quipucords-ui.md` (originally from `/Users/jmatthews/synced/comparisons/quipucords-ui/GAPS-detailed.md`)
- **Semver rules:** `results/2026-05-05-semver-goose-050526-1644/semver/semver_rules/`
- **Fix guidance (CORRUPT):** `results/2026-05-05-semver-goose-050526-1644/semver/fix-guidance/fix-guidance.yaml`
- **Fix strategies (correct):** `results/2026-05-05-semver-goose-050526-1644/semver/fix-guidance/fix-strategies.json`
