"use client";

import { Suspense } from "react";
import { ServiceWorkOrders } from "@/components/service/service-work-orders";

export default function ServiceWorkOrdersPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense fallback={<p className="flex flex-1 items-center text-sm text-muted-foreground">Loading work orders…</p>}>
        <ServiceWorkOrders />
      </Suspense>
    </div>
  );
}
