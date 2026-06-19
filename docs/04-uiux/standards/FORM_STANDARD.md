# AgainERP — Form Standard

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 10 — Enterprise Design System & UI Foundation  
> **Authority:** [DESIGN_SYSTEM_FOUNDATION.md](./DESIGN_SYSTEM_FOUNDATION.md)

---

## Purpose

Standards for **entity forms** — layout, validation, sections, autosave, and create/edit in drawer or full page.

## When To Read

Read when documenting form fields in `Menus/` screen specs.

## Related Files

- [COMPONENT_LIBRARY_STANDARD.md](./COMPONENT_LIBRARY_STANDARD.md)
- [DRAWER_MODAL_STANDARD.md](./DRAWER_MODAL_STANDARD.md)
- [autosave.md](./autosave.md)
- [popup-first-ux.md](./popup-first-ux.md)

## Read Next

§2 **Form contexts** — drawer vs full page.

---

## 1. Form Contexts

| Context | When | Layout |
|---------|------|--------|
| **Drawer form** | Standard CRUD `?create=` · `?edit=` | Right sheet — DRAWER_MODAL_STANDARD |
| **Full page form** | Complex multi-tab entities | PAGE_LAYOUT details |
| **Modal form** | Quick-create relations (brand, tag) | Centered modal · popup-first-ux |
| **Settings form** | Module configuration | Settings layout |

---

## 2. Form Anatomy

```text
Form header (optional in drawer — title in sheet header)
Alert summary (validation errors on submit)
Section 1 — [Notion-style heading]
  Field grid (1 col mobile · 2 col desktop)
Section 2
  …
Form footer — [Cancel] [Save]  (sticky on mobile drawer)
```

---

## 3. Field Layout

| Rule | Value |
|------|-------|
| Label position | Above field |
| Required indicator | Asterisk + aria-required |
| Help text | Below label, muted |
| Error | Below field, `--color-danger` |
| Grid | 1 column `< md` · 2 column `≥ md` |
| Max field width | 480px per field in wide forms |

---

## 4. Sections (Notion-inspired)

| Pattern | Usage |
|---------|-------|
| Collapsible section | Optional advanced blocks |
| Section divider | `--color-border` |
| Inline edit | Read-only view → click to edit field |

---

## 5. Validation

| Timing | Rule |
|--------|------|
| On blur | Field-level |
| On submit | Full form + summary |
| Async | Unique checks (SKU, email) with loading state |
| Server errors | Map to fields or form summary |

---

## 6. Autosave & Draft

| Feature | Rule |
|---------|------|
| Draft mode | Long forms — autosave.md |
| Indicator | "Saved" · "Saving…" · "Unsaved changes" |
| Discard | Confirm if dirty on close |

---

## 7. Form Footer Actions

| Button | Variant |
|--------|---------|
| Save / Create | Primary |
| Cancel | Secondary — closes drawer |
| Delete | Danger — detail view only, confirm |

**Mobile drawer:** Footer sticky at bottom · full-width primary

---

## 8. Relation Fields

| Pattern | Component |
|---------|-----------|
| FK select | `DS-SELECT-RELATION` |
| Quick create | `+ Add` opens modal — popup-first-ux |
| Multi relations | Tags or multi-select |

---

## 9. Accessibility

| Requirement | Detail |
|-------------|--------|
| Tab order | Logical top-to-bottom |
| Focus trap | In modal/drawer when open |
| Escape | Closes with dirty confirm |
| aria-describedby | Errors linked to inputs |

---

## 10. Menus Screen Spec Requirements

Each form screen in `Menus/` must document:

- Field list with types and validation
- Section grouping
- Drawer vs full page
- Primary/secondary actions
- Permission gates per field (if field-level ACL)

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 10 — form standard |

---

**Form Standard** — sections, validation, drawer-first CRUD.
