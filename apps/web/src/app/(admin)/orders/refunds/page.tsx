"use client";

import { RefundsGrid } from "@/components/orders/refunds-grid";

export default function RefundsPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <div className="shrink-0 mb-1">
        <p className="page-subtitle">AgainERP › Orders</p>
        <h1 className="page-title">Refunds</h1>
      </div>
      <RefundsGrid className="min-h-0 flex-1" />
    </div>
  );
}
