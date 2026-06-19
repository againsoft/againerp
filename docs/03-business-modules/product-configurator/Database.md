# Product Configurator — Database

## Purpose
Product Configurator module database — owned tables and schema.

## When To Read
Read this file only if working on Product Configurator database tables, migrations, or data ownership.

## Related Files
- [Architecture](Architecture.md)
- [API](API.md)
- [Core contacts](../../02-core-platform/entities/contacts.md)

## Read Next
- [Architecture](Architecture.md)
- [API](API.md)

---

> **Prefix:** `configurator_`  
> **Standards:** [database/standards.md](../../05-development/database/standards.md)

---


## When To Read
Read this file only if working on Product Configurator database tables, migrations, or data ownership.

## Related Files
- [Architecture](Architecture.md)
- [API](API.md)
- [Core contacts](../../02-core-platform/entities/contacts.md)

## Read Next
- [Architecture](Architecture.md)
- [API](API.md)

---

## Tables

| Table | Purpose |
|-------|---------|
| `configurator_profiles` | Builder type definitions |
| `configurator_categories` | Component slots per profile |
| `configurator_rules` | Compatibility / constraint rules |
| `configurator_templates` | Pre-built configurations |
| `configurator_builds` | Saved builds |

All tables include mandatory columns: `id`, `uuid`, `company_id`, `status`, audit timestamps, soft delete.

---

## ER (simplified)

```
configurator_profiles
    ├── configurator_categories (profile_id, parent_id self-ref)
    ├── configurator_rules (profile_id, source/target category FK)
    ├── configurator_templates (profile_id)
    └── configurator_builds (profile_id, template_id optional)
```

---

## Migrations

| File | Table |
|------|-------|
| `20260615120000_create_configurator_profiles.sql` | profiles |
| `20260615120001_create_configurator_categories.sql` | categories |
| `20260615120002_create_configurator_rules.sql` | rules |
| `20260615120003_create_configurator_templates.sql` | templates |
| `20260615120004_create_configurator_builds.sql` | builds |

Run:

```bash
python modules/product_configurator/migrations/run_migrations.py
```

Rollback:

```bash
python modules/product_configurator/migrations/run_migrations.py --down
```

---

## JSON fields

| Table | Column | Content |
|-------|--------|---------|
| profiles | `settings` | UI steps, validation config, labels |
| categories | `settings` | Filter attrs, display options |
| rules | `rule_definition` | Type-specific rule payload |
| templates | `components` | `[{category_uuid, product_uuid, qty}]` |
| builds | `components` | Same as templates |
| builds | `metadata` | Cart ref, session, attribution |
