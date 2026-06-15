# Production Readiness Gate

> **Parent:** [UI_PROTOTYPE_STRATEGY.md](../UI_PROTOTYPE_STRATEGY.md)

---

## Rule

**No production code until all gates approved.**

---

## Gate Checklist

| # | Gate | Document / Criteria | Status |
|---|------|---------------------|--------|
| 1 | **UI Prototype** | All `ui-prototype/**` pages marked **Ready**; clickable demo | ⬜ |
| 2 | **Documentation** | GOVERNANCE sign-off; no Draft blockers | ⬜ |
| 3 | **Workflow** | Module `Workflow.md` approved | ⬜ |
| 4 | **Architecture** | Module `ARCHITECTURE.md` approved | ⬜ |
| 5 | **Database** | `MASTER_DATABASE_ARCHITECTURE.md` approved | ⬜ |
| 6 | **API** | Module `API.md` + `api/architecture.md` | ⬜ |
| 7 | **AI** | `AI_OS_ARCHITECTURE.md` + credit/approval rules | ⬜ |

---

## Per-Module Readiness (Ecommerce)

| Submodule | Arch | Prototype Pages | Workflow |
|-----------|------|-----------------|----------|
| Dashboard | ✅ | 🔄 | ⬜ |
| Catalog | ✅ | 🔄 | ⬜ |
| Orders | ✅ | 🔄 | ⬜ |
| Inventory | ✅ | 🔄 | ⬜ |
| Customers | ✅ | 🔄 | ⬜ |
| Marketing | ✅ | 🔄 | ⬜ |
| Media | ✅ | 🔄 | ⬜ |
| SEO | ✅ | 🔄 | ⬜ |
| Builder | ✅ | 🔄 | ⬜ |
| Reports | ✅ | 🔄 | ⬜ |
| System | ✅ | 🔄 | ⬜ |
| AI OS | ✅ | 🔄 | ⬜ |
| Platform | ✅ | 🔄 | ⬜ |

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| UX Lead | | | |
| Enterprise Architect | | | |

---

## After Approval

1. Generate implementation tasks from Ready docs
2. Replace mock APIs with real endpoints
3. Replace fixtures with database seeders
4. Enable business logic per `DEVELOPMENT_STANDARDS.md`
