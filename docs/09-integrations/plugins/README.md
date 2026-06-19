# AgainERP — Plugins Documentation

## Purpose
Documentation: README.

## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

> **Status:** Draft  
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · [SETTINGS_ARCHITECTURE.md](../../02-core-platform/subsystems/SETTINGS_ARCHITECTURE.md)  
> **UI Prototype:** [ui-prototype/settings/Plugins.md](../../04-uiux/prototype/settings/Plugins.md)  
> **Code (prototype):** `apps/web/src/lib/settings/plugins/`

---


## When To Read
Read only if your task involves readme.

## Related Files
- [Cursor entry](../../BRAIN.md)

## Read Next
- [Doc map](../../PROJECT_MAP.md)

---

## What Is a Plugin?

A **plugin** is an **installable integration** — lighter than a full ERP module. Plugins:

- Register in **Settings → Plugins** (`PLUGIN_REGISTRY`)
- Ship admin configuration (credentials, toggles, rules)
- Expose **storefront hooks** (widgets, checkout options, PDP badges)
- Own **plugin-scoped tables** (`plugin_{id}_*`) or config JSON in Core Settings
- Communicate with Core/Ecommerce via **Service APIs** — never cross-module DB writes

Full modules use 9 required files under `docs/modules/{name}/`.  
Plugins use **`PLUGIN_MANIFEST.md` + `Architecture.md`** under `docs/plugins/{id}/`.

---

## Plugin vs Module

| Aspect | Module | Plugin |
|--------|--------|--------|
| Example | Ecommerce, Inventory | Bank EMI, Pathao, bKash |
| Docs folder | `docs/modules/` | `docs/plugins/` |
| Admin entry | Own menu tree | Settings → Plugins |
| Install | Module registry | Plugin marketplace card |
| Scope | Full domain | Single integration or feature |

---

## Registered Plugins (Documentation)

| Plugin ID | Name | Category | Docs | Status |
|-----------|------|----------|------|--------|
| `pathao` | Pathao Courier | Shipping | [Plugins.md](../../04-uiux/prototype/settings/Plugins.md) | Prototype UI |
| `steadfast` | Steadfast Courier | Shipping | [Plugins.md](../../04-uiux/prototype/settings/Plugins.md) | Prototype UI |
| `bkash` | bKash | Payment | [Plugins.md](../../04-uiux/prototype/settings/Plugins.md) | Prototype UI |
| `sslcommerz` | SSLCommerz | Payment | [Plugins.md](../../04-uiux/prototype/settings/Plugins.md) | Prototype UI |
| `whatsapp` | WhatsApp Business | Communication | [Plugins.md](../../04-uiux/prototype/settings/Plugins.md) | Prototype UI |
| **`bank-emi`** | **Bank EMI Calculator** | **Payment / Financing** | **[bank-emi/](./bank-emi/)** | **Draft — this sprint** |

---

## Plugin Documentation Checklist

1. [ ] `docs/plugins/{id}/PLUGIN_MANIFEST.md`
2. [ ] `docs/plugins/{id}/Architecture.md`
3. [ ] `docs/ui-prototype/plugins/{Name}.md` (admin + storefront UI)
4. [ ] Entry in [Plugins.md](../../04-uiux/prototype/settings/Plugins.md) registry table
5. [ ] Storefront impact in [IMPLEMENTED_DESIGN.md](../../04-uiux/prototype/storefront/IMPLEMENTED_DESIGN.md) (if customer-facing)
6. [ ] `PLUGIN_REGISTRY` entry in `apps/web/src/lib/settings/plugins/registry.ts` (prototype phase)

---

**Last Updated:** 2026-06-15
