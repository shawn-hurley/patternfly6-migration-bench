#!/usr/bin/env python3
"""
Fetch PatternFly 6 breaking changes from the official release notes page
and output a JSON file in the breaking-changes.json schema.

Usage:
    python3 misc/fetch-breaking-changes.py > breaking-changes-new.json

This script fetches https://www.patternfly.org/get-started/upgrade/release-notes/,
parses the breaking changes table, and produces JSON with the mechanical fields
populated. The `expectedOutcome` field is set to a placeholder — those descriptions
were hand-written during the original benchmarking session and cannot be scraped
from the page.

See misc/README.md for full context on limitations and when to use this.
"""

import json
import re
import sys
from html.parser import HTMLParser
from urllib.request import urlopen, Request

RELEASE_NOTES_URL = "https://www.patternfly.org/get-started/upgrade/release-notes/"


class TableParser(HTMLParser):
    """Extract rows from HTML tables on the PF6 release notes page."""

    def __init__(self):
        super().__init__()
        self.in_table = False
        self.in_thead = False
        self.in_tbody = False
        self.in_tr = False
        self.in_td = False
        self.in_th = False
        self.in_a = False
        self.current_href = ""
        self.current_cell = ""
        self.current_row = []
        self.headers = []
        self.rows = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "table":
            self.in_table = True
        elif tag == "thead" and self.in_table:
            self.in_thead = True
        elif tag == "tbody" and self.in_table:
            self.in_tbody = True
        elif tag == "tr" and self.in_table:
            self.in_tr = True
            self.current_row = []
        elif tag in ("td", "th") and self.in_tr:
            self.in_td = tag == "td"
            self.in_th = tag == "th"
            self.current_cell = ""
            self.current_href = ""
        elif tag == "a" and (self.in_td or self.in_th):
            self.in_a = True
            self.current_href = attrs_dict.get("href", "")

    def handle_endtag(self, tag):
        if tag == "table":
            self.in_table = False
        elif tag == "thead":
            self.in_thead = False
        elif tag == "tbody":
            self.in_tbody = False
        elif tag == "tr" and self.in_tr:
            self.in_tr = False
            if self.in_thead and self.current_row:
                self.headers = self.current_row
            elif self.in_tbody and self.current_row:
                self.rows.append(self.current_row)
        elif tag in ("td", "th") and (self.in_td or self.in_th):
            cell_text = self.current_cell.strip()
            cell_data = {"text": cell_text, "href": self.current_href}
            self.current_row.append(cell_data)
            self.in_td = False
            self.in_th = False
        elif tag == "a":
            self.in_a = False

    def handle_data(self, data):
        if self.in_td or self.in_th:
            self.current_cell += data


def slugify(component: str, description: str) -> str:
    """Generate a short filename slug from component and description."""
    comp = re.sub(r"[^a-z0-9]+", "-", component.lower()).strip("-")
    desc_words = re.sub(r"[^a-z0-9\s]", "", description.lower()).split()
    desc_slug = "-".join(desc_words[:3]) if desc_words else "change"
    return f"{comp}-{desc_slug}"


def fetch_and_parse():
    """Fetch the release notes page and parse the breaking changes table."""
    req = Request(RELEASE_NOTES_URL, headers={"User-Agent": "pf6-migration-bench/1.0"})
    with urlopen(req, timeout=30) as resp:
        html = resp.read().decode("utf-8")

    parser = TableParser()
    parser.feed(html)

    if not parser.rows:
        print("ERROR: No table rows found on the page.", file=sys.stderr)
        print("The page structure may have changed.", file=sys.stderr)
        print(f"Headers found: {[h['text'] for h in parser.headers]}", file=sys.stderr)
        sys.exit(1)

    print(f"Found {len(parser.rows)} rows in the table.", file=sys.stderr)
    if parser.headers:
        print(f"Headers: {[h['text'] for h in parser.headers]}", file=sys.stderr)

    entries = []
    for i, row in enumerate(parser.rows, start=1):
        tc_id = f"TC{i:03d}"

        component = row[0]["text"] if len(row) > 0 else "Unknown"
        repo = row[1]["text"] if len(row) > 1 else "React"
        description = row[2]["text"] if len(row) > 2 else ""

        pr_link = ""
        if len(row) > 3 and row[3].get("href"):
            pr_link = row[3]["href"]
            if pr_link.startswith("/"):
                pr_link = f"https://github.com{pr_link}"

        fixed_text = row[4]["text"].strip().lower() if len(row) > 4 else ""
        fixed_with_codemods = fixed_text in ("yes", "true", "✓", "✔")

        slug = slugify(component, description)
        test_file = f"src/test-cases/{tc_id}-{slug}.tsx"

        entries.append({
            "id": tc_id,
            "component": component,
            "repo": repo,
            "description": description,
            "prLink": pr_link,
            "fixedWithCodemods": fixed_with_codemods,
            "testFile": test_file,
            "expectedOutcome": f"TODO: Hand-write expected outcome for {component} — {description[:60]}",
        })

    return entries


def main():
    entries = fetch_and_parse()

    print(f"Generated {len(entries)} entries.", file=sys.stderr)
    codemods_count = sum(1 for e in entries if e["fixedWithCodemods"])
    print(f"  fixedWithCodemods=true: {codemods_count}", file=sys.stderr)
    print(f"  fixedWithCodemods=false: {len(entries) - codemods_count}", file=sys.stderr)
    print("", file=sys.stderr)
    print("NOTE: expectedOutcome fields are placeholders.", file=sys.stderr)
    print("You must hand-write these or merge from the existing breaking-changes.json.", file=sys.stderr)

    json.dump(entries, sys.stdout, indent=2)
    print()


if __name__ == "__main__":
    main()
