# AgainERP — Global Menu Structure

> **Status:** Active  
> **Version:** 1.0 · **Date:** 2026-06-19  
> **Step:** 08 — Navigation Architecture  
> **Authority:** [NAVIGATION_ARCHITECTURE.md](./NAVIGATION_ARCHITECTURE.md)

---

## Purpose

Canonical **Level 1 global navigation groups** and **module placement** for the AgainERP sidebar. Modules register into exactly one primary group.

## When To Read

Read when assigning a new module to a global group or validating sidebar structure.

## Related Files

- [MODULE_REGISTRY.md](../../MODULE_REGISTRY.md) — installable module index
- [MODULE_NAVIGATION_STANDARD.md](./MODULE_NAVIGATION_STANDARD.md) — Level 2 zones
- [WORKSPACE_COMPONENT_REGISTRY.md](./WORKSPACE_COMPONENT_REGISTRY.md) — `WS-SIDE-*` IDs

## Read Next

[MODULE_NAVIGATION_STANDARD.md](./MODULE_NAVIGATION_STANDARD.md) for your module only.

---

## 1. Group Index

| # | Group ID | Label | Sidebar section ID |
|---|----------|-------|-------------------|
| 01 | `nav.favorites` | Favorites | `WS-SIDE-FAV` |
| 02 | `nav.workspace-home` | Workspace Home | `WS-SIDE-HOME` |
| 03 | `nav.core-platform` | Core Platform | `WS-SIDE-CORE` |
| 04 | `nav.business-ops` | Business Operations | `WS-SIDE-BIZ` |
| 05 | `nav.commerce` | Commerce | `WS-SIDE-COMMERCE` |
| 06 | `nav.marketing` | Marketing | `WS-SIDE-MARKETING` |
| 07 | `nav.human-resources` | Human Resources | `WS-SIDE-HR` |
| 08 | `nav.productivity` | Productivity | `WS-SIDE-PRODUCTIVITY` |
| 09 | `nav.industry-apps` | Industry Apps | `WS-SIDE-IND` |
| 10 | `nav.administration` | Administration | `WS-SIDE-ADMIN` |

**Empty groups are hidden.** Favorites and Workspace Home are always available when populated.

---

## 2. Group 01 — Favorites

User-curated shortcuts — not module-owned.

| Item type | Source |
|-----------|--------|
| Starred module | Any group |
| Starred screen | Level 3 feature route |
| Pinned report | Reports zone |

Max recommended: **20 items** — overflow to "Show all favorites".

---

## 3. Group 02 — Workspace Home

| Item | Route | Module ID | Notes |
|------|-------|-----------|-------|
| **Workspace Dashboard** | `/home` or `/dashboard` | `platform` | Cross-module KPIs, tasks, AI brief |
| **My Tasks** | `/home/tasks` | `core` | Activities assigned to user |
| **Recent** | — | — | Inline list — last 15 destinations |

Default landing after login when no user preference set.

---

## 4. Group 03 — Core Platform

Always-on capabilities — not uninstallable.

| Item | Module ID | Route | Registry / doc |
|------|-----------|-------|----------------|
| **Dashboard** | `platform` | `/home` | Workspace home overlap OK |
| **AI OS** | `ai` | `/ai-os/*` | [AI_OS_ARCHITECTURE.md](../../06-ai/platform/ai/AI_OS_ARCHITECTURE.md) |
| **Search** | `core` | `Ctrl+K` | Header — not sidebar leaf |
| **Notifications** | `core` | `/notifications` | Core notification engine |
| **Files** | `documents` | `/documents/*` | [documents/README.md](../../03-business-modules/documents/README.md) |
| **Settings** | `core` | `/settings` | User + tenant preferences (non-module) |

**Core entities** (Contacts, Users) accessible via Administration or module Operations — not duplicated here unless platform policy requires.

---

## 5. Group 04 — Business Operations

ERP supply chain, revenue, finance, production.

| Item | Module ID | Route | Status |
|------|-----------|-------|--------|
| **CRM** | `crm` | `/crm/*` | Draft |
| **Sales** | `sales` | `/sales/*` | Draft |
| **Purchase** | `purchase` | `/purchase/*` | Draft |
| **Inventory** | `inventory` | `/inventory/*` | Draft |
| **Finance** | `finance` | `/finance/*` | Draft |
| **Manufacturing** | `manufacturing` | `/manufacturing/*` | Draft |
| **Accounting** | `accounting` | `/accounting/*` | Draft — links to finance SSOT |
| **POS** | `pos` | `/pos/*` | Draft |
| **Business Partners** | `business-partners` | `/partners/*` | Draft |

---

## 6. Group 05 — Commerce

Ecommerce hub and storefront operations. **Sub-features** are Level 3 under `ecommerce` unless promoted to registry.

| Item | Module ID | Route | Notes |
|------|-----------|-------|-------|
| **Ecommerce** | `ecommerce` | `/catalog/*` | **Installable module** — 11/11 package |
| Catalog | `ecommerce` | `/catalog/products` | Level 3 — [catalog/](../../03-business-modules/ecommerce/catalog/) |
| Customers | `ecommerce` | `/catalog/customers` | Level 3 — doc sub-area |
| Orders | `ecommerce` | `/catalog/orders` | Level 3 — Menus/Sales/ |
| Reviews | `ecommerce` | `/catalog/reviews` | Level 3 — when implemented |
| SEO | `ecommerce` | `/catalog/seo` | Level 3 — [seo/](../../03-business-modules/ecommerce/seo/) |
| Builder | `ecommerce` | `/catalog/builder` | Level 3 — [builder/](../../03-business-modules/ecommerce/builder/) |
| **Marketplace** | `marketplace` | `/marketplace/*` | Separate installable — multi-vendor |

**Rule:** Catalog, Customers, Orders, SEO, Builder appear in **Operations** submenu when Ecommerce module selected — not as separate Level 1 roots.

---

## 7. Group 06 — Marketing

| Item | Module ID | Route | Notes |
|------|-----------|-------|-------|
| **Marketing** | `marketing` | `/marketing/*` | Campaigns, journeys, loyalty |
| Campaigns | `marketing` | `/marketing/campaigns` | Level 3 |
| Email Marketing | `marketing` | `/marketing/email` | Level 3 |
| Automation | `marketing` | `/marketing/automation` | Level 3 / zone overlap |
| Loyalty | `marketing` | `/marketing/loyalty` | Level 3 |
| **Sales & Marketing** | `sales-marketing` | `/sales-marketing/*` | RevOps unified workspace |

**Boundary:** Ecommerce `Menus/Marketing/` = commerce-scoped promotions; this group = platform marketing module.

---

## 8. Group 07 — Human Resources

| Item | Module ID | Route | Notes |
|------|-----------|-------|-------|
| **HR** | `hr` | `/hr/*` | Employees, org |
| **Payroll** | `payroll` | `/payroll/*` | Payslips, compliance |
| **HR & Payroll** | `hr-payroll` | `/hr/*` · `/ess/*` | Master architecture doc |
| Attendance | `hr` | `/hr/attendance` | Level 3 |
| Recruitment | `hr` | `/hr/recruitment` | Level 3 |
| **Timesheet** | `timesheet` | `/timesheet/*` | Time tracking — optional link from HR |

---

## 9. Group 08 — Productivity

| Item | Module ID | Route | Notes |
|------|-----------|-------|-------|
| **Project** | `project` | `/project/*` | Projects, tasks |
| **Helpdesk** | `helpdesk` | `/helpdesk/*` | Tickets, SLA |
| **Knowledge** | `knowledge` | `/knowledge/*` | KB articles |
| **Documents** | `documents` | `/documents/*` | Also in Core — primary entry here for DMS UX |
| **BI System** | `bi-system` | `/bi/*` | Dashboards, KPIs |

---

## 10. Group 09 — Industry Apps

Vertical packages — visible only when installed for tenant.

| Item | Module ID | Industry | Status |
|------|-----------|----------|--------|
| **Hospital** | `hospital` | Healthcare | Planned |
| **School** | `school` | Education | Planned |
| **Restaurant** | `restaurant` | F&B | Planned |
| **Real Estate** | `real-estate` | Property | Planned |
| **NGO** | `ngo` | Non-profit | Planned |
| **Fleet** | `fleet` | Logistics | Draft — [fleet/](../../03-business-modules/fleet/) |
| **Courier** | `logistics` | Courier / logistics | Draft — [logistics/](../../03-business-modules/logistics/) |
| **Booking** | `booking` | Appointments | Draft |

Industry modules declare `globalNav.group: industry-apps` in manifest.

---

## 11. Group 10 — Administration

Platform and tenant administration — RBAC restricted.

| Item | Module ID | Route | Permission (typical) |
|------|-----------|-------|----------------------|
| **Users** | `core` | `/admin/users` | `core.user.view` |
| **Roles** | `core` | `/admin/roles` | `core.role.view` |
| **Permissions** | `core` | `/admin/permissions` | `core.permission.view` |
| **Audit Logs** | `core` | `/admin/audit` | `core.audit.view` |
| **Integrations** | `platform` | `/admin/integrations` | `platform.integration.view` |
| **Tenants** | `platform` | `/admin/tenants` | Super-admin only |
| **Billing** | `subscription` | `/admin/billing` | `platform.billing.view` |
| **Modules** | `platform` | `/admin/modules` | Install / enable modules |

---

## 12. Scale Rules (100+ Modules)

| Technique | Detail |
|-----------|--------|
| **Grouping** | Max ~10 top-level groups — modules nest inside |
| **Collapse** | Groups collapsed by default except active group's module |
| **Search** | Sidebar search filters all groups — primary discovery at scale |
| **Pins** | User pins frequent modules to Favorites |
| **Plan filter** | Unlicensed modules never appear in registry merge |
| **Order field** | Manifest `order` integer — avoid pure alphabetical for related modules |

---

## 13. Manifest Registration

```yaml
globalNav:
  group: business-ops    # one of nav.* IDs above
  label: Sales           # sidebar display (optional override)
  icon: shopping-cart
  order: 30
  permission: sales.access
```

Validate group against this document before merging manifest.

---

## Change History

| Date | Version | Change |
|------|---------|--------|
| 2026-06-19 | 1.0 | Step 08 — global menu structure |

---

**Global Menu Structure** — ten groups, one primary home per module.
