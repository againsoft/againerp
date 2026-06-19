import type { LucideIcon } from "lucide-react";
import {
  Bot,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Warehouse,
  Briefcase,
  Factory,
  Handshake,
  Megaphone,
  BarChart3,
  Search,
  Image,
  TrendingUp,
} from "lucide-react";

export type WorkspaceNavItem = {
  id: string;
  title: string;
  href?: string;
  icon?: LucideIcon;
  badge?: string;
  children?: WorkspaceNavItem[];
};

export type WorkspaceNavGroup = {
  id: string;
  title: string;
  items: WorkspaceNavItem[];
};

/** Blueprint-aligned sidebar groups (Level 1 navigation). */
export const workspaceNavGroups: WorkspaceNavGroup[] = [
  {
    id: "nav.core-platform",
    title: "Core Platform",
    items: [
      { id: "contacts", title: "Contacts", href: "/customers/all", icon: Users },
      { id: "settings", title: "Settings", href: "/settings", icon: Settings },
      { id: "workspace", title: "Workspace", href: "/workspace", icon: Settings },
    ],
  },
  {
    id: "nav.business-ops",
    title: "Business Operations",
    items: [
      { id: "crm", title: "CRM", href: "/crm/dashboard", icon: TrendingUp },
      { id: "sales-marketing", title: "Sales & CRM", href: "/sales-marketing", icon: TrendingUp },
      { id: "inventory", title: "Inventory", href: "/inventory", icon: Warehouse },
      { id: "manufacturing", title: "Manufacturing", href: "/manufacturing", icon: Factory },
      { id: "partners", title: "Business Partners", href: "/partners", icon: Handshake },
      { id: "suppliers", title: "Purchase", href: "/suppliers", icon: Handshake },
    ],
  },
  {
    id: "nav.commerce",
    title: "Commerce",
    items: [
      { id: "catalog", title: "Catalog", href: "/catalog/products", icon: Package },
      { id: "orders", title: "Orders", href: "/orders", icon: ShoppingCart },
      { id: "customers", title: "Customers", href: "/customers", icon: Users },
      { id: "seo", title: "SEO", href: "/seo", icon: Search },
      { id: "media", title: "Media", href: "/media", icon: Image },
    ],
  },
  {
    id: "nav.marketing",
    title: "Marketing",
    items: [{ id: "marketing", title: "Marketing", href: "/marketing", icon: Megaphone }],
  },
  {
    id: "nav.human-resources",
    title: "Human Resources",
    items: [{ id: "hr", title: "HR & Payroll", href: "/hr", icon: Briefcase }],
  },
  {
    id: "nav.productivity",
    title: "Productivity",
    items: [
      { id: "executive", title: "Executive Dashboard", href: "/executive", icon: BarChart3 },
      { id: "reports", title: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    id: "nav.administration",
    title: "Administration",
    items: [
      { id: "control-center", title: "Control Center", href: "/control-center", icon: Settings },
      { id: "system", title: "System Hub", href: "/system", icon: Settings },
      { id: "ai-os", title: "AI OS", href: "/ai-os", icon: Bot },
    ],
  },
];

export const workspaceHomeItem: WorkspaceNavItem = {
  id: "home",
  title: "Home",
  href: "/home",
  icon: LayoutDashboard,
};

export const workspaceDashboardItem: WorkspaceNavItem = {
  id: "dashboard",
  title: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
};

export function flattenWorkspaceNav(): { title: string; href: string }[] {
  const items: { title: string; href: string }[] = [];
  const walk = (nodes: WorkspaceNavItem[], prefix: string) => {
    for (const node of nodes) {
      if (node.href) {
        items.push({
          title: prefix ? `${prefix} › ${node.title}` : node.title,
          href: node.href,
        });
      }
      if (node.children) walk(node.children, prefix ? `${prefix} › ${node.title}` : node.title);
    }
  };
  if (workspaceHomeItem.href) {
    items.push({ title: workspaceHomeItem.title, href: workspaceHomeItem.href });
  }
  for (const group of workspaceNavGroups) {
    walk(group.items, group.title);
  }
  return items;
}
