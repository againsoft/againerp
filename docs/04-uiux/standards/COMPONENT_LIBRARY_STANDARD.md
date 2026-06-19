# AgainERP — Component Library Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 10 — Enterprise Design System & UI Foundation  
> **Authority:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md)

---

## Purpose

Catalog of **foundation UI components** — IDs, variants, states, and usage rules. All modules use these components; no custom variants without platform approval.

## When To Read

Read when documenting a screen in Menus/ or referencing a UI control in prototype guides.

## Related Files

- [DESIGN_TOKEN_STANDARD.md](./DESIGN_TOKEN_STANDARD.md)
- [FORM_STANDARD.md](./FORM_STANDARD.md)
- [DRAWER_MODAL_STANDARD.md](./DRAWER_MODAL_STANDARD.md)
- [AI_COMPONENT_STANDARD.md](./AI_COMPONENT_STANDARD.md)
- [EMPTY_STATE_STANDARD.md](./EMPTY_STATE_STANDARD.md)
- [LOADING_STATE_STANDARD.md](./LOADING_STATE_STANDARD.md)
- [QUICK_ACTION_FRAMEWORK_STANDARD.md](./QUICK_ACTION_FRAMEWORK_STANDARD.md)

## Read Next

One component family below — not the full catalog.

---

## 1. Component ID Convention

```text
DS-{FAMILY}-{NAME}
```

Examples: `DS-BTN-PRIMARY` · `DS-INPUT-TEXT` · `DS-CARD-DEFAULT`

---

## 2. Buttons (`DS-BTN-*`)

| ID | Variant | Usage |
|----|---------|-------|
| `DS-BTN-PRIMARY` | Primary | One main action per section |
| `DS-BTN-SECONDARY` | Secondary | Cancel, back |
| `DS-BTN-DANGER` | Danger | Delete — confirm required |
| `DS-BTN-GHOST` | Ghost | Toolbar, table rows |
| `DS-BTN-LINK` | Link | Inline navigation |

| Size | Height | Usage |
|------|--------|-------|
| `sm` | 32px | Dense tables |
| `md` | 40px | Default |
| `lg` | 48px | Mobile primary CTA |

**States:** default · hover · focus · active · disabled · loading (spinner, width preserved)

**Rules:** One primary per section · destructive never primary · min 44px tap on mobile CTAs

---

## 3. Inputs (`DS-INPUT-*`)

| ID | Type |
|----|------|
| `DS-INPUT-TEXT` | Single-line text |
| `DS-INPUT-TEXTAREA` | Multi-line, auto-grow |
| `DS-INPUT-NUMBER` | Numeric with optional steppers |
| `DS-INPUT-SEARCH` | Search with clear button |
| `DS-INPUT-PASSWORD` | Masked with reveal toggle |

**States:** default · focus · error · disabled · read-only  
**Validation:** Inline error below field · error summary at form top for submit

Detail: [FORM_STANDARD.md](./FORM_STANDARD.md)

---

## 4. Selects (`DS-SELECT-*`)

| ID | Usage |
|----|-------|
| `DS-SELECT-SINGLE` | Single choice |
| `DS-SELECT-MULTI` | Multi with chips |
| `DS-SELECT-COMBOBOX` | Searchable select |
| `DS-SELECT-RELATION` | FK picker + quick create |

**Mobile:** Native select where appropriate · custom combobox on desktop

---

## 5. Checkbox · Radio · Switch

| ID | Usage |
|----|-------|
| `DS-CHECKBOX` | Multi-select boolean group |
| `DS-RADIO` | Single choice in group |
| `DS-SWITCH` | Immediate boolean toggle |

**Rules:** Fieldset legend for groups · error at group level · label clickable

---

## 6. Tags · Badges

| ID | Usage |
|----|-------|
| `DS-TAG` | Removable filter, category |
| `DS-BADGE` | Count, status pill |
| `DS-BADGE-STATUS` | Entity status — [status-system.md](./status-system.md) |

---

## 7. Alerts (`DS-ALERT-*`)

| Variant | Usage |
|---------|-------|
| `info` | Neutral information |
| `success` | Completed action |
| `warning` | Attention needed |
| `danger` | Error, blocking issue |

**Placement:** Page-level below header · inline in forms · toast for transient — [notifications.md](./notifications.md)

---

## 8. Cards (`DS-CARD-*`)

| ID | Usage |
|----|-------|
| `DS-CARD-DEFAULT` | Content grouping |
| `DS-CARD-KPI` | Dashboard metric |
| `DS-CARD-INTERACTIVE` | Clickable summary → drill |
| `DS-CARD-EMPTY` | Empty state with CTA |

**Padding:** `--space-4` mobile · `--space-6` desktop · `--radius-md` · `--shadow-sm`

---

## 9. Component Families (Extended Standards)

| Family | Document |
|--------|----------|
| Data (tables, filters, export) | [TABLE_AND_DATA_GRID_STANDARD.md](./TABLE_AND_DATA_GRID_STANDARD.md) |
| Forms | [FORM_STANDARD.md](./FORM_STANDARD.md) |
| Overlays | [DRAWER_MODAL_STANDARD.md](./DRAWER_MODAL_STANDARD.md) |
| AI | [AI_COMPONENT_STANDARD.md](./AI_COMPONENT_STANDARD.md) |
| Empty / loading | [EMPTY_STATE_STANDARD.md](./EMPTY_STATE_STANDARD.md) · [LOADING_STATE_STANDARD.md](./LOADING_STATE_STANDARD.md) |
| Productivity (kanban, calendar, feed) | §10 below + [activity-system.md](./activity-system.md) |

---

## 10. Productivity Components (Summary)

| ID | Component | Standard ref |
|----|-----------|--------------|
| `DS-KANBAN-BOARD` | Pipeline columns | PAGE_LAYOUT list/kanban |
| `DS-CALENDAR` | Month/week/day | PAGE_LAYOUT |
| `DS-TIMELINE` | Audit / history | activity-system |
| `DS-ACTIVITY-FEED` | Chatter stream | activity-system |
| `DS-COMMENTS` | Thread comments | activity-system |
| `DS-ATTACHMENTS` | File list + upload | activity-system |

---

## 11. Empty & Loading Components (Summary)

| ID | Component | Standard ref |
|----|-----------|--------------|
| `DS-EMPTY-*` | Empty state variants | EMPTY_STATE_STANDARD |
| `DS-CARD-EMPTY` | Empty card block | EMPTY_STATE · §8 Cards |
| `DS-SKELETON-*` | Skeleton placeholders | LOADING_STATE_STANDARD |
| `DS-LOADING-*` | Spinners · progress · page load | LOADING_STATE_STANDARD |

---

## 12. Accessibility (All Components)

| Requirement | Rule |
|-------------|------|
| Focus visible | `--color-focus-ring` |
| Labels | Every input has visible or aria label |
| Color | Not sole indicator of state |
| Keyboard | Full operability |
| Contrast | WCAG 2.1 AA |

---

## 13. Module Rules

```text
✅ Use DS-* components from this catalog
✅ Compose screens from PAGE_LAYOUT + components
❌ Module-specific button or input styling
❌ Duplicate component with new name
❌ Skip token references in Menus specs
```

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10 — component library standard |
| 2026-06-19 | 1.1 | Step 10.1A — empty and loading component summary |

---

**Component Library Standard** — DS-* IDs, one catalog, every module.
