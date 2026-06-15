# Ecommerce Module Structure v1.0

> **Status:** Draft  
> **Version:** 1.0  
> **Total Screens:** 167

Canonical menu tree for AgainERP Ecommerce admin. Every screen has a matching file under `Menus/`.

---

```
Ecommerce
│
├── Dashboard (8)
│   ├── Overview
│   ├── Sales Analytics
│   ├── Revenue Analytics
│   ├── Customer Analytics
│   ├── Product Analytics
│   ├── Inventory Alerts
│   ├── Recent Orders
│   └── Activity Logs
│
├── Catalog (21)
│   ├── Products (6)
│   │   ├── Product List
│   │   ├── Add Product
│   │   ├── Bulk Import
│   │   ├── Bulk Export
│   │   ├── Product Approval
│   │   └── Product History
│   ├── Categories
│   ├── Brands
│   ├── Attributes
│   ├── Attribute Groups
│   ├── Variants
│   ├── Filters
│   ├── Tags                    → Core [tags](../../core/entities/tags.md)
│   ├── Product Collections
│   ├── Product Bundles
│   ├── Related Products
│   ├── Reviews
│   ├── Questions & Answers
│   └── Product Comparison
│
├── Inventory (8)
│   ├── Stock Management
│   ├── Warehouses
│   ├── Stock Adjustment
│   ├── Stock Transfer
│   ├── Low Stock Alerts
│   ├── Supplier Stock Feed
│   ├── Purchase Suggestions
│   └── Barcode Management
│
├── Sales (9)
│   ├── Orders
│   ├── Order Status
│   ├── Returns
│   ├── Refunds
│   ├── Invoices
│   ├── Transactions
│   ├── Abandoned Carts
│   ├── Quotations
│   └── POS Orders
│
├── Customers (9)
│   ├── Customers                 → Core [contacts](../../core/entities/contacts.md)
│   ├── Customer Groups
│   ├── Customer Wallet
│   ├── Reward Points
│   ├── Wishlists
│   ├── Saved Carts
│   ├── Customer Activities       → Core [activities](../../core/entities/activities.md)
│   ├── Customer Support Tickets
│   └── Customer Addresses        → Core [addresses](../../core/entities/addresses.md)
│
├── Marketing (16)
│   ├── Coupons
│   ├── Vouchers
│   ├── Promotions
│   ├── Flash Sales
│   ├── Special Offers
│   ├── Campaign Manager
│   ├── Email Marketing
│   ├── SMS Marketing
│   ├── WhatsApp Marketing
│   ├── Push Notifications
│   ├── Affiliate Program
│   ├── Referral Program
│   ├── Loyalty Program
│   ├── Abandoned Cart Recovery
│   ├── Popup Manager
│   └── Announcement Bar
│
├── Content (10)
│   ├── Pages
│   ├── Blog Posts
│   ├── Blog Categories
│   ├── Blog Comments
│   ├── FAQs
│   ├── Testimonials
│   ├── Team Members
│   ├── Announcements
│   ├── News
│   └── Custom HTML Blocks
│
├── Builder (14)
│   ├── Theme Manager
│   ├── Template Manager
│   ├── Header Builder
│   ├── Footer Builder
│   ├── Homepage Builder
│   ├── Landing Page Builder
│   ├── Product Page Builder
│   ├── Category Page Builder
│   ├── Checkout Builder
│   ├── Widget Builder
│   ├── Menu Builder
│   ├── Form Builder
│   ├── Popup Builder
│   └── Block Library
│
├── SEO (12)
│   ├── SEO Dashboard
│   ├── Meta Manager
│   ├── URL Manager
│   ├── Redirect Manager
│   ├── Schema Manager
│   ├── Sitemap Manager
│   ├── Robots Manager
│   ├── Internal Linking
│   ├── Broken Link Checker
│   ├── Keyword Tracking
│   ├── SEO Audit
│   └── Page Speed Analysis
│
├── AI (15)
│   ├── AI Dashboard
│   ├── AI Product Description
│   ├── AI Blog Writer
│   ├── AI SEO Generator
│   ├── AI Meta Generator
│   ├── AI Product Tags
│   ├── AI Review Summary
│   ├── AI Customer Support
│   ├── AI Translation
│   ├── AI Image Generation
│   ├── AI Banner Generator
│   ├── AI Sales Forecast
│   ├── AI Inventory Forecast
│   ├── AI Product Recommendation
│   └── AI Analytics Assistant
│
├── Media (9)
│   ├── Media Library             → Core [media-library](../../core/entities/media-library.md)
│   ├── Images
│   ├── Videos
│   ├── Documents
│   ├── Folders
│   ├── CDN Manager
│   ├── Image Optimizer
│   ├── Watermark Manager
│   └── Media Usage Tracker
│
├── Reports (14)
│   ├── Sales Reports
│   ├── Product Reports
│   ├── Category Reports
│   ├── Brand Reports
│   ├── Customer Reports
│   ├── Marketing Reports
│   ├── Inventory Reports
│   ├── Return Reports
│   ├── Profit Reports
│   ├── Tax Reports
│   ├── Affiliate Reports
│   ├── SEO Reports
│   ├── AI Reports
│   └── Custom Reports
│
└── System (24)
    ├── General Settings
    ├── Store Settings
    ├── Company Settings          → Core [companies](../../core/entities/companies.md)
    ├── Branch Settings           → Core [branches](../../core/entities/branches.md)
    ├── Localization
    ├── Languages
    ├── Currencies
    ├── Taxes
    ├── Email Settings
    ├── SMS Settings
    ├── WhatsApp Settings
    ├── Payment Gateways
    ├── Shipping Methods
    ├── Shipping Zones
    ├── User Management           → Core [users](../../core/entities/users.md)
    ├── Roles                     → Core [roles](../../core/entities/roles.md)
    ├── Permissions               → Core [permissions](../../core/entities/permissions.md)
    ├── Activity Logs
    ├── Audit Logs
    ├── API Management
    ├── Backup Manager
    ├── Cron Jobs
    ├── Cache Manager
    └── Security Settings
```

---

## Menu Groups Summary

| Group | Screens | Folder |
|-------|---------|--------|
| Dashboard | 8 | `Menus/Dashboard/` |
| Catalog | 21 | `Menus/Catalog/` |
| Inventory | 8 | `Menus/Inventory/` |
| Sales | 9 | `Menus/Sales/` |
| Customers | 9 | `Menus/Customers/` |
| Marketing | 16 | `Menus/Marketing/` |
| Content | 10 | `Menus/Content/` |
| Builder | 14 | `Menus/Builder/` |
| SEO | 12 | `Menus/SEO/` |
| AI | 15 | `Menus/AI/` |
| Media | 9 | `Menus/Media/` |
| Reports | 14 | `Menus/Reports/` |
| System | 24 | `Menus/System/` |
| **Total** | **167** | |

---

## Core Entity Screens

These Ecommerce menus are **UI entry points** to Core shared entities — schema owned by Core, not Ecommerce:

| Ecommerce Menu | Core Entity |
|----------------|-------------|
| Catalog → Tags | `tags` |
| Customers → Customers | `contacts` |
| Customers → Customer Addresses | `addresses` |
| Customers → Customer Activities | `activities` |
| Media → Media Library | `media` |
| System → Company Settings | `companies` |
| System → Branch Settings | `branches` |
| System → User Management | `users` |
| System → Roles | `roles` |
| System → Permissions | `permissions` |

---

**Last Updated:** 2026-06-12
