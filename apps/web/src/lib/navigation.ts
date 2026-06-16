import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Box,
  FolderTree,
  LayoutDashboard,
  Megaphone,
  Package,
  Puzzle,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Warehouse,
  BarChart3,
  Image,
} from "lucide-react";

export type NavItem = {
  title: string;
  href?: string;
  icon?: LucideIcon;
  children?: NavItem[];
};

export const sidebarNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    title: "Catalog",
    icon: Package,
    children: [
      { title: "Products", href: "/catalog/products" },
      { title: "Categories", href: "/catalog/categories" },
      { title: "Brands", href: "/catalog/brands" },
      { title: "Attributes", href: "/catalog/attributes" },
      { title: "Collections", href: "/catalog/collections" },
      {
        title: "Reviews",
        children: [
          { title: "Dashboard", href: "/catalog/reviews" },
          { title: "All Reviews", href: "/catalog/reviews/all" },
          { title: "Q&A", href: "/catalog/reviews/qa" },
          { title: "AI Analysis", href: "/catalog/reviews/ai-analysis" },
          { title: "Reports", href: "/catalog/reviews/reports" },
          { title: "Settings", href: "/catalog/reviews/settings" },
        ],
      },
      { title: "Variants", href: "/catalog/variants" },
      { title: "Filters", href: "/catalog/filters" },
      { title: "Bundles", href: "/catalog/bundles" },
      {
        title: "Product Configurator",
        children: [
          { title: "Overview", href: "/catalog/product-configurator" },
          { title: "Profiles", href: "/catalog/product-configurator/profiles" },
          { title: "Categories", href: "/catalog/product-configurator/categories" },
          { title: "Rules", href: "/catalog/product-configurator/rules" },
          { title: "Templates", href: "/catalog/product-configurator/templates" },
          { title: "Saved Builds", href: "/catalog/product-configurator/builds" },
          { title: "Analytics", href: "/catalog/product-configurator/analytics" },
          { title: "Component Attributes", href: "/configurator/attributes" },
        ],
      },
    ],
  },
  {
    title: "Customers",
    icon: Users,
    children: [
      { title: "Dashboard", href: "/customers" },
      { title: "All Customers", href: "/customers/all" },
      { title: "Customer Groups", href: "/customers/groups" },
      { title: "Segments", href: "/customers/segments" },
      { title: "Loyalty Program", href: "/customers/loyalty" },
      { title: "Rewards", href: "/customers/rewards" },
      { title: "Wallet", href: "/customers/wallet" },
      { title: "Wishlists", href: "/customers/wishlists" },
      { title: "Activities", href: "/customers/activities" },
      { title: "Support", href: "/customers/support" },
      { title: "Marketing", href: "/customers/marketing" },
      { title: "Reports", href: "/customers/reports" },
    ],
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    children: [
      { title: "Dashboard", href: "/orders" },
      { title: "All Orders", href: "/orders/all" },
      { title: "Create Order", href: "/orders/create" },
      { title: "Returns", href: "/orders/returns" },
      { title: "Refunds", href: "/orders/refunds" },
      { title: "Payments", href: "/orders/payments" },
      { title: "Shipments", href: "/orders/shipments" },
      { title: "Abandoned Carts", href: "/orders/abandoned-carts" },
      { title: "Activities", href: "/orders/activities" },
      { title: "Reports", href: "/orders/reports" },
    ], // Status tabs (Draft, Pending, …) are inside the All Orders grid — not in nav
  },
  { title: "Inventory", href: "/inventory", icon: Warehouse },
  {
    title: "Suppliers",
    icon: Truck,
    children: [
      { title: "All Suppliers", href: "/suppliers/all" },
      { title: "Purchase Orders", href: "/suppliers/purchase-orders" },
      { title: "RFQ", href: "/suppliers/rfq" },
      { title: "Quotations", href: "/suppliers/quotations" },
      { title: "Goods Receipts", href: "/suppliers/receipts" },
      { title: "Vendor Bills", href: "/suppliers/bills" },
      { title: "Returns", href: "/suppliers/returns" },
      { title: "Stock Feed", href: "/suppliers/stock-feed" },
      { title: "Summary", href: "/suppliers" },
    ],
  },
  {
    title: "Marketing",
    icon: Megaphone,
    children: [
      { title: "Overview", href: "/marketing" },
      { title: "Flash Sales", href: "/marketing/flash-sales" },
      { title: "Promotions", href: "/marketing/promotions" },
      { title: "Special Offers", href: "/marketing/special-offers" },
    ],
  },
  {
    title: "Configurator",
    icon: Puzzle,
    children: [
      { title: "Admin hub", href: "/catalog/product-configurator" },
      { title: "Component Attributes", href: "/configurator/attributes" },
      { title: "Compatibility Rules", href: "/catalog/product-configurator/rules" },
    ],
  },
  { title: "SEO", href: "/seo", icon: Search },
  { title: "Media", href: "/media", icon: Image },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  {
    title: "System",
    icon: Settings,
    children: [
      {
        title: "Settings",
        href: "/settings",
        children: [
          { title: "Business", href: "/settings/business" },
          { title: "AI", href: "/settings/ai" },
          { title: "Plugins", href: "/settings/plugins" },
          {
            title: "Localisation",
            children: [
              { title: "Store Locations", href: "/settings/localisation/store-locations" },
              { title: "Languages", href: "/settings/localisation/languages" },
              { title: "Currencies", href: "/settings/localisation/currencies" },
              { title: "Stock Statuses", href: "/settings/localisation/stock-statuses" },
              { title: "Order Statuses", href: "/settings/localisation/order-statuses" },
              { title: "Countries", href: "/settings/localisation/countries" },
              { title: "Regions", href: "/settings/localisation/regions" },
              { title: "Zones", href: "/settings/localisation/zones" },
              { title: "Geo Zones", href: "/settings/localisation/geo-zones" },
            ],
          },
        ],
      },
      { title: "Workspace", href: "/workspace" },
      { title: "Control Center", href: "/control-center" },
      { title: "System Hub", href: "/system" },
    ],
  },
  { title: "AI OS", href: "/ai-os", icon: Bot },
];

export const quickCreateItems = [
  { label: "Product", href: "/catalog/products?create=1" },
  { label: "Order", href: "/orders/create" },
  { label: "Customer", href: "/customers?create=1" },
  { label: "Category", href: "/catalog/categories?create=1" },
];

export const companies = [
  { id: "co1", name: "UrbanWear Retail" },
  { id: "co2", name: "TechGadgets BD" },
  { id: "co3", name: "Home & Living Co" },
];

export const branches = [
  { id: "br1", companyId: "co1", name: "Dhaka HQ" },
  { id: "br2", companyId: "co1", name: "Chittagong" },
  { id: "br3", companyId: "co2", name: "Main Warehouse" },
];
