# Architecture — Website

> **Status:** Active
> **Version:** 1.0
> **Module:** Website
> **Document Type:** Architecture
> **Route Namespace:** `/website/*`
> **Governance:** [GOVERNANCE.md](../../00-foundation/GOVERNANCE.md) · [STANDARD_MODULE_TEMPLATE.md](../../STANDARD_MODULE_TEMPLATE.md)

Source of truth for **Website** module boundaries, ownership, and integration.

**Package:** [ModuleManifest.md](ModuleManifest.md) · [Database.md](Database.md) · [API.md](API.md) · [Workflow.md](Workflow.md) · [Permissions.md](Permissions.md) · [AI.md](AI.md)

---

## 1. Overview

| Attribute | Value |
|-----------|-------|
| **Module ID** | `website` |
| **Display name** | Website |
| **Layer** | commerce |
| **Route namespace** | `/website/*` |
| **Table prefix** | `website_*` |
| **API base** | `/api/v1/website/` |
| **Dependencies** | Core (Users, Contacts, Media, Tags) + optional Ecommerce, CRM |

Website module provides a full company website builder and CMS — independent of Ecommerce. Any business type (retail, hospital, school, agency) can build and manage their public-facing website without needing the Ecommerce module installed.

| Principle | Rule |
|-----------|------|
| Ecommerce independence | Website runs without Ecommerce module |
| Core contacts master | Form submissions go to Core contacts — no duplicate party tables |
| Page ownership | `website_*` tables own all page/block/form data |
| CRM handoff via event | Lead capture publishes event — CRM subscribes optionally |

---

## 2. Purpose

### Why Website Exists

Every business needs a public-facing website — company identity, services, team, contact forms, and blog. This need exists regardless of whether the business sells products online. The Ecommerce module's Builder is scoped to **shop pages only** (product pages, checkout, storefront). The Website module fills the gap: **corporate presence, branding, and lead generation**.

### Scope & Boundaries

#### In Scope

- Drag-and-drop page builder with corporate templates
- Blog / news / press release management
- Portfolio and case study pages
- Team member profiles and careers pages
- Contact and lead capture forms
- Domain and subdomain management
- Company-level SEO (meta, sitemap, schema, redirects)
- AI content generation (page copy, blog posts, meta tags)
- Multi-language page support
- Theme and branding customization
- Analytics integration (traffic, form conversion)

#### Out of Scope

- Product catalog pages → **Ecommerce module**
- Checkout and cart pages → **Ecommerce module**
- Employee self-service portal → **ESS module**
- Knowledge base articles → **Knowledge module**
- Helpdesk ticket portal → **Helpdesk module**
- Campaign landing pages with order flow → **Ecommerce Builder**

---

## 3. Features

### Navigation Map

_Admin menu groups and primary screens. Detail: [UI.md](UI.md) · `Menus/`_

| Area | Route | Screens | Description |
|------|-------|---------|-------------|
| Dashboard | `/website` | 1 | Traffic, leads, page performance overview |
| Pages | `/website/pages` | 6 | Page list, builder, templates, revisions |
| Blog | `/website/blog` | 5 | Posts, categories, comments, authors |
| Portfolio | `/website/portfolio` | 4 | Projects, case studies, categories |
| Team | `/website/team` | 3 | Members, departments, careers |
| Forms | `/website/forms` | 5 | Form builder, submissions, integrations |
| Media | `/website/media` | 2 | Images, files (uses Core Media Library) |
| SEO | `/website/seo` | 7 | Meta, sitemap, redirects, schema, robots |
| Domain | `/website/domain` | 4 | Domain, SSL, subdomain, DNS |
| AI | `/website/ai` | 6 | Content writer, SEO generator, image gen |
| Settings | `/website/settings` | 8 | General, theme, analytics, social, scripts |
| **Total** | | **51** | |

### Capability Summary

| Feature | Description |
|---------|-------------|
| **Page Builder** | Visual drag-and-drop — blocks, sections, components |
| **Template Library** | Corporate, agency, healthcare, education themes |
| **Blog CMS** | Posts, categories, tags, authors, scheduled publish |
| **Portfolio** | Project showcase with images, tags, client info |
| **Form Builder** | Contact, quote, newsletter, survey forms |
| **Lead Capture** | Form → Core contacts → CRM event (if installed) |
| **Domain Manager** | Custom domain binding, SSL, redirect rules |
| **Company SEO** | Meta tags, sitemap, robots.txt, schema markup |
| **AI Writer** | Generate page copy, blog posts, meta descriptions |
| **Multi-language** | Translate pages via Core Localisation engine |
| **Theme System** | Brand colors, fonts, logo — applied site-wide |
| **Analytics** | Page views, form conversions, traffic sources |

### Key Workflows

_Summary only — state machines in [Workflow.md](Workflow.md)_

```text
Page Draft → Review → Published → (Edit → Re-publish)
Form Submit → Contact Created (Core) → website.form.submitted event
                                             ↓ (if CRM installed)
                                       CRM Lead Created
Blog Post → Draft → Scheduled → Published → Archived
Domain → Pending DNS → Verified → Active → SSL Issued
```

---

## 4. Data Ownership

### Owned Tables (`website_*`)

| Table | Purpose |
|-------|---------| 
| `website_pages` | Page records — title, slug, status, template, published_at |
| `website_page_blocks` | Drag-and-drop block content per page (JSON structure) |
| `website_page_revisions` | Version history for each page |
| `website_templates` | Page templates — name, thumbnail, block_schema |
| `website_themes` | Theme settings — colors, fonts, logo, favicon |
| `website_blog_posts` | Blog/news posts — title, slug, content, author_id, status |
| `website_blog_categories` | Blog categories — name, slug, parent_id |
| `website_blog_tags` | Blog tags (or uses Core tags — TBD) |
| `website_portfolio_items` | Portfolio projects — title, description, images |
| `website_portfolio_categories` | Portfolio categories |
| `website_team_members` | Team member profiles — name, role, bio, photo |
| `website_career_listings` | Job postings — title, dept, location, status |
| `website_forms` | Form definitions — name, fields (JSON schema) |
| `website_form_submissions` | Raw form submissions — form_id, data (JSON), contact_id |
| `website_domains` | Domain records — domain, status, ssl_status, verified_at |
| `website_redirects` | URL redirect rules — source, target, type (301/302) |
| `website_seo_meta` | Per-page SEO — meta_title, meta_description, og_image |
| `website_sitemaps` | Sitemap generation settings |
| `website_analytics_snapshots` | Daily traffic/conversion summaries (cached) |
| `website_navigation_menus` | Header/footer navigation menus |
| `website_navigation_menu_items` | Menu items — label, url, parent_id, sort_order |

**Full schema:** [Database.md](Database.md)

### Core Entities Consumed (Not Owned)

| Core Entity | Usage |
|-------------|-------|
| [contacts](../../02-core-platform/entities/contacts.md) | Form submissions create/link contacts |
| [users](../../02-core-platform/entities/users.md) | Blog authors, page editors (`created_by`) |
| [companies](../../02-core-platform/entities/companies.md) | Multi-company website scope (`company_id`) |
| [branches](../../02-core-platform/entities/branches.md) | Branch-specific pages (optional) |
| [media](../../02-core-platform/entities/media-library.md) | Page images, blog thumbnails, portfolio images |
| [tags](../../02-core-platform/entities/tags.md) | Blog post tags |
| [activities](../../02-core-platform/entities/activities.md) | Form submission follow-up tasks |

### Integration IDs

| Field | Points To | Rule |
|-------|-----------|------|
| `contact_id` | Core `contacts` | FK allowed — Core entity |
| `author_id` | Core `users` | FK allowed — Core entity |
| `company_id` | Core `companies` | FK allowed — every row |
| `media_id` | Core `media` | FK allowed — Core entity |

### Anti-Patterns (Forbidden)

```text
❌ Duplicate contacts/users tables in website_*
❌ JOIN ecommerce_* or crm_* tables directly
❌ Write to another module's owned tables
❌ Store product catalog data in website_pages
```

---

## 5. API

| Property | Value |
|----------|-------|
| **Base path** | `/api/v1/website/` |
| **Auth** | Bearer + `X-Company-Id` |
| **Permission namespace** | `website.*` |

### Representative Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/pages` | List all pages |
| POST | `/pages` | Create page |
| GET | `/pages/{id}` | Get page with blocks |
| PATCH | `/pages/{id}` | Update page metadata |
| POST | `/pages/{id}/publish` | Publish page |
| GET | `/pages/{id}/revisions` | Page revision history |
| GET | `/blog/posts` | List blog posts |
| POST | `/blog/posts` | Create blog post |
| GET | `/forms` | List forms |
| POST | `/forms/{id}/submit` | Public form submission |
| GET | `/forms/{id}/submissions` | Form submissions list |
| GET | `/themes` | List themes |
| PATCH | `/themes/active` | Update active theme |
| GET | `/seo/meta` | List SEO meta records |
| PATCH | `/seo/meta/{page_id}` | Update page SEO |
| GET | `/domains` | List domains |
| POST | `/domains/{id}/verify` | Trigger domain verification |

**Full contracts:** [API.md](API.md)

### Services

| Direction | Service | Purpose |
|-----------|---------|---------|
| **Provides** | `WebsiteService.getPage(slug)` | Storefront page rendering |
| **Provides** | `WebsiteService.submitForm(form_id, data)` | Public form handler |
| **Consumes** | `CoreContactService.upsert()` | Create/find contact on form submit |
| **Consumes** | `CoreMediaService.getUrl()` | Resolve media URLs |

---

## 6. Events

### Published Events

| Event | Trigger | Payload (summary) |
|-------|---------|-------------------|
| `website.page.published` | Page status → published | `page_id`, `slug`, `company_id` |
| `website.page.unpublished` | Page status → draft | `page_id`, `company_id` |
| `website.form.submitted` | Form submission received | `form_id`, `contact_id`, `data`, `company_id` |
| `website.lead.captured` | New contact via form | `contact_id`, `form_id`, `source_url` |
| `website.blog.published` | Blog post published | `post_id`, `slug`, `author_id` |
| `website.domain.verified` | Domain DNS verified | `domain_id`, `domain`, `company_id` |

### Subscribed Events

| Event | Source | Handler action |
|-------|--------|----------------|
| `core.media.deleted` | Core | Remove media refs from page blocks |
| `core.approval.approved` | Core | Auto-publish page if approval required |

**Rules:** Publish after COMMIT · CRM subscribes to `website.lead.captured` optionally · See [EVENT_ARCHITECTURE.md](../../02-core-platform/engines/EVENT_ARCHITECTURE.md)

---

## 7. Permissions

| Property | Value |
|----------|-------|
| **Namespace** | `website.*` |
| **Matrix** | [Permissions.md](Permissions.md) |

### Summary

| Permission | Description |
|------------|-------------|
| `website.access` | Module entry — see website admin |
| `website.pages.view` | View pages list and content |
| `website.pages.manage` | Create / update / delete pages |
| `website.pages.publish` | Publish / unpublish pages |
| `website.blog.manage` | Create / edit blog posts |
| `website.blog.publish` | Publish blog posts |
| `website.forms.manage` | Create / edit forms |
| `website.forms.submissions.view` | Read form submissions |
| `website.seo.manage` | Edit SEO meta and redirects |
| `website.domain.manage` | Add / verify / remove domains |
| `website.settings.manage` | Change theme, analytics, scripts |
| `website.ai.access` | Use AI content tools |

### Record Rules

- Pages scoped by `company_id` — cannot view other company's pages
- Form submissions scoped by `company_id`
- Domain records scoped by `tenant_id` (one tenant may have many companies)

---

## 8. UIUX

| Property | Value |
|----------|-------|
| **Admin routes** | `/website/*` |
| **CRUD pattern** | List page + right Sheet drawer (`?create=1` · `?view={id}` · `?edit={id}`) |
| **Builder pattern** | Full-screen builder mode (exception to drawer rule — page builder needs full canvas) |
| **Mobile** | Full-width drawer · 44px tap targets · Builder requires tablet/desktop |

### Standards

- [module-ui-standard.md](../../04-uiux/standards/module-ui-standard.md)
- [layout-architecture.md](../../04-uiux/standards/layout-architecture.md)
- [WORKSPACE_SHELL_ARCHITECTURE.md](../../04-uiux/standards/WORKSPACE_SHELL_ARCHITECTURE.md)

### Build Guides

- Prototype: `04-uiux/prototype/website/`
- Screens: `Menus/` (functional specs — one file per screen)

### Exception: Page Builder UX

The visual page builder (`/website/pages/{id}/builder`) uses **full-screen canvas mode** — not the standard Sheet drawer. This is an approved UIUX exception documented here and in ModuleManifest.md.

---

## 9. AI Integration

| Property | Value |
|----------|-------|
| **Feature gate** | `website.ai.access` |
| **Platform** | [06-ai/platform/AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) |

### Tools & Agents

| Tool ID | Risk | Approval | Description |
|---------|------|----------|-------------|
| `website.ai.page_writer` | low | no | Generate page section copy from prompt |
| `website.ai.blog_writer` | low | no | Draft full blog post from title + outline |
| `website.ai.meta_generator` | low | no | Auto-generate SEO meta title + description |
| `website.ai.image_generator` | low | no | Generate hero/banner images via AI |
| `website.ai.translate_page` | medium | no | Translate page content to another language |
| `website.ai.seo_audit` | low | no | AI-powered SEO suggestions for a page |

**Full registry:** [AI.md](AI.md)

### Rules

- AI calls **module services only** — never direct DB
- Generated content saved as draft — human must publish
- Translation uses Core Localisation engine + AI
- High-risk tools (bulk publish) require [Approval Engine](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md)

---

## 10. Future Scope

### Planned Enhancements

- A/B testing for landing pages
- Heatmap and scroll-depth analytics integration
- Multi-site management (one account → multiple websites)
- E-commerce page embedding (product widgets on website pages)
- Custom code injection (header/footer scripts, CSS overrides)
- White-label builder for agency clients

### Industry Compatibility

| Industry | Website Usage |
|----------|--------------|
| **Hospital** | About, doctors team, services, appointment form |
| **School** | About, admissions, faculty, events, contact |
| **Restaurant** | Menu showcase, reservations form, location |
| **Hotel** | Rooms showcase, amenities, booking inquiry form |
| **NGO** | Mission, programs, donation form, stories |
| **Agency** | Portfolio, services, case studies, contact |
| **Retail** | Brand story, stores locator, careers |

### Deprecations

| Item | Replacement | Target version |
|------|-------------|----------------|
| — | — | — |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md) | Integration matrix |
| [Workflow.md](Workflow.md) | Page & blog state machines |
| [Reports.md](Reports.md) | Traffic & lead reports |
| [Ecommerce Builder](../ecommerce/builder/README.md) | Shop-page builder (separate scope) |
| [Knowledge module](../knowledge/README.md) | KB articles (separate from blog) |

---

**Module:** Website
**Last Updated:** 2026-06-19
**Maintainer:** Website Team
