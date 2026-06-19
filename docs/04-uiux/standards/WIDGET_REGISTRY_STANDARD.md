# AgainERP — Widget Registry Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 09 — Dashboard Framework Architecture  
> **Authority:** [DASHBOARD_FRAMEWORK_ARCHITECTURE.md](./DASHBOARD_FRAMEWORK_ARCHITECTURE.md)

---

## Purpose

Standard metadata contract for **every dashboard widget** registered in the Global Dashboard Engine (Layer 01).

## When To Read

Read when registering a new widget from a module or industry package.

## Related Files

- [DASHBOARD_LAYOUT_ENGINE.md](./DASHBOARD_LAYOUT_ENGINE.md) — grid constraints per widget
- [MODULE_DASHBOARD_STANDARD.md](./MODULE_DASHBOARD_STANDARD.md) — required module widgets
- [06-ai/platform/ai/AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) — AI widget tools

## Read Next

Register one widget using §2 schema — do not bulk-read all examples.

---

## 1. Registry Principles

| Rule | Detail |
|------|--------|
| **Central catalog** | Layer 01 merges all module widget manifests |
| **Unique ID** | `{module}.{widget}` globally unique |
| **Permission-gated** | Catalog hides widgets user cannot access |
| **Data via services** | Widgets fetch through module API / platform services |
| **No orphan widgets** | Every widget has module owner and doc link |
| **Mobile flag** | Explicit `mobileSupport` — not assumed |

---

## 2. Required Widget Metadata

Every widget **must** declare:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **widgetId** | string | yes | Unique ID — `{module}.{name}` e.g. `sales.pipeline-value` |
| **widgetName** | string | yes | Display name |
| **widgetCategory** | enum | yes | See §3 |
| **moduleOwner** | string | yes | Module ID from [MODULE_REGISTRY.md](../../MODULE_REGISTRY.md) |
| **permissions** | string[] | yes | RBAC keys — all required to show widget |
| **dataSource** | object | yes | See §4 |
| **refreshStrategy** | enum | yes | See §5 |
| **mobileSupport** | enum | yes | `full` · `compact` · `none` |
| **aiSupport** | object | yes | See §6 |
| **description** | string | no | Catalog help text |
| **defaultSize** | object | no | `{ cols, rows }` — see layout engine |
| **minSize** / **maxSize** | object | no | Resize bounds |
| **dashboardTypes** | string[] | no | Which dashboard types may include widget |
| **docLink** | string | no | Module UI.md anchor or Menus spec |

### 2.1 Manifest example (conceptual)

```yaml
widgetId: sales.pipeline-value
widgetName: Pipeline Value
widgetCategory: kpi
moduleOwner: sales
permissions:
  - sales.opportunity.view
dataSource:
  type: api
  endpoint: /api/v1/sales/metrics/pipeline-value
  scope: company
refreshStrategy: interval
refreshIntervalSec: 300
mobileSupport: compact
aiSupport:
  enabled: true
  insightTool: sales.ai.pipeline-insight
  naturalLanguageLabel: "Explain pipeline change"
defaultSize: { cols: 3, rows: 2 }
dashboardTypes: [dash.module, dash.role, dash.executive]
docLink: 03-business-modules/sales/UI.md#dashboard-widgets
```

---

## 3. Widget Categories

| Category | ID | Typical content |
|----------|-----|-----------------|
| Analytics | `analytics` | Multi-metric cards, comparison periods |
| KPI | `kpi` | Single value + delta + target |
| Chart | `chart` | time-series, distribution |
| List | `list` | Top N entities |
| Table | `table` | Mini tabular data |
| Calendar | `calendar` | Events, leave, bookings |
| Activity | `activity` | Feed, timeline |
| AI | `ai` | Brief, recommendations, scores |
| Alert | `alert` | SLA, threshold, approval pending |
| Report | `report` | Snapshot from Reports.md screen |
| Quick Action | `quick_action` | Create · navigate · approve buttons |

---

## 4. Data Source Standard

| Field | Description |
|-------|-------------|
| `type` | `api` · `event` · `static` · `composite` |
| `endpoint` | REST path when `type: api` |
| `scope` | `user` · `company` · `branch` · `tenant` |
| `params` | Default query params |
| `cacheTtlSec` | Optional client cache hint |

**Rules:**

- API calls include tenant + workspace context headers
- Cross-module metrics use **platform aggregation services** — not cross-module JOIN
- Static widgets (quick actions) omit endpoint

---

## 5. Refresh Strategy

| Strategy | ID | When to use |
|----------|-----|-------------|
| Manual | `manual` | User refresh only |
| On focus | `on_focus` | When dashboard tab visible |
| Interval | `interval` | Polling — require `refreshIntervalSec` |
| Event-driven | `event` | Push via websocket / SSE — require `eventTypes[]` |
| Real-time | `realtime` | High-frequency — POS, inventory alerts |

Default for KPI: `interval` 300s. Default for Quick Action: `manual`.

---

## 6. AI Support Standard

| Field | Description |
|-------|-------------|
| `enabled` | boolean |
| `insightTool` | AI OS tool ID for "explain this widget" |
| `naturalLanguageLabel` | Button label |
| `creditCost` | Optional credit hint for UI |

When `enabled: false`, widget renders without AI chrome.

AI widgets (`category: ai`) **must** declare `insightTool` or platform agent ID.

---

## 7. Mobile Support

| Value | Behavior |
|-------|----------|
| `full` | Same widget in mobile grid |
| `compact` | Reduced card — KPI number + trend only |
| `none` | Hidden on mobile — desktop only |

Module dashboards must have ≥3 `full` or `compact` widgets for mobile compliance — [MOBILE_DASHBOARD_ARCHITECTURE.md](./MOBILE_DASHBOARD_ARCHITECTURE.md).

---

## 8. Registration Process

| Step | Action |
|------|--------|
| 1 | Define widget in module `UI.md` § Dashboard Widgets |
| 2 | Add manifest entry to `ModuleManifest.md` → `dashboard.widgets[]` |
| 3 | Implement data contract in module `API.md` (metrics endpoint) |
| 4 | Platform merges at deploy — catalog updated |
| 5 | Log in module `CHANGELOG.md` |

---

## 9. Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Widget ID | `{module}.{kebab-name}` | `crm.lead-conversion` |
| Display name | Title Case | Lead Conversion Rate |
| Metric endpoints | `/api/v1/{module}/metrics/{slug}` | `/api/v1/crm/metrics/lead-conversion` |

---

## 10. Compliance Checklist

| # | Check |
|---|-------|
| 1 | All 9 required metadata fields present |
| 2 | Permissions align with `Permissions.md` |
| 3 | dataSource uses module API or platform service |
| 4 | mobileSupport explicitly set |
| 5 | aiSupport object present (enabled true/false) |
| 6 | Registered in ModuleManifest |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 09 — widget registry standard |

---

**Widget Registry Standard** — one ID, one owner, one data contract per widget.
