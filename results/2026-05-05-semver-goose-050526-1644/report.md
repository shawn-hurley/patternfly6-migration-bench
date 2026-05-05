# Migration Evaluation Report

**Tool branch:** `semver/goose/050526-1644`
**Baseline branch:** `pf-codemods-baseline`
**Run date:** 2026-05-05
**Previous run:** `semver/goose/050426-2003` (2026-05-04)

## Summary

| Metric | Score |
|--------|-------|
| Fully correct (3/3) | 51/85 (60%) |
| Partially correct (1-2) | 24/85 (28%) |
| Wrong (0) | 10/85 (12%) |
| Better than pf-codemods | 11 |
| Equal to pf-codemods | 32 |
| Worse than pf-codemods | 23 |
| N/A (codemods doesn't fix) | 19 |
| Codemods-fixable matched (≥3) | 38/66 (58%) |

## Where Tool Beats pf-codemods (11 cases)

These test cases demonstrate unique value beyond what pf-codemods provides:

| TC | Component | Notes |
|----|-----------|-------|
| TC009 | Card | Added proper CardHeader with selectableActions pattern — codemods only removed deprecated props |
| TC027 | EmptyState header | Cleaner EmptyState prop migration — codemods wrapped Title inside titleText |
| TC036 | KebabToggle | Full migration to MenuToggle + EllipsisVIcon — codemods baseline only has manual stubs |
| TC038 | LogSnippet | Proper AlertVariant.danger import — codemods used type assertion workaround |
| TC042 | Masthead | Correct MastheadBrand→MastheadLogo wrapping |
| TC048 | Modal | Full migration to new Modal API (ModalHeader/ModalBody/ModalFooter) — codemods only moved to /deprecated |
| TC049 | Modal next | Correctly kept at @patternfly/react-core with new API — codemods incorrectly moved to /deprecated |
| TC064 | PageNavigation | Clean PageNavigation removal with Nav placed as Page child |
| TC065 | PageSection nav | Clean removal of type='nav' |
| TC079 | Tile | Replaced with Card (full migration) — codemods only moved to deprecated path |
| TC081 | Tokens CSS | Updated CSS token prefixes — codemods left CSS unchanged |

## Where Tool Matches pf-codemods (32 cases)

Parity achieved on these test cases:

TC004, TC012, TC014, TC015, TC018, TC020, TC023, TC024, TC025, TC026, TC028, TC030, TC031, TC033, TC043, TC047, TC050, TC051, TC052, TC053, TC054, TC057, TC058, TC059, TC060, TC063, TC068, TC073, TC074, TC075, TC077, TC083

## Where Tool Falls Short (23 cases)

### Pattern: Props removed without replacement (7 cases)

The tool recognizes deprecated props but strips them entirely instead of renaming/replacing:

| TC | Component | Issue |
|----|-----------|-------|
| TC005 | Avatar | Removed `border` without adding `isBordered` |
| TC006 | Banner | Removed `variant` without adding `color`/`status` |
| TC008 | Button | Removed `isActive` without adding `isClicked` |
| TC011 | Checkbox | Removed `isLabelBeforeButton` without adding `labelPosition='start'` |
| TC021 | DrawerContent | Changed `colorVariant='no-background'` to `'default'` instead of `'primary'` |
| TC037 | Label | Changed `isOverflowLabel` to `isClickable` instead of `variant='overflow'` |
| TC082 | Toolbar | Changed `usePageInsets` to `hasNoPadding` instead of removing |

### Pattern: AccordionToggle isExpanded not moved (3 cases)

| TC | Issue |
|----|-------|
| TC001, TC002, TC003 | Removed `isExpanded` from AccordionToggle but didn't move to AccordionItem |

### Pattern: Unchanged files that needed changes (5 cases)

| TC | Component | Issue |
|----|-----------|-------|
| TC007 | Button | Icon not moved from children to `icon` prop |
| TC010 | Card | selectableActions not updated |
| TC029 | FormFieldGroup | Type interface rename not detected |
| TC046 | MenuToggle | Icon not moved from children to `icon` prop |
| TC084 | Toolbar | Interface renames not detected |

### Pattern: PageSection variant mapping (2 cases)

| TC | Issue |
|----|-------|
| TC062 | Wrong variant (light→secondary, should be light→default); missing hasBodyWrapper |
| TC066 | All variants mapped to 'secondary' — light should map to 'default' |

### Other (6 cases)

| TC | Component | Issue |
|----|-----------|-------|
| TC013 | Chip→Label | onClick not translated to onClose |
| TC016 | DataListAction | Extra structural changes beyond required prop removal |
| TC019 | DrawerHead | Added unnecessary DrawerActions/DrawerCloseButton |
| TC040 | LoginFooter | Used `<a>` instead of Button component |
| TC044 | Masthead | Didn't move MastheadToggle into MastheadMain |
| TC080 | Tokens | Different token name mappings than documented |
| TC085 | Toolbar | Replaced spacer with gap instead of removing |

## Wrong Fixes (score 0, 10 cases)

| TC | Component | Issue |
|----|-----------|-------|
| TC005 | Avatar | border removed without isBordered replacement |
| TC006 | Banner | variant removed without color/status replacement |
| TC007 | Button | Unchanged — icon migration missed |
| TC008 | Button | isActive removed without isClicked replacement |
| TC010 | Card | Unchanged — selectableActions not updated |
| TC022 | DrawerHead | Added unnecessary components when none needed |
| TC029 | FormFieldGroup | Unchanged — interface rename missed |
| TC037 | Label | isOverflowLabel→isClickable (wrong replacement) |
| TC046 | MenuToggle | Unchanged — icon migration missed |
| TC084 | Toolbar | Unchanged — interface rename missed |

## Trend Comparison vs Previous Run (semver/goose/050426-2003)

### Overall

| Metric | Previous | Current | Delta |
|--------|----------|---------|-------|
| Fully correct | 54 | 51 | -3 |
| Partial | 22 | 24 | +2 |
| Wrong | 9 | 10 | +1 |
| Better than codemods | 15 | 11 | -4 |
| Worse than codemods | 18 | 23 | +5 |
| Codemods-fixable matched | 40/66 | 38/66 | -2 |

### Improvements (score went up, 15 cases)

| TC | Component | Previous | Current | Notes |
|----|-----------|----------|---------|-------|
| TC012 | Chip deprecated | 2 | 3 | Now fully replaces with Label/LabelGroup |
| TC013 | Chip→Label | 1 | 2 | Better Chip-to-Label translation |
| TC018 | DragDrop | 2 | 3 | Clean deprecated import migration |
| TC023 | DualListSelector | 1 | 3 | Correct deprecated path |
| TC024 | DualListSelector next | 1 | 3 | Correct import update |
| TC027 | EmptyState header | 1 | 3 | Full prop migration |
| TC040 | LoginFooter | 1 | 2 | Better restructuring (still uses <a> vs Button) |
| TC044 | Masthead structure | 1 | 2 | Added MastheadLogo (still missing Toggle move) |
| TC045 | MenuItemAction | 0 | 1 | Removed MenuContent (unnecessary but not harmful) |
| TC049 | Modal next | 2 | 3 | Full new Modal API migration |
| TC063 | PageHeader tools | 0 | 2 | Acknowledged test design limitation |
| TC070 | Popper/Select | 2 | 3 | Full Select migration to new pattern |
| TC077 | Text→Content | 1 | 3 | Complete Content component migration |
| TC079 | Tile | 1 | 3 | Full Card replacement vs deprecated path |
| TC082 | Toolbar props | 0 | 1 | At least attempts the migration now |

### Regressions (score went down, 13 cases)

| TC | Component | Previous | Current | Notes |
|----|-----------|----------|---------|-------|
| TC001 | Accordion isHidden | 3 | 1 | No longer moves isExpanded to AccordionItem |
| TC002 | Accordion markup | 3 | 1 | Same isExpanded issue |
| TC003 | Accordion toggle | 3 | 1 | Same isExpanded issue |
| TC005 | Avatar border | 1 | 0 | Now removes border entirely without isBordered |
| TC006 | Banner variant | 3 | 0 | Now removes variant entirely without color |
| TC016 | DataList action | 3 | 2 | Added unnecessary structural changes |
| TC019 | Drawer hasNoPadding | 3 | 2 | Added unnecessary components |
| TC021 | Drawer colorVariant | 3 | 1 | Changed to 'default' instead of 'primary' |
| TC022 | Drawer head | 3 | 0 | Added unneeded DrawerActions/CloseButton |
| TC025 | Duplicate imports | 3 | 2 | Evaluator adjustment (test limitation) |
| TC081 | Tokens CSS | 3 | 2 | Different prefix format |
| TC084 | Toolbar interface | 3 | 0 | No longer detects interface rename |
| TC085 | Toolbar spacer | 3 | 2 | Replaced with gap instead of removing |

### Key Regression Patterns

1. **Accordion isExpanded migration broke** — TC001/TC002/TC003 all regressed from 3→1. The tool now removes `isExpanded` from AccordionToggle without moving it to AccordionItem.
2. **"Remove without replace" pattern emerged** — TC005 (border→isBordered) and TC006 (variant→color) now strip props entirely instead of renaming them. This is a significant regression.
3. **Unnecessary additions** — TC019, TC022 now add unrelated components (DrawerActions, DrawerCloseButton) during migration.

## Top 3 Priority Fixes

1. **Prop rename pattern** — The tool strips deprecated props instead of renaming them (TC005, TC006, TC008, TC011, TC021). This affects 7+ test cases and is the highest-impact fix. The tool should map old→new prop names, not just delete.

2. **AccordionToggle isExpanded migration** — TC001/TC002/TC003 all need `isExpanded` moved from AccordionToggle to AccordionItem, not just removed. This was working in the previous run.

3. **Icon-to-prop migration** — TC007 (Button) and TC046 (MenuToggle) both need icons moved from children to the `icon` prop. Neither is handled.
