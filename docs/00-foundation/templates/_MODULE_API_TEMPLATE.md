# API — {Module}

> **Status:** Draft  
> **Module:** {Module}  
> **Document Type:** API (Level 5 SSOT)  
> **Base path:** `{api_path}`

---

## Purpose

Define **{Module}** REST API contracts, service boundaries, and integration patterns. This file is the **API SSOT** — Architecture §5 summarizes and links here.

## When To Read

Read only for endpoint design, handler implementation, or service contract work. Do not open [API_REGISTRY.md](../../00-foundation/registries/API_REGISTRY.md) unless explicitly requested.

## Related Files

- [Architecture.md](Architecture.md) — §5 API summary
- [Database.md](Database.md) — tables behind endpoints
- [Permissions.md](Permissions.md) — `{module}.*` namespace
- [Workflow.md](Workflow.md) — state transitions triggered by API

## Read Next

- [Architecture.md](Architecture.md) — if integration boundaries unclear
- One endpoint group — stop here

---

## Conventions

| Property | Value |
|----------|-------|
| **Base path** | `{api_path}` |
| **Versioning** | URL path (`/api/v1/`) |
| **Auth** | Bearer token + `X-Company-Id` header |
| **Pagination** | `?page=&limit=` · response `{ data, meta }` |
| **Errors** | `{ error: { code, message, details } }` |
| **Permission** | `{module}.*` per route — see Permissions.md |

---

## Resource: `{prefix}_example`

### List

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| GET | `{api_path}examples` | `{module}.example.view` | Paginated list |

**Query params:** `status`, `search`, `page`, `limit`

### CRUD

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| POST | `{api_path}examples` | `{module}.example.manage` | Create |
| GET | `{api_path}examples/{id}` | `{module}.example.view` | Read |
| PATCH | `{api_path}examples/{id}` | `{module}.example.manage` | Update |
| DELETE | `{api_path}examples/{id}` | `{module}.example.manage` | Soft delete |

### Request / Response (create)

```json
// POST {api_path}examples
{ "name": "string", "status": "draft" }
```

```json
// 201
{ "data": { "id": "uuid", "name": "string", "status": "draft" } }
```

---

## Services

### Provided (other modules call these)

| Service | Method | Purpose |
|---------|--------|---------|
| `{Module}Service.getExample` | sync | Read by ID for cross-module use |
| `{Module}Service.createExample` | sync | Create via service layer |

### Consumed

| Service | Module | Purpose |
|---------|--------|---------|
| `ContactService` | Core | Resolve contact |
| `_OtherService_` | _module_ | _—_ |

**Rule:** Cross-module calls via **services only** — never direct HTTP from module handlers to another module's tables.

---

## Webhooks / Events (API side)

API handlers **publish events after COMMIT** — see [Workflow.md](Workflow.md) and Architecture §6.

| Action | Event |
|--------|-------|
| Create example | `{module}.example.created` |

---

## Anti-Patterns

```text
❌ Duplicate endpoint tables in Architecture.md
❌ Cross-module DB access in route handlers
❌ Undocumented breaking changes (update CHANGELOG.md)
```

---

**Module:** {Module} · **Last Updated:** {DATE} · **Maintainer:** {team}
