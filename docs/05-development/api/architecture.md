# API First Architecture

> Parent: [DEVELOPMENT_STANDARDS.md §7](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md#7-api-first-architecture)

## Purpose
Documentation: architecture.

## When To Read
Read only if your task involves architecture.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---


## When To Read
Read only if your task involves architecture.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## Flow

```
┌──────────┐    ┌─────────┐    ┌────────────────┐    ┌────────────┐    ┌──────────┐
│ Frontend │───►│   API   │───►│ Service Layer  │───►│ Repository │───►│ Database │
│ (Web/App)│    │ Gateway │    │ (Business Logic)│    │ (Data)     │    │          │
└──────────┘    └─────────┘    └────────────────┘    └────────────┘    └──────────┘
```

## Rules

1. Frontend **never** queries the database directly
2. All business logic lives in the **service layer**
3. Controllers/handlers are thin — validate input, call service, return response
4. Repositories handle data access only — no business rules

## URL Convention

```
/api/v1/{module}/{resource}
/api/v1/{module}/{resource}/{id}
/api/v1/{module}/{resource}/{id}/{action}
```

Examples:

```
GET    /api/v1/ecommerce/products
POST   /api/v1/ecommerce/products
GET    /api/v1/ecommerce/products/{uuid}
PATCH  /api/v1/ecommerce/products/{uuid}
DELETE /api/v1/ecommerce/products/{uuid}
```

## Response Standards

- JSON only (unless file download)
- Consistent envelope: `{ data, meta, errors }`
- Pagination meta: `{ page, per_page, total, total_pages }`
- Use `uuid` in public APIs — never expose internal `id`
- HTTP status codes: 200, 201, 204, 400, 401, 403, 404, 422, 500

## Authentication

- Bearer token or session cookie
- Company context in header or token claims: `X-Company-Id`
- Permission check on every endpoint

## Future Consumers

Same APIs power: web admin, storefront, mobile app, AI agents, third-party integrations.
