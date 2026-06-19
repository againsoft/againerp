# AI Audit & Approval Rules

## Purpose
AI OS platform architecture and engines.

## When To Read
Read only when working on AI OS platform, agents, tools, or audit.

## Related Files
- [AI OS architecture](AI_OS_ARCHITECTURE.md)
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [AI experience specs](../../experience/README.md)

---

> **Status:** Draft  
> **Parent:** [AI_FIRST_ARCHITECTURE.md](./AI_FIRST_ARCHITECTURE.md)  
> **Approval engine:** [APPROVAL_ENGINE_ARCHITECTURE.md](../../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md)

---


## When To Read
Read only when working on AI OS platform, agents, tools, or audit.

## Related Files
- [AI OS architecture](AI_OS_ARCHITECTURE.md)
- [Cursor entry](../../../BRAIN.md)

## Read Next
- [AI experience specs](../../experience/README.md)

---

## AI Audit Rule

Every AI operation writes to `ai_audit_logs` **before** response returns to user.

### Log Entry

| Field | Required |
|-------|----------|
| `id` | UUID |
| `user_id` | ✓ |
| `company_id` | ✓ |
| `action_type` | ✓ |
| `prompt` | ✓ (PII redacted) |
| `response` | ✓ |
| `changes` | If write proposed — JSON diff |
| `approval_status` | ✓ |
| `approved_by` | If approved |
| `target_entity_type` | ✓ |
| `target_entity_id` | If applicable |
| `model` | Provider + version |
| `tokens_in` / `tokens_out` | ✓ |
| `latency_ms` | ✓ |
| `created_at` | ✓ |

### Immutability

- No UPDATE or DELETE on audit rows
- Corrections via new compensating entry only

---

## Risk Classification

| Risk | Actions | Approval |
|------|---------|----------|
| **Low** | Summarize, analyze (read-only), draft generate | Auto-apply to draft fields |
| **Medium** | Forecast, recommend, automate (notify only) | User "Apply" click |
| **High** | Price change, stock adjust, accounting entry, delete, bulk, permissions | Core Approval Engine |

---

## High-Risk Actions (Approval Required)

| Category | Examples |
|----------|----------|
| **Delete** | Any record deletion |
| **Pricing** | `catalog_variants.price` change |
| **Inventory** | Stock adjustment, transfer approval |
| **Accounting** | Journal entry, payment post |
| **Permissions** | Role assignment, ACL change |
| **Bulk** | > 10 records in one AI action |
| **Publish** | Product/page go-live |
| **Send** | Email/SMS campaign dispatch |

---

## Approval UX

```
┌─────────────────────────────────────────┐
│ AI proposed price change                │
│ Product: Blue T-Shirt                   │
│ ৳599 → ৳649 (+8.3%)                     │
│ Reason: "Match competitor pricing"      │
│                                         │
│ [Reject]              [Approve & Apply] │
└─────────────────────────────────────────┘
```

Shown in: Notification center · Approval inbox · Record chatter

---

## Rejection

- `approval_status: rejected`
- Reason required from approver
- Original record unchanged
- User notified with rejection reason

---

## Automation + Approval

`ai_automation_rules` with high-risk actions default to `approval_required: true`. Cannot disable for accounting/permissions actions.

---

## Compliance Reports

Admin → System → AI Audit Logs

Filter by user, action type, date, approval status. Export CSV for compliance.
