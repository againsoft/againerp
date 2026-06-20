"use client";

import { Suspense } from "react";
import { ServiceAssets } from "@/components/service/service-assets";

export default function ServiceAssetsPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense fallback={<p className="flex flex-1 items-center text-sm text-muted-foreground">Loading assets…</p>}>
        <ServiceAssets />
      </Suspense>
    </div>
  );
}
