# Business Partners — Database Design

## Purpose
Business Partners module database — owned tables and schema.

## When To Read
Read this file only if working on Business Partners database tables, migrations, or data ownership.

## Related Files
- [Architecture](Architecture.md)
- [API](API.md)
- [Core contacts](../../02-core-platform/entities/contacts.md)

## Read Next
- [Architecture](Architecture.md)
- [API](API.md)

---

> **Status:** Draft (Planning)  
> **Module:** Business Partners · **Prefix:** `bp_*`  
> **Parent:** [Architecture.md](./Architecture.md)

**No migrations. Schema plan only.**

---


## When To Read
Read this file only if working on Business Partners database tables, migrations, or data ownership.

## Related Files
- [Architecture](Architecture.md)
- [API](API.md)
- [Core contacts](../../02-core-platform/entities/contacts.md)

## Read Next
- [Architecture](Architecture.md)
- [API](API.md)

---

## Design rules

| Rule | Implementation |
|------|----------------|
| Core contact link | `bp_partners.contact_id` → `contacts.id` (UUID, no FK cross-module at DB level in monolith use app-level) |
| Tenant scope | `tenant_id`, `company_id` on every table |
| Soft delete | `deleted_at` on master tables |
| No duplicate identity | Name/email live on `contacts` only |
| Single owner | All `bp_*` owned by Business Partners module |

---

## Entity relationship (logical)

```text
contacts (Core)
    │
    └── bp_partners (1:0..1 commercial profile)
            ├── bp_partner_roles (1:N)
            ├── bp_partner_terms (1:N per role)
            ├── bp_partner_tiers (N:M via tier)
            ├── bp_partner_territories (1:N)
            ├── bp_partner_catalog (1:N)
            ├── bp_onboarding_applications (1:N history)
            └── bp_partner_performance (1:N snapshots)
```

---

## Table: `bp_partners`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | Partner record ID |
| `tenant_id` | UUID | Tenant |
| `company_id` | UUID | Company scope |
| `contact_id` | UUID | → Core contacts |
| `partner_code` | VARCHAR(32) UNIQUE | e.g. `BP-0042` |
| `display_name` | VARCHAR | Override display (optional) |
| `status` | ENUM | `draft`, `pending`, `active`, `on_hold`, `blocked`, `archived` |
| `preferred_language` | VARCHAR | |
| `assigned_user_id` | UUID | Account manager |
| `credit_limit` | DECIMAL | Company currency |
| `credit_exposure` | DECIMAL | Computed snapshot |
| `credit_hold` | BOOLEAN | Blocks new SO |
| `rating` | DECIMAL(3,2) | 0–5 internal score |
| `tags` | JSONB | |
| `notes` | TEXT | Internal |
| `onboarded_at` | TIMESTAMPTZ | |
| `created_at` / `updated_at` | TIMESTAMPTZ | |

**Indexes:** `(tenant_id, company_id, status)`, `(contact_id)`, `(partner_code)`

---

## Table: `bp_partner_roles`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | |
| `partner_id` | UUID FK | → bp_partners |
| `role` | ENUM | See Architecture §2 |
| `is_primary` | BOOLEAN | Default role for UI |
| `is_active` | BOOLEAN | |
| `enabled_at` | TIMESTAMPTZ | |
| `disabled_at` | TIMESTAMPTZ | |

**Unique:** `(partner_id, role)`

---

## Table: `bp_partner_terms`

Commercial terms **per role** (vendor terms ≠ wholesaler terms).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | |
| `partner_id` | UUID | |
| `role` | ENUM | Must match enabled role |
| `payment_terms_days` | INT | Net 30, etc. |
| `payment_terms_label` | VARCHAR | "Net 30" |
| `currency_code` | CHAR(3) | BDT, USD |
| `incoterms` | VARCHAR | FOB, CIF, … |
| `default_lead_time_days` | INT | |
| `min_order_value` | DECIMAL | MOQ value |
| `min_order_qty` | INT | |
| `tax_profile_id` | UUID | → Core taxes (optional) |
| `bank_account_ref` | VARCHAR | External ref |
| `effective_from` | DATE | |
| `effective_to` | DATE | |

---

## Table: `bp_tier_definitions`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | |
| `code` | VARCHAR | `WHOLESALE-A`, `RETAIL-STD` |
| `name` | VARCHAR | |
| `tier_type` | ENUM | `wholesale`, `retail`, `dealer`, `distributor` |
| `discount_pct` | DECIMAL | Default discount off list |
| `price_list_id` | UUID | → Product Master price list |
| `is_active` | BOOLEAN | |

---

## Table: `bp_partner_tiers`

| Column | Type | Description |
|--------|------|-------------|
| `partner_id` | UUID | |
| `tier_id` | UUID | → bp_tier_definitions |
| `role` | ENUM | Usually `wholesaler` or `retailer` |
| `priority` | INT | If multiple tiers |

---

## Table: `bp_partner_territories`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | |
| `partner_id` | UUID | |
| `role` | ENUM | |
| `country_code` | CHAR(2) | |
| `region` | VARCHAR | Division/state |
| `district` | VARCHAR | Optional |
| `is_exclusive` | BOOLEAN | Exclusive territory flag |

---

## Table: `bp_partner_catalog`

Replaces prototype `purchase_vendor_items` / `vendor-product-mapping`.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | |
| `partner_id` | UUID | Vendor role |
| `product_id` | UUID | Catalog product (nullable = unmapped feed) |
| `variant_id` | UUID | |
| `vendor_sku` | VARCHAR | |
| `vendor_title` | VARCHAR | |
| `vendor_cost` | DECIMAL | |
| `vendor_stock_qty` | INT | Supplier-reported |
| `stock_status` | ENUM | `in_stock`, `low`, `out`, `unknown` |
| `lead_time_days` | INT | |
| `min_order_qty` | INT | |
| `warranty` | VARCHAR | |
| `is_preferred` | BOOLEAN | Default vendor for product |
| `is_published_web` | BOOLEAN | |
| `is_mapped` | BOOLEAN | Linked to catalog |
| `last_synced_at` | TIMESTAMPTZ | Stock feed |

---

## Table: `bp_onboarding_applications`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | |
| `application_number` | VARCHAR | `ONB-2026-0042` |
| `requested_roles` | JSONB | Array of roles |
| `company_name` | VARCHAR | Pre-contact |
| `contact_name` | VARCHAR | |
| `email` / `phone` | VARCHAR | |
| `status` | ENUM | `submitted`, `review`, `approved`, `rejected`, `withdrawn` |
| `submitted_at` | TIMESTAMPTZ | |
| `reviewed_by` | UUID | |
| `partner_id` | UUID | Set on approve → bp_partners |
| `rejection_reason` | TEXT | |

---

## Table: `bp_partner_performance`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID PK | |
| `partner_id` | UUID | |
| `role` | ENUM | |
| `period` | DATE | Month start |
| `spend_total` | DECIMAL | Vendor role |
| `revenue_total` | DECIMAL | Customer/wholesale role |
| `on_time_delivery_pct` | DECIMAL | |
| `reject_rate_pct` | DECIMAL | |
| `open_po_count` | INT | |
| `open_so_count` | INT | |
| `computed_at` | TIMESTAMPTZ | |

---

## References from other modules (UUID only)

| Consumer table | Column | Points to |
|----------------|--------|-----------|
| `purchase_orders` | `partner_id` | `bp_partners.id` (optional; fallback `contact_id`) |
| `sales_orders` | `partner_id` | `bp_partners.id` |
| `crm_opportunities` | `partner_id` | `bp_partners.id` |

**Forbidden:** `JOIN bp_partners` from Purchase repository — use `BusinessPartnerService`.

---

**Last Updated:** 2026-06-17
