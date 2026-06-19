# AgainERP — Search & Discovery Architecture

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 08 — Navigation Architecture  
> **Authority:** [NAVIGATION_ARCHITECTURE.md](./NAVIGATION_ARCHITECTURE.md)

---

## Purpose

Architecture for **Global Search**, **Smart Search**, and **AI Search** — unified discovery across modules, menus, records, and actions.

## When To Read

Read when implementing search UI, command palette, or AI navigation tools.

## Related Files

- [global-search.md](./global-search.md) — UI patterns
- [command-palette.md](./command-palette.md) — keyboard palette
- [WORKSPACE_COMPONENT_REGISTRY.md](./WORKSPACE_COMPONENT_REGISTRY.md) — `WS-HEADER-SEARCH*`
- [06-ai/platform/ai/AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md)

## Read Next

One search mode section below — not the full document unless architecting search.

---

## 1. Search Entry Points

| Entry | Component | Shortcut |
|-------|-----------|----------|
| Header search field | `WS-HEADER-SEARCH` | Click |
| Command palette | `WS-HEADER-SEARCH-PALETTE` | `Ctrl+K` / `Cmd+K` |
| Mobile full-screen | `WS-MOBILE-SEARCH-SHEET` | Bottom nav Search |
| AI assistant | `WS-HEADER-AI` | `Ctrl+J` — natural language |
| Sidebar filter | `WS-SIDE-SEARCH` | Menu tree only |

**Rule:** Header search and command palette share **one index** — same results, different presentation.

---

## 2. Search Modes

| Mode | Input | Engine | Primary use |
|------|-------|--------|-------------|
| **Keyword** | Typed text | Meilisearch + menu index | Fast literal match |
| **Smart search** | Keyword + filters | Meilisearch facets | Scoped discovery |
| **AI search** | Natural language | AI OS + tool routing | Intent → navigate / act |
| **Menu search** | Sidebar filter | Local manifest tree | Level 1–3 only |

---

## 3. Global Search — Required Scopes

Global Search **must** index and return navigable results for:

| Scope | Level | Examples | Source |
|-------|-------|----------|--------|
| **Modules** | 1 | CRM, Sales, Ecommerce | Manifest registry |
| **Menus** | 3 | Leads, Product List, SEO Audit | `ModuleManifest` + `UI.md` |
| **Customers** | 4 | Contacts, companies | Core `contacts` + module indexes |
| **Products** | 4 | SKU, name, variant | Catalog / inventory indexes |
| **Orders** | 4 | Order #, customer ref | Commerce / sales indexes |
| **Documents** | 4 | Files, KB articles | Documents / knowledge |
| **Reports** | 3 | Sales Reports, Tax Reports | `Reports.md` / Menus |

Additional scopes (optional): Vendors, Employees, Tickets, Projects.

### 3.1 Result types

| Type | Action on select |
|------|------------------|
| Module | Navigate to module dashboard |
| Menu | Navigate to Level 3 route |
| Record | Navigate to list + `?view={id}` or detail route |
| Report | Open report screen |
| Action | Execute create / export / setting |

### 3.2 Permission filter

Results **filtered pre-display** — user never sees unreachable records or menus.

Tenant scope: all queries include `tenant_id` + workspace company context.

---

## 4. Smart Search

Extends keyword search with **filters and ranking**.

| Feature | Behavior |
|---------|----------|
| **Entity filter** | `type:order`, `type:product`, `type:contact` |
| **Module filter** | `module:sales` |
| **Date filter** | `created:today`, `updated:7d` |
| **Recent boost** | User's recent modules rank higher |
| **Favorites boost** | Starred items rank higher |
| **Badges** | Show module icon + record status on each result |

### 4.1 Saved searches

Users may save named searches (Smart Search only) — stored per user, tenant-scoped.

---

## 5. AI Search

Natural language layer on top of the same navigation registry.

### 5.1 Required utterance classes

| Utterance | Intent | Example outcome |
|-----------|--------|-----------------|
| **Analytics query** | `query.analytics` | "Show today's sales" → Sales dashboard or report with date filter |
| **Record lookup** | `query.record` | "Find customer by phone" → Contact search → `?view=` |
| **Navigation** | `navigate.screen` | "Open SEO audit" → `/catalog/seo/audit` |
| **Create action** | `action.create` | "Create quotation" → `/sales/quotations?create=1` |
| **Help** | `query.help` | "How do I refund an order?" → Knowledge or AI answer + link |

### 5.2 AI search pipeline

```text
Utterance → Intent classifier → Tool selection → Service/API query OR route resolution
          → Permission check → Present results / navigate → Audit log
```

| Rule | Detail |
|------|--------|
| **No direct DB** | AI tools call module APIs — [ARCHITECTURE_DECISIONS §6.2](../../ARCHITECTURE_DECISIONS.md#62-tools-call-services-never-orm) |
| **Confirm destructive** | High-risk creates require confirmation or approval |
| **Credits** | AI search consumes tenant credits when LLM involved |
| **Fallback** | If intent unclear → show keyword search results |

### 5.3 Example mappings

| User says | Resolved route / action |
|-----------|-------------------------|
| "Show today's sales" | `/sales/reports/daily?date=today` or dashboard widget deep link |
| "Find customer by phone +1…" | `/catalog/customers?search={phone}` or Core contact search |
| "Open SEO audit" | `/catalog/seo/audit` (Menus/SEO/) |
| "Create quotation" | `/sales/quotations?create=1` |

Routes must exist in manifest — AI does not invent paths.

---

## 6. Quick Access

Quick Access = **Quick Actions** + **pinned palette commands**.

| Source | Component |
|--------|-----------|
| Header `+` menu | `WS-HEADER-QUICK` |
| Command palette "Actions" group | `WS-HEADER-SEARCH-PALETTE` |
| User pinned actions | User preferences |

Modules register create actions in `ModuleManifest.md`:

```yaml
quickActions:
  - id: sales.create-quotation
    label: New Quotation
    route: /sales/quotations?create=1
    permission: sales.quotation.manage
    keywords: [quote, quotation, offer]
```

---

## 7. Index Architecture (conceptual)

| Index | Owner | Updates |
|-------|-------|---------|
| `nav_modules` | Platform | Manifest deploy |
| `nav_menus` | Platform | Manifest deploy |
| `search_records_{entity}` | Module | Domain events after COMMIT |
| `search_reports` | Module | Reports.md sync |

**Meilisearch** per [ARCHITECTURE_DECISIONS §1.4](../../ARCHITECTURE_DECISIONS.md#14-technology-spine) — tenant-filtered indexes.

---

## 8. Mobile Search

| Pattern | Behavior |
|---------|----------|
| Full-screen overlay | Replaces content — not a small dropdown |
| Voice input | Optional — feeds AI search pipeline |
| Recent queries | Last 5 shown on open |
| Scanner / barcode | Commerce optional — product SKU lookup |

Detail: [MOBILE_NAVIGATION_ARCHITECTURE.md §3](./MOBILE_NAVIGATION_ARCHITECTURE.md#3-bottom-navigation)

---

## 9. Failure Modes

| Condition | UX |
|-----------|-----|
| Index lag | Show stale badge · offer refresh |
| No results | Suggest AI rephrase · menu browse link |
| AI unavailable | Keyword search only — no error spam |
| Permission denied | Result omitted — not shown disabled |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 08 — search and discovery architecture |

---

**Search & Discovery Architecture** — one index, keyword + smart + AI, permission-filtered.
