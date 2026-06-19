# Architecture — Subscription

## Purpose
Subscription module architecture — scope, features, data ownership, and integration boundaries.

## When To Read
Read this file only if working on Subscription architecture, features, or module boundaries.

## Related Files
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [Architecture](Architecture.md)

---

> **Status:** Draft  
> **Module:** Subscription  
> **Document Type:** Architecture  
> **Phase:** 8 (Step 73)  
> **Platform:** [SAAS_PLATFORM_ARCHITECTURE.md](../../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md) — canonical SaaS design

---


## When To Read
Read this file only if working on Subscription architecture, features, or module boundaries.

## Related Files
- [Dependencies](../../01-architecture/MODULE_DEPENDENCY_MAP.md)

## Read Next
- [Architecture](Architecture.md)

---

## Purpose

Manage recurring revenue: subscription plans, billing cycles, renewals, upgrades/downgrades, dunning, and usage-based metering. Implements the **Subscription** and **Billing** slices of the SaaS Platform Layer. Integrates with payment gateways and Accounting for revenue recognition.

## Business Goals

- Sell subscription products via Ecommerce and direct sales
- Automate renewal invoicing and payment collection
- Support trials, coupons, and proration on plan changes
- Track MRR/ARR metrics for BI reporting

## Core Concepts

| Concept | Description |
|---------|-------------|
| Plan | Product template: price, interval, features, trial days |
| Subscription | Active agreement linking contact to plan |
| Billing Cycle | Anchor date, next invoice, grace period |
| Usage Meter | Optional consumption-based charges |
| Dunning | Failed payment retry and suspension rules |

## Lifecycle

```
Trial → Active → Past Due → Suspended → Cancelled → Expired
                  ↑ retry success
```

State transitions emit events for CRM follow-up and service access control.

## Billing Integration

| Step | System |
|------|--------|
| Renewal due | Queue job creates Sales invoice |
| Payment success | Accounting journal entry, extend period |
| Payment failure | Dunning sequence, notify customer |
| Plan change | Proration invoice/credit, update entitlements |

Payment methods stored via Core payment tokenization (PCI-compliant).

## Entitlements

Feature flags and quotas per plan tier. Other modules check `subscription_entitlements` before granting access (e.g. AI token budget, user seats, module activation).

## User Roles

| Role | Access |
|------|--------|
| Subscription Admin | Plans, pricing, dunning config |
| Billing Manager | Invoices, refunds, manual adjustments |
| Customer (portal) | View plan, payment method, cancel |

Permission namespace: `subscription.*`

## Database Tables

Prefix: `subscription_*`

| Table | Purpose |
|-------|---------|
| `subscription_plans` | Plan definitions |
| `subscription_plan_features` | Feature/limits per plan |
| `subscription_subscriptions` | Active subscriptions |
| `subscription_items` | Line items (add-ons) |
| `subscription_invoices` | Links to Sales invoices |
| `subscription_usage_records` | Metered usage |
| `subscription_dunning_logs` | Payment retry history |
| `subscription_entitlements` | Resolved access per subscription |

## API Endpoints

Base path: `/api/v1/subscription/` — CRUD plans, subscribe, cancel, upgrade, usage report.

## Events

| Event | Subscribers |
|-------|-------------|
| `subscription.created` | CRM, Notification |
| `subscription.renewed` | Accounting, AI (usage reset) |
| `subscription.payment_failed` | Notification, CRM |
| `subscription.cancelled` | Access control, BI |

## Dependencies

- **Core:** Contacts, Companies, Workflow, Queue, Settings
- **Modules:** Sales, Accounting, Ecommerce, CRM, BI System

## Future Enhancements

- Multi-currency plan pricing with FX on renewal
- Partner/reseller subscription management
- ASC 606 revenue schedule automation

---

**Module:** Subscription  
**Last Updated:** 2026-06-12
