# AgainERP — Business Partners Module Architecture

> **Status:** Draft (Planning)  
> **Version:** 1.0  
> **Module:** Business Partners  
> **Document Type:** Enterprise Architecture  
> **Phase:** Documentation First · UI/UX Planning  
> **Route Namespace:** `/partners/*`  
> **Governance:** [GOVERNANCE.md](../../GOVERNANCE.md) · **Common rules:** [PROJECT_COMMON_RULES.md](../../PROJECT_COMMON_RULES.md)

**No backend code. No database implementation. No API implementation.**  
Source of truth for **unified commercial partner management** — vendor, retailer, wholesaler, distributor, and channel partners on one module.

**Related:** [Database.md](./Database.md) · [API.md](./API.md) · [Workflow.md](./Workflow.md) · [INTEGRATION.md](./INTEGRATION.md) · [Development.md](./Development.md) · [core/entities/contacts.md](../../core/entities/contacts.md) · [PURCHASE_MODULE_ARCHITECTURE.md](../purchase/PURCHASE_MODULE_ARCHITECTURE.md) · [SALES_MODULE_ARCHITECTURE.md](../sales/SALES_MODULE_ARCHITECTURE.md) · [CRM_MODULE_ARCHITECTURE.md](../crm/CRM_MODULE_ARCHITECTURE.md)

---

## Executive Summary

**Business Partners** is AgainERP's **commercial relationship hub** — one place to manage who you buy from, sell to, and distribute through, without duplicating Core contact identity.

| Principle | Rule |
|-----------|------|
| **Identity in Core** | `contacts` owns name, email, phone, addresses |
| **Commercial profile here** | Roles, terms, tiers, credit, territories, onboarding |
| **Optional module** | Off → Purchase/Sales use Core contacts only (degraded mode) |
| **No cross-module DB** | PO/SO reference `partner_id` (UUID); fetch via `BusinessPartnerService` |
| **Multi-role** | One org can be vendor + wholesaler + retailer simultaneously |
| **SaaS-ready** | Per-tenant enable; plan feature `module.business_partners` |

**Table namespace:** `bp_*` · **API base:** `/api/v1/business-partners/`

---

## 1. Module Vision

### Problem today (scattered)

| Term | Where it lives today | Gap |
|------|---------------------|-----|
| Vendor / Supplier | Purchase `/suppliers/*`, Core `contact_types: vendor` | Commercial terms split across Purchase UI |
| Retailer / Wholesaler | Sales order type, catalog price fields | No unified partner profile |
| Channel partner | CRM pipeline, Marketing affiliate | No single onboarding |
| Partner (SaaS) | Platform `platform_partners` | Different domain — reseller billing |

### Vision statement

> **One partner record. Many commercial roles. Full traceability from onboarding to PO/SO.**

```text
                    ┌─────────────────────────────────────┐
                    │         Core Contacts (identity)     │
                    │   name · email · phone · addresses   │
                    └─────────────────┬───────────────────┘
                                      │ 1:1 or 1:0..1
                    ┌─────────────────▼───────────────────┐
                    │   Business Partners (commercial)       │
                    │  roles · terms · tiers · credit · KPI  │
                    └───────┬─────────┬─────────┬───────────┘
                            │         │         │
              ┌─────────────▼──┐ ┌────▼────┐ ┌──▼──────────┐
              │ Purchase        │ │ Sales    │ │ CRM / Mktg  │
              │ PO · RFQ · Bill │ │ SO · Quote│ │ Pipeline    │
              └─────────────────┘ └──────────┘ └─────────────┘
```

### Module off behavior ([PROJECT_COMMON_RULES.md](../../PROJECT_COMMON_RULES.md))

```text
Business Partners OFF:
  ✓ Core contacts still work
  ✓ Purchase PO with contact_id (vendor type) — basic mode
  ✓ Sales SO with customer contact — basic mode
  ✗ Partner tiers, onboarding, unified directory hidden
  ✗ bp_* tables not queried
```

---

## 2. Partner roles (canonical enum)

One `bp_partners` record → many roles via `bp_partner_roles`.

| Role code | Label (EN) | Label (BN hint) | Primary consumer module |
|-----------|------------|-----------------|-------------------------|
| `vendor` | Vendor / Supplier | সরবরাহকারী | Purchase |
| `customer` | B2B Customer | গ্রাহক (B2B) | Sales |
| `retailer` | Retailer | খুচরা বিক্রেতা | Sales · Ecommerce |
| `wholesaler` | Wholesaler | পাইকারি বিক্রেতা | Sales |
| `distributor` | Distributor | পরিবেশক | Sales · Inventory |
| `channel_partner` | Channel Partner | চ্যানেল পার্টনার | CRM |
| `dropship` | Dropship Partner | ড্রপশিপ | Inventory · Orders |
| `franchisee` | Franchisee | ফ্র্যাঞ্চাইজি | POS · Sales |
| `affiliate` | Affiliate | অ্যাফিলিয়েট | Marketing |
| `contractor` | Contractor | ঠিকাদার | Project · Purchase |

**Rule:** Role enables **smart buttons** and **default terms** in consumer modules — not separate contact records.

---

## 3. Responsibilities

### Business Partners owns

| Domain | Responsibility |
|--------|----------------|
| **Partner registry** | Directory, search, status, codes |
| **Role assignment** | Multi-role per partner |
| **Commercial terms** | Payment terms, currency, incoterms, MOQ — per role |
| **Price tiers** | Wholesale / retail / dealer tier linkage |
| **Credit & limits** | Credit limit, hold, exposure snapshot |
| **Territories** | Regions, branches served |
| **Onboarding** | Application → review → approve → active |
| **Partner catalog** | Vendor SKU mapping (from `purchase_vendor_items` concept) |
| **Performance KPIs** | On-time %, spend, revenue, rating |
| **Partner contacts** | People at partner org (link to Core child contacts) |

### Business Partners does NOT own

| Domain | Owner |
|--------|-------|
| Contact identity | Core `contacts` |
| Purchase orders, RFQ, bills | Purchase |
| Sales orders, invoices | Sales |
| Stock movements | Inventory |
| GL / AP / AR | Accounting |
| Marketing campaigns | Marketing |
| SaaS reseller billing | Platform |

---

## 4. Layer & classification

| Attribute | Value |
|-----------|-------|
| **Layer** | ERP (Layer 3) |
| **Installable** | Yes — optional per tenant plan |
| **Depends on (hard)** | Core only |
| **Depends on (soft)** | Product Master (catalog mapping), CRM (pipeline link) |
| **Consumers (soft)** | Purchase, Sales, Inventory, Accounting, Marketing |

---

## 5. Navigation map (production)

```text
/partners                          → Overview dashboard
/partners/directory                → All partners (AG Grid + role filters)
/partners/onboarding               → Applications queue
/partners/tiers                    → Price tier definitions
/partners/territories              → Territory map / list
/partners/performance              → Cross-partner KPI dashboard
/partners/settings                 → Role types, approval rules, numbering
```

**Drawer CRUD (mandatory):**

```text
/partners/directory?create=1       → New partner (form drawer)
/partners/directory?view={id}      → Partner detail (read-only drawer)
/partners/directory?edit={id}      → Edit partner
```

No `/partners/new` or `/partners/[id]/edit` routes.

---

## 6. Partner record UI structure (view drawer)

| Tab | Content |
|-----|---------|
| **Overview** | Status, roles, tier, credit, assigned owner, KPI strip |
| **Profile** | Core contact fields (read-through) + partner code, legal name |
| **Roles** | Enable/disable roles; role-specific defaults |
| **Terms** | Payment terms, currency, lead time, incoterms — per role |
| **Tiers & pricing** | Wholesale/retail tier assignment; price list link |
| **Territories** | Regions, exclusivity flags |
| **Catalog** | Vendor SKU mapping (vendor role) |
| **Documents** | Contracts, certificates (attachments) |
| **Transactions** | Smart links — POs, SOs, bills, invoices (consumer modules) |
| **Performance** | Charts: spend, revenue, OTD %, quality |
| **Onboarding** | Application history, approval trail |
| **Activity** | Chatter + integration events |

**Header actions:** Create PO · Create SO · Edit · Block · Merge · Activity

---

## 7. Services (public API surface)

| Service | Method | Used by |
|---------|--------|---------|
| `BusinessPartnerService` | `getPartner(id)` | All consumers |
| | `getByContact(contactId)` | Core contact drawer |
| | `listByRole(role, filters)` | Purchase vendor picker |
| | `getCommercialTerms(partnerId, role)` | PO/SO default terms |
| | `getPriceTier(partnerId, role)` | Sales pricing |
| | `checkCredit(partnerId, amount)` | Sales order approval |
| | `getCatalogItems(partnerId)` | Purchase · Product sourcing |
| | `recordPerformanceSnapshot(partnerId)` | Scheduled job |

---

## 8. Events (async)

| Event | Publisher | Subscribers (optional) |
|-------|-----------|------------------------|
| `bp.partner.created` | Business Partners | Search, CRM |
| `bp.partner.role.enabled` | Business Partners | Purchase, Sales nav refresh |
| `bp.partner.blocked` | Business Partners | Purchase (block PO), Sales |
| `bp.partner.terms.updated` | Business Partners | Accounting |
| `bp.onboarding.approved` | Business Partners | Notifications, CRM |
| `bp.catalog.item.mapped` | Business Partners | Catalog product drawer |

Subscribers **must** no-op if module disabled or partner not found.

---

## 9. Migration from `/suppliers/*` prototype

| Prototype asset | Target |
|-----------------|--------|
| `suppliers.ts` mock vendors | `bp_partners` seed with `vendor` role |
| `/suppliers/[id]` full page | `/partners/directory?view=` drawer |
| `vendor-product-mapping` | `bp_partner_catalog` |
| Sidebar "Suppliers" | "Business Partners" with role quick filters |

Purchase transactional screens (PO, RFQ, Receipt) **remain under Purchase** — only **partner master** moves to Business Partners.

---

## 10. SaaS & scaling

| Concern | Design |
|---------|--------|
| Multi-tenant | `tenant_id` + `company_id` on all `bp_*` tables |
| Feature flag | `module.business_partners` in tenant plan |
| Independent team | Own `docs/modules/business-partners/`, own API namespace |
| Scale | Partner directory paginated; search via Core Search index |
| White-label | Partner portal (future) — separate app consuming same API |

---

## 11. AI readiness

| Tool (future) | Purpose |
|---------------|---------|
| `bp.suggest_vendor` | Recommend vendor for product reorder |
| `bp.score_partner` | Performance risk score |
| `bp.draft_onboarding` | Pre-fill application from documents |

---

## 12. Development phases (summary)

Full step-by-step: [Development.md](./Development.md) · UI: [BUSINESS_PARTNERS_UI_BUILD_GUIDE.md](../../ui-prototype/business-partners/BUSINESS_PARTNERS_UI_BUILD_GUIDE.md)

| Phase | Scope |
|-------|-------|
| **P0** | Docs + architecture approval (this batch) |
| **P1** | Partner directory + drawer CRUD (prototype) |
| **P2** | Roles + terms tabs |
| **P3** | Onboarding workflow UI |
| **P4** | Tiers + territories |
| **P5** | Catalog mapping (vendor) |
| **P6** | Performance dashboard |
| **P7** | Purchase/Sales integration stubs |
| **P8** | Backend API + DB (post-prototype) |

---

**Module:** Business Partners  
**Last Updated:** 2026-06-17  
**Status:** Draft (Planning)
