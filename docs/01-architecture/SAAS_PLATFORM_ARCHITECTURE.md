# AgainERP — SaaS Platform Architecture

> **Status:** Draft  
> **Version:** 1.0  
> **Governance:** [GOVERNANCE.md](../00-foundation/GOVERNANCE.md) · [DEVELOPMENT_STANDARDS.md](../00-foundation/standards/DEVELOPMENT_STANDARDS.md)  
> **Parent:** [HYBRID_LICENSED_ERP_ARCHITECTURE.md](./HYBRID_LICENSED_ERP_ARCHITECTURE.md) (Mode 1 — SaaS)  
> **Database:** [database/MASTER_DATABASE_ARCHITECTURE.md](../05-development/database/MASTER_DATABASE_ARCHITECTURE.md)  
> **AI:** [modules/ai/AI_OS_ARCHITECTURE.md](../06-ai/platform/ai/AI_OS_ARCHITECTURE.md)

## Purpose
SaaS platform architecture — tenant, billing, control plane.

## When To Read
Read only when working on multi-tenant SaaS infrastructure or platform layer.

## Related Files
- [Tenant architecture](../07-saas/TENANT_ARCHITECTURE.md)
- [Hybrid licensing](HYBRID_LICENSED_ERP_ARCHITECTURE.md)

## Read Next
- [SaaS docs](../07-saas/)

---

**No code. No migrations. No controllers.**  
Enterprise SaaS platform architecture for AgainERP. For hybrid and enterprise self-hosted deployments, see [HYBRID_LICENSED_ERP_ARCHITECTURE.md](./HYBRID_LICENSED_ERP_ARCHITECTURE.md).

---

## Objective

AgainERP is **not only an ERP** — it is a **SaaS ERP Platform**.

| Scale Target | Design For |
|--------------|------------|
| Companies (tenants) | 10,000+ |
| Users | 100,000+ |
| Products | Millions |
| Orders | Millions |
| Redesign | **Never** — architecture scales in place |

### Platform Must Support

Single company · Multi company · Multi branch · SaaS tenants · White label clients · Marketplace expansion · AI-driven operations

---
## Platform Vision

```
┌─────────────────────────────────────────────────────────────┐
│                    AGAINERP SAAS PLATFORM                    │
│  Tenants · Subscriptions · Billing · Features · AI Credits  │
├─────────────────────────────────────────────────────────────┤
│  Core Layer        │ Users · RBAC · Companies · Audit       │
├─────────────────────────────────────────────────────────────┤
│  Business Layer    │ Ecommerce · CRM · Accounting · …       │
├─────────────────────────────────────────────────────────────┤
│  AI Layer          │ AI OS · Agents · Automations           │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure    │ PostgreSQL · Redis · Queue · CDN       │
└─────────────────────────────────────────────────────────────┘
```

---

# Platform Layers

| Layer | Responsibility | Owner Docs |
|-------|----------------|------------|
| **Platform Layer** | Tenants, subscriptions, billing, features, metering, white label, partners, marketplace shell | This document |
| **Core Layer** | Users, RBAC, companies, branches, audit, workflow, events | [core/ARCHITECTURE.md](../02-core-platform/ARCHITECTURE.md) |
| **Business Layer** | ERP modules — catalog, orders, CRM, accounting, … | [MASTER_MODULE_ARCHITECTURE.md](MASTER_MODULE_ARCHITECTURE.md) |
| **AI Layer** | AI OS, agents, tools, credits, monitoring | [modules/ai/AI_OS_ARCHITECTURE.md](../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) |
| **Infrastructure Layer** | Compute, DB, cache, search, CDN, CI/CD | [deployment/README.md](../05-development/deployment/README.md) |

### Data Flow

```
Platform Owner → Platform APIs → Tenant context → Core → Business modules → DB
SaaS Tenant User → Tenant-scoped JWT → company_id + tenant_id → Business APIs
```

---

# Platform Layer Modules

| Module | Purpose |
|--------|---------|
| **Tenant Management** | Create, activate, suspend, delete, backup, restore tenants |
| **Subscription Management** | Plans, trials, renewals, upgrades, lifecycle |
| **Plan Management** | Starter, Business, Professional, Enterprise, Custom |
| **Feature Management** | Module-based licensing per plan |
| **Billing Management** | Invoices, cycles, taxes, discounts, credit notes |
| **Payment Management** | Stripe, PayPal, local gateways, manual |
| **License Management** | Entitlements, seat limits, module activation |
| **Usage Metering** | Products, orders, API, email, AI, storage counters |
| **AI Credits** | Credit packages, consumption, recharge, limits |
| **White Label Management** | Domains, logo, theme, emails, login page |
| **Partner Management** | Resellers, commissions, referrals |
| **Marketplace Management** | Apps, plugins, themes, integrations (future) |
| **Platform Analytics** | MRR, ARR, churn, tenant health |

**Detail:** [platform/README.md](../07-saas/README.md)

---

# Tenant Architecture

### Hierarchy

```
Platform (AgainERP SaaS)
└── Tenant (paying SaaS customer / white-label client)
    └── Company (ERP company — 1 or many per tenant)
        └── Branch
            └── Warehouse
```

| Concept | Description |
|---------|-------------|
| **Tenant** | Billing + isolation boundary for SaaS |
| **Company** | ERP data scope (existing `company_id` model) |
| **Single company usage** | Tenant with 1 company |
| **Multi company usage** | Tenant with N companies (plan limit) |

### Isolation Strategies Compared

| Approach | Isolation | Ops Complexity | Migration | Scale 10k tenants |
|----------|-----------|----------------|-----------|-------------------|
| **Shared DB + row-level (`tenant_id`)** | Logical | Low | Single migration | ✅ **Recommended** |
| **Schema per tenant** | Strong | High | N schemas | ⚠️ Migration pain |
| **Database per tenant** | Strongest | Very high | N databases | ⚠️ Cost / ops |

### Recommendation

**Shared PostgreSQL, shared schema, row-level isolation:**

- `platform_tenants.id` → `companies.tenant_id` → all business rows via `company_id`
- Mandatory `tenant_id` on platform tables; business tables use `company_id` (company belongs to tenant)
- PostgreSQL RLS (optional v2) for defense in depth
- Partition large tables by `tenant_id` or `company_id` at scale

**Why:** Aligns with existing [multi-company.md](../05-development/database/multi-company.md) design — no schema rewrite. Single migration pipeline. Cost-efficient to 10k+ tenants.

**Detail:** [platform/TENANT_ARCHITECTURE.md](../07-saas/TENANT_ARCHITECTURE.md)

### Migration Strategy

| Phase | Action |
|-------|--------|
| v1 | Add `tenant_id` to `companies`; backfill single-tenant = one tenant per company |
| v2 | Platform layer tables (`platform_*`) |
| v3 | Usage metering + AI credits |
| v4 | Optional read replicas + partitioning |
| Enterprise | Dedicated DB option (same schema) for single large tenant |

---

# Tenant Management

| Capability | Description |
|------------|-------------|
| **Tenant creation** | Signup → provisioning job → default company + admin user |
| **Activation** | Email verify + trial or paid activation |
| **Suspension** | Past due / abuse — read-only or blocked login |
| **Deletion** | Soft delete → grace → hard purge (GDPR) |
| **Backup** | Per-tenant logical backup snapshot |
| **Restore** | Point-in-time restore to new tenant ID |
| **Branding** | Logo, colors, favicon per tenant |
| **Domains** | `acme.againerp.com` or custom `erp.acme.com` |
| **Storage** | Quota per plan — media + documents |
| **Limits** | Users, companies, branches, products — from plan |

Tables: `platform_tenants`, `platform_tenant_domains`, `platform_tenant_settings`, `platform_tenant_limits`

---

# Subscription Management

| Capability | Description |
|------------|-------------|
| **Plans** | Linked to `platform_plans` |
| **Addons** | Extra seats, storage, AI credits, modules |
| **Trials** | 14/30 day — auto-convert or suspend |
| **Renewals** | Auto-charge before period end |
| **Upgrades** | Immediate proration |
| **Downgrades** | End of period or immediate (config) |
| **Grace period** | X days past due before suspension |
| **Suspension** | Block writes, allow billing portal |
| **Termination** | Cancel at period end or immediate |
| **History** | Full subscription event log |

Lifecycle: `trial → active → past_due → suspended → cancelled → expired`

Integrates: [modules/subscription/ARCHITECTURE.md](../03-business-modules/subscription/ARCHITECTURE.md)

---

# Plan Management

| Plan | Target | Typical Limits |
|------|--------|----------------|
| **Starter** | Small shop | 1 company, 3 users, 1k products, basic modules |
| **Business** | Growing SMB | 3 companies, 15 users, 10k products, marketing |
| **Professional** | Multi-branch | 10 companies, 50 users, 100k products, CRM, reports |
| **Enterprise** | Large org | Unlimited companies/users, all modules, SLA |
| **Custom** | Partner/white-label | Negotiated features + limits |

Tables: `platform_plans`, `platform_plan_features`, `platform_plan_limits`, `platform_plan_prices` (monthly/quarterly/yearly)

---

# Feature Management

Module-based licensing — features enabled/disabled per plan.

| Feature Key | Module |
|-------------|--------|
| `module.catalog` | Catalog |
| `module.orders` | Orders |
| `module.customers` | Customers |
| `module.inventory` | Inventory |
| `module.marketing` | Marketing |
| `module.crm` | CRM |
| `module.accounting` | Accounting |
| `module.ai` | AI OS |
| `module.reports` | Reports |
| `module.builder` | Builder |
| `module.seo` | SEO |
| `module.media` | Media |

Resolution: `FeatureService.isEnabled(tenant, 'module.crm')` — cached in Redis.

UI: Hide menus for disabled modules ([permission-aware-ui.md](../04-uiux/standards/permission-aware-ui.md)).

Tables: `platform_features`, `platform_plan_features`, `platform_tenant_feature_overrides`

---

# Usage Metering

| Metric | Unit | Billing |
|--------|------|---------|
| Products | Count | Soft limit + overage optional |
| Orders | Count/month | Tier included |
| Customers | Count | Tier included |
| Users | Seats | Hard limit |
| Branches | Count | Plan limit |
| Storage | GB | Overage per GB |
| API calls | Per month | Rate limit + overage |
| Emails | Per month | Package |
| SMS / WhatsApp | Per message | Metered |
| AI usage | Credits | See AI Credits |
| Search queries | Per month | Tier |
| Reports | Per month | Tier |
| Exports | Per month | Tier |

### Architecture

```
Business action → Event → Metering Service → platform_usage_logs (append)
Daily rollup → platform_usage_daily → billing job → overage invoice
```

Tables: `platform_usage_logs`, `platform_usage_daily`, `platform_usage_limits`

---

# AI Credits

| Component | Description |
|-----------|-------------|
| **Credit packages** | 1k, 10k, 100k credits |
| **Consumption rules** | Per action type token → credit mapping |
| **Recharge** | Purchase addon or auto-top-up |
| **Limits** | Hard stop or overage when depleted |
| **Reports** | Usage by user, module, action |
| **Forecasting** | Project depletion date |

### Consumption Examples

| Action | Credits |
|--------|---------|
| SEO generation | 10 |
| Blog generation | 50 |
| Analytics query | 5 |
| AI search | 2 |
| AI assistant message | 1–20 (by tokens) |

Integrates: [AI_OS_ARCHITECTURE.md](../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) — check credits before Chief Agent invocation.

Tables: `platform_ai_credit_balances`, `platform_ai_credit_transactions`, `platform_ai_credit_packages`

---

# Billing Management

| Cycle | Description |
|-------|-------------|
| Monthly | Standard |
| Quarterly | Discount |
| Yearly | Discount |
| Lifetime | One-time (partner deals) |
| Custom | Enterprise contracts |

| Artifact | System |
|----------|--------|
| Invoices | `platform_invoices` → Accounting sync |
| Taxes | Core tax engine per tenant region |
| Discounts | Coupon / partner code |
| Refunds | Credit note + payment reversal |
| Credit notes | Apply to next invoice |

---

# Payment Management

| Gateway | Region | Use |
|---------|--------|-----|
| **Stripe** | Global | Primary SaaS billing |
| **PayPal** | Global | Alternative |
| **Paddle** | Global | Merchant of record option |
| **SSLCommerz** | Bangladesh | Local cards |
| **bKash** | Bangladesh | Mobile wallet |
| **Nagad** | Bangladesh | Mobile wallet |
| **Rocket** | Bangladesh | Mobile wallet |
| **Manual** | Any | Bank transfer, enterprise |

### Architecture

```
Payment webhook → Payment Service → validate signature
  → update platform_payments
  → extend subscription
  → Accounting journal (platform revenue)
  → notify tenant admin
```

Tables: `platform_payment_gateways`, `platform_payments`, `platform_payment_methods` (tokenized)

PCI: No raw card storage — gateway tokens only.

---

# White Label Management

| Capability | Spec |
|------------|------|
| Custom domains | CNAME → tenant routing |
| Custom logo | Admin + login + emails |
| Custom theme | CSS variables override |
| Custom colors | `--color-primary` per tenant |
| Custom emails | SMTP or template override |
| Custom branding | Remove "Powered by AgainERP" (plan flag) |
| Custom login page | Background, logo, text |
| Mobile app branding | Future — app config API |

Tables: `platform_white_labels`, `platform_tenant_domains`

---

# Partner Management

| Type | Model |
|------|-------|
| **Resellers** | Sell subscriptions, manage sub-tenants |
| **Agencies** | Implement + bill client |
| **Partners** | Referral + commission |
| **Commissions** | % of MRR for N months |
| **Referrals** | Code tracking → attribution |
| **Revenue sharing** | Split on marketplace sales (future) |

Tables: `platform_partners`, `platform_partner_commissions`, `platform_referrals`

Partner portal: separate admin scope — see own tenants + commissions.

---

# Marketplace Management (Future)

| Marketplace | Content |
|-------------|---------|
| **App marketplace** | Third-party modules |
| **Plugin marketplace** | Integrations |
| **Theme marketplace** | Storefront themes |
| **AI marketplace** | Agent packs, prompt templates |
| **Integration marketplace** | Shopify sync, etc. |

Architecture: [modules/marketplace/ARCHITECTURE.md](../03-business-modules/marketplace/ARCHITECTURE.md)

Tables: `platform_marketplace_apps`, `platform_marketplace_installs`

Install flow: tenant installs → feature flag + manifest registration → billing addon.

---

# Platform Analytics

| Metric | Source |
|--------|--------|
| **MRR** | Active subscriptions × monthly normalized price |
| **ARR** | MRR × 12 |
| **Revenue** | `platform_payments` sum |
| **Renewals** | Renewal rate |
| **Churn** | Cancelled MRR / start MRR |
| **Growth** | New MRR - churn |
| **AI usage** | `platform_ai_credit_transactions` |
| **Storage usage** | Aggregated per tenant |
| **Tenant health** | Usage trend, payment failures, support tickets |
| **Platform health** | Infra metrics, error rates |

Tables: `platform_analytics_daily`, `platform_analytics_mrr_snapshots`

Platform Owner Dashboard — see below.

---

# AI Platform Integration

| Integration | Description |
|-------------|-------------|
| **Chief AI Agent** | Credit check before plan execution |
| **AI Agents** | Tenant-scoped context only |
| **AI Automations** | Plan feature `module.ai` + credit budget |
| **AI Credits** | Deduct on tool invocation |
| **AI Permissions** | `ai.*` + plan feature gate |
| **AI Monitoring** | Per-tenant usage in platform dashboard |
| **AI Analytics** | Cost per tenant, popular actions |

```
User AI request
  → FeatureService: module.ai enabled?
  → CreditService: balance sufficient?
  → AI OS (tenant-scoped context)
  → Deduct credits on completion
  → platform_ai_credit_transactions
```

---

# Security Architecture

| Domain | Control |
|--------|---------|
| **Tenant isolation** | `tenant_id` + `company_id` on all queries |
| **Data security** | Encryption at rest (DB), TLS in transit |
| **Billing security** | PCI via gateways, no card storage |
| **API security** | JWT with tenant claim, rate limits per plan |
| **AI security** | No cross-tenant context; audit all actions |
| **RBAC** | Platform admin vs tenant admin vs user |

Platform admins: separate auth realm — cannot access tenant business data without audited impersonation.

---

# Database Architecture

**Prefix:** `platform_*` (SaaS platform) · `subscription_*` (module alias/sync) · business tables use `company_id`

| Domain | Tables |
|--------|--------|
| Tenants | `platform_tenants`, `platform_tenant_domains`, `platform_tenant_settings` |
| Plans | `platform_plans`, `platform_plan_features`, `platform_plan_limits` |
| Subscriptions | `platform_subscriptions`, `platform_subscription_items`, `platform_subscription_events` |
| Billing | `platform_invoices`, `platform_invoice_lines`, `platform_credit_notes` |
| Payments | `platform_payments`, `platform_payment_methods` |
| Usage | `platform_usage_logs`, `platform_usage_daily` |
| AI Credits | `platform_ai_credit_balances`, `platform_ai_credit_transactions` |
| Features | `platform_features`, `platform_tenant_feature_overrides` |
| White label | `platform_white_labels` |
| Partners | `platform_partners`, `platform_partner_commissions` |
| Marketplace | `platform_marketplace_apps`, `platform_marketplace_installs` |
| Analytics | `platform_analytics_daily`, `platform_analytics_mrr_snapshots` |

**ER diagrams:** [platform/SAAS_ER_DIAGRAM.md](../07-saas/SAAS_ER_DIAGRAM.md)

---

# API Architecture

**Base:** `/api/v1/platform/` (platform owner) · `/api/v1/tenant/` (tenant admin billing portal)

| API Group | Endpoints |
|-----------|-----------|
| **Tenant** | CRUD tenants, suspend, domains |
| **Subscription** | Plans, subscribe, upgrade, cancel |
| **Billing** | Invoices, download PDF |
| **Feature** | List entitlements, overrides |
| **Usage** | Current usage, history |
| **AI** | Credit balance, purchase, usage report |
| **Marketplace** | Browse, install apps |

| Standard | Rule |
|----------|------|
| Versioning | `/api/v1/` |
| Auth | Platform JWT vs Tenant JWT |
| Permissions | `platform.*` vs `tenant.billing.*` |
| Rate limits | Per plan tier |

Detail: [api/architecture.md](../05-development/api/architecture.md)

---

# Workflow Architecture

| Workflow | Steps |
|----------|-------|
| **New tenant signup** | Register → verify email → provision tenant → trial start |
| **Trial activation** | Auto on verify or payment method on file |
| **Subscription purchase** | Select plan → payment → activate entitlements |
| **Renewal** | Cron → invoice → charge → extend period |
| **Upgrade** | Prorate → charge diff → update limits immediately |
| **Downgrade** | Schedule at period end → reduce limits |
| **Suspension** | Past due → grace → block writes |
| **Termination** | Cancel → export offer → soft delete schedule |
| **AI credit purchase** | Addon → payment → credit balance += |

Uses Core Workflow + Approval for enterprise custom deals.

---

# Platform Owner Dashboard

Super-admin console (separate from tenant ERP).

| Widget | Content |
|--------|---------|
| **Tenant overview** | Active, trial, suspended counts |
| **Revenue overview** | MRR, ARR, today collections |
| **Usage overview** | Top tenants by storage, API |
| **AI usage overview** | Credits consumed, cost |
| **Billing overview** | Past due, failed payments |
| **Support overview** | Open platform tickets |
| **Marketplace overview** | Installs, revenue share |
| **System health** | DB, queue, error rate |

Route: `platform.againerp.com/admin` — not in tenant menu tree.

---

# Scaling Strategy

| Phase | Infra | Tenants |
|-------|-------|---------|
| **1 — cPanel** | Shared hosting, single DB | 1–50 |
| **2 — VPS** | Dedicated VPS, PostgreSQL + Redis | 50–500 |
| **3 — Docker** | Compose stack, horizontal workers | 500–2k |
| **4 — Kubernetes** | K8s, auto-scale, read replicas | 2k–10k+ |
| **5 — Multi-region** | Regional DB + CDN, geo routing | Global |

**Detail:** [platform/SCALING_ROADMAP.md](../07-saas/SCALING_ROADMAP.md) · [deployment/README.md](../05-development/deployment/README.md)

Migration path: same application binary — infra scales underneath. Tenant isolation model unchanged.

---

# Future Vision

Architecture supports **without platform redesign:**

| Capability | How |
|------------|-----|
| Full ERP | Business layer modules + feature flags |
| CRM / Accounting | Plan features |
| Inventory / Marketplace | Module + marketplace install |
| AI Operating System | AI layer + credits |
| Developer Agent | Phase 5 AI — tenant-scoped or platform |
| White label SaaS | Partner creates sub-tenants |
| App marketplace | `platform_marketplace_*` |

---

## Document Map

| Document | Topic |
|----------|-------|
| [platform/TENANT_ARCHITECTURE.md](../07-saas/TENANT_ARCHITECTURE.md) | Isolation strategy deep dive |
| [platform/SAAS_ER_DIAGRAM.md](../07-saas/SAAS_ER_DIAGRAM.md) | ER diagrams |
| [platform/SCALING_ROADMAP.md](../07-saas/SCALING_ROADMAP.md) | Infra phases |
| [modules/subscription/ARCHITECTURE.md](../03-business-modules/subscription/ARCHITECTURE.md) | Subscription module |
| [modules/ai/AI_OS_ARCHITECTURE.md](../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) | AI integration |

---

**Platform:** AgainERP SaaS  
**Last Updated:** 2026-06-12  
**Maintainer:** Platform Architecture Team
