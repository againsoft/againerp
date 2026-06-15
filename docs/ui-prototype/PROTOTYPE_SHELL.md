# Prototype Application Shell

> **Parent:** [UI_PROTOTYPE_MODE.md](../UI_PROTOTYPE_MODE.md)  
> **UI:** [ENTERPRISE_UI_ARCHITECTURE.md](../ui-ux/ENTERPRISE_UI_ARCHITECTURE.md)

---

## Layout Zones

| Zone | Position | Contents |
|------|----------|----------|
| **Top Header** | Fixed top | Logo, global search, quick create, company/branch switcher, notifications, AI toggle, profile |
| **Left Sidebar** | Fixed left | Module switcher, collapsible menu tree (favorites **off** in prototype) |
| **Main Workspace** | Center | Page content — list, record, dashboard, builder canvas |
| **Right Utility Panel** | Collapsible right | Activities, comments, notes, attachments chatter |
| **Command Palette** | Overlay (CMDK) | Go to page, run action, AI prompt |
| **AI Assistant Panel** | Slide-over right | Chat UI, canned responses, suggested actions |
| **Notification Center** | Dropdown / drawer | 200+ mock notifications |

---

## Top Header

```
[≡] [Logo AgainERP]  [🔍 Global Search........................]  [+ Quick Create ▾]
     [Company ▾] [Branch ▾]  [⌘K]  [🔔 12]  [✨ AI]  [Avatar ▾]
```

| Element | Behavior (prototype) |
|---------|----------------------|
| Global Search | Opens results dropdown; links to pages/records |
| Quick Create | Menu: Product, Order, Customer, Invoice, … |
| Company Switcher | Mock 3 companies — UI refresh only |
| Branch Switcher | Mock branches per company |
| ⌘K | Opens command palette |
| Notifications | Opens notification center |
| AI | Opens AI assistant panel |
| Profile | Settings, dark mode, logout (mock) |

---

## Left Sidebar

- Module groups match [MENU_STRUCTURE.md](../modules/ecommerce/MENU_STRUCTURE.md)
- Active item highlighted
- Collapsed mode: icons only + tooltip
- Mobile: drawer overlay

---

## Main Workspace Patterns

| Pattern | Use |
|---------|-----|
| **List view** | AG Grid + live filters + bulk actions |
| **Record view** | Header + smart buttons + tabs + chatter |
| **Dashboard** | Widget grid + Recharts |
| **Builder** | Canvas + section/row/column/widget palette |
| **Modal / Drawer** | Popup-first edits |

---

## Right Utility Panel

| Tab | Content |
|-----|---------|
| Activities | Scheduled tasks, calls |
| Comments | Threaded discussion |
| Notes | Internal notes |
| Attachments | File list + upload UI (mock) |
| History | Audit trail mock |

---

## Command Palette (CMDK)

| Group | Examples |
|-------|----------|
| Navigation | Go to Products, Orders, Settings |
| Actions | Create product, Export orders |
| AI | Ask about sales, Generate description |
| Recent | Last 5 pages |

Keyboard: `⌘K` / `Ctrl+K`

---

## AI Assistant Panel

- Chief AI Agent branding
- Message list (mock)
- Suggested prompts
- Tool result cards (static)
- Credit usage display (mock)

No live LLM in prototype.

---

## Dark Mode

- Toggle in profile menu + system preference
- Tailwind `dark:` tokens via centralized theme

---

## Responsive Breakpoints

| Breakpoint | Sidebar | Utility panel |
|------------|---------|---------------|
| Desktop (≥1280px) | Full | Visible |
| Tablet (768–1279px) | Collapsible | Drawer |
| Mobile (<768px) | Drawer | Bottom sheet |

---

**Last Updated:** 2026-06-12
