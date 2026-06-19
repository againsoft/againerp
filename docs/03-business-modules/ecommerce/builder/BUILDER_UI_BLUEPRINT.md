# AgainERP — Builder Module UI Blueprint

> **Status:** Active — **Builder UI SSOT**  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 18 — Builder UI Design  
> **Module:** Builder (Ecommerce storefront CMS) · Route prefix `/ecommerce/builder`  
> **Governance:** [FINAL_UI_ARCHITECTURE_LOCK.md](../../FINAL_UI_ARCHITECTURE_LOCK.md) — APPROVED  
> **Components:** [COMPONENT_UI_BLUEPRINT.md](../../04-uiux/standards/COMPONENT_UI_BLUEPRINT.md)  
> **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md) · [README.md](./README.md)

**Documentation only.** No mockups · No Figma · No code.

> **Layout exception:** Builder visual editors use **`LAYOUT-BUILDER`** (canvas shell) — approved ADR extension for drag-drop composition. Standard entity lists (pages, templates, forms, menus) still follow locked **`LAYOUT-LIST`** + drawer CRUD.

---

## Purpose

Define the **complete AgainERP Builder UI** — navigation, layouts, panels, canvas rules, interactions, responsive rules, and AI features — using the approved design system.

**Scope:** Website · Ecommerce · landing · theme · header · footer · popup · mega menu · blog layout · form · AI builder surfaces.

**Out of scope:** Storefront public render (SSR/CDN) — architecture only; admin composition UI only.

---

## Architecture alignment

| Concept | Source |
|---------|--------|
| Page model | `builder_pages` → sections → rows → columns → widgets |
| Themes | `builder_themes` · one active per company |
| Templates | `builder_templates` · homepage · landing · product · category · checkout · page |
| API | `/api/v1/builder/` |
| Permissions | `builder.*` |
| Autosave | Draft revision every 30s · target < 500ms |
| Publish | Snapshot + CDN invalidation · scheduled publish |

Content module owns blog/FAQ **text**; Builder owns **layout and presentation**.

---

## 1. Navigation

### 1.1 Global placement

| Property | Value |
|----------|-------|
| Parent module | Ecommerce |
| Sidebar group | Under Ecommerce · **Builder** sub-group |
| Module root | `/ecommerce/builder` |
| Module access | `builder.access` |
| Quick actions | New Page · Open Theme (manifest) |

### 1.2 Builder navigation (Level 2 — Zone B)

| Tab | ID | Route | Visible |
|-----|-----|-------|---------|
| **Dashboard** | `WS-MODNAV-DASH` | `/ecommerce/builder/dashboard` | Always |
| **Pages** | `WS-MODNAV-PAGES` | `/ecommerce/builder/pages` | Always |
| **Templates** | `WS-MODNAV-TPL` | `/ecommerce/builder/templates` | Always |
| **Sections** | `WS-MODNAV-SEC` | `/ecommerce/builder/sections` | Block library |
| **Theme** | `WS-MODNAV-THEME` | `/ecommerce/builder/theme` | `builder.theme.*` |
| **Menus** | `WS-MODNAV-MENU` | `/ecommerce/builder/menus` | `builder.menu.*` |
| **Forms** | `WS-MODNAV-FORM` | `/ecommerce/builder/forms` | `builder.form.*` |
| **Popups** | `WS-MODNAV-POPUP` | `/ecommerce/builder/popups` | Always |
| **Media** | `WS-MODNAV-MED` | `/ecommerce/media` | Core media (shared route) |
| **AI Builder** | `WS-MODNAV-AI` | `/ecommerce/builder/ai` | When AI on |
| **Settings** | `WS-MODNAV-SET` | `/ecommerce/builder/settings` | Store Admin |

### 1.3 Builder scope map (specialized editors)

| Builder type | Entry route | Opens |
|--------------|-------------|-------|
| **Website Builder** | `/ecommerce/builder/pages?type=cms` | Generic CMS pages |
| **Ecommerce Builder** | `/ecommerce/builder/pages?type=storefront` | Storefront page set |
| **Landing Page Builder** | `/ecommerce/builder/pages?type=landing` | Campaign pages |
| **Theme Builder** | `/ecommerce/builder/theme` | Global tokens + presets |
| **Header Builder** | `/ecommerce/builder/theme/header` | `LAYOUT-BUILDER` |
| **Footer Builder** | `/ecommerce/builder/theme/footer` | `LAYOUT-BUILDER` |
| **Popup Builder** | `/ecommerce/builder/popups?view=` | Modal layouts |
| **Mega Menu Builder** | `/ecommerce/builder/menus?view=` | Nested menu + mega panels |
| **Blog Builder** | `/ecommerce/builder/pages?type=blog` | Blog layout templates |
| **Form Builder** | `/ecommerce/builder/forms?view=` | Field canvas |
| **AI Builder** | `/ecommerce/builder/ai` | Generative tools hub |

Screen inventory: `Menus/Builder/`

### 1.4 Command palette

| Command ID | Label | Route |
|------------|-------|-------|
| `builder.pages.create` | New Page | `/ecommerce/builder/pages?create=1` |
| `builder.theme.open` | Theme Manager | `/ecommerce/builder/theme` |
| `builder.templates.browse` | Browse Templates | `/ecommerce/builder/templates` |

---

## 2. Pages & Layouts

| Page type | Layout ID | Route pattern | CRUD model |
|-----------|-----------|---------------|------------|
| Builder Dashboard | `LAYOUT-DASHBOARD` | `/ecommerce/builder/dashboard` | Widget grid |
| Page / template / form / menu lists | `LAYOUT-LIST` | `…/pages` · `…/templates` · etc. | Drawer CRUD |
| Visual editor (all builders) | **`LAYOUT-BUILDER`** | `…/pages/edit={id}` · theme/header/footer | Canvas — no drawer |
| Template Marketplace | `LAYOUT-MARKETPLACE` | `/ecommerce/builder/templates/marketplace` | Browse + install |
| Settings | `LAYOUT-SETTINGS` | `/ecommerce/builder/settings` | Form sections |

**List CRUD (locked):** `?create=1` · `?view={id}` · `?edit={id}` for metadata. **Open in Builder** action launches `LAYOUT-BUILDER` full-screen.

---

## 3. Builder Dashboard UI

**Route:** `/ecommerce/builder/dashboard`

### 3.1 Sections

| Order | Section | Widget ID | Category | Col span |
|-------|---------|-----------|----------|----------|
| 1 | **Recent Projects** | `builder.recent-projects` | `table` | 8 |
| 2 | **Published Sites** | `builder.published-sites` | `kpi` | 4 |
| 3 | **Draft Changes** | `builder.draft-changes` | `alert` / `list` | 4 |
| 4 | **Templates** | `builder.template-shortcuts` | `quick_action` | 4 |
| 5 | **Theme Status** | `builder.theme-status` | `kpi` | 4 |
| 6 | **AI Suggestions** | `builder.ai-suggestions` | `ai` | 8 |
| 7 | **Quick Actions** | `builder.quick-actions` | `quick_action` | 4 |

### 3.2 Quick actions

| Action | Route |
|--------|-------|
| New Page | `/ecommerce/builder/pages?create=1` |
| Edit Homepage | `/ecommerce/builder/pages/edit={homepage_id}` |
| Open Theme | `/ecommerce/builder/theme` |
| Browse Templates | `/ecommerce/builder/templates/marketplace` |

### 3.3 Row interactions

Recent project row → **Open Builder** (canvas) or **View metadata** (drawer).

---

## 4. Visual Builder Layout (`LAYOUT-BUILDER`)

Full-viewport editor — replaces Zone D content; workspace header (Zone A) remains; module nav (Zone B) collapses or hides during edit.

### 4.1 Structure

```text
┌─────────────────────────────────────────────────────────────────────┐
│ TOP TOOLBAR (BLDR-TOOLBAR)                                          │
├──────────┬──────────────────────────────────────────┬───────────────┤
│          │                                          │               │
│  LEFT    │              CANVAS                      │    RIGHT      │
│  PANEL   │         (BLDR-CANVAS)                    │    PANEL      │
│ (BLDR-   │                                          │  (BLDR-       │
│  PANEL-  │   Desktop · Tablet · Mobile preview      │   INSPECTOR)  │
│  LEFT)   │                                          │               │
│          │                                          │               │
├──────────┴──────────────────────────────────────────┴───────────────┤
│ BOTTOM STATUS BAR (BLDR-STATUS)                                     │
└─────────────────────────────────────────────────────────────────────┘
```

| Zone | Component ID | Width / behaviour |
|------|--------------|-------------------|
| Top Toolbar | `BLDR-TOOLBAR` | Full width · sticky · z-index 50 (below modals) |
| Left Panel | `BLDR-PANEL-LEFT` | 280px desktop · collapsible · drawer overlay mobile |
| Canvas | `BLDR-CANVAS` | Flex 1 · min-width 0 |
| Right Panel | `BLDR-INSPECTOR` | 320px desktop · tabbed · drawer overlay mobile |
| Bottom Status | `BLDR-STATUS` | 32px · save state · breakpoint · page slug |

**Builder component family:** `BLDR-*` — ADR-approved extension for canvas tooling; reuses `DS-*` for buttons, inputs, modals inside panels.

### 4.2 Entry / exit

| Action | Behaviour |
|--------|-----------|
| Enter builder | From list **Edit in Builder** or create → save metadata → auto-open |
| Exit | Toolbar **Back to Pages** · dirty confirm if unsaved |
| Save | Autosave + manual Save in toolbar |
| Publish | Separate from save · confirm modal |

---

## 5. Left Panel (`BLDR-PANEL-LEFT`)

Tabbed sidebar — one tab active at a time.

| Tab | Content | Interaction |
|-----|---------|-------------|
| **Pages** | Site page tree · system pages · locale switch | Click → load page in canvas |
| **Sections** | Section presets (hero · features · CTA · footer band) | Drag onto canvas |
| **Components** | Widget palette by category | Drag onto column |
| **Templates** | Apply template to page | Preview → replace confirm |
| **Global Elements** | Header · footer · announcement bar refs | Edit opens sub-builder |
| **Theme Assets** | Colors · fonts · spacing tokens (read-only preview) | Click → Theme Builder |

### 5.1 Widget palette categories (from architecture)

| Category | Widgets |
|----------|---------|
| Content | Heading · Text · HTML · Image · Video · Slider |
| Commerce | Product Grid · Carousel · Category List · Search · Cart Icon |
| Catalog | Featured Products · Collection · Brand Logos · Filters |
| Forms | Contact · Newsletter |
| Layout | Spacer · Divider · Tabs · Accordion |
| Marketing | Countdown · Coupon Banner · Testimonials |
| Navigation | Breadcrumbs · Menu |

Drag source: palette item → valid drop target (column) only · invalid drop shows `DS-ALERT-WARNING` ghost.

### 5.2 Mobile left panel

Bottom sheet or full-screen drawer · tabs as horizontal scroll chips.

---

## 6. Canvas Area (`BLDR-CANVAS`)

### 6.1 Preview modes

| Mode | Canvas width | Component |
|------|--------------|-----------|
| **Desktop Preview** | 100% or 1440px max centered | Default |
| **Tablet Preview** | 768px frame | Device chrome optional |
| **Mobile Preview** | 375px frame | Device chrome optional |

Switcher in top toolbar · persists per session.

### 6.2 Canvas rules

| Rule | Detail |
|------|--------|
| **Hierarchy** | Page → Section → Row → Column → Widget — visual nesting |
| **Drag & Drop** | Reorder sections/rows/widgets · resize columns (1–12 grid) |
| **Inline Editing** | Double-click text widgets · rich text mini toolbar |
| **Live Preview** | Widget data from Catalog/Media APIs (batched) |
| **Selection** | Single select · shift multi-select rows/widgets |
| **Hover** | Outline + widget type label |
| **Empty column** | `DS-EMPTY-DROP-ZONE` — "Drop widget here" |
| **Max widgets** | 200 per page (architecture limit) — warn at 180 |

### 6.3 Canvas interactions

| Gesture | Action |
|---------|--------|
| Click widget | Select · inspector shows properties |
| Drag handle | Reorder within parent |
| Column edge drag | Resize grid spans |
| Delete / Backspace | Remove selected (confirm if section) |
| Duplicate | `Ctrl+D` · copy widget with settings |
| Undo / Redo | Toolbar + `Ctrl+Z` / `Ctrl+Shift+Z` |

### 6.4 Preview vs edit

| Mode | Toolbar toggle |
|------|----------------|
| Edit | Selection outlines · drag enabled |
| Preview | No outlines · links inactive · no drag |

**Live storefront preview:** Opens new tab with draft token (architecture preview URL).

---

## 7. Right Panel (`BLDR-INSPECTOR`)

Context-sensitive to selection. No selection → page-level settings.

| Tab | Applies to | Content |
|-----|------------|---------|
| **Properties** | Widget / column / row / section | Content fields · data bindings |
| **Styles** | All levels | Spacing · background · border · theme token pickers |
| **Responsive Settings** | Row · column · widget | Per-breakpoint overrides (desktop/tablet/mobile JSON) |
| **SEO Settings** | Page | Meta · OG · canonical → `builder_page_seo` |
| **Visibility Rules** | Section · widget | Show/hide by device · schedule · audience (future) |
| **Animation** | Section · widget | Entrance · duration · delay (optional) |
| **AI Suggestions** | Contextual | `DS-AI-SUGGESTIONS` — copy · layout · SEO |

Uses standard form components: `DS-INPUT-*` · `DS-SELECT-*` · `DS-SWITCH` · semantic tokens only.

### 7.1 Responsive settings UI

Three-column breakpoint editor aligned with architecture JSON:

```json
{ "breakpoints": { "desktop": {}, "tablet": {}, "mobile": {} } }
```

Visual: icon tabs Desktop | Tablet | Mobile · overridden fields show indicator dot.

---

## 8. Top Toolbar (`BLDR-TOOLBAR`)

| Control | ID / component | Behaviour |
|---------|----------------|-----------|
| **Back** | `DS-BTN-GHOST` | Exit builder · dirty confirm |
| Page title | Editable inline | Updates `builder_pages.title` |
| **Publish** | `DS-BTN-PRIMARY` | `builder.page.publish` · schedule option |
| **Preview** | `DS-BTN-SECONDARY` | Draft tab · live preview |
| **Undo** | Icon button | Revision stack |
| **Redo** | Icon button | |
| **Save** | `DS-BTN-SECONDARY` | Manual save · disabled when clean |
| **History** | `DS-DROPDOWN` | Revisions list · rollback (`builder.page.publish`) |
| **Responsive Switcher** | Segmented control | Desktop · Tablet · Mobile |
| **AI Assistant** | `DS-AI-PANEL` trigger | `Ctrl+J` · builder context |

Status indicators: Saving… · Saved · Publish pending · Error.

---

## 9. Bottom Status Bar (`BLDR-STATUS`)

| Element | Content |
|---------|---------|
| Save state | Autosaved 12s ago · Unsaved changes |
| Page meta | Slug · locale · status badge |
| Breakpoint | Active preview mode |
| Widget count | N / 200 |
| CDN | Last publish time (if published) |

---

## 10. Theme Builder UI

**Route:** `/ecommerce/builder/theme` · Sub-routes for header/footer.

### 10.1 Theme Manager (settings + preview)

| Section | Content |
|---------|---------|
| Active theme | Name · preview thumbnail · activate |
| **Global Styles** | Token editor |
| **Typography** | Font families · scale · weights |
| **Colors** | Primary · secondary · surface · semantic palette |
| **Layout Presets** | Container width · section spacing · grid defaults |
| Custom CSS | Advanced textarea (optional) |

### 10.2 Header Builder

**Route:** `/ecommerce/builder/theme/header` · **`LAYOUT-BUILDER`**

| Feature | Detail |
|---------|--------|
| Layout | Logo · menu slot · search · cart · announcement |
| Mega menu | Menu Builder integration |
| Sticky / transparent | Style toggles |
| Preview | All breakpoints |

### 10.3 Footer Builder

**Route:** `/ecommerce/builder/theme/footer` · **`LAYOUT-BUILDER`**

Columns · links · newsletter widget · social · copyright.

Theme publish triggers `builder.theme.updated` → full CDN purge (architecture).

---

## 11. Ecommerce Builder UI

Dedicated storefront page editors — same `LAYOUT-BUILDER` · template-bound.

| Page type | Route / template_type | Key widgets |
|-----------|----------------------|-------------|
| **Homepage** | `/ecommerce/builder/pages/edit={id}` · `homepage` | Hero · collections · featured products |
| **Category Page** | PLP override · `category` | Filters · product grid · breadcrumbs |
| **Product Page** | PDP override · `product` | Gallery · buy box · related products |
| **Cart Page** | System page · `builder_system_pages` | Cart table · upsell |
| **Checkout Page** | Checkout Builder · `checkout` | Steps layout · trust badges |
| **Account Page** | System · customer portal shell | Orders · profile links |

Fallback: when no Builder override, default theme template renders (architecture).

---

## 12. Popup Builder UI

**Route:** `/ecommerce/builder/popups` · list + **`LAYOUT-BUILDER`** for layout.

| Feature | UI |
|---------|-----|
| List | `LAYOUT-LIST` · name · trigger · status |
| Canvas | Modal frame overlay on dimmed preview |
| Triggers | Link to Marketing (exit intent · delay · URL) |
| Preview | Device sizes |

Metadata CRUD via drawer · layout via canvas.

---

## 13. Mega Menu Builder UI

**Route:** `/ecommerce/builder/menus` · **`LAYOUT-BUILDER`** for mega panel design.

| Feature | Detail |
|---------|--------|
| Menu tree | `builder_menus` · `builder_menu_items` |
| Nested items | Drag reorder · parent_id |
| Mega panel | Wide dropdown layout · columns · featured image |
| Entity links | Category · page · product picker (`DS-SELECT-RELATION`) |
| Preview | Hover simulate on canvas |

Standard menu list uses `LAYOUT-LIST` + drawer for menu metadata.

---

## 14. Form Builder UI

**Route:** `/ecommerce/builder/forms` · **`LAYOUT-BUILDER`** (simplified canvas).

| Feature | Detail |
|---------|--------|
| Field palette | text · email · phone · select · checkbox · file |
| Drag fields | Vertical stack layout |
| Validation | Required · regex per field |
| Submissions | Link to submission list · export |
| Embed | Copy snippet / widget block for pages |

Submissions → Core Notification + optional CRM (architecture).

---

## 15. Blog Builder UI

**Route:** `/ecommerce/builder/pages?type=blog`

Blog **layout** templates (listing · post shell) in Builder; post **content** in Content module.

| Surface | Builder owns |
|---------|--------------|
| Blog index layout | Grid · sidebar · categories block |
| Post template | Hero · body slot · related posts widget |
| Canvas | Same `LAYOUT-BUILDER` rules |

---

## 16. AI Builder UI

**Route:** `/ecommerce/builder/ai` · **`LAYOUT-AI-TOOL`**

Components: **`DS-AI-*` only** · graceful hide when AI off.

### 16.1 Features

| Feature | Component | Flow |
|---------|-----------|------|
| **Generate Section** | `DS-AI-PANEL` | Prompt → preview section → insert canvas |
| **Generate Landing Page** | `DS-AI-PANEL` | Full page structure → review → create page |
| **Generate Product Page** | `DS-AI-SUGGESTIONS` | PDP layout from catalog context |
| **Generate Hero Banner** | `DS-AI-PANEL` | Image + copy → hero widget |
| **Generate Content** | `DS-AI-PANEL` | Headlines · body · CTA |
| **Generate Layout** | `DS-AI-PANEL` | Row/column structure from description |
| **Optimize UX** | `DS-AI-INSIGHTS` | Audit page · accessibility · conversion hints |

### 16.2 AI rules (builder-specific)

| Rule | Detail |
|------|--------|
| Preview required | Never insert without user confirm |
| Publish gate | AI does not auto-publish |
| Context | Current page · theme tokens · catalog subset |
| Inspector tab | AI Suggestions on selected widget |
| Toolbar | AI Assistant shares page context |

---

## 17. Template Marketplace UI

**Route:** `/ecommerce/builder/templates/marketplace` · **`LAYOUT-MARKETPLACE`**

| Feature | UI |
|---------|-----|
| **Browse Templates** | Grid cards · category filters · search |
| **Preview Template** | Full-screen modal · desktop/mobile toggle |
| **Install Template** | `DS-MODAL` confirm · copies to `builder_templates` |
| **Clone Template** | From existing tenant template |
| **Export Template** | `DS-EXPORT-MENU` · JSON bundle · permission-gated |

List management: `/ecommerce/builder/templates` — `LAYOUT-LIST` + drawer CRUD.

> Marketplace catalog may be platform-hosted (future); UI spec is ready for local + remote sources.

---

## 18. Mobile Builder UI

Builder is **desktop-first**; mobile admin provides essential access.

### 18.1 Priority surfaces

| Screen | Behaviour |
|--------|-----------|
| **Pages** | `DS-CARD-LIST` · status · last edited |
| **Canvas** | Mobile preview mode only on phone; edit on tablet+ recommended |
| **Properties** | Full-screen inspector drawer from bottom |
| **Publish** | Full-width primary in toolbar |
| **AI Assistant** | Full-screen `DS-AI-PANEL` |

### 18.2 Mobile rules

| Rule | Detail |
|------|--------|
| Left/right panels | Overlay drawers — not side-by-side |
| Drag-drop | Limited on phone — reorder via move-up/down menu |
| Tap targets | 44×44px minimum |
| Bottom status | Collapsed to save state icon |
| Warning | Banner: "Use desktop for full editing" on `< md` |

Dashboard and lists fully mobile-compliant per `DS-CARD-LIST`.

---

## 19. List Screens (standard CRUD)

All use **`LAYOUT-LIST`** + **`DS-DRAWER-CRUD`**.

| List | Route | Key columns |
|------|-------|-------------|
| Pages | `/ecommerce/builder/pages` | Title · slug · type · status · updated |
| Templates | `/ecommerce/builder/templates` | Name · type · usage count |
| Sections / Blocks | `/ecommerce/builder/sections` | Block name · category |
| Menus | `/ecommerce/builder/menus` | Name · code · items count |
| Forms | `/ecommerce/builder/forms` | Name · submissions · status |
| Popups | `/ecommerce/builder/popups` | Name · trigger · active |

Row actions: **Edit in Builder** · Duplicate · Delete (draft) · Export.

Filters: status · page_type · locale · date.

---

## 20. Interaction Rules (Builder-specific)

| Interaction | Rule |
|-------------|------|
| Autosave | Every 30s draft revision · `DS-LOADING-INLINE` in status bar |
| Publish | Creates published snapshot · `builder.page.published` event |
| Rollback | History → select revision → confirm |
| Scheduled publish | Date/time picker in publish modal |
| Template apply | Confirm replace vs merge sections |
| Slug uniqueness | Inline validation per company+locale |
| Media | Core media picker only — no duplicate library |
| SEO | Sync to SEO module on publish |
| Dirty exit | `DS-MODAL` confirm — Save · Discard · Cancel |
| Undo stack | Session + revision boundary on publish |
| Permissions | Hide Publish if no `builder.page.publish` |

---

## 21. Permissions → UI

| Permission | UI effect |
|------------|-----------|
| `builder.access` | Builder nav visible |
| `builder.page.read` | View pages · open builder read-only |
| `builder.page.write` | Edit canvas · save |
| `builder.page.publish` | Publish · rollback · schedule |
| `builder.theme.*` | Theme · header · footer builders |
| `builder.template.*` | Templates · marketplace install |
| `builder.menu.*` | Menu / mega menu builder |
| `builder.form.*` | Form builder |
| `builder.block.*` | Block library save |

RBAC: **hide** forbidden controls — never disable (locked).

---

## 22. Responsive Rules

| Context | Desktop (`≥ lg`) | Tablet (`md–lg`) | Mobile (`< md`) |
|---------|------------------|------------------|-----------------|
| `LAYOUT-BUILDER` | 3-column shell | Collapsed panels · 768 canvas | Preview-only edit · panel drawers |
| Lists | `DS-DATAGRID` | `DS-DATAGRID` scroll | `DS-CARD-LIST` |
| Dashboard | 12-col grid | 2-col | 1-col stack |
| Marketplace | 4-col grid | 2-col | 1-col cards |
| Inspector | Fixed 320px right | Overlay 400px | Full-screen sheet |

Canvas breakpoint preview independent of admin viewport.

---

## 23. Component Mapping Summary

| Builder surface | Primary IDs |
|-----------------|-------------|
| Editor shell | `LAYOUT-BUILDER` · `BLDR-TOOLBAR` · `BLDR-CANVAS` · `BLDR-PANEL-LEFT` · `BLDR-INSPECTOR` · `BLDR-STATUS` |
| Standard chrome | `WS-*` shell · `DS-BTN-*` · `DS-MODAL` · `DS-DROPDOWN` |
| Lists | `DS-DATAGRID` · `DS-DRAWER-CRUD` · `DS-FILTER-BAR` |
| AI | `DS-AI-PANEL` · `DS-AI-SUGGESTIONS` · `DS-AI-INSIGHTS` |
| Empty / loading | `DS-EMPTY-*` · `DS-LOADING-SKELETON` |

---

## 24. Menus Spec Index

Align `Menus/Builder/*` with:

| Screen | layout_id |
|--------|-----------|
| Homepage Builder | `LAYOUT-BUILDER` |
| Theme Manager | `LAYOUT-SETTINGS` + sub-builders |
| Template Manager | `LAYOUT-LIST` |
| All * Builder menus | `LAYOUT-BUILDER` or `LAYOUT-LIST` |

Each spec: `context_required` (company · locale) · `empty_state` · `loading` · permission keys.

---

## 25. Compliance Checklist

- [ ] List screens use drawer CRUD — no `/new` routes
- [ ] Canvas uses `LAYOUT-BUILDER` ADR exception only inside Builder
- [ ] `BLDR-*` + `DS-*` / `WS-*` — no raw hex
- [ ] Dashboard widgets in ModuleManifest (`builder.*`)
- [ ] AI via `DS-AI-*` only · no auto-publish
- [ ] Mobile list card fallback
- [ ] Autosave + publish flow per architecture
- [ ] Cross-module links (Catalog · SEO · Media) — API only

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 18 — Builder UI blueprint |

---

**Builder UI Blueprint** — visual storefront composition · design-system compliant · prototype-ready.
