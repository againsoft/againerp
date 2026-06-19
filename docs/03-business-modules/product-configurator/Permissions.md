# Product Configurator — Permissions

## Purpose
Product Configurator module permissions and RBAC namespace.

## When To Read
Read this file only if working on Product Configurator roles, permissions, or record rules.

## Related Files
- [Architecture](Architecture.md)
- [Core permissions](../../02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md)

## Read Next
- [Architecture](Architecture.md)

---

> **Registry:** Core `permissions` table at module install  
> **Pattern:** `{module}.{resource}.{action}` — see [PERMISSION_SYSTEM_ARCHITECTURE.md](../../02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md)

---


## When To Read
Read this file only if working on Product Configurator roles, permissions, or record rules.

## Related Files
- [Architecture](Architecture.md)
- [Core permissions](../../02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md)

## Read Next
- [Architecture](Architecture.md)

---

## Required permissions (user request)

| Key | Label | Risk | Maps to |
|-----|-------|------|---------|
| `configurator.view` | Configurator.View | low | All GET endpoints |
| `configurator.create` | Configurator.Create | medium | All POST endpoints |
| `configurator.edit` | Configurator.Edit | medium | All PATCH endpoints |
| `configurator.delete` | Configurator.Delete | high | All DELETE endpoints |

---

## Extended permissions

| Key | Label | Risk |
|-----|-------|------|
| `configurator.recommend` | Configurator.Recommend | low |
| `configurator.ai.use` | Configurator.AI.Use | medium |

---

## Install registration

Defined in `modules/product_configurator/manifest.yaml` and `permissions.py`.

```yaml
permissions:
  - key: configurator.view
    label: Configurator.View
    group: Product Configurator
```

---

## API enforcement

Every route uses `require_permission()` dependency in `routes/deps.py`.  
Production: replace header stub with Core `PermissionService.resolve()`.

---

## UI (future)

| Screen | Minimum permission |
|--------|------------------|
| Configurator list | `configurator.view` |
| Create profile | `configurator.create` |
| Edit rules | `configurator.edit` |
| Delete template | `configurator.delete` |
| AI chat panel | `configurator.ai.use` |
