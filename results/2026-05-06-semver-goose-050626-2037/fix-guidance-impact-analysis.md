# Impact Analysis: fix-guidance.yaml Alignment Fix

**Run compared:** `semver/goose/050626-2037` (fixed fix-guidance.yaml)
**Baseline:** `semver/goose/050526-1644` (broken fix-guidance.yaml)
**Analysis date:** 2026-05-06

---

## Summary

Fixing the fix-guidance.yaml alignment bug produced **meaningful but mixed results**. The vs-codemods comparison improved (4 fewer "worse" cases), and several previously broken incomplete-correlation cases now work. However, the overall correct count barely moved (51→50) because the fix also introduced regressions where the LLM — now receiving real guidance instead of nonsensical icon descriptions — over-applies changes.

| Metric | Before (broken) | After (fixed) | Delta |
|--------|-----------------|---------------|-------|
| Fully correct (3) | 51 | 50 | -1 |
| Partial (1-2) | 24 | 26 | +2 |
| Wrong (0) | 10 | 9 | -1 |
| Worse than codemods | 23 | **19** | **-4** |
| Better than codemods | 11 | **13** | **+2** |
| Equal to codemods | 32 | **34** | **+2** |
| Codemods-fixable matched | 38/66 | 37/66 | -1 |

**Improvements:** 10 test cases scored higher
**Regressions:** 11 test cases scored lower

---

## Improvements (10 cases)

### High-value gains from correct guidance

| TC | Component | Before → After | What changed |
|----|-----------|----------------|-------------|
| **TC001** | Accordion content | **1→3** | Now correctly removes `isHidden` without breaking isExpanded migration |
| **TC003** | Accordion toggle | **1→3** | Now correctly moves `isExpanded` from AccordionToggle to AccordionItem |
| **TC045** | Menu item action | **1→3** | Tool now correctly leaves file unchanged (was unnecessarily removing MenuContent) |
| **TC080** | Tokens | **2→3** | Token renames now scored fully correct |
| **TC063** | Page header tools | **2→3** | Test design limitation now properly recognized |

**TC001 and TC003** are the standout wins. These were our #2 priority issue (incomplete correlation between AccordionToggle.isExpanded removal and AccordionItem.isExpanded addition). With correct guidance text, the LLM can now reason about the prop relocation instead of receiving instructions about `ChartThemeDefinition` or `ChartTooltip`.

**TC045** is a behavioral improvement — the LLM no longer over-applies changes when it receives correct "no changes needed" guidance.

### Partial gains

| TC | Component | Before → After | What changed |
|----|-----------|----------------|-------------|
| TC002 | Accordion item | 1→2 | Better but still doesn't fully move isExpanded |
| TC005 | Avatar | 0→1 | Now recognizes border needs attention (still doesn't add isBordered) |
| TC008 | Button | 0→1 | Now recognizes isActive needs attention (still doesn't add isClicked) |
| TC053 | Nav item | 1→2 | Better hasNavLinkWrapper handling |
| TC084 | Toolbar | 0→1 | Now attempts interface rename (was completely ignored) |

TC005 and TC008 improved from 0→1 but remain incomplete-correlation problems — the fix-guidance.yaml fix gave the LLM awareness of the removal, but fix-strategies.json still has these as disconnected `RemoveProp` + `PropTypeChange` entries with no link between them.

---

## Regressions (11 cases)

### Pattern: LLM over-application (7 cases, all 3→2)

| TC | Component | Issue |
|----|-----------|-------|
| TC036 | KebabToggle | Kept deprecated `isPlain` prop; added DropdownItem/DropdownList children not in original |
| TC050 | MultiContentCard | Replaced `withHeaderBorder` with invented `withDividers` instead of removing |
| TC079 | Tile | Card replacement left incompatible props (`title`, `isSelected`) |
| TC049 | Modal next | Over-restructured Modal beyond what was needed |
| TC070 | Popper | Full Select migration beyond what test case required |
| TC024 | DualListSelector next | Moved to /deprecated instead of keeping at /react-core |
| TC040 | LoginFooter | Slightly worse restructuring than before |

**Root cause:** With correct guidance, the LLM is now more confident and ambitious in its fixes. Previously, the nonsensical guidance (e.g., "Update type annotations from BuyNLargeIconConfig") caused the LLM to fall back on conservative behavior or its own knowledge. Now it actively follows the guidance, which sometimes means it does **more** than necessary.

This is actually a good sign — the LLM is engaging with the guidance. The over-application can be addressed by:
1. Adding guardrails to the guidance ("only modify what is explicitly prescribed")
2. Fixing the specific rules that are too broad (e.g., FamilyMigration target_structures)

### Pattern: Still-wrong fix-strategies.json (2 cases)

| TC | Component | Before → After | Issue |
|----|-----------|----------------|-------|
| TC044 | Masthead | 2→1 | FamilyMigration structure still doesn't clearly require MastheadToggle inside MastheadMain |
| TC082 | Toolbar | 1→0 | `usePageInsets→hasNoPadding` rename still wrong in fix-strategies.json |

These regressions are caused by **fix-strategies.json issues that the fix-guidance.yaml fix didn't address**. TC082 is worse because the LLM now more faithfully follows the (still wrong) strategy.

### Pattern: Evaluator scoring variance (2 cases)

| TC | Component | Before → After | Issue |
|----|-----------|----------------|-------|
| TC016 | DataListAction | 2→1 | Same behavior, stricter scoring on structural changes |
| TC025 | Duplicate imports | 2→0 | Same behavior, stricter scoring on test design limitation |

These may reflect evaluator variability rather than actual tool changes.

---

## What the Fix Did and Didn't Solve

### Solved

- **Accordion isExpanded migration** — the highest-impact incomplete-correlation case now works (TC001, TC003)
- **Unnecessary modifications** — TC045 no longer over-modifies (MenuContent removal stopped)
- **LLM engagement with guidance** — the tool now reads and follows guidance, enabling incremental improvement through rule fixes

### Not solved (requires fix-strategies.json changes)

These issues persist because fix-strategies.json — which was always correctly keyed — still has the wrong data:

| Issue | Test Cases | What's needed |
|-------|-----------|---------------|
| `isOverflowLabel → isClickable` (wrong rename) | TC037 | Change to `RemoveProp + add variant='overflow'` |
| `usePageInsets → hasNoPadding` (wrong rename) | TC082 | Change to `RemoveProp` |
| `spacer → gap` (wrong rename) | TC085 | Change to `RemoveProp` for ToolbarItem |
| `variant='light' → 'secondary'` (wrong value) | TC062, TC066 | Change to `light → default` |
| Disconnected RemoveProp + PropTypeChange | TC005, TC006, TC008, TC011 | Link as rename/transform pairs |

### Not solved (requires new rules)

| Issue | Test Cases | What's needed |
|-------|-----------|---------------|
| Button icon children → icon prop | TC007 | New `ChildToProp` rule |
| MenuToggle icon children → icon prop | TC046 | New `ChildToProp` rule |
| CSS variable suffix renames | TC072, TC078 | New CSS rename rules |
| Card selectableActions simplification | TC010 | New pattern rule |

### New problem revealed

The over-application pattern (TC036, TC050, TC079) suggests that **FamilyMigration target_structures need guardrails**. When the LLM receives a complete target component tree, it sometimes restructures the user's code to match the template even when the original code was simpler. Possible fixes:
- Add `"apply": "minimal"` flag to strategies that should only change what's broken
- Annotate optional vs required elements in target_structure
- Add explicit guidance: "Do not add components or props not present in the original code"

---

## Recommended Next Steps

### Step 1: Fix wrong fix-strategies.json entries (4 ruleIDs)

These are the highest-ROI changes. Each directly fixes an actively-wrong rule:

1. **`sd-prop-value-pagesection-variant-light`** — change `"replacement": "secondary"` to `"replacement": "default"`
2. **`semver-...-label-isoverflowlabel-renamed`** — change from `Rename` to `RemoveProp` + add note: "Add `variant='overflow'` to replace"
3. **`semver-...-toolbar-usepageinsets-renamed`** — change from `Rename` to `RemoveProp`
4. **`semver-...-toolbaritem-spacer-renamed`** — change from `Rename` to `RemoveProp` (ToolbarGroup/ToolbarToggleGroup can keep the gap rename)

**Expected impact:** 5-6 test cases should improve (TC037, TC062, TC066, TC082, TC085)

### Step 2: Add ChildToProp rules for Button and MenuToggle icons

Template exists: `sd-child-to-prop-emptystate-emptystateicon-to-icon`. Create:
- `sd-child-to-prop-button-icon`
- `sd-child-to-prop-menutoggle-icon`

**Expected impact:** TC007 and TC046 (both currently score 0)

### Step 3: Link RemoveProp ↔ PropTypeChange pairs

For TC005, TC006, TC008, TC011 — add correlation metadata or create compound strategies:
- `Avatar.border` removed → `Avatar.isBordered` added: `{ "strategy": "PropRename", "from": "border", "to": "isBordered", "valueTransform": "any → true" }`
- `Button.isActive` removed → `Button.isClicked` added: `{ "strategy": "PropRename", "from": "isActive", "to": "isClicked" }`
- `Checkbox.isLabelBeforeButton` removed → `Checkbox.labelPosition` added: `{ "strategy": "PropRename", "from": "isLabelBeforeButton", "to": "labelPosition", "valueTransform": "true → 'start'" }`
- `Banner.variant` removed → `Banner.color` + `Banner.status` added: compound mapping

**Expected impact:** 4 test cases should improve from 0-1 to 2-3

### Step 4: Add FamilyMigration guardrails

Address the over-application pattern by:
1. Annotating optional children in `family:Drawer` target_structure (fixes TC019, TC022)
2. Adding explicit guidance to FamilyMigration strategies: "Only modify elements present in the original code. Do not add new child components unless they replace removed functionality."
3. Adding prop mapping to component replacements (e.g., Tile→Card prop compatibility in `family:Tile`)

**Expected impact:** Prevent 3-4 regressions from recurring

### Step 5: Extend semver-analyzer to @patternfly/react-component-groups

8 test cases (TC015, TC028, TC033, TC034, TC038, TC047, TC050, TC054) currently pass through LLM knowledge alone because semver-analyzer doesn't cover this package. These successes are fragile.

**Expected impact:** Makes 8 currently-fragile successes reliable

---

## Appendix: Full Per-Test-Case Comparison

| TC | Component | Before | After | Delta | Category |
|----|-----------|--------|-------|-------|----------|
| TC001 | Accordion content | 1 | 3 | +2 | Improvement |
| TC002 | Accordion item | 1 | 2 | +1 | Improvement |
| TC003 | Accordion toggle | 1 | 3 | +2 | Improvement |
| TC004 | All | 2 | 2 | 0 | |
| TC005 | Avatar | 0 | 1 | +1 | Improvement |
| TC006 | Banner | 0 | 0 | 0 | |
| TC007 | Button | 0 | 0 | 0 | |
| TC008 | Button | 0 | 1 | +1 | Improvement |
| TC009 | Card | 3 | 3 | 0 | |
| TC010 | Card | 0 | 0 | 0 | |
| TC011 | Checkbox | 1 | 1 | 0 | |
| TC012 | Chip | 3 | 3 | 0 | |
| TC013 | Chip | 2 | 2 | 0 | |
| TC014 | Color props | 3 | 3 | 0 | |
| TC015 | Content header | 3 | 3 | 0 | |
| TC016 | Data list action | 2 | 1 | -1 | Regression |
| TC017 | Deprecated components | 3 | 3 | 0 | |
| TC018 | Drag drop | 3 | 3 | 0 | |
| TC019 | Drawer | 2 | 2 | 0 | |
| TC020 | Drawer | 3 | 3 | 0 | |
| TC021 | Drawer content | 1 | 1 | 0 | |
| TC022 | Drawer head | 0 | 0 | 0 | |
| TC023 | Dual list selector | 3 | 3 | 0 | |
| TC024 | Dual list selector next | 3 | 2 | -1 | Regression |
| TC025 | Duplicate imports | 2 | 0 | -2 | Regression |
| TC026 | Empty state | 3 | 3 | 0 | |
| TC027 | Empty state header | 3 | 3 | 0 | |
| TC028 | Error state | 3 | 3 | 0 | |
| TC029 | Form field group | 0 | 0 | 0 | |
| TC030 | Form group | 3 | 3 | 0 | |
| TC031 | Helper text item | 3 | 3 | 0 | |
| TC032 | Helper text item | 3 | 3 | 0 | |
| TC033 | Invalid object | 3 | 3 | 0 | |
| TC034 | Jump links item | 3 | 3 | 0 | |
| TC035 | Jump links item | 3 | 3 | 0 | |
| TC036 | Kebab toggle | 3 | 2 | -1 | Regression |
| TC037 | Label | 0 | 0 | 0 | |
| TC038 | Log snippet | 3 | 3 | 0 | |
| TC039 | Log viewer | 3 | 3 | 0 | |
| TC040 | Login footer | 2 | 1 | -1 | Regression |
| TC041 | Login main header | 3 | 3 | 0 | |
| TC042 | Masthead | 3 | 3 | 0 | |
| TC043 | Masthead | 3 | 3 | 0 | |
| TC044 | Masthead | 2 | 1 | -1 | Regression |
| TC045 | Menu item action | 1 | 3 | +2 | Improvement |
| TC046 | Menu toggle | 0 | 0 | 0 | |
| TC047 | Missing page | 3 | 3 | 0 | |
| TC048 | Modal | 3 | 3 | 0 | |
| TC049 | Modal next | 3 | 2 | -1 | Regression |
| TC050 | Multi content card | 3 | 2 | -1 | Regression |
| TC051 | Nav | 3 | 3 | 0 | |
| TC052 | Nav | 3 | 3 | 0 | |
| TC053 | Nav item | 1 | 2 | +1 | Improvement |
| TC054 | Not authorized | 3 | 3 | 0 | |
| TC055 | Notification badge | 3 | 3 | 0 | |
| TC056 | Notification drawer | 3 | 3 | 0 | |
| TC057 | Page | 3 | 3 | 0 | |
| TC058 | Page | 3 | 3 | 0 | |
| TC059 | Page | 3 | 3 | 0 | |
| TC060 | Page | 3 | 3 | 0 | |
| TC061 | Page | 3 | 3 | 0 | |
| TC062 | Page breadcrumb | 1 | 1 | 0 | |
| TC063 | Page header tools | 2 | 3 | +1 | Improvement |
| TC064 | Page navigation | 3 | 3 | 0 | |
| TC065 | Page section | 3 | 3 | 0 | |
| TC066 | Page section | 1 | 1 | 0 | |
| TC067 | Page section | 2 | 2 | 0 | |
| TC068 | Page sidebar | 3 | 3 | 0 | |
| TC069 | Pagination | 3 | 3 | 0 | |
| TC070 | Popper | 3 | 2 | -1 | Regression |
| TC071 | Simple file upload | 3 | 3 | 0 | |
| TC072 | Slider step | 1 | 1 | 0 | |
| TC073 | Switch | 3 | 3 | 0 | |
| TC074 | Tabs | 3 | 3 | 0 | |
| TC075 | Tabs | 3 | 3 | 0 | |
| TC076 | Tabs | 3 | 3 | 0 | |
| TC077 | Text | 3 | 3 | 0 | |
| TC078 | Th | 1 | 1 | 0 | |
| TC079 | Tile | 3 | 2 | -1 | Regression |
| TC080 | Tokens | 2 | 3 | +1 | Improvement |
| TC081 | Tokens | 2 | 2 | 0 | |
| TC082 | Toolbar | 1 | 0 | -1 | Regression |
| TC083 | Toolbar | 3 | 3 | 0 | |
| TC084 | Toolbar | 0 | 1 | +1 | Improvement |
| TC085 | Toolbar | 2 | 2 | 0 | |
