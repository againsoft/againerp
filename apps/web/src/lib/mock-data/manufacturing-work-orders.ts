import {
  bomsSeed,
  getBomById,
  materialsFromBom,
  type BillOfMaterials,
} from "./manufacturing-boms";
import { MANUFACTURING_TODAY, MANUFACTURING_WAREHOUSES } from "./manufacturing";
import { getActiveRoutingBySku } from "./manufacturing-routings";

export type WorkOrderStatus =
  | "planned"
  | "released"
  | "in_progress"
  | "done"
  | "cancelled";

export type WorkOrderPriority = "low" | "normal" | "high";

export type OperationStatus = "pending" | "in_progress" | "done";

export type WorkOrderOperation = {
  id: string;
  sequence: number;
  name: string;
  workCenter: string;
  durationMin: number;
  status: OperationStatus;
};

export type WorkOrderMaterial = {
  id: string;
  sku: string;
  name: string;
  quantityRequired: number;
  quantityIssued: number;
  uom: string;
};

export type ShopFloorLogType =
  | "release"
  | "start"
  | "issue"
  | "issue_line"
  | "operation_start"
  | "operation_complete"
  | "output"
  | "complete";

export type ShopFloorLogEntry = {
  id: string;
  at: string;
  type: ShopFloorLogType;
  message: string;
};

export type WorkOrder = {
  id: string;
  number: string;
  productName: string;
  productSku: string;
  bomId: string;
  bomNumber: string;
  quantity: number;
  quantityProduced: number;
  warehouse: string;
  plannedStart: string;
  plannedEnd: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  operations: WorkOrderOperation[];
  materials: WorkOrderMaterial[];
  shopFloorLog?: ShopFloorLogEntry[];
  notes?: string;
};

export const WORK_ORDER_STATUS_LABELS: Record<WorkOrderStatus, string> = {
  planned: "Planned",
  released: "Released",
  in_progress: "In progress",
  done: "Done",
  cancelled: "Cancelled",
};

export const WORK_ORDER_PRIORITY_LABELS: Record<WorkOrderPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
};

const FALLBACK_OPERATIONS: WorkOrderOperation[] = [
  { id: "op_fb_1", sequence: 10, name: "Kit / pick components", workCenter: "WC-PICK-01", durationMin: 30, status: "pending" },
  { id: "op_fb_2", sequence: 20, name: "Assembly", workCenter: "WC-ASM-01", durationMin: 45, status: "pending" },
  { id: "op_fb_3", sequence: 30, name: "QC inspection", workCenter: "WC-QC-01", durationMin: 15, status: "pending" },
  { id: "op_fb_4", sequence: 40, name: "Pack & label", workCenter: "WC-PACK-01", durationMin: 20, status: "pending" },
];

function operationsFromProduct(sku: string, suffix: string): WorkOrderOperation[] {
  const routing = getActiveRoutingBySku(sku);
  if (!routing) {
    return FALLBACK_OPERATIONS.map((op) => ({ ...op, id: `${op.id}_${suffix}` }));
  }
  return routing.operations.map((op) => ({
    id: `op_${suffix}_${op.id}`,
    sequence: op.sequence,
    name: op.name,
    workCenter: op.workCenterCode,
    durationMin: op.durationMin,
    status: "pending" as OperationStatus,
  }));
}

function woMaterials(bomId: string, qty: number, issuedPct = 0): WorkOrderMaterial[] {
  const bom = getBomById(bomId);
  if (!bom) return [];
  return materialsFromBom(bom, qty).map((m) => ({
    ...m,
    quantityIssued: Math.round(m.quantityRequired * issuedPct * 100) / 100,
  }));
}

function opsWithProgress(
  ops: WorkOrderOperation[],
  activeSequence: number | null,
  allDone = false,
): WorkOrderOperation[] {
  if (allDone) return ops.map((op) => ({ ...op, status: "done" as OperationStatus }));
  if (activeSequence === null) return ops;
  return ops.map((op) => {
    if (op.sequence < activeSequence) return { ...op, status: "done" as OperationStatus };
    if (op.sequence === activeSequence) return { ...op, status: "in_progress" as OperationStatus };
    return op;
  });
}

export const workOrdersSeed: WorkOrder[] = [
  // ── Done (historical) ──────────────────────────────────────────────
  {
    id: "wo_001",
    number: "WO-2026-0188",
    productName: "Premium Cotton T-Shirt",
    productSku: "SKU-0001",
    bomId: "bom_001",
    bomNumber: "BOM-TS-001",
    quantity: 500,
    quantityProduced: 500,
    warehouse: "WH-CTG",
    plannedStart: "2026-05-08",
    plannedEnd: "2026-05-12",
    status: "done",
    priority: "normal",
    operations: opsWithProgress(operationsFromProduct("SKU-0001", "001"), null, true),
    materials: woMaterials("bom_001", 500, 1),
    notes: "Completed batch — 500 pcs FG received to WH-CTG.",
  },
  {
    id: "wo_005",
    number: "WO-2026-0195",
    productName: "Wireless Earbuds Pro",
    productSku: "SKU-0002",
    bomId: "bom_002",
    bomNumber: "BOM-EAR-001",
    quantity: 100,
    quantityProduced: 100,
    warehouse: "WH-SYL",
    plannedStart: "2026-06-01",
    plannedEnd: "2026-06-05",
    status: "done",
    priority: "normal",
    operations: opsWithProgress(operationsFromProduct("SKU-0002", "005"), null, true),
    materials: woMaterials("bom_002", 100, 1),
    notes: "Earlier earbuds run — closed before rush order WO-0201.",
  },

  // ── In progress (demo: Issue materials + Complete) ───────────────
  {
    id: "wo_002",
    number: "WO-2026-0201",
    productName: "Wireless Earbuds Pro",
    productSku: "SKU-0002",
    bomId: "bom_002",
    bomNumber: "BOM-EAR-001",
    quantity: 200,
    quantityProduced: 120,
    warehouse: "WH-DHK",
    plannedStart: "2026-06-10",
    plannedEnd: "2026-06-18",
    status: "in_progress",
    priority: "high",
    operations: opsWithProgress(operationsFromProduct("SKU-0002", "002"), 20),
    materials: woMaterials("bom_002", 200, 0.6),
    shopFloorLog: [
      {
        id: "sfl_002_1",
        at: "2026-06-10T08:00:00Z",
        type: "release",
        message: "WO released — components reserved in WH-DHK",
      },
      {
        id: "sfl_002_2",
        at: "2026-06-10T09:15:00Z",
        type: "start",
        message: "Production started — Kit / pick components",
      },
      {
        id: "sfl_002_3",
        at: "2026-06-11T14:30:00Z",
        type: "operation_complete",
        message: "Operation 10 complete — Kit / pick components",
      },
      {
        id: "sfl_002_4",
        at: "2026-06-11T14:31:00Z",
        type: "operation_start",
        message: "Operation 20 started — Assembly on WC-ASM-01",
      },
      {
        id: "sfl_002_5",
        at: "2026-06-12T11:00:00Z",
        type: "output",
        message: "Partial output recorded — 120 / 200 units (inventory.stock_in.posted)",
      },
    ],
    notes: "⭐ Demo: Shop floor tab — operation Start/Complete + Record output টেস্ট করুন।",
  },
  {
    id: "wo_007",
    number: "WO-2026-0207",
    productName: "Premium Cotton T-Shirt",
    productSku: "SKU-0001",
    bomId: "bom_001",
    bomNumber: "BOM-TS-001",
    quantity: 150,
    quantityProduced: 90,
    warehouse: "WH-CTG",
    plannedStart: "2026-06-12",
    plannedEnd: "2026-06-19",
    status: "in_progress",
    priority: "normal",
    operations: opsWithProgress(operationsFromProduct("SKU-0001", "007"), 30),
    materials: woMaterials("bom_001", 150, 0.85),
    notes: "QC inspection step — sewing line back online after partial maintenance.",
  },
  {
    id: "wo_010",
    number: "WO-2026-0210",
    productName: "Smart Watch Series 5",
    productSku: "SKU-0005",
    bomId: "bom_006",
    bomNumber: "BOM-WATCH-001",
    quantity: 50,
    quantityProduced: 12,
    warehouse: "WH-DHK",
    plannedStart: "2026-06-14",
    plannedEnd: "2026-06-22",
    status: "in_progress",
    priority: "high",
    operations: opsWithProgress(operationsFromProduct("SKU-0005", "010"), 10),
    materials: woMaterials("bom_006", 50, 0.24),
    notes: "Phantom BOM explode demo — SUB-WATCH-01 line materials expanded at release.",
  },
  {
    id: "wo_011",
    number: "WO-2026-0211",
    productName: "Power Bank 20000mAh",
    productSku: "SKU-0008",
    bomId: "bom_009",
    bomNumber: "BOM-PWR-001",
    quantity: 300,
    quantityProduced: 45,
    warehouse: "WH-DHK",
    plannedStart: MANUFACTURING_TODAY,
    plannedEnd: "2026-06-20",
    status: "in_progress",
    priority: "high",
    operations: opsWithProgress(operationsFromProduct("SKU-0008", "011"), 10),
    materials: woMaterials("bom_009", 300, 0.15),
    notes: "Low stock replenishment — dashboard alert triggered this WO.",
  },

  // ── Released (demo: Start button) ──────────────────────────────────
  {
    id: "wo_003",
    number: "WO-2026-0204",
    productName: "Bluetooth Speaker Mini",
    productSku: "SKU-0006",
    bomId: "bom_003",
    bomNumber: "BOM-SPK-001",
    quantity: 80,
    quantityProduced: 0,
    warehouse: "WH-DHK",
    plannedStart: "2026-06-14",
    plannedEnd: "2026-06-25",
    status: "released",
    priority: "normal",
    operations: operationsFromProduct("SKU-0006", "003"),
    materials: woMaterials("bom_003", 80, 0),
    notes: "⭐ Demo: Released status — Start বাটন চাপলে shop floor production শুরু হবে।",
  },
  {
    id: "wo_008",
    number: "WO-2026-0208",
    productName: "Running Shoes Ultra",
    productSku: "SKU-0004",
    bomId: "bom_007",
    bomNumber: "BOM-SHOE-001",
    quantity: 240,
    quantityProduced: 0,
    warehouse: "WH-SYL",
    plannedStart: MANUFACTURING_TODAY,
    plannedEnd: "2026-06-28",
    status: "released",
    priority: "normal",
    operations: operationsFromProduct("SKU-0004", "008"),
    materials: woMaterials("bom_007", 240, 0),
    notes: "Footwear batch — materials reserved, waiting line slot on WC-SHOE-01.",
  },

  // ── Planned (demo: Release button) ─────────────────────────────────
  {
    id: "wo_004",
    number: "WO-2026-0205",
    productName: "USB-C Hub 7-in-1",
    productSku: "SKU-0014",
    bomId: "bom_004",
    bomNumber: "BOM-HUB-KIT",
    quantity: 150,
    quantityProduced: 0,
    warehouse: "WH-DHK",
    plannedStart: MANUFACTURING_TODAY,
    plannedEnd: "2026-06-28",
    status: "planned",
    priority: "low",
    operations: operationsFromProduct("SKU-0014", "004"),
    materials: woMaterials("bom_004", 150, 0),
    notes: "⭐ Demo: Planned status — Release বাটন দিয়ে WO ছাড়ুন, তারপর Start। Kit BOM (no heavy assembly).",
  },
  {
    id: "wo_006",
    number: "WO-2026-0206",
    productName: "Premium Cotton T-Shirt",
    productSku: "SKU-0001",
    bomId: "bom_001",
    bomNumber: "BOM-TS-001",
    quantity: 300,
    quantityProduced: 0,
    warehouse: "WH-CTG",
    plannedStart: "2026-06-25",
    plannedEnd: "2026-06-30",
    status: "planned",
    priority: "normal",
    operations: operationsFromProduct("SKU-0001", "006"),
    materials: woMaterials("bom_001", 300, 0),
    notes: "Waiting for WC-SEW-01 maintenance to finish (2026-06-20).",
  },
  {
    id: "wo_012",
    number: "WO-2026-0212",
    productName: "Ceramic Coffee Mug Set",
    productSku: "SKU-0003",
    bomId: "bom_008",
    bomNumber: "BOM-MUG-KIT",
    quantity: 120,
    quantityProduced: 0,
    warehouse: "WH-DHK",
    plannedStart: "2026-06-18",
    plannedEnd: "2026-06-24",
    status: "planned",
    priority: "normal",
    operations: operationsFromProduct("SKU-0003", "012"),
    materials: woMaterials("bom_008", 120, 0),
    notes: "Gift season prep — simple kit pick + pack on WC-KIT-01.",
  },

  // ── Cancelled ──────────────────────────────────────────────────────
  {
    id: "wo_009",
    number: "WO-2026-0209",
    productName: "Ceramic Coffee Mug Set",
    productSku: "SKU-0003",
    bomId: "bom_008",
    bomNumber: "BOM-MUG-KIT",
    quantity: 60,
    quantityProduced: 0,
    warehouse: "WH-DHK",
    plannedStart: "2026-06-08",
    plannedEnd: "2026-06-12",
    status: "cancelled",
    priority: "low",
    operations: operationsFromProduct("SKU-0003", "009"),
    materials: woMaterials("bom_008", 60, 0),
    notes: "Cancelled — ceramic mug supplier delayed shipment from Chattogram.",
  },
  {
    id: "wo_013",
    number: "WO-2026-0213",
    productName: "Graphic Hoodie",
    productSku: "SKU-0012",
    bomId: "bom_012",
    bomNumber: "BOM-HOOD-001",
    quantity: 180,
    quantityProduced: 72,
    warehouse: "WH-CTG",
    plannedStart: "2026-06-11",
    plannedEnd: "2026-06-20",
    status: "in_progress",
    priority: "normal",
    operations: opsWithProgress(operationsFromProduct("SKU-0012", "013"), 20),
    materials: woMaterials("bom_012", 180, 0.4),
    notes: "Screen print step — Eid collection batch.",
  },
  {
    id: "wo_014",
    number: "WO-2026-0214",
    productName: "Yoga Mat Pro",
    productSku: "SKU-0009",
    bomId: "bom_013",
    bomNumber: "BOM-YOGA-KIT",
    quantity: 200,
    quantityProduced: 0,
    warehouse: "WH-DHK",
    plannedStart: "2026-06-16",
    plannedEnd: "2026-06-22",
    status: "released",
    priority: "normal",
    operations: operationsFromProduct("SKU-0009", "014"),
    materials: woMaterials("bom_013", 200, 0),
    notes: "Kit assembly — mats in stock, waiting pack station slot.",
  },
  {
    id: "wo_015",
    number: "WO-2026-0215",
    productName: "Stainless Water Bottle",
    productSku: "SKU-0011",
    bomId: "bom_015",
    bomNumber: "BOM-BOTTLE-001",
    quantity: 400,
    quantityProduced: 400,
    warehouse: "WH-SYL",
    plannedStart: "2026-05-20",
    plannedEnd: "2026-05-28",
    status: "done",
    priority: "normal",
    operations: opsWithProgress(operationsFromProduct("SKU-0011", "015"), null, true),
    materials: woMaterials("bom_015", 400, 1),
    notes: "Closed — summer promo stock replenishment.",
  },
  {
    id: "wo_016",
    number: "WO-2026-0216",
    productName: "LED Desk Lamp",
    productSku: "SKU-0010",
    bomId: "bom_011",
    bomNumber: "BOM-LAMP-001",
    quantity: 120,
    quantityProduced: 0,
    warehouse: "WH-DHK",
    plannedStart: "2026-06-19",
    plannedEnd: "2026-06-26",
    status: "planned",
    priority: "normal",
    operations: operationsFromProduct("SKU-0010", "016"),
    materials: woMaterials("bom_011", 120, 0),
    notes: "Back-to-school demand — planned after power bank run.",
  },
  {
    id: "wo_017",
    number: "WO-2026-0217",
    productName: "Adjustable Laptop Stand",
    productSku: "SKU-0022",
    bomId: "bom_014",
    bomNumber: "BOM-STAND-001",
    quantity: 90,
    quantityProduced: 0,
    warehouse: "WH-DHK",
    plannedStart: "2026-06-21",
    plannedEnd: "2026-06-27",
    status: "planned",
    priority: "high",
    operations: operationsFromProduct("SKU-0022", "017"),
    materials: woMaterials("bom_014", 90, 0),
    notes: "Phantom BOM demo — SUB-STAND-01 explodes to aluminum frame + hinges.",
  },
  {
    id: "wo_018",
    number: "WO-2026-0218",
    productName: "Wireless Earbuds Pro",
    productSku: "SKU-0002",
    bomId: "bom_002",
    bomNumber: "BOM-EAR-001",
    quantity: 350,
    quantityProduced: 0,
    warehouse: "WH-DHK",
    plannedStart: "2026-06-28",
    plannedEnd: "2026-07-05",
    status: "planned",
    priority: "high",
    operations: operationsFromProduct("SKU-0002", "018"),
    materials: woMaterials("bom_002", 350, 0),
    notes: "Q3 forecast batch — follows WO-2026-0201 completion.",
  },
  {
    id: "wo_019",
    number: "WO-2026-0219",
    productName: "Bluetooth Speaker Mini",
    productSku: "SKU-0006",
    bomId: "bom_003",
    bomNumber: "BOM-SPK-001",
    quantity: 60,
    quantityProduced: 28,
    warehouse: "WH-CTG",
    plannedStart: "2026-06-09",
    plannedEnd: "2026-06-17",
    status: "in_progress",
    priority: "low",
    operations: opsWithProgress(operationsFromProduct("SKU-0006", "019"), 30),
    materials: woMaterials("bom_003", 60, 0.5),
    notes: "CTG satellite line — audio test step.",
  },
  {
    id: "wo_020",
    number: "WO-2026-0220",
    productName: "USB-C Hub 7-in-1",
    productSku: "SKU-0014",
    bomId: "bom_004",
    bomNumber: "BOM-HUB-KIT",
    quantity: 75,
    quantityProduced: 75,
    warehouse: "WH-DHK",
    plannedStart: "2026-05-15",
    plannedEnd: "2026-05-22",
    status: "done",
    priority: "normal",
    operations: opsWithProgress(operationsFromProduct("SKU-0014", "020"), null, true),
    materials: woMaterials("bom_004", 75, 1),
    notes: "Small corporate order — closed on time.",
  },
];

export function getWorkOrderById(id: string) {
  return workOrdersSeed.find((wo) => wo.id === id);
}

export function buildWorkOrderDraft(input: {
  bomId: string;
  quantity: number;
  warehouse: string;
  plannedStart: string;
  plannedEnd: string;
  priority?: WorkOrderPriority;
  notes?: string;
}): WorkOrder {
  const bom = getBomById(input.bomId) ?? bomsSeed[0];
  const stamp = Date.now();
  const id = `wo_${stamp}`;

  return {
    id,
    number: `WO-2026-${String(stamp).slice(-4)}`,
    productName: bom.productName,
    productSku: bom.productSku,
    bomId: bom.id,
    bomNumber: bom.number,
    quantity: input.quantity,
    quantityProduced: 0,
    warehouse: input.warehouse,
    plannedStart: input.plannedStart,
    plannedEnd: input.plannedEnd,
    status: "planned",
    priority: input.priority ?? "normal",
    operations: operationsFromProduct(bom.productSku, String(stamp)),
    materials: materialsFromBom(bom, input.quantity).map((m) => ({
      ...m,
      id: `${m.id}_${stamp}`,
    })),
    notes: input.notes,
  };
}

export { bomsSeed, MANUFACTURING_WAREHOUSES, type BillOfMaterials };
