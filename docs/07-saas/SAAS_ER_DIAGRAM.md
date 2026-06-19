# SaaS Platform — ER Diagrams

## Purpose
SaaS platform documentation: SAAS_ER_DIAGRAM.

## When To Read
Read only when working on multi-tenant SaaS, billing, or hybrid deployment.

## Related Files
- [Tenant architecture](TENANT_ARCHITECTURE.md)
- [SaaS platform arch](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md)

## Read Next
- [Platform architecture](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md)

---

> **Status:** Draft  
> **Parent:** [SAAS_PLATFORM_ARCHITECTURE.md](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md)  
> **DBMS:** PostgreSQL

---


## When To Read
Read only when working on multi-tenant SaaS, billing, or hybrid deployment.

## Related Files
- [Tenant architecture](TENANT_ARCHITECTURE.md)
- [SaaS platform arch](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md)

## Read Next
- [Platform architecture](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md)

---

## Platform Core

```mermaid
erDiagram
    platform_tenants ||--o{ platform_tenant_domains : has
    platform_tenants ||--o{ platform_subscriptions : has
    platform_tenants ||--o{ companies : owns
    platform_tenants ||--|| platform_white_labels : branding
    platform_tenants ||--o{ platform_ai_credit_balances : has

    platform_plans ||--o{ platform_plan_features : includes
    platform_plans ||--o{ platform_plan_limits : defines
    platform_plans ||--o{ platform_subscriptions : subscribed_via

    platform_subscriptions ||--o{ platform_subscription_items : addons
    platform_subscriptions ||--o{ platform_subscription_events : logs

    companies ||--o{ users : employs
    companies ||--o{ contacts : owns
```

---

## Billing & Payments

```mermaid
erDiagram
    platform_tenants ||--o{ platform_invoices : billed
    platform_invoices ||--o{ platform_invoice_lines : contains
    platform_invoices ||--o{ platform_payments : paid_by
    platform_payments }o--|| platform_payment_methods : uses
    platform_invoices ||--o{ platform_credit_notes : adjusted_by

    platform_tenants ||--o{ platform_usage_logs : meters
    platform_usage_logs }o--|| platform_features : tracks
```

---

## Features & Entitlements

```mermaid
erDiagram
    platform_features ||--o{ platform_plan_features : in_plan
    platform_plans ||--o{ platform_plan_features : grants
    platform_tenants ||--o{ platform_tenant_feature_overrides : custom
    platform_subscriptions ||--|| platform_entitlements_cache : resolves
```

---

## Partners & Marketplace

```mermaid
erDiagram
    platform_partners ||--o{ platform_tenants : manages
    platform_partners ||--o{ platform_partner_commissions : earns
    platform_referrals }o--|| platform_partners : attributed

    platform_marketplace_apps ||--o{ platform_marketplace_installs : installed
    platform_tenants ||--o{ platform_marketplace_installs : has
```

---

## AI Credits

```mermaid
erDiagram
    platform_tenants ||--|| platform_ai_credit_balances : balance
    platform_ai_credit_balances ||--o{ platform_ai_credit_transactions : logs
    platform_ai_credit_packages ||--o{ platform_ai_credit_transactions : purchased_via
    platform_ai_credit_transactions }o--o| ai_audit_logs : links
```

---

## Analytics

```mermaid
erDiagram
    platform_analytics_daily }o--|| platform_tenants : per_tenant
    platform_analytics_mrr_snapshots }o--|| platform_tenants : snapshot
```

---

## Link to Business Layer

```
platform_tenants
  └── companies (tenant_id)
        └── catalog_products (company_id)
        └── commerce_orders (company_id)
        └── inventory_* (company_id)
```

Business tables **never** store `tenant_id` directly — resolve via `company.tenant_id` or session context.

---

Full platform schema: [SAAS_PLATFORM_ARCHITECTURE.md](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md) § Database Architecture
