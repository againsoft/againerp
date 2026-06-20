export type AccountType = "asset" | "liability" | "equity" | "revenue" | "expense";
export type JournalStatus = "draft" | "posted" | "reversed";
export type JournalType = "SAL" | "PUR" | "BNK" | "CSH" | "MISC" | "INV" | "PAY" | "TAX";
export type DocStatus = "draft" | "posted" | "partial" | "paid" | "overdue" | "written_off";
export type ExpenseStatus = "draft" | "submitted" | "approved" | "rejected" | "reimbursed";
export type ChequeDirection = "received" | "issued";
export type ChequeStatus = "draft" | "issued" | "deposited" | "cleared" | "bounced" | "cancelled";

export function formatBdt(value: number) {
  if (Math.abs(value) >= 1_000_000) return `৳${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 1_000) return `৳${(value / 1_000).toFixed(0)}K`;
  return `৳${value.toLocaleString("en-BD")}`;
}

export const FINANCE_PERIOD = "Jun 2026 — Open";

export type CoaAccount = {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  parentId?: string;
  balance: number;
  active: boolean;
};

export type JournalLine = { accountCode: string; accountName: string; debit: number; credit: number };
export type JournalEntry = {
  id: string;
  number: string;
  type: JournalType;
  date: string;
  reference: string;
  description: string;
  debitTotal: number;
  creditTotal: number;
  status: JournalStatus;
  source: string;
  lines: JournalLine[];
};

export type InvoiceLine = {
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
};

export type BillLine = {
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
};

export type DocActivity = {
  timestamp: string;
  user: string;
  action: string;
  detail: string;
};

export type PaymentAllocation = {
  date: string;
  receiptNumber: string;
  amount: number;
  method: string;
};

export type ApMatchDetail = {
  poNumber: string;
  grnNumber: string;
  poAmount: number;
  grnAmount: number;
  billAmount: number;
  variance: number;
};

export type ApPaymentScheduleItem = {
  dueDate: string;
  amount: number;
  status: "scheduled" | "paid" | "overdue";
};

export type SystemTransaction = {
  id: string;
  bankAccountId: string;
  date: string;
  description: string;
  amount: number;
  type: "receipt" | "payment" | "journal";
  ref: string;
  matched: boolean;
  matchedToId?: string;
};

export type ArInvoice = {
  id: string;
  number: string;
  customer: string;
  date: string;
  dueDate: string;
  total: number;
  residual: number;
  status: DocStatus;
  aging: "current" | "30" | "60" | "90+";
};

export type ApBill = {
  id: string;
  number: string;
  vendor: string;
  billDate: string;
  dueDate: string;
  total: number;
  residual: number;
  matchStatus: "matched" | "partial" | "unmatched";
  status: DocStatus;
};

export type Receipt = {
  id: string;
  number: string;
  customer: string;
  date: string;
  amount: number;
  method: string;
  allocatedTo: string;
  status: "draft" | "posted" | "reconciled";
};

export type Payment = {
  id: string;
  number: string;
  vendor: string;
  date: string;
  amount: number;
  bankAccount: string;
  allocatedTo: string;
  status: "draft" | "posted" | "reconciled";
};

export type ExpenseClaim = {
  id: string;
  number: string;
  employee: string;
  date: string;
  amount: number;
  category: string;
  status: ExpenseStatus;
  approver: string;
};

export type ExpenseLine = {
  description: string;
  amount: number;
  receiptName: string;
  date: string;
};

export type ExpenseApprovalStep = {
  step: string;
  user: string;
  timestamp: string;
  status: "completed" | "current" | "pending";
};

export type TaxRule = {
  id: string;
  name: string;
  appliesTo: string;
  rateName: string;
  condition: string;
  active: boolean;
};

export type TaxReturn = {
  id: string;
  period: string;
  grossSales: number;
  outputTax: number;
  inputTax: number;
  netPayable: number;
  status: "draft" | "filed" | "paid";
};

export type TaxFilingRecord = {
  id: string;
  period: string;
  dueDate: string;
  filedDate?: string;
  status: "pending" | "filed" | "overdue";
};

export type ReportPreviewRow = { label: string; amount: number; indent?: boolean };

export type ReportPreview = {
  title: string;
  rows: ReportPreviewRow[];
  totals?: { label: string; amount: number }[];
};

export type BankAccount = {
  id: string;
  bank: string;
  accountNo: string;
  glBalance: number;
  statementBalance: number;
  unreconciled: number;
};

export type BankStatement = {
  id: string;
  bankAccountId: string;
  date: string;
  description: string;
  amount: number;
  matched: boolean;
  matchedToId?: string;
};

export type TaxRate = {
  id: string;
  name: string;
  rate: number;
  type: "output" | "input";
  glAccount: string;
  active: boolean;
};

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  summary: string;
};

export const financeDashboardKpis = [
  { label: "Cash Balance", value: formatBdt(8_640_000), sub: "All bank accounts", up: true },
  { label: "AR Outstanding", value: formatBdt(5_420_000), sub: "18 open invoices" },
  { label: "AP Outstanding", value: formatBdt(3_180_000), sub: "12 open bills" },
  { label: "Revenue MTD", value: formatBdt(42_800_000), sub: "+11.2% vs May", up: true },
];

export const plSnapshotData = [
  { month: "Jan", revenue: 32, expense: 24 },
  { month: "Feb", revenue: 34, expense: 25 },
  { month: "Mar", revenue: 36, expense: 26 },
  { month: "Apr", revenue: 38, expense: 27 },
  { month: "May", revenue: 40, expense: 28 },
  { month: "Jun", revenue: 43, expense: 29 },
];

export const arAgingBuckets = [
  { bucket: "Current", amount: 2_840_000 },
  { bucket: "1–30 days", amount: 1_420_000 },
  { bucket: "31–60 days", amount: 680_000 },
  { bucket: "61–90 days", amount: 320_000 },
  { bucket: "90+ days", amount: 160_000 },
];

export const apAgingBuckets = [
  { bucket: "Current", amount: 1_920_000 },
  { bucket: "1–30 days", amount: 840_000 },
  { bucket: "31–60 days", amount: 280_000 },
  { bucket: "61–90 days", amount: 100_000 },
  { bucket: "90+ days", amount: 40_000 },
];

export type GlLine = {
  date: string;
  ref: string;
  description: string;
  debit: number;
  credit: number;
};

export type CoaTemplate = "retail" | "services" | "manufacturing";

const coaRetail: CoaAccount[] = [
  { id: "1", code: "1000", name: "Assets", type: "asset", balance: 0, active: true },
  { id: "1-1", code: "1100", name: "Cash & Bank", type: "asset", parentId: "1", balance: 8_640_000, active: true },
  { id: "1-1-1", code: "1110", name: "Petty Cash", type: "asset", parentId: "1-1", balance: 45_000, active: true },
  { id: "1-1-2", code: "1120", name: "Dhaka Bank ···4821", type: "asset", parentId: "1-1", balance: 4_820_000, active: true },
  { id: "1-1-3", code: "1130", name: "BRAC Bank ···7733", type: "asset", parentId: "1-1", balance: 2_640_000, active: true },
  { id: "1-1-4", code: "1140", name: "Dutch-Bangla ···1190", type: "asset", parentId: "1-1", balance: 1_135_000, active: true },
  { id: "1-2", code: "1200", name: "Accounts Receivable", type: "asset", parentId: "1", balance: 5_420_000, active: true },
  { id: "1-3", code: "1250", name: "Input VAT Receivable", type: "asset", parentId: "1", balance: 410_000, active: true },
  { id: "1-4", code: "1300", name: "Inventory", type: "asset", parentId: "1", balance: 12_400_000, active: true },
  { id: "1-5", code: "1400", name: "Prepaid Expenses", type: "asset", parentId: "1", balance: 280_000, active: true },
  { id: "1-6", code: "1500", name: "Fixed Assets", type: "asset", parentId: "1", balance: 6_200_000, active: true },
  { id: "1-6-1", code: "1510", name: "Accumulated Depreciation", type: "asset", parentId: "1-6", balance: -1_240_000, active: true },
  { id: "2", code: "2000", name: "Liabilities", type: "liability", balance: 0, active: true },
  { id: "2-1", code: "2100", name: "Accounts Payable", type: "liability", parentId: "2", balance: 3_180_000, active: true },
  { id: "2-2", code: "2200", name: "VAT Payable", type: "liability", parentId: "2", balance: 620_000, active: true },
  { id: "2-3", code: "2300", name: "Accrued Expenses", type: "liability", parentId: "2", balance: 185_000, active: true },
  { id: "2-4", code: "2400", name: "Short-term Loan", type: "liability", parentId: "2", balance: 2_000_000, active: true },
  { id: "3", code: "3000", name: "Equity", type: "equity", balance: 0, active: true },
  { id: "3-1", code: "3100", name: "Share Capital", type: "equity", parentId: "3", balance: 10_000_000, active: true },
  { id: "3-2", code: "3200", name: "Retained Earnings", type: "equity", parentId: "3", balance: 8_200_000, active: true },
  { id: "3-3", code: "3300", name: "Current Year Earnings", type: "equity", parentId: "3", balance: 4_800_000, active: true },
  { id: "4", code: "4000", name: "Revenue", type: "revenue", balance: 0, active: true },
  { id: "4-1", code: "4100", name: "Sales Revenue", type: "revenue", parentId: "4", balance: 40_200_000, active: true },
  { id: "4-2", code: "4200", name: "Service Revenue", type: "revenue", parentId: "4", balance: 1_800_000, active: true },
  { id: "4-3", code: "4300", name: "Other Income", type: "revenue", parentId: "4", balance: 800_000, active: true },
  { id: "5", code: "5000", name: "Expenses", type: "expense", balance: 0, active: true },
  { id: "5-1", code: "5100", name: "Cost of Goods Sold", type: "expense", parentId: "5", balance: 24_600_000, active: true },
  { id: "5-2", code: "5200", name: "Salaries & Wages", type: "expense", parentId: "5", balance: 2_400_000, active: true },
  { id: "5-3", code: "5300", name: "Rent Expense", type: "expense", parentId: "5", balance: 720_000, active: true },
  { id: "5-4", code: "5400", name: "Utilities", type: "expense", parentId: "5", balance: 380_000, active: true },
  { id: "5-5", code: "5500", name: "Marketing", type: "expense", parentId: "5", balance: 560_000, active: true },
  { id: "5-6", code: "5600", name: "Depreciation", type: "expense", parentId: "5", balance: 420_000, active: true },
  { id: "5-7", code: "5700", name: "Bank Charges", type: "expense", parentId: "5", balance: 85_000, active: true },
  { id: "5-8", code: "5800", name: "Professional Fees", type: "expense", parentId: "5", balance: 235_000, active: true },
];

const coaServicesExtra: CoaAccount[] = [
  { id: "1-7", code: "1350", name: "Unbilled Revenue", type: "asset", parentId: "1", balance: 620_000, active: true },
  { id: "5-9", code: "5900", name: "Contractor Costs", type: "expense", parentId: "5", balance: 1_120_000, active: true },
];

const coaManufacturingExtra: CoaAccount[] = [
  { id: "1-4-r", code: "1310", name: "Raw Materials", type: "asset", parentId: "1", balance: 4_800_000, active: true },
  { id: "1-4-w", code: "1320", name: "Work in Progress", type: "asset", parentId: "1", balance: 2_100_000, active: true },
  { id: "1-4-f", code: "1330", name: "Finished Goods", type: "asset", parentId: "1", balance: 5_500_000, active: true },
  { id: "5-10", code: "5150", name: "Manufacturing Overhead", type: "expense", parentId: "5", balance: 1_850_000, active: true },
];

export function getCoaByTemplate(template: CoaTemplate): CoaAccount[] {
  if (template === "services") return [...coaRetail, ...coaServicesExtra];
  if (template === "manufacturing") {
    const withoutInventory = coaRetail.filter((a) => a.id !== "1-4");
    return [...withoutInventory, ...coaManufacturingExtra];
  }
  return coaRetail;
}

export const coaSeed: CoaAccount[] = coaRetail;

export function getPostableAccounts(accounts: CoaAccount[]): CoaAccount[] {
  const parentIds = new Set(accounts.filter((a) => a.parentId).map((a) => a.parentId));
  return accounts.filter((a) => !parentIds.has(a.id) && a.active);
}

export const coaGlLinesByCode: Record<string, GlLine[]> = {
  "1200": [
    { date: "2026-06-18", ref: "INV/2026/0042", description: "Metro Retail invoice", debit: 890_000, credit: 0 },
    { date: "2026-06-15", ref: "INV/2026/0041", description: "GreenMart invoice", debit: 420_000, credit: 0 },
    { date: "2026-06-12", ref: "RC/2026/0120", description: "Partial receipt", debit: 0, credit: 300_000 },
  ],
  "4100": [
    { date: "2026-06-18", ref: "JE/2026/0011", description: "Sales recognition", debit: 0, credit: 120_000 },
    { date: "2026-06-15", ref: "INV/2026/0042", description: "Metro Retail sale", debit: 0, credit: 890_000 },
  ],
  "1100": [
    { date: "2026-06-18", ref: "RC/2026/0119", description: "Customer payment", debit: 500_000, credit: 0 },
    { date: "2026-06-17", ref: "PAY/2026/0094", description: "Vendor payment", debit: 0, credit: 200_000 },
  ],
  "2100": [
    { date: "2026-06-14", ref: "BILL/2026/0082", description: "BRAC IT bill", debit: 0, credit: 120_000 },
    { date: "2026-06-10", ref: "PAY/2026/0094", description: "Payment to vendor", debit: 200_000, credit: 0 },
  ],
  "5100": [
    { date: "2026-06-16", ref: "JE/2026/0009", description: "COGS adjustment", debit: 85_000, credit: 0 },
    { date: "2026-06-10", ref: "INV/2026/0039", description: "Shipment COGS", debit: 240_000, credit: 0 },
  ],
};

const jeLines = (d: number, c: number): JournalLine[] => [
  { accountCode: "1200", accountName: "Accounts Receivable", debit: d, credit: 0 },
  { accountCode: "4100", accountName: "Sales Revenue", debit: 0, credit: c },
];

export const journalEntriesSeed: JournalEntry[] = Array.from({ length: 12 }, (_, i) => {
  const amt = 120_000 + i * 15_000;
  const types: JournalType[] = ["SAL", "PUR", "BNK", "MISC", "INV", "PAY"];
  const statuses: JournalStatus[] = i < 2 ? ["draft"] : i === 11 ? ["reversed"] : ["posted"];
  return {
    id: `je-${i + 1}`,
    number: `JE/2026/${String(i + 1).padStart(4, "0")}`,
    type: types[i % types.length],
    date: `2026-06-${String(Math.min(i + 1, 28)).padStart(2, "0")}`,
    reference: `REF-${1000 + i}`,
    description: `Journal entry ${i + 1} — prototype`,
    debitTotal: amt,
    creditTotal: amt,
    status: statuses[i % statuses.length] ?? "posted",
    source: i % 2 === 0 ? "Sales" : "Manual",
    lines: jeLines(amt, amt),
  };
});

export const arInvoiceLinesById: Record<string, InvoiceLine[]> = {
  "ar-1": [
    { description: "Premium Widget Pack × 100", qty: 100, unitPrice: 6_500, amount: 650_000 },
    { description: "Standard Widget × 80", qty: 80, unitPrice: 3_000, amount: 240_000 },
  ],
  "ar-2": [
    { description: "Retail display units × 42", qty: 42, unitPrice: 10_000, amount: 420_000 },
  ],
  "ar-3": [
    { description: "Seasonal apparel bulk order", qty: 1, unitPrice: 1_356_522, amount: 1_356_522 },
    { description: "VAT 15%", qty: 1, unitPrice: 203_478, amount: 203_478 },
  ],
  "ar-4": [
    { description: "IT hardware bundle", qty: 5, unitPrice: 130_000, amount: 650_000 },
  ],
  "ar-5": [
    { description: "Medical supplies — batch A", qty: 200, unitPrice: 3_800, amount: 760_000 },
    { description: "Medical supplies — batch B", qty: 40, unitPrice: 4_000, amount: 160_000 },
  ],
};

export const arPaymentHistoryById: Record<string, PaymentAllocation[]> = {
  "ar-2": [
    { date: "2026-06-12", receiptNumber: "RC/2026/0120", amount: 300_000, method: "Bank Transfer" },
  ],
};

export const arActivityById: Record<string, DocActivity[]> = {
  "ar-1": [
    { timestamp: "2026-06-01 10:00", user: "Sadia Akter", action: "CREATE", detail: "Invoice posted ৳890K" },
    { timestamp: "2026-06-05 14:30", user: "System", action: "REMINDER", detail: "Payment reminder scheduled" },
  ],
  "ar-2": [
    { timestamp: "2026-05-15 09:00", user: "Karim Hassan", action: "CREATE", detail: "Invoice posted ৳420K" },
    { timestamp: "2026-06-12 11:15", user: "Finance Bot", action: "RECEIPT", detail: "Partial receipt RC/2026/0120 — ৳300K" },
  ],
  "ar-3": [
    { timestamp: "2026-04-20 16:00", user: "Sadia Akter", action: "CREATE", detail: "Invoice posted ৳1.56M" },
    { timestamp: "2026-05-25 09:00", user: "System", action: "OVERDUE", detail: "Marked overdue — 60 days" },
  ],
};

export function computeArKpis(invoices: ArInvoice[]) {
  const open = invoices.filter((i) => i.status !== "paid");
  const totalAr = open.reduce((s, i) => s + i.residual, 0);
  const overdue = open.filter((i) => i.status === "overdue");
  const overdueAmt = overdue.reduce((s, i) => s + i.residual, 0);
  const dueThisWeek = open.filter((i) => {
    const due = new Date(i.dueDate);
    const now = new Date("2026-06-19");
    const week = new Date("2026-06-26");
    return due >= now && due <= week;
  });
  const overdueDays = overdue.map((i) => {
    const due = new Date(i.dueDate);
    return Math.max(0, Math.floor((new Date("2026-06-19").getTime() - due.getTime()) / 86400000));
  });
  const avgOverdue = overdueDays.length ? Math.round(overdueDays.reduce((a, b) => a + b, 0) / overdueDays.length) : 0;
  return { totalAr, overdueCount: overdue.length, overdueAmt, dueThisWeekCount: dueThisWeek.length, avgOverdue };
}

export const apBillLinesById: Record<string, BillLine[]> = {
  "ap-1": [
    { description: "Cotton fabric roll × 500m", qty: 500, unitPrice: 900, amount: 450_000 },
    { description: "Dye & finishing", qty: 1, unitPrice: 90_000, amount: 90_000 },
  ],
  "ap-2": [
    { description: "Freight — Dhaka to Chittagong", qty: 3, unitPrice: 28_333, amount: 85_000 },
  ],
  "ap-3": [
    { description: "Monthly IT support retainer", qty: 1, unitPrice: 120_000, amount: 120_000 },
  ],
  "ap-4": [
    { description: "Corrugated boxes — bulk", qty: 2000, unitPrice: 105, amount: 210_000 },
  ],
};

export const apMatchDetailsById: Record<string, ApMatchDetail> = {
  "ap-1": { poNumber: "PO/2026/0440", grnNumber: "GRN/2026/0312", poAmount: 540_000, grnAmount: 540_000, billAmount: 540_000, variance: 0 },
  "ap-2": { poNumber: "PO/2026/0398", grnNumber: "GRN/2026/0288", poAmount: 90_000, grnAmount: 85_000, billAmount: 85_000, variance: -5_000 },
  "ap-4": { poNumber: "—", grnNumber: "—", poAmount: 0, grnAmount: 0, billAmount: 210_000, variance: 210_000 },
};

export const apPaymentScheduleById: Record<string, ApPaymentScheduleItem[]> = {
  "ap-1": [{ dueDate: "2026-07-05", amount: 540_000, status: "scheduled" }],
  "ap-2": [{ dueDate: "2026-06-19", amount: 85_000, status: "overdue" }],
  "ap-3": [{ dueDate: "2026-06-14", amount: 120_000, status: "paid" }],
  "ap-4": [{ dueDate: "2026-05-15", amount: 210_000, status: "overdue" }],
};

export const apActivityById: Record<string, DocActivity[]> = {
  "ap-1": [
    { timestamp: "2026-06-05 11:00", user: "Karim Hassan", action: "CREATE", detail: "Bill posted — 3-way match OK" },
  ],
  "ap-4": [
    { timestamp: "2026-04-15 09:30", user: "Sadia Akter", action: "CREATE", detail: "Bill posted — no PO match" },
    { timestamp: "2026-05-16 08:00", user: "System", action: "OVERDUE", detail: "Payment overdue" },
  ],
};

export function computeApKpis(bills: ApBill[]) {
  const open = bills.filter((b) => b.status !== "paid");
  const totalAp = open.reduce((s, b) => s + b.residual, 0);
  const overdue = open.filter((b) => b.status === "overdue");
  const overdueAmt = overdue.reduce((s, b) => s + b.residual, 0);
  const unmatched = open.filter((b) => b.matchStatus === "unmatched");
  const dueThisWeek = open.filter((b) => {
    const due = new Date(b.dueDate);
    const now = new Date("2026-06-19");
    const week = new Date("2026-06-26");
    return due >= now && due <= week;
  });
  return { totalAp, overdueCount: overdue.length, overdueAmt, unmatchedCount: unmatched.length, dueThisWeekCount: dueThisWeek.length };
}

export const bankStatementsSeed: BankStatement[] = [
  { id: "bs-1", bankAccountId: "ba-1", date: "2026-06-18", description: "Customer payment — Metro Retail", amount: 500_000, matched: true, matchedToId: "st-1" },
  { id: "bs-2", bankAccountId: "ba-2", date: "2026-06-17", description: "Vendor payment — Global Fabrics", amount: -200_000, matched: true, matchedToId: "st-3" },
  { id: "bs-3", bankAccountId: "ba-1", date: "2026-06-16", description: "Bank charges", amount: -850, matched: false },
  { id: "bs-4", bankAccountId: "ba-1", date: "2026-06-15", description: "Salary disbursement", amount: -1_240_000, matched: true, matchedToId: "st-4" },
  { id: "bs-5", bankAccountId: "ba-1", date: "2026-06-14", description: "Customer transfer — GreenMart", amount: 300_000, matched: false },
  { id: "bs-6", bankAccountId: "ba-3", date: "2026-06-17", description: "Utility payment", amount: -45_000, matched: false },
  { id: "bs-7", bankAccountId: "ba-3", date: "2026-06-16", description: "POS settlement", amount: 128_000, matched: false },
];

export const bankSystemTransactionsSeed: SystemTransaction[] = [
  { id: "st-1", bankAccountId: "ba-1", date: "2026-06-18", description: "Receipt — Metro Retail Ltd", amount: 500_000, type: "receipt", ref: "RC/2026/0119", matched: true, matchedToId: "bs-1" },
  { id: "st-2", bankAccountId: "ba-1", date: "2026-06-14", description: "Receipt — GreenMart Superstores", amount: 300_000, type: "receipt", ref: "RC/2026/0120", matched: false },
  { id: "st-3", bankAccountId: "ba-2", date: "2026-06-17", description: "Payment — Global Fabrics Co", amount: -200_000, type: "payment", ref: "PAY/2026/0094", matched: true, matchedToId: "bs-2" },
  { id: "st-4", bankAccountId: "ba-1", date: "2026-06-15", description: "Journal — Salary accrual", amount: -1_240_000, type: "journal", ref: "JE/2026/0008", matched: true, matchedToId: "bs-4" },
  { id: "st-5", bankAccountId: "ba-1", date: "2026-06-16", description: "Journal — Bank charges", amount: -850, type: "journal", ref: "JE/2026/0010", matched: false },
  { id: "st-6", bankAccountId: "ba-3", date: "2026-06-16", description: "POS settlement batch", amount: 128_000, type: "receipt", ref: "RC/2026/0121", matched: false },
  { id: "st-7", bankAccountId: "ba-3", date: "2026-06-17", description: "Payment — DESCO utility", amount: -45_000, type: "payment", ref: "PAY/2026/0096", matched: false },
];

export const arInvoicesSeed: ArInvoice[] = [
  { id: "ar-1", number: "INV/2026/0042", customer: "Metro Retail Ltd", date: "2026-06-01", dueDate: "2026-06-30", total: 890_000, residual: 890_000, status: "posted", aging: "current" },
  { id: "ar-2", number: "INV/2026/0041", customer: "GreenMart Superstores", date: "2026-05-15", dueDate: "2026-06-14", total: 420_000, residual: 120_000, status: "partial", aging: "30" },
  { id: "ar-3", number: "INV/2026/0038", customer: "UrbanWear Retail", date: "2026-04-20", dueDate: "2026-05-20", total: 1_560_000, residual: 1_560_000, status: "overdue", aging: "60" },
  { id: "ar-4", number: "INV/2026/0035", customer: "TechHub Ltd", date: "2026-03-10", dueDate: "2026-04-10", total: 650_000, residual: 650_000, status: "overdue", aging: "90+" },
  { id: "ar-5", number: "INV/2026/0043", customer: "MediCare Supplies", date: "2026-06-10", dueDate: "2026-07-10", total: 920_000, residual: 920_000, status: "posted", aging: "current" },
  ...([
    ["Star Fashion House", "posted", "current", 1, 0],
    ["Dhaka Electronics", "posted", "current", 1, 1],
    ["Bengal Traders Ltd", "partial", "30", 0.4, 2],
    ["Fresh Foods International", "overdue", "60", 1, 3],
    ["StyleMart BD", "overdue", "90+", 1, 4],
    ["Office Plus", "paid", "current", 0, 5],
    ["BuildRight Supplies", "posted", "current", 1, 6],
    ["SmartPhone Hub", "partial", "30", 0.55, 7],
    ["Elite Home Decor", "posted", "current", 1, 8],
    ["City Pharma", "overdue", "60", 1, 9],
    ["North South Logistics", "posted", "current", 1, 10],
    ["Prime Distributors", "partial", "30", 0.25, 11],
    ["Royal Textiles", "overdue", "90+", 1, 12],
    ["AutoParts BD", "posted", "current", 1, 13],
    ["Sunrise Cafe Chain", "paid", "current", 0, 14],
  ] as const).map(([customer, status, aging, residualRatio, i]) => {
    const idx = i + 6;
    const total = 275_000 + i * 83_000;
    const residual = Math.round(total * residualRatio);
    const month = String(Math.max(3, 6 - Math.floor(i / 3))).padStart(2, "0");
    const day = String(Math.min(28, 5 + i * 2)).padStart(2, "0");
    const dueDay = String(Math.min(28, 10 + i * 2)).padStart(2, "0");
    return {
      id: `ar-${idx}`,
      number: `INV/2026/${String(44 - i).padStart(4, "0")}`,
      customer,
      date: `2026-${month}-${day}`,
      dueDate: `2026-${String(Number(month) + 1).padStart(2, "0")}-${dueDay}`,
      total,
      residual,
      status: status as DocStatus,
      aging: aging as ArInvoice["aging"],
    };
  }),
];

export const apBillsSeed: ApBill[] = [
  { id: "ap-1", number: "BILL/2026/0088", vendor: "Global Fabrics Co", billDate: "2026-06-05", dueDate: "2026-07-05", total: 540_000, residual: 540_000, matchStatus: "matched", status: "posted" },
  { id: "ap-2", number: "BILL/2026/0085", vendor: "Dhaka Logistics", billDate: "2026-05-20", dueDate: "2026-06-19", total: 85_000, residual: 85_000, matchStatus: "partial", status: "overdue" },
  { id: "ap-3", number: "BILL/2026/0082", vendor: "BRAC IT Services", billDate: "2026-06-01", dueDate: "2026-06-30", total: 120_000, residual: 0, matchStatus: "matched", status: "paid" },
  { id: "ap-4", number: "BILL/2026/0079", vendor: "Packaging World", billDate: "2026-04-15", dueDate: "2026-05-15", total: 210_000, residual: 210_000, matchStatus: "unmatched", status: "overdue" },
  ...([
    ["DESCO Utility", "matched", "posted", 1, 0],
    ["Square Pharmaceuticals", "matched", "posted", 1, 1],
    ["Transcom Logistics", "partial", "overdue", 1, 2],
    ["Apex Footwear", "unmatched", "overdue", 1, 3],
    ["Summit Power", "matched", "paid", 0, 4],
    ["Walton Hi-Tech", "matched", "posted", 1, 5],
    ["Akij Group Supplies", "partial", "posted", 1, 6],
    ["Pran-RFL Distributors", "matched", "overdue", 1, 7],
    ["Bengal Cement", "unmatched", "posted", 1, 8],
    ["City Bank Services", "matched", "posted", 1, 9],
    ["Metro Packaging", "partial", "overdue", 1, 10],
  ] as const).map(([vendor, matchStatus, status, residualRatio, i]) => {
    const idx = i + 5;
    const total = 95_000 + i * 62_000;
    const residual = Math.round(total * residualRatio);
    const month = String(Math.max(4, 6 - Math.floor(i / 2))).padStart(2, "0");
    const day = String(Math.min(28, 8 + i)).padStart(2, "0");
    return {
      id: `ap-${idx}`,
      number: `BILL/2026/${String(87 - i).padStart(4, "0")}`,
      vendor,
      billDate: `2026-${month}-${day}`,
      dueDate: `2026-${String(Math.min(7, Number(month) + 1)).padStart(2, "0")}-${String(Math.min(28, 15 + i)).padStart(2, "0")}`,
      total,
      residual,
      matchStatus: matchStatus as ApBill["matchStatus"],
      status: status as DocStatus,
    };
  }),
];

export function getArInvoiceLines(invoice: ArInvoice): InvoiceLine[] {
  return (
    arInvoiceLinesById[invoice.id] ?? [
      {
        description: `${invoice.customer} — invoice line items`,
        qty: 1,
        unitPrice: invoice.total,
        amount: invoice.total,
      },
    ]
  );
}

export function getApBillLines(bill: ApBill): BillLine[] {
  return (
    apBillLinesById[bill.id] ?? [
      {
        description: `${bill.vendor} — bill line items`,
        qty: 1,
        unitPrice: bill.total,
        amount: bill.total,
      },
    ]
  );
}

export const receiptsSeed: Receipt[] = [
  { id: "rc-1", number: "RC/2026/0120", customer: "GreenMart Superstores", date: "2026-06-12", amount: 300_000, method: "Bank Transfer", allocatedTo: "INV/2026/0041", status: "posted" },
  { id: "rc-2", number: "RC/2026/0119", customer: "Metro Retail Ltd", date: "2026-06-08", amount: 500_000, method: "Cheque", allocatedTo: "INV/2026/0039", status: "reconciled" },
];

export const paymentsSeed: Payment[] = [
  { id: "py-1", number: "PAY/2026/0095", vendor: "BRAC IT Services", date: "2026-06-14", amount: 120_000, bankAccount: "Dhaka Bank ···4821", allocatedTo: "BILL/2026/0082", status: "reconciled" },
  { id: "py-2", number: "PAY/2026/0094", vendor: "Global Fabrics Co", date: "2026-06-10", amount: 200_000, bankAccount: "BRAC Bank ···7733", allocatedTo: "BILL/2026/0088", status: "posted" },
];

export const expensesSeed: ExpenseClaim[] = [
  { id: "ex-1", number: "EXP/2026/0044", employee: "Karim Hassan", date: "2026-06-15", amount: 12_500, category: "Travel", status: "submitted", approver: "Farhana Rahman" },
  { id: "ex-2", number: "EXP/2026/0043", employee: "Sadia Akter", date: "2026-06-10", amount: 8_200, category: "Meals", status: "approved", approver: "Farhana Rahman" },
  { id: "ex-3", number: "EXP/2026/0042", employee: "Nadia Chowdhury", date: "2026-06-05", amount: 24_000, category: "Office Supplies", status: "reimbursed", approver: "Finance Bot" },
  { id: "ex-4", number: "EXP/2026/0045", employee: "Rahim Uddin", date: "2026-06-18", amount: 6_800, category: "Travel", status: "draft", approver: "Farhana Rahman" },
];

export const expenseLinesById: Record<string, ExpenseLine[]> = {
  "ex-1": [
    { description: "Dhaka–Chittagong train", amount: 8_500, receiptName: "receipt-train.pdf", date: "2026-06-14" },
    { description: "Client lunch", amount: 4_000, receiptName: "receipt-lunch.jpg", date: "2026-06-14" },
  ],
  "ex-2": [
    { description: "Team dinner — project kickoff", amount: 8_200, receiptName: "receipt-dinner.pdf", date: "2026-06-09" },
  ],
  "ex-3": [
    { description: "Printer cartridges × 4", amount: 14_000, receiptName: "invoice-office.pdf", date: "2026-06-04" },
    { description: "Stationery bundle", amount: 10_000, receiptName: "receipt-stationery.jpg", date: "2026-06-04" },
  ],
  "ex-4": [
    { description: "Uber — client visit", amount: 6_800, receiptName: "uber-receipt.pdf", date: "2026-06-17" },
  ],
};

export const expenseApprovalFlowById: Record<string, ExpenseApprovalStep[]> = {
  "ex-1": [
    { step: "Submitted", user: "Karim Hassan", timestamp: "2026-06-15 10:00", status: "completed" },
    { step: "Manager approval", user: "Farhana Rahman", timestamp: "—", status: "current" },
    { step: "Finance post", user: "Finance Bot", timestamp: "—", status: "pending" },
    { step: "Reimbursed", user: "Payroll", timestamp: "—", status: "pending" },
  ],
  "ex-2": [
    { step: "Submitted", user: "Sadia Akter", timestamp: "2026-06-10 09:30", status: "completed" },
    { step: "Manager approval", user: "Farhana Rahman", timestamp: "2026-06-10 14:00", status: "completed" },
    { step: "Finance post", user: "Finance Bot", timestamp: "—", status: "current" },
    { step: "Reimbursed", user: "Payroll", timestamp: "—", status: "pending" },
  ],
};

export const batchPayableBillsSeed: ApBill[] = apBillsSeed.filter((b) => b.residual > 0 && b.status !== "paid");

export const taxRulesSeed: TaxRule[] = [
  { id: "tr-1", name: "Standard sales VAT", appliesTo: "Sales invoices", rateName: "Standard VAT 15%", condition: "Taxable goods & services", active: true },
  { id: "tr-2", name: "Import input VAT", appliesTo: "Purchase bills", rateName: "Input VAT 15%", condition: "Valid BIN + customs doc", active: true },
  { id: "tr-3", name: "Export zero-rated", appliesTo: "Export invoices", rateName: "Zero Rated 0%", condition: "Export LC / shipping proof", active: true },
  { id: "tr-4", name: "Exempt healthcare", appliesTo: "Medical supplies", rateName: "Exempt 0%", condition: "NBR exempt list", active: false },
];

export const taxReturnsSeed: TaxReturn[] = [
  { id: "trn-1", period: "May 2026", grossSales: 38_400_000, outputTax: 576_000, inputTax: 382_000, netPayable: 194_000, status: "paid" },
  { id: "trn-2", period: "Jun 2026", grossSales: 42_800_000, outputTax: 620_000, inputTax: 410_000, netPayable: 210_000, status: "draft" },
];

export const taxFilingSeed: TaxFilingRecord[] = [
  { id: "tf-1", period: "May 2026", dueDate: "2026-06-15", filedDate: "2026-06-12", status: "filed" },
  { id: "tf-2", period: "Jun 2026", dueDate: "2026-07-15", status: "pending" },
  { id: "tf-3", period: "Apr 2026", dueDate: "2026-05-15", status: "filed", filedDate: "2026-05-10" },
];

export const financeReportPreviews: Record<string, ReportPreview> = {
  pl: {
    title: "Profit & Loss — Jun 2026",
    rows: [
      { label: "Sales Revenue", amount: 40_200_000 },
      { label: "Service Revenue", amount: 1_800_000 },
      { label: "Other Income", amount: 800_000 },
      { label: "Cost of Goods Sold", amount: -24_600_000, indent: true },
      { label: "Salaries & Wages", amount: -2_400_000, indent: true },
      { label: "Operating Expenses", amount: -1_735_000, indent: true },
    ],
    totals: [
      { label: "Gross Profit", amount: 17_400_000 },
      { label: "Net Profit", amount: 13_265_000 },
    ],
  },
  bs: {
    title: "Balance Sheet — As of 19 Jun 2026",
    rows: [
      { label: "Cash & Bank", amount: 8_640_000 },
      { label: "Accounts Receivable", amount: 5_420_000 },
      { label: "Inventory", amount: 12_400_000 },
      { label: "Accounts Payable", amount: -3_180_000, indent: true },
      { label: "VAT Payable", amount: -620_000, indent: true },
      { label: "Retained Earnings", amount: 18_200_000, indent: true },
    ],
    totals: [{ label: "Total Assets", amount: 26_460_000 }],
  },
  tb: {
    title: "Trial Balance — Jun 2026",
    rows: [
      { label: "1100 Cash & Bank", amount: 8_640_000 },
      { label: "1200 Accounts Receivable", amount: 5_420_000 },
      { label: "2100 Accounts Payable", amount: -3_180_000 },
      { label: "4100 Sales Revenue", amount: -40_200_000 },
      { label: "5100 Cost of Goods Sold", amount: 24_600_000 },
    ],
    totals: [{ label: "Debit/Credit balance", amount: 0 }],
  },
  "ar-aging": {
    title: "AR Aging — 19 Jun 2026",
    rows: [
      { label: "Current", amount: 2_840_000 },
      { label: "1–30 days", amount: 1_420_000 },
      { label: "31–60 days", amount: 680_000 },
      { label: "61–90 days", amount: 320_000 },
      { label: "90+ days", amount: 160_000 },
    ],
    totals: [{ label: "Total outstanding", amount: 5_420_000 }],
  },
};

export const bankAccountsSeed: BankAccount[] = [
  { id: "ba-1", bank: "Dhaka Bank", accountNo: "···4821", glBalance: 4_820_000, statementBalance: 4_795_000, unreconciled: 2 },
  { id: "ba-2", bank: "BRAC Bank", accountNo: "···7733", glBalance: 2_640_000, statementBalance: 2_640_000, unreconciled: 0 },
  { id: "ba-3", bank: "Dutch-Bangla Bank", accountNo: "···1190", glBalance: 1_180_000, statementBalance: 1_160_000, unreconciled: 2 },
];

export const taxRatesSeed: TaxRate[] = [
  { id: "tx-1", name: "Standard VAT", rate: 15, type: "output", glAccount: "2200", active: true },
  { id: "tx-2", name: "Reduced VAT", rate: 5, type: "output", glAccount: "2200", active: true },
  { id: "tx-3", name: "Input VAT", rate: 15, type: "input", glAccount: "1250", active: true },
  { id: "tx-4", name: "Zero Rated", rate: 0, type: "output", glAccount: "2200", active: true },
  { id: "tx-5", name: "Exempt", rate: 0, type: "output", glAccount: "2200", active: false },
];

export const financeReportsCatalog = [
  { id: "pl", title: "Profit & Loss", description: "Income and expenses for the period" },
  { id: "bs", title: "Balance Sheet", description: "Assets, liabilities, and equity" },
  { id: "tb", title: "Trial Balance", description: "All accounts with debit/credit totals" },
  { id: "cf", title: "Cash Flow", description: "Operating, investing, financing flows" },
  { id: "ar-aging", title: "AR Aging", description: "Receivables by aging bucket" },
  { id: "ap-aging", title: "AP Aging", description: "Payables by aging bucket" },
  { id: "gl", title: "General Ledger", description: "Account-level transaction detail" },
  { id: "revenue", title: "Revenue Report", description: "Revenue by category and channel" },
];

export type ChequeInstrument = {
  id: string;
  chequeNumber: string;
  direction: ChequeDirection;
  party: string;
  bank: string;
  bankAccountId?: string;
  amount: number;
  issueDate: string;
  maturityDate: string;
  linkedDoc: string;
  linkedDocType: "AR Invoice" | "AP Bill" | "Receipt" | "Payment";
  status: ChequeStatus;
  notes?: string;
};

export const chequesSeed: ChequeInstrument[] = [
  {
    id: "ch-1",
    chequeNumber: "452101",
    direction: "received",
    party: "Metro Retail Ltd",
    bank: "Dhaka Bank",
    bankAccountId: "ba-1",
    amount: 500_000,
    issueDate: "2026-06-08",
    maturityDate: "2026-07-08",
    linkedDoc: "INV/2026/0039",
    linkedDocType: "AR Invoice",
    status: "cleared",
    notes: "Cleared via RC/2026/0119",
  },
  {
    id: "ch-2",
    chequeNumber: "887234",
    direction: "received",
    party: "UrbanWear Retail",
    bank: "BRAC Bank",
    bankAccountId: "ba-2",
    amount: 780_000,
    issueDate: "2026-06-01",
    maturityDate: "2026-06-25",
    linkedDoc: "INV/2026/0038",
    linkedDocType: "AR Invoice",
    status: "issued",
    notes: "PDC — deposit on maturity",
  },
  {
    id: "ch-3",
    chequeNumber: "223411",
    direction: "received",
    party: "GreenMart Superstores",
    bank: "Dutch-Bangla Bank",
    bankAccountId: "ba-3",
    amount: 200_000,
    issueDate: "2026-06-10",
    maturityDate: "2026-06-20",
    linkedDoc: "INV/2026/0041",
    linkedDocType: "AR Invoice",
    status: "deposited",
  },
  {
    id: "ch-4",
    chequeNumber: "334522",
    direction: "received",
    party: "MediCare Supplies",
    bank: "Dhaka Bank",
    bankAccountId: "ba-1",
    amount: 460_000,
    issueDate: "2026-06-12",
    maturityDate: "2026-06-22",
    linkedDoc: "INV/2026/0043",
    linkedDocType: "AR Invoice",
    status: "issued",
  },
  {
    id: "ch-5",
    chequeNumber: "112890",
    direction: "received",
    party: "TechHub Ltd",
    bank: "City Bank",
    amount: 650_000,
    issueDate: "2026-03-05",
    maturityDate: "2026-04-05",
    linkedDoc: "INV/2026/0035",
    linkedDocType: "AR Invoice",
    status: "bounced",
    notes: "NSF — re-present pending",
  },
  {
    id: "ch-6",
    chequeNumber: "990012",
    direction: "issued",
    party: "Global Fabrics Co",
    bank: "BRAC Bank",
    bankAccountId: "ba-2",
    amount: 300_000,
    issueDate: "2026-06-05",
    maturityDate: "2026-07-05",
    linkedDoc: "BILL/2026/0088",
    linkedDocType: "AP Bill",
    status: "issued",
    notes: "1st instalment of 2",
  },
  {
    id: "ch-7",
    chequeNumber: "990013",
    direction: "issued",
    party: "Global Fabrics Co",
    bank: "BRAC Bank",
    bankAccountId: "ba-2",
    amount: 240_000,
    issueDate: "2026-06-05",
    maturityDate: "2026-08-05",
    linkedDoc: "BILL/2026/0088",
    linkedDocType: "AP Bill",
    status: "issued",
    notes: "2nd instalment of 2",
  },
  {
    id: "ch-8",
    chequeNumber: "990014",
    direction: "issued",
    party: "Dhaka Logistics",
    bank: "Dhaka Bank",
    bankAccountId: "ba-1",
    amount: 85_000,
    issueDate: "2026-06-01",
    maturityDate: "2026-06-19",
    linkedDoc: "BILL/2026/0085",
    linkedDocType: "AP Bill",
    status: "deposited",
  },
  {
    id: "ch-9",
    chequeNumber: "990015",
    direction: "issued",
    party: "Packaging World",
    bank: "Dhaka Bank",
    bankAccountId: "ba-1",
    amount: 105_000,
    issueDate: "2026-05-01",
    maturityDate: "2026-06-01",
    linkedDoc: "BILL/2026/0079",
    linkedDocType: "AP Bill",
    status: "cleared",
  },
  {
    id: "ch-10",
    chequeNumber: "556677",
    direction: "received",
    party: "Metro Retail Ltd",
    bank: "Dhaka Bank",
    bankAccountId: "ba-1",
    amount: 890_000,
    issueDate: "2026-06-15",
    maturityDate: "2026-06-30",
    linkedDoc: "INV/2026/0042",
    linkedDocType: "AR Invoice",
    status: "issued",
  },
];

export function findArInvoiceByNumber(number: string) {
  return arInvoicesSeed.find((i) => i.number === number);
}

export function findApBillByNumber(number: string) {
  return apBillsSeed.find((b) => b.number === number);
}

export function computeChequeKpis(cheques: ChequeInstrument[]) {
  const today = new Date("2026-06-19");
  const weekEnd = new Date("2026-06-26");

  const isDueThisWeek = (d: string) => {
    const mat = new Date(d);
    return mat >= today && mat <= weekEnd;
  };

  const open = cheques.filter((c) => !["cleared", "cancelled", "bounced"].includes(c.status));
  const receivedDue = open.filter((c) => c.direction === "received" && isDueThisWeek(c.maturityDate));
  const issuedDue = open.filter((c) => c.direction === "issued" && isDueThisWeek(c.maturityDate));
  const pendingDeposit = cheques.filter(
    (c) => c.direction === "received" && c.status === "issued" && new Date(c.maturityDate) <= today
  );
  const bounced = cheques.filter((c) => c.status === "bounced");

  return {
    receivedDueCount: receivedDue.length,
    receivedDueAmt: receivedDue.reduce((s, c) => s + c.amount, 0),
    issuedDueCount: issuedDue.length,
    issuedDueAmt: issuedDue.reduce((s, c) => s + c.amount, 0),
    pendingDepositCount: pendingDeposit.length,
    bouncedCount: bounced.length,
  };
}

export const auditLogSeed: AuditLogEntry[] = [
  { id: "al-1", timestamp: "2026-06-19 09:12", user: "Karim Hassan", action: "POST", entity: "Journal Entry", entityId: "JE/2026/0012", summary: "Draft → Posted" },
  { id: "al-2", timestamp: "2026-06-19 08:45", user: "Sadia Akter", action: "CREATE", entity: "AR Invoice", entityId: "INV/2026/0043", summary: "New invoice ৳920K" },
  { id: "al-3", timestamp: "2026-06-18 16:30", user: "Finance Bot", action: "RECONCILE", entity: "Bank Statement", entityId: "BS-2026-0618", summary: "Matched RC/2026/0119" },
  { id: "al-4", timestamp: "2026-06-18 14:00", user: "Farhana Rahman", action: "APPROVE", entity: "Expense Claim", entityId: "EXP/2026/0043", summary: "Approved ৳8,200" },
];

export const DOC_STATUS_LABELS: Record<DocStatus, string> = {
  draft: "Draft",
  posted: "Posted",
  partial: "Partial",
  paid: "Paid",
  overdue: "Overdue",
  written_off: "Written off",
};

export const JOURNAL_STATUS_LABELS: Record<JournalStatus, string> = {
  draft: "Draft",
  posted: "Posted",
  reversed: "Reversed",
};

export const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
  reimbursed: "Reimbursed",
};

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  asset: "Asset",
  liability: "Liability",
  equity: "Equity",
  revenue: "Revenue",
  expense: "Expense",
};

export const CHEQUE_STATUS_LABELS: Record<ChequeStatus, string> = {
  draft: "Draft",
  issued: "Issued / PDC",
  deposited: "Deposited",
  cleared: "Cleared",
  bounced: "Bounced",
  cancelled: "Cancelled",
};

export const CHEQUE_DIRECTION_LABELS: Record<ChequeDirection, string> = {
  received: "Received",
  issued: "Issued",
};
