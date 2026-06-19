# AgainERP — Workspace Context Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 10.1A — Design System Enhancement  
> **Authority:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md)

---

## Purpose

Define the **workspace context contract** — mandatory context every admin screen receives, how context is provided, switched, and scoped across company, branch, tenant, and modules.

## When To Read

Read when documenting `UI.md`, Menus specs, API calls from UI, or multi-company / SaaS behaviour.

## Related Files

- [WORKSPACE_SHELL_ARCHITECTURE.md](./WORKSPACE_SHELL_ARCHITECTURE.md)
- [WORKSPACE_NAVIGATION_RULES.md §5.3](./WORKSPACE_NAVIGATION_RULES.md#53-multi-company--branch)
- [NAVIGATION_ARCHITECTURE.md](./NAVIGATION_ARCHITECTURE.md)
- [permission-aware-ui.md](./permission-aware-ui.md)
- [PAGE_LAYOUT_STANDARD.md](./PAGE_LAYOUT_STANDARD.md)

## Read Next

§2 **Mandatory context fields** — required on every screen.

---

## 1. Scope

Workspace context is **platform-owned**. Modules consume context — they do not define alternate context models.

```text
Tenant → Workspace → Company → Branch (optional)
```

All list views, forms, dashboards, reports, and AI surfaces operate within the active context unless explicitly cross-scope (platform admin only).

---

## 2. Mandatory Context Fields

Every admin screen **must receive** the following context at render and on every data request:

| Field | Type | Purpose |
|-------|------|---------|
| `workspace_id` | UUID | Active workspace session scope |
| `company_id` | UUID | Legal entity / books scope |
| `branch_id` | UUID \| null | Operational branch when multi-branch enabled |
| `currency` | ISO 4217 | Display and entry currency for monetary fields |
| `language` | BCP 47 | UI locale (labels, formats) |
| `timezone` | IANA | Date/time display and scheduling |
| `fiscal_year` | Object | Active fiscal period — `{ year, start, end, label }` |

### 2.1 Field rules

| Field | Rule |
|-------|------|
| `workspace_id` | Set at login; persists across navigation |
| `company_id` | Required when tenant has ≥1 company; drives data filter |
| `branch_id` | Null when single-branch or branch feature off |
| `currency` | Defaults from company; overridable per transaction where supported |
| `language` | User preference → company default → tenant default |
| `timezone` | User preference → company default → UTC |
| `fiscal_year` | Company fiscal calendar; affects report date presets |

### 2.2 Menus spec requirement

Each `Menus/{screen}.md` must declare:

```yaml
context_required:
  - workspace_id
  - company_id
  - branch_id        # optional if module ignores branch
  - currency         # if monetary fields present
  - language
  - timezone
  - fiscal_year      # if date-range reports or GL screens
```

---

## 3. Workspace Context Provider

The **Workspace Context Provider** is a platform shell service (conceptual — not module code) that:

| Responsibility | Detail |
|----------------|--------|
| Hydrate context | Load from session + user prefs + company settings on shell mount |
| Expose to Zone D | All module pages read context via shell contract — not ad-hoc globals |
| Propagate to API | Attach context headers/params on every `/api/v1/` call |
| Invalidate on switch | Trigger data refresh when company, branch, or fiscal year changes |
| Persist preferences | Language, timezone stored per user |

**Shell components:**

| Component | Registry ID | Role |
|-----------|-------------|------|
| Workspace switcher | `WS-HEADER-WORKSPACE` | Company / branch selection |
| Context bar (optional) | `WS-CONTENT-CONTEXT` | Show active company · branch · fiscal year on report screens |

Detail: [WORKSPACE_SHELL_ARCHITECTURE.md §3](./WORKSPACE_SHELL_ARCHITECTURE.md)

---

## 4. Context Switching Rules

| Event | UI behaviour |
|-------|--------------|
| **Company switch** | Confirm if unsaved forms open · reload list/dashboard data · keep route |
| **Branch switch** | Same as company — filter refresh, no route change |
| **Language switch** | Re-render labels · no data reload |
| **Timezone switch** | Re-format dates · no data reload |
| **Fiscal year switch** | Reload analytics/dashboard widgets with date scope |
| **Workspace switch** | Full context reset · navigate to `/home` |

**Rule:** Switching context in header **reloads** list and dashboard views — does not change route path. Per [WORKSPACE_NAVIGATION_RULES.md §5.3](./WORKSPACE_NAVIGATION_RULES.md#53-multi-company--branch).

---

## 5. Multi-Company Rules

| Rule | Detail |
|------|--------|
| Data scope | All operational lists filtered by `company_id` unless cross-company report |
| Switcher visibility | Shown when user has access to >1 company |
| Create records | New records inherit active `company_id` |
| Related records | FK pickers scoped to active company |
| Permissions | `{module}.{entity}.{action}` evaluated per company membership |
| UI hide | Companies user cannot access never appear in switcher |

---

## 6. Multi-Branch Rules

| Rule | Detail |
|------|--------|
| Feature gate | Branch switcher hidden when tenant plan or company disables branches |
| `branch_id` null | Valid — means company-wide view |
| Inventory / POS | Branch often required — validate before save |
| Reports | Branch filter optional dimension on analytics layouts |
| Switcher | Sub-control under company or combined workspace switcher |

---

## 7. SaaS Tenant Rules

| Rule | Detail |
|------|--------|
| Tenant isolation | Context never leaks across `tenant_id` — platform enforces at API |
| Plan gating | Modules not in plan excluded from nav and quick actions — graceful hide |
| Tenant branding | Applied via theme layer — does not alter context fields |
| Trial / suspended | Shell shows banner; write actions hidden per billing state |
| White-label | Logo and primary color only — context schema unchanged |

Detail: [NAVIGATION_ARCHITECTURE.md §1](./NAVIGATION_ARCHITECTURE.md#1-design-constraints) · [theme-system.md](./theme-system.md)

---

## 8. Cross-Module Context Rules

| Scenario | Rule |
|----------|------|
| Smart button → related list | Preserve active company/branch in target list filters |
| Drawer quick-create (FK) | Inherit parent record company |
| Command palette open record | Load record only if in user's company scope |
| Dashboard widget API | Pass full context in widget data request |
| AI assistant | Include module + record + company in context bar |
| Cross-module link | UUID reference only — target module resolves with same context |
| Executive / cross-company reports | Explicit `scope: consolidated` permission — not default |

**Prohibition:** Modules must not JOIN another module's tables to resolve context — use platform context provider and module APIs.

---

## 9. API Contract (UI → Backend)

Every UI data request includes:

```text
Headers (conceptual):
  X-Tenant-Id
  X-Workspace-Id
  X-Company-Id
  X-Branch-Id          (optional)
  Accept-Language
  X-Timezone
  X-Fiscal-Year        (reports only)
```

Aligned with [WIDGET_REGISTRY_STANDARD.md](./WIDGET_REGISTRY_STANDARD.md) widget scope headers.

---

## 10. Module Compliance

```text
✅ Read context from shell provider
✅ Document context_required in Menus specs
✅ Scope list filters and creates to company_id
❌ Custom company/branch switchers in module pages
❌ Hardcode currency or timezone in Menus specs
❌ Bypass context on API calls
```

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10.1A — workspace context standard |

---

**Workspace Context Standard** — seven mandatory fields, one provider, every screen.
