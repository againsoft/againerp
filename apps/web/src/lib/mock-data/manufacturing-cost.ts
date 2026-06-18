import type { BillOfMaterials, BomLine } from "./manufacturing-boms";
import { bomsSeed } from "./manufacturing-boms";
import { getActiveRoutingBySku, type ManufacturingRouting } from "./manufacturing-routings";
import { getWorkCenterByCode } from "./manufacturing-work-centers";

/** Mock standard batch for amortizing routing setup time → per-unit cost. */
export const STANDARD_COST_BATCH_SIZE = 100;

/** Mock inventory standard costs (BDT) — prototype only. */
export const COMPONENT_UNIT_COSTS: Record<string, number> = {
  "RM-COTTON": 95,
  "RM-THREAD": 12,
  "RM-LABEL": 8,
  "RM-TAG": 5,
  "RM-EAR-HOUSING": 80,
  "RM-PCB-AUDIO": 120,
  "RM-CASE-USB": 150,
  "RM-USB-CABLE": 45,
  "RM-EAR-TIPS": 15,
  "RM-SPK-DRIVER": 220,
  "RM-SPK-AMP": 180,
  "RM-SPK-GRILL": 35,
  "RM-SPK-BATT": 90,
  "RM-HUB-PCBA": 850,
  "RM-HUB-ALU": 320,
  "RM-HUB-SCREW": 25,
  "RM-WATCH-DISPLAY": 1200,
  "RM-WATCH-BATT": 280,
  "RM-WATCH-PCB": 650,
  "RM-WATCH-BAND": 120,
  "RM-WATCH-BOX": 85,
  "RM-SHOE-UPPER": 420,
  "RM-SHOE-MID": 180,
  "RM-SHOE-OUT": 150,
  "RM-SHOE-LACE": 25,
  "RM-MUG-CER": 110,
  "RM-MUG-BOX": 45,
  "RM-MUG-RIBBON": 15,
  "RM-PWR-CELL": 680,
  "RM-PWR-PCB": 240,
  "RM-PWR-CASE": 95,
  "RM-STAND-ALU": 380,
  "RM-STAND-HINGE": 120,
  "RM-STAND-PAD": 20,
  "RM-STAND-BAG": 35,
  "RM-LAMP-LED": 180,
  "RM-LAMP-ARM": 420,
  "RM-LAMP-PSU": 150,
  "RM-HOOD-FLEECE": 320,
  "RM-HOOD-INK": 45,
  "RM-YOGA-MAT": 550,
  "RM-YOGA-STRAP": 35,
  "RM-YOGA-BOX": 40,
  "RM-BTL-BODY": 280,
  "RM-BTL-LID": 65,
  "RM-BTL-LABEL": 8,
};

/** Catalog sell price hints for margin display (mock). */
export const CATALOG_SELL_PRICES: Record<string, number> = {
  "SKU-0001": 899,
  "SKU-0002": 3499,
  "SKU-0003": 1200,
  "SKU-0004": 5200,
  "SKU-0005": 8900,
  "SKU-0006": 2100,
  "SKU-0008": 2800,
  "SKU-0009": 3200,
  "SKU-0010": 1850,
  "SKU-0011": 1450,
  "SKU-0012": 2400,
  "SKU-0014": 4200,
  "SKU-0022": 1900,
};

const DEFAULT_COMPONENT_COST = 50;

/** Overhead % on material + labor (mock burden). */
export const MANUFACTURING_OVERHEAD_PCT = 8;

export type MaterialCostLine = {
  line: BomLine;
  unitCost: number;
  lineCostPerFg: number;
  source: "inventory" | "phantom_bom" | "default";
};

export type LaborCostLine = {
  sequence: number;
  name: string;
  workCenterCode: string;
  minutes: number;
  ratePerHour: number;
  costPerBatch: number;
  costPerUnit: number;
};

export type ProductCostEstimate = {
  bomId: string;
  bomNumber: string;
  productSku: string;
  batchSize: number;
  routingId?: string;
  routingNumber?: string;
  materialLines: MaterialCostLine[];
  materialCostPerUnit: number;
  laborLines: LaborCostLine[];
  laborCostPerUnit: number;
  overheadCostPerUnit: number;
  totalCostPerUnit: number;
  catalogPrice?: number;
  marginPct?: number;
};

function phantomBomForSku(sku: string) {
  return bomsSeed.find((b) => b.productSku === sku && b.type === "phantom");
}

export function getComponentUnitCost(sku: string, visited = new Set<string>()): number {
  if (!sku) return DEFAULT_COMPONENT_COST;
  if (COMPONENT_UNIT_COSTS[sku] != null) return COMPONENT_UNIT_COSTS[sku];

  const phantom = phantomBomForSku(sku);
  if (phantom && !visited.has(phantom.id)) {
    visited.add(phantom.id);
    return phantom.lines.reduce(
      (sum, line) => sum + line.quantity * getComponentUnitCost(line.sku, visited),
      0,
    );
  }

  return DEFAULT_COMPONENT_COST;
}

export function materialCostLinesForBom(bom: BillOfMaterials): MaterialCostLine[] {
  return bom.lines.map((line) => {
    const phantom = phantomBomForSku(line.sku);
    const unitCost = getComponentUnitCost(line.sku);
    return {
      line,
      unitCost,
      lineCostPerFg: Math.round(line.quantity * unitCost * 100) / 100,
      source: phantom ? "phantom_bom" : unitCost === DEFAULT_COMPONENT_COST ? "default" : "inventory",
    };
  });
}

export function laborCostLinesForRouting(
  routing: ManufacturingRouting,
  batchSize: number,
): LaborCostLine[] {
  const batch = Math.max(batchSize, 1);
  return routing.operations.map((op) => {
    const wc = getWorkCenterByCode(op.workCenterCode);
    const rate = wc?.costRatePerHour ?? 500;
    const setupCost = (op.setupMin / 60) * rate;
    const runCostPerUnit = (op.durationMin / 60) * rate;
    const costPerUnit = Math.round((runCostPerUnit + setupCost / batch) * 100) / 100;
    const costPerBatch = Math.round((setupCost + runCostPerUnit * batch) * 100) / 100;
    return {
      sequence: op.sequence,
      name: op.name,
      workCenterCode: op.workCenterCode,
      minutes: op.durationMin + op.setupMin,
      ratePerHour: rate,
      costPerBatch,
      costPerUnit,
    };
  });
}

export function estimateProductCost(
  bom: BillOfMaterials,
  batchSize = STANDARD_COST_BATCH_SIZE,
): ProductCostEstimate {
  const materialLines = materialCostLinesForBom(bom);
  const materialCostPerUnit =
    Math.round(materialLines.reduce((s, l) => s + l.lineCostPerFg, 0) * 100) / 100;

  const routing = getActiveRoutingBySku(bom.productSku);
  const laborLines = routing ? laborCostLinesForRouting(routing, batchSize) : [];
  const laborCostPerUnit =
    Math.round(laborLines.reduce((s, l) => s + l.costPerUnit, 0) * 100) / 100;

  const base = materialCostPerUnit + laborCostPerUnit;
  const overheadCostPerUnit =
    Math.round(base * (MANUFACTURING_OVERHEAD_PCT / 100) * 100) / 100;
  const totalCostPerUnit = Math.round((base + overheadCostPerUnit) * 100) / 100;

  const catalogPrice = CATALOG_SELL_PRICES[bom.productSku];
  const marginPct =
    catalogPrice && catalogPrice > 0
      ? Math.round(((catalogPrice - totalCostPerUnit) / catalogPrice) * 1000) / 10
      : undefined;

  return {
    bomId: bom.id,
    bomNumber: bom.number,
    productSku: bom.productSku,
    batchSize,
    routingId: routing?.id,
    routingNumber: routing?.number,
    materialLines,
    materialCostPerUnit,
    laborLines,
    laborCostPerUnit,
    overheadCostPerUnit,
    totalCostPerUnit,
    catalogPrice,
    marginPct,
  };
}
