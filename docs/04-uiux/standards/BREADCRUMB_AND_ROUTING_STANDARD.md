# AgainERP — Breadcrumb & Routing Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 08 — Navigation Architecture  
> **Authority:** [NAVIGATION_ARCHITECTURE.md](./NAVIGATION_ARCHITECTURE.md) · [ARCHITECTURE_DECISIONS §5.1](../../ARCHITECTURE_DECISIONS.md#51-crud--list--right-sheet-drawer)

---

## Purpose

Rules for **breadcrumbs**, **URL patterns**, and **Level 4 record routing** across all modules.

## When To Read

Read when defining routes in `Architecture.md`, `API.md`, or screen specs in `Menus/`.

## Related Files

- [MODULE_NAVIGATION_STANDARD.md](./MODULE_NAVIGATION_STANDARD.md) — module zones
- [WORKSPACE_NAVIGATION_RULES.md](./WORKSPACE_NAVIGATION_RULES.md) — legacy workspace rules (superseded for breadcrumbs by this doc)
- [navigation.md](./navigation.md) — keyboard shortcuts

## Read Next

§4 **Examples** — one module matching your task.

---

## 1. Breadcrumb Hierarchy

Breadcrumbs reflect **navigation levels** — not URL path depth alone.

```text
{Module} → {Feature} → {Record label} → {Sub-view}
   L1         L3            L4              L4 tab
```

| Segment | Source | Clickable |
|---------|--------|-----------|
| Module | Active module display name | Yes → module dashboard |
| Feature | Level 3 screen label | Yes → list route |
| Record | Record display name / # | Current page — not linked |
| Sub-view | Tab or related panel | Optional link |

**Workspace Home** prefix omitted unless user navigated from `/home`.

Component: `WS-CONTENT-BREADCRUMB`

---

## 2. Breadcrumb Rules

| Rule | Detail |
|------|--------|
| **Max depth** | 4 segments visible — collapse middle with `…` if longer |
| **Module first** | Always start with module name — not "Home" except workspace routes |
| **Feature match** | Feature segment = Level 3 menu label |
| **Record name** | Dynamic from record metadata — fallback to ID |
| **Drawer state** | Breadcrumb updates for `?view=` / `?edit=` — same feature segment |
| **Truncation** | Ellipsis middle segments on mobile — show module + record only |
| **No route leakage** | Breadcrumbs never expose internal API paths |

---

## 3. Standard URL Patterns

### 3.1 Module zones (Level 2)

| Zone | Pattern |
|------|---------|
| Dashboard | `/{prefix}/dashboard` |
| Reports index | `/{prefix}/reports` |
| Report detail | `/{prefix}/reports/{slug}` |
| Automation | `/{prefix}/automation` |
| Configuration | `/{prefix}/settings` |

### 3.2 Features (Level 3)

| View | Pattern |
|------|---------|
| List / default | `/{prefix}/{entity}` |
| Kanban | `/{prefix}/{entity}?view=kanban` |
| Calendar | `/{prefix}/{entity}?view=calendar` |

### 3.3 Records (Level 4) — drawer CRUD

| Action | Pattern |
|--------|---------|
| Create | `/{prefix}/{entity}?create=1` |
| View | `/{prefix}/{entity}?view={uuid}` |
| Edit | `/{prefix}/{entity}?edit={uuid}` |

**Forbidden for standard CRUD:**

```text
❌ /{prefix}/{entity}/new
❌ /{prefix}/{entity}/{id}/edit
```

### 3.4 Detail page (optional)

Heavy entities may use full-page detail:

```text
/{prefix}/{entity}/{uuid}           ← detail page
/{prefix}/{entity}/{uuid}/{tab}     ← tab deep link
```

Drawer vs full page declared in module `UI.md` per entity.

---

## 4. Breadcrumb Examples

### 4.1 Sales → Orders → Order → Invoice

| Step | Breadcrumb | Route |
|------|------------|-------|
| List | Sales → Orders | `/sales/orders` |
| View order | Sales → Orders → **SO-1042** | `/sales/orders?view={id}` |
| Invoice tab | Sales → Orders → SO-1042 → **Invoice** | same + tab=invoice |

```text
Sales → Orders → Order Details → Invoice
         ↑           ↑               ↑
       Feature      Record         Sub-view (tab)
```

### 4.2 CRM → Leads → Lead → Activities

| Step | Breadcrumb | Route |
|------|------------|-------|
| List | CRM → Leads | `/crm/leads` |
| View lead | CRM → Leads → **Acme Corp Lead** | `/crm/leads?view={id}` |
| Activities tab | CRM → Leads → Acme Corp Lead → **Activities** | tab or related route |

```text
CRM → Leads → Lead Details → Activities
```

### 4.3 Commerce → SEO Audit

| Breadcrumb | Route |
|------------|-------|
| Ecommerce → SEO → **Audit** | `/catalog/seo/audit` |

Sub-area features still use **parent module** as first segment (display: "Ecommerce" or "Commerce").

---

## 5. Query Parameter Standard

| Param | Purpose | Values |
|-------|---------|--------|
| `create` | Open create drawer | `1` |
| `view` | Open view drawer | UUID |
| `edit` | Open edit drawer | UUID |
| `view` (layout) | List layout mode | `kanban`, `calendar`, `map` |
| `tab` | Detail tab | string slug |
| `filter` | Encoded filter state | module-defined |
| `page` | Pagination | integer |

**Rule:** Drawer params coexist with list filters — `?status=open&view={id}`.

---

## 6. Cross-Module Links

| Pattern | Breadcrumb behavior |
|---------|---------------------|
| Related record click | Switch module segment — full replace |
| Smart button | Push new breadcrumb stack |
| Global search result | Rebuild stack from result metadata |
| AI navigation | Same as search — manifest provides segments |

Related records do **not** append foreign module as child of current record — **new stack**:

```text
CRM → Leads → Acme Lead     →  (click related order)  →  Sales → Orders → SO-1042
```

---

## 7. Deep Linking & Guards

| Guard | Behavior |
|-------|----------|
| Auth | Redirect login with `returnUrl` |
| Permission | 403 page — breadcrumb not rendered |
| Missing module | 404 — module hidden from plan |
| Invalid UUID | 404 on drawer — list remains |

---

## 8. Module Metadata for Breadcrumbs

Each Level 3 screen declares in `Menus/{Screen}.md` or manifest:

```yaml
breadcrumb:
  module: Sales
  feature: Orders
  route: /sales/orders
```

Record label resolver: module service returns `displayName` for UUID.

---

## 9. Mobile Breadcrumbs

| Viewport | Display |
|----------|---------|
| < 768px | Module › Record (2 segments) — back button replaces full trail |
| ≥ 768px | Full trail |

Back button: pops Level 4 → Level 3 — not browser history blindly.

---

## 10. AI Agent Routing

Agents receive breadcrumb context in tool responses:

```json
{
  "route": "/sales/orders?view=uuid",
  "breadcrumb": ["Sales", "Orders", "SO-1042"]
}
```

Agents must use manifest routes — see [SEARCH_AND_DISCOVERY_ARCHITECTURE.md](./SEARCH_AND_DISCOVERY_ARCHITECTURE.md).

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 08 — breadcrumb and routing standard |

---

**Breadcrumb & Routing Standard** — module → feature → record → sub-view; drawer CRUD URLs.
