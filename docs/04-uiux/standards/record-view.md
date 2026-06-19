# Record View Design

> **Status:** Draft  
> **Parent:** [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **Smart buttons:** [smart-buttons.md](./smart-buttons.md)  
> **Related:** [forms.md](./forms.md) · [activity-system.md](./activity-system.md)

---

## Purpose
Global UI standard: record view.

## When To Read
Read only if working on UI patterns related to record view.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

Standard **single-record** layout for Product, Order, Customer, Invoice, Employee, and all primary entities. Odoo form view pattern with AgainERP's mobile-first polish.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER                                                                  │
│ [Draft] Blue Cotton T-Shirt          [Publish] [Duplicate] [Archive] [⋯]│
├─────────────────────────────────────────────────────────────────────────┤
│ RECORD SUMMARY STRIP                                                    │
│ SKU: TSH-001  ·  Price: ৳599  ·  Stock: 142  ·  Category: Apparel      │
├──────────────────────────────────────┬──────────────────────────────────┤
│ TABS                                 │ CHATTER PANEL                    │
│ [General][SEO][Inventory][Pricing]   │ [Activities][Notes][Comments]    │
│ [Media][History]                     │ [Attachments][Timeline]          │
│ ──────────────────────────────────── │ ──────────────────────────────── │
│ Tab content                          │ Panel content                    │
└──────────────────────────────────────┴──────────────────────────────────┘
```

---

## Smart Buttons

Below header — Odoo-style stat pills. See [smart-buttons.md](./smart-buttons.md).

```
Orders 24 · Reviews 8 · Inventory 142 · SEO 85 · Views 1.2k · Returns 2
```

---

## Header

| Element | Rule |
|---------|------|
| Status badge | Left of title — [status-system.md](./status-system.md) tokens |
| Title | Record display name, `--text-xl` |
| Smart buttons | Optional stat pills (e.g. "3 Orders", "12 Activities") — Odoo-style |
| Primary actions | Right-aligned, max 3 visible |
| More menu | Archive, delete, print, export |

---

## Record Summary Strip

Horizontal key fields below header — **read-only snapshot** of most important data.

| Entity | Summary Fields |
|--------|----------------|
| Product | SKU, price, stock, category, status |
| Order | Order #, customer, total, payment status, fulfillment |
| Customer | Email, phone, group, lifetime value, last order |
| Page | URL slug, status, template, last edited |

Collapses to 2-line stack on mobile.

---

## Tabs

| Rule | Detail |
|------|--------|
| Max visible | 7 tabs; overflow in "More" dropdown |
| Order | General first, History/Activities last |
| Badges | Show count on tabs with pending items (e.g. "Returns (2)") |
| Persistence | Remember last active tab per user per entity type |
| Mobile | Horizontal scroll tab bar |

### Standard Tab Sets

**Product:** General · Variants · Pricing · Inventory · SEO · Media · Reviews · History

**Order:** General · Items · Payment · Shipping · Returns · Timeline · Activities

**Customer:** General · Addresses · Orders · Wallet · Wishlist · Activities · History

Defined per module in `UI.md` — never invent ad-hoc tab names.

---

## Form Behavior Within Tabs

- **Autosave** on draft records every 30 seconds
- **Dirty state** indicator in header when unsaved
- **Discard** reverts to last saved
- **Save** explicit on published records
- **Validation** inline per [forms.md](./forms.md)

---

## Chatter Panel

Right column on desktop; bottom sheet on mobile. See [activity-system.md](./activity-system.md).

| Tab | Priority |
|-----|----------|
| Timeline | Default — all events chronologically |
| Activities | Scheduled tasks |
| Notes | Internal staff notes |
| Comments | Threaded with @mentions |
| Attachments | File list + upload |

---

## List → Record Navigation

| Action | Behavior |
|--------|----------|
| Row click | Open record view |
| `Enter` on focused row | Open record view |
| `Ctrl+Click` | Open in new tab |
| Back | Return to list preserving filters |

---

## Permissions

| State | UI |
|-------|-----|
| Read only | All inputs disabled; actions hidden |
| Field ACL | Specific fields masked or hidden |
| No access | 403 page — never partial leak |
