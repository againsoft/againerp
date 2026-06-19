# API — Website

> **Module:** Website · **Base:** `/api/v1/website/` · **Status:** Draft · **Date:** 2026-06-19

## Purpose
REST API contracts for the Website module. All endpoints require Bearer token + `X-Company-Id` header.

## When To Read
Read only for backend or API work on the Website module.

## Related Files
- [Architecture.md §5](Architecture.md#5-api)
- [Database.md](Database.md)

---

## Auth & Headers

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | ✅ | `Bearer {token}` |
| `X-Company-Id` | ✅ | Company UUID |
| `X-Tenant-Id` | auto | Set by middleware |

---

## Pages

| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | `/api/v1/website/pages` | `website.pages.view` | List all pages |
| POST | `/api/v1/website/pages` | `website.pages.manage` | Create page |
| GET | `/api/v1/website/pages/{id}` | `website.pages.view` | Get page with blocks |
| PATCH | `/api/v1/website/pages/{id}` | `website.pages.manage` | Update page metadata |
| DELETE | `/api/v1/website/pages/{id}` | `website.pages.manage` | Delete page |
| POST | `/api/v1/website/pages/{id}/publish` | `website.pages.publish` | Publish page |
| POST | `/api/v1/website/pages/{id}/unpublish` | `website.pages.publish` | Revert to draft |
| GET | `/api/v1/website/pages/{id}/revisions` | `website.pages.view` | Page revision history |
| POST | `/api/v1/website/pages/{id}/restore/{rev_id}` | `website.pages.manage` | Restore revision |
| PUT | `/api/v1/website/pages/{id}/blocks` | `website.pages.manage` | Save full block layout |

### Public (no auth)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/website/public/pages/{slug}` | Render page by slug for storefront |

---

## Templates

| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | `/api/v1/website/templates` | `website.pages.view` | List all templates |
| GET | `/api/v1/website/templates/{id}` | `website.pages.view` | Get template with block schema |

---

## Themes

| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | `/api/v1/website/themes` | `website.settings.manage` | Get active theme |
| PATCH | `/api/v1/website/themes/active` | `website.settings.manage` | Update theme settings |

---

## Blog

| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | `/api/v1/website/blog/posts` | `website.blog.manage` | List posts |
| POST | `/api/v1/website/blog/posts` | `website.blog.manage` | Create post |
| GET | `/api/v1/website/blog/posts/{id}` | `website.blog.manage` | Get post |
| PATCH | `/api/v1/website/blog/posts/{id}` | `website.blog.manage` | Update post |
| DELETE | `/api/v1/website/blog/posts/{id}` | `website.blog.manage` | Delete post |
| POST | `/api/v1/website/blog/posts/{id}/publish` | `website.blog.publish` | Publish post |
| GET | `/api/v1/website/blog/categories` | `website.blog.manage` | List categories |
| POST | `/api/v1/website/blog/categories` | `website.blog.manage` | Create category |

### Public

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/website/public/blog/posts` | List published posts |
| GET | `/api/v1/website/public/blog/posts/{slug}` | Get post by slug |

---

## Portfolio

| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | `/api/v1/website/portfolio` | `website.pages.view` | List portfolio items |
| POST | `/api/v1/website/portfolio` | `website.pages.manage` | Create item |
| GET | `/api/v1/website/portfolio/{id}` | `website.pages.view` | Get item |
| PATCH | `/api/v1/website/portfolio/{id}` | `website.pages.manage` | Update item |
| DELETE | `/api/v1/website/portfolio/{id}` | `website.pages.manage` | Delete item |

---

## Team & Careers

| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | `/api/v1/website/team` | `website.pages.view` | List team members |
| POST | `/api/v1/website/team` | `website.pages.manage` | Add member |
| PATCH | `/api/v1/website/team/{id}` | `website.pages.manage` | Update member |
| DELETE | `/api/v1/website/team/{id}` | `website.pages.manage` | Remove member |
| GET | `/api/v1/website/careers` | `website.pages.view` | List career listings |
| POST | `/api/v1/website/careers` | `website.pages.manage` | Create listing |
| PATCH | `/api/v1/website/careers/{id}` | `website.pages.manage` | Update listing |
| POST | `/api/v1/website/careers/{id}/close` | `website.pages.manage` | Close listing |

---

## Forms

| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | `/api/v1/website/forms` | `website.forms.manage` | List forms |
| POST | `/api/v1/website/forms` | `website.forms.manage` | Create form |
| GET | `/api/v1/website/forms/{id}` | `website.forms.manage` | Get form with fields |
| PATCH | `/api/v1/website/forms/{id}` | `website.forms.manage` | Update form |
| DELETE | `/api/v1/website/forms/{id}` | `website.forms.manage` | Delete form |
| GET | `/api/v1/website/forms/{id}/submissions` | `website.forms.submissions.view` | List submissions |
| DELETE | `/api/v1/website/forms/{id}/submissions/{sub_id}` | `website.forms.manage` | Delete submission |

### Public (no auth — form submission endpoint)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/website/public/forms/{id}/submit` | Submit form (rate-limited, CAPTCHA validated) |

---

## Navigation Menus

| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | `/api/v1/website/menus` | `website.pages.view` | List all menus |
| GET | `/api/v1/website/menus/{location}` | public | Get menu by location (header/footer) |
| PUT | `/api/v1/website/menus/{id}/items` | `website.pages.manage` | Save full menu item tree |

---

## SEO

| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | `/api/v1/website/seo/meta` | `website.seo.manage` | List SEO meta records |
| PATCH | `/api/v1/website/seo/meta/{page_id}` | `website.seo.manage` | Update page SEO |
| GET | `/api/v1/website/seo/redirects` | `website.seo.manage` | List redirect rules |
| POST | `/api/v1/website/seo/redirects` | `website.seo.manage` | Create redirect |
| DELETE | `/api/v1/website/seo/redirects/{id}` | `website.seo.manage` | Delete redirect |
| GET | `/api/v1/website/seo/sitemap` | public | Generate XML sitemap |
| GET | `/api/v1/website/seo/robots` | public | Serve robots.txt |

---

## Domains

| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| GET | `/api/v1/website/domains` | `website.domain.manage` | List domains |
| POST | `/api/v1/website/domains` | `website.domain.manage` | Add domain |
| DELETE | `/api/v1/website/domains/{id}` | `website.domain.manage` | Remove domain |
| POST | `/api/v1/website/domains/{id}/verify` | `website.domain.manage` | Trigger DNS verification |
| POST | `/api/v1/website/domains/{id}/set-primary` | `website.domain.manage` | Set as primary domain |

---

## AI

| Method | Path | Permission | Purpose |
|--------|------|-----------|---------|
| POST | `/api/v1/website/ai/page-writer` | `website.ai.access` | Generate page section copy |
| POST | `/api/v1/website/ai/blog-writer` | `website.ai.access` | Draft blog post |
| POST | `/api/v1/website/ai/meta-generator` | `website.ai.access` | Generate SEO meta |
| POST | `/api/v1/website/ai/translate` | `website.ai.access` | Translate page content |

---

**Module:** Website · **Maintainer:** Website Team · **Last Updated:** 2026-06-19
