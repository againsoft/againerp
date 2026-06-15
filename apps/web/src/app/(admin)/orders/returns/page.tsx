"use client";

import { ReturnsGrid } from "@/components/orders/returns-grid";

export default function ReturnsPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <div className="shrink-0 mb-1">
        <p className="page-subtitle">AgainERP › Orders</p>
        <h1 className="page-title">Returns</h1>
      </div>
      <ReturnsGrid className="min-h-0 flex-1" />
    </div>
  );
}
