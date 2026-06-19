# UI — Website

> **Module:** Website · **Routes:** `/website/*` · **Status:** Active · **Date:** 2026-06-19

## Purpose
Admin navigation map and screen inventory for the Website module.

## When To Read
Read for UI, admin screen, or navigation work. Then open ONE file from `Menus/` for the specific screen.

## Related Files
- [Architecture.md §8](Architecture.md#8-uiux)
- [MENU_STRUCTURE.md](MENU_STRUCTURE.md)
- [Menus/](Menus/)

---

## Admin Route Namespace

All Website admin routes are under `(admin)/website/` in the Next.js App Router.

```
app/(admin)/website/
├── page.tsx                    → /website (Dashboard)
├── pages/
│   ├── page.tsx                → /website/pages (Page List)
│   └── [id]/
│       └── builder/
│           └── page.tsx        → /website/pages/{id}/builder (Full-screen builder)
├── blog/
│   ├── posts/page.tsx          → /website/blog/posts
│   └── categories/page.tsx     → /website/blog/categories
├── portfolio/page.tsx          → /website/portfolio
├── team/page.tsx               → /website/team
├── careers/page.tsx            → /website/careers
├── forms/
│   ├── page.tsx                → /website/forms
│   └── [id]/submissions/
│       └── page.tsx            → /website/forms/{id}/submissions
├── media/page.tsx              → /website/media
├── seo/
│   ├── meta/page.tsx           → /website/seo/meta
│   ├── redirects/page.tsx      → /website/seo/redirects
│   ├── sitemap/page.tsx        → /website/seo/sitemap
│   └── robots/page.tsx         → /website/seo/robots
├── domain/page.tsx             → /website/domain
├── ai/page.tsx                 → /website/ai
└── settings/page.tsx           → /website/settings
```

---

## Navigation Map (Sidebar)

| Section | Screen | Route | Sheet Pattern |
|---------|--------|-------|---------------|
| **Dashboard** | Website Dashboard | `/website` | — (full page) |
| **Pages** | Page List | `/website/pages` | `?create=1` · `?edit={id}` |
| | Page Builder | `/website/pages/{id}/builder` | ⚠️ Full-screen (exception) |
| **Blog** | Posts | `/website/blog/posts` | `?create=1` · `?edit={id}` |
| | Categories | `/website/blog/categories` | `?create=1` · `?edit={id}` |
| **Portfolio** | Portfolio | `/website/portfolio` | `?create=1` · `?edit={id}` |
| **Team** | Team Members | `/website/team` | `?create=1` · `?edit={id}` |
| | Careers | `/website/careers` | `?create=1` · `?edit={id}` |
| **Forms** | Form List | `/website/forms` | `?create=1` · `?edit={id}` |
| | Submissions | `/website/forms/{id}/submissions` | `?view={id}` |
| **SEO** | Meta Manager | `/website/seo/meta` | `?edit={page_id}` |
| | Redirects | `/website/seo/redirects` | `?create=1` · `?edit={id}` |
| | Sitemap | `/website/seo/sitemap` | — (settings page) |
| | Robots.txt | `/website/seo/robots` | — (editor page) |
| **Domain** | Domains | `/website/domain` | `?add=1` · `?view={id}` |
| **AI** | AI Tools | `/website/ai` | — (tool launcher) |
| **Settings** | Settings | `/website/settings` | — (tab sections) |

**Total screens: 18**

---

## CRUD Pattern (Standard)

All screens follow the AgainERP standard:

| Action | URL | Component |
|--------|-----|-----------|
| List | `/website/{entity}` | Table / AG Grid |
| Create | `?create=1` | Right Sheet — form |
| View | `?view={id}` | Right Sheet — read-only |
| Edit | `?edit={id}` | Right Sheet — form |

**Exception — Page Builder:** Uses full-screen canvas mode at `/website/pages/{id}/builder`. This is the only screen that breaks the Sheet drawer rule (approved exception in ModuleManifest.md).

---

## Component Locations

```
components/website/
├── dashboard/
│   └── website-dashboard.tsx
├── pages/
│   ├── page-list.tsx
│   ├── page-sheet.tsx
│   └── page-builder/
│       ├── builder-canvas.tsx
│       ├── block-library.tsx
│       └── builder-toolbar.tsx
├── blog/
│   ├── post-list.tsx
│   └── post-sheet.tsx
├── portfolio/
│   └── portfolio-list.tsx
├── team/
│   ├── team-list.tsx
│   └── career-list.tsx
├── forms/
│   ├── form-list.tsx
│   ├── form-builder.tsx
│   └── submission-list.tsx
├── seo/
│   ├── meta-manager.tsx
│   └── redirect-manager.tsx
├── domain/
│   └── domain-manager.tsx
└── settings/
    └── website-settings.tsx
```

---

## Mock Data Location

```
lib/mock-data/
├── website-pages.ts
├── website-blog-posts.ts
├── website-portfolio.ts
├── website-team.ts
├── website-forms.ts
└── website-settings.ts
```

---

## Mobile Rules

- All Sheet drawers → full-width on mobile (`w-full`)
- Page Builder → requires minimum tablet width (768px) — show warning on mobile
- 44px minimum tap targets on all interactive elements
- Sidebar collapses to hamburger on mobile

---

## Build Guides

- Prototype: `04-uiux/prototype/website/`
- Screen specs: `Menus/` — open ONE file per screen

---

**Module:** Website · **Maintainer:** Website Team · **Last Updated:** 2026-06-19
