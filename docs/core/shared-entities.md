# Core Shared Entities

> **Status:** Draft  
> **Rule:** These entities are owned by **Core**. Modules use them — they do not redefine them.  
> **Business profiles:** [ENTITY_RELATIONSHIP_REGISTRY.md](../ENTITY_RELATIONSHIP_REGISTRY.md)

Core Shared Entities are cross-module data models used by Ecommerce, CRM, Sales, Purchase, HR, and every other module. A single source of truth prevents duplication and keeps customer, address, media, and permission data consistent platform-wide.

---

## Entity Index

| Entity | Table | Doc | Primary Use |
|--------|-------|-----|-------------|
| Companies | `companies` | [entities/companies.md](./entities/companies.md) | Multi-tenant root |
| Branches | `branches` | [entities/branches.md](./entities/branches.md) | Company locations |
| Users | `users` | [entities/users.md](./entities/users.md) | Authentication, staff |
| Roles | `roles` | [entities/roles.md](./entities/roles.md) | Role groups |
| Permissions | `permissions` | [entities/permissions.md](./entities/permissions.md) | ACL definitions |
| Contacts | `contacts` | [entities/contacts.md](./entities/contacts.md) | People & organizations |
| Addresses | `addresses` | [entities/addresses.md](./entities/addresses.md) | Polymorphic locations |
| Media Library | `media` | [entities/media-library.md](./entities/media-library.md) | Files & images |
| Tags | `tags` | [entities/tags.md](./entities/tags.md) | Polymorphic labels |
| Notes | `notes` | [entities/notes.md](./entities/notes.md) | Internal notes |
| Activities | `activities` | [entities/activities.md](./entities/activities.md) | Tasks & timeline |
| Comments | `comments` | [entities/comments.md](./entities/comments.md) | Threaded discussion |
| Attachments | `attachments` | [entities/attachments.md](./entities/attachments.md) | Record file links |

---

## Design Principles

| Principle | Rule |
|-----------|------|
| **Single owner** | Core owns schema, APIs, and services for shared entities |
| **No duplication** | Modules store foreign keys (`contact_id`) — never copy contact fields |
| **Polymorphic where needed** | Addresses, Tags, Notes, Comments, Attachments use `entity_type` + `entity_id` |
| **Company scoped** | All entities include `company_id` (except `companies` itself) |
| **Standard columns** | Every table follows [database/standards.md](../database/standards.md) |
| **API access only** | Modules call Core APIs — no direct cross-module table access |

---

## Entity Relationship Overview

```
companies
├── branches
├── users ──────► roles ──────► permissions
├── contacts
│   └── addresses (polymorphic)
├── media (library)
└── [any module record]
    ├── addresses
    ├── tags (polymorphic)
    ├── notes (polymorphic)
    ├── activities (polymorphic)
    ├── comments (polymorphic)
    └── attachments ──► media
```

---

## Module Usage Matrix

| Entity | Ecommerce | CRM | Sales | Purchase | HR | Accounting |
|--------|-----------|-----|-------|----------|----|------------|
| Companies | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Branches | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Users | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Roles / Permissions | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Contacts | ✓ customers | ✓ leads | ✓ customers | ✓ vendors | ✓ employees | ✓ |
| Addresses | ✓ shipping | ✓ | ✓ | ✓ | ✓ | ✓ |
| Media Library | ✓ products | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tags | ✓ products | ✓ | ✓ | ✓ | ✓ | — |
| Notes | ✓ orders | ✓ | ✓ | ✓ | ✓ | ✓ |
| Activities | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Comments | ✓ reviews | ✓ | ✓ | ✓ | — | — |
| Attachments | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## API Namespace

All shared entity APIs live under Core:

```
/api/v1/core/companies
/api/v1/core/branches
/api/v1/core/users
/api/v1/core/roles
/api/v1/core/permissions
/api/v1/core/contacts
/api/v1/core/addresses
/api/v1/core/media
/api/v1/core/tags
/api/v1/core/notes
/api/v1/core/activities
/api/v1/core/comments
/api/v1/core/attachments
```

---

## Module Integration Rule

When a module needs a contact, address, or file:

```
✓  POST /api/v1/core/contacts        → use returned contact_id
✓  POST /api/v1/core/addresses       → link to contact or order via polymorphic
✓  POST /api/v1/core/attachments   → link media to module record

✗  CREATE ecommerce_customers with duplicate name/email columns
✗  Store file paths directly in module tables
✗  Define module-specific permission tables
```

---

## Ecommerce Dependencies

Ecommerce uses these shared entities directly:

| Ecommerce Feature | Shared Entity |
|-------------------|---------------|
| Store customers | `contacts` (type: customer) |
| Shipping / billing | `addresses` |
| Product images | `media` + `attachments` |
| Product labels | `tags` |
| Order internal notes | `notes` |
| Follow-up tasks | `activities` |
| Staff access | `users`, `roles`, `permissions` |
| Multi-store | `companies`, `branches` |

See [modules/ecommerce/Architecture.md](../modules/ecommerce/Architecture.md).

---

**Last Updated:** 2026-06-12
