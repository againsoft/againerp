# Permissions — {Module}

> **Status:** Draft  
> **Module:** {Module}  
> **Document Type:** Permissions (Level 5 SSOT)  
> **Namespace:** `{module}.*`

---

## Purpose

Define **{Module}** RBAC permissions, role mappings, and record rules. This file is the **Permissions SSOT** — Architecture §7 summarizes and links here.

## When To Read

Read only for roles, permission keys, or record-level access control work.

## Related Files

- [Architecture.md](Architecture.md) — §7 Permissions summary
- [PERMISSION_SYSTEM_ARCHITECTURE.md](../../02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md) — platform RBAC
- [UI.md](UI.md) — menu visibility by role

## Read Next

- One permission group below — stop here

---

## Namespace

| Property | Value |
|----------|-------|
| **Root** | `{module}.access` |
| **Pattern** | `{module}.{entity}.{action}` |
| **Actions** | `view` · `manage` · `export` · `approve` |

---

## Permission Matrix

| Permission | Description | Default roles |
|------------|-------------|---------------|
| `{module}.access` | Enter module admin | Admin, Manager |
| `{module}.example.view` | View examples | Admin, Manager, User |
| `{module}.example.manage` | Create/update/delete | Admin, Manager |
| `{module}.example.export` | Export data | Admin |
| `{module}.ai.access` | Use AI tools | Admin, Manager |
| `{module}.reports.view` | View reports | Admin, Manager |

---

## Role Templates

| Role | Permissions |
|------|-------------|
| **{Module} Admin** | `{module}.*` |
| **{Module} Manager** | access · *.view · *.manage · reports.view |
| **{Module} User** | access · *.view |

---

## Record Rules

| Rule | Scope | Condition |
|------|-------|-----------|
| Company isolation | all entities | `company_id = user.company_id` |
| Branch scope (optional) | `{prefix}_example` | `branch_id IN user.branch_ids` |
| Owner-only (optional) | `{prefix}_example` | `created_by = user.id` |

---

## Menu ↔ Permission Mapping

| Menu / Screen | Required permission |
|---------------|---------------------|
| Dashboard | `{module}.access` |
| _Entity list_ | `{module}.example.view` |
| _Entity create_ | `{module}.example.manage` |

---

## AI & Reports Gates

| Feature | Permission |
|---------|------------|
| AI tools | `{module}.ai.access` + tool-specific if any |
| Reports | `{module}.reports.view` |

---

**Module:** {Module} · **Last Updated:** {DATE} · **Maintainer:** {team}
