# Reports — Website

> **Module:** Website · **Status:** Draft · **Date:** 2026-06-19

## Purpose
Report and analytics catalog for the Website module.

## When To Read
Read for reports, analytics, or dashboard work. Then open ONE linked screen spec.

## Related Files
- [Architecture.md](Architecture.md)
- [UI.md](UI.md)

---

## Report Catalog

### Traffic & Performance

| Report | Route | Description | Refresh |
|--------|-------|-------------|---------|
| **Website Overview** | `/website` (dashboard) | Total visits, page views, bounce rate, avg session | Daily |
| **Page Performance** | `/website/pages` → reports tab | Top pages by views, time on page, exit rate | Daily |
| **Traffic Sources** | `/website/settings` → analytics | Direct, organic, social, referral breakdown | Daily |
| **Device Breakdown** | Dashboard widget | Desktop / mobile / tablet split | Daily |

### Content Reports

| Report | Route | Description | Refresh |
|--------|-------|-------------|---------|
| **Blog Performance** | `/website/blog/posts` → analytics | Post views, shares, read time per post | Daily |
| **Top Blog Posts** | Dashboard widget | Most viewed posts in period | Daily |
| **Portfolio Views** | `/website/portfolio` → analytics | Portfolio item views and click-throughs | Daily |

### Lead & Form Reports

| Report | Route | Description | Refresh |
|--------|-------|-------------|---------|
| **Form Submissions** | `/website/forms/{id}/submissions` | Submission count, by form, by date | Real-time |
| **Lead Conversion Rate** | Dashboard widget | Form views → submissions conversion % | Daily |
| **Form Drop-off** | Form detail screen | Field-level completion analytics | Daily |
| **Leads by Source** | `/website/forms` → reports | Which page/form generated most leads | Weekly |

### SEO Reports

| Report | Route | Description | Refresh |
|--------|-------|-------------|---------|
| **SEO Coverage** | `/website/seo/meta` | % of pages with complete SEO meta | On demand |
| **Broken Links** | `/website/seo` → broken links | Pages with 404 internal links | Weekly |
| **Redirect Usage** | `/website/seo/redirects` | How many times each redirect triggered | Daily |

### Domain & Uptime

| Report | Route | Description | Refresh |
|--------|-------|-------------|---------|
| **Domain Status** | `/website/domain` | SSL status, DNS health, uptime % | Real-time |

---

## Dashboard Widgets

These widgets appear on the Website Dashboard (`/website`):

| Widget | Data | Size |
|--------|------|------|
| Total Page Views | Last 30 days vs previous | Small |
| Form Submissions | Last 30 days + trend | Small |
| Published Pages | Total count | Small |
| Blog Posts This Month | Count | Small |
| Top 5 Pages | By views | Medium |
| Traffic Sources Chart | Pie chart | Medium |
| Lead Conversion Rate | % + trend | Small |
| Recent Form Submissions | Last 10 submissions | Large |

---

**Module:** Website · **Maintainer:** Website Team · **Last Updated:** 2026-06-19
