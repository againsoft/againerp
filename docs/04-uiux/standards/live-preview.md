# Live Preview

> **Status:** Draft  
> **Parent:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §13

---

## Purpose
Global UI standard: live preview.

## When To Read
Read only if working on UI patterns related to live preview.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

Real-time preview as user edits — **no save required** to see result.

---

## Supported Entities

| Entity | Preview Type |
|--------|--------------|
| **Products** | Storefront product page |
| **Blogs** | Published blog layout |
| **Pages** | Builder page render |
| **Emails** | Inbox-style email preview |
| **SEO meta** | Google snippet preview |
| **Landing pages** | Full page builder preview |

---

## Layout Modes

| Mode | UI |
|------|-----|
| **Split** | Edit left 50% · Preview right 50% (desktop) |
| **Toggle** | Edit \| Preview tabs |
| **New tab** | "Open preview" → draft token URL |
| **Device** | Desktop / tablet / mobile frame toggle |

---

## Update Behavior

| Rule | Spec |
|------|------|
| Debounce | 500ms after last keystroke |
| Loading | Preview iframe skeleton |
| Draft token | Preview uses unpublished draft data |
| Variant preview | Variant selector updates preview gallery + price |

---

## SEO Snippet Preview

```
┌─────────────────────────────────────────┐
│ Google Preview                          │
│ https://store.com/products/blue-shirt   │
│ Blue Cotton T-Shirt — ৳899 | Store Name │
│ Soft cotton t-shirt available in...     │
│ ⚠ Title 58 chars (optimal: 50–60)      │
└─────────────────────────────────────────┘
```

Updates live as title/description edited. See [seo-assistant-ui.md](./seo-assistant-ui.md).

---

## Email Preview

Subject line + from name + HTML body. Send test email button.

---

## Mobile

Preview opens full-screen sheet. Swipe down to return to edit.
