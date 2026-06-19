# Meta Manager — SEO

> **Module:** Website · **Screen:** Meta Manager · **Route:** `/website/seo/meta` · **Status:** Draft

## Purpose
Manage SEO meta tags for all website pages from a single screen.

## Layout
List page showing all pages + SEO completion status. Edit via right Sheet drawer.

## Table Columns
`Page Title` · `Slug` · `Meta Title` · `Meta Description` · `OG Image` · `SEO Score` · `Actions`

## SEO Score Logic
- ✅ Green (80-100): Meta title + description + OG image all filled
- ⚠️ Yellow (50-79): Partially filled
- ❌ Red (0-49): Missing critical meta

## Sheet — SEO Meta Fields
- Meta Title (max 60 chars — character counter)
- Meta Description (max 160 chars — character counter)
- OG Image (media picker — recommended 1200×630px)
- Canonical URL (optional override)
- Index / No-index toggle
- Schema Type (dropdown: Article, WebPage, LocalBusiness, etc.)

## Actions
- **AI Generate** → auto-fill meta from page content (`website.ai.meta_generator`)
- **Bulk AI Generate** → fill all empty pages (high-risk, requires approval)
- **Preview** → Google SERP snippet preview

## Filters
SEO Score (complete / partial / missing) · Page status
