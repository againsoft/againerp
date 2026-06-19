#!/usr/bin/env python3
"""Generate Ecommerce Module Structure v1.0 menu documentation."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = (ROOT / "_PAGE_TEMPLATE.md").read_text()
MENUS = ROOT / "modules" / "ecommerce" / "Menus"

# (top_menu, sub_menu_or_None, page_title)
PAGES = [
    # Dashboard
    ("Dashboard", None, "Overview"),
    ("Dashboard", None, "Sales Analytics"),
    ("Dashboard", None, "Revenue Analytics"),
    ("Dashboard", None, "Customer Analytics"),
    ("Dashboard", None, "Product Analytics"),
    ("Dashboard", None, "Inventory Alerts"),
    ("Dashboard", None, "Recent Orders"),
    ("Dashboard", None, "Activity Logs"),
    # Catalog - Products
    ("Catalog", "Products", "Product List"),
    ("Catalog", "Products", "Add Product"),
    ("Catalog", "Products", "Bulk Import"),
    ("Catalog", "Products", "Bulk Export"),
    ("Catalog", "Products", "Product Approval"),
    ("Catalog", "Products", "Product History"),
    # Catalog - flat
    ("Catalog", None, "Categories"),
    ("Catalog", None, "Brands"),
    ("Catalog", None, "Attributes"),
    ("Catalog", None, "Attribute Groups"),
    ("Catalog", None, "Variants"),
    ("Catalog", None, "Filters"),
    ("Catalog", None, "Tags"),
    ("Catalog", None, "Product Collections"),
    ("Catalog", None, "Product Bundles"),
    ("Catalog", None, "Related Products"),
    ("Catalog", None, "Reviews"),
    ("Catalog", None, "Questions & Answers"),
    ("Catalog", None, "Product Comparison"),
    # Inventory
    ("Inventory", None, "Stock Management"),
    ("Inventory", None, "Warehouses"),
    ("Inventory", None, "Stock Adjustment"),
    ("Inventory", None, "Stock Transfer"),
    ("Inventory", None, "Low Stock Alerts"),
    ("Inventory", None, "Supplier Stock Feed"),
    ("Inventory", None, "Purchase Suggestions"),
    ("Inventory", None, "Barcode Management"),
    # Sales
    ("Sales", None, "Orders"),
    ("Sales", None, "Order Status"),
    ("Sales", None, "Returns"),
    ("Sales", None, "Refunds"),
    ("Sales", None, "Invoices"),
    ("Sales", None, "Transactions"),
    ("Sales", None, "Abandoned Carts"),
    ("Sales", None, "Quotations"),
    ("Sales", None, "POS Orders"),
    # Customers
    ("Customers", None, "Customers"),
    ("Customers", None, "Customer Groups"),
    ("Customers", None, "Customer Wallet"),
    ("Customers", None, "Reward Points"),
    ("Customers", None, "Wishlists"),
    ("Customers", None, "Saved Carts"),
    ("Customers", None, "Customer Activities"),
    ("Customers", None, "Customer Support Tickets"),
    ("Customers", None, "Customer Addresses"),
    # Marketing
    ("Marketing", None, "Coupons"),
    ("Marketing", None, "Vouchers"),
    ("Marketing", None, "Promotions"),
    ("Marketing", None, "Flash Sales"),
    ("Marketing", None, "Special Offers"),
    ("Marketing", None, "Campaign Manager"),
    ("Marketing", None, "Email Marketing"),
    ("Marketing", None, "SMS Marketing"),
    ("Marketing", None, "WhatsApp Marketing"),
    ("Marketing", None, "Push Notifications"),
    ("Marketing", None, "Affiliate Program"),
    ("Marketing", None, "Referral Program"),
    ("Marketing", None, "Loyalty Program"),
    ("Marketing", None, "Abandoned Cart Recovery"),
    ("Marketing", None, "Popup Manager"),
    ("Marketing", None, "Announcement Bar"),
    # Content
    ("Content", None, "Pages"),
    ("Content", None, "Blog Posts"),
    ("Content", None, "Blog Categories"),
    ("Content", None, "Blog Comments"),
    ("Content", None, "FAQs"),
    ("Content", None, "Testimonials"),
    ("Content", None, "Team Members"),
    ("Content", None, "Announcements"),
    ("Content", None, "News"),
    ("Content", None, "Custom HTML Blocks"),
    # Builder
    ("Builder", None, "Theme Manager"),
    ("Builder", None, "Template Manager"),
    ("Builder", None, "Header Builder"),
    ("Builder", None, "Footer Builder"),
    ("Builder", None, "Homepage Builder"),
    ("Builder", None, "Landing Page Builder"),
    ("Builder", None, "Product Page Builder"),
    ("Builder", None, "Category Page Builder"),
    ("Builder", None, "Checkout Builder"),
    ("Builder", None, "Widget Builder"),
    ("Builder", None, "Menu Builder"),
    ("Builder", None, "Form Builder"),
    ("Builder", None, "Popup Builder"),
    ("Builder", None, "Block Library"),
    # SEO
    ("SEO", None, "SEO Dashboard"),
    ("SEO", None, "Meta Manager"),
    ("SEO", None, "URL Manager"),
    ("SEO", None, "Redirect Manager"),
    ("SEO", None, "Schema Manager"),
    ("SEO", None, "Sitemap Manager"),
    ("SEO", None, "Robots Manager"),
    ("SEO", None, "Internal Linking"),
    ("SEO", None, "Broken Link Checker"),
    ("SEO", None, "Keyword Tracking"),
    ("SEO", None, "SEO Audit"),
    ("SEO", None, "Page Speed Analysis"),
    # AI
    ("AI", None, "AI Dashboard"),
    ("AI", None, "AI Product Description"),
    ("AI", None, "AI Blog Writer"),
    ("AI", None, "AI SEO Generator"),
    ("AI", None, "AI Meta Generator"),
    ("AI", None, "AI Product Tags"),
    ("AI", None, "AI Review Summary"),
    ("AI", None, "AI Customer Support"),
    ("AI", None, "AI Translation"),
    ("AI", None, "AI Image Generation"),
    ("AI", None, "AI Banner Generator"),
    ("AI", None, "AI Sales Forecast"),
    ("AI", None, "AI Inventory Forecast"),
    ("AI", None, "AI Product Recommendation"),
    ("AI", None, "AI Analytics Assistant"),
    # Media
    ("Media", None, "Media Library"),
    ("Media", None, "Images"),
    ("Media", None, "Videos"),
    ("Media", None, "Documents"),
    ("Media", None, "Folders"),
    ("Media", None, "CDN Manager"),
    ("Media", None, "Image Optimizer"),
    ("Media", None, "Watermark Manager"),
    ("Media", None, "Media Usage Tracker"),
    # Reports
    ("Reports", None, "Sales Reports"),
    ("Reports", None, "Product Reports"),
    ("Reports", None, "Category Reports"),
    ("Reports", None, "Brand Reports"),
    ("Reports", None, "Customer Reports"),
    ("Reports", None, "Marketing Reports"),
    ("Reports", None, "Inventory Reports"),
    ("Reports", None, "Return Reports"),
    ("Reports", None, "Profit Reports"),
    ("Reports", None, "Tax Reports"),
    ("Reports", None, "Affiliate Reports"),
    ("Reports", None, "SEO Reports"),
    ("Reports", None, "AI Reports"),
    ("Reports", None, "Custom Reports"),
    # System
    ("System", None, "General Settings"),
    ("System", None, "Store Settings"),
    ("System", None, "Company Settings"),
    ("System", None, "Branch Settings"),
    ("System", None, "Localization"),
    ("System", None, "Languages"),
    ("System", None, "Currencies"),
    ("System", None, "Taxes"),
    ("System", None, "Email Settings"),
    ("System", None, "SMS Settings"),
    ("System", None, "WhatsApp Settings"),
    ("System", None, "Payment Gateways"),
    ("System", None, "Shipping Methods"),
    ("System", None, "Shipping Zones"),
    ("System", None, "User Management"),
    ("System", None, "Roles"),
    ("System", None, "Permissions"),
    ("System", None, "Activity Logs"),
    ("System", None, "Audit Logs"),
    ("System", None, "API Management"),
    ("System", None, "Backup Manager"),
    ("System", None, "Cron Jobs"),
    ("System", None, "Cache Manager"),
    ("System", None, "Security Settings"),
]


def menu_path(top, sub, page):
    if sub:
        return f"Ecommerce → {top} → {sub} → {page}"
    return f"Ecommerce → {top} → {page}"


def file_path(top, sub, page):
    if sub:
        return MENUS / top / sub / f"{page}.md"
    return MENUS / top / f"{page}.md"


def render(title: str, path: str) -> str:
    return (
        TEMPLATE.replace("{Page Title}", title)
        .replace("{Module Name}", "Ecommerce")
        .replace("{Module} → {Menu} → {Submenu}", path)
        .replace("{module}", "ecommerce")
    )


def main():
    import shutil

    if MENUS.exists():
        shutil.rmtree(MENUS)
    MENUS.mkdir(parents=True)

    for top, sub, page in PAGES:
        fp = file_path(top, sub, page)
        fp.parent.mkdir(parents=True, exist_ok=True)
        fp.write_text(render(page, menu_path(top, sub, page)))

    print(f"Generated {len(PAGES)} menu docs (Ecommerce v1.0)")


if __name__ == "__main__":
    main()
