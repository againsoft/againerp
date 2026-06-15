#!/usr/bin/env python3
"""Generate {Page}Review.md and {Page}Changes.md for each ui-prototype page spec."""

from __future__ import annotations

from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent
PROTOTYPE = DOCS / "ui-prototype"
SKIP = {"README.md", "_PAGE_PROTOTYPE_TEMPLATE.md", "_PAGE_REVIEW_TEMPLATE.md", "_PAGE_CHANGES_TEMPLATE.md"}


def review_stub(page_path: Path, page_name: str) -> str:
    return f"""# {page_name} — Review

> **Status:** Draft  
> **Page Spec:** [{page_path.name}](./{page_path.name})  
> **Parent:** [UI_PROTOTYPE_MODE.md](../../UI_PROTOTYPE_MODE.md)

---

## Review Metadata

| Field | Value |
|-------|-------|
| **Review Date** | — |
| **Reviewer(s)** | — |
| **Prototype Build** | Not started |
| **Result** | Pending |

---

## UX Checklist

| # | Check | Pass | Fail | Notes |
|---|-------|------|------|-------|
| 1 | ENTERPRISE_UI_ARCHITECTURE compliance | [ ] | [ ] | |
| 2 | Navigation works | [ ] | [ ] | |
| 3 | Mobile responsive | [ ] | [ ] | |
| 4 | Dark mode | [ ] | [ ] | |
| 5 | Realistic dummy data | [ ] | [ ] | |
| 6 | Modals/drawers | [ ] | [ ] | |
| 7 | Tables/forms display | [ ] | [ ] | |
| 8 | No empty screen | [ ] | [ ] | |

---

## Sign-Off

| Role | Name | Date | Approved |
|------|------|------|----------|
| UX / Product | — | — | [ ] |

**Page Ready:** ☐ Yes · ☐ No
"""


def changes_stub(page_path: Path, page_name: str) -> str:
    base = page_path.stem
    return f"""# {page_name} — Changes

> **Page Spec:** [{page_path.name}](./{page_path.name})  
> **Review:** [{base}Review.md](./{base}Review.md)

---

## Change Log

| Date | Version | Author | Change |
|------|---------|--------|--------|
| 2026-06-12 | 0.1.0 | — | Initial stub |

---

## Pending Changes

| # | Change | Priority | Status |
|---|--------|----------|--------|
| — | Complete page spec | High | Open |

---

## Implemented (Prototype)

| Date | UI change | Route |
|------|-----------|-------|
| — | — | — |
"""


def main() -> None:
    created = 0
    for page in sorted(PROTOTYPE.rglob("*.md")):
        if page.name in SKIP:
            continue
        if page.name.endswith("Review.md") or page.name.endswith("Changes.md"):
            continue
        if page.parent.name == "data":
            continue
        # skip top-level process docs
        if page.parent == PROTOTYPE and page.name[0].isupper() and "TEMPLATE" not in page.name:
            if page.stem in (
                "DUMMY_DATA_STANDARDS",
                "PRODUCTION_READINESS",
                "REVIEW_CYCLE",
                "MissingFeatures",
                "ReviewQuestions",
                "ImprovementIdeas",
                "PROTOTYPE_SHELL",
                "MODULE_SCOPE",
            ):
                continue

        page_name = page.stem
        review_path = page.with_name(f"{page_name}Review.md")
        changes_path = page.with_name(f"{page_name}Changes.md")

        if not review_path.exists():
            review_path.write_text(review_stub(page, page_name), encoding="utf-8")
            created += 1
        if not changes_path.exists():
            changes_path.write_text(changes_stub(page, page_name), encoding="utf-8")
            created += 1

    print(f"Created {created} review/changes files under {PROTOTYPE}")


if __name__ == "__main__":
    main()
