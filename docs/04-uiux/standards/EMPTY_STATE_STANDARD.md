# AgainERP — Empty State Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 10.1A — Design System Enhancement  
> **Authority:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md)

---

## Purpose

Define **empty state** patterns — when lists, dashboards, search, or integrations have no content, and what the user sees next.

## When To Read

Read when documenting list screens, dashboards, or integration settings in Menus specs.

## Related Files

- [COMPONENT_LIBRARY_STANDARD.md](./COMPONENT_LIBRARY_STANDARD.md) — `DS-CARD-EMPTY`
- [WORKSPACE_COMPONENT_REGISTRY.md](./WORKSPACE_COMPONENT_REGISTRY.md) — `WS-OVERLAY-EMPTY`
- [AI_COMPONENT_STANDARD.md](./AI_COMPONENT_STANDARD.md)
- [TABLE_AND_DATA_GRID_STANDARD.md §10](./TABLE_AND_DATA_GRID_STANDARD.md#10-empty--loading-states)
- [permission-aware-ui.md](./permission-aware-ui.md)

## Read Next

§2 **Empty state types**.

---

## 1. Component IDs

| ID | Usage |
|----|-------|
| `DS-EMPTY-DEFAULT` | Generic no-data |
| `DS-EMPTY-SEARCH` | No search/filter results |
| `DS-EMPTY-PERMISSION` | User lacks access |
| `DS-EMPTY-INTEGRATION` | Integration not connected |
| `DS-EMPTY-AI` | AI suggested first action |
| `DS-CARD-EMPTY` | Card wrapper for empty blocks |

**Shell registry:** `WS-OVERLAY-EMPTY` — module supplies copy and CTA; platform supplies layout.

---

## 2. Empty State Types

| Type ID | When | Primary message pattern |
|---------|------|-------------------------|
| `EMPTY-NO-DATA` | List has zero records (no filters) | "No {entities} yet" |
| `EMPTY-NO-RESULTS` | Search/filter returns zero rows | "No results match your filters" |
| `EMPTY-NO-PERMISSION` | User cannot view resource | "You don't have access" |
| `EMPTY-NO-INTEGRATION` | External service not configured | "Connect {service} to get started" |
| `EMPTY-NO-RECORDS` | Related records empty on detail tab | "No {related} linked" |
| `EMPTY-AI-SUGGEST` | AI recommends first action | "✨ Get started with AI" |
| `EMPTY-FIRST-RECORD` | Onboarding / first-run | "Create your first {entity}" |

---

## 3. Illustration Rules

| Rule | Detail |
|------|--------|
| Style | Simple line or flat icon — not photographic |
| Size | 120px mobile · 160px desktop max |
| Color | `--color-text-muted` — no full-color marketing art |
| Optional | Omit illustration on dense mobile list empty |
| Module | Module may supply entity-specific icon from registry |
| Dark mode | Illustration uses currentColor or token-aware SVG |

**Prohibition:** No module-specific illustration style forks — use platform empty layout.

---

## 4. Action Rules

| Type | Primary action | Secondary |
|------|----------------|-----------|
| `EMPTY-NO-DATA` | Create first record (`?create=1`) | Import (if supported) |
| `EMPTY-NO-RESULTS` | Clear filters | Adjust search |
| `EMPTY-NO-PERMISSION` | Request access (if enabled) | Go to home |
| `EMPTY-NO-INTEGRATION` | Connect integration | View docs |
| `EMPTY-NO-RECORDS` | Add related record | — |
| `EMPTY-AI-SUGGEST` | Run AI suggestion | Create manually |
| `EMPTY-FIRST-RECORD` | Create first record | Guided tour (optional) |

**Permission:** Hide primary CTA when user lacks create permission — show view-only message.

---

## 5. CTA Rules

| Rule | Detail |
|------|--------|
| Count | One primary CTA maximum |
| Button | `DS-BTN-PRIMARY` |
| Label | Verb + entity — "Create product" |
| Route | List page `?create=1` — drawer CRUD |
| Mobile | Full-width primary button |
| AI CTA | Opens `DS-AI-PANEL` or runs `DS-AI-ACTIONS` with preview |

---

## 6. AI Recommended Action

When module has `AI.md` and list is empty:

```text
┌─────────────────────────────────────┐
│        [illustration]               │
│   No products yet                   │
│   ✨ Let AI draft your first        │
│      catalog from a spreadsheet     │
│   [Upload file]  [Create manually]  │
└─────────────────────────────────────┘
```

| Rule | Detail |
|------|--------|
| Component | `DS-EMPTY-AI` + `DS-AI-SUGGESTIONS` |
| Fallback | Standard `EMPTY-FIRST-RECORD` when AI module off |
| Safety | AI bulk create requires preview + confirm |

---

## 7. Best Practice Examples

| Screen | Type | Copy | CTA |
|--------|------|------|-----|
| Product list (new tenant) | `EMPTY-FIRST-RECORD` | "No products yet" | Create product |
| Order search | `EMPTY-NO-RESULTS` | "No orders match 'pending'" | Clear filters |
| Payroll (no role) | `EMPTY-NO-PERMISSION` | "Payroll access required" | — |
| Shopify sync | `EMPTY-NO-INTEGRATION` | "Connect your store" | Connect Shopify |
| Customer → Orders tab | `EMPTY-NO-RECORDS` | "No orders for this customer" | Create order |
| CRM leads | `EMPTY-AI-SUGGEST` | "Import leads with AI" | Import CSV |

---

## 8. Layout Placement

| Context | Placement |
|---------|-----------|
| List page | Center of table body replacing rows |
| Dashboard widget | Inside widget card — `DS-CARD-EMPTY` |
| Drawer tab | Center of tab content |
| Settings section | Below section title |
| Command palette | "No results" inline — no illustration |

---

## 9. Menus Spec Requirements

```yaml
empty_state:
  type: EMPTY-FIRST-RECORD
  title: No products yet
  description: Add products to sell online and in-store.
  primary_action:
    label: Create product
    route: ?create=1
    permission: catalog.product.manage
  ai_action: optional — reference AI.md
  illustration: product-empty
```

---

## 10. Module Compliance

```text
✅ Declare empty_state in Menus specs for list screens
✅ Use DS-EMPTY-* / DS-CARD-EMPTY components
✅ Permission-gate CTAs
❌ Blank white space with no message
❌ Decorative-only empty screens without action
❌ Different empty layout per module
```

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10.1A — empty state standard |

---

**Empty State Standard** — seven types, one CTA, AI-aware first run.
