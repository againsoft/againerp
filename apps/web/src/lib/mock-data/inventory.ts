export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "overstock";

export type TransferStatus = "draft" | "in_transit" | "received" | "cancelled";

export type AdjustmentStatus = "pending" | "approved" | "rejected";

export const INVENTORY_TABS = [
  "dashboard",
  "stock",
  "warehouses",
  "transfers",
  "adjustments",
  "reservations",
] as const;

export type InventoryTab = (typeof INVENTORY_TABS)[number];

export const INVENTORY_TAB_LABELS: Record<InventoryTab, string> = {
  dashboard: "Dashboard",
  stock: "Stock",
  warehouses: "Warehouses",
  transfers: "Transfers",
  adjustments: "Adjustments",
  reservations: "Reservations",
};

export const inventoryKpis = [
  { label: "Total SKUs", value: "486", sub: "Across 3 warehouses" },
  { label: "Total units", value: "24,820", sub: "+1.2% vs last week", up: true },
  { label: "Stock value", value: "৳18.4M", sub: "FIFO valuation" },
  { label: "Low stock items", value: 14, sub: "Below min threshold", alert: true },
];

export const stockMovementChart = [
  { day: "Mon", inbound: 420, outbound: 380 },
  { day: "Tue", inbound: 310, outbound: 290 },
  { day: "Wed", inbound: 580, outbound: 410 },
  { day: "Thu", inbound: 240, outbound: 520 },
  { day: "Fri", inbound: 390, outbound: 460 },
  { day: "Sat", inbound: 180, outbound: 220 },
  { day: "Sun", inbound: 120, outbound: 95 },
];

export const warehouseDistribution = [
  { name: "Dhaka HQ", units: 14200 },
  { name: "Chittagong", units: 6800 },
  { name: "Online FC", units: 3820 },
];

export type StockItem = {
  id: string;
  sku: string;
  name: string;
  warehouse: string;
  onHand: number;
  reserved: number;
  available: number;
  incoming: number;
  minQty: number;
  maxQty: number;
  status: StockStatus;
  unitCost: number;
  updatedAt: string;
  thumbnail?: string;
};

export const stockItemsSeed: StockItem[] = [
  {
    id: "inv_001",
    sku: "SKU-0002",
    name: "Wireless Earbuds Pro",
    warehouse: "Dhaka HQ",
    onHand: 8,
    reserved: 3,
    available: 5,
    incoming: 50,
    minQty: 15,
    maxQty: 200,
    status: "low_stock",
    unitCost: 2100,
    updatedAt: "2026-06-15",
    thumbnail: "https://picsum.photos/seed/inv-earbuds/48/48",
  },
  {
    id: "inv_002",
    sku: "SKU-0005",
    name: "Smart Watch Series 5",
    warehouse: "Dhaka HQ",
    onHand: 3,
    reserved: 1,
    available: 2,
    incoming: 0,
    minQty: 10,
    maxQty: 80,
    status: "low_stock",
    unitCost: 8900,
    updatedAt: "2026-06-15",
    thumbnail: "https://picsum.photos/seed/inv-watch/48/48",
  },
  {
    id: "inv_003",
    sku: "SKU-0014",
    name: "USB-C Hub 7-in-1",
    warehouse: "Online FC",
    onHand: 0,
    reserved: 0,
    available: 0,
    incoming: 24,
    minQty: 5,
    maxQty: 60,
    status: "out_of_stock",
    unitCost: 1200,
    updatedAt: "2026-06-14",
    thumbnail: "https://picsum.photos/seed/inv-hub/48/48",
  },
  {
    id: "inv_004",
    sku: "SKU-0001",
    name: "Premium Cotton T-Shirt",
    warehouse: "Dhaka HQ",
    onHand: 186,
    reserved: 12,
    available: 174,
    incoming: 0,
    minQty: 30,
    maxQty: 300,
    status: "in_stock",
    unitCost: 450,
    updatedAt: "2026-06-15",
    thumbnail: "https://picsum.photos/seed/inv-tee/48/48",
  },
  {
    id: "inv_005",
    sku: "SKU-0007",
    name: "Bluetooth Speaker Mini",
    warehouse: "Chittagong",
    onHand: 420,
    reserved: 8,
    available: 412,
    incoming: 0,
    minQty: 20,
    maxQty: 150,
    status: "overstock",
    unitCost: 1800,
    updatedAt: "2026-06-13",
    thumbnail: "https://picsum.photos/seed/inv-speaker/48/48",
  },
  {
    id: "inv_006",
    sku: "SKU-0004",
    name: "Running Shoes Ultra",
    warehouse: "Dhaka HQ",
    onHand: 42,
    reserved: 6,
    available: 36,
    incoming: 30,
    minQty: 15,
    maxQty: 100,
    status: "in_stock",
    unitCost: 3200,
    updatedAt: "2026-06-12",
    thumbnail: "https://picsum.photos/seed/inv-shoes/48/48",
  },
  {
    id: "inv_007",
    sku: "SKU-0010",
    name: "LED Desk Lamp",
    warehouse: "Online FC",
    onHand: 28,
    reserved: 2,
    available: 26,
    incoming: 0,
    minQty: 10,
    maxQty: 80,
    status: "in_stock",
    unitCost: 980,
    updatedAt: "2026-06-11",
    thumbnail: "https://picsum.photos/seed/inv-lamp/48/48",
  },
  {
    id: "inv_008",
    sku: "SKU-0008",
    name: "Organic Face Serum",
    warehouse: "Chittagong",
    onHand: 6,
    reserved: 0,
    available: 6,
    incoming: 40,
    minQty: 12,
    maxQty: 90,
    status: "low_stock",
    unitCost: 1100,
    updatedAt: "2026-06-15",
    thumbnail: "https://picsum.photos/seed/inv-serum/48/48",
  },
];

export type Warehouse = {
  id: string;
  code: string;
  name: string;
  type: string;
  address: string;
  locations: number;
  totalUnits: number;
  active: boolean;
};

export const warehousesSeed: Warehouse[] = [
  {
    id: "wh_dhaka",
    code: "DHK-HQ",
    name: "Dhaka HQ",
    type: "Main warehouse",
    address: "Gulshan-2, Dhaka",
    locations: 24,
    totalUnits: 14200,
    active: true,
  },
  {
    id: "wh_ctg",
    code: "CTG-01",
    name: "Chittagong",
    type: "Regional",
    address: "Agrabad, Chittagong",
    locations: 12,
    totalUnits: 6800,
    active: true,
  },
  {
    id: "wh_fc",
    code: "ONL-FC",
    name: "Online Fulfillment Center",
    type: "Ecommerce FC",
    address: "Savar EPZ",
    locations: 18,
    totalUnits: 3820,
    active: true,
  },
];

export type StockTransfer = {
  id: string;
  from: string;
  to: string;
  items: number;
  units: number;
  status: TransferStatus;
  createdAt: string;
};

export const transfersSeed: StockTransfer[] = [
  {
    id: "TRF-1042",
    from: "Dhaka HQ",
    to: "Online FC",
    items: 3,
    units: 120,
    status: "in_transit",
    createdAt: "2026-06-14",
  },
  {
    id: "TRF-1041",
    from: "Chittagong",
    to: "Dhaka HQ",
    items: 5,
    units: 240,
    status: "in_transit",
    createdAt: "2026-06-13",
  },
  {
    id: "TRF-1040",
    from: "Dhaka HQ",
    to: "Chittagong",
    items: 2,
    units: 80,
    status: "draft",
    createdAt: "2026-06-15",
  },
  {
    id: "TRF-1039",
    from: "Online FC",
    to: "Dhaka HQ",
    items: 1,
    units: 24,
    status: "received",
    createdAt: "2026-06-12",
  },
];

export type StockAdjustment = {
  id: string;
  warehouse: string;
  sku: string;
  product: string;
  qtyChange: number;
  reason: string;
  status: AdjustmentStatus;
  requestedAt: string;
};

export const adjustmentsSeed: StockAdjustment[] = [
  {
    id: "ADJ-088",
    warehouse: "Dhaka HQ",
    sku: "SKU-0014",
    product: "USB-C Hub 7-in-1",
    qtyChange: -2,
    reason: "Cycle count variance",
    status: "pending",
    requestedAt: "2026-06-15 09:30",
  },
  {
    id: "ADJ-087",
    warehouse: "Online FC",
    sku: "SKU-0002",
    product: "Wireless Earbuds Pro",
    qtyChange: 50,
    reason: "Purchase receipt correction",
    status: "approved",
    requestedAt: "2026-06-14 14:20",
  },
  {
    id: "ADJ-086",
    warehouse: "Chittagong",
    sku: "SKU-0007",
    product: "Bluetooth Speaker Mini",
    qtyChange: -5,
    reason: "Damaged in transit",
    status: "pending",
    requestedAt: "2026-06-14 11:00",
  },
];

export type StockReservation = {
  id: string;
  orderId: string;
  sku: string;
  product: string;
  warehouse: string;
  qty: number;
  expiresAt: string;
};

export const reservationsSeed: StockReservation[] = [
  {
    id: "res_001",
    orderId: "ORD-01042",
    sku: "SKU-0002",
    product: "Wireless Earbuds Pro",
    warehouse: "Dhaka HQ",
    qty: 2,
    expiresAt: "2026-06-16 18:00",
  },
  {
    id: "res_002",
    orderId: "ORD-01041",
    sku: "SKU-0005",
    product: "Smart Watch Series 5",
    warehouse: "Dhaka HQ",
    qty: 1,
    expiresAt: "2026-06-16 12:00",
  },
  {
    id: "res_003",
    orderId: "ORD-01040",
    sku: "SKU-0001",
    product: "Premium Cotton T-Shirt",
    warehouse: "Dhaka HQ",
    qty: 3,
    expiresAt: "2026-06-17 09:00",
  },
  {
    id: "res_004",
    orderId: "ORD-01038",
    sku: "SKU-0004",
    product: "Running Shoes Ultra",
    warehouse: "Dhaka HQ",
    qty: 1,
    expiresAt: "2026-06-15 20:00",
  },
];

export const lowStockAlerts = stockItemsSeed.filter(
  (s) => s.status === "low_stock" || s.status === "out_of_stock",
);

export const expiringBatches = [
  { lot: "LOT-2026-041", product: "Organic Face Serum", expiry: "2026-07-15", qty: 24 },
  { lot: "LOT-2026-038", product: "Scented Candle Pack", expiry: "2026-08-01", qty: 48 },
];

export const aiForecastHighlights = [
  { title: "Reorder suggested", body: "Wireless Earbuds Pro — PO draft for 50 units ready" },
  { title: "Slow mover", body: "Bluetooth Speaker Mini overstock at Chittagong (+180% vs max)" },
  { title: "Incoming stock", body: "USB-C Hub 24 units arriving Jun 17 from supplier" },
];

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
  overstock: "Overstock",
};

export function formatBdt(amount: number) {
  return `৳${amount.toLocaleString("en-BD")}`;
}
