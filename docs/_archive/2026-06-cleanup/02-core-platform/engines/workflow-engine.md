# Workflow Engine Architecture

> **Status:** Superseded  
> **Owner:** Core Platform  
> **Parent:** [core/ARCHITECTURE.md](../ARCHITECTURE.md)

> **Use instead:** [WORKFLOW_ENGINE_ARCHITECTURE.md](./WORKFLOW_ENGINE_ARCHITECTURE.md) — approved enterprise platform workflow engine (Step 09).

---

## Purpose
Core engine specification: workflow engine.

## When To Read
Read only when working on the workflow engine engine or its consumers.

## Related Files
- [Core hub](../ARCHITECTURE.md)
- [Engines index](README.md)

## Read Next
- [Core hub](../ARCHITECTURE.md)

---

## Purpose

Configurable **state machines** for any business record. Modules register workflows; Core executes transitions, validates guards, and fires events.

See [WORKFLOW_ENGINE_ARCHITECTURE.md](./WORKFLOW_ENGINE_ARCHITECTURE.md) for full specification.
