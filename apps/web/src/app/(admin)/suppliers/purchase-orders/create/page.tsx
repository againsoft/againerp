"use client";

import { SupplierPageShell } from "@/components/suppliers/supplier-page-shell";
import { PurchaseOrderForm } from "@/components/purchase/purchase-order-form";

export default function CreatePurchaseOrderPage() {
  return (
    <SupplierPageShell
      title="Create Purchase Order"
      subtitle="Add vendor, warehouse, and line items — save as draft or submit for approval."
    >
      <PurchaseOrderForm />
    </SupplierPageShell>
  );
}
