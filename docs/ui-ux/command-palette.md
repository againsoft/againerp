# Command Palette

> **Status:** Draft  
> **Parent:** [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **Related:** [global-search.md](./global-search.md)

---

## Purpose

**Linear-inspired** command palette — unified overlay for search, navigation, creation, and AI. Same entry point as global search.

---

## Activation

| Method | Action |
|--------|--------|
| `Ctrl+K` / `Cmd+K` | Open palette |
| Header search click | Open palette |
| `/` key (optional) | Open palette when not in input |

---

## Palette Layout

```
┌─────────────────────────────────────────────────────────┐
│ 🔍  Type a command or search…                           │
├─────────────────────────────────────────────────────────┤
│ ACTIONS                                                 │
│   + Create Product                                      │
│   + Create Order                                        │
│   + Create Customer                                     │
│   📊 Generate Report                                    │
│   ✨ Open AI Assistant                                  │
├─────────────────────────────────────────────────────────┤
│ NAVIGATION                                              │
│   ⚙ Open Settings                                       │
│   📦 Inventory → Stock Levels                           │
├─────────────────────────────────────────────────────────┤
│ RECORDS                                                 │
│   Blue T-Shirt — Products                               │
│   Order #1042 — Orders                                  │
├─────────────────────────────────────────────────────────┤
│ ↑↓ navigate · Enter select · Esc close                  │
└─────────────────────────────────────────────────────────┘
```

---

## Command Groups

| Group | Priority | Examples |
|-------|----------|----------|
| **Actions** | Highest | Create *, Generate Report |
| **Navigation** | High | Open Settings, Go to {menu} |
| **Records** | High | Matching entities |
| **AI** | Medium | Ask AI, Open Assistant |
| **Recent** | On empty input | Recent searches, recent records |

---

## Create Commands

Quick Create (`+` in header) mirrors palette create actions:

| Command | Permission |
|---------|------------|
| Create Product | `catalog.product.write` |
| Create Order | `commerce.order.write` |
| Create Customer | `core.contact.write` |
| Create Invoice | `accounting.invoice.write` |

Hidden if user lacks permission.

---

## Navigation Commands

Fuzzy match against full menu tree from `ModuleManifest.md`.

`> settings` → System → General Settings  
`> inventory stock` → Inventory → Stock Levels

---

## AI Integration

| Command | Action |
|---------|--------|
| "Open AI Assistant" | Opens AI panel |
| Natural language query | Routes to AI search when enabled |
| "Create product for …" | AI-assisted create flow |

---

## Keyboard

| Key | Action |
|-----|--------|
| `↑` `↓` | Move selection |
| `Enter` | Execute selected |
| `Esc` | Close |
| `Tab` | Switch group |
| `Ctrl+K` | Toggle close when open |

---

## Mobile

Full-screen overlay. Same groups. Larger touch targets (48px rows).
