#!/usr/bin/env python3
"""
Phase 2: Fix remaining broken links by resolving targets on disk and recomputing relative paths.
Run after migrate-doc-links.py. Supports --dry-run.
"""
from __future__ import annotations

import os
import re
import sys
import urllib.parse
from pathlib import Path

DOCS = Path(__file__).resolve().parents[2]
SKIP_PARTS = {"Menus", "_registries", "node_modules"}

LINK_PATTERN = re.compile(r"(\[[^\]]*\]\()([^)#]+)(#[^)]*)?(\))")

# Basename -> preferred path substring (for disambiguation)
PREFERRED: dict[str, str] = {
    "GOVERNANCE.md": "00-foundation/GOVERNANCE.md",
    "DEVELOPMENT_STANDARDS.md": "00-foundation/standards/DEVELOPMENT_STANDARDS.md",
    "WORKFLOW_REGISTRY.md": "00-foundation/registries/WORKFLOW_REGISTRY.md",
    "AI_KNOWLEDGE_INDEX.md": "00-foundation/registries/AI_KNOWLEDGE_INDEX.md",
    "UI_PROTOTYPE_MODE.md": "04-uiux/strategy/UI_PROTOTYPE_MODE.md",
    "ENTERPRISE_UI_ARCHITECTURE.md": "04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md",
    "AI_FIRST_ARCHITECTURE.md": "06-ai/platform/ai/AI_FIRST_ARCHITECTURE.md",
    "AI_OS_ARCHITECTURE.md": "06-ai/platform/ai/AI_OS_ARCHITECTURE.md",
    "ACTIVITY_CHATTER_ARCHITECTURE.md": "02-core-platform/subsystems/ACTIVITY_CHATTER_ARCHITECTURE.md",
    "MASTER_DATABASE_ARCHITECTURE.md": "05-development/database/MASTER_DATABASE_ARCHITECTURE.md",
    "MODULE_DEPENDENCY_MAP.md": "01-architecture/MODULE_DEPENDENCY_MAP.md",
    "MASTER_MODULE_ARCHITECTURE.md": "01-architecture/MASTER_MODULE_ARCHITECTURE.md",
    "BRAIN.md": "BRAIN.md",
    "PROJECT_MAP.md": "PROJECT_MAP.md",
    "MODULE_REGISTRY.md": "MODULE_REGISTRY.md",
    "UNIVERSAL_MODULE_FRAMEWORK.md": "00-foundation/UNIVERSAL_MODULE_FRAMEWORK.md",
    "DATABASE_REGISTRY.md": "00-foundation/registries/DATABASE_REGISTRY.md",
    "ENTITY_RELATIONSHIP_REGISTRY.md": "00-foundation/registries/ENTITY_RELATIONSHIP_REGISTRY.md",
}

_basename_cache: dict[str, list[Path]] = {}


def candidates(name: str) -> list[Path]:
    if name not in _basename_cache:
        _basename_cache[name] = [p for p in DOCS.rglob(name) if p.is_file()]
    return _basename_cache[name]


def link_exists(source: Path, target: str) -> bool:
    if target.startswith("#") or target.startswith(("http://", "https://", "mailto:")):
        return True
    decoded = urllib.parse.unquote(target.split("#")[0].strip())
    if not decoded or decoded == "#":
        return True
    if decoded.startswith("./"):
        decoded = decoded[2:]
    resolved = (source.parent / decoded).resolve()
    try:
        return resolved.exists() and resolved.is_relative_to(DOCS.resolve())
    except ValueError:
        return resolved.exists()


def resolve_target(source: Path, target: str) -> str | None:
    if link_exists(source, target):
        return None
    decoded = urllib.parse.unquote(target.split("#")[0].strip())
    fragment = ""
    if "#" in target:
        fragment = "#" + target.split("#", 1)[1]
    name = Path(decoded).name
    if not name or name == "#":
        return None

    opts = candidates(name)
    if not opts:
        return None

    chosen: Path | None = None
    pref = PREFERRED.get(name)
    if pref:
        for o in opts:
            if str(o.relative_to(DOCS)).replace("\\", "/") == pref:
                chosen = o
                break
    if chosen is None and len(opts) == 1:
        chosen = opts[0]
    if chosen is None:
        # Match longest path segment overlap with original target
        best = 0
        for o in opts:
            rel = str(o.relative_to(DOCS)).replace("\\", "/")
            score = sum(1 for part in decoded.replace("\\", "/").split("/") if part and part in rel)
            if score > best:
                best = score
                chosen = o
    if chosen is None:
        chosen = opts[0]

    rel = os.path.relpath(chosen, source.parent).replace("\\", "/")
    return rel + fragment


def process_file(path: Path) -> tuple[str, int]:
    text = path.read_text(encoding="utf-8")
    changes = 0

    def repl(m: re.Match) -> str:
        nonlocal changes
        prefix, target, frag, suffix = m.group(1), m.group(2), m.group(3) or "", m.group(4)
        fixed = resolve_target(path, target)
        if fixed and fixed != target:
            changes += 1
            return f"{prefix}{fixed}{frag}{suffix}"
        return m.group(0)

    return LINK_PATTERN.sub(repl, text), changes


def count_broken() -> tuple[int, int]:
    checked = broken = 0
    for p in DOCS.rglob("*.md"):
        if any(s in p.parts for s in SKIP_PARTS):
            continue
        try:
            text = p.read_text(encoding="utf-8")
        except OSError:
            continue
        for m in LINK_PATTERN.finditer(text):
            t = m.group(2)
            if t.startswith(("http://", "https://", "mailto:")):
                continue
            checked += 1
            if not link_exists(p, t):
                broken += 1
    return checked, broken


def main() -> None:
    dry_run = "--dry-run" in sys.argv
    before_c, before_b = count_broken()
    modified = fixes = 0
    for path in sorted(DOCS.rglob("*.md")):
        if any(s in path.parts for s in SKIP_PARTS):
            continue
        try:
            new_text, n = process_file(path)
        except OSError:
            continue
        if n:
            modified += 1
            fixes += n
            if not dry_run:
                path.write_text(new_text, encoding="utf-8")
    after_c, after_b = count_broken()
    print(f"{'DRY RUN — ' if dry_run else ''}Phase 2 relative path fix")
    print(f"  Files modified: {modified}")
    print(f"  Links fixed: {fixes}")
    print(f"  Broken before: {before_b}/{before_c}")
    print(f"  Broken after:  {after_b}/{after_c}")


if __name__ == "__main__":
    main()
