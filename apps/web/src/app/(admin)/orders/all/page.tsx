"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OrderGrid } from "@/components/orders/order-grid";

function AllOrdersContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "all";

  return <OrderGrid className="min-h-0 flex-1" initialStatus={status} />;
}

export default function AllOrdersPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <div className="shrink-0 mb-1">
        <p className="page-subtitle">AgainERP › Orders</p>
        <h1 className="page-title">Orders</h1>
      </div>
      <Suspense fallback={<div className="min-h-0 flex-1 rounded-lg border border-input bg-muted/20" />}>
        <AllOrdersContent />
      </Suspense>
    </div>
  );
}
