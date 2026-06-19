# Sales & Marketing Workspace — Opportunity Pipeline UI Design

> **Status:** Draft (Ready for implementation)  
> **Version:** 1.0  
> **Document Type:** UI Design · Step UI-04  
> **Primary route:** `/sales-marketing/opportunities`  
> **360 route:** `/sales-marketing/opportunities/[id]`  
> **Screen ID:** `SCR-SMW-OPP-001` (pipeline) · `SCR-SMW-OPP-360` (deal)  
> **Parent:** [01_MASTER_LAYOUT_UI.md](./01_MASTER_LAYOUT_UI.md)

---

## 1. Objective

**Flagship pipeline board** — drag-and-drop stages, weighted forecast, deal cards. Primary revenue screen.

Design: Odoo pipeline + Linear card density + Shopify list fallbacks.

---

## 2. Default view

URL default: `?layout=kanban` (pipeline). Alternatives: `?layout=table` · `?layout=forecast`.

---

## 3. Pipeline kanban layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Toolbar: search · owner · territory · period · forecast toggle · New deal   │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ … ┌─────────┐ ┌─────────┐ │
│ │ New     │ │ Qualify │ │ Proposal│ │ Negoti- │   │ Won     │ │ Lost    │ │
│ │ 5 · ৳X  │ │         │ │         │ │ ation   │   │         │ │         │ │
│ │ [cards] │ │ [cards] │ │ [cards] │ │ [cards] │   │ [cards] │ │ [cards] │ │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘   └─────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ Forecast strip: weighted total · commit · best case · AI-adjusted             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Stages (8)

| Stage ID | Label | Default probability |
|----------|-------|---------------------|
| `new` | New | 5% |
| `qualification` | Qualification | 20% |
| `needs_analysis` | Needs Analysis | 35% |
| `proposal` | Proposal | 50% |
| `negotiation` | Negotiation | 70% |
| `final_review` | Final Review | 85% |
| `won` | Won | 100% |
| `lost` | Lost | 0% |

Column header: **count · sum(amount) · weighted sum**.

---

## 4. Deal card anatomy

```text
┌─────────────────────────────┐
│ OPP-2026-0088        [risk] │
│ GreenMart — SS26 Collection │
│ ৳560,000 · 70%              │
│ 👤 Nusrat · 📅 Jun 25       │
│ [tags: seasonal]            │
└─────────────────────────────┘
```

- Drag handle (left) · click body → deal 360 or `?view=`  
- `RiskBadge` when AI flags at-risk  
- Won/Lost columns: no drag out without confirmation  

---

## 5. Drag-and-drop

Library: `@dnd-kit/core` + `@dnd-kit/sortable`

| Event | Behavior |
|-------|----------|
| Drag start | Lift card · ghost column highlight |
| Drop on stage | PATCH stage · optimistic move · toast |
| Drop on Won | Optional “Mark won” dialog (close date, amount confirm) |
| Cancel | Snap back |

Keyboard: column menu “Move to…” for a11y.

---

## 6. Table fallback

AG Grid / TanStack columns: Deal #, Title, Account, Stage, Amount, Probability, Owner, Close date, Actions.

---

## 7. Forecast view (`?layout=forecast`)

Timeline buckets by expected close month · bar = weighted pipeline · AI line overlay.

---

## 8. Deal 360 (`/opportunities/[id]`)

Mirror lead 360 with deal-specific tabs:

| Tab | Content |
|-----|---------|
| overview | Amount, stage, probability, contacts |
| products | Line items / quotation link |
| quotations | Linked QUO records |
| activity | Timeline |
| documents | Files |
| shop floor | N/A — placeholder hidden |

Header: **Move stage** · **Create quotation** · **Mark won/lost** · Activity.

---

## 9. Drawer CRUD (list adjunct)

| Create | `?create=1` on opportunities route |
| View | `?view={id}` peek sheet |
| Edit | `?edit={id}` |

Full deal work happens on 360 page.

---

## 10. Implementation checklist (Impl Step 04)

- [ ] Shared `components/shared/kanban/` (reuse HR recruitment pattern if exists)
- [ ] `OpportunityPipeline`, `OpportunityKanban`, `OpportunityCard`
- [ ] `OpportunityProfileWorkspace`
- [ ] Stage move API + optimistic store
- [ ] Forecast strip component

---

**Last updated:** 2026-06-18
