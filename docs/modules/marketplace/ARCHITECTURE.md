# Architecture — Marketplace

> **Status:** Draft  
> **Module:** Marketplace  
> **Document Type:** Architecture  
> **Phase:** 7 (Steps 66–72)

---

## Purpose

Define AgainERP's multi-vendor and omnichannel commerce architecture. This module orchestrates vendors, franchisees, multiple stores, dropshipping partners, supplier feeds, and external sales channels while preserving single source of truth in Core entities and Ecommerce catalog.

## Business Goals

- Enable marketplace operators to onboard and manage third-party sellers
- Support franchise networks with centralized brand control and local operations
- Run multiple branded storefronts from one ERP instance
- Fulfill via dropship suppliers without duplicate inventory records
- Automate supplier catalog ingestion and multi-channel listing sync

## Vendor Management

Central registry for marketplace sellers.

| Entity | Key Fields | Notes |
|--------|------------|-------|
| Vendor | company_name, status, tier, commission_rate | Links to Core `contacts` |
| Vendor User | vendor_id, user_id, role | Scoped admin access |
| Vendor Document | KYC, tax ID, bank details | Approval workflow |
| Vendor Payout | period, amount, status | Posts to Accounting |

Lifecycle: Application → Review → Approved → Active → Suspended → Terminated.

Commission models: percentage, flat fee, category-based, tiered volume.

## Marketplace

Multi-seller catalog and order splitting on shared storefront.

```
Customer Order
      │
      ▼
Order Router (marketplace_orders)
      │
      ├── Vendor A sub-order → Vendor A fulfillment
      ├── Vendor B sub-order → Vendor B fulfillment
      └── Platform items → Own warehouse
```

| Concept | Design |
|---------|--------|
| Product ownership | `vendor_id` on marketplace listings; platform can curate |
| Pricing | Vendor sets price within rules; platform can enforce MAP |
| Reviews | Attributed to vendor + product |
| Disputes | Helpdesk integration with vendor SLA |

Vendor portal: limited admin UI for products, orders, payouts, performance metrics.

## Franchise

Franchise model for brand operators with territorial franchisees.

| Entity | Purpose |
|--------|---------|
| Franchise Brand | Master brand, standards, royalty rules |
| Franchisee | Territory, fees, compliance status |
| Royalty Rule | % of sales, fixed fees, marketing fund |
| Compliance Checklist | Brand standards audits |

Franchisee operates local branch with scoped inventory and POS. Royalties calculated on Sales data and invoiced via Accounting.

## Multi-Store

Multiple storefronts and operational units under one company or franchise network.

| Scope | Configuration |
|-------|---------------|
| Store | Name, domain, theme, default warehouse |
| Catalog | Store-specific assortments, pricing, visibility |
| Inventory | Per-branch stock with transfers |
| Orders | Routed to fulfilling branch/warehouse |

Extends Ecommerce store settings. `marketplace_stores` links to Core `branches`.

## Dropshipping

Fulfillment model where vendor/supplier ships directly to customer.

| Step | System Behavior |
|------|-----------------|
| Order placed | Identify dropship lines by `fulfillment_type` |
| PO auto-created | Purchase order to supplier (no stock movement) |
| Tracking | Supplier feed or manual update → customer notification |
| Settlement | Vendor/supplier cost vs customer price → margin |

No inventory reservation for pure dropship SKUs. Hybrid SKUs support warehouse + dropship fallback.

## Supplier Feed

Automated ingestion of supplier catalogs and availability.

| Feed Type | Format | Frequency |
|-----------|--------|-----------|
| Full catalog | CSV, XML, API JSON | Daily |
| Stock/price delta | API webhook | Real-time |
| Media | URL references | On product create |

Pipeline: Fetch → Validate → Map fields → Staging (`marketplace_feed_staging`) → Review/Auto-publish → Catalog.

Conflict resolution: SKU match rules, vendor priority, manual merge queue. Overlaps with Ecommerce Catalog import — Marketplace owns multi-supplier mapping.

## Channel Management

Omnichannel listing and order sync.

| Channel | Capabilities |
|---------|--------------|
| Own storefront | Native Ecommerce |
| Amazon / eBay / Etsy | Listing sync, order import, inventory push |
| Social commerce | Product catalog API, checkout links |
| B2B portal | Wholesale pricing per channel |

`marketplace_channels` stores credentials (encrypted). Sync jobs via Queue with rate limiting and error retry. Unified order inbox normalizes external orders into Sales/Ecommerce orders.

## User Roles

| Role | Access |
|------|--------|
| Marketplace Admin | Full module, vendor approval, channel config |
| Vendor Manager | Vendor onboarding, disputes |
| Vendor (portal) | Own products, orders, payouts |
| Franchise Admin | Brand, franchisees, royalties |
| Store Manager | Multi-store config for assigned stores |
| Channel Operator | Channel sync monitoring |

Permission namespace: `marketplace.*`

## Database Tables

Prefix: `marketplace_*`

| Table | Purpose |
|-------|---------|
| `marketplace_vendors` | Vendor master |
| `marketplace_vendor_users` | Portal user mapping |
| `marketplace_vendor_documents` | KYC/compliance files |
| `marketplace_listings` | Vendor product offers |
| `marketplace_orders` | Parent marketplace order |
| `marketplace_order_items` | Split lines per vendor |
| `marketplace_commissions` | Commission calculations |
| `marketplace_payouts` | Payout batches |
| `marketplace_franchises` | Franchise network |
| `marketplace_franchisees` | Franchisee records |
| `marketplace_royalties` | Royalty calculations |
| `marketplace_stores` | Multi-store config |
| `marketplace_dropship_rules` | SKU/supplier routing |
| `marketplace_supplier_feeds` | Feed definitions |
| `marketplace_feed_staging` | Import staging |
| `marketplace_channels` | External channel config |
| `marketplace_channel_listings` | Channel SKU mapping |
| `marketplace_channel_orders` | External order references |

## API Endpoints

Base path: `/api/v1/marketplace/`

Vendor portal, feed webhooks, and channel callbacks documented in module `API.md` (to create at implementation).

## Events

| Event | Subscribers |
|-------|-------------|
| `marketplace.vendor.approved` | Notification, Ecommerce |
| `marketplace.order.split` | Sales, Inventory, Accounting |
| `marketplace.feed.imported` | Catalog, Notification |
| `marketplace.channel.order.received` | Sales, Inventory |

## Dependencies

- **Core:** Companies, Branches, Contacts, Users, Workflow, Queue
- **Modules:** Ecommerce, Inventory, Sales, Purchase, Accounting, CRM, Helpdesk

## Future Enhancements

- Escrow payments and split settlements at gateway level
- Vendor performance scoring and auto-suspension rules
- Cross-border marketplace tax (IOSS, marketplace facilitator)

---

**Module:** Marketplace  
**Last Updated:** 2026-06-12  
**Author:** —  
**Reviewers:** —
