# Business Partners Module — Documentation Index

> **Status:** Draft (Planning)  
> **Module ID:** `business-partners`  
> **Route namespace:** `/partners/*`  
> **Table prefix:** `bp_*`  
> **API base:** `/api/v1/business-partners/`  
> **Common rules:** [PROJECT_COMMON_RULES.md](../../PROJECT_COMMON_RULES.md)

---

## Naming decision

Vendor · Partner · Retailer · Wholesaler — এগুলো আলাদা module নয়, **একটি common commercial identity**।

| Old scattered term | Unified as |
|--------------------|------------|
| Vendor / Supplier | Partner role: **`vendor`** |
| Channel / Trade partner | Partner role: **`distributor`** · **`channel_partner`** |
| Retailer | Partner role: **`retailer`** |
| Wholesaler | Partner role: **`wholesaler`** |
| Customer (B2B commercial) | Partner role: **`customer`** + commercial profile |

**Module name:** **Business Partners** (ERP industry standard — SAP/Dynamics Business Partner)

**বাংলা UI label:** ব্যবসায়িক অংশীদার / Business Partners

---

## Core vs this module

| Layer | Owns | Example |
|-------|------|---------|
| **Core `contacts`** | Identity — name, email, phone, tax ID, addresses | "TechPro Ltd" exists once |
| **Business Partners** | Commercial profile — roles, terms, tiers, credit, territories, onboarding | TechPro is **vendor** + **wholesaler** with separate terms |

Purchase/Sales/CRM **transaction documents** (PO, SO, Invoice) এই module-এর profile consume করে — duplicate vendor/customer master তৈরি করে না।

---

## Documentation steps (planning order)

| Step | Document | Status |
|------|----------|--------|
| **01** | [Architecture.md](./Architecture.md) | ✅ Draft |
| **02** | [Database.md](./Database.md) | ✅ Draft |
| **03** | [API.md](./API.md) | ✅ Draft |
| **04** | [Workflow.md](./Workflow.md) | ✅ Draft |
| **05** | [Permissions.md](./Permissions.md) | ✅ Draft |
| **06** | [INTEGRATION.md](./INTEGRATION.md) | ✅ Draft |
| **07** | [Development.md](./Development.md) | ✅ Draft — step-by-step build plan |
| **08** | [Roadmap.md](./Roadmap.md) | ✅ Draft |
| **09** | [ModuleManifest.md](./ModuleManifest.md) | ✅ Draft |

### UI / UX prototype plan

| Step | Document | Status |
|------|----------|--------|
| **UI-01** | [ui-prototype/business-partners/README.md](../../ui-prototype/business-partners/README.md) | ✅ Draft |
| **UI-02** | [BUSINESS_PARTNERS_UI_BUILD_GUIDE.md](../../ui-prototype/business-partners/BUSINESS_PARTNERS_UI_BUILD_GUIDE.md) | ✅ Draft |
| **UI-03** | Screen specs (Directory, Onboarding, Terms, Tiers, Catalog) | ✅ Draft |

**Prototype phase:** documentation + UI plan only — **no code yet**.

---

## Relationship to existing prototype

| Current | Future (canonical) |
|---------|-------------------|
| `/suppliers/all` (vendor list) | `/partners?role=vendor` |
| `/suppliers/[id]` (full page detail) | `/partners?view={id}` (drawer) per [PROJECT_COMMON_RULES.md](../../PROJECT_COMMON_RULES.md) |
| `vendor-product-mapping` mock | `bp_partner_catalog` via Business Partners |

Purchase module (`/purchase/*`) PO/RFQ/Receipt **রেখে** vendor master Business Partners-এ migrate হবে।

---

## Quick links

- Architecture: [Architecture.md](./Architecture.md)
- Dev steps: [Development.md](./Development.md)
- UI phases: [BUSINESS_PARTNERS_UI_BUILD_GUIDE.md](../../ui-prototype/business-partners/BUSINESS_PARTNERS_UI_BUILD_GUIDE.md)
- Dependency map: [MODULE_DEPENDENCY_MAP.md](../../MODULE_DEPENDENCY_MAP.md) § Business Partners

---

**Last Updated:** 2026-06-17  
**Author:** Architecture planning  
**Reviewers:** Pending
