# Layout Architecture

> **Status:** Draft  
> **Parent:** [WORKSPACE_SHELL_ARCHITECTURE.md](./WORKSPACE_SHELL_ARCHITECTURE.md) · [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **Related:** [WORKSPACE_LAYOUT_MAP.md](./WORKSPACE_LAYOUT_MAP.md) · [navigation.md](./navigation.md) · [mobile-first.md](./mobile-first.md)

---

## Purpose
Global UI standard: layout architecture.

## When To Read
Read only if working on UI patterns related to layout architecture.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

Define the **application shell** — the persistent frame that wraps every AgainERP screen across all modules.

---

## Desktop Layout (≥ 1024px)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ TOP BAR (56px fixed)                                                    │
├──────────┬──────────────────────────────────────────────┬───────────────┤
│ SIDEBAR  │ CONTENT                                      │ UTILITY       │
│ 240px    │ flex-grow                                    │ 320px         │
│ (64px    │                                              │ (collapsible) │
│ collapsed)│                                             │               │
└──────────┴──────────────────────────────────────────────┴───────────────┘
```

| Zone | Width | Scroll |
|------|-------|--------|
| Top bar | 100% fixed | No |
| Sidebar | 240px / 64px | Independent |
| Content | Fluid | Yes |
| Utility panel | 0–320px | Independent |

**Content padding:** `--space-6` (24px) desktop, `--space-4` (16px) mobile.

---

## Top Navigation Bar

| Slot | Content |
|------|---------|
| Left | Logo (links to dashboard), mobile hamburger |
| Center | Global search / command palette trigger |
| Right | Company ▾ · Branch ▾ · **+ Quick Create** · 🔔 · 📋 · ✨ · 🌐 · 🌙 · Avatar ▾ |

Height: **56px**. Background: `--color-surface`. Border-bottom: `--color-border`.

---

## Content Area Anatomy

```
Breadcrumb row
Page header (title + status + primary actions)
Optional: filter bar / tab bar
Main content (table | form | dashboard grid)
Optional: pagination footer
```

**Page header actions:** Max 3 visible primary buttons; overflow in `⋯ More` menu.

---

## Right Utility Panel

Optional third column — **Odoo Chatter** equivalent.

| State | Behavior |
|-------|----------|
| Expanded | 320px, shows activity feed |
| Collapsed | Icon rail on content edge |
| Hidden | User preference — chatter as bottom sheet button |

**Default on record views:** Expanded on desktop ≥ 1280px.  
**Default on list views:** Hidden.

Contains: Activities · Notes · Comments · Attachments · Timeline · AI context.

---

## Tablet Layout (768px – 1023px)

- Sidebar: overlay drawer (not fixed)
- Utility panel: bottom sheet triggered by "Chatter" FAB
- Top bar: full width

---

## Mobile Layout (< 768px)

- No fixed sidebar — hamburger drawer
- Bottom navigation: Dashboard · Catalog · Orders · More
- Utility panel: full-screen sheet
- Global search: full-screen overlay

---

## Footer (Optional)

| Content | When Shown |
|---------|------------|
| App version | Desktop only |
| Documentation / Support links | Always when enabled |
| System status | When incidents active |

Hidden on mobile. Disabled by default in v1.

---

## Z-Index Scale

| Layer | z-index |
|-------|---------|
| Base content | 0 |
| Sticky table header | 10 |
| Sidebar overlay | 40 |
| Top bar | 50 |
| Dropdowns | 60 |
| Modals | 70 |
| Command palette | 80 |
| Toasts | 90 |

---

## Module Registration

Modules do not define custom shells. They register:

- Menu items → sidebar
- List/form components → content area
- Record tabs → content area
- Chatter config → utility panel
