# API Documentation

> **Status:** Draft  
> **Standards:** [DEVELOPMENT_STANDARDS.md §7](../DEVELOPMENT_STANDARDS.md#7-api-first-architecture)  
> **Master registry:** [API_REGISTRY.md](../API_REGISTRY.md) — architecture, domain groups, operations (no routes)

Global API standards for AgainERP. Module-specific **routes and schemas** are documented in each module's `API.md` at implementation gate.

## Standards

| Document | Description |
|----------|-------------|
| [API_REGISTRY.md](../API_REGISTRY.md) | **Master API registry** — philosophy, auth, pagination, 15 domain profiles |
| [architecture.md](./architecture.md) | API-first flow, URL conventions, response format |
| `versioning.md` | API version strategy (`/api/v1/`) (planned) |
| `authentication.md` | Tokens, sessions, OAuth (planned) |
| `errors.md` | Error codes and response format (planned) |
| `pagination.md` | List endpoint conventions (planned) |
| `webhooks.md` | Outbound event delivery (planned) |

## Module APIs

| Module | Document |
|--------|----------|
| Core | [../core/API.md](../core/API.md) |
| Ecommerce | [../modules/ecommerce/API.md](../modules/ecommerce/API.md) |

**Rule:** Register operations in [API_REGISTRY.md](../API_REGISTRY.md) first; add exact HTTP paths to module `API.md` when implementing.
