# Smart Buttons

> **Status:** Draft  
> **Parent:** [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **Related:** [record-view.md](./record-view.md)

---

## Purpose

**Odoo-inspired** stat pills on record pages. Display related record counts and link to filtered views.

---

## Visual Design

```
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ Orders   │ Reviews  │ Inventory│ SEO      │ Views    │ Returns  │
│    24    │    8     │   142    │   85     │  1.2k    │    2     │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

| Property | Spec |
|----------|------|
| Layout | Horizontal scroll on mobile; wrap on desktop |
| Label | `--text-xs` uppercase muted |
| Count | `--text-lg` semibold |
| Click | Navigate to related filtered list or tab |
| Max visible | 8 buttons; overflow in "More stats" |

---

## Standard Sets by Entity

### Product

| Button | Data Source |
|--------|-------------|
| Orders | `commerce_order_items` count |
| Reviews | `catalog_reviews` count |
| Inventory | Sum `inventory_stock_levels` |
| SEO Score | `seo_audits` score |
| Views | `analytics_products.views` |
| Returns | `commerce_returns` count |

### Order

| Button | Data Source |
|--------|-------------|
| Items | Line count |
| Shipments | `commerce_shipments` count |
| Payments | `commerce_payments` count |
| Returns | `commerce_returns` count |
| Invoices | Accounting link count |

### Customer (Contact)

| Button | Data Source |
|--------|-------------|
| Orders | `commerce_orders` count |
| Invoices | Accounting invoices |
| Activities | Open `activities` count |
| Tickets | `helpdesk_tickets` count |

---

## Rules

| Rule | Detail |
|------|--------|
| RBAC | Hide button if user cannot read related data |
| Zero count | Show `0` — still clickable |
| Loading | Skeleton pill while fetching |
| Cache | Counts cached 60s; invalidate on related event |
| Registration | Modules register smart buttons via manifest |

---

## API

`GET /api/v1/{module}/{record_id}/smart-buttons`

Returns array: `{ id, label, count, url, permission }`
