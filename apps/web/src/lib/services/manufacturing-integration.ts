import { getBomById } from "@/lib/mock-data/manufacturing-boms";
import { estimateProductCost, getComponentUnitCost } from "@/lib/mock-data/manufacturing-cost";
import { mapManufacturingWarehouse } from "@/lib/mock-data/inventory";
import { MANUFACTURING_GL_ACCOUNTS } from "@/lib/mock-data/accounting-journal";
import type { WorkOrder, WorkOrderMaterial } from "@/lib/mock-data/manufacturing-work-orders";
import { useAccountingJournalStore } from "@/lib/store/accounting-journal-store";
import { useInventoryStore } from "@/lib/store/inventory-store";

export type ManufacturingIntegrationResult = {
  inventoryEvents: string[];
  accountingEvents: string[];
};

function woRef(wo: WorkOrder) {
  return {
    referenceType: "work_order" as const,
    referenceId: wo.id,
    referenceLabel: wo.number,
  };
}

function stdCostPerUnit(wo: WorkOrder): number {
  const bom = getBomById(wo.bomId);
  if (!bom) return 0;
  return estimateProductCost(bom, Math.max(wo.quantity, 1)).totalCostPerUnit;
}

export function reserveWorkOrderMaterials(wo: WorkOrder): ManufacturingIntegrationResult {
  const warehouse = mapManufacturingWarehouse(wo.warehouse);
  const inventory = useInventoryStore.getState();
  const events: string[] = [];

  for (const m of wo.materials) {
    const mov = inventory.reserveStock({
      sku: m.sku,
      productName: m.name,
      warehouse,
      quantity: m.quantityRequired,
      ...woRef(wo),
    });
    if (mov) events.push(`Reserved ${m.quantityRequired} ${m.uom} ${m.sku}`);
  }

  return { inventoryEvents: events, accountingEvents: [] };
}

function postMaterialIssueJournal(
  wo: WorkOrder,
  amount: number,
  memo: string,
): string | null {
  if (amount <= 0) return null;
  const journal = useAccountingJournalStore.getState();
  const entry = journal.postEntry({
    description: `Material issue — ${wo.number}`,
    ...woRef(wo),
    event: "accounting.manufacturing.material_issue.posted",
    lines: [
      {
        accountCode: MANUFACTURING_GL_ACCOUNTS.wip.code,
        accountName: MANUFACTURING_GL_ACCOUNTS.wip.name,
        debit: amount,
        credit: 0,
        memo,
      },
      {
        accountCode: MANUFACTURING_GL_ACCOUNTS.rawMaterials.code,
        accountName: MANUFACTURING_GL_ACCOUNTS.rawMaterials.name,
        debit: 0,
        credit: amount,
        memo,
      },
    ],
  });
  return entry ? entry.number : null;
}

function postFgReceiptJournal(wo: WorkOrder, amount: number, qty: number): string | null {
  if (amount <= 0) return null;
  const journal = useAccountingJournalStore.getState();
  const entry = journal.postEntry({
    description: `FG receipt — ${wo.number} (${qty} units)`,
    ...woRef(wo),
    event: "accounting.manufacturing.fg_receipt.posted",
    lines: [
      {
        accountCode: MANUFACTURING_GL_ACCOUNTS.finishedGoods.code,
        accountName: MANUFACTURING_GL_ACCOUNTS.finishedGoods.name,
        debit: amount,
        credit: 0,
        memo: `${wo.productSku} received to ${wo.warehouse}`,
      },
      {
        accountCode: MANUFACTURING_GL_ACCOUNTS.wip.code,
        accountName: MANUFACTURING_GL_ACCOUNTS.wip.name,
        debit: 0,
        credit: amount,
        memo: "WIP relief on FG receipt",
      },
    ],
  });
  return entry ? entry.number : null;
}

export function issueWorkOrderMaterial(
  wo: WorkOrder,
  material: WorkOrderMaterial,
  quantity: number,
): ManufacturingIntegrationResult {
  const warehouse = mapManufacturingWarehouse(wo.warehouse);
  const unitCost = getComponentUnitCost(material.sku);
  const inventory = useInventoryStore.getState();
  const amount = Math.round(quantity * unitCost * 100) / 100;

  const mov = inventory.stockOut({
    sku: material.sku,
    productName: material.name,
    warehouse,
    quantity,
    unitCost,
    ...woRef(wo),
  });

  const inventoryEvents = mov
    ? [`inventory.stock_out.posted — ${quantity} ${material.uom} ${material.sku}`]
    : [];

  const jeNumber = postMaterialIssueJournal(
    wo,
    amount,
    `${material.name} (${quantity} ${material.uom})`,
  );
  const accountingEvents = jeNumber
    ? [`accounting.manufacturing.material_issue.posted — ${jeNumber} (৳${amount.toLocaleString("en-BD")})`]
    : [];

  return { inventoryEvents, accountingEvents };
}

export function issueAllWorkOrderMaterials(wo: WorkOrder): ManufacturingIntegrationResult {
  const inventoryEvents: string[] = [];
  const accountingEvents: string[] = [];

  for (const m of wo.materials) {
    const delta = m.quantityRequired - m.quantityIssued;
    if (delta <= 0) continue;
    const result = issueWorkOrderMaterial(wo, m, delta);
    inventoryEvents.push(...result.inventoryEvents);
    accountingEvents.push(...result.accountingEvents);
  }

  return { inventoryEvents, accountingEvents };
}

export function receiveWorkOrderOutput(
  wo: WorkOrder,
  quantity: number,
): ManufacturingIntegrationResult {
  const warehouse = mapManufacturingWarehouse(wo.warehouse);
  const unitCost = stdCostPerUnit(wo);
  const amount = Math.round(quantity * unitCost * 100) / 100;
  const inventory = useInventoryStore.getState();

  const mov = inventory.stockIn({
    sku: wo.productSku,
    productName: wo.productName,
    warehouse,
    quantity,
    unitCost,
    ...woRef(wo),
  });

  const inventoryEvents = mov
    ? [`inventory.stock_in.posted — ${quantity} ea ${wo.productSku} @ ৳${unitCost}`]
    : [];

  const jeNumber = postFgReceiptJournal(wo, amount, quantity);
  const accountingEvents = jeNumber
    ? [`accounting.manufacturing.fg_receipt.posted — ${jeNumber} (৳${amount.toLocaleString("en-BD")})`]
    : [];

  return { inventoryEvents, accountingEvents };
}
