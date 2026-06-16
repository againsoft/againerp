# Bank EMI Calculator — Plugin Manifest

> **Rule:** Update on every structural change.  
> **Type:** Installable plugin (not a full ERP module)  
> **Inspired by:** [Apple Gadgets BD — EMI View Plans](https://www.applegadgetsbd.com/product/apple-pencil-pro) (study only — not a clone)

---

## Plugin Name

**Bank EMI Calculator**

## Plugin ID

`bank-emi`

## Version

`0.1.0-docs`

## Category

`payment` (display group: **Payments & Financing**)

## Status

`Draft`

## Owner

Ecommerce Team · Platform Plugins

## Layer

`commerce` plugin on Core Settings + Ecommerce Storefront

---

## Purpose (One Line)

Show **bank-wise EMI installment plans** on product, cart, and checkout — configurable from admin — to increase conversion for high-ticket items (PC builds, phones, appliances).

---

## Dependencies

| Module / Service | Type | Required |
|------------------|------|----------|
| Core Settings | Plugin install + config storage | Yes |
| Ecommerce Storefront | PDP, cart, checkout mount points | Yes |
| Orders / Checkout | Optional — EMI as payment method label | Phase 2 |
| SSLCommerz / bKash | Gateway EMI redirect | Phase 3 (optional) |

---

## Surfaces

| Surface | Route / Hook | Purpose |
|---------|--------------|---------|
| Admin plugin config | `/settings/plugins/bank-emi` | Banks, tenures, charges, rules |
| Storefront PDP | `product-purchase-panel` hook | “EMI Available” + View Plans |
| Storefront Cart | `cart-view` summary hook | EMI on cart total |
| Storefront Checkout | Payment step info banner | Remind EMI eligibility |
| PC Builder | `builder-summary` total hook | EMI on build total |
| Public API | `GET /api/v1/storefront/emi/plans` | Calculate plans for amount |

---

## Database Tables (Plugin-Owned)

| Table | Purpose | Status |
|-------|---------|--------|
| `plugin_emi_banks` | Bank / issuer master | Planned |
| `plugin_emi_plans` | Tenure + charge % per bank | Planned |
| `plugin_emi_rules` | Min amount, category allowlist | Planned |
| `plugin_emi_config` | Global toggles per tenant | Planned |

Config may be **JSON in Core Settings** during prototype; tables at production.

---

## API Endpoints

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/api/v1/admin/plugins/bank-emi/config` | Admin read config | Planned |
| PUT | `/api/v1/admin/plugins/bank-emi/config` | Admin save config | Planned |
| GET | `/api/v1/storefront/emi/plans?amount=&bank=` | Public EMI calculation | Planned |
| GET | `/api/v1/storefront/emi/banks` | Active bank list | Planned |

---

## Permissions

| Permission Key | Description |
|----------------|-------------|
| `settings.plugins.read` | View plugin list |
| `settings.plugins.bank-emi.configure` | Edit EMI banks and plans |
| `storefront.emi.view` | Public (implicit) |

---

## Events

| Event | When |
|-------|------|
| `plugin.bank-emi.installed` | Plugin activated |
| `plugin.bank-emi.config_updated` | Admin saves rules |
| `storefront.emi.modal_opened` | Customer opens View Plans |
| `storefront.emi.bank_selected` | Bank tab changed |
| `storefront.emi.plan_clicked` | User selects tenure (analytics) |

---

## Prototype Files (Planned)

| Path | Role |
|------|------|
| `lib/settings/plugins/registry.ts` | Register `bank-emi` plugin def |
| `lib/plugins/bank-emi/types.ts` | Bank, Plan, Calculation types |
| `lib/plugins/bank-emi/calculator.ts` | Pure EMI math |
| `lib/mock-data/emi-banks.ts` | Dummy banks (AB, Brac, etc.) |
| `components/storefront/emi/emi-plans-modal.tsx` | View Plans modal |
| `components/storefront/emi/emi-badge.tsx` | PDP inline CTA |
| `components/settings/plugins/` | Reuse existing config workspace |

---

## Related Docs

| Doc | Link |
|-----|------|
| Architecture | [Architecture.md](./Architecture.md) |
| UI Prototype | [BankEmi.md](../../ui-prototype/plugins/BankEmi.md) |
| Storefront | [ECOMMERCE_STOREFRONT_ARCHITECTURE.md](../../modules/ecommerce/ECOMMERCE_STOREFRONT_ARCHITECTURE.md) |
| Plugins home | [Plugins.md](../../ui-prototype/settings/Plugins.md) |

---

**Last Updated:** 2026-06-15
