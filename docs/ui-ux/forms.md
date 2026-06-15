# Forms

> **Status:** Draft  
> **Master:** [UI_UX_DESIGN_STANDARDS.md](./UI_UX_DESIGN_STANDARDS.md)  
> **Record views:** [record-view.md](./record-view.md) · [activity-system.md](./activity-system.md)  
> **Standards:** [design-system.md](./design-system.md) · [components.md](./components.md) · [mobile-first.md](./mobile-first.md)

## Purpose

Define form layout, validation display, field types, and multi-step patterns for AgainERP create/edit screens. Optimized for mobile data entry with desktop efficiency.

**Every major form** includes: Timeline · Notes · Activities · Documents · Audit History — via the Chatter panel (Odoo pattern). See [record-view.md](./record-view.md).

**Autosave:** All major forms auto-save drafts — [autosave.md](./autosave.md). **Rich text:** TipTap only — [rich-text-editor.md](./rich-text-editor.md). **Relations:** Popup-first — [popup-first-ux.md](./popup-first-ux.md).

---

## Form Layout

### Single-Record Form (Default)

```
┌─────────────────────────────────────────┐
│ Page Header: Title · [Discard] [Save]   │
├─────────────────────────────────────────┤
│ Section: General                        │
│   Label          [ Input            ]   │
│   Label          [ Input            ]   │
├─────────────────────────────────────────┤
│ Section: Details (collapsible)          │
│   ...                                   │
└─────────────────────────────────────────┘
```

| Viewport | Columns | Max Width |
|----------|---------|-----------|
| Mobile | 1 column, full width | 100% |
| Tablet | 1–2 columns | 100% |
| Desktop | 2 columns for short fields | 720px (simple), 960px (complex) |

**Field grouping:** Related fields in sections with `--text-lg` headings. Optional sections collapsed by default if advanced.

---

## Label & Helper Text

| Element | Rule |
|---------|------|
| Label | Above input; sentence case; required asterisk |
| Helper | `--text-sm` `--color-text-muted` below label |
| Hint | Tooltip icon for complex fields |
| Optional | Mark explicitly on non-required fields in dense forms |

**Association:** Every input has `<label for>` or `aria-labelledby`.

---

## Validation Display

| Timing | Behavior |
|--------|----------|
| On blur | Validate individual field |
| On submit | Validate all; scroll to first error |
| On change | Re-validate after first error cleared |
| Server errors | Map API field errors to inputs; generic banner for non-field errors |

**Error styling:** `--color-danger` border + `--text-sm` message below field. Summary banner at top for 3+ errors with anchor links.

**Success:** No green borders on valid fields — avoid noise. Submit success → toast + redirect or inline confirmation.

**Accessibility:** Error messages in `aria-live="polite"` region; `aria-invalid="true"` on failed inputs.

---

## Field Types

| Field | Component | Notes |
|-------|-----------|-------|
| Short text | Input | Max length shown when limited |
| Long text | Textarea | Auto-grow |
| Rich text | WYSIWYG toolbar | Mobile: simplified toolbar |
| Number | Number input | Min/max/step; locale formatting on display |
| Currency | Number + currency symbol | Respects company currency |
| Percent | Number 0–100 | Suffix `%` |
| Date | Date picker | ISO storage, locale display |
| Date range | Dual picker | See [filters.md](./filters.md) |
| Select | Searchable select | Remote search for large sets |
| Multi-select | Tag input | Selected items as removable chips |
| Boolean | Toggle or checkbox | Toggle for settings; checkbox in lists |
| Radio group | Radio buttons | ≤ 5 options; else select |
| File | Upload zone | Preview for images |
| Relation | Lookup modal | Search records, create inline optional |
| Address | Compound fields | Country triggers state/province options |

**Read-only mode:** Display as text with copy button for IDs and codes.

---

## Form Actions

| Position | Actions |
|----------|---------|
| Header (sticky mobile) | Save · Discard |
| Footer | Duplicate · Archive · Delete (secondary) |
| Inline | Add line (order lines, invoice lines) |

**Mobile:** Sticky bottom bar with Save (primary) + Discard. Safe-area padding for notched devices.

**Dirty state:** Warn on navigate away if unsaved changes. `Discard` resets to last saved.

---

## Multi-Step Forms (Wizard)

Use for onboarding, imports, or flows with 5+ logical sections.

```
 Step 1 ─── Step 2 ─── Step 3 ─── Review
 [  ●  ]     [  ○  ]     [  ○  ]     [  ○  ]
```

| Rule | Detail |
|------|--------|
| Progress | Step indicator with labels; completed steps clickable |
| Validation | Per-step gate — cannot advance with errors |
| Data | Persist draft between steps (local + server) |
| Review step | Summary of all entries before submit |
| Mobile | One step per screen; swipe optional, not required |

**Examples:** Company setup, product import, employee onboarding.

---

## Inline & Quick Edit

| Pattern | Usage |
|---------|-------|
| Inline row edit | Simple fields in table rows |
| Popover edit | Single field from list view |
| Side panel | Edit without leaving list context |

Inline edits save per field or row with explicit Save — no silent auto-save on ERP transactional data unless documented.

---

## Dynamic Fields

| Feature | Rule |
|---------|------|
| Conditional visibility | Show/hide based on other field values |
| Computed read-only | Totals, tax, balance — updated live |
| Repeatable groups | Add/remove rows with min/max limits |
| Dependent selects | Parent selection filters child options |

Document conditional logic in screen **Validation Rules** and **Fields** sections.

---

## Module Compliance

Form screens in `Menus/*.md` must list all fields, sections, validation rules, and mobile layout in **Fields**, **Validation Rules**, and **Page Layout** sections.

## Related Documents

| Document | Topic |
|----------|-------|
| [components.md](./components.md) | Input components |
| [design-system.md](./design-system.md) | Spacing, typography |
| [tables.md](./tables.md) | Inline edit in lists |
| [filters.md](./filters.md) | Filter form patterns |
