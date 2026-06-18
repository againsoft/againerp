# AI Module

> **Status:** Draft  
> **Phase:** 6 — AI Layer  
> **Vision:** AI OS is the **operating layer** of AgainERP — not a chatbot

---

## Master Documents

| Document | Purpose |
|----------|---------|
| [**ai_os/README.md**](../../ai_os/README.md) | **Experience entry** — vision, admin, storefront, cross-cutting UX |
| [**AI_OS_ARCHITECTURE.md**](./AI_OS_ARCHITECTURE.md) | **Canonical AI OS** — 14 engines, Chief Agent, tools, agents, twin |
| [AI_FIRST_ARCHITECTURE.md](./AI_FIRST_ARCHITECTURE.md) | AI-first platform principles |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Services, schema, forecasting, search |
| [AI_OS.md](./AI_OS.md) | Engine index |
| [AI_CONTEXT_ENGINE.md](./AI_CONTEXT_ENGINE.md) | Context assembly |
| [AI_AUDIT_AND_APPROVAL.md](./AI_AUDIT_AND_APPROVAL.md) | Audit + approval center |
| [AI_DIGITAL_TWIN.md](./AI_DIGITAL_TWIN.md) | Live ERP model |
| [AI_SCALING_ROADMAP.md](./AI_SCALING_ROADMAP.md) | Phases 1–7 scaling |

---

## Architecture Stack

```
User
  ↓
Chief AI Agent
  ↓
Permission Engine → Security Engine
  ↓
Agent Orchestrator → Domain Agents
  ↓
Tool Engine (permissions · validation · audit · approval)
  ↓
Module APIs → Database
```

**Never direct database access.**

---

## AI OS Engines

Chief Agent · Context · Knowledge · Memory · Agent Orchestrator · Tool · Workflow · Automation · Reasoning · Learning · Security · Code Intelligence · Documentation · Monitoring

---

## Scaling Phases

1. AI Assistant → 2. Copilot → 3. Automation → 4. Multi-Agent → 5. Developer Agent → 6. Self-Optimizing → 7. Digital Twin

---

## UI

[ai-assistant-ui.md](../../ui-ux/ai-assistant-ui.md) · Ecommerce `Menus/AI/`

---

**Module:** AI  
**Last Updated:** 2026-06-12
