"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatJournalAmount } from "@/lib/mock-data/accounting-journal";
import { formatBdt } from "@/lib/mock-data/inventory";
import { useAccountingJournalStore } from "@/lib/store/accounting-journal-store";
import { useInventoryStore } from "@/lib/store/inventory-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Props = {
  workOrderId: string;
  className?: string;
};

function movementTypeLabel(type: string): string {
  switch (type) {
    case "stock_in":
      return "Stock in";
    case "stock_out":
      return "Stock out";
    case "reserve":
      return "Reserve";
    case "unreserve":
      return "Unreserve";
    default:
      return type;
  }
}

function movementVariant(type: string): "default" | "secondary" | "success" | "warning" | "muted" | "outline" {
  switch (type) {
    case "stock_in":
      return "success";
    case "stock_out":
      return "warning";
    case "reserve":
      return "secondary";
    default:
      return "muted";
  }
}

export function WorkOrderIntegrationPanel({ workOrderId, className }: Props) {
  const allMovements = useInventoryStore((s) => s.movements);
  const allJournals = useAccountingJournalStore((s) => s.entries);
  const movements = useMemo(
    () =>
      allMovements.filter(
        (m) => m.referenceType === "work_order" && m.referenceId === workOrderId,
      ),
    [allMovements, workOrderId],
  );
  const journals = useMemo(
    () =>
      allJournals.filter(
        (e) => e.referenceType === "work_order" && e.referenceId === workOrderId,
      ),
    [allJournals, workOrderId],
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-lg border border-input bg-card p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Inventory + Accounting hookup (P7)</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            Release → <code className="text-foreground">inventory.reserve.posted</code>
          </li>
          <li>
            Issue → <code className="text-foreground">inventory.stock_out.posted</code> + Dr WIP /
            Cr Raw materials
          </li>
          <li>
            Record output → <code className="text-foreground">inventory.stock_in.posted</code> + Dr
            FG / Cr WIP
          </li>
          <li>
            Complete WO → final FG receipt if remaining qty
          </li>
        </ul>
        <p className="mt-2">
          Stock updates flow to{" "}
          <Link href="/inventory" className="text-primary underline-offset-2 hover:underline">
            Inventory
          </Link>{" "}
          (live mock store).
        </p>
      </div>

      <section>
        <h4 className="mb-2 text-xs font-medium text-foreground">Inventory movements</h4>
        {movements.length === 0 ? (
          <p className="text-xs text-muted-foreground">No inventory postings for this WO yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-input">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-2 py-1.5 text-left font-medium">When</th>
                  <th className="px-2 py-1.5 text-left font-medium">Type</th>
                  <th className="px-2 py-1.5 text-left font-medium">SKU</th>
                  <th className="px-2 py-1.5 text-right font-medium">Qty</th>
                  <th className="px-2 py-1.5 text-left font-medium">Warehouse</th>
                  <th className="px-2 py-1.5 text-left font-medium">Event</th>
                </tr>
              </thead>
              <tbody>
                {[...movements].reverse().map((m) => (
                  <tr key={m.id} className="border-t border-input">
                    <td className="px-2 py-1.5 whitespace-nowrap text-muted-foreground">
                      {new Date(m.postedAt).toLocaleString()}
                    </td>
                    <td className="px-2 py-1.5">
                      <Badge variant={movementVariant(m.type)} className="text-[10px]">
                        {movementTypeLabel(m.type)}
                      </Badge>
                    </td>
                    <td className="px-2 py-1.5 font-mono">{m.sku}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{m.quantity}</td>
                    <td className="px-2 py-1.5">{m.warehouse}</td>
                    <td className="px-2 py-1.5 font-mono text-[10px]">{m.event}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h4 className="mb-2 text-xs font-medium text-foreground">Journal entries</h4>
        {journals.length === 0 ? (
          <p className="text-xs text-muted-foreground">No accounting entries for this WO yet.</p>
        ) : (
          <ul className="space-y-2">
            {[...journals].reverse().map((je) => (
              <li key={je.id} className="rounded-md border border-input px-2.5 py-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{je.number}</span>
                  <span className="text-muted-foreground">{je.date}</span>
                </div>
                <p className="mt-0.5 text-muted-foreground">{je.description}</p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">{je.event}</p>
                <ul className="mt-2 space-y-0.5 border-t border-input pt-2">
                  {je.lines.map((line) => (
                    <li key={line.id} className="flex justify-between gap-2 font-mono text-[10px]">
                      <span>
                        {line.accountCode} {line.accountName}
                      </span>
                      <span className="tabular-nums">
                        {line.debit > 0 ? `Dr ${formatJournalAmount(line.debit)}` : ""}
                        {line.credit > 0 ? `Cr ${formatJournalAmount(line.credit)}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-right text-[10px] text-muted-foreground">
                  Total {formatBdt(je.totalDebit)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
