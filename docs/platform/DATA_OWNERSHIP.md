# Data & Intellectual Property Ownership

> **Parent:** [HYBRID_LICENSED_ERP_ARCHITECTURE.md](../HYBRID_LICENSED_ERP_ARCHITECTURE.md)

---

## Client-Owned Assets

| Asset | Examples | Location |
|-------|----------|----------|
| **Database** | All `catalog_*`, `commerce_*`, `crm_*`, … | Client PostgreSQL |
| **Media** | Product images, documents | Client MinIO/S3 |
| **Attachments** | Invoices, contracts | Client storage |
| **Reports** | Generated PDF/Excel | Client |
| **Business entities** | Contacts, orders, products, inventory, journals | Client DB |
| **Local configuration** | Warehouses, tax rules, workflows (tenant data) | Client DB |
| **Custom modules (data)** | Module-owned tables | Client DB |

**Export:** Client may export full database and media at any time (plan permitting).

---

## AgainERP-Owned Assets

| Asset | Never on client (hybrid/enterprise) |
|-------|-------------------------------------|
| AI OS source & models | Cloud only |
| License server logic | Cloud only |
| Subscription & billing engine | Cloud only |
| Marketplace transaction backend | Cloud only |
| Update signing keys | Cloud only |
| Security & tamper engines | Cloud only |
| Platform analytics pipeline | Cloud only |
| Control Center codebase | Cloud only |

---

## Metadata AgainERP May Store (Cloud)

| Data | Purpose | Business content |
|------|---------|------------------|
| `tenant_id`, `instance_id` | License binding | No |
| Plan, entitlements | Feature gates | No |
| License expiry | Renewal | No |
| Agent heartbeat | Monitoring | No |
| Anonymous usage stats | Product improvement | No PII (policy) |
| AI audit logs (actions) | Compliance | Tool + record ID refs — not full DB |

AgainERP **does not require** tenant business data in cloud for hybrid/enterprise.

---

## SaaS Exception

In **SaaS mode**, business data resides in AgainERP-managed PostgreSQL but:

- Logical ownership remains with tenant (contract)  
- Export/portability guaranteed  
- Isolation via `tenant_id` / RLS  

---

## AI Data Flow

| Data | Stays |
|------|-------|
| Full product row sent to AI | Processed in cloud; not persisted as tenant DB copy |
| AI response | Returned to client; optional audit metadata in cloud |
| Embeddings of tenant data | Cloud pgvector — tenant-scoped; deletable on termination |

AI accesses data **only through client business APIs** during request — never direct PostgreSQL connection to client DB in hybrid mode (API proxy from client runtime).

---

## Termination

| Event | Client data | License |
|-------|-------------|---------|
| Subscription ends | Retained on client | Revoked |
| SaaS tenant delete | Export window → purge per policy | Revoked |
| Enterprise uninstall | Client keeps DB | Revoked |
