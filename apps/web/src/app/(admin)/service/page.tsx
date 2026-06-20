"use client";

import { ServiceDashboard } from "@/components/service/service-dashboard";

export default function ServiceDashboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <div className="mb-1 shrink-0">
        <p className="page-subtitle">AgainERP › Service</p>
        <h1 className="page-title">Service Operations</h1>
        <p className="mt-1 max-w-3xl text-xs text-muted-foreground">
          Orders, dispatch, field technicians, AMC contracts, and mixed product + service billing.
        </p>
      </div>
      <ServiceDashboard />
    </div>
  );
}
