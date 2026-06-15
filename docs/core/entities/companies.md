# Companies

> **Status:** Draft · **Owner:** Core · **Table:** `companies`

## Purpose

Top-level tenant entity. Every business record in AgainERP belongs to a company. Enables multi-company ERP from day one.

## Used By

All modules — Ecommerce, CRM, Sales, Purchase, Inventory, Accounting, HR, POS, and more.

## Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | VARCHAR | Company legal / display name |
| `code` | VARCHAR | Short unique code |
| `email` | VARCHAR | Primary company email |
| `phone` | VARCHAR | Primary phone |
| `logo_media_id` | FK → media | Company logo |
| `currency_code` | CHAR(3) | Default currency (BDT, USD, EUR) |
| `timezone` | VARCHAR | Default timezone |
| `locale` | VARCHAR | Default locale (`en`, `bn`) |
| `is_active` | BOOLEAN | Active flag |

Plus standard columns: `id`, `uuid`, `status`, audit columns.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/core/companies` | List (super-admin) |
| GET | `/api/v1/core/companies/{uuid}` | Get company |
| POST | `/api/v1/core/companies` | Create company |
| PATCH | `/api/v1/core/companies/{uuid}` | Update |
| DELETE | `/api/v1/core/companies/{uuid}` | Soft delete |

## Relationships

- Has many: `branches`, `users`, `contacts`, all module records
- Belongs to: `media` (logo)

## Permissions

| Key | Description |
|-----|-------------|
| `core.company.read` | View company |
| `core.company.write` | Manage company settings |
| `core.company.create` | Create new company (super-admin) |
