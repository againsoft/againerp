#!/usr/bin/env python3
"""Generate ui-prototype page stub markdown files from Ecommerce MENU_STRUCTURE."""

import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROTOTYPE = os.path.join(ROOT, "ui-prototype")
MENU_FILE = os.path.join(ROOT, "modules", "ecommerce", "MENU_STRUCTURE.md")

FOLDER_MAP = {
    "Dashboard": "dashboard",
    "Catalog": "catalog",
    "Inventory": "inventory",
    "Sales": "orders",
    "Customers": "customers",
    "Marketing": "marketing",
    "Content": "content",
    "Builder": "builder",
    "SEO": "seo",
    "AI": "ai-os",
    "Media": "media",
    "Reports": "reports",
    "System": "system",
}

PLATFORM_PAGES = [
    ("platform", "TenantOverview.md", "Platform", "Platform → Overview"),
    ("platform", "RevenueDashboard.md", "Platform", "Platform → Revenue"),
    ("platform", "UsageDashboard.md", "Platform", "Platform → Usage"),
    ("platform", "AIUsageDashboard.md", "Platform", "Platform → AI Usage"),
    ("platform", "BillingOverview.md", "Platform", "Platform → Billing"),
    ("platform", "TenantList.md", "Platform", "Platform → Tenants"),
    ("platform", "PlanManagement.md", "Platform", "Platform → Plans"),
    ("platform", "AIApprovalCenter.md", "Platform", "Platform → AI Approvals"),
]


def to_filename(name):
    """Product List -> ProductList.md"""
    clean = re.sub(r"[^a-zA-Z0-9\s]", "", name)
    parts = clean.split()
    return "".join(p.capitalize() for p in parts) + ".md"


def parse_menu_tree(path):
    screens = []
    current_group = None
    current_sub = None
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip()
            m = re.match(r"^├──\s+(\w[\w\s&]+?)\s+\(\d+\)\s*$", line)
            if m:
                current_group = m.group(1).strip()
                current_sub = None
                continue
            m = re.match(r"^│\s+├──\s+(\w[\w\s&]+?)\s+\(\d+\)\s*$", line)
            if m:
                current_sub = m.group(1).strip()
                continue
            m = re.match(r"^│\s+├──\s+(.+?)\s*$", line)
            if m and current_group:
                name = m.group(1).strip()
                if "→" in name:
                    name = name.split("→")[0].strip()
                screens.append((current_group, current_sub, name))
                continue
            m = re.match(r"^│\s+│\s+├──\s+(.+?)\s*$", line)
            if m and current_group:
                name = m.group(1).strip()
                screens.append((current_group, current_sub, name))
    return screens


def build_path(group, sub, name):
    folder = FOLDER_MAP.get(group, group.lower())
    parts = [PROTOTYPE, folder]
    if sub:
        sub_dir = sub.lower().replace(" ", "-").replace("&", "and")
        parts.append(sub_dir)
    parts.append(to_filename(name))
    return os.path.join(*parts)


def menu_path(group, sub, name):
    parts = ["Ecommerce", group]
    if sub:
        parts.append(sub)
    parts.append(name)
    return " → ".join(parts)


def stub_content(group, sub, name):
    path = menu_path(group, sub, name)
    arch = f"../modules/ecommerce/{FOLDER_MAP.get(group, group.lower())}/ARCHITECTURE.md"
    if group == "Dashboard":
        arch = "../modules/ecommerce/dashboard/ARCHITECTURE.md"
    elif group == "Catalog":
        arch = "../modules/ecommerce/catalog/ARCHITECTURE.md"
    elif group == "Sales":
        arch = "../modules/ecommerce/orders/ARCHITECTURE.md"
    elif group == "AI":
        arch = "../modules/ai/AI_OS_ARCHITECTURE.md"
    elif group == "System":
        arch = "../core/ARCHITECTURE.md"

    return f"""# {name}

> **Status:** Draft  
> **Prototype Phase:** 1 — UI Only  
> **Module:** Ecommerce · {group}  
> **Menu Location:** {path}  
> **Menu Doc:** [Menus mirror](../../modules/ecommerce/Menus/{group}/{name}.md)  
> **UI Standards:** [ENTERPRISE_UI_ARCHITECTURE.md](../../ui-ux/ENTERPRISE_UI_ARCHITECTURE.md)

---

## Purpose

_TBD — prototype specification for {name}._

## Business Goal

- 

## User Roles

| Role | Access | Notes |
|------|--------|-------|
| Admin | Full | |
| Manager | Read/Write | |
| Staff | Read | |

## Menu Location

`{path}`

## Breadcrumb

`AgainERP › {path.replace(" → ", " › ")}`

## UI Layout

_See [ENTERPRISE_UI_ARCHITECTURE.md](../../ui-ux/ENTERPRISE_UI_ARCHITECTURE.md)._

## Components

_TBD_

## Fields

_TBD_

## Actions

_TBD_

## Filters

_TBD_

## Tables

_TBD_

## Permissions

_TBD_

## Workflows

_TBD_

## Related Pages

_TBD_

## AI Features

_TBD — see [AI_FIRST_ARCHITECTURE.md](../../modules/ai/AI_FIRST_ARCHITECTURE.md)_

## Reports

_TBD_

## Future Enhancements

- 

## Prototype Notes

| Item | Detail |
|------|--------|
| Fixture | `data/` TBD |
| Mock route | `/prototype/{FOLDER_MAP.get(group, group.lower())}/...` |

## Change History

| Date | Change |
|------|--------|
| 2026-06-12 | Stub generated |

"""


def platform_stub(title, menu):
    return f"""# {title.replace(".md", "").replace("Dashboard", " Dashboard")}

> **Status:** Draft  
> **Prototype Phase:** 1 — UI Only  
> **Module:** Platform  
> **Menu Location:** {menu}  
> **Architecture:** [SAAS_PLATFORM_ARCHITECTURE.md](../../SAAS_PLATFORM_ARCHITECTURE.md)

---

## Purpose

_TBD — SaaS platform owner screen._

## Business Goal

- 

## User Roles

| Role | Access |
|------|--------|
| Platform Admin | Full |

## Menu Location

`{menu}`

## Breadcrumb

`Platform › {menu.split(" → ")[-1]}`

## UI Layout

_TBD_

## Components

_TBD_

## Fields

_TBD_

## Actions

_TBD_

## Filters

_TBD_

## Tables

_TBD_

## Permissions

`platform.*`

## Workflows

_TBD_

## Related Pages

_TBD_

## AI Features

_TBD_

## Reports

_TBD_

## Future Enhancements

- 

## Prototype Notes

| Item | Detail |
|------|--------|
| Fixture | `data/platform-*.json` |

## Change History

| Date | Change |
|------|--------|
| 2026-06-12 | Stub generated |

"""


def main():
    created = 0
    skipped = 0
    screens = parse_menu_tree(MENU_FILE)
    for group, sub, name in screens:
        filepath = build_path(group, sub, name)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        if os.path.exists(filepath):
            skipped += 1
            continue
        with open(filepath, "w", encoding="utf-8") as out:
            out.write(stub_content(group, sub, name))
        created += 1

    for folder, fname, mod, menu in PLATFORM_PAGES:
        filepath = os.path.join(PROTOTYPE, folder, fname)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        if os.path.exists(filepath):
            skipped += 1
            continue
        title = fname.replace(".md", "")
        with open(filepath, "w", encoding="utf-8") as out:
            out.write(platform_stub(title, menu))
        created += 1

    print(f"Created {created} stub pages, skipped {skipped} existing.")


if __name__ == "__main__":
    main()
