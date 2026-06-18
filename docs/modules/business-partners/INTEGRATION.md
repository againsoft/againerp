# Business Partners — Integration Map

> **Status:** Draft (Planning)  
> **Parent:** [Architecture.md](./Architecture.md) · [MODULE_DEPENDENCY_MAP.md](../../MODULE_DEPENDENCY_MAP.md)

---

## Integration principles

| Rule | Detail |
|------|--------|
| **Soft dependencies** | Purchase/Sales work without Business Partners (Core contact fallback) |
| **Service sync** | `BusinessPartnerService` for reads at transaction time |
| **Events async** | Partner lifecycle → optional subscribers |
| **No cross-module DB** | Consumers store `partner_id` UUID only |

---

## Purchase module

| Handoff | Direction | Mechanism |
|---------|-----------|-----------|
| Vendor picker | Purchase → BP | `list_by_role(vendor)` |
| PO default terms | Purchase → BP | `get_commercial_terms(id, vendor)` |
| Vendor catalog | Purchase ↔ BP | `get_catalog_items` / catalog API |
| PO created | Purchase → BP | Event `purchase.po.created` → performance job |
| Partner blocked | BP → Purchase | Event `bp.partner.blocked` → disable new PO UI |

**Prototype migration:** `/suppliers/all` data → `bp_partners` with vendor role; PO screens keep `supplierId` → rename to `partnerId`.

---

## Sales module

| Handoff | Direction | Mechanism |
|---------|-----------|-----------|
| Customer / wholesale picker | Sales → BP | `list_by_role(customer\|wholesaler\|retailer)` |
| Price tier | Sales → BP | `get_price_tier` → Product Master price list |
| Credit check | Sales → BP | `check_credit` before SO confirm |
| SO created | Sales → BP | Performance revenue rollup |

---

## CRM module

| Handoff | Direction | Mechanism |
|---------|-----------|-----------|
| Channel partner pipeline | CRM ↔ BP | `partner_id` on opportunity |
| Lead converted | CRM → BP | Create partner on win (optional) |
| Partner role `channel_partner` | BP → CRM | Smart button on partner drawer |

---

## Inventory module

| Handoff | Direction | Mechanism |
|---------|-----------|-----------|
| Supplier stock feed | Inventory → BP | Sync updates `bp_partner_catalog.vendor_stock_qty` |
| Dropship fulfillment | Orders → BP | `dropship` role partner address |

---

## Accounting module

| Handoff | Direction | Mechanism |
|---------|-----------|-----------|
| AP terms | BP → Accounting | `bp.partner.terms.updated` |
| AR credit limit | BP → Accounting | Exposure snapshot |

---

## Product Master / Catalog

| Handoff | Direction | Mechanism |
|---------|-----------|-----------|
| Supplier sourcing UI | Catalog → BP | Product drawer "Supplier sourcing" calls BP catalog API |
| Map supplier sheet | Catalog → BP | POST catalog mapping |

**Existing prototype:** `vendor-product-mapping.ts` → `bp_partner_catalog`.

---

## Core Contacts

| Handoff | Direction | Mechanism |
|---------|-----------|-----------|
| Contact created | Core → BP | Optional: prompt "Create business partner?" |
| Partner drawer profile tab | BP → Core | Read-through `contact_id` |
| Duplicate prevention | BP | One `bp_partners` per `contact_id` per company |

---

## Ecommerce / Orders

| Handoff | Direction | Mechanism |
|---------|-----------|-----------|
| Wholesale order type | Orders → BP | Tier pricing at checkout (B2B portal future) |
| Retailer channel | Ecommerce → BP | `retailer` role + territory |

---

## Event catalog

| Event | Publisher | Subscribers (all optional) |
|-------|-----------|----------------------------|
| `bp.partner.created` | BP | Search, CRM |
| `bp.partner.role.enabled` | BP | Purchase, Sales |
| `bp.partner.blocked` | BP | Purchase, Sales |
| `bp.partner.terms.updated` | BP | Accounting |
| `bp.onboarding.approved` | BP | Notifications |
| `bp.catalog.item.mapped` | BP | Catalog UI refresh |

---

## Module dependency summary

```text
                    Core (contacts)
                         ↑
              Business Partners (optional)
                    ↙   ↓   ↘
            Purchase  Sales  CRM
               ↓       ↓
           Inventory  Accounting
```

**Update required when implementing:** [MODULE_DEPENDENCY_MAP.md](../../MODULE_DEPENDENCY_MAP.md)

---

**Last Updated:** 2026-06-17
