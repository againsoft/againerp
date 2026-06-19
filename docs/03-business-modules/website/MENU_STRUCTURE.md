# Website Module Menu Structure v1.0

> **Status:** Draft
> **Version:** 1.0
> **Total Screens:** 51

Canonical admin menu tree for the Website module. Every screen has a matching spec file under `Menus/`.

---

```
Website
│
├── Dashboard (1)
│   └── Website Overview
│
├── Pages (6)
│   ├── Page List
│   ├── Page Builder              ← Full-screen canvas (approved exception)
│   ├── Templates
│   ├── Navigation Menus
│   ├── Page Revisions
│   └── Approval Queue
│
├── Blog (8)
│   ├── Posts
│   ├── Add Post
│   ├── Categories
│   ├── Tags
│   ├── Authors
│   ├── Comments
│   ├── Scheduled Posts
│   └── Blog Settings
│
├── Portfolio (5)
│   ├── Portfolio List
│   ├── Add Portfolio Item
│   ├── Categories
│   ├── Portfolio Settings
│   └── Portfolio Gallery
│
├── Team (4)
│   ├── Team Members
│   ├── Departments
│   ├── Career Listings
│   └── Job Applications
│
├── Forms (6)
│   ├── Form List
│   ├── Form Builder
│   ├── Form Submissions
│   ├── Form Analytics
│   ├── Newsletter Subscribers
│   └── Form Settings
│
├── SEO (8)
│   ├── SEO Dashboard
│   ├── Meta Manager
│   ├── URL Redirects
│   ├── Sitemap Manager
│   ├── Robots.txt Manager
│   ├── Schema Manager
│   ├── Broken Link Checker
│   └── SEO Audit
│
├── Domain (4)
│   ├── Domain Manager
│   ├── SSL Certificates
│   ├── DNS Records
│   └── Subdomain Manager
│
├── AI Tools (5)
│   ├── AI Dashboard
│   ├── Page Writer
│   ├── Blog Writer
│   ├── Image Generator
│   └── SEO Generator
│
└── Settings (4)
    ├── General Settings
    ├── Theme & Branding
    ├── Analytics & Scripts
    └── Social Media
```

---

## Menu Groups Summary

| Group | Screens | Folder |
|-------|---------|--------|
| Dashboard | 1 | `Menus/Dashboard/` |
| Pages | 6 | `Menus/Pages/` |
| Blog | 8 | `Menus/Blog/` |
| Portfolio | 5 | `Menus/Portfolio/` |
| Team | 4 | `Menus/Team/` |
| Forms | 6 | `Menus/Forms/` |
| SEO | 8 | `Menus/SEO/` |
| Domain | 4 | `Menus/Domain/` |
| AI Tools | 5 | `Menus/AI/` |
| Settings | 4 | `Menus/Settings/` |
| **Total** | **51** | |

---

## Core Entity Screens

These Website menus are UI entry points to Core shared entities — schema owned by Core, not Website:

| Website Menu | Core Entity |
|--------------|-------------|
| Forms → Form Submissions | `contacts` |
| Settings → General | `companies` |
| Blog → Authors | `users` |
| Pages → Approval Queue | Core Approval Engine |

---

**Last Updated:** 2026-06-19
