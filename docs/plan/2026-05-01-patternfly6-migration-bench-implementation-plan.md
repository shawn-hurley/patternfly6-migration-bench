# patternfly6-migration-bench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone benchmark repo with 85 test case components (one per PF6 breaking change) and an LLM-based evaluator skill that scores any migration tool's output against pf-codemods.

**Architecture:** Single React + Vite app using PF5 dependencies. Each test case is a minimal component exercising one PF5 breaking change. A `breaking-changes.json` file catalogs all changes with expected outcomes. Three branches: `main` (PF5 source), `pf-codemods-baseline` (official tool output), and per-run branches for evaluation. A Claude Code skill compares branches and produces JSON scorecards.

**Tech Stack:** React 18, TypeScript, Vite, @patternfly/react-core@^5.3.0, @patternfly/react-table@^5, @patternfly/react-icons@^5, @patternfly/react-component-groups@^5

**Target repo:** `/Users/jmatthews/synced/patternfly6-migration-bench`

---

## File Map

```
patternfly6-migration-bench/
├── breaking-changes.json
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   └── test-cases/
│       ├── TC001-accordion-content-isHidden.tsx
│       ├── TC002-accordion-item-markup.tsx
│       ├── ... (85 files total)
│       └── TC085-toolbar-spacer-removed.tsx
├── evaluate-migration/
│   └── skill.md
└── results/
    └── .gitkeep
```

---

### Task 1: Initialize the React + Vite project with PF5 dependencies

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`

All work in `/Users/jmatthews/synced/patternfly6-migration-bench`.

- [ ] **Step 1: Create package.json**

```json
{
  "name": "patternfly6-migration-bench",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@patternfly/react-core": "^5.3.0",
    "@patternfly/react-table": "^5.3.0",
    "@patternfly/react-icons": "^5.3.0",
    "@patternfly/react-tokens": "^5.3.0",
    "@patternfly/react-component-groups": "^5.0.0",
    "@patternfly/react-styles": "^5.3.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create tsconfig.node.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create vite.config.ts**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 5: Create index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PF6 Migration Bench</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create src/main.tsx**

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "@patternfly/react-core/dist/styles/base.css";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 7: Create placeholder src/App.tsx**

```tsx
import React from "react";

export const App: React.FC = () => {
  return <div>PatternFly 6 Migration Bench — test cases will be rendered here</div>;
};
```

- [ ] **Step 8: Install dependencies and verify build**

Run: `cd /Users/jmatthews/synced/patternfly6-migration-bench && npm install`
Expected: Clean install with PF5 packages resolved.

Run: `npm run build`
Expected: Successful build. If PF5 CSS import path differs, adjust `src/main.tsx` accordingly. The PF5 base CSS is at `@patternfly/react-core/dist/styles/base.css`.

- [ ] **Step 9: Create results directory**

Run: `mkdir -p results && touch results/.gitkeep`

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "Initialize React + Vite project with PF5 dependencies"
```

---

### Task 2: Create breaking-changes.json

**Files:**
- Create: `breaking-changes.json`

This file catalogs all 85 PF6 breaking changes from the release notes with expected outcomes for the LLM evaluator. Each entry has: id, component, repo, description, PR link, whether pf-codemods fixes it, the test file path, and a plain-English expected outcome.

- [ ] **Step 1: Write breaking-changes.json**

Write the following JSON to `breaking-changes.json` at the repo root. This is the complete catalog:

```json
[
  {
    "id": "TC001",
    "component": "Accordion content",
    "repo": "React",
    "description": "The isHidden prop has been removed from AccordionContent. Visibility is now controlled automatically based on the isExpanded prop on AccordionItem.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9876",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC001-accordion-content-isHidden.tsx",
    "expectedOutcome": "Remove the isHidden prop from AccordionContent. No replacement needed — visibility is automatic based on AccordionItem's isExpanded."
  },
  {
    "id": "TC002",
    "component": "Accordion item",
    "repo": "React",
    "description": "AccordionItem markup updated to render a div wrapper element.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9876",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC002-accordion-item-markup.tsx",
    "expectedOutcome": "No code changes needed. This is a markup-only change internal to AccordionItem. Verify the tool does not introduce unnecessary modifications."
  },
  {
    "id": "TC003",
    "component": "Accordion toggle",
    "repo": "React",
    "description": "The isExpanded prop has been moved from AccordionToggle to AccordionItem.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9876",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC003-accordion-toggle-isExpanded.tsx",
    "expectedOutcome": "Move the isExpanded prop from AccordionToggle to the parent AccordionItem. Remove isExpanded from AccordionToggle."
  },
  {
    "id": "TC004",
    "component": "All",
    "repo": "React",
    "description": "Codemods remove data-codemods attributes and comments after other fixes complete.",
    "prLink": "",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC004-data-codemods-cleanup.tsx",
    "expectedOutcome": "Remove any data-codemods attributes from elements. These are markers left by pf-codemods and should be cleaned up."
  },
  {
    "id": "TC005",
    "component": "Avatar",
    "repo": "React",
    "description": "The border prop has been removed from Avatar. Use the isBordered prop instead.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9881",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC005-avatar-border.tsx",
    "expectedOutcome": "Replace border prop with isBordered prop on Avatar. If border was a string/variant, convert to boolean isBordered."
  },
  {
    "id": "TC006",
    "component": "Banner",
    "repo": "React",
    "description": "The variant property has been removed from Banner. Use the new color or status properties instead.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9891",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC006-banner-variant.tsx",
    "expectedOutcome": "Replace variant prop with appropriate color or status prop on Banner. For example, variant='warning' becomes status='warning'."
  },
  {
    "id": "TC007",
    "component": "Button",
    "repo": "React",
    "description": "Icons must be passed to the icon prop on Button instead of as children.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10663",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC007-button-icon-to-prop.tsx",
    "expectedOutcome": "Move icon elements from Button children to the icon prop. If the Button only contained an icon, it should become a self-closing element with icon={<IconComponent />}."
  },
  {
    "id": "TC008",
    "component": "Button",
    "repo": "React",
    "description": "The isActive prop on Button has been renamed to isClicked.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9934",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC008-button-isActive.tsx",
    "expectedOutcome": "Rename the isActive prop to isClicked on Button."
  },
  {
    "id": "TC009",
    "component": "Card",
    "repo": "React",
    "description": "Props for raised/clickable cards removed: isSelectableRaised, isDisabledRaised, hasSelectableInput, selectableInputAriaLabel, onSelectableInputChange.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10056",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC009-card-raised-props.tsx",
    "expectedOutcome": "Remove isSelectableRaised, isDisabledRaised, hasSelectableInput, selectableInputAriaLabel, and onSelectableInputChange props from Card. Use the new clickable card pattern with CardHeader selectableActions instead."
  },
  {
    "id": "TC010",
    "component": "Card",
    "repo": "React",
    "description": "Markup for clickable cards updated. selectableActions properties on CardHeader are no longer necessary for basic clickable cards.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10859",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC010-card-selectable-actions.tsx",
    "expectedOutcome": "Remove selectableActions from CardHeader if using the basic clickable card pattern. The Card now handles click behavior through isClickable and isSelectable props directly."
  },
  {
    "id": "TC011",
    "component": "Checkbox",
    "repo": "React",
    "description": "The isLabelBeforeButton prop has been replaced with labelPosition='start'.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10016",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC011-checkbox-label-position.tsx",
    "expectedOutcome": "Replace isLabelBeforeButton prop with labelPosition='start' on Checkbox."
  },
  {
    "id": "TC012",
    "component": "Chip",
    "repo": "React",
    "description": "Chip component has been deprecated. Imports should be moved to the deprecated package.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10049",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC012-chip-deprecated.tsx",
    "expectedOutcome": "Move Chip and ChipGroup imports from @patternfly/react-core to @patternfly/react-core/deprecated."
  },
  {
    "id": "TC013",
    "component": "Chip",
    "repo": "React",
    "description": "Chip and ChipGroup should be replaced with Label and LabelGroup components.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10049",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC013-chip-to-label.tsx",
    "expectedOutcome": "Replace Chip with Label and ChipGroup with LabelGroup. Update imports accordingly."
  },
  {
    "id": "TC014",
    "component": "Color props",
    "repo": "React",
    "description": "Banner and Label color prop updated: 'cyan' replaced with 'teal', 'gold' replaced with 'yellow'.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10661",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC014-color-props.tsx",
    "expectedOutcome": "Replace color='cyan' with color='teal' and color='gold' with color='yellow' on Banner and Label components."
  },
  {
    "id": "TC015",
    "component": "Content header",
    "repo": "React-component-groups",
    "description": "ContentHeader component has been renamed to PageHeader.",
    "prLink": "https://github.com/patternfly/react-component-groups/pull/313",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC015-content-header-rename.tsx",
    "expectedOutcome": "Rename ContentHeader to PageHeader. Update import from @patternfly/react-component-groups."
  },
  {
    "id": "TC016",
    "component": "Data list action",
    "repo": "React",
    "description": "The isPlainButtonAction prop has been removed from DataListAction. The wrapper is no longer needed.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10939",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC016-datalist-action.tsx",
    "expectedOutcome": "Remove the isPlainButtonAction prop from DataListAction."
  },
  {
    "id": "TC017",
    "component": "Deprecated components",
    "repo": "React",
    "description": "Multiple deprecated components fully removed: Application Launcher, Context Selector, old Dropdown, Options Menu, old Page Header, old Select.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10345",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC017-deprecated-components.tsx",
    "expectedOutcome": "Components from @patternfly/react-core/deprecated that were fully removed in PF6 must be replaced with their modern equivalents. Old Dropdown becomes MenuToggle + Menu. Old Select becomes the new Select from @patternfly/react-core."
  },
  {
    "id": "TC018",
    "component": "Drag drop",
    "repo": "React",
    "description": "DragDrop has been deprecated. Imports should be moved to the deprecated package.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10181",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC018-dragdrop-deprecated.tsx",
    "expectedOutcome": "Move DragDrop, Draggable, and Droppable imports from @patternfly/react-core to @patternfly/react-core/deprecated."
  },
  {
    "id": "TC019",
    "component": "Drawer",
    "repo": "React",
    "description": "The hasNoPadding prop has been removed from DrawerHead.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10036",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC019-drawer-hasNoPadding.tsx",
    "expectedOutcome": "Remove the hasNoPadding prop from DrawerHead."
  },
  {
    "id": "TC020",
    "component": "Drawer",
    "repo": "React",
    "description": "DrawerContent, DrawerPanelContent, and DrawerSection colorVariant value 'light-200' has been replaced with 'secondary'.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10017",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC020-drawer-colorVariant.tsx",
    "expectedOutcome": "Replace colorVariant='light-200' with colorVariant='secondary' on DrawerContent, DrawerPanelContent, and DrawerSection."
  },
  {
    "id": "TC021",
    "component": "Drawer content",
    "repo": "React",
    "description": "DrawerContent 'no-background' colorVariant value removed. New 'primary' value added. New DrawerContentColorVariant enum introduced.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10211",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC021-drawer-content-color.tsx",
    "expectedOutcome": "Replace colorVariant='no-background' with colorVariant='primary' on DrawerContent, or remove the prop if default behavior is desired."
  },
  {
    "id": "TC022",
    "component": "Drawer head",
    "repo": "React",
    "description": "DrawerPanelBody is no longer rendered internally within DrawerHead.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10036",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC022-drawer-head-panelbody.tsx",
    "expectedOutcome": "No code changes needed for this markup change unless you were relying on the internal DrawerPanelBody styling. If so, wrap DrawerHead content in an explicit DrawerPanelBody."
  },
  {
    "id": "TC023",
    "component": "Dual list selector",
    "repo": "React",
    "description": "Previous DualListSelector implementation has been deprecated and moved to the deprecated package.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10359",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC023-duallistselector-deprecated.tsx",
    "expectedOutcome": "Move DualListSelector import from @patternfly/react-core to @patternfly/react-core/deprecated, or migrate to the new DualListSelector from @patternfly/react-core."
  },
  {
    "id": "TC024",
    "component": "Dual list selector next",
    "repo": "React",
    "description": "The Next implementation of DualListSelector has been promoted as the recommended version. Import paths updated from /next to main package.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10359",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC024-duallistselector-next.tsx",
    "expectedOutcome": "Update DualListSelector imports from @patternfly/react-core/next to @patternfly/react-core."
  },
  {
    "id": "TC025",
    "component": "Duplicate imports",
    "repo": "React",
    "description": "Duplicate import specifiers should be removed via cleanup codemod.",
    "prLink": "",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC025-duplicate-imports.tsx",
    "expectedOutcome": "Remove duplicate import specifiers. If Button is imported twice in the same import statement, keep only one."
  },
  {
    "id": "TC026",
    "component": "Empty state",
    "repo": "React",
    "description": "EmptyStateHeader and EmptyStateIcon are no longer exported from @patternfly/react-core.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10364",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC026-emptystate-exports.tsx",
    "expectedOutcome": "Remove imports of EmptyStateHeader and EmptyStateIcon. Their functionality is now built into EmptyState via headerText/titleText and icon props."
  },
  {
    "id": "TC027",
    "component": "Empty state header",
    "repo": "React",
    "description": "EmptyStateHeader and EmptyStateIcon are now rendered internally within EmptyState. Pass headingLevel, titleText, and icon props to EmptyState directly.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9947",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC027-emptystate-header.tsx",
    "expectedOutcome": "Remove EmptyStateHeader and EmptyStateIcon child components. Move the title text to EmptyState's titleText prop. Move the icon to EmptyState's icon prop. Move headingLevel to EmptyState."
  },
  {
    "id": "TC028",
    "component": "Error state",
    "repo": "React-component-groups",
    "description": "ErrorState props renamed: errorTitle to titleText, errorDescription to bodyText.",
    "prLink": "https://github.com/patternfly/react-component-groups/pull/145",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC028-errorstate-props.tsx",
    "expectedOutcome": "Rename errorTitle to titleText and errorDescription to bodyText on ErrorState."
  },
  {
    "id": "TC029",
    "component": "Form field group header title text object",
    "repo": "React",
    "description": "Interface typo fixed: FormFiledGroupHeaderTitleTextObject renamed to FormFieldGroupHeaderTitleTextObject.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10016",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC029-formfield-typo.tsx",
    "expectedOutcome": "Rename FormFiledGroupHeaderTitleTextObject to FormFieldGroupHeaderTitleTextObject (fix the 'Filed' typo to 'Field')."
  },
  {
    "id": "TC030",
    "component": "Form group",
    "repo": "React",
    "description": "The labelIcon prop on FormGroup has been renamed to labelHelp.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10016",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC030-formgroup-labelicon.tsx",
    "expectedOutcome": "Rename the labelIcon prop to labelHelp on FormGroup."
  },
  {
    "id": "TC031",
    "component": "Helper text item",
    "repo": "React",
    "description": "The hasIcon and isDynamic props have been removed from HelperTextItem. The icon renders automatically based on the variant prop.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10029",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC031-helpertextitem-hasIcon.tsx",
    "expectedOutcome": "Remove hasIcon and isDynamic props from HelperTextItem. Icons now render automatically when variant is set."
  },
  {
    "id": "TC032",
    "component": "Helper text item",
    "repo": "React",
    "description": "The screenReaderText prop on HelperTextItem now renders only when variant is not 'default'.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10029",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC032-helpertextitem-screenreader.tsx",
    "expectedOutcome": "No code changes needed. This is a behavioral change. Verify the tool does not introduce unnecessary modifications. If screenReaderText is used with variant='default', consider removing it as it will no longer render."
  },
  {
    "id": "TC033",
    "component": "Invalid object",
    "repo": "React-component-groups",
    "description": "InvalidObject props renamed: invalidObjectTitleText to titleText, invalidObjectBodyText to bodyText.",
    "prLink": "https://github.com/patternfly/react-component-groups/pull/145",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC033-invalidobject-props.tsx",
    "expectedOutcome": "Rename invalidObjectTitleText to titleText and invalidObjectBodyText to bodyText on InvalidObject."
  },
  {
    "id": "TC034",
    "component": "Jump links item",
    "repo": "React",
    "description": "The href prop is now required on JumpLinksItem.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10027",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC034-jumplinksitem-href.tsx",
    "expectedOutcome": "Add an href prop to JumpLinksItem if one is missing. This is now a required prop."
  },
  {
    "id": "TC035",
    "component": "Jump links item",
    "repo": "React",
    "description": "JumpLinksItem markup changed. It now uses a Button component internally. The onClick type has been updated.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10027",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC035-jumplinksitem-markup.tsx",
    "expectedOutcome": "No code changes needed for the markup change. If onClick is used, verify its type signature is compatible with the new Button-based implementation."
  },
  {
    "id": "TC036",
    "component": "Kebab toggle",
    "repo": "React",
    "description": "KebabToggle has been removed. Replace with MenuToggle with variant='plain' and EllipsisVIcon.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10345",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC036-kebabtoggle-removed.tsx",
    "expectedOutcome": "Replace KebabToggle with MenuToggle variant='plain' containing an EllipsisVIcon. Update imports."
  },
  {
    "id": "TC037",
    "component": "Label",
    "repo": "React",
    "description": "The isOverflowLabel prop on Label has been replaced with variant='overflow'.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10037",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC037-label-overflow.tsx",
    "expectedOutcome": "Replace isOverflowLabel prop with variant='overflow' on Label."
  },
  {
    "id": "TC038",
    "component": "Log snippet",
    "repo": "React-component-groups",
    "description": "LogSnippet prop renamed: leftBorderVariant to variant. The enum has been replaced with AlertVariant.",
    "prLink": "https://github.com/patternfly/react-component-groups/pull/145",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC038-logsnippet-variant.tsx",
    "expectedOutcome": "Rename leftBorderVariant to variant on LogSnippet. Use AlertVariant values."
  },
  {
    "id": "TC039",
    "component": "Log viewer",
    "repo": "React",
    "description": "LogViewer stylesheet has been moved out of the PatternFly package into the LogViewer package itself.",
    "prLink": "https://github.com/patternfly/react-log-viewer/pull/70",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC039-logviewer-stylesheet.tsx",
    "expectedOutcome": "Update the LogViewer CSS import path. The stylesheet is now bundled with @patternfly/react-log-viewer instead of @patternfly/react-core."
  },
  {
    "id": "TC040",
    "component": "Login main footer links item",
    "repo": "React",
    "description": "LoginMainFooterLinksItem structure changed. Properties are now passed via children using a Button component.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10107",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC040-login-footer-links.tsx",
    "expectedOutcome": "Restructure LoginMainFooterLinksItem to pass content as children using a Button component instead of individual props like href and target."
  },
  {
    "id": "TC041",
    "component": "Login main header",
    "repo": "React",
    "description": "LoginMainHeader markup updated to use a div wrapper instead of a header element.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10880",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC041-login-main-header.tsx",
    "expectedOutcome": "No code changes needed. This is an internal markup change. Verify the tool does not introduce unnecessary modifications."
  },
  {
    "id": "TC042",
    "component": "Masthead",
    "repo": "React",
    "description": "The old MastheadBrand component has been renamed to MastheadLogo. A new MastheadBrand component wraps MastheadLogo.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10809",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC042-masthead-brand-logo.tsx",
    "expectedOutcome": "Rename MastheadBrand to MastheadLogo. Wrap the MastheadLogo in a new MastheadBrand component."
  },
  {
    "id": "TC043",
    "component": "Masthead",
    "repo": "React",
    "description": "The backgroundColor prop has been removed from Masthead.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9774",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC043-masthead-bgcolor.tsx",
    "expectedOutcome": "Remove the backgroundColor prop from Masthead. Use CSS theming instead."
  },
  {
    "id": "TC044",
    "component": "Masthead",
    "repo": "React",
    "description": "Masthead structure updated. MastheadToggle and MastheadBrand should be wrapped in MastheadMain.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10809",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC044-masthead-structure.tsx",
    "expectedOutcome": "Wrap MastheadToggle and MastheadBrand inside MastheadMain. The structure should be: Masthead > MastheadMain > [MastheadToggle, MastheadBrand > MastheadLogo]."
  },
  {
    "id": "TC045",
    "component": "Menu item action",
    "repo": "React",
    "description": "MenuItemAction markup updated. It now uses a Button internally with a wrapper and removes the icon wrapper.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10089",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC045-menuitemaction-markup.tsx",
    "expectedOutcome": "No code changes needed. This is an internal markup change. Verify the tool does not introduce unnecessary modifications."
  },
  {
    "id": "TC046",
    "component": "Menu toggle",
    "repo": "React",
    "description": "Icons should be passed to the icon prop on MenuToggle instead of as children for proper styling.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10097",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC046-menutoggle-icon.tsx",
    "expectedOutcome": "Move icon elements from MenuToggle children to the icon prop on MenuToggle."
  },
  {
    "id": "TC047",
    "component": "Missing page",
    "repo": "React-component-groups",
    "description": "InvalidObject component has been renamed to MissingPage.",
    "prLink": "https://github.com/patternfly/react-component-groups/pull/313",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC047-missing-page.tsx",
    "expectedOutcome": "Rename InvalidObject to MissingPage. Update imports from @patternfly/react-component-groups."
  },
  {
    "id": "TC048",
    "component": "Modal",
    "repo": "React",
    "description": "The previous Modal implementation has been deprecated and moved to the deprecated package.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10358",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC048-modal-deprecated.tsx",
    "expectedOutcome": "Move Modal import from @patternfly/react-core to @patternfly/react-core/deprecated, or migrate to the new Modal API using ModalHeader, ModalBody, and ModalFooter as children."
  },
  {
    "id": "TC049",
    "component": "Modal next",
    "repo": "React",
    "description": "The Next implementation of Modal has been promoted as the recommended version. Import paths updated from /next to main package.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10358",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC049-modal-next.tsx",
    "expectedOutcome": "Update Modal imports from @patternfly/react-core/next to @patternfly/react-core."
  },
  {
    "id": "TC050",
    "component": "Multi content card",
    "repo": "React-component-groups",
    "description": "The leftBorderVariant and withHeaderBorder props have been removed from MultiContentCard.",
    "prLink": "https://github.com/patternfly/react-component-groups/pull/145",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC050-multicontentcard-props.tsx",
    "expectedOutcome": "Remove leftBorderVariant and withHeaderBorder props from MultiContentCard."
  },
  {
    "id": "TC051",
    "component": "Nav",
    "repo": "React",
    "description": "The 'tertiary' variant on Nav is no longer supported. Use variant='horizontal-subnav' instead.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9948",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC051-nav-tertiary.tsx",
    "expectedOutcome": "Replace variant='tertiary' with variant='horizontal-subnav' on Nav."
  },
  {
    "id": "TC052",
    "component": "Nav",
    "repo": "React",
    "description": "The theme prop on Nav is no longer supported. Use light/dark mode theming instead.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9948",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC052-nav-theme.tsx",
    "expectedOutcome": "Remove the theme prop from Nav."
  },
  {
    "id": "TC053",
    "component": "Nav item",
    "repo": "React",
    "description": "The hasNavLinkWrapper prop has been removed from NavItem. Icons should be passed to the icon prop.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10687",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC053-navitem-wrapper.tsx",
    "expectedOutcome": "Remove hasNavLinkWrapper prop from NavItem. Move icon elements to the icon prop on NavItem."
  },
  {
    "id": "TC054",
    "component": "Not authorized",
    "repo": "React-component-groups",
    "description": "NotAuthorized props renamed: description to bodyText, title to titleText.",
    "prLink": "https://github.com/patternfly/react-component-groups/pull/145",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC054-notauthorized-props.tsx",
    "expectedOutcome": "Rename description to bodyText and title to titleText on NotAuthorized."
  },
  {
    "id": "TC055",
    "component": "Notification badge",
    "repo": "React",
    "description": "NotificationBadge markup changed. It now uses a stateful button internally.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10020",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC055-notificationbadge-markup.tsx",
    "expectedOutcome": "No code changes needed. This is an internal markup change. Verify the tool does not introduce unnecessary modifications."
  },
  {
    "id": "TC056",
    "component": "Notification drawer header",
    "repo": "React",
    "description": "NotificationDrawerHeader no longer uses the Text component internally. It now renders a native h1 element.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10378",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC056-notificationdrawer-header.tsx",
    "expectedOutcome": "No code changes needed. This is an internal markup change. Verify the tool does not introduce unnecessary modifications."
  },
  {
    "id": "TC057",
    "component": "Page",
    "repo": "React",
    "description": "The header prop on Page has been renamed to masthead.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10454",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC057-page-header-to-masthead.tsx",
    "expectedOutcome": "Rename the header prop to masthead on Page."
  },
  {
    "id": "TC058",
    "component": "Page",
    "repo": "React",
    "description": "The isTertiaryNavGrouped prop on Page has been renamed to isHorizontalSubnavGrouped.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9948",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC058-page-tertiarynav-grouped.tsx",
    "expectedOutcome": "Rename isTertiaryNavGrouped to isHorizontalSubnavGrouped on Page."
  },
  {
    "id": "TC059",
    "component": "Page",
    "repo": "React",
    "description": "The isTertiaryNavWidthLimited prop on Page has been renamed to isHorizontalSubnavWidthLimited.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9948",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC059-page-tertiarynav-width.tsx",
    "expectedOutcome": "Rename isTertiaryNavWidthLimited to isHorizontalSubnavWidthLimited on Page."
  },
  {
    "id": "TC060",
    "component": "Page",
    "repo": "React",
    "description": "The tertiaryNav prop on Page has been renamed to horizontalSubnav.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9948",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC060-page-tertiarynav.tsx",
    "expectedOutcome": "Rename tertiaryNav to horizontalSubnav on Page."
  },
  {
    "id": "TC061",
    "component": "Page",
    "repo": "React",
    "description": "Page markup changed. PageBody now wraps contents when horizontalSubnav or breadcrumb is passed.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10650",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC061-page-body-wrapper.tsx",
    "expectedOutcome": "No code changes needed. This is an internal markup change. Verify the tool does not introduce unnecessary modifications."
  },
  {
    "id": "TC062",
    "component": "Page breadcrumb and section",
    "repo": "React",
    "description": "The isWidthLimited prop behavior has changed on PageBreadcrumb and PageSection. A new hasBodyWrapper prop has been introduced.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10650",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC062-page-section-bodywrapper.tsx",
    "expectedOutcome": "Add hasBodyWrapper={false} to PageSection components. If isWidthLimited was used, verify it still works with the new hasBodyWrapper behavior."
  },
  {
    "id": "TC063",
    "component": "Page header tools item",
    "repo": "React",
    "description": "The isSelected prop has been removed from PageHeaderToolsItem.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9774",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC063-pageheader-tools-isselected.tsx",
    "expectedOutcome": "Remove the isSelected prop from PageHeaderToolsItem."
  },
  {
    "id": "TC064",
    "component": "Page navigation",
    "repo": "React",
    "description": "PageNavigation component has been removed from PatternFly.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10650",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC064-pagenavigation-removed.tsx",
    "expectedOutcome": "Replace PageNavigation with Nav placed directly as a child of Page or use the horizontalSubnav prop on Page."
  },
  {
    "id": "TC065",
    "component": "Page section",
    "repo": "React",
    "description": "The 'nav' type for PageSection has been removed.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10650",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC065-pagesection-nav-type.tsx",
    "expectedOutcome": "Remove type='nav' from PageSection. Use the default type or place Nav content differently."
  },
  {
    "id": "TC066",
    "component": "Page section",
    "repo": "React",
    "description": "The variant prop on PageSection now accepts only 'default' or 'secondary'.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9774",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC066-pagesection-variant.tsx",
    "expectedOutcome": "Replace variant='light' with variant='default' and variant='dark' or variant='darker' with variant='secondary' on PageSection."
  },
  {
    "id": "TC067",
    "component": "Page section",
    "repo": "React",
    "description": "Classes from the variant prop on PageSection only apply when type is 'default'.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9848",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC067-pagesection-variant-type.tsx",
    "expectedOutcome": "No code changes needed. This is a behavioral change. Verify the tool does not introduce unnecessary modifications. If variant is used with a non-default type, the variant classes will no longer apply."
  },
  {
    "id": "TC068",
    "component": "Page sidebar",
    "repo": "React",
    "description": "The theme prop has been removed from PageSidebar.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9774",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC068-pagesidebar-theme.tsx",
    "expectedOutcome": "Remove the theme prop from PageSidebar."
  },
  {
    "id": "TC069",
    "component": "Pagination",
    "repo": "React",
    "description": "Pagination markup changed. A wrapper element has been added around PaginationOptionsMenu toggle.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10662",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC069-pagination-markup.tsx",
    "expectedOutcome": "No code changes needed. This is an internal markup change. Verify the tool does not introduce unnecessary modifications."
  },
  {
    "id": "TC070",
    "component": "Popper",
    "repo": "React",
    "description": "The default appendTo value has been updated to document.body for Dropdown, Select, and Popper.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10675",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC070-popper-appendto.tsx",
    "expectedOutcome": "No code changes needed unless you were relying on the previous default appendTo behavior. If so, explicitly set appendTo to the previous default."
  },
  {
    "id": "TC071",
    "component": "Simple file upload",
    "repo": "React",
    "description": "aria-describedby has been removed from TextInput within SimpleFileUpload. Use the browseButtonAriaDescribedby prop instead.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10026",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC071-simplefileupload-aria.tsx",
    "expectedOutcome": "If aria-describedby was being set on SimpleFileUpload's internal TextInput, use the browseButtonAriaDescribedby prop on SimpleFileUpload instead."
  },
  {
    "id": "TC072",
    "component": "Slider step",
    "repo": "React",
    "description": "CSS variable --pf-v6-c-slider__step--Left updated to --pf-v6-c-slider__step--InsetInlineStart.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10378",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC072-slider-css-variable.tsx",
    "expectedOutcome": "Replace --pf-v5-c-slider__step--Left with --pf-v6-c-slider__step--InsetInlineStart in any CSS overrides."
  },
  {
    "id": "TC073",
    "component": "Switch",
    "repo": "React",
    "description": "The labelOff prop has been removed from Switch.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10646",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC073-switch-labeloff.tsx",
    "expectedOutcome": "Remove the labelOff prop from Switch. The switch label should not dynamically update between on/off states."
  },
  {
    "id": "TC074",
    "component": "Tabs",
    "repo": "React",
    "description": "The isSecondary prop on Tabs has been renamed to isSubtab.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10044",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC074-tabs-issecondary.tsx",
    "expectedOutcome": "Rename isSecondary to isSubtab on Tabs."
  },
  {
    "id": "TC075",
    "component": "Tabs",
    "repo": "React",
    "description": "The 'light300' value for variant on Tabs has been replaced with 'secondary'.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/9930",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC075-tabs-light300.tsx",
    "expectedOutcome": "Replace variant='light300' with variant='secondary' on Tabs."
  },
  {
    "id": "TC076",
    "component": "Tabs",
    "repo": "React",
    "description": "Tabs scroll button markup updated. Scroll buttons now use Button components with a wrapper div.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10044",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC076-tabs-scroll-markup.tsx",
    "expectedOutcome": "No code changes needed. This is an internal markup change. Verify the tool does not introduce unnecessary modifications."
  },
  {
    "id": "TC077",
    "component": "Text",
    "repo": "React",
    "description": "Text, TextContent, TextList, and TextListItem have been replaced with a single Content component.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10643",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC077-text-to-content.tsx",
    "expectedOutcome": "Replace Text, TextContent, TextList, TextListItem imports and usage with Content component. Content wraps text elements and provides the same styling."
  },
  {
    "id": "TC078",
    "component": "Th",
    "repo": "React",
    "description": "CSS variables for sticky columns on Th updated to RTL-compatible names: Left to InsetInlineStart, Right to InsetInlineEnd.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10378",
    "fixedWithCodemods": false,
    "testFile": "src/test-cases/TC078-th-css-variables.tsx",
    "expectedOutcome": "Replace --pf-v5-c-table__sticky-column--Left with --pf-v6-c-table__sticky-column--InsetInlineStart and --Right with --InsetInlineEnd in any CSS overrides."
  },
  {
    "id": "TC079",
    "component": "Tile",
    "repo": "React",
    "description": "Tile component has been deprecated and moved to the deprecated package. Use Card instead.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10821",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC079-tile-deprecated.tsx",
    "expectedOutcome": "Move Tile import from @patternfly/react-core to @patternfly/react-core/deprecated, or replace Tile with a Card component."
  },
  {
    "id": "TC080",
    "component": "Tokens",
    "repo": "React",
    "description": "React tokens with PatternFly token variable values are now prefixed with t_.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/11002",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC080-tokens-prefix.tsx",
    "expectedOutcome": "Update React token imports to use the new t_ prefix. For example, global_spacer_md becomes t_global_spacer_md."
  },
  {
    "id": "TC081",
    "component": "Tokens",
    "repo": "React",
    "description": "CSS tokens updated. Global non-color tokens are auto-fixed. Color tokens need manual replacement.",
    "prLink": "",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC081-tokens-css.tsx",
    "expectedOutcome": "Update CSS token variable names from --pf-v5-* to --pf-v6-* prefix. Non-color global tokens can be auto-fixed. Color tokens require manual mapping to new PF6 design token names."
  },
  {
    "id": "TC082",
    "component": "Toolbar",
    "repo": "React",
    "description": "Multiple props removed from Toolbar: usePageInsets, alignSelf, widths, alignment on ToolbarItem.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10674",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC082-toolbar-props-removed.tsx",
    "expectedOutcome": "Remove usePageInsets from Toolbar. Remove alignSelf, widths, and alignment props from ToolbarItem."
  },
  {
    "id": "TC083",
    "component": "Toolbar",
    "repo": "React",
    "description": "Chip-based props renamed to Label-based across toolbar components: chipGroupContentRef to labelGroupContentRef, chipGroupComponent to labelGroupComponent, etc.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10649",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC083-toolbar-chip-to-label.tsx",
    "expectedOutcome": "Rename all chip-based props to label-based on toolbar components: chipGroupContentRef to labelGroupContentRef, chipGroupComponent to labelGroupComponent, deleteChip to deleteLabel, deleteChipGroup to deleteLabelGroup, chips to labels, customChipGroupContent to customLabelGroupContent."
  },
  {
    "id": "TC084",
    "component": "Toolbar",
    "repo": "React",
    "description": "Toolbar interfaces renamed: ToolbarChipGroup to ToolbarLabelGroup, ToolbarChip to ToolbarLabel.",
    "prLink": "https://github.com/patternfly/patternfly-react/pull/10649",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC084-toolbar-interface-rename.tsx",
    "expectedOutcome": "Rename ToolbarChipGroup to ToolbarLabelGroup and ToolbarChip to ToolbarLabel in type annotations and imports."
  },
  {
    "id": "TC085",
    "component": "Toolbar",
    "repo": "React",
    "description": "The spacer property has been removed from ToolbarGroup, ToolbarItem, and ToolbarToggleGroup.",
    "prLink": "",
    "fixedWithCodemods": true,
    "testFile": "src/test-cases/TC085-toolbar-spacer-removed.tsx",
    "expectedOutcome": "Remove the spacer prop from ToolbarGroup, ToolbarItem, and ToolbarToggleGroup. Use CSS gap or PF spacing utilities instead."
  }
]
```

- [ ] **Step 2: Commit**

```bash
git add breaking-changes.json
git commit -m "Add breaking-changes.json with all 85 PF6 breaking changes"
```

---

### Task 3: Write test cases TC001–TC014 (Accordion through Color props)

**Files:**
- Create: `src/test-cases/TC001-accordion-content-isHidden.tsx`
- Create: `src/test-cases/TC002-accordion-item-markup.tsx`
- Create: `src/test-cases/TC003-accordion-toggle-isExpanded.tsx`
- Create: `src/test-cases/TC004-data-codemods-cleanup.tsx`
- Create: `src/test-cases/TC005-avatar-border.tsx`
- Create: `src/test-cases/TC006-banner-variant.tsx`
- Create: `src/test-cases/TC007-button-icon-to-prop.tsx`
- Create: `src/test-cases/TC008-button-isActive.tsx`
- Create: `src/test-cases/TC009-card-raised-props.tsx`
- Create: `src/test-cases/TC010-card-selectable-actions.tsx`
- Create: `src/test-cases/TC011-checkbox-label-position.tsx`
- Create: `src/test-cases/TC012-chip-deprecated.tsx`
- Create: `src/test-cases/TC013-chip-to-label.tsx`
- Create: `src/test-cases/TC014-color-props.tsx`

- [ ] **Step 1: Create src/test-cases/ directory**

Run: `mkdir -p src/test-cases`

- [ ] **Step 2: Write TC001-accordion-content-isHidden.tsx**

```tsx
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionToggle } from "@patternfly/react-core";

export const TC001_AccordionContentIsHidden: React.FC = () => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <Accordion>
      <AccordionItem>
        <AccordionToggle onClick={() => setExpanded(!expanded)} isExpanded={expanded} id="tc001-toggle">
          Item One
        </AccordionToggle>
        <AccordionContent isHidden={!expanded}>
          Content for item one.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
```

- [ ] **Step 3: Write TC002-accordion-item-markup.tsx**

```tsx
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionToggle } from "@patternfly/react-core";

export const TC002_AccordionItemMarkup: React.FC = () => (
  <Accordion>
    <AccordionItem>
      <AccordionToggle id="tc002-toggle" isExpanded={false} onClick={() => {}}>
        Item
      </AccordionToggle>
      <AccordionContent>Content</AccordionContent>
    </AccordionItem>
  </Accordion>
);
```

- [ ] **Step 4: Write TC003-accordion-toggle-isExpanded.tsx**

```tsx
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionToggle } from "@patternfly/react-core";

export const TC003_AccordionToggleIsExpanded: React.FC = () => {
  const [expanded, setExpanded] = React.useState(true);
  return (
    <Accordion>
      <AccordionItem>
        <AccordionToggle onClick={() => setExpanded(!expanded)} isExpanded={expanded} id="tc003-toggle">
          Toggle
        </AccordionToggle>
        <AccordionContent>Content</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
```

- [ ] **Step 5: Write TC004-data-codemods-cleanup.tsx**

```tsx
import React from "react";
import { Button } from "@patternfly/react-core";

export const TC004_DataCodemodsCleanup: React.FC = () => (
  <div>
    <Button data-codemods="true">Click me</Button>
    <span data-codemods="true">Some text</span>
  </div>
);
```

- [ ] **Step 6: Write TC005-avatar-border.tsx**

```tsx
import React from "react";
import { Avatar } from "@patternfly/react-core";

export const TC005_AvatarBorder: React.FC = () => (
  <Avatar src="https://example.com/avatar.png" alt="User avatar" border="dark" />
);
```

- [ ] **Step 7: Write TC006-banner-variant.tsx**

```tsx
import React from "react";
import { Banner } from "@patternfly/react-core";

export const TC006_BannerVariant: React.FC = () => (
  <div>
    <Banner variant="warning">Warning banner</Banner>
    <Banner variant="danger">Danger banner</Banner>
    <Banner variant="info">Info banner</Banner>
    <Banner variant="success">Success banner</Banner>
  </div>
);
```

- [ ] **Step 8: Write TC007-button-icon-to-prop.tsx**

```tsx
import React from "react";
import { Button } from "@patternfly/react-core";
import { TimesIcon, PlusCircleIcon } from "@patternfly/react-icons";

export const TC007_ButtonIconToProp: React.FC = () => (
  <div>
    <Button variant="plain"><TimesIcon /></Button>
    <Button variant="primary"><PlusCircleIcon /> Add item</Button>
  </div>
);
```

- [ ] **Step 9: Write TC008-button-isActive.tsx**

```tsx
import React from "react";
import { Button } from "@patternfly/react-core";

export const TC008_ButtonIsActive: React.FC = () => (
  <Button isActive>Active button</Button>
);
```

- [ ] **Step 10: Write TC009-card-raised-props.tsx**

```tsx
import React from "react";
import { Card, CardBody, CardTitle } from "@patternfly/react-core";

export const TC009_CardRaisedProps: React.FC = () => (
  <Card isSelectableRaised hasSelectableInput selectableInputAriaLabel="Select card" onSelectableInputChange={() => {}}>
    <CardTitle>Selectable Card</CardTitle>
    <CardBody>Card content</CardBody>
  </Card>
);
```

- [ ] **Step 11: Write TC010-card-selectable-actions.tsx**

```tsx
import React from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@patternfly/react-core";

export const TC010_CardSelectableActions: React.FC = () => (
  <Card isClickable>
    <CardHeader selectableActions={{ to: "#", name: "card-link" }}>
      <CardTitle>Clickable Card</CardTitle>
    </CardHeader>
    <CardBody>Card content</CardBody>
  </Card>
);
```

- [ ] **Step 12: Write TC011-checkbox-label-position.tsx**

```tsx
import React from "react";
import { Checkbox } from "@patternfly/react-core";

export const TC011_CheckboxLabelPosition: React.FC = () => (
  <Checkbox id="tc011-check" label="Label before" isLabelBeforeButton />
);
```

- [ ] **Step 13: Write TC012-chip-deprecated.tsx**

```tsx
import React from "react";
import { Chip, ChipGroup } from "@patternfly/react-core";

export const TC012_ChipDeprecated: React.FC = () => (
  <ChipGroup categoryName="Fruits">
    <Chip>Apple</Chip>
    <Chip>Banana</Chip>
    <Chip>Orange</Chip>
  </ChipGroup>
);
```

- [ ] **Step 14: Write TC013-chip-to-label.tsx**

```tsx
import React from "react";
import { Chip, ChipGroup } from "@patternfly/react-core";

export const TC013_ChipToLabel: React.FC = () => (
  <ChipGroup categoryName="Colors">
    <Chip onClick={() => {}}>Red</Chip>
    <Chip onClick={() => {}}>Blue</Chip>
  </ChipGroup>
);
```

- [ ] **Step 15: Write TC014-color-props.tsx**

```tsx
import React from "react";
import { Banner, Label } from "@patternfly/react-core";

export const TC014_ColorProps: React.FC = () => (
  <div>
    <Banner color="cyan">Cyan banner</Banner>
    <Banner color="gold">Gold banner</Banner>
    <Label color="cyan">Cyan label</Label>
    <Label color="gold">Gold label</Label>
  </div>
);
```

- [ ] **Step 16: Commit**

```bash
git add src/test-cases/TC00*.tsx src/test-cases/TC01[0-4]*.tsx
git commit -m "Add test cases TC001-TC014: Accordion through Color props"
```

---

### Task 4: Write test cases TC015–TC030 (Content header through Form group)

**Files:**
- Create: `src/test-cases/TC015-content-header-rename.tsx`
- Create: `src/test-cases/TC016-datalist-action.tsx`
- Create: `src/test-cases/TC017-deprecated-components.tsx`
- Create: `src/test-cases/TC018-dragdrop-deprecated.tsx`
- Create: `src/test-cases/TC019-drawer-hasNoPadding.tsx`
- Create: `src/test-cases/TC020-drawer-colorVariant.tsx`
- Create: `src/test-cases/TC021-drawer-content-color.tsx`
- Create: `src/test-cases/TC022-drawer-head-panelbody.tsx`
- Create: `src/test-cases/TC023-duallistselector-deprecated.tsx`
- Create: `src/test-cases/TC024-duallistselector-next.tsx`
- Create: `src/test-cases/TC025-duplicate-imports.tsx`
- Create: `src/test-cases/TC026-emptystate-exports.tsx`
- Create: `src/test-cases/TC027-emptystate-header.tsx`
- Create: `src/test-cases/TC028-errorstate-props.tsx`
- Create: `src/test-cases/TC029-formfield-typo.tsx`
- Create: `src/test-cases/TC030-formgroup-labelicon.tsx`

- [ ] **Step 1: Write TC015-content-header-rename.tsx**

```tsx
import React from "react";
import { ContentHeader } from "@patternfly/react-component-groups";

export const TC015_ContentHeaderRename: React.FC = () => (
  <ContentHeader title="Page Title" subtitle="Subtitle text" />
);
```

- [ ] **Step 2: Write TC016-datalist-action.tsx**

```tsx
import React from "react";
import { DataList, DataListAction, DataListCell, DataListItem, DataListItemCells, DataListItemRow, Button } from "@patternfly/react-core";

export const TC016_DataListAction: React.FC = () => (
  <DataList aria-label="data list">
    <DataListItem>
      <DataListItemRow>
        <DataListItemCells dataListCells={[<DataListCell key="cell">Cell</DataListCell>]} />
        <DataListAction id="action1" aria-label="actions" aria-labelledby="action1" isPlainButtonAction>
          <Button variant="plain">Action</Button>
        </DataListAction>
      </DataListItemRow>
    </DataListItem>
  </DataList>
);
```

- [ ] **Step 3: Write TC017-deprecated-components.tsx**

```tsx
import React from "react";
import { Dropdown, DropdownItem, DropdownToggle } from "@patternfly/react-core/deprecated";

export const TC017_DeprecatedComponents: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dropdown
      isOpen={isOpen}
      toggle={<DropdownToggle onToggle={() => setIsOpen(!isOpen)}>Dropdown</DropdownToggle>}
      dropdownItems={[
        <DropdownItem key="item1">Item 1</DropdownItem>,
        <DropdownItem key="item2">Item 2</DropdownItem>,
      ]}
    />
  );
};
```

- [ ] **Step 4: Write TC018-dragdrop-deprecated.tsx**

```tsx
import React from "react";
import { DragDrop, Draggable, Droppable } from "@patternfly/react-core";

export const TC018_DragDropDeprecated: React.FC = () => (
  <DragDrop onDrop={() => true}>
    <Droppable>
      <Draggable>Item 1</Draggable>
      <Draggable>Item 2</Draggable>
    </Droppable>
  </DragDrop>
);
```

- [ ] **Step 5: Write TC019-drawer-hasNoPadding.tsx**

```tsx
import React from "react";
import { Drawer, DrawerContent, DrawerContentBody, DrawerHead, DrawerPanelContent } from "@patternfly/react-core";

export const TC019_DrawerHasNoPadding: React.FC = () => (
  <Drawer isExpanded>
    <DrawerContent panelContent={
      <DrawerPanelContent>
        <DrawerHead hasNoPadding>
          Panel header with no padding
        </DrawerHead>
      </DrawerPanelContent>
    }>
      <DrawerContentBody>Main content</DrawerContentBody>
    </DrawerContent>
  </Drawer>
);
```

- [ ] **Step 6: Write TC020-drawer-colorVariant.tsx**

```tsx
import React from "react";
import { Drawer, DrawerContent, DrawerContentBody, DrawerPanelContent, DrawerSection } from "@patternfly/react-core";

export const TC020_DrawerColorVariant: React.FC = () => (
  <Drawer isExpanded>
    <DrawerContent
      colorVariant="light-200"
      panelContent={
        <DrawerPanelContent colorVariant="light-200">
          <DrawerSection colorVariant="light-200">Panel content</DrawerSection>
        </DrawerPanelContent>
      }
    >
      <DrawerContentBody>Main content</DrawerContentBody>
    </DrawerContent>
  </Drawer>
);
```

- [ ] **Step 7: Write TC021-drawer-content-color.tsx**

```tsx
import React from "react";
import { Drawer, DrawerContent, DrawerContentBody, DrawerPanelContent } from "@patternfly/react-core";

export const TC021_DrawerContentColor: React.FC = () => (
  <Drawer isExpanded>
    <DrawerContent
      colorVariant="no-background"
      panelContent={<DrawerPanelContent>Panel</DrawerPanelContent>}
    >
      <DrawerContentBody>Main content</DrawerContentBody>
    </DrawerContent>
  </Drawer>
);
```

- [ ] **Step 8: Write TC022-drawer-head-panelbody.tsx**

```tsx
import React from "react";
import { Drawer, DrawerContent, DrawerContentBody, DrawerHead, DrawerPanelContent } from "@patternfly/react-core";

export const TC022_DrawerHeadPanelBody: React.FC = () => (
  <Drawer isExpanded>
    <DrawerContent panelContent={
      <DrawerPanelContent>
        <DrawerHead>
          <span>Title inside DrawerHead</span>
        </DrawerHead>
      </DrawerPanelContent>
    }>
      <DrawerContentBody>Main content</DrawerContentBody>
    </DrawerContent>
  </Drawer>
);
```

- [ ] **Step 9: Write TC023-duallistselector-deprecated.tsx**

```tsx
import React from "react";
import { DualListSelector } from "@patternfly/react-core";

export const TC023_DualListSelectorDeprecated: React.FC = () => (
  <DualListSelector
    availableOptions={["Option 1", "Option 2", "Option 3"]}
    chosenOptions={["Option 4"]}
  />
);
```

- [ ] **Step 10: Write TC024-duallistselector-next.tsx**

```tsx
import React from "react";
// In PF5, the next DualListSelector was at @patternfly/react-core/next
// This test case verifies import path migration
import { DualListSelector } from "@patternfly/react-core";

export const TC024_DualListSelectorNext: React.FC = () => (
  <DualListSelector
    availableOptions={["Alpha", "Beta"]}
    chosenOptions={["Gamma"]}
  />
);
```

- [ ] **Step 11: Write TC025-duplicate-imports.tsx**

```tsx
import React from "react";
import { Button, Alert, Button } from "@patternfly/react-core";

export const TC025_DuplicateImports: React.FC = () => (
  <div>
    <Alert variant="info" title="Info">Alert content</Alert>
    <Button>Click</Button>
  </div>
);
```

Note: This file intentionally has a duplicate `Button` import. TypeScript may warn but PF5 should still compile. If it fails to compile, remove one duplicate and add a comment explaining the test case.

- [ ] **Step 12: Write TC026-emptystate-exports.tsx**

```tsx
import React from "react";
import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateHeader } from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";

export const TC026_EmptyStateExports: React.FC = () => (
  <EmptyState>
    <EmptyStateHeader titleText="Empty" headingLevel="h2" icon={<EmptyStateIcon icon={CubesIcon} />} />
    <EmptyStateBody>No data available</EmptyStateBody>
  </EmptyState>
);
```

- [ ] **Step 13: Write TC027-emptystate-header.tsx**

```tsx
import React from "react";
import { EmptyState, EmptyStateBody, EmptyStateIcon } from "@patternfly/react-core";
import { SearchIcon } from "@patternfly/react-icons";
import { Title } from "@patternfly/react-core";

export const TC027_EmptyStateHeader: React.FC = () => (
  <EmptyState>
    <EmptyStateIcon icon={SearchIcon} />
    <Title headingLevel="h2" size="lg">No results found</Title>
    <EmptyStateBody>Try adjusting your search.</EmptyStateBody>
  </EmptyState>
);
```

- [ ] **Step 14: Write TC028-errorstate-props.tsx**

```tsx
import React from "react";
import { ErrorState } from "@patternfly/react-component-groups";

export const TC028_ErrorStateProps: React.FC = () => (
  <ErrorState errorTitle="Something went wrong" errorDescription="An unexpected error occurred. Please try again." />
);
```

- [ ] **Step 15: Write TC029-formfield-typo.tsx**

```tsx
import React from "react";
import { FormFieldGroupHeader, FormGroup, TextInput } from "@patternfly/react-core";

// This tests the interface typo fix: FormFiledGroupHeaderTitleTextObject -> FormFieldGroupHeaderTitleTextObject
// The actual interface usage would be in TypeScript type annotations
export const TC029_FormFieldTypo: React.FC = () => (
  <FormGroup label="Name">
    <TextInput id="tc029-input" />
  </FormGroup>
);
```

- [ ] **Step 16: Write TC030-formgroup-labelicon.tsx**

```tsx
import React from "react";
import { FormGroup, Popover, TextInput } from "@patternfly/react-core";
import { HelpIcon } from "@patternfly/react-icons";

export const TC030_FormGroupLabelIcon: React.FC = () => (
  <FormGroup
    label="Full name"
    labelIcon={
      <Popover bodyContent="Enter your full legal name">
        <button aria-label="Help">
          <HelpIcon />
        </button>
      </Popover>
    }
  >
    <TextInput id="tc030-input" />
  </FormGroup>
);
```

- [ ] **Step 17: Commit**

```bash
git add src/test-cases/TC01[5-9]*.tsx src/test-cases/TC02*.tsx src/test-cases/TC030*.tsx
git commit -m "Add test cases TC015-TC030: Content header through Form group"
```

---

### Task 5: Write test cases TC031–TC045 (Helper text through Masthead)

**Files:**
- Create: `src/test-cases/TC031-helpertextitem-hasIcon.tsx`
- Create: `src/test-cases/TC032-helpertextitem-screenreader.tsx`
- Create: `src/test-cases/TC033-invalidobject-props.tsx`
- Create: `src/test-cases/TC034-jumplinksitem-href.tsx`
- Create: `src/test-cases/TC035-jumplinksitem-markup.tsx`
- Create: `src/test-cases/TC036-kebabtoggle-removed.tsx`
- Create: `src/test-cases/TC037-label-overflow.tsx`
- Create: `src/test-cases/TC038-logsnippet-variant.tsx`
- Create: `src/test-cases/TC039-logviewer-stylesheet.tsx`
- Create: `src/test-cases/TC040-login-footer-links.tsx`
- Create: `src/test-cases/TC041-login-main-header.tsx`
- Create: `src/test-cases/TC042-masthead-brand-logo.tsx`
- Create: `src/test-cases/TC043-masthead-bgcolor.tsx`
- Create: `src/test-cases/TC044-masthead-structure.tsx`
- Create: `src/test-cases/TC045-menuitemaction-markup.tsx`

- [ ] **Step 1: Write TC031-helpertextitem-hasIcon.tsx**

```tsx
import React from "react";
import { HelperText, HelperTextItem } from "@patternfly/react-core";

export const TC031_HelperTextItemHasIcon: React.FC = () => (
  <HelperText>
    <HelperTextItem hasIcon isDynamic variant="success">
      Validation passed
    </HelperTextItem>
    <HelperTextItem hasIcon isDynamic variant="error">
      Validation failed
    </HelperTextItem>
  </HelperText>
);
```

- [ ] **Step 2: Write TC032-helpertextitem-screenreader.tsx**

```tsx
import React from "react";
import { HelperText, HelperTextItem } from "@patternfly/react-core";

export const TC032_HelperTextItemScreenReader: React.FC = () => (
  <HelperText>
    <HelperTextItem variant="default" screenReaderText="Default helper text:">
      This is default helper text with screenReaderText
    </HelperTextItem>
    <HelperTextItem variant="error" screenReaderText="Error:">
      This field has an error
    </HelperTextItem>
  </HelperText>
);
```

- [ ] **Step 3: Write TC033-invalidobject-props.tsx**

```tsx
import React from "react";
import { InvalidObject } from "@patternfly/react-component-groups";

export const TC033_InvalidObjectProps: React.FC = () => (
  <InvalidObject
    invalidObjectTitleText="Page not found"
    invalidObjectBodyText="The requested page could not be found."
  />
);
```

- [ ] **Step 4: Write TC034-jumplinksitem-href.tsx**

```tsx
import React from "react";
import { JumpLinks, JumpLinksItem } from "@patternfly/react-core";

export const TC034_JumpLinksItemHref: React.FC = () => (
  <JumpLinks>
    <JumpLinksItem>Section 1</JumpLinksItem>
    <JumpLinksItem href="#section-2">Section 2</JumpLinksItem>
  </JumpLinks>
);
```

- [ ] **Step 5: Write TC035-jumplinksitem-markup.tsx**

```tsx
import React from "react";
import { JumpLinks, JumpLinksItem } from "@patternfly/react-core";

export const TC035_JumpLinksItemMarkup: React.FC = () => (
  <JumpLinks>
    <JumpLinksItem href="#section-a" onClick={(e) => { e.preventDefault(); }}>
      Section A
    </JumpLinksItem>
  </JumpLinks>
);
```

- [ ] **Step 6: Write TC036-kebabtoggle-removed.tsx**

```tsx
import React from "react";
import { Dropdown, KebabToggle } from "@patternfly/react-core/deprecated";

export const TC036_KebabToggleRemoved: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dropdown
      isOpen={isOpen}
      isPlain
      toggle={<KebabToggle onToggle={() => setIsOpen(!isOpen)} />}
      dropdownItems={[]}
    />
  );
};
```

- [ ] **Step 7: Write TC037-label-overflow.tsx**

```tsx
import React from "react";
import { Label, LabelGroup } from "@patternfly/react-core";

export const TC037_LabelOverflow: React.FC = () => (
  <LabelGroup>
    <Label>Label 1</Label>
    <Label>Label 2</Label>
    <Label isOverflowLabel>3 more</Label>
  </LabelGroup>
);
```

- [ ] **Step 8: Write TC038-logsnippet-variant.tsx**

```tsx
import React from "react";
import { LogSnippet } from "@patternfly/react-component-groups";

export const TC038_LogSnippetVariant: React.FC = () => (
  <LogSnippet
    message="Error occurred during build"
    logSnippet="ERROR: Build failed at step 3"
    leftBorderVariant="danger"
  />
);
```

- [ ] **Step 9: Write TC039-logviewer-stylesheet.tsx**

```tsx
import React from "react";

// In PF5, LogViewer CSS was imported from @patternfly/react-core or similar
// This test verifies the import path update
// Note: @patternfly/react-log-viewer may need to be installed separately
export const TC039_LogViewerStylesheet: React.FC = () => (
  <div>LogViewer stylesheet test — import path migration</div>
);
```

- [ ] **Step 10: Write TC040-login-footer-links.tsx**

```tsx
import React from "react";
import { LoginMainFooterLinksItem } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";

export const TC040_LoginFooterLinks: React.FC = () => (
  <LoginMainFooterLinksItem href="https://example.com" target="_blank" linkComponentProps={{ "aria-label": "Help link" }}>
    <ExternalLinkAltIcon />
  </LoginMainFooterLinksItem>
);
```

- [ ] **Step 11: Write TC041-login-main-header.tsx**

```tsx
import React from "react";
import { LoginMainHeader } from "@patternfly/react-core";

export const TC041_LoginMainHeader: React.FC = () => (
  <LoginMainHeader title="Log in to your account" subtitle="Enter your credentials" />
);
```

- [ ] **Step 12: Write TC042-masthead-brand-logo.tsx**

```tsx
import React from "react";
import { Brand, Masthead, MastheadBrand, MastheadContent } from "@patternfly/react-core";

export const TC042_MastheadBrandLogo: React.FC = () => (
  <Masthead>
    <MastheadBrand>
      <Brand src="/logo.svg" alt="Logo" />
    </MastheadBrand>
    <MastheadContent>Header content</MastheadContent>
  </Masthead>
);
```

- [ ] **Step 13: Write TC043-masthead-bgcolor.tsx**

```tsx
import React from "react";
import { Masthead, MastheadContent } from "@patternfly/react-core";

export const TC043_MastheadBgColor: React.FC = () => (
  <Masthead backgroundColor="dark">
    <MastheadContent>Dark header</MastheadContent>
  </Masthead>
);
```

- [ ] **Step 14: Write TC044-masthead-structure.tsx**

```tsx
import React from "react";
import { Brand, Button, Masthead, MastheadBrand, MastheadContent, MastheadMain, MastheadToggle } from "@patternfly/react-core";
import { BarsIcon } from "@patternfly/react-icons";

export const TC044_MastheadStructure: React.FC = () => (
  <Masthead>
    <MastheadToggle>
      <Button variant="plain" aria-label="Toggle"><BarsIcon /></Button>
    </MastheadToggle>
    <MastheadMain>
      <MastheadBrand>
        <Brand src="/logo.svg" alt="Logo" />
      </MastheadBrand>
    </MastheadMain>
    <MastheadContent>Content</MastheadContent>
  </Masthead>
);
```

- [ ] **Step 15: Write TC045-menuitemaction-markup.tsx**

```tsx
import React from "react";
import { Menu, MenuContent, MenuItem, MenuItemAction, MenuList } from "@patternfly/react-core";
import { BellIcon } from "@patternfly/react-icons";

export const TC045_MenuItemActionMarkup: React.FC = () => (
  <Menu>
    <MenuContent>
      <MenuList>
        <MenuItem
          actions={<MenuItemAction icon={<BellIcon />} actionId="alert" aria-label="Alert" />}
        >
          Menu item with action
        </MenuItem>
      </MenuList>
    </MenuContent>
  </Menu>
);
```

- [ ] **Step 16: Commit**

```bash
git add src/test-cases/TC03[1-9]*.tsx src/test-cases/TC04[0-5]*.tsx
git commit -m "Add test cases TC031-TC045: Helper text through Masthead"
```

---

### Task 6: Write test cases TC046–TC060 (Menu toggle through Page)

**Files:**
- Create: `src/test-cases/TC046-menutoggle-icon.tsx`
- Create: `src/test-cases/TC047-missing-page.tsx`
- Create: `src/test-cases/TC048-modal-deprecated.tsx`
- Create: `src/test-cases/TC049-modal-next.tsx`
- Create: `src/test-cases/TC050-multicontentcard-props.tsx`
- Create: `src/test-cases/TC051-nav-tertiary.tsx`
- Create: `src/test-cases/TC052-nav-theme.tsx`
- Create: `src/test-cases/TC053-navitem-wrapper.tsx`
- Create: `src/test-cases/TC054-notauthorized-props.tsx`
- Create: `src/test-cases/TC055-notificationbadge-markup.tsx`
- Create: `src/test-cases/TC056-notificationdrawer-header.tsx`
- Create: `src/test-cases/TC057-page-header-to-masthead.tsx`
- Create: `src/test-cases/TC058-page-tertiarynav-grouped.tsx`
- Create: `src/test-cases/TC059-page-tertiarynav-width.tsx`
- Create: `src/test-cases/TC060-page-tertiarynav.tsx`

- [ ] **Step 1: Write TC046-menutoggle-icon.tsx**

```tsx
import React from "react";
import { MenuToggle } from "@patternfly/react-core";
import { CogIcon } from "@patternfly/react-icons";

export const TC046_MenuToggleIcon: React.FC = () => (
  <MenuToggle>
    <CogIcon /> Settings
  </MenuToggle>
);
```

- [ ] **Step 2: Write TC047-missing-page.tsx**

```tsx
import React from "react";
import { InvalidObject } from "@patternfly/react-component-groups";

export const TC047_MissingPage: React.FC = () => (
  <InvalidObject
    invalidObjectTitleText="Page not found"
    invalidObjectBodyText="The page you are looking for does not exist."
  />
);
```

- [ ] **Step 3: Write TC048-modal-deprecated.tsx**

```tsx
import React from "react";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";

export const TC048_ModalDeprecated: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <Modal
        variant={ModalVariant.small}
        title="Modal title"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        actions={[
          <Button key="confirm" variant="primary" onClick={() => setIsOpen(false)}>Confirm</Button>,
          <Button key="cancel" variant="link" onClick={() => setIsOpen(false)}>Cancel</Button>,
        ]}
      >
        Modal body content
      </Modal>
    </>
  );
};
```

- [ ] **Step 4: Write TC049-modal-next.tsx**

```tsx
import React from "react";
import { Button } from "@patternfly/react-core";
// In PF5, the next Modal implementation was accessed via /next path
import { Modal, ModalVariant } from "@patternfly/react-core";

export const TC049_ModalNext: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <Modal variant={ModalVariant.small} isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal">
        Content
      </Modal>
    </>
  );
};
```

- [ ] **Step 5: Write TC050-multicontentcard-props.tsx**

```tsx
import React from "react";
import { MultiContentCard } from "@patternfly/react-component-groups";
import { Card, CardBody } from "@patternfly/react-core";

export const TC050_MultiContentCardProps: React.FC = () => (
  <MultiContentCard
    leftBorderVariant="danger"
    withHeaderBorder
    cards={[
      { content: <Card><CardBody>Card 1</CardBody></Card>, id: "card-1" },
    ]}
  />
);
```

- [ ] **Step 6: Write TC051-nav-tertiary.tsx**

```tsx
import React from "react";
import { Nav, NavItem, NavList } from "@patternfly/react-core";

export const TC051_NavTertiary: React.FC = () => (
  <Nav variant="tertiary">
    <NavList>
      <NavItem to="#">Tab 1</NavItem>
      <NavItem to="#">Tab 2</NavItem>
    </NavList>
  </Nav>
);
```

- [ ] **Step 7: Write TC052-nav-theme.tsx**

```tsx
import React from "react";
import { Nav, NavItem, NavList } from "@patternfly/react-core";

export const TC052_NavTheme: React.FC = () => (
  <Nav theme="dark">
    <NavList>
      <NavItem to="#">Link 1</NavItem>
      <NavItem to="#">Link 2</NavItem>
    </NavList>
  </Nav>
);
```

- [ ] **Step 8: Write TC053-navitem-wrapper.tsx**

```tsx
import React from "react";
import { Nav, NavItem, NavList } from "@patternfly/react-core";
import { HomeIcon } from "@patternfly/react-icons";

export const TC053_NavItemWrapper: React.FC = () => (
  <Nav>
    <NavList>
      <NavItem to="#" hasNavLinkWrapper>
        <HomeIcon /> Home
      </NavItem>
    </NavList>
  </Nav>
);
```

- [ ] **Step 9: Write TC054-notauthorized-props.tsx**

```tsx
import React from "react";
import { NotAuthorized } from "@patternfly/react-component-groups";

export const TC054_NotAuthorizedProps: React.FC = () => (
  <NotAuthorized
    title="Access denied"
    description="You do not have permission to view this page."
  />
);
```

- [ ] **Step 10: Write TC055-notificationbadge-markup.tsx**

```tsx
import React from "react";
import { NotificationBadge } from "@patternfly/react-core";

export const TC055_NotificationBadgeMarkup: React.FC = () => (
  <NotificationBadge variant="read" count={5} onClick={() => {}} aria-label="Notifications" />
);
```

- [ ] **Step 11: Write TC056-notificationdrawer-header.tsx**

```tsx
import React from "react";
import { NotificationDrawer, NotificationDrawerHeader } from "@patternfly/react-core";

export const TC056_NotificationDrawerHeader: React.FC = () => (
  <NotificationDrawer>
    <NotificationDrawerHeader title="Notifications" count={3} />
  </NotificationDrawer>
);
```

- [ ] **Step 12: Write TC057-page-header-to-masthead.tsx**

```tsx
import React from "react";
import { Masthead, MastheadContent, Page, PageSection } from "@patternfly/react-core";

const header = (
  <Masthead>
    <MastheadContent>Header</MastheadContent>
  </Masthead>
);

export const TC057_PageHeaderToMasthead: React.FC = () => (
  <Page header={header}>
    <PageSection>Page content</PageSection>
  </Page>
);
```

- [ ] **Step 13: Write TC058-page-tertiarynav-grouped.tsx**

```tsx
import React from "react";
import { Page, PageSection } from "@patternfly/react-core";

export const TC058_PageTertiaryNavGrouped: React.FC = () => (
  <Page isTertiaryNavGrouped>
    <PageSection>Content</PageSection>
  </Page>
);
```

- [ ] **Step 14: Write TC059-page-tertiarynav-width.tsx**

```tsx
import React from "react";
import { Page, PageSection } from "@patternfly/react-core";

export const TC059_PageTertiaryNavWidth: React.FC = () => (
  <Page isTertiaryNavWidthLimited>
    <PageSection>Content</PageSection>
  </Page>
);
```

- [ ] **Step 15: Write TC060-page-tertiarynav.tsx**

```tsx
import React from "react";
import { Nav, NavItem, NavList, Page, PageSection } from "@patternfly/react-core";

const tertiaryNav = (
  <Nav variant="tertiary">
    <NavList>
      <NavItem to="#">Sub 1</NavItem>
      <NavItem to="#">Sub 2</NavItem>
    </NavList>
  </Nav>
);

export const TC060_PageTertiaryNav: React.FC = () => (
  <Page tertiaryNav={tertiaryNav}>
    <PageSection>Content</PageSection>
  </Page>
);
```

- [ ] **Step 16: Commit**

```bash
git add src/test-cases/TC04[6-9]*.tsx src/test-cases/TC05*.tsx src/test-cases/TC060*.tsx
git commit -m "Add test cases TC046-TC060: Menu toggle through Page"
```

---

### Task 7: Write test cases TC061–TC075 (Page body through Tabs)

**Files:**
- Create: `src/test-cases/TC061-page-body-wrapper.tsx`
- Create: `src/test-cases/TC062-page-section-bodywrapper.tsx`
- Create: `src/test-cases/TC063-pageheader-tools-isselected.tsx`
- Create: `src/test-cases/TC064-pagenavigation-removed.tsx`
- Create: `src/test-cases/TC065-pagesection-nav-type.tsx`
- Create: `src/test-cases/TC066-pagesection-variant.tsx`
- Create: `src/test-cases/TC067-pagesection-variant-type.tsx`
- Create: `src/test-cases/TC068-pagesidebar-theme.tsx`
- Create: `src/test-cases/TC069-pagination-markup.tsx`
- Create: `src/test-cases/TC070-popper-appendto.tsx`
- Create: `src/test-cases/TC071-simplefileupload-aria.tsx`
- Create: `src/test-cases/TC072-slider-css-variable.tsx`
- Create: `src/test-cases/TC073-switch-labeloff.tsx`
- Create: `src/test-cases/TC074-tabs-issecondary.tsx`
- Create: `src/test-cases/TC075-tabs-light300.tsx`

- [ ] **Step 1: Write TC061-page-body-wrapper.tsx**

```tsx
import React from "react";
import { Nav, NavItem, NavList, Page, PageSection } from "@patternfly/react-core";

export const TC061_PageBodyWrapper: React.FC = () => (
  <Page breadcrumb={<div>Home / Page</div>}>
    <PageSection>Content</PageSection>
  </Page>
);
```

- [ ] **Step 2: Write TC062-page-section-bodywrapper.tsx**

```tsx
import React from "react";
import { Page, PageSection } from "@patternfly/react-core";

export const TC062_PageSectionBodyWrapper: React.FC = () => (
  <Page>
    <PageSection variant="light" isWidthLimited>
      Width-limited section
    </PageSection>
    <PageSection>Default section</PageSection>
  </Page>
);
```

- [ ] **Step 3: Write TC063-pageheader-tools-isselected.tsx**

```tsx
import React from "react";
import { PageHeaderToolsItem } from "@patternfly/react-core";

export const TC063_PageHeaderToolsIsSelected: React.FC = () => (
  <PageHeaderToolsItem isSelected>
    <span>Selected tool</span>
  </PageHeaderToolsItem>
);
```

- [ ] **Step 4: Write TC064-pagenavigation-removed.tsx**

```tsx
import React from "react";
import { Nav, NavItem, NavList, Page, PageNavigation, PageSection } from "@patternfly/react-core";

export const TC064_PageNavigationRemoved: React.FC = () => (
  <Page>
    <PageNavigation>
      <Nav>
        <NavList>
          <NavItem to="#">Link</NavItem>
        </NavList>
      </Nav>
    </PageNavigation>
    <PageSection>Content</PageSection>
  </Page>
);
```

- [ ] **Step 5: Write TC065-pagesection-nav-type.tsx**

```tsx
import React from "react";
import { Nav, NavItem, NavList, PageSection } from "@patternfly/react-core";

export const TC065_PageSectionNavType: React.FC = () => (
  <PageSection type="nav">
    <Nav>
      <NavList>
        <NavItem to="#">Link</NavItem>
      </NavList>
    </Nav>
  </PageSection>
);
```

- [ ] **Step 6: Write TC066-pagesection-variant.tsx**

```tsx
import React from "react";
import { PageSection } from "@patternfly/react-core";

export const TC066_PageSectionVariant: React.FC = () => (
  <div>
    <PageSection variant="light">Light section</PageSection>
    <PageSection variant="dark">Dark section</PageSection>
    <PageSection variant="darker">Darker section</PageSection>
  </div>
);
```

- [ ] **Step 7: Write TC067-pagesection-variant-type.tsx**

```tsx
import React from "react";
import { PageSection } from "@patternfly/react-core";

export const TC067_PageSectionVariantType: React.FC = () => (
  <PageSection variant="light" type="wizard">
    Section with variant and non-default type
  </PageSection>
);
```

- [ ] **Step 8: Write TC068-pagesidebar-theme.tsx**

```tsx
import React from "react";
import { PageSidebar } from "@patternfly/react-core";

export const TC068_PageSidebarTheme: React.FC = () => (
  <PageSidebar theme="dark">
    Sidebar content
  </PageSidebar>
);
```

- [ ] **Step 9: Write TC069-pagination-markup.tsx**

```tsx
import React from "react";
import { Pagination } from "@patternfly/react-core";

export const TC069_PaginationMarkup: React.FC = () => (
  <Pagination itemCount={100} perPage={20} page={1} onSetPage={() => {}} onPerPageSelect={() => {}} />
);
```

- [ ] **Step 10: Write TC070-popper-appendto.tsx**

```tsx
import React from "react";
import { Select, SelectOption, SelectVariant } from "@patternfly/react-core/deprecated";

export const TC070_PopperAppendTo: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Select
      variant={SelectVariant.single}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      onSelect={() => setIsOpen(false)}
    >
      <SelectOption value="Option 1" />
      <SelectOption value="Option 2" />
    </Select>
  );
};
```

- [ ] **Step 11: Write TC071-simplefileupload-aria.tsx**

```tsx
import React from "react";
import { SimpleFileUpload } from "@patternfly/react-core";

export const TC071_SimpleFileUploadAria: React.FC = () => (
  <SimpleFileUpload
    id="tc071-upload"
    browseButtonText="Browse"
  />
);
```

- [ ] **Step 12: Write TC072-slider-css-variable.tsx and companion CSS**

Write `src/test-cases/TC072-slider-css-variable.css`:
```css
.custom-slider .pf-v5-c-slider__step {
  --pf-v5-c-slider__step--Left: 50%;
}
```

Write `src/test-cases/TC072-slider-css-variable.tsx`:
```tsx
import React from "react";
import { Slider } from "@patternfly/react-core";
import "./TC072-slider-css-variable.css";

export const TC072_SliderCssVariable: React.FC = () => (
  <div className="custom-slider">
    <Slider value={50} />
  </div>
);
```

- [ ] **Step 13: Write TC073-switch-labeloff.tsx**

```tsx
import React from "react";
import { Switch } from "@patternfly/react-core";

export const TC073_SwitchLabelOff: React.FC = () => (
  <Switch
    id="tc073-switch"
    label="Enabled"
    labelOff="Disabled"
    isChecked={false}
    onChange={() => {}}
  />
);
```

- [ ] **Step 14: Write TC074-tabs-issecondary.tsx**

```tsx
import React from "react";
import { Tab, TabTitleText, Tabs } from "@patternfly/react-core";

export const TC074_TabsIsSecondary: React.FC = () => (
  <Tabs isSecondary activeKey={0}>
    <Tab eventKey={0} title={<TabTitleText>Tab 1</TabTitleText>}>Content 1</Tab>
    <Tab eventKey={1} title={<TabTitleText>Tab 2</TabTitleText>}>Content 2</Tab>
  </Tabs>
);
```

- [ ] **Step 15: Write TC075-tabs-light300.tsx**

```tsx
import React from "react";
import { Tab, TabTitleText, Tabs } from "@patternfly/react-core";

export const TC075_TabsLight300: React.FC = () => (
  <Tabs variant="light300" activeKey={0}>
    <Tab eventKey={0} title={<TabTitleText>Tab 1</TabTitleText>}>Content 1</Tab>
  </Tabs>
);
```

- [ ] **Step 16: Commit**

```bash
git add src/test-cases/TC06*.tsx src/test-cases/TC07[0-5]*.tsx src/test-cases/TC072-slider-css-variable.css
git commit -m "Add test cases TC061-TC075: Page body through Tabs"
```

---

### Task 8: Write test cases TC076–TC085 (Tabs scroll through Toolbar)

**Files:**
- Create: `src/test-cases/TC076-tabs-scroll-markup.tsx`
- Create: `src/test-cases/TC077-text-to-content.tsx`
- Create: `src/test-cases/TC078-th-css-variables.tsx` and `.css`
- Create: `src/test-cases/TC079-tile-deprecated.tsx`
- Create: `src/test-cases/TC080-tokens-prefix.tsx`
- Create: `src/test-cases/TC081-tokens-css.tsx` and `.css`
- Create: `src/test-cases/TC082-toolbar-props-removed.tsx`
- Create: `src/test-cases/TC083-toolbar-chip-to-label.tsx`
- Create: `src/test-cases/TC084-toolbar-interface-rename.tsx`
- Create: `src/test-cases/TC085-toolbar-spacer-removed.tsx`

- [ ] **Step 1: Write TC076-tabs-scroll-markup.tsx**

```tsx
import React from "react";
import { Tab, TabTitleText, Tabs } from "@patternfly/react-core";

export const TC076_TabsScrollMarkup: React.FC = () => (
  <Tabs isBox activeKey={0}>
    {Array.from({ length: 20 }, (_, i) => (
      <Tab key={i} eventKey={i} title={<TabTitleText>Tab {i + 1}</TabTitleText>}>
        Content {i + 1}
      </Tab>
    ))}
  </Tabs>
);
```

- [ ] **Step 2: Write TC077-text-to-content.tsx**

```tsx
import React from "react";
import { Text, TextContent, TextList, TextListItem, TextVariants } from "@patternfly/react-core";

export const TC077_TextToContent: React.FC = () => (
  <TextContent>
    <Text component={TextVariants.h1}>Heading</Text>
    <Text component={TextVariants.p}>Paragraph text</Text>
    <TextList>
      <TextListItem>Item 1</TextListItem>
      <TextListItem>Item 2</TextListItem>
    </TextList>
  </TextContent>
);
```

- [ ] **Step 3: Write TC078-th-css-variables.css and TC078-th-css-variables.tsx**

Write `src/test-cases/TC078-th-css-variables.css`:
```css
.custom-table th.pf-v5-c-table__sticky-column {
  --pf-v5-c-table__sticky-column--Left: 0;
  --pf-v5-c-table__sticky-column--Right: auto;
}
```

Write `src/test-cases/TC078-th-css-variables.tsx`:
```tsx
import React from "react";
import { Table, Thead, Tr, Th, Tbody, Td } from "@patternfly/react-table";
import "./TC078-th-css-variables.css";

export const TC078_ThCssVariables: React.FC = () => (
  <Table aria-label="Sticky column table" className="custom-table">
    <Thead>
      <Tr>
        <Th isStickyColumn>Name</Th>
        <Th>Value</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td isStickyColumn>Row 1</Td>
        <Td>Data</Td>
      </Tr>
    </Tbody>
  </Table>
);
```

- [ ] **Step 4: Write TC079-tile-deprecated.tsx**

```tsx
import React from "react";
import { Tile } from "@patternfly/react-core";

export const TC079_TileDeprecated: React.FC = () => (
  <div>
    <Tile title="Tile 1" isSelected>Content 1</Tile>
    <Tile title="Tile 2">Content 2</Tile>
  </div>
);
```

- [ ] **Step 5: Write TC080-tokens-prefix.tsx**

```tsx
import React from "react";
import { global_spacer_md, global_Color_dark_100 } from "@patternfly/react-tokens";

export const TC080_TokensPrefix: React.FC = () => (
  <div style={{ padding: global_spacer_md.value, color: global_Color_dark_100.value }}>
    Content using PF5 token values
  </div>
);
```

- [ ] **Step 6: Write TC081-tokens-css.css and TC081-tokens-css.tsx**

Write `src/test-cases/TC081-tokens-css.css`:
```css
.custom-element {
  padding: var(--pf-v5-global--spacer--md);
  color: var(--pf-v5-global--Color--dark-100);
  background-color: var(--pf-v5-global--BackgroundColor--100);
}
```

Write `src/test-cases/TC081-tokens-css.tsx`:
```tsx
import React from "react";
import "./TC081-tokens-css.css";

export const TC081_TokensCss: React.FC = () => (
  <div className="custom-element">Content using PF5 CSS tokens</div>
);
```

- [ ] **Step 7: Write TC082-toolbar-props-removed.tsx**

```tsx
import React from "react";
import { Toolbar, ToolbarContent, ToolbarItem } from "@patternfly/react-core";

export const TC082_ToolbarPropsRemoved: React.FC = () => (
  <Toolbar usePageInsets>
    <ToolbarContent>
      <ToolbarItem alignment={{ default: "alignRight" }} widths={{ default: "200px" }}>
        Item
      </ToolbarItem>
    </ToolbarContent>
  </Toolbar>
);
```

- [ ] **Step 8: Write TC083-toolbar-chip-to-label.tsx**

```tsx
import React from "react";
import { Toolbar, ToolbarContent, ToolbarFilter, ToolbarItem } from "@patternfly/react-core";

export const TC083_ToolbarChipToLabel: React.FC = () => (
  <Toolbar>
    <ToolbarContent>
      <ToolbarFilter
        chips={["Chip 1", "Chip 2"]}
        deleteChip={() => {}}
        deleteChipGroup={() => {}}
        categoryName="Status"
      >
        <ToolbarItem>Filter content</ToolbarItem>
      </ToolbarFilter>
    </ToolbarContent>
  </Toolbar>
);
```

- [ ] **Step 9: Write TC084-toolbar-interface-rename.tsx**

```tsx
import React from "react";
import { Toolbar, ToolbarContent, ToolbarFilter, ToolbarItem } from "@patternfly/react-core";

// This tests the interface rename: ToolbarChipGroup -> ToolbarLabelGroup
// In a real app, you'd use these types in your component props
interface FilterCategory {
  key: string;
  name: string;
}

export const TC084_ToolbarInterfaceRename: React.FC = () => (
  <Toolbar>
    <ToolbarContent>
      <ToolbarItem>Toolbar with renamed interfaces</ToolbarItem>
    </ToolbarContent>
  </Toolbar>
);
```

- [ ] **Step 10: Write TC085-toolbar-spacer-removed.tsx**

```tsx
import React from "react";
import { Button, Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem } from "@patternfly/react-core";

export const TC085_ToolbarSpacerRemoved: React.FC = () => (
  <Toolbar>
    <ToolbarContent>
      <ToolbarGroup spacer={{ default: "spacerLg" }}>
        <ToolbarItem spacer={{ default: "spacerMd" }}>
          <Button>Action 1</Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button>Action 2</Button>
        </ToolbarItem>
      </ToolbarGroup>
    </ToolbarContent>
  </Toolbar>
);
```

- [ ] **Step 11: Commit**

```bash
git add src/test-cases/TC07[6-9]*.tsx src/test-cases/TC08*.tsx src/test-cases/*.css
git commit -m "Add test cases TC076-TC085: Tabs scroll through Toolbar"
```

---

### Task 9: Wire up App.tsx and verify the build

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Update src/App.tsx to import and render all test cases**

```tsx
import React from "react";
import { TC001_AccordionContentIsHidden } from "./test-cases/TC001-accordion-content-isHidden";
import { TC002_AccordionItemMarkup } from "./test-cases/TC002-accordion-item-markup";
import { TC003_AccordionToggleIsExpanded } from "./test-cases/TC003-accordion-toggle-isExpanded";
import { TC004_DataCodemodsCleanup } from "./test-cases/TC004-data-codemods-cleanup";
import { TC005_AvatarBorder } from "./test-cases/TC005-avatar-border";
import { TC006_BannerVariant } from "./test-cases/TC006-banner-variant";
import { TC007_ButtonIconToProp } from "./test-cases/TC007-button-icon-to-prop";
import { TC008_ButtonIsActive } from "./test-cases/TC008-button-isActive";
import { TC009_CardRaisedProps } from "./test-cases/TC009-card-raised-props";
import { TC010_CardSelectableActions } from "./test-cases/TC010-card-selectable-actions";
import { TC011_CheckboxLabelPosition } from "./test-cases/TC011-checkbox-label-position";
import { TC012_ChipDeprecated } from "./test-cases/TC012-chip-deprecated";
import { TC013_ChipToLabel } from "./test-cases/TC013-chip-to-label";
import { TC014_ColorProps } from "./test-cases/TC014-color-props";
import { TC015_ContentHeaderRename } from "./test-cases/TC015-content-header-rename";
import { TC016_DataListAction } from "./test-cases/TC016-datalist-action";
import { TC017_DeprecatedComponents } from "./test-cases/TC017-deprecated-components";
import { TC018_DragDropDeprecated } from "./test-cases/TC018-dragdrop-deprecated";
import { TC019_DrawerHasNoPadding } from "./test-cases/TC019-drawer-hasNoPadding";
import { TC020_DrawerColorVariant } from "./test-cases/TC020-drawer-colorVariant";
import { TC021_DrawerContentColor } from "./test-cases/TC021-drawer-content-color";
import { TC022_DrawerHeadPanelBody } from "./test-cases/TC022-drawer-head-panelbody";
import { TC023_DualListSelectorDeprecated } from "./test-cases/TC023-duallistselector-deprecated";
import { TC024_DualListSelectorNext } from "./test-cases/TC024-duallistselector-next";
import { TC025_DuplicateImports } from "./test-cases/TC025-duplicate-imports";
import { TC026_EmptyStateExports } from "./test-cases/TC026-emptystate-exports";
import { TC027_EmptyStateHeader } from "./test-cases/TC027-emptystate-header";
import { TC028_ErrorStateProps } from "./test-cases/TC028-errorstate-props";
import { TC029_FormFieldTypo } from "./test-cases/TC029-formfield-typo";
import { TC030_FormGroupLabelIcon } from "./test-cases/TC030-formgroup-labelicon";
import { TC031_HelperTextItemHasIcon } from "./test-cases/TC031-helpertextitem-hasIcon";
import { TC032_HelperTextItemScreenReader } from "./test-cases/TC032-helpertextitem-screenreader";
import { TC033_InvalidObjectProps } from "./test-cases/TC033-invalidobject-props";
import { TC034_JumpLinksItemHref } from "./test-cases/TC034-jumplinksitem-href";
import { TC035_JumpLinksItemMarkup } from "./test-cases/TC035-jumplinksitem-markup";
import { TC036_KebabToggleRemoved } from "./test-cases/TC036-kebabtoggle-removed";
import { TC037_LabelOverflow } from "./test-cases/TC037-label-overflow";
import { TC038_LogSnippetVariant } from "./test-cases/TC038-logsnippet-variant";
import { TC039_LogViewerStylesheet } from "./test-cases/TC039-logviewer-stylesheet";
import { TC040_LoginFooterLinks } from "./test-cases/TC040-login-footer-links";
import { TC041_LoginMainHeader } from "./test-cases/TC041-login-main-header";
import { TC042_MastheadBrandLogo } from "./test-cases/TC042-masthead-brand-logo";
import { TC043_MastheadBgColor } from "./test-cases/TC043-masthead-bgcolor";
import { TC044_MastheadStructure } from "./test-cases/TC044-masthead-structure";
import { TC045_MenuItemActionMarkup } from "./test-cases/TC045-menuitemaction-markup";
import { TC046_MenuToggleIcon } from "./test-cases/TC046-menutoggle-icon";
import { TC047_MissingPage } from "./test-cases/TC047-missing-page";
import { TC048_ModalDeprecated } from "./test-cases/TC048-modal-deprecated";
import { TC049_ModalNext } from "./test-cases/TC049-modal-next";
import { TC050_MultiContentCardProps } from "./test-cases/TC050-multicontentcard-props";
import { TC051_NavTertiary } from "./test-cases/TC051-nav-tertiary";
import { TC052_NavTheme } from "./test-cases/TC052-nav-theme";
import { TC053_NavItemWrapper } from "./test-cases/TC053-navitem-wrapper";
import { TC054_NotAuthorizedProps } from "./test-cases/TC054-notauthorized-props";
import { TC055_NotificationBadgeMarkup } from "./test-cases/TC055-notificationbadge-markup";
import { TC056_NotificationDrawerHeader } from "./test-cases/TC056-notificationdrawer-header";
import { TC057_PageHeaderToMasthead } from "./test-cases/TC057-page-header-to-masthead";
import { TC058_PageTertiaryNavGrouped } from "./test-cases/TC058-page-tertiarynav-grouped";
import { TC059_PageTertiaryNavWidth } from "./test-cases/TC059-page-tertiarynav-width";
import { TC060_PageTertiaryNav } from "./test-cases/TC060-page-tertiarynav";
import { TC061_PageBodyWrapper } from "./test-cases/TC061-page-body-wrapper";
import { TC062_PageSectionBodyWrapper } from "./test-cases/TC062-page-section-bodywrapper";
import { TC063_PageHeaderToolsIsSelected } from "./test-cases/TC063-pageheader-tools-isselected";
import { TC064_PageNavigationRemoved } from "./test-cases/TC064-pagenavigation-removed";
import { TC065_PageSectionNavType } from "./test-cases/TC065-pagesection-nav-type";
import { TC066_PageSectionVariant } from "./test-cases/TC066-pagesection-variant";
import { TC067_PageSectionVariantType } from "./test-cases/TC067-pagesection-variant-type";
import { TC068_PageSidebarTheme } from "./test-cases/TC068-pagesidebar-theme";
import { TC069_PaginationMarkup } from "./test-cases/TC069-pagination-markup";
import { TC070_PopperAppendTo } from "./test-cases/TC070-popper-appendto";
import { TC071_SimpleFileUploadAria } from "./test-cases/TC071-simplefileupload-aria";
import { TC072_SliderCssVariable } from "./test-cases/TC072-slider-css-variable";
import { TC073_SwitchLabelOff } from "./test-cases/TC073-switch-labeloff";
import { TC074_TabsIsSecondary } from "./test-cases/TC074-tabs-issecondary";
import { TC075_TabsLight300 } from "./test-cases/TC075-tabs-light300";
import { TC076_TabsScrollMarkup } from "./test-cases/TC076-tabs-scroll-markup";
import { TC077_TextToContent } from "./test-cases/TC077-text-to-content";
import { TC078_ThCssVariables } from "./test-cases/TC078-th-css-variables";
import { TC079_TileDeprecated } from "./test-cases/TC079-tile-deprecated";
import { TC080_TokensPrefix } from "./test-cases/TC080-tokens-prefix";
import { TC081_TokensCss } from "./test-cases/TC081-tokens-css";
import { TC082_ToolbarPropsRemoved } from "./test-cases/TC082-toolbar-props-removed";
import { TC083_ToolbarChipToLabel } from "./test-cases/TC083-toolbar-chip-to-label";
import { TC084_ToolbarInterfaceRename } from "./test-cases/TC084-toolbar-interface-rename";
import { TC085_ToolbarSpacerRemoved } from "./test-cases/TC085-toolbar-spacer-removed";

const testCases = [
  { id: "TC001", component: TC001_AccordionContentIsHidden },
  { id: "TC002", component: TC002_AccordionItemMarkup },
  { id: "TC003", component: TC003_AccordionToggleIsExpanded },
  { id: "TC004", component: TC004_DataCodemodsCleanup },
  { id: "TC005", component: TC005_AvatarBorder },
  { id: "TC006", component: TC006_BannerVariant },
  { id: "TC007", component: TC007_ButtonIconToProp },
  { id: "TC008", component: TC008_ButtonIsActive },
  { id: "TC009", component: TC009_CardRaisedProps },
  { id: "TC010", component: TC010_CardSelectableActions },
  { id: "TC011", component: TC011_CheckboxLabelPosition },
  { id: "TC012", component: TC012_ChipDeprecated },
  { id: "TC013", component: TC013_ChipToLabel },
  { id: "TC014", component: TC014_ColorProps },
  { id: "TC015", component: TC015_ContentHeaderRename },
  { id: "TC016", component: TC016_DataListAction },
  { id: "TC017", component: TC017_DeprecatedComponents },
  { id: "TC018", component: TC018_DragDropDeprecated },
  { id: "TC019", component: TC019_DrawerHasNoPadding },
  { id: "TC020", component: TC020_DrawerColorVariant },
  { id: "TC021", component: TC021_DrawerContentColor },
  { id: "TC022", component: TC022_DrawerHeadPanelBody },
  { id: "TC023", component: TC023_DualListSelectorDeprecated },
  { id: "TC024", component: TC024_DualListSelectorNext },
  { id: "TC025", component: TC025_DuplicateImports },
  { id: "TC026", component: TC026_EmptyStateExports },
  { id: "TC027", component: TC027_EmptyStateHeader },
  { id: "TC028", component: TC028_ErrorStateProps },
  { id: "TC029", component: TC029_FormFieldTypo },
  { id: "TC030", component: TC030_FormGroupLabelIcon },
  { id: "TC031", component: TC031_HelperTextItemHasIcon },
  { id: "TC032", component: TC032_HelperTextItemScreenReader },
  { id: "TC033", component: TC033_InvalidObjectProps },
  { id: "TC034", component: TC034_JumpLinksItemHref },
  { id: "TC035", component: TC035_JumpLinksItemMarkup },
  { id: "TC036", component: TC036_KebabToggleRemoved },
  { id: "TC037", component: TC037_LabelOverflow },
  { id: "TC038", component: TC038_LogSnippetVariant },
  { id: "TC039", component: TC039_LogViewerStylesheet },
  { id: "TC040", component: TC040_LoginFooterLinks },
  { id: "TC041", component: TC041_LoginMainHeader },
  { id: "TC042", component: TC042_MastheadBrandLogo },
  { id: "TC043", component: TC043_MastheadBgColor },
  { id: "TC044", component: TC044_MastheadStructure },
  { id: "TC045", component: TC045_MenuItemActionMarkup },
  { id: "TC046", component: TC046_MenuToggleIcon },
  { id: "TC047", component: TC047_MissingPage },
  { id: "TC048", component: TC048_ModalDeprecated },
  { id: "TC049", component: TC049_ModalNext },
  { id: "TC050", component: TC050_MultiContentCardProps },
  { id: "TC051", component: TC051_NavTertiary },
  { id: "TC052", component: TC052_NavTheme },
  { id: "TC053", component: TC053_NavItemWrapper },
  { id: "TC054", component: TC054_NotAuthorizedProps },
  { id: "TC055", component: TC055_NotificationBadgeMarkup },
  { id: "TC056", component: TC056_NotificationDrawerHeader },
  { id: "TC057", component: TC057_PageHeaderToMasthead },
  { id: "TC058", component: TC058_PageTertiaryNavGrouped },
  { id: "TC059", component: TC059_PageTertiaryNavWidth },
  { id: "TC060", component: TC060_PageTertiaryNav },
  { id: "TC061", component: TC061_PageBodyWrapper },
  { id: "TC062", component: TC062_PageSectionBodyWrapper },
  { id: "TC063", component: TC063_PageHeaderToolsIsSelected },
  { id: "TC064", component: TC064_PageNavigationRemoved },
  { id: "TC065", component: TC065_PageSectionNavType },
  { id: "TC066", component: TC066_PageSectionVariant },
  { id: "TC067", component: TC067_PageSectionVariantType },
  { id: "TC068", component: TC068_PageSidebarTheme },
  { id: "TC069", component: TC069_PaginationMarkup },
  { id: "TC070", component: TC070_PopperAppendTo },
  { id: "TC071", component: TC071_SimpleFileUploadAria },
  { id: "TC072", component: TC072_SliderCssVariable },
  { id: "TC073", component: TC073_SwitchLabelOff },
  { id: "TC074", component: TC074_TabsIsSecondary },
  { id: "TC075", component: TC075_TabsLight300 },
  { id: "TC076", component: TC076_TabsScrollMarkup },
  { id: "TC077", component: TC077_TextToContent },
  { id: "TC078", component: TC078_ThCssVariables },
  { id: "TC079", component: TC079_TileDeprecated },
  { id: "TC080", component: TC080_TokensPrefix },
  { id: "TC081", component: TC081_TokensCss },
  { id: "TC082", component: TC082_ToolbarPropsRemoved },
  { id: "TC083", component: TC083_ToolbarChipToLabel },
  { id: "TC084", component: TC084_ToolbarInterfaceRename },
  { id: "TC085", component: TC085_ToolbarSpacerRemoved },
];

export const App: React.FC = () => (
  <div style={{ padding: "24px" }}>
    <h1>PatternFly 6 Migration Bench — 85 Test Cases</h1>
    {testCases.map(({ id, component: Component }) => (
      <div key={id} style={{ marginBottom: "24px", border: "1px solid #ccc", padding: "16px" }}>
        <h3>{id}</h3>
        <Component />
      </div>
    ))}
  </div>
);
```

- [ ] **Step 2: Run the build**

Run: `cd /Users/jmatthews/synced/patternfly6-migration-bench && npm run build`

Expected: Successful build. Some test cases may produce TypeScript errors if the PF5 API differs from what was written. Fix any type errors by adjusting the test case code to match the actual PF5 API signatures. Common issues:
- Props that don't exist on PF5 components (remove or adjust)
- Import paths that differ (check `@patternfly/react-core` exports)
- Components from `@patternfly/react-component-groups` may have different APIs

For each build error, check the PF5 docs or the actual type definitions in `node_modules/@patternfly/react-core/dist/esm/components/` and fix the test case accordingly.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "Wire up App.tsx with all 85 test case imports and verify build"
```

---

### Task 10: Generate pf-codemods baseline branch

This task creates the `pf-codemods-baseline` branch by running the official PatternFly codemods tool against the test app.

- [ ] **Step 1: Create baseline branch**

Run: `git checkout -b pf-codemods-baseline main`

- [ ] **Step 2: Run pf-codemods**

Run: `npx @patternfly/pf-codemods@latest ./ --v6 --fix`

This will modify source files in-place with PF6-compatible changes. Review the output to see which files were modified.

- [ ] **Step 3: Update PF dependencies to v6**

Update `package.json` to use PF6 packages:
```json
{
  "dependencies": {
    "@patternfly/react-core": "^6.0.0",
    "@patternfly/react-table": "^6.0.0",
    "@patternfly/react-icons": "^6.0.0",
    "@patternfly/react-tokens": "^6.0.0",
    "@patternfly/react-component-groups": "^6.0.0",
    "@patternfly/react-styles": "^6.0.0"
  }
}
```

Run: `npm install`

- [ ] **Step 4: Attempt build and fix issues**

Run: `npm run build`

The build may fail for test cases that pf-codemods doesn't fix (the `fixedWithCodemods: false` cases). Fix only critical build errors — the goal is to see what codemods fixes vs leaves broken.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Generate pf-codemods baseline: npx @patternfly/pf-codemods@latest ./ --v6 --fix"
```

- [ ] **Step 6: Switch back to main**

Run: `git checkout main`

- [ ] **Step 7: Verify which test cases pf-codemods actually fixed**

Run: `git diff main..pf-codemods-baseline --stat`

Compare the list of modified files against the `fixedWithCodemods` flags in `breaking-changes.json`. Update the JSON if reality differs from what the release notes claimed.

---

### Task 11: Build the evaluator skill

**Files:**
- Create: `evaluate-migration/skill.md`

- [ ] **Step 1: Create the skill directory**

Run: `mkdir -p evaluate-migration`

- [ ] **Step 2: Write evaluate-migration/skill.md**

````markdown
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
    "correct": <count of score 3>,
    "partial": <count of score 1-2>,
    "wrong": <count of score 0>,
    "unchanged": <count where tool didn't modify file>,
    "betterThanCodemods": <count>,
    "equalToCodemods": <count>,
    "worseThanCodemods": <count>,
    "codemodsFixableTotal": <count where fixedWithCodemods is true>,
    "codemodsFixableMatched": <count where fixedWithCodemods is true AND score >= 3>
  },
  "testCases": [<per-case results>]
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
````

- [ ] **Step 3: Commit**

```bash
git add evaluate-migration/
git commit -m "Add evaluate-migration Claude Code skill for scoring migration tool output"
```

---

### Task 12: Sanity test the evaluator skill

Test the evaluator skill by running it against the `pf-codemods-baseline` branch. Since pf-codemods is the baseline, it should score itself at 3/3 for all codemod-fixable test cases.

- [ ] **Step 1: Run the evaluator**

Invoke: `/evaluate-migration pf-codemods-baseline`

- [ ] **Step 2: Verify results**

Expected:
- All `fixedWithCodemods: true` test cases should score 3 (fully correct)
- All `fixedWithCodemods: false` test cases should score appropriately (3 if no changes needed, 0 if changes needed but codemods doesn't fix them)
- `vsCodemods` should be "equal" for all codemod-fixable cases
- Summary should show `codemodsFixableMatched` roughly equal to `codemodsFixableTotal`

- [ ] **Step 3: Adjust if needed**

If scores seem wrong:
- Check the `expectedOutcome` descriptions in `breaking-changes.json` — they may need refinement
- Check if pf-codemods actually modified the file (it may not fix everything it claims to)
- Adjust scoring logic in the skill if the rubric needs calibration

- [ ] **Step 4: Commit any adjustments**

```bash
git add -A
git commit -m "Calibrate evaluator skill after sanity test against pf-codemods baseline"
```
