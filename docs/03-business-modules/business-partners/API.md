# Business Partners — API Design

## Purpose
Business Partners module API — `/api/v1/business-partners/` endpoints.

## When To Read
Read this file only if working on Business Partners API routes or service contracts.

## Related Files
- [Architecture](Architecture.md)
- [Database](Database.md)

## Read Next
- [Architecture](Architecture.md)
- [Workflow](Workflow.md)

---

> **Status:** Draft (Planning)  
> **Base path:** `/api/v1/business-partners/`  
> **Parent:** [Architecture.md](./Architecture.md) · [Database.md](./Database.md)

**No implementation.** Contract plan for backend + prototype service layer.

---


## When To Read
Read this file only if working on Business Partners API routes or service contracts.

## Related Files
- [Architecture](Architecture.md)
- [Database](Database.md)

## Read Next
- [Architecture](Architecture.md)
- [Workflow](Workflow.md)

---

## Conventions

| Rule | Value |
|------|-------|
| Auth | Bearer / session |
| Pagination | `?page=&limit=` cursor for directory |
| Filter | `?role=vendor&status=active&q=tech` |
| Include | `?include=roles,terms,contact` |
| Errors | RFC 7807 problem+json |

---

## Partners

| Method | Path | Description |
|--------|------|-------------|
| GET | `/partners` | List partners (filter by role, status, territory) |
| POST | `/partners` | Create partner (+ optional Core contact create) |
| GET | `/partners/{id}` | Get partner with roles, terms |
| PATCH | `/partners/{id}` | Update partner profile |
| DELETE | `/partners/{id}` | Soft delete / archive |
| POST | `/partners/{id}/block` | Block partner |
| POST | `/partners/{id}/unblock` | Unblock |
| GET | `/partners/by-contact/{contactId}` | Resolve partner from Core contact |

### POST `/partners` body (example)

```json
{
  "contact_id": "uuid-or-null",
  "contact": {
    "type": "organization",
    "name": "TechPro Distribution Ltd",
    "email": "procurement@techpro.bd",
    "phone": "+880..."
  },
  "partner_code": "BP-0042",
  "roles": ["vendor", "wholesaler"],
  "terms": [
    {
      "role": "vendor",
      "payment_terms_days": 30,
      "currency_code": "BDT",
      "default_lead_time_days": 14
    }
  ]
}
```

---

## Roles

| Method | Path | Description |
|--------|------|-------------|
| GET | `/partners/{id}/roles` | List roles |
| POST | `/partners/{id}/roles` | Enable role `{ "role": "retailer" }` |
| DELETE | `/partners/{id}/roles/{role}` | Disable role |

---

## Terms

| Method | Path | Description |
|--------|------|-------------|
| GET | `/partners/{id}/terms` | All terms |
| PUT | `/partners/{id}/terms/{role}` | Upsert terms for role |

---

## Tiers

| Method | Path | Description |
|--------|------|-------------|
| GET | `/tiers` | Tier definitions |
| POST | `/tiers` | Create tier |
| GET | `/partners/{id}/tiers` | Partner tier assignments |
| PUT | `/partners/{id}/tiers` | Assign tiers |

---

## Territories

| Method | Path | Description |
|--------|------|-------------|
| GET | `/partners/{id}/territories` | List |
| POST | `/partners/{id}/territories` | Add |
| DELETE | `/partners/{id}/territories/{tid}` | Remove |

---

## Catalog (vendor role)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/partners/{id}/catalog` | Mapped + unmapped items |
| POST | `/partners/{id}/catalog` | Add mapping |
| PATCH | `/partners/{id}/catalog/{itemId}` | Update cost, stock, preferred |
| DELETE | `/partners/{id}/catalog/{itemId}` | Remove mapping |
| POST | `/partners/{id}/catalog/sync` | Trigger stock feed sync (async) |

---

## Onboarding

| Method | Path | Description |
|--------|------|-------------|
| GET | `/onboarding` | Application queue |
| POST | `/onboarding` | Submit application (portal or admin) |
| GET | `/onboarding/{id}` | Application detail |
| POST | `/onboarding/{id}/approve` | Approve → create partner |
| POST | `/onboarding/{id}/reject` | Reject with reason |

---

## Performance

| Method | Path | Description |
|--------|------|-------------|
| GET | `/partners/{id}/performance` | KPI history |
| GET | `/performance/summary` | Cross-partner dashboard data |

---

## Service layer (internal)

For other modules — not HTTP:

```python
# BusinessPartnerService (public contract)
get_partner(partner_id: UUID) -> PartnerDTO
get_by_contact(contact_id: UUID) -> PartnerDTO | None
list_by_role(role: PartnerRole, filters: PartnerFilters) -> Page[PartnerDTO]
get_commercial_terms(partner_id: UUID, role: PartnerRole) -> TermsDTO
get_price_tier(partner_id: UUID, role: PartnerRole) -> TierDTO | None
check_credit(partner_id: UUID, amount: Decimal) -> CreditCheckResult
get_catalog_items(partner_id: UUID) -> list[CatalogItemDTO]
```

**Module not installed:** service returns `ModuleNotEnabled` — consumers fall back to Core contact fields.

---

**Last Updated:** 2026-06-17
