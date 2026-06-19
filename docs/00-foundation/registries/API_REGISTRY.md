# AgainERP — API Registry

> **Status:** Approved  
> **Version:** 1.0  
> **Project:** AgainERP  
> **Document Type:** Enterprise API Architecture Registry  
> **Phase:** Documentation First  
> **Governance:** [GOVERNANCE.md](../GOVERNANCE.md) · **Standards:** [DEVELOPMENT_STANDARDS.md](../standards/DEVELOPMENT_STANDARDS.md)

## Purpose
Documentation: API REGISTRY.

## When To Read
Read only if your task involves api registry.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

**No endpoint paths. No OpenAPI specs. No implementation code.**  
This document is the **master API architecture registry** — domain groups, resources, operations, permissions, events, and response standards. Concrete routes are defined in module `API.md` files at implementation gate.

### Step 22 Requirements (Satisfied)

| Requirement | Section |
|-------------|---------|
| Master API registry (architecture, not routes) | §1 |
| API philosophy through search | §2–§11 |
| 15 domain API profiles | §12 |
| API Group, Resources, Operations, Permissions, Events, Response Standards | §12 |

**Related:** [SERVICE_REGISTRY.md](./SERVICE_REGISTRY.md) · [PERMISSION_SYSTEM_ARCHITECTURE.md](../../02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md) · [api/architecture.md](../../05-development/api/architecture.md) · [core/API.md](../../02-core-platform/API.md)

---

## Executive Summary

| Principle | Rule |
|-----------|------|
| **API-first** | UI, mobile, AI, integrations share one HTTP surface |
| **Thin controllers** | Validate → Permission → Service → Envelope |
| **Module ownership** | Each domain owns its API group under `/api/v1/{module}/` |
| **UUID externally** | Public IDs are UUID — never internal serial PK |
| **Consistent envelope** | `{ data, meta, links, errors }` on every response |
| **Permission every call** | No anonymous business mutations |

**Registry vs implementation:** This doc defines **what** each domain exposes. Module `API.md` files list **exact routes** when code begins.

---

## 1. Purpose

### Why a Master API Registry Exists

AgainERP serves web admin, storefront, mobile, AI agents, and third-party integrations through **one API platform**. Without a master registry:

| Problem | Impact |
|---------|--------|
| Invented endpoints | AI and clients call non-existent routes |
| Inconsistent envelopes | Frontend handles 5 response shapes |
| Missing permission mapping | Endpoint ships without ACL |
| Undocumented side effects | Mutations without domain events |
| Version drift | Breaking changes without notice |

This registry answers:

- **Which API groups exist per domain?**
- **What resources and operations are in scope?**
- **Which permissions gate each operation?**
- **Which events fire after successful mutations?**
- **What response standards apply?**

### What This Document Is

| Is | Is Not |
|----|--------|
| API architecture registry | Route catalog with HTTP paths |
| Operation and permission index | OpenAPI YAML |
| Cross-domain response standards | Controller code |
| Versioning and auth policy | Postman collection |

### Audience

| Role | Use |
|------|-----|
| Frontend / mobile | Know available operations per screen |
| Backend | Implement services behind consistent operations |
| AI OS | Tool → API group mapping |
| Integrators | Understand domain boundaries before `API.md` |

---

## 2. API Philosophy

### API-First Architecture

```text
Client (Web · Mobile · AI · Partner)
        │
        ▼
   API Gateway / Router
        │
        ▼
   Controller (thin — validate, authorize)
        │
        ▼
   Service Layer (business logic)
        │
        ▼
   Repository → Database (owner module only)
        │
        ▼
   Event Bus (after COMMIT)
```

| Rule | Detail |
|------|--------|
| **No DB from client** | Ever |
| **Service owns logic** | Controllers do not contain business rules |
| **One module per route prefix** | `/api/v1/{module}/` |
| **Cross-module via service** | API handler calls other module's service in-process — not cross-DB |
| **Idempotent mutations** | Where retry-safe — `Idempotency-Key` header supported |
| **Async side effects** | Search index, notifications via events — not sync in response |

### Resource-Oriented Design

| Concept | Convention |
|---------|------------|
| **Resource** | Noun — Product, Sales Order, Lead |
| **Collection** | Plural resource — list operation |
| **Member** | Single resource by UUID |
| **Sub-resource** | Nested ownership — Order Lines under Order |
| **Action** | Non-CRUD verb on member — confirm, publish, approve |

### Modular Monolith HTTP Surface

All domains deploy in one process today. API groups are **logical boundaries** — each maps 1:1 to a future microservice if extracted.

---
## 3. API Standards

### Request Standards

| Aspect | Standard |
|--------|----------|
| **Format** | JSON (`Content-Type: application/json`) |
| **Charset** | UTF-8 |
| **IDs** | UUID v4 in URLs and body |
| **Dates** | ISO 8601 UTC (`2026-06-13T10:00:00Z`) |
| **Money** | Integer minor units + `currency` code, or decimal string with scale documented per resource |
| **Booleans** | `true` / `false` — not 0/1 |
| **Null** | Explicit `null` — omit vs null documented per field in module API.md |
| **Bulk** | Separate bulk operation — not query-string array abuse |

### Response Envelope

```json
{
  "data": {},
  "meta": {},
  "links": {},
  "errors": null
}
```

| Field | Purpose |
|-------|---------|
| `data` | Resource, collection, or null on 204 |
| `meta` | Pagination, facets, request_id, timing |
| `links` | `self`, `next`, `prev`, related resources |
| `errors` | Populated only on partial failure (bulk) or validation batch |

### HTTP Method Semantics

| Method | Use | Idempotent |
|--------|-----|------------|
| **GET** | Read collection or member | Yes |
| **POST** | Create; non-idempotent actions | No |
| **PUT** | Full replace (rare) | Yes |
| **PATCH** | Partial update | No |
| **DELETE** | Soft-delete or archive | Yes |

### Headers (Global)

| Header | Required | Purpose |
|--------|----------|---------|
| `Authorization` | Yes (except public auth) | Bearer JWT |
| `X-Company-Id` | Yes | Active company context |
| `X-Branch-Id` | Optional | Branch-scoped operations |
| `Accept-Language` | Optional | Localized error messages |
| `Idempotency-Key` | Optional | Safe retry on POST |
| `X-Request-Id` | Optional | Correlation — echoed in `meta` |

### Naming Conventions

| Element | Convention |
|---------|------------|
| URL segments | kebab-case — `purchase-orders` |
| JSON fields | snake_case |
| Permission keys | `{module}.{resource}.{action}` |
| Event names | `{module}.{entity}.{action}` |

---

## 4. Versioning Strategy

### URL Versioning

| Version | Path prefix | Status |
|---------|-------------|--------|
| **v1** | `/api/v1/` | Current — all new work |
| **v2** | `/api/v2/` | Future — breaking changes only |

**Rule:** No version in query string. Header `Accept-Version` reserved for content negotiation edge cases only.

### Change Classification

| Type | Version impact | Example |
|------|----------------|---------|
| **Additive** | Same version — new optional field, new operation | Add `meta.facet` to list |
| **Behavioral** | Same version if backward compatible | Default sort change — document in CHANGELOG |
| **Breaking** | New major version | Rename field, remove operation, permission split |
| **Deprecation** | Mark in registry + 2 minor releases | Old operation returns `Deprecation` header |

### Deprecation Policy

```text
1. Announce in CHANGELOG + API registry
2. Response header: Deprecation: true; Sunset: {date}
3. Minimum 6 months before removal
4. Module API.md lists migration path
```

### Internal vs Public

| Surface | Versioning |
|---------|------------|
| **Public REST** | Strict — `/api/v1/` |
| **Webhooks** | `/webhooks/v1/` separate namespace |
| **Internal service** | No HTTP version — interface versioning in SERVICE_REGISTRY |

---

## 5. Authentication Strategy

### Primary: Bearer JWT

| Claim | Purpose |
|-------|---------|
| `sub` | User UUID |
| `company_id` | Default company |
| `branch_id` | Optional default branch |
| `roles` | Role slugs (display only — permissions resolved server-side) |
| `exp` / `iat` | Token lifetime |
| `session_id` | Revocation target |

### Auth Operations (Public API Group)

| Operation | Description |
|-----------|-------------|
| Login | Credentials → access + refresh tokens |
| Logout | Invalidate session |
| Refresh | Rotate access token |
| MFA Verify | Second factor completion |
| Me | Current user + effective permissions snapshot |

### Token Lifetimes

| Token | TTL | Storage |
|-------|-----|---------|
| Access | 15–60 min | Memory / secure storage |
| Refresh | 7–30 days | HttpOnly cookie or secure store |
| API Key | Configurable | Hashed server-side — scoped permissions |

### Alternative Auth (Future)

| Method | Use case |
|--------|----------|
| **API Key** | Integrations, webhooks inbound |
| **OAuth 2.0** | Third-party apps, SSO |
| **Personal Access Token** | Developer / script access |

### Session Rules

- All authenticated requests validate JWT signature and expiry
- Company header must match token claim or user must have cross-company permission
- Failed auth → `401` — never `403` (see §7)

---

## 6. Authorization Strategy

Integrates [PERMISSION_SYSTEM_ARCHITECTURE.md](../../02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md).

### Check Pipeline

```text
Request → Authenticate → Resolve company/branch scope
       → PermissionService.check(key)
       → Field ACL filter (response)
       → Service.execute
```

### Permission Mapping

| Operation type | Typical permission suffix |
|----------------|---------------------------|
| List / Get | `.view` |
| Create | `.create` |
| Update | `.edit` |
| Delete / Archive | `.delete` / `.archive` |
| Domain action | `.confirm`, `.publish`, `.approve`, `.post` |

### Scope Dimensions

| Dimension | Applied on |
|-----------|------------|
| **Company** | All business APIs |
| **Branch** | Sales, Inventory, Finance lists |
| **Warehouse** | Stock operations |
| **Own records** | CRM lead owner filter |
| **Field ACL** | Strip `cost_price`, margin from response |

### Authorization Failures

| Condition | Status |
|-----------|--------|
| Not authenticated | `401 Unauthorized` |
| Authenticated, denied | `403 Forbidden` |
| Record not found OR no view permission | `404 Not Found` (no leak) |

### AI & Service Accounts

- AI tools map to same permission keys as human users
- Service accounts: role with minimal permission set; API key scoped

---

## 7. Error Handling

### Error Envelope

```json
{
  "data": null,
  "meta": { "request_id": "uuid" },
  "errors": {
    "code": "VALIDATION_FAILED",
    "message": "Human-readable summary",
    "details": [
      { "field": "quantity", "code": "MIN_VALUE", "message": "Must be at least 1" }
    ]
  }
}
```

### Standard Error Codes

| HTTP | Code | When |
|------|------|------|
| 400 | `BAD_REQUEST` | Malformed JSON, invalid UUID |
| 401 | `UNAUTHORIZED` | Missing/invalid token |
| 403 | `FORBIDDEN` | Valid token, insufficient permission |
| 404 | `NOT_FOUND` | Resource missing or hidden |
| 409 | `CONFLICT` | Duplicate, state conflict, optimistic lock |
| 422 | `VALIDATION_FAILED` | Business validation failed |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Unexpected server error |
| 503 | `SERVICE_UNAVAILABLE` | Maintenance, dependency down |

### Validation Rules

| Rule | Detail |
|------|--------|
| **Field-level details** | Always array — even single error |
| **No stack traces** | Production — log server-side only |
| **Localized message** | `Accept-Language` when translation available |
| **Stable codes** | Clients branch on `code` — not message text |

### Workflow / State Errors

| Code | When |
|------|------|
| `INVALID_STATE_TRANSITION` | Workflow guard failed |
| `APPROVAL_REQUIRED` | Action blocked pending approval |
| `APPROVAL_REJECTED` | Prior rejection blocks action |

---

## 8. Pagination

### Cursor vs Offset

| Strategy | Use |
|----------|-----|
| **Offset** (`page`, `per_page`) | Default — admin lists, < 10k rows typical |
| **Cursor** (`cursor`, `limit`) | High-volume feeds, mobile sync, event logs |

### Offset Parameters

| Parameter | Default | Max |
|-----------|---------|-----|
| `page` | 1 | — |
| `per_page` | 25 | 100 |

### Meta (Offset)

```json
"meta": {
  "page": 1,
  "per_page": 25,
  "total": 142,
  "total_pages": 6
}
```

### Links

```json
"links": {
  "self": "...",
  "first": "...",
  "last": "...",
  "next": "...",
  "prev": null
}
```

### Rules

- Empty collection → `200` with `data: []` — not `404`
- Sort stable within page — tie-breaker `id` ascending
- Export operations use async job — not unbounded `per_page`

---

## 9. Filtering

### Filter Syntax

| Style | Example param | Notes |
|-------|---------------|-------|
| **Equality** | `status=confirmed` | Exact match |
| **Multi-value** | `status=confirmed,shipped` | OR within field |
| **Range** | `created_at_gte`, `created_at_lte` | Inclusive bounds |
| **Null** | `archived_at_is_null=true` | Explicit null checks |
| **Relation** | `customer_id={uuid}` | FK filter |
| **Search** | `q=` | Full-text — see §11 |

### Filter Documentation per Resource

Each module `API.md` lists **allowed filter fields** — undeclared filters ignored or `400`.

### Branch / Warehouse Scoping

Automatic injection from `X-Branch-Id` / user ACL when not explicitly passed.

### Complex Filters

Advanced saved filters (UI) → encoded `filter` JSON param or POST to search sub-resource — documented per module.

---

## 10. Sorting

### Parameters

| Param | Example | Default |
|-------|---------|---------|
| `sort` | `created_at` | Resource-specific |
| `order` | `desc` | `asc` |

### Multi-Sort

`sort=-created_at,name` — minus prefix = descending.

### Allowed Sort Fields

Whitelist per resource in module API.md — unknown field → `400 BAD_REQUEST`.

### Default Sorts (Convention)

| Resource type | Default sort |
|---------------|--------------|
| Transactional docs | `-created_at` |
| Master data | `name` asc |
| Activities | `-due_at` |
| Search results | `_score` desc |

---

## 11. Search

### Global Search API Group

Owned by Core Search — see [GLOBAL_SEARCH_ARCHITECTURE.md](../../02-core-platform/engines/GLOBAL_SEARCH_ARCHITECTURE.md).

| Operation | Description |
|-----------|-------------|
| Search | Cross-domain query with optional type filter |
| Autocomplete | Prefix suggestions |
| Suggestions | Recent + popular |

### Module-Scoped Search

List operations accept `q=` — delegates to Search Service with `types[]` restricted to domain.

### Search Response

```json
{
  "data": [
    {
      "id": "uuid",
      "type": "catalog.product",
      "title": "...",
      "subtitle": "...",
      "url": "/catalog/products/{id}",
      "score": 0.92
    }
  ],
  "meta": { "query": "...", "total": 15, "latency_ms": 12 }
}
```

### Permissions

Search results **permission-filtered** — same as direct GET.

### AI Search

Natural language query → structured filters via AI API group — inherits same result filter pipeline.

---

## 12. Domain API Registry

Each domain defines an **API group** (logical prefix), **resources**, **operations**, **permissions**, **events**, and **response standards**.  
**No HTTP paths** — see module `API.md` at implementation.

---

### Catalog

| Field | Value |
|-------|-------|
| **API Group** | Catalog — product master data |
| **Module prefix** | `catalog` |
| **Resources** | Product, Product Variant, Category, Brand, Attribute Profile, Attribute Group, Attribute, Collection, Product Review |
| **Operations** | **Product:** list, get, create, update, archive, submit, publish, duplicate · **Variant:** list, get, create, update, set-price · **Category:** list, get, create, update, tree, assign-products · **Brand:** list, get, create, update · **Review:** list, moderate, approve, reject |
| **Permissions** | `catalog.product.*`, `catalog.category.*`, `catalog.brand.*`, `catalog.variant.*`, `catalog.review.moderate` |
| **Events** | `catalog.product.created`, `.updated`, `.submitted`, `.published`, `.archived`, `catalog.variant.price_changed`, `catalog.category.updated` |
| **Response Standards** | Product includes: `id`, `name`, `sku`, `status`, `category_ids`, `brand_id`, `variants[]`, `media[]`, timestamps — **excludes** `cost_price` unless `catalog.product.cost.view`; list supports filter by `status`, `category_id`, `brand_id`, `q`; default sort `name` asc |

---

### Inventory

| Field | Value |
|-------|-------|
| **API Group** | Inventory — stock and warehouses |
| **Module prefix** | `inventory` |
| **Resources** | Warehouse, Stock Item, Stock Level, Stock Movement, Stock Reservation, Stock Transfer, Stock Adjustment, Batch, Serial |
| **Operations** | **Warehouse:** list, get, create, update · **Stock Level:** list, get, availability-check · **Reservation:** create, release · **Transfer:** create, confirm, receive · **Adjustment:** create, submit, post · **Movement:** list (read-only ledger) |
| **Permissions** | `inventory.warehouse.*`, `inventory.stock.view`, `inventory.reservation.*`, `inventory.transfer.*`, `inventory.adjustment.create/post` |
| **Events** | `inventory.stock_level.updated`, `inventory.movement.posted`, `inventory.adjustment.posted`, `inventory.reservation.created`, `.released`, `inventory.reorder.suggested` |
| **Response Standards** | Stock level: `variant_id`, `warehouse_id`, `qty_on_hand`, `qty_reserved`, `qty_available`; never expose other warehouse data without scope; adjustments include `lines[]`, `reason_code`, `state` |

---

### Purchase

| Field | Value |
|-------|-------|
| **API Group** | Purchase — procurement |
| **Module prefix** | `purchase` |
| **Resources** | RFQ, Purchase Order, PO Line, Goods Receipt, Vendor Bill, Purchase Return, Purchase Contract |
| **Operations** | **RFQ:** list, get, create, send, close · **PO:** list, get, create, update, submit, approve, send, cancel, close · **Receipt:** create, post · **Bill:** create, match, post · **Return:** create, approve, complete |
| **Permissions** | `purchase.order.*`, `purchase.receipt.*`, `purchase.bill.*`, `purchase.rfq.*`, `purchase.return.*` |
| **Events** | `purchase.rfq.sent`, `purchase.order.created`, `.approved`, `purchase.receipt.posted`, `purchase.bill.posted`, `.paid` |
| **Response Standards** | PO includes `vendor_id`, `lines[]`, `state`, `totals{subtotal,tax,total,currency}`, `approval_status`; vendor resolved via embedded contact summary — not full duplicate; list filter by `state`, `vendor_id`, date range |

---

### Sales

| Field | Value |
|-------|-------|
| **API Group** | Sales — revenue documents |
| **Module prefix** | `sales` |
| **Resources** | Quotation, Quotation Line, Sales Order, Order Line, Shipment, Shipment Line, Sales Invoice, Invoice Line, Customer Payment, Return, Credit Note |
| **Operations** | **Quotation:** list, get, create, update, send, accept, lose · **Order:** list, get, create, update, confirm, cancel, close · **Shipment:** create, ship, deliver · **Invoice:** create, post, cancel · **Payment:** record, allocate · **Return:** create, approve, receive |
| **Permissions** | `sales.quotation.*`, `sales.order.*`, `sales.shipment.*`, `sales.invoice.*`, `sales.payment.*`, `sales.return.*` |
| **Events** | `sales.quotation.sent`, `sales.order.confirmed`, `.cancelled`, `sales.shipment.shipped`, `sales.invoice.posted`, `sales.payment.received`, `sales.return.approved` |
| **Response Standards** | Order embeds `customer` contact summary, `lines[]` with `variant_id` + snapshot `name/sku/qty/price`; states explicit enum; totals in minor units; shipment links tracking fields |

---

### CRM

| Field | Value |
|-------|-------|
| **API Group** | CRM — pipeline and leads |
| **Module prefix** | `crm` |
| **Resources** | Lead, Account, Opportunity, Pipeline, Stage, CRM Task |
| **Operations** | **Lead:** list, get, create, update, assign, qualify, convert, lose · **Opportunity:** list, get, create, update, move-stage, win, lose · **Account:** list, get, create, update · **Task:** list, create, complete |
| **Permissions** | `crm.lead.*`, `crm.opportunity.*`, `crm.account.*`, `crm.pipeline.admin`, `crm.task.*` |
| **Events** | `crm.lead.created`, `.assigned`, `.converted`, `crm.opportunity.created`, `.won`, `.lost`, `crm.account.updated` |
| **Response Standards** | Lead includes `stage`, `score`, `owner_id`, `source`, optional `contact_id`; convert response returns `{ lead, contact, opportunity }` bundle; pipeline board = list with `group_by=stage` meta |

---

### Marketing

| Field | Value |
|-------|-------|
| **API Group** | Marketing — campaigns and promotions |
| **Module prefix** | `marketing` |
| **Resources** | Campaign, Audience, Segment, Journey, Coupon, Coupon Usage, Loyalty Program, Loyalty Ledger, Email Template |
| **Operations** | **Campaign:** list, get, create, update, schedule, launch, pause, complete · **Segment:** list, get, create, update, evaluate · **Coupon:** list, get, create, update, activate, deactivate, validate, apply · **Journey:** list, get, create, activate, pause · **Loyalty:** accrue, redeem |
| **Permissions** | `marketing.campaign.*`, `marketing.segment.*`, `marketing.coupon.*`, `marketing.journey.*`, `marketing.loyalty.*` |
| **Events** | `marketing.campaign.started`, `.sent`, `.clicked`, `marketing.coupon.applied`, `marketing.loyalty.points_awarded` |
| **Response Standards** | Campaign includes `channels[]`, `status`, `metrics{sent,opened,clicked}`; coupon validate returns `{ valid, discount, reason }`; PII-minimized list views for audience |

---

### Finance

| Field | Value |
|-------|-------|
| **API Group** | Finance — accounting and payments |
| **Module prefix** | `finance` |
| **Resources** | Chart of Account, Journal, Journal Entry, Journal Line, AR Invoice, AP Bill, Receipt, Payment, Bank Account, Bank Reconciliation, Fiscal Period, Expense Claim |
| **Operations** | **Journal Entry:** list, get, create, update, post, reverse · **AR/AP:** list, get, post, allocate · **Payment:** create, post, approve · **Reconciliation:** import, match, close · **Period:** close, reopen (admin) · **Expense:** submit, approve, post |
| **Permissions** | `finance.journal.*`, `finance.ar_invoice.*`, `finance.ap_bill.*`, `finance.payment.*`, `finance.period.close`, `finance.coa.admin`, `finance.expense.*` |
| **Events** | `finance.journal.posted`, `finance.invoice.posted`, `.paid`, `finance.payment.posted`, `.received`, `finance.period.closed` |
| **Response Standards** | Journal entry includes balanced `lines[]` with `account_id`, `debit`, `credit`; posted docs immutable — corrections via reversal; amounts decimal string + currency; fiscal period guard returns `422` when closed |

---

### Media

| Field | Value |
|-------|-------|
| **API Group** | Media — files and attachments |
| **Module prefix** | `core` (media sub-group) |
| **Resources** | Media Asset, Attachment, Folder |
| **Operations** | **Media:** list, get, upload, update, archive, delete · **Attachment:** list, attach, detach · **Folder:** list, create, move |
| **Permissions** | `core.media.view`, `.upload`, `.delete`, `core.attachment.create`, `.delete` |
| **Events** | `core.media.uploaded`, `.deleted`, `core.attachment.created`, `.removed` |
| **Response Standards** | Media includes `url`, `thumbnail_url`, `mime_type`, `size_bytes`, `filename`; upload returns `201` with processing status for large files; attachments include polymorphic `entity_type`, `entity_id` |

---

### Users

| Field | Value |
|-------|-------|
| **API Group** | Users — identity and access |
| **Module prefix** | `core` |
| **Resources** | User, Session, Role, Role Assignment, API Key |
| **Operations** | **Auth:** login, logout, refresh, mfa-verify, me · **User:** list, get, create, update, deactivate, invite · **Role:** list, get, create, update, assign-permissions · **User-Role:** assign, revoke · **API Key:** list, create, revoke |
| **Permissions** | `core.user.*`, `core.role.manage`, `core.api_key.manage`; auth operations public or authenticated |
| **Events** | `core.user.created`, `.updated`, `.deactivated`, `core.user.logged_in`, `core.role.updated`, `core.permission.granted`, `.revoked` |
| **Response Standards** | User excludes `password_hash`; `me` includes effective permission keys[] and company list; never expose other users' sessions |

---

### Settings

| Field | Value |
|-------|-------|
| **API Group** | Settings — configuration |
| **Module prefix** | `core` |
| **Resources** | Company Setting, Branch Setting, Module Setting, Feature Flag, Integration Credential |
| **Operations** | **Settings:** list, get, set, bulk-set · **Module config:** get-schema, get-values, update · **Feature flag:** list, evaluate (internal) · **Integration:** list, set (encrypted) |
| **Permissions** | `core.settings.view`, `.edit`, `.admin` |
| **Events** | `core.settings.updated`, `core.settings.company.updated` |
| **Response Standards** | Hierarchical resolution documented per key; secrets return `***` on get — never plaintext; schema endpoint drives settings UI form generation |

---

### Workflow

| Field | Value |
|-------|-------|
| **API Group** | Workflow — state machines |
| **Module prefix** | `core` |
| **Resources** | Workflow Definition, Workflow Instance, Transition Log |
| **Operations** | **Definition:** list, get, register (admin) · **Instance:** get, start, transition, cancel, history · **Available transitions:** get for entity |
| **Permissions** | `core.workflow.view`, `.transition`, `.admin` |
| **Events** | `core.workflow.started`, `.transitioned`, `.completed`, `.cancelled` |
| **Response Standards** | Instance includes `entity_type`, `entity_id`, `current_state`, `available_transitions[]` with required permission per transition; history ordered chronologically |

---

### Approvals

| Field | Value |
|-------|-------|
| **API Group** | Approvals — human gates |
| **Module prefix** | `core` |
| **Resources** | Approval Policy, Approval Request, Approval Step, Approval Action |
| **Operations** | **Request:** list, get, submit, cancel · **Action:** approve, reject, delegate · **Queue:** my-pending, team-pending · **Policy:** list, get (admin) |
| **Permissions** | `core.approval.view`, `.approve`, `.reject`, `.delegate`, `.admin` |
| **Events** | `core.approval.requested`, `.approved`, `.rejected`, `.delegated`, `.escalated`, `.expired` |
| **Response Standards** | Request embeds host entity summary `{ type, id, title }`; steps show approvers, state, comments; SLA due_at optional |

---

### Notifications

| Field | Value |
|-------|-------|
| **API Group** | Notifications — messaging |
| **Module prefix** | `core` |
| **Resources** | Notification, Notification Template, Notification Rule, User Preference, Delivery Log |
| **Operations** | **In-app:** list, get, mark-read, mark-all-read · **Send:** send, send-template (system) · **Preference:** get, update · **Template/Rule:** CRUD (admin) |
| **Permissions** | `core.notification.view`, `.manage_preferences`, `.admin` |
| **Events** | `core.notification.sent`, `.delivered`, `.failed`, `.read` |
| **Response Standards** | In-app notification includes `title`, `body`, `read_at`, `action_url`, optional `entity_type/id`; list default unread filter; no raw email bodies in list — link to template preview |

---

### AI

| Field | Value |
|-------|-------|
| **API Group** | AI — agents and tools |
| **Module prefix** | `ai` |
| **Resources** | Conversation, Message, Agent Run, Tool Invocation, Tool Registry Entry, AI Credit Balance, AI Audit Entry |
| **Operations** | **Chat:** create conversation, send message, stream · **Agent:** run, cancel, status · **Tool:** list, invoke, approve (high-risk) · **Usage:** credits, history · **Admin:** register-tool, model-config |
| **Permissions** | `ai.access`, `ai.agent.run`, `ai.tool.execute`, `ai.conversation.view`, `ai.admin` |
| **Events** | `ai.agent.started`, `.completed`, `ai.tool.invoked`, `.approved`, `.rejected`, `ai.credit.consumed` |
| **Response Standards** | Message includes `role`, `content`, `tool_calls[]`; streaming via SSE content-type; tool invoke returns `{ result, audit_id }`; high-risk returns `{ status: pending_approval, approval_id }` |

---

## 13. Cross-Domain API Rules

| # | Rule |
|---|------|
| 1 | Register new operations here before module `API.md` |
| 2 | Every mutation publishes ≥1 domain event |
| 3 | List endpoints support pagination (§8) |
| 4 | Permission key required for every operation |
| 5 | No cross-module DB joins in API handlers |
| 6 | Embedded summaries — not full sibling aggregates |
| 7 | Soft-delete → `archived_at` — list excludes unless `include_archived` |
| 8 | Bulk operations return `207` or job id for async |
| 9 | File upload — multipart separate from JSON patch |
| 10 | Webhooks subscribe to events — not API polling |

---

## 14. Future Expansion

| Addition | Process |
|----------|---------|
| New domain API group | Section in this registry → module API.md → SERVICE_REGISTRY |
| New resource | Resources + Operations + Permissions + Events rows |
| Public API | Rate limit tier + API key scope |
| GraphQL (future) | Read-only facade over same services — mutations stay REST |
| Mobile offline sync | Cursor pagination + delta sync operation per resource |

---

## Appendix A — Operation Type Catalog

| Operation | HTTP (implementation) | Idempotent | Typical event |
|-----------|----------------------|------------|---------------|
| list | GET collection | Yes | — |
| get | GET member | Yes | — |
| create | POST | No* | `{entity}.created` |
| update | PATCH | No | `{entity}.updated` |
| archive | DELETE/PATCH | Yes | `{entity}.archived` |
| submit | POST action | No* | `{entity}.submitted` |
| approve | POST action | No* | `{entity}.approved` |
| confirm | POST action | No* | `{entity}.confirmed` |
| post | POST action | No* | `{entity}.posted` |

*May support `Idempotency-Key`

---

## Appendix B — Registry vs Module API.md

| This registry | Module API.md (implementation gate) |
|---------------|--------------------------------------|
| API group scope | Exact paths and query params |
| Resource list | Request/response JSON schema |
| Operation names | HTTP method + route mapping |
| Permission keys | Field-level validation rules |
| Event names | Payload field definitions |
| Response standards | Example JSON bodies |

---

## Related Documents

| Document | Role |
|----------|------|
| [SERVICE_REGISTRY.md](./SERVICE_REGISTRY.md) | Service layer behind APIs |
| [api/architecture.md](../../05-development/api/architecture.md) | API-first flow |
| [core/API.md](../../02-core-platform/API.md) | Core route reference (implementation) |
| [PERMISSION_SYSTEM_ARCHITECTURE.md](../../02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md) | Authorization |
| [EVENT_ARCHITECTURE.md](../../02-core-platform/engines/EVENT_ARCHITECTURE.md) | Event names |

---

*End of API Registry — Step 22*
