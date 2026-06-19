import type {
  ActivityItem,
  AiBriefing,
  AlertItem,
  KpiData,
  QuickAction,
} from "@/lib/dashboard/types";

export const workspaceKpis: KpiData[] = [
  { id: "kpi-revenue", label: "Revenue MTD", value: "৳ 12.4M", change: "+8.2%", up: true },
  { id: "kpi-orders", label: "Open Orders", value: "284", change: "+12", up: true },
  { id: "kpi-stock", label: "Low Stock SKUs", value: "18", change: "−3", up: false },
  { id: "kpi-approvals", label: "Pending Approvals", value: "7", change: "2 urgent", up: false },
  { id: "kpi-customers", label: "Active Customers", value: "1,248", change: "+3.2%", up: true },
  { id: "kpi-conversion", label: "Conversion Rate", value: "3.8%", change: "−0.4%", up: false },
];

export const workspaceQuickActions: QuickAction[] = [
  { id: "qa-product", label: "Create Product", href: "/catalog/products?create=1" },
  { id: "qa-order", label: "Create Order", href: "/orders/create" },
  { id: "qa-leave", label: "Apply Leave", href: "/hr/leave?create=1" },
  { id: "qa-po", label: "Create PO", href: "/suppliers/purchase-orders?create=1" },
];

export const workspaceNotifications: AlertItem[] = [
  {
    id: "n1",
    title: "PO approval required",
    message: "PO-8821 exceeds threshold — awaiting your approval.",
    severity: "warning",
    href: "/inbox/approvals",
  },
  {
    id: "n2",
    title: "Low stock alert",
    message: "18 SKUs below reorder point in Dhaka HQ.",
    severity: "danger",
    href: "/inventory",
  },
  {
    id: "n3",
    title: "Payroll run scheduled",
    message: "June payroll closes in 2 days.",
    severity: "info",
    href: "/hr",
  },
  {
    id: "n4",
    title: "New lead assigned",
    message: "Metro Retail — deal value ৳2.4M.",
    severity: "success",
    href: "/sales-marketing/leads",
  },
];

export const workspaceActivities: ActivityItem[] = [
  { id: "a1", user: "Sadia", action: "updated price on SKU-0042", time: "5m ago" },
  { id: "a2", user: "Rahim", action: "published 3 products to storefront", time: "1h ago" },
  { id: "a3", user: "System", action: "low stock alert: Wireless Earbuds Pro", time: "2h ago" },
  { id: "a4", user: "Finance Bot", action: "flagged duplicate vendor bill", time: "3h ago" },
  { id: "a5", user: "Karim", action: "approved leave request for Nusrat", time: "4h ago" },
];

export const workspaceAiBriefing: AiBriefing = {
  id: "ai-brief-workspace",
  title: "AI Daily Brief",
  bullets: [
    "Revenue is tracking 8% above last month — top category: Apparel.",
    "7 purchase orders await approval — 2 exceed threshold.",
    "18 SKUs below reorder point in Dhaka HQ warehouse.",
    "3 deals in pipeline may close this week — total ৳4.2M.",
  ],
  ctaLabel: "Open AI Assistant",
};
