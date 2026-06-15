# Pre-Code Gate Checklist

> **Rule:** Complete before writing any code. If any gate fails → **STOP**.  
> **Reference:** [PRE_CODE_GATE.md](./PRE_CODE_GATE.md)

---

## Task

| Field | Value |
|-------|-------|
| **Date** | YYYY-MM-DD |
| **Developer / Agent** | — |
| **Module** | — |
| **Feature / Task** | — |
| **Ticket** | — |

---

## Step 1 — Technology Constitution

| # | Check | Pass | STOP |
|---|-------|------|------|
| 1.1 | Read [TECHNOLOGY_CONSTITUTION.md](./TECHNOLOGY_CONSTITUTION.md) | [ ] | [ ] |
| 1.2 | Stack matches (Next.js, FastAPI, PostgreSQL, …) | [ ] | [ ] |
| 1.3 | [DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md) reviewed | [ ] | [ ] |

---

## Step 2 — Architecture

| # | Check | Pass | STOP |
|---|-------|------|------|
| 2.1 | [PROJECT_MAP.md](./PROJECT_MAP.md) reviewed | [ ] | [ ] |
| 2.2 | Module `Architecture.md` exists | [ ] | [ ] |
| 2.3 | Module `Architecture.md` status = **Ready** | [ ] | [ ] |
| 2.4 | [DependencyMap.md](./DependencyMap.md) updated if needed | [ ] | [ ] |
| 2.5 | No cross-module DB access planned | [ ] | [ ] |

---

## Step 3 — Database

| # | Check | Pass | STOP | N/A |
|---|-------|------|------|-----|
| 3.1 | [database/MASTER_DATABASE_ARCHITECTURE.md](./database/MASTER_DATABASE_ARCHITECTURE.md) reviewed | [ ] | [ ] | [ ] |
| 3.2 | Module `Database.md` exists | [ ] | [ ] | [ ] |
| 3.3 | All tables documented in `Database.md` | [ ] | [ ] | [ ] |
| 3.4 | [DATABASE_REGISTRY.md](./DATABASE_REGISTRY.md) updated | [ ] | [ ] | [ ] |
| 3.5 | Status = **Ready** (if tables touched) | [ ] | [ ] | [ ] |

---

## Step 4 — API

| # | Check | Pass | STOP | N/A |
|---|-------|------|------|-----|
| 4.1 | [api/README.md](./api/README.md) + [API_REGISTRY.md](./API_REGISTRY.md) reviewed | [ ] | [ ] | [ ] |
| 4.2 | Module `API.md` documents all endpoints | [ ] | [ ] | [ ] |
| 4.3 | Permissions per endpoint defined | [ ] | [ ] | [ ] |
| 4.4 | Status = **Ready** (if APIs touched) | [ ] | [ ] | [ ] |

---

## Step 5 — UI

| # | Check | Pass | STOP | N/A |
|---|-------|------|------|-----|
| 5.1 | [ENTERPRISE_UI_ARCHITECTURE.md](./ui-ux/ENTERPRISE_UI_ARCHITECTURE.md) reviewed | [ ] | [ ] | [ ] |
| 5.2 | Screen doc `Menus/{Screen}.md` exists per page | [ ] | [ ] | [ ] |
| 5.3 | Module `UI.md` updated | [ ] | [ ] | [ ] |
| 5.4 | Status = **Ready** (if UI touched) | [ ] | [ ] | [ ] |

---

## Step 6 — AI OS

| # | Check | Pass | STOP | N/A |
|---|-------|------|------|-----|
| 6.1 | [AI_KNOWLEDGE_INDEX.md](./AI_KNOWLEDGE_INDEX.md) reviewed | [ ] | [ ] | [ ] |
| 6.2 | [AI_OS_ARCHITECTURE.md](./modules/ai/AI_OS_ARCHITECTURE.md) reviewed | [ ] | [ ] | [ ] |
| 6.3 | Module `AI.md` documents tools (if AI feature) | [ ] | [ ] | [ ] |
| 6.4 | No direct DB access by AI | [ ] | [ ] | [ ] |

---

## Missing Documentation (if STOP)

| Missing Document | Action Taken | New Status |
|------------------|--------------|------------|
| — | — | Draft / Ready |

---

## Gate Result

| Result | Check |
|--------|-------|
| ☐ **APPROVED** — Proceed to code | All Pass, no STOP |
| ☐ **BLOCKED** — Do not code | One or more STOP |

---

## Sign-Off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Developer / Agent | — | — | [ ] |
| Architect / Tech Lead | — | — | [ ] |
