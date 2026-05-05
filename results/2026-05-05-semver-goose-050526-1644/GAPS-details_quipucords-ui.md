# Migration Tooling Gaps -- Detailed Root Cause Analysis

Based on the 2026-04-29 run (`semver/goose/042926-1740`, PR #8). Each gap traces from the observed problem back through the semver rules, fix-guidance, and fix-strategies to identify root causes and suggest specific fixes.

---

## CRITICAL: Data Quality Issue in fix-guidance.yaml

**fix-guidance.yaml has a catastrophic alignment bug.** 99.7% of its 4,005 entries have mismatched ruleIDs and descriptions. The ruleID list and the symbol/description list are individually valid but paired with the wrong partner -- a zip/merge ordering bug.

Evidence:
- Rule `sd-prop-value-pagesection-variant-light` is paired with `BusAltIconConfig` (an icon SVG path)
- Rule `sd-composition-emptystate-removed-member-emptystateheader` is paired with `Popper.onMount`
- Rule `sd-cf-masthead-brand-in-main` is paired with `ModalHeader`
- Rule `sd-prop-value-toolbargroup-variant-icon-button-group` is paired with `CalendarCheckIconConfig`
- Rule `sd-prop-to-children-modal-footer-to-modalfooter` is paired with `BookmarkIconConfig`

Additional noise:
- 5,187 entries about `svgClassName: undefined` additions (trivial icon config changes)
- 1,731 rules with `IconConfig` symbols (43% of entries are about SVG icon configs)
- File is 13MB; signal-to-noise ratio is very low

**fix-strategies.json (3,071 entries) is internally consistent** and has correct, actionable data. It is the reliable guidance source.

**Impact:** The fix-engine/goose receives wrong guidance for nearly every rule when consulting fix-guidance.yaml. This likely explains many of the wrong fixes and inconsistencies observed. **Fixing the alignment bug in fix-guidance.yaml is the single highest-impact improvement possible.**

**Root cause:** Likely a bug in the fix-engine's YAML generation where two independently-ordered sequences were merged without maintaining key alignment.

---

## Tier 1: Wrong Fixes

### Gap 1.1: PageSection variant="secondary" instead of hasBodyWrapper={false}

**Observed:** Tool replaced `PageSection variant="light"` with `variant="secondary"` in 3 files.

**Code locations (on tool branch):**
- `src/views/credentials/viewCredentialsList.tsx:250` -- `<PageSection variant="secondary">`
- `src/views/scans/viewScansList.tsx:198` -- `<PageSection variant="secondary">`
- `src/views/sources/viewSourcesList.tsx:341` -- `<PageSection variant="secondary">`

**Semver rules:** Rules exist and are correct:
- `sd-prop-value-pagesection-variant-light` -- **BUT the rule message itself says "Use secondary instead"**, which is technically valid PF6 but NOT the correct migration. The rule message is: `Old: <PageSection variant="light" /> / New: <PageSection variant="secondary" />`
- `semver-...-pagesection-variant-variant-removed-group-3` -- covers all 3 variant removals

**Fix-strategies.json:** `PropValueChange` strategy, from `light` to `secondary` -- **this is the root cause.** The strategy data itself recommends `secondary`, which is what the tool applied. However, both pf-codemods and the human PR use `hasBodyWrapper={false}` instead.

**Fix-guidance.yaml:** BROKEN (paired with BusAltIconConfig).

**Root cause analysis:** The semver-analyzer correctly detected that `variant="light"` was removed and that `"secondary"` was added as a new variant value. It inferred that `light` should map to `secondary`. However, the actual PF6 migration intent is different: `variant="light"` should be removed entirely and replaced with `hasBodyWrapper={false}` (a completely different prop). The semver-analyzer's API-diff approach cannot distinguish "value removed and unrelated value added" from "value renamed."

**Suggested fix:**
1. Update `sd-prop-value-pagesection-variant-light` rule message to recommend removing `variant="light"` and adding `hasBodyWrapper={false}` instead
2. Update fix-strategies.json entry from `PropValueChange light->secondary` to a compound action: remove `variant="light"`, add `hasBodyWrapper={false}`
3. The `hasBodyWrapper` additive rule exists but is not connected to the `variant="light"` removal

---

### Gap 1.2: Modal actions silently dropped (showAggregateReportModal)

**Observed:** Tool restructured Modal with ModalHeader/ModalBody but removed `{...(actions && { actions })}` without creating a ModalFooter.

**Code location:**
- `src/views/scans/showAggregateReportModal.tsx:80-108` -- Modal has ModalHeader and ModalBody but no ModalFooter. The `actions` variable (destructured at line 84) is never used in JSX.

**Semver rules:** Modal restructuring rules exist and are comprehensive. The `family:Modal` FamilyMigration in fix-strategies.json correctly lists `actions` as a prop that needs mapping to ModalFooter.

**Fix-strategies.json:** Correctly documents:
- `sd-prop-to-children-modal-footer-to-modalfooter`: PropToChildren strategy, from `footer` to `ModalFooter`
- `actions` listed under "props that need mapping to appropriate child component"
- Target structure includes `<ModalFooter>` as a child

**Root cause:** The fix-guidance.yaml is broken for this rule (paired with `BookmarkIconConfig`), so the LLM agent received wrong guidance. fix-strategies.json has the correct guidance but was apparently not used effectively for this file. Notably, the tool handled this pattern correctly in `showScansModal.tsx` (conditional `{actions && <ModalFooter>{actions}</ModalFooter>}`), suggesting the LLM behavior was inconsistent across files.

**Suggested fix:**
1. Fix the fix-guidance.yaml alignment bug (fixes this and most other issues)
2. Add explicit fix-guidance for the `actions` prop specifically: "If the original Modal has an `actions` prop or spread, wrap in `<ModalFooter>{actions}</ModalFooter>`"
3. Consider adding a post-processing validation: check if any destructured props from the original code are unused after migration

---

### Gap 1.3: Spurious ToolbarContent wrapper (SearchFilterControl)

**Observed:** Tool wrapped ToolbarFilter in a `<ToolbarContent>` element inside SearchFilterControl, creating invalid toolbar nesting.

**Code location:**
- `src/vendor/.../FilterToolbar/SearchFilterControl.tsx:35,70` -- `<ToolbarContent>` wrapping `<ToolbarFilter>`

**Semver rules:** Composition rules exist that validate ToolbarContent hierarchy:
- `sd-cf-toolbar-content-in-toolbar`: ToolbarContent must be child of Toolbar
- Multiple rules reference ToolbarContent as required parent for ToolbarFilter

**Fix-strategies.json:** `family:Toolbar` FamilyMigration shows ToolbarContent as child of Toolbar (correct hierarchy).

**Root cause:** The composition rules say ToolbarFilter should be inside ToolbarContent, and ToolbarContent should be inside Toolbar. The LLM agent apparently interpreted this as "wrap ToolbarFilter in ToolbarContent" without checking whether the component is already rendered inside a ToolbarContent context from a parent. The fix-guidance.yaml being broken may have contributed to this misinterpretation.

**Suggested fix:**
1. Add context-awareness to fix-guidance: "Do NOT add ToolbarContent wrappers inside child components. ToolbarContent is provided by the parent Toolbar, not by individual filter controls."
2. This is an LLM-execution issue more than a rules issue -- the rules correctly document the hierarchy but the agent misapplied them.

---

### Gap 1.4: CSS rules commented out (select-overrides.css)

**Observed:** Tool replaced CSS rules in `select-overrides.css` with a comment instead of updating class prefixes.

**Code location:**
- `src/vendor/.../FilterToolbar/select-overrides.css` -- entire file replaced with a comment about PF6

**Semver rules:** No specific CSS rule for updating `.pf-v5-c-select` to `.pf-v6-c-select` class selectors in CSS files.

**Fix-strategies.json:** Has 2,259 CssVariablePrefix strategy entries for CSS token renames, but these target `@patternfly/react-tokens` imports, not raw CSS class selectors in `.css` files.

**Root cause:** The semver-analyzer generates CSS variable/token rename rules but does not generate rules for updating CSS class selectors (`.pf-v5-c-*` to `.pf-v6-c-*`) in CSS files. The LLM agent, lacking specific guidance, decided the CSS was obsolete and commented it out.

**Suggested fix:**
1. Add a general CSS class prefix rule: update `.pf-v5-` to `.pf-v6-` in all CSS files
2. Add fix-guidance: "When CSS class prefixes reference PF components (pf-v5-c-*), update the version prefix. Do NOT comment out or remove CSS rules."

---

## Tier 2: Missing Rules That pf-codemods Covers

### Gap 2.1: EmptyState titleText prop

**Observed:** Tool moves `icon` to EmptyState prop but leaves `<Title>` as a child instead of moving to `titleText` prop.

**Code locations:**
- `src/components/errorMessage/errorMessage.tsx:15-18` -- `<EmptyState icon={...}>` with `<Title>` child
- `src/vendor/.../NoDataEmptyState.tsx:11-14` -- same pattern
- `src/vendor/.../StateError.tsx:6-9` -- same pattern

**Semver rules:** EXCELLENT coverage:
- `sd-composition-emptystate-removed-member-emptystateheader` -- EmptyStateHeader removed
- `sd-composition-emptystate-removed-member-emptystateicon` -- EmptyStateIcon removed
- `semver-emptystateheader-component-import-deprecated` -- Full property mapping: `EmptyStateHeader.titleText -> EmptyState.titleText`
- Additive props group includes `titleText` addition to `EmptyStateProps`

**Fix-strategies.json:** Excellent:
- `family:EmptyState` FamilyMigration provides target structure with `titleText` as retained prop
- `EmptyStateHeaderProps` removal includes migration note: "Matching props: headingLevel, icon, titleClassName, titleText"

**Root cause:** The rules and fix-strategies correctly describe the full EmptyState migration including titleText. The fix-guidance.yaml is broken (EmptyState rules paired with Popper descriptions). The LLM agent partially executed the migration (icon prop) but didn't complete the titleText step. This is likely because:
1. The broken fix-guidance.yaml provided wrong instructions
2. The original code uses `<Title>` directly (not `EmptyStateHeader`), so the rule for EmptyStateHeader removal didn't trigger -- there was no EmptyStateHeader to remove in these files, just a Title child

**Suggested fix:**
1. Fix fix-guidance.yaml alignment (primary fix)
2. Add a rule that detects `<Title>` as a child of `<EmptyState>` and recommends migrating to `titleText` prop. Current rules only trigger on EmptyStateHeader/EmptyStateIcon imports, not on the pattern of Title-as-child.

---

### Gap 2.2: Masthead structural refactoring

**Observed:** Tool handled prop-level changes (theme removal, header to masthead) but missed the Masthead internal restructuring.

**Code location:**
- `src/components/viewLayout/viewLayout.tsx:47-69` -- MastheadToggle still wrapping a Button with BarsIcon at lines 49-58. MastheadBrand at lines 60-64 not wrapped in MastheadLogo.

**Semver rules:** Comprehensive coverage (8+ rules) but one key gap:
- **MastheadToggle removal as a React component: NO RULE.** Only CSS class rename exists.
- MastheadBrand restructuring: well covered (`sd-cf-masthead-brand-in-main`, `semver-new-sibling-mastheadlogo-in-mastheadbrand`)
- Page header to masthead: covered (`semver-...-page-header-renamed`)
- PageToggleButton new props: covered

**Fix-strategies.json:** Comprehensive:
- `family:Masthead` provides full PF6 target structure
- Lists new imports needed (MastheadLogo, etc.)
- `family:Page` lists PageToggleButton as new import

**Root cause:** The rules cover most of the restructuring but miss the MastheadToggle component removal. The LLM agent may not have attempted the structural changes because the fix-guidance.yaml was broken and the rules, while present, require coordinating multiple changes across the component tree.

**Suggested fix:**
1. Add a rule for MastheadToggle component removal/replacement with PageToggleButton
2. Fix fix-guidance.yaml so the existing Masthead rules provide correct guidance
3. Consider adding a "Masthead full migration" compound rule that orchestrates all the structural changes together

---

### Gap 2.3: Button icon-to-prop migration

**Observed:** Tool doesn't move icon from Button children to `icon` prop.

**Code locations:**
- `src/vendor/.../SearchFilterControl.tsx:59-67` -- `<Button>` with `<SearchIcon />` child at line 66
- `src/components/typeAheadCheckboxes/typeaheadCheckboxes.tsx:213-224` -- `<Button>` with `<TimesIcon />` child at line 223

**Semver rules:** **NO RULE FOUND.** The semver-analyzer tracks Button API changes (prop additions/removals, variant type changes, CSS class renames) but does not generate rules for the structural pattern change where icon children should move to the `icon` prop.

**Fix-strategies.json:** **NO COVERAGE.** No `family:Button` FamilyMigration entry exists. No entry addresses the icon-as-children-to-icon-prop pattern.

**Root cause:** This is a **structural composition change** that the semver-analyzer's API-diffing approach cannot detect. The PF6 `icon` prop on Button was added (which the analyzer notices as an additive prop), but the analyzer cannot determine that existing children (icons) should move to this new prop. This is exactly the kind of usage-pattern rule that pf-codemods provides manually (`button-moveIcons-icon-prop`).

**Suggested fix:**
1. Add a manual composition rule: "When Button has a single icon component child and no text children, move the icon to the `icon` prop"
2. Alternatively, add a `family:Button` FamilyMigration entry documenting the icon prop migration
3. This gap highlights a fundamental limitation of API-diff approaches for detecting usage pattern changes

---

### Gap 2.4: PageSection hasBodyWrapper (no variant trigger)

**Observed:** In `notFound.tsx`, PageSection had no `variant="light"` but both human and pf-codemods added `hasBodyWrapper={false}`.

**Code location:**
- `src/views/notFound/notFound.tsx` -- PageSection with no variant prop, missing `hasBodyWrapper={false}`

**Semver rules:** The `hasBodyWrapper` addition is detected as a new prop, but there's no rule to proactively add it when no existing prop triggers the change.

**Root cause:** The tool's rules trigger on `variant="light"` removal but don't address the case where PageSection has no variant at all. The pf-codemods approach adds `hasBodyWrapper={false}` to all PageSections, not just those with `variant="light"`.

**Suggested fix:**
1. Broaden the PageSection rule to add `hasBodyWrapper={false}` to all `<PageSection>` usages, not just those with `variant="light"`

---

## Tier 3: Unique Value Opportunities

### Gap 3.1: innerRef to ref rename

**Observed:** Tool missed `innerRef` to `ref` rename across 5 files (6 instances).

**Code locations:**
- `src/vendor/.../useTableWithBatteries.tsx:22` -- `innerRef={ref as React.MutableRefObject<HTMLTableElement>}`
- `src/vendor/.../useThWithBatteries.tsx:35` -- `innerRef={ref as React.MutableRefObject<HTMLTableCellElement>}`
- `src/vendor/.../useTdWithBatteries.tsx:35` -- same pattern
- `src/vendor/.../useTrWithBatteries.tsx:74` -- same pattern
- `src/components/typeAheadCheckboxes/typeaheadCheckboxes.tsx:190` -- `innerRef={toggleRef}`
- `src/components/typeAheadCheckboxes/typeaheadCheckboxes.tsx:203` -- `innerRef={textInputRef}`

**Semver rules:** PARTIAL -- rules exist for `innerRef` type changes but not for the removal/rename pattern. The rules track type signature changes (e.g., `RefObject<T>` to `RefObject<T | null>`) on components that **still have** `innerRef`, not cases where it was removed.

**Fix-strategies.json:** Lists `innerRef` as a retained prop on Table, Card, MenuToggle, etc. -- meaning PF6 still has `innerRef` on many components.

**Root cause nuance:** PF6 still uses `innerRef` on many components. The human PR's changes in the vendor code were app-specific refactoring (the vendored table wrapper code forwards refs, and the human preferred standard `ref`). However, for `typeaheadCheckboxes.tsx`, the `innerRef` removal on `MenuToggle` and `TextInputGroupMain` may be a genuine PF6 API change if those specific components dropped `innerRef`.

**Suggested fix:**
1. Verify which PF6 components actually removed `innerRef`. For those that did, add removal rules.
2. For vendored code, this may be app-specific and outside the tool's scope.

---

### Gap 3.2: OUIA attribute migration

**Observed:** Tool inconsistently applied `data-ouia-component-id` to `ouiaId` migration. Applied in 2 files (typeaheadCheckboxes, viewLayoutToolbar), missed in many others.

**Code locations (remaining `data-ouia-component-id` instances):**
- `src/views/credentials/addCredentialModal.tsx:273`
- `src/views/scans/showAggregateReportModal.tsx:99`
- `src/views/scans/showScansModal.tsx:120,123`
- `src/views/sources/addSourcesScanModal.tsx:128,160`
- `src/views/sources/addSourceModal.tsx:251`
- `src/components/viewLayout/viewLayoutToolbar.tsx:160,187` (DropdownItem logout)
- `src/components/typeAheadCheckboxes/typeaheadCheckboxes.tsx:209`
- `src/components/simpleDropdown/simpleDropdown.tsx:60`
- `src/components/actionMenu/actionMenu.tsx:50`

Total: 13 instances still using `data-ouia-component-id` in source files.

**Semver rules:** **NO RULE FOUND.** No dedicated rules for OUIA attribute migration.

**Root cause:** OUIA attribute handling is not a PF API signature change detectable by semver analysis. The `data-ouia-component-id` is an HTML data attribute, not a React prop change. The fact that the tool caught it in some files suggests the LLM agent recognized the pattern ad-hoc but didn't apply it consistently.

**Suggested fix:**
1. Add a general migration rule: "Replace `data-ouia-component-id` with `ouiaId` prop on PF components that support OUIA"
2. This is a usage convention change, not an API change, so it needs a manual rule

---

### Gap 3.3: ToolbarGroup variant rename (not removal)

**Observed:** Tool removed `variant="icon-button-group"` entirely instead of renaming to `variant="action-group-plain"`.

**Code location:**
- `src/components/viewLayout/viewLayoutToolbar.tsx` -- outer `<ToolbarGroup>` has no variant prop (should be `variant="action-group-plain"`)

**Semver rules:** Well covered:
- `sd-prop-value-toolbargroup-variant-icon-button-group` -- explicitly says "Use action-group-plain instead"

**Fix-strategies.json:** Correct `PropValueChange` from `icon-button-group` to `action-group-plain`.

**Root cause:** The rules and strategies are correct. The fix-guidance.yaml is broken (paired with `CalendarCheckIconConfig`). The LLM agent likely received the wrong guidance from fix-guidance.yaml and decided to remove the variant instead of renaming it.

**Suggested fix:**
1. Fix fix-guidance.yaml alignment (primary fix -- this gap would likely be resolved)

---

### Gap 3.4: CSS logical properties

**Observed:** Tool updated `pf-v5` to `pf-v6` prefix but kept `--PaddingTop` instead of renaming to `--PaddingBlockStart`.

**Code location:**
- `src/views/sources/showSourceConnectionsModal.css` -- `--pf-v6-c-table__expandable-row-content--PaddingTop` (should be `--PaddingBlockStart`)

**Semver rules:** No specific rule for CSS-file logical property renames.

**Fix-strategies.json:** Extensive coverage (754 matches for PaddingTop/PaddingBlockStart patterns), but these are for `@patternfly/react-tokens` imports, not raw CSS custom properties in `.css` files.

**Root cause:** The CSS variable rename rules target JavaScript/TypeScript token imports, not raw CSS files. The tool correctly has the mapping knowledge (PaddingTop to PaddingBlockStart) in its token rules but doesn't apply it to CSS files.

**Suggested fix:**
1. Extend CSS variable rename rules to also match raw CSS custom properties in `.css` files
2. Add a general CSS migration rule: "In CSS files, rename PF variable suffixes: PaddingTop to PaddingBlockStart, PaddingBottom to PaddingBlockEnd, MarginLeft to MarginInlineStart, MarginRight to MarginInlineEnd"

---

### Gap 3.5: Select role="menu" vs role="listbox"

**Observed:** Tool added `role="menu"` to a multi-select (checkbox) Select component.

**Code location:**
- `src/vendor/.../MultiselectFilterControl.tsx` -- `<Select role="menu">` (should be `role="listbox"`)

**Semver rules:** Test-impact rules exist for role changes but only trigger on test files.

**Root cause:** LLM agent chose the wrong ARIA role. No production-code rule guides correct role assignment on the new composable Select.

**Suggested fix:**
1. Add fix-guidance: "Multi-select (checkbox) Select components should use `role='listbox'`. Single-action menus should use `role='menu'`."

---

## Tier 4: Structural Refactors

### Gap 4.1: Icon status wrapper pattern

**Observed:** Tool replaced PF5 tokens with PF6 equivalents but kept inline color values. Human used `<Icon status="...">` wrapper.

**Code location:**
- `src/components/contextIcon/contextIcon.tsx` -- still uses `color={t_global_color_status_danger_default.value}` pattern

**Root cause:** The semver-analyzer detected token renames (good) but doesn't know about the `<Icon status="...">` compositional pattern (a usage-level convention).

**Suggested fix:** Add fix-guidance recommending `<Icon status="...">` pattern for colored icons instead of manual token application.

---

### Gap 4.2: Avatar component replacement

**Observed:** Tool renamed CSS classes. Human replaced custom CSS with PF6 `<Avatar>` component.

**Code location:**
- `src/components/viewLayout/viewLayoutToolbar.tsx` -- uses `.quipucords-toolbar__avatar` CSS class
- `src/components/viewLayout/viewLayoutToolbar.css` -- custom CSS still exists (should be deleted)

**Root cause:** This requires recognizing that a custom CSS implementation can be replaced by a PF6 native component -- a judgment call beyond API analysis.

**Suggested fix:** Low-priority; requires human judgment to identify custom code that can be replaced by native components.

---

## Root Cause Summary

| Root Cause | Gaps Affected | Fix Priority |
|-----------|---------------|-------------|
| **fix-guidance.yaml alignment bug** | 1.1, 1.2, 1.3, 2.1, 2.2, 3.3 (indirectly all gaps) | **P0** -- single biggest impact |
| **Semver rule recommends wrong replacement** | 1.1 (PageSection variant) | **P1** -- rule message is wrong |
| **Missing semver rule (structural pattern)** | 2.3 (Button icon-to-prop), 3.1 (innerRef), 3.2 (OUIA) | **P1** -- limits of API-diff approach |
| **Rule exists but LLM doesn't complete** | 2.1 (titleText), 2.2 (Masthead structure) | **P2** -- fix guidance.yaml likely fixes this |
| **CSS rules don't cover .css files** | 1.4, 3.4 (CSS selectors, logical properties) | **P2** -- extend rule scope |
| **LLM inconsistency** | 1.2 (Modal actions in 1 of 8 files) | **P3** -- inherent LLM variability |
| **Beyond API analysis scope** | 4.1 (Icon pattern), 4.2 (Avatar), Tier 5 UX polish | **P4** -- human judgment needed |

### Recommended Action Order

1. **Fix fix-guidance.yaml alignment** -- resolves the data quality bug affecting nearly every rule
2. **Fix PageSection variant rule** -- change recommended replacement from `secondary` to `hasBodyWrapper={false}`
3. **Add Button icon-to-prop rule** -- manual composition rule, pf-codemods has reference implementation
4. **Add MastheadToggle removal rule** -- missing from semver rules
5. **Extend CSS rules to .css files** -- prefix updates and logical property renames
6. **Add EmptyState Title-as-child rule** -- complement existing EmptyStateHeader rules
7. **Add OUIA migration rule** -- simple pattern, high file count
