# Partner Tiers — UI Spec (Planned)

> **Status:** Implemented (P6)  
> **Route:** `/partners/tiers`  
> **Drawer:** `?create=1` · `?view={id}` · `?edit={id}`

---

## Purpose

Define **wholesale**, **retail**, **dealer**, and **distributor** price tiers — assign to partners with wholesaler/retailer roles.

Links to Product Master price lists (future).

---

## Tier list grid

| Column | Content |
|--------|---------|
| Code | WHOLESALE-A |
| Name | Wholesale Tier A |
| Type | wholesale · retail · dealer · distributor |
| Discount | 15% off list |
| Price list | PL-WHOLESALE-2026 |
| Partners | Count assigned |
| Status | active |
| ⋮ | View · Edit · Deactivate |

---

## Create / Edit form

| Field | Type |
|-------|------|
| Code | text, unique |
| Name | text |
| Tier type | select |
| Default discount % | number |
| Price list | select (Product Master) |
| Description | textarea |
| Active | switch |

---

## Partner assignment (also in partner view drawer → Tiers tab)

| Field | Type |
|-------|------|
| Partner | read-only in context |
| Tier | select |
| Role context | wholesaler / retailer |
| Priority | number if multiple |

---

## Mobile

- Grid → stacked cards with code + type + partner count
- Form single column in drawer

---

## Seed tiers (plan)

| Code | Type | Discount |
|------|------|----------|
| WHOLESALE-A | wholesale | 12% |
| WHOLESALE-B | wholesale | 18% |
| RETAIL-STD | retail | 0% |
| DEALER-GOLD | dealer | 22% |
| DIST-NATIONAL | distributor | 25% |

---

**Last Updated:** 2026-06-17
