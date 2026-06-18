import { MANUFACTURING_TODAY, MANUFACTURING_WAREHOUSES } from "./manufacturing";

export type MrpRunStatus = "draft" | "running" | "completed" | "failed";

export type MrpSuggestionType = "work_order" | "purchase_request";

export type MrpSuggestionStatus = "proposed" | "confirmed" | "skipped";

export type MrpSuggestion = {
  id: string;
  type: MrpSuggestionType;
  sku: string;
  productName: string;
  quantity: number;
  dueDate: string;
  source: string;
  status: MrpSuggestionStatus;
  notes?: string;
};

export type MrpRun = {
  id: string;
  number: string;
  runDate: string;
  horizonDays: number;
  warehouse: string;
  status: MrpRunStatus;
  demandSources: string[];
  suggestions: MrpSuggestion[];
  workOrdersProposed: number;
  purchaseRequestsProposed: number;
  shortagesFound: number;
  notes?: string;
};

export const MRP_RUN_STATUS_LABELS: Record<MrpRunStatus, string> = {
  draft: "Draft",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
};

export const MRP_SUGGESTION_TYPE_LABELS: Record<MrpSuggestionType, string> = {
  work_order: "Work order",
  purchase_request: "Purchase request",
};

export const MRP_SUGGESTION_STATUS_LABELS: Record<MrpSuggestionStatus, string> = {
  proposed: "Proposed",
  confirmed: "Confirmed",
  skipped: "Skipped",
};

const SUGGESTIONS_JUNE: MrpSuggestion[] = [
  {
    id: "mrs_001",
    type: "work_order",
    sku: "SKU-0002",
    productName: "Wireless Earbuds Pro",
    quantity: 350,
    dueDate: "2026-06-28",
    source: "Sales forecast Q3",
    status: "proposed",
    notes: "→ WO-2026-0218 planned",
  },
  {
    id: "mrs_002",
    type: "work_order",
    sku: "SKU-0008",
    productName: "Power Bank 20000mAh",
    quantity: 300,
    dueDate: "2026-06-15",
    source: "Low stock alert",
    status: "confirmed",
    notes: "→ WO-2026-0211 created",
  },
  {
    id: "mrs_003",
    type: "purchase_request",
    sku: "RM-PCB-AUDIO",
    productName: "Audio PCB module",
    quantity: 800,
    dueDate: "2026-06-18",
    source: "BOM explosion — earbuds",
    status: "proposed",
    notes: "Vendor: Shenzhen Electronics Co.",
  },
  {
    id: "mrs_004",
    type: "work_order",
    sku: "SKU-0010",
    productName: "LED Desk Lamp",
    quantity: 120,
    dueDate: "2026-06-19",
    source: "SO ORD-1024 backorder",
    status: "proposed",
    notes: "→ WO-2026-0216 planned",
  },
  {
    id: "mrs_005",
    type: "purchase_request",
    sku: "RM-COTTON",
    productName: "Cotton fabric roll",
    quantity: 600,
    dueDate: "2026-06-22",
    source: "T-shirt WO pipeline",
    status: "confirmed",
    notes: "RFQ sent to UrbanWear Manufacturing",
  },
  {
    id: "mrs_006",
    type: "work_order",
    sku: "SKU-0022",
    productName: "Adjustable Laptop Stand",
    quantity: 90,
    dueDate: "2026-06-21",
    source: "B2B quote QT-8841",
    status: "proposed",
  },
  {
    id: "mrs_007",
    type: "purchase_request",
    sku: "RM-PWR-CELL",
    productName: "Li-poly cell pack 20000mAh",
    quantity: 400,
    dueDate: "2026-06-14",
    source: "Power bank BOM",
    status: "confirmed",
  },
  {
    id: "mrs_008",
    type: "work_order",
    sku: "SKU-0005",
    productName: "Smart Watch Series 5",
    quantity: 80,
    dueDate: "2026-06-25",
    source: "Sales forecast",
    status: "skipped",
    notes: "Waiting for routing v3.0 activation",
  },
];

export const mrpRunsSeed: MrpRun[] = [
  {
    id: "mrp_001",
    number: "MRP-2026-0042",
    runDate: MANUFACTURING_TODAY,
    horizonDays: 30,
    warehouse: "WH-DHK",
    status: "completed",
    demandSources: ["Sales orders", "Forecast Q3", "Safety stock rules"],
    suggestions: SUGGESTIONS_JUNE,
    workOrdersProposed: 5,
    purchaseRequestsProposed: 3,
    shortagesFound: 12,
    notes: "⭐ Latest run — June planning horizon. 5 WO + 3 PR proposals.",
  },
  {
    id: "mrp_002",
    number: "MRP-2026-0041",
    runDate: "2026-06-08",
    horizonDays: 14,
    warehouse: "WH-DHK",
    status: "completed",
    demandSources: ["Sales orders", "Open work orders"],
    suggestions: [
      {
        id: "mrs_101",
        type: "work_order",
        sku: "SKU-0002",
        productName: "Wireless Earbuds Pro",
        quantity: 200,
        dueDate: "2026-06-10",
        source: "SO ORD-1018",
        status: "confirmed",
        notes: "→ WO-2026-0201",
      },
      {
        id: "mrs_102",
        type: "purchase_request",
        sku: "RM-EAR-HOUSING",
        productName: "Earbud housing set",
        quantity: 500,
        dueDate: "2026-06-09",
        source: "BOM explosion",
        status: "confirmed",
      },
    ],
    workOrdersProposed: 2,
    purchaseRequestsProposed: 2,
    shortagesFound: 6,
    notes: "Mid-week replenishment run — earbuds rush order.",
  },
  {
    id: "mrp_003",
    number: "MRP-2026-0040",
    runDate: "2026-06-01",
    horizonDays: 30,
    warehouse: "WH-CTG",
    status: "completed",
    demandSources: ["Forecast", "Safety stock"],
    suggestions: [
      {
        id: "mrs_201",
        type: "work_order",
        sku: "SKU-0001",
        productName: "Premium Cotton T-Shirt",
        quantity: 500,
        dueDate: "2026-06-08",
        source: "Seasonal forecast",
        status: "confirmed",
        notes: "→ WO-2026-0188 (done)",
      },
      {
        id: "mrs_202",
        type: "work_order",
        sku: "SKU-0012",
        productName: "Graphic Hoodie",
        quantity: 180,
        dueDate: "2026-06-11",
        source: "Eid collection plan",
        status: "confirmed",
        notes: "→ WO-2026-0213",
      },
    ],
    workOrdersProposed: 3,
    purchaseRequestsProposed: 1,
    shortagesFound: 4,
    notes: "Chattogram garment hub — tees + hoodies.",
  },
  {
    id: "mrp_004",
    number: "MRP-2026-0039",
    runDate: "2026-05-25",
    horizonDays: 7,
    warehouse: "WH-SYL",
    status: "completed",
    demandSources: ["Sales orders"],
    suggestions: [
      {
        id: "mrs_301",
        type: "work_order",
        sku: "SKU-0004",
        productName: "Running Shoes Ultra",
        quantity: 240,
        dueDate: "2026-06-15",
        source: "SO ORD-1020",
        status: "confirmed",
        notes: "→ WO-2026-0208 released",
      },
      {
        id: "mrs_302",
        type: "work_order",
        sku: "SKU-0011",
        productName: "Stainless Water Bottle",
        quantity: 400,
        dueDate: "2026-05-20",
        source: "Promo campaign",
        status: "confirmed",
        notes: "→ WO-2026-0215 (done)",
      },
    ],
    workOrdersProposed: 2,
    purchaseRequestsProposed: 0,
    shortagesFound: 2,
  },
  {
    id: "mrp_005",
    number: "MRP-2026-0038",
    runDate: "2026-05-18",
    horizonDays: 30,
    warehouse: "WH-DHK",
    status: "completed",
    demandSources: ["Forecast Q2", "Min/max rules"],
    suggestions: [
      {
        id: "mrs_401",
        type: "work_order",
        sku: "SKU-0014",
        productName: "USB-C Hub 7-in-1",
        quantity: 150,
        dueDate: "2026-06-22",
        source: "Forecast",
        status: "proposed",
        notes: "→ WO-2026-0205 planned",
      },
      {
        id: "mrs_402",
        type: "purchase_request",
        sku: "RM-HUB-PCBA",
        productName: "Hub PCBA",
        quantity: 200,
        dueDate: "2026-05-30",
        source: "Component shortage",
        status: "confirmed",
      },
    ],
    workOrdersProposed: 1,
    purchaseRequestsProposed: 1,
    shortagesFound: 3,
  },
  {
    id: "mrp_006",
    number: "MRP-2026-0043",
    runDate: MANUFACTURING_TODAY,
    horizonDays: 14,
    warehouse: "WH-CTG",
    status: "running",
    demandSources: ["Sales orders", "Open WOs"],
    suggestions: [],
    workOrdersProposed: 0,
    purchaseRequestsProposed: 0,
    shortagesFound: 0,
    notes: "In progress — sewing line capacity check after WC-SEW-01 maintenance.",
  },
  {
    id: "mrp_007",
    number: "MRP-2026-0035",
    runDate: "2026-05-01",
    horizonDays: 30,
    warehouse: "WH-DHK",
    status: "failed",
    demandSources: ["Forecast"],
    suggestions: [],
    workOrdersProposed: 0,
    purchaseRequestsProposed: 0,
    shortagesFound: 0,
    notes: "Failed — missing BOM for SKU-0099 (discontinued SKU in forecast file).",
  },
  {
    id: "mrp_008",
    number: "MRP-2026-0044",
    runDate: "2026-06-16",
    horizonDays: 30,
    warehouse: "WH-DHK",
    status: "draft",
    demandSources: ["Sales forecast Q3", "Safety stock"],
    suggestions: [
      {
        id: "mrs_501",
        type: "work_order",
        sku: "SKU-0006",
        productName: "Bluetooth Speaker Mini",
        quantity: 100,
        dueDate: "2026-07-01",
        source: "Forecast",
        status: "proposed",
      },
    ],
    workOrdersProposed: 1,
    purchaseRequestsProposed: 0,
    shortagesFound: 0,
    notes: "Draft — schedule for Monday 6am auto-run.",
  },
];

export function getMrpRunById(id: string) {
  return mrpRunsSeed.find((r) => r.id === id);
}

export function buildMrpRunDraft(input: {
  warehouse: string;
  horizonDays?: number;
  demandSources?: string[];
  notes?: string;
}): MrpRun {
  const stamp = Date.now();
  return {
    id: `mrp_${stamp}`,
    number: `MRP-2026-${String(stamp).slice(-4)}`,
    runDate: MANUFACTURING_TODAY,
    horizonDays: input.horizonDays ?? 30,
    warehouse: input.warehouse,
    status: "draft",
    demandSources: input.demandSources ?? ["Sales orders", "Forecast"],
    suggestions: [],
    workOrdersProposed: 0,
    purchaseRequestsProposed: 0,
    shortagesFound: 0,
    notes: input.notes,
  };
}

export { MANUFACTURING_WAREHOUSES };
