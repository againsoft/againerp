# AgainERP — Platform Layer Documentation

> **Status:** Draft  
> **Master:** [HYBRID_LICENSED_ERP_ARCHITECTURE.md](../HYBRID_LICENSED_ERP_ARCHITECTURE.md) · [SAAS_PLATFORM_ARCHITECTURE.md](../SAAS_PLATFORM_ARCHITECTURE.md)

Platform architecture — hybrid licensed ERP, SaaS, tenants, subscriptions, billing, metering, white label, partners.

---

## Documents

| Document | Topic |
|----------|-------|
| [**HYBRID_LICENSED_ERP_ARCHITECTURE.md**](../HYBRID_LICENSED_ERP_ARCHITECTURE.md) | **Canonical** — hybrid licensed ERP (SaaS + hybrid + enterprise) |
| [**SAAS_PLATFORM_ARCHITECTURE.md**](../SAAS_PLATFORM_ARCHITECTURE.md) | Full SaaS platform design |
| [CLOUD_CONTROL_PLANE.md](./CLOUD_CONTROL_PLANE.md) | License, AI OS, marketplace, updates, security |
| [HYBRID_DEPLOYMENT.md](./HYBRID_DEPLOYMENT.md) | Deployment modes comparison |
| [LICENSE_AND_SYNC_AGENTS.md](./LICENSE_AND_SYNC_AGENTS.md) | Client-side agents |
| [DATA_OWNERSHIP.md](./DATA_OWNERSHIP.md) | Client data vs platform IP |
| [TENANT_ARCHITECTURE.md](./TENANT_ARCHITECTURE.md) | Isolation strategy, provisioning, domains |
| [SAAS_ER_DIAGRAM.md](./SAAS_ER_DIAGRAM.md) | Platform ER diagrams |
| [SCALING_ROADMAP.md](./SCALING_ROADMAP.md) | cPanel → K8s → multi-region |

---

## Related Modules

| Module | Document |
|--------|----------|
| Subscription | [modules/subscription/ARCHITECTURE.md](../modules/subscription/ARCHITECTURE.md) |
| Marketplace | [modules/marketplace/ARCHITECTURE.md](../modules/marketplace/ARCHITECTURE.md) |
| AI OS | [modules/ai/AI_OS_ARCHITECTURE.md](../modules/ai/AI_OS_ARCHITECTURE.md) |
| Multi-company | [database/multi-company.md](../database/multi-company.md) |

---

## Platform vs Tenant vs Company

| Level | Who | Example |
|-------|-----|---------|
| **Platform** | AgainERP operator | Platform owner dashboard |
| **Tenant** | Paying SaaS customer | Acme Corp subscription |
| **Company** | ERP company inside tenant | Acme Retail, Acme Wholesale |

---

**Last Updated:** 2026-06-12
