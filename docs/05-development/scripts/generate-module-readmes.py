#!/usr/bin/env python3
"""
Generate standardized module README.md entry points (Step 03).
Path: docs/03-business-modules/{module}/README.md
"""
from __future__ import annotations

from pathlib import Path

DOCS = Path(__file__).resolve().parents[2]
MODULES_ROOT = DOCS / "03-business-modules"

# Architecture filename per module
ARCH = {
    "crm": "CRM_MODULE_ARCHITECTURE.md",
    "sales": "SALES_MODULE_ARCHITECTURE.md",
    "purchase": "PURCHASE_MODULE_ARCHITECTURE.md",
    "inventory": "INVENTORY_MODULE_ARCHITECTURE.md",
    "finance": "FINANCE_MODULE_ARCHITECTURE.md",
    "marketing": "MARKETING_MODULE_ARCHITECTURE.md",
    "hr-payroll": "HR_PAYROLL_MASTER_ARCHITECTURE.md",
    "accounting": "Architecture.md",
    "manufacturing": "ARCHITECTURE.md",
    "pos": "Architecture.md",
    "hr": "Architecture.md",
    "payroll": "Architecture.md",
    "project": "Architecture.md",
    "timesheet": "Architecture.md",
    "business-partners": "Architecture.md",
    "product-configurator": "Architecture.md",
    "helpdesk": "Architecture.md",
    "documents": "Architecture.md",
    "knowledge": "Architecture.md",
    "bi-system": "ARCHITECTURE.md",
    "data-warehouse": "ARCHITECTURE.md",
    "fleet": "ARCHITECTURE.md",
    "logistics": "ARCHITECTURE.md",
    "booking": "ARCHITECTURE.md",
    "marketplace": "ARCHITECTURE.md",
    "subscription": "ARCHITECTURE.md",
    "ecommerce": "Architecture.md",
    "sales-marketing": "SMW_UI_BUILD_GUIDE.md",  # architecture pending; README is entry
}

META: dict[str, dict] = {
    "crm": {
        "name": "CRM",
        "purpose": "AI-first Customer Intelligence — leads, accounts, opportunities, pipeline, and customer 360.",
        "features": [
            "Lead capture, scoring, assignment, conversion",
            "Accounts, contacts, opportunities, pipelines",
            "Activities, tasks, meetings, calls, timeline",
            "Customer intelligence dashboards and AI insights",
            "Integration with Sales, Marketing, Ecommerce, AI OS",
        ],
        "depends_on": "Core (Users, Permissions, Contacts, Activities, Workflow, Search, Notifications)",
        "provides_to": "Sales (conversion), Marketing (segments)",
        "consumes_from": "Sales (order history), Marketing (campaign response), Core Contacts",
        "events_produced": "`crm.lead.*`, `crm.opportunity.*`, `crm.account.updated`",
        "events_consumed": "`core.contact.created`, `commerce.order.paid`, `marketing.campaign.clicked`, `sales.order.confirmed`",
        "route": "/crm/*",
        "api": "/api/v1/crm/",
        "prefix": "crm_*",
        "status": "Draft",
        "ui": "../../04-uiux/prototype/crm/",
    },
    "sales": {
        "name": "Sales",
        "purpose": "Quotations, sales orders, delivery, invoicing, and revenue documents.",
        "features": [
            "Quotations and sales orders",
            "Delivery, invoicing, payments, returns",
            "Pricing, discounts, sales teams",
            "Order history for CRM and Marketing attribution",
        ],
        "depends_on": "Core + Catalog + Inventory + CRM (services)",
        "provides_to": "Finance, Inventory, CRM, Marketing",
        "consumes_from": "Catalog, Inventory, CRM, Core Contacts",
        "events_produced": "`sales.quotation.sent`, `sales.order.confirmed`, `sales.invoice.posted`, `sales.payment.received`",
        "events_consumed": "`crm.lead.converted`, `crm.opportunity.won`, `commerce.order.placed`, `inventory.stock_level.updated`",
        "route": "/sales/*",
        "api": "/api/v1/sales/",
        "prefix": "sales_*",
        "status": "Draft",
        "ui": "../../04-uiux/prototype/sales/",
    },
    "purchase": {
        "name": "Purchase",
        "purpose": "Procurement — RFQ, purchase orders, receipts, vendor bills.",
        "features": [
            "RFQ and vendor quotations",
            "Purchase orders and approvals",
            "Goods receipt and vendor bills",
            "Vendor management via Core contacts / Business Partners",
        ],
        "depends_on": "Core + Catalog + Inventory + Contacts",
        "provides_to": "Inventory (receipts), Finance (bills)",
        "consumes_from": "Catalog, Inventory, Contacts, Business Partners (optional)",
        "events_produced": "`purchase.order.created`, `purchase.receipt.posted`, `purchase.bill.posted`",
        "events_consumed": "`inventory.reorder.suggested`, `core.approval.approved`, `finance.payment.posted`",
        "route": "/purchase/*",
        "api": "/api/v1/purchase/",
        "prefix": "purchase_*",
        "status": "Draft",
        "ui": "../../04-uiux/prototype/purchase/",
    },
    "inventory": {
        "name": "Inventory",
        "purpose": "Stock truth layer — warehouses, movements, reservations, adjustments (independent of Ecommerce UI).",
        "features": [
            "Warehouses, locations, stock ledger",
            "Receipts, deliveries, internal transfers",
            "Reservations, adjustments, reorder rules",
            "Multi-warehouse availability for Sales, Catalog, Manufacturing",
        ],
        "depends_on": "Core + Catalog (variant refs via services)",
        "provides_to": "Catalog, Sales, Purchase, Finance, Manufacturing",
        "consumes_from": "Catalog, Purchase receipts, Sales order lines",
        "events_produced": "`inventory.movement.posted`, `inventory.stock_level.updated`, `inventory.reservation.*`",
        "events_consumed": "`catalog.product.published`, `purchase.receipt.posted`, `sales.order.confirmed`",
        "route": "/inventory/*",
        "api": "/api/v1/inventory/",
        "prefix": "inventory_*",
        "status": "Draft",
        "ui": "../../04-uiux/prototype/inventory/",
    },
    "finance": {
        "name": "Finance",
        "purpose": "Treasury, AR/AP, journals, budgets, and financial planning.",
        "features": ["General ledger posting", "Invoices and payments", "AR/AP dashboards", "Period close"],
        "depends_on": "Core + Workflow + Approvals",
        "provides_to": "All modules requiring GL / AR / AP status",
        "consumes_from": "Sales, Purchase, Inventory (via services)",
        "events_produced": "`finance.journal.posted`, `finance.invoice.posted`, `finance.payment.*`",
        "events_consumed": "`sales.invoice.posted`, `purchase.bill.posted`, `inventory.adjustment.posted`",
        "route": "/finance/*",
        "api": "/api/v1/finance/",
        "prefix": "finance_*",
        "status": "Draft",
        "ui": None,
    },
    "accounting": {
        "name": "Accounting",
        "purpose": "Chart of accounts, journals, and statutory accounting.",
        "features": ["Chart of accounts", "Journal entries", "Financial statements"],
        "depends_on": "Core + Finance",
        "provides_to": "Finance, compliance reporting",
        "consumes_from": "Finance posting events",
        "events_produced": "Accounting period and journal events (see Architecture)",
        "events_consumed": "Finance posting events",
        "route": "/accounting/*",
        "api": "/api/v1/accounting/",
        "prefix": "accounting_*",
        "status": "Draft",
        "ui": None,
    },
    "manufacturing": {
        "name": "Manufacturing",
        "purpose": "BOM, routings, work orders, MRP, and production.",
        "features": ["BOM and routings", "Work orders and shop floor", "MRP and production planning"],
        "depends_on": "Core + Inventory + Catalog + Purchase",
        "provides_to": "Inventory (finished goods movements)",
        "consumes_from": "Inventory, Catalog, Purchase",
        "events_produced": "Manufacturing order and consumption events (see Architecture)",
        "events_consumed": "Inventory and purchase events",
        "route": "/manufacturing/*",
        "api": "/api/v1/manufacturing/",
        "prefix": "manufacturing_*",
        "status": "Draft",
        "ui": "../../04-uiux/prototype/manufacturing/",
    },
    "pos": {
        "name": "Point of Sale",
        "purpose": "Retail POS sessions, cart, payments, and receipts.",
        "features": ["POS sessions and registers", "Offline-capable cart", "Receipts and cash management"],
        "depends_on": "Core + Sales + Inventory + Catalog",
        "provides_to": "Sales, Inventory",
        "consumes_from": "Catalog, Inventory, Sales services",
        "events_produced": "POS order and payment events (see Architecture)",
        "events_consumed": "Inventory stock updates",
        "route": "/pos/*",
        "api": "/api/v1/pos/",
        "prefix": "pos_*",
        "status": "Draft",
        "ui": None,
    },
    "hr": {
        "name": "Human Resources",
        "purpose": "Employees, org structure, attendance, leave, and workforce lifecycle.",
        "features": ["Employee records and org chart", "Attendance and leave", "Recruitment and onboarding"],
        "depends_on": "Core (Contacts, Users, Permissions, Workflow)",
        "provides_to": "Payroll, Project, Timesheet",
        "consumes_from": "Core Contacts (person identity)",
        "events_produced": "HR workforce events (see HR master architecture)",
        "events_consumed": "Core user and contact events",
        "route": "/hr/*",
        "api": "/api/v1/hr/",
        "prefix": "hr_*",
        "status": "Draft",
        "ui": "../../04-uiux/prototype/",
        "master": "../hr-payroll/HR_PAYROLL_MASTER_ARCHITECTURE.md",
    },
    "payroll": {
        "name": "Payroll",
        "purpose": "Salary structures, payslips, compliance, and payroll runs.",
        "features": ["Salary structures and components", "Payslip generation", "Statutory compliance"],
        "depends_on": "Core + HR",
        "provides_to": "Finance (payroll journals)",
        "consumes_from": "HR (attendance, leave, employee data)",
        "events_produced": "Payroll run and payslip events (see HR master architecture)",
        "events_consumed": "HR attendance and leave events",
        "route": "/payroll/*",
        "api": "/api/v1/payroll/",
        "prefix": "payroll_*",
        "status": "Draft",
        "ui": None,
        "master": "../hr-payroll/HR_PAYROLL_MASTER_ARCHITECTURE.md",
    },
    "hr-payroll": {
        "name": "HR & Payroll (Master)",
        "purpose": "Unified workforce suite — master architecture spanning HR and Payroll domains.",
        "features": [
            "Workforce lifecycle hire-to-exit",
            "Time, attendance, leave, payroll",
            "ESS portal `/ess/*`",
            "Deep-dive subsystem architecture docs",
        ],
        "depends_on": "Core (Contacts, Users, Workflow, Approvals, Activity)",
        "provides_to": "Project, Finance, Accounting",
        "consumes_from": "Core only (no cross-module DB)",
        "events_produced": "HR and payroll domain events — see master doc §Events",
        "events_consumed": "Core approval and contact events",
        "route": "/hr/* · /payroll/* · /ess/*",
        "api": "/api/v1/hr/ · /api/v1/payroll/",
        "prefix": "hr_* · payroll_*",
        "status": "Draft",
        "ui": None,
    },
    "marketing": {
        "name": "Marketing",
        "purpose": "Marketing automation — campaigns, journeys, audiences, loyalty (standalone module at `/marketing/*`).",
        "features": [
            "Campaigns, email/SMS/push",
            "Audiences and segmentation",
            "Journeys, coupons, loyalty programs",
            "AI content and churn insights",
        ],
        "depends_on": "Core + Contacts + Media + Catalog (service)",
        "provides_to": "CRM, Sales, Ecommerce promotions",
        "consumes_from": "Catalog, CRM segments, Commerce order events",
        "events_produced": "`marketing.campaign.*`, `marketing.coupon.*`, `marketing.loyalty.*`",
        "events_consumed": "`catalog.product.published`, `crm.contact.updated`, `commerce.order.*`",
        "route": "/marketing/*",
        "api": "/api/v1/marketing/",
        "prefix": "marketing_*",
        "status": "Draft",
        "ui": "../../04-uiux/prototype/marketing/",
    },
    "sales-marketing": {
        "name": "Sales & Marketing Workspace",
        "purpose": "Unified RevOps UI — leads, pipeline, quotations, campaigns, commission (prototype workspace).",
        "features": [
            "Leads and opportunity pipeline",
            "Quotations and sales activities",
            "Campaigns and targets",
            "Commission and RevOps reporting",
        ],
        "depends_on": "CRM, Sales, Marketing (services) + Core",
        "provides_to": "Revenue operations UI shell",
        "consumes_from": "CRM, Sales, Marketing APIs",
        "events_produced": "Workspace-level events TBD — see UI build guide",
        "events_consumed": "CRM and Sales domain events",
        "route": "/sales-marketing/*",
        "api": "/api/v1/sales-marketing/",
        "prefix": "smw_*",
        "status": "Draft (UI phase)",
        "ui": "SMW_UI_BUILD_GUIDE.md",
    },
    "ecommerce": {
        "name": "Ecommerce",
        "purpose": "Commerce hub — catalog admin, orders, customers, storefront, 167 admin screens (**Active**).",
        "features": [
            "Catalog, orders, customers, inventory views",
            "Storefront and checkout",
            "SEO, Builder, Marketing (commerce scope), Media, Reports",
            "AI commerce tools",
        ],
        "depends_on": "Core + Inventory + Sales (services)",
        "provides_to": "Storefront, Marketplace, Marketing promotions",
        "consumes_from": "Inventory stock levels, Sales order sync",
        "events_produced": "`catalog.*`, `commerce.order.*`",
        "events_consumed": "Core approval, inventory updates",
        "route": "/catalog/* (admin), (storefront)/",
        "api": "/api/v1/commerce/",
        "prefix": "catalog_* · commerce_*",
        "status": "Active",
        "ui": "../../04-uiux/prototype/",
    },
    "business-partners": {
        "name": "Business Partners",
        "purpose": "Commercial partner hub — vendors, distributors, channel partners.",
        "features": ["Partner roles and tiers", "Terms, credit, territories", "Onboarding and catalog mapping"],
        "depends_on": "Core Contacts + Catalog + Purchase/Sales",
        "provides_to": "Purchase, Sales, CRM, Catalog",
        "consumes_from": "Contacts, Catalog, Purchase/Sales KPIs (async)",
        "events_produced": "`bp.partner.*`, `bp.onboarding.approved`",
        "events_consumed": "`purchase.order.created`, `sales.order.confirmed`",
        "route": "/partners/*",
        "api": "/api/v1/partners/",
        "prefix": "bp_*",
        "status": "Draft",
        "ui": "../../04-uiux/prototype/business-partners/",
    },
    "product-configurator": {
        "name": "Product Configurator",
        "purpose": "Configurable products, PC builder, compatibility rules, and wizard UX.",
        "features": ["Component attributes", "Compatibility engine", "PC builder wizard", "ERP integration"],
        "depends_on": "Core + Catalog",
        "provides_to": "Catalog, Sales, Ecommerce",
        "consumes_from": "Catalog product master",
        "events_produced": "Configuration and BOM events (see Architecture)",
        "events_consumed": "Catalog product events",
        "route": "/product-configurator/*",
        "api": "/api/v1/product-configurator/",
        "prefix": "pc_*",
        "status": "Draft",
        "ui": None,
    },
    "project": {
        "name": "Project",
        "purpose": "Projects, tasks, milestones, billing, and delivery.",
        "features": ["Project hierarchy", "Tasks and milestones", "Billing linkage to Sales"],
        "depends_on": "Core + HR + Sales",
        "provides_to": "Timesheet, Finance",
        "consumes_from": "HR resources, Sales orders",
        "events_produced": "Project task and billing events",
        "events_consumed": "Timesheet and HR events",
        "route": "/project/*",
        "api": "/api/v1/project/",
        "prefix": "project_*",
        "status": "Draft",
        "ui": None,
    },
    "timesheet": {
        "name": "Timesheet",
        "purpose": "Time entries, approvals, and project billing link.",
        "features": ["Timesheet entry", "Approval workflows", "Billable hours to Project/Sales"],
        "depends_on": "Core + Project + HR",
        "provides_to": "Project, Payroll (optional)",
        "consumes_from": "Project tasks, HR employee",
        "events_produced": "Timesheet submission and approval events",
        "events_consumed": "Project assignment events",
        "route": "/timesheet/*",
        "api": "/api/v1/timesheet/",
        "prefix": "timesheet_*",
        "status": "Draft",
        "ui": None,
    },
    "helpdesk": {
        "name": "Helpdesk",
        "purpose": "Tickets, SLAs, and customer support.",
        "features": ["Ticket queues", "SLA policies", "Knowledge base link"],
        "depends_on": "Core + CRM + Contacts",
        "provides_to": "CRM, Knowledge",
        "consumes_from": "Contacts, CRM accounts",
        "events_produced": "Ticket lifecycle events",
        "events_consumed": "CRM contact events",
        "route": "/helpdesk/*",
        "api": "/api/v1/helpdesk/",
        "prefix": "helpdesk_*",
        "status": "Draft",
        "ui": None,
    },
    "documents": {
        "name": "Documents",
        "purpose": "Document management — versions, sharing, DMS.",
        "features": ["Folders and versions", "Sharing and permissions", "Attachments bridge to Core media"],
        "depends_on": "Core Media + Permissions",
        "provides_to": "All modules",
        "consumes_from": "Core Media",
        "events_produced": "Document version and share events",
        "events_consumed": "Core media events",
        "route": "/documents/*",
        "api": "/api/v1/documents/",
        "prefix": "documents_*",
        "status": "Draft",
        "ui": None,
    },
    "knowledge": {
        "name": "Knowledge Base",
        "purpose": "KB articles, categories, and search.",
        "features": ["Articles and categories", "Search and feedback", "Helpdesk integration"],
        "depends_on": "Core + Search",
        "provides_to": "Helpdesk, Storefront",
        "consumes_from": "Core Search",
        "events_produced": "Article publish events",
        "events_consumed": "Helpdesk ticket events",
        "route": "/knowledge/*",
        "api": "/api/v1/knowledge/",
        "prefix": "knowledge_*",
        "status": "Draft",
        "ui": None,
    },
    "bi-system": {
        "name": "BI System",
        "purpose": "Dashboards, KPIs, drill-down analytics.",
        "features": ["Dashboards and widgets", "KPI definitions", "Drill-down to modules via APIs"],
        "depends_on": "Core + Data Warehouse (optional)",
        "provides_to": "Executive and module dashboards",
        "consumes_from": "Module read APIs and warehouse facts",
        "events_produced": "Report subscription events",
        "events_consumed": "Domain events for refresh",
        "route": "/bi/*",
        "api": "/api/v1/bi/",
        "prefix": "bi_*",
        "status": "Draft",
        "ui": None,
    },
    "data-warehouse": {
        "name": "Data Warehouse",
        "purpose": "ETL, dimensions, facts, and analytics spine.",
        "features": ["ETL pipelines", "Star schema dimensions/facts", "BI feed"],
        "depends_on": "Core event bus",
        "provides_to": "BI System",
        "consumes_from": "Module domain events (async)",
        "events_produced": "ETL batch completion events",
        "events_consumed": "All subscribed domain events",
        "route": "—",
        "api": "—",
        "prefix": "dw_*",
        "status": "Draft",
        "ui": None,
    },
    "fleet": {
        "name": "Fleet",
        "purpose": "Vehicles, maintenance, fuel, and fleet operations.",
        "features": ["Vehicle registry", "Maintenance schedules", "Fuel and cost tracking"],
        "depends_on": "Core",
        "provides_to": "Logistics, Finance",
        "consumes_from": "Core Contacts (drivers)",
        "events_produced": "Fleet maintenance events",
        "events_consumed": "Logistics trip events",
        "route": "/fleet/*",
        "api": "/api/v1/fleet/",
        "prefix": "fleet_*",
        "status": "Draft",
        "ui": None,
    },
    "logistics": {
        "name": "Logistics",
        "purpose": "Shipments, carriers, tracking, and delivery.",
        "features": ["Shipments and carriers", "Tracking integrations", "Delivery status"],
        "depends_on": "Core + Inventory + Sales",
        "provides_to": "Sales, Ecommerce fulfillment",
        "consumes_from": "Sales shipments, Inventory",
        "events_produced": "Shipment status events",
        "events_consumed": "Sales shipment created",
        "route": "/logistics/*",
        "api": "/api/v1/logistics/",
        "prefix": "logistics_*",
        "status": "Draft",
        "ui": None,
    },
    "booking": {
        "name": "Booking",
        "purpose": "Appointments, resources, and calendars.",
        "features": ["Resource booking", "Calendars and availability", "Notifications"],
        "depends_on": "Core + Contacts + Notifications",
        "provides_to": "CRM, Helpdesk",
        "consumes_from": "Contacts",
        "events_produced": "Booking confirmation events",
        "events_consumed": "Contact created",
        "route": "/booking/*",
        "api": "/api/v1/booking/",
        "prefix": "booking_*",
        "status": "Draft",
        "ui": None,
    },
    "marketplace": {
        "name": "Marketplace",
        "purpose": "Multi-vendor marketplace on Ecommerce spine.",
        "features": ["Vendor storefronts", "Commission and payouts", "Catalog federation"],
        "depends_on": "Core + Ecommerce + Business Partners",
        "provides_to": "Ecommerce catalog and orders",
        "consumes_from": "Ecommerce, Partners",
        "events_produced": "Marketplace vendor and order events",
        "events_consumed": "Commerce order events",
        "route": "/marketplace/*",
        "api": "/api/v1/marketplace/",
        "prefix": "marketplace_*",
        "status": "Draft",
        "ui": None,
    },
    "subscription": {
        "name": "Subscription",
        "purpose": "SaaS subscription and billing module.",
        "features": ["Plans and entitlements", "Billing cycles", "Usage metering"],
        "depends_on": "Core Platform + SaaS layer",
        "provides_to": "Platform tenant provisioning",
        "consumes_from": "Platform tenant events",
        "events_produced": "Subscription lifecycle events",
        "events_consumed": "Platform plan changed",
        "route": "Platform admin",
        "api": "/api/v1/subscription/",
        "prefix": "subscription_*",
        "status": "Draft",
        "ui": "../../04-uiux/prototype/platform/",
    },
}

ECOMMERCE_AREAS = {
    "seo": {
        "name": "SEO (Ecommerce)",
        "purpose": "Search visibility — meta, URLs, redirects, schema, sitemaps, audits.",
        "features": ["Meta manager", "URL and redirect manager", "Schema and sitemap", "SEO audit and keywords"],
        "depends_on": "Ecommerce Catalog + Builder + Storefront",
        "provides_to": "Storefront organic search",
        "events_produced": "SEO publish and redirect events",
        "events_consumed": "Catalog and Builder page events",
        "arch": "ARCHITECTURE.md",
        "menus": "../Menus/SEO/",
    },
    "builder": {
        "name": "Builder (Ecommerce)",
        "purpose": "Visual storefront CMS — pages, headers, themes, checkout layout.",
        "features": ["Page and landing builders", "Header/footer/theme manager", "Popup and form builders", "Checkout builder"],
        "depends_on": "Ecommerce Catalog + Media + SEO",
        "provides_to": "Storefront rendering",
        "events_produced": "Builder publish and theme events",
        "events_consumed": "Media upload, catalog updates",
        "arch": "ARCHITECTURE.md",
        "menus": "../Menus/Builder/",
        "ui": "../../../08-builder/prototype/",
    },
    "catalog": {
        "name": "Catalog (Ecommerce)",
        "purpose": "Product catalog admin — products, categories, attributes, brands.",
        "features": ["Products and variants", "Categories and collections", "Attributes and specifications", "Bulk import/export"],
        "depends_on": "Core + Inventory (stock display via service)",
        "provides_to": "All commerce and ERP modules",
        "events_produced": "`catalog.product.*`, `catalog.variant.*`",
        "events_consumed": "Core approval events",
        "arch": "ARCHITECTURE.md",
        "menus": "../Menus/Catalog/",
    },
    "marketing": {
        "name": "Marketing (Ecommerce scope)",
        "purpose": "Commerce promotions — coupons, campaigns, loyalty within admin `/catalog` menus (legacy ecommerce scope).",
        "features": ["Promotions and coupons", "Flash sales and affiliates", "Storefront offers"],
        "depends_on": "Ecommerce Catalog + Orders",
        "provides_to": "Storefront pricing and promotions",
        "events_produced": "Commerce promotion events",
        "events_consumed": "Order and cart events",
        "arch": "ARCHITECTURE.md",
        "menus": "../Menus/Marketing/",
        "note": "For standalone marketing automation see [../../marketing/README.md](../../marketing/README.md).",
    },
}

DOC_HINTS = {
    "Architecture.md": "Full module architecture — open only for deep design",
    "ARCHITECTURE.md": "Full module architecture — open only for deep design",
    "CRM_MODULE_ARCHITECTURE.md": "Enterprise CRM architecture (authoritative)",
    "SALES_MODULE_ARCHITECTURE.md": "Enterprise Sales architecture (authoritative)",
    "PURCHASE_MODULE_ARCHITECTURE.md": "Enterprise Purchase architecture (authoritative)",
    "INVENTORY_MODULE_ARCHITECTURE.md": "Enterprise Inventory architecture (authoritative)",
    "FINANCE_MODULE_ARCHITECTURE.md": "Enterprise Finance architecture (authoritative)",
    "MARKETING_MODULE_ARCHITECTURE.md": "Enterprise Marketing architecture (authoritative)",
    "HR_PAYROLL_MASTER_ARCHITECTURE.md": "HR & Payroll master architecture (authoritative)",
    "Database.md": "Owned tables and schema — DB or migration work only",
    "API.md": "REST endpoints — backend/API work only",
    "Workflow.md": "Business workflows and state machines",
    "Permissions.md": "RBAC namespace and record rules",
    "ModuleManifest.md": "Install manifest and service dependencies",
    "UI.md": "Admin navigation and screen inventory",
    "Development.md": "Implementation notes",
    "Roadmap.md": "Planned features",
    "INTEGRATION.md": "Cross-module integration contracts",
    "SMW_UI_BUILD_GUIDE.md": "UI prototype build guide — screen implementation",
    "ECOMMERCE_STOREFRONT_ARCHITECTURE.md": "Storefront routes and customer shop",
}


def discover_docs(folder: Path) -> list[tuple[str, str, str]]:
    """Return (filename, link, hint) for documentation map."""
    rows: list[tuple[str, str, str]] = []
    if not folder.is_dir():
        return rows
    for f in sorted(folder.iterdir()):
        if f.name == "README.md":
            continue
        if f.suffix == ".md" and f.is_file():
            hint = DOC_HINTS.get(f.name, "Supporting doc — open only if task requires it")
            rows.append((f.name, f.name, hint))
    if (folder / "Menus").is_dir():
        rows.append(("Menus/", "Menus/", "Screen specs — open ONE file for the screen you implement"))
    if (folder / "ui-design").is_dir():
        rows.append(("ui-design/", "ui-design/", "UI design specs — open ONE screen design"))
    if (folder / "uiux").is_dir():
        rows.append(("uiux/", "uiux/", "HR UI architecture deep dives — open ONE topic"))
    return rows


def build_readme(module_id: str, folder: Path, meta: dict, arch_file: str) -> str:
    name = meta["name"]
    lines = [
        f"# {name} — Module Overview",
        "",
        f"> **Module ID:** `{module_id}` · **Status:** {meta['status']} · **Route:** `{meta['route']}` · **API:** `{meta['api']}` · **Tables:** `{meta['prefix']}`",
        "",
        "## Purpose",
        "",
        f"Single entry point for **{name}** documentation. {meta['purpose']}",
        "",
        "## When To Read",
        "",
        f"Read this file first for any **{name}** task. Do not scan the module folder — use the Documentation Map below to open exactly one downstream doc.",
        "",
        "## Features",
        "",
    ]
    for feat in meta["features"]:
        lines.append(f"- {feat}")
    lines.extend(
        [
            "",
            "## Dependencies",
            "",
            "| Direction | Detail |",
            "|-----------|--------|",
            f"| **Depends on** | {meta['depends_on']} |",
            f"| **Provides to** | {meta['provides_to']} |",
            f"| **Consumes from** | {meta['consumes_from']} |",
            "",
            "Full matrix: [MODULE_DEPENDENCY_MAP.md](../../01-architecture/MODULE_DEPENDENCY_MAP.md)",
            "",
            "## Events",
            "",
            "| Direction | Events |",
            "|-----------|--------|",
            f"| **Produces** | {meta['events_produced']} |",
            f"| **Consumes** | {meta['events_consumed']} |",
            "",
            "## Documentation Map",
            "",
            "| Document | Open when |",
            "|----------|-----------|",
        ]
    )

    docs = discover_docs(folder)
    # Ensure architecture first
    arch_hint = DOC_HINTS.get(arch_file, "Full architecture — deep design only")
    lines.append(f"| [{arch_file}]({arch_file}) | {arch_hint} |")

    for fname, link, hint in docs:
        if fname == arch_file:
            continue
        lines.append(f"| [{link}]({link}) | {hint} |")

    ui = meta.get("ui")
    if ui and ui != "SMW_UI_BUILD_GUIDE.md":
        lines.append(f"| [UI prototype]({ui}) | Building admin UI screens in `apps/web/` |")
    elif ui == "SMW_UI_BUILD_GUIDE.md":
        pass  # already in discover

    if master := meta.get("master"):
        lines.append(f"| [HR & Payroll master]({master}) | Cross-cutting HR/Payroll architecture |")

    if note := meta.get("note"):
        lines.extend(["", f"**Note:** {note}", ""])

    lines.extend(
        [
            "",
            "## Related Files",
            "",
            f"- [Module registry](../../MODULE_REGISTRY.md) — index of all modules",
            f"- [Dependency map](../../01-architecture/MODULE_DEPENDENCY_MAP.md) — integration rules",
            f"- [Core platform](../../02-core-platform/ARCHITECTURE.md) — shared entities and engines",
        ]
    )
    if module_id == "ecommerce":
        lines.append("- [Ecommerce sub-areas](#ecommerce-sub-areas) — SEO, Builder, Catalog (below)")
    lines.extend(
        [
            "",
            "## Read Next",
            "",
            f"1. [{arch_file}]({arch_file}) — if you need architecture depth",
            "2. One row from Documentation Map for your task (Database / API / UI / one Menu file)",
            "3. [PRE_CODE_GATE.md](../../00-foundation/PRE_CODE_GATE.md) — before writing code",
            "",
            "---",
            "",
            f"**Maintainer:** {name} Team · **Doc path:** `docs/03-business-modules/{module_id}/`",
            "",
        ]
    )
    return "\n".join(lines)


def build_ecommerce_readme(folder: Path) -> str:
    meta = META["ecommerce"]
    content = build_readme("ecommerce", folder, meta, ARCH["ecommerce"])
    sub = [
        "",
        "## Ecommerce Sub-Areas",
        "",
        "Documentation views inside Ecommerce — each has its own README entry point:",
        "",
        "| Area | Entry | Route menus |",
        "|------|-------|-------------|",
    ]
    for area_id, area in ECOMMERCE_AREAS.items():
        sub.append(
            f"| **{area['name']}** | [{area_id}/README.md]({area_id}/README.md) | `{area['menus']}` |"
        )
    content = content.rstrip() + "\n\n" + "\n".join(sub) + "\n"
    return content


def build_sub_readme(area_id: str, folder: Path, meta: dict) -> str:
    arch = meta["arch"]
    lines = [
        f"# {meta['name']} — Module Overview",
        "",
        f"> **Parent:** [Ecommerce](../README.md) · **Area ID:** `{area_id}` · **Menus:** `{meta['menus']}`",
        "",
        "## Purpose",
        "",
        f"Entry point for **{meta['name']}** docs inside Ecommerce. {meta['purpose']}",
        "",
        "## When To Read",
        "",
        f"Read this file first for **{meta['name']}** work only — not the full Ecommerce hub.",
        "",
        "## Features",
        "",
    ]
    for f in meta["features"]:
        lines.append(f"- {f}")
    lines.extend(
        [
            "",
            "## Dependencies",
            "",
            f"- **Depends on:** {meta['depends_on']}",
            f"- **Provides to:** {meta['provides_to']}",
            "",
            "## Events",
            "",
            f"- **Produces:** {meta['events_produced']}",
            f"- **Consumes:** {meta['events_consumed']}",
            "",
            "## Documentation Map",
            "",
            "| Document | Open when |",
            "|----------|-----------|",
            f"| [{arch}]({arch}) | Full {area_id} architecture |",
            f"| [{meta['menus']}]({meta['menus']}) | ONE admin screen spec |",
        ]
    )
    if ui := meta.get("ui"):
        lines.append(f"| [Builder UI specs]({ui}) | Page/theme builder prototype guides |")
    if note := meta.get("note"):
        lines.extend(["", note, ""])
    lines.extend(
        [
            "",
            "## Related Files",
            "",
            "- [Ecommerce hub](../README.md)",
            "- [Ecommerce Architecture](../Architecture.md)",
            f"- [Catalog](../catalog/README.md) · [SEO](../seo/README.md) · [Builder](../builder/README.md)",
            "",
            "## Read Next",
            "",
            f"1. [{arch}]({arch}) — architecture depth",
            f"2. One file under `{meta['menus']}` for your screen",
            "",
            "---",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    written = 0
    for module_id, meta in META.items():
        folder = MODULES_ROOT / module_id
        if not folder.is_dir():
            print(f"  skip missing: {module_id}")
            continue
        arch = ARCH.get(module_id, "Architecture.md")
        if module_id == "ecommerce":
            text = build_ecommerce_readme(folder)
        else:
            text = build_readme(module_id, folder, meta, arch)
        out = folder / "README.md"
        out.write_text(text, encoding="utf-8")
        written += 1
        print(f"  + {out.relative_to(DOCS)}")

    for area_id, area_meta in ECOMMERCE_AREAS.items():
        folder = MODULES_ROOT / "ecommerce" / area_id
        if not folder.is_dir():
            continue
        out = folder / "README.md"
        out.write_text(build_sub_readme(area_id, folder, area_meta), encoding="utf-8")
        written += 1
        print(f"  + {out.relative_to(DOCS)}")

    print(f"\nWritten: {written} README entry points")


if __name__ == "__main__":
    main()
