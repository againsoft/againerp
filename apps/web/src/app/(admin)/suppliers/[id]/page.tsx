"use client";

import { use } from "react";
import { SupplierDetailWorkspace } from "@/components/suppliers/supplier-detail-workspace";

export default function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="space-y-1">
      <p className="page-subtitle">AgainERP › Suppliers › Vendor</p>
      <div className="pt-2">
        <SupplierDetailWorkspace supplierId={id} />
      </div>
    </div>
  );
}
