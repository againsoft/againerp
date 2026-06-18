export type RoutingStatus = "draft" | "active" | "obsolete";

export type RoutingOperation = {
  id: string;
  sequence: number;
  name: string;
  workCenterCode: string;
  durationMin: number;
  setupMin: number;
};

export type ManufacturingRouting = {
  id: string;
  number: string;
  productName: string;
  productSku: string;
  bomId?: string;
  bomNumber?: string;
  version: string;
  effectiveFrom: string;
  status: RoutingStatus;
  operations: RoutingOperation[];
  totalDurationMin: number;
  notes?: string;
};

export const ROUTING_STATUS_LABELS: Record<RoutingStatus, string> = {
  draft: "Draft",
  active: "Active",
  obsolete: "Obsolete",
};

const STANDARD_OPS: Omit<RoutingOperation, "id">[] = [
  { sequence: 10, name: "Kit / pick components", workCenterCode: "WC-PICK-01", durationMin: 30, setupMin: 5 },
  { sequence: 20, name: "Assembly", workCenterCode: "WC-ASM-01", durationMin: 45, setupMin: 10 },
  { sequence: 30, name: "QC inspection", workCenterCode: "WC-QC-01", durationMin: 15, setupMin: 0 },
  { sequence: 40, name: "Pack & label", workCenterCode: "WC-PACK-01", durationMin: 20, setupMin: 5 },
];

function opsWithIds(prefix: string, ops: Omit<RoutingOperation, "id">[]): RoutingOperation[] {
  return ops.map((op, i) => ({ ...op, id: `rop_${prefix}_${i}` }));
}

function totalDuration(ops: RoutingOperation[]) {
  return ops.reduce((s, o) => s + o.durationMin + o.setupMin, 0);
}

export const routingsSeed: ManufacturingRouting[] = [
  {
    id: "rt_001",
    number: "RT-EAR-001",
    productName: "Wireless Earbuds Pro",
    productSku: "SKU-0002",
    bomId: "bom_002",
    bomNumber: "BOM-EAR-001",
    version: "v1.4",
    effectiveFrom: "2026-03-15",
    status: "active",
    operations: opsWithIds("001", STANDARD_OPS),
    totalDurationMin: totalDuration(opsWithIds("001", STANDARD_OPS)),
    notes: "Standard 4-step flow — used by WO-2026-0201.",
  },
  {
    id: "rt_002",
    number: "RT-TS-001",
    productName: "Premium Cotton T-Shirt",
    productSku: "SKU-0001",
    bomId: "bom_001",
    bomNumber: "BOM-TS-001",
    version: "v2.1",
    effectiveFrom: "2026-01-01",
    status: "active",
    operations: opsWithIds("002", [
      { sequence: 10, name: "Cut fabric panels", workCenterCode: "WC-SEW-01", durationMin: 25, setupMin: 15 },
      { sequence: 20, name: "Sew & finish seams", workCenterCode: "WC-SEW-01", durationMin: 40, setupMin: 5 },
      { sequence: 30, name: "QC — stitch & size check", workCenterCode: "WC-QC-01", durationMin: 10, setupMin: 0 },
      { sequence: 40, name: "Fold, tag & pack", workCenterCode: "WC-PACK-01", durationMin: 12, setupMin: 0 },
    ]),
    totalDurationMin: 107,
    notes: "Blocked while WC-SEW-01 in maintenance.",
  },
  {
    id: "rt_003",
    number: "RT-SPK-001",
    productName: "Bluetooth Speaker Mini",
    productSku: "SKU-0006",
    bomId: "bom_003",
    bomNumber: "BOM-SPK-001",
    version: "v1.0",
    effectiveFrom: "2026-02-01",
    status: "active",
    operations: opsWithIds("003", [
      { sequence: 10, name: "Pick driver + amp board", workCenterCode: "WC-PICK-01", durationMin: 20, setupMin: 5 },
      { sequence: 20, name: "Driver install & wire", workCenterCode: "WC-ASM-01", durationMin: 35, setupMin: 10 },
      { sequence: 30, name: "Audio burn-in test", workCenterCode: "WC-QC-01", durationMin: 20, setupMin: 0 },
      { sequence: 40, name: "Pack & serial label", workCenterCode: "WC-PACK-01", durationMin: 15, setupMin: 5 },
    ]),
    totalDurationMin: 110,
    notes: "Released WO demo — WO-2026-0204.",
  },
  {
    id: "rt_004",
    number: "RT-HUB-001",
    productName: "USB-C Hub 7-in-1",
    productSku: "SKU-0014",
    bomId: "bom_004",
    bomNumber: "BOM-HUB-KIT",
    version: "v1.2",
    effectiveFrom: "2026-04-01",
    status: "active",
    operations: opsWithIds("004", [
      { sequence: 10, name: "PCBA functional test", workCenterCode: "WC-SMT-01", durationMin: 15, setupMin: 20 },
      { sequence: 20, name: "Enclosure screw-fit", workCenterCode: "WC-ASM-01", durationMin: 25, setupMin: 5 },
      { sequence: 30, name: "Port check + final QC", workCenterCode: "WC-QC-01", durationMin: 10, setupMin: 0 },
      { sequence: 40, name: "Retail blister pack", workCenterCode: "WC-PACK-01", durationMin: 12, setupMin: 0 },
    ]),
    totalDurationMin: 87,
    notes: "Kit BOM — short routing. Planned WO demo: WO-2026-0205.",
  },
  {
    id: "rt_005",
    number: "RT-WATCH-001",
    productName: "Smart Watch Series 5",
    productSku: "SKU-0005",
    bomId: "bom_006",
    bomNumber: "BOM-WATCH-001",
    version: "v3.0",
    effectiveFrom: "2026-06-01",
    status: "draft",
    operations: opsWithIds("005", [
      { sequence: 10, name: "Sub-assembly merge (phantom explode)", workCenterCode: "WC-WATCH-01", durationMin: 30, setupMin: 10 },
      { sequence: 20, name: "Band attach + clasp", workCenterCode: "WC-WATCH-01", durationMin: 15, setupMin: 5 },
      { sequence: 30, name: "Functional + waterproof test", workCenterCode: "WC-QC-01", durationMin: 25, setupMin: 0 },
      { sequence: 40, name: "Gift box pack", workCenterCode: "WC-PACK-01", durationMin: 18, setupMin: 5 },
    ]),
    totalDurationMin: 108,
    notes: "Draft — engineering sign-off pending on v3.0. Activate routing to use in new WOs.",
  },
  {
    id: "rt_010",
    number: "RT-WATCH-002",
    productName: "Smart Watch Series 5",
    productSku: "SKU-0005",
    bomId: "bom_006",
    bomNumber: "BOM-WATCH-001",
    version: "v2.9",
    effectiveFrom: "2026-04-01",
    status: "active",
    operations: opsWithIds("010", [
      { sequence: 10, name: "Display + battery install", workCenterCode: "WC-WATCH-01", durationMin: 25, setupMin: 10 },
      { sequence: 20, name: "Band attach", workCenterCode: "WC-WATCH-01", durationMin: 12, setupMin: 5 },
      { sequence: 30, name: "Functional test", workCenterCode: "WC-QC-01", durationMin: 20, setupMin: 0 },
      { sequence: 40, name: "Retail box pack", workCenterCode: "WC-PACK-01", durationMin: 15, setupMin: 5 },
    ]),
    totalDurationMin: 87,
    notes: "Current production routing — used by WO-2026-0210. v3.0 draft will replace this.",
  },
  {
    id: "rt_006",
    number: "RT-EAR-000",
    productName: "Wireless Earbuds Pro",
    productSku: "SKU-0002",
    bomId: "bom_002",
    bomNumber: "BOM-EAR-001",
    version: "v1.0",
    effectiveFrom: "2025-06-01",
    status: "obsolete",
    operations: opsWithIds("006", [
      { sequence: 10, name: "Manual bench assembly", workCenterCode: "WC-ASM-01", durationMin: 60, setupMin: 0 },
      { sequence: 20, name: "Basic pack", workCenterCode: "WC-PACK-01", durationMin: 20, setupMin: 0 },
    ]),
    totalDurationMin: 80,
    notes: "Replaced by RT-EAR-001 — slower manual process.",
  },
  {
    id: "rt_007",
    number: "RT-SHOE-001",
    productName: "Running Shoes Ultra",
    productSku: "SKU-0004",
    bomId: "bom_007",
    bomNumber: "BOM-SHOE-001",
    version: "v1.1",
    effectiveFrom: "2026-03-01",
    status: "active",
    operations: opsWithIds("007", [
      { sequence: 10, name: "Upper prep + alignment", workCenterCode: "WC-SHOE-01", durationMin: 20, setupMin: 10 },
      { sequence: 20, name: "Midsole + outsole bond", workCenterCode: "WC-SHOE-01", durationMin: 35, setupMin: 15 },
      { sequence: 30, name: "Lace + QC walk test", workCenterCode: "WC-QC-01", durationMin: 12, setupMin: 0 },
      { sequence: 40, name: "Box + desiccant pack", workCenterCode: "WC-PACK-01", durationMin: 10, setupMin: 0 },
    ]),
    totalDurationMin: 102,
    notes: "SYL footwear line — WO-2026-0208 batch of 240 pairs.",
  },
  {
    id: "rt_008",
    number: "RT-MUG-KIT",
    productName: "Ceramic Coffee Mug Set",
    productSku: "SKU-0003",
    bomId: "bom_008",
    bomNumber: "BOM-MUG-KIT",
    version: "v1.0",
    effectiveFrom: "2026-02-15",
    status: "active",
    operations: opsWithIds("008", [
      { sequence: 10, name: "Pick 4 mugs + box", workCenterCode: "WC-PICK-01", durationMin: 10, setupMin: 0 },
      { sequence: 20, name: "Nest in divider + ribbon", workCenterCode: "WC-KIT-01", durationMin: 15, setupMin: 5 },
      { sequence: 30, name: "Seal box + barcode", workCenterCode: "WC-PACK-01", durationMin: 8, setupMin: 0 },
    ]),
    totalDurationMin: 38,
    notes: "Short kit routing — no assembly machine needed.",
  },
  {
    id: "rt_009",
    number: "RT-PWR-001",
    productName: "Power Bank 20000mAh",
    productSku: "SKU-0008",
    bomId: "bom_009",
    bomNumber: "BOM-PWR-001",
    version: "v2.0",
    effectiveFrom: "2026-05-20",
    status: "active",
    operations: opsWithIds("009", [
      { sequence: 10, name: "Cell pack + BMS install", workCenterCode: "WC-ASM-01", durationMin: 25, setupMin: 10 },
      { sequence: 20, name: "Case close + screw", workCenterCode: "WC-ASM-01", durationMin: 15, setupMin: 5 },
      { sequence: 30, name: "Charge/discharge cycle test", workCenterCode: "WC-QC-01", durationMin: 30, setupMin: 0 },
      { sequence: 40, name: "Retail pack + warranty card", workCenterCode: "WC-PACK-01", durationMin: 12, setupMin: 0 },
    ]),
    totalDurationMin: 97,
    notes: "High priority replenishment — WO-2026-0211.",
  },
  {
    id: "rt_011",
    number: "RT-LAMP-001",
    productName: "LED Desk Lamp",
    productSku: "SKU-0010",
    bomId: "bom_011",
    bomNumber: "BOM-LAMP-001",
    version: "v1.3",
    effectiveFrom: "2026-04-15",
    status: "active",
    operations: opsWithIds("011", [
      { sequence: 10, name: "Pick LED + arm kit", workCenterCode: "WC-PICK-01", durationMin: 15, setupMin: 5 },
      { sequence: 20, name: "Arm + base assembly", workCenterCode: "WC-LAMP-01", durationMin: 20, setupMin: 5 },
      { sequence: 30, name: "Brightness + USB test", workCenterCode: "WC-QC-01", durationMin: 12, setupMin: 0 },
      { sequence: 40, name: "Box pack", workCenterCode: "WC-PACK-01", durationMin: 10, setupMin: 0 },
    ]),
    totalDurationMin: 67,
  },
  {
    id: "rt_012",
    number: "RT-HOOD-001",
    productName: "Graphic Hoodie",
    productSku: "SKU-0012",
    bomId: "bom_012",
    bomNumber: "BOM-HOOD-001",
    version: "v1.0",
    effectiveFrom: "2026-05-01",
    status: "active",
    operations: opsWithIds("012", [
      { sequence: 10, name: "Pick blank hoodie", workCenterCode: "WC-PICK-01", durationMin: 10, setupMin: 0 },
      { sequence: 20, name: "Screen print graphic", workCenterCode: "WC-PRINT-01", durationMin: 18, setupMin: 20 },
      { sequence: 30, name: "Cure + QC print", workCenterCode: "WC-QC-01", durationMin: 10, setupMin: 0 },
      { sequence: 40, name: "Tag & fold pack", workCenterCode: "WC-PACK-01", durationMin: 12, setupMin: 0 },
    ]),
    totalDurationMin: 80,
  },
  {
    id: "rt_013",
    number: "RT-YOGA-KIT",
    productName: "Yoga Mat Pro",
    productSku: "SKU-0009",
    bomId: "bom_013",
    bomNumber: "BOM-YOGA-KIT",
    version: "v1.1",
    effectiveFrom: "2026-03-20",
    status: "active",
    operations: opsWithIds("013", [
      { sequence: 10, name: "Pick mat + strap", workCenterCode: "WC-PICK-01", durationMin: 8, setupMin: 0 },
      { sequence: 20, name: "Roll + box kit", workCenterCode: "WC-KIT-01", durationMin: 12, setupMin: 5 },
      { sequence: 30, name: "Seal + label", workCenterCode: "WC-PACK-01", durationMin: 8, setupMin: 0 },
    ]),
    totalDurationMin: 33,
  },
  {
    id: "rt_014",
    number: "RT-STAND-001",
    productName: "Adjustable Laptop Stand",
    productSku: "SKU-0022",
    bomId: "bom_014",
    bomNumber: "BOM-STAND-001",
    version: "v1.0",
    effectiveFrom: "2026-05-10",
    status: "active",
    operations: opsWithIds("014", [
      { sequence: 10, name: "Phantom frame merge", workCenterCode: "WC-ASM-01", durationMin: 20, setupMin: 10 },
      { sequence: 20, name: "Grip pad install", workCenterCode: "WC-ASM-01", durationMin: 10, setupMin: 0 },
      { sequence: 30, name: "Stability QC", workCenterCode: "WC-QC-01", durationMin: 8, setupMin: 0 },
      { sequence: 40, name: "Pouch pack", workCenterCode: "WC-PACK-01", durationMin: 8, setupMin: 0 },
    ]),
    totalDurationMin: 56,
  },
  {
    id: "rt_015",
    number: "RT-BOTTLE-001",
    productName: "Stainless Water Bottle",
    productSku: "SKU-0011",
    bomId: "bom_015",
    bomNumber: "BOM-BOTTLE-001",
    version: "v2.0",
    effectiveFrom: "2026-02-01",
    status: "active",
    operations: opsWithIds("015", [
      { sequence: 10, name: "Body + lid press", workCenterCode: "WC-BTL-01", durationMin: 15, setupMin: 10 },
      { sequence: 20, name: "Leak test", workCenterCode: "WC-QC-01", durationMin: 10, setupMin: 0 },
      { sequence: 30, name: "Label + shrink wrap", workCenterCode: "WC-PACK-01", durationMin: 10, setupMin: 0 },
    ]),
    totalDurationMin: 45,
  },
];

export function getRoutingById(id: string) {
  return routingsSeed.find((r) => r.id === id);
}

export function getActiveRoutingBySku(sku: string) {
  return routingsSeed.find((r) => r.productSku === sku && r.status === "active");
}

export function routingTotalDuration(ops: RoutingOperation[]) {
  return ops.reduce((s, o) => s + o.durationMin + o.setupMin, 0);
}

export function buildRoutingDraft(input: {
  productName: string;
  productSku: string;
  bomId?: string;
  bomNumber?: string;
  version?: string;
  effectiveFrom?: string;
  notes?: string;
  operations?: Omit<RoutingOperation, "id">[];
}): ManufacturingRouting {
  const stamp = Date.now();
  const id = `rt_${stamp}`;
  const baseOps = input.operations ?? STANDARD_OPS;
  const operations = baseOps.map((op, i) => ({
    ...op,
    id: `rop_${stamp}_${i}`,
  }));

  return {
    id,
    number: `RT-${input.productSku.replace(/[^A-Z0-9]/gi, "").slice(0, 6).toUpperCase() || String(stamp).slice(-4)}`,
    productName: input.productName,
    productSku: input.productSku,
    bomId: input.bomId,
    bomNumber: input.bomNumber,
    version: input.version ?? "v1.0",
    effectiveFrom: input.effectiveFrom ?? new Date().toISOString().slice(0, 10),
    status: "draft",
    operations,
    totalDurationMin: routingTotalDuration(operations),
    notes: input.notes,
  };
}

export { STANDARD_OPS as defaultRoutingOperations };
