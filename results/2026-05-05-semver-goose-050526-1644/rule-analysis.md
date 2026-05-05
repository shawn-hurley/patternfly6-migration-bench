# Rule & Fix-Guidance Root Cause Analysis

**Results directory:** `results/2026-05-05-semver-goose-050526-1644`
**Tool branch:** `semver/goose/050526-1644`
**Analysis date:** 2026-05-05

## 0. CRITICAL: fix-guidance.yaml Alignment Bug

**fix-guidance.yaml has a catastrophic alignment bug.** The ruleID list and the symbol/description list are independently valid but paired with the wrong partner — a zip/merge ordering bug during generation.

Evidence from this run's data:
- Rule `sd-prop-value-pagesection-variant-light` is paired with `BuyNLargeIconConfig` (an icon SVG path)
- Rule `sd-child-to-prop-emptystate-emptystateicon-to-icon` is paired with `BoxOpenIconConfig`
- Rule `semver-...-accordiontoggle-isexpanded-removed` is paired with `ChartTooltip`
- Rule `semver-...-label-isoverflowlabel-renamed` is paired with `DualListSelectorPane.onSearchInputChanged`

Stats: 4,065 ruleID entries; 6,930 IconConfig mentions (noise).

**fix-strategies.json (3,077 entries) is internally consistent** and has correct, actionable data. It is the reliable guidance source.

**Impact:** If the fix-engine/goose reads fix-guidance.yaml, it receives wrong instructions for nearly every rule. This likely explains many "tool_behavior" cases (TC016, TC021, TC045) where fix-strategies.json had correct guidance but the tool produced wrong output — the tool may have been reading the corrupt YAML instead.

**This same bug was independently confirmed in the quipucords-ui analysis (GAPS-detailed.md, 2026-04-29 run).** Fixing this alignment bug is the single highest-impact improvement possible.

## 1. Summary by Root Cause

| Root Cause | Count | % | Description |
|------------|-------|---|-------------|
| correct | 51 | 60% | Rules and tool both work |
| incomplete_correlation | 13 | 15% | Related rules exist but aren't connected |
| wrong_guidance | 6 | 7% | Fix guidance maps to incorrect target |
| missing_rule | 5 | 6% | No rule or fix-strategy exists |
| tool_behavior | 3 | 4% | Rules are correct but tool didn't follow them |
| strategy_gap | 3 | 4% | Strategy type can't express the needed fix |
| rule_quality | 2 | 2% | Rule is too vague for the LLM |
| correct (test limitation) | 2 | 2% | Test case design issue, not a rule issue |

## 2. Priority Fixes — Wrong Guidance (6 cases)

These are the highest-priority fixes because the rules **actively cause incorrect output**.

### TC037 — Label: `isOverflowLabel` renamed to wrong target

- **Rule:** `semver-...-label-isoverflowlabel-renamed`
- **Current strategy:** `Rename: isOverflowLabel → isClickable`
- **Correct fix:** Remove `isOverflowLabel`, add `variant='overflow'`
- **Impact:** Score 0 — tool produces semantically wrong output
- **Fix:** Change strategy from `Rename` to `PropValueChange`. Remove `isOverflowLabel` and add `variant='overflow'`. The semver-analyzer detected that `isClickable` was added to Label, but `isClickable` enables click behavior — it is NOT the replacement for overflow styling.

### TC062/TC066 — PageSection: `variant='light'` mapped to wrong value

- **Rule:** `sd-prop-value-pagesection-variant-light`
- **Current strategy:** `PropValueChange: light → secondary`
- **Correct fix:** `PropValueChange: light → default`
- **Impact:** Score 1 on both TC062 and TC066
- **Fix:** Update the PropValueChange mapping in fix-strategies.json: `{ "from": "light", "to": "default" }`. The `dark` and `darker` → `secondary` mappings are correct; only `light` is wrong.

### TC082 — Toolbar: `usePageInsets` renamed to wrong target

- **Rule:** `semver-...-toolbar-usepageinsets-renamed`
- **Current strategy:** `Rename: usePageInsets → hasNoPadding`
- **Correct fix:** Remove `usePageInsets` entirely (no replacement)
- **Impact:** Score 1 — tool adds wrong prop
- **Fix:** Change strategy from `Rename` to `RemoveProp`. The `hasNoPadding` prop has inverse boolean semantics and is not a valid rename target.

### TC085 — Toolbar: `spacer` renamed to wrong target

- **Rule:** `semver-...-toolbargroup-spacer-renamed`
- **Current strategy:** `ImportPathChange: spacer → gap` (wrong strategy type too)
- **Correct fix:** Remove `spacer` entirely, use CSS gap utilities
- **Impact:** Score 2 — tool produces non-idiomatic output
- **Fix:** Change strategy type from `ImportPathChange` to `RemoveProp`. The `gap` prop exists in PF6 but has different value types and semantics than `spacer`.

### TC013 — Chip→Label: missing prop mapping (onClick → onClose)

- **Rule:** `sd-deprecated-moved-chip-to-deprecated`
- **Current strategy:** Component replacement with no prop mapping
- **Correct fix:** Add prop mapping: `onClick → onClose`
- **Impact:** Score 2 — functional but non-idiomatic
- **Fix:** Add `propMappings` metadata to the Chip→Label replacement rule: `{ "onClick": "onClose", "isReadOnly": null }`.

### TC010 — Card: selectableActions guidance incomplete

- **Rule:** `semver-...-cardheaderselectableactionsobject-...-signature-changed`
- **Current strategy:** Focuses on selectableActions object structure changes
- **Correct fix:** Should include guidance for removing selectableActions when using basic clickable card pattern
- **Impact:** Score 0 — file left unchanged
- **Fix:** Add conditional guidance: if Card uses isClickable without selection state management, recommend removing selectableActions from CardHeader.

## 3. Priority Fixes — Missing Rules (5 cases)

### TC007 — Button: icon children → icon prop

- **Needed:** `ChildToProp` strategy for Button icon migration
- **Pattern:** `<Button><TimesIcon /></Button>` → `<Button icon={<TimesIcon />} />`
- **Note:** A similar rule exists for EmptyState (`sd-child-to-prop-emptystate-emptystateicon-to-icon`). Use that as a template.
- **Recommendation:** Add `sd-child-to-prop-button-icon` to breaking-changes-composition.yaml

### TC046 — MenuToggle: icon children → icon prop

- **Needed:** `ChildToProp` strategy for MenuToggle icon migration
- **Pattern:** `<MenuToggle><CogIcon />Settings</MenuToggle>` → `<MenuToggle icon={<CogIcon />}>Settings</MenuToggle>`
- **Note:** `family:MenuToggle` strategy exists and shows `icon` in target_structure, but no composition rule triggers the migration.
- **Recommendation:** Add `sd-child-to-prop-menutoggle-icon` to breaking-changes-composition.yaml

### TC078 — Th: CSS variable suffix rename (--Left/--Right → --InsetInlineStart/--InsetInlineEnd)

- **Needed:** CSS variable rename rule combining prefix AND suffix changes
- **Current:** Only CssVariablePrefix rule exists (pf-v5 → pf-v6), no suffix rename
- **Recommendation:** Add explicit CSS variable rename rules: `--pf-v5-c-table__sticky-column--Left` → `--pf-v6-c-table__sticky-column--InsetInlineStart`

### TC029 — FormFieldGroup: TypeScript interface typo fix

- **Needed:** `TypeRename` strategy for renaming type references in code
- **Current:** PropTypeChange strategy exists but targets .d.ts changes, not user code type annotations
- **Recommendation:** Create `TypeRename` strategy type, or add actual type usage to the test case

### TC036 — KebabToggle: component replacement (scored 3 via LLM)

- **Rule exists:** `semver-kebabtoggle-component-import-deprecated` detects KebabToggle
- **Missing:** Fix strategy for KebabToggle → MenuToggle variant='plain' + EllipsisVIcon
- **Note:** Tool succeeded via LLM reasoning, but adding an explicit strategy would make it reliable
- **Recommendation:** Add `ComponentReplacement` strategy with target template

## 4. Priority Fixes — Incomplete Correlations (13 cases)

The most impactful pattern: **RemoveProp exists but no link to the replacement prop.**

### Pattern A: Prop relocation (3 cases — TC001, TC002, TC003)

**AccordionToggle.isExpanded → AccordionItem.isExpanded**

- `RemoveProp: AccordionToggle.isExpanded` exists
- `PropTypeChange: AccordionItem.isExpanded` exists (in `family:Accordion`)
- **Missing link:** These rules aren't correlated as a prop relocation
- **Fix:** Create a `PropRelocation` entry in fix-strategies.json: `{ "strategy": "PropRelocation", "from_component": "AccordionToggle", "to_component": "AccordionItem", "prop": "isExpanded" }`

### Pattern B: Prop rename via separate add/remove (5 cases — TC005, TC006, TC008, TC011, TC053)

| TC | Remove | Add | Needed |
|----|--------|-----|--------|
| TC005 | `Avatar.border` | `Avatar.isBordered` | Rename with value transform |
| TC006 | `Banner.variant` | `Banner.color` + `Banner.status` | PropSplit with value mapping |
| TC008 | `Button.isActive` | `Button.isClicked` | Simple rename |
| TC011 | `Checkbox.isLabelBeforeButton` | `Checkbox.labelPosition` | Rename with value transform |
| TC053 | `NavItem.hasNavLinkWrapper` | `NavItem.icon` | Remove + ChildToProp |

**Fix for all:** Correlate the `RemoveProp` and `PropTypeChange` entries into unified rename/transform strategies. The fix-guidance currently shows `find_alternative` with no specifics for each removal.

### Pattern C: FamilyMigration too prescriptive (2 cases — TC019, TC022)

**Drawer family target_structure adds DrawerActions/DrawerCloseButton to ALL DrawerHead instances**

- Tool adds unnecessary components because `family:Drawer` target_structure shows them as always-present
- **Fix:** Mark children in target_structure as optional (e.g., with `{...?}` notation) or split into per-component strategies

### Other incomplete correlations (3 cases)

- **TC040** — LoginMainFooterLinksItem: missing guidance that children should use `Button component='a'`
- **TC044** — Masthead: FamilyMigration shows correct structure but tool only partially applied it (MastheadLogo added but MastheadToggle not moved into MastheadMain)
- **TC072** — Slider: CSS variable suffix rename exists in Rename strategy but isn't correlated with CssVariablePrefix strategy

## 5. Priority Fixes — Strategy Gaps (3 cases)

### TC019/TC022 — FamilyMigration can't express optional children

The `FamilyMigration` strategy's `target_structure` is treated as a template to always fully apply. There's no way to mark parts as conditional.

**Recommendation:** Add `optional_children` or `conditional_structure` field to FamilyMigration, or use a separate `StructuralGuidance` strategy type that describes valid patterns rather than a single required structure.

### TC034 — FamilyMigration can't express newly-required props

`family:JumpLinks` shows `href` in target_structure but doesn't flag it as newly-required. Tool added it via LLM reasoning (scored 3), but this is fragile.

**Recommendation:** Add `required_props` field to FamilyMigration to flag props that went from optional to required.

### TC084 — No strategy type for TypeScript interface/type renames

`ToolbarChipGroup → ToolbarLabelGroup` and `ToolbarChip → ToolbarLabel` renames exist in rules but there's no strategy type to rename type references in user code.

**Recommendation:** Add `TypeRename` strategy type.

## 6. Rule Quality Issues (2 cases)

### TC080 — React token name ambiguity

- `global_spacer_md` → `t_global_spacer_md` (semantic, documented) vs `t_global_spacer_300` (numeric, in fix-strategies.json)
- Both may be valid PF6 tokens, but the documented expectation uses semantic names
- **Fix:** Clarify which mapping is canonical and update fix-strategies.json accordingly

### TC081 — CSS token prefix ambiguity

- CSS variables: `--pf-v5-*` → `--pf-v6-*` (version prefix) vs `--pf-t-*` (design token prefix)
- Rules don't clearly distinguish between these naming conventions
- **Fix:** Add explicit examples differentiating React token imports (t_ prefix) from CSS variable names (v6 prefix)

## 7. Tool Behavior Issues (3 cases)

These are cases where rules and guidance are correct but the tool over-applied or misinterpreted them.

| TC | Issue | Root Cause |
|----|-------|------------|
| TC016 | DataListAction: removed DataListItemCells wrapper beyond required prop removal | LLM agent made additional structural changes not prescribed by the rule |
| TC021 | DrawerContent: changed colorVariant to 'default' instead of 'primary' | FamilyMigration value mapping ambiguous — listed valid values without specifying which replaces 'no-background' |
| TC045 | MenuItemAction: removed MenuContent wrapper when no changes needed | LLM agent over-eagerly applied composition changes |

**Recommendation:** For TC021, add explicit value mapping in `family:Drawer` strategy. For TC016/TC045, constrain the LLM agent to only apply prescribed fixes without making additional structural changes.

## 8. Validated Rules (51 cases)

These test cases demonstrate correct rule/guidance → tool output:

**Simple prop renames (Rename strategy):** TC015, TC028, TC030, TC051, TC054, TC057, TC058, TC059, TC060, TC074, TC083

**Prop removals (RemoveProp strategy):** TC020, TC031, TC043, TC052, TC068, TC073

**Prop value changes (PropValueChange strategy):** TC014, TC075

**Component deprecation/migration:** TC012, TC017, TC018, TC023, TC024, TC026, TC027, TC042, TC048, TC049, TC064, TC065, TC077, TC079

**FamilyMigration success:** TC009, TC033, TC036, TC038, TC047, TC050, TC070

**No changes needed (correctly left unchanged):** TC004, TC025, TC032, TC034, TC035, TC039, TC041, TC055, TC056, TC061, TC063, TC067, TC069, TC071, TC076

## 9. Actionable Summary

### Immediate fixes (wrong guidance — 4 ruleIDs, affects 6 test cases)

1. `sd-prop-value-pagesection-variant-light` — change `light → secondary` to `light → default` (TC062, TC066)
2. `semver-...-label-isoverflowlabel-renamed` — change from `Rename: → isClickable` to remove isOverflowLabel + add `variant='overflow'` (TC037)
3. `semver-...-toolbar-usepageinsets-renamed` — change from `Rename: → hasNoPadding` to `RemoveProp` (TC082)
4. `semver-...-toolbargroup-spacer-renamed` — change from `ImportPathChange: → gap` to `RemoveProp` (TC085)

### Add missing rules (5 new rules needed)

1. `sd-child-to-prop-button-icon` — ChildToProp for Button icon migration (TC007)
2. `sd-child-to-prop-menutoggle-icon` — ChildToProp for MenuToggle icon migration (TC046)
3. CSS variable rename for `--Left` → `--InsetInlineStart` / `--Right` → `--InsetInlineEnd` (TC072, TC078)
4. `TypeRename: ToolbarChipGroup → ToolbarLabelGroup` (TC084)
5. `ComponentReplacement: KebabToggle → MenuToggle` (TC036 — works via LLM but fragile)

### Connect incomplete correlations (5 correlation pairs)

1. `AccordionToggle.isExpanded` removal ↔ `AccordionItem.isExpanded` addition → PropRelocation (TC001-003)
2. `Avatar.border` removal ↔ `Avatar.isBordered` addition → PropRename with value transform (TC005)
3. `Button.isActive` removal ↔ `Button.isClicked` addition → PropRename (TC008)
4. `Banner.variant` removal ↔ `Banner.color`/`Banner.status` addition → PropSplit (TC006)
5. `Checkbox.isLabelBeforeButton` removal ↔ `Checkbox.labelPosition` addition → PropRename (TC011)

### Address rule quality (2 clarifications needed)

1. Token naming convention: semantic names (t_global_spacer_md) vs numeric (t_global_spacer_300) (TC080)
2. CSS variable prefix convention: --pf-v6-* vs --pf-t-* (TC081)

### Refine FamilyMigration strategy (2 structural improvements)

1. Add optional/conditional children support to target_structure (TC019, TC022)
2. Add explicit prop value mappings to family strategies (TC021)
