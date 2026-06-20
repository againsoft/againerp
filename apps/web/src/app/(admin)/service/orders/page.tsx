"use client";

import { Suspense } from "react";
import { ServiceOrders } from "@/components/service/service-orders";

export default function ServiceOrdersPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense fallback={<p className="flex flex-1 items-center text-sm text-muted-foreground">Loading orders…</p>}>
        <ServiceOrders />
      </Suspense>
    </div>
  );
}
