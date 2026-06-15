# Hybrid Deployment Modes

> **Parent:** [HYBRID_LICENSED_ERP_ARCHITECTURE.md](../HYBRID_LICENSED_ERP_ARCHITECTURE.md)

---

## Mode Comparison

| Component | SaaS | Hybrid | Enterprise |
|-----------|------|--------|------------|
| Next.js UI | Cloud CDN | **Client** | **Client** |
| FastAPI runtime | Cloud | **Client** | **Client** |
| PostgreSQL | Cloud (tenant DB) | **Client** | **Client** |
| Media storage | Cloud | **Client** | **Client** |
| Redis / queue | Cloud | **Client** | **Client** |
| Meilisearch | Cloud | **Client** (optional cloud) | **Client** |
| License Server | Cloud | Cloud | Cloud |
| Subscription | Cloud | Cloud | Cloud |
| AI OS | Cloud | Cloud | Cloud |
| Marketplace backend | Cloud | Cloud | Cloud |
| Update Server | Cloud | Cloud | Cloud |
| Security Center | Cloud | Cloud | Cloud |
| Analytics Hub | Cloud | Cloud (opt-in) | Cloud (opt-in) |
| Control Center | Cloud | Cloud | Cloud |

---

## Mode 1 — SaaS

```
User Browser → AgainERP Cloud (all layers)
```

- Fastest onboarding  
- AgainERP operates infrastructure  
- Tenant data in AgainERP-managed PostgreSQL (isolated by `tenant_id`)  
- Full platform features including AI  

Doc: [SAAS_PLATFORM_ARCHITECTURE.md](../SAAS_PLATFORM_ARCHITECTURE.md)

---

## Mode 2 — Hybrid (Recommended Enterprise)

```
User → Client Network (UI + API + DB + Media)
         ↕ mTLS
       AgainERP Cloud (License + AI + Marketplace + Updates)
```

**Best for:** Data sovereignty, on-prem compliance, low-latency local ops.

- Client owns all business data at rest  
- Cloud owns intelligence and licensing  
- Offline-capable business operations  
- AI via secure API proxy  

---

## Mode 3 — Enterprise Self-Hosted

Same as Hybrid with maximum client control:

- Client manages own infrastructure end-to-end  
- Only mandatory cloud touchpoints: License, AI OS, Marketplace, Updates  
- Optional: disable Analytics Hub  

---

## White Label (Overlay)

Applies to **any mode**:

| Setting | Storage |
|---------|---------|
| Custom domain | DNS + platform config |
| Logo, colors, login | `platform_white_label` / client config |
| Email templates | Client-branded |
| Hide AgainERP branding | Plan entitlement |

Business data still client-owned in hybrid/enterprise.

---

## Instance Identity

Each client deployment registers:

| Field | Purpose |
|-------|---------|
| `instance_id` | Unique install fingerprint |
| `tenant_id` | Billing entity |
| `deployment_mode` | saas \| hybrid \| enterprise |
| `public_key` | Verify agent requests |

---

## Network Requirements

| Direction | Port | Protocol |
|-----------|------|----------|
| Client → Cloud | 443 | HTTPS / mTLS |
| Cloud → Client | — | **No inbound required** (agent pull model) |

---

## Choosing a Mode

| Requirement | Recommended |
|-------------|-------------|
| Fast start, no IT team | SaaS |
| Data must stay on-prem | Hybrid / Enterprise |
| Regulated industry (health, finance) | Hybrid |
| Full white label reseller | SaaS or Hybrid + white label |
| Air-gapped with periodic sync | Enterprise + sync window |
