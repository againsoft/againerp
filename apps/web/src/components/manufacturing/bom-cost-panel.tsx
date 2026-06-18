"use client";

import Link from "next/link";
import {
  MANUFACTURING_OVERHEAD_PCT,
  STANDARD_COST_BATCH_SIZE,
  type ProductCostEstimate,
} from "@/lib/mock-data/manufacturing-cost";
import { formatCurrency } from "@/lib/utils";

type Props = {
  estimate: ProductCostEstimate;
  showBatchNote?: boolean;
};

export function BomCostPanel({ estimate, showBatchNote = true }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Material / unit", value: estimate.materialCostPerUnit },
          { label: "Labor / unit", value: estimate.laborCostPerUnit },
          {
            label: `Overhead (${MANUFACTURING_OVERHEAD_PCT}%)`,
            value: estimate.overheadCostPerUnit,
          },
          { label: "Standard cost / unit", value: estimate.totalCostPerUnit, highlight: true },
        ].map((item) => (
          <div
            key={item.label}
            className={
              item.highlight
                ? "rounded-lg border border-primary/30 bg-primary/5 px-3 py-2"
                : "rounded-lg border border-input px-3 py-2"
            }
          >
            <p className="text-[10px] text-muted-foreground">{item.label}</p>
            <p className="text-sm font-semibold tabular-nums">{formatCurrency(item.value)}</p>
          </div>
        ))}
      </div>

      {estimate.catalogPrice != null && estimate.marginPct != null && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-input bg-muted/30 px-3 py-2 text-xs">
          <span>
            <span className="text-muted-foreground">Catalog price </span>
            <span className="font-semibold">{formatCurrency(estimate.catalogPrice)}</span>
          </span>
          <span>
            <span className="text-muted-foreground">Gross margin </span>
            <span
              className={
                estimate.marginPct >= 30
                  ? "font-semibold text-emerald-700 dark:text-emerald-400"
                  : "font-semibold text-amber-700 dark:text-amber-400"
              }
            >
              {estimate.marginPct}%
            </span>
          </span>
        </div>
      )}

      {showBatchNote && (
        <p className="text-[11px] text-muted-foreground">
          Labor setup time amortized over batch of {estimate.batchSize} units
          {estimate.routingNumber ? (
            <>
              {" "}
              · Routing{" "}
              <Link
                href={`/manufacturing/routings?view=${estimate.routingId}`}
                className="text-primary hover:underline"
              >
                {estimate.routingNumber}
              </Link>
            </>
          ) : (
            " · No active routing — labor cost is 0"
          )}
          . Material costs from mock inventory standard costs.
        </p>
      )}

      <div>
        <p className="mb-2 text-xs font-semibold">Material breakdown</p>
        <div className="overflow-x-auto rounded-lg border border-input">
          <table className="w-full min-w-[560px] text-xs">
            <thead className="border-b bg-muted/40 text-left text-[11px] text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Component</th>
                <th className="px-3 py-2 font-medium text-right">Qty</th>
                <th className="px-3 py-2 font-medium text-right">Unit cost</th>
                <th className="px-3 py-2 font-medium text-right">Line cost</th>
                <th className="px-3 py-2 font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {estimate.materialLines.map((row) => (
                <tr key={row.line.id} className="border-b last:border-0">
                  <td className="px-3 py-2">
                    <p className="font-medium">{row.line.name}</p>
                    <p className="text-[10px] text-muted-foreground">{row.line.sku}</p>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {row.line.quantity} {row.line.uom}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatCurrency(row.unitCost)}
                  </td>
                  <td className="px-3 py-2 text-right font-medium tabular-nums">
                    {formatCurrency(row.lineCostPerFg)}
                  </td>
                  <td className="px-3 py-2 capitalize text-muted-foreground">
                    {row.source.replace(/_/g, " ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {estimate.laborLines.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold">Labor breakdown (routing)</p>
          <div className="overflow-x-auto rounded-lg border border-input">
            <table className="w-full min-w-[560px] text-xs">
              <thead className="border-b bg-muted/40 text-left text-[11px] text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Operation</th>
                  <th className="px-3 py-2 font-medium">Work center</th>
                  <th className="px-3 py-2 font-medium text-right">Rate/hr</th>
                  <th className="px-3 py-2 font-medium text-right">Cost / unit</th>
                </tr>
              </thead>
              <tbody>
                {estimate.laborLines.map((row) => (
                  <tr key={row.sequence} className="border-b last:border-0">
                    <td className="px-3 py-2 font-medium">
                      {row.sequence}. {row.name}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{row.workCenterCode}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatCurrency(row.ratePerHour)}
                    </td>
                    <td className="px-3 py-2 text-right font-medium tabular-nums">
                      {formatCurrency(row.costPerUnit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-dashed border-input px-3 py-2 text-[11px] text-muted-foreground">
        <strong className="text-foreground">Formula (prototype):</strong> Material = Σ(qty ×
        component cost) · Labor = Σ(run time × WC rate + setup ÷ batch) · Overhead ={" "}
        {MANUFACTURING_OVERHEAD_PCT}% · Actual cost at WO close uses real issue qty + timesheet
        (future).
      </div>
    </div>
  );
}

export { STANDARD_COST_BATCH_SIZE };
