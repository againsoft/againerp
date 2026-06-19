#!/usr/bin/env python3
"""
Fix broken markdown links per LINK_MIGRATION_PLAN.md.
Supports --dry-run and writes link-migration-report.json on execution.
"""
from __future__ import annotations

import json
import re
import sys
import urllib.parse
from collections import defaultdict
from pathlib import Path

DOCS = Path(__file__).resolve().parents[2]

SKIP_PARTS = {"Menus", "_registries", "node_modules"}

# Order matters — most specific first
LINK_REPLACEMENTS: list[tuple[str, str]] = [
    # AI (before modules/)
    ("modules/ai/", "06-ai/platform/ai/"),
    ("../modules/ai/", "../06-ai/platform/ai/"),
    ("../../modules/ai/", "../../06-ai/platform/ai/"),
    ("../../../modules/ai/", "../../../06-ai/platform/ai/"),
    ("docs/modules/ai/", "docs/06-ai/platform/ai/"),
    # Builder depth fix (08-builder/prototype)
    ("../03-business-modules/ecommerce/builder/", "../../03-business-modules/ecommerce/builder/"),
    # Modules
    ("../../modules/", "../../03-business-modules/"),
    ("../modules/", "../03-business-modules/"),
    ("docs/modules/", "docs/03-business-modules/"),
    # Never bare modules/ — matches business-modules/ tail incorrectly
    # UI
    ("../../ui-ux/", "../../04-uiux/standards/"),
    ("../ui-ux/", "../04-uiux/standards/"),
    ("../../../ui-ux/", "../../../04-uiux/standards/"),
    ("ui-ux/", "04-uiux/standards/"),
    ("docs/ui-prototype/", "docs/04-uiux/prototype/"),
    ("../../ui-prototype/", "../../04-uiux/prototype/"),
    ("../ui-prototype/", "../04-uiux/prototype/"),
    ("ui-prototype/", "04-uiux/prototype/"),
    ("../../UI_PROTOTYPE_MODE.md", "../../04-uiux/strategy/UI_PROTOTYPE_MODE.md"),
    ("../UI_PROTOTYPE_MODE.md", "../04-uiux/strategy/UI_PROTOTYPE_MODE.md"),
    ("./UI_PROTOTYPE_MODE.md", "./04-uiux/strategy/UI_PROTOTYPE_MODE.md"),
    # Core
    ("../../core/engines/", "../../02-core-platform/engines/"),
    ("../core/engines/", "../02-core-platform/engines/"),
    ("core/engines/", "02-core-platform/engines/"),
    ("../../core/entities/", "../../02-core-platform/entities/"),
    ("../core/entities/", "../02-core-platform/entities/"),
    ("core/entities/", "02-core-platform/entities/"),
    ("../../core/subsystems/", "../../02-core-platform/subsystems/"),
    ("../../core/", "../../02-core-platform/"),
    ("../core/", "../02-core-platform/"),
    ("docs/core/", "docs/02-core-platform/"),
    # Never bare core/ — use segment patterns above
    # Database
    ("../../database/", "../../05-development/database/"),
    ("../database/", "../05-development/database/"),
    ("database/", "05-development/database/"),
    ("./DATABASE_REGISTRY.md", "./00-foundation/registries/DATABASE_REGISTRY.md"),
    ("../DATABASE_REGISTRY.md", "../00-foundation/registries/DATABASE_REGISTRY.md"),
    ("../../DATABASE_REGISTRY.md", "../../00-foundation/registries/DATABASE_REGISTRY.md"),
    ("DATABASE_REGISTRY.md", "00-foundation/registries/DATABASE_REGISTRY.md"),
    # AI paths
    ("ai_os/", "06-ai/experience/"),
    ("docs/ai_os/", "docs/06-ai/experience/"),
    ("../ai/", "../06-ai/platform/ai/"),
    ("../../ai/", "../../06-ai/platform/ai/"),
    ("./AI_KNOWLEDGE_INDEX.md", "./00-foundation/registries/AI_KNOWLEDGE_INDEX.md"),
    ("../AI_KNOWLEDGE_INDEX.md", "../00-foundation/registries/AI_KNOWLEDGE_INDEX.md"),
    ("../../AI_KNOWLEDGE_INDEX.md", "../../00-foundation/registries/AI_KNOWLEDGE_INDEX.md"),
    # Platform / dev folders
    ("docs/deployment/", "docs/05-development/deployment/"),
    ("deployment/", "05-development/deployment/"),
    ("docs/framework/", "docs/05-development/framework/"),
    ("framework/", "05-development/framework/"),
    ("docs/qa/", "docs/05-development/qa/"),
    ("qa/", "05-development/qa/"),
    ("docs/roadmap/", "docs/10-roadmap/"),
    ("roadmap/", "10-roadmap/"),
    ("docs/plugins/", "docs/09-integrations/plugins/"),
    ("plugins/", "09-integrations/plugins/"),
    ("docs/adr/", "docs/01-architecture/decisions/"),
    ("adr/", "01-architecture/decisions/"),
    ("docs/scripts/", "docs/05-development/scripts/"),
    ("platform/TENANT_ARCHITECTURE.md", "07-saas/TENANT_ARCHITECTURE.md"),
    ("platform/SCALING_ROADMAP.md", "07-saas/SCALING_ROADMAP.md"),
    ("platform/HYBRID_DEPLOYMENT.md", "07-saas/HYBRID_DEPLOYMENT.md"),
    # platform/ only as path segment (not inside 02-core-platform)
    ("/platform/", "/07-saas/"),
    ("docs/platform/", "docs/07-saas/"),
    ("../platform/", "../07-saas/"),
    ("../../platform/", "../../07-saas/"),
    ("./platform/", "./07-saas/"),
    # Governance (relative fixes common in 01-architecture, 02-core-platform)
    ("./GOVERNANCE.md", "./00-foundation/GOVERNANCE.md"),
    ("../GOVERNANCE.md", "../00-foundation/GOVERNANCE.md"),
    ("../../GOVERNANCE.md", "../../00-foundation/GOVERNANCE.md"),
    ("./DEVELOPMENT_STANDARDS.md", "./00-foundation/standards/DEVELOPMENT_STANDARDS.md"),
    ("../DEVELOPMENT_STANDARDS.md", "../00-foundation/standards/DEVELOPMENT_STANDARDS.md"),
    ("../../DEVELOPMENT_STANDARDS.md", "../../00-foundation/standards/DEVELOPMENT_STANDARDS.md"),
    ("./WORKFLOW_REGISTRY.md", "./00-foundation/registries/WORKFLOW_REGISTRY.md"),
    ("../WORKFLOW_REGISTRY.md", "../00-foundation/registries/WORKFLOW_REGISTRY.md"),
    ("../../WORKFLOW_REGISTRY.md", "../../00-foundation/registries/WORKFLOW_REGISTRY.md"),
    ("./MODULE_DEPENDENCY_MAP.md", "./01-architecture/MODULE_DEPENDENCY_MAP.md"),
    ("../MODULE_DEPENDENCY_MAP.md", "../01-architecture/MODULE_DEPENDENCY_MAP.md"),
    ("MODULE_DEPENDENCY_MAP.md", "01-architecture/MODULE_DEPENDENCY_MAP.md"),
    ("./MASTER_MODULE_ARCHITECTURE.md", "./01-architecture/MASTER_MODULE_ARCHITECTURE.md"),
    ("../../MASTER_MODULE_ARCHITECTURE.md", "../../01-architecture/MASTER_MODULE_ARCHITECTURE.md"),
    ("MASTER_MODULE_ARCHITECTURE.md", "01-architecture/MASTER_MODULE_ARCHITECTURE.md"),
    ("./PROJECT_COMMON_RULES.md", "./00-foundation/PROJECT_COMMON_RULES.md"),
    ("../../PROJECT_COMMON_RULES.md", "../../00-foundation/PROJECT_COMMON_RULES.md"),
    ("./UNIVERSAL_MODULE_FRAMEWORK.md", "./00-foundation/UNIVERSAL_MODULE_FRAMEWORK.md"),
    ("../UNIVERSAL_MODULE_FRAMEWORK.md", "../00-foundation/UNIVERSAL_MODULE_FRAMEWORK.md"),
    ("./DOCUMENT_REGISTRY.md", "./00-foundation/registries/DOCUMENT_REGISTRY.md"),
    ("DOCUMENT_REGISTRY.md", "00-foundation/registries/DOCUMENT_REGISTRY.md"),
    ("./ADR_INDEX.md", "./01-architecture/decisions/ADR_INDEX.md"),
    ("ADR_INDEX.md", "01-architecture/decisions/ADR_INDEX.md"),
    ("./ENTITY_RELATIONSHIP_REGISTRY.md", "./00-foundation/registries/ENTITY_RELATIONSHIP_REGISTRY.md"),
    ("ENTITY_RELATIONSHIP_REGISTRY.md", "00-foundation/registries/ENTITY_RELATIONSHIP_REGISTRY.md"),
    ("./SAAS_PLATFORM_ARCHITECTURE.md", "./01-architecture/SAAS_PLATFORM_ARCHITECTURE.md"),
    ("../../SAAS_PLATFORM_ARCHITECTURE.md", "../../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md"),
    # Placeholder
    ("path.md", "#"),
]

LINK_PATTERN = re.compile(r"(\[[^\]]*\]\()([^)#]+)(#[^)]*)?(\))")


def migrate_target(target: str) -> str:
    decoded = urllib.parse.unquote(target.strip())
    if decoded.startswith(("http://", "https://", "mailto:")):
        return target
    fragment = ""
    if "#" in decoded:
        decoded, fragment = decoded.split("#", 1)
        fragment = "#" + fragment
    for old, new in LINK_REPLACEMENTS:
        if old in decoded:
            decoded = decoded.replace(old, new)
    return decoded + fragment


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


def scan_broken() -> tuple[int, int, list[tuple[str, str]]]:
    checked = 0
    broken: list[tuple[str, str]] = []
    for p in DOCS.rglob("*.md"):
        if any(s in p.parts for s in SKIP_PARTS):
            continue
        try:
            text = p.read_text(encoding="utf-8")
        except OSError:
            continue
        rel = str(p.relative_to(DOCS))
        for m in LINK_PATTERN.finditer(text):
            target = m.group(2)
            if target.startswith(("http://", "https://", "mailto:")):
                continue
            checked += 1
            if not link_exists(p, target):
                broken.append((rel, target))
    return checked, len(broken), broken


def process_file(path: Path) -> tuple[str, int]:
    text = path.read_text(encoding="utf-8")
    changes = 0

    def repl(m: re.Match) -> str:
        nonlocal changes
        prefix, target, frag, suffix = m.group(1), m.group(2), m.group(3) or "", m.group(4)
        new_target = migrate_target(target)
        if new_target != target:
            changes += 1
        return f"{prefix}{new_target}{frag}{suffix}"

    new_text = LINK_PATTERN.sub(repl, text)
    return new_text, changes


def main() -> None:
    dry_run = "--dry-run" in sys.argv
    before_checked, before_broken, _ = scan_broken()

    files_modified = 0
    links_fixed = 0
    files_skipped = 0
    modified_files: list[str] = []

    for path in sorted(DOCS.rglob("*.md")):
        if any(s in path.parts for s in SKIP_PARTS):
            continue
        try:
            new_text, changes = process_file(path)
        except OSError:
            files_skipped += 1
            continue
        if changes:
            files_modified += 1
            links_fixed += changes
            modified_files.append(str(path.relative_to(DOCS)))
            if not dry_run:
                path.write_text(new_text, encoding="utf-8")
        else:
            files_skipped += 1

    after_checked, after_broken, remaining = scan_broken()

    report = {
        "dry_run": dry_run,
        "files_modified": files_modified,
        "links_fixed": links_fixed,
        "files_skipped": files_skipped,
        "before": {"checked": before_checked, "broken": before_broken},
        "after": {"checked": after_checked, "broken": after_broken},
        "modified_files": modified_files[:100],
        "remaining_broken_sample": [{"file": f, "target": t} for f, t in remaining[:50]],
    }

    report_path = DOCS / "05-development/scripts/link-migration-report.json"
    if not dry_run:
        report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(f"{'DRY RUN — ' if dry_run else ''}Link migration complete")
    print(f"  Files modified: {files_modified}")
    print(f"  Link targets updated: {links_fixed}")
    print(f"  Files skipped (no changes): {files_skipped}")
    print(f"  Broken before: {before_broken} / {before_checked}")
    print(f"  Broken after:  {after_broken} / {after_checked}")
    if not dry_run:
        print(f"  Report: {report_path.relative_to(DOCS.parent)}")


if __name__ == "__main__":
    main()
