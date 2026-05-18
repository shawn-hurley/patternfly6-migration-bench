# TC013: Chip → Label `onClick` → `onClose` Semantic Prop Split Analysis

## The Problem

When migrating Chip to Label, the tool keeps `onClick` unchanged because both ChipProps and LabelProps have an `onClick` prop with identical type signatures. But in PF5, Chip's `onClick` was the **close button handler**, while in PF6, Label has separate props: `onClick` (general click) and `onClose` (close button handler). The correct mapping is `Chip.onClick → Label.onClose`.

## The Semantic Split

| | PF5 Chip `onClick` | PF6 Label `onClick` | PF6 Label `onClose` |
|---|---|---|---|
| **Purpose** | Dismiss/close button handler | General click on whole label | Dismiss/close button handler |
| **Type** | `(event: React.MouseEvent) => void` | `(event: React.MouseEvent) => void` | `(event: React.MouseEvent) => void` |
| **Renders** | Close button (Button + TimesIcon) | Makes label clickable | Close button (Button + TimesIcon) |
| **Related prop** | `closeBtnAriaLabel` | `isClickable` | `closeBtnAriaLabel` |

PF5 Chip had one event handler (`onClick`) that served as the close/dismiss action. PF6 Label split this into two handlers: `onClick` for general clicks and `onClose` for dismissal. The old single-purpose `onClick` maps to the new `onClose`, not to the new `onClick`.

## Why the Pipeline Maps It Wrong

The prop matching algorithm matches by **name + type signature**:

1. Old `onClick: (event: React.MouseEvent) => void` matches new `onClick: (event: React.MouseEvent) => void` by exact name -- reported as "unchanged"
2. New `onClose: (event: React.MouseEvent) => void` has no name match in old props -- reported as "new prop"
3. The rename detector never considers `onClick → onClose` because `onClick` is already consumed by the name match

This is structurally similar to the InvalidObject/MissingPage problem -- two symbols competing for the same match, and the wrong one wins.

## Available Detection Signals

### Signal: Shared Semantic Context via `closeBtnAriaLabel`

Both old Chip and new Label have `closeBtnAriaLabel` (matched as "unchanged"). The source profiles show this prop flows to the internal close `Button`:

- Old Chip: `Button::aria-label: {closeBtnAriaLabel}` -- the close button
- New Label: `Button::aria-label: {closeBtnAriaLabel || ...}` -- the same close button

The prop name `onClose` shares the semantic stem "close" with `closeBtnAriaLabel`. The prop name `onClick` does NOT share any semantic stem with `closeBtnAriaLabel`. This establishes that `onClose` (not `onClick`) is the semantic successor of the old close-button handler.

### Detection Algorithm

The pattern is generalizable beyond Chip/Label:

**When building prop mappings for a deprecated component replacement, for each name-matched prop `propA`:**

1. Check if the new component also has a **different prop `propB`** with the **same non-trivial type signature** as `propA`
   - Non-trivial excludes `string`, `boolean`, `React.ReactNode` (too common for meaningful matching)
2. Check if there's a **shared prop `propC`** (name-matched on both old and new) whose name shares a **common semantic stem** with `propB` but NOT with `propA`
   - Split camelCase names into words: `closeBtnAriaLabel` -> `[close, btn, aria, label]`
   - `onClose` -> `[on, close]` -- shares "close" with `closeBtnAriaLabel`
   - `onClick` -> `[on, click]` -- does NOT share any word with `closeBtnAriaLabel`
3. If conditions 1+2 are met: reclassify `propA -> propB` as a semantic rename instead of "unchanged"

### Blast Radius

Across all PatternFly deprecated replacements (Chip->Label, ChipGroup->LabelGroup, Tile->Card, etc.), only **Chip -> Label** triggers this pattern. The detection is narrow because it requires:
- A name-matched prop with the same non-trivial type on a new-only prop
- A third shared prop that semantically connects the new-only prop to the matched context

## Where This Would Be Implemented

The detection would be a post-processing step on prop mappings in the deprecated migration code:

1. **`build_deprecated_migration_from_replacement()`** in `konveyor_v2.rs` -- builds the DeprecatedMigrationContext for family strategies
2. **Phase 2 `ReplacedByMember`** in `konveyor_v2.rs` -- builds per-value rules for replaced props

After building the initial name-based matching, scan for semantic splits and reclassify affected props.

## What This Would Fix

- **TC013**: `onClick -> onClose` correctly mapped, rule message would say "Chip.onClick -> Label.onClose (close button handler)" instead of "onClick: unchanged"
- The LLM would receive explicit instructions to rename `onClick` to `onClose` rather than keeping it unchanged

## What This Would NOT Fix

- **TC012/TC013**: Missing `variant="outline"` -- this is a separate issue about a prop that doesn't exist on the old component (documented in TC012 analysis)

## Current Assessment

The code compiles and runs with `onClick` on Label -- it just changes behavior from "close button click" to "make label clickable," which would be caught during functional testing. Scored as 2 (correct but non-idiomatic).

The semantic split detection is a sound, generalizable algorithm but currently only has one instance in the PatternFly dataset. The implementation effort should be weighed against the single-instance benefit.
