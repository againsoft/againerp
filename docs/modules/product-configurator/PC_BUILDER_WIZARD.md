# PC Builder Wizard (Storefront)

> **Status:** Implemented (prototype)  
> **Routes:** `/builder`, `/builder/pc-builder`  
> **Share URL:** `/builder/pc-builder?b=<token>`

---

## Objective

Modern step-by-step PC Builder with compatibility filtering, live pricing, stock display, and sticky build summary.

---

## Wizard steps

| Step | Category ID | Attribute profile |
|------|-------------|-------------------|
| CPU | `cc_cpu` | `cap_cpu` |
| Motherboard | `cc_mobo` | `cap_mobo` |
| RAM | `cc_ram` | `cap_ram` |
| GPU | `cc_gpu` | `cap_gpu` |
| SSD | `cc_storage` | `cap_storage` |
| PSU | `cc_psu` | `cap_psu` |
| Case | `cc_case` | `cap_case` |
| Monitor | `cc_monitor` | `cap_monitor` |

---

## Architecture

```
User selects step
    ↓
Load products for step (pc-builder-products.ts)
    ↓
Attribute pre-filter (socket, RAM type)
    ↓
Rule engine trial evaluation (compatibility-filter.ts)
    ↓
Show compatible products only
    ↓
On each selection → re-evaluate build status
    ↓
Sticky summary (pricing + compatibility + actions)
```

---

## Requirements mapping

| Requirement | Implementation |
|-------------|----------------|
| Step-by-step wizard | `BuilderStepNav` + `PcBuilderWizard` |
| Compatible products only | `filterCompatibleProducts()` |
| Live pricing | `totalPrice()` in `pc-builder-store` |
| Live stock check | `stock` + `stockStatus` on product cards |
| Compatibility status | `BuilderCompatibilityBanner` + rule engine |
| Sticky build summary | `BuilderSummary` (sidebar desktop, bottom bar mobile) |
| Mobile responsive | Horizontal step scroll, sticky bottom total |
| Compare components | `BuilderComparePanel` (up to 3 per step) |
| Save build | `saveBuild()` → persisted `savedBuilds` |
| Share build URL | `?b=<base64 token>` via `BuilderShareHydrator` |

---

## Frontend files

| File | Role |
|------|------|
| `lib/builder/types.ts` | Step definitions, product/selection types |
| `lib/mock-data/pc-builder-products.ts` | 24 seed PC components with attributes |
| `lib/builder/compatibility-filter.ts` | Pre-filter + rule engine integration |
| `lib/store/pc-builder-store.ts` | Wizard state, save, share, compare |
| `components/storefront/builder/pc-builder-wizard.tsx` | Main orchestrator |
| `components/storefront/builder/builder-step-nav.tsx` | Step progress UI |
| `components/storefront/builder/builder-product-card.tsx` | Selectable product card |
| `components/storefront/builder/builder-summary.tsx` | Sticky summary + cart/save/share |
| `components/storefront/builder/builder-compare-panel.tsx` | In-step compare |
| `components/storefront/builder/builder-compatibility-banner.tsx` | Status banner |
| `components/storefront/builder/builder-share-hydrator.tsx` | URL `?b=` hydration |

---

## APIs (production wiring)

| Action | Endpoint |
|--------|----------|
| List products per slot | `GET /api/v1/configurator/categories/{uuid}/products` |
| Evaluate compatibility | `POST /api/v1/configurator/compatibility/evaluate` |
| Save build | `POST /api/v1/configurator/builds` |
| Load shared build | `GET /api/v1/configurator/builds/{build_code}` |
| Stock check | Catalog inventory API per `product_id` |

---

## Share URL format

```
/builder/pc-builder?b=eyJzIjoiY3B1IiwicCI6InBjYl9jcHVfaTUifQ==
```

Token encodes `[{ stepId, productId }, ...]` as base64 JSON.

---

## Cart integration

"Add build to cart" adds each selected component as a separate cart line via `useStorefrontCart.addItem()`.

Blocked when build status is `incompatible`.

---

## Related docs

- [Compatibility Engine](./COMPATIBILITY_ENGINE.md)
- [Admin Panel](./ADMIN_PANEL.md)
