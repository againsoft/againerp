import { MANUFACTURING_WAREHOUSES } from "./manufacturing";

export type WorkCenterStatus = "active" | "maintenance" | "inactive";

export type WorkCenterType = "assembly" | "machine" | "labor" | "qc" | "packaging";

export type WorkCenter = {
  id: string;
  code: string;
  name: string;
  warehouse: string;
  type: WorkCenterType;
  status: WorkCenterStatus;
  capacityHoursPerDay: number;
  costRatePerHour: number;
  utilizationPct: number;
  notes?: string;
};

export const WORK_CENTER_STATUS_LABELS: Record<WorkCenterStatus, string> = {
  active: "Active",
  maintenance: "Maintenance",
  inactive: "Inactive",
};

export const WORK_CENTER_TYPE_LABELS: Record<WorkCenterType, string> = {
  assembly: "Assembly",
  machine: "Machine",
  labor: "Labor pool",
  qc: "Quality control",
  packaging: "Packaging",
};

export const workCentersSeed: WorkCenter[] = [
  {
    id: "wc_001",
    code: "WC-ASM-01",
    name: "Assembly Line 1 — Electronics",
    warehouse: "WH-DHK",
    type: "assembly",
    status: "active",
    capacityHoursPerDay: 16,
    costRatePerHour: 850,
    utilizationPct: 82,
    notes: "Earbuds, speakers, power banks — 2 shifts (8am–12am).",
  },
  {
    id: "wc_002",
    code: "WC-PICK-01",
    name: "Component Picking & Kitting",
    warehouse: "WH-DHK",
    type: "labor",
    status: "active",
    capacityHoursPerDay: 10,
    costRatePerHour: 420,
    utilizationPct: 68,
    notes: "Raw material pick list from BOM — feeds all DHK lines.",
  },
  {
    id: "wc_003",
    code: "WC-QC-01",
    name: "Quality Inspection Station",
    warehouse: "WH-DHK",
    type: "qc",
    status: "active",
    capacityHoursPerDay: 8,
    costRatePerHour: 550,
    utilizationPct: 54,
    notes: "Functional test + visual check. Fail → rework queue.",
  },
  {
    id: "wc_004",
    code: "WC-PACK-01",
    name: "Packaging & Labeling",
    warehouse: "WH-DHK",
    type: "packaging",
    status: "active",
    capacityHoursPerDay: 12,
    costRatePerHour: 380,
    utilizationPct: 76,
    notes: "Barcode label, shrink wrap, carton — last step before FG receipt.",
  },
  {
    id: "wc_005",
    code: "WC-SMT-01",
    name: "SMT Pick & Place Machine",
    warehouse: "WH-CTG",
    type: "machine",
    status: "active",
    capacityHoursPerDay: 20,
    costRatePerHour: 1200,
    utilizationPct: 91,
    notes: "Hub PCBA testing — highest utilization. Schedule maintenance monthly.",
  },
  {
    id: "wc_006",
    code: "WC-SEW-01",
    name: "Garment Sewing Line",
    warehouse: "WH-CTG",
    type: "assembly",
    status: "maintenance",
    capacityHoursPerDay: 14,
    costRatePerHour: 620,
    utilizationPct: 0,
    notes: "Offline until 2026-06-20 — needle calibration. T-shirt WO delayed.",
  },
  {
    id: "wc_007",
    code: "WC-HUB-01",
    name: "Hub Kit Assembly Bench",
    warehouse: "WH-SYL",
    type: "assembly",
    status: "inactive",
    capacityHoursPerDay: 8,
    costRatePerHour: 490,
    utilizationPct: 0,
    notes: "Temporarily closed — staff redeployed to shoe line.",
  },
  {
    id: "wc_008",
    code: "WC-SHOE-01",
    name: "Footwear Assembly Line",
    warehouse: "WH-SYL",
    type: "assembly",
    status: "active",
    capacityHoursPerDay: 12,
    costRatePerHour: 710,
    utilizationPct: 73,
    notes: "Running shoes — upper + sole bonding + lace install.",
  },
  {
    id: "wc_009",
    code: "WC-KIT-01",
    name: "Kit Packing Station",
    warehouse: "WH-DHK",
    type: "packaging",
    status: "active",
    capacityHoursPerDay: 8,
    costRatePerHour: 350,
    utilizationPct: 41,
    notes: "Mug sets, gift boxes — no assembly, pick + pack only.",
  },
  {
    id: "wc_010",
    code: "WC-WATCH-01",
    name: "Watch Micro-assembly",
    warehouse: "WH-DHK",
    type: "assembly",
    status: "active",
    capacityHoursPerDay: 10,
    costRatePerHour: 980,
    utilizationPct: 58,
    notes: "ESD-safe bench, sub-assembly merge.",
  },
  {
    id: "wc_011",
    code: "WC-LAMP-01",
    name: "LED Lamp Assembly",
    warehouse: "WH-DHK",
    type: "assembly",
    status: "active",
    capacityHoursPerDay: 8,
    costRatePerHour: 520,
    utilizationPct: 55,
    notes: "Desk lamp final assembly + adapter test.",
  },
  {
    id: "wc_012",
    code: "WC-PRINT-01",
    name: "Screen Print Station",
    warehouse: "WH-CTG",
    type: "machine",
    status: "active",
    capacityHoursPerDay: 10,
    costRatePerHour: 680,
    utilizationPct: 64,
    notes: "Hoodie & tee graphic printing.",
  },
  {
    id: "wc_013",
    code: "WC-CUT-01",
    name: "Fabric Cutting Table",
    warehouse: "WH-CTG",
    type: "labor",
    status: "active",
    capacityHoursPerDay: 9,
    costRatePerHour: 450,
    utilizationPct: 48,
    notes: "Manual pattern cutting before sewing line.",
  },
  {
    id: "wc_014",
    code: "WC-BTL-01",
    name: "Bottle Assembly Line",
    warehouse: "WH-SYL",
    type: "assembly",
    status: "active",
    capacityHoursPerDay: 10,
    costRatePerHour: 590,
    utilizationPct: 67,
    notes: "Insulated bottle lid press + label.",
  },
];

export function getWorkCenterById(id: string) {
  return workCentersSeed.find((wc) => wc.id === id);
}

export function getWorkCenterByCode(code: string) {
  return workCentersSeed.find((wc) => wc.code === code);
}

export function buildWorkCenterDraft(input: {
  code: string;
  name: string;
  warehouse: string;
  type: WorkCenterType;
  capacityHoursPerDay: number;
  costRatePerHour: number;
  notes?: string;
}): WorkCenter {
  const stamp = Date.now();
  return {
    id: `wc_${stamp}`,
    code: input.code.trim().toUpperCase(),
    name: input.name.trim(),
    warehouse: input.warehouse,
    type: input.type,
    status: "active",
    capacityHoursPerDay: input.capacityHoursPerDay,
    costRatePerHour: input.costRatePerHour,
    utilizationPct: 0,
    notes: input.notes,
  };
}

export { MANUFACTURING_WAREHOUSES };
