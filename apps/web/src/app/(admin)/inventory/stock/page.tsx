"use client";

import { Suspense } from "react";
import { Package } from "lucide-react";
import { StockManagement } from "@/components/inventory/stock-management";

function StockContent() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Inventory › Stock Management</p>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-600" />
            <h1 className="page-title">Stock Management</h1>
          </div>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
            Full SKU ledger — on-hand, reserved, available, incoming, FIFO valuation, and reorder thresholds across all warehouses.
          </p>
        </div>
      </div>
      <StockManagement />
    </div>
  );
}

export default function StockPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense fallback={<p className="flex flex-1 items-center text-sm text-muted-foreground">Loading…</p>}>
        <StockContent />
      </Suspense>
    </div>
  );
}
