# Users

> **Status:** Draft · **Owner:** Core · **Table:** `users`

## Purpose
Core entity specification: `users`.

## When To Read
Read only when working on the shared `users` entity — not module-owned duplicates.

## Related Files
- [Entities index](README.md)
- [Core hub](../ARCHITECTURE.md)

## Read Next
- [All entities](README.md)

---

## Purpose

Authenticated system users — staff, admins, and portal users. Handles login, sessions, and company context.

## Used By

All modules for `created_by` / `updated_by`, assignments, and access control.

## Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `company_id` | FK | Primary company (multi-company via pivot) |
| `contact_id` | FK → contacts | Optional link to contact profile |
| `name` | VARCHAR | Display name |
| `email` | VARCHAR | Login email (unique) |
| `password` | VARCHAR | Hashed — never exposed in API |
| `avatar_media_id` | FK → media | Profile image |
| `locale` | VARCHAR | User language preference |
| `timezone` | VARCHAR | User timezone |
| `is_active` | BOOLEAN | Account active |
| `mfa_enabled` | BOOLEAN | MFA status |
| `last_login_at` | TIMESTAMP | Last login |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/core/users` | List users |
| POST | `/api/v1/core/users` | Create user |
| GET | `/api/v1/core/users/{uuid}` | Get user |
| PATCH | `/api/v1/core/users/{uuid}` | Update |
| DELETE | `/api/v1/core/users/{uuid}` | Soft delete |
| POST | `/api/v1/auth/login` | Authenticate |
| POST | `/api/v1/auth/logout` | End session |

## Relationships

- Belongs to: `companies`, `contacts` (optional)
- Many-to-many: `roles` via `user_roles`
- Many-to-many: `companies` via `user_companies` (multi-company access)

## Permissions

| Key | Description |
|-----|-------------|
| `core.user.read` | View users |
| `core.user.write` | Create / edit users |
| `core.user.delete` | Deactivate users |

## Security

- Passwords: bcrypt/argon2 only
- MFA-ready architecture
- Activity log on login/logout
