# AgainERP Settings Architecture

> **Status:** Approved  
> **Version:** 1.0  
> **Module:** Core Platform  
> **Document Type:** Enterprise Architecture  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · **Related:** [core/entities/settings.md](../../02-core-platform/entities/settings.md)

**No backend code.** Source of truth for the three-layer Settings architecture.

---

## Purpose

Define the complete Settings Architecture for AgainERP.

The goal is to provide:

- Simple Business Settings for clients
- Workspace Management Settings for administrators
- Hidden Platform Control Center for AgainERP
- Future-proof architecture for ERP, CRM, Ecommerce, SaaS, Marketplace, Hospital, School, Restaurant, and AI OS modules

---

## Design Philosophy

Settings should not become a dumping ground.

The platform follows a three-layer settings architecture.

```text
Business Settings
        ↓
Workspace Settings
        ↓
Platform Control Center
```

---

## Layer 1: Business Settings

**Purpose:** Daily business configuration.

**Accessible by:** Store Owner · Business Administrator · Authorized Staff

**Menu structure:**

```text
Settings

├ Store
├ Catalog
├ Customers
├ Orders
├ Checkout
├ Payments
├ Shipping
├ Marketing
├ SEO
├ Notifications
```

### Store

Store identity and business information.

| Setting | Description |
|---------|-------------|
| Store Name | Public store name |
| Logo | Brand logo |
| Favicon | Browser icon |
| Email | Contact email |
| Phone | Contact phone |
| Address | Business address |
| Business Hours | Operating hours |
| Invoice Prefix | Invoice numbering prefix |
| Order Prefix | Order numbering prefix |

### Catalog

**General:** Product Approval Required · Default Product Status · SKU Generation · Barcode Generation

**Specifications:** Specification Profiles · Profile Assignment Rules

**Reviews:** Enable Reviews · Review Approval · Verified Purchase Reviews

**Inventory Rules:** Allow Backorders · Show Out of Stock Products

**Import Rules:** CSV Import Rules · AI Mapping Rules

### Customers

Customer Registration · Guest Checkout · Email Verification · Phone Verification · Reward Points · Wallet System · Wishlist

### Orders

Order Workflow · Auto Confirmation · Auto Completion · Return Rules · Refund Rules · Invoice Rules

### Checkout

One Page Checkout · Guest Checkout · Minimum Order Amount · Maximum Order Amount · Coupon Support · Terms Agreement

### Payments

Cash On Delivery · Online Payment · Bank Transfer · Partial Payment · Payment Verification Rules

### Shipping

Shipping Zones · Free Shipping Rules · Delivery Methods · Delivery Time Slots

### Marketing

Coupons · Referral Program · Loyalty Program · Reward Points · Abandoned Cart Rules

### SEO

SEO URLs · Meta Templates · Sitemap Rules · Schema Settings · Robots Rules

### Notifications

Order Notifications · Customer Notifications · Review Notifications · Low Stock Notifications

---

## When To Read
Read only when working on SETTINGS ARCHITECTURE or modules that consume it.

## Related Files
- [Core hub](../ARCHITECTURE.md)

## Read Next
- [Core entities](../entities/README.md)
---


## Layer 2: Workspace Settings

**Purpose:** Business operations and organization management.

**Accessible by:** Administrators · Managers

**Menu structure:**

```text
Workspace

├ Users
├ Roles
├ Teams
├ Branches
├ Warehouses
├ Integrations
├ Workflows
├ Approvals
```

| Section | Scope |
|---------|--------|
| Users | User management, invitations, status control |
| Roles | Role creation, permission assignment |
| Teams | Team structure, team assignment |
| Branches | Multi-branch management |
| Warehouses | Warehouse configuration, locations, transfer rules |
| Integrations | Payment providers, shipping providers, external services |
| Workflows | Workflow definitions, states, transitions, triggers |
| Approvals | Approval policies, multi-level approvals, delegation rules |

---

## Layer 3: Platform Control Center

**Purpose:** Core platform intelligence and SaaS management.

**Visible only to:** AgainERP internal team — **not accessible to clients.**

**Menu structure:**

```text
Control Center

├ Licensing
├ Feature Manager
├ AI Center
├ Monitoring
├ Security
├ Updates
├ Analytics
├ Marketplace
```

| Section | Scope |
|---------|--------|
| Licensing | License status, domain binding, activation, subscription |
| Feature Manager | Module enable/disable, plan-based features |
| AI Center | AI providers, budget, usage, audit logs, prompts |
| Monitoring | Database, cache, queue, search, storage health |
| Security | Security policies, API security, tokens, access logs |
| Updates | Update channels, version control, release management |
| Analytics | Platform analytics, usage statistics, growth metrics |
| Marketplace | Marketplace configuration, module distribution, partners |

---

## Activity & Audit Integration

Every settings page must support:

```text
Activities
Comments
Notes
Attachments
History
```

**Example audit entry:**

```text
Guest Checkout

Old Value: Disabled
New Value: Enabled
Changed By: Admin
Date: 2026-06-13
Reason: Business Requirement
```

**Platform integration:** [ACTIVITY_CHATTER_ARCHITECTURE.md](./ACTIVITY_CHATTER_ARCHITECTURE.md)

---

## UI Guidelines

Settings use a **launcher-style interface**:

```text
Settings

Search Settings...

[ Store ]     [ Catalog ]    [ Customers ]  [ Orders ]
[ Checkout ]  [ Payments ]  [ Shipping ]   [ Marketing ]
[ SEO ]       [ Notifications ]
```

---

## Architecture Rule

Settings must **never** be hardcoded by module.

The platform uses a four-level hierarchy:

```text
Setting Category
    ↓
Setting Section
    ↓
Setting Group
    ↓
Setting Item
```

**Example:**

```text
Catalog
    ↓
Inventory Rules
    ↓
Stock Control
    ↓
Allow Backorders
```

This ensures future compatibility with ERP, CRM, Ecommerce, Marketplace, Hospital, School, Restaurant, Manufacturing, and AI OS without structural redesign.

**Storage model:** [core/entities/settings.md](../../02-core-platform/entities/settings.md)

---

## Final Principle

| Layer | Audience |
|-------|----------|
| Business Settings | Client facing |
| Workspace Settings | Organization management |
| Control Center | Platform intelligence |

This separation ensures better UX, security, SaaS control, scalability, and future-proof platform architecture.

---

## Prototype Routes (UI Phase 1)

| Layer | Route |
|-------|-------|
| Business Settings | `/settings` · `/settings/[category]` |
| Workspace | `/workspace` · `/workspace/[section]` |
| Control Center | `/control-center` · `/control-center/[section]` |
