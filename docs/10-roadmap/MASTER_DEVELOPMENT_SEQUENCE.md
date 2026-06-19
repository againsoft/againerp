# AgainERP — Master Development Sequence

## Purpose
Documentation: MASTER DEVELOPMENT SEQUENCE.

## When To Read
Read only if your task involves master development sequence.

## Related Files
- [Cursor entry](../BRAIN.md)

## Read Next
- [Doc map](../PROJECT_MAP.md)

---

> **Status:** Active  
> **Version:** 1.1  
> **Rule:** No code in the next phase until the current phase is **documented** and **approved**.  
> **Governance:** [GOVERNANCE.md](../00-foundation/GOVERNANCE.md)


## When To Read
Read only if your task involves master development sequence.

## Related Files
- [Cursor entry](../BRAIN.md)

## Read Next
- [Doc map](../PROJECT_MAP.md)

---

This is the canonical **100-step development sequence** for AgainERP — from foundation to production launch.

---

## How to Use This Document

| Symbol | Meaning |
|--------|---------|
| ✅ | Documentation complete (may still need approval) |
| 🔄 | In progress |
| ⬜ | Not started |
| 🚫 | **Gate** — explicit approval required before next phase |

**Documentation-first:** Every step must have approved docs before implementation.  
**Approval:** Product Owner + Enterprise Architect sign-off per phase gate.

---

## Progress Summary

| Phase | Name | Steps | Doc Status | Gate |
|-------|------|-------|------------|------|
| 0 | Foundation | 1–8 | ✅ 8/8 | 🚫 Pending approval |
| 1 | Core Platform | 9–16 | ✅ 8/8 | 🚫 Pending approval |
| 2 | Database Layer | 17–23 | ✅ 7/7 | 🚫 Pending approval |
| 3 | UI System | 24–34 | ✅ 11/11 doc · 🔄 prototype | 🚫 Pending approval |
| 4 | Ecommerce Foundation | 35–45 | ✅ 11/11 arch | 🚫 Pending approval |
| 5 | ERP Foundation | 46–57 | ✅ 12/12 | 🚫 Pending approval |
| 6 | AI Layer | 58–65 | ✅ 8/8 | 🚫 Pending approval |
| 7 | Marketplace Layer | 66–72 | ✅ 7/7 | 🚫 Pending approval |
| 8 | Enterprise Layer | 73–80 | ✅ 8/8 | 🚫 Pending approval |
| 9 | DevOps | 81–89 | ✅ 9/9 | 🚫 Pending approval |
| 10 | Production | 90–100 | ✅ 11/11 | 🚫 Pending approval |

> **Note:** Screen-level docs (167 Ecommerce menus) remain templates — fill during implementation prep or Phase 4 gate review.

---

# Phase 0 — Foundation

> 🚫 **Approval Required Before Phase 1**

| # | Step | Status | Document / Location |
|---|------|--------|---------------------|
| 1 | Vision Document | ✅ | [architecture/project.md](../01-architecture/project.md) |
| 2 | Product Requirement Document (PRD) | ✅ | [PRD.md](../00-foundation/PRD.md) |
| 3 | Master Architecture | ✅ | [MASTER_MODULE_ARCHITECTURE.md](../01-architecture/MASTER_MODULE_ARCHITECTURE.md) |
| 4 | Module Architecture | ✅ | Per-module docs; Ecommerce submodules complete |
| 5 | Development Standards | ✅ | [DEVELOPMENT_STANDARDS.md](../00-foundation/standards/DEVELOPMENT_STANDARDS.md) |
| 6 | Documentation Standards | ✅ | [DOCUMENTATION_STANDARD.md](../00-foundation/standards/DOCUMENTATION_STANDARD.md) · [GOVERNANCE.md](../00-foundation/GOVERNANCE.md) |
| 7 | Folder Structure Standards | ✅ | [MODULE_STRUCTURE.md](../00-foundation/MODULE_STRUCTURE.md) |
| 8 | Naming Conventions | ✅ | [FILE_NAMING_STANDARD.md](../00-foundation/standards/FILE_NAMING_STANDARD.md) |

### Phase 0 Exit Criteria

- [x] PRD completed
- [ ] All Phase 0 documents marked **Ready**
- [ ] Stakeholder sign-off recorded in [CHANGELOG.md](../00-foundation/CHANGELOG.md)

---

# Phase 1 — Core Platform

> 🚫 **Approval Required Before Phase 2**

| # | Step | Status | Document / Location |
|---|------|--------|---------------------|
| 9 | Core Architecture | ✅ | [core/ARCHITECTURE.md](../02-core-platform/ARCHITECTURE.md) |

### Core Modules (within step 9)

| Module | Status | Doc |
|--------|--------|-----|
| Users | ✅ | [core/entities/users.md](../02-core-platform/entities/users.md) |
| Roles | ✅ | [core/entities/roles.md](../02-core-platform/entities/roles.md) |
| Permissions | [core/PERMISSION_SYSTEM_ARCHITECTURE.md](../02-core-platform/PERMISSION_SYSTEM_ARCHITECTURE.md) · [core/entities/permissions.md](../02-core-platform/entities/permissions.md) |
| Companies | ✅ | [core/entities/companies.md](../02-core-platform/entities/companies.md) |
| Branches | ✅ | [core/entities/branches.md](../02-core-platform/entities/branches.md) |
| Contacts | ✅ | [core/entities/contacts.md](../02-core-platform/entities/contacts.md) |
| Addresses | ✅ | [core/entities/addresses.md](../02-core-platform/entities/addresses.md) |
| Activities | ✅ | [core/entities/activities.md](../02-core-platform/entities/activities.md) |
| Notifications | [core/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md](../02-core-platform/engines/NOTIFICATION_ENGINE_ARCHITECTURE.md) · [core/entities/notifications.md](../02-core-platform/entities/notifications.md) |
| Comments | ✅ | [core/entities/comments.md](../02-core-platform/entities/comments.md) |
| Notes | ✅ | [core/entities/notes.md](../02-core-platform/entities/notes.md) |
| Attachments | ✅ | [core/entities/attachments.md](../02-core-platform/entities/attachments.md) |
| Audit Logs | ✅ | [database/audit-trail.md](../05-development/database/audit-trail.md) |
| Settings | ✅ | [core/entities/settings.md](../02-core-platform/entities/settings.md) |
| Localization | ✅ | [core/entities/localization.md](../02-core-platform/entities/localization.md) |

| # | Step | Status | Document / Location |
|---|------|--------|---------------------|
| 10 | Workflow Engine | ✅ | [core/engines/workflow-engine.md](../02-core-platform/engines/workflow-engine.md) |
| 11 | Approval Engine | ✅ | [core/engines/APPROVAL_ENGINE_ARCHITECTURE.md](../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) |
| 12 | Search Engine | ✅ | [core/engines/GLOBAL_SEARCH_ARCHITECTURE.md](../02-core-platform/engines/GLOBAL_SEARCH_ARCHITECTURE.md) |
| 13 | API Manager | ✅ | [core/API.md](../02-core-platform/API.md) · [api/architecture.md](../05-development/api/architecture.md) |
| 14 | Event System | ✅ | [core/engines/EVENT_ARCHITECTURE.md](../02-core-platform/engines/EVENT_ARCHITECTURE.md) |
| 15 | Queue Architecture | ✅ | [core/engines/queue-architecture.md](../02-core-platform/engines/queue-architecture.md) |
| 16 | Cache Architecture | ✅ | [core/engines/cache-architecture.md](../02-core-platform/engines/cache-architecture.md) |

### Phase 1 Exit Criteria

- [x] Each Core submodule has dedicated doc
- [x] `core/API.md` created
- [ ] `core/ModuleManifest.md` marked **Ready**
- [ ] Gate approval

---

# Phase 2 — Database Layer

> 🚫 **Approval Required Before Phase 3**

| # | Step | Status | Document / Location |
|---|------|--------|---------------------|
| 17 | Master Database Architecture | ✅ | [database/MASTER_DATABASE_ARCHITECTURE.md](../05-development/database/MASTER_DATABASE_ARCHITECTURE.md) |
| 18 | ER Diagram | ✅ | [database/ER_DIAGRAM.md](../05-development/database/ER_DIAGRAM.md) |
| 19 | Database Ownership Rules | ✅ | [MASTER_DATABASE_ARCHITECTURE.md](../05-development/database/MASTER_DATABASE_ARCHITECTURE.md) §20 |
| 20 | Multi Tenant Design | ✅ | [MASTER_DATABASE_ARCHITECTURE.md](../05-development/database/MASTER_DATABASE_ARCHITECTURE.md) §15 |
| 21 | Data Isolation Strategy | ✅ | [database/multi-company.md](../05-development/database/multi-company.md) |
| 22 | Audit Strategy | ✅ | [MASTER_DATABASE_ARCHITECTURE.md](../05-development/database/MASTER_DATABASE_ARCHITECTURE.md) §13 |
| 23 | Analytics Database Strategy | ✅ | [MASTER_DATABASE_ARCHITECTURE.md](../05-development/database/MASTER_DATABASE_ARCHITECTURE.md) §12 |

### Phase 2 Exit Criteria

- [x] `docs/database/MASTER_DATABASE_ARCHITECTURE.md`
- [x] Platform-wide ER diagram
- [ ] Gate approval

---

# Phase 3 — UI System

> 🚫 **Approval Required Before Phase 4**

| # | Step | Status | Document / Location |
|---|------|--------|---------------------|
| 24 | Design System | ✅ | [ui-ux/ENTERPRISE_UI_ARCHITECTURE.md](../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md) · [design-system.md](../04-uiux/standards/design-system.md) |
| 25 | UI Components | ✅ | [ui-ux/components.md](../04-uiux/standards/components.md) |
| 26 | Table System | ✅ | [ui-ux/tables.md](../04-uiux/standards/tables.md) |
| 27 | Form System | ✅ | [ui-ux/forms.md](../04-uiux/standards/forms.md) |
| 28 | Filter System | ✅ | [ui-ux/filters.md](../04-uiux/standards/filters.md) |
| 29 | Global Search UI | ✅ | [ui-ux/global-search.md](../04-uiux/standards/global-search.md) |
| 30 | Sidebar Architecture | ✅ | [ui-ux/navigation.md](../04-uiux/standards/navigation.md) |
| 31 | Mobile Layout | ✅ | [ui-ux/mobile-first.md](../04-uiux/standards/mobile-first.md) |
| 32 | Dashboard Layout | ✅ | [dashboard/ARCHITECTURE.md](../03-business-modules/ecommerce/dashboard/ARCHITECTURE.md) § UI |
| 33 | Theme System | ✅ | [ui-ux/theme-system.md](../04-uiux/standards/theme-system.md) |
| 34 | Dark Mode | ✅ | [ui-ux/dark-mode.md](../04-uiux/standards/dark-mode.md) |

### Phase 3 Exit Criteria

- [x] Complete `docs/ui-ux/` design system package
- [x] [UI_PROTOTYPE_STRATEGY.md](../04-uiux/strategy/UI_PROTOTYPE_STRATEGY.md) + `ui-prototype/` page docs
- [ ] UI prototype screens built & approved (Phase 1)
- [ ] Gate approval

---

# Phase 4 — Ecommerce Foundation

> 🚫 **Approval Required Before Phase 5**

| # | Step | Status | Document / Location |
|---|------|--------|---------------------|
| 35 | Dashboard | ✅ | [dashboard/ARCHITECTURE.md](../03-business-modules/ecommerce/dashboard/ARCHITECTURE.md) |
| 36 | Catalog | ✅ | [catalog/ARCHITECTURE.md](../03-business-modules/ecommerce/catalog/ARCHITECTURE.md) |
| 37 | Media | ✅ | [media/ARCHITECTURE.md](../03-business-modules/ecommerce/media/ARCHITECTURE.md) |
| 38 | SEO | ✅ | [seo/ARCHITECTURE.md](../03-business-modules/ecommerce/seo/ARCHITECTURE.md) |
| 39 | Customers | ✅ | [customers/ARCHITECTURE.md](../03-business-modules/ecommerce/customers/ARCHITECTURE.md) |
| 40 | Orders | ✅ | [orders/ARCHITECTURE.md](../03-business-modules/ecommerce/orders/ARCHITECTURE.md) |
| 41 | Inventory | ✅ | [inventory/ARCHITECTURE.md](../03-business-modules/ecommerce/inventory/ARCHITECTURE.md) |
| 42 | Marketing | ✅ | [marketing/MARKETING_MODULE_ARCHITECTURE.md](../03-business-modules/marketing/MARKETING_MODULE_ARCHITECTURE.md) |
| 43 | Reports | ✅ | [reports/ARCHITECTURE.md](../03-business-modules/ecommerce/reports/ARCHITECTURE.md) |
| 44 | Builder | ✅ | [builder/ARCHITECTURE.md](../03-business-modules/ecommerce/builder/ARCHITECTURE.md) |
| 45 | Analytics | ✅ | [analytics/ARCHITECTURE.md](../03-business-modules/ecommerce/analytics/ARCHITECTURE.md) |

**Ecommerce shell:** [modules/ecommerce/MENU_STRUCTURE.md](../03-business-modules/ecommerce/MENU_STRUCTURE.md) (167 screens · templates)

### Phase 4 Exit Criteria

- [x] Architecture doc for each Ecommerce submodule (35–45)
- [ ] All screen docs filled (not just templates) for Phase 4 scope
- [ ] `modules/ecommerce/ModuleManifest.md` → **Ready**
- [ ] Gate approval → **implementation may begin**

---

# Phase 5 — ERP Foundation

> 🚫 **Approval Required Before Phase 6**

| # | Step | Status | Document / Location |
|---|------|--------|---------------------|
| 46 | CRM | ✅ | [modules/crm/Architecture.md](../03-business-modules/crm/Architecture.md) |
| 47 | Sales | ✅ | [modules/sales/Architecture.md](../03-business-modules/sales/Architecture.md) |
| 48 | Purchase | ✅ | [modules/purchase/Architecture.md](../03-business-modules/purchase/Architecture.md) |
| 49 | Finance / Accounting | ✅ | [finance/FINANCE_MODULE_ARCHITECTURE.md](../03-business-modules/finance/FINANCE_MODULE_ARCHITECTURE.md) |
| 50 | POS | ✅ | [modules/pos/Architecture.md](../03-business-modules/pos/Architecture.md) |
| 51 | HR | ✅ | [modules/hr/Architecture.md](../03-business-modules/hr/Architecture.md) |
| 52 | Payroll | ✅ | [modules/payroll/Architecture.md](../03-business-modules/payroll/Architecture.md) |
| 53 | Helpdesk | ✅ | [modules/helpdesk/Architecture.md](../03-business-modules/helpdesk/Architecture.md) |
| 54 | Documents | ✅ | [modules/documents/Architecture.md](../03-business-modules/documents/Architecture.md) |
| 55 | Knowledge | ✅ | [modules/knowledge/Architecture.md](../03-business-modules/knowledge/Architecture.md) |
| 56 | Project | ✅ | [modules/project/Architecture.md](../03-business-modules/project/Architecture.md) |
| 57 | Timesheet | ✅ | [modules/timesheet/Architecture.md](../03-business-modules/timesheet/Architecture.md) |

---

# Phase 6 — AI Layer

> 🚫 **Approval Required Before Phase 7**

| # | Step | Status | Document / Location |
|---|------|--------|---------------------|
| 58 | AI OS Architecture | ✅ | [modules/ai/AI_OS_ARCHITECTURE.md](../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) · [AI_FIRST_ARCHITECTURE.md](../06-ai/platform/ai/AI_FIRST_ARCHITECTURE.md) |
| 59 | AI Assistant | ✅ | [modules/ai/ARCHITECTURE.md](../06-ai/platform/ai/ARCHITECTURE.md) § Assistant |
| 60 | AI Product Generator | ✅ | Catalog ARCH · AI ARCH |
| 61 | AI SEO | ✅ | [modules/ai/ARCHITECTURE.md](../06-ai/platform/ai/ARCHITECTURE.md) § SEO |
| 62 | AI Analytics | ✅ | [modules/ai/ARCHITECTURE.md](../06-ai/platform/ai/ARCHITECTURE.md) § Analytics |
| 63 | AI Forecasting | ✅ | [modules/ai/ARCHITECTURE.md](../06-ai/platform/ai/ARCHITECTURE.md) § Forecasting |
| 64 | AI Automation | ✅ | [modules/ai/ARCHITECTURE.md](../06-ai/platform/ai/ARCHITECTURE.md) § Automation |
| 65 | AI Search | ✅ | [modules/ai/ARCHITECTURE.md](../06-ai/platform/ai/ARCHITECTURE.md) § Search |

---

# Phase 7 — Marketplace Layer

> 🚫 **Approval Required Before Phase 8**

| # | Step | Status | Document / Location |
|---|------|--------|---------------------|
| 66 | Vendor Management | ✅ | [modules/marketplace/ARCHITECTURE.md](../03-business-modules/marketplace/ARCHITECTURE.md) |
| 67 | Marketplace | ✅ | [modules/marketplace/ARCHITECTURE.md](../03-business-modules/marketplace/ARCHITECTURE.md) |
| 68 | Franchise | ✅ | [modules/marketplace/ARCHITECTURE.md](../03-business-modules/marketplace/ARCHITECTURE.md) |
| 69 | Multi Store | ✅ | [modules/marketplace/ARCHITECTURE.md](../03-business-modules/marketplace/ARCHITECTURE.md) |
| 70 | Dropshipping | ✅ | [modules/marketplace/ARCHITECTURE.md](../03-business-modules/marketplace/ARCHITECTURE.md) |
| 71 | Supplier Feed | ✅ | [modules/marketplace/ARCHITECTURE.md](../03-business-modules/marketplace/ARCHITECTURE.md) |
| 72 | Channel Management | ✅ | [modules/marketplace/ARCHITECTURE.md](../03-business-modules/marketplace/ARCHITECTURE.md) |

---

# Phase 8 — Enterprise Layer

> 🚫 **Approval Required Before Phase 9**

| # | Step | Status | Document / Location |
|---|------|--------|---------------------|
| 73 | Subscription | ✅ | [SAAS_PLATFORM_ARCHITECTURE.md](../01-architecture/SAAS_PLATFORM_ARCHITECTURE.md) · [modules/subscription/ARCHITECTURE.md](../03-business-modules/subscription/ARCHITECTURE.md) |
| 74 | Manufacturing | ✅ | [modules/manufacturing/ARCHITECTURE.md](../03-business-modules/manufacturing/ARCHITECTURE.md) |
| 75 | Fleet | ✅ | [modules/fleet/ARCHITECTURE.md](../03-business-modules/fleet/ARCHITECTURE.md) |
| 76 | Logistics | ✅ | [modules/logistics/ARCHITECTURE.md](../03-business-modules/logistics/ARCHITECTURE.md) |
| 77 | Booking | ✅ | [modules/booking/ARCHITECTURE.md](../03-business-modules/booking/ARCHITECTURE.md) |
| 78 | ERP Analytics | ✅ | [modules/bi-system/ARCHITECTURE.md](../03-business-modules/bi-system/ARCHITECTURE.md) |
| 79 | Data Warehouse | ✅ | [modules/data-warehouse/ARCHITECTURE.md](../03-business-modules/data-warehouse/ARCHITECTURE.md) |
| 80 | BI System | ✅ | [modules/bi-system/ARCHITECTURE.md](../03-business-modules/bi-system/ARCHITECTURE.md) |

---

# Phase 9 — DevOps

> 🚫 **Approval Required Before Production (Phase 10)**

| # | Step | Status | Document / Location |
|---|------|--------|---------------------|
| 81 | cPanel Deployment | ✅ | [deployment/cpanel.md](../05-development/deployment/cpanel.md) |
| 82 | VPS Deployment | ✅ | [deployment/vps.md](../05-development/deployment/vps.md) |
| 83 | Docker Architecture | ✅ | [deployment/docker.md](../05-development/deployment/docker.md) |
| 84 | CI/CD | ✅ | [deployment/cicd.md](../05-development/deployment/cicd.md) |
| 85 | Kubernetes | ✅ | [deployment/kubernetes.md](../05-development/deployment/kubernetes.md) |
| 86 | Monitoring | ✅ | [deployment/monitoring.md](../05-development/deployment/monitoring.md) |
| 87 | Disaster Recovery | ✅ | [deployment/disaster-recovery.md](../05-development/deployment/disaster-recovery.md) |
| 88 | Backup Strategy | ✅ | [deployment/backup-strategy.md](../05-development/deployment/backup-strategy.md) |
| 89 | Security Hardening | ✅ | [deployment/security-hardening.md](../05-development/deployment/security-hardening.md) |

---

# Phase 10 — Production

> 🚫 **Approval Required Before Launch**

| # | Step | Status | Document / Location |
|---|------|--------|---------------------|
| 90 | Testing Strategy | ✅ | [qa/testing-strategy.md](../05-development/qa/testing-strategy.md) |
| 91 | QA Standards | ✅ | [qa/qa-standards.md](../05-development/qa/qa-standards.md) |
| 92 | Load Testing | ✅ | [qa/load-testing.md](../05-development/qa/load-testing.md) |
| 93 | Security Testing | ✅ | [qa/security-testing.md](../05-development/qa/security-testing.md) |
| 94 | User Acceptance Testing | ✅ | [qa/uat.md](../05-development/qa/uat.md) |
| 95 | Release Management | ✅ | [qa/release-management.md](../05-development/qa/release-management.md) |
| 96 | Production Deployment | ✅ | [qa/production-deployment.md](../05-development/qa/production-deployment.md) |
| 97 | Monitoring | ✅ | [deployment/monitoring.md](../05-development/deployment/monitoring.md) |
| 98 | Optimization | ✅ | [qa/optimization.md](../05-development/qa/optimization.md) |
| 99 | Documentation Review | ✅ | [qa/documentation-review.md](../05-development/qa/documentation-review.md) |
| 100 | Launch | ✅ | [qa/launch-checklist.md](../05-development/qa/launch-checklist.md) |

---

# Development Workflow (All Phases)

```
Document → Review → Approve (Gate) → Implement → Test → Changelog
```

Per [GOVERNANCE.md](../00-foundation/GOVERNANCE.md):

1. Update documentation for the step
2. Complete [_COMMIT_CHECKLIST.md](../00-foundation/templates/_COMMIT_CHECKLIST.md)
3. Mark docs **Ready**
4. Phase gate approval
5. Only then: generate dev tasks and write code

---

# Current Priority Queue

| Priority | Action |
|----------|--------|
| 1 | Phase 0–10 **gate approvals** (stakeholder sign-off) |
| 2 | Mark Core + Ecommerce `ModuleManifest.md` → **Ready** |
| 3 | Fill 167 Ecommerce screen docs (templates → full specs) |
| 4 | Phase 4 gate → **begin Ecommerce implementation** |

---

# Related Documents

| Document | Purpose |
|----------|---------|
| [PRD.md](../00-foundation/PRD.md) | Product requirements |
| [MASTER_MODULE_ARCHITECTURE.md](../01-architecture/MASTER_MODULE_ARCHITECTURE.md) | Platform blueprint |
| [GOVERNANCE.md](../00-foundation/GOVERNANCE.md) | Doc-first rules |
| [MODULE_DEPENDENCY_MAP.md](../01-architecture/MODULE_DEPENDENCY_MAP.md) | Module dependencies |
| [roadmap/modules.md](plans/modules.md) | High-level module roadmap |
| [CHANGELOG.md](../00-foundation/CHANGELOG.md) | Change history |

---

**Platform:** AgainERP  
**Last Updated:** 2026-06-12  
**Maintainer:** Platform Team
