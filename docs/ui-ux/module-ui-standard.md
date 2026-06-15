# Module UI Structure Standard

> **Status:** Draft  
> **Parent:** [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)  
> **Module structure:** [MODULE_STRUCTURE.md](../MODULE_STRUCTURE.md)

---

## Purpose

Every AgainERP module must implement the **same view types**. No custom page patterns.

---

## Required Views

| View | Route Pattern | Description |
|------|---------------|-------------|
| **Dashboard** | `/{module}/dashboard` | KPIs, widgets, activity |
| **List View** | `/{module}/{entity}` | Searchable table |
| **Create View** | `/{module}/{entity}/create` | New record form |
| **Edit View** | `/{module}/{entity}/{id}/edit` | Edit existing (or same as details) |
| **Details View** | `/{module}/{entity}/{id}` | Record page + tabs + chatter |
| **Reports** | `/{module}/reports` | Module reports index |
| **Settings** | `/{module}/settings` | Module configuration |

---

## Cross-Cutting (Core)

| Feature | Provided By |
|---------|-------------|
| **Activities** | Core chatter panel |
| **Audit History** | Core timeline tab |
| **Comments / Notes** | Core chatter |
| **Attachments** | Core chatter |
| **Permissions** | Core RBAC |

Modules do not rebuild these.

---

## Module Checklist

- [ ] Dashboard with role-based default widgets
- [ ] List view with filters, export, bulk actions
- [ ] Create/edit forms with validation + draft mode
- [ ] Details view with tabs + smart buttons + chatter
- [ ] Reports linked from Reports menu group
- [ ] Settings screen for module config
- [ ] Menu tree in `ModuleManifest.md`
- [ ] `UI.md` documents tab sets and smart buttons
- [ ] All screens in `Menus/*.md` with Page Layout section

---

## View Naming

| Entity | List | Create | Details |
|--------|------|--------|---------|
| Product | Product List | Create Product | Product Details |
| Order | Orders | Create Order | Order Details |
| Contact | Customers | Create Customer | Customer Details |

Consistent: `{Entity} List`, `Create {Entity}`, `{Entity} Details`

---

## New Module Process

1. Copy view patterns from Ecommerce Catalog or Orders
2. Register menus in `ModuleManifest.md`
3. Document in `Architecture.md` and `UI.md`
4. **Do not** create new shell layouts
5. Propose UI changes via update to [ENTERPRISE_UI_ARCHITECTURE.md](./ENTERPRISE_UI_ARCHITECTURE.md)

---

## Modules Using This Standard

Dashboard · Catalog · Customers · Orders · Inventory · Marketing · Media · SEO · Builder · CRM · Sales · Purchase · Accounting · POS · HR · Payroll · Projects · Helpdesk · Documents · Knowledge · AI · Reports · System
