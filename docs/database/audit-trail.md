# Audit Trail Standards

> Parent: [DEVELOPMENT_STANDARDS.md §5](../DEVELOPMENT_STANDARDS.md#5-audit-trail)

## Soft Delete

- `deleted_at` set on delete — record remains in database
- `deleted_by` records who deleted
- Default queries exclude soft-deleted records
- Restore clears `deleted_at` and `deleted_by` (requires permission)

## Revision History

Critical records (orders, products, invoices) store field-level change history:

| Field | Description |
|-------|-------------|
| `record_type` | Model class / table name |
| `record_id` | Record primary key |
| `field_name` | Changed field |
| `old_value` | Previous value |
| `new_value` | New value |
| `changed_by` | User ID |
| `changed_at` | Timestamp |

## Tracking Columns

Every business record maintains:

| Column | Set On |
|--------|--------|
| `created_by` | Insert |
| `updated_by` | Every update |
| `deleted_by` | Soft delete |

Automated via service layer — never trust client-submitted user IDs.
