# Partner Onboarding — UI Spec (Planned)

> **Status:** Draft (Planning)  
> **Route:** `/partners/onboarding`  
> **Workflow:** [Workflow.md](../../modules/business-partners/Workflow.md) §1

---

## Purpose

Queue of partner applications — vendor registration, wholesale account requests, retailer onboarding.

---

## Layout

```text
┌─────────────────────────────────────────────────────────────┐
│ Onboarding · [+ New application] (admin manual entry)         │
├─────────────────────────────────────────────────────────────┤
│ Status tabs: All | Submitted | In review | Approved | Rejected│
├─────────────────────────────────────────────────────────────┤
│ AG Grid / card list                                         │
└─────────────────────────────────────────────────────────────┘
         │
         └──► View drawer (?view=onb_001) — approve / reject
```

---

## Grid columns

| Column | Content |
|--------|---------|
| Application # | ONB-2026-0042 |
| Company | Applicant org name |
| Contact | Name + email |
| Requested roles | vendor · wholesaler chips |
| Submitted | datetime |
| Status | badge |
| Reviewer | assigned user |
| ⋮ | View · Assign · Approve · Reject |

---

## View drawer tabs

| Tab | Content |
|-----|---------|
| Summary | Company info, requested roles, credit requested |
| Documents | Trade license, TIN — attachment list |
| Review | Internal notes, checklist |
| History | Status timeline |

**Footer actions (review state):**

- **Approve** → creates Core contact + `bp_partners` → redirect directory `?view=`
- **Reject** → reason required → notification stub
- **Request info** → back to applicant (future portal)

---

## Mobile

- Status tabs scroll horizontally
- Approve/Reject sticky bottom bar in drawer
- Documents as downloadable cards

---

## Dummy data (plan)

8 applications: 3 submitted, 2 review, 2 approved, 1 rejected

---

**Last Updated:** 2026-06-17
