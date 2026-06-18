# Business Partners — Permissions

> **Status:** Draft (Planning)  
> **Parent:** [Architecture.md](./Architecture.md)

---

## Permission groups

| Group | Keys |
|-------|------|
| **Partner** | `bp.partner.read`, `bp.partner.write`, `bp.partner.delete`, `bp.partner.block`, `bp.partner.export` |
| **Onboarding** | `bp.onboarding.read`, `bp.onboarding.review`, `bp.onboarding.approve` |
| **Terms** | `bp.terms.read`, `bp.terms.write` |
| **Tiers** | `bp.tier.read`, `bp.tier.write` |
| **Territories** | `bp.territory.read`, `bp.territory.write` |
| **Catalog** | `bp.catalog.read`, `bp.catalog.write`, `bp.catalog.sync` |
| **Performance** | `bp.performance.read` |
| **Settings** | `bp.settings.manage` |

---

## Role matrix (default)

| Permission | Admin | Partner Manager | Procurement | Sales Rep | Viewer |
|------------|-------|-----------------|-------------|-----------|--------|
| `bp.partner.read` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `bp.partner.write` | ✓ | ✓ | ✓ | ✓ | |
| `bp.partner.block` | ✓ | ✓ | | | |
| `bp.onboarding.approve` | ✓ | ✓ | | | |
| `bp.terms.write` | ✓ | ✓ | ✓ | ✓ | |
| `bp.tier.write` | ✓ | ✓ | | ✓ | |
| `bp.catalog.write` | ✓ | ✓ | ✓ | | |
| `bp.settings.manage` | ✓ | | | | |

---

## UI gating

| Screen | Minimum permission |
|--------|-------------------|
| Directory | `bp.partner.read` |
| Create partner | `bp.partner.write` |
| Block button | `bp.partner.block` |
| Onboarding approve | `bp.onboarding.approve` |
| Tier admin | `bp.tier.write` |

---

## Module disabled

When `module.business_partners` off for tenant — all `bp.*` permissions inactive; nav hidden.

---

**Last Updated:** 2026-06-17
