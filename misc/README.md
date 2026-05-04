# misc — Supporting Scripts and Notes

## breaking-changes.json

### How it was originally created

The `breaking-changes.json` in the repo root was created during the initial benchmarking session (2026-05-01) by:

1. Fetching https://www.patternfly.org/get-started/upgrade/release-notes/ using Claude Code's WebFetch tool
2. Extracting all rows from the breaking changes table (85 entries found)
3. Manually constructing each JSON entry with:
   - Mechanical fields (component, repo, description, PR link, fixedWithCodemods) taken directly from the table
   - `expectedOutcome` fields written by hand — plain-English descriptions of what correct PF6 migration looks like for each breaking change
   - `testFile` paths matching the test case naming convention (`TC<NNN>-<component>-<slug>.tsx`)

The `expectedOutcome` descriptions are the most valuable part of the file. They encode domain knowledge about PatternFly migration that can't be scraped from the page. The LLM evaluator judges migration quality against these descriptions.

### The regeneration script

`fetch-breaking-changes.py` can re-scrape the release notes page and produce a fresh JSON file with the mechanical fields populated:

```bash
python3 misc/fetch-breaking-changes.py > breaking-changes-new.json
```

It outputs to stdout (redirect to a file) and prints status to stderr.

### Limitations and concerns

**The script cannot regenerate `expectedOutcome` fields.** These were hand-written with PatternFly domain knowledge. The script fills them with `TODO` placeholders. If you regenerate, you'll need to either:
- Manually write new expected outcomes, or
- Merge expected outcomes from the existing `breaking-changes.json` by matching on component + description

**The page structure may change.** The script parses HTML tables directly. If PatternFly redesigns the release notes page or moves the table into a JavaScript-rendered component, the parser will find zero rows and exit with an error.

**The scrape count may differ from 85.** During the original session, two separate fetches returned 85 and 88 rows respectively — the page may use pagination, lazy loading, or filtering that affects what's visible. The script grabs whatever the server returns in the initial HTML.

**`testFile` paths won't match existing files.** The script generates slugs from component names and descriptions, which may differ from the hand-chosen filenames in the existing test cases (e.g., the script might generate `TC001-accordion-content-the-ishidden.tsx` instead of `TC001-accordion-content-isHidden.tsx`). If you use this to update the JSON, keep the existing `testFile` values.

**`fixedWithCodemods` detection is heuristic.** The script looks for "Yes", "true", "✓", or "✔" in the codemods column. If the page uses a different format (icon, CSS class, data attribute), this may produce incorrect values.

### When you'd actually use this

Probably never for PF5→PF6 specifically — that list is frozen. But the script could serve as a starting point if:

- PatternFly releases a PF6→PF7 migration and publishes a similar release notes page
- The PF team adds new entries to the PF6 breaking changes table (unlikely but possible)
- You want to verify the existing `breaking-changes.json` against the live page to check for drift

In any of these cases, the script gives you the mechanical data. The real work is writing the `expectedOutcome` descriptions and creating the corresponding test case components.
