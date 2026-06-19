# Permission Aware UI

> **Status:** Draft  
> **Parent:** [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **Core:** [PERMISSION_SYSTEM_ARCHITECTURE.md](../../02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md) · [core/entities/permissions.md](../../02-core-platform/entities/permissions.md)

---

## Purpose
Global UI standard: permission aware ui.

## When To Read
Read only if working on UI patterns related to permission aware ui.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

Every UI element respects RBAC, company scope, branch scope, and module access. Users only see what they can use.

---

## Dimensions

| Dimension | UI Effect |
|-----------|-----------|
| **Role** | Default layouts, dashboard widgets |
| **Permission** | Button, menu, field visibility |
| **Company** | Data scope; company switcher |
| **Branch** | Branch-filtered lists and switcher |
| **Module Access** | Entire sidebar section hidden |

---

## Rules

| Rule | Implementation |
|------|----------------|
| **Hide, don't disable** | Forbidden actions removed from UI — not grayed out |
| **No data leakage** | Search and lists filtered server-side |
| **Field ACL** | Hide or mask fields per `field_permissions` |
| **Record rules** | List queries include domain filters |
| **Menu permissions** | `ecommerce.catalog.access` gates menu group |
| **Smart buttons** | Hidden if user cannot read related model |
| **Bulk actions** | Only actions user can perform on all selected |

---

## Permission Check Flow

```
User loads page
  → Resolve active company + branch
  → Load user permissions (cached 15min)
  → Filter menu tree
  → Filter page actions
  → Filter table columns (field ACL)
  → Filter row actions
  → Render
```

---

## UI Patterns

| Scenario | UI |
|----------|-----|
| No read access | 403 page with "Request access" link |
| No write access | Read-only form — all inputs disabled, save hidden |
| Partial field access | Masked values (`••••`) or field omitted |
| Cross-company user | Company switcher visible |
| Single company | Company switcher hidden |

---

## API Alignment

Frontend permission checks are **UX only**. Server always enforces ACL. Never rely on hidden UI for security.

---

## Module Registration

`ModuleManifest.md` declares:

```yaml
permissions:
  - ecommerce.catalog.access
  - catalog.product.read
  - catalog.product.write
menus:
  - permission: ecommerce.catalog.access
actions:
  - id: create_product
    permission: catalog.product.write
```
