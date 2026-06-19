# AI — Website

> **Module:** Website · **Feature Gate:** `website.ai.access` · **Status:** Draft · **Date:** 2026-06-19

## Purpose
AI tool index for the Website module. Lists all registered AI tools, their risk level, and approval requirements.

## When To Read
Read for AI feature work in the Website module. Then open ONE linked screen spec.

## Related Files
- [Architecture.md §9](Architecture.md#9-ai-integration)
- [AI OS Platform](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md)

---

## Platform Rules

- All AI tools call **module services only** — never direct DB access
- Generated content saved as **draft** — human must review and publish
- AI actions consume **tenant AI credits**
- High-risk tools require [Approval Engine](../../02-core-platform/engines/APPROVAL_ENGINE_ARCHITECTURE.md)

---

## Registered Tools

### Content Generation

| Tool ID | Screen | Risk | Approval | Credits | Description |
|---------|--------|------|----------|---------|-------------|
| `website.ai.page_writer` | AI Tools → Page Writer | low | ❌ no | 2 | Generate page section copy from a prompt and tone |
| `website.ai.blog_writer` | AI Tools → Blog Writer | low | ❌ no | 5 | Draft complete blog post from title + outline |
| `website.ai.blog_intro` | Blog post editor | low | ❌ no | 1 | Generate blog post introduction paragraph |
| `website.ai.heading_generator` | Page builder | low | ❌ no | 1 | Generate heading variants for a section |
| `website.ai.cta_writer` | Page builder | low | ❌ no | 1 | Generate call-to-action button text and sub-copy |

### SEO Tools

| Tool ID | Screen | Risk | Approval | Credits | Description |
|---------|--------|------|----------|---------|-------------|
| `website.ai.meta_generator` | SEO → Meta Manager | low | ❌ no | 1 | Auto-generate SEO meta title + description for a page |
| `website.ai.schema_generator` | SEO → Schema Manager | low | ❌ no | 2 | Generate JSON-LD schema markup for a page |
| `website.ai.seo_audit` | SEO → SEO Audit | low | ❌ no | 3 | AI-powered SEO improvement suggestions |
| `website.ai.keyword_suggestions` | SEO → Keyword Tracking | low | ❌ no | 2 | Suggest target keywords based on page content |

### Media & Design

| Tool ID | Screen | Risk | Approval | Credits | Description |
|---------|--------|------|----------|---------|-------------|
| `website.ai.image_generator` | AI Tools → Image Gen | low | ❌ no | 5 | Generate hero images, banners, illustrations |
| `website.ai.image_alt_text` | Media Library | low | ❌ no | 1 | Auto-generate alt text for uploaded images |
| `website.ai.banner_generator` | Page builder | low | ❌ no | 3 | Generate promotional banner with text overlay |

### Translation

| Tool ID | Screen | Risk | Approval | Credits | Description |
|---------|--------|------|----------|---------|-------------|
| `website.ai.translate_page` | Pages → Translate | medium | ❌ no | 10 | Translate full page content to another language |
| `website.ai.translate_blog` | Blog → Translate | medium | ❌ no | 8 | Translate blog post to another language |

### Bulk / High-Risk Tools

| Tool ID | Screen | Risk | Approval | Credits | Description |
|---------|--------|------|----------|---------|-------------|
| `website.ai.bulk_meta_generate` | SEO → Meta Manager | high | ✅ yes | 1/page | Generate meta for all pages missing SEO data |
| `website.ai.bulk_translate_site` | Settings → Language | high | ✅ yes | varies | Translate entire website to a new language |

---

## AI Screens

| Screen | Route | Description |
|--------|-------|-------------|
| AI Tools Dashboard | `/website/ai` | Tool launcher, credit usage, history |
| Page Writer | `/website/ai?tool=page_writer` | Generate page sections |
| Blog Writer | `/website/ai?tool=blog_writer` | Draft blog posts |
| Image Generator | `/website/ai?tool=image_generator` | Create AI images |
| SEO Generator | `/website/ai?tool=seo_generator` | Batch SEO meta generation |

---

**Module:** Website · **Maintainer:** Website Team · **Last Updated:** 2026-06-19
