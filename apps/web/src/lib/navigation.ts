import type { LucideIcon } from "lucide-react";
import {
  Bot,
  BarChart3,
  Briefcase,
  Factory,
  FileText,
  Globe,
  Handshake,
  Image,
  LayoutDashboard,
  Layers,
  Megaphone,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  Truck,
  Users,
  Warehouse,
  TrendingUp,
  Wrench,
  MessageSquare,
} from "lucide-react";

export type NavItem = {
  title: string;
  href?: string;
  icon?: LucideIcon;
  section?: string; // section divider label above this item
  children?: NavItem[];
};

export const sidebarNav: NavItem[] = [
  // ─── HOME ────────────────────────────────────────────────────────────────
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },

  // ─── ECOMMERCE ───────────────────────────────────────────────────────────
  {
    title: "Catalog",
    icon: Package,
    section: "ECOMMERCE",
    children: [
      { title: "Products", href: "/catalog/products" },
      { title: "Categories", href: "/catalog/categories" },
      { title: "Brands", href: "/catalog/brands" },
      { title: "Attributes", href: "/catalog/attributes" },
      { title: "Variants", href: "/catalog/variants" },
      { title: "Filters", href: "/catalog/filters" },
      { title: "Collections", href: "/catalog/collections" },
      { title: "Bundles", href: "/catalog/bundles" },
      {
        title: "Specifications",
        children: [
          { title: "Profiles", href: "/catalog/product-configurator/profiles" },
          { title: "Templates", href: "/catalog/product-configurator/templates" },
          { title: "AI Import", href: "/catalog/product-configurator/categories" },
        ],
      },
      {
        title: "Reviews",
        children: [
          { title: "All Reviews", href: "/catalog/reviews" },
          { title: "Q&A", href: "/catalog/reviews/qa" },
          { title: "AI Analysis", href: "/catalog/reviews/ai-analysis" },
        ],
      },
    ],
  },
  {
    title: "Inventory",
    icon: Warehouse,
    children: [
      { title: "Stock Management", href: "/inventory" },
      { title: "Low Stock Alerts", href: "/inventory/alerts" },
      { title: "Stock Adjustment", href: "/inventory/adjustment" },
      { title: "Stock Transfer", href: "/inventory/transfer" },
      { title: "Warehouses", href: "/inventory/warehouses" },
      { title: "Barcode", href: "/inventory/barcode" },
    ],
  },
  {
    title: "Sales",
    icon: ShoppingCart,
    children: [
      { title: "All Orders", href: "/orders/all" },
      { title: "Create Order", href: "/orders/create" },
      { title: "Shipments", href: "/orders/shipments" },
      { title: "Returns", href: "/orders/returns" },
      { title: "Refunds", href: "/orders/refunds" },
      { title: "Payments", href: "/orders/payments" },
      { title: "Abandoned Carts", href: "/orders/abandoned-carts" },
      { title: "Quotations", href: "/suppliers/quotations" },
      { title: "Reports", href: "/orders/reports" },
    ],
  },
  {
    title: "Customers",
    icon: Users,
    children: [
      { title: "All Customers", href: "/customers/all" },
      { title: "Customer Groups", href: "/customers/groups" },
      { title: "Segments", href: "/customers/segments" },
      { title: "Loyalty Program", href: "/customers/loyalty" },
      { title: "Rewards", href: "/customers/rewards" },
      { title: "Wallet", href: "/customers/wallet" },
      { title: "Wishlists", href: "/customers/wishlists" },
      { title: "Support", href: "/customers/support" },
      { title: "Reports", href: "/customers/reports" },
    ],
  },
  {
    title: "Marketing",
    icon: Megaphone,
    children: [
      { title: "Coupons", href: "/marketing/promotions" },
      { title: "Flash Sales", href: "/marketing/flash-sales" },
      { title: "Promotions", href: "/marketing/promotions" },
      { title: "Special Offers", href: "/marketing/special-offers" },
      { title: "Campaigns", href: "/sales-marketing/campaigns" },
      { title: "Loyalty Program", href: "/customers/loyalty" },
      { title: "Abandoned Cart", href: "/orders/abandoned-carts" },
    ],
  },
  {
    title: "Content",
    icon: FileText,
    children: [
      { title: "Pages", href: "/website/pages" },
      { title: "Blog Posts", href: "/website/blog/posts" },
      { title: "Blog Categories", href: "/website/blog/categories" },
      { title: "FAQs", href: "/website/faqs" },
      { title: "Testimonials", href: "/website/testimonials" },
      { title: "Announcements", href: "/website/announcements" },
    ],
  },
  {
    title: "Builder",
    icon: Layers,
    children: [
      { title: "Theme Manager", href: "/website/settings" },
      { title: "Homepage Builder", href: "/website/homepage" },
      { title: "Header Builder", href: "/website/header" },
      { title: "Footer Builder", href: "/website/footer" },
      { title: "Menu Builder", href: "/website/menus" },
      { title: "Landing Pages", href: "/website/landing-pages" },
      { title: "Popup Manager", href: "/website/popups" },
    ],
  },
  {
    title: "SEO",
    icon: Search,
    children: [
      { title: "SEO Dashboard", href: "/seo" },
      { title: "Meta Manager", href: "/seo/meta" },
      { title: "URL Manager", href: "/seo/urls" },
      { title: "Redirects", href: "/seo/redirects" },
      { title: "Schema Manager", href: "/seo/schema" },
      { title: "Sitemap", href: "/seo/sitemap" },
      { title: "Robots.txt", href: "/seo/robots" },
      { title: "Keyword Tracking", href: "/seo/keywords" },
      { title: "SEO Audit", href: "/seo/audit" },
    ],
  },
  {
    title: "AI Tools",
    icon: Sparkles,
    children: [
      { title: "AI Dashboard", href: "/ai-os" },
      { title: "Product Description", href: "/ai-os/product-description" },
      { title: "Blog Writer", href: "/ai-os/blog-writer" },
      { title: "SEO Generator", href: "/ai-os/seo-generator" },
      { title: "Review Summary", href: "/ai-os/review-summary" },
      { title: "Image Generator", href: "/ai-os/image-generator" },
      { title: "Sales Forecast", href: "/ai-os/sales-forecast" },
      { title: "Inventory Forecast", href: "/ai-os/inventory-forecast" },
      { title: "Recommendations", href: "/ai-os/recommendations" },
      { title: "Analytics Assistant", href: "/ai-os/analytics" },
    ],
  },
  {
    title: "Media",
    icon: Image,
    children: [
      { title: "Media Library", href: "/media" },
      { title: "Images", href: "/media/images" },
      { title: "Videos", href: "/media/videos" },
      { title: "Documents", href: "/media/documents" },
      { title: "CDN Manager", href: "/media/cdn" },
    ],
  },
  {
    title: "Reports",
    icon: BarChart3,
    children: [
      { title: "Sales Reports", href: "/reports/sales" },
      { title: "Product Reports", href: "/reports/products" },
      { title: "Customer Reports", href: "/reports/customers" },
      { title: "Inventory Reports", href: "/reports/inventory" },
      { title: "Marketing Reports", href: "/reports/marketing" },
      { title: "Return Reports", href: "/reports/returns" },
      { title: "Profit Reports", href: "/reports/profit" },
      { title: "Tax Reports", href: "/reports/tax" },
      { title: "Custom Reports", href: "/reports/custom" },
    ],
  },

  // ─── OPERATIONS ──────────────────────────────────────────────────────────
  {
    title: "CRM",
    icon: MessageSquare,
    section: "OPERATIONS",
    children: [
      { title: "Dashboard", href: "/crm/dashboard" },
      { title: "Contacts", href: "/crm/contacts" },
      { title: "Leads", href: "/crm/leads" },
      { title: "Pipeline", href: "/crm/pipeline" },
      { title: "Activities", href: "/crm/activities" },
      { title: "AI Assistant", href: "/crm/ai" },
    ],
  },
  {
    title: "Sales & Marketing",
    icon: TrendingUp,
    children: [
      { title: "Dashboard", href: "/sales-marketing/dashboard" },
      { title: "Leads", href: "/sales-marketing/leads" },
      { title: "Opportunities", href: "/sales-marketing/opportunities" },
      { title: "Quotations", href: "/sales-marketing/quotations" },
      { title: "Campaigns", href: "/sales-marketing/campaigns" },
      { title: "Teams", href: "/sales-marketing/teams" },
      { title: "Targets", href: "/sales-marketing/targets" },
      { title: "Commission", href: "/sales-marketing/commission" },
      { title: "Reports", href: "/sales-marketing/reports" },
    ],
  },
  {
    title: "Purchase",
    icon: Truck,
    children: [
      { title: "Suppliers", href: "/suppliers/all" },
      { title: "Purchase Orders", href: "/suppliers/purchase-orders" },
      { title: "RFQ", href: "/suppliers/rfq" },
      { title: "Quotations", href: "/suppliers/quotations" },
      { title: "Goods Receipts", href: "/suppliers/receipts" },
      { title: "Vendor Bills", href: "/suppliers/bills" },
      { title: "Returns", href: "/suppliers/returns" },
      { title: "Stock Feed", href: "/suppliers/stock-feed" },
    ],
  },
  {
    title: "Manufacturing",
    icon: Factory,
    children: [
      { title: "Overview", href: "/manufacturing" },
      { title: "Work Orders", href: "/manufacturing/work-orders" },
      { title: "Bills of Materials", href: "/manufacturing/boms" },
      { title: "Work Centers", href: "/manufacturing/work-centers" },
      { title: "Routings", href: "/manufacturing/routings" },
      { title: "MRP", href: "/manufacturing/mrp" },
    ],
  },
  {
    title: "Business Partners",
    icon: Handshake,
    children: [
      { title: "Directory", href: "/partners/directory" },
      { title: "Onboarding", href: "/partners/onboarding" },
      { title: "Tiers", href: "/partners/tiers" },
      { title: "Territories", href: "/partners/territories" },
      { title: "Performance", href: "/partners/performance" },
    ],
  },

  // ─── HR & WORKFORCE ──────────────────────────────────────────────────────
  {
    title: "HR",
    icon: Briefcase,
    section: "HR & WORKFORCE",
    children: [
      { title: "Employees", href: "/hr/employees" },
      { title: "Attendance", href: "/hr/attendance" },
      { title: "Leave", href: "/hr/leave" },
      { title: "Recruitment", href: "/hr/recruitment" },
      { title: "Training", href: "/hr/training" },
      { title: "Performance", href: "/hr/performance" },
      { title: "Documents", href: "/hr/documents" },
      { title: "Organization", href: "/hr/organization" },
      { title: "Reports", href: "/hr/reports" },
    ],
  },
  {
    title: "Payroll",
    icon: BarChart3,
    children: [
      { title: "Payroll Runs", href: "/payroll" },
      { title: "Payslips", href: "/payroll/payslips" },
      { title: "Salary Structure", href: "/payroll/salary-structure" },
      { title: "Overtime", href: "/hr/overtime" },
      { title: "Tax & Deductions", href: "/payroll/deductions" },
      { title: "Reports", href: "/payroll/reports" },
    ],
  },

  {
    title: "Website",
    icon: Globe,
    children: [
      { title: "Dashboard", href: "/website/dashboard" },
      { title: "Pages", href: "/website/pages" },
      { title: "Blog Posts", href: "/website/blog/posts" },
      { title: "Portfolio", href: "/website/portfolio" },
      { title: "Team", href: "/website/team" },
      { title: "Careers", href: "/website/careers" },
      { title: "Forms", href: "/website/forms" },
      { title: "SEO Meta", href: "/website/seo/meta" },
      { title: "Domain", href: "/website/domain" },
      { title: "AI Tools", href: "/website/ai" },
      { title: "Settings", href: "/website/settings" },
    ],
  },

  // ─── PLATFORM ────────────────────────────────────────────────────────────
  {
    title: "AI OS",
    icon: Bot,
    section: "PLATFORM",
    href: "/ai-os",
  },
  {
    title: "Workspace",
    icon: Globe,
    href: "/workspace",
  },
  {
    title: "System",
    icon: Settings,
    children: [
      { title: "General Settings", href: "/settings/business" },
      { title: "Store Settings", href: "/settings" },
      { title: "Localisation", href: "/settings/localisation" },
      { title: "Plugins", href: "/settings/plugins" },
      { title: "Payment Gateways", href: "/settings/payments" },
      { title: "Shipping Methods", href: "/settings/shipping" },
      { title: "Email / SMS", href: "/settings/notifications" },
      { title: "User Management", href: "/settings/users" },
      { title: "Roles & Permissions", href: "/settings/roles" },
      { title: "AI Settings", href: "/settings/ai" },
      { title: "Control Center", href: "/control-center" },
    ],
  },
];

export const quickCreateItems = [
  { label: "Product", href: "/catalog/products?create=1" },
  { label: "Order", href: "/orders/create" },
  { label: "Customer", href: "/customers?create=1" },
  { label: "Employee", href: "/hr/employees?create=1" },
  { label: "Leave request", href: "/hr/leave/requests?create=1" },
  { label: "Payroll run", href: "/payroll/runs?create=1" },
  { label: "Job requisition", href: "/hr/recruitment/requisitions?create=1" },
  { label: "Training session", href: "/hr/training/sessions?create=1" },
  { label: "Work Order", href: "/manufacturing/work-orders?create=1" },
  { label: "Lead", href: "/sales-marketing/leads?create=1" },
  { label: "Opportunity", href: "/sales-marketing/opportunities?create=1" },
  { label: "Quotation", href: "/sales-marketing/quotations/create" },
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
