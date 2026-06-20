"use client";

import { Suspense } from "react";
import { Warehouse } from "lucide-react";
import { WarehouseManager } from "@/components/inventory/warehouse-manager";

function WarehousesContent() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="page-subtitle">AgainERP › Inventory › Warehouses & Locations</p>
          <div className="flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-indigo-600" />
            <h1 className="page-title">Warehouses & Locations</h1>
          </div>
          <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
            Warehouse profiles, zone matrix, bin occupancy, and capacity planning — across all storage locations.
          </p>
        </div>
      </div>
      <WarehouseManager />
    </div>
  );
}

export default function WarehousesPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense fallback={<p className="flex flex-1 items-center text-sm text-muted-foreground">Loading…</p>}>
        <WarehousesContent />
      </Suspense>
    </div>
  );
}
