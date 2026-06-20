"use client";

import { Suspense } from "react";
import { ServiceSchedule } from "@/components/service/service-schedule";

export default function ServiceSchedulePage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense fallback={<p className="flex flex-1 items-center text-sm text-muted-foreground">Loading schedule…</p>}>
        <ServiceSchedule />
      </Suspense>
    </div>
  );
}
