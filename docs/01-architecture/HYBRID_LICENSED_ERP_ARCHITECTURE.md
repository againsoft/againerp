# AgainERP — Hybrid Licensed ERP Architecture

> **Document Type:** Enterprise Architecture  
> **Status:** Core Architecture  
> **Priority:** Critical  
> **Governance:** [GOVERNANCE.md](../00-foundation/GOVERNANCE.md) · [TECHNOLOGY_CONSTITUTION.md](../00-foundation/TECHNOLOGY_CONSTITUTION.md)

## Purpose
Hybrid licensed ERP deployment model.

## When To Read
Read only when working on on-prem, hybrid, or license-sync deployment.

## Related Files
- [SaaS platform](SAAS_PLATFORM_ARCHITECTURE.md)

## Read Next
- [Hybrid deployment](../07-saas/HYBRID_DEPLOYMENT.md)

---

**No code. No migrations.**  
Canonical architecture for self-hosted, hybrid, white-label, and SaaS deployments with IP protection.

---

## Objective

Design AgainERP as a **Hybrid Licensed ERP Platform** supporting:

| Deployment | Description |
|------------|-------------|
| **SaaS** | Fully hosted by AgainERP |
| **Hybrid** | Client hosts runtime + data; cloud hosts intelligence |
| **Enterprise (self-hosted)** | Client hosts runtime + data; cloud owns license, AI, marketplace, updates |
| **White label** | Branded client experience; platform internals hidden |

While protecting:

- Source code & intellectual property  
- AI OS  
- Marketplace  
- Subscription revenue  
- Platform ownership  

**Related:** [SAAS_PLATFORM_ARCHITECTURE.md](SAAS_PLATFORM_ARCHITECTURE.md) · [UNIVERSAL_MODULE_FRAMEWORK.md](../00-foundation/UNIVERSAL_MODULE_FRAMEWORK.md)

---

## Final Rule

| Client owns | AgainERP owns |
|-------------|---------------|
| Business data | License system |
| Database | AI OS |
| Media & documents | Marketplace backend |
| Local configuration | Update infrastructure |
| Customer, order, product, financial data | Subscription & billing logic |
| | Security center & tamper detection |
| | Platform analytics (anonymous, policy-gated) |

**Business runtime can operate locally. Platform intelligence remains under AgainERP control.**

This separation is **mandatory** and must never be violated.

---

## Core Principle

```
┌─────────────────────────────────────┐     ┌─────────────────────────────────────┐
│         CLIENT INSTANCE              │     │         AGAINERP CLOUD               │
│  Data · Runtime · Media · Extensions │◄───►│  License · AI · Marketplace · Updates │
└─────────────────────────────────────┘     └─────────────────────────────────────┘
         Secure Communication Layer (mTLS, signed tokens, audit)
```

---

## Architecture Overview

```
AgainERP Cloud
├── Control Center          → Platform admin
├── License Server          → Activation, validation, renewal
├── Subscription Manager    → Plans, billing, trials, AI credits
├── Feature Manager         → Module/feature entitlements
├── Marketplace             → Apps, modules, themes, AI agents
├── AI OS                   → Chief Agent, engines (cloud-only)
├── Update Server           → Versions, patches, rollback
├── Security Center         → Tamper, anomaly, threat monitoring
├── Analytics Hub           → Anonymous usage (policy-gated)
└── Monitoring Center       → Health, agents, license status

                    ↓ Secure Communication Layer

Client Instance
├── Next.js UI              → apps/web (tenant-branded)
├── Local Runtime           → apps/api (FastAPI modular monolith)
├── PostgreSQL              → Tenant-owned database
├── Media Storage           → MinIO / local / S3-compatible
├── Custom Modules          → Licensed extensions
├── Sync Agent              → Cloud sync when online
└── License Agent           → Token refresh, offline grace
```

**Detail:** [platform/CLOUD_CONTROL_PLANE.md](../07-saas/CLOUD_CONTROL_PLANE.md) · [platform/HYBRID_DEPLOYMENT.md](../07-saas/HYBRID_DEPLOYMENT.md)

---

## Deployment Modes

| Mode | Client hosts | AgainERP cloud hosts |
|------|--------------|----------------------|
| **1 — SaaS** | Nothing (browser only) | Everything |
| **2 — Hybrid** | UI runtime, API, DB, media | License, AI OS, marketplace, updates, security, analytics |
| **3 — Enterprise** | UI, API, DB, media, most config | License, marketplace, AI OS, update infra only |

**Matrix:** [platform/HYBRID_DEPLOYMENT.md](../07-saas/HYBRID_DEPLOYMENT.md)

---

## Cloud Components (Summary)

| Component | Responsibility |
|-----------|----------------|
| **Control Center** | Clients, subscriptions, licenses, updates, modules, marketplace, AI usage, monitoring |
| **License Server** | Activation, validation, feature/tenant/module/renewal checks |
| **Subscription Manager** | Plans, billing, renewals, trials, addons, AI credits, usage limits |
| **Feature Manager** | Enable/disable modules, features, AI functions, marketplace apps per plan |
| **Marketplace** | Apps, plugins, themes, industry modules, AI agents, connectors |
| **AI OS** | Chief Agent, orchestrator, memory, knowledge, automation — **never leaves cloud** |
| **Update Server** | Major/minor/patch/security/hotfix distribution, staged rollout, rollback |
| **Security Center** | License security, tamper detection, anomaly, access/threat monitoring |
| **Analytics Hub** | Anonymous usage, performance, AI, module metrics (tenant policy) |
| **Monitoring Center** | License, subscription, update, agent, health status |

---

## Client Runtime

| Component | Location | Offline-capable |
|-----------|----------|-----------------|
| Next.js UI | Client | Partial (cached UI) |
| FastAPI business logic | Client | **Yes** — critical paths |
| PostgreSQL | Client | **Yes** |
| Media storage | Client | **Yes** |
| Local workflows & reports | Client | **Yes** |
| License Agent | Client | Grace period validation |
| Sync Agent | Client | Queues until online |

**Rule:** Orders, inventory, customers, products, basic reports and workflows **must work offline**. Sync when connectivity returns.

---

## Agents

### License Agent (client-side)

| Responsibility |
|----------------|
| License verification |
| JWT / feature token refresh |
| Subscription validation |
| Grace period & offline validation |
| Tamper report to Security Center |

### Sync Agent (client-side)

| Responsibility |
|----------------|
| License & feature sync |
| Update manifest sync |
| Marketplace catalog sync |
| AI request proxy queue |
| Configuration sync |

**Detail:** [platform/LICENSE_AND_SYNC_AGENTS.md](../07-saas/LICENSE_AND_SYNC_AGENTS.md)

---

## Data Ownership

| Asset | Owner | Stored where |
|-------|-------|--------------|
| Database | **Client** | Client PostgreSQL |
| Media, attachments, documents | **Client** | Client storage |
| Reports, exports | **Client** | Client |
| Customer, order, product, inventory, financial data | **Client** | Client DB |
| License records, subscription state | **AgainERP** | Cloud (metadata only) |
| AI conversations, tool audit | **AgainERP** | Cloud (no raw tenant DB) |
| Anonymous usage metrics | **AgainERP** | Cloud (opt-in) |

AgainERP **does not require** storing tenant business data for hybrid/enterprise modes.

**Detail:** [platform/DATA_OWNERSHIP.md](../07-saas/DATA_OWNERSHIP.md)

---

## Intellectual Property Protection

**Never delivered to client:**

| Protected asset |
|-----------------|
| AI OS source code |
| Marketplace backend |
| License server code |
| Subscription & billing engine |
| Security & tamper engine |
| Update distribution infrastructure |
| Platform analytics engine |

Client receives: **runtime binaries/images**, **signed modules**, **API contracts**, **obfuscated or compiled agents** — not platform source.

---

## Module Distribution

All modules via **Marketplace**:

1. License validation  
2. Version validation  
3. Compatibility validation (platform semver)  
4. Permission validation  
5. Cryptographic module signature verification  

Industry modules (Hospital, School, Restaurant, …) installable and removable per [UNIVERSAL_MODULE_FRAMEWORK.md](../00-foundation/UNIVERSAL_MODULE_FRAMEWORK.md).

---

## Security Architecture

| Mechanism | Use |
|-----------|-----|
| JWT + refresh tokens | API auth |
| Signed license tokens | Entitlements |
| Feature tokens | Per-module/feature gates |
| Module signatures | Marketplace integrity |
| mTLS | Agent ↔ cloud |
| Audit logs | All license & AI actions |
| Tamper detection | Runtime/module bypass attempts |

### Tamper detection targets

- Modified runtime  
- Modified modules  
- Unauthorized features  
- License bypass  
- Marketplace bypass  

### AI security (unchanged)

```
AI Request → Permission Layer → Service Layer → Business APIs → Database
```

AI **never** accesses tenant databases directly. All actions audited.

**AI OS remains cloud-exclusive.** Client consumes AI via secure APIs only. Models not deployed to client by default.

---

## Update Architecture

| Type | Description |
|------|-------------|
| Major | Breaking; migration required |
| Minor | Features; backward compatible |
| Patch | Bug fixes |
| Security | Mandatory priority |
| Hotfix | Critical production |

Staged rollout: canary tenants → percentage → full. Rollback supported.

---

## White Label Architecture

| Capability | Client-visible |
|------------|----------------|
| Custom domain | Yes |
| Custom branding, login, theme | Yes |
| Custom emails & mobile branding | Yes |
| Platform internals, license server, AI OS | **No** |

Doc: [SAAS_PLATFORM_ARCHITECTURE.md](SAAS_PLATFORM_ARCHITECTURE.md) white-label section.

---

## Revenue Protection

| Revenue stream | Protection mechanism |
|----------------|---------------------|
| Subscription | License agent + feature tokens |
| Marketplace | Signed modules + marketplace API |
| AI credits | Cloud-only AI OS + metering |
| Module sales | Per-module license keys |
| Support | Entitlement-gated support portal |

No deployment model may allow easy removal of licensing controls.

---

## Disaster Recovery

| Failure | Mitigation |
|---------|------------|
| Cloud outage | Client offline operation + grace period |
| Client outage | Client DR; cloud retains license state |
| Database failure | Client backup/restore |
| License server failure | Cached tokens + offline grace |
| Network partition | Sync agent queues; business continues |

---

## Offline Strategy

| Function | Offline |
|----------|---------|
| Create/edit orders | ✅ |
| Inventory adjustments | ✅ |
| Customer & product CRUD | ✅ |
| Local reports | ✅ |
| Basic workflows | ✅ |
| AI features | ❌ (queued) |
| Marketplace install | ❌ (queued) |
| License renewal | Grace period only |

---

## Future Expansion

Architecture supports without redesign:

- AI-native ERP · Developer agents · Code intelligence  
- App marketplace growth · Industry solutions  
- Global SaaS expansion  

---

## Document Map

| Document | Topic |
|----------|-------|
| [platform/CLOUD_CONTROL_PLANE.md](../07-saas/CLOUD_CONTROL_PLANE.md) | Cloud services deep-dive |
| [platform/HYBRID_DEPLOYMENT.md](../07-saas/HYBRID_DEPLOYMENT.md) | Deployment modes matrix |
| [platform/LICENSE_AND_SYNC_AGENTS.md](../07-saas/LICENSE_AND_SYNC_AGENTS.md) | Client agents |
| [platform/DATA_OWNERSHIP.md](../07-saas/DATA_OWNERSHIP.md) | Data vs IP |
| [SAAS_PLATFORM_ARCHITECTURE.md](SAAS_PLATFORM_ARCHITECTURE.md) | SaaS mode |
| [modules/ai/AI_OS_ARCHITECTURE.md](../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) | AI OS cloud model |
| [adr/ADR-013-hybrid-licensed-erp.md](decisions/ADR-013-hybrid-licensed-erp.md) | ADR |

---

**Platform:** AgainERP  
**Last Updated:** 2026-06-12  
**Maintainer:** Platform Architecture Team
