# Permissions — Website

> **Module:** Website · **Namespace:** `website.*` · **Status:** Draft · **Date:** 2026-06-19

## Purpose
RBAC permission matrix and record-level access rules for the Website module.

## When To Read
Read for permission, role, or access-control work on the Website module.

## Related Files
- [Architecture.md §7](Architecture.md#7-permissions)
- [Core Permissions](../../02-core-platform/entities/permissions.md)

---

## Permission Namespace

All Website permissions use the `website.*` namespace registered in Core RBAC.

---

## Role Matrix

| Permission | Super Admin | Admin | Content Manager | SEO Manager | Viewer |
|-----------|:-----------:|:-----:|:---------------:|:-----------:|:------:|
| `website.access` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `website.pages.view` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `website.pages.manage` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `website.pages.publish` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `website.blog.manage` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `website.blog.publish` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `website.portfolio.manage` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `website.team.manage` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `website.forms.manage` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `website.forms.submissions.view` | ✅ | ✅ | ✅ | ❌ | ❌ |
| `website.seo.manage` | ✅ | ✅ | ❌ | ✅ | ❌ |
| `website.domain.manage` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `website.settings.manage` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `website.ai.access` | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## Full Permission List

### Pages
| Permission | Description |
|-----------|-------------|
| `website.pages.view` | View page list and page content |
| `website.pages.manage` | Create, edit, delete pages and blocks |
| `website.pages.publish` | Publish and unpublish pages |

### Blog
| Permission | Description |
|-----------|-------------|
| `website.blog.manage` | Create, edit, delete blog posts and categories |
| `website.blog.publish` | Publish and schedule blog posts |

### Portfolio
| Permission | Description |
|-----------|-------------|
| `website.portfolio.manage` | Create, edit, delete portfolio items |

### Team & Careers
| Permission | Description |
|-----------|-------------|
| `website.team.manage` | Add, edit, remove team members and career listings |

### Forms
| Permission | Description |
|-----------|-------------|
| `website.forms.manage` | Create and edit forms |
| `website.forms.submissions.view` | Read form submissions and export data |

### SEO
| Permission | Description |
|-----------|-------------|
| `website.seo.manage` | Edit meta tags, redirects, sitemap, robots.txt |

### Domain
| Permission | Description |
|-----------|-------------|
| `website.domain.manage` | Add, verify, and remove custom domains |

### Settings
| Permission | Description |
|-----------|-------------|
| `website.settings.manage` | Manage theme, analytics integrations, scripts |

### AI
| Permission | Description |
|-----------|-------------|
| `website.ai.access` | Use AI content generation tools |

---

## Record Rules

| Resource | Rule |
|----------|------|
| Pages | Scoped by `company_id` — users cannot view other companies' pages |
| Blog posts | Scoped by `company_id` |
| Form submissions | Scoped by `company_id` — viewer role cannot see submissions |
| Domains | Scoped by `tenant_id` — domain belongs to tenant, not just company |

---

**Module:** Website · **Maintainer:** Website Team · **Last Updated:** 2026-06-19
