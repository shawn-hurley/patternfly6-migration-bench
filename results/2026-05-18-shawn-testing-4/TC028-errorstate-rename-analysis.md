# TC028: ErrorState Prop Rename Pairing — Fingerprint Type Mismatch

## The Problem

TC028 scored 1 (worse than codemods). The tool renamed the wrong prop to `titleText` and removed the prop that should have been renamed.

### PF5 Source (main)

```tsx
<ErrorState errorTitle="Something went wrong" errorDescription="An unexpected error occurred. Please try again." />
```

### Expected Output (pf-codemods)

```tsx
<ErrorState titleText="Something went wrong" bodyText="An unexpected error occurred. Please try again." />
```

### Actual Output (shawn-testing-4)

```tsx
<ErrorState titleText="An unexpected error occurred. Please try again." />
```

The tool:
1. Renamed `errorDescription` to `titleText` (wrong — should go to `bodyText`)
2. Removed `errorTitle` entirely (wrong — should rename to `titleText`)
3. Lost the "Something went wrong" title value completely

## PF6 API Change

ErrorState is from `@patternfly/react-component-groups`. PR [#145](https://github.com/patternfly/react-component-groups/pull/145) renamed all error-prefixed props:

| PF5 Prop | PF5 Type | PF6 Prop | PF6 Type | Correct Rename |
|----------|----------|----------|----------|----------------|
| `errorTitle` | `string` | `titleText` | `React.ReactNode` | `errorTitle` -> `titleText` |
| `errorDescription` | `React.ReactNode` | `bodyText` | `React.ReactNode` | `errorDescription` -> `bodyText` |
| `defaultErrorDescription` | `React.ReactNode` | `defaultBodyText` | `React.ReactNode` | `defaultErrorDescription` -> `defaultBodyText` |

Note the type change: `errorTitle` was `string` in PF5 but its replacement `titleText` is `React.ReactNode` in PF6.

## Why The Automated Mapping Fails

The rename detector uses a 4-pass system where each pass groups candidates by type fingerprint. Only symbols with matching fingerprints compete against each other.

### The Fingerprint Buckets

| Prop | Type | Fingerprint Bucket |
|------|------|--------------------|
| `errorTitle` (removed) | `string` | Bucket A (primitive) |
| `errorDescription` (removed) | `React.ReactNode` | Bucket B (reference) |
| `defaultErrorDescription` (removed) | `React.ReactNode` | Bucket B (reference) |
| `titleText` (added) | `React.ReactNode` | Bucket B (reference) |
| `bodyText` (added) | `React.ReactNode` | Bucket B (reference) |
| `defaultBodyText` (added) | `React.ReactNode` | Bucket B (reference) |

**`errorTitle` is alone in Bucket A.** No added prop has type `string`, so `errorTitle` has zero match candidates in Passes 1-3. It falls through all passes and is classified as `Removed`.

### What Happens in Bucket B

With `errorTitle` excluded, the ReactNode bucket has 2 removed x 3 added = 6 candidate pairs. The greedy matcher sorts by descending `name_similarity` (LCS length / max name length):

| Removed | Added | LCS | Similarity | Match? |
|---------|-------|-----|------------|--------|
| `defaultErrorDescription` | `defaultBodyText` | 10 | **0.4348** | **YES** (highest) |
| `errorDescription` | `defaultBodyText` | 4 | 0.2500 | SKIP (defaultBodyText taken) |
| `errorDescription` | `titleText` | 3 | **0.1875** | TIE |
| `errorDescription` | `bodyText` | 3 | **0.1875** | TIE |
| `defaultErrorDescription` | `titleText` | 3 | 0.1304 | SKIP (defaultErrorDescription taken) |
| `defaultErrorDescription` | `bodyText` | 3 | 0.1304 | SKIP (defaultErrorDescription taken) |

After `defaultErrorDescription -> defaultBodyText` is assigned, `errorDescription` faces an **exact tie at 0.1875** between `titleText` and `bodyText`. Neither name shares a meaningful word with `errorDescription` — the LCS of 3 characters is coincidental overlap (`eet` vs `oet`). The tie is broken by input order (which added symbol appears first in the .d.ts declaration), and `titleText` wins — the wrong answer.

### Why Pass 2 (Structural Normalization) Doesn't Help

Pass 2 normalizes PascalCase identifiers to `_T_` placeholders:
- `string` stays as `string` (lowercase, not PascalCase)
- `React.ReactNode` becomes `_T_._T_` or similar

These are still different fingerprints. `errorTitle` remains isolated.

### Why Pass 4 (Name-Only Fallback) Doesn't Help

Pass 4 matches by name similarity alone (threshold >= 0.6):
- `name_similarity("errorTitle", "titleText")` = 4/10 = 0.40 — below 0.6
- `name_similarity("errorDescription", "bodyText")` = 3/16 = 0.1875 — below 0.6

No Pass 4 matches are generated.

## The Resulting Rules and Fix Strategies

The wrong rename pairing produces these rules and strategies:

| Rule | Strategy | Effect |
|------|----------|--------|
| `errorDescription` renamed to `titleText` | **Rename**: `errorDescription` -> `titleText` | Renames to wrong target |
| `errorTitle` removed | **RemoveProp**: `errorTitle` on ErrorState | Removes instead of renaming |
| `defaultErrorDescription` renamed to `defaultBodyText` | **Rename**: `defaultErrorDescription` -> `defaultBodyText` | Correct |

The fix engine applies both deterministic strategies:
1. Renames `errorDescription="An unexpected error..."` to `titleText="An unexpected error..."` (wrong prop, wrong target)
2. Removes `errorTitle="Something went wrong"` entirely (loses the title value)

The Goose LLM only receives the `ErrorStateProps` base-class signature change rule, determines no changes needed, and exits. It never sees the prop rename violations.

## Cross-Type Impact Analysis

Before implementing a fix, we surveyed all cases across the PF5->PF6 dataset where a removed member has a primitive type (`string`, `boolean`, `number`) and an added member has a non-primitive type (`ReactNode`, union, etc.) on the same interface.

### All Orphaned Primitive -> Non-Primitive Cases

| Component | Removed Prop | Type | Best Cross-Type Match | Similarity | Correct? |
|-----------|-------------|------|-----------------------|------------|----------|
| **ErrorState** | `errorTitle` | `string` | `titleText` (ReactNode) | 0.40 | YES |
| **UnavailableContent** | `unavailableTitleText` | `string` | `titleText` (ReactNode) | 0.40 | YES |
| **UnavailableContent** | `unavailableBodyPreStatusLinkText` | `string` | `bodyText` (ReactNode) | 0.25 | YES |
| **UnavailableContent** | `unavailableBodyPostStatusLinkText` | `string` | `bodyText` (ReactNode) | 0.24 | ACCEPTABLE |
| Card | `isFlat` | `boolean` | `variant` (enum) | 0.43 | NO |
| Card | `isDisabledRaised` | `boolean` | `innerRef` (Ref) | 0.25 | NO |
| Card | `isRounded` | `boolean` | `variant` (enum) | 0.33 | NO |
| Card | `hasSelectableInput` | `boolean` | `variant` (enum) | 0.22 | NO |
| Card | `isSelectableRaised` | `boolean` | `innerRef` (Ref) | 0.22 | NO |
| Card | `selectableInputAriaLabel` | `string` | `variant` (enum) | 0.17 | NO |
| Radio | `isLabelBeforeButton` | `boolean` | `labelPosition` (enum) | 0.42 | MAYBE |
| Checkbox | `isLabelBeforeButton` | `boolean` | `labelPosition` (enum) | 0.42 | MAYBE |
| ExpandableSection | `isActive` | `boolean` | `direction` (enum) | 0.44 | NO |
| Droppable | `hasNoWrapper` | `boolean` | `wrapper` (ReactElement) | 0.50 | MAYBE |

### Key Finding

**All incorrect matches are `boolean` -> non-boolean.** All correct matches are `string` -> `ReactNode`.

If we restrict cross-type matching to **only `string` -> `ReactNode`** (excluding the `selectableInputAriaLabel` case where `variant` is an enum, not ReactNode):

- **Correct**: 4 cases (ErrorState, UnavailableContent x3)
- **Wrong**: 0 cases
- **False positive rate**: 0%

This is a known-safe type widening in TypeScript: every `string` is a valid `ReactNode`. The widening happens because PF6 generalized several `string`-only props to accept any React renderable content.

## Potential Solutions

### Solution A: Cross-Type Widening Pass (Restricted to string -> ReactNode)

Add a Pass 1.5 in `detect_renames()` that runs after Pass 1 for removed members with zero candidates:

1. For each removed member that got zero candidates from Pass 1 (orphaned)
2. Check if its type is `string`
3. If so, try matching against added members with `ReactNode` type in the same interface
4. Use the same `name_similarity` scoring and MIN_SIMILARITY threshold (0.15)

With this pass, `errorTitle` (string, orphaned) would match against `titleText` (ReactNode) with similarity 0.40 — well above 0.15. The greedy matcher then produces:

1. `defaultErrorDescription -> defaultBodyText` (0.4348) from Pass 1
2. `errorTitle -> titleText` (0.4000) from Pass 1.5
3. `errorDescription -> bodyText` (0.1875) from Pass 1 (only option left)

All correct.

**Pros:**
- Fixes TC028 (ErrorState) and would fix UnavailableContent if tested
- Zero false positives in the full PF v5->v6 dataset
- Minimal scope — only fires for orphaned `string` props
- `string -> ReactNode` is always a valid TypeScript widening

**Cons:**
- Only helps the specific `string -> ReactNode` case
- Does not address `boolean -> enum` widenings (Radio/Checkbox `isLabelBeforeButton -> labelPosition`)

**Risk: Low.** Zero wrong matches across the entire dataset with this restriction.

### Solution B: General Compatible-Widening Pass

Broader version of Solution A that handles multiple widening patterns:
- `string -> ReactNode`
- `string -> string | number`
- `boolean -> enum` (with higher similarity threshold to prevent false matches)

**Pros:** More comprehensive
**Cons:** Higher complexity, higher risk of false positives (the `boolean -> enum` cases show 44% wrong match rate)
**Risk: Medium.** Would need per-widening-type threshold tuning.

### Solution C: SD Enrichment Post-Hoc Correction

The `enrich_removal_dispositions_from_sd()` function in `report.rs` already has a prop replacement detection system that uses `augmented_prop_similarity_with_component()` (strips component name prefix before matching). This scorer produces:

| Pair | After Prefix Strip | Similarity |
|------|-------------------|------------|
| `errorTitle -> titleText` | `Title -> titleText` | 0.556 |
| `errorDescription -> bodyText` | `Description -> bodyText` | 0.273 |

This function could detect and correct the wrong pairing. However, it currently only sets `removal_disposition` on the existing API change entries — it does not fix the `change: "renamed"` classification or the rename target.

**Pros:** Doesn't touch the core rename detector
**Cons:** Adds complexity to the enrichment layer, would need to propagate corrections back to the rename classification and fix strategy generation
**Risk: Medium.** Changing enrichment to modify rename classifications is a new pattern.

## Recommendation

**Solution A (cross-type widening pass restricted to `string -> ReactNode`)** is the recommended approach:

1. Zero false positives in the dataset
2. Minimal code change — one additional pass in `detect_renames()`
3. Fixes the root cause at the right layer (rename detection, not post-hoc correction)
4. The restriction to `string -> ReactNode` is principled: it's a known-safe TypeScript type widening where every old value (`string`) is valid in the new type (`ReactNode`)

The fix would turn TC028 from score 1 to score 3 (both prop renames correct, deterministic `Rename` strategy, no LLM dependency).
