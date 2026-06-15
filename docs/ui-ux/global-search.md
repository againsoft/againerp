# Global Search

> **Status:** Draft  
> **Master:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §2  
> **Architecture:** [GLOBAL_SEARCH_ARCHITECTURE.md](../core/engines/GLOBAL_SEARCH_ARCHITECTURE.md) · [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **Standards:** [DEVELOPMENT_STANDARDS.md §13](../DEVELOPMENT_STANDARDS.md#13-search-standards) · [navigation.md](./navigation.md)

## Purpose

**Odoo-style global search is mandatory.** Cross-module record discovery, command palette, autocomplete, and keyboard shortcuts. Mobile-first interaction.

---

## Search Bar Placement

Located in the **top bar**, centered on desktop, icon-expand on mobile.

```
┌──────────────────────────────────────────────────────────┐
│ ☰  Module   [ 🔍 Search records, settings, actions…  ]  🔔 👤 │
└──────────────────────────────────────────────────────────┘
```

| Viewport | Behavior |
|----------|----------|
| Mobile | Search icon opens full-screen overlay |
| Tablet+ | Inline input, min-width 240px, expands on focus |

**Placeholder:** "Search records, settings, actions…" — translatable per [DEVELOPMENT_STANDARDS.md §10](../DEVELOPMENT_STANDARDS.md#10-multi-language-ready).

---

## Search Scope

**Mandatory searchable entities:** Products · Categories · Brands · Customers · Orders · Pages · Media · Reports · Settings · Activities

**Smart search features:** Live search · Autocomplete · Suggestions · Recent searches · Popular searches · AI search · Voice search ready · `Ctrl+K`

| Tier | Content | Priority |
|------|---------|----------|
| 1 — Actions | Menu items, quick actions ("Create Invoice") | Highest |
| 2 — Records | Entities user can read (orders, products, contacts) | High |
| 3 — Settings | Configuration pages | Medium |
| 4 — Help | Documentation links (future) | Low |

**RBAC:** Results filtered by user permissions — never leak record titles from inaccessible modules.

**Multi-company:** Results scoped to active company unless user has cross-company access.

---

## Autocomplete Dropdown

Appears after 2+ characters, 200ms debounce.

```
┌─────────────────────────────────────────┐
│ 🔍 wid                                    │
├─────────────────────────────────────────┤
│ ACTIONS                                   │
│   + Create Product                        │
│ RECORDS                                   │
│   📦 Blue Widget — SKU-001    Products   │
│   📦 Wide Belt — SKU-442      Products   │
│   👤 Widget Corp              Contacts   │
├─────────────────────────────────────────┤
│ View all results for "wid"            →  │
└─────────────────────────────────────────┘
```

| Element | Rule |
|---------|------|
| Grouping | By type with section headers |
| Highlight | Match substring bold |
| Meta | Module name, status badge, date right-aligned |
| Limit | 5 per group, 20 total in dropdown |
| Empty | "No results" + search tips |
| Loading | Skeleton rows in dropdown |

**Keyboard:** ↑↓ navigate, Enter open, Esc close, Tab move to "View all".

---

## Full Results Page

Route: `/search?q={query}`

| Feature | Detail |
|---------|--------|
| Tabs | All · Products · Orders · Contacts · … (module tabs) |
| Filters | Module facet filters on left (desktop) |
| Sort | Relevance (default), date, name |
| Pagination | 25 per page |

Relevance scoring: exact match > prefix > fuzzy. v2 uses Meilisearch; see [GLOBAL_SEARCH_ARCHITECTURE.md §8](../core/engines/GLOBAL_SEARCH_ARCHITECTURE.md#8-search-ranking).

---

## Recent, Popular & Suggested

| Feature | When Shown |
|---------|------------|
| Recent searches | Empty input, focus state; max 5, clearable |
| **Popular searches** | Company-wide top queries; anonymized aggregate |
| Recent records | Last 5 viewed records |
| Suggested actions | Role-based quick actions |
| **AI search** | Natural language queries when AI enabled |

Stored in user preferences; popular from `search_query_log` aggregate.

---

## Voice Search Ready

Mic icon in search input (dormant until `feature_flags.ai.voice_search`).

- Press/hold → transcribe → populate query
- Same result pipeline as text search
- See [future-interactions.md](./future-interactions.md)

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `⌘+K` | Open/focus global search |
| `Esc` | Close search overlay / clear |
| `↑` `↓` | Navigate results |
| `Enter` | Open selected result |
| `Ctrl+Enter` | Open in new tab (desktop) |

Shortcuts disabled when focus is in text inputs except the search field itself.

**Discoverability:** `⌘K` hint shown in search placeholder on desktop; shortcuts page in user settings.

---

## Mobile Behavior

1. Tap search icon → full-screen overlay with auto-focus input
2. Results fill screen below input
3. Tap result → navigate and close overlay
4. Back gesture or ✕ closes overlay

Virtual keyboard must not obscure results — scrollable result list with sticky input header.

---

## API Contract

```
GET /api/v1/search?q={query}&limit=20&types=product,order,contact
```

| Field | Type | Description |
|-------|------|-------------|
| `q` | string | Search query, min 2 chars |
| `types` | string[] | Optional module filter |
| `limit` | int | Max results, default 20 |

Response groups by type with: `id`, `title`, `subtitle`, `module`, `url`, `icon`, `score`.

**Activity tracking:** Search queries logged per [DEVELOPMENT_STANDARDS.md §4](../DEVELOPMENT_STANDARDS.md#4-user-activity-tracking) (query text anonymizable in GDPR mode).

---

## Module Compliance

Modules register searchable entities in `ModuleManifest.md` with: model, fields, icon, permission, and URL pattern.

## Related Documents

| Document | Topic |
|----------|-------|
| [GLOBAL_SEARCH_ARCHITECTURE.md](../core/engines/GLOBAL_SEARCH_ARCHITECTURE.md) | Platform search engine, index registry, AI |
| [navigation.md](./navigation.md) | Top bar layout |
| [filters.md](./filters.md) | List-level filters |
| [tables.md](./tables.md) | Module list search |
