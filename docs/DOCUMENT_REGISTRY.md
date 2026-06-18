# AgainERP — Document Registry

> **Purpose:** Master registry of all documentation assets.  
> **Rule:** No document may exist without registration.  
> **Full listing:** [_registries/DOCUMENT_REGISTRY_FULL.md](./_registries/DOCUMENT_REGISTRY_FULL.md) (560 documents)

**Regenerate:** `python3 docs/scripts/generate-governance-registries.py`

---

## Registry Rules

Every new document must include:

| Field | Required |
|-------|----------|
| Document ID | `DOC-{PATH-SLUG}` |
| Name | File name |
| Location | Path under `docs/` |
| Module | Owner module or `platform` |
| Version | Semver or doc version |
| Status | Draft · Ready · Deprecated |
| Owner | Team or role |
| Last Updated | ISO date |
| Related Documents | Cross-links |
| Changelog entry | [CHANGELOG.md](./CHANGELOG.md) |

---

## Summary (2026-06-12)

| Metric | Count |
|--------|-------|
| **Total documents** | 560 |
| **Governance files** | 14 |
| **ADR files** | 11 |
| **Ecommerce module** | 200 |
| **UI prototype** | 148 |
| **UI/UX** | 40 |
| **Core** | 29 |
| **Platform** | 24 |
| **QA** | 11 |
| **Deployment** | 10 |
| **AI module** | 9 |
| **Database** | 7 |
| **Framework** | 6 |

---

## Documents by Category

### Governance (System-Critical)

| ID | Document | Status | Owner |
|----|----------|--------|-------|
| DOC-README | [README.md](./README.md) | Active | Platform |
| DOC-TECHNOLOGY-CONSTITUTION | [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md) | **Official** | Platform |
| DOC-PRE-CODE-GATE | [PRE_CODE_GATE.md](./PRE_CODE_GATE.md) | **Mandatory** | Platform |
| DOC-UI-PROTOTYPE-MODE | [UI_PROTOTYPE_MODE.md](./UI_PROTOTYPE_MODE.md) | **Active** | Platform |
| DOC-MASTER-INDEX | [MASTER_INDEX.md](./MASTER_INDEX.md) | Active | Platform |
| DOC-PROJECT-MAP | [PROJECT_MAP.md](./PROJECT_MAP.md) | Active | Platform |
| DOC-DOCUMENT-REGISTRY | [DOCUMENT_REGISTRY.md](./DOCUMENT_REGISTRY.md) | Active | Platform |
| DOC-MODULE-REGISTRY | [MODULE_REGISTRY.md](./MODULE_REGISTRY.md) | Active | Platform |
| DOC-PAGE-REGISTRY | [PAGE_REGISTRY.md](./PAGE_REGISTRY.md) | Active | Platform |
| DOC-DATABASE-REGISTRY | [DATABASE_REGISTRY.md](./DATABASE_REGISTRY.md) | Active | Platform |
| DOC-API-REGISTRY | [API_REGISTRY.md](./API_REGISTRY.md) | Active | Platform |
| DOC-WORKFLOW-REGISTRY | [WORKFLOW_REGISTRY.md](./WORKFLOW_REGISTRY.md) | Active | Platform |
| DOC-AI-KNOWLEDGE-INDEX | [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md) | Active | Platform |
| DOC-CHANGELOG | [CHANGELOG.md](./CHANGELOG.md) | Active | Platform |
| DOC-ADR-INDEX | [ADR_INDEX.md](./ADR_INDEX.md) | Active | Platform |
| DOC-TRACEABILITY-MATRIX | [TRACEABILITY_MATRIX.md](./TRACEABILITY_MATRIX.md) | Active | Platform |
| DOC-DOCUMENTATION-HEALTH-REPORT | [DOCUMENTATION_HEALTH_REPORT.md](./DOCUMENTATION_HEALTH_REPORT.md) | Active | Platform |

### Platform Architecture

| ID | Document | Module | Status |
|----|----------|--------|--------|
| DOC-PRD | [PRD.md](./PRD.md) | platform | Draft |
| DOC-MASTER-MODULE-ARCHITECTURE | [MASTER_MODULE_ARCHITECTURE.md](./MASTER_MODULE_ARCHITECTURE.md) | platform | Draft |
| DOC-UNIVERSAL-MODULE-FRAMEWORK | [UNIVERSAL_MODULE_FRAMEWORK.md](./UNIVERSAL_MODULE_FRAMEWORK.md) | platform | Draft |
| DOC-SAAS-PLATFORM-ARCHITECTURE | [SAAS_PLATFORM_ARCHITECTURE.md](./SAAS_PLATFORM_ARCHITECTURE.md) | platform | Draft |
| DOC-GOVERNANCE | [GOVERNANCE.md](./GOVERNANCE.md) | platform | Active |
| DOC-DEVELOPMENT-STANDARDS | [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) | platform | Active |

### Core

| ID | Document | Status |
|----|----------|--------|
| DOC-CORE-ARCHITECTURE | [core/ARCHITECTURE.md](./core/ARCHITECTURE.md) | Draft |
| DOC-CORE-API | [core/API.md](./core/API.md) | Draft |
| DOC-CORE-ENGINES | [core/engines/README.md](./core/engines/README.md) | Draft |
| DOC-CORE-ENTITIES | [core/entities/README.md](./core/entities/README.md) | Draft |

### Database

| ID | Document | Status |
|----|----------|--------|
| DOC-DB-MASTER | [database/MASTER_DATABASE_ARCHITECTURE.md](./database/MASTER_DATABASE_ARCHITECTURE.md) | Draft |
| DOC-DB-ER | [database/ER_DIAGRAM.md](./database/ER_DIAGRAM.md) | Draft |

### Governance

| ID | Document | Status |
|----|----------|--------|
| DOC-PROJECT-BRAIN | [PROJECT_BRAIN.md](./PROJECT_BRAIN.md) | Active |

### AI

| ID | Document | Status |
|----|----------|--------|
| DOC-AI-OS-INDEX | [ai_os/README.md](./ai_os/README.md) | Vision |
| DOC-AI-OS-VISION | [ai_os/01_AI_COMMERCE_OS_VISION.md](./ai_os/01_AI_COMMERCE_OS_VISION.md) | Vision |
| DOC-AI-OS-UX | [ai_os/02_AI_USER_EXPERIENCE.md](./ai_os/02_AI_USER_EXPERIENCE.md) | Vision |
| DOC-AI-OS-ADMIN | [ai_os/03_AI_ADMIN_EXPERIENCE.md](./ai_os/03_AI_ADMIN_EXPERIENCE.md) | Vision |
| DOC-AI-OS-STOREFRONT | [ai_os/04_AI_STOREFRONT_EXPERIENCE.md](./ai_os/04_AI_STOREFRONT_EXPERIENCE.md) | Vision |
| DOC-AI-OS | [modules/ai/AI_OS_ARCHITECTURE.md](./modules/ai/AI_OS_ARCHITECTURE.md) | Draft |
| DOC-AI-FIRST | [modules/ai/AI_FIRST_ARCHITECTURE.md](./modules/ai/AI_FIRST_ARCHITECTURE.md) | Draft |

### Ecommerce (Active)

| ID | Document | Status |
|----|----------|--------|
| DOC-ECOMMERCE-ARCH | [modules/ecommerce/Architecture.md](./modules/ecommerce/Architecture.md) | Draft |
| DOC-ECOMMERCE-MANIFEST | [modules/ecommerce/ModuleManifest.md](./modules/ecommerce/ModuleManifest.md) | Draft |
| DOC-ECOMMERCE-MENU | [modules/ecommerce/MENU_STRUCTURE.md](./modules/ecommerce/MENU_STRUCTURE.md) | Draft |
| DOC-ECOMMERCE-MENUS | 167 × `Menus/**/*.md` | Draft |

---

## Machine-Readable Export

| File | Format | Purpose |
|------|--------|---------|
| [_registries/documents.json](./_registries/documents.json) | JSON | Tooling, AI ingestion |
| [_registries/stats.json](./_registries/stats.json) | JSON | Health metrics |
| [_registries/DOCUMENT_REGISTRY_FULL.md](./_registries/DOCUMENT_REGISTRY_FULL.md) | Markdown | Complete table |

---

## Registration Workflow

```
1. Create document under docs/
2. Run generate-governance-registries.py
3. Add entry to MASTER_INDEX.md (if new category)
4. Update TRACEABILITY_MATRIX.md (if feature-related)
5. CHANGELOG.md entry
6. DOCUMENTATION_HEALTH_REPORT.md refresh
```

---

**Last Updated:** 2026-06-12 · **Maintainer:** Platform Architecture Team
