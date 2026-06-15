# Core API Reference

> **Status:** Draft  
> **Owner:** Core Platform  
> **Global standards:** [api/architecture.md](../api/architecture.md)

---

## Base URL

```
/api/v1/core/
```

All endpoints require authentication unless marked **Public**.

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Email + password → JWT |
| POST | `/auth/logout` | Invalidate session |
| POST | `/auth/refresh` | Refresh token |
| POST | `/auth/mfa/verify` | TOTP verification |
| GET | `/auth/me` | Current user + permissions |

## Users

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET | `/users` | `core.user.read` |
| POST | `/users` | `core.user.write` |
| GET | `/users/{id}` | `core.user.read` |
| PATCH | `/users/{id}` | `core.user.write` |
| DELETE | `/users/{id}` | `core.user.delete` |

## Roles & Permissions

| Method | Endpoint |
|--------|----------|
| GET | `/roles` |
| POST | `/roles` |
| GET | `/permissions` |
| POST | `/users/{id}/roles` |

## Companies & Branches

| Method | Endpoint |
|--------|----------|
| GET | `/companies` |
| GET | `/companies/{id}/branches` |
| PATCH | `/companies/{id}/settings` |

## Contacts & Addresses

| Method | Endpoint |
|--------|----------|
| GET | `/contacts` |
| POST | `/contacts` |
| GET | `/contacts/{id}/addresses` |
| POST | `/contacts/{id}/addresses` |

## Media

| Method | Endpoint |
|--------|----------|
| POST | `/media/upload` |
| GET | `/media` |
| GET | `/media/{id}` |
| DELETE | `/media/{id}` |

## Settings

| Method | Endpoint |
|--------|----------|
| GET | `/settings` |
| PATCH | `/settings/{key}` |
| GET | `/settings/modules/{module}` |

## Localization

| Method | Endpoint |
|--------|----------|
| GET | `/languages` |
| GET | `/currencies` |
| GET | `/currencies/rates` |
| GET | `/taxes` |

## Workflow & Approvals

| Method | Endpoint |
|--------|----------|
| GET | `/workflows/{model}/{record_id}` |
| POST | `/workflows/{instance_id}/transition` |
| GET | `/approvals/pending` |
| POST | `/approvals/{id}/approve` |

## Search

| Method | Endpoint |
|--------|----------|
| GET | `/search?q=` |
| GET | `/search/autocomplete?q=` |

## API Management

| Method | Endpoint |
|--------|----------|
| GET | `/api-keys` |
| POST | `/api-keys` |
| GET | `/webhooks` |
| POST | `/webhooks` |

## Events (Admin)

| Method | Endpoint |
|--------|----------|
| GET | `/events` |
| GET | `/events/{id}` |

## Response Format

```json
{
  "data": {},
  "meta": { "page": 1, "per_page": 25, "total": 100 },
  "links": { "next": "..." }
}
```

## Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "fields": { "email": ["required"] }
  }
}
```

## Rate Limits

| Tier | Limit |
|------|-------|
| Authenticated user | 1000 req/min |
| API key (standard) | 5000 req/min |
| API key (enterprise) | Configurable |

See [api/architecture.md](../api/architecture.md) for versioning, pagination, and webhook contracts.
