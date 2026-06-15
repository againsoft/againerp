"use client";
import { CustomerGrid } from "@/components/customers/customer-grid";

export default function AllCustomersPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col">
      <div className="mb-1 shrink-0">
        <p className="page-subtitle">AgainERP › Customers</p>
        <h1 className="page-title">All Customers</h1>
      </div>
      <CustomerGrid className="min-h-0 flex-1" />
    </div>
  );
}
