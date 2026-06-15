#!/usr/bin/env bash
# Generates Ecommerce menu documentation files from template.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE="$ROOT/_PAGE_TEMPLATE.md"
ECOM="$ROOT/modules/ecommerce/Menus"

generate_page() {
  local file_path="$1"
  local title="$2"
  local module="$3"
  local menu_path="$4"

  mkdir -p "$(dirname "$file_path")"

  if [[ -f "$file_path" ]]; then
    return
  fi

  sed \
    -e "s/{Page Title}/$title/g" \
    -e "s/{Module Name}/$module/g" \
    -e "s/{Module}/Ecommerce/g" \
    -e "s/{Menu}/$(echo "$menu_path" | cut -d'→' -f2 | xargs)/g" \
    -e "s/{Submenu}/$(echo "$menu_path" | cut -d'→' -f3 | xargs)/g" \
    -e "s|{Module} → {Menu} → {Submenu}|$menu_path|g" \
  "$TEMPLATE" > "$file_path"
}

# Dashboard
generate_page "$ECOM/Dashboard.md" "Dashboard" "Ecommerce" "Ecommerce → Dashboard"

# Products
generate_page "$ECOM/Products/Product List.md" "Product List" "Ecommerce" "Ecommerce → Products → Product List"
generate_page "$ECOM/Products/Create Product.md" "Create Product" "Ecommerce" "Ecommerce → Products → Create Product"
generate_page "$ECOM/Products/Product Edit.md" "Product Edit" "Ecommerce" "Ecommerce → Products → Product Edit"
generate_page "$ECOM/Products/Product Import.md" "Product Import" "Ecommerce" "Ecommerce → Products → Product Import"
generate_page "$ECOM/Products/Product Export.md" "Product Export" "Ecommerce" "Ecommerce → Products → Product Export"

# Categories
generate_page "$ECOM/Categories/Category List.md" "Category List" "Ecommerce" "Ecommerce → Categories → Category List"
generate_page "$ECOM/Categories/Create Category.md" "Create Category" "Ecommerce" "Ecommerce → Categories → Create Category"
generate_page "$ECOM/Categories/Category Tree.md" "Category Tree" "Ecommerce" "Ecommerce → Categories → Category Tree"

# Brands
generate_page "$ECOM/Brands/Brand List.md" "Brand List" "Ecommerce" "Ecommerce → Brands → Brand List"
generate_page "$ECOM/Brands/Create Brand.md" "Create Brand" "Ecommerce" "Ecommerce → Brands → Create Brand"

# Inventory
generate_page "$ECOM/Inventory/Stock Management.md" "Stock Management" "Ecommerce" "Ecommerce → Inventory → Stock Management"
generate_page "$ECOM/Inventory/Stock Adjustment.md" "Stock Adjustment" "Ecommerce" "Ecommerce → Inventory → Stock Adjustment"
generate_page "$ECOM/Inventory/Stock Transfer.md" "Stock Transfer" "Ecommerce" "Ecommerce → Inventory → Stock Transfer"

# Customers
generate_page "$ECOM/Customers/Customer List.md" "Customer List" "Ecommerce" "Ecommerce → Customers → Customer List"
generate_page "$ECOM/Customers/Customer Groups.md" "Customer Groups" "Ecommerce" "Ecommerce → Customers → Customer Groups"

# Orders
generate_page "$ECOM/Orders/Order List.md" "Order List" "Ecommerce" "Ecommerce → Orders → Order List"
generate_page "$ECOM/Orders/Order Details.md" "Order Details" "Ecommerce" "Ecommerce → Orders → Order Details"
generate_page "$ECOM/Orders/Order Status.md" "Order Status" "Ecommerce" "Ecommerce → Orders → Order Status"

# Returns
generate_page "$ECOM/Returns/Return Request.md" "Return Request" "Ecommerce" "Ecommerce → Returns → Return Request"
generate_page "$ECOM/Returns/Return Approval.md" "Return Approval" "Ecommerce" "Ecommerce → Returns → Return Approval"

# Coupons
generate_page "$ECOM/Coupons/Coupon Management.md" "Coupon Management" "Ecommerce" "Ecommerce → Coupons → Coupon Management"
generate_page "$ECOM/Coupons/Gift Vouchers.md" "Gift Vouchers" "Ecommerce" "Ecommerce → Coupons → Gift Vouchers"

# Marketing
generate_page "$ECOM/Marketing/Campaigns.md" "Campaigns" "Ecommerce" "Ecommerce → Marketing → Campaigns"
generate_page "$ECOM/Marketing/Abandoned Cart.md" "Abandoned Cart" "Ecommerce" "Ecommerce → Marketing → Abandoned Cart"

# Reviews
generate_page "$ECOM/Reviews/Review List.md" "Review List" "Ecommerce" "Ecommerce → Reviews → Review List"
generate_page "$ECOM/Reviews/Review Approval.md" "Review Approval" "Ecommerce" "Ecommerce → Reviews → Review Approval"

# Shipping
generate_page "$ECOM/Shipping/Shipping Methods.md" "Shipping Methods" "Ecommerce" "Ecommerce → Shipping → Shipping Methods"
generate_page "$ECOM/Shipping/Shipping Zones.md" "Shipping Zones" "Ecommerce" "Ecommerce → Shipping → Shipping Zones"

# Payment
generate_page "$ECOM/Payment/Payment Gateways.md" "Payment Gateways" "Ecommerce" "Ecommerce → Payment → Payment Gateways"
generate_page "$ECOM/Payment/Transactions.md" "Transactions" "Ecommerce" "Ecommerce → Payment → Transactions"

# Reports
generate_page "$ECOM/Reports/Sales Reports.md" "Sales Reports" "Ecommerce" "Ecommerce → Reports → Sales Reports"
generate_page "$ECOM/Reports/Customer Reports.md" "Customer Reports" "Ecommerce" "Ecommerce → Reports → Customer Reports"
generate_page "$ECOM/Reports/Product Reports.md" "Product Reports" "Ecommerce" "Ecommerce → Reports → Product Reports"

# Settings
generate_page "$ECOM/Settings/General Settings.md" "General Settings" "Ecommerce" "Ecommerce → Settings → General Settings"
generate_page "$ECOM/Settings/Store Settings.md" "Store Settings" "Ecommerce" "Ecommerce → Settings → Store Settings"
generate_page "$ECOM/Settings/SEO Settings.md" "SEO Settings" "Ecommerce" "Ecommerce → Settings → SEO Settings"
generate_page "$ECOM/Settings/Email Settings.md" "Email Settings" "Ecommerce" "Ecommerce → Settings → Email Settings"
generate_page "$ECOM/Settings/Tax Settings.md" "Tax Settings" "Ecommerce" "Ecommerce → Settings → Tax Settings"

echo "Ecommerce menu docs generated."
