import type { BillOfMaterials } from "./manufacturing-boms";
import type { WorkCenter } from "./manufacturing-work-centers";
import type { WorkOrder } from "./manufacturing-work-orders";

export const MANUFACTURING_TABS = [
  "summary",
  "work-orders",
  "boms",
  "work-centers",
  "routings",
  "mrp",
] as const;

export type ManufacturingTab = (typeof MANUFACTURING_TABS)[number];

export const MANUFACTURING_TAB_LABELS: Record<ManufacturingTab, string> = {
  summary: "Overview",
  "work-orders": "Work Orders",
  boms: "BOMs",
  "work-centers": "Work Centers",
  routings: "Routings",
  mrp: "MRP",
};

export const MANUFACTURING_WAREHOUSES = ["WH-DHK", "WH-CTG", "WH-SYL"];

/** Prototype "today" — aligns demo dates with the UI build date. */
export const MANUFACTURING_TODAY = "2026-06-15";

export type ManufacturingKpi = {
  label: string;
  value: string;
  sub: string;
  alert?: boolean;
  up?: boolean;
};

export function buildManufacturingKpis(input: {
  workOrders: WorkOrder[];
  boms: BillOfMaterials[];
  workCenters: WorkCenter[];
}): ManufacturingKpi[] {
  const open = input.workOrders.filter(
    (wo) => wo.status !== "done" && wo.status !== "cancelled",
  );
  const inProgress = open.filter((wo) => wo.status === "in_progress");
  const plannedToday = open.filter((wo) => wo.plannedStart === MANUFACTURING_TODAY);
  const released = open.filter((wo) => wo.status === "released");
  const activeBoms = input.boms.filter((b) => b.type === "manufacturing");
  const phantomBoms = input.boms.filter((b) => b.type === "phantom");
  const activeWc = input.workCenters.filter((wc) => wc.status === "active");
  const avgUtil =
    activeWc.length === 0
      ? 0
      : Math.round(activeWc.reduce((s, wc) => s + wc.utilizationPct, 0) / activeWc.length);
  const topWc = [...activeWc].sort((a, b) => b.utilizationPct - a.utilizationPct)[0];

  return [
    {
      label: "Open work orders",
      value: String(open.length),
      sub: `${inProgress.length} in progress`,
      alert: inProgress.length > 0,
    },
    {
      label: "Planned today",
      value: String(plannedToday.length),
      sub: `${released.length} released, waiting start`,
    },
    {
      label: "BOMs active",
      value: String(activeBoms.length),
      sub: `${phantomBoms.length} phantom · ${input.boms.filter((b) => b.type === "kit").length} kit`,
    },
    {
      label: "Capacity used",
      value: `${avgUtil}%`,
      sub: topWc ? `${topWc.code} busiest` : "No active centers",
      up: avgUtil >= 70,
    },
  ];
}

/** Quick links on overview — each row is a guided demo scenario. */
export const manufacturingDemoHints = [
  {
    label: "Planned → Release",
    href: "/manufacturing/work-orders?view=wo_004",
    hint: "USB-C Hub — Release বাটন দিয়ে WO ছাড়ুন",
  },
  {
    label: "Released → Start",
    href: "/manufacturing/work-orders?view=wo_003",
    hint: "Bluetooth Speaker — Start চাপলে shop floor শুরু",
  },
  {
    label: "Shop floor (in progress)",
    href: "/manufacturing/work-orders?view=wo_002",
    hint: "Earbuds — Record output, Complete step, Issue materials",
  },
  {
    label: "BOM costing",
    href: "/manufacturing/boms?view=bom_002",
    hint: "Earbuds recipe — material + labor + margin per unit",
  },
  {
    label: "Phantom BOM",
    href: "/manufacturing/boms?view=bom_005",
    hint: "Watch sub-assembly — cost explodes to parent BOM",
  },
  {
    label: "Maintenance WC",
    href: "/manufacturing/work-centers?view=wc_006",
    hint: "Sewing line offline — T-shirt WO affected",
  },
  {
    label: "Draft routing",
    href: "/manufacturing/routings?view=rt_005",
    hint: "Smart Watch v3 — engineering sign-off pending",
  },
  {
    label: "MRP proposals",
    href: "/manufacturing/mrp?view=mrp_001",
    hint: "Latest run — WO + PR proposals confirm করুন",
  },
];

export function tabFromManufacturingPath(pathname: string): ManufacturingTab {
  if (pathname.startsWith("/manufacturing/work-orders")) return "work-orders";
  if (pathname.startsWith("/manufacturing/boms")) return "boms";
  if (pathname.startsWith("/manufacturing/work-centers")) return "work-centers";
  if (pathname.startsWith("/manufacturing/routings")) return "routings";
  if (pathname.startsWith("/manufacturing/mrp")) return "mrp";
  return "summary";
}

export function pathFromManufacturingTab(tab: ManufacturingTab): string {
  if (tab === "summary") return "/manufacturing";
  return `/manufacturing/${tab}`;
}
