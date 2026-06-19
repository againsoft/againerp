# Product Configurator — API

## Purpose
Product Configurator module API — `/api/v1/product-configurator/` endpoints.

## When To Read
Read this file only if working on Product Configurator API routes or service contracts.

## Related Files
- [Architecture](Architecture.md)
- [Database](Database.md)

## Read Next
- [Architecture](Architecture.md)
- [Permissions](Permissions.md)

---

> **Status:** Spec only — backend **not implemented**  
> **Design phase:** Use mock data in `apps/web/src/lib/mock-data/`  
> **Future base:** `/api/v1/configurator/`  
> **Envelope:** `{ data, meta, errors }`  
> **Auth:** Bearer JWT + `X-Company-Id`

---


## When To Read
Read this file only if working on Product Configurator API routes or service contracts.

## Related Files
- [Architecture](Architecture.md)
- [Database](Database.md)

## Read Next
- [Architecture](Architecture.md)
- [Permissions](Permissions.md)

---

## Profiles

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/profiles` | `configurator.view` |
| GET | `/profiles/{uuid}` | `configurator.view` |
| POST | `/profiles` | `configurator.create` |
| PATCH | `/profiles/{uuid}` | `configurator.edit` |
| DELETE | `/profiles/{uuid}` | `configurator.delete` |

Query: `profile_type`, `page`, `per_page`

---

## Categories

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/categories?profile_uuid=` | `configurator.view` |
| GET | `/categories/{uuid}` | `configurator.view` |
| POST | `/categories` | `configurator.create` |
| PATCH | `/categories/{uuid}` | `configurator.edit` |
| DELETE | `/categories/{uuid}` | `configurator.delete` |

---

## Rules

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/rules?profile_uuid=` | `configurator.view` |
| GET | `/rules/{uuid}` | `configurator.view` |
| POST | `/rules` | `configurator.create` |
| PATCH | `/rules/{uuid}` | `configurator.edit` |
| DELETE | `/rules/{uuid}` | `configurator.delete` |
| POST | `/rules/evaluate?profile_uuid=` | `configurator.view` |

---

## Templates

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/templates?profile_uuid=` | `configurator.view` |
| GET | `/templates/{uuid}` | `configurator.view` |
| POST | `/templates` | `configurator.create` |
| PATCH | `/templates/{uuid}` | `configurator.edit` |
| DELETE | `/templates/{uuid}` | `configurator.delete` |

---

## Builds (Saved Configurations)

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/builds` | `configurator.view` |
| GET | `/builds/{uuid}` | `configurator.view` |
| POST | `/builds` | `configurator.create` |
| PATCH | `/builds/{uuid}` | `configurator.edit` |
| DELETE | `/builds/{uuid}` | `configurator.delete` |
| POST | `/builds/{uuid}/validate` | `configurator.view` |

---

## ERP Integration

| Method | Endpoint | Permission |
|--------|----------|------------|
| POST | `/erp/builds/{uuid}/lead` | `configurator.erp.integrate` |
| POST | `/erp/builds/{uuid}/quotation` | `configurator.erp.integrate` |
| POST | `/erp/builds/{uuid}/sales-order` | `configurator.erp.integrate` |
| POST | `/erp/builds/{uuid}/invoice` | `configurator.erp.integrate` |
| POST | `/erp/builds/{uuid}/workflow` | `configurator.erp.integrate` |
| GET | `/erp/analytics` | `configurator.view` |

See [ERP_INTEGRATION.md](./ERP_INTEGRATION.md) for workflow, schemas, and architecture.

---

## Guided Wizard Builder

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/wizard/flow` | `configurator.view` |
| POST | `/wizard/recommend` | `configurator.ai.use` |
| POST | `/wizard/sessions` | `configurator.create` |
| GET | `/wizard/sessions` | `configurator.view` |
| GET | `/wizard/sessions/{uuid}` | `configurator.view` |
| PATCH | `/wizard/sessions/{uuid}` | `configurator.edit` |
| POST | `/wizard/sessions/{uuid}/recommend` | `configurator.ai.use` |
| POST | `/wizard/sessions/{uuid}/lead` | `configurator.erp.integrate` |

See [AI_WIZARD_BUILDER.md](./AI_WIZARD_BUILDER.md).

---

## Recommendation Engine

| Method | Endpoint | Permission |
|--------|----------|------------|
| POST | `/recommendations` | `configurator.recommend` |

Body: `{ profile_uuid, components[], budget?, use_case? }`

---

## AI Assistant

| Method | Endpoint | Permission |
|--------|----------|------------|
| POST | `/ai/assist` | `configurator.ai.use` |

Body: `{ profile_uuid, prompt, components[], context? }`
