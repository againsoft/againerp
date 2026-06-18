# Business Partners — Module Manifest

> **Status:** Draft (Planning)  
> **Module ID:** `business-partners`  
> **Version:** 0.1.0-plan  
> **Last Updated:** 2026-06-17

---

## Module summary

| Field | Value |
|-------|-------|
| **Name** | Business Partners |
| **Layer** | ERP |
| **Route** | `/partners/*` |
| **API** | `/api/v1/business-partners/` |
| **Table prefix** | `bp_*` |
| **Feature flag** | `module.business_partners` |
| **Installable** | Yes (optional) |

---

## Dependencies

### Hard (required)

| Module | Via |
|--------|-----|
| Core | contacts, addresses, activities, attachments, workflow, events |

### Soft (optional consumers)

| Module | Integration |
|--------|-------------|
| Purchase | Vendor picker, PO defaults, catalog |
| Sales | Customer/wholesale terms, credit check |
| CRM | Partner pipeline link |
| Inventory | Dropship, supplier feed |
| Accounting | AP/AR terms sync |
| Marketing | Affiliate role |
| Product Master | Catalog mapping |

**Rule:** Business Partners off → consumers use Core contacts only.

---

## Menus (planned)

| Menu | Route | Permission |
|------|-------|------------|
| Overview | `/partners` | `bp.partner.read` |
| Directory | `/partners/directory` | `bp.partner.read` |
| Onboarding | `/partners/onboarding` | `bp.onboarding.read` |
| Tiers | `/partners/tiers` | `bp.tier.read` |
| Territories | `/partners/territories` | `bp.territory.read` |
| Performance | `/partners/performance` | `bp.performance.read` |
| Settings | `/partners/settings` | `bp.settings.manage` |

---

## Pages (prototype plan)

| Page | Drawer modes | Doc |
|------|--------------|-----|
| Partner directory | create · view · edit | [PartnerDirectory.md](../../ui-prototype/business-partners/PartnerDirectory.md) |
| Onboarding queue | view · approve | [PartnerOnboarding.md](../../ui-prototype/business-partners/PartnerOnboarding.md) |
| Tier management | create · view · edit | [PartnerTiers.md](../../ui-prototype/business-partners/PartnerTiers.md) |
| Overview dashboard | — | [BUSINESS_PARTNERS_UI_BUILD_GUIDE.md](../../ui-prototype/business-partners/BUSINESS_PARTNERS_UI_BUILD_GUIDE.md) |

---

## Database tables (owned)

| Table | Purpose |
|-------|---------|
| `bp_partners` | Commercial partner profile |
| `bp_partner_roles` | Role assignments |
| `bp_partner_terms` | Terms per role |
| `bp_partner_tiers` | Tier assignment |
| `bp_tier_definitions` | Tier master |
| `bp_partner_territories` | Geographic coverage |
| `bp_partner_catalog` | Vendor SKU mapping |
| `bp_onboarding_applications` | Onboarding requests |
| `bp_partner_performance` | KPI snapshots |

Detail: [Database.md](./Database.md)

---

## API endpoints (summary)

| Group | Base |
|-------|------|
| Partners CRUD | `/api/v1/business-partners/partners` |
| Roles | `.../partners/{id}/roles` |
| Terms | `.../partners/{id}/terms` |
| Onboarding | `/api/v1/business-partners/onboarding` |
| Catalog | `.../partners/{id}/catalog` |

Detail: [API.md](./API.md)

---

## Permissions (summary)

`bp.partner.*` · `bp.onboarding.*` · `bp.tier.*` · `bp.territory.*` · `bp.catalog.*` · `bp.settings.manage`

Detail: [Permissions.md](./Permissions.md)

---

## Workflows

| Workflow | Doc |
|----------|-----|
| Partner onboarding | [Workflow.md](./Workflow.md) §1 |
| Partner block / unblock | [Workflow.md](./Workflow.md) §2 |
| Credit hold | [Workflow.md](./Workflow.md) §3 |

---

## Events published

`bp.partner.created` · `bp.partner.role.enabled` · `bp.partner.blocked` · `bp.partner.terms.updated` · `bp.onboarding.approved` · `bp.catalog.item.mapped`

---

## Reports (planned)

| Report | Description |
|--------|-------------|
| Partner spend by vendor | Purchase analytics |
| Partner revenue by channel | Sales by role |
| Onboarding funnel | Application → active |
| Tier coverage | Products × partners |

---

## Related documents

| Doc | Path |
|-----|------|
| Architecture | [Architecture.md](./Architecture.md) |
| Development plan | [Development.md](./Development.md) |
| UI build guide | [BUSINESS_PARTNERS_UI_BUILD_GUIDE.md](../../ui-prototype/business-partners/BUSINESS_PARTNERS_UI_BUILD_GUIDE.md) |
| Integration | [INTEGRATION.md](./INTEGRATION.md) |
