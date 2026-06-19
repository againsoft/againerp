# Sales & Marketing Workspace — Quotation Builder UI Design

> **Status:** Draft (Ready for implementation)  
> **Version:** 1.0  
> **Document Type:** UI Design · Step UI-05  
> **Primary route:** `/sales-marketing/quotations`  
> **Builder route:** `/sales-marketing/quotations/create` · `?edit={id}`  
> **Screen ID:** `SCR-SMW-QUO-001` (list) · `SCR-SMW-QUO-BLD` (builder)  
> **Parent:** [01_MASTER_LAYOUT_UI.md](./01_MASTER_LAYOUT_UI.md) · [04_OPPORTUNITY_PIPELINE_UI_DESIGN.md](./04_OPPORTUNITY_PIPELINE_UI_DESIGN.md)

---

## 1. Objective

**Quote-to-cash entry** — list quotations, document builder (70/30), approval handoff, revision tracking.

Integrates: Catalog (products), Inventory (availability), Approvals inbox, Accounting (tax).

---

## 2. Quotation list

Standard list + drawer pattern on `/sales-marketing/quotations`:

| Column | Notes |
|--------|-------|
| Number | QUO-2026-0034 |
| Account | Customer name |
| Opportunity | Link if linked |
| Status | draft · sent · accepted · rejected · expired |
| Total | BDT grand total |
| Valid until | Date |
| Owner | Rep |
| Actions | View · Edit · Send · PDF |

Toolbar: **Create quotation** → navigates to builder route (exception: full-page builder allowed).

Filters: status · owner · date range · account search.

---

## 3. Document builder layout (70 / 30)

```text
┌────────────────────────────────────────────┬──────────────────┐
│ DOCUMENT CANVAS (70%)                      │ CONTEXT (30%)    │
│ Header: quote # · status · validity        │ Customer         │
│ Line items table (editable)                │ Opportunity link │
│ Subtotal · discount · tax · total          │ Product search   │
│ Terms & notes                              │ AI suggest lines │
│ Preview toggle (document | email)          │ Approval status  │
├────────────────────────────────────────────┴──────────────────┤
│ Sticky footer: Save draft · Submit for approval · Send PDF   │
└───────────────────────────────────────────────────────────────┘
```

Route: `/sales-marketing/quotations/create` or `/quotations/create?opportunity={id}` pre-fill.

---

## 4. Line items grid

| Column | Input |
|--------|-------|
| SKU / Product | Autocomplete from catalog |
| Description | Text |
| Qty | Number |
| UOM | Select |
| Unit price | Currency |
| Discount % | Number |
| Line total | Computed |

Actions: Add row · Remove row · Reorder (optional).

Validation: qty > 0 · discount ≤ policy max (settings).

---

## 5. Status workflow (UI)

```text
draft → sent → accepted | rejected | expired
         ↓
    approval queue (if discount / amount threshold)
```

Submit for approval → `/inbox/approvals` handoff (badge on header).

---

## 6. Quotation details (read)

Option A: `?view={id}` drawer on list  
Option B: `/quotations/[id]` read-only page with PDF preview

Prototype: drawer + “Open builder” for edit.

---

## 7. Revision center (phase 2 UI)

Version list: v1 · v2 · v3 with diff summary — document in UI-05 extension later.

---

## 8. Mobile

Builder stacks vertically: lines cards instead of table · sticky save footer · product picker full-screen sheet.

---

## 9. Permissions

| Action | Permission |
|--------|------------|
| Create / edit draft | `smw.quotations.create` |
| Send to customer | `smw.quotations.create` |
| Approve discount | `smw.quotations.approve` |

---

## 10. Implementation checklist (Impl Step 05)

- [ ] `quotations/page.tsx` list + drawers
- [ ] `quotations/create/page.tsx` builder
- [ ] `DocumentBuilderLayout` shared shell
- [ ] React Hook Form + Zod for line items
- [ ] Mock quotations fixture + API
- [ ] Link from opportunity 360 “Create quotation”

---

**Last updated:** 2026-06-18
