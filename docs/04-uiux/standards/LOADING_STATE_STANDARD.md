# AgainERP — Loading State Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 10.1A — Design System Enhancement  
> **Authority:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md)

---

## Purpose

Define **loading and progress** patterns — skeleton, page load, widget refresh, optimistic updates, long-running tasks, and real-time updates.

## When To Read

Read when documenting data-fetch behaviour in Menus specs or dashboard widgets.

## Related Files

- [DESIGN_TOKEN_STANDARD.md §9–10](./DESIGN_TOKEN_STANDARD.md) — opacity · motion tokens
- [WORKSPACE_COMPONENT_REGISTRY.md](./WORKSPACE_COMPONENT_REGISTRY.md) — `WS-OVERLAY-SKELETON`
- [TABLE_AND_DATA_GRID_STANDARD.md §10](./TABLE_AND_DATA_GRID_STANDARD.md#10-empty--loading-states)
- [DASHBOARD_FRAMEWORK_ARCHITECTURE.md](./DASHBOARD_FRAMEWORK_ARCHITECTURE.md)

## Read Next

§2 **Loading patterns overview**.

---

## 1. Component IDs

| ID | Usage |
|----|-------|
| `DS-SKELETON-TEXT` | Line placeholders |
| `DS-SKELETON-ROW` | Table/card row |
| `DS-SKELETON-CARD` | KPI / widget block |
| `DS-SKELETON-AVATAR` | Circular placeholder |
| `DS-LOADING-PAGE` | Full content area skeleton |
| `DS-LOADING-SPINNER` | Inline button / field spinner |
| `DS-LOADING-PROGRESS` | Determinate bar |
| `DS-LOADING-OVERLAY` | Blocking section overlay |

**Shell registry:** `WS-OVERLAY-SKELETON`

**Token:** `--opacity-skeleton` · `--duration-normal` — [DESIGN_TOKEN_STANDARD.md](./DESIGN_TOKEN_STANDARD.md)

---

## 2. Loading Patterns Overview

| Pattern | When | Component |
|---------|------|-----------|
| **Skeleton loading** | Initial content fetch | `DS-SKELETON-*` |
| **Page loading** | Route transition / first paint | `DS-LOADING-PAGE` |
| **Widget loading** | Dashboard widget data fetch | `DS-SKELETON-CARD` |
| **Background refresh** | Stale-while-revalidate | Subtle opacity or header indicator |
| **Partial refresh** | Filter change · pagination | Table body skeleton only |
| **Optimistic updates** | Safe immediate UI update | Inline pending state |
| **Long-running tasks** | Import · export · bulk AI | Progress modal |
| **Progress indicators** | Multi-step operations | `DS-LOADING-PROGRESS` |
| **Real-time updates** | Live counters · notifications | Pulse badge — no full reload |

---

## 3. Skeleton Loading

| Rule | Detail |
|------|--------|
| Prefer skeleton over spinner | For layout-known content (tables, cards, forms) |
| Match layout | Skeleton mirrors final content shape |
| Row count | 5–8 skeleton rows for lists |
| Shimmer | Optional; respect `prefers-reduced-motion` |
| Duration | Show skeleton after 100ms delay — avoid flash on fast API |
| Min display | 300ms minimum when shown — prevents flicker |

---

## 4. Page Loading

| Rule | Detail |
|------|--------|
| Shell persists | Header · sidebar remain visible — only Zone D skeletonizes |
| Breadcrumb | Show immediately from route — skeleton title below |
| No blank flash | Never white screen between routes |
| Error | Replace skeleton with inline retry — not infinite spinner |
| Context switch | Full Zone D skeleton on company/branch switch |

Detail: [PAGE_LAYOUT_STANDARD.md](./PAGE_LAYOUT_STANDARD.md)

---

## 5. Widget Loading

| Rule | Detail |
|------|--------|
| Per-widget | Each dashboard widget loads independently |
| Skeleton | `DS-SKELETON-CARD` inside widget chrome |
| Error boundary | Widget error does not crash dashboard grid |
| Refresh | Manual refresh icon on widget header — optional auto per registry |
| Stale data | Show last data with subtle "Updating…" badge during background refresh |

Detail: [WIDGET_REGISTRY_STANDARD.md](./WIDGET_REGISTRY_STANDARD.md) · [DASHBOARD_ARCHITECTURE_LOCK.md](../../DASHBOARD_ARCHITECTURE_LOCK.md)

---

## 6. Background Refresh

| Rule | Detail |
|------|--------|
| Strategy | Stale-while-revalidate — show cached data immediately |
| Indicator | Small spinner in toolbar or "Updated 2m ago" timestamp |
| Lists | Do not replace rows until new data arrives — optional row opacity 0.6 |
| Filters | Debounce 300ms then partial skeleton on table body only |
| User action | Save/submit always shows explicit loading on button |

---

## 7. Partial Refresh

| Area | Behaviour |
|------|-----------|
| Table body | Skeleton rows; header and toolbar stay |
| Drawer form | Field-level spinner on async validation only |
| Chart | Skeleton chart area; filters remain interactive |
| Pagination | Skeleton next page rows — no full page reload |
| Bulk action | Progress bar in bulk action bar |

---

## 8. Optimistic Updates

Use only when rollback is safe and user expects instant feedback.

| Safe for | Not safe for |
|----------|--------------|
| Toggle boolean field | Financial postings |
| Reorder kanban card | Inventory quantity changes |
| Mark notification read | Delete record |
| Pin dashboard widget | Bulk delete |

| Rule | Detail |
|------|--------|
| UI | Apply change immediately · show subtle pending indicator |
| Failure | Revert UI · toast error with retry |
| Button | `DS-BTN-PRIMARY` loading state during confirm |

---

## 9. Long-Running Tasks

| Task type | UI |
|-----------|-----|
| Import CSV | Modal with `DS-LOADING-PROGRESS` + row count |
| Export large dataset | Toast "Preparing export…" → download link |
| Bulk AI tag | Non-blocking banner + progress |
| Report generation | Analytics layout progress overlay |

| Rule | Detail |
|------|--------|
| Cancel | Allow cancel when backend supports abort |
| Background | User may navigate away — notify on completion |
| Notification | Bell entry when task completes off-page |

---

## 10. Progress Indicators

| Type | Usage |
|------|-------|
| Indeterminate spinner | Unknown duration · inline actions |
| Determinate bar | Known steps — import, upload |
| Step indicator | Multi-step modal wizard |
| Percentage label | Show when backend reports progress |

**Accessibility:** `aria-busy="true"` on loading regions · `aria-live="polite"` for completion messages.

---

## 11. Real-Time Updates

| Pattern | UI |
|---------|-----|
| Notification count | Badge pulse on bell — no page reload |
| Live KPI widget | Widget self-refreshes per registry interval |
| Activity feed | Append new items with slide-in |
| Collaborative edit | "User X is editing" banner — future |

**Rule:** Real-time updates must not steal focus or interrupt active form entry.

---

## 12. Performance Targets

| Interaction | Target |
|-------------|--------|
| Perceived list load | Skeleton within 100ms |
| Drawer open | Content or skeleton within 200ms |
| Button action | Loading state within 50ms |
| Background refresh | No layout shift |

Aligned with DESIGN_SYSTEM_FOUNDATION **Fast** principle.

---

## 13. Menus Spec Requirements

```yaml
loading:
  initial: skeleton-rows
  partial_refresh: table-body-only
  optimistic: false          # true only if documented safe
  long_running: import-modal # if import supported
  widget_refresh: interval 300s  # dashboard widgets only
```

---

## 14. Module Compliance

```text
✅ Use DS-SKELETON-* for known layouts
✅ Keep shell visible during page load
✅ Widget-level error boundaries on dashboards
❌ Full-page spinner replacing entire shell
❌ Optimistic updates on financial/inventory mutations without approval
❌ Infinite loading with no error state
```

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10.1A — loading state standard |

---

**Loading State Standard** — skeleton-first, stale-while-revalidate, safe optimism.
