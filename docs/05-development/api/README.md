# API Documentation

## Purpose
Documentation: README.

## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Draft  
> **Standards:** [DEVELOPMENT_STANDARDS.md §7](../../00-foundation/standards/DEVELOPMENT_STANDARDS.md#7-api-first-architecture)  
> **Master registry:** [API_REGISTRY.md](../../00-foundation/registries/API_REGISTRY.md) — architecture, domain groups, operations (no routes)


## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

Global API standards for AgainERP. Module-specific **routes and schemas** are documented in each module's `API.md` at implementation gate.

## Standards

| Document | Description |
|----------|-------------|
| [API_REGISTRY.md](../../00-foundation/registries/API_REGISTRY.md) | **Master API registry** — philosophy, auth, pagination, 15 domain profiles |
| [architecture.md](./architecture.md) | API-first flow, URL conventions, response format |
| `versioning.md` | API version strategy (`/api/v1/`) (planned) |
| `authentication.md` | Tokens, sessions, OAuth (planned) |
| `errors.md` | Error codes and response format (planned) |
| `pagination.md` | List endpoint conventions (planned) |
| `webhooks.md` | Outbound event delivery (planned) |

## Module APIs

| Module | Document |
|--------|----------|
| Core | [../core/API.md](../../02-core-platform/API.md) |
| Ecommerce | [../modules/ecommerce/API.md](../../03-business-modules/ecommerce/API.md) |

**Rule:** Register operations in [API_REGISTRY.md](../../00-foundation/registries/API_REGISTRY.md) first; add exact HTTP paths to module `API.md` when implementing.
