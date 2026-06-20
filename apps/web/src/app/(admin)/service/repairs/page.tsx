"use client";

import { Suspense } from "react";
import { ServiceRepairs } from "@/components/service/service-repairs";

export default function ServiceRepairsPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense fallback={<p className="flex flex-1 items-center text-sm text-muted-foreground">Loading repairs…</p>}>
        <ServiceRepairs />
      </Suspense>
    </div>
  );
}
