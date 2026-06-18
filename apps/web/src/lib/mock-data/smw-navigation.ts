/**
 * Sales & Marketing Workspace module navigation.
 * @see docs/modules/sales-marketing/ui-design/01_MASTER_LAYOUT_UI.md
 */

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarCheck,
  FileText,
  GitBranch,
  LayoutDashboard,
  Megaphone,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

export type SmwNavAction = "ai-chat";

export type SmwNavItem = {
  id: string;
  title: string;
  href?: string;
  action?: SmwNavAction;
  icon?: LucideIcon;
  children?: SmwNavItem[];
};

export const SMW_MODULE_NAV: SmwNavItem[] = [
  {
    id: "NAV-SMW-DSH",
    title: "Dashboard",
    href: "/sales-marketing/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "NAV-SMW-LDS",
    title: "Leads",
    href: "/sales-marketing/leads",
    icon: UserPlus,
  },
  {
    id: "NAV-SMW-OPP",
    title: "Opportunities",
    href: "/sales-marketing/opportunities",
    icon: GitBranch,
  },
  {
    id: "NAV-SMW-QUO",
    title: "Quotations",
    href: "/sales-marketing/quotations",
    icon: FileText,
  },
  {
    id: "NAV-SMW-CMP",
    title: "Campaigns",
    href: "/sales-marketing/campaigns",
    icon: Megaphone,
  },
  {
    id: "NAV-SMW-ACT",
    title: "Activities",
    href: "/sales-marketing/activities",
    icon: CalendarCheck,
  },
  {
    id: "NAV-SMW-TGT",
    title: "Targets",
    href: "/sales-marketing/targets",
    icon: Target,
  },
  {
    id: "NAV-SMW-COM",
    title: "Commission",
    href: "/sales-marketing/commission",
    icon: Wallet,
  },
  {
    id: "NAV-SMW-TM",
    title: "Teams",
    href: "/sales-marketing/teams",
    icon: Users,
  },
  {
    id: "NAV-SMW-RPT",
    title: "Reports",
    href: "/sales-marketing/reports",
    icon: BarChart3,
  },
  {
    id: "NAV-SMW-AI",
    title: "AI Copilot",
    href: "/sales-marketing/ai",
    icon: Sparkles,
  },
  {
    id: "NAV-SMW-SET",
    title: "Settings",
    href: "/sales-marketing/settings",
    icon: Settings,
  },
];

export const SMW_MODULE_ROOT = {
  id: "NAV-SMW-ROOT",
  title: "Sales & Marketing",
  subtitle: "Revenue Operations",
  icon: TrendingUp,
} as const;

export type FlatSmwNavEntry = {
  id: string;
  title: string;
  href: string;
  path: string[];
};

export function flattenSmwNav(
  items: SmwNavItem[] = SMW_MODULE_NAV,
  parents: string[] = [],
): FlatSmwNavEntry[] {
  const out: FlatSmwNavEntry[] = [];
  for (const item of items) {
    const path = [...parents, item.title];
    if (item.href) {
      out.push({ id: item.id, title: item.title, href: item.href, path });
    }
    if (item.children?.length) {
      out.push(...flattenSmwNav(item.children, path));
    }
  }
  return out;
}

export function isSmwModulePath(pathname: string): boolean {
  return pathname.startsWith("/sales-marketing");
}

export function matchSmwNavHref(pathname: string, search: string, href?: string): boolean {
  if (!href) return false;
  const [path, query] = href.split("?");
  const pathMatch =
    pathname === path ||
    (path !== "/sales-marketing/dashboard" && pathname.startsWith(`${path}/`)) ||
    (path === "/sales-marketing/dashboard" && pathname === "/sales-marketing/dashboard");
  if (!pathMatch) return false;
  if (!query) return true;
  const params = new URLSearchParams(query);
  const current = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  for (const [key, value] of params.entries()) {
    if (current.get(key) !== value) return false;
  }
  return true;
}

export function isSmwNavItemActive(pathname: string, search: string, item: SmwNavItem): boolean {
  if (item.href && matchSmwNavHref(pathname, search, item.href)) return true;
  return item.children?.some((c) => isSmwNavItemActive(pathname, search, c)) ?? false;
}

export function smwPageTitle(pathname: string): string {
  const flat = flattenSmwNav();
  const match = flat
    .filter((e) => pathname === e.href.split("?")[0] || pathname.startsWith(`${e.href.split("?")[0]}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.title ?? "Sales & Marketing";
}
