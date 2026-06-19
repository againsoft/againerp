# License Agent & Sync Agent

> **Parent:** [HYBRID_LICENSED_ERP_ARCHITECTURE.md](../01-architecture/HYBRID_LICENSED_ERP_ARCHITECTURE.md)

---
## Purpose
SaaS platform documentation: LICENSE_AND_SYNC_AGENTS.

## When To Read
Read only when working on multi-tenant SaaS, billing, or hybrid deployment.

## Related Files
- [Tenant architecture](TENANT_ARCHITECTURE.md)
- [SaaS platform arch](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md)

## Read Next
- [Platform architecture](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md)

---


## When To Read
Read only when working on multi-tenant SaaS, billing, or hybrid deployment.

## Related Files
- [Tenant architecture](TENANT_ARCHITECTURE.md)
- [SaaS platform arch](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md)

## Read Next
- [Platform architecture](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md)

---

## License Agent (Client)

Runs as sidecar service or embedded daemon with client runtime.

### Responsibilities

| Task | Frequency |
|------|-----------|
| License verification | Startup + every 6h |
| Token refresh | Before JWT expiry |
| Feature validation | Per API request (local cache) |
| Subscription validation | Daily |
| Grace period | After `expires_at` for `grace_days` |
| Offline validation | Cryptographic check of cached license |
| Tamper report | On integrity failure → Security Center |

### Offline grace flow

```
1. License valid + cached signature OK → full operation
2. Expired but within grace_days → operation + warning banner
3. Grace exceeded → read-only mode (reports, view)
4. Revoked / tampered → lock admin features, contact support
```

### Local cache

| File / table | Content |
|--------------|---------|
| `license.bundle` | Signed license JSON |
| `feature_cache` | Enabled modules/features |
| `last_sync_at` | Timestamp |

**Never store:** AgainERP platform secrets, AI model weights, marketplace backend keys.

---

## Sync Agent (Client)

### Sync channels

| Channel | Direction | Offline queue |
|---------|-----------|---------------|
| License sync | Cloud → Client | No |
| Feature sync | Cloud → Client | No |
| Update manifest | Cloud → Client | Yes |
| Marketplace catalog | Cloud → Client | Yes |
| AI requests | Client → Cloud | Yes |
| Config (non-secret) | Bidirectional | Yes |
| Anonymous analytics | Client → Cloud | Yes (opt-in) |

### AI request queue

When offline:

1. User triggers AI action  
2. UI shows "queued" state  
3. Sync Agent stores request in `ai_sync_queue`  
4. On reconnect → proxy to AI OS → return result  

---

## Secure communication

| Requirement | Implementation |
|-------------|----------------|
| Transport | TLS 1.3+ |
| Authentication | Instance cert + license token |
| Payload integrity | Request signing (HMAC) |
| Replay protection | Nonce + timestamp |

### Endpoints (cloud)

| Endpoint | Agent |
|----------|-------|
| `POST /api/v1/license/activate` | License |
| `POST /api/v1/license/heartbeat` | License |
| `GET /api/v1/license/features` | License |
| `GET /api/v1/updates/manifest` | Sync |
| `GET /api/v1/marketplace/catalog` | Sync |
| `POST /api/v1/ai/proxy` | Sync |

---

## SaaS mode

Agents run **inside** AgainERP cloud — same logic, no separate client install.

Hybrid/Enterprise: agents bundled in client deployment package (`apps/license-agent/` planned).
