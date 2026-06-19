# Localization — Languages, Currencies, Taxes

> **Owner:** Core

## Purpose
Core entity specification: `localization`.

## When To Read
Read only when working on the shared `localization` entity — not module-owned duplicates.

## Related Files
- [Entities index](README.md)
- [Core hub](../ARCHITECTURE.md)

## Read Next
- [All entities](README.md)

---

## Languages

**Table:** `languages`, `translations`

| Field | Notes |
|-------|-------|
| `code` | ISO 639-1 (`en`, `bn`) |
| `name` | Display name |
| `is_default` | One per company |
| `is_rtl` | Right-to-left flag |

**Pattern:** Translatable content uses `{entity}_translations` tables with `language_id` FK (see MASTER_DATABASE_ARCHITECTURE §18).

## Currencies

**Tables:** `currencies`, `exchange_rates`

| Field | Notes |
|-------|-------|
| `code` | ISO 4217 (`BDT`, `USD`) |
| `symbol` | `৳`, `$` |
| `decimal_places` | 2 default |

**Exchange rates:** `exchange_rates (from_currency, to_currency, rate, effective_date)` — daily job updates.

**Storage:** Amounts stored in **company base currency** + display currency on transaction.

## Taxes

**Tables:** `tax_classes`, `tax_rules`, `tax_rates`

| Concept | Description |
|---------|-------------|
| Tax class | `standard`, `reduced`, `zero` |
| Tax rule | Applies by country/region/product class |
| Tax rate | Percentage or fixed |

## API

`GET /api/v1/core/languages` · `GET /api/v1/core/currencies` · `GET /api/v1/core/taxes`

## Module Integration

Catalog, Orders, Accounting reference `tax_class_id` — Core owns tax calculation engine.
