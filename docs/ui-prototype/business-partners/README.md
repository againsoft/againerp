# Business Partners — UI Prototype Index

> **Status:** P1–P8 implemented (UI prototype)  
> **Routes:** `/partners/*`  
> **Architecture:** [Architecture.md](../../modules/business-partners/Architecture.md)  
> **Build guide:** [BUSINESS_PARTNERS_UI_BUILD_GUIDE.md](./BUSINESS_PARTNERS_UI_BUILD_GUIDE.md)  
> **Common rules:** [PROJECT_COMMON_RULES.md](../../PROJECT_COMMON_RULES.md)

---

## Naming (UI)

| Concept | UI label (EN) | UI label (BN) |
|---------|---------------|---------------|
| Module | Business Partners | ব্যবসায়িক অংশীদার |
| Record | Partner | অংশীদার |
| Vendor role | Vendor | সরবরাহকারী |
| Retailer role | Retailer | খুচরা বিক্রেতা |
| Wholesaler role | Wholesaler | পাইকারি |
| Directory | Partner directory | অংশীদার তালিকা |

---

## Migration (Track D — implemented)

| Legacy | Canonical |
|--------|-----------|
| `/suppliers/all` | `/partners/directory?role=vendor` (redirect) |
| `/suppliers/[id]` | `/partners/directory?view={bp_id}` (redirect when mapped) |
| Vendor catalog in supplier workspace | Partner drawer → Catalog tab |
| `vendor-mapping-store` | `business-partner-catalog-store` facade |

Purchase routes (`/suppliers/purchase-orders`, RFQ, receipts, bills) unchanged.

---

## Planned screens

| Phase | Screen | Route | Drawer | Status |
|-------|--------|-------|--------|--------|
| P1 | Overview | `/partners` | — | ✅ |
| P2–P3 | Directory | `/partners/directory` | ✅ create · view · edit | ✅ |
| P4 | Roles + terms | view drawer tabs | tabs | ✅ |
| P5 | Onboarding | `/partners/onboarding` | ✅ view drawer | ✅ |
| P6 | Tiers | `/partners/tiers` | ✅ create · view · edit | ✅ |
| P7 | Catalog + integrations | view drawer Catalog tab | — | ✅ |
| P8 | Territories | `/partners/territories` | ✅ assign · view | ✅ |
| P8 | Performance | `/partners/performance` | — | ✅ |
| P8 | Settings | `/partners/settings` | — | ✅ |

---

## Screen documentation

| Doc | Entity |
|-----|--------|
| [PartnerDirectory.md](./PartnerDirectory.md) | Directory grid + drawer |
| [PartnerOnboarding.md](./PartnerOnboarding.md) | Application queue |
| [PartnerTiers.md](./PartnerTiers.md) | Tier definitions |
| [PartnerTerms.md](./PartnerTerms.md) | Commercial terms UX |

---

## Migration note

Current **`/suppliers/*`** prototype = **vendor role only** subset.  
Future: vendor master moves here; Purchase keeps PO/RFQ/Receipt screens.

See [SUPPLIERS_IMPLEMENTED_DESIGN.md](../purchase/SUPPLIERS_IMPLEMENTED_DESIGN.md).

---

**Last Updated:** 2026-06-17
