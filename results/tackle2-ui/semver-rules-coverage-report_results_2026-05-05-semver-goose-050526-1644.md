# Semver Rules Coverage Report — tackle2-ui Migration

**Analysis Date**: 2026-05-14
**Rules Directory**: `results/2026-05-05-semver-goose-050526-1644/semver`
**Ground Truth**: tackle2-ui PR #3246 (85 distinct API changes)

## 1. Executive Summary

**Total changes analyzed**: 85

| Coverage Status | Changes | Occurrences | % of Changes |
|----------------|---------|-------------|--------------|
| Fully Covered | 55 | 736 | 65% |
| Rule Only | 1 | 6 | 1% |
| Wrong Guidance | 3 | 8 | 4% |
| Missing Rule | 15 | 56 | 18% |
| Inherent Gap | 11 | 140 | 13% |
| **Total** | **85** | **946** | **100%** |

**Actionable coverage** (excluding inherent gaps): 56/74 = **76%**

### Top 5 Highest-Impact Gaps (by frequency)

1. **All component CSS variables** (css-component-variable): `--pf-v5-c-{component}--*` → `--pf-v6-c-{component}--*` — 40 occurrences in 15 files
2. **react-tokens** (token-rename): `global_palette_blue_300` → `chart_color_blue_300` — 3 occurrences in 3 files
3. **Label (was Chip)** (prop-rename): `onClick={...}` → `onClose={...}` — 1 occurrences in 1 files
4. **LabelGroup** (prop-rename): `ouiaId={...}` → `data-ouia-component-id={...}` — 1 occurrences in 1 files
5. **Card** (prop-removal): `isFlat` → `removed` — 1 occurrences in 1 files

## 2. Coverage Matrix

| ID | Component | Change | Category | Matching Rule(s) | Fix Strategy | Status | Notes |
|-----|-----------|--------|----------|------------------|-------------|--------|-------|
| A01 | Text/TextContent | `<Text>, <TextContent>` → `<Content>` | component-rename | semver-packages-react-core-src-components-text-text-d-ts-textvariants-removed... | semver-packages-react-core-src-components-text-text-d-ts-tex... | fully-covered | TextVariants→ContentVariants detected with correct LlmAssisted mapping. TextProp... |
| A02 | TextVariants | `TextVariants.p, .h3, .small, .a` → `ContentVariants.p, .... | component-rename | semver-packages-react-core-src-components-text-text-d-ts-textvariants-removed | semver-packages-react-core-src-components-text-text-d-ts-tex... | fully-covered | TextVariants→ContentVariants with member_mappings for all variants. |
| A03 | TextList/TextListItem | `<TextList component="dl">, <TextListItem component="dt">... | component-rename | semver-packages-react-core-src-components-text-textlist-d-ts-textlistvariants... | semver-packages-react-core-src-components-text-textlist-d-ts... | fully-covered | TextListVariants→ContentVariants detected with correct mapping. |
| A04 | ToolbarChip | `ToolbarChip` → `ToolbarLabel` | interface-rename | semver-toolbarchip-component-import-deprecated | semver-toolbarchip-component-import-deprecated | fully-covered | Rule detects ToolbarChip but fix strategy is LlmAssisted with no from/to. Actual... |
| A05 | ToolbarChipGroup | `ToolbarChipGroup` → `ToolbarLabelGroup` | interface-rename | semver-toolbarchipgroup-component-import-deprecated | semver-toolbarchipgroup-component-import-deprecated | fully-covered | Rule detects ToolbarChipGroup but fix strategy has no specific from/to guidance. |
| A06 | Chip | `<Chip>` → `<Label variant="outline">` | component-rename | semver-packages-react-core-src-components-chip-chip-d-ts-chip-signature-chang... | semver-packages-react-core-src-components-chip-chip-d-ts-chi... | fully-covered | Chip→Label detected with LlmAssisted strategy. variant="outline" must be inferre... |
| A07 | ChipGroup | `<ChipGroup>` → `<LabelGroup>` | component-rename | semver-packages-react-core-src-components-chip-chipgroup-d-ts-chipgroup-signa... | semver-packages-react-core-src-components-chip-chipgroup-d-t... | fully-covered | ChipGroup→LabelGroup detected with LlmAssisted strategy. |
| A08 | MastheadBrand | `<MastheadBrand> (old)` → `<MastheadLogo> + new <Masthead... | component-rename | semver-packages-react-core-src-components-masthead-mastheadbrand-mastheadbran... | semver-packages-react-core-src-components-masthead-mastheadb... | fully-covered | MastheadBrand removal + SD conformance rules guide new composition. |
| B01 | Modal | `import { Modal } from '@patternfly/react-core'` → `impor... | import-path-change | semver-modal-component-import-deprecated | semver-modal-component-import-deprecated | fully-covered | Modal→deprecated import path detected with LlmAssisted strategy. |
| B02 | Charts | `import { ChartDonut } from '@patternfly/react-charts'` →... | import-path-change | semver-packages-react-charts-src-components-chartdonut-chartdonut-d-ts-chartd... | semver-packages-react-charts-src-components-chartdonut-chart... | fully-covered | ImportPathChange from @patternfly/react-charts to /victory. 34 chart component r... |
| B03 | DualListSelector | `import { DualListSelector } from '@patternfly/react-core... | import-path-change | semver-duallistselector-component-import-deprecated | semver-duallistselector-component-import-deprecated | fully-covered | DualListSelector→deprecated import path detected. |
| C01 | FormGroup | `labelIcon={...}` → `labelHelp={...}` | prop-rename | semver-packages-react-core-src-components-form-formgroup-formgroupprops-d-ts-... | semver-packages-react-core-src-components-form-formgroup-for... | fully-covered | FormGroup labelIcon→labelHelp detected with Rename strategy. |
| C02 | Page | `header={...}` → `masthead={...}` | prop-rename | semver-packages-react-core-src-components-page-page-pageprops-d-ts-page-heade... | semver-packages-react-core-src-components-page-page-pageprop... | wrong-guidance | Rule detects correctly. Fix strategy uses ImportPathChange (should be Rename). f... |
| C03 | ToolbarFilter | `chips={...}` → `labels={...}` | prop-rename | semver-packages-react-core-src-components-toolbar-toolbarfilter-toolbarfilter... | semver-packages-react-core-src-components-toolbar-toolbarfil... | wrong-guidance | Rule detects correctly. Fix strategy uses ImportPathChange (should be Rename). f... |
| C04 | ToolbarFilter | `deleteChip={...}` → `deleteLabel={...}` | prop-rename | semver-packages-react-core-src-components-toolbar-toolbarfilter-toolbarfilter... | semver-packages-react-core-src-components-toolbar-toolbarfil... | fully-covered | Correct Rename strategy: deleteChip→deleteLabel. |
| C05 | ToolbarFilter | `deleteChipGroup={...}` → `deleteLabelGroup={...}` | prop-rename | semver-packages-react-core-src-components-toolbar-toolbarfilter-toolbarfilter... | semver-packages-react-core-src-components-toolbar-toolbarfil... | fully-covered | Correct Rename strategy: deleteChipGroup→deleteLabelGroup. |
| C06 | MenuToggle | `splitButtonOptions={{ items: [...] }}` → `splitButtonIte... | prop-rename | semver-packages-react-core-src-components-menutoggle-menutoggle-menutogglepro... | semver-packages-react-core-src-components-menutoggle-menutog... | fully-covered | splitButtonOptions type change detected with LlmAssisted. |
| C07 | ToolbarGroup | `spacer={{ default: 'spacerNone' }}` → `gap={{ default: '... | prop-rename | semver-packages-react-core-src-components-toolbar-toolbargroup-toolbargrouppr... | semver-packages-react-core-src-components-toolbar-toolbargro... | wrong-guidance | Rule detects correctly. Fix strategy uses ImportPathChange (should be Rename). f... |
| C08 | Label (was Chip) | `onClick={...}` → `onClose={...}` | prop-rename | — | — | missing-rule | No rule for Chip onClick→onClose rename. Chip→Label rules exist but don't addres... |
| C09 | LabelGroup | `ouiaId={...}` → `data-ouia-component-id={...}` | prop-rename | — | — | missing-rule | No rule for LabelGroup ouiaId→data-ouia-component-id. Only MenuToggle-specific o... |
| C10 | PageSection | `PageSectionVariants.light (enum)` → `removed — use hasBo... | prop-rename | semver-packages-react-core-src-components-page-pagesection-pagesectionprops-v... | semver-packages-react-core-src-components-page-pagesection-p... | fully-covered | PageSection variant enum removal detected. |
| D01 | PageSidebar | `theme={LayoutTheme}` → `removed` | prop-removal | semver-packages-react-core-src-components-page-pagesidebar-pagesidebarprops-d... | semver-packages-react-core-src-components-page-pagesidebar-p... | fully-covered | RemoveProp strategy. |
| D02 | Nav | `theme={LayoutTheme}` → `removed` | prop-removal | semver-packages-react-core-src-components-nav-nav-navprops-d-ts-nav-theme-rem... | semver-packages-react-core-src-components-nav-nav-navprops-d... | fully-covered | RemoveProp strategy. |
| D03 | Card | `isFlat` → `removed` | prop-removal | — | — | missing-rule | No rule for Card isFlat prop removal. Card API rules exist for other props but n... |
| D04 | ToolbarToggleGroup | `spaceItems={{ default: 'spaceItemsMd' }}` → `removed` | prop-removal | semver-packages-react-core-src-components-toolbar-toolbartogglegroup-toolbart... | semver-packages-react-core-src-components-toolbar-toolbartog... | fully-covered | RemoveProp strategy. |
| D05 | ToolbarItem | `widths={{ default: '300px' }}` → `removed` | prop-removal | semver-packages-react-core-src-components-toolbar-toolbaritem-toolbaritemprop... | semver-packages-react-core-src-components-toolbar-toolbarite... | fully-covered | RemoveProp strategy. |
| E01 | PageSection | `variant='light' / PageSectionVariants.light` → `hasBodyW... | prop-value-change | semver-packages-react-core-src-components-page-pagesection-pagesectionprops-v... | semver-packages-react-core-src-components-page-pagesection-p... | fully-covered | PageSection variant='light' removal detected. |
| E02 | ToolbarGroup | `variant='button-group'` → `variant='action-group'` | prop-value-change | semver-packages-react-core-src-components-toolbar-toolbargroup-toolbargroupva... | semver-packages-react-core-src-components-toolbar-toolbargro... | fully-covered | button-group variant removal. Rule message includes new variant names. |
| E03 | ToolbarGroup | `variant='icon-button-group'` → `variant='action-group-pl... | prop-value-change | sd-prop-value-toolbargroup-variant-icon-button-group | sd-prop-value-toolbargroup-variant-icon-button-group | fully-covered | SD rule: icon-button-group→action-group-plain with PropValueChange. |
| E04 | ToolbarItem/ToolbarGroup | `align: { default: 'alignRight' }` → `align: { default: '... | prop-value-change | sd-prop-value-toolbargroup-align-alignright, sd-prop-value-toolbaritem-align-... | sd-prop-value-toolbargroup-align-alignright | fully-covered | SD rules detect alignRight removal. Fix strategy has from='alignRight' but no 't... |
| E05 | Label | `color='cyan'` → `color='teal'` | prop-value-change | semver-packages-react-core-src-components-label-label-labelprops-d-ts-label-c... | semver-packages-react-core-src-components-label-label-labelp... | fully-covered | Label color cyan→teal with PropValueChange. |
| E06 | Pagination | `align: { default: 'alignRight' }` → `align: { default: '... | prop-value-change | — | — | missing-rule | No rule for Pagination align alignRight→alignEnd. Only ToolbarGroup/ToolbarItem ... |
| E07 | PageSection | `<PageSection> (no variant)` → `<PageSection hasBodyWrapp... | prop-value-change | semver-packages-react-core-src-components-page-pagesection-pagesectionprops-d... | semver-packages-react-core-src-components-page-pagesection-p... | fully-covered | hasBodyWrapper new prop detected with PropTypeChange. |
| F01 | EmptyState | `<EmptyStateHeader> + <EmptyStateIcon> as children` → `ti... | structure-change | sd-composition-emptystate-removed-member-emptystateheader, sd-composition-emp... | sd-child-to-prop-emptystate-emptystateicon-to-icon | fully-covered | Comprehensive: header/icon removal, ChildToProp for icon, FamilyMigration for fu... |
| F02 | Button | `<Button><TrashIcon /></Button>` → `<Button icon={<TrashI... | structure-change | semver-css-class-rename-c-button-icon | semver-css-class-rename-c-button-icon | rule-only | Only CSS class rename (pf-v5-c-button__icon→pf-v6). No API rule for icon-as-chil... |
| F03 | Masthead | `<MastheadToggle> sibling of <MastheadMain>` → `<Masthead... | structure-change | sd-cf-masthead-brand-in-main, sd-cf-masthead-brand-not-in-masthead-use-main | sd-cf-masthead-brand-in-main | fully-covered | SD conformance rules guide correct nesting. MastheadToggle should be inside Mast... |
| F04 | PageToggleButton | `<PageToggleButton><BarsIcon /></PageToggleButton>` → `<P... | structure-change | semver-packages-react-core-src-components-page-pagetogglebutton-pagetogglebut... | semver-packages-react-core-src-components-page-pagetogglebut... | fully-covered | hamburgerVariant/isHamburgerButton type change detected. |
| F05 | EmptyStateIcon | `<EmptyStateIcon icon={X} color='black' /> (standalone)` ... | structure-change | sd-composition-emptystate-removed-member-emptystateicon, semver-packages-reac... | semver-packages-react-core-src-components-emptystate-emptyst... | fully-covered | EmptyStateIcon removal and IconProps removal detected. |
| G01 | react-tokens | `global_palette_black_1000` → `chart_color_black_500` | token-rename | — | — | missing-rule | CSS rule for --pf-v5-global--palette--black-1000 exists but won't detect JS impo... |
| G02 | react-tokens | `global_palette_blue_300` → `chart_color_blue_300` | token-rename | — | — | missing-rule | CSS rule maps --pf-v5-global--palette--blue-300→--pf-t--color--blue--40. tackle2... |
| G03 | react-tokens | `global_palette_green_300` → `chart_color_green_300` | token-rename | — | — | missing-rule | CSS rule exists but no JS import detection rule. |
| G04 | react-tokens | `global_palette_orange_300` → `chart_color_orange_300` | token-rename | — | — | missing-rule | CSS rule exists but no JS import detection rule. |
| G05 | react-tokens | `global_palette_black_500` → `no equivalent — manual cons... | token-removal | — | — | missing-rule | JS token removed from @patternfly/react-tokens v6. CSS variable has mapping but ... |
| G06 | react-tokens | `global_palette_cyan_300` → `no equivalent — manual const... | token-removal | — | — | missing-rule | JS token removed. CSS maps to --pf-t--color--teal--60 but no react-tokens v6 exp... |
| G07 | react-tokens | `global_palette_gold_300` → `no equivalent — manual const... | token-removal | — | — | missing-rule | JS token removed. CSS maps to --pf-t--color--yellow--30 but no react-tokens v6 e... |
| G08 | react-tokens | `global_palette_purple_600` → `no equivalent — manual con... | token-removal | — | — | missing-rule | JS token removed. CSS maps to --pf-t--color--purple--60 but no react-tokens v6 e... |
| G09 | react-tokens | `global_danger_color_100` → `t_global_color_status_danger... | token-rename | semver-consumer-css-rename-var-pf-v5-global-danger-color-100 | semver-consumer-css-rename-var-pf-v5-global-danger-color-100 | fully-covered | CSS variable rename with correct mapping. Non-palette token with direct equivale... |
| G10 | react-tokens | `global_Color_dark_200` → `t_global_text_color_200` | token-rename | semver-consumer-css-rename-var-pf-v5-global-color-dark-200 | semver-consumer-css-rename-var-pf-v5-global-color-dark-200 | fully-covered | CSS variable rename with correct mapping. |
| G11 | react-tokens | `global_disabled_color_200` → `t_global_text_color_disabled` | token-rename | semver-consumer-css-rename-var-pf-v5-global-disabled-color-200 | semver-consumer-css-rename-var-pf-v5-global-disabled-color-2... | fully-covered | CSS variable rename with correct mapping. |
| G12 | react-tokens | `global_info_color_100` → `t_global_color_status_info_def... | token-rename | semver-consumer-css-rename-var-pf-v5-global-info-color-100 | semver-consumer-css-rename-var-pf-v5-global-info-color-100 | fully-covered | CSS variable rename with correct mapping. |
| G13 | react-tokens | `global_info_color_200` → `t_global_color_status_info_200` | token-rename | semver-consumer-css-rename-var-pf-v5-global-info-color-200 | semver-consumer-css-rename-var-pf-v5-global-info-color-200 | fully-covered | CSS variable rename with correct mapping. |
| G14 | react-tokens | `global_success_color_100` → `t_global_color_status_succe... | token-rename | semver-consumer-css-rename-var-pf-v5-global-success-color-100 | semver-consumer-css-rename-var-pf-v5-global-success-color-10... | fully-covered | CSS variable rename with correct mapping. |
| G15 | react-tokens | `global_danger_color_200` → `removed entirely (EmptyState... | token-removal | semver-consumer-css-rename-var-pf-v5-global-danger-color-200 | semver-consumer-css-rename-var-pf-v5-global-danger-color-200 | fully-covered | CSS variable has mapping. Token removal in JS but CSS equivalent exists. |
| G16 | react-tokens | `global_palette_black_300` → `chart_color_black_200` | token-rename | — | — | missing-rule | CSS rule for --pf-v5-global--palette--black-300 exists but no JS import detectio... |
| H01 | All components | `pf-v5-c-* (e.g., pf-v5-c-button)` → `pf-v6-c-* (e.g., pf... | css-class-prefix | (556 semver-css-class-rename-c-* rules) | semver-css-class-rename-c-button | fully-covered | 556 component CSS class rename rules with CssVariablePrefix strategy. |
| H02 | Layout classes | `pf-v5-l-* (e.g., pf-v5-l-stack)` → `pf-v6-l-* (e.g., pf-... | css-class-prefix | (14 semver-css-class-rename-l-* rules) | semver-css-class-rename-l-bullseye | fully-covered | 14 layout CSS class rename rules. |
| H03 | Utility classes | `pf-v5-u-* (e.g., pf-v5-u-color-200)` → `pf-v6-u-* (e.g.,... | css-class-prefix | (1446 semver-css-class-rename-u-* rules) | semver-css-class-rename-u-align-content-center | fully-covered | 1446 utility CSS class rename rules. |
| H04 | SVG classes | `pf-v5-svg` → `pf-v6-svg` | css-class-prefix | semver-css-class-rename-svg | semver-css-class-rename-svg | fully-covered | SVG class rename rule. |
| I01 | Spacer tokens | `--pf-v5-global--spacer--{xl,lg,md,sm,xs}` → `--pf-t--glo... | css-global-token | semver-consumer-css-rename-var-pf-v5-global-spacer-xl, semver-consumer-css-re... | semver-consumer-css-rename-var-pf-v5-global-spacer-xl | fully-covered | 9 spacer token rules with CssVariablePrefix. |
| I02 | Danger color | `--pf-v5-global--danger-color--100` → `--pf-t--global--co... | css-global-token | semver-consumer-css-rename-var-pf-v5-global-danger-color-100 | semver-consumer-css-rename-var-pf-v5-global-danger-color-100 | fully-covered | Correct mapping to --pf-t--global--color--status--danger--default. |
| I03 | Background color | `--pf-v5-global--BackgroundColor--100` → `--pf-t--global-... | css-global-token | semver-consumer-css-rename-var-pf-v5-global-backgroundcolor-100 | semver-consumer-css-rename-var-pf-v5-global-backgroundcolor-... | fully-covered | Correct mapping. |
| I04 | Border color | `--pf-v5-global--BorderColor--100` → `--pf-t--global--bor... | css-global-token | semver-consumer-css-rename-var-pf-v5-global-bordercolor-100 | semver-consumer-css-rename-var-pf-v5-global-bordercolor-100 | fully-covered | Correct mapping. |
| I05 | Success color | `--pf-v5-global--success-color--100` → `--pf-t--global--c... | css-global-token | semver-consumer-css-rename-var-pf-v5-global-success-color-100 | semver-consumer-css-rename-var-pf-v5-global-success-color-10... | fully-covered | Correct mapping. |
| I06 | Warning color | `--pf-v5-global--warning-color--100` → `--pf-t--global--c... | css-global-token | semver-consumer-css-rename-var-pf-v5-global-warning-color-100 | semver-consumer-css-rename-var-pf-v5-global-warning-color-10... | fully-covered | Correct mapping. |
| I07 | Font size | `--pf-v5-global--FontSize--md / --lg` → `--pf-t--global--... | css-global-token | semver-consumer-css-rename-var-pf-v5-global-fontsize-md, semver-consumer-css-... | semver-consumer-css-rename-var-pf-v5-global-fontsize-md | fully-covered | Font size CSS variable renames. |
| J01 | All component CSS variables | `--pf-v5-c-{component}--*` → `--pf-v6-c-{component}--*` | css-component-variable | — | — | missing-rule | No rules for --pf-v5-c-{component}--* CSS variables. Only global CSS variables a... |
| J02 | Nav | `--pf-v5-c-nav__link--before--BorderColor` → `--pf-v6-c-n... | css-component-variable | — | — | missing-rule | No rule for --pf-v5-c-nav__link--before--BorderColor→--pf-v6-c-nav__link--Border... |
| K01 | Menu/Dropdown | `Menus render inside parent DOM` → `Menus render via Popp... | behavior-change | — | — | inherent-gap | Portal rendering is runtime behavior. Affects test assertions on DOM placement. ... |
| K02 | Switch | `.pf-m-on / .pf-m-off CSS classes for state` → `Native :c... | behavior-change | — | — | inherent-gap | CSS class state→:checked is internal rendering. Affects test selectors (pf-m-on/... |
| K03 | Button | `pf-m-disabled CSS class` → `Native disabled HTML attribute` | behavior-change | — | — | inherent-gap | pf-m-disabled→native disabled attribute. Affects test assertions on DOM attribut... |
| K04 | Button | `Text as direct child` → `Text wrapped in <span class='pf... | markup-change | — | — | inherent-gap | Internal DOM structure (text wrapper span). Affects test selectors for button te... |
| K05 | Button | `Icon as direct child` → `Icon wrapped in <span class='pf... | markup-change | — | — | inherent-gap | Internal DOM structure (icon wrapper span). Affects test selectors for button ic... |
| K06 | Button | `aria-disabled='false' rendered` → `aria-disabled attribu... | markup-change | — | — | inherent-gap | aria-disabled attribute removal from rendered output. Affects test assertions on... |
| K07 | All (OUIA) | `data-ouia-component-type='PF5/*'` → `data-ouia-component... | markup-change | — | — | inherent-gap | OUIA prefix PF5/*→PF6/* is automatic internal version change. Affects test asser... |
| K08 | Content | `<p> without semantic class` → `<p class='pf-v6-c-content... | markup-change | — | — | inherent-gap | Content <p> getting class='pf-v6-c-content--p' is internal markup change. Affect... |
| K09 | EmptyState | `Inline --pf-v5-c-empty-state__icon--Color style` → `Styl... | markup-change | — | — | inherent-gap | EmptyState icon inline color style removal. Rendering behavior not visible in JS... |
| K10 | DatePicker | `Duplicate date buttons rendered` → `Single date button o... | behavior-change | — | — | inherent-gap | Duplicate date button fix is internal rendering behavior. Only detectable via ru... |
| K11 | Tabs | `Tab items found via CSS selector` → `Tab items found via... | behavior-change | — | — | inherent-gap | Tab item discovery via OUIA attributes is a test selector concern. Runtime DOM o... |
| L01 | @patternfly/patternfly | `5.4.2` → `6.4.0` | package-upgrade | semver-dep-update-patternfly-patternfly | semver-dep-update-patternfly-patternfly | fully-covered | EnsureDependency to ^6.4.0. |
| L02 | @patternfly/react-core | `5.4.14` → `6.4.3` | package-upgrade | semver-dep-update-patternfly-react-core | semver-dep-update-patternfly-react-core | fully-covered | EnsureDependency to ^6.4.1. |
| L03 | @patternfly/react-table | `5.4.16` → `6.4.3` | package-upgrade | semver-dep-update-patternfly-react-table | semver-dep-update-patternfly-react-table | fully-covered | EnsureDependency to ^6.4.1. |
| L04 | @patternfly/react-charts | `7.4.9` → `8.4.1` | package-upgrade | semver-dep-update-patternfly-react-charts | semver-dep-update-patternfly-react-charts | fully-covered | EnsureDependency to ^8.4.1. |
| L05 | @patternfly/react-code-editor | `5.4.18` → `6.4.3` | package-upgrade | semver-dep-update-patternfly-react-code-editor | semver-dep-update-patternfly-react-code-editor | fully-covered | EnsureDependency to ^6.4.1. |
| L06 | @patternfly/react-tokens | `5.4.1` → `6.4.0` | package-upgrade | semver-dep-update-patternfly-react-tokens | semver-dep-update-patternfly-react-tokens | fully-covered | EnsureDependency to ^6.4.0. |
| L07 | victory | `None` → `^37.3.6` | new-dependency | semver-manifest-peerdependencies-victory-core-peer-dependency-added | semver-manifest-peerdependencies-victory-core-peer-dependenc... | fully-covered | 17 victory peer dependency rules. EnsureDependency strategy. |

## 3. Fully Covered Changes

55 changes are fully covered with both detection rules and correct fix strategies.

- **A01** Text/TextContent: `<Text>, <TextContent>` → `<Content>` (freq=270)
  - Rule: `semver-packages-react-core-src-components-text-text-d-ts-textvariants-removed`
  - Fix: `semver-packages-react-core-src-components-text-text-d-ts-textvariants-removed`
- **A02** TextVariants: `TextVariants.p, .h3, .small, .a` → `ContentVariants.p, .h3, .small, .a` (freq=27)
  - Rule: `semver-packages-react-core-src-components-text-text-d-ts-textvariants-removed`
  - Fix: `semver-packages-react-core-src-components-text-text-d-ts-textvariants-removed`
- **A03** TextList/TextListItem: `<TextList component="dl">, <TextListItem component="dt">` → `<Content component="dl">, <Content component="dt">` (freq=3)
  - Rule: `semver-packages-react-core-src-components-text-textlist-d-ts-textlistvariants-removed`
  - Fix: `semver-packages-react-core-src-components-text-textlist-d-ts-textlistvariants-removed`
- **A04** ToolbarChip: `ToolbarChip` → `ToolbarLabel` (freq=7)
  - Rule: `semver-toolbarchip-component-import-deprecated`
  - Fix: `semver-toolbarchip-component-import-deprecated`
- **A05** ToolbarChipGroup: `ToolbarChipGroup` → `ToolbarLabelGroup` (freq=1)
  - Rule: `semver-toolbarchipgroup-component-import-deprecated`
  - Fix: `semver-toolbarchipgroup-component-import-deprecated`
- **A06** Chip: `<Chip>` → `<Label variant="outline">` (freq=1)
  - Rule: `semver-packages-react-core-src-components-chip-chip-d-ts-chip-signature-changed`
  - Fix: `semver-packages-react-core-src-components-chip-chip-d-ts-chip-signature-changed`
- **A07** ChipGroup: `<ChipGroup>` → `<LabelGroup>` (freq=1)
  - Rule: `semver-packages-react-core-src-components-chip-chipgroup-d-ts-chipgroup-signature-changed`
  - Fix: `semver-packages-react-core-src-components-chip-chipgroup-d-ts-chipgroup-signature-changed`
- **A08** MastheadBrand: `<MastheadBrand> (old)` → `<MastheadLogo> + new <MastheadBrand> wrapper` (freq=1)
  - Rule: `semver-packages-react-core-src-components-masthead-mastheadbrand-mastheadbrandprops-d-ts-mastheadbrand-component-removed`
  - Fix: `semver-packages-react-core-src-components-masthead-mastheadbrand-mastheadbrandprops-d-ts-mastheadbrand-component-removed`
- **B01** Modal: `import { Modal } from '@patternfly/react-core'` → `import { Modal } from '@patternfly/react-core/deprecated'` (freq=31)
  - Rule: `semver-modal-component-import-deprecated`
  - Fix: `semver-modal-component-import-deprecated`
- **B02** Charts: `import { ChartDonut } from '@patternfly/react-charts'` → `import { ChartDonut } from '@patternfly/react-charts/victory'` (freq=4)
  - Rule: `semver-packages-react-charts-src-components-chartdonut-chartdonut-d-ts-chartdonut-renamed`
  - Fix: `semver-packages-react-charts-src-components-chartdonut-chartdonut-d-ts-chartdonut-renamed`
- **B03** DualListSelector: `import { DualListSelector } from '@patternfly/react-core'` → `import { DualListSelector } from '@patternfly/react-core/deprecated'` (freq=1)
  - Rule: `semver-duallistselector-component-import-deprecated`
  - Fix: `semver-duallistselector-component-import-deprecated`
- **C01** FormGroup: `labelIcon={...}` → `labelHelp={...}` (freq=1)
  - Rule: `semver-packages-react-core-src-components-form-formgroup-formgroupprops-d-ts-formgroup-labelicon-renamed`
  - Fix: `semver-packages-react-core-src-components-form-formgroup-formgroupprops-d-ts-formgroup-labelicon-renamed`
- **C04** ToolbarFilter: `deleteChip={...}` → `deleteLabel={...}` (freq=5)
  - Rule: `semver-packages-react-core-src-components-toolbar-toolbarfilter-toolbarfilterprops-d-ts-toolbarfilter-deletechip-renamed`
  - Fix: `semver-packages-react-core-src-components-toolbar-toolbarfilter-toolbarfilterprops-d-ts-toolbarfilter-deletechip-renamed`
- **C05** ToolbarFilter: `deleteChipGroup={...}` → `deleteLabelGroup={...}` (freq=3)
  - Rule: `semver-packages-react-core-src-components-toolbar-toolbarfilter-toolbarfilterprops-d-ts-toolbarfilter-deletechipgroup-renamed`
  - Fix: `semver-packages-react-core-src-components-toolbar-toolbarfilter-toolbarfilterprops-d-ts-toolbarfilter-deletechipgroup-renamed`
- **C06** MenuToggle: `splitButtonOptions={{ items: [...] }}` → `splitButtonItems={[...]}` (freq=1)
  - Rule: `semver-packages-react-core-src-components-menutoggle-menutoggle-menutoggleprops-d-ts-menutoggle-splitbuttonoptions-signature-changed`
  - Fix: `semver-packages-react-core-src-components-menutoggle-menutoggle-menutoggleprops-d-ts-menutoggle-splitbuttonoptions-signature-changed`
- **C10** PageSection: `PageSectionVariants.light (enum)` → `removed — use hasBodyWrapper` (freq=10)
  - Rule: `semver-packages-react-core-src-components-page-pagesection-pagesectionprops-variant-d-ts-pagesection-variant-variant-removed-group-3`
  - Fix: `semver-packages-react-core-src-components-page-pagesection-pagesectionprops-variant-d-ts-pagesection-variant-variant-removed-group-3`
- **D01** PageSidebar: `theme={LayoutTheme}` → `removed` (freq=1)
  - Rule: `semver-packages-react-core-src-components-page-pagesidebar-pagesidebarprops-d-ts-pagesidebar-theme-removed`
  - Fix: `semver-packages-react-core-src-components-page-pagesidebar-pagesidebarprops-d-ts-pagesidebar-theme-removed`
- **D02** Nav: `theme={LayoutTheme}` → `removed` (freq=1)
  - Rule: `semver-packages-react-core-src-components-nav-nav-navprops-d-ts-nav-theme-removed`
  - Fix: `semver-packages-react-core-src-components-nav-nav-navprops-d-ts-nav-theme-removed`
- **D04** ToolbarToggleGroup: `spaceItems={{ default: 'spaceItemsMd' }}` → `removed` (freq=1)
  - Rule: `semver-packages-react-core-src-components-toolbar-toolbartogglegroup-toolbartogglegroupprops-d-ts-toolbartogglegroup-spaceitems-removed`
  - Fix: `semver-packages-react-core-src-components-toolbar-toolbartogglegroup-toolbartogglegroupprops-d-ts-toolbartogglegroup-spaceitems-removed`
- **D05** ToolbarItem: `widths={{ default: '300px' }}` → `removed` (freq=1)
  - Rule: `semver-packages-react-core-src-components-toolbar-toolbaritem-toolbaritemprops-d-ts-toolbaritem-widths-removed`
  - Fix: `semver-packages-react-core-src-components-toolbar-toolbaritem-toolbaritemprops-d-ts-toolbaritem-widths-removed`
- **E01** PageSection: `variant='light' / PageSectionVariants.light` → `hasBodyWrapper={false}` (freq=35)
  - Rule: `semver-packages-react-core-src-components-page-pagesection-pagesectionprops-variant-d-ts-pagesection-variant-variant-removed-group-3`
  - Fix: `semver-packages-react-core-src-components-page-pagesection-pagesectionprops-variant-d-ts-pagesection-variant-variant-removed-group-3`
- **E02** ToolbarGroup: `variant='button-group'` → `variant='action-group'` (freq=17)
  - Rule: `semver-packages-react-core-src-components-toolbar-toolbargroup-toolbargroupvariant-d-ts-toolbargroupvariant-button-group-removed-group-2`
  - Fix: `semver-packages-react-core-src-components-toolbar-toolbargroup-toolbargroupvariant-d-ts-toolbargroupvariant-button-group-removed-group-2`
- **E03** ToolbarGroup: `variant='icon-button-group'` → `variant='action-group-plain'` (freq=4)
  - Rule: `sd-prop-value-toolbargroup-variant-icon-button-group`
  - Fix: `sd-prop-value-toolbargroup-variant-icon-button-group`
- **E04** ToolbarItem/ToolbarGroup: `align: { default: 'alignRight' }` → `align: { default: 'alignEnd' }` (freq=2)
  - Rule: `sd-prop-value-toolbargroup-align-alignright`
  - Fix: `sd-prop-value-toolbargroup-align-alignright`
- **E05** Label: `color='cyan'` → `color='teal'` (freq=1)
  - Rule: `semver-packages-react-core-src-components-label-label-labelprops-d-ts-label-color-type-changed-val-cyan-group-2`
  - Fix: `semver-packages-react-core-src-components-label-label-labelprops-d-ts-label-color-type-changed-val-cyan-group-2`
- **E07** PageSection: `<PageSection> (no variant)` → `<PageSection hasBodyWrapper={false}>` (freq=15)
  - Rule: `semver-packages-react-core-src-components-page-pagesection-pagesectionprops-d-ts-pagesection-hasbodywrapper-signature-changed`
  - Fix: `semver-packages-react-core-src-components-page-pagesection-pagesectionprops-d-ts-pagesection-hasbodywrapper-signature-changed`
- **F01** EmptyState: `<EmptyStateHeader> + <EmptyStateIcon> as children` → `titleText, icon, headingLevel as props on <EmptyState>` (freq=25)
  - Rule: `sd-composition-emptystate-removed-member-emptystateheader`
  - Fix: `sd-child-to-prop-emptystate-emptystateicon-to-icon`
- **F03** Masthead: `<MastheadToggle> sibling of <MastheadMain>` → `<MastheadToggle> nested inside <MastheadMain>` (freq=1)
  - Rule: `sd-cf-masthead-brand-in-main`
  - Fix: `sd-cf-masthead-brand-in-main`
- **F04** PageToggleButton: `<PageToggleButton><BarsIcon /></PageToggleButton>` → `<PageToggleButton isHamburgerButton />` (freq=1)
  - Rule: `semver-packages-react-core-src-components-page-pagetogglebutton-pagetogglebuttonprops-d-ts-pagetogglebutton-hamburgervariant-signature-changed-group-2`
  - Fix: `semver-packages-react-core-src-components-page-pagetogglebutton-pagetogglebuttonprops-d-ts-pagetogglebutton-hamburgervariant-signature-changed-group-2`
- **F05** EmptyStateIcon: `<EmptyStateIcon icon={X} color='black' /> (standalone)` → `Render icon component directly` (freq=1)
  - Rule: `sd-composition-emptystate-removed-member-emptystateicon`
  - Fix: `semver-packages-react-core-src-components-emptystate-emptystateicon-d-ts-iconprops-removed`
- **G09** react-tokens: `global_danger_color_100` → `t_global_color_status_danger_default` (freq=1)
  - Rule: `semver-consumer-css-rename-var-pf-v5-global-danger-color-100`
  - Fix: `semver-consumer-css-rename-var-pf-v5-global-danger-color-100`
- **G10** react-tokens: `global_Color_dark_200` → `t_global_text_color_200` (freq=1)
  - Rule: `semver-consumer-css-rename-var-pf-v5-global-color-dark-200`
  - Fix: `semver-consumer-css-rename-var-pf-v5-global-color-dark-200`
- **G11** react-tokens: `global_disabled_color_200` → `t_global_text_color_disabled` (freq=1)
  - Rule: `semver-consumer-css-rename-var-pf-v5-global-disabled-color-200`
  - Fix: `semver-consumer-css-rename-var-pf-v5-global-disabled-color-200`
- **G12** react-tokens: `global_info_color_100` → `t_global_color_status_info_default` (freq=1)
  - Rule: `semver-consumer-css-rename-var-pf-v5-global-info-color-100`
  - Fix: `semver-consumer-css-rename-var-pf-v5-global-info-color-100`
- **G13** react-tokens: `global_info_color_200` → `t_global_color_status_info_200` (freq=1)
  - Rule: `semver-consumer-css-rename-var-pf-v5-global-info-color-200`
  - Fix: `semver-consumer-css-rename-var-pf-v5-global-info-color-200`
- **G14** react-tokens: `global_success_color_100` → `t_global_color_status_success_default` (freq=1)
  - Rule: `semver-consumer-css-rename-var-pf-v5-global-success-color-100`
  - Fix: `semver-consumer-css-rename-var-pf-v5-global-success-color-100`
- **G15** react-tokens: `global_danger_color_200` → `removed entirely (EmptyStateIcon color no longer used)` (freq=1)
  - Rule: `semver-consumer-css-rename-var-pf-v5-global-danger-color-200`
  - Fix: `semver-consumer-css-rename-var-pf-v5-global-danger-color-200`
- **H01** All components: `pf-v5-c-* (e.g., pf-v5-c-button)` → `pf-v6-c-* (e.g., pf-v6-c-button)` (freq=200)
  - Rule: `(556 semver-css-class-rename-c-* rules)`
  - Fix: `semver-css-class-rename-c-button`
- **H02** Layout classes: `pf-v5-l-* (e.g., pf-v5-l-stack)` → `pf-v6-l-* (e.g., pf-v6-l-stack)` (freq=10)
  - Rule: `(14 semver-css-class-rename-l-* rules)`
  - Fix: `semver-css-class-rename-l-bullseye`
- **H03** Utility classes: `pf-v5-u-* (e.g., pf-v5-u-color-200)` → `pf-v6-u-* (e.g., pf-v6-u-color-200)` (freq=15)
  - Rule: `(1446 semver-css-class-rename-u-* rules)`
  - Fix: `semver-css-class-rename-u-align-content-center`
- **H04** SVG classes: `pf-v5-svg` → `pf-v6-svg` (freq=4)
  - Rule: `semver-css-class-rename-svg`
  - Fix: `semver-css-class-rename-svg`
- **I01** Spacer tokens: `--pf-v5-global--spacer--{xl,lg,md,sm,xs}` → `--pf-t--global--spacer--{xl,lg,md,sm,xs}` (freq=10)
  - Rule: `semver-consumer-css-rename-var-pf-v5-global-spacer-xl`
  - Fix: `semver-consumer-css-rename-var-pf-v5-global-spacer-xl`
- **I02** Danger color: `--pf-v5-global--danger-color--100` → `--pf-t--global--color--status--danger--default` (freq=1)
  - Rule: `semver-consumer-css-rename-var-pf-v5-global-danger-color-100`
  - Fix: `semver-consumer-css-rename-var-pf-v5-global-danger-color-100`
- **I03** Background color: `--pf-v5-global--BackgroundColor--100` → `--pf-t--global--background--color--primary--default` (freq=3)
  - Rule: `semver-consumer-css-rename-var-pf-v5-global-backgroundcolor-100`
  - Fix: `semver-consumer-css-rename-var-pf-v5-global-backgroundcolor-100`
- **I04** Border color: `--pf-v5-global--BorderColor--100` → `--pf-t--global--border--color--default` (freq=1)
  - Rule: `semver-consumer-css-rename-var-pf-v5-global-bordercolor-100`
  - Fix: `semver-consumer-css-rename-var-pf-v5-global-bordercolor-100`
- **I05** Success color: `--pf-v5-global--success-color--100` → `--pf-t--global--color--status--success--default` (freq=1)
  - Rule: `semver-consumer-css-rename-var-pf-v5-global-success-color-100`
  - Fix: `semver-consumer-css-rename-var-pf-v5-global-success-color-100`
- **I06** Warning color: `--pf-v5-global--warning-color--100` → `--pf-t--global--color--status--warning--default` (freq=1)
  - Rule: `semver-consumer-css-rename-var-pf-v5-global-warning-color-100`
  - Fix: `semver-consumer-css-rename-var-pf-v5-global-warning-color-100`
- **I07** Font size: `--pf-v5-global--FontSize--md / --lg` → `--pf-t--global--font--size--body--default / --body--lg` (freq=3)
  - Rule: `semver-consumer-css-rename-var-pf-v5-global-fontsize-md`
  - Fix: `semver-consumer-css-rename-var-pf-v5-global-fontsize-md`
- **L01** @patternfly/patternfly: `5.4.2` → `6.4.0` (freq=1)
  - Rule: `semver-dep-update-patternfly-patternfly`
  - Fix: `semver-dep-update-patternfly-patternfly`
- **L02** @patternfly/react-core: `5.4.14` → `6.4.3` (freq=1)
  - Rule: `semver-dep-update-patternfly-react-core`
  - Fix: `semver-dep-update-patternfly-react-core`
- **L03** @patternfly/react-table: `5.4.16` → `6.4.3` (freq=1)
  - Rule: `semver-dep-update-patternfly-react-table`
  - Fix: `semver-dep-update-patternfly-react-table`
- **L04** @patternfly/react-charts: `7.4.9` → `8.4.1` (freq=1)
  - Rule: `semver-dep-update-patternfly-react-charts`
  - Fix: `semver-dep-update-patternfly-react-charts`
- **L05** @patternfly/react-code-editor: `5.4.18` → `6.4.3` (freq=1)
  - Rule: `semver-dep-update-patternfly-react-code-editor`
  - Fix: `semver-dep-update-patternfly-react-code-editor`
- **L06** @patternfly/react-tokens: `5.4.1` → `6.4.0` (freq=1)
  - Rule: `semver-dep-update-patternfly-react-tokens`
  - Fix: `semver-dep-update-patternfly-react-tokens`
- **L07** victory: `None` → `^37.3.6` (freq=1)
  - Rule: `semver-manifest-peerdependencies-victory-core-peer-dependency-added`
  - Fix: `semver-manifest-peerdependencies-victory-core-peer-dependency-added`

## 4. Rules Without Fix Strategies

### F02: Button — structure-change
- **Change**: `<Button><TrashIcon /></Button>` → `<Button icon={<TrashIcon />} />`
- **Frequency**: 6 occurrences in 5 files
- **Matching Rule**: `semver-css-class-rename-c-button-icon`
- **Issue**: Only CSS class rename (pf-v5-c-button__icon→pf-v6). No API rule for icon-as-child→icon-as-prop structural change.

## 5. Wrong Guidance

### C02: Page — prop-rename
- **Change**: `header={...}` → `masthead={...}`
- **Frequency**: 1 occurrences in 1 files
- **Rule**: `semver-packages-react-core-src-components-page-page-pageprops-d-ts-page-header-renamed`
- **Fix Strategy**: `semver-packages-react-core-src-components-page-page-pageprops-d-ts-page-header-renamed`
- **Problem**: Rule detects correctly. Fix strategy uses ImportPathChange (should be Rename). from='header' to='masthead' values correct but strategy type is wrong.

### C03: ToolbarFilter — prop-rename
- **Change**: `chips={...}` → `labels={...}`
- **Frequency**: 5 occurrences in 4 files
- **Rule**: `semver-packages-react-core-src-components-toolbar-toolbarfilter-toolbarfilterprops-d-ts-toolbarfilter-chips-renamed`
- **Fix Strategy**: `semver-packages-react-core-src-components-toolbar-toolbarfilter-toolbarfilterprops-d-ts-toolbarfilter-chips-renamed`
- **Problem**: Rule detects correctly. Fix strategy uses ImportPathChange (should be Rename). from='chips' to='labels' values correct but strategy type wrong.

### C07: ToolbarGroup — prop-rename
- **Change**: `spacer={{ default: 'spacerNone' }}` → `gap={{ default: 'gapNone' }}`
- **Frequency**: 2 occurrences in 1 files
- **Rule**: `semver-packages-react-core-src-components-toolbar-toolbargroup-toolbargroupprops-d-ts-toolbargroup-spacer-renamed`
- **Fix Strategy**: `semver-packages-react-core-src-components-toolbar-toolbargroup-toolbargroupprops-d-ts-toolbargroup-spacer-renamed`
- **Problem**: Rule detects correctly. Fix strategy uses ImportPathChange (should be Rename). from='spacer' to='gap' values correct but strategy type wrong.

## 6. Missing Rules (Highest Priority)

Ordered by real-world frequency:

### J01: All component CSS variables — css-component-variable (freq=40, files=15)
- **Change**: `--pf-v5-c-{component}--*` → `--pf-v6-c-{component}--*`
- **Gap Analysis**: No rules for --pf-v5-c-{component}--* CSS variables. Only global CSS variables and class renames are covered. 14 component families affected.

### G02: react-tokens — token-rename (freq=3, files=3)
- **Change**: `global_palette_blue_300` → `chart_color_blue_300`
- **Gap Analysis**: CSS rule maps --pf-v5-global--palette--blue-300→--pf-t--color--blue--40. tackle2-ui uses chart_color_blue_300 (different token).

### C08: Label (was Chip) — prop-rename (freq=1, files=1)
- **Change**: `onClick={...}` → `onClose={...}`
- **Gap Analysis**: No rule for Chip onClick→onClose rename. Chip→Label rules exist but don't address this prop mapping.

### C09: LabelGroup — prop-rename (freq=1, files=1)
- **Change**: `ouiaId={...}` → `data-ouia-component-id={...}`
- **Gap Analysis**: No rule for LabelGroup ouiaId→data-ouia-component-id. Only MenuToggle-specific ouia rules exist.

### D03: Card — prop-removal (freq=1, files=1)
- **Change**: `isFlat` → `removed`
- **Gap Analysis**: No rule for Card isFlat prop removal. Card API rules exist for other props but not isFlat.

### E06: Pagination — prop-value-change (freq=1, files=1)
- **Change**: `align: { default: 'alignRight' }` → `align: { default: 'alignEnd' }`
- **Gap Analysis**: No rule for Pagination align alignRight→alignEnd. Only ToolbarGroup/ToolbarItem align rules exist.

### G01: react-tokens — token-rename (freq=1, files=1)
- **Change**: `global_palette_black_1000` → `chart_color_black_500`
- **Gap Analysis**: CSS rule for --pf-v5-global--palette--black-1000 exists but won't detect JS import. Also: CSS maps to --pf-t--color--gray--95 but tackle2-ui needs chart_color_black_500.

### G03: react-tokens — token-rename (freq=1, files=1)
- **Change**: `global_palette_green_300` → `chart_color_green_300`
- **Gap Analysis**: CSS rule exists but no JS import detection rule.

### G04: react-tokens — token-rename (freq=1, files=1)
- **Change**: `global_palette_orange_300` → `chart_color_orange_300`
- **Gap Analysis**: CSS rule exists but no JS import detection rule.

### G05: react-tokens — token-removal (freq=1, files=1)
- **Change**: `global_palette_black_500` → `no equivalent — manual constant required`
- **Gap Analysis**: JS token removed from @patternfly/react-tokens v6. CSS variable has mapping but no react-tokens equivalent.

### G06: react-tokens — token-removal (freq=1, files=1)
- **Change**: `global_palette_cyan_300` → `no equivalent — manual constant using teal CSS variable`
- **Gap Analysis**: JS token removed. CSS maps to --pf-t--color--teal--60 but no react-tokens v6 export.

### G07: react-tokens — token-removal (freq=1, files=1)
- **Change**: `global_palette_gold_300` → `no equivalent — manual constant required`
- **Gap Analysis**: JS token removed. CSS maps to --pf-t--color--yellow--30 but no react-tokens v6 export.

### G08: react-tokens — token-removal (freq=1, files=1)
- **Change**: `global_palette_purple_600` → `no equivalent — manual constant required`
- **Gap Analysis**: JS token removed. CSS maps to --pf-t--color--purple--60 but no react-tokens v6 export.

### G16: react-tokens — token-rename (freq=1, files=1)
- **Change**: `global_palette_black_300` → `chart_color_black_200`
- **Gap Analysis**: CSS rule for --pf-v5-global--palette--black-300 exists but no JS import detection. Palette token.

### J02: Nav — css-component-variable (freq=1, files=1)
- **Change**: `--pf-v5-c-nav__link--before--BorderColor` → `--pf-v6-c-nav__link--BorderColor`
- **Gap Analysis**: No rule for --pf-v5-c-nav__link--before--BorderColor→--pf-v6-c-nav__link--BorderColor. Non-trivial structural rename.


## 7. Inherent Gaps

11 changes depend on runtime state, internal DOM structure, or rendered output not visible in the JSX AST. These primarily affect **test assertions** and **CSS selectors** in test code, not the application source code itself.

| ID | Component | Change | Frequency | Impact |
|----|-----------|--------|-----------|--------|
| K01 | Menu/Dropdown | `Menus render inside parent DOM` → `Menus render via Popper/portal outside parent DOM` | 7 | Test selectors |
| K02 | Switch | `.pf-m-on / .pf-m-off CSS classes for state` → `Native :checked on input element` | 3 | Test selectors |
| K03 | Button | `pf-m-disabled CSS class` → `Native disabled HTML attribute` | 6 | Test selectors |
| K04 | Button | `Text as direct child` → `Text wrapped in <span class='pf-v6-c-button__text'>` | 6 | Test selectors |
| K05 | Button | `Icon as direct child` → `Icon wrapped in <span class='pf-v6-c-button__icon'>` | 2 | Test selectors |
| K06 | Button | `aria-disabled='false' rendered` → `aria-disabled attribute removed entirely` | 18 | Test selectors |
| K07 | All (OUIA) | `data-ouia-component-type='PF5/*'` → `data-ouia-component-type='PF6/*'` | 89 | Test selectors |
| K08 | Content | `<p> without semantic class` → `<p class='pf-v6-c-content--p'>` | 5 | Test selectors |
| K09 | EmptyState | `Inline --pf-v5-c-empty-state__icon--Color style` → `Style removed (icon color not supported)` | 2 | DOM structure |
| K10 | DatePicker | `Duplicate date buttons rendered` → `Single date button only` | 1 | Test selectors |
| K11 | Tabs | `Tab items found via CSS selector` → `Tab items found via OUIA PF6/TabButton attribute` | 1 | Test selectors |

**Recommended approach**: These require e2e test updates, manual review, or runtime validation. They cannot be expressed as static analysis rules because the changes are in the component's rendered output, not its API surface.

## 8. Actionable Recommendations

### Priority 1: Fix Wrong Guidance (3 items, 8 occurrences)

These rules detect the change correctly but the fix-strategy uses the wrong strategy type (`ImportPathChange` instead of `Rename`), which could mislead the fix-engine.

```json
{
  "semver-packages-react-core-src-components-page-page-pageprops-d-ts-page-header-renamed": {
    "strategy": "Rename",
    "from": "header",
    "to": "masthead",
    "component": "Page",
    "prop": "header"
  },
  "semver-packages-react-core-src-components-toolbar-toolbarfilter-toolbarfilterprops-d-ts-toolbarfilter-chips-renamed": {
    "strategy": "Rename",
    "from": "chips",
    "to": "labels",
    "component": "ToolbarFilter",
    "prop": "chips"
  },
  "semver-packages-react-core-src-components-toolbar-toolbargroup-toolbargroupprops-d-ts-toolbargroup-spacer-renamed": {
    "strategy": "Rename",
    "from": "spacer",
    "to": "gap",
    "component": "ToolbarGroup",
    "prop": "spacer"
  },
}
```

### Priority 2: Add Missing Rules — Component CSS Variables (40 occurrences)

The biggest single gap. Component-scoped CSS variables (`--pf-v5-c-{component}--*`) have no rules at all. The CSS rule generator only handles global variables and class renames.

**Suggested approach**: Extend the semver-analyzer CSS pipeline to compare component-level CSS custom properties between PF5 and PF6 packages, generating `semver-consumer-css-rename-var-pf-v5-c-*` rules with `CssVariablePrefix` strategy for simple prefix swaps and `CssVariablePrefix` or `LlmAssisted` for structural renames (like J02).

### Priority 3: Add Missing Rules — React Token JS Imports (10 items, 11 occurrences)

Token imports from `@patternfly/react-tokens` (e.g., `import { global_palette_black_1000 } from '@patternfly/react-tokens'`) are not detected by the CSS variable rules, which match `--pf-v5-global--*` syntax in CSS files. Two sub-categories:

**a) Palette tokens (G01-G04, G16)**: These have JS-side renames (e.g., `global_palette_blue_300` → `chart_color_blue_300`) that differ from the CSS variable mapping. Need new rules using `frontend.referenced` with `from: '@patternfly/react-tokens'` matching.

**b) Removed palette tokens (G05-G08)**: These tokens have no PF6 `@patternfly/react-tokens` equivalent. Need rules that detect the import and provide Manual strategy guidance to replace with CSS variable or hardcoded values.

### Priority 4: Add Missing Rules — Specific Prop Changes (4 items)

| Change | What to Add |
|--------|------------|
| E04 fix-strategy `to` field | Add `"to": "alignEnd"` to `sd-prop-value-toolbargroup-align-alignright` and `sd-prop-value-toolbaritem-align-alignright` |
| E06 Pagination align | Add `sd-prop-value-pagination-align-alignright` rule mirroring ToolbarGroup pattern |
| C08 Chip onClick→onClose | Add prop rename rule for Label (was Chip) onClick→onClose |
| C09 LabelGroup ouiaId | Add `sd-prop-override-labelgroup-ouiaid-data-ouia-component-id` rule mirroring MenuToggle pattern |
| D03 Card isFlat | Add prop removal rule for Card isFlat |

### Priority 5: Add Missing Rule — Button icon-as-prop Structure Change (F02)

Button's structural change (icon-as-child → `icon` prop) has no API rule. Only a CSS class rename exists. Need a `ChildToProp` or `CompositionChange` rule similar to EmptyState's `sd-child-to-prop-emptystate-emptystateicon-to-icon`.

Suggested rule:
```yaml
- ruleID: sd-child-to-prop-button-icon-to-icon
  labels:
  - source=semver-analyzer
  - change-type=child-to-prop
  - package=@patternfly/react-core
  effort: 3
  category: mandatory
  description: Button icon children should use the icon prop instead
  message: |
    In PF6, Button icons should be passed via the `icon` prop instead of as children.
    Before: <Button variant="plain"><TrashIcon /></Button>
    After: <Button variant="plain" icon={<TrashIcon />} />
  when:
    frontend.referenced:
      pattern: ^Button$
      location: JSX_COMPONENT
      from: '@patternfly/react-core'
```

### Strategy Vocabulary Assessment

The current strategy vocabulary is **adequate** for all observed changes. No new strategy types are needed. The existing types cover:
- `Rename` — prop renames (C01, C04, C05)
- `RemoveProp` — prop removals (D01, D02, D04, D05)
- `PropValueChange` — value changes (E02, E03, E05)
- `CssVariablePrefix` — CSS prefix swaps (H01-H04, I01-I07)
- `ImportPathChange` — import path changes (B02)
- `EnsureDependency` — package upgrades (L01-L07)
- `ChildToProp` — structure changes (F01)
- `FamilyMigration` — full component family restructuring (F01)
- `LlmAssisted` — complex changes requiring judgment (A01-A08, B01, B03)
- `Manual` — cannot be automated (F05)

**Issue**: 3 prop renames (C02, C03, C07) use `ImportPathChange` instead of `Rename`. While the from/to values are correct, the wrong strategy type could mislead the fix-engine. Fix by changing the strategy field to `Rename`.
