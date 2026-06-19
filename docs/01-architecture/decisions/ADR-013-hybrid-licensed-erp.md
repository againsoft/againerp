# ADR-013: Hybrid Licensed ERP Architecture

> **Status:** Accepted  
> **Date:** 2026-06-12  
> **Deciders:** Platform Architecture Team  
> **Priority:** Critical

---

## Context

AgainERP must serve SaaS customers, enterprise clients requiring data on-prem, white-label partners, and protect AI OS, marketplace, and subscription revenue. A single SaaS-only model excludes regulated industries and self-hosted buyers.

## Decision

Adopt a **Hybrid Licensed ERP** model:

1. **Client owns** business data, database, media, local runtime (hybrid/enterprise).  
2. **AgainERP cloud owns** license server, AI OS, marketplace backend, updates, security center.  
3. Three deployment modes: SaaS, Hybrid, Enterprise.  
4. **License Agent** and **Sync Agent** on client instances for validation and sync.  
5. Critical business functions **offline-capable** with sync on reconnect.  
6. AI OS **never** deployed to client; API-only consumption.

## Consequences

### Positive

- Data sovereignty for enterprise  
- IP and revenue protection  
- Single architecture for SaaS + self-hosted  
- Aligns with [HYBRID_LICENSED_ERP_ARCHITECTURE.md](../HYBRID_LICENSED_ERP_ARCHITECTURE.md)

### Negative

- Client agent complexity  
- License offline grace edge cases  
- Dual deployment pipelines (cloud + client package)

## Related Documents

- [HYBRID_LICENSED_ERP_ARCHITECTURE.md](../HYBRID_LICENSED_ERP_ARCHITECTURE.md)
- [SAAS_PLATFORM_ARCHITECTURE.md](../SAAS_PLATFORM_ARCHITECTURE.md)
- [modules/ai/AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md)
