# TC021: DrawerContent `colorVariant="no-background"` — Value Mapping Analysis

## The Problem

When migrating `DrawerContent colorVariant="no-background"` from PF5 to PF6, the tool maps it to `colorVariant="default"`. The benchmark expects `colorVariant="primary"`. This document explains why the automated mapping produces a different result than the expected outcome, and why all available heuristics point away from the correct answer.

## PF6 API Change

| PF5 Values | PF6 Values |
|---|---|
| `default`, `light-200`, `no-background` | `default`, `primary`, `secondary` |

- **Removed**: `light-200`, `no-background`
- **Added**: `primary`, `secondary`
- **Surviving**: `default`

The expected mappings per the PF6 migration guide:
- `light-200` → `secondary` (both are "alternate background" variants)
- `no-background` → `primary` (both override the content area background)

## Why The Automated Mapping Fails

The tool uses three heuristic layers to map removed values to replacements. All three fail for `no-background → primary`.

### Layer 1: String Similarity

| Removed → Added | LCS Similarity | Threshold (0.32) | Result |
|---|---|---|---|
| `no-background` → `primary` | 0.154 | Below | No match |
| `no-background` → `secondary` | 0.308 | Below (barely) | No match |

The threshold was specifically set to 0.32 to reject `no-background → secondary` (0.308) as a false match. There is zero lexical relationship between "no-background" and "primary."

### Layer 2: CSS Modifier Bridge (Structural Similarity)

The CSS bridge compares which CSS property "slots" each modifier overrides. It uses `extract_token_slot()` to normalize property names across versions.

**v5 `pf-m-no-background`** overrides:
```
--pf-v5-c-drawer__content--BackgroundColor  → slot: "content--BackgroundColor"
--pf-v5-c-drawer__panel--BackgroundColor    → slot: "panel--BackgroundColor"
--pf-v5-c-drawer__section--BackgroundColor  → slot: "section--BackgroundColor"
```

**v6 `pf-m-primary`** overrides:
```
--pf-v6-c-drawer__content--m-primary--BackgroundColor  → slot: "BackgroundColor"
```

**v6 `pf-m-secondary`** overrides:
```
--pf-v6-c-drawer__content--m-secondary--BackgroundColor   → slot: "BackgroundColor"
--pf-v6-c-drawer__panel--m-secondary--BackgroundColor     → slot: "BackgroundColor"
--pf-v6-c-drawer__section--m-secondary--BackgroundColor   → slot: "BackgroundColor"
```

The slot extraction produces **different namespaces** between v5 and v6:
- v5 tokens embed the element name in the property (`__content--BackgroundColor`), so Strategy 2 of `extract_token_slot` fires, producing `content--BackgroundColor`
- v6 tokens embed the modifier name (`--m-primary--`), so Strategy 1 fires, producing just `BackgroundColor`

Result: **zero structural overlap** between any old and new modifier. The bridge returns empty for all pairs.

### Layer 3: Resolved Value Similarity

This layer compares actual CSS property values (hex colors) via `CssPropertyTargetMap`. However, the target map is **empty** in the current pipeline run — it was never populated for the Drawer component. Even if it were populated:

- Old `no-background` resolves to `transparent` on content, panel, section
- New `primary` resolves to `#fff` on content only

These are visually opposite outcomes (transparent vs white). Color similarity would score near zero.

### Layer 4: Aria Grouping

No aria-label expressions reference `colorVariant` values on DrawerContent. This signal does not apply.

## Why Every Alternative Mapping Is Worse

If the bridge or string similarity DID produce a match, here's what they would suggest:

### `no-background → secondary` (CSS structural match)

If token slots were normalized to strip element prefixes, the slot overlap would be:
- `no-background` (3 slots: content, panel, section) vs `secondary` (3 slots: content, panel, section) → **Jaccard 1.0**
- `no-background` (3 slots) vs `primary` (1 slot: content) → **Jaccard 0.33**

The structural similarity strongly favors `secondary` over `primary`. But `secondary` is **wrong** — it maps `no-background` (transparent backgrounds) to `secondary` (#f2f2f2 gray backgrounds), which is a visible color change. The correct answer `primary` (#fff white) is also a color change from transparent, but it is the designated replacement per the PF6 API design.

### `no-background → default` (LLM's choice)

The LLM reasoned: "no-background suggests transparent/no styling — this aligns with default which is the base/unstyled state." This is plausible reasoning from the name, but `default` in PF6 Drawer means "standard background" which may or may not be transparent depending on the theme context.

## Why `no-background → primary` Is The Correct Answer

The mapping `no-background → primary` is correct because of an **architectural decision** in the PF6 redesign, not because of any measurable CSS property or naming relationship:

1. In PF5, `no-background` was used when the DrawerContent area should be transparent (letting the page background show through)
2. In PF6, the Drawer component restructured its background system. The `primary` variant was created to give DrawerContent a distinct, intentional background (#fff) rather than inheriting/being transparent
3. The PF6 designers decided that code using `no-background` should migrate to `primary` because both represent "the content area has an intentionally set background that differs from the default drawer background"

This is domain knowledge about the **intent** behind the CSS values, not something derivable from the CSS structure, naming, or resolved values.

## What Would Fix This

The `no-background → primary` mapping requires explicit configuration since it cannot be automatically discovered:

- **`--rename-patterns` YAML config**: Add a `prop_value_mappings` section with `DrawerContent.colorVariant: { no-background: primary }`
- **Accept the current behavior**: The tool's choice of `default` is a valid PF6 enum value that compiles and renders — it is just not the intended migration path

## Conclusion

The `no-background → primary` mapping cannot be automatically discovered by any generic heuristic because:
- The names share zero lexical similarity
- The CSS structures produce zero overlap due to token naming convention changes between v5 and v6
- The resolved values are opposite (transparent vs #fff)
- The CSS structural match actually points to the **wrong** answer (`secondary`, not `primary`)

This is one of a small number of value mappings that require explicit configuration because the correct answer is based on design intent, not measurable properties.
