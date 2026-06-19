# Database — Website

> **Module:** Website · **Prefix:** `website_*` · **Status:** Draft · **Date:** 2026-06-19

## Purpose
Owned table definitions, key columns, and integration IDs for the Website module.

## When To Read
Read only for database, migration, or schema work on the Website module.

## Related Files
- [Architecture.md §4](Architecture.md#4-data-ownership)
- [API.md](API.md)

---

## Owned Tables

### Core Content

#### `website_pages`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `tenant_id` | UUID | Isolation — required |
| `company_id` | UUID | FK → `core_companies` |
| `title` | VARCHAR(255) | Page display title |
| `slug` | VARCHAR(255) | URL path — unique per company |
| `status` | ENUM | `draft`, `review`, `published`, `archived` |
| `template_id` | UUID | FK → `website_templates` |
| `meta_title` | VARCHAR(255) | SEO title override |
| `meta_description` | TEXT | SEO description override |
| `og_image_media_id` | UUID | FK → `core_media` |
| `published_at` | TIMESTAMP | When page went live |
| `created_by` | UUID | FK → `core_users` |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

#### `website_page_blocks`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `page_id` | UUID | FK → `website_pages` |
| `sort_order` | INT | Block position on page |
| `block_type` | VARCHAR(100) | e.g. `hero`, `text`, `gallery`, `cta`, `form` |
| `settings` | JSONB | Block content and style config |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

#### `website_page_revisions`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `page_id` | UUID | FK → `website_pages` |
| `blocks_snapshot` | JSONB | Full block state at save time |
| `saved_by` | UUID | FK → `core_users` |
| `saved_at` | TIMESTAMP | |

#### `website_templates`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `name` | VARCHAR(255) | Template name |
| `category` | VARCHAR(100) | `corporate`, `agency`, `healthcare`, `education` |
| `thumbnail_media_id` | UUID | FK → `core_media` |
| `block_schema` | JSONB | Default blocks for new pages |
| `is_system` | BOOLEAN | System templates — not editable |
| `created_at` | TIMESTAMP | |

#### `website_themes`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `company_id` | UUID | FK → `core_companies` |
| `primary_color` | VARCHAR(20) | Hex color |
| `secondary_color` | VARCHAR(20) | Hex color |
| `font_heading` | VARCHAR(100) | Google Font name |
| `font_body` | VARCHAR(100) | Google Font name |
| `logo_media_id` | UUID | FK → `core_media` |
| `favicon_media_id` | UUID | FK → `core_media` |
| `custom_css` | TEXT | Optional custom CSS |
| `updated_at` | TIMESTAMP | |

---

### Blog

#### `website_blog_posts`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `tenant_id` | UUID | |
| `company_id` | UUID | FK → `core_companies` |
| `title` | VARCHAR(255) | |
| `slug` | VARCHAR(255) | Unique per company |
| `content` | TEXT | Rich text / markdown |
| `excerpt` | TEXT | Short description |
| `thumbnail_media_id` | UUID | FK → `core_media` |
| `category_id` | UUID | FK → `website_blog_categories` |
| `author_id` | UUID | FK → `core_users` |
| `status` | ENUM | `draft`, `scheduled`, `published`, `archived` |
| `published_at` | TIMESTAMP | |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

#### `website_blog_categories`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `company_id` | UUID | |
| `name` | VARCHAR(100) | |
| `slug` | VARCHAR(100) | |
| `parent_id` | UUID | Self-ref for nested categories |

---

### Portfolio

#### `website_portfolio_items`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `company_id` | UUID | |
| `title` | VARCHAR(255) | |
| `slug` | VARCHAR(255) | |
| `description` | TEXT | |
| `client_name` | VARCHAR(255) | |
| `category_id` | UUID | FK → `website_portfolio_categories` |
| `cover_media_id` | UUID | FK → `core_media` |
| `gallery_media_ids` | UUID[] | Array of media IDs |
| `status` | ENUM | `draft`, `published` |
| `sort_order` | INT | |
| `created_at` | TIMESTAMP | |

#### `website_portfolio_categories`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `company_id` | UUID | |
| `name` | VARCHAR(100) | |
| `slug` | VARCHAR(100) | |

---

### Team & Careers

#### `website_team_members`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `company_id` | UUID | |
| `name` | VARCHAR(255) | |
| `role` | VARCHAR(255) | Job title |
| `department` | VARCHAR(100) | |
| `bio` | TEXT | |
| `photo_media_id` | UUID | FK → `core_media` |
| `linkedin_url` | VARCHAR(500) | |
| `sort_order` | INT | |
| `is_published` | BOOLEAN | |
| `created_at` | TIMESTAMP | |

#### `website_career_listings`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `company_id` | UUID | |
| `title` | VARCHAR(255) | Job title |
| `department` | VARCHAR(100) | |
| `location` | VARCHAR(255) | |
| `type` | ENUM | `full_time`, `part_time`, `contract`, `remote` |
| `description` | TEXT | |
| `status` | ENUM | `draft`, `published`, `closed` |
| `apply_form_id` | UUID | FK → `website_forms` |
| `expires_at` | TIMESTAMP | |
| `created_at` | TIMESTAMP | |

---

### Forms

#### `website_forms`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `company_id` | UUID | |
| `name` | VARCHAR(255) | Internal name |
| `title` | VARCHAR(255) | Public heading |
| `fields` | JSONB | Form field definitions array |
| `success_message` | TEXT | |
| `notify_emails` | TEXT[] | Email addresses to notify |
| `crm_pipeline_id` | UUID | Optional CRM pipeline target |
| `is_active` | BOOLEAN | |
| `created_at` | TIMESTAMP | |

#### `website_form_submissions`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `form_id` | UUID | FK → `website_forms` |
| `company_id` | UUID | |
| `contact_id` | UUID | FK → `core_contacts` (created/linked on submit) |
| `data` | JSONB | Submitted field values |
| `source_url` | VARCHAR(500) | Page URL where form was submitted |
| `ip_address` | INET | |
| `submitted_at` | TIMESTAMP | |

---

### Domain & SEO

#### `website_domains`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `tenant_id` | UUID | |
| `company_id` | UUID | |
| `domain` | VARCHAR(255) | e.g. `example.com` |
| `status` | ENUM | `pending`, `verified`, `active`, `error` |
| `ssl_status` | ENUM | `pending`, `issued`, `failed` |
| `is_primary` | BOOLEAN | Primary domain for company |
| `verified_at` | TIMESTAMP | |
| `created_at` | TIMESTAMP | |

#### `website_redirects`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `company_id` | UUID | |
| `source_path` | VARCHAR(500) | From URL |
| `target_path` | VARCHAR(500) | To URL |
| `redirect_type` | ENUM | `301`, `302` |
| `is_active` | BOOLEAN | |
| `created_at` | TIMESTAMP | |

#### `website_navigation_menus`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `company_id` | UUID | |
| `name` | VARCHAR(100) | e.g. `header`, `footer`, `mobile` |
| `location` | ENUM | `header`, `footer`, `sidebar` |

#### `website_navigation_menu_items`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID PK | |
| `menu_id` | UUID | FK → `website_navigation_menus` |
| `label` | VARCHAR(255) | Display text |
| `url` | VARCHAR(500) | |
| `page_id` | UUID | FK → `website_pages` (optional) |
| `parent_id` | UUID | Self-ref for dropdown items |
| `sort_order` | INT | |
| `opens_in_new_tab` | BOOLEAN | |

---

## Anti-Patterns (Forbidden)

```text
❌ No cross-module JOINs (no JOIN crm_* or ecommerce_*)
❌ No FK to non-Core module tables
❌ No unscoped queries (tenant_id + company_id required)
❌ No duplicate contact/user tables — use Core only
```

---

**Module:** Website · **Maintainer:** Website Team · **Last Updated:** 2026-06-19
