# Performance UI Rules

> **Status:** Draft  
> **Parent:** [UX_SMART_INTERACTION_STANDARDS.md](./UX_SMART_INTERACTION_STANDARDS.md) §18  
> **Standards:** [DEVELOPMENT_STANDARDS.md §2](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md#2-performance-first)

---

## Purpose
Global UI standard: performance ui.

## When To Read
Read only if working on UI patterns related to performance ui.

## Related Files
- [Enterprise UI](ENTERPRISE_UI_ARCHITECTURE.md)
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Module UI standard](module-ui-standard.md)

---

## Purpose

**No page reload unless necessary.** Frontend performance patterns for AgainERP admin.

---

## Core Rule

| Do | Don't |
|----|-------|
| Async fetch + DOM update | Full page reload on filter |
| Client router navigation | `window.location` for in-app |
| Partial form PATCH | POST entire form on every field |
| Skeleton loaders | Blank white screen |
| Abort stale requests | Race condition wrong data |

---

## Techniques

| Technique | Use Case |
|-----------|----------|
| **Lazy loading** | Tab content, off-screen images, below-fold widgets |
| **Infinite scroll** | Mobile product lists, media grid (optional pagination on desktop) |
| **Async requests** | Filters, autosave, variant preview, search |
| **Background jobs** | Import, export, AI gen — progress toast + notification |
| **Optimistic UI** | Inline edit, toggle status |
| **Virtual scroll** | Tables > 100 rows |
| **Debounced input** | Search 300ms, preview 500ms, autosave 30s |
| **Request dedup** | Same GET within 100ms → single flight |
| **Field selection** | API `?fields=id,name,price` on lists |

---

## When Full Reload Is OK

- User logout / login
- Company switch (clear client state)
- Major version deploy (hard refresh prompt)
- External link navigation

---

## Loading States

| Context | Pattern |
|---------|---------|
| Table filter | Row opacity 0.6 + top progress bar |
| Record save | Button spinner |
| Gallery variant switch | Thumbnail skeleton |
| Dashboard widget | Card skeleton |
| Initial page | Shell visible + content skeleton |

---

## Bundle Strategy (Implementation Note)

- Route-based code splitting per module
- TipTap loaded only on editor screens
- Chart library lazy on dashboard

---

## Targets

| Metric | Target |
|--------|--------|
| First interaction | < 100ms |
| Filter response | < 300ms p95 |
| Autosave | < 500ms p95 |
| Variant preview | < 200ms p95 |
