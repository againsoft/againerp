# AgainERP — Global Development Standards

> **Mandatory:** Every module, screen, API, and database table must follow these standards.  
> **Technology:** [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md) — official stack (Next.js, FastAPI, PostgreSQL, …)  
> Governance: [GOVERNANCE.md](./GOVERNANCE.md) · Documentation: [DOCUMENTATION_STANDARD.md](./DOCUMENTATION_STANDARD.md)

---

## Mission

Build a modern ERP and Ecommerce ecosystem that is:

| Pillar | Description |
|--------|-------------|
| **Fast** | Sub-2s pages, sub-500ms APIs |
| **Secure** | RBAC, hardened inputs, MFA-ready |
| **Scalable** | Modular, API-first, queue-backed |
| **Mobile Friendly** | Mobile-first UI on all devices |
| **SEO Friendly** | Full metadata and structured data on public pages |
| **AI Ready** | Structured APIs and data for future AI agents |
| **API First** | Frontend never talks directly to the database |
| **Multi Tenant Ready** | Multi-company, branch, warehouse from day one design |
| **Enterprise Ready** | Audit trail, activity logs, monitoring |

---

## Standard Index

| # | Standard | Section |
|---|----------|---------|
| 1 | Mobile First Design | [§1](#1-mobile-first-design) |
| 2 | Performance First | [§2](#2-performance-first) |
| 3 | SEO First | [§3](#3-seo-first) |
| 4 | User Activity Tracking | [§4](#4-user-activity-tracking) |
| 5 | Audit Trail | [§5](#5-audit-trail) |
| 6 | Security First | [§6](#6-security-first) |
| 7 | API First Architecture | [§7](#7-api-first-architecture) |
| 8 | Modular Architecture | [§8](#8-modular-architecture) |
| 9 | Multi Company Ready | [§9](#9-multi-company-ready) |
| 10 | Multi Language Ready | [§10](#10-multi-language-ready) |
| 11 | Multi Currency Ready | [§11](#11-multi-currency-ready) |
| 12 | File Management | [§12](#12-file-management-standards) |
| 13 | Search Standards | [§13](#13-search-standards) |
| 14 | Notification System | [§14](#14-notification-system) |
| 15 | Reporting Standards | [§15](#15-reporting-standards) |
| 16 | AI Ready Standards | [§16](#16-ai-ready-standards) |
| 17 | Development Standards | [§17](#17-development-standards) |
| 18 | Database Standards | [§18](#18-database-standards) |
| 19 | Monitoring Standards | [§19](#19-monitoring-standards) |
| 20 | Documentation First | [§20](#20-documentation-first) |

---

## 1. Mobile First Design

All pages must be designed **mobile-first**. No desktop-only features are allowed.

### Requirements

- Responsive layout (fluid grids, flexible breakpoints)
- Touch-friendly controls (min 44×44px tap targets)
- Mobile navigation (collapsible sidebar, bottom nav where appropriate)
- Mobile tables (horizontal scroll, card view fallback, stacked rows)
- Mobile forms (single column, large inputs, inline validation)
- Mobile dashboard (widget stacking, swipe-friendly cards)

### Target Devices

| Device | Breakpoint (reference) |
|--------|------------------------|
| Mobile | < 768px |
| Tablet | 768px – 1024px |
| Laptop | 1024px – 1440px |
| Desktop | > 1440px |

### Module Compliance

Every `UI.md` and screen doc (`Menus/*.md`) must document mobile layout behavior.

**Detail:** [ui-ux/mobile-first.md](./ui-ux/mobile-first.md) · **Enterprise UI:** [ui-ux/ENTERPRISE_UI_ARCHITECTURE.md](./ui-ux/ENTERPRISE_UI_ARCHITECTURE.md) · **Smart UX:** [ui-ux/UX_SMART_INTERACTION_STANDARDS.md](./ui-ux/UX_SMART_INTERACTION_STANDARDS.md)

---

## 2. Performance First

Performance is mandatory, not optional.

### Requirements

| Technique | Apply To |
|-----------|----------|
| Lazy loading | Images, lists, heavy components |
| Image optimization | WebP/AVIF, responsive srcset, compression |
| Database query optimization | Indexes, eager loading, query plans |
| Pagination | All list endpoints and tables |
| API caching | Redis / HTTP cache headers |
| Browser caching | Static assets, CDN |
| Queue processing | Email, exports, imports, webhooks |

### Avoid

- N+1 queries
- Large API payloads (use pagination and field selection)
- Unnecessary JavaScript bundles
- Synchronous blocking operations in request cycle

### Targets

| Metric | Target |
|--------|--------|
| Page load (LCP) | < 2 seconds |
| API response (p95) | < 500ms |
| Time to interactive | < 3 seconds |

---

## 3. SEO First

All **public** pages (Website, Ecommerce storefront) must be SEO optimized.

### Requirements

- SEO-friendly URLs (`/products/blue-widget` not `/p?id=123`)
- Meta title and meta description per page
- Open Graph tags
- Twitter Cards
- Schema.org markup (Product, Organization, BreadcrumbList)
- XML sitemap (auto-generated)
- `robots.txt`

### Support

- Canonical URLs
- Breadcrumbs (UI + structured data)
- Structured data (JSON-LD)

Admin/back-office pages are `noindex` unless explicitly public.

**Detail:** [ui-ux/seo.md](./ui-ux/seo.md)

---

## 4. User Activity Tracking

Track **all** user actions across every module.

### Actions to Log

| Action | Logged |
|--------|--------|
| Login / Logout | Yes |
| Create / Edit / Delete | Yes |
| View (sensitive records) | Yes |
| Export / Import | Yes |

### Activity Log Fields

| Field | Required |
|-------|----------|
| User ID | Yes |
| IP address | Yes |
| Device | Yes |
| Browser | Yes |
| Timestamp | Yes |
| Action type | Yes |
| Module | Yes |
| Record ID / type | Yes (when applicable) |
| Payload summary | Optional |

Stored via Core **Activity System**. Modules emit events; Core persists logs.

---

## 5. Audit Trail

Nothing important disappears permanently.

### Requirements

| Feature | Description |
|---------|-------------|
| Soft delete | `deleted_at` on all business tables |
| Restore system | Undelete with permission check |
| Revision history | Track field-level changes on critical records |
| Change tracking | Who changed what and when |

### Required Columns (business records)

| Column | Purpose |
|--------|---------|
| `created_by` | User who created the record |
| `updated_by` | User who last modified |
| `deleted_by` | User who soft-deleted |

**Detail:** [database/audit-trail.md](./database/audit-trail.md)

---

## 6. Security First

### Requirements

| Control | Standard |
|---------|----------|
| Access control | RBAC + permission-based access per module |
| CSRF | Token on all state-changing forms |
| XSS | Output encoding, CSP headers |
| SQL injection | Parameterized queries / ORM only |
| API auth | Bearer tokens / session with expiry |
| MFA | Architecture must be MFA-ready from day one |

### Passwords

- Hashed (bcrypt / argon2)
- Never stored or logged in plain text
- Never returned in API responses

### Module Compliance

Every module defines permissions in `Permissions.md`. No hardcoded role checks in UI.

---

## 7. API First Architecture

Frontend **never** talks directly to the database.

### Request Flow

```
Frontend → API → Business Logic (Service Layer) → Repository → Database
```

### Rules

- All modules expose REST APIs under `/api/v1/{module}/`
- Business logic lives in service layer — not controllers, not UI
- Frontend consumes APIs only
- Third parties use the same APIs

### Future Consumers

- Mobile app
- AI agents
- Third-party integrations
- Webhooks / event subscribers

**Detail:** [api/architecture.md](./api/architecture.md)

---

## 8. Modular Architecture

Every module is independent and loosely coupled.

### Modules

CRM · Sales · Purchase · Inventory · Accounting · HR · POS · Ecommerce · Website · Helpdesk · Project · Marketing · Manufacturing · AI

### Communication Rules

| Allowed | Not Allowed |
|---------|-------------|
| Service-to-service calls via defined interfaces | Direct cross-module database joins |
| Published API endpoints | Importing another module's internal classes |
| Event bus / domain events | Shared mutable global state |
| Core framework services | Tight circular dependencies |

See [MODULE_DEPENDENCY_MAP.md](./MODULE_DEPENDENCY_MAP.md) and [SERVICE_REGISTRY.md](./SERVICE_REGISTRY.md).

---

## 9. Multi Company Ready

Design for multi-tenancy even if v1 runs a single company.

### Support

| Entity | Scope |
|--------|-------|
| Companies | Top-level tenant isolation |
| Branches | Per-company locations |
| Warehouses | Per-branch stock locations |

### Rules

- Every business table includes `company_id`
- Queries always filter by company context
- Users may belong to multiple companies with active company switch
- Branch/warehouse scoped where applicable

**Detail:** [database/multi-company.md](./database/multi-company.md)

---

## 10. Multi Language Ready

### Supported Languages (initial)

| Code | Language |
|------|----------|
| `en` | English |
| `bn` | Bangla |

### Rules

- All user-facing strings use translation keys
- Never hardcode language strings in code or templates
- Database stores default language; translations in separate tables or JSON fields
- Admin can manage translations per module

Format: `__('ecommerce.product.name')` or equivalent i18n pattern.

---

## 11. Multi Currency Ready

### Supported Currencies (initial)

| Code | Currency |
|------|----------|
| `BDT` | Bangladeshi Taka |
| `USD` | US Dollar |
| `EUR` | Euro |

### Rules

- Store amounts with `currency_code` and decimal precision
- Never mix currencies in calculations without explicit conversion
- Exchange rates table for conversion (future)
- Display formatted per locale

---

## 12. File Management Standards

All uploaded files go through Core **Document Engine**.

### Features

| Feature | Required |
|---------|----------|
| Versioning | Yes |
| Preview | Yes (images, PDF) |
| Download | Yes (permission-gated) |
| Permission control | Yes |

### Storage Abstraction

| Driver | Support |
|--------|---------|
| Local storage | Development / small deployments |
| S3 | Production recommended |
| Cloud storage | Extensible adapter pattern |

Modules reference files by ID — never store raw paths in business tables.

---

## 13. Search Standards

Every module must support:

| Feature | Description |
|---------|-------------|
| Global search | Cross-module search from top bar |
| Advanced search | Module-specific filters |
| Filters | Faceted filtering on list pages |
| Sorting | Column sort with API support |

### Scalability Path

| Phase | Engine |
|-------|--------|
| v1 | Database full-text / indexed columns |
| v2 | Meilisearch |
| v3 | Elasticsearch (enterprise scale) |

Search indexes must be rebuildable from source data.

---

## 14. Notification System

Event-driven notifications via Core **Notification System**.

### Channels

| Channel | Priority |
|---------|----------|
| In-app | v1 |
| Email | v1 |
| SMS | v2 |
| WhatsApp | v2 |

### Rules

- Modules emit events; Core dispatches notifications
- Users configure notification preferences per channel
- Templates are translatable (multi-language)
- Delivery failures are queued and retried

---

## 15. Reporting Standards

Every module must provide:

| Output | Format |
|--------|--------|
| Dashboard widgets | Real-time summary cards and charts |
| PDF reports | Branded, printable |
| Excel reports | `.xlsx` export |
| CSV export | Bulk data export |

Reports read from APIs or read-replicas — never block transactional tables.

---

## 16. AI Ready Standards

All modules must be AI-compatible by design.

### Principles

- Structured, documented APIs (machine-readable OpenAPI)
- Consistent data models with clear semantics
- Activity and audit logs for context
- Permission-aware AI actions (AI acts as user with scoped access)

### Future AI Features

| Feature | Module Impact |
|---------|---------------|
| AI Assistant | Natural language queries across modules |
| Smart Search | Semantic search over records |
| Report Summary | Auto-generated insights |
| Forecasting | Sales, inventory predictions |
| Workflow Automation | AI-triggered state transitions |

---

## 17. Development Standards

### Code Quality

| Principle | Application |
|-----------|-------------|
| Clean code | Readable, small functions, meaningful names |
| SOLID | Single responsibility, dependency injection |
| Service layer | All business logic in services |
| Repository pattern | Data access isolated from business logic |
| Reusable components | Shared UI and service components in Core |

### Prohibited

- Duplicated business logic across modules
- Business logic inside UI components or controllers
- Direct database access from frontend
- Magic numbers and hardcoded configuration

### Module `Development.md` Must Define

- Local setup steps
- Coding conventions for the module
- Testing strategy (unit, integration, e2e)
- Service and repository naming patterns

---

## 18. Database Standards

Every business table **must** include these columns:

| Column | Type | Purpose |
|--------|------|---------|
| `id` | BIGINT PK | Auto-increment primary key |
| `uuid` | CHAR(36) / UUID | Public external reference |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last modification time |
| `deleted_at` | TIMESTAMP NULL | Soft delete |
| `created_by` | BIGINT FK → users | Creator |
| `updated_by` | BIGINT FK → users | Last editor |
| `deleted_by` | BIGINT FK → users NULL | Soft deleter |
| `status` | VARCHAR / ENUM | Record status |
| `company_id` | BIGINT FK → companies | Multi-company scope |

Additional module-specific columns follow naming conventions in [database/naming-conventions.md](./database/naming-conventions.md).

**Detail:** [database/standards.md](./database/standards.md)

---

## 19. Monitoring Standards

### Track

| Area | Tooling (planned) |
|------|-------------------|
| Application errors | Error tracking (Sentry or equivalent) |
| Slow queries | DB query log + APM |
| Failed jobs | Queue dashboard |
| User activity | Activity System logs |
| API performance | APM, response time metrics |

### Alerting

- API p95 > 500ms → warning
- Error rate spike → alert
- Failed job backlog → alert
- Disk / storage threshold → alert

**Detail:** [deployment/monitoring.md](./deployment/monitoring.md)

---

## 20. Documentation First

No code may be written until these are completed and approved:

| Document | Location |
|----------|----------|
| Architecture | `modules/{module}/Architecture.md` |
| Database | `modules/{module}/Database.md` |
| API | `modules/{module}/API.md` |
| Workflow | `modules/{module}/Workflow.md` |
| Permissions | `modules/{module}/Permissions.md` |

**Documentation is the source of truth.** Code follows docs — never the reverse.

Full workflow: [GOVERNANCE.md](./GOVERNANCE.md)

---

## Module Compliance Checklist

Use when marking a module **Ready**:

| # | Standard | Compliant |
|---|----------|-----------|
| 1 | Mobile-first documented in UI.md and screen docs | [ ] |
| 2 | Performance targets documented | [ ] |
| 3 | SEO documented for public pages | [ ] |
| 4 | Activity logging defined | [ ] |
| 5 | Audit trail / soft delete in Database.md | [ ] |
| 6 | Permissions in Permissions.md | [ ] |
| 7 | API endpoints in API.md | [ ] |
| 8 | Module dependencies in MODULE_DEPENDENCY_MAP.md | [ ] |
| 9 | company_id on all tables | [ ] |
| 10 | i18n keys defined | [ ] |
| 11 | Currency fields defined | [ ] |
| 12 | File upload via Document Engine | [ ] |
| 13 | Search/filter on list pages | [ ] |
| 14 | Notification events defined | [ ] |
| 15 | Reports/export documented | [ ] |
| 16 | AI-ready API contracts | [ ] |
| 17 | Service layer in Development.md | [ ] |
| 18 | Standard columns on all tables | [ ] |
| 19 | Monitoring hooks defined | [ ] |
| 20 | All docs approved (Governance) | [ ] |

---

**Platform:** AgainERP  
**Status:** Active  
**Last Updated:** 2026-06-12
