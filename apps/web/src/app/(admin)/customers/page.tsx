"use client";
import { CustomersDashboard } from "@/components/customers/customers-dashboard";

export default function CustomersPage() {
  return (
    <div className="space-y-1">
      <p className="page-subtitle">AgainERP › Customers</p>
      <h1 className="page-title">Customer 360</h1>
      <div className="pt-2">
        <CustomersDashboard />
      </div>
    </div>
  );
}
