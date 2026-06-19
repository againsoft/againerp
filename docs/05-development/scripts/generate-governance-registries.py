#!/usr/bin/env python3
"""Generate AgainERP governance registry appendices from docs/ tree."""

from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent.parent
OUT = DOCS / "00-foundation" / "registries" / "_registries"
TODAY = date.today().isoformat()


def doc_id(path: Path) -> str:
    rel = path.relative_to(DOCS).as_posix()
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", rel.replace(".md", "")).strip("-").upper()
    return f"DOC-{slug[:80]}"


def infer_module(path: Path) -> str:
    parts = path.relative_to(DOCS).parts
    if len(parts) >= 2 and parts[0] == "03-business-modules":
        return parts[1]
    if len(parts) >= 3 and parts[0] == "04-uiux" and parts[1] == "prototype":
        return "ui-prototype"
    if parts[0] == "02-core-platform":
        return "core"
    if parts[0] == "07-saas":
        return "platform"
    if parts[0] == "06-ai":
        return "ai"
    if parts[0] == "05-development" and len(parts) > 1:
        return parts[1]
    if parts[0] == "10-roadmap":
        return "roadmap"
    if parts[0] == "09-integrations":
        return "integrations"
    return parts[0] if parts else "platform"


def infer_status(text: str) -> str:
    m = re.search(r"\*\*Status:\*\*\s*`?(\w+)`?", text[:2000])
    return m.group(1) if m else "Draft"


def scan_documents() -> list[dict]:
    rows = []
    for p in sorted(DOCS.rglob("*.md")):
        if "_registries" in p.parts or p.name.startswith("_") and p.parent == DOCS:
            if p.name in (
                "_PAGE_TEMPLATE.md",
                "_MODULE_TEMPLATE.md",
                "_MODULE_MANIFEST_TEMPLATE.md",
                "_COMMIT_CHECKLIST.md",
                "_CHANGE_IMPACT_TEMPLATE.md",
                "_ARCHITECTURE_SYNC_REPORT_TEMPLATE.md",
            ):
                pass  # include templates
        try:
            text = p.read_text(encoding="utf-8", errors="replace")
        except OSError:
            text = ""
        rows.append(
            {
                "id": doc_id(p),
                "name": p.stem,
                "path": p.relative_to(DOCS).as_posix(),
                "module": infer_module(p),
                "version": "1.0",
                "status": infer_status(text),
                "owner": "Platform Team",
                "last_updated": TODAY,
            }
        )
    return rows


def scan_pages() -> list[dict]:
    rows = []
    menu_root = DOCS / "03-business-modules" / "ecommerce" / "Menus"
    if menu_root.exists():
        for p in sorted(menu_root.rglob("*.md")):
            if p.name == "README.md":
                continue
            rel = p.relative_to(menu_root)
            menu = rel.parts[0] if len(rel.parts) > 1 else "Root"
            rows.append(
                {
                    "page": p.stem,
                    "module": "ecommerce",
                    "menu": menu,
                    "url": f"/admin/ecommerce/{menu.lower().replace(' ', '-')}/{p.stem.lower().replace(' ', '-')}",
                    "permissions": f"ecommerce.{menu.lower()}.view",
                    "doc_path": p.relative_to(DOCS).as_posix(),
                    "status": "Draft",
                }
            )
    proto = DOCS / "04-uiux" / "prototype"
    if proto.exists():
        for p in sorted(proto.rglob("*.md")):
            if p.name == "README.md":
                continue
            parts = p.relative_to(proto).parts
            menu = parts[0] if len(parts) > 1 else "root"
            rows.append(
                {
                    "page": p.stem,
                    "module": "ui-prototype",
                    "menu": menu,
                    "url": f"/prototype/{menu}/{p.stem}",
                    "permissions": "prototype.access",
                    "doc_path": p.relative_to(DOCS).as_posix(),
                    "status": "Stub",
                }
            )
    return rows


def write_md_table(path: Path, headers: list[str], rows: list[list[str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = ["| " + " | ".join(headers) + " |", "| " + " | ".join(["---"] * len(headers)) + " |"]
    for row in rows:
        lines.append("| " + " | ".join(str(c).replace("|", "\\|") for c in row) + " |")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    docs = scan_documents()
    pages = scan_pages()

    OUT.mkdir(parents=True, exist_ok=True)

    # JSON exports for tooling / AI
    (OUT / "documents.json").write_text(json.dumps(docs, indent=2), encoding="utf-8")
    (OUT / "pages.json").write_text(json.dumps(pages, indent=2), encoding="utf-8")

    # Full document registry table
    write_md_table(
        OUT / "DOCUMENT_REGISTRY_FULL.md",
        ["ID", "Name", "Path", "Module", "Status", "Owner"],
        [[d["id"], d["name"], d["path"], d["module"], d["status"], d["owner"]] for d in docs],
    )

    # Full page registry
    write_md_table(
        OUT / "PAGE_REGISTRY_FULL.md",
        ["Page", "Module", "Menu", "URL", "Doc Path", "Status"],
        [[p["page"], p["module"], p["menu"], p["url"], p["doc_path"], p["status"]] for p in pages],
    )

    # Stats
    by_module: dict[str, int] = {}
    for d in docs:
        by_module[d["module"]] = by_module.get(d["module"], 0) + 1

    stats = {
        "generated": TODAY,
        "total_documents": len(docs),
        "total_pages": len(pages),
        "ecommerce_menu_pages": sum(1 for p in pages if p["module"] == "ecommerce"),
        "ui_prototype_pages": sum(1 for p in pages if p["module"] == "ui-prototype"),
        "documents_by_module": by_module,
    }
    (OUT / "stats.json").write_text(json.dumps(stats, indent=2), encoding="utf-8")

    print(f"Generated {len(docs)} documents, {len(pages)} pages → {OUT}")


if __name__ == "__main__":
    main()
