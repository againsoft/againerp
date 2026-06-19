# AI — Ecommerce

## Purpose

Index of commerce AI tools — links to screen specs and platform AI rules. No duplicate tool definitions; open **one** linked doc for your task.

## When To Read

Read when implementing or documenting an Ecommerce admin AI screen, agent tool, or AI-assisted workflow.

## Related Files

- [Architecture](Architecture.md) — module boundaries
- [UI](UI.md) — AI menu group (15 screens)
- [Platform AI OS](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) — global AI rules

## Read Next

- One screen under [Menus/AI/](Menus/AI/) for field-level spec
- [seo/README.md](seo/README.md) — SEO AI tools (Meta Generator, SEO Generator)

---

> **Status:** Active  
> **Module:** Ecommerce  
> **Document Type:** AI index (deep dive)  
> **Namespace:** `ecommerce.ai.*` · **Platform:** [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md)

---

## Scope

Commerce AI tools run **inside the admin shell** under **Ecommerce → AI**. They call module APIs and platform AI services — never direct cross-module database access.

| Layer | SSOT |
|-------|------|
| **Tool behavior (per screen)** | `Menus/AI/{Screen}.md` — open ONE file |
| **SEO-specific AI** | [seo/ARCHITECTURE.md](seo/ARCHITECTURE.md) · [Menus/SEO/AI Meta Generator.md](Menus/SEO/AI%20Meta%20Generator.md) |
| **Storefront AI** | [ECOMMERCE_STOREFRONT_ARCHITECTURE.md](ECOMMERCE_STOREFRONT_ARCHITECTURE.md) |
| **Platform agents & audit** | [06-ai/platform/ai/](../../06-ai/platform/ai/) |

---

## Admin AI Screens (Menus/AI/)

Open **one** screen doc when implementing that tool:

| Screen | Doc |
|--------|-----|
| AI Dashboard | [Menus/AI/AI Dashboard.md](Menus/AI/AI%20Dashboard.md) |
| AI Product Description | [Menus/AI/AI Product Description.md](Menus/AI/AI%20Product%20Description.md) |
| AI Product Tags | [Menus/AI/AI Product Tags.md](Menus/AI/AI%20Product%20Tags.md) |
| AI Product Recommendation | [Menus/AI/AI Product Recommendation.md](Menus/AI/AI%20Product%20Recommendation.md) |
| AI Image Generation | [Menus/AI/AI Image Generation.md](Menus/AI/AI%20Image%20Generation.md) |
| AI Banner Generator | [Menus/AI/AI Banner Generator.md](Menus/AI/AI%20Banner%20Generator.md) |
| AI Blog Writer | [Menus/AI/AI Blog Writer.md](Menus/AI/AI%20Blog%20Writer.md) |
| AI Translation | [Menus/AI/AI Translation.md](Menus/AI/AI%20Translation.md) |
| AI Review Summary | [Menus/AI/AI Review Summary.md](Menus/AI/AI%20Review%20Summary.md) |
| AI Customer Support | [Menus/AI/AI Customer Support.md](Menus/AI/AI%20Customer%20Support.md) |
| AI Inventory Forecast | [Menus/AI/AI Inventory Forecast.md](Menus/AI/AI%20Inventory%20Forecast.md) |
| AI Sales Forecast | [Menus/AI/AI Sales Forecast.md](Menus/AI/AI%20Sales%20Forecast.md) |
| AI Analytics Assistant | [Menus/AI/AI Analytics Assistant.md](Menus/AI/AI%20Analytics%20Assistant.md) |
| AI Meta Generator | [Menus/AI/AI Meta Generator.md](Menus/AI/AI%20Meta%20Generator.md) |
| AI SEO Generator | [Menus/AI/AI SEO Generator.md](Menus/AI/AI%20SEO%20Generator.md) |

**Folder index:** [Menus/AI/](Menus/AI/) — do not bulk-read; use table above.

---

## Related AI (outside Menus/AI/)

| Area | Doc |
|------|-----|
| SEO AI tools | [seo/README.md](seo/README.md) · [Menus/SEO/](Menus/SEO/) |
| Builder AI widgets | [builder/README.md](builder/README.md) · [08-builder/prototype/](../../../08-builder/prototype/) |
| AI report screens | [Reports.md](Reports.md) → [Menus/Reports/AI Reports.md](Menus/Reports/AI%20Reports.md) |

---

## Platform Rules

- Tools invoke `/api/v1/` services only — see [ARCHITECTURE_DECISIONS.md §6](../../ARCHITECTURE_DECISIONS.md)
- Credit costs and approval gates: [AI_AUDIT_AND_APPROVAL.md](../../06-ai/platform/ai/AI_AUDIT_AND_APPROVAL.md)
- Module permissions: [Permissions.md](Permissions.md) — `ecommerce.ai.*`

---

**Module:** Ecommerce · **Last Updated:** 2026-06-19
