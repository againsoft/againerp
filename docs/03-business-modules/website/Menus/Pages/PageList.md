# Page List — Pages

> **Module:** Website · **Screen:** Page List · **Route:** `/website/pages` · **Status:** Draft

## Purpose
List all website pages with status, last edited, and quick actions.

## Layout
Standard list page + right Sheet drawer.

| Action | URL Pattern | Component |
|--------|------------|-----------|
| Create | `?create=1` | Sheet — Page form |
| View | `?view={id}` | Sheet — read-only |
| Edit | `?edit={id}` | Sheet — Page form |
| Builder | `/website/pages/{id}/builder` | Full-screen canvas |

## Table Columns
`Title` · `Slug` · `Status` · `Template` · `Last Updated` · `Actions`

## Filters
Status (draft/published/archived) · Template · Date range

## Sheet — Page Form Fields
- Title (required)
- Slug (auto-generated, editable)
- Template (dropdown)
- Meta Title / Meta Description
- OG Image (media picker)
- Status (draft / review)

## Actions
- **Publish** (publisher role)
- **Open Builder** → full-screen
- **Duplicate**
- **View Revisions**
- **Delete**
