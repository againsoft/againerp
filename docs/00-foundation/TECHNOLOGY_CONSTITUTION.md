# AgainERP — Technology Constitution

> **Status:** **Official** — Single source of truth for all technology decisions  
> **Version:** 1.0  
> **Governance:** [GOVERNANCE.md](GOVERNANCE.md) · [DEVELOPMENT_STANDARDS.md](standards/DEVELOPMENT_STANDARDS.md)  
> **Supersedes:** ADR-002 (Laravel), ADR-003 (Vue) — see [ADR_INDEX.md](traceability/ADR_INDEX.md)

## Purpose
Documentation: TECHNOLOGY CONSTITUTION.

## When To Read
Read only if your task involves technology constitution.

## Related Files
- [Cursor entry](../BRAIN.md)

## Read Next
- [Doc map](../PROJECT_MAP.md)

---

**All AI agents, developers, architects, and contributors must follow this document.**

No technology may be introduced without updating this constitution and [CHANGELOG.md](./CHANGELOG.md).

---

## Final Rule

If any future code, architecture, design, workflow, database, API, module, or AI implementation conflicts with this document:

**This document wins.**

This is the official technology constitution of AgainERP.

---
## Project Vision

AgainERP is:

| Platform | Description |
|----------|-------------|
| **ERP Platform** | CRM, Sales, Inventory, Accounting, HR, POS |
| **Ecommerce Platform** | Catalog, Orders, Marketing, Storefront |
| **SaaS Platform** | Tenants, plans, billing, metering |
| **AI Operating System** | Chief Agent, tools, audit, credits |
| **Multi-Tenant Platform** | Tenant → Company → Branch → Warehouse |
| **White Label Platform** | Branding, domains, feature flags |
| **Marketplace Platform** | Future app and module marketplace |

The architecture must support **Ecommerce, CRM, Inventory, Accounting, POS, Hospital, School, Restaurant, Real Estate**, and future industry modules **without redesigning the platform**.

**Architecture:** [PROJECT_MAP.md](../PROJECT_MAP.md) · [UNIVERSAL_MODULE_FRAMEWORK.md](UNIVERSAL_MODULE_FRAMEWORK.md)

---

# Official Technology Stack

These technologies are **mandatory**. Deviations require a new ADR and constitution amendment.

---

## Frontend

| Category | Technology | Notes |
|----------|------------|-------|
| **Framework** | **Next.js** | App Router, React Server Components where appropriate |
| **Language** | **TypeScript** | Strict mode |
| **Styling** | **Tailwind CSS** | Design tokens — no inline styles |
| **Component Library** | **Shadcn UI** | Radix-based, customizable |
| **Enterprise Data Grid** | **AG Grid** | Lists, exports, bulk actions |
| **State Management** | **Zustand** | Client state |
| **Forms** | **React Hook Form** | All forms |
| **Validation** | **Zod** | Shared schemas with API |
| **Charts** | **Recharts** | Dashboards, analytics |
| **Icons** | **Lucide Icons** | Consistent icon set |
| **Tables** | **AG Grid** | Primary data tables |
| **Notifications** | **Sonner** | Toast / alerts |
| **Command Palette** | **CMDK** | Global search + actions |

**UI architecture:** [ui-ux/ENTERPRISE_UI_ARCHITECTURE.md](../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md)

---

## Backend

| Category | Technology | Notes |
|----------|------------|-------|
| **Framework** | **FastAPI** | Async Python API |
| **Language** | **Python** | 3.11+ |
| **Architecture** | Domain Driven Design | Bounded contexts per module |
| | Service Layer | Business logic in services |
| | Event Driven | Cross-module via event bus |
| | API First | All clients use REST |
| **Deployment shape** | Modular Monolith (initially) | Single deployable API |
| **Future** | Microservices Ready | Extract by module when needed |

**API standards:** [api/README.md](../05-development/api/README.md) · [API_REGISTRY.md](registries/API_REGISTRY.md)

---

## Database

| Rule | Value |
|------|-------|
| **Primary database** | **PostgreSQL** |
| **Forbidden (production)** | MySQL, MariaDB, SQLite |
| **Extensions** | `pgvector` for AI embeddings |

**Schema:** [database/MASTER_DATABASE_ARCHITECTURE.md](../05-development/database/MASTER_DATABASE_ARCHITECTURE.md) · [DATABASE_REGISTRY.md](registries/DATABASE_REGISTRY.md)

---

## Cache

| Technology | **Redis** |
|------------|-----------|

| Usage | Purpose |
|-------|---------|
| Caching | Query and fragment cache |
| Sessions | User sessions |
| Queues | Background jobs (with worker) |
| Rate limiting | API throttling |
| Realtime events | Pub/sub, live updates |
| AI context cache | Short-lived AI context |

---

## Search Engine

| Phase | Technology |
|-------|------------|
| **Official** | **Meilisearch** |
| **Future** | Elasticsearch (enterprise scale) |

---

## Object Storage

| Phase | Technology |
|-------|------------|
| **Official** | **MinIO** (S3-compatible) |
| **Future** | AWS S3, Cloudflare R2, Backblaze B2 |

Media via Core `MediaService` — [core/entities/media-library.md](../02-core-platform/entities/media-library.md)

---

## AI Stack

| Category | Technology |
|----------|------------|
| **Framework** | **LangGraph** |
| **Language** | **Python** (shared with API / AI OS) |
| **Vector storage** | **pgvector** (PostgreSQL) |
| **Future** | Qdrant |

### Supported Model Providers

OpenAI · Anthropic · Gemini · Ollama · DeepSeek · Qwen · Llama

**Architecture:** [modules/ai/AI_OS_ARCHITECTURE.md](../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) · [AI_KNOWLEDGE_INDEX.md](registries/AI_KNOWLEDGE_INDEX.md)

---

## Documentation

| Category | Technology |
|----------|-------------|
| **Format** | **Markdown** (`docs/`) |
| **Documentation site** | **Docusaurus** (future publish) |

### Documentation Rules

| Rule | Detail |
|------|--------|
| Documentation First | Docs before code |
| No feature without documentation | Register in [DOCUMENT_REGISTRY.md](registries/DOCUMENT_REGISTRY.md) |
| No code without documentation | Status **Ready** required |

---

# UI/UX Architecture

## Official Design Formula

| Source | Weight | Adopt |
|--------|--------|-------|
| **Odoo** | 60% | ERP shell, record views, smart buttons, workflows |
| **Shopify Admin** | 20% | Commerce lists, product UX, order flow |
| **Notion** | 10% | Clean content blocks, inline editing |
| **Linear** | 10% | Command palette, keyboard-first, speed |

**Do not clone any product.** Adopt best practices only.

Full spec: [ui-ux/ENTERPRISE_UI_ARCHITECTURE.md](../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md)

---

## UI Standards (Mandatory)

| Feature | Required |
|---------|----------|
| Global Search | ✅ |
| Command Palette (CMDK) | ✅ |
| AI Assistant | ✅ |
| Activities | ✅ |
| Comments | ✅ |
| Notes | ✅ |
| Attachments | ✅ |
| Notifications (Sonner + in-app) | ✅ |
| Dark Mode | ✅ |
| Responsive Design | ✅ |
| Role-Based UI | ✅ |

Smart interactions: [ui-ux/UX_SMART_INTERACTION_STANDARDS.md](../04-uiux/standards/UX_SMART_INTERACTION_STANDARDS.md)

---

## Design System

| Rule | Detail |
|------|--------|
| Tokens | Tailwind design tokens |
| Theme | Centralized theme system (light/dark) |
| Components | Shadcn UI + shared `packages/shared` |
| **Forbidden** | Inline styles, duplicated components |

---

# API Standards

| Aspect | Standard |
|--------|----------|
| Architecture | **REST API** |
| Future | GraphQL-ready (not primary) |
| Versioning | `/api/v1/` |
| Authentication | JWT + refresh tokens |
| Authorization | RBAC per endpoint |
| Rate limiting | Redis-backed |
| Audit | All mutations logged |

Registry: [API_REGISTRY.md](registries/API_REGISTRY.md)

---

# Security Standards (Mandatory)

| Control | Implementation |
|---------|----------------|
| RBAC | Core permission engine |
| Tenant isolation | `tenant_id` / `company_id` on all queries |
| Audit logs | `activity_logs`, `ai_audit_logs` |
| Encryption | TLS in transit; secrets at rest |
| API rate limits | Redis |
| Approval engine | High-risk actions |
| AI permission layer | Tool-level ACL + risk tiers |
| **AI DB rule** | **No direct database access by AI** |

---

# AI Architecture Rules

```
AI Agent
    ↓
Permission Engine + Risk Tier
    ↓
Services · Tools · APIs · Workflows
    ↓
Approval Engine (if high-risk)
    ↓
Audit Log + Credit Meter
```

| Rule | Detail |
|------|--------|
| No direct DB | AI never queries tables directly |
| Integration | Services, Tools, APIs, Workflows only |
| Traceability | Every action in `ai_audit_logs` |
| Entry docs | README → MASTER_INDEX → PROJECT_MAP → AI_KNOWLEDGE_INDEX |

---

# Project Architecture

```
Platform Layer        → SaaS, billing, tenants, feature flags
Core Layer            → Users, RBAC, contacts, workflow, events
Business Layer        → Ecommerce, CRM, accounting, inventory, POS
Industry Layer        → Hospital, school, restaurant, real estate, …
AI OS Layer           → LangGraph, tools, agents, pgvector
Infrastructure Layer  → PostgreSQL, Redis, Meilisearch, MinIO, K8s
```

Every new module must fit within this architecture.  
**Map:** [PROJECT_MAP.md](../PROJECT_MAP.md)

---

# Modular Architecture

Every module is **independently installable**. Required documentation package:

| File | Purpose |
|------|---------|
| `ModuleManifest.md` | Registry & install metadata |
| `Architecture.md` | Boundaries, services, events |
| `Database.md` | Owned tables only |
| `API.md` | REST surface |
| `Workflow.md` | State machines |
| `Permissions.md` | ACL matrix |
| `Reports.md` | Reports & exports |
| `AI.md` | Tools, agents, credits |
| `CHANGELOG.md` | Module history |

**Framework:** [UNIVERSAL_MODULE_FRAMEWORK.md](UNIVERSAL_MODULE_FRAMEWORK.md) · [MODULE_REGISTRY.md](../MODULE_REGISTRY.md)

---

# Folder Structure

```
againerp/
├── apps/
│   ├── web/                 # Next.js admin + storefront
│   ├── api/                 # FastAPI modular monolith
│   └── ai-os/               # LangGraph AI OS service
├── packages/
│   ├── core/                # Shared types, utils, API client
│   └── shared/              # UI components, Zod schemas, tokens
├── modules/                 # Domain packages (Python + TS boundaries)
│   ├── catalog/
│   ├── orders/
│   ├── customers/
│   ├── inventory/
│   ├── crm/
│   ├── accounting/
│   └── industry/
│       ├── hospital/
│       ├── school/
│       └── restaurant/
└── docs/                    # Documentation (source of truth)
```

**Rule:** Business logic lives in `apps/api` services and `modules/*` — not in `apps/web`.

---

# Development Rules

| # | Rule |
|---|------|
| 1 | No direct SQL in UI |
| 2 | No business logic in UI |
| 3 | No duplicated code — extract to `packages/` |
| 4 | No hardcoded permissions |
| 5 | No hardcoded roles |
| 6 | No hardcoded company IDs |
| 7 | No hardcoded branch IDs |
| 8 | Everything configurable via settings / Core |

Full standards: [DEVELOPMENT_STANDARDS.md](standards/DEVELOPMENT_STANDARDS.md)

---

# Documentation Governance

Every change must update applicable docs:

Architecture · Database · API · Workflow · Permissions · Changelog

Plus registries: [DOCUMENT_REGISTRY.md](registries/DOCUMENT_REGISTRY.md) · [MODULE_REGISTRY.md](../MODULE_REGISTRY.md)

**Documentation is the source of truth.**

---

# AI Development Rules

Before generating code, complete the **Pre-Code Gate**: [PRE_CODE_GATE.md](./PRE_CODE_GATE.md)

| Step | Review |
|------|--------|
| 1 | Technology Constitution (this document) |
| 2 | Architecture documents |
| 3 | Database documents |
| 4 | API standards |
| 5 | UI standards |
| 6 | AI OS standards |

Also read: [README.md](./README.md) → [MASTER_INDEX.md](./MASTER_INDEX.md) → [PROJECT_MAP.md](../PROJECT_MAP.md) → [AI_KNOWLEDGE_INDEX.md](registries/AI_KNOWLEDGE_INDEX.md)

**If documentation is missing → STOP.** Generate missing documentation first.  
**Never start coding without approved documentation** (Status: **Ready**).

Checklist: [_PRE_CODE_GATE_CHECKLIST.md](templates/_PRE_CODE_GATE_CHECKLIST.md)

---

# Future Scalability

The platform must support without major architecture redesign:

| Target | Scale |
|--------|-------|
| Tenants | 10,000+ |
| Users | 100,000+ |
| Products | Millions |
| Orders | Millions |
| AI agents | Many concurrent |
| Developer agents | CI/CD, codegen |
| App marketplace | Third-party modules |

**Roadmap:** [platform/SCALING_ROADMAP.md](../07-saas/SCALING_ROADMAP.md) · [SAAS_PLATFORM_ARCHITECTURE.md](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md)

---

# Constitution Amendment Process

1. Propose change in new ADR under `docs/adr/`
2. Update this document
3. Update [ADR_INDEX.md](traceability/ADR_INDEX.md)
4. Update affected architecture docs
5. [CHANGELOG.md](./CHANGELOG.md) entry
6. Stakeholder approval for stack changes

---

**Platform:** AgainERP  
**Ratified:** 2026-06-12  
**Maintainer:** Platform Architecture Team  
**Authority:** This document supersedes all conflicting technology choices
