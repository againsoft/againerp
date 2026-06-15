# AgainERP — UX & Smart Interaction Standards

> **Status:** Draft  
> **Version:** 1.0  
> **Parent:** [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **Governance:** [GOVERNANCE.md](../GOVERNANCE.md) · [DEVELOPMENT_STANDARDS.md](../DEVELOPMENT_STANDARDS.md)  
> **Rule:** Minimize clicks. Maximize productivity. Reduce user effort on every screen.

**No code.** Canonical smart interaction standards for AgainERP admin and storefront.

---

## Core Philosophy

| Principle | Rule |
|-----------|------|
| **Minimize clicks** | Popup-first for simple creates; inline edit on lists |
| **Maximize productivity** | Keyboard shortcuts, autosave, live filters |
| **Reduce effort** | Smart relations, media reuse, AI assistance |
| **No unnecessary reloads** | SPA/async updates unless full navigation required |

---

# 1. Global AI Assistant

AI Assistant **must be available on every page**.

### Capabilities

| Category | Features |
|----------|----------|
| **Search** | Product, customer, order search |
| **Content** | Product descriptions, blogs, emails, translations |
| **SEO** | Meta generation, SEO suggestions |
| **Analytics** | Inventory analysis, sales analysis, dashboard insights |
| **Reports** | Report generation and summarization |

### Access

| Entry | Spec |
|-------|------|
| **Floating AI button** | Bottom-right FAB on all pages (mobile + desktop) |
| **Sidebar AI panel** | Persistent panel in right utility zone |
| **Keyboard** | `Ctrl+I` / `Cmd+I` |
| **Header** | ✨ icon |
| **Command palette** | `Ctrl+K` → "Ask AI" |

**Detail:** [ai-assistant-ui.md](./ai-assistant-ui.md) · [AI_FIRST_ARCHITECTURE.md](../modules/ai/AI_FIRST_ARCHITECTURE.md)

---

# 2. Smart Search

Global search across all entities — **no page reload**.

### Scope

Products · Categories · Brands · Customers · Orders · Pages · Media · Reports · Settings

### Features

Live search · Autocomplete · Search suggestions · Recent searches · Popular searches · AI search · Voice search ready · `Ctrl+K`

**Detail:** [global-search.md](./global-search.md) · [command-palette.md](./command-palette.md)

---

# 3. Live Filters

All filters work **without page reload**. Instant results.

### Features

Instant filtering · Multi-select · Saved filters · Filter presets · Dynamic filter counts · URL-based filters · Advanced filters

### Applies To

Product List · Order List · Customer List · Media List · Reports · All admin list views

**Detail:** [live-filters.md](./live-filters.md) · [filters.md](./filters.md)

---

# 4. Product Gallery Standards

Inspired by **Alibaba** and **Amazon**.

### Media Types

Images · Videos · 360° images · PDF catalog · Attachments · **Mixed gallery**

### Gallery Features

Video + image together · Drag & drop sort · Primary media · Gallery groups

**Detail:** [product-gallery.md](./product-gallery.md)

---

# 5. Variant Driven Gallery

When variant changes → **instant update** (no reload):

| Updates | Trigger |
|---------|---------|
| Gallery | Variant media set |
| Price | Variant price |
| Stock | Warehouse availability |
| SKU | Variant SKU |
| Delivery estimate | Shipping rules per variant |

**Example:** Color = Black → Black images · Black price · Black stock

**Detail:** [product-gallery.md](./product-gallery.md) § Variant Gallery

---

# 6. Real-Time Product Updates

Changing variant attributes instantly updates:

Price · Availability · Gallery · Promotions · Specifications

**Triggers:** Variant · Color · Storage · RAM · Warranty · Delivery area

All via async API — zero full page reload.

**Detail:** [product-gallery.md](./product-gallery.md) § Real-Time Updates

---

# 7. Smart Admin Lists

All admin tables support productivity features.

| Feature | Description |
|---------|-------------|
| Inline edit | Click cell to edit |
| Inline status change | Dropdown in row |
| Inline price update | Number input in cell |
| Inline stock update | Stock cell edit |
| Quick actions | Row action menu |
| Bulk actions | Multi-select toolbar |
| Keyboard navigation | Arrow keys, Enter, Tab |
| Excel-style editing | Tab between cells, paste from spreadsheet |

**Applies to:** Products · Orders · Customers · Inventory · Coupons · Media

**Detail:** [tables.md](./tables.md) · [smart-admin-lists.md](./smart-admin-lists.md)

---

# 8. Popup First UX

**Avoid new pages** for simple actions. Use popup / drawer / modal.

### Popup Create Actions

Create Category · Brand · Attribute · Supplier · Tag · Customer Group · Filter · Coupon · Warehouse · User

### Pattern

```
Brand Dropdown
[ Select Brand ▾ ]
[ + Add Brand ]  →  Popup opens  →  Save  →  Auto-selected  →  No reload
```

**Detail:** [popup-first-ux.md](./popup-first-ux.md)

---

# 9. Smart Relation Creation

Every relational field supports **in place**:

| Action | UI |
|--------|-----|
| **Create** | `+` opens popup create |
| **Edit** | Pencil opens popup edit |
| **Search** | Autocomplete lookup |
| **View** | Link opens record drawer |

**Applies to:** Brand · Category · Customer · Supplier · Warehouse · User · Company · Branch

**Detail:** [popup-first-ux.md](./popup-first-ux.md) § Smart Relations

---

# 10. Advanced Product Editor

**Shopify-inspired** product editor.

### Sections

General · Pricing · Inventory · Variants · Media · SEO · Related Products · Attributes · Specifications · History · Activities

### Behavior

Autosave · Draft mode · Live preview (storefront)

**Detail:** [modules/ecommerce/catalog/ARCHITECTURE.md](../modules/ecommerce/catalog/ARCHITECTURE.md) · [forms.md](./forms.md)

---

# 11. Rich Text Editor

**Do NOT use basic textarea** for long-form content.

### Recommended

**TipTap** (primary) · **Editor.js** (alternative)

### Features

Images · Videos · Tables · Code blocks · Embeds · AI writing · Templates · Drag & drop blocks · Reusable blocks

Better than classic WordPress editor.

**Detail:** [rich-text-editor.md](./rich-text-editor.md)

---

# 12. Media Manager

**WordPress Media Library** inspired.

Folders · Search · Filters · Tags · Bulk upload · Drag-drop · Media reuse · Optimization · CDN · Version history · **Media popup selector**

### Pattern

```
Add Product Image → Click → Media Library Popup → Select existing OR upload → Apply → No reload
```

**Detail:** [media-manager-ui.md](./media-manager-ui.md)

---

# 13. Live Preview

Real-time preview for:

Products · Blogs · Pages · Emails · SEO meta · Landing pages

Split view or toggle: **Edit | Preview** — updates as user types (debounced 500ms).

**Detail:** [live-preview.md](./live-preview.md)

---

# 14. Auto Save

Every major form auto-saves drafts.

| Entity | Interval | Indicator |
|--------|----------|-----------|
| Products | 30s | "Saved · 2s ago" |
| Pages / Blogs | 30s | Same |
| Settings | On blur | "Unsaved changes" warning if navigating away |
| Orders (draft) | 60s | Draft badge |

**Detail:** [autosave.md](./autosave.md) · [forms.md](./forms.md)

---

# 15. Activity Timeline

Every record shows unified timeline:

Created · Edited · Price changes · Stock changes · Comments · Attachments · Approvals · User actions

Inspired by **Odoo Chatter**.

**Detail:** [activity-system.md](./activity-system.md)

---

# 16. Smart Notifications

**Real-time** notifications (WebSocket v2 / polling v1):

Orders · Reviews · Low stock · Approvals · Support tickets · Marketing campaigns · AI alerts

**Detail:** [notifications.md](./notifications.md)

---

# 17. SEO Assistant

Real-time SEO scoring panel.

| Metric | Display |
|--------|---------|
| SEO score | 0–100 gauge |
| Title length | Character count + optimal range |
| Description length | Character count + optimal range |
| Keyword density | Highlight in content |
| Schema status | Valid / missing / errors |
| Page speed | Suggestions link |
| AI suggestions | One-click apply |

**Detail:** [seo-assistant-ui.md](./seo-assistant-ui.md)

---

# 18. Performance Rules

**No page reload unless necessary.**

| Technique | Use |
|-----------|-----|
| Lazy loading | Images, tabs, long lists |
| Infinite scroll | Mobile lists, media grid |
| Async requests | Filters, variant updates, autosave |
| Background processing | Import, export, AI generation |
| Optimized queries | Paginated APIs, field selection |

**Detail:** [performance-ui.md](./performance-ui.md)

---

# 19. Accessibility

Keyboard shortcuts · Screen reader support · High contrast · Responsive design · Touch friendly (44px targets)

Cross-reference: [design-system.md](./design-system.md) · [mobile-first.md](./mobile-first.md)

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Command palette / search |
| `Ctrl+I` | AI Assistant |
| `Ctrl+S` | Force save |
| `Esc` | Close modal / panel |

---

# 20. Future Ready Features

Architecture must support **without UI redesign**:

| Feature | Hook |
|---------|------|
| AI Chatbot | Floating assistant + `ai_*` APIs |
| AI Copilot | Inline field suggestions |
| Voice commands | Voice search ready flag |
| Visual search | Image upload in search |
| Image search | Media embedding index |
| Product recommendations | Widget + API slot |
| Predictive search | Search query ML |
| AI customer support | Helpdesk + AI panel |
| AI analytics | Dashboard AI widgets |

**Detail:** [future-interactions.md](./future-interactions.md)

---

## Document Map

| Section | Document |
|---------|----------|
| AI Assistant | [ai-assistant-ui.md](./ai-assistant-ui.md) |
| Smart Search | [global-search.md](./global-search.md) |
| Live Filters | [live-filters.md](./live-filters.md) |
| Product Gallery | [product-gallery.md](./product-gallery.md) |
| Smart Lists | [smart-admin-lists.md](./smart-admin-lists.md) |
| Popup / Relations | [popup-first-ux.md](./popup-first-ux.md) |
| Rich Text | [rich-text-editor.md](./rich-text-editor.md) |
| Media Manager | [media-manager-ui.md](./media-manager-ui.md) |
| Live Preview | [live-preview.md](./live-preview.md) |
| Autosave | [autosave.md](./autosave.md) |
| SEO Assistant | [seo-assistant-ui.md](./seo-assistant-ui.md) |
| Performance | [performance-ui.md](./performance-ui.md) |
| Future | [future-interactions.md](./future-interactions.md) |

---

## Module Compliance

1. List pages → live filters + smart admin lists
2. Relational fields → popup-first create/edit
3. Product/catalog screens → gallery + variant real-time rules
4. Long-form content → TipTap, never raw textarea
5. Media selection → popup media manager
6. All forms → autosave on drafts

---

**Platform:** AgainERP  
**Last Updated:** 2026-06-12  
**Maintainer:** Design System Team
