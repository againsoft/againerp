# Database — {Module}

> **Status:** Draft  
> **Module:** {Module}  
> **Document Type:** Database (Level 5 SSOT)  
> **Table prefix:** `{prefix}_*`

---

## Purpose

Define **{Module}** owned tables, indexes, and data ownership rules. This file is the **Database SSOT** — Architecture §4 summarizes and links here.

## When To Read

Read only for schema design, migrations, or data ownership questions. Do not open [DATABASE_REGISTRY.md](../../00-foundation/registries/DATABASE_REGISTRY.md) unless explicitly requested.

## Related Files

- [Architecture.md](Architecture.md) — §4 Data Ownership summary
- [API.md](API.md) — endpoints that read/write these tables
- [Core entities](../../02-core-platform/entities/) — consumed, not owned

## Read Next

- [Architecture.md](Architecture.md) — if boundaries unclear
- One entity or migration task — stop here

---

## Ownership Rules

| Rule | Detail |
|------|--------|
| **Owned** | All `{prefix}_*` tables listed below |
| **Not owned** | Core contacts, users, companies, media — FK only |
| **Forbidden** | Duplicate Core tables · cross-module JOINs on business tables |

---

## Core Entities Consumed (Reference Only)

| Core Table | {Module} FK | Doc |
|------------|-------------|-----|
| `contacts` | `{prefix}_*.contact_id` | [contacts.md](../../02-core-platform/entities/contacts.md) |
| `users` | audit columns | [users.md](../../02-core-platform/entities/users.md) |
| `companies` | `company_id` on all tables | [companies.md](../../02-core-platform/entities/companies.md) |

---

## Owned Tables

| Table | Purpose | Key columns |
|-------|---------|-------------|
| `{prefix}_example` | _Primary entity_ | `id`, `company_id`, `name`, `status` |

### `{prefix}_example`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `company_id` | UUID | FK → Core companies |
| `name` | varchar | _—_ |
| `status` | enum | _see Workflow.md_ |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### Indexes

| Index | Columns | Purpose |
|-------|---------|---------|
| `{prefix}_example_company_status` | `company_id`, `status` | List filters |

---

## Relationships (within module)

```text
{prefix}_parent (1) ──< {prefix}_child
```

---

## Migration Notes

| Version | Change |
|---------|--------|
| _initial_ | Create `{prefix}_*` tables |

---

## Anti-Patterns

```text
❌ {prefix}_contacts — use Core contacts
❌ FK to another module's business table (use service + ID field)
❌ Duplicate column definitions in Architecture.md
```

---

**Module:** {Module} · **Last Updated:** {DATE} · **Maintainer:** {team}
