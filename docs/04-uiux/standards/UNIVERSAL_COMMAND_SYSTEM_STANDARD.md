# AgainERP — Universal Command System Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 10.1A — Design System Enhancement  
> **Authority:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md)

---

## Purpose

Define the **Universal Command System** — global command palette, supported actions, categories, ranking, and keyboard rules. Single entry point for search, navigation, creation, reports, AI, and settings.

## When To Read

Read when registering module commands, documenting global search, or specifying keyboard shortcuts in Menus specs.

## Related Files

- [DRAWER_MODAL_STANDARD.md §6](./DRAWER_MODAL_STANDARD.md#6-command-palette-ds-command-palette)
- [SEARCH_AND_DISCOVERY_ARCHITECTURE.md](./SEARCH_AND_DISCOVERY_ARCHITECTURE.md)
- [QUICK_ACTION_FRAMEWORK_STANDARD.md](./QUICK_ACTION_FRAMEWORK_STANDARD.md)
- [command-palette.md](./command-palette.md) — legacy detail (superseded on conflict)

## Read Next

§2 **Global shortcut** — `Ctrl+K`.

---

## 1. System Overview

```text
Universal Command System
    └── DS-COMMAND-PALETTE (overlay)
            ├── Search Everything
            ├── Navigate
            ├── Create Record
            ├── Open Record
            ├── Run Report
            ├── Run AI Action
            ├── Open Dashboard
            └── Open Settings
```

**Component ID:** `DS-COMMAND-PALETTE`  
**Shell registry:** Global search trigger in header — [WORKSPACE_SHELL_ARCHITECTURE.md](./WORKSPACE_SHELL_ARCHITECTURE.md)

---

## 2. Global Shortcut

| Shortcut | Action |
|----------|--------|
| **`Ctrl+K` / `Cmd+K`** | Open command palette (primary — locked) |
| Header search click | Open command palette |
| `/` | Open palette when focus not in text input (optional) |
| `Esc` | Close palette |
| `↑` `↓` | Navigate results |
| `Enter` | Execute selected command |
| `Tab` | Switch command category filter (optional) |

**Mobile:** Full-screen palette — same shortcut when hardware keyboard; tap search icon otherwise.

Detail: [DRAWER_MODAL_STANDARD.md](./DRAWER_MODAL_STANDARD.md) · [MOBILE_NAVIGATION_ARCHITECTURE.md](./MOBILE_NAVIGATION_ARCHITECTURE.md)

---

## 3. Supported Actions

| Action ID | Description | Example |
|-----------|-------------|---------|
| `CMD-CREATE` | Open create drawer on target list | Create Product → `/catalog/products?create=1` |
| `CMD-OPEN` | Open record view drawer | Open Order #1042 → `?view={id}` |
| `CMD-NAVIGATE` | Go to module screen | Go to Leads → `/crm/leads` |
| `CMD-REPORT` | Run or open report | Sales by Region → analytics route |
| `CMD-AI` | Run AI action or open assistant | Ask AI · Generate description |
| `CMD-DASHBOARD` | Open dashboard | CRM Dashboard → `/crm/dashboard` |
| `CMD-SETTINGS` | Open settings section | Tax Settings → `/finance/settings/tax` |
| `CMD-SEARCH` | Fuzzy search all indexed entities | "blue shirt" → matching records |

All create/open actions use **drawer URL params** — not `/new` routes. Per [ARCHITECTURE_DECISIONS §5.1](../../ARCHITECTURE_DECISIONS.md#51-crud--list--right-sheet-drawer).

---

## 4. Command Categories

| Category | Priority | Contents |
|----------|----------|----------|
| **Recent** | 0 (empty query) | Last 5 commands + last 5 records |
| **Actions** | 1 | Create · Run report · Run AI action |
| **Navigation** | 2 | Module screens · Dashboard · Settings |
| **Records** | 3 | Entity search results |
| **AI** | 4 | Ask AI · suggested prompts |
| **Help** | 5 | Documentation links (optional) |

Categories render as labeled sections in the palette. Empty categories hidden.

---

## 5. Command Priority

When query matches multiple result types, rank in this order:

```text
1. Exact action match     ("create product")
2. Navigation match       ("leads", "settings")
3. Record title / ID      ("order 1042")
4. Fuzzy record match
5. AI suggestions
6. Help / docs
```

| Boost factor | Condition |
|--------------|-----------|
| +Current module | Commands in active module nav |
| +Recency | Recently used commands |
| +Role | Commands user executes often (future personalization) |
| −No permission | Excluded entirely — never shown disabled |

---

## 6. Search Ranking

| Signal | Weight |
|--------|--------|
| Exact prefix match on label | Highest |
| Entity ID / SKU / order number match | High |
| Token match in title | Medium |
| Description / tag match | Low |
| Cross-module | Same weight — filtered by permission |

**Scope:** Search respects workspace context — [WORKSPACE_CONTEXT_STANDARD.md](./WORKSPACE_CONTEXT_STANDARD.md). Results limited to active `company_id` unless user has consolidated scope.

**Debounce:** 200ms after keystroke · show skeleton rows while loading.

---

## 7. Keyboard Rules

| Rule | Detail |
|------|--------|
| Single palette | Only one command palette open at a time |
| No conflict with inputs | `/` and `Ctrl+K` suppressed when typing in inputs (except search within palette) |
| Focus trap | Tab cycles within palette while open |
| Return focus | To trigger element on close |
| Accessibility | aria-activedescendant for highlighted row |
| z-index | 80 — above drawers — [DESIGN_TOKEN_STANDARD.md §8](./DESIGN_TOKEN_STANDARD.md#8-z-index-tokens) |

---

## 8. Module Registration

Modules register commands in `ModuleManifest.md`:

```yaml
commands:
  - id: crm.leads.create
    category: action
    label: Create Lead
    action: CMD-CREATE
    route: /crm/leads?create=1
    permission: crm.lead.manage
    keywords: [lead, prospect, new]
  - id: crm.dashboard
    category: navigation
    label: CRM Dashboard
    action: CMD-DASHBOARD
    route: /crm/dashboard
    permission: crm.access
```

Platform merges all module commands into the global index. Disabled modules contribute zero commands.

Checklist: [WORKSPACE_NAVIGATION_RULES.md §6.1](./WORKSPACE_NAVIGATION_RULES.md#61-checklist-for-new-modules) item 6.

---

## 9. AI Integration

| Command | Behaviour |
|---------|-----------|
| "Ask AI …" | Opens `DS-AI-PANEL` with query pre-filled |
| AI action commands | Registered in module `AI.md` with permission keys |
| Natural language navigate | AI OS maps intent → `CMD-NAVIGATE` or `CMD-OPEN` |

Detail: [AI_COMPONENT_STANDARD.md](./AI_COMPONENT_STANDARD.md) · [WORKSPACE_CONTEXT_STANDARD.md](./WORKSPACE_CONTEXT_STANDARD.md)

---

## 10. Module Compliance

```text
✅ Register create/navigate/report commands in ModuleManifest
✅ Use CMD-* action IDs in manifest
✅ Permission-gate every command
❌ Module-specific command palette UI
❌ Duplicate global Ctrl+K binding
❌ Show commands user cannot execute
```

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10.1A — universal command system standard |

---

**Universal Command System Standard** — Ctrl+K, eight actions, one global index.
