# AgainERP — Drawer & Modal Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 10 — Enterprise Design System & UI Foundation  
> **Authority:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md)

---

## Purpose

Standards for **overlay components** — drawer (CRUD sheet), modal, popover, dropdown, tooltip, and command palette.

## When To Read

Read when documenting CRUD flows, quick-create modals, or global search in Menus specs.

## Related Files

- [WORKSPACE_LAYOUT_MAP.md §6–7](./WORKSPACE_LAYOUT_MAP.md#6-drawer--overlay-map)
- [FORM_STANDARD.md](./FORM_STANDARD.md)
- [popup-first-ux.md](./popup-first-ux.md)
- [command-palette.md](./command-palette.md)
- [ARCHITECTURE_DECISIONS.md §5.1](../../ARCHITECTURE_DECISIONS.md#51-crud--list--right-sheet-drawer)

## Read Next

§2 **CRUD drawer** — locked interaction model.

---

## 1. Overlay Taxonomy

| ID | Component | Primary use |
|----|-----------|-------------|
| `DS-DRAWER-CRUD` | Right sheet | Entity create · view · edit |
| `DS-DRAWER-CONTEXT` | Side sheet | Filters, activity, AI utility |
| `DS-MODAL` | Centered dialog | Quick-create, confirm, destructive |
| `DS-POPOVER` | Anchored panel | Date picker, column menu |
| `DS-DROPDOWN` | Menu list | Row actions, user menu |
| `DS-TOOLTIP` | Hover/focus hint | Icon labels, truncated text |
| `DS-COMMAND-PALETTE` | Global search | Navigation, actions, Ask AI |

---

## 2. CRUD Drawer (Locked)

Per [ARCHITECTURE_DECISIONS §5.1](../../ARCHITECTURE_DECISIONS.md#51-crud--list--right-sheet-drawer):

```text
List page stays mounted
URL: ?create=1 · ?view={id} · ?edit={id}
❌ Forbidden: /new · /[id]/edit for standard entities
```

| Property | Desktop | Mobile |
|----------|---------|--------|
| Direction | Right slide-in | Full-screen sheet |
| Width | 480px (default) · 640px (complex) | 100vw |
| z-index | 70 | 70 |
| Backdrop | Semi-transparent; list visible | Opaque |
| Close | × · Escape · Cancel | Swipe-down optional |

**Modes:**

| Mode | URL | Content |
|------|-----|---------|
| Create | `?create=1` | Empty form · primary = Create |
| View | `?view={id}` | Read-only · Edit button |
| Edit | `?edit={id}` | Form · primary = Save |

**Dirty state:** Confirm before close if unsaved changes.

---

## 3. Modal (`DS-MODAL`)

| Use | Width | Example |
|-----|-------|---------|
| Quick create | 400–480px | Brand, tag, category |
| Confirm delete | 400px | Destructive confirm |
| Multi-step (rare) | 560px max | Import wizard |

| Rule | Detail |
|------|--------|
| Nesting | Max 1 level — no modal on modal on mobile |
| Focus trap | Required |
| Mobile | Full-width sheet |
| z-index | 70 |

Detail: [popup-first-ux.md](./popup-first-ux.md)

---

## 4. Popover · Dropdown

| Component | Trigger | Behavior |
|-----------|---------|----------|
| Popover | Click | Dismiss on outside click · Escape |
| Dropdown | Click or context | Keyboard ↑↓ · Enter select |
| z-index | 60 | Below drawers |

**Placement:** Auto-flip when near viewport edge.

---

## 5. Tooltip (`DS-TOOLTIP`)

| Rule | Value |
|------|-------|
| Delay | 400ms hover · instant on focus |
| Content | Short — max 2 lines |
| Mobile | Long-press or omit if redundant |
| z-index | 60 |

Never put essential information only in tooltips.

---

## 6. Command Palette (`DS-COMMAND-PALETTE`)

| Property | Value |
|----------|-------|
| Shortcut | `Ctrl+K` / `Cmd+K` |
| Width | 560px centered |
| z-index | 80 |
| Mobile | Full-screen |

**Sections:** Recent · Navigation · Actions · Ask AI · Module entities

Detail: [command-palette.md](./command-palette.md) · [SEARCH_AND_DISCOVERY_ARCHITECTURE.md](./SEARCH_AND_DISCOVERY_ARCHITECTURE.md)

---

## 7. Context Drawer (Utility Zone)

| Use | Width | z-index |
|-----|-------|---------|
| Activity / chatter | 320px | 65 |
| AI assistant panel | 400px | 65 |
| Advanced filters | 320px | 65 |

Does not replace CRUD drawer — can coexist on desktop; mobile = one overlay at a time.

---

## 8. Toast & Notifications

| Property | Value |
|----------|-------|
| Position | Top-right desktop · top full-width mobile |
| z-index | 90 |
| Duration | 4s default · persistent for errors |

Detail: [notifications.md](./notifications.md)

---

## 9. Accessibility

| Requirement | Rule |
|-------------|------|
| Focus trap | Drawer, modal, command palette |
| Return focus | To trigger on close |
| aria-modal | true on modal and drawer |
| aria-labelledby | Header title |
| Escape | Closes topmost overlay |

---

## 10. Overlay Stacking Order

```text
Base (0) → Sticky (10–20) → Sidebar (40) → Header (50)
→ Dropdown/Popover (60) → Drawer/Modal (70) → Command (80) → Toast (90)
```

Aligned with [WORKSPACE_LAYOUT_MAP.md §7](./WORKSPACE_LAYOUT_MAP.md#7-z-index-scale).

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10 — drawer and modal standard |

---

**Drawer & Modal Standard** — CRUD sheet locked, one overlay stack, keyboard-first.
