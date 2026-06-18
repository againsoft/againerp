"use client";

import type { SmwCommission } from "@/lib/mock-data/smw-commissions";
import { computeCommissionMetrics, formatCommissionCurrency } from "@/lib/mock-data/smw-commissions";

type Props = { commissions: SmwCommission[] };

export function CommissionKpiStrip({ commissions }: Props) {
  const { pendingCount, pendingAmount, approvedAmount, paidMtd, pendingReps } =
    computeCommissionMetrics(commissions);

  return (
    <section aria-label="Commission KPIs" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <Kpi label="Pending" value={String(pendingCount)} />
      <Kpi label="Pending amount" value={formatCommissionCurrency(pendingAmount)} highlight={pendingAmount > 0} />
      <Kpi label="Approved (unpaid)" value={formatCommissionCurrency(approvedAmount)} />
      <Kpi label="Paid MTD" value={formatCommissionCurrency(paidMtd)} />
      <Kpi label="Reps awaiting payout" value={String(pendingReps)} />
    </section>
  );
}

function Kpi({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-input bg-card px-3 py-2.5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={highlight ? "text-lg font-semibold tabular-nums text-amber-700 dark:text-amber-300" : "text-lg font-semibold tabular-nums"}>
        {value}
      </p>
    </div>
  );
}
