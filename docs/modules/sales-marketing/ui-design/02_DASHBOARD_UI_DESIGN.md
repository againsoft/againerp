# Sales & Marketing Workspace — Dashboard UI Design

> **Status:** Draft (Ready for implementation)  
> **Version:** 1.0  
> **Document Type:** UI Design · Step UI-02  
> **Primary route:** `/sales-marketing/dashboard` (alias `/sales-marketing` redirect)  
> **Screen IDs:** `SCR-SMW-DSH-001` (Manager) · `SCR-SMW-DSH-002` (Rep) · `SCR-SMW-DSH-003` (Executive)  
> **Parent:** [01_MASTER_LAYOUT_UI.md](./01_MASTER_LAYOUT_UI.md)

---

## 1. Objective

Revenue Operations **command center** — KPIs, funnel, trends, AI insights, approvals handoff, quick actions.

Reference: `components/hr/dashboard/hr-dashboard.tsx` · `components/enterprise/cards/kpi-card.tsx`

---

## 2. Page layout (12-column)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ZONE A — Header: period filter · territory · “As of …”                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE B — KPI strip (8 cards, horizontal scroll on mobile)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE C — Charts row (8 cols funnel + 4 cols pipeline summary)                │
├──────────────────────────────┬──────────────────────────────────────────────┤
│ ZONE D — Revenue trend (7)     │ ZONE E — AI insights rail (5)                │
├──────────────────────────────┴──────────────────────────────────────────────┤
│ ZONE F — Leaderboard + recent activity (6 + 6)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZONE G — Quick actions chips                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. KPI cards (Zone B)

| KPI | Value example | Drill-down |
|-----|---------------|------------|
| Open leads | 38 | `/sales-marketing/leads?status=open` |
| Qualified leads | 12 | `/sales-marketing/leads?status=qualified` |
| Pipeline (weighted) | ৳4.82M | `/sales-marketing/opportunities` |
| Revenue MTD | ৳2.14M | `/sales-marketing/reports?report=revenue` |
| Win rate (Q2) | 31% | Reports performance |
| Campaign ROI | 412% | `/sales-marketing/campaigns` |
| Target achievement | 72% | `/sales-marketing/targets` |
| Commission pending | ৳42K | `/sales-marketing/commission` |

Component: `KpiCard` from enterprise · trend arrow · optional sparkline.

---

## 4. Charts (Zone C–D)

| Chart | Type | Library |
|-------|------|---------|
| Lead funnel | Horizontal bar / funnel | Recharts |
| Pipeline by stage | Stacked bar | Recharts |
| Revenue trend | Area line (6 months) | Recharts |
| Forecast vs actual | Dual line (optional) | Recharts |

Loading: skeleton blocks per widget · independent error states.

---

## 5. AI insights panel (Zone E)

3–5 cards using `AiInsightCard`:

- “3 deals at risk of slipping this month”  
- “Hot leads without follow-up”  
- “LinkedIn ABM outperforming email”  

Each card: title · summary · confidence badge · CTA link.

---

## 6. Leaderboard & activity (Zone F)

| Left (6 cols) | Right (6 cols) |
|---------------|----------------|
| Rep ranking table: Rep · Quota · Achieved · % | `TimelineCard` recent SMW events |

---

## 7. Quick actions (Zone G)

Chip buttons: New lead · New opportunity · Create quotation · Log activity · Open AI copilot.

RBAC: hide chips when permission missing.

---

## 8. Role variants

| Role | Default template |
|------|------------------|
| Sales Manager | Full dashboard |
| Sales Rep | KPIs scoped to owner · shorter leaderboard |
| Executive | Higher-level KPIs · no rep PII in leaderboard |

Prototype: single template + mock “view as” filter.

---

## 9. URL & state

| Param | Purpose |
|-------|---------|
| `?period=month\|quarter` | KPI period |
| `?territory={id}` | Scope filter |

---

## 10. Implementation checklist (Impl Step 02)

- [ ] `dashboard/page.tsx` + `loading.tsx`
- [ ] `components/sales-marketing/dashboard/smw-dashboard.tsx`
- [ ] `lib/mock-data/smw-dashboard.ts`
- [ ] KPI strip, funnel chart, trend chart, AI panel, activity list

---

**Last updated:** 2026-06-18
