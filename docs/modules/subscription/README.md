# Subscription Module

> **Status:** Draft  
> **Phase:** 8 — Enterprise Layer (Step 73)  
> **Platform:** [SAAS_PLATFORM_ARCHITECTURE.md](../../SAAS_PLATFORM_ARCHITECTURE.md)

---

## Overview

Subscription module implements **recurring billing** within the AgainERP SaaS Platform — plans, renewals, dunning, entitlements, and usage metering.

---

## Documents

| Document | Purpose |
|----------|---------|
| [SAAS_PLATFORM_ARCHITECTURE.md](../../SAAS_PLATFORM_ARCHITECTURE.md) | Full SaaS platform (canonical) |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Subscription module implementation |

---

## Platform Integration

| Platform Concern | Module Role |
|------------------|-------------|
| Plans | `subscription_plans` ↔ `platform_plans` |
| Subscriptions | `subscription_subscriptions` ↔ `platform_subscriptions` |
| Entitlements | Feature flags for business modules |
| Usage metering | `subscription_usage_records` |

---

**Last Updated:** 2026-06-12
