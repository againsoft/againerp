# Auto Save Standards

> **Status:** Draft  
> **Parent:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §14  
> **Related:** [forms.md](./forms.md)

---

## Purpose
Global UI standard: autosave.

## When To Read
Read only if working on UI patterns related to autosave.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

Every major form auto-saves drafts — users never lose work.

---

## Rules

| Rule | Spec |
|------|------|
| Draft first | New records start as `draft` status |
| Interval | 30s default; 60s for heavy forms |
| Trigger also | On blur of section, before navigation |
| Indicator | Header: "Saving…" → "Saved · 3s ago" → "Unsaved changes" |
| Conflict | Optimistic lock via `updated_at` — show merge UI on conflict |
| Offline | Queue saves; sync when online (PWA future) |

---

## Applies To

| Entity | Autosave | Manual Publish |
|--------|----------|----------------|
| Products | ✓ draft | Publish button |
| Pages / Blogs | ✓ draft | Publish |
| Builder pages | ✓ draft | Publish |
| Settings | ✓ on blur | Immediate effect |
| Orders (manual) | ✓ draft orders | Confirm order |
| Coupons | ✓ draft | Activate |

---

## UI Indicator

```
[Draft] Blue T-Shirt          Saved · 12s ago  [Publish]
```

| State | Display |
|-------|---------|
| Saving | Spinner + "Saving…" |
| Saved | Check + relative time |
| Error | Red + "Save failed — Retry" |
| Dirty | Amber dot + "Unsaved changes" |

---

## Navigation Guard

Leaving page with unsaved changes (failed save):

```
You have unsaved changes. Leave anyway?
[Stay] [Discard] [Save & Leave]
```

---

## API

```
PATCH /api/v1/catalog/products/{id}
Headers: If-Unmodified-Since: {updated_at}
Body: { ...partial fields, status: draft }
```

---

## Performance

- Debounce field changes — batch into single PATCH
- Send only dirty fields
- Skip autosave if validation errors on required publish fields (draft allows partial)
