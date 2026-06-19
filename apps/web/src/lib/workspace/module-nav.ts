export type ModuleNavTab = {
  id: string;
  label: string;
  href: string;
};

export type ModuleContext = {
  moduleId: string;
  moduleLabel: string;
  tabs: ModuleNavTab[];
};

const MODULE_TABS: Record<string, Omit<ModuleContext, "moduleId">> = {
  hr: {
    moduleLabel: "HR & Payroll",
    tabs: [
      { id: "WS-MODNAV-DASH", label: "Dashboard", href: "/hr" },
      { id: "WS-MODNAV-OPS", label: "Employees", href: "/hr/employees" },
      { id: "WS-MODNAV-OPS", label: "Leave", href: "/hr/leave" },
      { id: "WS-MODNAV-RPT", label: "Reports", href: "/hr/reports" },
      { id: "WS-MODNAV-SET", label: "Settings", href: "/hr/settings" },
    ],
  },
  catalog: {
    moduleLabel: "Catalog",
    tabs: [
      { id: "WS-MODNAV-DASH", label: "Dashboard", href: "/catalog/products" },
      { id: "WS-MODNAV-OPS", label: "Products", href: "/catalog/products" },
      { id: "WS-MODNAV-OPS", label: "Categories", href: "/catalog/categories" },
      { id: "WS-MODNAV-RPT", label: "Reports", href: "/reports" },
    ],
  },
  inventory: {
    moduleLabel: "Inventory",
    tabs: [
      { id: "WS-MODNAV-DASH", label: "Dashboard", href: "/inventory" },
      { id: "WS-MODNAV-OPS", label: "Stock", href: "/inventory" },
      { id: "WS-MODNAV-RPT", label: "Reports", href: "/reports" },
    ],
  },
  prototype: {
    moduleLabel: "Module Prototype",
    tabs: [
      { id: "WS-MODNAV-DASH", label: "Dashboard", href: "/prototype/module" },
      { id: "WS-MODNAV-OPS", label: "Operations", href: "/prototype/module?tab=operations" },
      { id: "WS-MODNAV-RPT", label: "Reports", href: "/prototype/module?tab=reports" },
      { id: "WS-MODNAV-SET", label: "Settings", href: "/prototype/module?tab=settings" },
    ],
  },
  crm: {
    moduleLabel: "CRM",
    tabs: [
      { id: "WS-MODNAV-DASH", label: "Dashboard", href: "/crm/dashboard" },
      { id: "WS-MODNAV-OPS", label: "Leads", href: "/crm/leads" },
      { id: "WS-MODNAV-OPS", label: "Contacts", href: "/crm/contacts" },
      { id: "WS-MODNAV-OPS", label: "Pipeline", href: "/crm/pipeline" },
      { id: "WS-MODNAV-OPS", label: "Activities", href: "/crm/activities" },
      { id: "WS-MODNAV-AUTO", label: "AI CRM", href: "/crm/ai" },
    ],
  },
};

export function resolveModuleContext(pathname: string): ModuleContext | null {
  if (pathname.startsWith("/hr") || pathname.startsWith("/payroll")) {
    return { moduleId: "hr", ...MODULE_TABS.hr };
  }
  if (pathname.startsWith("/catalog")) {
    return { moduleId: "catalog", ...MODULE_TABS.catalog };
  }
  if (pathname.startsWith("/inventory")) {
    return { moduleId: "inventory", ...MODULE_TABS.inventory };
  }
  if (pathname.startsWith("/prototype/module")) {
    return { moduleId: "prototype", ...MODULE_TABS.prototype };
  }
  if (pathname.startsWith("/crm")) {
    return { moduleId: "crm", ...MODULE_TABS.crm };
  }
  return null;
}

export function isModuleNavTabActive(pathname: string, href: string): boolean {
  const base = href.split("?")[0];
  if (base === pathname) return true;
  if (pathname.startsWith(base + "/")) return true;
  if (base === "/hr" && pathname.startsWith("/hr")) return pathname === "/hr" || pathname === "/hr/dashboard";
  return false;
}
