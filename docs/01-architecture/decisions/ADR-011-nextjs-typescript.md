# ADR-011: Use Next.js and TypeScript for Frontend

> **Status:** Accepted  
> **Date:** 2026-06-12  
> **Deciders:** Platform Architecture Team  
> **Supersedes:** [ADR-003-vue.md](./ADR-003-vue.md)

---

## Context

AgainERP requires enterprise admin UI (Odoo-inspired), ecommerce flows (Shopify-inspired), command palette, AG Grid data tables, SSR/SSG for storefront, and TypeScript end-to-end type safety with the API.

## Decision

Use **Next.js** (App Router) with **TypeScript** as the official frontend framework. UI stack: Tailwind CSS, Shadcn UI, AG Grid, Zustand, React Hook Form, Zod, Recharts, Lucide, Sonner, CMDK.

## Consequences

### Positive

- Single React ecosystem for admin and storefront
- Strong TypeScript + Zod sharing with API contracts
- Aligns with [TECHNOLOGY_CONSTITUTION.md](../../00-foundation/TECHNOLOGY_CONSTITUTION.md)

### Negative

- ADR-003 (Vue) is superseded — migrate any Vue references in docs

## Related Documents

- [TECHNOLOGY_CONSTITUTION.md](../../00-foundation/TECHNOLOGY_CONSTITUTION.md)
- [ui-ux/ENTERPRISE_UI_ARCHITECTURE.md](../../04-uiux/standards/ENTERPRISE_UI_ARCHITECTURE.md)
