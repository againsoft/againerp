#!/usr/bin/env python3
"""
Add Purpose / When To Read / Related Files / Read Next to major AgainERP docs.
Documentation-only — does not modify business content below the nav block.
"""
from __future__ import annotations

import re
from pathlib import Path

DOCS = Path(__file__).resolve().parents[2]  # docs/

SKIP_PARTS = {
    "Menus",
    "_registries",
}

SKIP_SUFFIXES = ("_REGISTRY_FULL.md",)

MODULE_PACKAGE = {
    "Architecture.md",
    "ARCHITECTURE.md",
    "Database.md",
    "API.md",
    "Workflow.md",
    "Permissions.md",
    "ModuleManifest.md",
    "README.md",
    "UI.md",
    "Development.md",
    "Roadmap.md",
    "INTEGRATION.md",
}


def should_process(path: Path) -> bool:
    rel = path.relative_to(DOCS)
    parts = rel.parts
    if any(p in SKIP_PARTS for p in parts):
        return False
    if path.name.endswith(SKIP_SUFFIXES):
        return False
    if path.suffix != ".md":
        return False

    s = str(rel)

    # docs root hubs
    if len(parts) == 1:
        return True

    if s.startswith("00-foundation/"):
        return "_registries" not in s or path.name in ("MODULE_REGISTRY.md",)

    if s.startswith("01-architecture/"):
        return "decisions/" not in s or path.name == "ADR_INDEX.md"

    if s.startswith("02-core-platform/"):
        return True

    if s.startswith("architecture/"):
        return True

    if s.startswith("03-business-modules/"):
        if len(parts) == 2:
            return True
        if len(parts) == 3:
            name = path.name
            if name in MODULE_PACKAGE:
                return True
            if name.endswith("_MODULE_ARCHITECTURE.md"):
                return True
            if name.endswith("_ARCHITECTURE.md") and name not in ("ARCHITECTURE.md",):
                return True
            if name.endswith("_UI_BUILD_GUIDE.md"):
                return True
            if name == "HR_MODULE_MASTER_INDEX.md":
                return True
        if len(parts) == 4 and parts[2] == "ecommerce":
            name = path.name
            if name == "ARCHITECTURE.md" or name.endswith("_ARCHITECTURE.md"):
                return True
        return False

    if s.startswith("04-uiux/standards/") or s.startswith("04-uiux/strategy/"):
        return True

    if s.startswith("04-uiux/prototype/"):
        if path.name in ("README.md",) or path.name.endswith("_UI_BUILD_GUIDE.md"):
            return True
        return False

    if s.startswith("06-ai/") or s.startswith("07-saas/") or s.startswith("08-builder/"):
        return True

    if s.startswith("09-integrations/") or s.startswith("10-roadmap/"):
        return True

    if s.startswith("05-development/") and path.name != "add-doc-navigation.py":
        return path.name.endswith(".md") and "scripts" not in parts

    return False


def has_nav_block(text: str) -> bool:
    pos = find_insert_after_header(text)
    head = text[: max(pos, 800)]
    # Nav must appear after title block, before main content
    after_title = text[text.find("\n") : pos + 400]
    return (
        "## Purpose" in after_title
        and "## When To Read" in after_title
        and "## Related Files" in after_title
        and "## Read Next" in after_title
    )


def module_id(parts: tuple[str, ...]) -> str | None:
    if len(parts) >= 2 and parts[0] == "03-business-modules":
        return parts[1]
    return None


def human_name(module: str) -> str:
    special = {"crm": "CRM", "hr": "HR", "pos": "POS", "bi-system": "BI System", "hr-payroll": "HR & Payroll"}
    if module in special:
        return special[module]
    return module.replace("-", " ").title()


def arch_entry(module: str) -> str:
    """Best-guess architecture filename for module."""
    special = {
        "crm": "CRM_MODULE_ARCHITECTURE.md",
        "sales": "SALES_MODULE_ARCHITECTURE.md",
        "purchase": "PURCHASE_MODULE_ARCHITECTURE.md",
        "inventory": "INVENTORY_MODULE_ARCHITECTURE.md",
        "finance": "FINANCE_MODULE_ARCHITECTURE.md",
        "marketing": "MARKETING_MODULE_ARCHITECTURE.md",
        "hr-payroll": "HR_PAYROLL_MASTER_ARCHITECTURE.md",
    }
    return special.get(module, "Architecture.md")


def rel(from_dir: Path, to: Path) -> str:
    return Path(os_path_relpath(from_dir, to)).as_posix()


def os_path_relpath(from_dir: Path, to: Path) -> str:
    import os

    return os.path.relpath(to, from_dir)


def build_nav(path: Path) -> str | None:
    rel = path.relative_to(DOCS)
    parts = rel.parts
    name = path.name
    parent = path.parent
    mod = module_id(parts)

    lines: list[str] = []

    # --- Hubs ---
    if rel.name == "BRAIN.md":
        lines = nav(
            "Cursor single entry — project identity, stack, rules, and pointers.",
            "Read first on any AgainERP task before opening module-specific docs.",
            [
                ("PROJECT_MAP.md", "Documentation navigation"),
                ("MODULE_REGISTRY.md", "Module index"),
                ("00-foundation/PRE_CODE_GATE.md", "Pre-code gate"),
            ],
            [
                ("PROJECT_MAP.md", "Find where docs live"),
                ("MODULE_REGISTRY.md", "Pick your module"),
            ],
        )
    elif rel.name == "PROJECT_MAP.md":
        lines = nav(
            "Complete map of where documentation lives — folder index and path migration.",
            "Read after BRAIN.md when you need to locate a document or folder.",
            [
                ("BRAIN.md", "Cursor entry"),
                ("MODULE_REGISTRY.md", "Module index"),
                ("MASTER_DOCUMENT_MAP.md", "Full hierarchy"),
            ],
            [("MODULE_REGISTRY.md", "Pick a module")],
        )
    elif rel.name == "MODULE_REGISTRY.md":
        lines = nav(
            "Index of every module — purpose, path, owner, and documentation entry file.",
            "Read after BRAIN.md and PROJECT_MAP.md to select a module for your task.",
            [
                ("BRAIN.md", "Cursor entry"),
                ("01-architecture/MODULE_DEPENDENCY_MAP.md", "Dependencies"),
            ],
            [("03-business-modules/", "Open module doc entry from registry table")],
        )
    elif rel.name == "README.md" and len(parts) == 1:
        lines = nav(
            "Human landing page for the docs/ folder.",
            "Read when orienting to the documentation tree (developers or AI).",
            [("BRAIN.md", "Cursor entry"), ("PROJECT_MAP.md", "Doc navigation")],
            [("BRAIN.md", "Start the AI Brain stack")],
        )
    elif rel.name == "FINAL_ERP_STRUCTURE_MAP.md":
        lines = nav(
            "Enterprise structure single source of truth — project, layers, modules, folders.",
            "Read when you need the complete structural map of AgainERP (not task-specific module detail).",
            [
                ("BRAIN.md", "Cursor entry"),
                ("GOVERNANCE_FRAMEWORK.md", "Governance"),
                ("MASTER_ARCHITECTURE_INDEX.md", "Architecture index"),
            ],
            [("MODULE_REGISTRY.md", "Module list")],
        )
    elif rel.name == "GOVERNANCE_FRAMEWORK.md":
        lines = nav(
            "Umbrella governance — seven domains with links to authoritative rule sources.",
            "Read when you need governance domain ownership or approval workflow pointers.",
            [
                ("00-foundation/GOVERNANCE.md", "Operational governance"),
                ("00-foundation/PRE_CODE_GATE.md", "Pre-code gate"),
            ],
            [("BRAIN.md", "Cursor entry")],
        )
    elif rel.name == "MASTER_DOCUMENT_MAP.md":
        lines = nav(
            "Full documentation hierarchy after enterprise folder reorganization.",
            "Read when resolving legacy paths or browsing the complete docs tree.",
            [
                ("BRAIN.md", "Cursor entry"),
                ("PROJECT_MAP.md", "Slim navigation hub"),
            ],
            [("00-foundation/standards/DOCUMENT_NAVIGATION_STANDARD.md", "Nav standard")],
        )
    elif rel.name == "MASTER_ARCHITECTURE_INDEX.md":
        lines = nav(
            "Index of all architecture documents by domain with dependency diagrams.",
            "Read when doing architecture or cross-module design work.",
            [
                ("01-architecture/PROJECT_MAP.md", "Visual platform map"),
                ("01-architecture/MODULE_DEPENDENCY_MAP.md", "Dependencies"),
            ],
            [("02-core-platform/ARCHITECTURE.md", "Core platform")],
        )
    elif rel.name == "STANDARD_MODULE_TEMPLATE.md":
        lines = nav(
            "Canonical 10-section structure for every business module Architecture.md.",
            "Read when creating or standardizing a module documentation package.",
            [
                ("00-foundation/MODULE_STRUCTURE.md", "Module structure rules"),
                ("03-business-modules/", "Module folders"),
            ],
            [("00-foundation/PRE_CODE_GATE.md", "Before code")],
        )

    # --- Foundation ---
    elif parts[0] == "00-foundation":
        if name == "PROJECT_BRAIN.md":
            lines = nav(
                "Extended project brain — file checklists, prototype patterns, AI readiness matrix.",
                "Read for deep implementation patterns after the slim BRAIN.md stack.",
                [
                    ("../BRAIN.md", "Cursor entry"),
                    ("PRE_CODE_GATE.md", "Pre-code gate"),
                    ("PROJECT_COMMON_RULES.md", "Full rules"),
                ],
                [("../MODULE_REGISTRY.md", "Pick module")],
            )
        elif name == "GOVERNANCE.md":
            lines = nav(
                "Operational documentation governance — approval, status, registries.",
                "Read when changing doc status, running governance workflows, or updating registries.",
                [
                    ("../GOVERNANCE_FRAMEWORK.md", "Governance framework"),
                    ("PRE_CODE_GATE.md", "Pre-code gate"),
                ],
                [("../BRAIN.md", "Cursor entry")],
            )
        elif name == "PRE_CODE_GATE.md":
            lines = nav(
                "Checklist gate before any implementation — docs-first enforcement.",
                "Read before writing code, routes, schema, or UI for any change.",
                [
                    ("../BRAIN.md", "Cursor entry"),
                    ("GOVERNANCE.md", "Governance"),
                ],
                [("../MODULE_REGISTRY.md", "Module scope")],
            )
        elif name == "PROJECT_COMMON_RULES.md":
            lines = nav(
                "Full project common rules — modules, SaaS, UI, documentation-first.",
                "Read before multi-module or architecture work needing complete rule detail.",
                [
                    ("../BRAIN.md", "Cursor entry"),
                    ("GOVERNANCE.md", "Governance"),
                ],
                [("PRE_CODE_GATE.md", "Before code")],
            )
        elif name == "PRD.md":
            lines = nav(
                "Product requirements document — vision, scope, personas.",
                "Read when defining product scope or validating feature fit.",
                [
                    ("../BRAIN.md", "Cursor entry"),
                    ("../01-architecture/project.md", "Vision pointer"),
                ],
                [("../FINAL_ERP_STRUCTURE_MAP.md", "Structure map")],
            )
        elif name == "MODULE_STRUCTURE.md":
            lines = nav(
                "Required files and folder layout for every module documentation package.",
                "Read when scaffolding a new module docs folder.",
                [
                    ("../STANDARD_MODULE_TEMPLATE.md", "Architecture template"),
                    ("UNIVERSAL_MODULE_FRAMEWORK.md", "Module framework"),
                ],
                [("../03-business-modules/", "Module examples")],
            )
        elif name == "UNIVERSAL_MODULE_FRAMEWORK.md":
            lines = nav(
                "Universal module framework — install model, boundaries, integration.",
                "Read when designing a new installable module or module manifest.",
                [("MODULE_STRUCTURE.md", "File package")],
                [("../STANDARD_MODULE_TEMPLATE.md", "Architecture template")],
            )
        elif name == "MASTER_INDEX.md":
            lines = nav(
                "Legacy full documentation catalog.",
                "Read only when the slim PROJECT_MAP / MASTER_DOCUMENT_MAP do not locate a file.",
                [
                    ("../PROJECT_MAP.md", "Slim navigation"),
                    ("../MASTER_DOCUMENT_MAP.md", "Folder hierarchy"),
                ],
                [("../BRAIN.md", "Cursor entry")],
            )
        elif "standards" in parts and name == "DOCUMENT_NAVIGATION_STANDARD.md":
            return None  # already has nav
        elif "registries" in parts and name == "MODULE_REGISTRY.md":
            lines = nav(
                "Detailed module registry — schema, table prefixes, API bases, compliance.",
                "Read when you need table/API detail beyond the slim MODULE_REGISTRY.md index.",
                [
                    ("../../MODULE_REGISTRY.md", "Cursor module index"),
                    ("../UNIVERSAL_MODULE_FRAMEWORK.md", "Module framework"),
                ],
                [("../../MODULE_REGISTRY.md", "Back to slim index")],
            )

    # --- Architecture ---
    elif parts[0] == "01-architecture":
        if name == "PROJECT_MAP.md":
            lines = nav(
                "Visual platform architecture map — layers, modules, services, diagrams.",
                "Read when you need deep platform architecture context (not doc location).",
                [
                    ("../BRAIN.md", "Cursor entry"),
                    ("MODULE_DEPENDENCY_MAP.md", "Dependencies"),
                    ("../02-core-platform/ARCHITECTURE.md", "Core"),
                ],
                [("MODULE_DEPENDENCY_MAP.md", "Integration matrix")],
            )
        elif name == "MODULE_DEPENDENCY_MAP.md":
            lines = nav(
                "Module dependency and integration matrix — service deps, events.",
                "Read only when working on cross-module integration or declaring module dependencies.",
                [
                    ("../MODULE_REGISTRY.md", "Module index"),
                    ("../03-business-modules/", "Module docs"),
                ],
                [("MASTER_MODULE_ARCHITECTURE.md", "Module architecture patterns")],
            )
        elif name == "MASTER_MODULE_ARCHITECTURE.md":
            lines = nav(
                "Master patterns for business module architecture and boundaries.",
                "Read when designing or reviewing any business module architecture.",
                [
                    ("MODULE_DEPENDENCY_MAP.md", "Dependencies"),
                    ("../STANDARD_MODULE_TEMPLATE.md", "Doc template"),
                ],
                [("../02-core-platform/ARCHITECTURE.md", "Core platform")],
            )
        elif name == "SAAS_PLATFORM_ARCHITECTURE.md":
            lines = nav(
                "SaaS platform architecture — tenant, billing, control plane.",
                "Read only when working on multi-tenant SaaS infrastructure or platform layer.",
                [
                    ("../07-saas/TENANT_ARCHITECTURE.md", "Tenant architecture"),
                    ("HYBRID_LICENSED_ERP_ARCHITECTURE.md", "Hybrid licensing"),
                ],
                [("../07-saas/", "SaaS docs")],
            )
        elif name == "HYBRID_LICENSED_ERP_ARCHITECTURE.md":
            lines = nav(
                "Hybrid licensed ERP deployment model.",
                "Read only when working on on-prem, hybrid, or license-sync deployment.",
                [("SAAS_PLATFORM_ARCHITECTURE.md", "SaaS platform")],
                [("../07-saas/HYBRID_DEPLOYMENT.md", "Hybrid deployment")],
            )
        elif name == "project.md":
            lines = nav(
                "Short pointer to product vision and PRD.",
                "Read when you need the product vision entry point.",
                [("../00-foundation/PRD.md", "PRD")],
                [("../BRAIN.md", "Cursor entry")],
            )
        elif name == "DependencyMap.md":
            lines = nav(
                "Legacy dependency map — see MODULE_DEPENDENCY_MAP for authoritative matrix.",
                "Read only if linked from legacy docs; prefer MODULE_DEPENDENCY_MAP.md.",
                [("MODULE_DEPENDENCY_MAP.md", "Authoritative dependency map")],
                [("MODULE_DEPENDENCY_MAP.md", "Use this instead")],
            )

    # --- Core platform ---
    elif parts[0] == "02-core-platform":
        if name == "ARCHITECTURE.md":
            lines = nav(
                "Core platform framework hub — always-on shared layer.",
                "Read only when working on Core services, shared entities, or platform engines.",
                [
                    ("engines/README.md", "Engines index"),
                    ("entities/README.md", "Entities index"),
                    ("PERMISSION_SYSTEM_ARCHITECTURE.md", "Permissions"),
                ],
                [("entities/contacts.md", "Contacts (party master)")],
            )
        elif name == "API.md":
            lines = nav(
                "Core platform API surface — `/api/v1/core/`.",
                "Read only when implementing or consuming Core API endpoints.",
                [("ARCHITECTURE.md", "Core architecture")],
                [("entities/README.md", "Core entities")],
            )
        elif name == "PERMISSION_SYSTEM_ARCHITECTURE.md":
            lines = nav(
                "RBAC and permission system architecture.",
                "Read only when working on roles, permissions, or record-level access.",
                [("ARCHITECTURE.md", "Core hub"), ("entities/permissions.md", "Permissions entity")],
                [("entities/roles.md", "Roles entity")],
            )
        elif parts[1] == "engines":
            engine_label = name.replace(".md", "").replace("_", " ").replace("-", " ")
            lines = nav(
                f"Core engine specification: {engine_label}.",
                f"Read only when working on the {engine_label} engine or its consumers.",
                [("../ARCHITECTURE.md", "Core hub"), ("README.md", "Engines index")],
                [("../ARCHITECTURE.md", "Core hub")],
            )
        elif parts[1] == "subsystems":
            sub_label = name.replace(".md", "").replace("_", " ")
            lines = nav(
                f"Core subsystem architecture: {sub_label}.",
                f"Read only when working on {sub_label} or modules that consume it.",
                [("../ARCHITECTURE.md", "Core hub")],
                [("../entities/README.md", "Core entities")],
            )
        elif parts[1] == "entities":
            entity = name.replace(".md", "")
            lines = nav(
                f"Core entity specification: `{entity}`.",
                f"Read only when working on the shared `{entity}` entity — not module-owned duplicates.",
                [("README.md", "Entities index"), ("../ARCHITECTURE.md", "Core hub")],
                [("README.md", "All entities")],
            )

    # --- Module isolation ---
    elif parts[0] == "architecture" and name == "MODULE_ISOLATION_REPORT.md":
        lines = nav(
            "Module isolation audit — cross-module DB violations and compliance scores.",
            "Read only when reviewing module boundaries, table ownership, or isolation compliance.",
            [
                ("../01-architecture/MODULE_DEPENDENCY_MAP.md", "Dependencies"),
                ("../MODULE_REGISTRY.md", "Modules"),
            ],
            [("../STANDARD_MODULE_TEMPLATE.md", "Module template")],
        )

    # --- Business modules ---
    elif mod:
        mname = human_name(mod)
        arch = arch_entry(mod)
        base = f"03-business-modules/{mod}"
        arch_path = f"{base}/{arch}"

        if name in ("Architecture.md", "ARCHITECTURE.md") or name.endswith("_MODULE_ARCHITECTURE.md") or (
            name.endswith("_ARCHITECTURE.md") and mod == "hr-payroll"
        ):
            related_items: list[tuple[str, str] | None] = [
                ("../../01-architecture/MODULE_DEPENDENCY_MAP.md", "Dependencies"),
            ]
            for fname, label in [
                ("Database.md", "Database"),
                ("API.md", "API"),
                ("Workflow.md", "Workflow"),
                ("Permissions.md", "Permissions"),
                ("ModuleManifest.md", "Manifest"),
            ]:
                if (DOCS / base / fname).exists():
                    related_items.insert(0, (fname, label))
            next_items: list[tuple[str, str]] = []
            if (DOCS / base / "Database.md").exists():
                next_items.append(("Database.md", "Data ownership"))
            elif (DOCS / base / "API.md").exists():
                next_items.append(("API.md", "API surface"))
            proto = DOCS / "04-uiux" / "prototype" / mod
            if proto.exists():
                next_items.append((f"../../04-uiux/prototype/{mod}/", "UI build guides"))
            if not next_items:
                next_items.append((arch, "Architecture"))
            lines = nav(
                f"{mname} module architecture — scope, features, data ownership, and integration boundaries.",
                f"Read this file only if working on {mname} architecture, features, or module boundaries.",
                related_items,
                next_items,
            )
        elif name == "Database.md":
            lines = nav(
                f"{mname} module database — owned tables and schema.",
                f"Read this file only if working on {mname} database tables, migrations, or data ownership.",
                [(arch, "Architecture"), ("API.md", "API"), ("../../02-core-platform/entities/contacts.md", "Core contacts")],
                [(arch, "Architecture"), ("API.md", "API")],
            )
        elif name == "API.md":
            lines = nav(
                f"{mname} module API — `/api/v1/{mod}/` endpoints.",
                f"Read this file only if working on {mname} API routes or service contracts.",
                [(arch, "Architecture"), ("Database.md", "Database")],
                [(arch, "Architecture"), ("Workflow.md", "Workflow") if (DOCS / base / "Workflow.md").exists() else ("Permissions.md", "Permissions")],
            )
        elif name == "Workflow.md":
            lines = nav(
                f"{mname} module workflows and state machines.",
                f"Read this file only if working on {mname} business workflows or approvals.",
                [(arch, "Architecture"), ("Permissions.md", "Permissions")],
                [(arch, "Architecture")],
            )
        elif name == "Permissions.md":
            lines = nav(
                f"{mname} module permissions and RBAC namespace.",
                f"Read this file only if working on {mname} roles, permissions, or record rules.",
                [(arch, "Architecture"), ("../../02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md", "Core permissions")],
                [(arch, "Architecture")],
            )
        elif name == "ModuleManifest.md":
            lines = nav(
                f"{mname} module manifest — install registry and dependencies.",
                f"Read this file only if registering, installing, or declaring {mname} module dependencies.",
                [(arch, "Architecture"), ("../../01-architecture/MODULE_DEPENDENCY_MAP.md", "Dependencies")],
                [(arch, "Architecture")],
            )
        elif name == "README.md":
            lines = nav(
                f"{mname} module documentation home.",
                f"Read first when entering the {mname} module docs folder.",
                [(arch, "Architecture"), ("ModuleManifest.md", "Manifest") if (DOCS / base / "ModuleManifest.md").exists() else None],
                [(arch, "Architecture")],
            )
        elif name == "UI.md":
            lines = nav(
                f"{mname} module UI navigation map.",
                f"Read only if working on {mname} admin navigation or screen inventory.",
                [(arch, "Architecture"), (f"../../04-uiux/prototype/", "UI prototypes")],
                [(f"Menus/", "Screen menus") if (DOCS / base / "Menus").exists() else (arch, "Architecture")],
            )
        elif name.endswith("_UI_BUILD_GUIDE.md"):
            lines = nav(
                f"{mname} UI prototype build guide — step-by-step screens.",
                f"Read only if building {mname} UI prototype screens in apps/web/.",
                [(arch, "Architecture"), ("../../04-uiux/standards/module-ui-standard.md", "Module UI standard")],
                [(f"../../04-uiux/prototype/{mod}/", "Screen specs")],
            )
        elif len(parts) == 4 and parts[1] == "ecommerce" and "ARCHITECTURE" in name.upper():
            area = parts[2]
            lines = nav(
                f"Ecommerce {area} sub-area architecture.",
                f"Read only if working on ecommerce {area} features (not the full ecommerce hub).",
                [
                    ("../Architecture.md", "Ecommerce hub"),
                    (f"../../04-uiux/prototype/", "UI prototypes"),
                ],
                [("../Architecture.md", "Ecommerce hub")],
            )
        elif mod == "hr-payroll" and name.endswith("_ARCHITECTURE.md"):
            topic = name.replace("HR_", "").replace("_ARCHITECTURE.md", "").replace("_", " ").title()
            lines = nav(
                f"HR & Payroll — {topic} architecture.",
                f"Read only if working on HR/Payroll {topic.lower()}.",
                [("HR_PAYROLL_MASTER_ARCHITECTURE.md", "Master architecture"), ("HR_MODULE_MASTER_INDEX.md", "Master index")],
                [("HR_PAYROLL_MASTER_ARCHITECTURE.md", "Master architecture")],
            )
        elif mod == "hr-payroll" and name == "HR_MODULE_MASTER_INDEX.md":
            lines = nav(
                "HR & Payroll documentation master index.",
                "Read when navigating the HR/Payroll doc set — not for other modules.",
                [("HR_PAYROLL_MASTER_ARCHITECTURE.md", "Master architecture")],
                [("HR_PAYROLL_MASTER_ARCHITECTURE.md", "Start here")],
            )

    # --- UI standards ---
    elif parts[0] == "04-uiux" and parts[1] == "standards":
        topic = name.replace(".md", "").replace("-", " ")
        lines = nav(
            f"Global UI standard: {topic}.",
            f"Read only if working on UI patterns related to {topic}.",
            [
                ("ENTERPRISE_UI_ARCHITECTURE.md", "Enterprise UI") if name != "ENTERPRISE_UI_ARCHITECTURE.md" else ("module-ui-standard.md", "Module UI"),
                ("../../BRAIN.md", "Cursor entry"),
            ],
            [("module-ui-standard.md", "Module UI standard")],
        )

    # --- AI ---
    elif parts[0] == "06-ai":
        if "experience" in parts:
            lines = nav(
                "AI OS user experience specification.",
                "Read only when working on AI UX in admin, storefront, or customer-facing flows.",
                [
                    ("../platform/ai/AI_OS_ARCHITECTURE.md", "AI OS platform"),
                    ("../../BRAIN.md", "Cursor entry"),
                ],
                [("../platform/ai/README.md", "AI platform index")],
            )
        else:
            lines = nav(
                "AI OS platform architecture and engines.",
                "Read only when working on AI OS platform, agents, tools, or audit.",
                [
                    ("AI_OS_ARCHITECTURE.md", "AI OS architecture") if name != "AI_OS_ARCHITECTURE.md" else ("ARCHITECTURE.md", "Architecture"),
                    ("../../BRAIN.md", "Cursor entry"),
                ],
                [("../experience/README.md", "AI experience specs")],
            )

    # --- SaaS ---
    elif parts[0] == "07-saas":
        lines = nav(
            f"SaaS platform documentation: {name.replace('.md', '')}.",
            "Read only when working on multi-tenant SaaS, billing, or hybrid deployment.",
            [
                ("TENANT_ARCHITECTURE.md", "Tenant architecture") if name != "TENANT_ARCHITECTURE.md" else ("README.md", "SaaS index"),
                ("../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md", "SaaS platform arch"),
            ],
            [("../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md", "Platform architecture")],
        )

    # --- Builder ---
    elif parts[0] == "08-builder":
        lines = nav(
            f"Storefront builder specification: {name.replace('.md', '')}.",
            "Read only when working on page/theme/form builder UI.",
            [
                ("../03-business-modules/ecommerce/builder/ARCHITECTURE.md", "Ecommerce builder arch"),
                ("../../04-uiux/standards/builder-ui.md", "Builder UI standard"),
            ],
            [("../03-business-modules/ecommerce/builder/ARCHITECTURE.md", "Builder architecture")],
        )

    if not lines:
        # Generic fallback for remaining major docs
        title = name.replace(".md", "").replace("_", " ")
        lines = nav(
            f"Documentation: {title}.",
            f"Read only if your task involves {title.lower()}.",
            [("../../BRAIN.md" if len(parts) > 1 else "../BRAIN.md", "Cursor entry")],
            [("../../PROJECT_MAP.md" if len(parts) > 1 else "../PROJECT_MAP.md", "Doc map")],
        )

    return "\n".join(lines) + "\n\n---\n\n"


def nav(purpose: str, when: str, related: list[tuple[str, str] | None], next_: list[tuple[str, str]]) -> list[str]:
    out = [
        "## Purpose",
        purpose,
        "",
        "## When To Read",
        when,
        "",
        "## Related Files",
    ]
    for item in related:
        if item is None:
            continue
        path, label = item
        out.append(f"- [{label}]({path})")
    out.extend(["", "## Read Next"])
    for path, label in next_:
        if isinstance(path, tuple):
            path, label = path
        out.append(f"- [{label}]({path})")
    return out


def strip_all_nav_blocks(text: str) -> str:
    """Remove all Purpose/When To Read/Related/Read Next nav blocks."""
    pattern = re.compile(
        r"(?:^|\n)## Purpose\n(?=[\s\S]*?\n## When To Read\n)(?=[\s\S]*?\n## Related Files\n)(?=[\s\S]*?\n## Read Next\n)[\s\S]*?\n---\n*",
        re.MULTILINE,
    )
    prev = None
    while prev != text:
        prev = text
        text = pattern.sub("\n", text, count=1)
    return text.lstrip("\n")


def find_insert_after_header(text: str) -> int:
    """Return byte index after first --- following title/metadata block."""
    if not text.startswith("#"):
        return 0
    lines = text.split("\n")
    i = 1
    while i < len(lines):
        line = lines[i]
        if line.strip() == "---":
            chunk = "\n".join(lines[: i + 1]) + "\n"
            rest = text[len(chunk) :]
            blank = 0
            while rest.startswith("\n"):
                blank += 1
                rest = rest[1:]
            return len(chunk) + blank
        if line.startswith(">") or line.startswith("**") or line.strip() == "":
            i += 1
            continue
        break
    i = 1
    while i < len(lines) and (lines[i].startswith(">") or lines[i].strip() == ""):
        i += 1
    return len("\n".join(lines[:i])) + (1 if i < len(lines) else 0)


def insert_nav(content: str, nav_block: str) -> str:
    body = strip_all_nav_blocks(content)

    body = re.sub(
        r"\n## Related Files\n(?:[^\n]+\n)*?\n## Read Next\n(?:[^\n]+\n)*?\n(?=---\n\n(?:\*\*Maintainer|\*\*AgainERP|## Change History))",
        "\n",
        body,
        count=1,
    )

    pos = find_insert_after_header(body)
    if pos == 0:
        return nav_block + body
    return body[:pos] + nav_block + body[pos:]


def process_file(path: Path, force: bool = False) -> bool:
    text = path.read_text(encoding="utf-8")
    nav_block = build_nav(path)
    if not nav_block:
        return False
    if not force and has_nav_block(text):
        return False
    new_text = insert_nav(text, nav_block)
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        return True
    return False


def main() -> None:
    import sys

    force = "--force" in sys.argv
    updated = 0
    skipped = 0
    for path in sorted(DOCS.rglob("*.md")):
        if not should_process(path):
            continue
        if process_file(path, force=force):
            updated += 1
            print(f"  + {path.relative_to(DOCS)}")
        else:
            skipped += 1
    print(f"\nUpdated: {updated} · Skipped: {skipped}")


if __name__ == "__main__":
    main()
