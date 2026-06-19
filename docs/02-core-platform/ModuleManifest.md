# Core — Module Manifest

> **Layer:** 1 — Core (Foundation)  
> **Owner:** Platform Team  
> **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Purpose
Documentation: ModuleManifest.

## When To Read
Read only if your task involves modulemanifest.

## Related Files
- [Cursor entry](../BRAIN.md)

## Read Next
- [Doc map](../PROJECT_MAP.md)

---

## Module Name

**Core**

## Version

`1.0.0-arch` (documentation only)

## Status

`Draft`

## Dependencies

None — Core is the foundation. All other modules depend on Core.

---
## Submodules (26)

Users · Roles · Permissions · Companies · Branches · Contacts · Addresses · Activities · Notifications · Comments · Notes · Attachments · Media Library · Settings · Localization · Languages · Currencies · Taxes · Audit Logs · Workflow Engine · Approval Engine · Search Engine · API Manager · System Events · Cache Manager · Queue Manager

---

## Database Tables (summary)

Identity, RBAC, tenant, parties, collaboration, media, config, i18n, tax, workflow, approval, search, API, analytics cache, queue — see [ARCHITECTURE.md § Database](./ARCHITECTURE.md#database-architecture).

---

## API Base

`/api/v1/core/`

---

## Permission Prefix

`core.*`

---

## Provides To

Catalog, Orders, Inventory, CRM, Sales, Purchase, Accounting, POS, HR, Ecommerce, AI, Marketplace — all modules.

---

**Last Updated:** 2026-06-12
