# Business Settings

> **Status:** Ready (Prototype)  
> **Module:** Core Platform  
> **Route:** `/settings` · `/settings/[category]`  
> **Architecture:** [SETTINGS_ARCHITECTURE.md](../../modules/core/SETTINGS_ARCHITECTURE.md)  
> **Code:** `apps/web/src/components/settings/business-settings-home.tsx` · `business-settings-category.tsx`

---

## Purpose

Launcher-style Business Settings hub for daily store configuration — Store, Catalog, Customers, Orders, Checkout, Payments, Shipping, Marketing, SEO, Notifications.

## UI Layout (As Built)

**Launcher — `/settings`**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ Business Settings ] [ Workspace ] [ Control Center ]                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ░ Hero — title, stats pills, search                                         │
├──────────────────────────────────────────────┬──────────────────────────────┤
│ Store & Operations                           │ Recent Changes               │
│ [Store] [Catalog] [Customers] [Orders]       │ · Guest Checkout enabled     │
│                                              │ · COD verification           │
│ Checkout & Fulfillment                       │                              │
│ [Checkout] [Payments] [Shipping]             │ Activity & Audit callout     │
│                                              │                              │
│ Marketing & Visibility                       │                              │
│ [Marketing] [SEO] [Notifications]            │                              │
└──────────────────────────────────────────────┴──────────────────────────────┘
```

**Category — `/settings/store` (example)**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Business Settings    [Activity] [History] [Reset]                         │
│ 🏪 Store                                                                    │
├──────────────┬──────────────────────────────────────────────────────────────┤
│ Sections     │ Change reason (optional)                                     │
│ · Identity ● │ ┌ General ────────────────────────────────────────────────┐  │
│ · Branding   │ │ Store Name          [AgainERP Commerce        ]           │  │
│              │ │ Email               [sales@again.com.bd       ]           │  │
│              │ └─────────────────────────────────────────────────────────┘  │
└──────────────┴──────────────────────────────────────────────────────────────┘
│ Sticky bar (when dirty): 2 unsaved changes          [Discard] [Save Changes]│
└─────────────────────────────────────────────────────────────────────────────┘
```

## Components Built

| Component | Detail |
|-----------|--------|
| `BusinessSettingsHome` | Hero, grouped launcher cards, search, recent changes sidebar |
| `BusinessSettingsCategory` | Section sidebar nav, grouped form panels, sticky save bar |
| `SettingFieldRow` | Shared field row — toggle switch, text, number, select, textarea |
| `settings-config.ts` | Category icons, accent colors, launcher groups |

## Category Groups

| Group | Categories |
|-------|------------|
| Store & Operations | Store, Catalog, Customers, Orders |
| Checkout & Fulfillment | Checkout, Payments, Shipping |
| Marketing & Visibility | Marketing, SEO, Notifications |

## Field Types

| Type | Control |
|------|---------|
| toggle | Radix switch + Enabled/Disabled label |
| text | Input |
| textarea | Multi-line |
| number | Numeric input |
| select | Dropdown |

## Actions

| Action | Behavior |
|--------|----------|
| Category card | Navigate to `/settings/[category]` |
| Section nav | Switch active section panel |
| Save Changes | Persist to Zustand + change history |
| Reset | Restore category defaults |
| History | Inline audit list (old → new, user, date, reason) |
| Activity | Global activity drawer |

## Change History

| Date | Change |
|------|--------|
| 2026-06-13 | Business Settings UI Phase 1 — launcher + category workspace |
