"use client";
import { use } from "react";
import { CustomerDetailWorkspace } from "@/components/customers/customer-detail-workspace";

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <div className="space-y-1">
      <p className="page-subtitle">AgainERP › Customers › Customer 360</p>
      <div className="pt-2">
        <CustomerDetailWorkspace customerId={id} />
      </div>
    </div>
  );
}
