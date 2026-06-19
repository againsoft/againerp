# AgainERP — Architecture Decision Records (ADR) Index

> **Purpose:** Registry of all architecture decisions.  
> **Format:** [adr/ADR-TEMPLATE.md](../../01-architecture/decisions/ADR-TEMPLATE.md)

---

## Purpose
Documentation: ADR INDEX.

## When To Read
Read only if your task involves adr index.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## ADR Schema

| Field | Description |
|-------|-------------|
| ADR ID | `ADR-NNN` |
| Title | Decision title |
| Status | Proposed · Accepted · Deprecated · Superseded |
| Date | Decision date |
| Deciders | Who approved |
| Related | Links to docs/ADRs |

---

## Index

| ID | Title | Status | Date | Document |
|----|-------|--------|------|----------|
| ADR-001 | Use PostgreSQL as primary database | **Accepted** | 2026-06-12 | [adr/ADR-001-postgresql.md](../../01-architecture/decisions/ADR-001-postgresql.md) |
| ADR-002 | Use Laravel for backend framework | **Superseded** | 2026-06-12 | [adr/ADR-002-laravel.md](../../01-architecture/decisions/ADR-002-laravel.md) → ADR-012 |
| ADR-003 | Use Vue 3 for admin frontend | **Superseded** | 2026-06-12 | [adr/ADR-003-vue.md](../../01-architecture/decisions/ADR-003-vue.md) → ADR-011 |
| ADR-004 | AI OS as central intelligence layer | **Accepted** | 2026-06-12 | [adr/ADR-004-ai-os.md](../../01-architecture/decisions/ADR-004-ai-os.md) |
| ADR-005 | Multi-tenant shared database with row-level isolation | **Accepted** | 2026-06-12 | [adr/ADR-005-multi-tenant.md](../../01-architecture/decisions/ADR-005-multi-tenant.md) |
| ADR-006 | Event-driven cross-module integration | **Accepted** | 2026-06-12 | [adr/ADR-006-event-driven.md](../../01-architecture/decisions/ADR-006-event-driven.md) |
| ADR-007 | Documentation-first development | **Accepted** | 2026-06-12 | [adr/ADR-007-documentation-first.md](../../01-architecture/decisions/ADR-007-documentation-first.md) |
| ADR-008 | Unified contacts — no per-module customer tables | **Accepted** | 2026-06-12 | [adr/ADR-008-unified-contacts.md](../../01-architecture/decisions/ADR-008-unified-contacts.md) |
| ADR-009 | Universal module framework for industry verticals | **Accepted** | 2026-06-12 | [adr/ADR-009-universal-modules.md](../../01-architecture/decisions/ADR-009-universal-modules.md) |
| ADR-010 | No cross-module direct database access | **Accepted** | 2026-06-12 | [adr/ADR-010-no-cross-module-db.md](../../01-architecture/decisions/ADR-010-no-cross-module-db.md) |
| ADR-011 | Use Next.js and TypeScript for frontend | **Accepted** | 2026-06-12 | [adr/ADR-011-nextjs-typescript.md](../../01-architecture/decisions/ADR-011-nextjs-typescript.md) |
| ADR-012 | Use FastAPI and Python for backend | **Accepted** | 2026-06-12 | [adr/ADR-012-fastapi-python.md](../../01-architecture/decisions/ADR-012-fastapi-python.md) |
| ADR-013 | Hybrid licensed ERP architecture | **Accepted** | 2026-06-12 | [adr/ADR-013-hybrid-licensed-erp.md](../../01-architecture/decisions/ADR-013-hybrid-licensed-erp.md) |

**Canonical stack:** [TECHNOLOGY_CONSTITUTION.md](../TECHNOLOGY_CONSTITUTION.md)

---

## Creating New ADRs

1. Copy [adr/ADR-TEMPLATE.md](../../01-architecture/decisions/ADR-TEMPLATE.md)
2. Assign next ADR-NNN number
3. Add entry to this index
4. Link from related architecture docs
5. CHANGELOG entry

---

**Last Updated:** 2026-06-12 · **Maintainer:** Platform Architecture Team
