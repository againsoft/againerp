# Workflow — {Module}

> **Status:** Draft  
> **Module:** {Module}  
> **Document Type:** Workflow (Level 5 SSOT)

---

## Purpose

Define **{Module}** business workflows, state machines, approvals, and domain events. This file is the **Workflow SSOT** — Architecture §3 and §6 summarize and link here.

## When To Read

Read only for state transitions, approval gates, or event-driven behavior. Do not open [WORKFLOW_REGISTRY.md](../../00-foundation/registries/WORKFLOW_REGISTRY.md) unless explicitly requested.

## Related Files

- [Architecture.md](Architecture.md) — §3 Features · §6 Events
- [Permissions.md](Permissions.md) — who can trigger transitions
- [API.md](API.md) — endpoints that advance state
- [EVENT_ARCHITECTURE.md](../../02-core-platform/engines/EVENT_ARCHITECTURE.md)

## Read Next

- One workflow section below — stop here

---

## Workflow Index

| Workflow | Entity | States | Approval |
|----------|--------|--------|----------|
| Example lifecycle | `{prefix}_example` | draft → active → archived | optional |

---

## Example Lifecycle

### States

| State | Description | Editable |
|-------|-------------|----------|
| `draft` | Initial | yes |
| `active` | Published | limited |
| `archived` | Retired | no |

### Transitions

| From | To | Trigger | Permission | Event |
|------|-----|---------|------------|-------|
| `draft` | `active` | Submit | `{module}.example.manage` | `{module}.example.activated` |
| `active` | `archived` | Archive | `{module}.example.manage` | `{module}.example.archived` |

### Diagram

```text
draft ──submit──▶ active ──archive──▶ archived
  │                  │
  └──── delete ──────┘ (draft only)
```

### Approval Integration

| Transition | Approval rule | Engine |
|------------|---------------|--------|
| _high-value action_ | Manager approval | [APPROVAL_ENGINE](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md) |

---

## Published Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `{module}.example.created` | After create COMMIT | `id`, `company_id`, `status` |
| `{module}.example.activated` | State → active | `id`, `company_id` |

---

## Subscribed Events

| Event | Source | Handler |
|-------|--------|---------|
| `core.approval.approved` | Core | Resume pending transition |

---

## Rules

- Publish events **after** database COMMIT
- No synchronous chains of 5+ cross-module service calls
- Idempotent handlers for retried events

---

**Module:** {Module} · **Last Updated:** {DATE} · **Maintainer:** {team}
