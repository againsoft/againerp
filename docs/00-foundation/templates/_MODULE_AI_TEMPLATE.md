# AI — {Module}

> **Status:** Draft  
> **Module:** {Module}  
> **Document Type:** AI index (Level 5 SSOT)  
> **Namespace:** `{module}.ai.*`

---

## Purpose

Index of **{Module}** AI tools — links to screen specs and platform AI rules. **No duplicate tool definitions**; open **one** linked doc for your task.

## When To Read

Read when implementing or documenting a {Module} admin AI screen, agent tool, or AI-assisted workflow.

## Related Files

- [Architecture.md](Architecture.md) — §9 AI Integration summary
- [UI.md](UI.md) — AI menu group
- [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) — platform AI rules

## Read Next

- One screen under `Menus/AI/` for field-level spec
- [06-ai/platform/ai/](../../06-ai/platform/ai/) for agent registration

---

## Scope

{Module} AI tools run **inside the admin shell**. They call module APIs and platform AI services — never direct cross-module database access.

| Layer | SSOT |
|-------|------|
| **Tool behavior (per screen)** | `Menus/AI/{Screen}.md` — open ONE file |
| **Tool registry summary** | This file (index only) |
| **Platform agents & audit** | [06-ai/platform/ai/](../../06-ai/platform/ai/) |

---

## Admin AI Screens (Menus/AI/)

_Add rows as screens are defined. Do not bulk-read the folder._

| Screen | Doc |
|--------|-----|
| AI Dashboard | [Menus/AI/AI Dashboard.md](Menus/AI/AI%20Dashboard.md) |
| _Tool name_ | [Menus/AI/_Tool name_.md](Menus/AI/) |

**Folder index:** [Menus/AI/](Menus/AI/) — use table above; do not list-scan.

---

## Tool Registry (summary)

| Tool ID | Risk | Approval | Description |
|---------|------|----------|-------------|
| `{module}.example` | low | no | _—_ |

_Full field-level behavior in linked Menu spec — not duplicated here._

---

## Platform Rules

- AI calls **module services only** — never direct DB
- Credit metering per [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md)
- High-risk tools require [Approval Engine](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md)
- Permission gate: `{module}.ai.access`

---

## Related AI (outside Menus/AI/)

| Area | Doc |
|------|-----|
| Report AI | [Reports.md](Reports.md) |
| _Sub-area AI_ | `{area}/ARCHITECTURE.md` |

---

**Module:** {Module} · **Last Updated:** {DATE} · **Maintainer:** {team}
