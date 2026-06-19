# Permissions

> **Status:** Approved (entity spec)  
> **Owner:** Core · **Tables:** `permissions`, `role_permissions`  
> **Canonical architecture:** [PERMISSION_SYSTEM_ARCHITECTURE.md](../PERMISSION_SYSTEM_ARCHITECTURE.md) — global authorization (Step 15)

## Purpose
Core entity specification: `permissions`.

## When To Read
Read only when working on the shared `permissions` entity — not module-owned duplicates.

## Related Files
- [Entities index](README.md)
- [Core hub](../ARCHITECTURE.md)

## Read Next
- [All entities](README.md)

---

## Purpose

Granular access control keys. Modules register permissions; roles are granted permissions; users inherit via roles.

**Full specification:** [PERMISSION_SYSTEM_ARCHITECTURE.md](../PERMISSION_SYSTEM_ARCHITECTURE.md)

## Used By

Every module registers permissions. Display labels use `{Resource}.{Action}` (e.g. `Product.View`); canonical keys use `{module}.{resource}.{action}` (e.g. `catalog.product.view`).

## Key Fields (`permissions`)

| Field | Type | Description |
|-------|------|-------------|
| `module` | VARCHAR | Module name (`catalog`, `sales`) |
| `group` | VARCHAR | Permission group (`Catalog — Products`) |
| `resource` | VARCHAR | Resource slug (`product`, `order`) |
| `action` | VARCHAR | Action (`view`, `create`, `approve`) |
| `key` | VARCHAR | Canonical key (`catalog.product.view`) |
| `label` | VARCHAR | Display label (`Product.View`) |
| `name` | VARCHAR | Human description |
| `risk` | ENUM | low, medium, high, critical |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/core/permissions` | List all permissions |
| GET | `/api/v1/core/permissions?module=catalog` | Filter by module |
| GET | `/api/v1/me/permissions` | Current user's effective permissions |

## Permissions

| Key | Description |
|-----|-------------|
| `core.permission.view` | View permission list |
| `core.role.manage` | Assign permissions to roles |

## Module Rule

Modules **register** permissions at install time. Modules do **not** create custom permission tables.
