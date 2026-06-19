# AgainERP — Mobile Navigation Architecture

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 08 — Navigation Architecture  
> **Authority:** [NAVIGATION_ARCHITECTURE.md](./NAVIGATION_ARCHITECTURE.md) · [WORKSPACE_SHELL_ARCHITECTURE.md §8](./WORKSPACE_SHELL_ARCHITECTURE.md#8-mobile-layout)

---

## Purpose

Mobile navigation model for AgainERP admin — same four navigation levels as desktop, adapted for touch and small viewports.

## When To Read

Read when documenting mobile behavior in `UI.md`, prototype guides, or Menus screen specs.

## Related Files

- [WORKSPACE_LAYOUT_MAP.md §4](./WORKSPACE_LAYOUT_MAP.md#4-mobile-layout--768px)
- [MOBILE_NAVIGATION_ARCHITECTURE.md](./MOBILE_NAVIGATION_ARCHITECTURE.md) — this doc
- [mobile-first.md](./mobile-first.md) — touch targets and layout tokens
- [BREADCRUMB_AND_ROUTING_STANDARD.md](./BREADCRUMB_AND_ROUTING_STANDARD.md) — drawer URLs

## Read Next

[GLOBAL_MENU_STRUCTURE.md](./GLOBAL_MENU_STRUCTURE.md) — only if adding a module to mobile drawer.

---

## 1. Design Principles

| Principle | Rule |
|-----------|------|
| **Same levels** | Levels 1–4 identical to desktop — different presentation |
| **Thumb zone** | Primary actions in bottom 40% of screen |
| **No desktop-only paths** | Every desktop screen reachable on mobile |
| **Progressive disclosure** | Drawers and sheets — not new route trees |
| **44px targets** | Minimum tap size — [mobile-first.md](./mobile-first.md) |

---

## 2. Mobile Shell Layout (< 768px)

```text
┌──────────────────────────────┐
│ Compact Header               │
│ [☰] Workspace  [🔍] [✨] [👤]│
├──────────────────────────────┤
│ Module Nav (scroll tabs)     │
├──────────────────────────────┤
│                              │
│     Content Area             │
│     (full width)             │
│                              │
├──────────────────────────────┤
│ Bottom Navigation (5 slots)  │
└──────────────────────────────┘
```

---

## 3. Bottom Navigation

Fixed bar — **56px** + safe-area inset. Component: `WS-MOBILE-BOTTOMNAV`.

### 3.1 Default platform slots

| Slot | Icon | Action | Nav level |
|------|------|--------|-----------|
| **Home** | Home | Workspace dashboard (`/home`) | Level 1 |
| **Search** | Search | Full-screen search / command palette | Header |
| **AI** | Sparkles | AI assistant full-screen sheet | Header / context |
| **Notifications** | Bell | Notification inbox | Core |
| **More** | Menu | Opens drawer navigation | Level 1 |

### 3.2 Module context override

When user is deep in one module (≥ 30s or explicit pin), bottom nav may swap to **module shortcuts**:

| Slot | Ecommerce example | CRM example |
|------|---------------------|-------------|
| Home | Store dashboard | CRM dashboard |
| Search | Global search | Global search |
| AI | Commerce AI | CRM AI |
| Alerts | Orders badge | Leads badge |
| More | Full drawer | Full drawer |

Override declared in module `UI.md` — max 5 slots.

---

## 4. Drawer Navigation

### 4.1 Primary drawer (More / Hamburger)

Component: `WS-MOBILE-NAV-DRAWER`. Full-screen or 90% width.

**Contents (top → bottom):**

| Section | Content |
|---------|---------|
| Workspace header | Current company · branch · switcher |
| **Favorites** | Group 01 items |
| **Recent** | Last 15 destinations |
| **Global groups** | Groups 03–10 from [GLOBAL_MENU_STRUCTURE.md](./GLOBAL_MENU_STRUCTURE.md) |
| Pinned modules | User pins at top of each group |

### 4.2 Module operations drawer

Triggered from **Operations** tab when feature list exceeds tab capacity.

| Content |
|---------|
| Level 3 feature tree for active module |
| Same data as desktop Operations submenu |

Component: `WS-MOBILE-MOD-DRAWER`

### 4.3 Drawer interaction rules

| Rule | Detail |
|------|--------|
| Swipe to close | Standard iOS/Android gesture |
| Focus trap | Accessibility while open |
| Route change | Drawer closes on Level 3 navigation |
| Nested | Max one drawer + one sheet open |

---

## 5. Level Mapping on Mobile

| Level | Desktop | Mobile |
|-------|---------|--------|
| **1 Global** | Sidebar groups | Drawer sections |
| **2 Module** | Tab bar | Scroll tabs below header |
| **3 Feature** | Ops submenu / sidebar | Module drawer or tab content |
| **4 Record** | Right sheet 480px | **Full-width sheet** |

### 5.1 Record sheet (Level 4)

| State | Mobile behavior |
|-------|-----------------|
| `?create=1` | Full-screen sheet · sticky Save/Cancel footer |
| `?view={id}` | Full-screen · tabs scroll horizontally |
| `?edit={id}` | Same as view with edit controls |

List remains in history stack — back gesture closes sheet.

---

## 6. Header (Mobile Compact)

| Element | Visible | Hidden in overflow |
|---------|---------|-------------------|
| Hamburger | yes | — |
| Workspace label | truncated | — |
| Search icon | yes | — |
| AI | yes | — |
| Quick Actions | — | Inside search palette |
| Notifications | badge on More or slot 4 | — |
| User avatar | yes | — |

---

## 7. Context Panel on Mobile

Right context panel becomes **full-screen sheet**:

| Trigger | Sheet content |
|---------|---------------|
| AI header button | AI tab |
| Activity FAB on detail | Activity feed |
| Related FAB | Related records |

Component: `WS-MOBILE-CTX-SHEET`

---

## 8. Tablet (768px – 1023px)

| Element | Behavior |
|---------|----------|
| Bottom nav | Optional — often hidden |
| Sidebar | Overlay drawer |
| Module tabs | Visible |
| Record sheet | 80% width or full on portrait |
| Context panel | Bottom sheet 80vh |

---

## 9. Gestures & Shortcuts

| Input | Action |
|-------|--------|
| Swipe from left edge | Open nav drawer |
| Swipe down on sheet | Close sheet (when allowed) |
| Long press list row | Quick actions menu |
| Pull to refresh | List views (module opt-in) |

Keyboard (external): `Ctrl+K` search when hardware keyboard attached.

---

## 10. Multi-Tenant Mobile

| Concern | Behavior |
|---------|----------|
| Plan limits | Drawer hides unlicensed groups |
| Workspace switch | In drawer header — reloads active lists |
| Offline | Read-only cached lists where supported — nav still renders |

---

## 11. AI Mobile Navigation

| Pattern | Behavior |
|---------|--------|
| Voice / text in AI sheet | Resolves to route + opens sheet or navigates |
| AI suggestion chip | Tap → Level 3 or Level 4 destination |
| "Open …" commands | Same registry as desktop AI search |

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 08 — mobile navigation architecture |

---

**Mobile Navigation Architecture** — bottom nav, drawer, full-width records, same four levels.
