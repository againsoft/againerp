# Tenant Architecture

> **Status:** Draft  
> **Parent:** [SAAS_PLATFORM_ARCHITECTURE.md](../SAAS_PLATFORM_ARCHITECTURE.md)

---

## Entity Hierarchy

```
Platform (AgainERP)
└── Tenant (SaaS subscriber — billing & isolation root)
    └── Company (ERP company — existing model)
        └── Branch
            └── Warehouse
```

| ID Column | Scope |
|-----------|-------|
| `tenant_id` | Platform SaaS boundary |
| `company_id` | ERP data boundary (all business tables) |
| `branch_id` | Location scope where applicable |

Single-company tenant: 1 tenant → 1 company.  
Multi-company tenant: 1 tenant → N companies (plan limit).

---

## Isolation Approaches

### 1. Shared Database + Row-Level (Recommended)

| Aspect | Detail |
|--------|--------|
| **Model** | One PostgreSQL cluster, one schema |
| **Isolation** | `tenant_id` on platform tables; `company_id` on business tables; companies.tenant_id FK |
| **Pros** | Single migration, lowest ops cost, aligns with existing design |
| **Cons** | Requires strict query discipline; optional RLS for defense |
| **Scale** | 10,000+ tenants with indexing + partitioning |

```sql
-- Every business query
WHERE company_id IN (SELECT id FROM companies WHERE tenant_id = :tenant_id)
-- Or direct company_id when user context already scoped
```

### 2. Schema Per Tenant

| Aspect | Detail |
|--------|--------|
| **Model** | `tenant_123.products`, `tenant_456.products` |
| **Pros** | Stronger logical separation |
| **Cons** | Migration runs N times; connection pooling complexity |
| **Verdict** | Not recommended at 10k scale |

### 3. Database Per Tenant

| Aspect | Detail |
|--------|--------|
| **Model** | Separate PostgreSQL database per tenant |
| **Pros** | Maximum isolation, easy per-tenant backup |
| **Cons** | Connection limits, migration ops, cost |
| **Verdict** | Enterprise tier option only — same schema, dedicated instance |

---

## Recommendation

**Primary:** Shared DB + row-level isolation (approach 1).

**Enterprise option:** Dedicated database instance (approach 3) with identical schema — routing layer selects connection by `tenant_id`.

---

## Provisioning Flow

```
Signup form
  → Create platform_tenants (status: provisioning)
  → Queue: provision_tenant
      → Create default company (tenant_id set)
      → Create admin user + role
      → Seed settings, default plan trial
      → Create platform_subscriptions (trial)
      → Apply plan entitlements to feature cache
  → status: active
  → Welcome email
```

---

## Tenant States

| State | Login | Writes | Billing |
|-------|-------|--------|---------|
| `provisioning` | No | No | No |
| `trial` | Yes | Yes | Trial clock |
| `active` | Yes | Yes | Current |
| `past_due` | Yes | Yes (grace) | Retry |
| `suspended` | Limited | No | Blocked |
| `cancelled` | Read-only export window | No | Ended |
| `deleted` | No | No | Archived |

---

## Domain Routing

| Type | Example | Resolution |
|------|---------|------------|
| Subdomain | `acme.againerp.com` | `platform_tenant_domains` → tenant_id |
| Custom domain | `erp.acme.com` | SSL + CNAME → tenant_id |
| Path (dev only) | `/t/acme` | Not production |

Middleware resolves tenant before auth — inject into request context.

---

## Migration from Single-Tenant

| Step | Action |
|------|--------|
| 1 | Add `platform_tenants` table |
| 2 | Add `companies.tenant_id` nullable |
| 3 | Create one tenant per existing company; backfill `tenant_id` |
| 4 | NOT NULL `companies.tenant_id` |
| 5 | Deploy platform APIs + billing |
| 6 | Existing installs: default "self-hosted" tenant with lifetime plan |

No business table schema change beyond company → tenant link.

---

## Backup & Restore

| Operation | Scope |
|-----------|-------|
| **Backup** | Logical export: tenant's companies + all child rows |
| **Restore** | New tenant_id; remap FKs in import job |
| **GDPR delete** | Purge all rows for tenant's companies after retention |

Job queue: `platform` — `backup_tenant`, `restore_tenant`, `purge_tenant`.
