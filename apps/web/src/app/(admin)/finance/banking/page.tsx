"use client";

import { Suspense } from "react";
import { Landmark } from "lucide-react";
import { Banking } from "@/components/finance/banking";

function Content() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="shrink-0">
        <p className="page-subtitle">AgainERP › Finance › Banking</p>
        <div className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-indigo-600" />
          <h1 className="page-title">Banking</h1>
        </div>
        <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
          Bank accounts, statement import, and GL reconciliation.
        </p>
      </div>
      <Banking />
    </div>
  );
}

export default function BankingPage() {
  return (
    <div className="flex min-h-[calc(100vh-2.75rem-1.5rem)] flex-1 flex-col lg:min-h-[calc(100vh-2.75rem-2rem)]">
      <Suspense fallback={<p className="flex flex-1 items-center text-sm text-muted-foreground">Loading…</p>}>
        <Content />
      </Suspense>
    </div>
  );
}
