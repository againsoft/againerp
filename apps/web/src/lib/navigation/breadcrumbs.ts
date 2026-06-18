import { flattenModuleNav } from "@/components/navigation/module-nav-types";
import { flattenHrNav, HR_MODULE_ROOT } from "@/lib/mock-data/hr-navigation";
import { flattenSmwNav, SMW_MODULE_ROOT } from "@/lib/mock-data/smw-navigation";
import { sidebarNav } from "@/lib/navigation";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

const HR_FLAT = flattenHrNav();
const SMW_FLAT = flattenSmwNav();

function flattenSidebarNav() {
  const out: { title: string; href: string; path: string[] }[] = [];
  const walk = (nodes: typeof sidebarNav, parents: string[]) => {
    for (const node of nodes) {
      const path = [...parents, node.title];
      if (node.href) {
        out.push({ title: node.title, href: node.href, path });
      }
      if (node.children) walk(node.children, path);
    }
  };
  walk(sidebarNav, []);
  return out;
}

const SIDEBAR_FLAT = flattenSidebarNav();

const SEGMENT_LABELS: Record<string, string> = {
  hr: "HR & Payroll",
  payroll: "Payroll",
  catalog: "Catalog",
  customers: "Customers",
  orders: "Orders",
  inventory: "Inventory",
  suppliers: "Suppliers",
  partners: "Business Partners",
  manufacturing: "Manufacturing",
  "sales-marketing": "Sales & Marketing",
  leads: "Leads",
  opportunities: "Opportunities",
  quotations: "Quotations",
  campaigns: "Campaigns",
  activities: "Activities",
  targets: "Targets",
  commission: "Commission",
  teams: "Teams",
  settings: "Settings",
  inbox: "Inbox",
  approvals: "Approvals",
  notifications: "Notifications",
  dashboard: "Dashboard",
  employees: "Employees",
  attendance: "Attendance",
  leave: "Leave",
  recruitment: "Recruitment",
  organization: "Organization",
  reports: "Reports",
  ai: "AI Assistant",
  activity: "Activity Timeline",
};

function normalizeHref(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname;
}

function findNavMatch(pathname: string, search: string) {
  const full = normalizeHref(pathname, search);
  const pools = [
    ...HR_FLAT.map((e) => ({ title: e.title, href: e.href, path: e.path })),
    ...SMW_FLAT.map((e) => ({ title: e.title, href: e.href, path: e.path })),
    ...SIDEBAR_FLAT,
  ];

  const exact = pools.find((e) => e.href === full);
  if (exact) return exact;

  const pathMatches = pools
    .filter((e) => {
      const [path] = e.href.split("?");
      if (path === "/hr" && pathname !== "/hr") return false;
      if (path === "/sales-marketing" && pathname !== "/sales-marketing") return false;
      return pathname === path || pathname.startsWith(`${path}/`);
    })
    .sort((a, b) => b.href.length - a.href.length);

  return pathMatches[0];
}

function fallbackCrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [];

  const crumbs: BreadcrumbItem[] = [];
  let href = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]!;
    href += `/${segment}`;
    const label =
      SEGMENT_LABELS[segment] ??
      segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const isLast = i === segments.length - 1;
    crumbs.push({ label, href: isLast ? undefined : href });
  }

  return crumbs;
}

export function resolveBreadcrumbs(pathname: string, search = ""): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [{ label: "AgainERP", href: "/dashboard" }];

  if (pathname === "/dashboard") {
    crumbs.push({ label: "Dashboard" });
    return crumbs;
  }

  const match = findNavMatch(pathname, search);

  if (match) {
    const isHr =
      pathname.startsWith("/hr") ||
      pathname.startsWith("/payroll") ||
      pathname.startsWith("/inbox/approvals");

    const isSmw = pathname.startsWith("/sales-marketing");

    if (isHr) {
      crumbs.push({ label: HR_MODULE_ROOT.title, href: "/hr" });
      const modulePath = match.path;
      modulePath.forEach((label, index) => {
        const isLast = index === modulePath.length - 1;
        crumbs.push({
          label,
          href: isLast ? undefined : match.href.split("?")[0],
        });
      });
      return crumbs;
    }

    if (isSmw) {
      crumbs.push({ label: SMW_MODULE_ROOT.title, href: "/sales-marketing/dashboard" });
      const modulePath = match.path;
      modulePath.forEach((label, index) => {
        const isLast = index === modulePath.length - 1;
        crumbs.push({
          label,
          href: isLast ? undefined : match.href.split("?")[0],
        });
      });
      return crumbs;
    }

    match.path.forEach((label, index) => {
      const isLast = index === match.path.length - 1;
      crumbs.push({
        label,
        href: isLast ? undefined : match.href.split("?")[0],
      });
    });
    return crumbs;
  }

  const fallback = fallbackCrumbs(pathname);
  return [...crumbs, ...fallback];
}
