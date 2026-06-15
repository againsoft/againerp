# Page Architecture

> **Status:** Draft  
> **Parent:** [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **Related:** [layout-architecture.md](./layout-architecture.md) · [module-ui-standard.md](./module-ui-standard.md)

---

## Purpose

Standard page structure for **every** AgainERP screen — list, form, dashboard, report, settings.

---

## Universal Page Stack

```
1. Breadcrumb row
2. Page header (title + status + actions)
3. Optional: filter bar / tab bar
4. Main content
5. Optional: pagination footer
6. Optional: right utility panel (record views)
```

---

## Page Types

| Type | Content Area | Right Panel |
|------|--------------|-------------|
| **List** | Data table or card list | Hidden |
| **Create** | Form (draft) | Chatter (after save) |
| **Edit / Details** | Form + tabs | Chatter expanded |
| **Dashboard** | Widget grid | Hidden |
| **Report** | Chart/table/pivot | Hidden |
| **Settings** | Form sections | Hidden |

---

## Page Header

```
┌─────────────────────────────────────────────────────────────┐
│ Products                                    [Import] [+ New] │
│ 1,247 products · 3 drafts                                   │
└─────────────────────────────────────────────────────────────┘
```

| Element | Rule |
|---------|------|
| Title | `--text-xl`, entity plural or record name |
| Subtitle | Count, status summary, last updated |
| Primary action | Right-aligned, max 1 primary button |
| Secondary | Outline buttons |
| Overflow | `⋯ More` for export, archive, print |

---

## Breadcrumb

`AgainERP › Ecommerce › Catalog › Products`

Max 5 levels. Mobile: last 2 segments. See [navigation.md](./navigation.md).

---

## Filters (List Pages)

Below header, above content:

| Element | Position |
|---------|----------|
| Search input | Left |
| Quick filters | Chips (status, date) |
| Advanced filter | Button → panel |
| Saved filters | Dropdown |
| Column selector | Right |
| View toggle | Table / card (mobile) |

See [filters.md](./filters.md).

---

## Content Zones

| Zone | Padding | Scroll |
|------|---------|--------|
| Page | `--space-6` | Vertical |
| Card | `--radius-md` `--shadow-sm` | Internal if needed |
| Full-bleed table | Edge-to-edge in card | Horizontal on mobile |

---

## Right Utility Panel

On record pages only. Contains chatter + optional AI context.

| Viewport | Behavior |
|----------|----------|
| Desktop ≥ 1280px | Fixed 320px right column |
| Tablet | Collapsible FAB |
| Mobile | Bottom sheet |

---

## Footer (Optional)

Global footer when enabled:

- App version · Documentation link · Support · System status indicator
- Hidden on mobile to maximize content space

---

## Empty States

Every list page defines:

- Illustration or icon
- Title: "No products yet"
- Description: one-line help
- Primary CTA: "Create your first product"
