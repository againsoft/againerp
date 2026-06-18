export type BomType = "manufacturing" | "phantom" | "kit";

export type BomLine = {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  uom: string;
};

export type BillOfMaterials = {
  id: string;
  number: string;
  productName: string;
  productSku: string;
  type: BomType;
  version: string;
  effectiveFrom: string;
  lines: BomLine[];
  notes?: string;
};

export const BOM_TYPE_LABELS: Record<BomType, string> = {
  manufacturing: "Manufacturing",
  phantom: "Phantom",
  kit: "Kit",
};

export const bomsSeed: BillOfMaterials[] = [
  {
    id: "bom_001",
    number: "BOM-TS-001",
    productName: "Premium Cotton T-Shirt",
    productSku: "SKU-0001",
    type: "manufacturing",
    version: "v2.1",
    effectiveFrom: "2026-01-01",
    lines: [
      { id: "bl_001_1", sku: "RM-COTTON", name: "Cotton fabric roll (180gsm)", quantity: 1.2, uom: "m" },
      { id: "bl_001_2", sku: "RM-THREAD", name: "Poly thread spool — black", quantity: 0.05, uom: "ea" },
      { id: "bl_001_3", sku: "RM-LABEL", name: "Woven brand label", quantity: 1, uom: "ea" },
      { id: "bl_001_4", sku: "RM-TAG", name: "Hang tag + barcode sticker", quantity: 1, uom: "ea" },
    ],
    notes: "Garment BOM — CTG sewing line (WC-SEW-01). 1 unit = 1 finished tee.",
  },
  {
    id: "bom_002",
    number: "BOM-EAR-001",
    productName: "Wireless Earbuds Pro",
    productSku: "SKU-0002",
    type: "manufacturing",
    version: "v1.4",
    effectiveFrom: "2026-03-15",
    lines: [
      { id: "bl_002_1", sku: "RM-EAR-HOUSING", name: "Earbud housing set (L/R)", quantity: 2, uom: "ea" },
      { id: "bl_002_2", sku: "RM-PCB-AUDIO", name: "Audio PCB + BT module", quantity: 2, uom: "ea" },
      { id: "bl_002_3", sku: "RM-CASE-USB", name: "Charge case shell + lid", quantity: 1, uom: "ea" },
      { id: "bl_002_4", sku: "RM-USB-CABLE", name: "USB-C charge cable (0.5m)", quantity: 1, uom: "ea" },
      { id: "bl_002_5", sku: "RM-EAR-TIPS", name: "Silicone ear tips (S/M/L)", quantity: 3, uom: "ea" },
    ],
    notes: "Electronics assembly — DHK line. Demo WO: WO-2026-0201 (in progress).",
  },
  {
    id: "bom_003",
    number: "BOM-SPK-001",
    productName: "Bluetooth Speaker Mini",
    productSku: "SKU-0006",
    type: "manufacturing",
    version: "v1.0",
    effectiveFrom: "2026-02-01",
    lines: [
      { id: "bl_003_1", sku: "RM-SPK-DRIVER", name: "40mm neodymium driver", quantity: 1, uom: "ea" },
      { id: "bl_003_2", sku: "RM-SPK-AMP", name: "Class-D amplifier board", quantity: 1, uom: "ea" },
      { id: "bl_003_3", sku: "RM-SPK-GRILL", name: "Metal speaker grill", quantity: 1, uom: "ea" },
      { id: "bl_003_4", sku: "RM-SPK-BATT", name: "18650 Li-ion cell", quantity: 1, uom: "ea" },
    ],
    notes: "Released WO demo — WO-2026-0204 (Start বাটন টেস্ট).",
  },
  {
    id: "bom_004",
    number: "BOM-HUB-KIT",
    productName: "USB-C Hub 7-in-1",
    productSku: "SKU-0014",
    type: "kit",
    version: "v1.2",
    effectiveFrom: "2026-04-01",
    lines: [
      { id: "bl_004_1", sku: "RM-HUB-PCBA", name: "Hub PCBA (tested)", quantity: 1, uom: "ea" },
      { id: "bl_004_2", sku: "RM-HUB-ALU", name: "Aluminum enclosure", quantity: 1, uom: "ea" },
      { id: "bl_004_3", sku: "RM-HUB-SCREW", name: "Torx screw kit", quantity: 1, uom: "set" },
    ],
    notes: "Kit BOM — no routing ops, just pick + pack. Planned WO demo: WO-2026-0205.",
  },
  {
    id: "bom_005",
    number: "BOM-WATCH-SUB",
    productName: "Smart Watch Sub-assembly",
    productSku: "SUB-WATCH-01",
    type: "phantom",
    version: "v1.0",
    effectiveFrom: "2026-05-01",
    lines: [
      { id: "bl_005_1", sku: "RM-WATCH-DISPLAY", name: "1.4″ AMOLED display module", quantity: 1, uom: "ea" },
      { id: "bl_005_2", sku: "RM-WATCH-BATT", name: "300mAh Li-ion battery", quantity: 1, uom: "ea" },
      { id: "bl_005_3", sku: "RM-WATCH-PCB", name: "Main logic board", quantity: 1, uom: "ea" },
    ],
    notes: "Phantom BOM — WO release-এ parent BOM থেকে auto explode হয়, stock move হয় না.",
  },
  {
    id: "bom_006",
    number: "BOM-WATCH-001",
    productName: "Smart Watch Series 5",
    productSku: "SKU-0005",
    type: "manufacturing",
    version: "v3.0",
    effectiveFrom: "2026-06-01",
    lines: [
      { id: "bl_006_1", sku: "SUB-WATCH-01", name: "Watch sub-assembly (phantom)", quantity: 1, uom: "ea" },
      { id: "bl_006_2", sku: "RM-WATCH-BAND", name: "Silicone sport band", quantity: 1, uom: "ea" },
      { id: "bl_006_3", sku: "RM-WATCH-BOX", name: "Retail gift box + manual", quantity: 1, uom: "ea" },
    ],
    notes: "Parent BOM with phantom line — WO-2026-0210 demo.",
  },
  {
    id: "bom_007",
    number: "BOM-SHOE-001",
    productName: "Running Shoes Ultra",
    productSku: "SKU-0004",
    type: "manufacturing",
    version: "v1.1",
    effectiveFrom: "2026-03-01",
    lines: [
      { id: "bl_007_1", sku: "RM-SHOE-UPPER", name: "Mesh upper (size run)", quantity: 1, uom: "pair" },
      { id: "bl_007_2", sku: "RM-SHOE-MID", name: "EVA midsole", quantity: 1, uom: "pair" },
      { id: "bl_007_3", sku: "RM-SHOE-OUT", name: "Rubber outsole", quantity: 1, uom: "pair" },
      { id: "bl_007_4", sku: "RM-SHOE-LACE", name: "Reflective laces", quantity: 1, uom: "pair" },
    ],
    notes: "Footwear — SYL assembly. High volume batch WO-2026-0208.",
  },
  {
    id: "bom_008",
    number: "BOM-MUG-KIT",
    productName: "Ceramic Coffee Mug Set",
    productSku: "SKU-0003",
    type: "kit",
    version: "v1.0",
    effectiveFrom: "2026-02-15",
    lines: [
      { id: "bl_008_1", sku: "RM-MUG-CER", name: "Ceramic mug (350ml)", quantity: 4, uom: "ea" },
      { id: "bl_008_2", sku: "RM-MUG-BOX", name: "Gift box with divider", quantity: 1, uom: "ea" },
      { id: "bl_008_3", sku: "RM-MUG-RIBBON", name: "Ribbon + thank-you card", quantity: 1, uom: "set" },
    ],
    notes: "Simple kit — 4 mugs + packaging. Cancelled WO demo: WO-2026-0209.",
  },
  {
    id: "bom_009",
    number: "BOM-PWR-001",
    productName: "Power Bank 20000mAh",
    productSku: "SKU-0008",
    type: "manufacturing",
    version: "v2.0",
    effectiveFrom: "2026-05-20",
    lines: [
      { id: "bl_009_1", sku: "RM-PWR-CELL", name: "Li-poly cell pack 20000mAh", quantity: 1, uom: "ea" },
      { id: "bl_009_2", sku: "RM-PWR-PCB", name: "BMS + USB-C PD board", quantity: 1, uom: "ea" },
      { id: "bl_009_3", sku: "RM-PWR-CASE", name: "ABS housing", quantity: 1, uom: "ea" },
    ],
    notes: "Rush replenishment — low stock alert from dashboard. WO-2026-0211.",
  },
  {
    id: "bom_010",
    number: "BOM-STAND-SUB",
    productName: "Laptop Stand Frame",
    productSku: "SUB-STAND-01",
    type: "phantom",
    version: "v1.0",
    effectiveFrom: "2026-04-10",
    lines: [
      { id: "bl_010_1", sku: "RM-STAND-ALU", name: "Bent aluminum frame", quantity: 1, uom: "ea" },
      { id: "bl_010_2", sku: "RM-STAND-HINGE", name: "Adjustable hinge pair", quantity: 1, uom: "set" },
    ],
    notes: "Phantom sub-frame — used inside laptop stand parent BOM.",
  },
  {
    id: "bom_011",
    number: "BOM-LAMP-001",
    productName: "LED Desk Lamp",
    productSku: "SKU-0010",
    type: "manufacturing",
    version: "v1.3",
    effectiveFrom: "2026-04-15",
    lines: [
      { id: "bl_011_1", sku: "RM-LAMP-LED", name: "LED module strip", quantity: 1, uom: "ea" },
      { id: "bl_011_2", sku: "RM-LAMP-ARM", name: "Adjustable arm + base", quantity: 1, uom: "set" },
      { id: "bl_011_3", sku: "RM-LAMP-PSU", name: "12V power adapter", quantity: 1, uom: "ea" },
    ],
    notes: "Desk lamp assembly — DHK electronics line.",
  },
  {
    id: "bom_012",
    number: "BOM-HOOD-001",
    productName: "Graphic Hoodie",
    productSku: "SKU-0012",
    type: "manufacturing",
    version: "v1.0",
    effectiveFrom: "2026-05-01",
    lines: [
      { id: "bl_012_1", sku: "RM-HOOD-FLEECE", name: "Fleece blank hoodie", quantity: 1, uom: "ea" },
      { id: "bl_012_2", sku: "RM-HOOD-INK", name: "Screen print transfer", quantity: 1, uom: "ea" },
      { id: "bl_012_3", sku: "RM-TAG", name: "Brand hang tag", quantity: 1, uom: "ea" },
    ],
    notes: "Apparel — print then QC. WO-2026-0213 in progress.",
  },
  {
    id: "bom_013",
    number: "BOM-YOGA-KIT",
    productName: "Yoga Mat Pro",
    productSku: "SKU-0009",
    type: "kit",
    version: "v1.1",
    effectiveFrom: "2026-03-20",
    lines: [
      { id: "bl_013_1", sku: "RM-YOGA-MAT", name: "TPE yoga mat 6mm", quantity: 1, uom: "ea" },
      { id: "bl_013_2", sku: "RM-YOGA-STRAP", name: "Carry strap", quantity: 1, uom: "ea" },
      { id: "bl_013_3", sku: "RM-YOGA-BOX", name: "Retail box", quantity: 1, uom: "ea" },
    ],
    notes: "Kit BOM — mat + strap + box. Released WO-2026-0214.",
  },
  {
    id: "bom_014",
    number: "BOM-STAND-001",
    productName: "Adjustable Laptop Stand",
    productSku: "SKU-0022",
    type: "manufacturing",
    version: "v1.0",
    effectiveFrom: "2026-05-10",
    lines: [
      { id: "bl_014_1", sku: "SUB-STAND-01", name: "Stand frame (phantom)", quantity: 1, uom: "ea" },
      { id: "bl_014_2", sku: "RM-STAND-PAD", name: "Silicone grip pads (4pc)", quantity: 1, uom: "set" },
      { id: "bl_014_3", sku: "RM-STAND-BAG", name: "Carry pouch", quantity: 1, uom: "ea" },
    ],
    notes: "Uses phantom SUB-STAND-01 — frame parts explode at WO release.",
  },
  {
    id: "bom_015",
    number: "BOM-BOTTLE-001",
    productName: "Stainless Water Bottle",
    productSku: "SKU-0011",
    type: "manufacturing",
    version: "v2.0",
    effectiveFrom: "2026-02-01",
    lines: [
      { id: "bl_015_1", sku: "RM-BTL-BODY", name: "Double-wall steel body", quantity: 1, uom: "ea" },
      { id: "bl_015_2", sku: "RM-BTL-LID", name: "Leak-proof lid assembly", quantity: 1, uom: "ea" },
      { id: "bl_015_3", sku: "RM-BTL-LABEL", name: "Capacity label + barcode", quantity: 1, uom: "ea" },
    ],
    notes: "Completed batch WO-2026-0215 — 400 units to WH-SYL.",
  },
];

export function getBomById(id: string) {
  return bomsSeed.find((b) => b.id === id);
}

export function buildBomDraft(input: {
  productName: string;
  productSku: string;
  type: BomType;
  version?: string;
  effectiveFrom?: string;
  notes?: string;
  lines: Omit<BomLine, "id">[];
}): BillOfMaterials {
  const stamp = Date.now();
  const id = `bom_${stamp}`;
  const lines: BomLine[] = input.lines.map((line, i) => ({
    ...line,
    id: `bl_${stamp}_${i}`,
  }));

  return {
    id,
    number: `BOM-${input.productSku.replace(/[^A-Z0-9]/gi, "").slice(0, 8).toUpperCase() || String(stamp).slice(-4)}`,
    productName: input.productName,
    productSku: input.productSku,
    type: input.type,
    version: input.version ?? "v1.0",
    effectiveFrom: input.effectiveFrom ?? new Date().toISOString().slice(0, 10),
    lines: lines.length > 0 ? lines : [{ id: `bl_${stamp}_0`, sku: "", name: "", quantity: 1, uom: "ea" }],
    notes: input.notes,
  };
}

export function materialsFromBom(bom: BillOfMaterials, orderQty: number) {
  return bom.lines.map((line) => ({
    id: `mat_${line.id}`,
    sku: line.sku,
    name: line.name,
    quantityRequired: Math.round(line.quantity * orderQty * 100) / 100,
    quantityIssued: 0,
    uom: line.uom,
  }));
}
