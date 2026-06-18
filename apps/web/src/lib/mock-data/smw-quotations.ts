/**
 * Sales & Marketing — Quotation mock data · SCR-SMW-QUO-001
 * @see docs/modules/sales-marketing/ui-design/05_QUOTATION_BUILDER_UI_DESIGN.md
 */

export type QuotationStatus =
  | "draft"
  | "pending_approval"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired";

export type QuotationLineItem = {
  id: string;
  sku: string;
  productId?: string;
  description: string;
  qty: number;
  uom: string;
  unitPrice: number;
  discountPct: number;
};

export type SmwQuotation = {
  id: string;
  quotationNumber: string;
  accountName: string;
  opportunityId?: string;
  opportunityTitle?: string;
  status: QuotationStatus;
  ownerId: string;
  ownerName: string;
  validUntil: string;
  lines: QuotationLineItem[];
  documentDiscountPct: number;
  taxPct: number;
  terms: string;
  notes: string;
  createdAt: string;
  version: number;
};

export const QUOTATION_STATUS_LABELS: Record<QuotationStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending approval",
  sent: "Sent",
  accepted: "Accepted",
  rejected: "Rejected",
  expired: "Expired",
};

export const QUOTATION_UOM_OPTIONS = ["Each", "Hour", "Day", "Month", "License", "Set"] as const;

export const SMW_QUO_OWNERS = [
  { id: "farhana", name: "Farhana Rahman" },
  { id: "karim", name: "Karim Hassan" },
  { id: "nadia", name: "Nadia Chowdhury" },
  { id: "rafiq", name: "Rafiq Islam" },
  { id: "sadia", name: "Sadia Akter" },
] as const;

/** Catalog picks for product autocomplete */
export const SMW_QUO_CATALOG_PRODUCTS = [
  { id: "cat-erp", sku: "ERP-CORE", name: "ERP Core License", unitPrice: 250000 },
  { id: "cat-inv", sku: "INV-MOD", name: "Inventory Module", unitPrice: 85000 },
  { id: "cat-impl", sku: "SVC-IMPL", name: "Implementation services", unitPrice: 120000 },
  { id: "cat-sup", sku: "SVC-SUP", name: "Annual support", unitPrice: 45000 },
  { id: "cat-pos", sku: "POS-LIC", name: "POS License pack", unitPrice: 65000 },
  { id: "cat-train", sku: "SVC-TRN", name: "Training (per day)", unitPrice: 15000 },
] as const;

export const smwQuotationsSeed: SmwQuotation[] = [
  {
    id: "quo-184",
    quotationNumber: "QUO-2026-0184",
    accountName: "Nova Foods Ltd",
    opportunityId: "opp-812",
    opportunityTitle: "Warehouse WMS phase 1",
    status: "sent",
    ownerId: "karim",
    ownerName: "Karim Hassan",
    validUntil: "2026-07-18",
    documentDiscountPct: 5,
    taxPct: 15,
    terms: "Net 30 · Prices valid 30 days",
    notes: "Includes onsite kickoff workshop",
    createdAt: "2026-06-10",
    version: 2,
    lines: [
      { id: "l1", sku: "ERP-CORE", productId: "cat-erp", description: "ERP Core License", qty: 1, uom: "License", unitPrice: 250000, discountPct: 0 },
      { id: "l2", sku: "INV-MOD", productId: "cat-inv", description: "Inventory Module", qty: 1, uom: "License", unitPrice: 85000, discountPct: 10 },
      { id: "l3", sku: "SVC-IMPL", productId: "cat-impl", description: "Implementation services", qty: 5, uom: "Day", unitPrice: 12000, discountPct: 0 },
    ],
  },
  {
    id: "quo-172",
    quotationNumber: "QUO-2026-0172",
    accountName: "GreenMart Retail",
    opportunityId: "opp-771",
    opportunityTitle: "SS26 Collection rollout",
    status: "pending_approval",
    ownerId: "nusrat",
    ownerName: "Nusrat Jahan",
    validUntil: "2026-06-30",
    documentDiscountPct: 12,
    taxPct: 15,
    terms: "Net 45 · 12% volume discount pending approval",
    notes: "",
    createdAt: "2026-06-05",
    version: 1,
    lines: [
      { id: "l1", sku: "POS-LIC", productId: "cat-pos", description: "POS License pack", qty: 8, uom: "License", unitPrice: 65000, discountPct: 5 },
      { id: "l2", sku: "SVC-SUP", productId: "cat-sup", description: "Annual support", qty: 1, uom: "Year", unitPrice: 45000, discountPct: 0 },
    ],
  },
  {
    id: "quo-158",
    quotationNumber: "QUO-2026-0158",
    accountName: "GreenTech Solutions",
    opportunityId: "opp-882",
    opportunityTitle: "ERP + inventory module",
    status: "draft",
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
    validUntil: "2026-07-20",
    documentDiscountPct: 0,
    taxPct: 15,
    terms: "Standard terms",
    notes: "Draft — awaiting final SKU list",
    createdAt: "2026-06-15",
    version: 1,
    lines: [
      { id: "l1", sku: "ERP-CORE", productId: "cat-erp", description: "ERP Core License", qty: 1, uom: "License", unitPrice: 420000, discountPct: 0 },
    ],
  },
  {
    id: "quo-141",
    quotationNumber: "QUO-2026-0141",
    accountName: "Brightline Pharma",
    opportunityId: "opp-698",
    opportunityTitle: "Pharma compliance suite",
    status: "accepted",
    ownerId: "farhana",
    ownerName: "Farhana Rahman",
    validUntil: "2026-05-30",
    documentDiscountPct: 0,
    taxPct: 15,
    terms: "Net 30",
    notes: "",
    createdAt: "2026-05-01",
    version: 3,
    lines: [
      { id: "l1", sku: "ERP-CORE", description: "ERP Core License", qty: 1, uom: "License", unitPrice: 380000, discountPct: 0 },
      { id: "l2", sku: "SVC-IMPL", description: "Implementation", qty: 10, uom: "Day", unitPrice: 14000, discountPct: 0 },
    ],
  },
  {
    id: "quo-129",
    quotationNumber: "QUO-2026-0129",
    accountName: "Metro Distributors",
    status: "expired",
    ownerId: "sadia",
    ownerName: "Sadia Akter",
    validUntil: "2026-05-15",
    documentDiscountPct: 0,
    taxPct: 15,
    terms: "Net 30",
    notes: "Expired — follow up for renewal",
    createdAt: "2026-04-10",
    version: 1,
    lines: [
      { id: "l1", sku: "INV-MOD", description: "Inventory Module", qty: 1, uom: "License", unitPrice: 95000, discountPct: 0 },
    ],
  },
];

export function getQuotationById(id: string): SmwQuotation | undefined {
  return smwQuotationsSeed.find((q) => q.id === id || q.quotationNumber === id);
}

export function lineTotal(line: QuotationLineItem): number {
  const gross = line.qty * line.unitPrice;
  return Math.round(gross * (1 - line.discountPct / 100));
}

export function computeQuotationTotals(quotation: Pick<SmwQuotation, "lines" | "documentDiscountPct" | "taxPct">) {
  const subtotal = quotation.lines.reduce((s, l) => s + lineTotal(l), 0);
  const afterDocDiscount = Math.round(subtotal * (1 - quotation.documentDiscountPct / 100));
  const tax = Math.round(afterDocDiscount * (quotation.taxPct / 100));
  const grandTotal = afterDocDiscount + tax;
  return { subtotal, afterDocDiscount, tax, grandTotal };
}

export function formatQuoCurrency(value: number): string {
  if (value >= 1_000_000) return `৳${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `৳${Math.round(value / 1_000).toLocaleString()}K`;
  return `৳${value.toLocaleString()}`;
}

export function quotationStatusToEnterprise(status: QuotationStatus) {
  const map = {
    draft: "draft" as const,
    pending_approval: "pending" as const,
    sent: "pending" as const,
    accepted: "approved" as const,
    rejected: "rejected" as const,
    expired: "archived" as const,
  };
  return map[status];
}

export function emptyQuotationLine(): QuotationLineItem {
  return {
    id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sku: "",
    description: "",
    qty: 1,
    uom: "Each",
    unitPrice: 0,
    discountPct: 0,
  };
}

export function emptyQuotation(): SmwQuotation {
  const owner = SMW_QUO_OWNERS[0]!;
  const valid = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  return {
    id: `quo-${Date.now()}`,
    quotationNumber: `QUO-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    accountName: "",
    status: "draft",
    ownerId: owner.id,
    ownerName: owner.name,
    validUntil: valid,
    lines: [emptyQuotationLine()],
    documentDiscountPct: 0,
    taxPct: 15,
    terms: "Net 30 · Prices valid 30 days",
    notes: "",
    createdAt: new Date().toISOString().slice(0, 10),
    version: 1,
  };
}

export function quotationFromOpportunity(opp: {
  id: string;
  title: string;
  accountName: string;
  amount: number;
  ownerId: string;
  ownerName: string;
}): SmwQuotation {
  const base = emptyQuotation();
  return {
    ...base,
    accountName: opp.accountName,
    opportunityId: opp.id,
    opportunityTitle: opp.title,
    ownerId: opp.ownerId,
    ownerName: opp.ownerName,
    lines: [
      {
        ...emptyQuotationLine(),
        description: opp.title,
        unitPrice: opp.amount,
        qty: 1,
        uom: "Set",
      },
    ],
  };
}
