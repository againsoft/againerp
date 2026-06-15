# Roles

> **Status:** Draft · **Owner:** Core · **Table:** `roles`

## Purpose

Named permission groups (e.g. Admin, Sales Manager, Ecommerce Staff). Users are assigned one or more roles per company.

## Used By

All modules — access control is role + permission based.

## Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `company_id` | FK | Company scope |
| `name` | VARCHAR | Role name |
| `slug` | VARCHAR | Machine name (`ecommerce-manager`) |
| `description` | TEXT | Role description |
| `is_system` | BOOLEAN | Built-in role (non-deletable) |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/core/roles` | List roles |
| POST | `/api/v1/core/roles` | Create role |
| PATCH | `/api/v1/core/roles/{uuid}` | Update |
| DELETE | `/api/v1/core/roles/{uuid}` | Soft delete |
| POST | `/api/v1/core/roles/{uuid}/permissions` | Assign permissions |

## Relationships

- Belongs to: `companies`
- Many-to-many: `permissions` via `role_permissions`
- Many-to-many: `users` via `user_roles`

## Permissions

| Key | Description |
|-----|-------------|
| `core.role.read` | View roles |
| `core.role.write` | Manage roles and permission assignment |

## Default System Roles

| Role | Scope |
|------|-------|
| Super Admin | Platform-wide |
| Company Admin | Full company access |
| Manager | Module-specific (configurable) |
| Staff | Limited read/write |
| Portal User | Customer/vendor portal |
