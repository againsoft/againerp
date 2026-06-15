# AI OS Scaling Roadmap

> **Status:** Draft  
> **Parent:** [AI_OS_ARCHITECTURE.md](./AI_OS_ARCHITECTURE.md)

---

## Principle

AI OS **same kernel** across all phases — expand agents, tools, and feature flags. **No redesign.**

---

## Phase 1 — AI Assistant

| Capability | Ships |
|------------|-------|
| Chat interface | `Ctrl+I`, FAB, sidebar |
| Generate / summarize / translate | Draft fields |
| Product & SEO generation | Ecommerce AI menus |
| Read-only analytics queries | Dashboard insights |
| Audit logs | Every interaction |

**Engines active:** Context, Tool Engine (low-risk), Audit, Security

**Flag:** `ai.phase1.enabled` (default on)

---

## Phase 2 — AI Copilot

| Capability | Ships |
|------------|-------|
| Inline field suggestions | Ghost text in forms |
| Record-aware actions | Toolbar per field |
| Command palette AI | `Ctrl+K` actions |
| Saved prompt templates | Per role |

**Engines added:** Memory (preferences), Reasoning (explain blocks)

**Flag:** `ai.phase2.copilot`

---

## Phase 3 — AI Automation

| Capability | Ships |
|------------|-------|
| Event-driven rules | Product published → SEO draft |
| Scheduled jobs | Weekly reports, re-embed |
| Auto translation | On product create |
| Inventory alert AI | Low stock narratives |

**Engines added:** Automation Engine

**Flag:** `ai.phase3.automation`

---

## Phase 4 — Multi-Agent System

| Capability | Ships |
|------------|-------|
| Chief AI Agent | Goal decomposition |
| Agent Orchestrator | 15 domain agents |
| Parallel agent tasks | Campaign + catalog + SEO |
| Agent plan preview | User approves plan before execution |

**Engines added:** Agent Orchestrator, full Tool registry

**Flag:** `ai.phase4.multi_agent`

---

## Phase 5 — Developer Agent

| Capability | Ships |
|------------|-------|
| Code Intelligence Engine | Repo index |
| Architecture Q&A | For developers |
| Propose controllers, services, tests | PR suggestions only |
| Migration plan drafts | From schema diff |

**Engines added:** Code Intelligence, Documentation Engine (active sync)

**Flag:** `ai.phase5.developer`

---

## Phase 6 — Self-Optimizing ERP

| Capability | Ships |
|------------|-------|
| Learning Engine | Company patterns |
| Workflow suggestions | "You often do X after Y" |
| Report recommendations | Personalized dashboard |
| Policy learning | Admin-reviewed rules |

**Engines added:** Learning Engine (full)

**Flag:** `ai.phase6.learning`

---

## Phase 7 — ERP Digital Twin

| Capability | Ships |
|------------|-------|
| Live twin model | Modules, tables, APIs, deps |
| Simulation queries | "Impact of price change on margin" |
| Twin explorer | Admin UI |
| AI as operating layer | Natural language ERP operation |

**Engines added:** Digital Twin (full sync)

**Flag:** `ai.phase7.digital_twin`

---

## Infrastructure Scaling

| Phase | Infra |
|-------|-------|
| 1–2 | Single LLM provider, Redis queue |
| 3–4 | Multi-provider router, dedicated `ai` workers |
| 5–7 | pgvector HNSW, twin builder jobs, optional GPU embed |

Token budgets scale per company plan (Subscription module).

---

## Exit Criteria Per Phase

- [ ] Feature flag tested in staging
- [ ] Audit coverage 100% for new tools
- [ ] Approval rules defined for new write tools
- [ ] Documentation updated in CHANGELOG
- [ ] Gate approval before production enable
