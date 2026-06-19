#!/usr/bin/env python3
"""Fix menu paths and generate remaining documentation structure."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = (ROOT / "_PAGE_TEMPLATE.md").read_text()
MODULE_TEMPLATE = (ROOT / "_MODULE_TEMPLATE.md").read_text()

MENU_PAGES = [
    ("Dashboard.md", "Dashboard", "Ecommerce → Dashboard"),
    ("Products/Product List.md", "Product List", "Ecommerce → Products → Product List"),
    ("Products/Create Product.md", "Create Product", "Ecommerce → Products → Create Product"),
    ("Products/Product Edit.md", "Product Edit", "Ecommerce → Products → Product Edit"),
    ("Products/Product Import.md", "Product Import", "Ecommerce → Products → Product Import"),
    ("Products/Product Export.md", "Product Export", "Ecommerce → Products → Product Export"),
    ("Categories/Category List.md", "Category List", "Ecommerce → Categories → Category List"),
    ("Categories/Create Category.md", "Create Category", "Ecommerce → Categories → Create Category"),
    ("Categories/Category Tree.md", "Category Tree", "Ecommerce → Categories → Category Tree"),
    ("Brands/Brand List.md", "Brand List", "Ecommerce → Brands → Brand List"),
    ("Brands/Create Brand.md", "Create Brand", "Ecommerce → Brands → Create Brand"),
    ("Inventory/Stock Management.md", "Stock Management", "Ecommerce → Inventory → Stock Management"),
    ("Inventory/Stock Adjustment.md", "Stock Adjustment", "Ecommerce → Inventory → Stock Adjustment"),
    ("Inventory/Stock Transfer.md", "Stock Transfer", "Ecommerce → Inventory → Stock Transfer"),
    ("Customers/Customer List.md", "Customer List", "Ecommerce → Customers → Customer List"),
    ("Customers/Customer Groups.md", "Customer Groups", "Ecommerce → Customers → Customer Groups"),
    ("Orders/Order List.md", "Order List", "Ecommerce → Orders → Order List"),
    ("Orders/Order Details.md", "Order Details", "Ecommerce → Orders → Order Details"),
    ("Orders/Order Status.md", "Order Status", "Ecommerce → Orders → Order Status"),
    ("Returns/Return Request.md", "Return Request", "Ecommerce → Returns → Return Request"),
    ("Returns/Return Approval.md", "Return Approval", "Ecommerce → Returns → Return Approval"),
    ("Coupons/Coupon Management.md", "Coupon Management", "Ecommerce → Coupons → Coupon Management"),
    ("Coupons/Gift Vouchers.md", "Gift Vouchers", "Ecommerce → Coupons → Gift Vouchers"),
    ("Marketing/Campaigns.md", "Campaigns", "Ecommerce → Marketing → Campaigns"),
    ("Marketing/Abandoned Cart.md", "Abandoned Cart", "Ecommerce → Marketing → Abandoned Cart"),
    ("Reviews/Review List.md", "Review List", "Ecommerce → Reviews → Review List"),
    ("Reviews/Review Approval.md", "Review Approval", "Ecommerce → Reviews → Review Approval"),
    ("Shipping/Shipping Methods.md", "Shipping Methods", "Ecommerce → Shipping → Shipping Methods"),
    ("Shipping/Shipping Zones.md", "Shipping Zones", "Ecommerce → Shipping → Shipping Zones"),
    ("Payment/Payment Gateways.md", "Payment Gateways", "Ecommerce → Payment → Payment Gateways"),
    ("Payment/Transactions.md", "Transactions", "Ecommerce → Payment → Transactions"),
    ("Reports/Sales Reports.md", "Sales Reports", "Ecommerce → Reports → Sales Reports"),
    ("Reports/Customer Reports.md", "Customer Reports", "Ecommerce → Reports → Customer Reports"),
    ("Reports/Product Reports.md", "Product Reports", "Ecommerce → Reports → Product Reports"),
    ("Settings/General Settings.md", "General Settings", "Ecommerce → Settings → General Settings"),
    ("Settings/Store Settings.md", "Store Settings", "Ecommerce → Settings → Store Settings"),
    ("Settings/SEO Settings.md", "SEO Settings", "Ecommerce → Settings → SEO Settings"),
    ("Settings/Email Settings.md", "Email Settings", "Ecommerce → Settings → Email Settings"),
    ("Settings/Tax Settings.md", "Tax Settings", "Ecommerce → Settings → Tax Settings"),
]

MODULE_DOCS = [
    ("Architecture.md", "Architecture", "Architecture"),
    ("Database.md", "Database", "Database"),
    ("API.md", "API", "API"),
    ("UI.md", "UI", "UI"),
    ("Workflow.md", "Workflow", "Workflow"),
    ("Permissions.md", "Permissions", "Permissions"),
    ("Development.md", "Development", "Development"),
    ("Roadmap.md", "Roadmap", "Roadmap"),
]

ROOT_FOLDERS = [
    "core",
    "modules",
    "deployment",
    "api",
    "database",
    "ui-ux",
    "workflows",
    "roadmap",
]


def render_page(title: str, menu_path: str) -> str:
    return (
        TEMPLATE.replace("{Page Title}", title)
        .replace("{Module Name}", "Ecommerce")
        .replace("{Module} → {Menu} → {Submenu}", menu_path)
        .replace("{module}", "ecommerce")
    )


def render_module(doc_title: str, doc_type: str) -> str:
    return (
        MODULE_TEMPLATE.replace("{Document Title}", doc_title)
        .replace("{Module Name}", "Ecommerce")
        .replace("{Document Type}", doc_type)
    )


def main():
    menus_dir = ROOT / "modules" / "ecommerce" / "Menus"
    module_dir = ROOT / "modules" / "ecommerce"

    for rel_path, title, menu_path in MENU_PAGES:
        path = menus_dir / rel_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(render_page(title, menu_path))

    for filename, doc_title, doc_type in MODULE_DOCS:
        path = module_dir / filename
        path.write_text(render_module(doc_title, doc_type))

    for folder in ROOT_FOLDERS:
        folder_path = ROOT / folder
        folder_path.mkdir(parents=True, exist_ok=True)
        readme = folder_path / "README.md"
        if not readme.exists():
            readme.write_text(f"# {folder.replace('-', ' ').title()}\n\n> **Status:** Draft\n\n_Documentation for AgainERP {folder}._\n")

    print("Documentation structure completed.")


if __name__ == "__main__":
    main()
