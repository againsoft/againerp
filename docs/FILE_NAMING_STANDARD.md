# AgainERP — File Naming Standard

## Principles

| Principle | Rule |
|-----------|------|
| Readable | Human-readable names, not codes or abbreviations |
| Consistent | Same pattern across all modules |
| Scalable | Works with 100+ modules and thousands of pages |
| Git-safe | No special characters that break cross-platform paths |

---

## Folder Naming

| Level | Convention | Example |
|-------|------------|---------|
| Root docs folders | lowercase, hyphen if multi-word | `ui-ux`, `workflows` |
| Module folders | lowercase, single word | `ecommerce`, `inventory`, `helpdesk` |
| Menu group folders | PascalCase or Title Case matching UI label | `Products`, `Orders` |
| Future modules | lowercase | `crm`, `sales`, `purchase`, `accounting` |

---

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Module root docs | PascalCase + `.md` | `Architecture.md`, `Database.md` |
| Menu / screen docs | Title Case + spaces + `.md` | `Product List.md`, `Create Product.md` |
| Core docs | lowercase + hyphen + `.md` | `user-management.md`, `workflow-engine.md` |
| Standards & index | UPPERCASE or PascalCase | `README.md`, `DOCUMENTATION_STANDARD.md` |
| Templates | leading underscore | `_PAGE_TEMPLATE.md` |

---

## Do Not Use

- `product_list.md` (snake_case for screen docs)
- `productlist.md` (no word separation)
- `Product-List.md` (hyphens in screen names)
- `products/list.md` (generic filenames)
- Version suffixes in filenames (`Product List v2.md`) — use git history instead

---

## Menu File Mapping

Each admin menu item maps 1:1 to a markdown file:

```
UI Menu: Ecommerce → Products → Product List
File:    docs/modules/ecommerce/Menus/Products/Product List.md
```

Submenus get their own folder when they have 2+ child screens:

```
Ecommerce/Menus/Products/Product List.md
Ecommerce/Menus/Products/Create Product.md
Ecommerce/Menus/Orders/Order List.md
```

Single-screen menu groups may use a flat file:

```
Ecommerce/Menus/Dashboard.md
```

---

## Module Replication Checklist

When adding a new module (e.g. CRM):

1. Create `docs/modules/crm/`
2. Add 8 required module files (`Architecture.md` … `Roadmap.md`)
3. Create `docs/modules/crm/Menus/` with folder-per-menu-group
4. Add one `.md` file per screen using `_PAGE_TEMPLATE.md`
5. Register module in `docs/README.md` and `docs/roadmap/modules.md`
