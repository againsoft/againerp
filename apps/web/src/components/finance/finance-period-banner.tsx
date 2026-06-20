"use client";

import { CalendarDays } from "lucide-react";
import { FINANCE_PERIOD } from "@/lib/mock-data/finance";

export function FinancePeriodBanner() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
      <CalendarDays className="h-3.5 w-3.5 shrink-0" />
      <span className="font-medium">Accounting period:</span>
      <span>{FINANCE_PERIOD}</span>
    </div>
  );
}
