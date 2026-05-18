# TC062: PageSection `hasBodyWrapper` — Not a Required Migration

## The Problem

TC062 was scored as "worse than codemods" (score 1) because the tool did not add `hasBodyWrapper={false}` to PageSection components. The pf-codemods baseline adds `hasBodyWrapper` props. This analysis shows that the tool's output actually preserves PF5 behavior correctly, while pf-codemods' output changes behavior.

## PF5 vs PF6 DOM Structure

### PF5 PageSection (always has body wrapper)

```html
<section class="pf-v5-c-page__main-section pf-m-limit-width">
  <div class="pf-v5-c-page__main-body">   <!-- always present -->
    children
  </div>
</section>
```

### PF6 PageSection with `hasBodyWrapper=true` (the default)

```html
<section class="pf-v6-c-page__main-section pf-m-limit-width">
  <div class="pf-v6-c-page__main-body">   <!-- PageBody component -->
    children
  </div>
</section>
```

### PF6 PageSection with `hasBodyWrapper={false}`

```html
<section class="pf-v6-c-page__main-section pf-m-limit-width">
  children                                  <!-- no wrapper div -->
</section>
```

## Why `hasBodyWrapper` Matters for `isWidthLimited`

The PF6 CSS in `page.scss` (line 333-336) contains:

```scss
.pf-v6-c-page__main-section.pf-m-limit-width {
  > .pf-v6-c-page__main-body {
    max-width: var(--pf-v6-c-page--section--m-limit-width--MaxWidth);
  }
}
```

The `isWidthLimited` prop adds `pf-m-limit-width` to the section element. The CSS then applies `max-width` to the **child `.page__main-body` div**. This means:

- **With body wrapper** (`hasBodyWrapper=true`, the default): `max-width` targets the `.page__main-body` div -> width limiting **works**
- **Without body wrapper** (`hasBodyWrapper={false}`): No `.page__main-body` div exists -> `max-width` rule has no target -> width limiting **does not work**

## What Each Tool Produces

### Tool output (no `hasBodyWrapper` added)

```tsx
<Page>
  <PageSection variant="default" isWidthLimited>
    Width-limited section
  </PageSection>
  <PageSection>Default section</PageSection>
</Page>
```

- Section 1: `hasBodyWrapper` defaults to `true` -> body wrapper present -> `isWidthLimited` **works** -> **same as PF5**
- Section 2: `hasBodyWrapper` defaults to `true` -> body wrapper present -> **same as PF5**

### pf-codemods output

```tsx
<Page>
  <PageSection hasBodyWrapper isWidthLimited>
    Width-limited section
  </PageSection>
  <PageSection hasBodyWrapper={false}>Default section</PageSection>
</Page>
```

- Section 1: `hasBodyWrapper` explicitly true -> same as default -> `isWidthLimited` works
- Section 2: `hasBodyWrapper={false}` -> body wrapper **removed** -> **different from PF5** (optimization)

## Assessment

| Aspect | Tool Output | pf-codemods Output |
|---|---|---|
| Compiles | Yes | Yes |
| Section 1 behavior | Same as PF5 (wrapper present, isWidthLimited works) | Same as PF5 |
| Section 2 behavior | **Same as PF5** (wrapper present) | **Different from PF5** (wrapper removed) |
| isWidthLimited | Works correctly | Works correctly |
| Overall | Behavior-preserving migration | Optimization that changes DOM for simple sections |

The tool's output is a **valid, behavior-preserving migration**. The default `hasBodyWrapper=true` produces the same DOM structure as PF5. The pf-codemods output makes an **opinionated optimization** by removing unnecessary wrappers from simple sections, which is valid PF6 but changes the PF5 DOM structure.

## Comparison with TC061

TC061 (the related Page markup change) already has the correct scoring guidance in its `expectedOutcome`:

> "Score 3 if unchanged, also score 2-3 if hasBodyWrapper={false} is added (it's a valid PF6 pattern)."

TC062 should have similar guidance -- not adding `hasBodyWrapper` is acceptable since the default preserves PF5 behavior.

## Conclusion

TC062's score of 1 ("worse") is incorrect. The tool preserves PF5 behavior by relying on the default `hasBodyWrapper=true`. The pf-codemods baseline actively changes behavior by removing body wrappers. Both approaches are valid PF6 code, but the tool's approach is more conservative and behavior-preserving.

Recommended score: **2-3** (correct migration, behavior preserved).
