# Branches

> **Status:** Draft · **Owner:** Core · **Table:** `branches`

## Purpose

Physical or logical locations within a company. Used for branch-scoped operations, stock locations, and regional reporting.

## Used By

Ecommerce (store branches), Sales, Purchase, Inventory, POS, HR, Accounting.

## Key Fields

| Field | Type | Description |
|-------|------|-------------|
| `company_id` | FK | Parent company |
| `name` | VARCHAR | Branch name |
| `code` | VARCHAR | Unique per company |
| `address_id` | FK → addresses | Branch address |
| `phone` | VARCHAR | Branch phone |
| `email` | VARCHAR | Branch email |
| `is_head_office` | BOOLEAN | HQ flag |
| `is_active` | BOOLEAN | Active flag |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/core/branches` | List by company |
| POST | `/api/v1/core/branches` | Create branch |
| PATCH | `/api/v1/core/branches/{uuid}` | Update |
| DELETE | `/api/v1/core/branches/{uuid}` | Soft delete |

## Relationships

- Belongs to: `companies`, `addresses`
- Has many: warehouses (Inventory module), POS terminals

## Permissions

| Key | Description |
|-----|-------------|
| `core.branch.read` | View branches |
| `core.branch.write` | Manage branches |
