#!/usr/bin/env python3
"""Remove duplicate Purpose/When To Read/Related/Read Next nav blocks — keep one per file."""
from __future__ import annotations

import re
import sys
from pathlib import Path

DOCS = Path(__file__).resolve().parents[2]

NAV_BLOCK = re.compile(
    r"(?:^|\n)"
    r"(?P<block>## Purpose\r?\n"
    r"(?=[\s\S]*?\r?\n## When To Read\r?\n)"
    r"(?=[\s\S]*?\r?\n## Related Files\r?\n)"
    r"(?=[\s\S]*?\r?\n## Read Next\r?\n)"
    r"[\s\S]*?"
    r"(?:\r?\n---\r?\n|\r?\n))"
)


def dedupe(text: str) -> tuple[str, int]:
    matches = list(NAV_BLOCK.finditer(text))
    if len(matches) <= 1:
        return text, 0
    first = matches[0]
    removed = 0
    # Remove from last to first (preserve indices), skip first
    for m in reversed(matches[1:]):
        start = m.start()
        if start > 0 and text[start] == "\n":
            start += 1
        text = text[:start] + text[m.end() :]
        removed += 1
    text = re.sub(r"\n{4,}", "\n\n\n", text)
    return text, removed


def main() -> None:
    dry_run = "--dry-run" in sys.argv
    modified = 0
    blocks_removed = 0
    for path in sorted(DOCS.rglob("*.md")):
        if "Menus" in path.parts or "_registries" in path.parts:
            continue
        try:
            original = path.read_text(encoding="utf-8")
        except OSError:
            continue
        new_text, removed = dedupe(original)
        if removed and new_text != original:
            blocks_removed += removed
            modified += 1
            if not dry_run:
                path.write_text(new_text, encoding="utf-8")
            print(f"  {'[dry-run] ' if dry_run else ''}{path.relative_to(DOCS)} (-{removed} nav blocks)")
    print(f"\nFiles modified: {modified} · Nav blocks removed: {blocks_removed}")


if __name__ == "__main__":
    main()
