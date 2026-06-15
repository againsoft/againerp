# Marketplace Module

> **Status:** Draft  
> **Phase:** 7 — Marketplace Layer  
> **Steps:** 66–72 in [MASTER_DEVELOPMENT_SEQUENCE.md](../../MASTER_DEVELOPMENT_SEQUENCE.md)

---

## Overview

The Marketplace module extends AgainERP from single-merchant operations to multi-vendor commerce. It manages vendors, franchise networks, multiple storefronts, dropshipping flows, supplier catalog feeds, and omnichannel sales.

## Documents

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Multi-vendor architecture, entities, workflows, and integrations |

## Capabilities

| Capability | Description |
|------------|-------------|
| Vendor Management | Onboarding, KYC, commissions, payouts |
| Marketplace | Multi-seller catalog, split orders, vendor dashboards |
| Franchise | Brand standards, royalties, territory management |
| Multi-Store | Company/branch-scoped storefronts and inventory |
| Dropshipping | Supplier-direct fulfillment without holding stock |
| Supplier Feed | Automated catalog and stock import from suppliers |
| Channel Management | Sync listings across marketplaces and social channels |

## Dependencies

- **Core:** Companies, Branches, Contacts, Users, Permissions, Workflow
- **Modules:** Ecommerce, Inventory, Sales, Purchase, Accounting, CRM

---

**Module:** Marketplace  
**Last Updated:** 2026-06-12
