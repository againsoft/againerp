# AgainERP Cloud Control Plane

> **Parent:** [HYBRID_LICENSED_ERP_ARCHITECTURE.md](../HYBRID_LICENSED_ERP_ARCHITECTURE.md)

---

## Control Center

Platform administration panel for AgainERP operators.

| Manage | API prefix (planned) |
|--------|---------------------|
| Clients / tenants | `/api/v1/platform/tenants` |
| Subscriptions | `/api/v1/platform/subscriptions` |
| Licenses | `/api/v1/platform/licenses` |
| Updates | `/api/v1/platform/updates` |
| Modules | `/api/v1/platform/modules` |
| Marketplace | `/api/v1/marketplace/` |
| AI usage | `/api/v1/platform/ai-usage` |
| Monitoring | `/api/v1/platform/health` |

**UI prototype:** [ui-prototype/platform/](../ui-prototype/platform/)

---

## License Server

| Operation | Flow |
|-----------|------|
| **Activation** | Client submits install key → signed license bundle |
| **Validation** | License Agent heartbeat every N hours |
| **Feature validation** | Feature token embedded in JWT claims |
| **Tenant validation** | `tenant_id` + `instance_id` binding |
| **Module validation** | Per-module entitlement in license payload |
| **Renewal** | Subscription Manager triggers new license period |

### License payload (conceptual)

```json
{
  "tenant_id": "ten_xxx",
  "instance_id": "inst_xxx",
  "plan": "enterprise",
  "modules": ["ecommerce", "crm", "hospital"],
  "features": ["ai.chat", "marketplace.install"],
  "seats": 50,
  "expires_at": "2027-06-12T00:00:00Z",
  "grace_days": 14,
  "signature": "..."
}
```

---

## Subscription Manager

| Entity | Purpose |
|--------|---------|
| Plans | Starter, Business, Professional, Enterprise, Custom |
| Billing cycles | Monthly, annual |
| Trials | Time-boxed entitlements |
| Addons | Extra seats, modules, AI credits |
| AI credits | Metered per [modules/ai/AI_OS_ARCHITECTURE.md](../modules/ai/AI_OS_ARCHITECTURE.md) |
| Usage limits | API rate, storage, seats |

Doc: [modules/subscription/ARCHITECTURE.md](../modules/subscription/ARCHITECTURE.md)

---

## Feature Manager

Evaluates entitlements before:

- Module install  
- Menu visibility  
- API route access  
- AI tool invocation  

Synced to client via License Agent → local feature cache.

---

## Marketplace

| Asset type | Distribution |
|------------|--------------|
| ERP modules | Signed package + license check |
| Industry modules | Same |
| Themes | Signed asset bundle |
| Widgets / connectors | Versioned manifest |
| AI agents | Cloud-registered; API-only execution |

Doc: [modules/marketplace/ARCHITECTURE.md](../modules/marketplace/ARCHITECTURE.md)

---

## AI OS (Cloud-Only)

| Rule | Detail |
|------|--------|
| Location | AgainERP cloud only |
| Client access | HTTPS API + signed requests |
| Data | Context via business APIs — never direct DB |
| Models | Not deployed to client by default |

Components: Chief Agent, Orchestrator, Memory, Knowledge, Automation, Developer Agent, Analytics Agent, Support Agent.

---

## Update Server

| Stage | Action |
|-------|--------|
| 1 | Publish version manifest |
| 2 | Sign artifacts |
| 3 | Sync Agent polls manifest |
| 4 | Staged rollout per tenant tier |
| 5 | Client applies update |
| 6 | Rollback on failure report |

---

## Security Center

| Capability | Target |
|------------|--------|
| License security | Invalid signature, replay |
| Tamper detection | Modified runtime/modules |
| Anomaly detection | Usage spikes, bypass patterns |
| Access monitoring | Failed auth, privilege escalation |
| Threat monitoring | Known attack signatures |

Reports from License Agent → Security Center dashboard.

---

## Analytics Hub

| Metric | PII |
|--------|-----|
| Module usage counts | No |
| Performance percentiles | No |
| AI credit consumption | Tenant ID only |
| Error rates | No |

Requires tenant policy opt-in for hybrid/enterprise.

---

## Monitoring Center

| Monitor | Alert |
|---------|-------|
| License status | Expiring, grace, revoked |
| Subscription | Payment failed |
| Update | Failed apply, version drift |
| Agent | Sync Agent offline > 24h |
| Health | Client heartbeat missing |
