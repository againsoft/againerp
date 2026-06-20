"use client";

import { Suspense } from "react";
import { Percent } from "lucide-react";
import { TaxManagement } from "@/components/finance/tax-management";

function Content() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="shrink-0">
        <p className="page-subtitle">AgainERP › Finance › Tax</p>
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-indigo-600" />
          <h1 className="page-title">Tax Management</h1>
        </div>
        <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
          VAT rates, GL mappings, and period tax summary.
        </p>
      </div>
      <TaxManagement />
    </div>
  );
}

export default function TaxPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense fallback={<p className="flex flex-1 items-center text-sm text-muted-foreground">Loading…</p>}>
        <Content />
      </Suspense>
    </div>
  );
}
