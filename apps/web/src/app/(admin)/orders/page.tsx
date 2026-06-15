"use client";

import { Suspense } from "react";
import { OrdersDashboard } from "@/components/orders/orders-dashboard";

export default function OrdersDashboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <div className="shrink-0 mb-3">
        <p className="page-subtitle">AgainERP › Orders</p>
        <h1 className="page-title">Orders Dashboard</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Real-time operational overview · warehouse · delivery · support
        </p>
      </div>
      <Suspense fallback={null}>
        <OrdersDashboard />
      </Suspense>
    </div>
  );
}
