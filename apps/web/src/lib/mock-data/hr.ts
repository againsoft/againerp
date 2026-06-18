/** HR & Payroll module navigation — aligns with HR_NAVIGATION_ARCHITECTURE.md (prototype subset). */

export const HR_NAV_ITEMS = [
  { id: "overview", label: "Dashboard", href: "/hr" },
  { id: "employees", label: "Employees", href: "/hr/employees" },
  { id: "attendance", label: "Attendance", href: "/hr/attendance" },
  { id: "leave", label: "Leave", href: "/hr/leave" },
  { id: "payroll", label: "Payroll", href: "/payroll" },
  { id: "recruitment", label: "Recruitment", href: "/hr/recruitment" },
  { id: "reports", label: "Reports", href: "/hr/reports" },
  { id: "settings", label: "Settings", href: "/hr/settings" },
  { id: "ai", label: "AI Assistant", href: "/hr/ai" },
] as const;

export type HrNavId = (typeof HR_NAV_ITEMS)[number]["id"];

export function tabFromHrPath(pathname: string): HrNavId {
  if (pathname === "/hr" || pathname === "/hr/") return "overview";
  if (pathname.startsWith("/payroll")) return "payroll";
  const match = HR_NAV_ITEMS.find(
    (item) => item.id !== "overview" && item.id !== "payroll" && pathname.startsWith(item.href),
  );
  return match?.id ?? "overview";
}

export function hrBreadcrumbLabel(tab: HrNavId): string {
  return HR_NAV_ITEMS.find((n) => n.id === tab)?.label ?? "Dashboard";
}

/** Static shell placeholders — superseded by hr-dashboard.ts for SCR-HR-DSH-001. */
export const HR_SHELL_KPIS = [
  { id: "headcount", label: "Headcount", value: "—", hint: "Active employees" },
  { id: "attendance", label: "Present today", value: "—", hint: "Attendance" },
  { id: "leave", label: "On leave", value: "—", hint: "Approved today" },
  { id: "approvals", label: "Pending approvals", value: "—", hint: "Action required" },
] as const;
