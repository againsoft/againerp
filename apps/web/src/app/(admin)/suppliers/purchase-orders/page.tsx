"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SupplierPageShell } from "@/components/suppliers/supplier-page-shell";
import { PurchaseOrderGrid } from "@/components/purchase/purchase-order-grid";

function PurchaseOrdersContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "all";

  return (
    <PurchaseOrderGrid className="min-h-0 flex-1" initialStatus={status} />
  );
}

export default function PurchaseOrdersPage() {
  return (
    <SupplierPageShell
      title="Purchase Orders"
      subtitle="Create, approve, and track purchase orders — procure-to-pay workflow (prototype)."
    >
      <Suspense
        fallback={<div className="min-h-0 flex-1 rounded-lg border border-input bg-muted/20" />}
      >
        <PurchaseOrdersContent />
      </Suspense>
    </SupplierPageShell>
  );
}
