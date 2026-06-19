# AgainERP — Component Library UI Blueprint

> **Status:** Active — **component UI SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 14 — Component Library UI Design  
> **Governance:** [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED  
> **Foundation:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md) — design SSOT

**Documentation only.** No mockups · No Figma specs · No implementation code.

---

## Purpose

Define the **official Component Library UI blueprint** — complete catalog, usage rules, interaction rules, responsive behaviour, and accessibility notes for every AgainERP UI component family.

## When To Read

Read before prototype component implementation, Menus screen specs, or any UI that references `DS-*` component IDs.

## Authority

| Layer | Document | Scope |
|-------|----------|-------|
| Governance | FINAL_UI_ARCHITECTURE_LOCK | Locked IDs · tokens · CRUD · AI · mobile |
| Design taxonomy | DESIGN_SYSTEM_FOUNDATION | Families · compliance · token domains |
| Technical catalog | COMPONENT_LIBRARY_STANDARD.md | ID definitions (Step 10) |
| **Component UI** | **This document** | Blueprint · usage · interaction · responsive |

**ID convention (locked):** `DS-{FAMILY}-{NAME}` · Shell components: `WS-*`

**Rule:** Semantic design tokens only — never raw hex in specs or prototype.

---

## 1. Component Catalog Overview

| Family | Count | Primary use |
|--------|-------|-------------|
| Foundation | 15 | Forms · actions · feedback |
| Data | 9 | Lists · filters · export |
| Overlay | 7 | Drawers · modals · menus |
| Navigation | 7 | Shell · wayfinding |
| Dashboard | 7 | Widget bodies |
| Productivity | 7 | Collaboration · planning |
| AI | 7 | Assistant surfaces |
| Empty state | 6 | Zero-data UX |
| Loading state | 6 | Progress · skeleton |

Modules **must** compose screens from this catalog — no module-specific variants without ADR.

---

## 2. Foundation Components

### 2.1 Catalog

| Component | ID | Variants / notes |
|-----------|-----|------------------|
| **Button** | `DS-BTN-PRIMARY` · `SECONDARY` · `DANGER` · `GHOST` · `LINK` | Sizes: sm (32px) · md (40px) · lg (48px) |
| **Input** | `DS-INPUT-TEXT` | Single-line text |
| **Textarea** | `DS-INPUT-TEXTAREA` | Multi-line · auto-grow |
| **Select** | `DS-SELECT-SINGLE` · `DS-SELECT-COMBOBOX` · `DS-SELECT-RELATION` | Searchable · FK picker |
| **Multi Select** | `DS-SELECT-MULTI` | Chips for selected values |
| **Checkbox** | `DS-CHECKBOX` | Group with fieldset legend |
| **Radio** | `DS-RADIO` | Single choice in group |
| **Switch** | `DS-SWITCH` | Immediate boolean toggle |
| **Badge** | `DS-BADGE` · `DS-BADGE-STATUS` | Count pill · entity status |
| **Tag** | `DS-TAG` | Removable filter · category |
| **Alert** | `DS-ALERT-INFO` · `SUCCESS` · `WARNING` · `DANGER` | Page · inline · toast |
| **Avatar** | `DS-AVATAR` | 32px inline · 40px profile · `--radius-full` |
| **Divider** | `DS-DIVIDER` | Section separator · `--color-border` |
| **Tooltip** | `DS-TOOLTIP` | Short hint · 400ms hover delay |

### 2.2 Usage rules

| Rule | Detail |
|------|--------|
| One primary button | Max one `DS-BTN-PRIMARY` per section |
| Destructive | `DS-BTN-DANGER` — never primary · confirm required |
| Labels | Above field · required asterisk + `aria-required` |
| Status badges | Universal status tokens only — all modules |
| Mobile CTAs | `DS-BTN-PRIMARY` lg — min 44×44px tap |

### 2.3 Interaction rules

| Component | Interaction |
|-----------|-------------|
| Button | hover · focus ring · disabled · loading spinner |
| Input | focus · error inline below · read-only styling |
| Select | keyboard ↑↓ · Enter select · clear on combobox |
| Switch | immediate toggle — no save button required |
| Tooltip | hover 400ms · focus instant · never essential info only |

---

## 3. Data Components

### 3.1 Catalog

| Component | ID | Use |
|-----------|-----|-----|
| **Table** | `DS-TABLE` | Simple lists · <10 columns |
| **Data Grid** | `DS-DATAGRID` | Sort · resize · column picker · virtual scroll |
| **Card List** | `DS-CARD-LIST` | Mobile list fallback |
| **Filter Bar** | `DS-FILTER-BAR` | Quick chips + advanced toggle |
| **Search Bar** | `DS-INPUT-SEARCH` | List-scoped search · 300ms debounce |
| **Pagination** | `DS-PAGINATION` | Page 25/50/100 · "Showing X–Y of Z" |
| **Bulk Actions** | `DS-BULK-BAR` | Sticky bar when rows selected |
| **Export Actions** | `DS-EXPORT-MENU` | CSV · Excel · PDF — permission-gated |
| **Import Actions** | `DS-IMPORT-MENU` | Upload wizard · progress modal |
| **Status Indicators** | `DS-BADGE-STATUS` | Paid · pending · active — icon + label + color |

### 3.2 Usage rules

| Rule | Detail |
|------|--------|
| Desktop default | `DS-DATAGRID` on list layouts |
| Mobile default | `DS-CARD-LIST` — same data source |
| Row click | Opens `?view={id}` drawer — locked CRUD |
| Bulk bar | Appears when ≥1 row selected |
| Export | Respects current filters + column visibility |
| Money columns | Right-aligned · locale format |

### 3.3 Interaction rules

| Component | Interaction |
|-----------|-------------|
| Data grid | Row click · checkbox select · ⋯ row menu · ↑↓ keyboard |
| Filter bar | URL sync for shareable filters · clear all |
| Bulk bar | Permission-gated actions · confirm destructive |
| Import | Long-running → `DS-LOADING-PROGRESS` modal |

---

## 4. Overlay Components

### 4.1 Catalog

| Component | ID | Use | z-index |
|-----------|-----|-----|---------|
| **Drawer (CRUD)** | `DS-DRAWER-CRUD` | Create · view · edit — right sheet | 70 |
| **Modal** | `DS-MODAL` | Quick-create · confirm delete | 70 |
| **Popover** | `DS-POPOVER` | Date picker · column menu | 60 |
| **Dropdown** | `DS-DROPDOWN` | Row actions · user menu | 60 |
| **Command Palette** | `DS-COMMAND-PALETTE` | Global search · `Ctrl+K` | 80 |
| **Context Menu** | `DS-CONTEXT-MENU` | Right-click / long-press row | 60 |
| **Side Sheet** | `DS-DRAWER-CONTEXT` | Filters · activity · AI utility — 320px | 65 |

### 4.2 Usage rules

| Rule | Detail |
|------|--------|
| CRUD drawer | `?create=1` · `?view=` · `?edit=` — list stays mounted |
| Drawer width | 480px default · 640px complex · 100vw mobile |
| Modal nesting | Max 1 level — no modal on modal on mobile |
| Command palette | 560px centered desktop · full-screen mobile |
| Mobile overlays | One blocking overlay at a time |

### 4.3 Interaction rules

| Component | Interaction |
|-----------|-------------|
| Drawer | × · Escape · Cancel · dirty confirm on close |
| Modal | Focus trap · return focus to trigger |
| Command palette | ↑↓ navigate · Enter execute · Esc close |
| Side sheet | Coexists with CRUD on desktop wide only |

---

## 5. Navigation Components

Shell navigation uses **`WS-*`** IDs; content navigation uses **`DS-*`**.

### 5.1 Catalog

| Component | ID | Zone |
|-----------|-----|------|
| **Sidebar** | `WS-SIDE-*` | C — 240px expanded · 64px collapsed |
| **Module Navigation** | `WS-MODNAV-*` | B — Dashboard · Operations · Reports · Automation · Settings |
| **Breadcrumb** | `WS-CONTENT-BREADCRUMB` | D — module › feature › record |
| **Tabs** | `DS-TABS` | D — record tabs · settings sections |
| **Top Navigation** | `WS-HEADER-*` | A — global header cluster |
| **Bottom Navigation** | `WS-MOBILE-NAV-*` | F — 5 slots mobile |
| **Quick Actions Menu** | `WS-HEADER-QUICK` | A — `+` dropdown creates |

### 5.2 Usage rules

| Rule | Detail |
|------|--------|
| RBAC | Hide nav items — never disabled links |
| Module tabs | Hide empty tabs entirely |
| Breadcrumb | Max 4 visible · ellipsis middle overflow |
| Quick actions | Max 12 visible · drawer routes `?create=1` |

### 5.3 Interaction rules

| Component | Interaction |
|-----------|-------------|
| Sidebar | Collapse persist · hover expand when collapsed |
| Module nav | Horizontal scroll on tablet/mobile |
| Breadcrumb | Segment click → parent route · closes drawer |
| Bottom nav | Home · Search · AI · Notifications · More |

---

## 6. Dashboard Components

Render inside **`WS-CONTENT-WIDGET`** chrome — platform-owned frame.

### 6.1 Catalog

| Component | ID | Widget category |
|-----------|-----|-----------------|
| **KPI Card** | `DS-CARD-KPI` | `kpi` |
| **Chart Card** | `DS-CARD-CHART` | `chart` |
| **Activity Feed** | `DS-ACTIVITY-FEED` | `activity` |
| **Task List** | `DS-TASK-LIST` | `list` |
| **AI Insight Card** | `DS-AI-INSIGHTS` | `ai` |
| **Notification Card** | `DS-NOTIFICATION-CARD` | `alert` |
| **Report Card** | `DS-CARD-REPORT` | `report` |

### 6.2 Usage rules

| Rule | Detail |
|------|--------|
| Widget ID | `{module}.{kebab-name}` in manifest |
| Sizing | 1–12 col span · 80px row unit · max 6 rows default |
| States | Loading · empty · error · success — per §9 |
| Mobile | `mobileSupport`: full · compact · none |
| Data | Module API only — no cross-module DB |

### 6.3 Interaction rules

| Component | Interaction |
|-----------|-------------|
| KPI Card | Click → drill-down list/report |
| Chart Card | Segment click → configured route |
| Task List | Row click → `?view=` or approval flow |
| AI Insight | CTA → `DS-AI-PANEL` |

---

## 7. Productivity Components

### 7.1 Catalog

| Component | ID | Use |
|-----------|-----|-----|
| **Kanban Board** | `DS-KANBAN-BOARD` | Pipeline columns · drag cards |
| **Calendar** | `DS-CALENDAR` | Month · week · day views |
| **Timeline** | `DS-TIMELINE` | Audit · history vertical |
| **Comments** | `DS-COMMENTS` | Thread on record |
| **Activity Feed** | `DS-ACTIVITY-FEED` | Chatter stream (shared with dashboard) |
| **Attachments** | `DS-ATTACHMENTS` | Upload · list · preview |
| **Followers** | `DS-FOLLOWERS` | Avatar stack · add/remove watchers |

### 7.2 Usage rules

| Rule | Detail |
|------|--------|
| Kanban card click | Opens `?view=` drawer |
| Calendar event click | Opens event drawer |
| Activity | Core chatter — modules add tabs, not rebuild |
| Attachments | Permission-gated upload |

### 7.3 Interaction rules

| Component | Interaction |
|-----------|-------------|
| Kanban | Drag between columns · optimistic move where safe |
| Comments | Submit · edit own · @mention |
| Followers | Toggle follow · notify on activity |

---

## 8. AI Components

Six locked families per FINAL_UI_ARCHITECTURE_LOCK — no custom AI chrome per module.

### 8.1 Catalog

| Component | ID | Maps to family |
|-----------|-----|----------------|
| **AI Assistant Panel** | `DS-AI-PANEL` | Panel — utility zone 400px |
| **AI Chat Window** | `DS-AI-CHAT` | Chat — thread + input |
| **AI Suggestion Card** | `DS-AI-SUGGESTIONS` | Suggestions — 3–5 chips |
| **AI Action Menu** | `DS-AI-ACTIONS` | Actions — toolbar · row · bulk |
| **AI Brief Widget** | `DS-AI-BRIEFING` | Briefing — daily/weekly summary |
| **AI Recommendation Widget** | `DS-AI-INSIGHTS` | Insights — inline cards · KPI narrative |
| **AI Activity Log** | (dashboard widget) | Automations audit — read-only |

### 8.2 Usage rules

| Rule | Detail |
|------|--------|
| Entry points | Header ✨ · `Ctrl+J` · command palette · FAB |
| AI off | Hide all entry points — graceful |
| Destructive AI | Confirm + preview before apply |
| Financial/legal | Human review required |
| Tokens | `--color-ai` · `--color-ai-subtle` accents |

### 8.3 Interaction rules

| Component | Interaction |
|-----------|-------------|
| AI Panel | Streaming tokens · cancel · Escape close |
| Suggestions | Click inserts prompt into chat input |
| AI Actions | Show tool-call indicator · inline retry on error |

---

## 9. Empty State Components

### 9.1 Catalog

| Component | ID | When |
|-----------|-----|------|
| **No Data** | `DS-EMPTY-DEFAULT` | Zero records · no filters |
| **No Search Results** | `DS-EMPTY-SEARCH` | Filters return zero |
| **No Permission** | `DS-EMPTY-PERMISSION` | Access denied view |
| **No Integration** | `DS-EMPTY-INTEGRATION` | External service not connected |
| **Create First Record** | `DS-EMPTY-FIRST` | Onboarding · first-run |
| **AI Suggested Action** | `DS-EMPTY-AI` | AI first-run CTA |

Wrapper: `DS-CARD-EMPTY` · Shell: `WS-OVERLAY-EMPTY`

### 9.2 Usage rules

| Rule | Detail |
|------|--------|
| Illustration | 120px mobile · 160px desktop max · muted |
| CTA | One primary max — `DS-BTN-PRIMARY` |
| Create CTA | `?create=1` on list route |
| Permission | Hide CTA when user lacks create permission |
| AI fallback | Standard first-record when AI module off |

---

## 10. Loading State Components

Skeleton-first per locked **Fast** principle.

### 10.1 Catalog

| Component | ID | When |
|-----------|-----|------|
| **Skeleton Card** | `DS-SKELETON-CARD` | KPI · widget · card list item |
| **Skeleton Table** | `DS-SKELETON-ROW` × N | List/grid initial load |
| **Skeleton Form** | `DS-SKELETON-TEXT` | Drawer/form fields |
| **Progress Indicator** | `DS-LOADING-PROGRESS` | Import · export · long task |
| **Background Refresh** | (inline badge) | "Updating…" on stale data |
| **Optimistic Update Indicator** | (subtle pending) | Safe toggles · reorder |

Shell: `WS-OVERLAY-SKELETON` · Token: `--opacity-skeleton`

### 10.2 Usage rules

| Rule | Detail |
|------|--------|
| Prefer skeleton | Over spinner for known layouts |
| Shell persists | Zone D skeleton only — header/sidebar visible |
| Delay | Show skeleton after 100ms · min display 300ms |
| Optimistic | Only safe mutations — revert + toast on failure |
| Widget error | Inline retry — no dashboard crash |

---

## 11. Responsive Rules

Design at **375px** — enhance upward. Min tap **44×44px**.

### 11.1 Desktop (≥1024px)

| Component family | Behaviour |
|------------------|-----------|
| Foundation | md button default · 2-col form grid |
| Data | `DS-DATAGRID` full features |
| Overlay | CRUD drawer 480–640px · list visible |
| Navigation | Sidebar expanded 240px · utility panel available |
| Dashboard | 12-column widget grid |
| AI | Utility panel 400px alongside content |

### 11.2 Tablet (768–1023px)

| Component family | Behaviour |
|------------------|-----------|
| Foundation | Same · slightly reduced density |
| Data | Horizontal scroll or reduced columns |
| Overlay | Drawer 480px or full-width at md |
| Navigation | Sidebar collapsed 64px · scroll module tabs |
| Dashboard | 6-column logical reflow |
| AI | Context sheet overlay |

### 11.3 Mobile (<768px)

| Component family | Behaviour |
|------------------|-----------|
| Foundation | Single col forms · lg primary buttons · full-width |
| Data | `DS-CARD-LIST` replaces grid |
| Overlay | Full-screen sheets · one overlay at a time |
| Navigation | Bottom nav · drawer sidebar |
| Dashboard | 1-column stack — KPI · tasks · notifications · AI priority |
| AI | Full-screen `DS-AI-PANEL` |
| Quick actions | Bottom Create slot — header `+` hidden |

### 11.4 Component behaviour matrix

| Component | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| `DS-DATAGRID` | Full | Scroll / fewer cols | Hidden → `DS-CARD-LIST` |
| `DS-DRAWER-CRUD` | Right 480px | 480px | 100vw |
| `DS-COMMAND-PALETTE` | 560px modal | Modal | Full screen |
| `DS-BTN-PRIMARY` | md | md | lg full-width |
| `DS-CARD-KPI` | 3–4 per row | 2 per row | 1 per row |
| `DS-TABS` | Full labels | Scroll | Scroll / dropdown |
| `DS-BULK-BAR` | Sticky above table | Sticky | Bottom sticky above nav |

---

## 12. Global Usage Rules

| Rule | Detail |
|------|--------|
| ID reference | Menus specs cite `DS-*` or `WS-*` — mandatory |
| Tokens | `--color-*` · `--space-*` · `--radius-*` only |
| Module variants | **Forbidden** without ADR |
| Permission UI | Hide — never disable |
| CRUD | Drawer URL params only for standard entities |
| Prototype | Shadcn maps to DS IDs — not ad-hoc Tailwind |
| Accessibility | WCAG 2.1 AA all families |

---

## 13. Global Interaction Rules

| Pattern | Rule |
|---------|------|
| Focus | Visible `--color-focus-ring` on all interactives |
| Keyboard | Full operability — no mouse-only flows |
| Loading | Button shows spinner · width preserved |
| Error | Inline below field · form summary on submit |
| Toast | Transient success — persistent error |
| Escape | Closes topmost overlay |
| Reduced motion | Disable non-essential animation |

---

## 14. Accessibility Notes

| Requirement | Applies to |
|-------------|------------|
| WCAG 2.1 AA contrast | All text · badges · buttons |
| `aria-label` / visible label | Inputs · icon buttons |
| `aria-required` | Required form fields |
| `aria-describedby` | Field errors |
| `aria-modal` | Drawer · modal · command palette |
| `aria-live="polite"` | AI new messages · toast |
| `aria-busy` | Loading regions |
| Color + icon + label | Status indicators — never color alone |
| Focus trap | Modal · drawer · palette |
| 44×44px min tap | Mobile all interactives |

---

## 15. Module Compliance

```text
✅ Compose from COMPONENT_UI_BLUEPRINT catalog
✅ Cite DS-* IDs in Menus/{screen}.md
✅ Use semantic tokens only
❌ Module-specific button · table · drawer variants
❌ Custom AI panel chrome
❌ Raw hex in documentation or prototype
❌ Skip mobile fallback for lists
```

---

## 16. Related Standards (Technical Detail)

| Topic | Document |
|-------|----------|
| ID registry | COMPONENT_LIBRARY_STANDARD.md |
| Tokens | DESIGN_TOKEN_STANDARD.md |
| Tables | TABLE_AND_DATA_GRID_STANDARD.md |
| Forms | FORM_STANDARD.md |
| Overlays | DRAWER_MODAL_STANDARD.md |
| AI | AI_COMPONENT_STANDARD.md |
| Empty | EMPTY_STATE_STANDARD.md |
| Loading | LOADING_STATE_STANDARD.md |
| Responsive | RESPONSIVE_UI_STANDARD.md |

This blueprint is the **UI design layer**; Step 10 standards hold technical contracts.

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 14 — component library UI blueprint |

---

**Component Library UI Blueprint** — 71 components · nine families · one catalog.
