"use client";

import { BillFromPoRedirect } from "@/components/purchase/bill-from-po-redirect";

export default function CreateBillPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <div className="mb-1 shrink-0">
        <p className="page-subtitle">AgainERP › Suppliers › Vendor Bills › Create</p>
      </div>
      <BillFromPoRedirect />
    </div>
  );
}
