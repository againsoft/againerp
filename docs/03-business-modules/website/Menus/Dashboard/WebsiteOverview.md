# Website Overview — Dashboard

> **Module:** Website · **Screen:** Dashboard · **Route:** `/website` · **Status:** Draft

## Purpose
Main entry screen for the Website module — traffic overview, lead stats, content summary.

## Layout
Full-page dashboard with widget grid. No Sheet drawer.

## Widgets

| Widget | Data Source | Size |
|--------|-------------|------|
| Total Page Views (30d) | Analytics snapshot | Small |
| Form Submissions (30d) | `website_form_submissions` | Small |
| Published Pages | `website_pages` count | Small |
| Blog Posts This Month | `website_blog_posts` count | Small |
| Top 5 Pages by Views | Analytics | Medium |
| Traffic Sources Chart | Analytics | Medium |
| Lead Conversion Rate | Forms analytics | Small |
| Recent Form Submissions | Last 10 rows | Large |
| Domain Status | `website_domains` | Small |

## Actions
- Quick links: New Page, New Blog Post, View Submissions
- Period selector: 7d / 30d / 90d / Custom
