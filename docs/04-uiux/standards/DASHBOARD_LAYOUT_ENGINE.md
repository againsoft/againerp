# AgainERP — Dashboard Layout Engine

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 09 — Dashboard Framework Architecture  
> **Authority:** [DASHBOARD_FRAMEWORK_ARCHITECTURE.md](./DASHBOARD_FRAMEWORK_ARCHITECTURE.md)

---

## Purpose

Rules for the **Global Dashboard Engine** layout system — grid columns, responsive behavior, widget sizing, templates, and saved layouts.

## When To Read

Read when defining widget default sizes or documenting dashboard personalization.

## Related Files

- [WIDGET_REGISTRY_STANDARD.md](./WIDGET_REGISTRY_STANDARD.md) — widget size metadata
- [WORKSPACE_LAYOUT_MAP.md](./WORKSPACE_LAYOUT_MAP.md) — content area dimensions
- [dashboard-widgets.md](./dashboard-widgets.md) — legacy grid notes

## Read Next

§3 **Grid system** if registering widgets; §6 **Personalization** if defining role defaults.

---

## 1. Engine Responsibilities (Layer 01)

| Function | Description |
|----------|-------------|
| Render grid | Column layout per viewport |
| Place widgets | Position from saved layout manifest |
| Resize / move | Edit mode interactions |
| Persist layouts | User · role · department stores |
| Apply templates | Pre-built layouts per dashboard type |
| Enforce bounds | min/max per widget from registry |
| Responsive reflow | Mobile column collapse |

---

## 2. Column Layouts

Supported **desktop** column presets:

| Preset | ID | Columns | Typical use |
|--------|-----|---------|-------------|
| **1 Column** | `layout.1col` | 1 | Mobile · focused AI brief |
| **2 Column** | `layout.2col` | 2 | Simple module dashboard |
| **3 Column** | `layout.3col` | 3 | Standard module dashboard |
| **4 Column** | `layout.4col` | 4 | Executive · dense KPI |

**Underlying grid:** 12-column responsive grid (industry standard for ERP density).

| Viewport | Effective columns |
|----------|-------------------|
| ≥ 1280px | 12 cols (widgets span 1–12) |
| 1024–1279px | 12 cols, tighter gutters |
| 768–1023px | 6 cols effective |
| < 768px | 1 col stack — see [MOBILE_DASHBOARD_ARCHITECTURE.md](./MOBILE_DASHBOARD_ARCHITECTURE.md) |

---

## 3. Grid System

| Property | Value |
|----------|-------|
| Base columns | 12 |
| Row height unit | 80px base (widget `rows` × 80px) |
| Gutter | 16px mobile · 24px desktop |
| Min widget width | 2 cols |
| Max widget width | 12 cols |
| Min widget height | 1 row |
| Max widget height | 6 rows (default cap — registry may override) |

### 3.1 Widget span examples

| Widget type | defaultSize | Visual |
|-------------|-------------|--------|
| KPI | 3×2 cols×rows | Quarter width card |
| Chart | 6×3 | Half width |
| Activity feed | 4×4 | Tall side panel |
| Quick actions | 12×1 | Full width strip |
| AI Daily Brief | 12×2 | Full width banner |

---

## 4. Widget Interaction (Edit Mode)

| Action | Rule |
|--------|------|
| **Move** | Drag handle — snap to grid |
| **Resize** | Corner drag or S/M/L presets |
| **Add** | Pick from catalog modal — filtered by permission |
| **Remove** | Confirm if widget has unsaved drill state |
| **Pin** | Pinned widgets stay in row 1 until unpinned |

Edit mode toggled via dashboard **Customize** control — permission required.

---

## 5. Widget Templates

Pre-defined **widget bundles** for fast dashboard setup:

| Template ID | Contents | Used by |
|-------------|----------|---------|
| `tpl.module.standard` | KPI row + chart + activity + quick actions | Module dashboards |
| `tpl.role.sales-manager` | Pipeline KPIs + team leaderboard + tasks | Role dashboard |
| `tpl.executive.standard` | Revenue + cash + risk + AI summary | Executive |
| `tpl.workspace.home` | Brief + notifications + recent + quick actions | Workspace |
| `tpl.industry.hospital` | Beds + admissions + staff + alerts | Industry |

Templates are **starting layouts** — users personalize from template.

Modules may ship `dashboard.templateId` in manifest.

---

## 6. Personalization

### 6.1 User actions

| Action | Persisted as |
|--------|--------------|
| Add / remove / move / resize | Layout delta |
| Save layout | Named **dashboard view** |
| Reset layout | Restore role or template default |
| Create dashboard view | Clone + edit — private by default |

### 6.2 Layout resolution order

```text
1. User active dashboard view (if set)
2. User personalized default (if exists)
3. Role default layout
4. Department layout (if applicable)
5. Module / platform template fallback
```

### 6.3 Saved layouts

| Layout type | Scope | Sharable |
|-------------|-------|----------|
| Personal view | User | Optional share |
| Role default | Role | Admin edits |
| Department | Branch / dept | Dept admin |
| Platform template | Tenant | Super-admin |

---

## 7. Responsive Grid Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop | User-defined spans honored |
| Tablet | Widgets ≥6 cols reflow to 6 cols |
| Mobile | All widgets stack 1 col; `compact` variant if defined |

Widgets with `mobileSupport: none` omitted from mobile layout.

---

## 8. Dashboard Header Chrome

Shell-provided — not module custom:

| Control | Function |
|---------|----------|
| Title | Dashboard name |
| View switcher | Personal / role / shared views |
| Date range | Global filter for time-series widgets |
| Customize | Toggle edit mode |
| Refresh all | Force refresh interval widgets |
| Export | PDF / snapshot (executive dashboards) |

---

## 9. Performance Rules

| Rule | Detail |
|------|--------|
| Lazy load | Below-fold widgets load on scroll |
| Stagger refresh | Interval widgets offset to avoid thundering herd |
| Skeleton | All widgets show skeleton until first fetch |
| Error boundary | Widget failure isolated — not whole dashboard |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 09 — dashboard layout engine |

---

**Dashboard Layout Engine** — 12-column grid, four presets, templates, saved views.
