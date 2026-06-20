/** Service module mock data — prototype only */

export const SERVICE_OPS_PERIOD = "Jun 2026 · Dispatch week 25";

export function formatBdt(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export type ServiceDashboardKpi = {
  label: string;
  value: string;
  sub: string;
  up?: boolean;
  alert?: boolean;
};

export const serviceDashboardKpis: ServiceDashboardKpi[] = [
  { label: "Open Service Orders", value: "24", sub: "6 unassigned", alert: true },
  { label: "Today's Visits", value: "11", sub: "3 in progress", up: true },
  { label: "SLA at Risk", value: "4", sub: "2 critical", alert: true },
  { label: "AMC Renewals (30d)", value: "7", sub: "৳840K contract value" },
];

export const serviceOrdersByStatus = [
  { status: "Open", count: 8, color: "bg-sky-500" },
  { status: "Assigned", count: 6, color: "bg-indigo-500" },
  { status: "In Progress", count: 7, color: "bg-amber-500" },
  { status: "Completed", count: 42, color: "bg-emerald-500" },
];

export const technicianUtilization = [
  { name: "Rahim Uddin", utilization: 92, jobs: 6 },
  { name: "Karim Hassan", utilization: 78, jobs: 5 },
  { name: "Sadia Akter", utilization: 65, jobs: 4 },
  { name: "Nadia Chowdhury", utilization: 48, jobs: 3 },
  { name: "Farhan Ali", utilization: 35, jobs: 2 },
];

export type TodayScheduleItem = {
  id: string;
  time: string;
  customer: string;
  service: string;
  technician: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "scheduled" | "in_progress" | "done";
};

export const todayScheduleSeed: TodayScheduleItem[] = [
  { id: "sch-1", time: "09:00", customer: "GreenMart Superstores", service: "AC Preventive Maintenance", technician: "Rahim Uddin", priority: "medium", status: "done" },
  { id: "sch-2", time: "10:30", customer: "Metro Retail Ltd", service: "CCTV Camera Install", technician: "Karim Hassan", priority: "high", status: "in_progress" },
  { id: "sch-3", time: "11:00", customer: "TechZone BD", service: "Server Health Check", technician: "Sadia Akter", priority: "critical", status: "in_progress" },
  { id: "sch-4", time: "14:00", customer: "Apex Motors", service: "Vehicle Service — Oil Change", technician: "Farhan Ali", priority: "low", status: "scheduled" },
  { id: "sch-5", time: "15:30", customer: "Digital Hive Agency", service: "Monthly SEO Retainer Visit", technician: "Nadia Chowdhury", priority: "medium", status: "scheduled" },
];

export type AmcRenewalItem = {
  id: string;
  contract: string;
  customer: string;
  asset: string;
  endDate: string;
  value: number;
  daysLeft: number;
};

export const amcRenewalsSeed: AmcRenewalItem[] = [
  { id: "amc-1", contract: "AMC/2025/0041", customer: "GreenMart Superstores", asset: "Central AC Plant", endDate: "2026-07-05", value: 240_000, daysLeft: 14 },
  { id: "amc-2", contract: "AMC/2025/0038", customer: "Metro Retail Ltd", asset: "POS Network (12 terminals)", endDate: "2026-07-12", value: 180_000, daysLeft: 21 },
  { id: "amc-3", contract: "AMC/2025/0055", customer: "Apex Motors", asset: "Workshop Lift Bay", endDate: "2026-06-28", value: 120_000, daysLeft: 7 },
];

export const serviceAiInsights = [
  "Suggest assigning SOV/2026/0088 to Rahim Uddin — AC skill match, 12% capacity free",
  "AMC/2025/0055 renews in 7 days — Apex Motors, ৳120K · send renewal quote",
  "4 orders breaching SLA resolution window today — escalate to dispatch",
];

export const serviceRevenueMtd = [
  { week: "W1", revenue: 420_000, jobs: 18 },
  { week: "W2", revenue: 580_000, jobs: 22 },
  { week: "W3", revenue: 510_000, jobs: 19 },
  { week: "W4", revenue: 640_000, jobs: 26 },
];

export const serviceWeeklyOrders = [
  { day: "Mon", completed: 12, open: 6 },
  { day: "Tue", completed: 15, open: 8 },
  { day: "Wed", completed: 11, open: 5 },
  { day: "Thu", completed: 18, open: 9 },
  { day: "Fri", completed: 16, open: 7 },
  { day: "Sat", completed: 9, open: 4 },
  { day: "Sun", completed: 4, open: 2 },
];

export const serviceTypeBreakdown = [
  { name: "Fixed", value: 38, color: "#6366f1" },
  { name: "Hourly", value: 22, color: "#06b6d4" },
  { name: "Contract", value: 18, color: "#22c55e" },
  { name: "Subscription", value: 12, color: "#f59e0b" },
  { name: "Project", value: 10, color: "#a855f7" },
];

export const SERVICE_PRIORITY_LABELS: Record<TodayScheduleItem["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

// ─── Service Catalog ─────────────────────────────────────────────────────────

export type ServiceBillingType = "fixed" | "hourly" | "project" | "contract" | "subscription";
export type ServiceItemStatus = "active" | "inactive";

export type ServiceCategory = {
  id: string;
  name: string;
};

export type ServiceItem = {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  description: string;
  billingType: ServiceBillingType;
  costPrice: number;
  salePrice: number;
  hourlyRate?: number;
  durationMinutes?: number;
  taxGroup: string;
  skillTags: string[];
  status: ServiceItemStatus;
  updatedAt: string;
};

export const serviceCategoriesSeed: ServiceCategory[] = [
  { id: "sc-it", name: "IT & Computer" },
  { id: "sc-mobile", name: "Mobile Repair" },
  { id: "sc-ac", name: "AC & HVAC" },
  { id: "sc-vehicle", name: "Vehicle Workshop" },
  { id: "sc-cctv", name: "CCTV & Security" },
  { id: "sc-marketing", name: "Digital Marketing" },
  { id: "sc-general", name: "General Maintenance" },
];

export const SERVICE_BILLING_LABELS: Record<ServiceBillingType, string> = {
  fixed: "Fixed",
  hourly: "Hourly",
  project: "Project",
  contract: "Contract",
  subscription: "Subscription",
};

export const SERVICE_ITEM_STATUS_LABELS: Record<ServiceItemStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

const catalogBase: Omit<ServiceItem, "id">[] = [
  { code: "SVC-WIN-INSTALL", name: "Windows Installation", categoryId: "sc-it", description: "Clean OS install with drivers and updates", billingType: "fixed", costPrice: 800, salePrice: 2_500, durationMinutes: 120, taxGroup: "VAT 15%", skillTags: ["os", "software"], status: "active", updatedAt: "2026-06-18" },
  { code: "SVC-LAP-DIAG", name: "Laptop Diagnosis", categoryId: "sc-it", description: "Hardware and software fault finding", billingType: "fixed", costPrice: 300, salePrice: 1_200, durationMinutes: 45, taxGroup: "VAT 15%", skillTags: ["hardware", "diagnosis"], status: "active", updatedAt: "2026-06-17" },
  { code: "SVC-IT-SUPPORT", name: "IT Support (On-site)", categoryId: "sc-it", description: "Hourly remote or on-site IT support", billingType: "hourly", costPrice: 400, salePrice: 1_500, hourlyRate: 1_500, durationMinutes: 60, taxGroup: "VAT 15%", skillTags: ["network", "support"], status: "active", updatedAt: "2026-06-16" },
  { code: "SVC-MOB-SCREEN", name: "Mobile Screen Replacement", categoryId: "sc-mobile", description: "LCD/OLED screen swap with warranty", billingType: "fixed", costPrice: 2_200, salePrice: 4_500, durationMinutes: 90, taxGroup: "VAT 15%", skillTags: ["mobile", "hardware"], status: "active", updatedAt: "2026-06-15" },
  { code: "SVC-MOB-BATT", name: "Battery Replacement", categoryId: "sc-mobile", description: "OEM-compatible battery install", billingType: "fixed", costPrice: 900, salePrice: 2_200, durationMinutes: 45, taxGroup: "VAT 15%", skillTags: ["mobile"], status: "active", updatedAt: "2026-06-14" },
  { code: "SVC-AC-CLEAN", name: "AC Deep Cleaning", categoryId: "sc-ac", description: "Indoor/outdoor unit wash and filter service", billingType: "fixed", costPrice: 600, salePrice: 2_800, durationMinutes: 150, taxGroup: "VAT 15%", skillTags: ["ac", "hvac"], status: "active", updatedAt: "2026-06-13" },
  { code: "SVC-AC-GAS", name: "AC Gas Refill", categoryId: "sc-ac", description: "Leak check and refrigerant top-up", billingType: "fixed", costPrice: 1_800, salePrice: 4_200, durationMinutes: 120, taxGroup: "VAT 15%", skillTags: ["ac", "hvac"], status: "active", updatedAt: "2026-06-12" },
  { code: "SVC-CAR-OIL", name: "Oil Change Service", categoryId: "sc-vehicle", description: "Engine oil and filter replacement", billingType: "fixed", costPrice: 1_200, salePrice: 3_500, durationMinutes: 60, taxGroup: "VAT 15%", skillTags: ["vehicle"], status: "active", updatedAt: "2026-06-11" },
  { code: "SVC-CCTV-INSTALL", name: "CCTV Camera Installation", categoryId: "sc-cctv", description: "Per camera install including cabling", billingType: "fixed", costPrice: 1_500, salePrice: 5_500, durationMinutes: 180, taxGroup: "VAT 15%", skillTags: ["cctv", "electrical"], status: "active", updatedAt: "2026-06-10" },
  { code: "SVC-CCTV-AMC", name: "CCTV Annual Maintenance", categoryId: "sc-cctv", description: "Quarterly visit AMC for CCTV systems", billingType: "contract", costPrice: 8_000, salePrice: 24_000, durationMinutes: 240, taxGroup: "VAT 15%", skillTags: ["cctv", "amc"], status: "active", updatedAt: "2026-06-09" },
  { code: "SVC-SEO-MONTHLY", name: "SEO Monthly Retainer", categoryId: "sc-marketing", description: "On-page SEO and reporting", billingType: "subscription", costPrice: 12_000, salePrice: 35_000, taxGroup: "VAT 15%", skillTags: ["seo", "marketing"], status: "active", updatedAt: "2026-06-08" },
  { code: "SVC-WEB-DEV", name: "Website Development", categoryId: "sc-marketing", description: "Custom website project delivery", billingType: "project", costPrice: 80_000, salePrice: 250_000, taxGroup: "VAT 15%", skillTags: ["web", "project"], status: "active", updatedAt: "2026-06-07" },
  { code: "SVC-GEN-MAINT", name: "Generator Servicing", categoryId: "sc-general", description: "Preventive maintenance for standby genset", billingType: "fixed", costPrice: 2_500, salePrice: 6_500, durationMinutes: 180, taxGroup: "VAT 15%", skillTags: ["generator"], status: "active", updatedAt: "2026-06-06" },
  { code: "SVC-NET-SETUP", name: "Office Network Setup", categoryId: "sc-it", description: "Router, switch, and Wi-Fi configuration", billingType: "project", costPrice: 5_000, salePrice: 18_000, taxGroup: "VAT 15%", skillTags: ["network"], status: "active", updatedAt: "2026-06-05" },
  { code: "SVC-DATA-RECOVERY", name: "Data Recovery", categoryId: "sc-it", description: "Logical recovery from failed drives", billingType: "fixed", costPrice: 3_000, salePrice: 8_500, durationMinutes: 240, taxGroup: "VAT 15%", skillTags: ["storage"], status: "inactive", updatedAt: "2026-05-28" },
];

export const serviceItemsSeed: ServiceItem[] = [
  ...catalogBase.map((item, i) => ({ ...item, id: `svc-${i + 1}` })),
  ...Array.from({ length: 33 }, (_, i) => {
    const cat = serviceCategoriesSeed[i % serviceCategoriesSeed.length];
    const types: ServiceBillingType[] = ["fixed", "hourly", "contract", "subscription", "project"];
    const billingType = types[i % types.length];
    return {
      id: `svc-gen-${i + 1}`,
      code: `SVC-GEN-${String(i + 16).padStart(3, "0")}`,
      name: `${cat.name} Service Pack ${i + 1}`,
      categoryId: cat.id,
      description: `Standard ${SERVICE_BILLING_LABELS[billingType].toLowerCase()} service offering`,
      billingType,
      costPrice: 500 + i * 120,
      salePrice: 1_500 + i * 350,
      hourlyRate: billingType === "hourly" ? 1_200 + i * 50 : undefined,
      durationMinutes: billingType === "fixed" ? 60 + (i % 5) * 30 : undefined,
      taxGroup: "VAT 15%",
      skillTags: [cat.id.replace("sc-", "")],
      status: i % 11 === 0 ? "inactive" as const : "active" as const,
      updatedAt: `2026-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
    };
  }),
];

export function getServiceCategoryName(categoryId: string): string {
  return serviceCategoriesSeed.find((c) => c.id === categoryId)?.name ?? categoryId;
}

// ─── Customer Assets ─────────────────────────────────────────────────────────

export type ServiceAssetCategory =
  | "laptop"
  | "desktop"
  | "printer"
  | "ac"
  | "generator"
  | "vehicle"
  | "cctv"
  | "other";

export type ServiceAssetStatus = "active" | "in_repair" | "retired";

export type ServiceAsset = {
  id: string;
  assetTag: string;
  name: string;
  customer: string;
  contactId: string;
  category: ServiceAssetCategory;
  brand: string;
  model: string;
  serialNumber?: string;
  warrantyEndDate?: string;
  location: string;
  status: ServiceAssetStatus;
  registeredAt: string;
};

export type ServiceAssetHistoryEntry = {
  id: string;
  date: string;
  orderNumber: string;
  service: string;
  technician: string;
  amount: number;
  status: "completed" | "in_progress" | "scheduled";
};

export type ServiceAssetPartUsage = {
  id: string;
  date: string;
  part: string;
  qty: number;
  cost: number;
  orderNumber: string;
};

export const SERVICE_ASSET_CATEGORY_LABELS: Record<ServiceAssetCategory, string> = {
  laptop: "Laptop",
  desktop: "Desktop",
  printer: "Printer",
  ac: "AC Unit",
  generator: "Generator",
  vehicle: "Vehicle",
  cctv: "CCTV Device",
  other: "Other",
};

export const SERVICE_ASSET_STATUS_LABELS: Record<ServiceAssetStatus, string> = {
  active: "Active",
  in_repair: "In Repair",
  retired: "Retired",
};

const assetCustomers = [
  { contactId: "ct-101", name: "GreenMart Superstores" },
  { contactId: "ct-102", name: "Metro Retail Ltd" },
  { contactId: "ct-103", name: "TechZone BD" },
  { contactId: "ct-104", name: "Apex Motors" },
  { contactId: "ct-105", name: "Digital Hive Agency" },
  { contactId: "ct-106", name: "BRAC IT Services" },
];

const assetBase: Omit<ServiceAsset, "id" | "assetTag">[] = [
  { name: "Dell Latitude 5520", customer: "GreenMart Superstores", contactId: "ct-101", category: "laptop", brand: "Dell", model: "Latitude 5520", serialNumber: "DL5520-88421", warrantyEndDate: "2027-03-15", location: "Head office — IT room", status: "active", registeredAt: "2025-11-02" },
  { name: "Central AC Plant — 5TR", customer: "GreenMart Superstores", contactId: "ct-101", category: "ac", brand: "General", model: "5TR Split", serialNumber: "AC-GEN-4412", warrantyEndDate: "2026-12-01", location: "Warehouse rooftop", status: "active", registeredAt: "2024-08-10" },
  { name: "POS Terminal #7", customer: "Metro Retail Ltd", contactId: "ct-102", category: "desktop", brand: "HP", model: "ProDesk 400", serialNumber: "HP400-22901", warrantyEndDate: "2026-09-20", location: "Gulshan branch", status: "in_repair", registeredAt: "2025-04-18" },
  { name: "Hikvision NVR 16ch", customer: "Metro Retail Ltd", contactId: "ct-102", category: "cctv", brand: "Hikvision", model: "DS-7616NI", serialNumber: "HK-7616-9921", warrantyEndDate: "2027-01-10", location: "Dhanmondi store", status: "active", registeredAt: "2025-01-22" },
  { name: "Toyota HiAce Service Van", customer: "Apex Motors", contactId: "ct-104", category: "vehicle", brand: "Toyota", model: "HiAce", serialNumber: "DHK-MA-4521", warrantyEndDate: undefined, location: "Workshop bay 2", status: "active", registeredAt: "2023-06-01" },
  { name: "MacBook Pro 14\"", customer: "Digital Hive Agency", contactId: "ct-105", category: "laptop", brand: "Apple", model: "MacBook Pro M3", serialNumber: "MBP14-M3-7712", warrantyEndDate: "2028-02-28", location: "Agency HQ", status: "active", registeredAt: "2026-01-05" },
  { name: "Standby Generator 50kVA", customer: "TechZone BD", contactId: "ct-103", category: "generator", brand: "Perkins", model: "50kVA", serialNumber: "GEN-PK-5012", warrantyEndDate: "2026-06-30", location: "Server room yard", status: "in_repair", registeredAt: "2022-11-15" },
  { name: "Canon imageRUNNER", customer: "BRAC IT Services", contactId: "ct-106", category: "printer", brand: "Canon", model: "C5535i", serialNumber: "CN-5535-1102", warrantyEndDate: "2025-12-31", location: "Floor 8 print room", status: "retired", registeredAt: "2020-03-08" },
];

export const serviceAssetsSeed: ServiceAsset[] = [
  ...assetBase.map((a, i) => ({
    ...a,
    id: `ast-${i + 1}`,
    assetTag: `AST/2026/${String(i + 1).padStart(4, "0")}`,
  })),
  ...Array.from({ length: 27 }, (_, i) => {
    const cust = assetCustomers[i % assetCustomers.length];
    const cats: ServiceAssetCategory[] = ["laptop", "desktop", "ac", "cctv", "vehicle", "printer", "generator", "other"];
    const category = cats[i % cats.length];
    const status: ServiceAssetStatus = i % 9 === 0 ? "in_repair" : i % 13 === 0 ? "retired" : "active";
    return {
      id: `ast-gen-${i + 1}`,
      assetTag: `AST/2026/${String(i + 9).padStart(4, "0")}`,
      name: `${SERVICE_ASSET_CATEGORY_LABELS[category]} — ${cust.name.split(" ")[0]} #${i + 1}`,
      customer: cust.name,
      contactId: cust.contactId,
      category,
      brand: ["Dell", "HP", "Samsung", "LG", "Toyota", "Canon"][i % 6],
      model: `Model-${100 + i}`,
      serialNumber: i % 4 === 0 ? undefined : `SN-${8000 + i}`,
      warrantyEndDate: i % 5 === 0 ? undefined : `2026-${String((i % 12) + 1).padStart(2, "0")}-15`,
      location: ["Head office", "Branch A", "Branch B", "Warehouse", "Field site"][i % 5],
      status,
      registeredAt: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    };
  }),
];

export const serviceAssetHistoryById: Record<string, ServiceAssetHistoryEntry[]> = {
  "ast-1": [
    { id: "h1", date: "2026-05-12", orderNumber: "SOV/2026/0031", service: "Windows re-install", technician: "Karim Hassan", amount: 2_500, status: "completed" },
    { id: "h2", date: "2026-03-08", orderNumber: "SOV/2026/0018", service: "Hardware diagnosis", technician: "Sadia Akter", amount: 1_200, status: "completed" },
  ],
  "ast-2": [
    { id: "h3", date: "2026-06-01", orderNumber: "SOV/2026/0044", service: "AC preventive maintenance", technician: "Rahim Uddin", amount: 2_800, status: "completed" },
    { id: "h4", date: "2026-02-14", orderNumber: "SOV/2026/0009", service: "AC gas refill", technician: "Rahim Uddin", amount: 4_200, status: "completed" },
  ],
  "ast-3": [
    { id: "h5", date: "2026-06-18", orderNumber: "SOV/2026/0052", service: "Motherboard repair", technician: "Karim Hassan", amount: 6_500, status: "in_progress" },
  ],
};

export const serviceAssetPartsById: Record<string, ServiceAssetPartUsage[]> = {
  "ast-1": [
    { id: "p1", date: "2026-05-12", part: "SSD 256GB", qty: 1, cost: 3_200, orderNumber: "SOV/2026/0031" },
  ],
  "ast-3": [
    { id: "p2", date: "2026-06-18", part: "Capacitor kit", qty: 1, cost: 850, orderNumber: "SOV/2026/0052" },
    { id: "p3", date: "2026-06-18", part: "Thermal paste", qty: 1, cost: 120, orderNumber: "SOV/2026/0052" },
  ],
};

export function getAssetServiceHistory(assetId: string): ServiceAssetHistoryEntry[] {
  return (
    serviceAssetHistoryById[assetId] ?? [
      {
        id: `${assetId}-fallback`,
        date: "2026-04-01",
        orderNumber: "SOV/2026/0020",
        service: "Routine inspection",
        technician: "Farhan Ali",
        amount: 1_500,
        status: "completed",
      },
    ]
  );
}

export function getAssetPartsUsage(assetId: string): ServiceAssetPartUsage[] {
  return serviceAssetPartsById[assetId] ?? [];
}

// ─── Service Orders ──────────────────────────────────────────────────────────

export type ServiceOrderStatus =
  | "draft"
  | "open"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ServiceOrderPriority = "low" | "medium" | "high" | "critical";

export type ServiceOrderBillingStatus = "unbilled" | "partial" | "billed";

export type ServiceOrder = {
  id: string;
  number: string;
  customer: string;
  contactId: string;
  assetId?: string;
  assetName?: string;
  serviceName: string;
  priority: ServiceOrderPriority;
  scheduleDate: string;
  scheduleTime?: string;
  technician?: string;
  status: ServiceOrderStatus;
  billingStatus: ServiceOrderBillingStatus;
  totalAmount: number;
  notes?: string;
  internalNotes?: string;
  createdAt: string;
};

export type ServiceOrderLine = {
  id: string;
  serviceItemId?: string;
  description: string;
  qty: number;
  unitPrice: number;
  billingType: ServiceBillingType;
};

export type ServiceWorkOrderRef = {
  id: string;
  number: string;
  technician: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: ServiceWorkOrderStatus;
};

export type ServiceWorkOrderStatus = "scheduled" | "in_progress" | "done" | "cancelled";

export type ServiceWorkOrder = {
  id: string;
  number: string;
  serviceOrderId: string;
  serviceOrderNumber: string;
  customer: string;
  serviceName: string;
  assetName?: string;
  location?: string;
  priority: ServiceOrderPriority;
  technician: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: ServiceWorkOrderStatus;
  workNotes?: string;
  checkInLat?: number;
  checkInLng?: number;
  checkOutLat?: number;
  checkOutLng?: number;
  signatureCaptured?: boolean;
};

export type ServiceWorkOrderNote = {
  id: string;
  at: string;
  author: string;
  text: string;
};

export type ServiceOrderPartLine = {
  id: string;
  part: string;
  qty: number;
  cost: number;
};

export type ServiceOrderActivity = {
  id: string;
  at: string;
  actor: string;
  note: string;
};

export type ServiceOrderSla = {
  policyName: string;
  responseDue: string;
  resolutionDue: string;
  responseMet: boolean;
  resolutionMet: boolean;
  atRisk: boolean;
};

export const SERVICE_ORDER_STATUS_LABELS: Record<ServiceOrderStatus, string> = {
  draft: "Draft",
  open: "Open",
  assigned: "Assigned",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const SERVICE_ORDER_BILLING_LABELS: Record<ServiceOrderBillingStatus, string> = {
  unbilled: "Unbilled",
  partial: "Partial",
  billed: "Billed",
};

export const SERVICE_TECHNICIANS = [
  "Rahim Uddin",
  "Karim Hassan",
  "Sadia Akter",
  "Nadia Chowdhury",
  "Farhan Ali",
] as const;

export const SERVICE_WORK_ORDER_STATUS_LABELS: Record<ServiceWorkOrderStatus, string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  done: "Done",
  cancelled: "Cancelled",
};

const orderCustomers = assetCustomers;

const orderBase: Omit<ServiceOrder, "id" | "number">[] = [
  {
    customer: "GreenMart Superstores",
    contactId: "ct-101",
    assetId: "ast-2",
    assetName: "Central AC Plant — 5TR",
    serviceName: "AC Preventive Maintenance",
    priority: "medium",
    scheduleDate: "2026-06-21",
    scheduleTime: "09:00",
    technician: "Rahim Uddin",
    status: "completed",
    billingStatus: "billed",
    totalAmount: 2_800,
    createdAt: "2026-06-01",
  },
  {
    customer: "Metro Retail Ltd",
    contactId: "ct-102",
    assetId: "ast-4",
    assetName: "Hikvision NVR 16ch",
    serviceName: "CCTV Camera Installation",
    priority: "high",
    scheduleDate: "2026-06-21",
    scheduleTime: "10:30",
    technician: "Karim Hassan",
    status: "in_progress",
    billingStatus: "unbilled",
    totalAmount: 11_000,
    createdAt: "2026-06-15",
  },
  {
    customer: "TechZone BD",
    contactId: "ct-103",
    assetId: "ast-7",
    assetName: "Standby Generator 50kVA",
    serviceName: "Generator Servicing",
    priority: "critical",
    scheduleDate: "2026-06-21",
    scheduleTime: "11:00",
    technician: "Sadia Akter",
    status: "in_progress",
    billingStatus: "partial",
    totalAmount: 6_500,
    notes: "Customer reports intermittent shutdown under load",
    createdAt: "2026-06-17",
  },
  {
    customer: "Metro Retail Ltd",
    contactId: "ct-102",
    assetId: "ast-3",
    assetName: "POS Terminal #7",
    serviceName: "Motherboard repair",
    priority: "high",
    scheduleDate: "2026-06-18",
    technician: "Karim Hassan",
    status: "in_progress",
    billingStatus: "unbilled",
    totalAmount: 6_500,
    createdAt: "2026-06-16",
  },
  {
    customer: "GreenMart Superstores",
    contactId: "ct-101",
    assetId: "ast-1",
    assetName: "Dell Latitude 5520",
    serviceName: "Windows re-install",
    priority: "medium",
    scheduleDate: "2026-05-12",
    technician: "Karim Hassan",
    status: "completed",
    billingStatus: "billed",
    totalAmount: 2_500,
    createdAt: "2026-05-10",
  },
  {
    customer: "Apex Motors",
    contactId: "ct-104",
    assetId: "ast-5",
    assetName: "Toyota HiAce Service Van",
    serviceName: "Oil Change Service",
    priority: "low",
    scheduleDate: "2026-06-21",
    scheduleTime: "14:00",
    technician: "Farhan Ali",
    status: "assigned",
    billingStatus: "unbilled",
    totalAmount: 3_500,
    createdAt: "2026-06-19",
  },
  {
    customer: "Digital Hive Agency",
    contactId: "ct-105",
    serviceName: "SEO Monthly Retainer Visit",
    priority: "medium",
    scheduleDate: "2026-06-21",
    scheduleTime: "15:30",
    technician: "Nadia Chowdhury",
    status: "assigned",
    billingStatus: "unbilled",
    totalAmount: 35_000,
    createdAt: "2026-06-18",
  },
  {
    customer: "BRAC IT Services",
    contactId: "ct-106",
    serviceName: "IT Support (On-site)",
    priority: "high",
    scheduleDate: "2026-06-22",
    status: "open",
    billingStatus: "unbilled",
    totalAmount: 4_500,
    internalNotes: "Awaiting technician assignment",
    createdAt: "2026-06-20",
  },
  {
    customer: "TechZone BD",
    contactId: "ct-103",
    serviceName: "Server Health Check",
    priority: "critical",
    scheduleDate: "2026-06-21",
    scheduleTime: "11:00",
    technician: "Sadia Akter",
    status: "in_progress",
    billingStatus: "unbilled",
    totalAmount: 1_500,
    createdAt: "2026-06-20",
  },
  {
    customer: "Metro Retail Ltd",
    contactId: "ct-102",
    serviceName: "Office Network Setup",
    priority: "medium",
    scheduleDate: "2026-06-25",
    status: "draft",
    billingStatus: "unbilled",
    totalAmount: 18_000,
    createdAt: "2026-06-19",
  },
];

export const serviceOrdersSeed: ServiceOrder[] = [
  ...orderBase.map((o, i) => ({
    ...o,
    id: `so-${i + 1}`,
    number: `SOV/2026/${String(i + 1).padStart(4, "0")}`,
  })),
  ...Array.from({ length: 30 }, (_, i) => {
    const cust = orderCustomers[i % orderCustomers.length];
    const statuses: ServiceOrderStatus[] = ["open", "assigned", "in_progress", "completed", "completed", "cancelled", "draft"];
    const status = statuses[i % statuses.length];
    const priorities: ServiceOrderPriority[] = ["low", "medium", "high", "critical"];
    const priority = priorities[i % priorities.length];
    const tech = status === "open" || status === "draft" ? undefined : SERVICE_TECHNICIANS[i % SERVICE_TECHNICIANS.length];
    const billing: ServiceOrderBillingStatus =
      status === "completed" ? (i % 3 === 0 ? "partial" : "billed") : status === "cancelled" ? "unbilled" : "unbilled";
    const services = ["AC Deep Cleaning", "Laptop Diagnosis", "Mobile Screen Replacement", "CCTV Annual Maintenance", "Data Recovery"];
    const assets = serviceAssetsSeed.filter((a) => a.customer === cust.name);
    const asset = assets[i % Math.max(assets.length, 1)];
    return {
      id: `so-gen-${i + 1}`,
      number: `SOV/2026/${String(i + 11).padStart(4, "0")}`,
      customer: cust.name,
      contactId: cust.contactId,
      assetId: asset?.id,
      assetName: asset?.name,
      serviceName: services[i % services.length],
      priority,
      scheduleDate: `2026-06-${String((i % 28) + 1).padStart(2, "0")}`,
      scheduleTime: i % 3 === 0 ? `${String(9 + (i % 8)).padStart(2, "0")}:00` : undefined,
      technician: tech,
      status,
      billingStatus: billing,
      totalAmount: 1_500 + i * 420,
      createdAt: `2026-06-${String((i % 20) + 1).padStart(2, "0")}`,
    };
  }),
];

export const serviceOrderLinesById: Record<string, ServiceOrderLine[]> = {
  "so-1": [
    { id: "ol-1", serviceItemId: "svc-7", description: "AC Deep Cleaning", qty: 1, unitPrice: 2_800, billingType: "fixed" },
  ],
  "so-2": [
    { id: "ol-2", serviceItemId: "svc-9", description: "CCTV Camera Installation", qty: 2, unitPrice: 5_500, billingType: "fixed" },
  ],
  "so-3": [
    { id: "ol-3", serviceItemId: "svc-13", description: "Generator Servicing", qty: 1, unitPrice: 6_500, billingType: "fixed" },
  ],
  "so-4": [
    { id: "ol-4", description: "Motherboard repair — labour + parts allowance", qty: 1, unitPrice: 6_500, billingType: "fixed" },
  ],
};

export const serviceWorkOrdersByOrderId: Record<string, ServiceWorkOrderRef[]> = {
  "so-1": [
    { id: "wo-1", number: "WO/2026/0101", technician: "Rahim Uddin", scheduledStart: "2026-06-01 09:00", scheduledEnd: "2026-06-01 12:00", status: "done" },
  ],
  "so-2": [
    { id: "wo-2", number: "WO/2026/0152", technician: "Karim Hassan", scheduledStart: "2026-06-21 10:30", scheduledEnd: "2026-06-21 14:00", status: "in_progress" },
  ],
  "so-3": [
    { id: "wo-3", number: "WO/2026/0158", technician: "Sadia Akter", scheduledStart: "2026-06-21 11:00", scheduledEnd: "2026-06-21 15:00", status: "in_progress" },
    { id: "wo-4", number: "WO/2026/0159", technician: "Farhan Ali", scheduledStart: "2026-06-22 09:00", scheduledEnd: "2026-06-22 12:00", status: "scheduled" },
  ],
};

function workOrderFromOrder(
  order: ServiceOrder,
  ref: ServiceWorkOrderRef,
  extra?: Partial<ServiceWorkOrder>
): ServiceWorkOrder {
  return {
    id: ref.id,
    number: ref.number,
    serviceOrderId: order.id,
    serviceOrderNumber: order.number,
    customer: order.customer,
    serviceName: order.serviceName,
    assetName: order.assetName,
    location: order.assetName ? undefined : "On-site",
    priority: order.priority,
    technician: ref.technician,
    scheduledStart: ref.scheduledStart,
    scheduledEnd: ref.scheduledEnd,
    status: ref.status,
    ...extra,
  };
}

const workOrderExtras: Record<string, Partial<ServiceWorkOrder>> = {
  "wo-1": {
    actualStart: "2026-06-01 09:05",
    actualEnd: "2026-06-01 11:45",
    checkInLat: 23.8103,
    checkInLng: 90.4125,
    checkOutLat: 23.8103,
    checkOutLng: 90.4125,
    signatureCaptured: true,
    workNotes: "AC filters cleaned, gas pressure OK",
  },
  "wo-2": {
    actualStart: "2026-06-21 10:35",
    checkInLat: 23.7808,
    checkInLng: 90.4137,
    workNotes: "Cabling run to camera positions 1–3",
  },
  "wo-3": {
    actualStart: "2026-06-21 11:12",
    checkInLat: 23.7925,
    checkInLng: 90.4078,
    workNotes: "Load test in progress — voltage stable at 50% load",
  },
};

const workOrderBase: ServiceWorkOrder[] = Object.entries(serviceWorkOrdersByOrderId).flatMap(([orderId, refs]) => {
  const order = serviceOrdersSeed.find((o) => o.id === orderId);
  if (!order) return [];
  return refs.map((ref) => workOrderFromOrder(order, ref, workOrderExtras[ref.id]));
});

export const serviceWorkOrdersSeed: ServiceWorkOrder[] = [
  ...workOrderBase,
  ...serviceOrdersSeed
    .filter((o) => o.technician && !workOrderBase.some((w) => w.serviceOrderId === o.id))
    .slice(0, 25)
    .map((order, i) => {
      const statuses: ServiceWorkOrderStatus[] = ["scheduled", "in_progress", "done", "done", "cancelled"];
      const status = statuses[i % statuses.length];
      const tech = order.technician ?? SERVICE_TECHNICIANS[i % SERVICE_TECHNICIANS.length];
      const day = order.scheduleDate;
      const time = order.scheduleTime ?? "10:00";
      return {
        id: `wo-gen-${i + 1}`,
        number: `WO/2026/${String(i + 200).padStart(4, "0")}`,
        serviceOrderId: order.id,
        serviceOrderNumber: order.number,
        customer: order.customer,
        serviceName: order.serviceName,
        assetName: order.assetName,
        location: order.assetName ? "Customer site" : "Remote",
        priority: order.priority,
        technician: tech,
        scheduledStart: `${day} ${time}`,
        scheduledEnd: `${day} ${String(Number(time.split(":")[0]) + 3).padStart(2, "0")}:00`,
        actualStart: status === "in_progress" || status === "done" ? `${day} ${time}` : undefined,
        actualEnd: status === "done" ? `${day} ${String(Number(time.split(":")[0]) + 2).padStart(2, "0")}:30` : undefined,
        status,
        signatureCaptured: status === "done" && i % 2 === 0,
        checkInLat: status !== "scheduled" ? 23.75 + (i % 10) * 0.01 : undefined,
        checkInLng: status !== "scheduled" ? 90.38 + (i % 10) * 0.01 : undefined,
      };
    }),
];

export const serviceWorkOrderPartsById: Record<string, ServiceOrderPartLine[]> = {
  "wo-2": [
    { id: "wp-1", part: "Cat6 cable (100m)", qty: 1, cost: 2_400 },
    { id: "wp-2", part: "RJ45 connectors", qty: 12, cost: 15 },
  ],
  "wo-3": [
    { id: "wp-3", part: "Oil filter kit", qty: 1, cost: 850 },
    { id: "wp-4", part: "Spark plug set", qty: 1, cost: 1_200 },
  ],
};

export const serviceWorkOrderNotesById: Record<string, ServiceWorkOrderNote[]> = {
  "wo-2": [
    { id: "wn-1", at: "2026-06-21 10:35", author: "Karim Hassan", text: "Checked in at Gulshan branch" },
    { id: "wn-2", at: "2026-06-21 11:20", author: "Karim Hassan", text: "Camera 1 mounted — testing feed" },
  ],
  "wo-3": [
    { id: "wn-3", at: "2026-06-21 11:12", author: "Sadia Akter", text: "Generator load test started" },
  ],
};

export const serviceOrderPartsById: Record<string, ServiceOrderPartLine[]> = {
  "so-2": [
    { id: "op-1", part: "Cat6 cable (100m)", qty: 1, cost: 2_400 },
    { id: "op-2", part: "RJ45 connectors", qty: 12, cost: 15 },
  ],
  "so-3": [
    { id: "op-3", part: "Oil filter kit", qty: 1, cost: 850 },
    { id: "op-4", part: "Spark plug set", qty: 1, cost: 1_200 },
  ],
};

export const serviceOrderActivityById: Record<string, ServiceOrderActivity[]> = {
  "so-2": [
    { id: "act-1", at: "2026-06-15 14:22", actor: "Dispatch", note: "Order confirmed and scheduled" },
    { id: "act-2", at: "2026-06-18 09:05", actor: "Karim Hassan", note: "Checked in on site — cabling in progress" },
    { id: "act-3", at: "2026-06-21 10:35", actor: "Karim Hassan", note: "Camera 1 mounted, testing NVR feed" },
  ],
  "so-3": [
    { id: "act-4", at: "2026-06-17 11:00", actor: "Dispatch", note: "Critical priority — escalated SLA" },
    { id: "act-5", at: "2026-06-21 11:10", actor: "Sadia Akter", note: "Generator load test started" },
  ],
};

export const serviceOrderSlaById: Record<string, ServiceOrderSla> = {
  "so-2": {
    policyName: "Standard On-site",
    responseDue: "2026-06-16 18:00",
    resolutionDue: "2026-06-22 18:00",
    responseMet: true,
    resolutionMet: true,
    atRisk: false,
  },
  "so-3": {
    policyName: "Critical Equipment",
    responseDue: "2026-06-17 14:00",
    resolutionDue: "2026-06-21 18:00",
    responseMet: true,
    resolutionMet: false,
    atRisk: true,
  },
  "so-8": {
    policyName: "Standard On-site",
    responseDue: "2026-06-21 12:00",
    resolutionDue: "2026-06-23 18:00",
    responseMet: false,
    resolutionMet: false,
    atRisk: true,
  },
};

export function getServiceOrderLines(orderId: string): ServiceOrderLine[] {
  return (
    serviceOrderLinesById[orderId] ?? [
      {
        id: `${orderId}-line`,
        description: "Primary service line",
        qty: 1,
        unitPrice: serviceOrdersSeed.find((o) => o.id === orderId)?.totalAmount ?? 0,
        billingType: "fixed",
      },
    ]
  );
}

export function getServiceOrderWorkOrders(orderId: string): ServiceWorkOrderRef[] {
  return serviceWorkOrdersSeed
    .filter((wo) => wo.serviceOrderId === orderId)
    .map(({ id, number, technician, scheduledStart, scheduledEnd, status }) => ({
      id,
      number,
      technician,
      scheduledStart,
      scheduledEnd,
      status,
    }));
}

export function getServiceOrderParts(orderId: string): ServiceOrderPartLine[] {
  return serviceOrderPartsById[orderId] ?? [];
}

export function getServiceOrderActivity(orderId: string): ServiceOrderActivity[] {
  return (
    serviceOrderActivityById[orderId] ?? [
      {
        id: `${orderId}-act`,
        at: serviceOrdersSeed.find((o) => o.id === orderId)?.createdAt ?? "2026-06-01",
        actor: "System",
        note: "Service order created",
      },
    ]
  );
}

export function getServiceOrderSla(orderId: string): ServiceOrderSla | null {
  if (serviceOrderSlaById[orderId]) return serviceOrderSlaById[orderId];
  const order = serviceOrdersSeed.find((o) => o.id === orderId);
  if (!order || order.status === "draft" || order.status === "cancelled") return null;
  return {
    policyName: order.priority === "critical" ? "Critical Equipment" : "Standard On-site",
    responseDue: `${order.scheduleDate} 12:00`,
    resolutionDue: `${order.scheduleDate} 18:00`,
    responseMet: order.status !== "open",
    resolutionMet: order.status === "completed",
    atRisk: order.priority === "critical" && order.status === "in_progress",
  };
}

export function getOrderSlaLabel(orderId: string): "On track" | "At risk" | "Breached" | "—" {
  const sla = getServiceOrderSla(orderId);
  if (!sla) return "—";
  if (!sla.responseMet) return "Breached";
  if (sla.atRisk || !sla.resolutionMet) return "At risk";
  return "On track";
}

export function getWorkOrderParts(workOrderId: string): ServiceOrderPartLine[] {
  return serviceWorkOrderPartsById[workOrderId] ?? [];
}

export function getWorkOrderNotes(workOrderId: string): ServiceWorkOrderNote[] {
  return serviceWorkOrderNotesById[workOrderId] ?? [
    {
      id: `${workOrderId}-note`,
      at: serviceWorkOrdersSeed.find((w) => w.id === workOrderId)?.scheduledStart ?? "2026-06-01",
      author: "System",
      text: "Work order created from service order",
    },
  ];
}

export function nextWorkOrderNumber(workOrders: ServiceWorkOrder[]): string {
  const nums = workOrders
    .map((w) => {
      const m = w.number.match(/WO\/2026\/(\d+)/);
      return m ? Number(m[1]) : 0;
    })
    .filter((n) => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `WO/2026/${String(next).padStart(4, "0")}`;
}

// ─── Schedule ────────────────────────────────────────────────────────────────

export const SERVICE_SCHEDULE_TODAY = "2026-06-21";

export type ServiceScheduleSlotStatus = "scheduled" | "in_progress" | "done" | "cancelled";

export type ServiceScheduleSlot = {
  id: string;
  workOrderId: string;
  serviceOrderId: string;
  date: string;
  startTime: string;
  endTime: string;
  technician: string;
  customer: string;
  serviceName: string;
  workOrderNumber: string;
  serviceOrderNumber: string;
  priority: ServiceOrderPriority;
  status: ServiceScheduleSlotStatus;
};

function parseScheduleDateTime(dt: string): { date: string; time: string } {
  const [date, time] = dt.split(" ");
  return { date: date ?? dt, time: time ?? "09:00" };
}

function workOrderToSlot(wo: ServiceWorkOrder): ServiceScheduleSlot {
  const start = parseScheduleDateTime(wo.scheduledStart);
  const end = parseScheduleDateTime(wo.scheduledEnd);
  const status: ServiceScheduleSlotStatus =
    wo.status === "done" ? "done" : wo.status === "in_progress" ? "in_progress" : wo.status === "cancelled" ? "cancelled" : "scheduled";
  return {
    id: `slot-${wo.id}`,
    workOrderId: wo.id,
    serviceOrderId: wo.serviceOrderId,
    date: start.date,
    startTime: start.time,
    endTime: end.time,
    technician: wo.technician,
    customer: wo.customer,
    serviceName: wo.serviceName,
    workOrderNumber: wo.number,
    serviceOrderNumber: wo.serviceOrderNumber,
    priority: wo.priority,
    status,
  };
}

export const serviceScheduleSlotsSeed: ServiceScheduleSlot[] = [
  ...serviceWorkOrdersSeed.filter((w) => w.status !== "cancelled").map(workOrderToSlot),
];

export function getScheduleSlotsForDate(date: string, slots = serviceScheduleSlotsSeed): ServiceScheduleSlot[] {
  return slots.filter((s) => s.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function getScheduleSlotsForTechnician(
  technician: string,
  date: string,
  slots = serviceScheduleSlotsSeed
): ServiceScheduleSlot[] {
  return getScheduleSlotsForDate(date, slots).filter((s) => s.technician === technician);
}

export function getUnassignedOrdersCount(): number {
  return serviceOrdersSeed.filter((o) => o.status === "open" && !o.technician).length;
}

// ─── Repair Management ───────────────────────────────────────────────────────

export type ServiceRepairStage =
  | "received"
  | "diagnosing"
  | "awaiting_approval"
  | "repairing"
  | "testing"
  | "ready"
  | "delivered";

export type ServiceRepairTicket = {
  id: string;
  ticketNumber: string;
  serviceOrderId?: string;
  serviceOrderNumber?: string;
  assetId?: string;
  assetName: string;
  customer: string;
  problem: string;
  diagnosis?: string;
  stage: ServiceRepairStage;
  stageEnteredAt: string;
  technician?: string;
  quoteAmount?: number;
  partsCost?: number;
  laborCost?: number;
  priority: ServiceOrderPriority;
};

export const SERVICE_REPAIR_STAGES: ServiceRepairStage[] = [
  "received",
  "diagnosing",
  "awaiting_approval",
  "repairing",
  "testing",
  "ready",
  "delivered",
];

export const SERVICE_REPAIR_STAGE_LABELS: Record<ServiceRepairStage, string> = {
  received: "Received",
  diagnosing: "Diagnosis",
  awaiting_approval: "Awaiting Approval",
  repairing: "Repairing",
  testing: "Testing",
  ready: "Ready",
  delivered: "Delivered",
};

const repairProblems = [
  "No power / won't boot",
  "Screen flickering or dead pixels",
  "Overheating under load",
  "Battery not holding charge",
  "Motherboard fault — no POST",
  "Liquid damage assessment",
  "HDD click / data recovery",
  "AC not cooling — gas leak suspected",
];

const repairBase: Omit<ServiceRepairTicket, "id" | "ticketNumber">[] = [
  {
    serviceOrderId: "so-4",
    serviceOrderNumber: "SOV/2026/0004",
    assetId: "ast-3",
    assetName: "POS Terminal #7",
    customer: "Metro Retail Ltd",
    problem: "Motherboard fault — no POST",
    diagnosis: "Capacitor bulge on VRM section; board repair recommended",
    stage: "repairing",
    stageEnteredAt: "2026-06-17",
    technician: "Karim Hassan",
    quoteAmount: 6_500,
    partsCost: 970,
    laborCost: 4_000,
    priority: "high",
  },
  {
    assetId: "ast-1",
    assetName: "Dell Latitude 5520",
    customer: "GreenMart Superstores",
    problem: "Slow performance — possible SSD failure",
    diagnosis: "SMART errors on drive; replace SSD and reinstall OS",
    stage: "delivered",
    stageEnteredAt: "2026-05-10",
    technician: "Karim Hassan",
    quoteAmount: 2_500,
    partsCost: 3_200,
    laborCost: 1_500,
    priority: "medium",
  },
  {
    assetId: "ast-7",
    assetName: "Standby Generator 50kVA",
    customer: "TechZone BD",
    problem: "Intermittent shutdown under load",
    diagnosis: "Fuel system and voltage regulator inspection in progress",
    stage: "diagnosing",
    stageEnteredAt: "2026-06-19",
    technician: "Sadia Akter",
    quoteAmount: 6_500,
    priority: "critical",
  },
  {
    assetName: "iPhone 14 Pro",
    customer: "Digital Hive Agency",
    problem: "Cracked screen + touch issues",
    stage: "awaiting_approval",
    stageEnteredAt: "2026-06-18",
    technician: "Nadia Chowdhury",
    quoteAmount: 4_500,
    partsCost: 2_800,
    laborCost: 1_200,
    priority: "medium",
  },
  {
    assetName: "Canon imageRUNNER C5535i",
    customer: "BRAC IT Services",
    problem: "Paper jam sensor error",
    stage: "received",
    stageEnteredAt: "2026-06-20",
    priority: "low",
  },
  {
    assetId: "ast-6",
    assetName: "MacBook Pro 14\"",
    customer: "Digital Hive Agency",
    problem: "Keyboard keys not responding",
    diagnosis: "Keyboard module replacement required",
    stage: "testing",
    stageEnteredAt: "2026-06-15",
    technician: "Sadia Akter",
    quoteAmount: 8_500,
    partsCost: 5_200,
    laborCost: 2_000,
    priority: "high",
  },
  {
    assetName: "Samsung Split AC 1.5TR",
    customer: "Metro Retail Ltd",
    problem: "Not cooling — suspected gas leak",
    diagnosis: "Leak at flare nut; gas refill after seal",
    stage: "ready",
    stageEnteredAt: "2026-06-14",
    technician: "Rahim Uddin",
    quoteAmount: 4_200,
    partsCost: 600,
    laborCost: 2_500,
    priority: "medium",
  },
];

export const serviceRepairsSeed: ServiceRepairTicket[] = [
  ...repairBase.map((t, i) => ({
    ...t,
    id: `rep-${i + 1}`,
    ticketNumber: `REP/2026/${String(i + 1).padStart(4, "0")}`,
  })),
  ...Array.from({ length: 18 }, (_, i) => {
    const cust = orderCustomers[i % orderCustomers.length];
    const assets = serviceAssetsSeed.filter((a) => a.customer === cust.name);
    const asset = assets[i % Math.max(assets.length, 1)];
    const stage = SERVICE_REPAIR_STAGES[i % SERVICE_REPAIR_STAGES.length];
    const priorities: ServiceOrderPriority[] = ["low", "medium", "high", "critical"];
    const priority = priorities[i % priorities.length];
    const daysAgo = (i % 12) + 1;
    const entered = new Date("2026-06-21");
    entered.setDate(entered.getDate() - daysAgo);
    return {
      id: `rep-gen-${i + 1}`,
      ticketNumber: `REP/2026/${String(i + 8).padStart(4, "0")}`,
      assetId: asset?.id,
      assetName: asset?.name ?? `Device #${i + 1}`,
      customer: cust.name,
      problem: repairProblems[i % repairProblems.length],
      diagnosis: stage !== "received" && stage !== "diagnosing" ? "Preliminary diagnosis recorded" : undefined,
      stage,
      stageEnteredAt: entered.toISOString().slice(0, 10),
      technician: stage === "received" ? undefined : SERVICE_TECHNICIANS[i % SERVICE_TECHNICIANS.length],
      quoteAmount: stage === "received" ? undefined : 1_500 + i * 380,
      partsCost: ["repairing", "testing", "ready", "delivered"].includes(stage) ? 400 + i * 90 : undefined,
      laborCost: stage !== "received" ? 800 + i * 120 : undefined,
      priority,
    };
  }),
];

export function daysInRepairStage(stageEnteredAt: string, today = SERVICE_SCHEDULE_TODAY): number {
  const start = new Date(stageEnteredAt + "T12:00:00");
  const end = new Date(today + "T12:00:00");
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
}

export const serviceRepairPartsById: Record<string, ServiceOrderPartLine[]> = {
  "rep-1": [
    { id: "rp-1", part: "Capacitor kit", qty: 1, cost: 850 },
    { id: "rp-2", part: "Thermal paste", qty: 1, cost: 120 },
  ],
  "rep-2": [
    { id: "rp-3", part: "SSD 256GB", qty: 1, cost: 3_200 },
  ],
  "rep-4": [
    { id: "rp-4", part: "iPhone 14 screen assembly", qty: 1, cost: 2_800 },
  ],
};

export function getRepairParts(ticketId: string): ServiceOrderPartLine[] {
  return serviceRepairPartsById[ticketId] ?? [];
}

// ─── Technicians ─────────────────────────────────────────────────────────────

export type ServiceTechnicianStatus = "active" | "on_leave" | "inactive";

export type ServiceTechnician = {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  status: ServiceTechnicianStatus;
  skills: string[];
  certifications: string[];
  defaultTerritory: string;
  jobsCompletedMtd: number;
  jobsActive: number;
  revenueMtd: number;
  utilizationPct: number;
  productivityScore: number;
  rating?: number;
  joinedAt: string;
};

export const SERVICE_TECHNICIAN_STATUS_LABELS: Record<ServiceTechnicianStatus, string> = {
  active: "Active",
  on_leave: "On Leave",
  inactive: "Inactive",
};

const techProfiles: Omit<ServiceTechnician, "id">[] = [
  {
    employeeId: "EMP-1042",
    name: "Rahim Uddin",
    email: "rahim.uddin@againerp.local",
    phone: "+880 1711-442901",
    status: "active",
    skills: ["ac", "hvac", "generator"],
    certifications: ["HVAC Level 2", "Electrical Safety"],
    defaultTerritory: "Dhaka North",
    jobsCompletedMtd: 18,
    jobsActive: 2,
    revenueMtd: 142_000,
    utilizationPct: 92,
    productivityScore: 88,
    rating: 4.8,
    joinedAt: "2022-03-15",
  },
  {
    employeeId: "EMP-1058",
    name: "Karim Hassan",
    email: "karim.hassan@againerp.local",
    phone: "+880 1812-883412",
    status: "active",
    skills: ["cctv", "network", "it-support"],
    certifications: ["CCTV Installer", "CompTIA A+"],
    defaultTerritory: "Dhaka Central",
    jobsCompletedMtd: 15,
    jobsActive: 3,
    revenueMtd: 118_500,
    utilizationPct: 78,
    productivityScore: 82,
    rating: 4.6,
    joinedAt: "2021-08-02",
  },
  {
    employeeId: "EMP-1071",
    name: "Sadia Akter",
    email: "sadia.akter@againerp.local",
    phone: "+880 1911-220045",
    status: "active",
    skills: ["it-support", "network", "generator"],
    certifications: ["Server Maintenance", "Electrical Safety"],
    defaultTerritory: "Dhaka South",
    jobsCompletedMtd: 12,
    jobsActive: 2,
    revenueMtd: 96_000,
    utilizationPct: 65,
    productivityScore: 79,
    rating: 4.9,
    joinedAt: "2023-01-10",
  },
  {
    employeeId: "EMP-1083",
    name: "Nadia Chowdhury",
    email: "nadia.chowdhury@againerp.local",
    phone: "+880 1612-991203",
    status: "active",
    skills: ["marketing", "it-support"],
    certifications: ["Digital Marketing Pro"],
    defaultTerritory: "Remote / Agency",
    jobsCompletedMtd: 9,
    jobsActive: 1,
    revenueMtd: 210_000,
    utilizationPct: 48,
    productivityScore: 74,
    rating: 4.5,
    joinedAt: "2023-06-20",
  },
  {
    employeeId: "EMP-1094",
    name: "Farhan Ali",
    email: "farhan.ali@againerp.local",
    phone: "+880 1511-778832",
    status: "active",
    skills: ["vehicle", "generator"],
    certifications: ["Automotive Service L1"],
    defaultTerritory: "Gazipur / Workshop",
    jobsCompletedMtd: 8,
    jobsActive: 1,
    revenueMtd: 54_000,
    utilizationPct: 35,
    productivityScore: 71,
    rating: 4.3,
    joinedAt: "2024-02-01",
  },
  {
    employeeId: "EMP-1102",
    name: "Imran Hossain",
    email: "imran.hossain@againerp.local",
    phone: "+880 1712-556677",
    status: "on_leave",
    skills: ["mobile", "it-support"],
    certifications: ["Mobile Repair Specialist"],
    defaultTerritory: "Chittagong",
    jobsCompletedMtd: 0,
    jobsActive: 0,
    revenueMtd: 0,
    utilizationPct: 0,
    productivityScore: 0,
    joinedAt: "2020-11-05",
  },
  {
    employeeId: "EMP-1110",
    name: "Tasnim Rahman",
    email: "tasnim.rahman@againerp.local",
    phone: "+880 1811-334455",
    status: "inactive",
    skills: ["ac", "cctv"],
    certifications: [],
    defaultTerritory: "Dhaka East",
    jobsCompletedMtd: 0,
    jobsActive: 0,
    revenueMtd: 0,
    utilizationPct: 0,
    productivityScore: 0,
    joinedAt: "2019-05-18",
  },
];

export const serviceTechniciansSeed: ServiceTechnician[] = techProfiles.map((t, i) => ({
  ...t,
  id: `tech-${i + 1}`,
}));

export const SERVICE_SKILL_LABELS: Record<string, string> = {
  ac: "AC / HVAC",
  hvac: "HVAC",
  cctv: "CCTV",
  network: "Network",
  mobile: "Mobile Repair",
  vehicle: "Vehicle",
  generator: "Generator",
  "it-support": "IT Support",
  marketing: "Marketing",
};

export function getTechnicianWorkOrders(technicianName: string): ServiceWorkOrder[] {
  return serviceWorkOrdersSeed.filter(
    (w) => w.technician === technicianName && w.status !== "done" && w.status !== "cancelled"
  );
}

export function getTechnicianScheduleToday(technicianName: string): ServiceScheduleSlot[] {
  return getScheduleSlotsForDate(SERVICE_SCHEDULE_TODAY).filter((s) => s.technician === technicianName);
}
