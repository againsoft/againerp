# Core Framework

> **Status:** Draft  
> **Layer:** 1 — Foundation

## Purpose
Documentation: README.

## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../BRAIN.md)

## Read Next
- [Doc map](../PROJECT_MAP.md)

---

Shared foundation for every AgainERP module. All business modules depend on Core — nothing runs outside it.

## Primary Document

| Document | Description |
|----------|-------------|
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | **Complete Core Framework architecture** |
| [ModuleManifest.md](./ModuleManifest.md) | Core module index |
| [shared-entities.md](./shared-entities.md) | Cross-module entity index |

## Shared Entities

Companies · Branches · Users · Roles · Permissions · Contacts · Addresses · Media Library · Tags · Notes · Activities · Comments · Attachments

Detail: [entities/](./entities/)

## Platform Services (26)

Users, RBAC, Tenant, Collaboration, Media, Settings, i18n, Tax, Audit, Workflow, Approval, Search, API Manager, Events, Cache, Queue

Full design: [ARCHITECTURE.md](./ARCHITECTURE.md)

## Rule

Core behavior is documented **once** here. Modules reference Core — they do not duplicate it.
