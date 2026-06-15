# SEO Assistant UI

> **Status:** Draft  
> **Parent:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §17  
> **Related:** [live-preview.md](./live-preview.md) · [modules/ecommerce/seo/ARCHITECTURE.md](../modules/ecommerce/seo/ARCHITECTURE.md)

---

## Purpose

Real-time SEO scoring and AI suggestions while editing products, pages, and blogs.

---

## Panel Placement

Product/Page editor → **SEO tab** — right column or split panel.

```
┌─────────────────────────────────┐
│ SEO Score            78 / 100   │
│ ████████████░░░░                │
├─────────────────────────────────┤
│ Title        58 chars  ✓ Good   │
│ Description  142 chars ⚠ Long  │
│ Keywords     cotton, shirt      │
│ Schema       ✓ Product valid    │
│ Page speed   → Run audit        │
├─────────────────────────────────┤
│ ✨ AI Suggestions               │
│ · Shorten meta description      │
│ · Add "cotton" to title         │
│ [Apply all] [Apply selected]    │
└─────────────────────────────────┘
```

---

## Metrics

| Metric | Rule | Display |
|--------|------|---------|
| **SEO score** | Weighted 0–100 | Gauge + color |
| **Title length** | Optimal 50–60 chars | Count + warn |
| **Description length** | Optimal 150–160 chars | Count + warn |
| **Keyword density** | Target 1–2% primary | Highlight in content |
| **Schema status** | JSON-LD validation | Valid / errors list |
| **Page speed** | Link to audit tool | Score or "Run audit" |
| **AI suggestions** | Actionable bullet list | One-click apply |

---

## Score Factors

| Factor | Weight |
|--------|--------|
| Title present + length | 20% |
| Description present + length | 20% |
| Primary keyword in title | 15% |
| Image alt tags | 10% |
| Schema markup | 15% |
| URL slug quality | 10% |
| Internal links | 10% |

---

## AI SEO Actions

| Action | Result |
|--------|--------|
| Generate title | Fills meta title field |
| Generate description | Fills meta description |
| Suggest keywords | Tag chips |
| Fix schema | Opens schema editor with fixes |
| Improve content | TipTap integration |

User reviews before apply — never auto-publish SEO changes.

---

## Live Updates

Recalculate score on debounce 500ms as user types. No save required for score display.

---

## Storefront vs Admin

Admin shows full panel. Storefront uses computed meta only — no admin UI exposed.
