# Business Partners — Workflows

> **Status:** Draft (Planning)  
> **Parent:** [Architecture.md](./Architecture.md)

---

## 1. Partner onboarding

```text
[Application submitted]
        ↓
   submitted ──→ review (assign reviewer)
        ↓              ↓
    withdrawn      approved ──→ create Core contact (if new)
        ↓              ↓
    rejected      create bp_partners + roles + default terms
                       ↓
                  active partner
                       ↓
              event: bp.onboarding.approved
```

| State | Who acts | UI |
|-------|----------|-----|
| `submitted` | System / portal | Onboarding queue |
| `review` | Partner manager | Review drawer |
| `approved` | Approver | Creates partner record |
| `rejected` | Approver | Email + reason |
| `withdrawn` | Applicant | Terminal |

**Approval engine:** Core Workflow — threshold by requested credit limit.

---

## 2. Partner block / unblock

```text
active ──[block]──→ blocked
blocked ──[unblock + approval]──→ active
```

| Effect on block | Module behavior |
|-----------------|-----------------|
| Purchase | Cannot create new PO; existing POs continue |
| Sales | Cannot create new SO if credit role |
| Catalog | `is_published_web` forced false |
| Event | `bp.partner.blocked` |

---

## 3. Credit hold

```text
active ──[exposure > limit OR manual hold]──→ on_hold
on_hold ──[payment / approval]──→ active
```

Sales `check_credit` returns `hold` when `credit_hold=true` or exposure exceeds limit.

---

## 4. Role enablement

```text
partner exists → enable role → create default terms stub → event bp.partner.role.enabled
```

Consumer modules refresh pickers (event subscriber, optional).

---

## 5. Catalog mapping

```text
unmapped feed SKU ──[map to product]──→ bp_partner_catalog.is_mapped=true
                ──[publish web]──→ is_published_web=true (optional)
                ──[set preferred]──→ unset other preferred for same product
```

Duplicate guard: same partner + product + variant.

---

## 6. Performance snapshot (scheduled)

```text
Daily job → aggregate PO/SO from Purchase/Sales APIs → write bp_partner_performance
```

Read-only cross-module — **service calls only**, no JOIN.

---

**Last Updated:** 2026-06-17
